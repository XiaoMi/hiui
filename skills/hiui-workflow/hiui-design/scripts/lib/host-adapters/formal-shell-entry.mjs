export function buildFormalShellEntryMountAction({
  existingShellPath = '',
  existingRegistryPath = '',
  normalizedAppEntryPath = '',
  normalizedPageRoutePath = '',
  normalizedMenuTitle = '',
  normalizedAppEntryMountPlan = null,
} = {}) {
  if (!normalizedAppEntryPath || normalizedAppEntryMountPlan?.supported === false) {
    return {
      action: 'ask-user',
      targetShellPath: existingShellPath || 'src/business-shell/app-frame.tsx',
      targetRegistryPath: existingRegistryPath || 'src/business-shell/routes.tsx',
      appEntryPath: normalizedAppEntryPath,
      pageRoutePath: normalizedPageRoutePath,
      menuTitle: normalizedMenuTitle,
      mustDoBeforePageCode: true,
      reason:
        normalizedAppEntryMountPlan?.reason ||
        'The target project real app entry is not yet confirmed. Ask the user for the router mount entry before creating the first managed shell.',
    }
  }

  return {
    action: 'create-formal-shell-and-mount-entry',
    targetShellPath: existingShellPath || 'src/business-shell/app-frame.tsx',
    targetRegistryPath: existingRegistryPath || 'src/business-shell/routes.tsx',
    appEntryPath: normalizedAppEntryPath,
    pageRoutePath: normalizedPageRoutePath,
    menuTitle: normalizedMenuTitle,
    mustDoBeforePageCode: true,
    reason:
      'Create the first managed shell and registry, then mount that registry in the real app entry before writing page code.',
    entryMountStrategy: normalizedAppEntryMountPlan?.strategy || '',
  }
}
