export const CAMORA_RUNTIME_CLOSURE_STATUS = {
  PASS: 'pass',
  NEEDS_LOCAL_RESTART: 'needs-local-restart',
  START_LOCAL_REMOTE: 'start-local-remote',
  BLOCKED_BY_CODE_REGISTRATION: 'blocked-by-code-registration',
  MANUAL_CHECK: 'manual-check',
}

export const CAMORA_RUNTIME_CLOSURE_DIAGNOSIS_KIND = {
  READY_FOR_CAMORA_LINK: 'ready-for-camora-link',
  STALE_LOCAL_BUNDLE_SUSPECTED: 'stale-local-bundle-suspected',
  LOCAL_REMOTE_UNREACHABLE: 'local-remote-unreachable',
  CODE_REGISTRATION_INCOMPLETE: 'code-registration-incomplete',
  MANUAL_RUNTIME_CHECK_REQUIRED: 'manual-runtime-check-required',
}

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeBlockedChecks(codeRegistrationEvidence = {}) {
  return Array.isArray(codeRegistrationEvidence?.blockedChecks)
    ? codeRegistrationEvidence.blockedChecks.map((item) => normalizeString(item)).filter(Boolean)
    : []
}

function deriveObservationKind(runtimeSourceStatus = {}) {
  const explicitKind = normalizeString(runtimeSourceStatus?.observation?.kind)
  if (explicitKind) return explicitKind

  const localSourceStatus = normalizeString(runtimeSourceStatus?.checks?.localSourceAvailable?.status)
  const exposeStatus = normalizeString(runtimeSourceStatus?.checks?.exposeDiscovered?.status)

  if (localSourceStatus === 'fail') return 'remote-entry-unreachable'
  if (localSourceStatus === 'pass' && exposeStatus === 'pass') {
    return 'remote-entry-reachable-and-expose-found'
  }
  if (localSourceStatus === 'pass' && exposeStatus === 'fail') {
    return 'remote-entry-reachable-but-expose-missing'
  }

  return ''
}

function buildBaseClosure({
  remoteEntryUrl = '',
  verifyCommand = '',
  codeRegistrationEvidence = {},
} = {}) {
  return {
    applicable: true,
    status: CAMORA_RUNTIME_CLOSURE_STATUS.MANUAL_CHECK,
    diagnosisKind: CAMORA_RUNTIME_CLOSURE_DIAGNOSIS_KIND.MANUAL_RUNTIME_CHECK_REQUIRED,
    confidence: 'low',
    linkReady: 'unknown',
    reason: '',
    suggestedAction: 'verify-runtime-source',
    remoteEntryUrl: normalizeString(remoteEntryUrl),
    verifyCommand: normalizeString(verifyCommand),
    codeRegistration: {
      status: normalizeString(codeRegistrationEvidence?.status) || 'unknown',
      blockedChecks: normalizeBlockedChecks(codeRegistrationEvidence),
    },
  }
}

export function isCamoraRuntimeClosureApplicable({
  remoteDebugContract = {},
} = {}) {
  return (
    remoteDebugContract?.enabled === true &&
    normalizeString(remoteDebugContract?.mode) === 'camora-regex-proxy'
  )
}

export function buildCamoraRuntimeClosure({
  remoteDebugContract = {},
  runtimeSourceStatus = null,
  codeRegistrationEvidence = {},
  expectedExposeName = '',
  verifyCommand = '',
} = {}) {
  if (!isCamoraRuntimeClosureApplicable({ remoteDebugContract })) {
    return {
      applicable: false,
    }
  }

  const closure = buildBaseClosure({
    remoteEntryUrl: runtimeSourceStatus?.remoteEntryUrl || '',
    verifyCommand,
    codeRegistrationEvidence,
  })
  const normalizedExposeName = normalizeString(expectedExposeName || runtimeSourceStatus?.exposeName)
  const blockedChecks = closure.codeRegistration.blockedChecks
  const codeStatus = closure.codeRegistration.status
  const observationKind = deriveObservationKind(runtimeSourceStatus)
  const runtimeStatus = normalizeString(runtimeSourceStatus?.status)

  if (codeStatus !== 'proven') {
    closure.status = CAMORA_RUNTIME_CLOSURE_STATUS.BLOCKED_BY_CODE_REGISTRATION
    closure.diagnosisKind = CAMORA_RUNTIME_CLOSURE_DIAGNOSIS_KIND.CODE_REGISTRATION_INCOMPLETE
    closure.confidence = blockedChecks.length > 0 ? 'high' : 'medium'
    closure.linkReady = 'not-ready'
    closure.reason =
      blockedChecks.length > 0
        ? `Code registration is still incomplete for the Camora entry. Fix ${blockedChecks.join(', ')} before attributing failures to the local runtime source.`
        : 'Code registration is not yet proven for the Camora entry, so runtime failure cannot be safely attributed to a stale local bundle.'
    closure.suggestedAction = 'inspect-code-registration'
    return closure
  }

  if (runtimeStatus === 'pass' || observationKind === 'remote-entry-reachable-and-expose-found') {
    closure.status = CAMORA_RUNTIME_CLOSURE_STATUS.PASS
    closure.diagnosisKind = CAMORA_RUNTIME_CLOSURE_DIAGNOSIS_KIND.READY_FOR_CAMORA_LINK
    closure.confidence = 'high'
    closure.linkReady = 'ready'
    closure.reason = normalizedExposeName
      ? `Code registration is complete and the live remoteEntry.js already exposes ${normalizedExposeName}.`
      : 'Code registration is complete and the live remoteEntry.js already exposes the requested Camora entry.'
    closure.suggestedAction = 'none'
    return closure
  }

  if (observationKind === 'remote-entry-unreachable') {
    closure.status = CAMORA_RUNTIME_CLOSURE_STATUS.START_LOCAL_REMOTE
    closure.diagnosisKind = CAMORA_RUNTIME_CLOSURE_DIAGNOSIS_KIND.LOCAL_REMOTE_UNREACHABLE
    closure.confidence = 'high'
    closure.linkReady = 'not-ready'
    closure.reason = normalizeString(runtimeSourceStatus?.observation?.reason) ||
      'Code registration is complete, but the local Camora remoteEntry.js could not be reached.'
    closure.suggestedAction = 'start-dev-server'
    return closure
  }

  if (observationKind === 'remote-entry-reachable-but-expose-missing') {
    closure.status = CAMORA_RUNTIME_CLOSURE_STATUS.NEEDS_LOCAL_RESTART
    closure.diagnosisKind = CAMORA_RUNTIME_CLOSURE_DIAGNOSIS_KIND.STALE_LOCAL_BUNDLE_SUSPECTED
    closure.confidence = 'high'
    closure.linkReady = 'not-ready'
    closure.reason = normalizedExposeName
      ? `Code registration is complete, but the live remoteEntry.js still does not expose ${normalizedExposeName}. This strongly suggests Camora is still serving a stale local bundle.`
      : 'Code registration is complete, but the live remoteEntry.js still does not expose the requested entry. This strongly suggests Camora is still serving a stale local bundle.'
    closure.suggestedAction = 'restart-dev-server'
    return closure
  }

  closure.status = CAMORA_RUNTIME_CLOSURE_STATUS.MANUAL_CHECK
  closure.diagnosisKind = CAMORA_RUNTIME_CLOSURE_DIAGNOSIS_KIND.MANUAL_RUNTIME_CHECK_REQUIRED
  closure.confidence = runtimeStatus === 'not-run' || !runtimeStatus ? 'medium' : 'low'
  closure.linkReady = runtimeStatus === 'fail' ? 'not-ready' : 'unknown'
  closure.reason =
    normalizeString(runtimeSourceStatus?.observation?.reason) ||
    'Code registration is complete, but the live Camora runtime source has not yet produced enough evidence to decide whether the local bundle is stale.'
  closure.suggestedAction = 'verify-runtime-source'
  return closure
}
