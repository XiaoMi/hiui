export const PUBLIC_INSTALL_MODES = ['rules-only', 'host-integration']
export const RECOGNIZED_INSTALL_MODES = [...PUBLIC_INSTALL_MODES]
export const DEFAULT_INSTALL_MODE = 'auto'

export function isRecognizedInstallMode(mode, { allowAuto = true } = {}) {
  if (allowAuto && mode === DEFAULT_INSTALL_MODE) return true
  return RECOGNIZED_INSTALL_MODES.includes(mode)
}

export function getInstallModeChoices({ includeAuto = true } = {}) {
  return includeAuto ? [DEFAULT_INSTALL_MODE, ...RECOGNIZED_INSTALL_MODES] : [...RECOGNIZED_INSTALL_MODES]
}

export function formatInstallModeUsage({ includeAuto = true } = {}) {
  return getInstallModeChoices({ includeAuto }).join('|')
}

export function getInstallModeErrorMessage({ allowAuto = true } = {}) {
  const label = allowAuto ? '--mode' : 'mode'
  const choices = formatInstallModeUsage({ includeAuto: allowAuto })
  return `Expected ${label} to be ${choices}`
}
