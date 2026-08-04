import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { loadPageTypeManifest } from './load-page-type-manifest.mjs'
import {
  computeManagedPageSourceSnapshot,
  syncManagedPageRegistry,
  writeManagedPageContractArtifacts,
} from './managed-page-artifacts.mjs'
import {
  buildRulesOnlyPageContract,
  getDefaultScrollStrategyForPageType,
  getRequiredOwnershipRolesForPageType,
  getRequiredRegionsForPageType,
  getRulesOnlyPageContractsDir,
  getManagedPageRuntimeSmokeDefaultStatus,
  normalizeContractPath,
  removeDuplicateManagedPageContractArtifacts,
  toContractSlug,
  validateRulesOnlyPageContract,
} from './rules-only-page-contracts.mjs'
import {
  getEditableSlotsForPageType,
  getLockedRegionsForPageType,
  getMoldIdForPageType,
  getSlotManifestForPageType,
} from './page-mold-registry.mjs'
import {
  PROJECT_INTEGRATION_STATE_RELATIVE_PATH,
  readProjectIntegrationState,
} from './project-integration-state.mjs'
import { RUNTIME_SEAL_RELATIVE_PATH, summarizeRuntimeSealHash } from './legacy-runtime-provenance.mjs'
import {
  RUNTIME_PROVIDER_CONTRACT_RELATIVE_PATH,
  getRuntimeProviderPageEntry,
  readRuntimeProviderContract,
} from './legacy-runtime-provider-policy.mjs'
import { autoRecordGeneratedPageUsage } from './auto-record-usage.mjs'
import { readLightPagePlan } from './light-page-plan.mjs'
import { assertWithinWriteScope } from './write-scope-gate.mjs'
import { checkChangeSize, summarizeChangeSize } from './change-size-gate.mjs'
import { runLightSlotGate } from './light-slot-gate.mjs'
import { reduceLightPageWorkflow } from './light-page-workflow-reducer.mjs'
import { getLightFlowFeatureFlags } from './light-flow-feature-flags.mjs'

const HOST_CONTRACT_RELATIVE_PATH = '.local-context/hiui-design/host-contract.json'
const RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH = '.local-context/hiui-design/outputs/runtime-compatibility-lock.json'
const CONTRACT_DIR = 'rules/typical-page-contracts'
const PAGE_FILE_EXTENSIONS = new Set(['.jsx', '.tsx', '.js', '.ts'])
const REQUIRED_ADAPTERS = ['request', 'message', 'permission', 'route', 'theme']
const LEGACY_REQUIRED_GATES = [
  'host-contract',
  'typical-page-contract',
  'legacy-verify',
  'source-gate',
  'preflight',
  'slot-gate',
  'page-instance-validation',
]
const LEGACY_ACCEPTANCE_COMMAND = 'typical-page:legacy:accept'

const SUPPORTED_SHELLS = new Set([
  'StatListPageFrame',
  'TablePageFrame',
  'TreeSplitPageFrame',
  'ProFormDrawer',
  'ProDetailDrawer',
  'ProEditPage',
  'ProDetailPage',
  'FeedbackStatePanel',
])

const PAGE_COMPONENT_NAMES = {
  'table-stat': 'HiuiLegacyTableStatPage',
  'table-basic': 'HiuiLegacyTableBasicPage',
  'tree-table': 'HiuiLegacyTreeTablePage',
  'tree-split': 'HiuiLegacyTreeSplitPage',
  'drawer-form': 'HiuiLegacyDrawerFormPage',
  'drawer-detail': 'HiuiLegacyDrawerDetailPage',
  'full-page-edit': 'HiuiLegacyFullPageEditPage',
  'full-page-detail': 'HiuiLegacyFullPageDetailPage',
  'feedback-status': 'HiuiLegacyFeedbackStatusPage',
}

const RUNTIME_COMPONENT_BY_PAGE_TYPE = {
  'table-basic': 'TableBasicPage',
  'table-stat': 'TableStatPage',
  'tree-table': 'TreeTablePage',
  'tree-split': 'TreeSplitPage',
  'drawer-form': 'DrawerFormPage',
  'drawer-detail': 'DrawerDetailPage',
  'full-page-edit': 'FullPageEditPage',
  'full-page-detail': 'FullPageDetailPage',
  'feedback-status': 'FeedbackStatusPage',
}

function printUsage(commandName) {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/${commandName === 'typical-page:legacy:new' ? 'typical-page-legacy-new' : 'typical-page-legacy-rewrite'}.mjs" --plan <light-plan.json> [--target <project-root>] [--json]

Unsafe manual debug mode:
  node ".local-context/hiui-design/scripts/${commandName === 'typical-page:legacy:new' ? 'typical-page-legacy-new' : 'typical-page-legacy-rewrite'}.mjs" --unsafe-manual --page-type <id> --page <page-dir> --change <summary> [--target <project-root>] [--json]

Writes only:
  - index.tsx
  - page.instance.tsx
  - page.slots.ts
  - page.request.ts when apiBinding is an editable slot

This command reads a hiui-light-page-plan plus host-contract and typical-page-contract inputs.
It does not call typical-page:start-page or create src/page-components.
`)
}

function normalizeOptionalString(value) {
  const normalized = String(value || '').trim()
  return normalized ? normalized : ''
}

function normalizePageDir(pagePath) {
  const normalized = normalizeOptionalString(pagePath).replace(/\\/g, '/')
  if (!normalized) return ''
  const ext = path.extname(normalized)
  if (PAGE_FILE_EXTENSIONS.has(ext)) return path.dirname(normalized)
  return normalized.replace(/\/$/, '')
}

export function parseLegacyContractPageArgs(argv, commandName) {
  const options = {
    plan: '',
    page: '',
    change: '',
    pageTypeId: '',
    target: process.cwd(),
    json: false,
    unsafeManual: false,
    force: commandName === 'typical-page:legacy:rewrite',
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--') continue
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--force') {
      options.force = true
      continue
    }
    if (arg === '--unsafe-manual') {
      options.unsafeManual = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      printUsage(commandName)
      process.exit(0)
    }

    if (!arg.startsWith('--')) throw new Error(`Unknown argument: ${arg}`)
    const value = argv[index + 1]
    if (value === undefined || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)

    if (arg === '--plan') options.plan = value
    else if (arg === '--page') options.page = value
    else if (arg === '--change') options.change = value
    else if (arg === '--page-type') options.pageTypeId = value
    else if (arg === '--target') options.target = value
    else throw new Error(`Unknown argument: ${arg}`)
    index += 1
  }

  if (!options.plan && !options.unsafeManual) {
    throw new Error('Missing required argument: --plan. Create one with typical-page:light-plan, or pass --unsafe-manual for local debugging only.')
  }
  if (options.plan && options.unsafeManual) {
    throw new Error('Use either --plan or --unsafe-manual, not both.')
  }
  if (options.unsafeManual) {
    if (getLightFlowFeatureFlags().disallowUnsafeManual) {
      throw new Error('--unsafe-manual is not allowed in CI or guarded automation environments.')
    }
    if (!options.page) throw new Error('Missing required argument: --page')
    if (!options.pageTypeId) throw new Error('Missing required argument: --page-type')
    if (!options.change) throw new Error('Missing required argument: --change')
  }

  if (options.page) options.page = normalizePageDir(options.page)
  options.target = path.resolve(options.target)
  return options
}

async function resolveLightPlanOptions(options, manifest) {
  if (options.unsafeManual) {
    return { ...options, lightPlan: null, planPath: '' }
  }

  const knownPageTypes = manifest.pageTypes.map((item) => item.id)
  const planResult = await readLightPagePlan(options.plan, {
    targetRoot: options.target,
    knownPageTypes,
  })
  if (!planResult.ok) {
    const message = planResult.issues.map((item) => `${item.path || 'plan'}: ${item.message}`).join('; ')
    throw new Error(`Invalid light page plan: ${message}`)
  }

  return {
    ...options,
    page: normalizePageDir(planResult.plan.pagePath),
    pageTypeId: planResult.plan.pageType,
    change: planResult.plan.source.summary,
    lightPlan: planResult.plan,
    planPath: planResult.relativePath,
  }
}

async function assertPlannedWriteScope(options, candidatePaths) {
  if (options.unsafeManual) return []
  const results = []
  for (const candidatePath of candidatePaths) {
    results.push(await assertWithinWriteScope({
      targetRoot: options.target,
      candidatePath,
      writeScope: options.lightPlan.writeScope,
    }))
  }
  return results
}

function resolveChangeSizeLimits() {
  const flags = getLightFlowFeatureFlags()
  return {
    maxFiles: flags.changeSizeMaxFiles,
    maxLines: flags.changeSizeMaxLines,
  }
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function readJsonIfExists(filePath) {
  if (!(await pathExists(filePath))) return null
  return readJson(filePath)
}

async function writeTextIfAllowed(filePath, content, { force }) {
  const existed = await pathExists(filePath)
  if (existed && !force) {
    throw new Error(`Refusing to overwrite existing page artifact: ${filePath}`)
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf8')
  return { path: filePath, status: existed ? 'overwritten' : 'written' }
}

function validateHostReady(hostContract, hostContractPath) {
  const issues = []
  if (hostContract.schemaVersion !== 'host-contract.v1') issues.push('schemaVersion must be host-contract.v1')
  if (hostContract.mode !== 'legacy-host-compatible') issues.push('mode must be legacy-host-compatible')
  if (hostContract.styleBoundary?.scopeAttribute !== 'data-hiui-page-root') {
    issues.push('styleBoundary.scopeAttribute must be data-hiui-page-root')
  }
  for (const adapterName of REQUIRED_ADAPTERS) {
    const status = hostContract.adapters?.[adapterName]?.status
    if (status !== 'ready' && status !== 'not-required') {
      issues.push(`${adapterName} adapter must be ready or not-required; current status is ${status || 'missing'}`)
    }
  }
  if (issues.length > 0) {
    throw new Error(`Host contract is not ready (${hostContractPath}): ${issues.join('; ')}`)
  }
}

function validateTypicalContract(contract, pageTypeId, contractPath) {
  if (contract.schemaVersion !== 'typical-page-contract.v1') {
    throw new Error(`Invalid typical page contract schemaVersion in ${contractPath}`)
  }
  if (contract.pageTypeId !== pageTypeId) {
    throw new Error(`Contract pageTypeId mismatch in ${contractPath}: expected ${pageTypeId}, got ${contract.pageTypeId}`)
  }
  if (!contract.shell || !SUPPORTED_SHELLS.has(contract.shell)) {
    throw new Error(`Unsupported shell in ${contractPath}: ${contract.shell || '<empty>'}`)
  }
  if (!Array.isArray(contract.slotSchema?.editableSlots) || contract.slotSchema.editableSlots.length === 0) {
    throw new Error(`Contract ${contractPath} must declare editableSlots`)
  }
}

function validateProjectIntegrationReady(projectIntegration, pageTypeId) {
  if (!projectIntegration) {
    throw new Error(
      `Missing legacy project integration state (${PROJECT_INTEGRATION_STATE_RELATIVE_PATH}). Run project-level legacy integration before page generation.`
    )
  }

  const issues = []
  if (projectIntegration.mode !== 'legacy-host-compatible') {
    issues.push(`project integration mode must be legacy-host-compatible; current mode is ${projectIntegration.mode || 'missing'}`)
  }
  if (projectIntegration.runtimeIntegrationReady !== true) {
    issues.push('legacy project runtime integration state is not ready')
  }
  if (projectIntegration.legacyContractReady !== true) {
    issues.push('legacy host contract is not ready')
  }
  if (projectIntegration.legacyRuntimeSurfaceReady !== true) {
    issues.push('legacy runtime surface is not ready')
  }
  if (projectIntegration.missingRuntimeSurfacePageTypes?.includes(pageTypeId)) {
    issues.push(`compiled PageSpec runtime coverage is missing for page type ${pageTypeId}`)
  }
  if (
    Array.isArray(projectIntegration.runtimeSurfaceRequiredPageTypes) &&
    projectIntegration.runtimeSurfaceRequiredPageTypes.includes(pageTypeId) &&
    !projectIntegration.runtimeSurfaceCoveredPageTypes?.includes(pageTypeId)
  ) {
    issues.push(`runtime surface does not cover required page type ${pageTypeId}`)
  }
  if (Array.isArray(projectIntegration.blockingReasons) && projectIntegration.blockingReasons.length > 0) {
    issues.push(...projectIntegration.blockingReasons)
  }

  if (issues.length > 0) {
    throw new Error(`Legacy project integration is not ready: ${[...new Set(issues)].join('; ')}`)
  }
}

function defaultSlotValue(slotId) {
  if (slotId === 'pageTitle') return "'未命名页面'"
  if (slotId === 'searchPlaceholder') return "'请输入关键词'"
  if (slotId.endsWith('Fields') || slotId.endsWith('Columns') || slotId.endsWith('Actions') || slotId === 'headerExtra' || slotId === 'statItems' || slotId === 'mockData' || slotId === 'supportingSections') return '[]'
  if (slotId === 'validationRules' || slotId === 'apiBinding') return '{}'
  if (slotId === 'statusTitle') return "'操作未完成'"
  if (slotId === 'statusDescription') return "'请补充业务状态说明。'"
  if (slotId === 'primaryAction' || slotId === 'secondaryAction') return 'null'
  return 'null'
}

function buildSlotsSource({ contract, pageTypeId, pageDir, targetRoot, change }) {
  const runtimeDir = path.join(targetRoot, 'src', 'hiui-runtime')
  const typesImportPath = normalizeImportPath(pageDir, path.join(runtimeDir, 'types'))
  const lines = []
  lines.push(`import type { LegacyPageSlots } from '${typesImportPath}'`)
  lines.push('')
  lines.push('export const legacyPageChange = ' + JSON.stringify(change))
  lines.push('')
  lines.push(`export const slots: LegacyPageSlots<'${pageTypeId}'> = {`)
  for (const slotId of contract.slotSchema.editableSlots) {
    lines.push(`  ${slotId}: ${defaultSlotValue(slotId)},`)
  }
  lines.push('}')
  lines.push('')
  lines.push('export default slots')
  return `${lines.join('\n')}\n`
}

function buildRequestSource() {
  return `export async function requestLegacyPageData(params = {}) {
  return {
    params,
    list: [],
    total: 0,
  }
}
`
}

function buildIndexSource() {
  return `export { default } from './page.instance'
`
}

function normalizeImportPath(fromDir, toFileWithoutExtension) {
  let relativePath = path.relative(fromDir, toFileWithoutExtension).replace(/\\/g, '/')
  if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`
  return relativePath
}

function buildInstanceSource({ pageTypeId, pageDir, targetRoot, runtimeProviderContract }) {
  const componentName = PAGE_COMPONENT_NAMES[pageTypeId] || 'HiuiLegacyTypicalPage'
  const runtimeDir = path.join(targetRoot, 'src', 'hiui-runtime')
  const providerEntry = getRuntimeProviderPageEntry(runtimeProviderContract, pageTypeId)
  const runtimeComponent = providerEntry?.componentName || RUNTIME_COMPONENT_BY_PAGE_TYPE[pageTypeId] || 'HiuiLegacyPage'
  const runtimeEntry = providerEntry?.runtimeEntry
    ? path.join(targetRoot, providerEntry.runtimeEntry)
    : runtimeComponent === 'HiuiLegacyPage'
    ? path.join(runtimeDir, 'HiuiLegacyPage')
    : path.join(runtimeDir, 'pages', runtimeComponent)
  const legacyPageImportPath = normalizeImportPath(pageDir, runtimeEntry)

  return `import React from 'react'
import { ${runtimeComponent} } from '${legacyPageImportPath}'
import { slots } from './page.slots'

export default function ${componentName}() {
  return <${runtimeComponent} slots={slots} />
}
`
}

function buildManagedContract({
  pageType,
  typicalContract,
  generatedPagePath,
  contractRelativePath,
  commandName,
  skillRoot,
  runtimeSeal,
  runtimeCompatibilityLock,
  runtimeProviderContract,
}) {
  const pageTypeId = pageType.id
  const generationProfile = {
    schemaVersion: 'generation-profile.v1',
    mode: 'legacy-host-compatible',
    strategy: 'legacy-lightweight-contract',
    legacyStrategyId: 'legacy-lightweight-contract',
    moldId: getMoldIdForPageType(pageTypeId, { skillRoot }),
    startFrom: 'typical-page-contract',
    fallback: 'block-and-request-managed-mold-or-certified-adapter',
    sourceProofLevel: 'slot-boundary-proof',
    lockedRegions: getLockedRegionsForPageType(pageTypeId, { skillRoot }),
    editableSlots: getEditableSlotsForPageType(pageTypeId, { skillRoot }),
    slotManifest: getSlotManifestForPageType(pageTypeId, { skillRoot }),
    requiredGates: LEGACY_REQUIRED_GATES,
    runtimeCoreVersion: String(runtimeSeal?.runtimeCoreVersion || ''),
    runtimeSealPath: RUNTIME_SEAL_RELATIVE_PATH,
    runtimeSealHash: summarizeRuntimeSealHash(runtimeSeal),
    canonicalShell: String(runtimeSeal?.canonicalShellByPageType?.[pageTypeId] || typicalContract.shell || ''),
    peerResolutionStatus: String(runtimeCompatibilityLock?.peerResolution?.status || ''),
    runtimeProviderContractPath: runtimeProviderContract ? RUNTIME_PROVIDER_CONTRACT_RELATIVE_PATH : '',
    runtimeProvider: String(runtimeProviderContract?.provider || 'official-shells'),
  }

  return buildRulesOnlyPageContract({
    pageType,
    generatedPagePath,
    hostArchetypePath: contractRelativePath,
    archetypeMode: 'legacy-host-compatible',
    regionMapping: getRequiredRegionsForPageType(pageTypeId).map((region) => ({
      region,
      target: `HiuiLegacyPage:${region}`,
    })),
    ownershipMode: 'page-surface-owns-workspace',
    ownershipMapping: getRequiredOwnershipRolesForPageType(pageTypeId).map((role) => ({
      role,
      target: role === 'content-slot' ? 'typed-page-slot' : 'HiuiLegacyPage',
    })),
    scrollStrategy: getDefaultScrollStrategyForPageType(pageTypeId),
    generationProfile,
    notes: [
      'legacy-host-compatible uses host-contract + compiled PageSpec + HiuiLegacyPage runtime + typed page slots; it must not call typical-page:start-page or write src/page-components.',
      `Typical page shell source: ${typicalContract.shell}`,
    ],
    workflow: {
      status: 'started',
      deliveryStatus: 'not-finalized',
      preflightStatus: 'not-run',
      sourceGateStatus: 'not-run',
      doctorStatus: 'not-run',
      lastCommand: commandName,
    },
  })
}

export async function runLegacyContractPageCommand({ argv, commandName, intent }) {
  const parsedOptions = parseLegacyContractPageArgs(argv, commandName)
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..', '..')
  const { manifest } = await loadPageTypeManifest({ skillRoot })
  const options = await resolveLightPlanOptions(parsedOptions, manifest)
  const hostContractPath = path.join(options.target, HOST_CONTRACT_RELATIVE_PATH)
  const runtimeSealPath = path.join(options.target, RUNTIME_SEAL_RELATIVE_PATH)
  const runtimeCompatibilityLockPath = path.join(options.target, RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH)
  const contractPath = path.join(skillRoot, CONTRACT_DIR, `${options.pageTypeId}.json`)
  const pageDir = path.resolve(options.target, options.page)
  const instancePath = path.join(pageDir, 'page.instance.tsx')
  const indexPath = path.join(pageDir, 'index.tsx')
  const slotsPath = path.join(pageDir, 'page.slots.ts')
  const requestPath = path.join(pageDir, 'page.request.ts')
  const pageComponentsDir = path.join(options.target, 'src', 'page-components')
  const projectIntegration = await readProjectIntegrationState(options.target)

  validateProjectIntegrationReady(projectIntegration, options.pageTypeId)

  if (!(await pathExists(hostContractPath))) {
    throw new Error(`Missing ${HOST_CONTRACT_RELATIVE_PATH}. Run typical-page:apply:legacy first; it runs typical-page:legacy:init internally.`)
  }
  if (!(await pathExists(contractPath))) {
    throw new Error(`Missing typical page contract: ${path.relative(skillRoot, contractPath)}`)
  }
  if (intent === 'new' && ((await pathExists(instancePath)) || (await pathExists(slotsPath)))) {
    throw new Error('Target page already has lightweight page artifacts. Use typical-page:legacy:rewrite to overwrite them.')
  }

  const hostContract = await readJson(hostContractPath)
  const contract = await readJson(contractPath)
  const runtimeSeal = await readJsonIfExists(runtimeSealPath)
  const runtimeCompatibilityLock = await readJsonIfExists(runtimeCompatibilityLockPath)
  const runtimeProviderContract = await readRuntimeProviderContract({ targetRoot: options.target })
  const pageType = manifest.pageTypes.find((item) => item.id === options.pageTypeId)
  if (!pageType) {
    throw new Error(`Unknown page type in manifest: ${options.pageTypeId}`)
  }
  validateHostReady(hostContract, hostContractPath)
  validateTypicalContract(contract, options.pageTypeId, contractPath)

  const generatedPagePath = normalizeContractPath(options.target, instancePath)
  const contractsDir = getRulesOnlyPageContractsDir(options.target)
  const contractSlug = toContractSlug(generatedPagePath.replace(/\.[cm]?[jt]sx?$/u, '')) || `${options.pageTypeId}-contract`
  const contractJsonPath = path.join(contractsDir, `${contractSlug}.json`)
  const contractMarkdownPath = path.join(contractsDir, `${contractSlug}.md`)
  await assertPlannedWriteScope(options, [
    slotsPath,
    instancePath,
    indexPath,
    ...(contract.slotSchema.editableSlots.includes('apiBinding') ? [requestPath] : []),
    contractJsonPath,
    contractMarkdownPath,
  ])

  const writes = []
  writes.push(await writeTextIfAllowed(slotsPath, buildSlotsSource({ contract, pageTypeId: options.pageTypeId, pageDir, targetRoot: options.target, change: options.change }), { force: options.force }))
  writes.push(await writeTextIfAllowed(instancePath, buildInstanceSource({ pageTypeId: options.pageTypeId, pageDir, targetRoot: options.target, runtimeProviderContract }), { force: options.force }))
  writes.push(await writeTextIfAllowed(indexPath, buildIndexSource(), { force: options.force }))
  if (contract.slotSchema.editableSlots.includes('apiBinding')) {
    writes.push(await writeTextIfAllowed(requestPath, buildRequestSource(), { force: options.force }))
  }
  const slotGate = options.unsafeManual
    ? { status: 'skipped', ok: true, issues: [], facts: {}, reason: 'unsafe manual debug mode' }
    : await runLightSlotGate({
        slotsPath,
        instancePath,
        plan: options.lightPlan,
      })

  const managedContract = buildManagedContract({
    pageType,
    typicalContract: contract,
    generatedPagePath,
    contractRelativePath: path.relative(skillRoot, contractPath),
    commandName,
    skillRoot,
    runtimeSeal,
    runtimeCompatibilityLock,
    runtimeProviderContract,
  })
  const validation = validateRulesOnlyPageContract({
    contract: managedContract,
    manifest,
    targetRoot: options.target,
  })
  if (validation.errors.length > 0) {
    throw new Error(validation.errors.join('; '))
  }

  const snapshot = computeManagedPageSourceSnapshot({
    generatedPagePath,
    targetRoot: options.target,
  })
  managedContract.workflow = {
    ...managedContract.workflow,
    runtimeSmokeStatus: getManagedPageRuntimeSmokeDefaultStatus(managedContract),
    runtimeSmokeSnapshotHash: '',
    runtimeSmokeReportPath: '',
    sourceSnapshotHash: snapshot.hash,
  }
  await writeManagedPageContractArtifacts({
    contract: managedContract,
    contractJsonPath,
    contractMarkdownPath,
  })
  await removeDuplicateManagedPageContractArtifacts(options.target, generatedPagePath, contractJsonPath)
  const changeSize = await checkChangeSize({
    targetRoot: options.target,
    paths: [
      ...writes.map((write) => write.path),
      contractJsonPath,
      contractMarkdownPath,
    ],
    limits: resolveChangeSizeLimits(),
  })
  const generationStatus = changeSize.ok && slotGate.ok ? 'generated-not-accepted' : 'generated-blocked'
  managedContract.workflow = reduceLightPageWorkflow(managedContract.workflow, {
    type: 'generation-completed',
    blocked: generationStatus === 'generated-blocked',
    generationStatus,
    lightPlanPath: options.planPath,
  })
  await writeManagedPageContractArtifacts({
    contract: managedContract,
    contractJsonPath,
    contractMarkdownPath,
  })
  await syncManagedPageRegistry(options.target)
  const autoUsage = await autoRecordGeneratedPageUsage({
    commandName,
    pagePath: generatedPagePath,
    prompt: options.change,
    reportMode: 'legacy-host-compatible',
    skillRoot,
    sourceSnapshotHash: managedContract.workflow.sourceSnapshotHash,
    targetRoot: options.target,
  })

  const pageRelativePath = path.relative(options.target, pageDir).replace(/\\/g, '/')
  const slotsRelativePath = path.relative(options.target, slotsPath).replace(/\\/g, '/')
  const result = {
    schemaVersion: 'legacy-page-generation-result.v1',
    status: generationStatus,
    command: commandName,
    intent,
    target: options.target,
    pageType: options.pageTypeId,
    page: pageRelativePath,
    contract: path.relative(skillRoot, contractPath),
    lightPlan: options.planPath,
    unsafeManual: options.unsafeManual,
    managedContract: normalizeContractPath(options.target, contractJsonPath),
    hostContract: path.relative(options.target, hostContractPath),
    shell: contract.shell,
    acceptance: {
      status: 'required',
      blockingUntilAccepted: true,
      command: LEGACY_ACCEPTANCE_COMMAND,
      requiredSteps: [
        'legacy-verify',
        'runtime-provenance',
        'shell-binding',
        'peer-export-resolution',
        'runtime-provider-contract',
        'adapter-gate',
        'build',
        'build-warning-classification',
        'remoteEntry',
        'runtime-capture',
        'runtime-dom',
        'dom-geometry',
        'visual-evidence',
        'warning-classification',
      ],
    },
    files: [
      ...writes.map((write) => ({ path: path.relative(options.target, write.path), status: write.status })),
      { path: normalizeContractPath(options.target, contractJsonPath), status: 'written' },
      { path: normalizeContractPath(options.target, contractMarkdownPath), status: 'written' },
    ],
    changeSize: {
      status: changeSize.ok ? 'passed' : 'failed',
      fileCount: changeSize.facts.fileCount,
      lineCount: changeSize.facts.lineCount,
      limits: changeSize.limits,
      topBuckets: changeSize.facts.buckets.slice(0, 5),
      issues: changeSize.issues,
      summary: summarizeChangeSize(changeSize),
    },
    slotGate: {
      status: slotGate.status,
      issues: slotGate.issues,
      facts: slotGate.facts,
      ...(slotGate.reason ? { reason: slotGate.reason } : {}),
    },
    usageStats: autoUsage,
    wroteSrcPageComponents: false,
    srcPageComponentsExists: await pathExists(pageComponentsDir),
    nextAction: `Continue filling typed slots in ${slotsRelativePath}, then run ${LEGACY_ACCEPTANCE_COMMAND} --page ${pageRelativePath} --page-type ${options.pageTypeId}`,
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log(`[hiui-design][${commandName}]`)
    console.log(`- status: ${result.status}`)
    console.log(`- page: ${result.page}`)
    console.log(`- shell: ${result.shell}`)
    console.log(`- usage stats: ${autoUsage.status}${autoUsage.attempted ? ` (exit ${autoUsage.exitCode})` : ''}`)
    if (autoUsage.nextAction) {
      console.log(`- usage next action: ${autoUsage.nextAction}`)
    }
    console.log(`- wrote src/page-components: ${result.wroteSrcPageComponents}`)
    console.log(`- next: ${result.nextAction}`)
  }

  return result
}
