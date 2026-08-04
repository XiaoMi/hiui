const VALID_INSTALL_MODES = new Set(['auto', 'rules-only', 'host-integration', 'legacy-host-compatible'])
const EXPLICIT_INSTALL_MODES = new Set(['rules-only', 'host-integration', 'legacy-host-compatible'])

export function normalizeRequestedMode(value = 'auto') {
  const mode = String(value || 'auto').trim() || 'auto'
  if (!VALID_INSTALL_MODES.has(mode)) {
    throw new Error(
      `Unsupported hiui-design install mode: ${mode}. Expected auto, rules-only, host-integration, or legacy-host-compatible.`
    )
  }
  return mode
}

export function resolveRecommendedMode({ hostProfile, legacyHostRuntime } = {}) {
  return legacyHostRuntime?.incompatible ? 'legacy-host-compatible' : hostProfile?.recommendedMode || 'rules-only'
}

export function resolveInstallModePolicy({
  requestedMode = 'auto',
  hostProfile,
  legacyHostRuntime,
  allowModeOverride = false,
  overrideReason = '',
} = {}) {
  const normalizedRequestedMode = normalizeRequestedMode(requestedMode)
  const recommendedMode = resolveRecommendedMode({ hostProfile, legacyHostRuntime })
  const explicitMode = EXPLICIT_INSTALL_MODES.has(normalizedRequestedMode)
  const mode = explicitMode ? normalizedRequestedMode : recommendedMode
  const trimmedOverrideReason = String(overrideReason || '').trim()
  const warnings = []
  const blockingReasons = []

  if (legacyHostRuntime?.incompatible && explicitMode && mode !== 'legacy-host-compatible') {
    blockingReasons.push(
      `Detected legacy host-compatible runtime but explicit mode is ${mode}: ${(legacyHostRuntime.reasons || []).join('; ')}`
    )
  }

  if (explicitMode && mode !== recommendedMode) {
    if (allowModeOverride && trimmedOverrideReason) {
      warnings.push(`Detected profile recommends ${recommendedMode}, but explicit mode ${mode} is audited.`)
      return {
        requestedMode: normalizedRequestedMode,
        recommendedMode,
        mode,
        modeSelectionStatus: 'overridden',
        overrideReason: trimmedOverrideReason,
        warnings,
        blockingReasons,
      }
    }

    return {
      requestedMode: normalizedRequestedMode,
      recommendedMode,
      mode,
      modeSelectionStatus: 'blocked',
      overrideReason: '',
      warnings,
      blockingReasons: blockingReasons.length > 0
        ? blockingReasons
        : [
            `Detected host profile recommends ${recommendedMode}, but ${mode} was requested.`,
            'Mode mismatches are not fallback, reference-assets shortcut, or temporary onboarding paths.',
          ],
    }
  }

  return {
    requestedMode: normalizedRequestedMode,
    recommendedMode,
    mode,
    modeSelectionStatus: 'matched',
    overrideReason: '',
    warnings,
    blockingReasons,
  }
}

export function assertInstallModePolicyAllowed({ policy, hostProfile } = {}) {
  if (!policy || policy.modeSelectionStatus !== 'blocked') {
    return
  }

  throw new Error(
    [
      'modeSelectionStatus=blocked',
      ...policy.blockingReasons,
      `Rerun with --mode ${policy.recommendedMode}, or pass --allow-mode-override --override-reason <reason> for an audited exception.`,
      `detected profile: ${hostProfile?.projectType || 'unknown'} / ${hostProfile?.framework || 'unknown'} / ${hostProfile?.runtime || 'unknown'} / ${hostProfile?.routing || 'unknown'}`,
    ].join(' ')
  )
}

export function isAuditedModeOverride({ modeLock, projectModeLock, mode, recommendedMode } = {}) {
  const lock = modeLock || projectModeLock || {}
  return (
    String(lock.modeSelectionStatus || '').trim() === 'overridden' &&
    String(lock.overrideReason || '').trim().length > 0 &&
    lock.mode === mode &&
    lock.recommendedMode === recommendedMode
  )
}
