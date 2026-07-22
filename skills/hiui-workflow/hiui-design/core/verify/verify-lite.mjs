import assertStrict from 'node:assert/strict'
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
  parseArgs,
  readJson,
  readOfficialRuntimeRegistry,
  readProjectModeLock,
  resolveOfficialRuntimePageIdForSchema,
  relativeToRoot,
  writeJson,
} from '../generators/shared.mjs'
import {
  normalizeGenerationDecision,
  normalizeGenerationMode,
  resolveManagedGenerationStrategy,
  resolveManagedRuntimeFamily,
  resolveAssetGovernanceState,
  resolvePreferredGenerationMode,
  resolveReferenceAssetTemplatePathForMode,
} from '../generators/asset-governance.mjs'
import { verifyManagedAnalyticsContract } from './managed-analytics-contract.mjs'

const COMMON_PAGE_TYPES_PATH = path.resolve(
  REPO_ROOT,
  '.local-context/hiui-design/rules/common.page-types.json'
)

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

function hasManagedTemplateMarker(sourceCode) {
  return (
    sourceCode.includes('data-hiui-pagegen-template=') ||
    sourceCode.includes('hiui-pagegen template marker:')
  )
}

function stripScssCommentsAndWhitespace(sourceCode) {
  return String(sourceCode || '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, '')
}

function normalizeReferencePath(targetPath) {
  return String(targetPath || '')
    .trim()
    .split(path.sep)
    .join('/')
}

function normalizeOptionalString(value) {
  const normalized = String(value || '').trim()
  return normalized ? normalized : ''
}

function resolveInstalledReferenceExamplePath(targetPath) {
  const normalizedPath = normalizeReferencePath(targetPath)

  if (!normalizedPath.startsWith('examples/host-integration/src/')) {
    return ''
  }

  return normalizedPath.replace(
    /^examples\/host-integration\/src\//,
    '.local-context/hiui-design/reference/host-integration/src/'
  )
}

function resolveStrictParityExampleFile({ meta, pageTypeEntry, pageType }) {
  const candidatePaths = [
    meta.referenceAsset?.examplePath,
    resolveInstalledReferenceExamplePath(meta.referenceAsset?.assetExamplePath),
    meta.referenceAsset?.assetExamplePath,
    resolveInstalledReferenceExamplePath(pageTypeEntry?.assetExamplePath),
    pageTypeEntry?.assetExamplePath,
    pageTypeEntry?.examplePath,
  ]
    .map((targetPath) => normalizeReferencePath(targetPath))
    .filter(Boolean)

  const uniqueCandidatePaths = Array.from(new Set(candidatePaths))
  const resolvedRecord = uniqueCandidatePaths
    .map((candidatePath) => ({
      examplePath: candidatePath,
      exampleFile: path.resolve(REPO_ROOT, candidatePath),
    }))
    .find((record) => fs.existsSync(record.exampleFile))

  assert(uniqueCandidatePaths.length > 0, `${pageType} 缺少 strict parity examplePath`)
  assert(
    resolvedRecord,
    `${pageType} strict parity example 不存在：${uniqueCandidatePaths.join(' / ')}`
  )

  return resolvedRecord
}

function assertReferenceAssetStrictParity({ meta, schema, sourceCode, styleSource }) {
  const pageTypeEntry = readCommonPageTypeEntries().get(schema.pageType)
  const generationStrategy = String(
    meta.referenceAsset?.generationStrategy || pageTypeEntry?.referenceSourceStrategy || ''
  ).trim()

  if (generationStrategy !== 'copy-example-source-replace-business-slots') {
    return
  }

  const { exampleFile } = resolveStrictParityExampleFile({
    meta,
    pageTypeEntry,
    pageType: schema.pageType,
  })

  const exampleSource = fs.readFileSync(exampleFile, 'utf8')
  const exampleUsesLocalStyleModule = /from '\.\/[^']*module\.scss'/.test(exampleSource)
  const generatedUsesLocalStyleModule = /from '\.\/[^']*module\.scss'/.test(sourceCode)

  assert(
    generatedUsesLocalStyleModule === exampleUsesLocalStyleModule,
    `${schema.pageType} reference-asset 已启用 strict parity：本地 style module 使用方式必须与 example 源码一致`
  )

  if (!exampleUsesLocalStyleModule) {
    assert(
      !sourceCode.includes('className={styles.pageRoot}'),
      `${schema.pageType} reference-asset strict parity 不允许额外 pageRoot wrapper；请直接复制 example 源码结构后再替换业务槽位`
    )
    assert(
      stripScssCommentsAndWhitespace(styleSource) === '',
      `${schema.pageType} reference-asset strict parity 不允许新增本地几何样式覆写；example 源码未使用 module.scss`
    )
  }
}

function resolveCanonicalWrapper(schema, sourceCode) {
  const parityPath = path.resolve(PAGEGEN_ROOT, 'parity', `${schema.pageType}.json`)
  if (!fs.existsSync(parityPath)) {
    return null
  }

  const parity = readJson(parityPath)
  if (!parity.canonicalSource?.path) {
    return null
  }

  const canonicalFile = path.resolve(REPO_ROOT, parity.canonicalSource.path)
  const canonicalName = path.basename(canonicalFile, path.extname(canonicalFile))
  if (!sourceCode.includes(canonicalName)) {
    return null
  }

  return {
    filePath: canonicalFile,
    name: canonicalName,
    pageType: schema.pageType,
  }
}

function resolveCurrentPreferredGenerationMode(schema, projectModeLock) {
  return resolvePreferredGenerationMode({
    pageType: schema.pageType,
    projectMode: projectModeLock?.mode,
    projectType: projectModeLock?.projectType,
    officialRuntimeAvailable: Boolean(readOfficialRuntimeRegistry()[schema.pageType]),
    referenceAssetTemplateAvailable: Boolean(
      resolveReferenceAssetTemplatePathForMode({
        projectMode: projectModeLock?.mode,
        pageType: schema.pageType,
      })
    ),
  })
}

function assertMetaField(actual, expected, fieldPath) {
  if (Array.isArray(expected) || (expected && typeof expected === 'object')) {
    assertStrict.deepEqual(
      actual,
      expected,
      `${fieldPath}=${JSON.stringify(actual)} 与期望值 ${JSON.stringify(expected)} 不一致`
    )
    return
  }

  assert(actual === expected, `${fieldPath}=${actual ?? ''} 与期望值 ${expected ?? ''} 不一致`)
}

function resolveDeliveryShape({ generationMode, sourceCode, canonicalWrapper, assetGovernance }) {
  if (generationMode === 'official-runtime' || sourceCode.includes('OfficialRuntimeEntryPage')) {
    return {
      deliveryShape: 'runtime-entry',
      deliveryShapeReason:
        generationMode === 'official-runtime'
          ? 'meta.generatorMode=official-runtime'
          : 'source-uses-official-runtime-entry-wrapper',
    }
  }

  if (canonicalWrapper) {
    return {
      deliveryShape:
        String(assetGovernance?.assetMode || '').trim() === 'official-mirror'
          ? 'canonical-compat-page'
          : 'managed-result-page',
      deliveryShapeReason: `source-wraps-${canonicalWrapper.name}`,
    }
  }

  if (hasManagedTemplateMarker(sourceCode)) {
    return {
      deliveryShape:
        generationMode === 'reference-asset' ? 'reference-asset-page' : 'managed-result-page',
      deliveryShapeReason:
        generationMode === 'reference-asset'
          ? 'source-contains-reference-asset-template-marker'
          : 'source-contains-managed-result-template-marker',
    }
  }

  return {
    deliveryShape: 'blocked',
    deliveryShapeReason: 'unable-to-classify-managed-page-shape',
  }
}

function validateManagedAssetMeta(meta, schema, projectModeLock) {
  const generationMode = normalizeGenerationMode(meta)
  const generationDecision = normalizeGenerationDecision(meta.generationDecision, generationMode)
  const expectedGovernance = resolveAssetGovernanceState({
    pageType: schema.pageType,
    generationMode,
    assetSource: meta.assetSource || '',
    referenceAsset: meta.referenceAsset,
    projectMode: projectModeLock?.mode,
    projectType: projectModeLock?.projectType,
  })
  const expectedRuntimeFamily = resolveManagedRuntimeFamily({
    generationMode,
    pageType: schema.pageType,
    assetGovernance: expectedGovernance,
  })
  const expectedGenerationStrategy = resolveManagedGenerationStrategy({
    pageType: schema.pageType,
    assetGovernance: expectedGovernance,
  })

  assertMetaField(meta.generatorMode, generationMode, 'meta.generatorMode')
  assertMetaField(meta.runtimeFamily, expectedRuntimeFamily, 'meta.runtimeFamily')
  if (meta.generationStrategy !== undefined || expectedGenerationStrategy) {
    assertMetaField(
      normalizeOptionalString(meta.generationStrategy),
      expectedGenerationStrategy,
      'meta.generationStrategy'
    )
  }
  assert(meta.assetGovernance && typeof meta.assetGovernance === 'object', '页面元数据缺少 assetGovernance')
  if (meta.generationDecision !== undefined) {
    assertMetaField(
      meta.generationDecision,
      generationDecision,
      'meta.generationDecision'
    )
  }

  Object.entries(expectedGovernance).forEach(([field, expectedValue]) => {
    assertMetaField(meta.assetGovernance[field], expectedValue, `meta.assetGovernance.${field}`)
  })

  const normalizedProjectMode = String(projectModeLock?.mode || '').trim()
  if (normalizedProjectMode === 'legacy-host-compatible' && generationMode === 'canonical') {
    assert(
      false,
      `${schema.pageType} 在 legacy-host-compatible 主链下不再接受 canonical 兼容交付；请改用标准结果资产 + legacy delivery plugin，或迁移到隔离的标准壳运行时`
    )
  }

  if (normalizedProjectMode && generationMode !== 'official-runtime') {
    assert(
      expectedGovernance.allowedModes.includes(normalizedProjectMode),
      `${schema.pageType} ${generationMode} 资产不允许在 ${normalizedProjectMode} 模式下落地；允许模式：${expectedGovernance.allowedModes.join(', ')}`
    )
  }

  if (expectedGovernance.assetMode === 'official-mirror') {
    const parityPath = path.resolve(PAGEGEN_ROOT, 'parity', `${schema.pageType}.json`)
    assert(fs.existsSync(parityPath), `official-mirror 资产缺少 parity manifest：${relativeToRoot(parityPath)}`)
    assert(
      expectedGovernance.standardsBaselineType !== 'local-canonical-proposal',
      `${schema.pageType} official-mirror 缺少官方 baseline，请补齐 parity manifest`
    )
    assert(
      expectedGovernance.parityContract === 'required',
      `${schema.pageType} official-mirror 必须声明 parityContract=required`
    )
    assert(
      expectedGovernance.driftWhitelistPolicy === 'zero-or-explicit-whitelist',
      `${schema.pageType} official-mirror 必须声明 driftWhitelistPolicy=zero-or-explicit-whitelist`
    )
  }

  if (expectedGovernance.assetMode === 'managed-fallback') {
    const officialRuntimeRegistry = readOfficialRuntimeRegistry()
    assert(
      !officialRuntimeRegistry[schema.pageType],
      `${schema.pageType} 已进入官方 runtime 注册表，不能继续声明为 managed-fallback`
    )
    assert(expectedGovernance.owner, `${schema.pageType} managed-fallback 缺少 owner`)
    assert(
      expectedGovernance.replacementTarget,
      `${schema.pageType} managed-fallback 缺少 replacementTarget`
    )
    assert(expectedGovernance.expiryPolicy, `${schema.pageType} managed-fallback 缺少 expiryPolicy`)
    assert(
      Array.isArray(expectedGovernance.entryCriteria) && expectedGovernance.entryCriteria.length > 0,
      `${schema.pageType} managed-fallback 缺少 entryCriteria`
    )
    assert(
      Array.isArray(expectedGovernance.exitCriteria) && expectedGovernance.exitCriteria.length > 0,
      `${schema.pageType} managed-fallback 缺少 exitCriteria`
    )
  }

  if (generationMode === 'canonical') {
    const preferredGenerationMode = resolveCurrentPreferredGenerationMode(schema, projectModeLock)
    const explicitCanonicalAllowed =
      generationDecision?.source === 'explicit-request' &&
      generationDecision?.finalMode === 'canonical'

    if (preferredGenerationMode && preferredGenerationMode !== 'canonical') {
      assert(
        explicitCanonicalAllowed,
        `${schema.pageType} 在 ${projectModeLock?.mode || '(empty)'}:${projectModeLock?.projectType || 'any'} 场景下应优先使用 ${preferredGenerationMode}；若确需 canonical，必须显式传入 --mode canonical，并保留 meta.generationDecision.source=explicit-request`
      )
    }
  }

  return {
    generationMode,
    assetGovernance: expectedGovernance,
    generationDecision,
  }
}

export function verifyPageLite(targetPagePath) {
  assertPageDirectoryArg(targetPagePath, { flagName: '--page' })
  const pageDir = path.resolve(REPO_ROOT, targetPagePath)
  const indexFile = path.resolve(pageDir, 'index.tsx')
  const styleFile = path.resolve(pageDir, 'index.module.scss')
  const schemaFile = path.resolve(pageDir, 'page.schema.json')
  const metaFile = path.resolve(pageDir, 'hiui-pagegen.meta.json')

  assert(fs.existsSync(indexFile), `缺少页面主文件：${relativeToRoot(indexFile)}`)
  assert(fs.existsSync(styleFile), `缺少样式文件：${relativeToRoot(styleFile)}`)
  assert(fs.existsSync(schemaFile), `缺少页面 schema：${relativeToRoot(schemaFile)}`)
  assert(fs.existsSync(metaFile), `缺少页面元数据：${relativeToRoot(metaFile)}`)

  const meta = readJson(metaFile)
  const schema = readJson(schemaFile)
  const sourceCode = fs.readFileSync(indexFile, 'utf8')
  const styleSource = fs.readFileSync(styleFile, 'utf8')
  const projectModeLock = readProjectModeLock()
  const managedAsset = validateManagedAssetMeta(meta, schema, projectModeLock)
  const isOfficialRuntimeMode = managedAsset.generationMode === 'official-runtime'
  const canonicalWrapper = resolveCanonicalWrapper(schema, sourceCode)
  const delivery = resolveDeliveryShape({
    generationMode: managedAsset.generationMode,
    sourceCode,
    canonicalWrapper,
    assetGovernance: managedAsset.assetGovernance,
  })
  let canonicalSource = ''

  assert(
    delivery.deliveryShape !== 'blocked',
    `无法识别页面交付形态：${delivery.deliveryShapeReason}`
  )

  if (managedAsset.generationMode === 'official-runtime') {
    assert(
      delivery.deliveryShape === 'runtime-entry',
      `页面元数据声明 generationMode=official-runtime，但实际交付形态是 ${delivery.deliveryShape}`
    )
  } else if (managedAsset.generationMode === 'reference-asset') {
    assert(
      delivery.deliveryShape === 'reference-asset-page',
      `页面元数据声明 generationMode=reference-asset，但实际交付形态是 ${delivery.deliveryShape}`
    )
  } else {
    const expectedDeliveryShape =
      managedAsset.assetGovernance.assetMode === 'official-mirror'
        ? 'canonical-compat-page'
        : 'managed-result-page'
    assert(
      delivery.deliveryShape === expectedDeliveryShape,
      `页面元数据声明 generationMode=canonical，但实际交付形态是 ${delivery.deliveryShape}；期望 ${expectedDeliveryShape}`
    )
  }

  if (isOfficialRuntimeMode) {
    assertOfficialRuntimeModeAllowed('typical-page:verify', projectModeLock)
    assert(hasManagedTemplateMarker(sourceCode), '页面未标记 hiui-pagegen 模板来源')
    assert(sourceCode.includes('OfficialRuntimeEntryPage'), '页面未接入 OfficialRuntimeEntryPage')
    assert(sourceCode.includes('useHostAdapter'), '页面未接入 HostAdapter')
    assert(meta.officialRuntime?.pageId, '页面元数据缺少 officialRuntime.pageId')

    const officialRuntimeRegistry = readOfficialRuntimeRegistry()
    const officialRuntimeEntry = officialRuntimeRegistry[schema.pageType]
    assert(
      officialRuntimeEntry,
      `页型 ${schema.pageType} 未在官方 runtime 注册表登记：${relativeToRoot(OFFICIAL_RUNTIME_REGISTRY_PATH)}`
    )
    assert(
      meta.officialRuntime.pageId === officialRuntimeEntry.pageId,
      `officialRuntime.pageId=${meta.officialRuntime.pageId} 与注册表 ${officialRuntimeEntry.pageId} 不一致`
    )
    const resolvedOfficialRuntimePageId = resolveOfficialRuntimePageIdForSchema(
      schema.pageType,
      officialRuntimeEntry,
      schema
    )
    assert(
      meta.officialRuntime.resolvedPageId === resolvedOfficialRuntimePageId,
      `officialRuntime.resolvedPageId=${meta.officialRuntime.resolvedPageId || ''} 与 schema 解析结果 ${resolvedOfficialRuntimePageId} 不一致`
    )
  } else if (canonicalWrapper) {
    assert(
      fs.existsSync(canonicalWrapper.filePath),
      `缺少 ${canonicalWrapper.pageType} canonical 资产：${relativeToRoot(canonicalWrapper.filePath)}`
    )
    canonicalSource = fs.readFileSync(canonicalWrapper.filePath, 'utf8')
    assert(
      hasManagedTemplateMarker(canonicalSource),
      `${canonicalWrapper.pageType} canonical 资产未标记 hiui-pagegen 模板来源`
    )
  } else {
    assert(hasManagedTemplateMarker(sourceCode), '页面未标记 hiui-pagegen 模板来源')
  }

  if (isOfficialRuntimeMode) {
    // HostAdapter usage is validated in the generated entry wrapper source.
  } else if (canonicalWrapper) {
    assert(
      canonicalSource.includes('useHostAdapter'),
      `${canonicalWrapper.pageType} canonical 资产未接入 HostAdapter`
    )
  } else {
    assert(sourceCode.includes('useHostAdapter'), '页面未接入 HostAdapter')
  }
  assert(!sourceCode.includes('.local-context/hiui-design'), '页面仍依赖旧 hiui-design 主链')
  assert(!sourceCode.includes('@/page-components/Project'), '页面仍依赖旧 carrier 资产')

  assert(schema.pageType, 'page.schema.json 缺少 pageType')
  assert(meta.pageType === schema.pageType, '元数据与页面 schema 的 pageType 不一致')

  if (managedAsset.generationMode === 'reference-asset') {
    assertReferenceAssetStrictParity({
      meta,
      schema,
      sourceCode,
      styleSource,
    })
  }

  const slotSchemaPath = path.resolve(
    PAGEGEN_ROOT,
    'page-assets',
    schema.pageType,
    'slots.schema.json'
  )
  assert(fs.existsSync(slotSchemaPath), `缺少页型槽位定义：${relativeToRoot(slotSchemaPath)}`)

  const slotSchema = readJson(slotSchemaPath)
  ;(slotSchema.requiredKeys || []).forEach((requiredKey) => {
    assert(schema[requiredKey] !== undefined, `page.schema.json 缺少必需字段：${requiredKey}`)
  })

  const allowedKeys = new Set(['pageType', ...(slotSchema.requiredKeys || []), ...(slotSchema.optionalKeys || [])])
  const unknownKeys = Object.keys(schema).filter((key) => !allowedKeys.has(key))
  assert(
    unknownKeys.length === 0,
    `page.schema.json 存在未声明字段：${unknownKeys.join(', ')}；请先更新 ${relativeToRoot(slotSchemaPath)}`
  )

  const managedAnalyticsContract =
    schema.pageType === 'data-visualization'
      ? verifyManagedAnalyticsContract({
          pageDir,
          targetPagePath,
        })
      : null

  return {
    page: targetPagePath,
    pageType: schema.pageType,
    deliveryShape: delivery.deliveryShape,
    deliveryShapeReason: delivery.deliveryShapeReason,
    managedAnalyticsContract,
    status: 'passed',
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const targetPagePath = args.page
  assert(targetPagePath, '请通过 --page 指定目标页面目录，不要传 index.tsx 文件路径')

  const result = verifyPageLite(targetPagePath)
  const outputsDir = path.resolve(PAGEGEN_ROOT, 'outputs')
  fs.mkdirSync(outputsDir, { recursive: true })

  const safeName = targetPagePath.replace(/[\\/]/g, '__')
  const outputPath = path.resolve(outputsDir, `verify-lite-${safeName}.json`)
  writeJson(outputPath, {
    verifiedAt: new Date().toISOString(),
    ...result,
  })

  console.log(`hiui-pagegen verify-lite passed: ${relativeToRoot(outputPath)}`)
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
  main()
}
