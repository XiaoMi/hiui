function normalizeString(value) {
  return String(value || '').trim()
}

function isModuleFederationBusinessEntryKind(kind = '') {
  return ['module-federation-exposes', 'module-federation-expose'].includes(
    normalizeString(kind)
  )
}

export function buildLegacyBusinessEntryMountAction({
  existingShellPath = '',
  existingEntryPath = '',
  existingEntryKind = '',
  existingBackRoutePath = '',
  existingBackTitle = '',
  existingBackName = '',
  normalizedAppEntryPath = '',
  normalizedPageRoutePath = '',
  normalizedMenuTitle = '',
  normalizedResolvedMode = '',
  pageRelationKind = '',
  selectedMountSource = 'business-entry-evidence',
} = {}) {
  const normalizedSource = normalizeString(selectedMountSource) || 'business-entry-evidence'
  const normalizedPageRelationKind = normalizeString(pageRelationKind)
  const shouldMaterializeMfPublishEntry =
    normalizedResolvedMode === 'rules-only' &&
    isModuleFederationBusinessEntryKind(existingEntryKind) &&
    normalizedPageRelationKind !== 'same-module-subview'

  if (!existingEntryPath) {
    return {
      action: 'ask-user',
      targetShellPath: existingShellPath,
      targetRegistryPath: '',
      targetEntryPath: '',
      targetEntryKind: existingEntryKind,
      appEntryPath: normalizedAppEntryPath,
      pageRoutePath: normalizedPageRoutePath,
      menuTitle: normalizedMenuTitle,
      mustDoBeforePageCode: true,
      selectedMountSource: normalizedSource,
      reason:
        'Business entry evidence was found, but no writable targetEntryPath could be resolved for automatic patching.',
    }
  }

  return {
    action: shouldMaterializeMfPublishEntry
      ? 'materialize-mf-publish-entry'
      : 'append-existing-entry',
    targetShellPath: existingShellPath,
    targetRegistryPath: '',
    targetEntryPath: existingEntryPath,
    targetEntryKind: existingEntryKind,
    backRoutePath: existingBackRoutePath,
    backTitle: existingBackTitle,
    backName: existingBackName,
    appEntryPath: normalizedAppEntryPath,
    pageRoutePath: normalizedPageRoutePath,
    menuTitle: normalizedMenuTitle,
    mustDoBeforePageCode: false,
    selectedMountSource: normalizedSource,
    reason:
      normalizedSource === 'related-page-evidence'
        ? existingEntryPath
          ? `Page source can be generated now. The page relation is same-module-subview, so keep it inside the confirmed parent page flow at ${existingEntryPath} instead of registering a new formal navigation entry.`
          : 'Page source can be generated now. The page relation is same-module-subview, so connect it from the confirmed parent page flow instead of registering a new formal navigation entry.'
        : normalizedSource === 'explicit-business-entry-contract'
        ? `Page source can be generated now. Then manually reuse the confirmed legacy business entry declared by navigationMountContract at ${existingEntryPath}.`
        : isModuleFederationBusinessEntryKind(existingEntryKind)
          ? shouldMaterializeMfPublishEntry
            ? `Page source can be generated now. Then materialize a managed Module Federation publish entry and repoint the confirmed Module Federation expose contract at ${existingEntryPath}.`
            : normalizedPageRelationKind === 'same-module-subview'
              ? `Page source can be generated now. The page relation is same-module-subview, so keep it under the confirmed parent Module Federation business entry at ${existingEntryPath} instead of materializing a standalone publish entry.`
            : `Page source can be generated now. Then manually extend the confirmed Module Federation expose contract at ${existingEntryPath}.`
          : `Page source can be generated now. Then manually reuse the confirmed existing business entry at ${existingEntryPath}.`,
  }
}
