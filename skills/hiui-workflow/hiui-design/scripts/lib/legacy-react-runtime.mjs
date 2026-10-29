const CLASSIC_REACT_RUNTIME_FRAMEWORKS = new Set([
  'rspack-module-federation',
  'webpack-module-federation',
  'micro-frontend',
  'rspack-react',
  'webpack-react',
])

function resolveHostProfile(input = null) {
  if (input?.hostProfile && typeof input.hostProfile === 'object') {
    return input.hostProfile
  }

  return input && typeof input === 'object' ? input : {}
}

export function shouldPreserveExplicitReactImport(input = null) {
  const hostProfile = resolveHostProfile(input)
  if (hostProfile.legacyReactRuntime !== true) return false

  const framework = String(hostProfile.framework || '').trim()
  const riskTags = Array.isArray(hostProfile.riskTags) ? hostProfile.riskTags : []
  return (
    CLASSIC_REACT_RUNTIME_FRAMEWORKS.has(framework) ||
    riskTags.includes('module-federation')
  )
}

export function sourceNeedsExplicitLegacyReactRuntimeImport(source = '') {
  return (
    /<([A-Za-z][\w:.-]*|>)/.test(source) ||
    /<\/[A-Za-z][\w:.-]*>/.test(source) ||
    /<>\s*/.test(source)
  )
}

export function hasExplicitLegacyReactRuntimeImport(source = '') {
  return (
    /import\s+React(?:\s*,|\s+from\s+['"]react['"])/.test(source) ||
    /import\s+\*\s+as\s+React\s+from\s+['"]react['"]/.test(source)
  )
}

export function ensureLegacyReactDefaultImport(source = '', input = null) {
  if (!shouldPreserveExplicitReactImport(input)) {
    return source
  }

  if (hasExplicitLegacyReactRuntimeImport(source)) {
    return source
  }

  return `import React from 'react'\n${source}`
}
