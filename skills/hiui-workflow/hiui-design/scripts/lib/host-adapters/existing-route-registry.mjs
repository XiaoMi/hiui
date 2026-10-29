function normalizeString(value) {
  return String(value || '').trim()
}

export function buildExistingRouteRegistryMountAction({
  existingShellPath = '',
  existingRegistryPath = '',
  existingRegistryKind = '',
  existingRegistryAutoMountSupported = false,
  existingRegistrySupportReason = '',
  normalizedAppEntryPath = '',
  normalizedPageRoutePath = '',
  normalizedMenuTitle = '',
  selectedMountSource = 'navigation-evidence',
} = {}) {
  if (existingRegistryPath && !existingRegistryAutoMountSupported) {
    return {
      action: 'manual-register-existing-registry',
      targetShellPath: existingShellPath,
      targetRegistryPath: existingRegistryPath,
      targetEntryPath: '',
      targetEntryKind: '',
      appEntryPath: normalizedAppEntryPath,
      pageRoutePath: normalizedPageRoutePath,
      menuTitle: normalizedMenuTitle,
      mustDoBeforePageCode: false,
      selectedMountSource: normalizeString(selectedMountSource) || 'navigation-evidence',
      routeRegistryKind: existingRegistryKind,
      reason:
        normalizeString(existingRegistrySupportReason) ||
        (existingRegistryPath
          ? `Page source can be generated now. Then manually register the new page inside the confirmed existing navigation registry ${existingRegistryPath} because the current executor cannot patch this registry shape automatically yet.`
          : 'Page source can be generated now. Then manually register the new page inside the confirmed existing navigation registry because the current executor cannot patch this registry shape automatically yet.'),
    }
  }

  return {
    action: 'append-existing-registry',
    targetShellPath: existingShellPath,
    targetRegistryPath: existingRegistryPath,
    targetEntryPath: '',
    targetEntryKind: '',
    appEntryPath: normalizedAppEntryPath,
    pageRoutePath: normalizedPageRoutePath,
    menuTitle: normalizedMenuTitle,
    mustDoBeforePageCode: true,
    selectedMountSource: normalizeString(selectedMountSource) || 'navigation-evidence',
    reason: existingRegistryPath
      ? `Append the page to the confirmed existing navigation registry at ${existingRegistryPath} before writing page code.`
      : 'Append the page to the confirmed existing navigation registry before writing page code.',
  }
}
