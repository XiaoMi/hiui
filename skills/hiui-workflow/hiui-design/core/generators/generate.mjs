import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import {
  OFFICIAL_RUNTIME_REGISTRY_PATH,
  PAGEGEN_ROOT,
  REPO_ROOT,
  assert,
  assertPageDirectoryArg,
  assertOfficialRuntimeModeAllowed,
  assertStandardPagegenAllowed,
  ensureDir,
  isOfficialRuntimeModeAllowed,
  parseArgs,
  readJson,
  readOfficialRuntimeRegistry,
  readProjectModeLock,
  resolveOfficialRuntimePageIdForSchema,
  relativeToRoot,
  resolveFromRoot,
  writeJson,
} from './shared.mjs'
import {
  buildGenerationDecision,
  buildManagedPageMeta,
  resolvePreferredGenerationMode,
  resolveReferenceAssetTemplatePathForMode,
} from './asset-governance.mjs'
import { buildGenerationDeliveryStatus } from './delivery-status.mjs'
import {
  ANALYTICS_CHART_USAGE_CONTRACT_FILE,
  ANALYTICS_LAYOUT_PLAN_FILE,
  buildManagedAnalyticsArtifacts,
  buildManagedAnalyticsBlockedError,
  buildManagedAnalyticsKickoffFacts,
} from './managed-analytics-contracts.mjs'
import { verifyPageLite } from '../verify/verify-lite.mjs'

const COMMON_PAGE_TYPES_PATH = path.resolve(
  REPO_ROOT,
  '.local-context/hiui-design/rules/common.page-types.json'
)

const TREE_SPLIT_PATTERN = /(左树右表|tree[-\s]?split|左侧.*树.*右侧.*(列表|表格)|右侧.*(列表|表格).*左侧.*树|左右分栏.*树.*(列表|表格)|主从联动.*树.*(列表|表格))/i

const PAGE_TYPE_PATTERN_RULES = [
  {
    id: 'tree-split',
    label: '左树右表',
    pattern: TREE_SPLIT_PATTERN,
  },
  {
    id: 'tree-table',
    label: '树形表格',
    pattern: /(树形表格|树表|层级表格|组织架构表|类目表格)/i,
  },
  {
    id: 'data-visualization',
    label: '数据可视化',
    pattern: /(数据看板|可视化|图表看板|分析看板|趋势分析|经营看板)/i,
  },
  {
    id: 'table-stat',
    label: '数据统计表',
    pattern: /(数据统计表|统计列表|统计页|统计表|指标列表|指标卡.*表格|统计指标.*表格)/i,
  },
  {
    id: 'table-basic',
    label: '普通表格',
    pattern: /(列表页|列表|表格页|查询页|清单页|台账|管理列表|表格管理)/i,
  },
  {
    id: 'drawer-detail',
    label: '抽屉详情',
    pattern: /(抽屉详情|侧滑详情|侧边详情)/i,
  },
  {
    id: 'full-page-detail',
    label: '全页详情',
    pattern: /(详情页|详情信息页|详情查看页|查看.*详情页|只读详情|分组详情)/i,
  },
  {
    id: 'drawer-form',
    label: '抽屉表单',
    pattern: /(抽屉表单|侧滑表单|侧边表单|抽屉新建|抽屉编辑|侧滑新建|侧滑编辑)/i,
  },
  {
    id: 'full-page-edit',
    label: '全页编辑',
    pattern: /(编辑页|新建页|创建页|修改页|配置页|表单页|处理页|评审页|审核页|审批处理页)/i,
  },
  {
    id: 'feedback-status',
    label: '异常反馈页',
    pattern: /(异常反馈|无权限|无数据|加载失败|404|500|建设中|空状态)/i,
  },
]

function toPascalCase(pageType) {
  return String(pageType)
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

function renderTemplate(templateSource, replacements) {
  return Object.entries(replacements).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`__${key}__`, 'g'), String(value))
  }, templateSource)
}

function toImportPath(fromDir, targetFile) {
  const relative = path.relative(fromDir, targetFile).split(path.sep).join('/')
  const withoutExt = relative.replace(/\.[^.]+$/, '')
  return withoutExt.startsWith('.') ? withoutExt : `./${withoutExt}`
}

function buildMissingPagePathError() {
  return '缺少 --page。typical-page:generate 不负责猜业务页面落点；请明确目标页面目录，例如 src/views/<business-page>。若当前任务还没有稳定单页落点，请先运行 typical-page:plan-page-task 做诊断。'
}

function buildMissingPageTypeError() {
  return '缺少 --page-type。请显式提供 --page-type，或提供 --change 让 generate 只做轻量页型解析；若任务属于多页工作流、组合页或非典型布局，请改用 typical-page:plan-page-task。'
}

function buildMissingAnalyticsSchemaError(targetPagePath) {
  return `data-visualization 生成不再默认回退到 probe schema。请显式传入 --schema <business-schema.json>，或先在 ${targetPagePath}/page.schema.json 准备业务 schema 后再执行 typical-page:analytics。`
}

function buildMissingGovernedGenerationModeError({
  pageType,
  projectMode,
  projectType,
  requestedMode,
} = {}) {
  const contextLabel = `${projectMode || '(empty)'}:${projectType || 'any'}`

  if (requestedMode) {
    return `页型 ${pageType} 在 ${contextLabel} 场景下不支持 --mode ${requestedMode}；请检查 asset-governance/governance-registry.json 的 allowedModes / preferredGenerationModes，或补齐对应模板与运行时登记。`
  }

  return `页型 ${pageType} 在 ${contextLabel} 场景下没有可用的默认生成模式。当前链路不再隐式回退 canonical；请显式传入 --mode，或补齐 archetype 模板 / official runtime 登记 / 治理配置后再生成。`
}

function buildResolveBlockedError(resolveResult) {
  const blockers = Array.isArray(resolveResult?.blockingReasons)
    ? resolveResult.blockingReasons.filter(Boolean)
    : []
  const blockerText = blockers.length > 0 ? blockers.join('; ') : 'resolver returned blocked'
  return `generate page-type resolve blocked: ${blockerText}`
}

function readCommonPageTypeEntries() {
  if (!fs.existsSync(COMMON_PAGE_TYPES_PATH)) {
    return new Map()
  }

  const manifest = readJson(COMMON_PAGE_TYPES_PATH)
  return new Map(
    (Array.isArray(manifest?.pageTypes) ? manifest.pageTypes : []).map((pageType) => [
      pageType.id,
      pageType,
    ])
  )
}

function normalizeReferencePath(targetPath) {
  return String(targetPath || '')
    .trim()
    .split(path.sep)
    .join('/')
}

function sanitizeReferenceMarkerPath(targetPath) {
  return normalizeReferencePath(targetPath).replace(/^\.local-context\/hiui-design\//, '')
}

function resolveReferenceAsset({
  args = {},
  pageType,
  generationMode,
  assetDir,
  templateAssetSourcePath,
  canonicalComponentPath,
}) {
  const pageTypeEntry = readCommonPageTypeEntries().get(pageType)
  const explicitExamplePath = normalizeReferencePath(args['reference-example'])
  const explicitAssetExamplePath = normalizeReferencePath(args['reference-asset-example'])
  const templateAssetSource = relativeToRoot(templateAssetSourcePath || assetDir)
  const examplePath = explicitExamplePath || normalizeReferencePath(pageTypeEntry?.examplePath)
  const assetExamplePath =
    explicitAssetExamplePath || normalizeReferencePath(pageTypeEntry?.assetExamplePath)

  return {
    mode:
      pageTypeEntry || explicitExamplePath || explicitAssetExamplePath
        ? 'explicit-asset'
        : 'asset-dir-only',
    source:
      explicitExamplePath || explicitAssetExamplePath
        ? 'explicit-cli'
        : pageTypeEntry
          ? 'page-type-manifest'
          : 'asset-dir',
    pageTypeRegistrySource: pageTypeEntry ? relativeToRoot(COMMON_PAGE_TYPES_PATH) : '',
    shell: String(pageTypeEntry?.shell || '').trim(),
    generationStrategy: String(pageTypeEntry?.referenceSourceStrategy || '').trim(),
    examplePath,
    assetExamplePath,
    templateAssetSource,
    canonicalComponentPath:
      generationMode === 'canonical' ? normalizeReferencePath(canonicalComponentPath) : '',
  }
}

function hasNonTypicalPositiveEvidence(changeText) {
  return /(非典型|特殊布局|自定义.*工作台|自由编排|自由布局|无法套用典型|复杂工作台|多区块工作台|工作台.*多区块|工作台.*自由|运营工作台.*包含)/i.test(
    String(changeText || '')
  )
}

function hasTypicalOverlayEvidence(changeText) {
  const text = String(changeText || '')
  return (
    /(基础上|页面内|页内|详情页中|详情页内|列表页中|列表页内|嵌入|叠加|加上|增加|加入|新增|补充).{0,24}(图表|折线图|趋势|分析|详情|时间线|左侧|右侧|面板|分栏|区块|工作台)/i.test(text) ||
    /(图表|折线图|趋势|分析|详情|时间线|左侧|右侧|面板|分栏|区块|工作台).{0,24}(基础上|页面内|页内|详情页中|详情页内|列表页中|列表页内|嵌入|叠加|加上|增加|加入|新增|补充)/i.test(text)
  )
}

function hasInPageCompositeEvidence(changeText) {
  return /(一个页面内|同屏|左侧.*右侧|右侧.*左侧|主从|联动|split|左右分栏|左列表右详情|左树右表)/i.test(
    String(changeText || '')
  )
}

function hasTreeSplitBaselineEvidence(changeText) {
  return TREE_SPLIT_PATTERN.test(String(changeText || ''))
}

function hasParallelPageIntentEvidence(changeText) {
  const text = String(changeText || '')
  return (
    /(同时|并且|另外|另加|再加|以及|和|、).{0,24}(列表页|列表|表格页|统计页|看板页|详情页|详情|编辑页|表单页|评审页|审核页|异常页|空状态)/i.test(text) ||
    /(列表页|列表|表格页|统计页|看板页|详情页|详情|编辑页|表单页|评审页|审核页|异常页|空状态).{0,24}(同时|并且|另外|另加|再加|以及|和|、).{0,24}(列表页|列表|表格页|统计页|看板页|详情页|详情|编辑页|表单页|评审页|审核页|异常页|空状态)/i.test(text)
  )
}

function resolveSinglePageTypeFromChange(change) {
  const text = String(change || '').trim()
  const commonPageTypes = readCommonPageTypeEntries()
  const blockingReasons = []
  const treeSplitBaseline = hasTreeSplitBaselineEvidence(text)

  if (hasNonTypicalPositiveEvidence(text)) {
    blockingReasons.push('request contains explicit non-typical layout evidence; use typical-page:plan-page-task')
  } else if ((hasInPageCompositeEvidence(text) && !treeSplitBaseline) || hasTypicalOverlayEvidence(text)) {
    blockingReasons.push('request contains same-screen composite or overlay evidence; typical-page:generate only supports a single typical page')
  } else if (hasParallelPageIntentEvidence(text)) {
    blockingReasons.push('request appears to contain multiple page intents; typical-page:generate only supports a single typical page')
  }

  const matchedRule = PAGE_TYPE_PATTERN_RULES.find((rule) => rule.pattern.test(text))
  if (!matchedRule && blockingReasons.length === 0) {
    blockingReasons.push('cannot infer pageType from change; provide --page-type or run typical-page:plan-page-task')
  }

  if (!matchedRule || blockingReasons.length > 0) {
    return {
      schemaVersion: 'generate-page-type-resolve.v1',
      status: 'blocked',
      pageType: null,
      blockingReasons,
    }
  }

  const manifestEntry = commonPageTypes.get(matchedRule.id)
  return {
    schemaVersion: 'generate-page-type-resolve.v1',
    status: 'ready',
    pageType: {
      id: matchedRule.id,
      label: String(manifestEntry?.label || matchedRule.label || '').trim(),
      source: 'generate:lightweight-page-type-resolver',
    },
    blockingReasons: [],
  }
}

export async function resolveGenerateEntryArgs(args = {}) {
  const pageType = String(args['page-type'] || '').trim()
  const targetPagePath = String(args.page || '').trim()
  const change = String(args.change || args.prompt || '').trim()

  assert(targetPagePath, buildMissingPagePathError())
  assertPageDirectoryArg(targetPagePath, { flagName: '--page' })

  if (pageType) {
    return {
      pageType,
      targetPagePath,
      resolutionSource: 'explicit-cli',
      resolveResult: null,
    }
  }

  assert(
    change,
    buildMissingPageTypeError()
  )

  const resolveResult = resolveSinglePageTypeFromChange(change)

  assert(resolveResult.status === 'ready', buildResolveBlockedError(resolveResult))

  return {
    pageType: String(resolveResult.pageType?.id || '').trim(),
    targetPagePath,
    resolutionSource: 'generate:lightweight-page-type-resolver',
    resolveResult,
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  await runGenerate(args)
}

export async function runGenerate(args = {}, options = {}) {
  const commandName = String(options.commandName || 'typical-page:generate').trim() || 'typical-page:generate'
  assertStandardPagegenAllowed(commandName)
  const force = Boolean(args.force)
  const requestedMode = args.mode ? String(args.mode) : ''
  const projectModeLock = readProjectModeLock()
  const projectMode = projectModeLock?.mode || ''
  const resolvedEntry = await resolveGenerateEntryArgs(args)
  const pageType = resolvedEntry.pageType
  const targetPagePath = resolvedEntry.targetPagePath
  const targetDir = path.resolve(REPO_ROOT, targetPagePath)
  const pageTypeEntry = readCommonPageTypeEntries().get(pageType)
  const referenceAssetTemplatePath = resolveReferenceAssetTemplatePathForMode({
    projectMode,
    pageType,
  })

  assert(
    pageType,
    buildMissingPageTypeError()
  )
  assert(
    targetPagePath,
    buildMissingPagePathError()
  )

  const officialRuntimeRegistry = readOfficialRuntimeRegistry()
  const officialRuntimeEntry = officialRuntimeRegistry[pageType]
  const governancePreferredMode =
    !requestedMode
      ? resolvePreferredGenerationMode({
          pageType,
          projectMode,
          projectType: projectModeLock?.projectType,
          officialRuntimeAvailable: Boolean(officialRuntimeEntry),
          referenceAssetTemplateAvailable: Boolean(referenceAssetTemplatePath),
        })
      : ''
  const generationMode = requestedMode || governancePreferredMode
  assert(
    generationMode,
    buildMissingGovernedGenerationModeError({
      pageType,
      projectMode,
      projectType: projectModeLock?.projectType,
      requestedMode,
    })
  )

  const generationDecision = buildGenerationDecision({
    requestedMode,
    governancePreferredMode,
    finalMode: generationMode,
    projectMode,
    projectType: projectModeLock?.projectType,
  })

  assert(
    generationMode === 'canonical' ||
      generationMode === 'official-runtime' ||
      generationMode === 'reference-asset',
    `不支持的生成模式：${generationMode}`
  )

  if (generationMode === 'official-runtime') {
    assertOfficialRuntimeModeAllowed(commandName, projectModeLock)
    assert(
      officialRuntimeEntry,
      `页型 ${pageType} 尚未纳入官方 runtime 注册表：${relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH)}`
    )
  }

  if (generationMode === 'reference-asset') {
    assert(
      referenceAssetTemplatePath,
      `页型 ${pageType} 在 ${projectMode || '(empty)'} 模式下尚未提供 reference-asset 模板`
    )
  }

  const assetDir =
    generationMode === 'official-runtime'
      ? path.resolve(PAGEGEN_ROOT, 'runtime-families', 'official-runtime')
      : path.resolve(PAGEGEN_ROOT, 'page-assets', pageType)
  const recipePath = path.resolve(assetDir, 'recipe.json')
  assert(fs.existsSync(recipePath), `未找到页型模板：${pageType}`)

  const recipe = readJson(recipePath)
  const existingPageSchemaPath = path.resolve(targetDir, 'page.schema.json')
  const schemaPath = args.schema
    ? resolveFromRoot(args.schema)
    : pageType === 'data-visualization'
      ? fs.existsSync(existingPageSchemaPath)
        ? existingPageSchemaPath
        : ''
      : path.resolve(PAGEGEN_ROOT, 'recipes', 'probes', `${pageType}.schema.json`)
  if (pageType === 'data-visualization' && !schemaPath) {
    throw new Error(buildMissingAnalyticsSchemaError(targetPagePath))
  }
  assert(fs.existsSync(schemaPath), `未找到业务 schema：${relativeToRoot(schemaPath)}`)

  const schema = readJson(schemaPath)
  assert(
    schema.pageType === pageType,
    `schema.pageType=${schema.pageType} 与 --page-type=${pageType} 不一致`
  )
  const analyticsArtifacts = buildManagedAnalyticsArtifacts({
    pageType,
    targetPagePath,
    schema,
    changeText: String(args.change || args.prompt || '').trim(),
  })
  assert(
    !analyticsArtifacts || analyticsArtifacts.status === 'ready',
    buildManagedAnalyticsBlockedError(analyticsArtifacts)
  )
  const resolvedOfficialRuntimePageId =
    generationMode === 'official-runtime'
      ? resolveOfficialRuntimePageIdForSchema(pageType, officialRuntimeEntry, schema)
      : ''

  ensureDir(targetDir)
  const canonicalComponentName = `Canonical${toPascalCase(pageType)}Page`
  const canonicalComponentFilePath = path.resolve(
    REPO_ROOT,
    'src',
    'hiui-pagegen',
    'canonical',
    pageType,
    `${canonicalComponentName}.tsx`
  )
  const canonicalComponentImport =
    generationMode === 'canonical'
      ? toImportPath(
          targetDir,
          canonicalComponentFilePath
        )
      : ''

  const hostAdapterImport =
    generationMode === 'official-runtime' || generationMode === 'reference-asset'
      ? toImportPath(targetDir, path.resolve(REPO_ROOT, 'src/hiui-pagegen/host/useHostAdapter.ts'))
      : ''
  const translationImport =
    generationMode === 'reference-asset'
      ? toImportPath(targetDir, path.resolve(REPO_ROOT, 'src/translation/index.ts'))
      : ''
  const runtimeEntryImport =
    generationMode === 'official-runtime'
      ? toImportPath(
          targetDir,
          path.resolve(REPO_ROOT, 'src/hiui-pagegen/runtime-entry/OfficialRuntimeEntryPage.tsx')
        )
      : ''
  const referenceAsset = resolveReferenceAsset({
    args,
    pageType,
    generationMode,
    assetDir,
    templateAssetSourcePath:
      generationMode === 'reference-asset' ? referenceAssetTemplatePath : assetDir,
    canonicalComponentPath: relativeToRoot(canonicalComponentFilePath),
  })

  const templateReplacements = {
    PAGE_TYPE: pageType,
    PAGE_COMPONENT: toPascalCase(pageType),
    GENERATION_MODE: generationMode,
    OFFICIAL_RUNTIME_PAGE_ID: officialRuntimeEntry?.pageId || '',
    OFFICIAL_RUNTIME_TITLE: officialRuntimeEntry?.title || '',
    HOST_ADAPTER_IMPORT: hostAdapterImport,
    TRANSLATION_IMPORT: translationImport,
    RUNTIME_ENTRY_IMPORT: runtimeEntryImport,
    CANONICAL_COMPONENT_IMPORT: canonicalComponentImport,
    REFERENCE_ASSET_MODE: referenceAsset.mode,
    REFERENCE_ASSET_SOURCE: referenceAsset.source,
    REFERENCE_SOURCE_STRATEGY: referenceAsset.generationStrategy,
    REFERENCE_PAGE_TYPE_REGISTRY: sanitizeReferenceMarkerPath(referenceAsset.pageTypeRegistrySource),
    REFERENCE_EXAMPLE_PATH: referenceAsset.examplePath,
    REFERENCE_ASSET_EXAMPLE_PATH: referenceAsset.assetExamplePath,
    REFERENCE_SHELL: referenceAsset.shell,
    REFERENCE_TEMPLATE_ASSET_SOURCE: sanitizeReferenceMarkerPath(
      referenceAsset.templateAssetSource
    ),
    REFERENCE_CANONICAL_COMPONENT_PATH: referenceAsset.canonicalComponentPath,
  }

  Object.entries(recipe.templateFiles).forEach(([sourceName, outputName]) => {
    const templateFile =
      generationMode === 'reference-asset' && sourceName === 'index.tsx.tpl'
        ? referenceAssetTemplatePath
        : path.resolve(assetDir, sourceName)
    const outputFile = path.resolve(targetDir, outputName)
    if (fs.existsSync(outputFile) && !force) {
      throw new Error(`目标文件已存在，请使用 --force 覆盖：${relativeToRoot(outputFile)}`)
    }

    const templateSource = fs.readFileSync(templateFile, 'utf8')
    const renderedSource = renderTemplate(templateSource, templateReplacements)
    fs.writeFileSync(outputFile, renderedSource, 'utf8')
  })

  const schemaOutputPath = path.resolve(targetDir, recipe.schemaFile)
  if (fs.existsSync(schemaOutputPath) && !force) {
    throw new Error(`目标 schema 已存在，请使用 --force 覆盖：${relativeToRoot(schemaOutputPath)}`)
  }
  writeJson(schemaOutputPath, schema)

  const metaOutputPath = path.resolve(targetDir, recipe.metaFile)
  const generatedMeta = buildManagedPageMeta({
    generatedAt: new Date().toISOString(),
    pageType,
    assetSource:
      generationMode === 'reference-asset'
        ? relativeToRoot(referenceAssetTemplatePath)
        : relativeToRoot(assetDir),
    schemaSource: relativeToRoot(schemaPath),
    generator: 'hiui-pagegen',
    generationMode,
    referenceAsset,
    generationDecision,
    ...(generationMode === 'official-runtime' && officialRuntimeEntry
      ? {
          officialRuntime: {
            pageId: officialRuntimeEntry.pageId,
            resolvedPageId: resolvedOfficialRuntimePageId,
            title: officialRuntimeEntry.title,
            registrySource: relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH),
            subappRoot: 'subapps/typical-page-shell-runtime',
          },
        }
      : {}),
  })
  writeJson(metaOutputPath, generatedMeta)
  if (analyticsArtifacts) {
    writeJson(
      path.resolve(targetDir, ANALYTICS_CHART_USAGE_CONTRACT_FILE),
      analyticsArtifacts.chartUsageContract
    )
    writeJson(
      path.resolve(targetDir, ANALYTICS_LAYOUT_PLAN_FILE),
      analyticsArtifacts.analyticsLayoutPlan
    )
  }

  const verifyResult = verifyPageLite(targetPagePath)
  const deliveryStatus = buildGenerationDeliveryStatus({
    targetPagePath,
    verifyResult,
  })
  const outputsDir = path.resolve(PAGEGEN_ROOT, 'outputs')
  ensureDir(outputsDir)
  const safeName = targetPagePath.replace(/[\\/]/g, '__')
  const analyticsKickoffFacts = buildManagedAnalyticsKickoffFacts(analyticsArtifacts)
  writeJson(path.resolve(outputsDir, `generate-${safeName}.json`), {
    generatedAt: new Date().toISOString(),
    commandName,
    page: targetPagePath,
    pageType,
    generationMode,
    runtimeFamily: generatedMeta.runtimeFamily,
    ...(generatedMeta.generationStrategy
      ? {
          generationStrategy: generatedMeta.generationStrategy,
        }
      : {}),
    assetGovernance: generatedMeta.assetGovernance,
    resolutionSource: resolvedEntry.resolutionSource,
    deliveryContractVersion: deliveryStatus.deliveryContractVersion,
    deliveryState: deliveryStatus.deliveryState,
    deliveryReadiness: deliveryStatus.deliveryReadiness,
    analyticsArtifacts: analyticsArtifacts
      ? {
          status: analyticsArtifacts.status,
          requiredDocs: analyticsArtifacts.requiredDocs,
          layoutArchetype: analyticsArtifacts.layoutArchetype,
          layoutStrategy: analyticsArtifacts.layoutStrategy,
          kickoffFacts: analyticsKickoffFacts,
          chartUsageContractFile: `${targetPagePath}/${ANALYTICS_CHART_USAGE_CONTRACT_FILE}`,
          analyticsLayoutPlanFile: `${targetPagePath}/${ANALYTICS_LAYOUT_PLAN_FILE}`,
        }
      : null,
    referenceAsset,
    verifyResult,
  })

  console.log(`hiui-pagegen generate success: ${targetPagePath}`)
}

const isDirectExecution = (() => {
  if (!process.argv[1]) {
    return false
  }

  try {
    return fs.realpathSync(path.resolve(process.argv[1])) === fs.realpathSync(new URL(import.meta.url))
  } catch {
    return import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
  }
})()

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  })
}
