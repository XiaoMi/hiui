import { detectHostProfile } from './detect-host-profile.mjs'

const NATIVE_HOST_INTEGRATION_FRAMEWORKS = new Set([
  'react-vite',
  'react-vite-router',
  'react-vite-custom-layout',
  'react-router-custom',
])

export async function evaluateInstallModeCapability({ targetRoot, ignoreRelativePaths = [] }) {
  const hostProfile = await detectHostProfile(targetRoot, { ignoreRelativePaths })
  const requiresPrivateCompatibilityBridge = !NATIVE_HOST_INTEGRATION_FRAMEWORKS.has(
    hostProfile.framework
  )

  return {
    recommendedMode: requiresPrivateCompatibilityBridge ? 'rules-only' : 'host-integration',
    requiresPrivateCompatibilityBridge,
    reason: requiresPrivateCompatibilityBridge
      ? `Detected ${hostProfile.framework} / ${hostProfile.projectType}. This target does not match the native standard host-integration carrier path, so a project-local compatibility bridge would be required.`
      : `Detected ${hostProfile.framework} / ${hostProfile.projectType}. This target matches the native standard host-integration carrier path and does not require a project-local compatibility bridge.`,
    hostProfile,
  }
}
