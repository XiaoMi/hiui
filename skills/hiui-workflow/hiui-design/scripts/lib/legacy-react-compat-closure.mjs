import fs from 'node:fs/promises'
import path from 'node:path'

export const VITE_CONFIG_CANDIDATES = [
  'vite.config.ts',
  'vite.config.tsx',
  'vite.config.mts',
  'vite.config.js',
  'vite.config.jsx',
  'vite.config.mjs',
  'vite.config.cjs',
  'vite.config.cts',
]

export const RSPACK_CONFIG_CANDIDATES = [
  'build/rspack.base.conf.js',
  'build/rspack.base.conf.ts',
  'build/rspack.dev.conf.js',
  'build/rspack.prod.conf.js',
  'rspack.config.js',
  'rspack.config.ts',
]

export const WEBPACK_CONFIG_CANDIDATES = [
  'build/webpack.base.conf.js',
  'build/webpack.base.conf.ts',
  'webpack.config.js',
  'webpack.config.ts',
]

export const REACT_DOM_CLIENT_SHIM = {
  label: 'react-dom/client',
  officialRelativePath: 'examples/host-integration/src/shims/react-dom-client.js',
  canonicalRelativePath: 'src/shims/react-dom-client.js',
  candidateRelativePaths: [
    'src/shims/react-dom-client.ts',
    'src/shims/react-dom-client.tsx',
    'src/shims/react-dom-client.js',
    'src/shims/react-dom-client.jsx',
  ],
}

export const REACT_JSX_RUNTIME_SHIM = {
  label: 'react/jsx-runtime',
  officialRelativePath: 'examples/host-integration/src/shims/react-jsx-runtime.js',
  canonicalRelativePath: 'src/shims/react-jsx-runtime.js',
  candidateRelativePaths: [
    'src/shims/react-jsx-runtime.ts',
    'src/shims/react-jsx-runtime.tsx',
    'src/shims/react-jsx-runtime.js',
    'src/shims/react-jsx-runtime.jsx',
  ],
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function toRelativePath(targetRoot, absolutePath) {
  return absolutePath ? path.relative(targetRoot, absolutePath) : ''
}

export function resolveLegacyReactCompatRequirements(hostProfile = {}) {
  const reactMajor = Number(hostProfile?.reactMajor || 0)
  const highRiskLegacyHost = hostProfile?.riskLevel === 'high' && reactMajor > 0 && reactMajor < 18

  return {
    reactMajor,
    highRiskLegacyHost,
    needsReactDomClientCompat: highRiskLegacyHost,
    needsReactJsxRuntimeCompat: highRiskLegacyHost && reactMajor < 17,
  }
}

export function isEligibleLegacyReactHost(hostProfile = {}) {
  return resolveLegacyReactCompatRequirements(hostProfile).highRiskLegacyHost
}

function detectConfigKind(relativePath = '') {
  if (relativePath.startsWith('vite.config.')) return 'vite'
  if (relativePath.startsWith('build/rspack.') || relativePath.startsWith('rspack.config.')) return 'rspack'
  return 'webpack'
}

function detectLegacyAutofixConfigRole(relativePath = '') {
  const normalizedPath = String(relativePath || '').replace(/\\/g, '/')

  if (/^build\/rspack\.base\.conf\./.test(normalizedPath)) return 'base'
  if (/^build\/rspack\.dev\.conf\./.test(normalizedPath)) return 'dev'
  if (/^build\/rspack\.prod\.conf\./.test(normalizedPath)) return 'prod'
  if (/^build\/webpack\.base\.conf\./.test(normalizedPath)) return 'base'
  if (
    normalizedPath.startsWith('vite.config.') ||
    normalizedPath.startsWith('rspack.config.') ||
    normalizedPath.startsWith('webpack.config.')
  ) {
    return 'root'
  }

  return 'other'
}

export async function detectSupportedLegacyReactCompatConfigs(targetRoot) {
  const matches = []

  for (const relativePath of [
    ...VITE_CONFIG_CANDIDATES,
    ...RSPACK_CONFIG_CANDIDATES,
    ...WEBPACK_CONFIG_CANDIDATES,
  ]) {
    if (!(await pathExists(path.join(targetRoot, relativePath)))) continue
    matches.push({
      relativePath,
      absolutePath: path.join(targetRoot, relativePath),
      kind: detectConfigKind(relativePath),
    })
  }

  return matches
}

export function resolveWritableLegacyCompatConfigTarget(
  supportedConfigs = [],
  { allowedKinds = null } = {}
) {
  const filteredConfigs = Array.isArray(supportedConfigs)
    ? supportedConfigs.filter(
        (item) =>
          item &&
          typeof item === 'object' &&
          (!Array.isArray(allowedKinds) || allowedKinds.includes(item.kind))
      )
    : []

  if (filteredConfigs.length === 0) {
    return {
      status: 'none',
      config: null,
      selection: 'none',
      reason: 'No supported config file matched the current autofix scope.',
      candidatePaths: [],
    }
  }

  if (filteredConfigs.length === 1) {
    return {
      status: 'selected',
      config: filteredConfigs[0],
      selection: 'single-config',
      reason: `Selected the only supported config file: ${filteredConfigs[0].relativePath}.`,
      candidatePaths: filteredConfigs.map((item) => item.relativePath),
    }
  }

  const candidatePaths = filteredConfigs.map((item) => item.relativePath)
  const configKinds = [...new Set(filteredConfigs.map((item) => item.kind))]

  if (configKinds.length === 1 && configKinds[0] === 'rspack') {
    const annotatedConfigs = filteredConfigs.map((item) => ({
      ...item,
      role: detectLegacyAutofixConfigRole(item.relativePath),
    }))
    const baseConfigs = annotatedConfigs.filter((item) => item.role === 'base')
    const derivedConfigs = annotatedConfigs.filter(
      (item) => item.role === 'dev' || item.role === 'prod'
    )
    const unsupportedConfigs = annotatedConfigs.filter(
      (item) => !['base', 'dev', 'prod'].includes(item.role)
    )

    if (
      baseConfigs.length === 1 &&
      derivedConfigs.length === annotatedConfigs.length - 1 &&
      unsupportedConfigs.length === 0 &&
      new Set(derivedConfigs.map((item) => item.role)).size === derivedConfigs.length
    ) {
      return {
        status: 'selected',
        config: baseConfigs[0],
        selection: 'shared-rspack-base',
        reason:
          `Selected ${baseConfigs[0].relativePath} as the shared Rspack base config for ` +
          `${candidatePaths.join(', ')}.`,
        candidatePaths,
      }
    }
  }

  return {
    status: 'ambiguous',
    config: null,
    selection: 'ambiguous',
    reason:
      `Found multiple supported config files (${candidatePaths.join(', ')}), but no single writable ` +
      'shared base config could be selected safely.',
    candidatePaths,
  }
}

export async function inspectLegacyReactCompatibilityClosure({
  targetRoot,
  hostProfile = {},
  supportedConfigs = null,
} = {}) {
  const compatRequirements = resolveLegacyReactCompatRequirements(hostProfile)
  const framework = String(hostProfile?.framework || '').trim()

  if (!compatRequirements.highRiskLegacyHost) {
    return {
      status: 'not-applicable',
      inScope: false,
      reactMajor: compatRequirements.reactMajor,
      missingBranches: [],
      autofixAvailable: false,
      nextAction: 'none',
      supportedConfigPaths: [],
      supportedConfigKinds: [],
      reason:
        'Legacy React runtime compatibility closure is not required for the current host profile.',
      recommendedSteps: [],
    }
  }

  const missingBranches = []
  const recommendedSteps = []

  if (
    compatRequirements.needsReactDomClientCompat &&
    (!hostProfile?.hasReactDomClientCompatAlias || !hostProfile?.reactDomClientShimPath)
  ) {
    missingBranches.push('react-dom/client')
    recommendedSteps.push(
      '补一条 `react-dom/client` 兼容分支：构建配置里加解析别名，并提供 `src/shims/react-dom-client.*` 垫片文件，让典型页壳层在 React 16/17 宿主里能落到旧入口实现。'
    )
  }

  if (
    compatRequirements.needsReactJsxRuntimeCompat &&
    (!hostProfile?.hasReactJsxRuntimeCompatAlias || !hostProfile?.reactJsxRuntimeShimPath)
  ) {
    missingBranches.push('react/jsx-runtime')
    recommendedSteps.push(
      '补一条 `react/jsx-runtime` 兼容分支：构建配置里加解析别名，并提供 `src/shims/react-jsx-runtime.*` 垫片文件，让 React 16 宿主也能消费新 JSX 运行时入口。'
    )
  }

  if (
    missingBranches.length > 0 &&
    ['webpack-module-federation', 'rspack-module-federation', 'webpack-react', 'rspack-react'].includes(
      framework
    )
  ) {
    recommendedSteps.push(
      '保留显式 `HiUI5 replacement bridge` 替换桥，优先覆盖 `src/components/hiui-design-runtime` 这层本地受管运行时，并兼容其仍会触达的 legacy 运行时链路，让实际消费统一落到兼容的 HiUI5 实现。'
    )
  }

  const resolvedSupportedConfigs =
    supportedConfigs || (await detectSupportedLegacyReactCompatConfigs(targetRoot))
  const supportedConfigPaths = resolvedSupportedConfigs.map((item) => item.relativePath)
  const supportedConfigKinds = [...new Set(resolvedSupportedConfigs.map((item) => item.kind))]
  const writableConfigTarget = resolveWritableLegacyCompatConfigTarget(resolvedSupportedConfigs)
  const autofixAvailable = missingBranches.length > 0 && writableConfigTarget.status === 'selected'

  if (missingBranches.length === 0) {
    return {
      status: 'ready',
      inScope: true,
      reactMajor: compatRequirements.reactMajor,
      missingBranches: [],
      autofixAvailable: false,
      nextAction: 'none',
      supportedConfigPaths,
      supportedConfigKinds,
      reason:
        `Legacy React ${compatRequirements.reactMajor} runtime compatibility closure is already in place.`,
      recommendedSteps: [],
      aliasPaths: {
        reactDomClient: toRelativePath(targetRoot, hostProfile?.reactDomClientAliasConfigPath),
        reactJsxRuntime: toRelativePath(targetRoot, hostProfile?.reactJsxRuntimeAliasConfigPath),
      },
      shimPaths: {
        reactDomClient: toRelativePath(targetRoot, hostProfile?.reactDomClientShimPath),
        reactJsxRuntime: toRelativePath(targetRoot, hostProfile?.reactJsxRuntimeShimPath),
      },
    }
  }

  const reason = autofixAvailable
    ? `Legacy React ${compatRequirements.reactMajor} runtime compatibility closure is still incomplete: missing ${missingBranches.join(', ')}. Run typical-page:legacy-react-compat, or let setup-for-designers do it automatically, before hiui-design marks integration complete.`
    : `Legacy React ${compatRequirements.reactMajor} runtime compatibility closure is still incomplete: missing ${missingBranches.join(', ')}. Complete the explicit compatibility branches manually before hiui-design marks integration complete.`

  return {
    status: 'needs-closure',
    inScope: true,
    reactMajor: compatRequirements.reactMajor,
    missingBranches,
    autofixAvailable,
    nextAction: autofixAvailable ? 'run-legacy-react-compat' : 'complete-legacy-react-runtime-closure',
    supportedConfigPaths,
    supportedConfigKinds,
    reason,
    recommendedSteps,
    aliasPaths: {
      reactDomClient: toRelativePath(targetRoot, hostProfile?.reactDomClientAliasConfigPath),
      reactJsxRuntime: toRelativePath(targetRoot, hostProfile?.reactJsxRuntimeAliasConfigPath),
    },
    shimPaths: {
      reactDomClient: toRelativePath(targetRoot, hostProfile?.reactDomClientShimPath),
      reactJsxRuntime: toRelativePath(targetRoot, hostProfile?.reactJsxRuntimeShimPath),
    },
  }
}
