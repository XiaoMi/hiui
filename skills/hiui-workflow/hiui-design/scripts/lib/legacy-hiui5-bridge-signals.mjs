function normalizeSource(source = '') {
  return String(source || '')
}

export function hasManagedScopedHiui5BridgeReference(source = '') {
  const raw = normalizeSource(source)
  return (
    raw.includes('createScopedHiui5PeerReplacementPlugins') ||
    (raw.includes('hiui5-peer-replacement-bridge.cjs') &&
      raw.includes('hiui5PeerReplacementPlugins'))
  )
}

export function hasInlineHiui5BridgeMarkers(source = '') {
  const raw = normalizeSource(source)
  return (
    raw.includes('hiui5PackageResolveBase') &&
    raw.includes('schemaBridgePeerPattern') &&
    raw.includes('NormalModuleReplacementPlugin')
  )
}

export function hasScopedHiui5BridgeMarkers(source = '') {
  const raw = normalizeSource(source)
  return (
    hasInlineHiui5BridgeMarkers(raw) ||
    hasManagedScopedHiui5BridgeReference(raw) ||
    raw.includes('createScopedHiui5PeerReplacementPlugins')
  )
}

export function bridgeCoversHiuiRuntimePackage(source = '', depName = '') {
  const raw = normalizeSource(source)
  const normalizedDepName = String(depName || '').trim()

  if (!normalizedDepName) return false
  if (
    raw.includes(`'${normalizedDepName}'`) ||
    raw.includes(`"${normalizedDepName}"`)
  ) {
    return true
  }

  return (
    normalizedDepName.startsWith('@hi-ui/') &&
    hasManagedScopedHiui5BridgeReference(raw)
  )
}
