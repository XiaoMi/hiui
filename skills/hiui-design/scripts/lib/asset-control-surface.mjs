import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { loadAdapterRegistry } from './adapter-registry.mjs'
import { loadPageMoldRegistry } from './page-mold-registry.mjs'
import {
  findPageComponent,
  isPageComponentCertificationValid,
  isPageComponentCertified,
  loadPageComponentCertification,
  loadPageComponentRegistry,
  supportedModesForPageComponent,
} from './page-component-registry.mjs'
import { detectLegacyHostFamily } from './legacy-host-family-registry.mjs'

const REGION_LABELS = {
  shell: '页面壳',
  header: '页头',
  'white-body': '白底主体',
  'query-filter': '查询区',
  toolbar: '表格工具栏',
  table: '数据表格',
  pagination: '分页区',
  'main-scroll': '主滚动容器',
}

const STRUCTURE_REGION_IDS = ['header', 'query-filter', 'toolbar', 'table', 'pagination']
const MACHINE_REGION_IDS = ['query-filter', 'table', 'pagination']

export function defaultSkillRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
}

export function parseCommonArgs(argv, { allowType = true, allowId = true } = {}) {
  const options = {
    target: process.cwd(),
    skillRoot: defaultSkillRoot(),
    type: '',
    id: '',
    json: false,
    dryRun: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }
    if (['--target', '--skill-root'].includes(arg) || (allowType && arg === '--type') || (allowId && arg === '--id')) {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--skill-root') options.skillRoot = path.resolve(value)
      if (arg === '--type') options.type = value
      if (arg === '--id') options.id = value
      index += 1
      continue
    }
    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }
    throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

export function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`)
}

export function writeError(error, { json = false, schemaVersion = 'hiui-asset-error.v1' } = {}) {
  const message = error instanceof Error ? error.message : String(error)
  if (json) {
    writeJson({ schemaVersion, status: 'invalid', error: message })
  } else {
    console.error(message)
  }
}

function readJsonIfExists(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

function relativeFrom(basePath, targetPath) {
  const relative = path.relative(basePath, targetPath)
  return relative || '.'
}

function readPackage(targetRoot) {
  return readJsonIfExists(path.join(targetRoot, 'package.json'))
}

function dependenciesFromPackage(pkg) {
  return {
    ...(pkg?.dependencies || {}),
    ...(pkg?.devDependencies || {}),
    ...(pkg?.peerDependencies || {}),
  }
}

function detectBusinessPageRoot(targetRoot) {
  const candidates = ['src/pages', 'src/views', 'src/routes']
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(targetRoot, candidate))) return candidate
  }
  return ''
}

function detectI18n(targetRoot) {
  const candidates = ['src/translation', 'src/i18n', 'src/locales']
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(targetRoot, candidate))) {
      return { mode: 'full', status: 'ready', source: candidate }
    }
  }
  return { mode: 'none', status: 'missing', source: '' }
}

function countManagedPages(targetRoot) {
  const contractsDir = path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'page-contracts')
  try {
    return fs.readdirSync(contractsDir).filter((name) => name.endsWith('.json')).length
  } catch {
    return 0
  }
}

function readModeFact(targetRoot) {
  const modePath = path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-mode.json')
  const mode = readJsonIfExists(modePath)
  if (mode?.mode || mode?.id || mode?.recommendedMode) {
    return {
      id: String(mode.mode || mode.id || mode.recommendedMode),
      locked: true,
      source: '.local-context/hiui-design/outputs/project-mode.json',
    }
  }
  return { id: 'unknown', locked: false, source: '' }
}

export function buildProjectCapabilities({ targetRoot, skillRoot, modeOverride = '' }) {
  const pkg = readPackage(targetRoot)
  const dependencies = dependenciesFromPackage(pkg)
  const localSkillRoot = path.join(targetRoot, '.local-context', 'hiui-design')
  const projectRootValid = Boolean(pkg && fs.existsSync(localSkillRoot))
  const pageRoot = detectBusinessPageRoot(targetRoot)
  const i18n = detectI18n(targetRoot)
  const moldRegistry = loadPageMoldRegistry({ skillRoot })
  const adapterRegistry = loadAdapterRegistry({ skillRoot })
  const pageComponentRegistry = loadPageComponentRegistry({ skillRoot, targetRoot })
  const legacyHostFamily = detectLegacyHostFamily({ targetRoot, skillRoot, modeOverride })
  const pageComponentMatrix = pageComponentRegistry.components.map((component) => {
    const certification = loadPageComponentCertification(component, { skillRoot })
    return {
      componentId: component.componentId,
      pageTypeId: component.pageTypeId,
      baseMoldId: component.baseMoldId,
      mode: component.mode,
      supportedModes: supportedModesForPageComponent(component),
      available: isPageComponentCertified(component, certification),
      status: component.status,
      certificationStatus: component.certificationStatus,
      certificationRef: component.certificationRef || '',
    }
  })
  const regions = Array.from(
    new Set(
      moldRegistry.molds.flatMap((mold) => (Array.isArray(mold.lockedRegions) ? mold.lockedRegions : []))
    )
  ).sort()

  const missingCapabilities = []
  if (!projectRootValid) {
    missingCapabilities.push({
      id: 'project-root',
      type: 'project-root',
      requiredFor: 'hiui-design page task',
      suggestedAction: 'run from a project root containing package.json and .local-context/hiui-design',
    })
  }
  if (!pageRoot) {
    missingCapabilities.push({
      id: 'business-page-root',
      type: 'routing',
      requiredFor: 'business page generation',
      suggestedAction: 'confirm host business route root before implementation',
    })
  }

  return {
    schemaVersion: 'hiui-project-capabilities.v1',
    projectRoot: relativeFrom(process.cwd(), targetRoot),
    projectRootValid,
    mode: readModeFact(targetRoot),
    versions: {
      react: dependencies.react || '',
      reactDom: dependencies['react-dom'] || '',
      hiui: dependencies['@hi-ui/hiui'] || '',
      hiui5: dependencies.hiui5 || '',
    },
    assets: {
      molds: moldRegistry.molds.map((mold) => mold.pageTypeId).filter(Boolean).sort(),
      adapters: adapterRegistry.adapters.map((adapter) => adapter.adapterId).filter(Boolean).sort(),
      pageComponents: pageComponentMatrix
        .filter((component) => component.available)
        .map((component) => component.componentId)
        .sort(),
      pageComponentMatrix,
      regions,
    },
    routing: {
      type: pageRoot ? 'host-business-route' : 'unknown',
      businessPageRoot: pageRoot,
      status: pageRoot ? 'detected' : 'missing',
    },
    i18n,
    managedPages: {
      count: countManagedPages(targetRoot),
      indexStatus: countManagedPages(targetRoot) > 0 ? 'ready' : 'empty',
    },
    governance: {
      contractStatus: countManagedPages(targetRoot) > 0 ? 'ready' : 'missing',
      snapshotStatus: 'unknown',
      governanceStatus: projectRootValid ? 'ready' : 'unknown',
    },
    legacyHostFamily,
    missingCapabilities,
  }
}

function loadPageTypes(skillRoot) {
  const registry = readJsonIfExists(path.join(skillRoot, 'rules', 'common.page-types.json'))
  return Array.isArray(registry?.pageTypes) ? registry.pageTypes : []
}

function pageTypeById(skillRoot) {
  return new Map(loadPageTypes(skillRoot).map((pageType) => [pageType.id, pageType]))
}

function normalizeMoldId(id) {
  const value = String(id || '').trim()
  return value.endsWith('.managed-mold.v1') ? value : `${value}.managed-mold.v1`
}

export function findMold(id, { skillRoot }) {
  const registry = loadPageMoldRegistry({ skillRoot })
  const value = String(id || '').trim()
  return registry.byPageType.get(value) || registry.byMoldId.get(value) || registry.byMoldId.get(normalizeMoldId(value)) || null
}

function labelForRegion(regionId) {
  return REGION_LABELS[regionId] || regionId
}

function slotLabels(mold) {
  if (Array.isArray(mold?.slotManifest) && mold.slotManifest.length > 0) {
    return mold.slotManifest.map((slot) => slot.label || slot.slotId).filter(Boolean)
  }
  return Array.isArray(mold?.editableSlots) ? mold.editableSlots : []
}

export function buildMoldCatalog({ skillRoot, targetRoot }) {
  const registry = loadPageMoldRegistry({ skillRoot })
  const pages = pageTypeById(skillRoot)
  return {
    schemaVersion: 'hiui-asset-catalog.v1',
    assetType: 'molds',
    target: relativeFrom(process.cwd(), targetRoot),
    items: registry.molds.map((mold) => {
      const pageType = pages.get(mold.pageTypeId) || {}
      const lockedRegions = Array.isArray(mold.lockedRegions) ? mold.lockedRegions : []
      return {
        id: mold.pageTypeId,
        moldId: mold.moldId,
        name: pageType.label || mold.pageTypeId,
        available: true,
        pageTypes: [mold.pageTypeId],
        requiredAdapters: Array.isArray(mold.requiredAdapters) ? mold.requiredAdapters : [],
        regions: lockedRegions.filter((region) => MACHINE_REGION_IDS.includes(region)),
        lockedRegions,
        editableSlots: Array.isArray(mold.editableSlots) ? mold.editableSlots : [],
        validationRules: ['region-ownership', 'route-ownership', 'preflight'],
        designPurpose: pageType.whenToUse || pageType.registrySummary || '',
      }
    }),
  }
}

export function buildAdapterCatalog({ skillRoot, targetRoot }) {
  const registry = loadAdapterRegistry({ skillRoot })
  return {
    schemaVersion: 'hiui-asset-catalog.v1',
    assetType: 'adapters',
    target: relativeFrom(process.cwd(), targetRoot),
    items: registry.adapters.map((adapter) => ({
      id: adapter.adapterId,
      name: adapter.label || adapter.adapterId,
      available: true,
      supportedModes: Array.isArray(adapter.supportedModes) ? adapter.supportedModes : [],
      allowedResponsibilities: Array.isArray(adapter.allowedResponsibilities) ? adapter.allowedResponsibilities : [],
      forbiddenResponsibilities: Array.isArray(adapter.forbiddenResponsibilities) ? adapter.forbiddenResponsibilities : [],
      allowedLocalBypassContainment: Array.isArray(adapter.allowedLocalBypassContainment)
        ? adapter.allowedLocalBypassContainment
        : [],
      validationRules: ['adapter-contract', 'source-gate', 'preflight'],
      designPurpose: adapter.label || '',
    })),
  }
}

export function buildPageComponentCatalog({ skillRoot, targetRoot }) {
  const registry = loadPageComponentRegistry({ skillRoot, targetRoot })
  return {
    schemaVersion: 'hiui-asset-catalog.v1',
    assetType: 'page-components',
    target: relativeFrom(process.cwd(), targetRoot),
    items: registry.components.map((component) => {
      const certification = loadPageComponentCertification(component, { skillRoot })
      const certificationAvailable = isPageComponentCertificationValid(component, certification)
      return {
        id: component.componentId,
        componentId: component.componentId,
        pageTypeId: component.pageTypeId,
        baseMoldId: component.baseMoldId,
        mode: component.mode,
        supportedModes: supportedModesForPageComponent(component),
        implementationKind: component.implementationKind,
        available: isPageComponentCertified(component, certification),
        status: component.status,
        certificationStatus: component.certificationStatus,
        certificationRef: component.certificationRef || '',
        certificationAvailable,
        fallbackPolicy: component.fallbackPolicy,
        adapterIds: Array.isArray(component.adapterIds) ? component.adapterIds : [],
        supportedExtensionLevels: Array.isArray(component.supportedExtensionLevels)
          ? component.supportedExtensionLevels
          : [],
      }
    }),
  }
}

export function findAdapter(id, { skillRoot }) {
  const registry = loadAdapterRegistry({ skillRoot })
  return registry.byId.get(String(id || '').trim()) || null
}

export function buildMoldInspection({ skillRoot, moldId }) {
  const mold = findMold(moldId, { skillRoot })
  if (!mold) throw new Error(`Unknown mold: ${moldId}`)
  const pageType = pageTypeById(skillRoot).get(mold.pageTypeId) || {}
  const lockedRegions = Array.isArray(mold.lockedRegions) ? mold.lockedRegions : []
  const structure = STRUCTURE_REGION_IDS.filter((region) => lockedRegions.includes(region)).map(labelForRegion)

  return {
    schemaVersion: 'hiui-asset-inspection.v1',
    assetType: 'mold',
    assetId: mold.pageTypeId,
    moldId: mold.moldId,
    designSummary: {
      pageType: pageType.label || mold.pageTypeId,
      suitableFor: pageType.whenToUse || pageType.registrySummary || '',
      structure,
      editableAreas: slotLabels(mold),
      lockedAreas: lockedRegions.map(labelForRegion),
      risks: [
        '不得改写页面壳、白底主体、表格承载结构或分页归属',
        '不得裸用 HiUI primitive 承担受管 shell / query-filter / table / pagination 职责',
        '不得把业务文案、mock 数据或 locale 词条写入全局模板',
      ],
    },
    machineRules: {
      requiredRegions: MACHINE_REGION_IDS.filter((region) => lockedRegions.includes(region)),
      lockedRegions,
      editableSlots: Array.isArray(mold.editableSlots) ? mold.editableSlots : [],
      requiredValidation: ['preflight', 'page-governance'],
    },
  }
}

export function buildAdapterInspection({ skillRoot, adapterId }) {
  const adapter = findAdapter(adapterId, { skillRoot })
  if (!adapter) throw new Error(`Unknown adapter: ${adapterId}`)

  return {
    schemaVersion: 'hiui-asset-inspection.v1',
    assetType: 'adapter',
    assetId: adapter.adapterId,
    designSummary: {
      name: adapter.label || adapter.adapterId,
      suitableFor: '在受管页面壳不被业务页重写的前提下，承接查询、表格、分页等业务槽位渲染职责',
      editableAreas: Array.isArray(adapter.allowedResponsibilities) ? adapter.allowedResponsibilities : [],
      lockedAreas: Array.isArray(adapter.forbiddenResponsibilities) ? adapter.forbiddenResponsibilities : [],
      risks: [
        'adapter 不得承接 shell、white-body、outer padding 或 main scroll owner 职责',
        'adapter local bypass 必须限制在允许的 containment 内，并保留 owner/expiry 证据',
        'adapter 只能作为受管页面能力补齐，不得绕过 page-task-plan requiredActions',
      ],
    },
    machineRules: {
      supportedModes: Array.isArray(adapter.supportedModes) ? adapter.supportedModes : [],
      allowedResponsibilities: Array.isArray(adapter.allowedResponsibilities) ? adapter.allowedResponsibilities : [],
      forbiddenResponsibilities: Array.isArray(adapter.forbiddenResponsibilities) ? adapter.forbiddenResponsibilities : [],
      allowedLocalBypassContainment: Array.isArray(adapter.allowedLocalBypassContainment)
        ? adapter.allowedLocalBypassContainment
        : [],
      requiredValidation: ['adapter-contract', 'source-gate', 'preflight'],
    },
  }
}

export function buildPageComponentInspection({ skillRoot, targetRoot, componentId }) {
  const component = findPageComponent(componentId, { skillRoot, targetRoot })
  if (!component) throw new Error(`Unknown page component: ${componentId}`)
  const mold = findMold(component.baseMoldId, { skillRoot })
  if (!mold) throw new Error(`Page component ${component.componentId} references unknown mold: ${component.baseMoldId}`)

  return {
    schemaVersion: 'hiui-asset-inspection.v1',
    assetType: 'page-component',
    assetId: component.componentId,
    componentId: component.componentId,
    pageTypeId: component.pageTypeId,
    baseMoldId: component.baseMoldId,
    mode: component.mode,
    supportedModes: supportedModesForPageComponent(component),
    designSummary: {
      purpose: '把 managed mold 的标准结构固化为当前接入模式下的页面级组件实现',
      structureSource: component.baseMoldId,
      editableAreas: Array.isArray(mold.editableSlots) ? mold.editableSlots : [],
      lockedAreas: Array.isArray(mold.lockedRegions) ? mold.lockedRegions : [],
      controlledExtensions: Array.isArray(component.allowedExtensions)
        ? component.allowedExtensions.map((extension) => extension.slotId)
        : [],
      risks: [
        'planned / candidate / expired / blocked component 不得作为业务页起点',
        '页面实例仍必须通过 slot、extension、business mapping、route owner 与 runtime render 校验',
        '组件不得重复维护 lockedRegions / editableSlots；结构事实必须继承 baseMoldId',
      ],
    },
    machineRules: {
      implementationKind: component.implementationKind,
      supportedModes: supportedModesForPageComponent(component),
      status: component.status,
      certificationStatus: component.certificationStatus,
      fallbackPolicy: component.fallbackPolicy,
      adapterIds: Array.isArray(component.adapterIds) ? component.adapterIds : [],
      supportedExtensionLevels: Array.isArray(component.supportedExtensionLevels)
        ? component.supportedExtensionLevels
        : [],
      allowedExtensions: Array.isArray(component.allowedExtensions) ? component.allowedExtensions : [],
      inheritedLockedRegions: Array.isArray(mold.lockedRegions) ? mold.lockedRegions : [],
      inheritedEditableSlots: Array.isArray(mold.editableSlots) ? mold.editableSlots : [],
      requiredValidation: ['component-certification', 'page-instance-validation', 'preflight'],
    },
  }
}

export function buildMoldAddPreview({ skillRoot, targetRoot, moldId, dryRun }) {
  if (!dryRun) throw new Error('add-asset currently requires --dry-run')
  const mold = findMold(moldId, { skillRoot })
  if (!mold) throw new Error(`Unknown mold: ${moldId}`)
  const templatePath = path.join('templates', 'archetypes', 'rules-only', mold.pageTypeId, 'page.template.tsx')
  const absoluteTemplatePath = path.join(skillRoot, templatePath)
  const templateExists = fs.existsSync(absoluteTemplatePath)

  return {
    schemaVersion: 'hiui-asset-add-preview.v1',
    status: 'preview',
    target: relativeFrom(process.cwd(), targetRoot),
    asset: {
      type: 'mold',
      id: mold.pageTypeId,
      moldId: mold.moldId,
    },
    sideEffects: {
      writesBusinessSource: false,
      overwritesExistingFiles: false,
      changesRoutes: false,
      changesGlobalTemplates: false,
    },
    plannedFiles: [
      {
        path: templatePath,
        action: templateExists ? 'already-exists' : 'would-create-template',
        risk: templateExists ? 'none' : 'low',
      },
    ],
    blockingReasons: [],
    requiredConfirmations: [],
    suggestedRequiredAction: {
      id: `add-asset.mold.${mold.pageTypeId}`,
      dryRunOnly: true,
    },
  }
}

export function buildAdapterAddPreview({ skillRoot, targetRoot, adapterId, dryRun }) {
  if (!dryRun) throw new Error('add-asset currently requires --dry-run')
  const adapter = findAdapter(adapterId, { skillRoot })
  if (!adapter) throw new Error(`Unknown adapter: ${adapterId}`)
  return {
    schemaVersion: 'hiui-asset-add-preview.v1',
    status: 'preview',
    target: relativeFrom(process.cwd(), targetRoot),
    asset: {
      type: 'adapter',
      id: adapter.adapterId,
    },
    sideEffects: {
      writesBusinessSource: false,
      overwritesExistingFiles: false,
      changesRoutes: false,
      changesGlobalTemplates: false,
    },
    plannedFiles: [
      {
        path: 'rules/adapter-registry.json',
        action: 'already-registered',
        risk: 'none',
      },
    ],
    blockingReasons: [],
    requiredConfirmations: [],
    suggestedRequiredAction: {
      id: `add-asset.adapter.${adapter.adapterId}`,
      dryRunOnly: true,
    },
  }
}

function assetRegistryPath(type) {
  if (type === 'mold') return 'rules/page-mold-registry.json'
  if (type === 'adapter') return 'rules/adapter-registry.json'
  return ''
}

function stableJsonDigest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

function fileDigest(filePath) {
  try {
    return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
  } catch {
    return ''
  }
}

function resolveAsset(type, id, { skillRoot }) {
  if (type === 'mold') {
    const mold = findMold(id, { skillRoot })
    if (!mold) throw new Error(`Unknown mold: ${id}`)
    return { type, id: mold.pageTypeId, moldId: mold.moldId, payload: mold }
  }
  if (type === 'adapter') {
    const adapter = findAdapter(id, { skillRoot })
    if (!adapter) throw new Error(`Unknown adapter: ${id}`)
    return { type, id: adapter.adapterId, payload: adapter }
  }
  throw new Error('asset diff/update first version only supports --type mold or --type adapter')
}

export function buildAssetDiff({ skillRoot, targetRoot, type, id }) {
  const resolvedAsset = resolveAsset(type, id, { skillRoot })
  const { payload, ...asset } = resolvedAsset
  const sourcePath = assetRegistryPath(type)
  return {
    schemaVersion: 'hiui-asset-diff.v1',
    target: relativeFrom(process.cwd(), targetRoot),
    asset,
    evidence: {
      sourcePath,
      sourceDigest: fileDigest(path.join(skillRoot, sourcePath)),
      assetDigest: stableJsonDigest(payload),
      comparison: 'registry-digest-only',
    },
    status: 'preview',
    riskLevel: 'low',
    changes: [
      {
        path: sourcePath,
        localModified: 'not_checked',
        upstreamChanged: 'not_checked',
        recommendation: 'dry-run only; compare sourceDigest and assetDigest against reviewed upstream evidence before applying any update',
      },
    ],
    blockingReasons: [],
  }
}

export function buildAssetUpdatePreview({ skillRoot, targetRoot, type, id, dryRun }) {
  if (!dryRun) throw new Error('update-asset currently requires --dry-run')
  return {
    ...buildAssetDiff({ skillRoot, targetRoot, type, id }),
    updatePreview: {
      dryRunOnly: true,
      writesBusinessSource: false,
      overwritesExistingFiles: false,
      changesRoutes: false,
      changesGlobalTemplates: false,
      forceSupported: false,
    },
  }
}
