import fs from 'node:fs/promises'
import path from 'node:path'

import {
  LEGACY_MF_SHARED_CONTRACT_BLOCKER_ID,
  LEGACY_MF_SHARED_CONTRACT_PREWRITE_ACTION,
  inspectLegacyMfSharedContractRepair,
  isLegacyMfSharedContractPageType,
} from './legacy-mf-shared-contract-autofix.mjs'
import { loadPageFamilyWorkflowManifest } from './load-page-family-workflow-manifest.mjs'
import { loadPageTypeManifest } from './load-page-type-manifest.mjs'
import { resolveRequiredImports } from './page-template-sanity.mjs'
import { buildLifecycleProfile } from './page-task-status.mjs'
import {
  FULL_PAGE_DETAIL_RUNTIME_SMOKE_BLOCKER_ID,
  inspectPageTypeRuntimeSmoke,
} from './page-type-runtime-smoke.mjs'
import { resolveHostGenerationContract } from './resolve-host-generation-contract.mjs'
import {
  AI_GENERATION_READY_CONTEXT_FILENAME,
  PAGE_TYPE_CAPABILITY_REPORT_FILENAME,
  PROJECT_HOST_CONTRACT_FILENAME,
  PROJECT_STATE_SUMMARY_FILENAME,
  getContextDocPath,
  getContextOutputPath,
  resolveProjectContextPath,
} from './skill-identity.mjs'
import { readProjectHostContract } from './project-host-contract.mjs'

const DEFAULT_FORBIDDEN_FALLBACKS = [
  {
    id: 'handwritten-page-from-existing-business-source',
    detail: 'Do not start from an existing business page or handwritten blank page instead of the official base template.',
  },
  {
    id: 'PageTable-or-empty-page-fallback',
    detail: 'Do not downgrade a typical page into PageTable or an empty page scaffold.',
  },
  {
    id: 'preview-runtime-example-as-formal-page',
    detail:
      'Do not copy legacy src/typical-page-preview assets or official preview reference files into formal business output.',
  },
  {
    id: 'route-menu-mf-window-addPage-guessing-before-ensure',
    detail: 'Do not guess route, menu, Module Federation exposes, or window.addPage registration before the project page-task gate is ready.',
  },
]

const MANAGED_HOST_CONTRACT_CHECK_ID = 'managed-host-contract'

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStringArray(values) {
  return Array.isArray(values)
    ? values.map((value) => normalizeString(value)).filter(Boolean)
    : []
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

function cloneJsonOrDefault(value, fallback) {
  return value === undefined ? cloneJson(fallback) : cloneJson(value)
}

function buildRequiredDocsSnapshot(manifest = {}, pageType = {}) {
  return [...new Set([
    normalizeString(manifest?.principlesDoc),
    normalizeString(manifest?.routerDoc),
    'docs/generation/page-generation-workflow.md',
    normalizeString(manifest?.registryDoc),
    normalizeString(pageType?.docEntry),
    ...normalizeStringArray(pageType?.sharedDocs),
  ].filter(Boolean))]
}

function buildPageTypeManifestSnapshot({
  manifestPath = '',
  baseManifestPath = '',
  overlayPath = '',
  lineId = '',
  manifest = {},
} = {}) {
  return {
    manifestPath: normalizeString(manifestPath),
    baseManifestPath: normalizeString(baseManifestPath),
    overlayPath: normalizeString(overlayPath),
    lineId: normalizeString(lineId),
    principlesDoc: normalizeString(manifest?.principlesDoc),
    routerDoc: normalizeString(manifest?.routerDoc),
    registryDoc: normalizeString(manifest?.registryDoc),
  }
}

function buildProjectHostContextSnapshot(projectHostContract = null) {
  if (!projectHostContract || typeof projectHostContract !== 'object' || Array.isArray(projectHostContract)) {
    return {
      status: 'missing',
      reason: 'Project host contract snapshot is not available in the current target project.',
      hostFamily: '',
      publishMechanism: '',
      defaultBusinessPageDir: '',
      managedLocalRuntime: {
        status: 'missing',
        materialized: false,
        root: '',
        entryPath: '',
        stylePath: '',
        blockedBy: ['missing-project-host-contract'],
        missingPaths: [],
        reason: 'Project host contract snapshot is not available in the current target project.',
      },
      formalNavigation: {},
      executionContract: {},
      hostExecutionAdapter: {},
    }
  }

  const formalNavigation =
    projectHostContract.formalNavigation &&
    typeof projectHostContract.formalNavigation === 'object' &&
    !Array.isArray(projectHostContract.formalNavigation)
      ? projectHostContract.formalNavigation
      : {}

  return {
    status: 'ready',
    reason: '',
    hostFamily: normalizeString(projectHostContract.hostFamily),
    publishMechanism: normalizeString(projectHostContract.publishMechanism),
    defaultBusinessPageDir: normalizeString(projectHostContract.defaultBusinessPageDir),
    managedLocalRuntime: cloneJsonOrDefault(projectHostContract.managedLocalRuntime, {
      status: 'missing',
      materialized: false,
      root: '',
      entryPath: '',
      stylePath: '',
      blockedBy: [],
      missingPaths: [],
      reason: '',
    }),
    formalNavigation: {
      formalShellPath: normalizeString(formalNavigation.formalBusinessShellPath),
      routeRegistryPath: normalizeString(formalNavigation.formalNavigationRegistryPath),
      routeRegistryKind: normalizeString(formalNavigation.formalNavigationRegistryKind),
      routeRegistryAutoMountSupported: formalNavigation.formalNavigationRegistryAutoMountSupported === true,
      routeRegistrySupportReason: normalizeString(formalNavigation.formalNavigationRegistrySupportReason),
      implicitFeatureBaseDir: normalizeString(formalNavigation.implicitFeatureBaseDir),
      implicitFeatureRegistryPath: normalizeString(formalNavigation.implicitFeatureRegistryPath),
      implicitFeatureEntryPattern: normalizeString(formalNavigation.implicitFeatureEntryPattern),
      selectedBusinessEntryPath: normalizeString(formalNavigation.selectedBusinessEntryPath),
      selectedBusinessEntryKind: normalizeString(formalNavigation.selectedBusinessEntryKind),
      selectedPublishEntryPath: normalizeString(formalNavigation.selectedPublishEntryPath),
      selectedPublishEntryKind: normalizeString(formalNavigation.selectedPublishEntryKind),
      businessEntrySelectionBlocked: formalNavigation.businessEntrySelectionBlocked === true,
      businessEntrySelectionBlockReason: normalizeString(formalNavigation.businessEntrySelectionBlockReason),
    },
    executionContract: cloneJsonOrDefault(projectHostContract.executionContract, {}),
    hostExecutionAdapter: cloneJsonOrDefault(projectHostContract.hostExecutionAdapter, {}),
  }
}

function createLocalBlocker(id, detail) {
  return {
    id,
    detail,
  }
}

function normalizePublicShellLayer(layer = {}, options = {}) {
  const issues = Array.isArray(layer?.issues)
    ? layer.issues.map((issue) => ({
        kind: normalizeString(issue?.kind) || 'unknown',
        detail: normalizeString(issue?.detail) || 'Public shell compatibility issue detected.',
        filePath: normalizeString(issue?.filePath),
      }))
    : []

  return {
    status: normalizeString(layer?.status) || normalizeString(options.defaultStatus) || 'not-checked',
    reason:
      normalizeString(layer?.reason) ||
      normalizeString(options.defaultReason) ||
      'Public shell compatibility was not evaluated.',
    entryFile: normalizeString(layer?.entryFile),
    styleFiles: normalizeStringArray(layer?.styleFiles),
    issueCount: Number.isFinite(layer?.issueCount) ? layer.issueCount : issues.length,
    blockedBy: normalizeStringArray(layer?.blockedBy),
    issues,
    required: layer?.required === true,
    deliveryContract: normalizeString(layer?.deliveryContract),
    targetEntryKind: normalizeString(layer?.targetEntryKind),
    targetEntryPath: normalizeString(layer?.targetEntryPath),
    expectedShellStyleImport: normalizeString(layer?.expectedShellStyleImport),
  }
}

function normalizePublicShell(publicShell = {}) {
  const projectEntryShell = normalizePublicShellLayer(publicShell?.projectEntryShell || publicShell)
  const mfPublishEntryShell = normalizePublicShellLayer(publicShell?.mfPublishEntryShell, {
    defaultStatus: 'not-applicable',
    defaultReason: 'Managed Module Federation publish-entry shell delivery is not required.',
  })
  return {
    ...projectEntryShell,
    reason:
      normalizeString(publicShell?.reason) ||
      projectEntryShell.reason ||
      'Public shell compatibility was not evaluated.',
    projectEntryShell,
    projectEntryShellReady:
      publicShell?.projectEntryShellReady === true || projectEntryShell.status === 'ready',
    projectEntryShellReason:
      normalizeString(publicShell?.projectEntryShellReason) || projectEntryShell.reason,
    projectEntryShellBlockedBy:
      normalizeStringArray(publicShell?.projectEntryShellBlockedBy).length > 0
        ? normalizeStringArray(publicShell?.projectEntryShellBlockedBy)
        : projectEntryShell.blockedBy,
    mfPublishEntryShell,
    mfPublishEntryShellRequired:
      publicShell?.mfPublishEntryShellRequired === true || mfPublishEntryShell.required === true,
    mfPublishEntryShellReady:
      publicShell?.mfPublishEntryShellReady === true || mfPublishEntryShell.status === 'ready',
    mfPublishEntryShellReason:
      normalizeString(publicShell?.mfPublishEntryShellReason) || mfPublishEntryShell.reason,
    mfPublishEntryShellBlockedBy:
      normalizeStringArray(publicShell?.mfPublishEntryShellBlockedBy).length > 0
        ? normalizeStringArray(publicShell?.mfPublishEntryShellBlockedBy)
        : mfPublishEntryShell.blockedBy,
  }
}

function isProjectScopedPublicShellReady(publicShell = {}) {
  const projectEntryShellReady =
    publicShell?.projectEntryShellReady === true || publicShell?.projectEntryShell?.status === 'ready'

  return projectEntryShellReady
}

function resolveProjectScopedPublicShellBlockedBy(publicShell = {}) {
  if (
    publicShell?.projectEntryShellReady !== true &&
    normalizeString(publicShell?.projectEntryShell?.status) !== 'ready'
  ) {
    return normalizeStringArray(publicShell?.projectEntryShell?.blockedBy || publicShell?.blockedBy)
  }

  return []
}

function normalizeFormalHostProfile(profile = {}) {
  return {
    layoutMode: normalizeString(profile?.layoutMode) || 'unknown',
    headerSlotPolicy: normalizeString(profile?.headerSlotPolicy) || 'unknown',
    hostProviderBridge: profile?.hostProviderBridge === true,
    continuousHeightChain: profile?.continuousHeightChain === true,
    contentOutletPath: normalizeString(profile?.contentOutletPath),
    scrollOwner: normalizeString(profile?.scrollOwner) || 'unknown',
    rightViewportGutterPx: Number.isFinite(profile?.rightViewportGutterPx)
      ? profile.rightViewportGutterPx
      : 0,
    leftGapPxWhenMenuCollapsed: Number.isFinite(profile?.leftGapPxWhenMenuCollapsed)
      ? profile.leftGapPxWhenMenuCollapsed
      : 0,
    evidenceFiles: normalizeStringArray(profile?.evidenceFiles),
  }
}

function normalizeManagedHostContract(contract = {}) {
  return {
    status: normalizeString(contract?.status) || 'missing',
    contractPath: normalizeString(contract?.contractPath),
    contractRelativePath: normalizeString(contract?.contractRelativePath),
    reason: normalizeString(contract?.reason),
    errors: normalizeStringArray(contract?.errors),
    evidenceFiles: normalizeStringArray(contract?.evidenceFiles),
  }
}

function resolveFormalHostEvidenceSource({ managedHostContract, formalHostProfile }) {
  if (managedHostContract.status === 'valid') return 'managed-host-contract'
  if (managedHostContract.status === 'invalid') return 'managed-host-contract-invalid'
  if ((formalHostProfile?.evidenceFiles || []).length > 0) return 'source-heuristics'
  return 'unknown'
}

function normalizeFormalShellMigration(migration = {}) {
  return {
    status: normalizeString(migration?.status) || 'not-applicable',
    required: migration?.required === true,
    kind: normalizeString(migration?.kind),
    blockingMode: normalizeString(migration?.blockingMode) || 'none',
    reason: normalizeString(migration?.reason),
    targetShellPath: normalizeString(migration?.targetShellPath),
    targetCorePath: normalizeString(migration?.targetCorePath),
    targetHostResetPath: normalizeString(migration?.targetHostResetPath),
    preferredExtension: normalizeString(migration?.preferredExtension),
    referenceAppFrameCorePath: normalizeString(migration?.referenceAppFrameCorePath),
    managedHostImportSource: normalizeString(migration?.managedHostImportSource),
    recommendedStrategy: normalizeString(migration?.recommendedStrategy),
    recommendedSteps: normalizeStringArray(migration?.recommendedSteps),
    evidence: normalizeStringArray(migration?.evidence),
  }
}

function buildFormalHostCompatibility(hostCompatibility = {}) {
  const formalHostProfile = normalizeFormalHostProfile(hostCompatibility?.formalHostProfile)
  const managedHostContract = normalizeManagedHostContract(hostCompatibility?.managedHostContract)
  const evidenceSource = resolveFormalHostEvidenceSource({
    managedHostContract,
    formalHostProfile,
  })
  const hasSharedHeaderLayout = formalHostProfile.layoutMode === 'shared-header-layout'
  const hasCompatibleSharedHeaderSlot =
    formalHostProfile.headerSlotPolicy === 'no-header-slot' ||
    formalHostProfile.headerSlotPolicy === 'collapses-when-empty'
  const hasRequiredSharedContentGutter =
    !hasSharedHeaderLayout || formalHostProfile.rightViewportGutterPx >= 16
  const canSupportSelfContainedShell =
    formalHostProfile.continuousHeightChain &&
    hasRequiredSharedContentGutter &&
    (formalHostProfile.layoutMode === 'self-contained-hiui-shell' || hasCompatibleSharedHeaderSlot)

  if (managedHostContract.status === 'invalid') {
    return {
      status: 'blocked',
      reason:
        managedHostContract.reason ||
        'Managed host contract exists but is invalid, so formal host compatibility remains blocked.',
      blockingCheckIds: [MANAGED_HOST_CONTRACT_CHECK_ID],
      formalHostProfile,
      managedHostContract,
      evidenceSource,
    }
  }

  if (hasSharedHeaderLayout && hasCompatibleSharedHeaderSlot && formalHostProfile.continuousHeightChain) {
    return {
      status: 'ready',
      reason:
        managedHostContract.status === 'valid'
          ? managedHostContract.reason
          : 'Formal host proves a shared header layout whose shared header slot collapses when unused, preserves a continuous outlet height chain, and keeps the required 16px shared content gutter for self-contained page shells.',
      blockingCheckIds: [],
      formalHostProfile,
      managedHostContract,
      evidenceSource,
    }
  }

  if (canSupportSelfContainedShell) {
    return {
      status: 'ready',
      reason:
        managedHostContract.status === 'valid'
          ? managedHostContract.reason
          : 'Formal host proves a continuous height chain and does not require a shared host header slot for self-contained page shells.',
      blockingCheckIds: [],
      formalHostProfile,
      managedHostContract,
      evidenceSource,
    }
  }

  return {
    status: 'not-checked',
    reason:
      'Formal host compatibility remains advisory at project scope. Use page-level mount checks and doctor or legacy host audit when an existing shared host layout needs explicit compatibility proof.',
    blockingCheckIds: [],
    formalHostProfile,
    managedHostContract,
    evidenceSource,
  }
}

function buildAiGenerationBlockedBy({ globalBlockers, pageTaskReadiness }) {
  const blockedBy = globalBlockers.map((item) => item.id)

  if (pageTaskReadiness !== 'ready-to-generate') {
    blockedBy.push('project-page-task-gate-not-ready')
  }

  return [...new Set(blockedBy.filter(Boolean))]
}

function buildProjectNavigationSupport({
  navigationDecision,
  navigationMountDecision,
  navigationMountAction: _navigationMountAction,
  pageTaskReadiness,
}) {
  const readyToGenerate = pageTaskReadiness === 'ready-to-generate'
  const supportedMountKinds = [...new Set(
    [
      normalizeString(navigationDecision?.mountPointKind),
      normalizeString(navigationMountDecision?.mountPointKind),
      normalizeString(navigationMountDecision?.routeRegistryKind),
      normalizeString(navigationMountDecision?.businessEntryKind),
      ...normalizeStringArray(navigationDecision?.navigationEvidenceKinds),
      ...normalizeStringArray(navigationDecision?.businessEntryEvidenceKinds),
    ].filter(Boolean)
  )]
  const deferredReason =
    'This output is project-scoped. hiui-design only records which navigation mount mechanisms the host supports here; a concrete navigation mount decision/action is derived later when a page brief provides route, title, dest, expose name, or an explicit navigationMountContract.'
  const projectScopedDeferred =
    readyToGenerate && navigationDecision?.navigationBlocked !== true

  return {
    status: !readyToGenerate
      ? 'blocked-by-project-gate'
      : navigationDecision?.navigationBlocked === true
        ? 'needs-page-brief'
        : navigationDecision?.mountPointConfirmed === true
          ? 'mechanism-confirmed'
          : 'not-proven',
    pageBindingStatus: 'not-bound',
    pageBindingDeferred: true,
    mountMechanismConfirmed: navigationDecision?.mountPointConfirmed === true,
    selectedMountSource:
      projectScopedDeferred
        ? ''
        : normalizeString(navigationDecision?.selectedMountSource) ||
          normalizeString(navigationMountDecision?.selectedMountSource) ||
          'unknown',
    requiredRegistrationMode: projectScopedDeferred
      ? 'defer-until-page-brief'
      : normalizeString(navigationDecision?.requiredRegistrationMode) || 'none',
    supportedMountKinds,
    routeRegistryPath:
      normalizeString(navigationDecision?.formalNavigationRegistryPath) ||
      normalizeString(navigationMountDecision?.routeRegistryPath),
    businessEntryPath:
      normalizeString(navigationDecision?.selectedBusinessEntryPath) ||
      normalizeString(navigationMountDecision?.businessEntryPath),
    legacyMountEntryPath:
      normalizeString(navigationDecision?.selectedLegacyMountEntryPath),
    legacyMountEntryKind:
      normalizeString(navigationDecision?.selectedLegacyMountEntryKind),
    publishEntryPath: normalizeString(navigationDecision?.selectedPublishEntryPath),
    publishEntryKind: normalizeString(navigationDecision?.selectedPublishEntryKind),
    formalShellPath:
      normalizeString(navigationDecision?.formalBusinessShellPath) ||
      normalizeString(navigationMountDecision?.formalShellPath),
    navigationEvidenceKinds: normalizeStringArray(navigationDecision?.navigationEvidenceKinds),
    businessEntryEvidenceKinds: normalizeStringArray(navigationDecision?.businessEntryEvidenceKinds),
    reason: readyToGenerate
      ? deferredReason
      : normalizeString(navigationDecision?.blockReason) || deferredReason,
  }
}

function resolveProjectExecutionReadiness({
  readyToGenerate,
  rawExecutionReadiness,
  navigationSupport,
}) {
  const rawExecutionStatus = normalizeString(rawExecutionReadiness?.status)
  const rawExecutionBlockedBy = normalizeStringArray(rawExecutionReadiness?.blockedBy)
  const rawExecutionHasConcreteBlocker =
    rawExecutionBlockedBy.length > 0 ||
    (rawExecutionStatus && !['ready', 'not-checked'].includes(rawExecutionStatus))

  if (!readyToGenerate) {
    return {
      executionStatus: rawExecutionStatus,
      executionBlockedBy: rawExecutionBlockedBy,
      readyToExecute: false,
      executionReason: normalizeString(rawExecutionReadiness?.reason),
      executionNextAction: normalizeString(rawExecutionReadiness?.nextAction),
      executionNextCommand: normalizeString(rawExecutionReadiness?.nextCommand),
    }
  }

  if (rawExecutionHasConcreteBlocker) {
    return {
      executionStatus: rawExecutionStatus || 'runtime-blocked',
      executionBlockedBy: rawExecutionBlockedBy,
      readyToExecute: false,
      executionReason: normalizeString(rawExecutionReadiness?.reason),
      executionNextAction: normalizeString(rawExecutionReadiness?.nextAction),
      executionNextCommand: normalizeString(rawExecutionReadiness?.nextCommand),
    }
  }

  return {
    executionStatus: 'awaiting-requested-page-type',
    executionBlockedBy: ['requested-page-type-not-bound'],
    readyToExecute: false,
    executionReason: navigationSupport.reason,
    executionNextAction: 'create-generation-brief',
    executionNextCommand: '',
  }
}

function buildFormalShellStatus({
  formalNavigation = {},
  hostProfile = {},
  navigationDecision = {},
} = {}) {
  const formalBusinessShellExists = formalNavigation?.formalBusinessShellExists === true
  const formalNavigationRegistryExists = formalNavigation?.formalNavigationRegistryExists === true
  const implicitFeatureRegistryExists = formalNavigation?.implicitFeatureRegistryExists === true
  const formalBusinessShellPath = normalizeString(formalNavigation?.formalBusinessShellPath)
  const formalNavigationRegistryPath = normalizeString(formalNavigation?.formalNavigationRegistryPath)
  const implicitFeatureBaseDir = normalizeString(formalNavigation?.implicitFeatureBaseDir)
  const implicitFeatureEntryPattern = normalizeString(formalNavigation?.implicitFeatureEntryPattern)
  const shellCertification = normalizeString(formalNavigation?.shellCertification) || 'missing'
  const shellCertificationEvidence = normalizeStringArray(formalNavigation?.shellCertificationEvidence)
  const formalShellMigration = normalizeFormalShellMigration(formalNavigation?.formalShellMigration)
  const ambiguousFormalNavigationEvidencePaths = normalizeStringArray(
    formalNavigation?.ambiguousFormalNavigationEvidencePaths
  )
  const projectType = normalizeString(hostProfile?.projectType)
  const mountPointConfirmed = navigationDecision?.mountPointConfirmed === true
  const navigationBlocked = navigationDecision?.navigationBlocked === true
  const canReuseConfirmedExistingMount =
    projectType === 'existing-system' && mountPointConfirmed && navigationBlocked !== true
  const blockedBy = []

  const withSharedFields = (payload) => ({
    ...payload,
    formalBusinessShellExists,
    formalNavigationRegistryExists,
    formalBusinessShellPath,
    formalNavigationRegistryPath,
    implicitFeatureRegistryExists,
    implicitFeatureBaseDir,
    implicitFeatureEntryPattern,
    shellCertification,
    shellCertificationEvidence,
    formalShellMigration,
    migrationStatus: formalShellMigration.status,
    migrationRequired: formalShellMigration.required,
    migrationKind: formalShellMigration.kind,
    migrationReason: formalShellMigration.reason,
    migrationTargetShellPath: formalShellMigration.targetShellPath,
    migrationTargetCorePath: formalShellMigration.targetCorePath,
    migrationReferenceAppFrameCorePath: formalShellMigration.referenceAppFrameCorePath,
    migrationRecommendedSteps: formalShellMigration.recommendedSteps,
    ambiguousFormalNavigationEvidencePaths,
    shellCertificationMarker: normalizeString(formalNavigation?.shellCertificationMarker),
    requiredNavigationStyleReference: normalizeString(formalNavigation?.requiredNavigationStyleReference),
  })

  if (!formalBusinessShellExists && !formalNavigationRegistryExists && ambiguousFormalNavigationEvidencePaths.length === 0) {
    if (canReuseConfirmedExistingMount) {
      return withSharedFields({
        status: 'not-required-for-current-mount',
        ready: true,
        writeBlocking: false,
        blockedBy: [],
        diagnosticBy: [],
        reason:
          'The current existing-system project already has a confirmed page mount point. A managed formal shell is not required for this page task.',
      })
    }

    return withSharedFields({
      status: 'missing',
      ready: false,
      writeBlocking: false,
      reason:
        'Formal business shell and formal navigation registry are not present yet. Formal business navigation has not been established in the current project.',
      blockedBy: ['missing-formal-shell'],
      diagnosticBy: [],
    })
  }

  if (
    implicitFeatureRegistryExists &&
    !formalBusinessShellExists &&
    shellCertification === 'missing'
  ) {
    return withSharedFields({
      status: 'not-required-for-current-mount',
      ready: true,
      writeBlocking: false,
      reason:
        'Existing project navigation auto-discovers feature entry modules. A separate managed formal business shell is not required for page mounting in this host profile.',
      blockedBy: [],
      diagnosticBy: [],
    })
  }

  if (!formalBusinessShellExists) blockedBy.push('missing-formal-business-shell')
  if (!formalNavigationRegistryExists) blockedBy.push('missing-formal-navigation-registry')
  if (shellCertification !== 'certified-existing') blockedBy.push('uncertified-formal-shell')
  if (ambiguousFormalNavigationEvidencePaths.length > 0) {
    blockedBy.push('ambiguous-formal-navigation-evidence')
  }

  if (
    canReuseConfirmedExistingMount &&
    !formalBusinessShellExists &&
    shellCertification === 'missing'
  ) {
    return withSharedFields({
      status: 'not-required-for-current-mount',
      ready: true,
      writeBlocking: false,
      blockedBy: [],
      diagnosticBy: [],
      reason:
        'The current existing-system project already has a confirmed page mount point. The current mount path does not require a managed formal shell.',
    })
  }

  if (canReuseConfirmedExistingMount && blockedBy.length > 0) {
    const diagnosticReason =
      shellCertification === 'uncertified-existing'
        ? formalShellMigration.reason ||
          'The current formal shell is not certified as an official managed host shell.'
        : 'The current formal shell still has incomplete governance evidence.'

    return withSharedFields({
      status: 'warning',
      ready: false,
      writeBlocking: false,
      blockedBy: [],
      diagnosticBy: [...new Set(blockedBy)],
      reason: `A confirmed existing-system mount point already exists, so page source generation may continue. Keep the current formal shell finding as governance guidance only. ${diagnosticReason}`.trim(),
    })
  }

  if (blockedBy.length === 0) {
    return withSharedFields({
      status: 'ready',
      ready: true,
      writeBlocking: false,
      reason:
        'Formal business shell and formal navigation registry are present, and the shell is certified as an official managed host shell.',
      blockedBy: [],
      diagnosticBy: [],
    })
  }

  return withSharedFields({
    status: 'blocked',
    ready: false,
    writeBlocking: true,
    reason:
      shellCertification === 'uncertified-existing'
        ? formalShellMigration.reason ||
          'Formal navigation evidence exists, but the current shell is not certified as an official managed host shell.'
        : 'Formal navigation evidence is incomplete. Formal business shell and registry must both exist and remain certified before formal navigation can be considered ready.',
    blockedBy: [...new Set(blockedBy)],
    diagnosticBy: [],
  })
}

function resolveProjectWriteReadiness(pageTaskReadiness) {
  return pageTaskReadiness === 'ready-to-generate'
    ? 'awaiting-requested-page-type'
    : 'blocked-by-project-gate'
}

function normalizeHostCapabilityContract(contract = {}) {
  return {
    requiresTypicalPageHostProvider: contract?.requiresTypicalPageHostProvider === true,
    requiresHeaderPortalCarrier: contract?.requiresHeaderPortalCarrier === true,
    requiresContinuousHeightChain: contract?.requiresContinuousHeightChain === true,
    headerOwnership: normalizeString(contract?.headerOwnership) || 'unknown',
    compatibleHostHeaderSlotPolicies: normalizeStringArray(contract?.compatibleHostHeaderSlotPolicies),
  }
}

function buildPageTypeHostLocalBlockers({
  pageTypeId,
  hostCapabilityContract,
  formalHostCompatibility,
  navigationMountDecision,
  navigationMountAction,
}) {
  const blockers = []
  const managedHostContractStatus = normalizeString(formalHostCompatibility?.managedHostContract?.status)
  const managedHostContractReason = normalizeString(formalHostCompatibility?.managedHostContract?.reason)

  if (normalizeString(hostCapabilityContract?.headerOwnership) !== 'self-contained') {
    return blockers
  }

  if (
    normalizeString(navigationMountDecision?.action) === 'attach-existing' &&
    normalizeString(navigationMountAction?.action) === 'materialize-mf-publish-entry' &&
    managedHostContractStatus === 'invalid'
  ) {
    blockers.push(
      createLocalBlocker(
        'invalid-managed-mf-host-contract',
        `Page type "${pageTypeId}" cannot use the managed Module Federation host-contract autofix because the existing managed host contract is invalid.${managedHostContractReason ? ` ${managedHostContractReason}` : ''}`
      )
    )
  }

  return blockers
}

function toRelativeOutputPath(filename) {
  return getContextOutputPath(filename)
}

function buildProjectStateSummary({
  generatedAt,
  targetRoot,
  capabilityReport,
  aiGenerationReadyContext,
  pageTaskStatus,
}) {
  return {
    schema: 'hiui-design-project-state-summary.v1',
    generatedAt,
    targetRoot,
    lifecycleProfile: cloneJson(aiGenerationReadyContext.lifecycleProfile),
    integrationReadiness: cloneJson(pageTaskStatus?.integrationReadiness || {}),
    pageTaskGate: {
      pageTaskReadiness: normalizeString(pageTaskStatus?.pageTaskReadiness) || 'ensure-only',
      integrationComplete: Boolean(pageTaskStatus?.integrationComplete),
      userVisibleState: normalizeString(pageTaskStatus?.userVisibleState) || 'materialized-only',
      reason: normalizeString(pageTaskStatus?.reason),
      nextCommand: normalizeString(pageTaskStatus?.nextCommand),
      allowedActions: normalizeStringArray(pageTaskStatus?.allowedActions),
      forbiddenActions: normalizeStringArray(pageTaskStatus?.forbiddenActions),
    },
    projectState: {
      readyToGenerate: aiGenerationReadyContext.readyToGenerate === true,
      writeReadiness: normalizeString(aiGenerationReadyContext.writeReadiness) || 'blocked-by-project-gate',
      requestedPageTypeBindingStatus:
        normalizeString(aiGenerationReadyContext.requestedPageTypeBindingStatus) || 'not-bound',
      managedLocalRuntimeStatus:
        normalizeString(aiGenerationReadyContext.managedLocalRuntime?.status) || 'missing',
      managedLocalRuntimeMaterialized:
        aiGenerationReadyContext.managedLocalRuntime?.materialized === true,
      blockedBy: normalizeStringArray(aiGenerationReadyContext.blockedBy),
    },
    hostProfile: cloneJson(aiGenerationReadyContext.hostProfile || {}),
    managedLocalRuntime: cloneJson(aiGenerationReadyContext.managedLocalRuntime || {}),
    publicShell: cloneJson(aiGenerationReadyContext.publicShell),
    formalShell: cloneJson(aiGenerationReadyContext.formalShell),
    formalHostCompatibility: cloneJson(aiGenerationReadyContext.formalHostCompatibility),
    navigation: {
      support: cloneJson(aiGenerationReadyContext.navigationSupport || {}),
    },
    pageTypes: {
      allowedCount: capabilityReport.summary.allowedPageTypeCount,
      conditionalCount: capabilityReport.summary.conditionalPageTypeCount,
      blockedCount: capabilityReport.summary.blockedPageTypeCount,
      allowedIds: cloneJson(capabilityReport.summary.allowedPageTypeIds),
      conditionalIds: cloneJson(capabilityReport.summary.conditionalPageTypeIds),
      blockedIds: cloneJson(capabilityReport.summary.blockedPageTypeIds),
    },
    outputs: {
      projectPageTaskStatus: toRelativeOutputPath('PROJECT_PAGE_TASK_STATUS.json'),
      pageTypeCapabilityReport: toRelativeOutputPath(PAGE_TYPE_CAPABILITY_REPORT_FILENAME),
      aiGenerationReadyContext: toRelativeOutputPath(AI_GENERATION_READY_CONTEXT_FILENAME),
      projectHostContract: toRelativeOutputPath(PROJECT_HOST_CONTRACT_FILENAME),
      projectStateSummary: toRelativeOutputPath(PROJECT_STATE_SUMMARY_FILENAME),
    },
  }
}

function summarizeEntry(entry) {
  return {
    id: entry.id,
    label: entry.label,
    pageFamily: entry.pageFamily,
    kind: entry.kind,
    whenToUse: cloneJsonOrDefault(entry.whenToUse, []),
    shell: entry.shell,
    status: entry.status,
    blockedBy: entry.blockedBy,
    conditionalBlockedBy: entry.conditionalBlockedBy,
    reason: entry.reason,
    preWriteAction: entry.preWriteAction,
    preWriteActionReason: entry.preWriteActionReason,
    baseTemplatePath: entry.baseTemplatePath,
    requiredShell: entry.requiredShell,
    runtimeExamplePath: entry.runtimeExamplePath,
    globalPreviewRoute: entry.globalPreviewRoute,
    smokePath: entry.smokePath,
    businessSlots: entry.businessSlots,
    requiredSlots: entry.requiredSlots,
    lockedRegions: entry.lockedRegions,
    generationNotes: entry.generationNotes,
    generationContract: cloneJsonOrDefault(entry.generationContract, {}),
    requiredDocs: cloneJsonOrDefault(entry.requiredDocs, []),
    requiredHostCapabilities: entry.requiredHostCapabilities,
    generationWorkflow: entry.generationWorkflow,
    runtimeSmokeStatus: normalizeString(entry?.runtimeSmoke?.status) || 'not-applicable',
    runtimeSmokeFailedRequests: Array.isArray(entry?.runtimeSmoke?.failures)
      ? entry.runtimeSmoke.failures.map((item) => ({
          request: item.request,
          detail: item.detail,
        }))
      : [],
    forbiddenFallbacks: entry.forbiddenFallbacks,
    docEntry: entry.docEntry,
    sharedDocs: entry.sharedDocs,
  }
}

function canAutoMaterializeFirstFormalShell({
  hostCapabilityContract,
  globalBlockers,
  formalShell,
  navigationDecision,
  navigationMountDecision,
  navigationMountAction,
  officialHostSourceReadiness,
}) {
  if ((globalBlockers || []).length > 0) return false
  if (normalizeString(hostCapabilityContract?.headerOwnership) !== 'self-contained') return false
  if (normalizeString(formalShell?.status) !== 'missing') return false
  if (navigationDecision?.shouldAutoCreateFormalBusinessShell !== true) return false
  if (normalizeString(navigationMountDecision?.action) !== 'create-first-formal-shell') return false
  if (normalizeString(navigationMountAction?.action) !== 'create-formal-shell-and-mount-entry') {
    return false
  }
  if (normalizeString(officialHostSourceReadiness?.status) !== 'ready') return false
  return true
}

function canAutoMaterializeManagedMfHostContract({
  hostCapabilityContract,
  globalBlockers,
  formalHostCompatibility,
  navigationMountDecision,
  navigationMountAction,
}) {
  if ((globalBlockers || []).length > 0) return false
  if (normalizeString(hostCapabilityContract?.headerOwnership) !== 'self-contained') return false
  if (normalizeString(navigationMountDecision?.action) !== 'attach-existing') return false
  if (normalizeString(navigationMountAction?.action) !== 'materialize-mf-publish-entry') return false

  const managedHostContractStatus = normalizeString(
    formalHostCompatibility?.managedHostContract?.status
  )
  if (managedHostContractStatus === 'valid' || managedHostContractStatus === 'invalid') {
    return false
  }

  return true
}

function canAutoRepairLegacyMfSharedContract({
  pageTypeId,
  globalBlockers,
  legacyMfSharedContractRepair,
  autoMaterializeFirstFormalShell,
  autoMaterializeManagedMfHostContract,
}) {
  if ((globalBlockers || []).length > 0) return false
  if (autoMaterializeFirstFormalShell || autoMaterializeManagedMfHostContract) return false
  if (!isLegacyMfSharedContractPageType(pageTypeId)) return false
  return legacyMfSharedContractRepair?.repairRecommended === true
}

function resolveConditionalBlockedBy({
  autoMaterializeFirstFormalShell,
  autoMaterializeManagedMfHostContract,
}) {
  if (autoMaterializeFirstFormalShell) return ['missing-first-managed-formal-shell']
  if (autoMaterializeManagedMfHostContract) return ['missing-managed-mf-host-contract']
  return []
}

function summarizeFamilyEntry(entry) {
  return {
    id: entry.id,
    label: entry.label,
    workflowId: entry.workflowId,
    familyWorkflowStatus: entry.familyWorkflowStatus,
    plannerReady: entry.plannerReady,
    briefReady: entry.briefReady,
    generatorReady: entry.generatorReady,
    legacyRefactorReady: entry.legacyRefactorReady,
    generationStatus: entry.generationStatus,
    blockedBy: entry.blockedBy,
    reason: entry.reason,
    supportedInputModes: entry.supportedInputModes,
    supportedIntegrationModes: entry.supportedIntegrationModes,
    supportedScenarios: entry.supportedScenarios,
    supportedCoordinationPatterns: entry.supportedCoordinationPatterns,
    supportedArchetypes: entry.supportedArchetypes,
    planningDocs: entry.planningDocs,
  }
}

async function buildPageTypeEntry({
  skillRoot,
  targetRoot,
  manifest,
  pageType,
  globalBlockers,
  formalHostCompatibility,
  formalShell,
  hostProfile,
  legacyMfSharedContractRepair,
  navigationDecision,
  navigationMountDecision,
  navigationMountAction,
  officialHostSourceReadiness,
}) {
  const contract = pageType?.generationContract || null
  const resolvedHostGenerationContract = contract
    ? resolveHostGenerationContract({ hostProfile })
    : {}
  const resolvedGenerationContract = contract
    ? {
        ...cloneJsonOrDefault(contract, {}),
        ...cloneJsonOrDefault(resolvedHostGenerationContract, {}),
      }
    : {}
  if (Array.isArray(resolvedGenerationContract.requiredImports)) {
    resolvedGenerationContract.requiredImports = resolveRequiredImports(resolvedGenerationContract)
  }
  const baseTemplatePath = normalizeString(contract?.baseTemplatePath)
  const baseStylePath = normalizeString(contract?.baseStylePath)
  const requiredShell = normalizeString(contract?.requiredShell)
  const hostCapabilityContract = normalizeHostCapabilityContract(contract?.hostCapabilityContract)
  const localBlockers = []

  if (!contract) {
    localBlockers.push(
      createLocalBlocker(
        'missing-generation-contract',
        `Page type "${pageType.id}" is missing generationContract in page-types.manifest.json.`
      )
    )
  }

  if (!baseTemplatePath) {
    localBlockers.push(
      createLocalBlocker(
        'missing-base-template-path',
        `Page type "${pageType.id}" does not declare generationContract.baseTemplatePath.`
      )
    )
  } else if (!(await pathExists(path.join(skillRoot, baseTemplatePath)))) {
    localBlockers.push(
      createLocalBlocker(
        'missing-base-template-file',
        `Base template "${baseTemplatePath}" for page type "${pageType.id}" is missing in the skill package.`
      )
    )
  }

  if (baseStylePath && !(await pathExists(path.join(skillRoot, baseStylePath)))) {
    localBlockers.push(
      createLocalBlocker(
        'missing-base-style-file',
        `Base style "${baseStylePath}" for page type "${pageType.id}" is missing in the skill package.`
      )
    )
  }

  if (!requiredShell) {
    localBlockers.push(
      createLocalBlocker(
        'missing-required-shell',
        `Page type "${pageType.id}" does not declare generationContract.requiredShell.`
      )
    )
  }

  localBlockers.push(
    ...buildPageTypeHostLocalBlockers({
      pageTypeId: normalizeString(pageType?.id),
      hostCapabilityContract,
      formalHostCompatibility,
      navigationMountDecision,
      navigationMountAction,
    }),
  )

  const runtimeSmoke = await inspectPageTypeRuntimeSmoke({
    targetRoot,
    pageTypeId: normalizeString(pageType?.id),
    hostProfile,
  })
  if (runtimeSmoke.status === 'fail') {
    localBlockers.push(
      createLocalBlocker(
        runtimeSmoke.blockerId || FULL_PAGE_DETAIL_RUNTIME_SMOKE_BLOCKER_ID,
        `Page type "${pageType.id}" official runtime chain does not load in the current high-risk host. ${runtimeSmoke.reason}`
      )
    )
  }

  const blockedBy = [...globalBlockers, ...localBlockers]
  const autoMaterializeFirstFormalShell = canAutoMaterializeFirstFormalShell({
    hostCapabilityContract,
    globalBlockers,
    formalShell,
    navigationDecision,
    navigationMountDecision,
    navigationMountAction,
    officialHostSourceReadiness,
  })
  const autoMaterializeManagedMfHostContract = canAutoMaterializeManagedMfHostContract({
    hostCapabilityContract,
    globalBlockers,
    formalHostCompatibility,
    navigationMountDecision,
    navigationMountAction,
  })
  const autoRepairLegacyMfSharedContract = canAutoRepairLegacyMfSharedContract({
    pageTypeId: normalizeString(pageType?.id),
    globalBlockers,
    legacyMfSharedContractRepair,
    autoMaterializeFirstFormalShell,
    autoMaterializeManagedMfHostContract,
  })
  const conditionalBlockedBy = resolveConditionalBlockedBy({
    autoMaterializeFirstFormalShell,
    autoMaterializeManagedMfHostContract,
  })
  const status =
    blockedBy.length > 0
      ? 'blocked'
      : conditionalBlockedBy.length > 0
        ? 'requires-managed-formal-shell'
        : autoRepairLegacyMfSharedContract
          ? 'blocked'
        : 'allowed'

  return {
    id: normalizeString(pageType?.id),
    label: normalizeString(pageType?.label),
    pageFamily: normalizeString(pageType?.pageFamily),
    kind: normalizeString(pageType?.kind),
    whenToUse: cloneJsonOrDefault(pageType?.whenToUse, []),
    shell: normalizeString(pageType?.shell),
    status,
    blockedBy:
      autoRepairLegacyMfSharedContract
        ? [LEGACY_MF_SHARED_CONTRACT_BLOCKER_ID]
        : conditionalBlockedBy.length > 0
          ? []
          : blockedBy.map((item) => item.id),
    conditionalBlockedBy: autoRepairLegacyMfSharedContract ? [] : conditionalBlockedBy,
    reason:
      blockedBy.length > 0
        ? blockedBy.map((item) => item.detail).join(' ')
        : autoMaterializeFirstFormalShell
          ? `Page type "${pageType.id}" requires the first managed formal business shell before writing page code, and the current project qualifies to auto-materialize that shell through the managed host-integration flow.`
          : autoMaterializeManagedMfHostContract
            ? `Page type "${pageType.id}" still needs a continuous formal host height chain, but the current existing-system direct-expose project qualifies to auto-materialize the minimal managed host contract before writing page code.`
            : autoRepairLegacyMfSharedContract
              ? `Page type "${pageType.id}" still needs the legacy Module Federation host shared contract repaired before writing page code. ${normalizeString(legacyMfSharedContractRepair?.reason)}`
            : 'Page type is ready for official hiui-design generation.',
    preWriteAction: autoMaterializeFirstFormalShell
      ? 'create-first-formal-shell'
      : autoMaterializeManagedMfHostContract
        ? 'materialize-managed-mf-host-contract'
        : autoRepairLegacyMfSharedContract
          ? LEGACY_MF_SHARED_CONTRACT_PREWRITE_ACTION
        : '',
    preWriteActionReason: autoMaterializeFirstFormalShell
      ? normalizeString(navigationMountAction?.reason) ||
        'Create the first formal business shell and registry, then mount that registry in the real app entry before writing page code.'
      : autoMaterializeManagedMfHostContract
        ? normalizeString(navigationMountAction?.reason) ||
          'Materialize the minimal managed host contract files and the managed publish entry before using the existing Module Federation expose contract.'
        : autoRepairLegacyMfSharedContract
          ? normalizeString(legacyMfSharedContractRepair?.reason) ||
            'Repair the legacy Module Federation host shared contract before writing page code so legacy @hi-ui/hiui consumers and new hiui5-backed generated pages do not compete for one singleton runtime.'
        : '',
    baseTemplatePath,
    baseTemplateExists: Boolean(baseTemplatePath) && (await pathExists(path.join(skillRoot, baseTemplatePath))),
    baseStylePath,
    baseStyleExists: baseStylePath ? await pathExists(path.join(skillRoot, baseStylePath)) : false,
    requiredShell,
    runtimeExamplePath:
      normalizeString(pageType?.runtimeExamplePath) || normalizeString(contract?.baseTemplatePath),
    globalPreviewRoute: normalizeString(pageType?.globalPreviewRoute || pageType?.smokePath),
    smokePath: normalizeString(pageType?.smokePath),
    businessSlots: normalizeStringArray(contract?.businessSlots),
    requiredSlots: normalizeStringArray(contract?.requiredSlots),
    lockedRegions: normalizeStringArray(contract?.lockedRegions),
    generationNotes: normalizeStringArray(contract?.generationNotes),
    generationContract: cloneJsonOrDefault(resolvedGenerationContract, {}),
    resolvedHostGenerationContract: cloneJsonOrDefault(resolvedHostGenerationContract, {}),
    requiredDocs: buildRequiredDocsSnapshot(manifest, pageType),
    requiredHostCapabilities: cloneJson(hostCapabilityContract),
    generationWorkflow: cloneJson(pageType?.generationWorkflow || {}),
    docEntry: normalizeString(pageType?.docEntry),
    sharedDocs: normalizeStringArray(pageType?.sharedDocs),
    forbiddenFallbacks: cloneJson(DEFAULT_FORBIDDEN_FALLBACKS),
    localBlockers,
    runtimeSmoke,
  }
}

async function buildPageFamilyEntry({
  pageFamily,
  globalBlockers,
  readyToGenerate,
}) {
  const localBlockers = []
  const plannerReady = pageFamily?.plannerReady === true
  const briefReady = pageFamily?.briefReady === true
  const generatorReady = pageFamily?.generatorReady === true
  const legacyRefactorReady = pageFamily?.legacyRefactorReady === true

  if (!plannerReady) {
    localBlockers.push(
      createLocalBlocker(
        'family-planner-not-ready',
        `Page family "${pageFamily.id}" has not enabled planner execution yet.`
      )
    )
  }

  if (!briefReady) {
    localBlockers.push(
      createLocalBlocker(
        'family-brief-not-ready',
        `Page family "${pageFamily.id}" has not enabled execution brief generation yet.`
      )
    )
  }

  if (!generatorReady) {
    localBlockers.push(
      createLocalBlocker(
        'family-generator-not-ready',
        `Page family "${pageFamily.id}" generator is still disabled in page-family-workflows.manifest.json.`
      )
    )
  }

  if (!readyToGenerate) {
    localBlockers.push(
      createLocalBlocker(
        'project-page-task-gate-not-ready',
        'The current project page-task gate is not ready-to-generate, so family execution must remain blocked.'
      )
    )
  }

  const blockedBy = [...globalBlockers, ...localBlockers]
  const generationStatus =
    generatorReady && readyToGenerate
      ? 'ready'
      : generatorReady
        ? 'project-gate-blocked'
        : briefReady || plannerReady
          ? 'brief-ready-generator-pending'
          : 'not-ready'

  return {
    id: normalizeString(pageFamily?.id),
    label: normalizeString(pageFamily?.label),
    workflowId: normalizeString(pageFamily?.workflowId),
    familyWorkflowStatus: normalizeString(pageFamily?.status),
    plannerReady,
    briefReady,
    generatorReady,
    legacyRefactorReady,
    generationStatus,
    blockedBy: blockedBy.map((item) => item.id),
    reason:
      !readyToGenerate && generatorReady
        ? 'Family generator is available, but the current project page-task gate is not ready-to-generate.'
        : blockedBy.length === 0
          ? 'Page family generator is ready for execution in the current project.'
          : blockedBy.map((item) => item.detail).join(' '),
    supportedInputModes: normalizeStringArray(pageFamily?.supportedInputModes),
    supportedIntegrationModes: normalizeStringArray(pageFamily?.supportedIntegrationModes),
    supportedScenarios: normalizeStringArray(pageFamily?.supportedScenarios),
    supportedCoordinationPatterns: normalizeStringArray(
      pageFamily?.supportedCoordinationPatterns ?? pageFamily?.supportedArchetypes
    ),
    supportedArchetypes: normalizeStringArray(pageFamily?.supportedArchetypes),
    planningDocs: normalizeStringArray(pageFamily?.planningDocs),
    localBlockers,
  }
}

export async function buildPageTypeCapabilityArtifacts({
  skillRoot,
  targetRoot,
  generationReadiness,
  pageTaskStatus,
  line = '',
}) {
  const { manifest, manifestPath, baseManifestPath, overlayPath, lineId } = await loadPageTypeManifest({
    skillRoot,
    line,
  })
  const generatedAt = new Date().toISOString()
  const projectHostContract = targetRoot ? await readProjectHostContract(targetRoot) : null
  const globalBlockers =
    generationReadiness?.status === 'ready'
      ? []
      : (generationReadiness?.blockingFacts || []).map((item) => ({
          id: normalizeString(item?.id) || 'unknown-blocker',
          detail: normalizeString(item?.detail) || 'Project generation readiness is blocked.',
        }))
  const entries = []
  const publicShell = normalizePublicShell(generationReadiness?.hostCompatibility?.publicShell)
  const formalHostCompatibility = buildFormalHostCompatibility(
    generationReadiness?.hostCompatibility,
  )
  const navigationDecision = cloneJson(generationReadiness?.navigationDecision || {})
  const pageBindingNavigationMountDecision = cloneJson(generationReadiness?.navigationMountDecision || {})
  const pageBindingNavigationMountAction = cloneJson(generationReadiness?.navigationMountAction || {})
  const formalShell = buildFormalShellStatus({
    formalNavigation: cloneJson(generationReadiness?.formalNavigation || {}),
    hostProfile: generationReadiness?.hostProfile || {},
    navigationDecision,
  })
  const pageTaskReadiness = normalizeString(pageTaskStatus?.pageTaskReadiness) || 'ensure-only'
  const readyToGenerate = pageTaskReadiness === 'ready-to-generate'
  const navigationSupport = buildProjectNavigationSupport({
    navigationDecision,
    navigationMountDecision: pageBindingNavigationMountDecision,
    navigationMountAction: pageBindingNavigationMountAction,
    pageTaskReadiness,
  })
  const rawExecutionReadiness =
    generationReadiness?.executionReadiness &&
    typeof generationReadiness.executionReadiness === 'object'
      ? cloneJson(generationReadiness.executionReadiness)
      : {}
  const projectExecution = resolveProjectExecutionReadiness({
    readyToGenerate,
    rawExecutionReadiness,
    navigationSupport,
  })
  const executionStatus = projectExecution.executionStatus
  const executionBlockedBy = projectExecution.executionBlockedBy
  const readyToExecute = projectExecution.readyToExecute
  const lifecycleProfile = cloneJson(
    pageTaskStatus?.lifecycleProfile ||
      buildLifecycleProfile({
        integrationReadiness: pageTaskStatus?.integrationReadiness || generationReadiness || {},
        pageTaskReadiness,
        integrationComplete: Boolean(pageTaskStatus?.integrationComplete),
        userVisibleState: normalizeString(pageTaskStatus?.userVisibleState) || 'materialized-only',
      })
  )
  const hostProfileSummary = {
    projectType: normalizeString(generationReadiness?.hostProfile?.projectType),
    framework: normalizeString(generationReadiness?.hostProfile?.framework),
    runtime: normalizeString(generationReadiness?.hostProfile?.runtime),
    routing: normalizeString(generationReadiness?.hostProfile?.routing),
    strategy: normalizeString(generationReadiness?.hostProfile?.strategy),
    reason: normalizeString(generationReadiness?.hostProfile?.reason),
    adapterDoc: normalizeString(generationReadiness?.hostProfile?.adapterDoc),
    adapterEntryHints: normalizeStringArray(generationReadiness?.hostProfile?.adapterEntryHints),
    remoteOnlyRuntime: cloneJson(generationReadiness?.hostProfile?.remoteOnlyRuntime || {}),
    remoteDebugContract: cloneJson(generationReadiness?.hostProfile?.remoteDebugContract || {}),
  }
  const legacyMfSharedContractRepair = await inspectLegacyMfSharedContractRepair({
    targetRoot,
    hostProfile: generationReadiness?.hostProfile || {},
  })
  const projectHostContext = buildProjectHostContextSnapshot(projectHostContract)

  for (const pageType of manifest.pageTypes || []) {
    entries.push(
      await buildPageTypeEntry({
        skillRoot,
      targetRoot,
      manifest,
      pageType,
      globalBlockers,
      formalHostCompatibility,
      formalShell,
      hostProfile: generationReadiness?.hostProfile || {},
        legacyMfSharedContractRepair,
        navigationDecision,
        navigationMountDecision: pageBindingNavigationMountDecision,
        navigationMountAction: pageBindingNavigationMountAction,
        officialHostSourceReadiness: generationReadiness?.officialHostSourceReadiness || {},
      })
    )
  }

  const { manifest: pageFamilyManifest, manifestPath: pageFamilyManifestPath } =
    await loadPageFamilyWorkflowManifest({ skillRoot })
  const familyEntries = []

  for (const pageFamily of pageFamilyManifest.pageFamilies || []) {
    familyEntries.push(
      await buildPageFamilyEntry({
        pageFamily,
        globalBlockers,
        readyToGenerate,
      })
    )
  }

  const allowedPageTypes = entries.filter((entry) => entry.status === 'allowed')
  const conditionalPageTypes = entries.filter(
    (entry) => entry.status === 'requires-managed-formal-shell'
  )
  const blockedPageTypes = entries.filter((entry) => entry.status === 'blocked')
  const readyPageFamilies = familyEntries.filter((entry) => entry.generationStatus === 'ready')
  const blockedPageFamilies = familyEntries.filter((entry) => entry.generationStatus !== 'ready')
  const publicShellProjectReady = isProjectScopedPublicShellReady(publicShell)
  const publicShellProjectBlockedBy = resolveProjectScopedPublicShellBlockedBy(publicShell)

  const capabilityReport = {
    schema: 'hiui-design-page-type-capability-report.v1',
    generatedAt,
    targetRoot,
    manifestPath,
    lineId,
    completionStandard: 'ready-to-generate',
    readyToGenerate,
    readyToExecute,
    integrationComplete: Boolean(pageTaskStatus?.integrationComplete),
    userVisibleState: normalizeString(pageTaskStatus?.userVisibleState) || 'materialized-only',
    lifecycleProfile,
    pageTaskReadiness,
    globalBlockers,
    summary: {
      totalPageTypes: entries.length,
      allowedPageTypeCount: allowedPageTypes.length,
      conditionalPageTypeCount: conditionalPageTypes.length,
      blockedPageTypeCount: blockedPageTypes.length,
      allowedPageTypeIds: allowedPageTypes.map((entry) => entry.id),
      conditionalPageTypeIds: conditionalPageTypes.map((entry) => entry.id),
      blockedPageTypeIds: blockedPageTypes.map((entry) => entry.id),
      executionStatus,
      executionBlockedBy,
      totalPageFamilies: familyEntries.length,
      readyPageFamilyCount: readyPageFamilies.length,
      blockedPageFamilyCount: blockedPageFamilies.length,
      readyPageFamilyIds: readyPageFamilies.map((entry) => entry.id),
      blockedPageFamilyIds: blockedPageFamilies.map((entry) => entry.id),
      publicViewportStatus: publicShell.status,
      publicViewportReady: publicShellProjectReady,
      publicViewportBlockedBy: publicShellProjectBlockedBy,
      publicShellStatus: publicShell.status,
      publicShellReady: publicShellProjectReady,
      publicShellBlockedBy: publicShellProjectBlockedBy,
      projectEntryShellStatus: publicShell.projectEntryShell.status,
      projectEntryShellReady: publicShell.projectEntryShellReady === true,
      projectEntryShellBlockedBy: publicShell.projectEntryShell.blockedBy,
      mfPublishEntryShellStatus: publicShell.mfPublishEntryShell.status,
      mfPublishEntryShellRequired: publicShell.mfPublishEntryShellRequired === true,
      mfPublishEntryShellReady: publicShell.mfPublishEntryShellReady === true,
      mfPublishEntryShellBlockedBy: publicShell.mfPublishEntryShell.blockedBy,
      formalShellStatus: formalShell.status,
      formalShellReady: formalShell.ready,
      formalShellWriteBlocking: formalShell.writeBlocking === true,
      formalShellBlockedBy: formalShell.blockedBy,
      formalShellDiagnosticBy: normalizeStringArray(formalShell.diagnosticBy),
      formalShellCertification: formalShell.shellCertification,
      formalHostCompatibilityStatus: formalHostCompatibility.status,
      formalHostEvidenceSource: formalHostCompatibility.evidenceSource,
      formalHostLayoutMode: formalHostCompatibility.formalHostProfile.layoutMode,
      formalHostHeaderSlotPolicy: formalHostCompatibility.formalHostProfile.headerSlotPolicy,
      formalHostProviderBridgeReady: formalHostCompatibility.formalHostProfile.hostProviderBridge,
      formalHostContinuousHeightChainReady:
        formalHostCompatibility.formalHostProfile.continuousHeightChain,
      formalHostContentOutletPath: formalHostCompatibility.formalHostProfile.contentOutletPath,
      formalHostScrollOwner: formalHostCompatibility.formalHostProfile.scrollOwner,
      formalHostRightViewportGutterPx:
        formalHostCompatibility.formalHostProfile.rightViewportGutterPx,
      formalHostLeftGapPxWhenMenuCollapsed:
        formalHostCompatibility.formalHostProfile.leftGapPxWhenMenuCollapsed,
      managedHostContractStatus: formalHostCompatibility.managedHostContract.status,
      managedHostContractReady: formalHostCompatibility.managedHostContract.status === 'valid',
      managedHostContractPath: formalHostCompatibility.managedHostContract.contractRelativePath,
      navigationSupportStatus: navigationSupport.status,
      navigationMountMechanismConfirmed: navigationSupport.mountMechanismConfirmed === true,
    },
    publicViewport: publicShell,
    publicShell,
    formalShell,
    formalHostCompatibility,
    hostProfile: hostProfileSummary,
    navigationSupport,
    executionStatus,
    executionReason: projectExecution.executionReason,
    executionReadiness: rawExecutionReadiness,
    pageFamilyCapabilityReport: {
      manifestPath: pageFamilyManifestPath,
      readyPageFamilies: readyPageFamilies.map(summarizeFamilyEntry),
      blockedPageFamilies: blockedPageFamilies.map(summarizeFamilyEntry),
      pageFamilies: familyEntries,
    },
    allowedPageTypes: allowedPageTypes.map(summarizeEntry),
    conditionalPageTypes: conditionalPageTypes.map(summarizeEntry),
    blockedPageTypes: blockedPageTypes.map(summarizeEntry),
    pageTypes: entries,
  }

  const aiGenerationReadyContext = {
    schema: 'hiui-design-ai-generation-ready-context.v1',
    generatedAt,
    targetRoot,
    completionStandard: 'ready-to-generate',
    readyToGenerate,
    readyToExecute,
    requestedPageTypeBindingStatus: 'not-bound',
    requestedPageTypeBindingReason:
      'This context is project-scoped and does not bind a single requested page type until generation brief creation.',
    requestedPageTypeBindingBlockedBy: [],
    writeReadiness: resolveProjectWriteReadiness(pageTaskReadiness),
    integrationComplete: Boolean(pageTaskStatus?.integrationComplete),
    userVisibleState: normalizeString(pageTaskStatus?.userVisibleState) || 'materialized-only',
    lifecycleProfile,
    pageTaskReadiness,
    blockedBy: buildAiGenerationBlockedBy({
      globalBlockers,
      pageTaskReadiness,
    }),
    hostProfile: hostProfileSummary,
    publicViewport: publicShell,
    publicViewportReady: publicShellProjectReady,
    publicViewportBlockedBy: publicShellProjectBlockedBy,
    publicShell,
    publicShellReady: publicShellProjectReady,
    publicShellBlockedBy: publicShellProjectBlockedBy,
    projectEntryShellReady: publicShell.projectEntryShellReady === true,
    projectEntryShellReason: normalizeString(publicShell.projectEntryShellReason),
    projectEntryShellBlockedBy: publicShell.projectEntryShell.blockedBy,
    mfPublishEntryShellRequired: publicShell.mfPublishEntryShellRequired === true,
    mfPublishEntryShellReady: publicShell.mfPublishEntryShellReady === true,
    mfPublishEntryShellReason: normalizeString(publicShell.mfPublishEntryShellReason),
    mfPublishEntryShellBlockedBy: publicShell.mfPublishEntryShell.blockedBy,
    formalShell,
    formalHostCompatibility,
    navigationSupport,
    executionStatus,
    executionBlockedBy,
    executionReason: projectExecution.executionReason,
    executionNextAction: projectExecution.executionNextAction,
    executionNextCommand: projectExecution.executionNextCommand,
    executionReadiness: rawExecutionReadiness,
    nextCommand: normalizeString(pageTaskStatus?.nextCommand),
    requiredReadBeforeWrite: [getContextDocPath('generation', 'ai-page-generation-guidance.md')],
    pageTypeManifestSnapshot: buildPageTypeManifestSnapshot({
      manifestPath,
      baseManifestPath,
      overlayPath,
      lineId,
      manifest,
    }),
    projectHostContext,
    managedLocalRuntime: cloneJson(projectHostContext.managedLocalRuntime),
    managedLocalRuntimeMaterialized: projectHostContext.managedLocalRuntime.materialized === true,
    managedLocalRuntimeBlockedBy: normalizeStringArray(
      projectHostContext.managedLocalRuntime.blockedBy
    ),
    generationPolicy: {
      onlyUseManifestRegisteredPageTypes: true,
      mustStartFromOfficialBaseTemplate: true,
      mustPreserveRequiredShell: true,
      mustRespectSlotBoundaries: true,
      forbiddenFallbacks: cloneJson(DEFAULT_FORBIDDEN_FALLBACKS),
    },
    outputPaths: {
      pageTypeCapabilityReport: toRelativeOutputPath(PAGE_TYPE_CAPABILITY_REPORT_FILENAME),
      aiGenerationReadyContext: toRelativeOutputPath(AI_GENERATION_READY_CONTEXT_FILENAME),
      projectHostContract: toRelativeOutputPath(PROJECT_HOST_CONTRACT_FILENAME),
      projectStateSummary: toRelativeOutputPath(PROJECT_STATE_SUMMARY_FILENAME),
    },
    pageFamilyCapabilityReport: {
      manifestPath: pageFamilyManifestPath,
      pageFamilies: familyEntries.map(summarizeFamilyEntry),
    },
    allowedPageTypes: capabilityReport.allowedPageTypes,
    conditionalPageTypes: capabilityReport.conditionalPageTypes.map((entry) => ({
      id: entry.id,
      label: entry.label,
      conditionalBlockedBy: entry.conditionalBlockedBy,
      reason: entry.reason,
      preWriteAction: entry.preWriteAction,
      preWriteActionReason: entry.preWriteActionReason,
      baseTemplatePath: entry.baseTemplatePath,
      requiredShell: entry.requiredShell,
    })),
    blockedPageTypes: capabilityReport.blockedPageTypes.map((entry) => ({
      id: entry.id,
      label: entry.label,
      blockedBy: entry.blockedBy,
      reason: entry.reason,
      preWriteAction: entry.preWriteAction,
      preWriteActionReason: entry.preWriteActionReason,
      baseTemplatePath: entry.baseTemplatePath,
      requiredShell: entry.requiredShell,
    })),
    pageTypes: capabilityReport.pageTypes,
  }

  const projectStateSummary = buildProjectStateSummary({
    generatedAt,
    targetRoot,
    capabilityReport,
    aiGenerationReadyContext,
    pageTaskStatus,
  })

  return {
    capabilityReport,
    aiGenerationReadyContext,
    projectStateSummary,
  }
}

export async function writePageTypeCapabilityArtifacts({
  skillRoot,
  targetRoot,
  generationReadiness,
  pageTaskStatus,
  line = '',
}) {
  const outputRoot = resolveProjectContextPath(targetRoot, 'outputs')
  await fs.mkdir(outputRoot, { recursive: true })

  const artifacts = await buildPageTypeCapabilityArtifacts({
    skillRoot,
    targetRoot,
    generationReadiness,
    pageTaskStatus,
    line,
  })
  const capabilityReportPath = resolveProjectContextPath(targetRoot, 'outputs', PAGE_TYPE_CAPABILITY_REPORT_FILENAME)
  const aiGenerationReadyContextPath = resolveProjectContextPath(
    targetRoot,
    'outputs',
    AI_GENERATION_READY_CONTEXT_FILENAME
  )
  const projectHostContractPath = resolveProjectContextPath(
    targetRoot,
    'outputs',
    PROJECT_HOST_CONTRACT_FILENAME
  )
  const projectHostContract = await readProjectHostContract(targetRoot)
  if (!projectHostContract) {
    throw new Error(
      `Missing ${PROJECT_HOST_CONTRACT_FILENAME} at ${projectHostContractPath}. Run typical-page:preflight before writing project-scoped page capability artifacts.`
    )
  }
  const projectStateSummaryPath = resolveProjectContextPath(
    targetRoot,
    'outputs',
    PROJECT_STATE_SUMMARY_FILENAME
  )

  await fs.writeFile(capabilityReportPath, `${JSON.stringify(artifacts.capabilityReport, null, 2)}\n`, 'utf8')
  await fs.writeFile(
    aiGenerationReadyContextPath,
    `${JSON.stringify(artifacts.aiGenerationReadyContext, null, 2)}\n`,
    'utf8'
  )
  await fs.writeFile(
    projectStateSummaryPath,
    `${JSON.stringify(artifacts.projectStateSummary, null, 2)}\n`,
    'utf8'
  )

  return {
    ...artifacts,
    capabilityReportPath,
    aiGenerationReadyContextPath,
    projectHostContract,
    projectHostContractPath,
    projectStateSummaryPath,
  }
}
