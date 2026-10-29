import fs from 'node:fs/promises'
import path from 'node:path'

import { PROJECT_PAGE_TASK_STATUS_RELATIVE_PATH } from './skill-identity.mjs'

export const PAGE_TASK_READINESS = {
  ENSURE_ONLY: 'ensure-only',
  READY_TO_GENERATE: 'ready-to-generate',
}

export const PAGE_TASK_NEXT_STAGE = {
  NEEDS_CONTEXT_SYNC: 'needs-context-sync',
  NEEDS_PREFLIGHT: 'needs-preflight',
  READY_TO_GENERATE: 'ready-to-generate',
}

export const PAGE_TASK_USER_VISIBLE_STATE = {
  MATERIALIZED_ONLY: 'materialized-only',
  INTEGRATION_COMPLETE: 'integration-complete',
}

export const PAGE_TASK_COMPLETION_CONTRACT = {
  integrationCompleteWhen: PAGE_TASK_READINESS.READY_TO_GENERATE,
  materializedOnlyWhen: PAGE_TASK_READINESS.ENSURE_ONLY,
}

export const INTEGRATION_BLOCKED_ALLOWED_ACTIONS = [
  'sync-project-context',
  'run-ensure',
  'run-apply',
  'report-blocked',
]

export const PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS = [
  'run-preflight',
  'complete-host-compatibility-baseline',
  'report-blocked',
]

export const DEFAULT_FORBIDDEN_ACTIONS = [
  'read-business-pages',
  'analyze-reuse',
  'guess-window-addPage',
  'guess-mf-exposes',
  'guess-route-entry',
  'write-page-source',
]

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function ensureDir(targetPath) {
  await fs.mkdir(targetPath, { recursive: true })
}

function normalizePublicShellLayer(layer = {}, options = {}) {
  return {
    status: normalizeString(layer?.status) || normalizeString(options.defaultStatus),
    reason: normalizeString(layer?.reason) || normalizeString(options.defaultReason),
    entryFile: normalizeString(layer?.entryFile),
    styleFiles: normalizeStringArray(layer?.styleFiles),
    blockedBy: normalizeStringArray(layer?.blockedBy),
    required: layer?.required === true,
    deliveryContract: normalizeString(layer?.deliveryContract),
    targetEntryKind: normalizeString(layer?.targetEntryKind),
    targetEntryPath: normalizeString(layer?.targetEntryPath),
    expectedShellStyleImport: normalizeString(layer?.expectedShellStyleImport),
  }
}

function normalizeManagedHostContract(contract = {}) {
  return {
    status: normalizeString(contract?.status),
    contractPath: normalizeString(contract?.contractPath),
    contractRelativePath: normalizeString(contract?.contractRelativePath),
    reason: normalizeString(contract?.reason),
    errors: normalizeStringArray(contract?.errors),
    evidenceFiles: normalizeStringArray(contract?.evidenceFiles),
  }
}

function toIntegrationReadinessSnapshot(integrationReadiness = {}) {
  const projectEntryShell = normalizePublicShellLayer(
    integrationReadiness.hostCompatibility?.publicShell?.projectEntryShell ||
      integrationReadiness.hostCompatibility?.publicShell
  )
  const mfPublishEntryShell = normalizePublicShellLayer(
    integrationReadiness.hostCompatibility?.publicShell?.mfPublishEntryShell,
    {
      defaultStatus: 'not-applicable',
      defaultReason: 'Managed Module Federation publish-entry shell delivery is not required.',
    }
  )
  return {
    ready: Boolean(integrationReadiness.ready),
    status: String(integrationReadiness.status || '').trim(),
    appliedMode: String(integrationReadiness.appliedMode || '').trim(),
    applyStatePath: String(integrationReadiness.applyStatePath || '').trim(),
    applyProgressPath: String(integrationReadiness.applyProgressPath || '').trim(),
    applyProgress: {
      status: String(integrationReadiness.applyProgress?.status || '').trim(),
      stage: String(integrationReadiness.applyProgress?.stage || '').trim(),
      requestedMode: String(integrationReadiness.applyProgress?.requestedMode || '').trim(),
      startedAt: String(integrationReadiness.applyProgress?.startedAt || '').trim(),
      updatedAt: String(integrationReadiness.applyProgress?.updatedAt || '').trim(),
      detail: String(integrationReadiness.applyProgress?.detail || '').trim(),
      lastError: String(integrationReadiness.applyProgress?.lastError || '').trim(),
    },
    hostCompatibility: {
      status: String(integrationReadiness.hostCompatibility?.status || '').trim(),
      reason: String(integrationReadiness.hostCompatibility?.reason || '').trim(),
      riskLevel: String(integrationReadiness.hostCompatibility?.riskLevel || '').trim(),
      riskTags: normalizeStringArray(integrationReadiness.hostCompatibility?.riskTags),
      nextAction: String(integrationReadiness.hostCompatibility?.nextAction || '').trim(),
      formalHostProfile: normalizeFormalHostProfile(
        integrationReadiness.hostCompatibility?.formalHostProfile,
      ),
      managedHostContract: normalizeManagedHostContract(
        integrationReadiness.hostCompatibility?.managedHostContract,
      ),
      publicShell: {
        status: String(integrationReadiness.hostCompatibility?.publicShell?.status || '').trim(),
        reason: String(integrationReadiness.hostCompatibility?.publicShell?.reason || '').trim(),
        entryFile: String(integrationReadiness.hostCompatibility?.publicShell?.entryFile || '').trim(),
        styleFiles: normalizeStringArray(integrationReadiness.hostCompatibility?.publicShell?.styleFiles),
        blockedBy: normalizeStringArray(integrationReadiness.hostCompatibility?.publicShell?.blockedBy),
        projectEntryShellReady:
          integrationReadiness.hostCompatibility?.publicShell?.projectEntryShellReady === true ||
          projectEntryShell.status === 'ready',
        projectEntryShellReason:
          String(integrationReadiness.hostCompatibility?.publicShell?.projectEntryShellReason || '').trim() ||
          projectEntryShell.reason,
        projectEntryShellBlockedBy:
          normalizeStringArray(
            integrationReadiness.hostCompatibility?.publicShell?.projectEntryShellBlockedBy
          ).length > 0
            ? normalizeStringArray(
                integrationReadiness.hostCompatibility?.publicShell?.projectEntryShellBlockedBy
              )
            : projectEntryShell.blockedBy,
        projectEntryShell,
        mfPublishEntryShellRequired:
          integrationReadiness.hostCompatibility?.publicShell?.mfPublishEntryShellRequired === true ||
          mfPublishEntryShell.required === true,
        mfPublishEntryShellReady:
          integrationReadiness.hostCompatibility?.publicShell?.mfPublishEntryShellReady === true ||
          mfPublishEntryShell.status === 'ready',
        mfPublishEntryShellReason:
          String(integrationReadiness.hostCompatibility?.publicShell?.mfPublishEntryShellReason || '').trim() ||
          mfPublishEntryShell.reason,
        mfPublishEntryShellBlockedBy:
          normalizeStringArray(
            integrationReadiness.hostCompatibility?.publicShell?.mfPublishEntryShellBlockedBy
          ).length > 0
            ? normalizeStringArray(
                integrationReadiness.hostCompatibility?.publicShell?.mfPublishEntryShellBlockedBy
              )
            : mfPublishEntryShell.blockedBy,
        mfPublishEntryShell,
      },
    },
  }
}

function normalizeFormalHostProfile(profile = {}) {
  return {
    layoutMode: normalizeString(profile.layoutMode) || 'unknown',
    headerSlotPolicy: normalizeString(profile.headerSlotPolicy) || 'unknown',
    hostProviderBridge: profile.hostProviderBridge === true,
    continuousHeightChain: profile.continuousHeightChain === true,
    contentOutletPath: normalizeString(profile.contentOutletPath),
    scrollOwner: normalizeString(profile.scrollOwner) || 'unknown',
    rightViewportGutterPx: Number.isFinite(profile.rightViewportGutterPx)
      ? profile.rightViewportGutterPx
      : 0,
    leftGapPxWhenMenuCollapsed: Number.isFinite(profile.leftGapPxWhenMenuCollapsed)
      ? profile.leftGapPxWhenMenuCollapsed
      : 0,
    evidenceFiles: normalizeStringArray(profile.evidenceFiles),
  }
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeRelativePath(value) {
  return normalizeString(value).replace(/\\/g, '/').replace(/^\.\//, '')
}

function normalizeStringArray(values, fallback = []) {
  const nextValues = Array.isArray(values) ? values : fallback
  return [...new Set(nextValues.map((value) => normalizeString(value)).filter(Boolean))]
}

function normalizeDoctorState(doctor = {}) {
  const normalizeDoctorAssessmentDimension = (dimension = {}) => ({
    status: normalizeString(dimension.status),
    failedCheckIds: normalizeStringArray(dimension.failedCheckIds),
    summary: normalizeString(dimension.summary),
  })

  return {
    lastRunAt: normalizeString(doctor.lastRunAt),
    lastStatus: normalizeString(doctor.lastStatus) || 'unknown',
    assessment: {
      runtimeBaseline: normalizeDoctorAssessmentDimension(doctor.assessment?.runtimeBaseline),
      layoutContract: normalizeDoctorAssessmentDimension(doctor.assessment?.layoutContract),
      decision: normalizeString(doctor.assessment?.decision),
    },
  }
}

function normalizeFreshness(freshness = {}) {
  return {
    packageJsonHash: normalizeString(freshness.packageJsonHash),
    lockfileHash: normalizeString(freshness.lockfileHash),
    entryFileHash: normalizeString(freshness.entryFileHash),
    buildConfigHash: normalizeString(freshness.buildConfigHash),
    contextHash: normalizeString(freshness.contextHash),
    hostContractHash: normalizeString(freshness.hostContractHash),
    hostContractSource: normalizeString(freshness.hostContractSource),
    projectHostContractHash: normalizeString(freshness.projectHostContractHash),
    projectHostContractFingerprintValue: normalizeString(
      freshness.projectHostContractFingerprintValue
    ),
    projectHostContractFingerprintSource: normalizeString(
      freshness.projectHostContractFingerprintSource
    ),
    projectHostContractEvidenceHash: normalizeString(freshness.projectHostContractEvidenceHash),
  }
}

function normalizeStaleInputs(staleInputs = []) {
  return [...new Set((Array.isArray(staleInputs) ? staleInputs : [staleInputs]).map((item) => {
    const normalized = normalizeRelativePath(item)
    return normalized || normalizeString(item)
  }).filter(Boolean))]
}

export function resolvePageTaskNextStage({
  integrationReadiness = {},
  pageTaskReadiness = PAGE_TASK_READINESS.ENSURE_ONLY,
} = {}) {
  if (!integrationReadiness?.ready) {
    return PAGE_TASK_NEXT_STAGE.NEEDS_CONTEXT_SYNC
  }

  return pageTaskReadiness === PAGE_TASK_READINESS.READY_TO_GENERATE
    ? PAGE_TASK_NEXT_STAGE.READY_TO_GENERATE
    : PAGE_TASK_NEXT_STAGE.NEEDS_PREFLIGHT
}

export function buildLifecycleProfile({
  integrationReadiness = {},
  pageTaskReadiness = PAGE_TASK_READINESS.ENSURE_ONLY,
  integrationComplete = false,
  userVisibleState = PAGE_TASK_USER_VISIBLE_STATE.MATERIALIZED_ONLY,
} = {}) {
  const integrationStatus = normalizeString(integrationReadiness.status)
  const applyProgressStatus = normalizeString(integrationReadiness.applyProgress?.status)
  const applyProgressStage = normalizeString(integrationReadiness.applyProgress?.stage)
  const nextStage = resolvePageTaskNextStage({
    integrationReadiness,
    pageTaskReadiness,
  })

  let phase = 'materialized-only'
  let nextGate = 'preflight'

  if (integrationStatus === 'missing-context') {
    phase = 'context-missing'
    nextGate = 'ensure'
  } else if (integrationStatus === 'missing-apply-state' && applyProgressStatus === 'in-progress') {
    phase = 'apply-in-progress'
    nextGate = 'wait-for-apply'
  } else if (integrationStatus === 'missing-apply-state' && applyProgressStatus === 'failed') {
    phase = 'apply-failed'
    nextGate = 'rerun-ensure'
  } else if (integrationStatus && integrationStatus !== 'ready') {
    phase = 'integration-blocked'
    nextGate = 'ensure'
  } else if (pageTaskReadiness === PAGE_TASK_READINESS.READY_TO_GENERATE) {
    phase = 'ready-to-generate'
    nextGate = 'page-generation'
  }

  return {
    phase,
    nextGate,
    nextStage,
    integrationReady: Boolean(integrationReadiness.ready),
    pageTaskReady: pageTaskReadiness === PAGE_TASK_READINESS.READY_TO_GENERATE,
    integrationComplete,
    userVisibleState,
    integrationStatus,
    pageTaskReadiness,
    applyProgressStatus,
    applyProgressStage,
  }
}

function normalizePageTaskStatus(status = {}) {
  const readiness = normalizeString(status.pageTaskReadiness)
  const normalizedReadiness =
    readiness === PAGE_TASK_READINESS.READY_TO_GENERATE
      ? PAGE_TASK_READINESS.READY_TO_GENERATE
      : PAGE_TASK_READINESS.ENSURE_ONLY
  const integrationComplete = normalizedReadiness === PAGE_TASK_READINESS.READY_TO_GENERATE
  const userVisibleState = integrationComplete
    ? PAGE_TASK_USER_VISIBLE_STATE.INTEGRATION_COMPLETE
    : PAGE_TASK_USER_VISIBLE_STATE.MATERIALIZED_ONLY
  const integrationReadiness = toIntegrationReadinessSnapshot(status.integrationReadiness)
  const nextStage = resolvePageTaskNextStage({
    integrationReadiness,
    pageTaskReadiness: normalizedReadiness,
  })
  const lifecycleProfile = buildLifecycleProfile({
    integrationReadiness,
    pageTaskReadiness: normalizedReadiness,
    integrationComplete,
    userVisibleState,
  })
  const actionPolicy =
    normalizedReadiness === PAGE_TASK_READINESS.READY_TO_GENERATE
      ? {
          allowedActions: [],
          forbiddenActions: [],
        }
      : {
          allowedActions: normalizeStringArray(
            status.allowedActions,
            PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS
          ),
          forbiddenActions: normalizeStringArray(status.forbiddenActions, DEFAULT_FORBIDDEN_ACTIONS),
        }

  return {
    schema: normalizeString(status.schema) || 'hiui-design-project-page-task-status.v1',
    updatedAt: normalizeString(status.updatedAt),
    completionContract: PAGE_TASK_COMPLETION_CONTRACT,
    integrationComplete,
    userVisibleState,
    nextStage,
    lifecycleProfile,
    integrationReadiness,
    pageTaskReadiness: normalizedReadiness,
    reason: normalizeString(status.reason),
    gateStatusReason:
      normalizeString(status.gateStatusReason) || normalizeString(status.reason),
    nextCommand: normalizeString(status.nextCommand),
    nextRequiredAction:
      normalizeString(status.nextRequiredAction) ||
      (normalizedReadiness === PAGE_TASK_READINESS.READY_TO_GENERATE
        ? 'page-generation'
        : integrationReadiness?.ready
          ? 'typical-page:preflight'
          : 'typical-page:ensure'),
    staleInputs: normalizeStaleInputs(status.staleInputs),
    canAutoRecover: status.canAutoRecover === true,
    contractSnapshotId: normalizeString(status.contractSnapshotId),
    requiredManualActions: normalizeStringArray(status.requiredManualActions),
    recommendedSteps: normalizeStringArray(status.recommendedSteps),
    allowedActions: actionPolicy.allowedActions,
    forbiddenActions: actionPolicy.forbiddenActions,
    updatedBy: normalizeString(status.updatedBy),
    doctor: normalizeDoctorState(status.doctor),
    freshness: normalizeFreshness(status.freshness),
  }
}

export function resolveProjectPageTaskStatusPath(targetRoot) {
  return path.join(targetRoot, PROJECT_PAGE_TASK_STATUS_RELATIVE_PATH)
}

export async function readProjectPageTaskStatus(targetRoot) {
  const statusPath = resolveProjectPageTaskStatusPath(targetRoot)
  if (!(await pathExists(statusPath))) return null

  return normalizePageTaskStatus(JSON.parse(await fs.readFile(statusPath, 'utf8')))
}

export async function writeProjectPageTaskStatus({ targetRoot, status }) {
  const statusPath = resolveProjectPageTaskStatusPath(targetRoot)
  const nextStatus = normalizePageTaskStatus({
    ...status,
    updatedAt: new Date().toISOString(),
  })

  await ensureDir(path.dirname(statusPath))
  await fs.writeFile(statusPath, `${JSON.stringify(nextStatus, null, 2)}\n`, 'utf8')
  return nextStatus
}

export async function markPageTaskEnsureOnly({
  targetRoot,
  integrationReadiness,
  reason,
  gateStatusReason,
  nextCommand,
  nextRequiredAction,
  staleInputs = [],
  canAutoRecover = false,
  contractSnapshotId = '',
  requiredManualActions = [],
  recommendedSteps = [],
  updatedBy,
  allowedActions = PAGE_TASK_GATE_BLOCKED_ALLOWED_ACTIONS,
  forbiddenActions = DEFAULT_FORBIDDEN_ACTIONS,
  doctor,
  freshness,
}) {
  return writeProjectPageTaskStatus({
    targetRoot,
    status: {
      integrationReadiness: toIntegrationReadinessSnapshot(integrationReadiness),
      pageTaskReadiness: PAGE_TASK_READINESS.ENSURE_ONLY,
      reason,
      gateStatusReason,
      nextCommand,
      nextRequiredAction,
      staleInputs,
      canAutoRecover,
      contractSnapshotId,
      requiredManualActions,
      recommendedSteps,
      updatedBy,
      allowedActions,
      forbiddenActions,
      doctor,
      freshness,
    },
  })
}

export async function markPageTaskReadyToGenerate({
  targetRoot,
  integrationReadiness,
  reason,
  gateStatusReason,
  nextCommand = '',
  nextRequiredAction = 'page-generation',
  staleInputs = [],
  canAutoRecover = false,
  contractSnapshotId = '',
  requiredManualActions = [],
  recommendedSteps = [],
  updatedBy,
  allowedActions = [],
  forbiddenActions = [],
  doctor,
  freshness,
}) {
  return writeProjectPageTaskStatus({
    targetRoot,
    status: {
      integrationReadiness: toIntegrationReadinessSnapshot(integrationReadiness),
      pageTaskReadiness: PAGE_TASK_READINESS.READY_TO_GENERATE,
      reason,
      gateStatusReason,
      nextCommand,
      nextRequiredAction,
      staleInputs,
      canAutoRecover,
      contractSnapshotId,
      requiredManualActions,
      recommendedSteps,
      updatedBy,
      allowedActions,
      forbiddenActions,
      doctor,
      freshness,
    },
  })
}
