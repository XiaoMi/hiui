function readEnv(env, name) {
  return String(env?.[name] || '').trim()
}

export function getLightFlowFeatureFlags(env = process.env) {
  return {
    lightFlowEnabled: readEnv(env, 'HIUI_DESIGN_LIGHT_FLOW') !== '0',
    syncProfile: readEnv(env, 'HIUI_DESIGN_SYNC_PROFILE') || 'minimal',
    acceptanceProfile: readEnv(env, 'HIUI_DESIGN_ACCEPTANCE_PROFILE') || 'preview',
    disallowUnsafeManual: readEnv(env, 'HIUI_DESIGN_DISALLOW_UNSAFE_MANUAL') === '1' || readEnv(env, 'CI') === 'true',
    allowProvidedHostEvidence: readEnv(env, 'HIUI_DESIGN_ALLOW_PROVIDED_HOST_EVIDENCE') === '1',
    changeSizeMaxFiles: Number(readEnv(env, 'HIUI_DESIGN_CHANGE_SIZE_MAX_FILES') || 50),
    changeSizeMaxLines: Number(readEnv(env, 'HIUI_DESIGN_CHANGE_SIZE_MAX_LINES') || 3000),
  }
}
