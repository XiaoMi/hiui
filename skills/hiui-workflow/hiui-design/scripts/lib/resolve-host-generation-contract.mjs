import { createRequire } from 'node:module'

const skillRequire = createRequire(import.meta.url)
const { HIUI5_ISOLATED_PEER_ALIASES } = skillRequire('./hiui5-peer-contract.cjs')

export const HOST_GENERATION_CONTRACT_SCOPE = 'new-generated-pages-and-support-files-only'
export const VERIFIED_VISUAL_REWRITE_SYMBOLS = {
  Button: '@hi-ui/button',
  EmptyState: '@hi-ui/empty-state',
  Loading: '@hi-ui/loading',
  Message: '@hi-ui/message',
  PageHeader: '@hi-ui/page-header',
}
export const VERIFIED_SUPPORT_FILE_REWRITE_IMPORTS = [
  {
    symbolName: 'useMemoizedFn',
    importKind: 'named',
    defaultImportSource: 'ahooks',
  },
  {
    symbolName: 'TextArea',
    importKind: 'default',
    sourcePackage: '@hi-ui/textarea',
    defaultImportSource: '@hi-ui/textarea',
  },
]

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeStringArray(value) {
  return Array.isArray(value)
    ? [...new Set(value.map((item) => normalizeString(item)).filter(Boolean))]
    : []
}

function buildVisualRewritePlan({
  highRiskLegacyModuleFederationHost = false,
  visualImportSource = 'hiui5',
  visualSplitAliasMap = {},
} = {}) {
  return {
    status: highRiskLegacyModuleFederationHost ? 'active' : 'not-needed',
    rootImportSource: normalizeString(visualImportSource) || 'hiui5',
    rewrites: Object.entries(VERIFIED_VISUAL_REWRITE_SYMBOLS)
      .map(([symbolName, sourcePackage]) => {
        const importSource = normalizeString(visualSplitAliasMap?.[sourcePackage])
        if (!highRiskLegacyModuleFederationHost || !importSource) return null
        return {
          symbolName,
          sourcePackage,
          importKind: 'named',
          importSource,
        }
      })
      .filter(Boolean),
  }
}

function buildHookRewritePlan({
  highRiskLegacyModuleFederationHost = false,
  hookImportSource = 'ahooks',
  visualSplitAliasMap = {},
  hookImportName = 'usePersistFn',
} = {}) {
  return {
    status: highRiskLegacyModuleFederationHost ? 'active' : 'not-needed',
    supportFileImports: VERIFIED_SUPPORT_FILE_REWRITE_IMPORTS.map((entry) => {
      if (entry.symbolName === 'useMemoizedFn') {
        return {
          symbolName: highRiskLegacyModuleFederationHost ? entry.symbolName : hookImportName,
          importKind: entry.importKind,
          importSource:
            normalizeString(hookImportSource) ||
            normalizeString(entry.defaultImportSource) ||
            'ahooks',
        }
      }

      return {
        symbolName: entry.symbolName,
        sourcePackage: entry.sourcePackage,
        importKind: entry.importKind,
        importSource:
          (highRiskLegacyModuleFederationHost &&
            normalizeString(visualSplitAliasMap?.[entry.sourcePackage])) ||
          normalizeString(entry.defaultImportSource),
      }
    }),
  }
}

export function isHighRiskLegacyModuleFederationHost(hostProfile = {}) {
  const riskTags = normalizeStringArray(hostProfile?.riskTags)
  const framework = normalizeString(hostProfile?.framework)
  const hasModuleFederation =
    hostProfile?.hasModuleFederation === true ||
    ['rspack-module-federation', 'webpack-module-federation', 'micro-frontend'].includes(framework) ||
    riskTags.includes('module-federation')
  const hasLegacyRuntime =
    hostProfile?.legacyReactRuntime === true ||
    riskTags.some((item) => item.startsWith('legacy-react-')) ||
    hostProfile?.hiuiFacts?.hasLegacyRuntimePackages === true ||
    hostProfile?.hiuiFacts?.hasMixedRuntimePackages === true

  return (
    normalizeString(hostProfile?.riskLevel) === 'high' &&
    hasModuleFederation &&
    hasLegacyRuntime
  )
}

export function createPendingHostGenerationContract() {
  return {
    status: 'pending-host-profile',
    scope: HOST_GENERATION_CONTRACT_SCOPE,
    affectsExistingPages: false,
    visualImportMode: 'undecided',
    visualImportSource: '',
    visualSplitAliasMap: {},
    visualRewritePlan: {
      status: 'pending-host-profile',
      rootImportSource: '',
      rewrites: [],
    },
    fieldMapProviderMode: 'undecided',
    fieldMapProviderCompatibility: {},
    hookImportMode: 'undecided',
    hookImportName: '',
    hookImportSource: '',
    hookRewritePlan: {
      status: 'pending-host-profile',
      supportFileImports: [],
    },
    highRiskLegacyModuleFederationHost: false,
    evidence: [],
    reasons: [
      'Host profile is not ready yet. The generation contract remains pending until project-level readiness is established.',
    ],
  }
}

export function resolveHostGenerationContract({
  hostProfile = {},
  hostImportPolicy = {},
  fieldMapProviderCompatibility = null,
} = {}) {
  const framework = normalizeString(hostProfile?.framework)
  const riskLevel = normalizeString(hostProfile?.riskLevel)
  const riskTags = normalizeStringArray(hostProfile?.riskTags)
  const highRiskLegacyModuleFederationHost = isHighRiskLegacyModuleFederationHost(hostProfile)
  const visualImportSource =
    normalizeString(hostImportPolicy?.hiui5Components) ||
    normalizeString(HIUI5_ISOLATED_PEER_ALIASES['@hi-ui/hiui']) ||
    'hiui5'
  const fieldMapProviderMode =
    normalizeString(fieldMapProviderCompatibility?.strategy) || 'official-shell-import'
  const hookImportSource = highRiskLegacyModuleFederationHost
    ? normalizeString(HIUI5_ISOLATED_PEER_ALIASES.ahooks) || 'ahooks3'
    : 'ahooks'
  const hookImportName = highRiskLegacyModuleFederationHost
    ? 'useMemoizedFn'
    : 'usePersistFn'
  const visualSplitAliasMap = highRiskLegacyModuleFederationHost
    ? Object.fromEntries(
        Object.entries(HIUI5_ISOLATED_PEER_ALIASES).filter(([depName, aliasName]) =>
          depName.startsWith('@hi-ui/') && normalizeString(aliasName)
        )
      )
    : {}

  return {
    status: framework ? 'ready' : 'pending-host-profile',
    scope: HOST_GENERATION_CONTRACT_SCOPE,
    affectsExistingPages: false,
    visualImportMode: highRiskLegacyModuleFederationHost ? 'split-alias' : 'hiui5-root',
    visualImportSource,
    visualSplitAliasMap,
    visualRewritePlan: buildVisualRewritePlan({
      highRiskLegacyModuleFederationHost,
      visualImportSource,
      visualSplitAliasMap,
    }),
    fieldMapProviderMode,
    fieldMapProviderCompatibility:
      fieldMapProviderCompatibility && typeof fieldMapProviderCompatibility === 'object'
        ? fieldMapProviderCompatibility
        : {},
    hookImportMode: highRiskLegacyModuleFederationHost ? 'isolated-alias' : 'project-default',
    hookImportName,
    hookImportSource,
    hookRewritePlan: buildHookRewritePlan({
      highRiskLegacyModuleFederationHost,
      hookImportName,
      hookImportSource,
      visualSplitAliasMap,
    }),
    highRiskLegacyModuleFederationHost,
    evidence: normalizeStringArray([framework, riskLevel, ...riskTags]),
    reasons: highRiskLegacyModuleFederationHost
      ? [
          'Detected a high-risk legacy Module Federation host. New generated pages should only rewrite the authenticated HiUI5 root symbols declared in visualRewritePlan, and generated support files should follow hookRewritePlan for isolated imports.',
          'Existing legacy project pages remain untouched; the contract applies only to new hiui-design generated pages and generated local support files.',
        ]
      : [
          'Current host does not match the managed high-risk legacy Module Federation profile. Keep the clean-host default contract for new generated pages.',
          'Existing legacy project pages remain untouched; the contract applies only to new hiui-design generated pages and generated local support files.',
        ],
  }
}
