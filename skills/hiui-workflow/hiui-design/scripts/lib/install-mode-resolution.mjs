import { readAppliedInstallMode } from './apply-state.mjs'
import { evaluateInstallModeCapability } from './install-mode-capability.mjs'

export async function resolveAutoInstallMode({ requestedMode, targetRoot }) {
  if (requestedMode !== 'auto') {
    return {
      mode: requestedMode,
      source: 'explicit',
    }
  }

  const appliedMode = await readAppliedInstallMode(targetRoot)
  if (appliedMode) {
    return {
      mode: appliedMode,
      source: 'apply-state',
    }
  }

  const capability = await evaluateInstallModeCapability({
    targetRoot,
    ignoreRelativePaths: ['src/typical-page-preview'],
  })

  return {
    mode: capability.recommendedMode,
    source: 'environment-probe',
    requiresPrivateCompatibilityBridge: capability.requiresPrivateCompatibilityBridge,
    reason: capability.reason,
  }
}
