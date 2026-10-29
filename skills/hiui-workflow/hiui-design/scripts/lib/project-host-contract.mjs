import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import {
  PROJECT_HOST_CONTRACT_FILENAME,
  resolveProjectContextPath,
} from './skill-identity.mjs'
import { buildProjectMfDirectExposeLegacyAdapter } from './host-adapters/mf-direct-expose-legacy.mjs'
import {
  getManagedLocalRuntimeHostLogicalSource,
  getManagedLocalRuntimeRoot,
} from './managed-local-runtime-contract.mjs'
import { recordScanEvent } from './scan-trace.mjs'

const BUSINESS_ROOT_CANDIDATES = new Set(['src/views', 'src/pages'])
const MANAGED_HOST_IMPORT_SOURCE = getManagedLocalRuntimeHostLogicalSource()
const OFFICIAL_HOST_SOURCE_APP_FRAME_CORE_PATH = 'examples/host-integration/src/app-frame-core.tsx'

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeRelativePath(value) {
  return normalizeString(value).replace(/\\/g, '/').replace(/^\.\//, '')
}

function normalizeStringArray(value) {
  return [...new Set((Array.isArray(value) ? value : []).map((item) => normalizeString(item)).filter(Boolean))]
}

function cloneJson(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value))
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function uniqueRelativePaths(values = []) {
  return [...new Set(values.map((value) => normalizeRelativePath(value)).filter(Boolean))]
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function hashProjectFiles(targetRoot, relativePaths = []) {
  const normalizedRelativePaths = uniqueRelativePaths(relativePaths).sort()
  if (normalizedRelativePaths.length === 0) return 'missing'

  const hash = createHash('sha256')
  let includedFileCount = 0

  for (const relativePath of normalizedRelativePaths) {
    const absolutePath = path.join(targetRoot, relativePath)
    if (!(await pathExists(absolutePath))) continue
    const stat = await fs.stat(absolutePath).catch(() => null)
    if (!stat?.isFile()) continue
    hash.update(`file:${relativePath}\n`)
    hash.update(await fs.readFile(absolutePath))
    hash.update('\n')
    includedFileCount += 1
  }

  return includedFileCount > 0 ? hash.digest('hex') : 'missing'
}

function getBusinessRootCandidate(relativePath) {
  const normalized = normalizeRelativePath(relativePath)
  if (!normalized) return ''

  const segments = normalized.split('/').filter(Boolean)
  if (segments.length < 3 || segments[0] !== 'src') return ''

  const root = `${segments[0]}/${segments[1]}`
  return BUSINESS_ROOT_CANDIDATES.has(root) ? root : ''
}

function inferBusinessPageDir(formalNavigation = {}) {
  const candidatePaths = [
    formalNavigation?.selectedLegacyMountEntryPath,
    formalNavigation?.selectedBusinessEntryPath,
    ...(Array.isArray(formalNavigation?.businessEntryEvidence)
      ? formalNavigation.businessEntryEvidence.flatMap((item) => [item?.sourcePath, item?.entryPath, item?.path])
      : []),
  ]

  for (const candidatePath of candidatePaths) {
    const root = getBusinessRootCandidate(candidatePath)
    if (root) return root
  }

  return ''
}

function resolveHostFamily(hostProfile = {}, formalNavigation = {}, navigationDecision = {}) {
  if (normalizeString(formalNavigation?.implicitFeatureBaseDir)) return 'implicit-feature-registry'
  if (formalNavigation?.formalNavigationRegistryExists) return 'existing-route-registry'
  if (hostProfile?.hasModuleFederation) return 'mf-direct-expose-legacy'
  if (navigationDecision?.shouldAutoCreateFormalBusinessShell) return 'greenfield-first-shell'
  if (formalNavigation?.hasBusinessEntryEvidence) return 'legacy-business-entry'
  return 'manual-contract-only'
}

function resolvePublishMechanism(hostProfile = {}, formalNavigation = {}, navigationMountAction = {}) {
  const selectedPublishKind = normalizeString(formalNavigation?.selectedPublishEntryKind)
  if (selectedPublishKind === 'module-federation-exposes') return 'module-federation-direct-expose'
  if (selectedPublishKind === 'module-federation-expose') return 'module-federation-single-expose'
  if (normalizeString(navigationMountAction?.action) === 'materialize-mf-publish-entry') {
    return 'module-federation-direct-expose'
  }
  if (normalizeString(formalNavigation?.implicitFeatureBaseDir)) return 'implicit-feature-registry'
  if (formalNavigation?.formalNavigationRegistryExists) return 'route-registry'
  if (hostProfile?.hasModuleFederation) return 'module-federation-direct-expose'
  return 'unknown'
}

function buildEvidenceFiles(
  hostProfile = {},
  formalNavigation = {},
  navigationMountAction = {},
  projectEntryMountCapability = {}
) {
  return uniqueRelativePaths([
    ...(hostProfile?.adapterEntryHints ?? []),
    projectEntryMountCapability?.appEntryPath,
    formalNavigation?.formalBusinessShellPath,
    formalNavigation?.formalNavigationRegistryPath,
    formalNavigation?.selectedBusinessEntryPath,
    formalNavigation?.selectedLegacyMountEntryPath,
    formalNavigation?.selectedPublishEntryPath,
    formalNavigation?.implicitFeatureRegistryPath,
    navigationMountAction?.targetEntryPath,
    ...(formalNavigation?.businessEntryEvidencePaths ?? []),
    ...(formalNavigation?.navigationEvidencePaths ?? []),
    ...(formalNavigation?.ambiguousFormalNavigationEvidencePaths ?? []),
  ])
}

function summarizeHostProfile(hostProfile = {}) {
  return {
    projectType: normalizeString(hostProfile?.projectType),
    framework: normalizeString(hostProfile?.framework),
    reactMajor: Number.isFinite(Number(hostProfile?.reactMajor)) ? Number(hostProfile.reactMajor) : 0,
    legacyReactRuntime: hostProfile?.legacyReactRuntime === true,
    runtime: normalizeString(hostProfile?.runtime),
    routing: normalizeString(hostProfile?.routing),
    strategy: normalizeString(hostProfile?.strategy),
    reason: normalizeString(hostProfile?.reason),
    riskLevel: normalizeString(hostProfile?.riskLevel),
    riskTags: normalizeStringArray(hostProfile?.riskTags),
    adapterDoc: normalizeString(hostProfile?.adapterDoc),
    adapterEntryHints: normalizeStringArray(hostProfile?.adapterEntryHints),
    readmePath: normalizeRelativePath(hostProfile?.readmePath),
    remoteOnlyRuntime: cloneJson(hostProfile?.remoteOnlyRuntime || {}),
    remoteDebugContract: cloneJson(hostProfile?.remoteDebugContract || {}),
  }
}

function summarizeProjectEntryMountCapability(projectEntryMountCapability = {}) {
  return {
    appEntryPath: normalizeRelativePath(projectEntryMountCapability?.appEntryPath),
    supported: projectEntryMountCapability?.supported === true,
    strategy: normalizeString(projectEntryMountCapability?.strategy),
    reason: normalizeString(projectEntryMountCapability?.reason),
  }
}

function projectHostContractLooksComplete(projectHostContract) {
  return (
    isPlainObject(projectHostContract) &&
    (Object.prototype.hasOwnProperty.call(projectHostContract, 'formalNavigation') ||
      Object.prototype.hasOwnProperty.call(projectHostContract, 'hostProfile') ||
      Object.prototype.hasOwnProperty.call(projectHostContract, 'executionContract') ||
      Object.prototype.hasOwnProperty.call(projectHostContract, 'projectEntryMountCapability'))
  )
}

function mergeObjectArrayByKey(existing = [], incoming = [], keyBuilder = () => '') {
  const merged = []
  const seen = new Set()

  for (const item of [...existing, ...incoming]) {
    if (!isPlainObject(item)) continue
    const key = normalizeString(keyBuilder(item))
    if (!key || seen.has(key)) continue
    seen.add(key)
    merged.push(cloneJson(item))
  }

  return merged
}

function buildManagedShellCertificationEvidence(existingEvidence = []) {
  return normalizeStringArray([
    ...existingEvidence,
    'stable-formal-shell-marker',
    'official-managed-host-core-import',
    'official-managed-host-core-contract',
    'managed-first-formal-shell-materialized',
  ])
}

function buildManagedFormalShellMigration({
  targetShellPath = '',
  hostShellDecision = null,
} = {}) {
  const normalizedShellPath = normalizeRelativePath(targetShellPath)
  const fallbackShellDir = normalizedShellPath ? path.posix.dirname(normalizedShellPath) : 'src/business-shell'

  return {
    status: 'not-needed',
    required: false,
    kind: 'certified-existing-shell',
    blockingMode: 'none',
    reason: normalizedShellPath
      ? `Managed formal shell ${normalizedShellPath} was materialized successfully and is now the certified project-level business shell.`
      : 'Managed formal shell was materialized successfully and is now the certified project-level business shell.',
    targetShellPath: normalizedShellPath,
    targetCorePath: normalizeRelativePath(
      hostShellDecision?.migrationTargetCorePath || `${fallbackShellDir}/app-frame-core.tsx`
    ),
    targetHostResetPath: normalizeRelativePath(
      hostShellDecision?.migrationTargetHostResetPath || `${fallbackShellDir}/host-reset.css`
    ),
    preferredExtension: normalizeString(hostShellDecision?.preferredExtension) || '.tsx',
    referenceAppFrameCorePath: OFFICIAL_HOST_SOURCE_APP_FRAME_CORE_PATH,
    managedHostImportSource: MANAGED_HOST_IMPORT_SOURCE,
    recommendedStrategy: '',
    recommendedSteps: [],
    evidence: buildManagedShellCertificationEvidence([]),
  }
}

function resolveSettledDefaultBusinessPageDir({
  requestedBusiness = null,
  hostExecutionAdapter = null,
  projectHostContract = null,
} = {}) {
  const requestedDefault = normalizeRelativePath(requestedBusiness?.defaultBusinessPageDir || '')
  if (requestedDefault) return requestedDefault

  const adapterDefault = normalizeRelativePath(hostExecutionAdapter?.pageSource?.defaultBusinessPageDir || '')
  if (adapterDefault) return adapterDefault

  const contractDefault = normalizeRelativePath(projectHostContract?.defaultBusinessPageDir || '')
  if (contractDefault) return contractDefault

  const targetBusinessPath = normalizeRelativePath(
    requestedBusiness?.targetBusinessPath || requestedBusiness?.dest || ''
  )
  return getBusinessRootCandidate(targetBusinessPath)
}

function buildNavigationEvidenceEntry(kind, targetPath) {
  const normalizedPath = normalizeRelativePath(targetPath)
  const normalizedKind = normalizeString(kind)
  if (!normalizedKind || !normalizedPath) return null

  return {
    kind: normalizedKind,
    path: normalizedPath,
  }
}

function buildBusinessEntryEvidenceEntry(kind, targetPath) {
  const normalizedPath = normalizeRelativePath(targetPath)
  const normalizedKind = normalizeString(kind)
  if (!normalizedKind || !normalizedPath) return null

  return {
    kind: normalizedKind,
    path: normalizedPath,
  }
}

async function inspectManagedLocalRuntimeMaterialization(targetRoot) {
  const runtimeRoot = `src/${getManagedLocalRuntimeRoot()}`
  const entryPath = `${runtimeRoot}/index.js`
  const stylePath = `${runtimeRoot}/styles.css`
  const missingPaths = []

  if (!(await pathExists(path.join(targetRoot, entryPath)))) {
    missingPaths.push(entryPath)
  }
  if (!(await pathExists(path.join(targetRoot, stylePath)))) {
    missingPaths.push(stylePath)
  }

  const materialized = missingPaths.length === 0

  return {
    status: materialized ? 'materialized' : 'not-materialized',
    materialized,
    root: runtimeRoot,
    entryPath,
    stylePath,
    blockedBy: materialized ? [] : ['managed-local-runtime-not-materialized'],
    missingPaths,
    reason: materialized
      ? `Managed local runtime assets are materialized under ${runtimeRoot}.`
      : `Managed local runtime assets are not fully materialized under ${runtimeRoot}. Missing: ${missingPaths.join(', ')}`,
  }
}

function buildSettledProjectExecutionContract({
  projectHostContract = null,
  formalNavigation = {},
  defaultBusinessPageDir = '',
  hostExecutionAdapter = null,
  projectEntryMountCapability = {},
} = {}) {
  const hostFamily = normalizeString(projectHostContract?.hostFamily)

  return buildProjectExecutionContract({
    hostFamily,
    formalNavigation,
    defaultBusinessPageDir,
    hostExecutionAdapter,
    projectEntryMountCapability,
  })
}

function settleProjectHostContractPayload({
  projectHostContract = null,
  navigationMountAction = null,
  requestedBusiness = null,
  hostShellDecision = null,
  hostExecutionAdapter = null,
} = {}) {
  if (!isPlainObject(projectHostContract)) {
    return {
      updated: false,
      contract: null,
      reason: 'project host contract is missing or incomplete.',
    }
  }

  const action = normalizeString(navigationMountAction?.action)
  if (!action) {
    return {
      updated: false,
      contract: cloneJson(projectHostContract),
      reason: 'navigation mount action is missing.',
    }
  }

  const nextContract = cloneJson(projectHostContract)
  const nextFormalNavigation = isPlainObject(nextContract.formalNavigation)
    ? cloneJson(nextContract.formalNavigation)
    : {}
  const nextProjectEntryMountCapability = isPlainObject(nextContract.projectEntryMountCapability)
    ? cloneJson(nextContract.projectEntryMountCapability)
    : {}
  const targetShellPath = normalizeRelativePath(navigationMountAction?.targetShellPath || '')
  const targetRegistryPath = normalizeRelativePath(navigationMountAction?.targetRegistryPath || '')
  const targetEntryPath = normalizeRelativePath(navigationMountAction?.targetEntryPath || '')
  const targetEntryKind = normalizeString(navigationMountAction?.targetEntryKind)
  const defaultBusinessPageDir = resolveSettledDefaultBusinessPageDir({
    requestedBusiness,
    hostExecutionAdapter,
    projectHostContract: nextContract,
  })

  let updated = false

  if (action === 'create-formal-shell-and-mount-entry' || action === 'append-existing-registry') {
    if (!targetRegistryPath) {
      return {
        updated: false,
        contract: cloneJson(projectHostContract),
        reason: 'route registry path is missing for project host contract settlement.',
      }
    }

    nextContract.hostFamily = 'existing-route-registry'
    nextContract.publishMechanism = 'route-registry'
    nextContract.defaultBusinessPageDir = defaultBusinessPageDir
    nextFormalNavigation.formalBusinessShellExists = Boolean(targetShellPath || nextFormalNavigation.formalBusinessShellPath)
    nextFormalNavigation.formalBusinessShellPath =
      targetShellPath || normalizeRelativePath(nextFormalNavigation.formalBusinessShellPath || '')
    nextFormalNavigation.formalNavigationRegistryExists = true
    nextFormalNavigation.formalNavigationRegistryPath = targetRegistryPath
    nextFormalNavigation.formalNavigationRegistryCandidatePaths = normalizeStringArray([
      ...(nextFormalNavigation.formalNavigationRegistryCandidatePaths || []),
      targetRegistryPath,
    ])
    nextFormalNavigation.formalNavigationRegistryStatus = 'auto-append-supported'
    nextFormalNavigation.formalNavigationRegistryKind =
      normalizeString(nextFormalNavigation.formalNavigationRegistryKind) || 'business-routes-registry'
    nextFormalNavigation.formalNavigationRegistryAutoMountSupported = true
    nextFormalNavigation.formalNavigationRegistrySupportReason =
      normalizeString(nextFormalNavigation.formalNavigationRegistrySupportReason) ||
      'Managed formal navigation registry is confirmed and can be auto-appended for future page generation.'
    nextFormalNavigation.ambiguousFormalNavigationEvidencePaths = []
    nextFormalNavigation.hasNavigationEvidence = true
    nextFormalNavigation.navigationEvidence = mergeObjectArrayByKey(
      nextFormalNavigation.navigationEvidence,
      [
        buildNavigationEvidenceEntry('route-registry-file', targetRegistryPath),
        buildNavigationEvidenceEntry('formal-shell-file', nextFormalNavigation.formalBusinessShellPath),
      ],
      (item) => `${normalizeString(item.kind)}:${normalizeRelativePath(item.path)}`
    )
    nextFormalNavigation.navigationEvidencePaths = normalizeStringArray(
      nextFormalNavigation.navigationEvidence.map((item) => item.path)
    )
    nextFormalNavigation.navigationEvidenceKinds = normalizeStringArray(
      nextFormalNavigation.navigationEvidence.map((item) => item.kind)
    )
    nextFormalNavigation.selectedNavigationEvidencePath = targetRegistryPath
    nextFormalNavigation.shellCertification = 'certified-existing'
    nextFormalNavigation.shellCertificationEvidence = buildManagedShellCertificationEvidence(
      nextFormalNavigation.shellCertificationEvidence || []
    )
    nextFormalNavigation.shellCertificationMarker =
      nextFormalNavigation.shellCertificationMarker ||
      'hiuiDesignFormalShell=official-managed-host-shell-wrapper'
    nextFormalNavigation.requiredNavigationStyleReference =
      nextFormalNavigation.requiredNavigationStyleReference || OFFICIAL_HOST_SOURCE_APP_FRAME_CORE_PATH
    nextFormalNavigation.formalShellMigration = buildManagedFormalShellMigration({
      targetShellPath: nextFormalNavigation.formalBusinessShellPath,
      hostShellDecision,
    })
    updated = true
  } else if (action === 'materialize-implicit-feature-entry') {
    const implicitFeatureBaseDir = normalizeRelativePath(
      navigationMountAction?.implicitFeatureBaseDir || targetEntryPath
    )
    if (!implicitFeatureBaseDir) {
      return {
        updated: false,
        contract: cloneJson(projectHostContract),
        reason: 'implicit feature base directory is missing for project host contract settlement.',
      }
    }

    nextContract.hostFamily = 'implicit-feature-registry'
    nextContract.publishMechanism = 'implicit-feature-registry'
    nextContract.defaultBusinessPageDir = defaultBusinessPageDir || implicitFeatureBaseDir
    nextFormalNavigation.implicitFeatureRegistryExists = true
    nextFormalNavigation.implicitFeatureRegistryPath =
      targetRegistryPath || normalizeRelativePath(nextFormalNavigation.implicitFeatureRegistryPath || '')
    nextFormalNavigation.implicitFeatureBaseDir = implicitFeatureBaseDir
    nextFormalNavigation.implicitFeatureEntryPattern = normalizeString(
      navigationMountAction?.implicitFeatureEntryPattern || nextFormalNavigation.implicitFeatureEntryPattern
    )
    nextFormalNavigation.implicitFeatureEntryFileName = normalizeString(
      navigationMountAction?.implicitFeatureEntryFileName || nextFormalNavigation.implicitFeatureEntryFileName
    )
    nextFormalNavigation.implicitFeatureEntryExtension = normalizeString(
      navigationMountAction?.implicitFeatureEntryExtension || nextFormalNavigation.implicitFeatureEntryExtension
    )
    updated = true
  } else if (action === 'materialize-mf-publish-entry') {
    if (!targetEntryPath || !targetEntryKind) {
      return {
        updated: false,
        contract: cloneJson(projectHostContract),
        reason: 'publish entry path or kind is missing for project host contract settlement.',
      }
    }

    nextContract.hostFamily = 'mf-direct-expose-legacy'
    nextContract.publishMechanism = 'module-federation-direct-expose'
    nextContract.defaultBusinessPageDir = defaultBusinessPageDir
    nextFormalNavigation.hasBusinessEntryEvidence = true
    nextFormalNavigation.businessEntryEvidence = mergeObjectArrayByKey(
      nextFormalNavigation.businessEntryEvidence,
      [buildBusinessEntryEvidenceEntry(targetEntryKind, targetEntryPath)],
      (item) => `${normalizeString(item.kind)}:${normalizeRelativePath(item.path)}`
    )
    nextFormalNavigation.businessEntryEvidencePaths = normalizeStringArray(
      nextFormalNavigation.businessEntryEvidence.map((item) => item.path)
    )
    nextFormalNavigation.businessEntryEvidenceKinds = normalizeStringArray(
      nextFormalNavigation.businessEntryEvidence.map((item) => item.kind)
    )
    nextFormalNavigation.selectedBusinessEntryPath = targetEntryPath
    nextFormalNavigation.selectedBusinessEntryKind = targetEntryKind
    nextFormalNavigation.selectedPublishEntryPath = targetEntryPath
    nextFormalNavigation.selectedPublishEntryKind = targetEntryKind
    updated = true
  }

  if (!updated) {
    return {
      updated: false,
      contract: cloneJson(projectHostContract),
      reason: `navigation mount action ${action} does not change project-scoped host contract facts.`,
    }
  }

  nextContract.formalNavigation = nextFormalNavigation
  const nextProjectScopedAdapter =
    nextContract.hostFamily === 'mf-direct-expose-legacy'
      ? buildProjectMfDirectExposeLegacyAdapter({
          projectHostContract: {
            ...nextContract,
            formalNavigation: nextFormalNavigation,
          },
          generationReadiness: {
            navigationMountAction,
          },
          defaultBusinessPageDir: nextContract.defaultBusinessPageDir,
        })
      : cloneJson(nextContract.hostExecutionAdapter || {})
  nextContract.hostExecutionAdapter = nextProjectScopedAdapter
  nextContract.executionContract = buildSettledProjectExecutionContract({
    projectHostContract: nextContract,
    formalNavigation: nextFormalNavigation,
    defaultBusinessPageDir: nextContract.defaultBusinessPageDir,
    hostExecutionAdapter: nextProjectScopedAdapter,
    projectEntryMountCapability: nextProjectEntryMountCapability,
  })
  nextContract.evidenceFiles = uniqueRelativePaths([
    ...buildEvidenceFiles(
      nextContract.hostProfile || {},
      nextFormalNavigation,
      navigationMountAction,
      nextProjectEntryMountCapability
    ),
    ...(nextProjectScopedAdapter?.evidenceFiles || []),
  ])

  return {
    updated: true,
    contract: nextContract,
    reason: `project host contract settled from managed ${action} write.`,
  }
}

function buildManualContractOnlyExecutionContract() {
  return {
    kind: 'manual-contract-only',
    enabled: false,
    projectScoped: true,
    confirmationStatus: 'unconfirmed',
    reason:
      'No reusable project-scoped navigation execution mechanism is confirmed yet. Future page tasks must rely on an explicit navigationMountContract or manual mount-point confirmation.',
  }
}

function buildExistingRouteRegistryExecutionContract({
  formalNavigation = {},
  defaultBusinessPageDir = '',
} = {}) {
  return {
    kind: 'existing-route-registry',
    enabled: true,
    projectScoped: true,
    confirmationStatus: 'confirmed',
    defaultBusinessPageDir: normalizeRelativePath(defaultBusinessPageDir),
    formalShellPath: normalizeRelativePath(formalNavigation?.formalBusinessShellPath),
    routeRegistry: {
      path: normalizeRelativePath(formalNavigation?.formalNavigationRegistryPath),
      kind: normalizeString(formalNavigation?.formalNavigationRegistryKind),
      autoMountSupported: formalNavigation?.formalNavigationRegistryAutoMountSupported === true,
      supportReason: normalizeString(formalNavigation?.formalNavigationRegistrySupportReason),
    },
  }
}

function buildImplicitFeatureRegistryExecutionContract({
  formalNavigation = {},
  defaultBusinessPageDir = '',
} = {}) {
  return {
    kind: 'implicit-feature-registry',
    enabled: true,
    projectScoped: true,
    confirmationStatus: 'confirmed',
    defaultBusinessPageDir: normalizeRelativePath(defaultBusinessPageDir),
    formalShellPath: normalizeRelativePath(formalNavigation?.formalBusinessShellPath),
    implicitFeature: {
      baseDir: normalizeRelativePath(formalNavigation?.implicitFeatureBaseDir),
      registryPath: normalizeRelativePath(formalNavigation?.implicitFeatureRegistryPath),
      entryPattern: normalizeString(formalNavigation?.implicitFeatureEntryPattern),
      entryFileName: normalizeString(formalNavigation?.implicitFeatureEntryFileName),
      entryExtension: normalizeString(formalNavigation?.implicitFeatureEntryExtension),
    },
  }
}

function buildGreenfieldFirstShellExecutionContract({
  formalNavigation = {},
  projectEntryMountCapability = {},
} = {}) {
  const supported = projectEntryMountCapability?.supported === true

  return {
    kind: 'greenfield-first-shell',
    enabled: true,
    projectScoped: true,
    confirmationStatus: supported ? 'ready-to-materialize' : 'needs-app-entry-confirmation',
    bootstrap: {
      shellPath:
        normalizeRelativePath(formalNavigation?.formalBusinessShellPath) ||
        'src/business-shell/app-frame.tsx',
      registryPath:
        normalizeRelativePath(formalNavigation?.formalNavigationRegistryPath) ||
        'src/business-shell/routes.tsx',
      appEntryPath: normalizeRelativePath(projectEntryMountCapability?.appEntryPath),
      appEntrySupported: supported,
      appEntryStrategy: normalizeString(projectEntryMountCapability?.strategy),
      appEntryReason: normalizeString(projectEntryMountCapability?.reason),
    },
  }
}

function buildLegacyBusinessEntryExecutionContract({
  formalNavigation = {},
  defaultBusinessPageDir = '',
} = {}) {
  const selectionBlocked = formalNavigation?.businessEntrySelectionBlocked === true

  return {
    kind: 'legacy-business-entry',
    enabled: true,
    projectScoped: true,
    confirmationStatus: selectionBlocked ? 'ambiguous' : 'confirmed',
    defaultBusinessPageDir: normalizeRelativePath(defaultBusinessPageDir),
    businessEntry: {
      path: normalizeRelativePath(formalNavigation?.selectedBusinessEntryPath),
      kind: normalizeString(formalNavigation?.selectedBusinessEntryKind),
      backRoutePath: normalizeString(formalNavigation?.selectedLegacyBackRoutePath),
      backTitle: normalizeString(formalNavigation?.selectedLegacyBackTitle),
      backName: normalizeString(formalNavigation?.selectedLegacyBackName),
      selectionBlocked,
      selectionBlockReason: normalizeString(formalNavigation?.businessEntrySelectionBlockReason),
    },
  }
}

function buildMfDirectExposeExecutionContract({
  defaultBusinessPageDir = '',
  hostExecutionAdapter = null,
} = {}) {
  return {
    kind: 'mf-direct-expose-legacy',
    enabled: true,
    projectScoped: true,
    confirmationStatus: 'confirmed',
    defaultBusinessPageDir: normalizeRelativePath(defaultBusinessPageDir),
    pageSource: cloneJson(hostExecutionAdapter?.pageSource || {}),
    publishEntry: cloneJson(hostExecutionAdapter?.publishEntry || {}),
  }
}

function buildProjectExecutionContract({
  hostFamily = '',
  formalNavigation = {},
  defaultBusinessPageDir = '',
  hostExecutionAdapter = null,
  projectEntryMountCapability = {},
} = {}) {
  switch (hostFamily) {
    case 'existing-route-registry':
      return buildExistingRouteRegistryExecutionContract({
        formalNavigation,
        defaultBusinessPageDir,
      })
    case 'implicit-feature-registry':
      return buildImplicitFeatureRegistryExecutionContract({
        formalNavigation,
        defaultBusinessPageDir,
      })
    case 'greenfield-first-shell':
      return buildGreenfieldFirstShellExecutionContract({
        formalNavigation,
        projectEntryMountCapability,
      })
    case 'legacy-business-entry':
      return buildLegacyBusinessEntryExecutionContract({
        formalNavigation,
        defaultBusinessPageDir,
      })
    case 'mf-direct-expose-legacy':
      return buildMfDirectExposeExecutionContract({
        defaultBusinessPageDir,
        hostExecutionAdapter,
      })
    default:
      return buildManualContractOnlyExecutionContract()
  }
}

export async function buildProjectHostContract({ targetRoot, generationReadiness } = {}) {
  const hostProfile = generationReadiness?.hostProfile || {}
  const formalNavigation = generationReadiness?.formalNavigation || {}
  const navigationDecision = generationReadiness?.navigationDecision || {}
  const navigationMountAction = generationReadiness?.navigationMountAction || {}
  const hostFamily = resolveHostFamily(hostProfile, formalNavigation, navigationDecision)
  const publishMechanism = resolvePublishMechanism(
    hostProfile,
    formalNavigation,
    navigationMountAction
  )
  const projectEntryMountCapability = summarizeProjectEntryMountCapability(
    generationReadiness?.projectEntryMountCapability || {}
  )
  const evidenceFiles = buildEvidenceFiles(
    hostProfile,
    formalNavigation,
    navigationMountAction,
    projectEntryMountCapability
  )
  const fingerprint = await hashProjectFiles(targetRoot, evidenceFiles)
  const defaultBusinessPageDir = inferBusinessPageDir(formalNavigation)
  const hostExecutionAdapter = buildProjectMfDirectExposeLegacyAdapter({
    generationReadiness,
    defaultBusinessPageDir,
  })
  const managedLocalRuntime = await inspectManagedLocalRuntimeMaterialization(targetRoot)
  const executionContract = buildProjectExecutionContract({
    hostFamily,
    formalNavigation,
    defaultBusinessPageDir,
    hostExecutionAdapter,
    projectEntryMountCapability,
  })

  return {
    schema: 'hiui-design-project-host-contract.v1',
    generatedAt: new Date().toISOString(),
    status: normalizeString(generationReadiness?.status) || 'unknown',
    reason: normalizeString(generationReadiness?.reason),
    mode: normalizeString(generationReadiness?.mode),
    hostFamily,
    publishMechanism,
    defaultBusinessPageDir,
    executionContract,
    hostExecutionAdapter,
    hostProfile: summarizeHostProfile(hostProfile),
    managedLocalRuntime,
    formalNavigation: cloneJson(formalNavigation || {}),
    projectEntryMountCapability,
    evidenceFiles,
    fingerprint: {
      algorithm: 'sha256',
      source: evidenceFiles.length > 0 ? 'host-evidence-files' : 'missing',
      value: fingerprint,
    },
  }
}

export async function writeProjectHostContract({ targetRoot, generationReadiness } = {}) {
  const outputRoot = resolveProjectContextPath(targetRoot, 'outputs')
  await fs.mkdir(outputRoot, { recursive: true })
  const contractPath = resolveProjectContextPath(targetRoot, 'outputs', PROJECT_HOST_CONTRACT_FILENAME)
  const contract = await buildProjectHostContract({ targetRoot, generationReadiness })
  await fs.writeFile(contractPath, `${JSON.stringify(contract, null, 2)}\n`, 'utf8')

  return {
    contract,
    contractPath,
  }
}

export async function refreshProjectHostContractFingerprint({
  targetRoot,
  projectHostContract = undefined,
  generatedAt = new Date().toISOString(),
} = {}) {
  const outputRoot = resolveProjectContextPath(targetRoot, 'outputs')
  await fs.mkdir(outputRoot, { recursive: true })
  const contractPath = resolveProjectContextPath(targetRoot, 'outputs', PROJECT_HOST_CONTRACT_FILENAME)
  const providedContractLooksComplete = projectHostContractLooksComplete(projectHostContract)
  const existingContract =
    projectHostContract === undefined || !providedContractLooksComplete
      ? await readProjectHostContract(targetRoot)
      : projectHostContract

  if (!existingContract || typeof existingContract !== 'object') {
    return {
      contract: null,
      contractPath,
      refreshed: false,
    }
  }

  const evidenceFiles = uniqueRelativePaths(existingContract.evidenceFiles || [])
  const fingerprintValue = await hashProjectFiles(targetRoot, evidenceFiles)
  const nextContract = {
    ...cloneJson(existingContract),
    generatedAt: normalizeString(generatedAt) || new Date().toISOString(),
    evidenceFiles,
    fingerprint: {
      algorithm: 'sha256',
      source: evidenceFiles.length > 0 ? 'host-evidence-files' : 'missing',
      value: fingerprintValue,
    },
  }

  await fs.writeFile(contractPath, `${JSON.stringify(nextContract, null, 2)}\n`, 'utf8')

  return {
    contract: nextContract,
    contractPath,
    refreshed: true,
  }
}

export async function settleProjectHostContractAfterManagedWrite({
  targetRoot,
  projectHostContract = undefined,
  navigationMountAction = null,
  requestedBusiness = null,
  hostShellDecision = null,
  hostExecutionAdapter = null,
  generatedAt = new Date().toISOString(),
} = {}) {
  const contractPath = resolveProjectContextPath(targetRoot, 'outputs', PROJECT_HOST_CONTRACT_FILENAME)
  const existingContract =
    projectHostContract === undefined || !projectHostContractLooksComplete(projectHostContract)
      ? await readProjectHostContract(targetRoot)
      : projectHostContract
  const settlement = settleProjectHostContractPayload({
    projectHostContract: existingContract,
    navigationMountAction,
    requestedBusiness,
    hostShellDecision,
    hostExecutionAdapter,
  })

  if (!settlement.updated || !settlement.contract) {
    return {
      updated: false,
      reason: settlement.reason,
      contract: settlement.contract || existingContract || null,
      contractPath,
    }
  }

  const nextContract = {
    ...settlement.contract,
    generatedAt: normalizeString(generatedAt) || new Date().toISOString(),
    fingerprint: {
      algorithm: 'sha256',
      source: settlement.contract.evidenceFiles?.length > 0 ? 'host-evidence-files' : 'missing',
      value: await hashProjectFiles(targetRoot, settlement.contract.evidenceFiles || []),
    },
  }
  await fs.writeFile(contractPath, `${JSON.stringify(nextContract, null, 2)}\n`, 'utf8')

  return {
    updated: true,
    reason: settlement.reason,
    contract: nextContract,
    contractPath,
  }
}

export async function readProjectHostContract(targetRoot) {
  const contractPath = resolveProjectContextPath(targetRoot, 'outputs', PROJECT_HOST_CONTRACT_FILENAME)
  recordScanEvent('read-project-host-contract', {
    targetRoot: path.resolve(targetRoot),
    contractPath,
  })
  try {
    return JSON.parse(await fs.readFile(contractPath, 'utf8'))
  } catch {
    return null
  }
}
