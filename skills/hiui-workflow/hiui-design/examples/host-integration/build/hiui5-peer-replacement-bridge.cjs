const path = require('node:path')
const {
  HIUI5_ISOLATED_PEER_ALIASES,
  createSchemaBridgePeerPattern,
} = require('../../../scripts/lib/hiui5-peer-contract.cjs')

function resolveOptionalPackageDir(spec) {
  try {
    return path.dirname(require.resolve(spec))
  } catch {
    return ''
  }
}

const hiui5PackageResolveBase = resolveOptionalPackageDir('hiui5/package.json')
const schemaBridgePeerPattern = createSchemaBridgePeerPattern()
const managedLocalRuntimeBridgeIssuerPattern = /components[\\/]hiui-design-runtime/
// Keep the historical export name, but point it at the managed local runtime family.
const hiui5DesignBridgeIssuerPattern = managedLocalRuntimeBridgeIssuerPattern
const scopedHiui5BridgeIssuerPatterns = [
  hiui5DesignBridgeIssuerPattern,
  /@hi-ui[\\/](?:schema-[^\\/]+|dumb-wrapper|number-range|group|style-inject|use-ref-state|use-subscription|utility-types)/,
]
const schemaTypesShimPath = path.resolve(__dirname, '..', 'src', 'shims', 'schema-types-empty.js')
const reactDomClientShimPath = path.resolve(__dirname, '..', 'src', 'shims', 'react-dom-client.js')
const PACKAGE_ALIAS_MAP = { ...HIUI5_ISOLATED_PEER_ALIASES }
const SPECIAL_PACKAGE_ALIAS_MAP = {
  '@hi-ui/schema-group': path.resolve(
    __dirname,
    '..',
    'src',
    'shims',
    'schema-group-compat',
    'index.cjs'
  ),
  '@hi-ui/schema-group/descriptions': path.resolve(
    __dirname,
    '..',
    'src',
    'shims',
    'schema-group-compat',
    'descriptions.cjs'
  ),
  '@hi-ui/schema-group/table': path.resolve(
    __dirname,
    '..',
    'src',
    'shims',
    'schema-group-compat',
    'table.cjs'
  ),
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function createReplacementPlugin(NormalModuleReplacementPlugin, request, replacement) {
  return new NormalModuleReplacementPlugin(new RegExp(`^${escapeRegExp(request)}$`), (resource) => {
    resource.request = replacement
  })
}

function getScopedBridgeIssuerCandidates(resource) {
  return [
    resource?.contextInfo?.issuer,
    resource?.createData?.resourceResolveData?.context?.issuer,
    resource?.context,
    resource?.resource,
    resource?.request,
  ].filter(Boolean)
}

function shouldUseIsolatedHiui5Peer(resource) {
  return getScopedBridgeIssuerCandidates(resource).some((candidate) =>
    scopedHiui5BridgeIssuerPatterns.some((pattern) => pattern.test(String(candidate)))
  )
}

function createScopedHiui5PeerReplacementPlugin(
  NormalModuleReplacementPlugin,
  request,
  replacement
) {
  return new NormalModuleReplacementPlugin(new RegExp(`^${escapeRegExp(request)}$`), (resource) => {
    if (!shouldUseIsolatedHiui5Peer(resource)) return
    resource.request = replacement
  })
}

function createHiui5PeerReplacementPlugins(NormalModuleReplacementPlugin) {
  return [
    createReplacementPlugin(
      NormalModuleReplacementPlugin,
      '@hi-ui/schema-types',
      schemaTypesShimPath,
    ),
    ...Object.entries(SPECIAL_PACKAGE_ALIAS_MAP).map(([request, replacement]) =>
      createReplacementPlugin(NormalModuleReplacementPlugin, request, replacement)
    ),
    ...Object.entries(PACKAGE_ALIAS_MAP).map(([request, replacement]) =>
      createReplacementPlugin(NormalModuleReplacementPlugin, request, replacement)
    ),
  ]
}

function createScopedHiui5PeerReplacementPlugins(NormalModuleReplacementPlugin) {
  return [
    createScopedHiui5PeerReplacementPlugin(
      NormalModuleReplacementPlugin,
      '@hi-ui/schema-types',
      schemaTypesShimPath,
    ),
    ...Object.entries(SPECIAL_PACKAGE_ALIAS_MAP).map(([request, replacement]) =>
      createReplacementPlugin(NormalModuleReplacementPlugin, request, replacement)
    ),
    ...Object.entries(PACKAGE_ALIAS_MAP).map(([request, replacement]) =>
      createScopedHiui5PeerReplacementPlugin(NormalModuleReplacementPlugin, request, replacement)
    ),
  ]
}

module.exports = {
  hiui5PackageResolveBase,
  schemaBridgePeerPattern,
  managedLocalRuntimeBridgeIssuerPattern,
  hiui5DesignBridgeIssuerPattern,
  scopedHiui5BridgeIssuerPatterns,
  schemaTypesShimPath,
  reactDomClientShimPath,
  PACKAGE_ALIAS_MAP,
  SPECIAL_PACKAGE_ALIAS_MAP,
  shouldUseIsolatedHiui5Peer,
  createHiui5PeerReplacementPlugins,
  createScopedHiui5PeerReplacementPlugin,
  createScopedHiui5PeerReplacementPlugins,
}
