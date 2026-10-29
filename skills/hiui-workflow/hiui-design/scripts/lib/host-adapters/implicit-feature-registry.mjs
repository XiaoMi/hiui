function normalizeString(value) {
  return String(value || '').trim()
}

export function buildImplicitFeatureRegistryMountAction({
  existingShellPath = '',
  existingRegistryPath = '',
  existingImplicitFeatureBaseDir = '',
  existingImplicitFeatureEntryPattern = '',
  existingImplicitFeatureEntryFileName = '',
  existingImplicitFeatureEntryExtension = '',
  normalizedAppEntryPath = '',
  normalizedPageRoutePath = '',
  normalizedMenuTitle = '',
} = {}) {
  if (!existingImplicitFeatureBaseDir) {
    return {
      action: 'ask-user',
      targetShellPath: existingShellPath,
      targetRegistryPath: existingRegistryPath,
      targetEntryPath: '',
      targetEntryKind: 'implicit-feature-registry',
      appEntryPath: normalizedAppEntryPath,
      pageRoutePath: normalizedPageRoutePath,
      menuTitle: normalizedMenuTitle,
      mustDoBeforePageCode: true,
      selectedMountSource: 'implicit-feature-registry',
      reason:
        'Existing project navigation auto-discovers feature entry modules, but no target feature base directory could be resolved.',
    }
  }

  return {
    action: 'materialize-implicit-feature-entry',
    targetShellPath: existingShellPath,
    targetRegistryPath: existingRegistryPath,
    targetEntryPath: existingImplicitFeatureBaseDir,
    targetEntryKind: 'implicit-feature-registry',
    appEntryPath: normalizedAppEntryPath,
    pageRoutePath: normalizedPageRoutePath,
    menuTitle: normalizedMenuTitle,
    mustDoBeforePageCode: true,
    selectedMountSource: 'implicit-feature-registry',
    implicitFeatureBaseDir: existingImplicitFeatureBaseDir,
    implicitFeatureEntryPattern: normalizeString(existingImplicitFeatureEntryPattern),
    implicitFeatureEntryFileName: normalizeString(existingImplicitFeatureEntryFileName),
    implicitFeatureEntryExtension: normalizeString(existingImplicitFeatureEntryExtension),
    reason: existingRegistryPath
      ? `Materialize the page as a feature entry module under ${existingImplicitFeatureBaseDir}; ${existingRegistryPath} auto-discovers feature routes through import.meta.glob.`
      : `Materialize the page as a feature entry module under ${existingImplicitFeatureBaseDir} so the existing project navigation can auto-discover it.`,
  }
}
