import fs from 'node:fs/promises'
import path from 'node:path'
import { recordScanEvent } from './scan-trace.mjs'

const DEFAULT_IGNORED_SOURCE_PATHS = [
  'src/typical-page-preview',
  'src/components/hiui-design-runtime',
]

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readTextIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return ''
  return fs.readFile(targetPath, 'utf8')
}

async function readJsonIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return null
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

async function readInstalledPackageVersion(targetRoot, packageName) {
  const packageJson = await readJsonIfExists(
    path.join(targetRoot, 'node_modules', ...packageName.split('/'), 'package.json')
  )
  const version = typeof packageJson?.version === 'string' ? packageJson.version.trim() : ''
  return /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version) ? version : ''
}

function isPathIgnored(targetPath, ignoredRoots) {
  return ignoredRoots.some(
    (ignoredRoot) =>
      targetPath === ignoredRoot || targetPath.startsWith(`${ignoredRoot}${path.sep}`)
  )
}

async function collectSourceFiles(rootDir, ignoredRoots = []) {
  if (!(await pathExists(rootDir))) return []

  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name)
    if (isPathIgnored(absPath, ignoredRoots)) {
      continue
    }

    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(absPath, ignoredRoots)))
      continue
    }

    if (entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name)) {
      files.push(absPath)
    }
  }

  return files
}

function hasDeclaredDependency(pkg, depName) {
  return Boolean(
    pkg?.dependencies?.[depName] ||
      pkg?.devDependencies?.[depName] ||
      pkg?.peerDependencies?.[depName]
  )
}

function findDeclaredDependency(pkg, depName) {
  return (
    pkg?.dependencies?.[depName] ||
    pkg?.devDependencies?.[depName] ||
    pkg?.peerDependencies?.[depName] ||
    ''
  )
}

function parseDeclaredMajorVersion(spec) {
  const match = String(spec || '')
    .trim()
    .match(/^(?:npm:[^@]+@)?(?:\^|~|>=|>|<=|<)?\s*(\d+)/)
  return match ? Number(match[1]) : 0
}

function collectHiUiDependencyFacts(pkg) {
  const entries = []

  for (const bucketName of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const [depName, spec] of Object.entries(pkg?.[bucketName] ?? {})) {
      if (!depName.startsWith('@hi-ui/')) continue
      entries.push({
        bucketName,
        depName,
        spec,
        major: parseDeclaredMajorVersion(spec),
      })
    }
  }

  const legacyEntries = entries.filter((entry) => entry.major > 0 && entry.major < 5)
  const modernEntries = entries.filter((entry) => entry.major >= 5)

  return {
    directDependencyCount: entries.length,
    legacyDirectCount: legacyEntries.length,
    modernDirectCount: modernEntries.length,
    hasLegacyRuntimePackages: legacyEntries.length > 0,
    hasModernRuntimePackages: modernEntries.length > 0,
    hasMixedRuntimePackages: legacyEntries.length > 0 && modernEntries.length > 0,
    sampleLegacyPackages: legacyEntries.slice(0, 5).map((entry) => `${entry.depName}@${entry.spec}`),
    sampleModernPackages: modernEntries.slice(0, 5).map((entry) => `${entry.depName}@${entry.spec}`),
  }
}

async function findFirstExistingPath(targetRoot, candidates) {
  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      return absPath
    }
  }

  return ''
}

async function findFirstMatchingPath(targetRoot, candidates, predicate) {
  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    const raw = await readTextIfExists(absPath)
    if (!raw) continue
    if (predicate(raw, absPath)) {
      return {
        absolutePath: absPath,
        relativePath: candidate,
        raw,
      }
    }
  }

  return {
    absolutePath: '',
    relativePath: '',
    raw: '',
  }
}

function getSourceMarkerSummary(targetRoot, markers) {
  return markers.map((marker) => path.relative(targetRoot, marker))
}

function extractRemoteEntryFilenames(source = '') {
  const filenames = []
  const explicitPattern = /filename\s*:\s*(['"`])([^'"`]*remoteEntry\.js)\1/g
  let match = explicitPattern.exec(source)

  while (match) {
    filenames.push(match[2])
    match = explicitPattern.exec(source)
  }

  if (filenames.length === 0 && source.includes('remoteEntry.js')) {
    filenames.push('remoteEntry.js')
  }

  return [...new Set(filenames.map((item) => String(item).trim()).filter(Boolean))]
}

function extractReadmeLocalOrigins(source = '') {
  const localOrigins = []
  const pattern = /^\s*-\s*localOrigin:\s*(https?:\/\/\S+)\s*$/gm
  let match = pattern.exec(source)

  while (match) {
    localOrigins.push(match[1])
    match = pattern.exec(source)
  }

  return [...new Set(localOrigins.map((item) => String(item).trim()).filter(Boolean))]
}

function extractLocalRuntimeUrls(source = '') {
  const matches = source.match(
    /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?(?:\/[^\s'"`\])},]*)?/gi
  )
  return [...new Set((matches || []).map((item) => String(item).trim()).filter(Boolean))]
}

function extractCamoraProxyRules(source = '') {
  const rules = []
  const pattern = /\[\s*(['"`])([^'"`\n]*remoteEntry\.js)\1\s*,\s*(['"`])([^'"`\n]*remoteEntry\.js)\3\s*\]/g
  let match = pattern.exec(source)

  while (match) {
    rules.push({
      matcher: String(match[2] || '').trim(),
      target: String(match[4] || '').trim(),
    })
    match = pattern.exec(source)
  }

  return rules.filter((rule) => rule.matcher && rule.target)
}

function hasPositiveCamoraHint(source = '') {
  if (!/\bCamora\b/i.test(source)) return false
  return !/(?:没有|无|未(?:使用|配置)?|not(?:\s+\w+){0,3}|without)\s+Camora/i.test(source)
}

function buildRemoteDebugContract({
  moduleFederationConfig,
  readmeRelativePath = '',
  readmeSource = '',
}) {
  const remoteEntryFilenames = extractRemoteEntryFilenames(moduleFederationConfig?.raw || '')
  const localOrigins = extractReadmeLocalOrigins(readmeSource)
  const localRuntimeUrls = extractLocalRuntimeUrls(readmeSource)
  const camoraProxyRules = extractCamoraProxyRules(readmeSource)
  const mentionsCamora = /\bCamora\b/i.test(readmeSource)
  const hasCamoraDebugHint = hasPositiveCamoraHint(readmeSource)
  const mentionsProxy = /代理|proxy/i.test(readmeSource)
  const localRuntimeSources = [
    ...new Set([
      ...localOrigins,
      ...localRuntimeUrls,
      ...camoraProxyRules.map((rule) => rule.target).filter(Boolean),
    ]),
  ]
  const hasExplicitRuntimeDebugEvidence =
    hasCamoraDebugHint ||
    localOrigins.length > 0 ||
    localRuntimeUrls.length > 0 ||
    camoraProxyRules.length > 0
  const enabled =
    Boolean(moduleFederationConfig?.absolutePath) &&
    hasExplicitRuntimeDebugEvidence

  const verificationHints = []
  if (enabled) {
    verificationHints.push('Do not treat `/` returning 404 as a page failure for this remote-only host.')
    if (remoteEntryFilenames.length > 0) {
      verificationHints.push(
        `Verify the remote through ${remoteEntryFilenames.join(', ')} instead of relying on the root path.`
      )
    }
    if (camoraProxyRules.length > 0) {
      verificationHints.push(
        `Detected ${camoraProxyRules.length} Camora regex proxy rule(s); runtime verification must confirm the live proxy target, not just the code registration.`
      )
    }
    if (localRuntimeSources.length > 0) {
      verificationHints.push(`Local runtime source candidates: ${localRuntimeSources.join(', ')}`)
    }
    if (mentionsCamora) {
      verificationHints.push(
        'README mentions Camora, so proxy-based verification should be treated as the default local-debug path.'
      )
    }
  }

  const mode = camoraProxyRules.length > 0 ? 'camora-regex-proxy' : enabled ? 'remote-entry-debug' : ''

  return {
    enabled,
    mode,
    readmePath: readmeRelativePath,
    localOrigins,
    localRuntimeUrls,
    localRuntimeSources,
    remoteEntryFilenames,
    camoraProxyRules,
    mentionsCamora,
    hasCamoraDebugHint,
    mentionsProxy,
    hasExplicitRuntimeDebugEvidence,
    runtimeSourceStatus: enabled ? 'not-verified' : 'not-applicable',
    reason: enabled
      ? camoraProxyRules.length > 0
        ? 'Detected Module Federation plus Camora regex proxy rules. Distinguish code registration from live runtime-source verification.'
        : 'Detected Module Federation plus local debug hints. Distinguish code registration from live runtime-source verification.'
      : '',
    verificationHints,
  }
}

function buildRemoteOnlyRuntimeHints({
  moduleFederationConfig,
  readmeRelativePath = '',
  readmeSource = '',
  remoteDebugContract = null,
}) {
  const resolvedRemoteDebugContract =
    remoteDebugContract ||
    buildRemoteDebugContract({
      moduleFederationConfig,
      readmeRelativePath,
      readmeSource,
    })
  const hints = [...(resolvedRemoteDebugContract.verificationHints || [])]
  if (resolvedRemoteDebugContract.localOrigins.length > 0) {
    hints.push(`README localOrigin hints: ${resolvedRemoteDebugContract.localOrigins.join(', ')}`)
  }

  return {
    enabled: resolvedRemoteDebugContract.enabled,
    rootPathMay404: resolvedRemoteDebugContract.enabled,
    readmePath: resolvedRemoteDebugContract.readmePath || readmeRelativePath,
    localOrigins: resolvedRemoteDebugContract.localOrigins,
    remoteEntryFilenames: resolvedRemoteDebugContract.remoteEntryFilenames,
    mentionsCamora: resolvedRemoteDebugContract.mentionsCamora,
    mentionsProxy: resolvedRemoteDebugContract.mentionsProxy,
    reason: resolvedRemoteDebugContract.enabled
      ? 'Module Federation plus README proxy/localOrigin hints indicate a remote-only local debug flow.'
      : '',
    verificationHints: hints,
  }
}

export async function detectHostProfile(targetRoot, options = {}) {
  recordScanEvent('detect-host-profile', {
    targetRoot: path.resolve(targetRoot),
    ignoredRoots: Array.isArray(options?.ignoreRelativePaths) ? options.ignoreRelativePaths : [],
  })

  const packageJsonPath = path.join(targetRoot, 'package.json')
  const pkg = await readJsonIfExists(packageJsonPath)
  const srcRoot = path.join(targetRoot, 'src')
  // Ignore managed preview/runtime assets so hiui-design materialization itself does not flip a greenfield app.
  const ignoredSourcePaths = [...new Set([...(options.ignoreRelativePaths ?? []), ...DEFAULT_IGNORED_SOURCE_PATHS])]
    .map((relativePath) => path.resolve(targetRoot, relativePath))
    .filter((ignoredPath) => ignoredPath.startsWith(srcRoot))
  const sourceFiles = await collectSourceFiles(srcRoot, ignoredSourcePaths)
  const buildConfigCandidates = [
    'build/rspack.base.conf.js',
    'build/rspack.base.conf.ts',
    'build/rspack.dev.conf.js',
    'build/rspack.prod.conf.js',
    'rspack.config.js',
    'rspack.config.ts',
    'webpack.config.js',
    'webpack.config.ts',
    'build/webpack.base.conf.js',
    'build/webpack.base.conf.ts',
  ]

  const viteConfigPath = await findFirstExistingPath(targetRoot, [
    'vite.config.ts',
    'vite.config.tsx',
    'vite.config.mts',
    'vite.config.js',
    'vite.config.jsx',
    'vite.config.mjs',
    'vite.config.cjs',
    'vite.config.cts',
  ])
  const nextConfigPath = await findFirstExistingPath(targetRoot, [
    'next.config.ts',
    'next.config.js',
    'next.config.mjs',
    'next.config.cjs',
  ])
  const nextAppLayoutPath = await findFirstExistingPath(targetRoot, [
    'app/layout.tsx',
    'app/layout.ts',
    'src/app/layout.tsx',
    'src/app/layout.ts',
  ])
  const nextPagesAppPath = await findFirstExistingPath(targetRoot, [
    'pages/_app.tsx',
    'pages/_app.ts',
    'src/pages/_app.tsx',
    'src/pages/_app.ts',
  ])
  const umiConfigPath = await findFirstExistingPath(targetRoot, [
    '.umirc.ts',
    '.umirc.js',
    'config/config.ts',
    'config/config.js',
  ])
  const umiAppPath = await findFirstExistingPath(targetRoot, ['src/app.tsx', 'src/app.ts'])
  const umiLayoutPath = await findFirstExistingPath(targetRoot, [
    'src/layouts/index.tsx',
    'src/layouts/index.ts',
  ])
  const rspackConfigPath = await findFirstExistingPath(targetRoot, [
    'build/rspack.base.conf.js',
    'build/rspack.base.conf.ts',
    'build/rspack.dev.conf.js',
    'build/rspack.prod.conf.js',
    'rspack.config.js',
    'rspack.config.ts',
  ])
  const webpackConfigPath = await findFirstExistingPath(targetRoot, [
    'webpack.config.js',
    'webpack.config.ts',
    'build/webpack.base.conf.js',
    'build/webpack.base.conf.ts',
  ])
  const moduleFederationConfig = await findFirstMatchingPath(
    targetRoot,
    buildConfigCandidates,
    (raw) => raw.includes('ModuleFederationPlugin') && raw.includes('exposes')
  )
  const readmePath = await findFirstExistingPath(targetRoot, ['README.md', 'Readme.md', 'readme.md'])
  const readmeRelativePath = readmePath ? path.relative(targetRoot, readmePath) : ''
  const readmeSource = readmePath ? await readTextIfExists(readmePath) : ''
  const reactDomClientAliasConfig = await findFirstMatchingPath(
    targetRoot,
    [...buildConfigCandidates, ...[
      'vite.config.ts',
      'vite.config.tsx',
      'vite.config.mts',
      'vite.config.js',
      'vite.config.jsx',
      'vite.config.mjs',
      'vite.config.cjs',
      'vite.config.cts',
    ]],
    (raw) => raw.includes('react-dom/client')
  )
  const reactJsxRuntimeAliasConfig = await findFirstMatchingPath(
    targetRoot,
    [...buildConfigCandidates, ...[
      'vite.config.ts',
      'vite.config.tsx',
      'vite.config.mts',
      'vite.config.js',
      'vite.config.jsx',
      'vite.config.mjs',
      'vite.config.cjs',
      'vite.config.cts',
    ]],
    (raw) => raw.includes('react/jsx-runtime')
  )
  const reactDomClientShimPath = await findFirstExistingPath(targetRoot, [
    'src/shims/react-dom-client.ts',
    'src/shims/react-dom-client.tsx',
    'src/shims/react-dom-client.js',
    'src/shims/react-dom-client.jsx',
  ])
  const reactJsxRuntimeShimPath = await findFirstExistingPath(targetRoot, [
    'src/shims/react-jsx-runtime.ts',
    'src/shims/react-jsx-runtime.tsx',
    'src/shims/react-jsx-runtime.js',
    'src/shims/react-jsx-runtime.jsx',
  ])

  const existingStructureCandidates = [
    'src/business-shell',
    'src/business-layout',
    'src/components/layout',
    'src/layouts',
    'src/features',
    'src/pages',
    'src/router',
    'src/routes.tsx',
    'src/routes.ts',
    'src/routes.jsx',
    'src/containers',
  ]
  const existingStructureMarkers = []
  for (const candidate of existingStructureCandidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      existingStructureMarkers.push(absPath)
    }
  }

  const hasVite = Boolean(viteConfigPath) || hasDeclaredDependency(pkg, 'vite')
  const hasReactRouter = hasDeclaredDependency(pkg, 'react-router-dom')
  const hasRspack =
    Boolean(rspackConfigPath) ||
    hasDeclaredDependency(pkg, '@rspack/core') ||
    hasDeclaredDependency(pkg, '@rspack/cli') ||
    hasDeclaredDependency(pkg, 'rspack')
  const hasWebpack = Boolean(webpackConfigPath) || hasDeclaredDependency(pkg, 'webpack')
  const hasUmi =
    Boolean(umiConfigPath) ||
    hasDeclaredDependency(pkg, 'umi') ||
    hasDeclaredDependency(pkg, 'max') ||
    hasDeclaredDependency(pkg, '@umijs/max')
  const hasNext = Boolean(nextConfigPath) || hasDeclaredDependency(pkg, 'next')
  const hasMicroFrontend =
    hasDeclaredDependency(pkg, 'qiankun') ||
    hasDeclaredDependency(pkg, '@umijs/plugin-qiankun') ||
    hasDeclaredDependency(pkg, 'micro-app') ||
    hasDeclaredDependency(pkg, 'single-spa')
  const hasModuleFederation = Boolean(moduleFederationConfig.absolutePath)
  const reactSpec = findDeclaredDependency(pkg, 'react')
  const reactDomSpec = findDeclaredDependency(pkg, 'react-dom')
  const installedReactVersion = await readInstalledPackageVersion(targetRoot, 'react')
  const installedReactDomVersion = await readInstalledPackageVersion(targetRoot, 'react-dom')
  const reactMajor = parseDeclaredMajorVersion(
    installedReactVersion || installedReactDomVersion || reactSpec || reactDomSpec
  )
  const legacyReactRuntime = reactMajor > 0 && reactMajor < 18
  const hiuiFacts = collectHiUiDependencyFacts(pkg)

  const sourceCount = sourceFiles.length
  const looksGreenfield =
    sourceCount <= 20 &&
    existingStructureMarkers.length <= 1 &&
    !hasMicroFrontend &&
    !hasUmi &&
    !hasNext

  let framework = 'unknown'
  let runtime = 'unknown'
  let routing = 'unknown'
  let adapterDoc = ''

  if (hasModuleFederation && hasRspack) {
    framework = 'rspack-module-federation'
    runtime = 'rspack-react'
    routing = hasReactRouter ? 'react-router+module-federation' : 'module-federation'
    adapterDoc = 'docs/onboarding/host-adapters/micro-frontend.md'
  } else if (hasModuleFederation && hasWebpack) {
    framework = 'webpack-module-federation'
    runtime = 'webpack-react'
    routing = hasReactRouter ? 'react-router+module-federation' : 'module-federation'
    adapterDoc = 'docs/onboarding/host-adapters/micro-frontend.md'
  } else if (hasMicroFrontend) {
    framework = 'micro-frontend'
    runtime = hasVite ? 'vite-react' : 'custom-react'
    routing = hasReactRouter ? 'react-router' : hasUmi ? 'umi-router' : 'unknown'
    adapterDoc = 'docs/onboarding/host-adapters/micro-frontend.md'
  } else if (hasRspack) {
    framework = 'rspack-react'
    runtime = 'rspack-react'
    routing = hasReactRouter ? 'react-router' : 'custom-router'
  } else if (hasWebpack) {
    framework = 'webpack-react'
    runtime = 'webpack-react'
    routing = hasReactRouter ? 'react-router' : 'custom-router'
  } else if (hasNext) {
    framework = nextAppLayoutPath ? 'next-app-router' : 'next-pages-router'
    runtime = 'next'
    routing = 'next-file-routing'
    adapterDoc = nextAppLayoutPath
      ? 'docs/onboarding/host-adapters/next-app-router.md'
      : 'docs/onboarding/host-adapters/next-pages-router.md'
  } else if (hasUmi) {
    framework = hasDeclaredDependency(pkg, '@umijs/max') || hasDeclaredDependency(pkg, 'max') ? 'umi-max' : 'umi'
    runtime = 'umi'
    routing = 'umi-router'
    adapterDoc = 'docs/onboarding/host-adapters/umi.md'
  } else if (hasVite && hasReactRouter && looksGreenfield) {
    framework = 'react-vite-router'
    runtime = 'vite-react'
    routing = 'react-router'
  } else if (hasVite && hasReactRouter) {
    framework = 'react-vite-custom-layout'
    runtime = 'vite-react'
    routing = 'react-router'
  } else if (hasVite) {
    framework = looksGreenfield ? 'react-vite' : 'react-vite-custom-layout'
    runtime = 'vite-react'
  } else if (hasReactRouter) {
    framework = 'react-router-custom'
    runtime = 'custom-react'
    routing = 'react-router'
  }

  const projectType = looksGreenfield ? 'greenfield' : 'existing-system'
  const riskTags = []

  if (hasRspack) riskTags.push('rspack')
  if (hasWebpack && !hasRspack) riskTags.push('webpack')
  if (hasModuleFederation) riskTags.push('module-federation')
  if (legacyReactRuntime) riskTags.push(`legacy-react-${reactMajor}`)
  if (hiuiFacts.hasLegacyRuntimePackages) riskTags.push('legacy-hiui-runtime')
  if (hiuiFacts.hasMixedRuntimePackages) riskTags.push('mixed-hiui-runtime')

  let riskLevel = 'low'
  if (
    hasModuleFederation ||
    (legacyReactRuntime && hiuiFacts.hasMixedRuntimePackages) ||
    (legacyReactRuntime && (hasRspack || hasWebpack))
  ) {
    riskLevel = 'high'
  } else if (
    hasRspack ||
    hasWebpack ||
    legacyReactRuntime ||
    hiuiFacts.hasLegacyRuntimePackages
  ) {
    riskLevel = 'medium'
  }

  let strategy = 'compat'
  let reason =
    'Target project already looks like an existing system. Preserve the current host contract and choose the install mode from explicit input or recorded appliedMode first, then fall back to the compatibility-bridge probe.'

  if (riskLevel === 'high') {
    strategy = 'compat'
    reason =
      `Detected a high-risk legacy host (${riskTags.join(', ')}). ` +
      'Keep the existing host contract, require explicit compatibility branches for runtime/build integration, and treat doctor pass as runtime-baseline confirmation rather than full host validation.'
  } else if (projectType === 'greenfield' && ['react-vite-router', 'react-vite', 'unknown'].includes(framework)) {
    strategy = 'bring-shell'
    reason =
      'Target project looks like a greenfield React/Vite app. The managed host baseline and official source assets are usually easier to wire here, while official preview still stays in the packaged preview runtime; the install mode should still be chosen from explicit input or recorded appliedMode first, then fall back to the compatibility-bridge probe.'
  } else if (
    ['micro-frontend', 'rspack-module-federation', 'webpack-module-federation'].includes(framework)
  ) {
    strategy = 'compat'
    reason =
      'Micro-frontend style hosts should keep their own container contract. Verify portal slots, height chain, preview isolation, package singletons, and explicit expose wiring before choosing how much host-integration to bring in.'
  } else if (
    ['umi-max', 'umi', 'next-app-router', 'next-pages-router', 'rspack-react', 'webpack-react'].includes(framework)
  ) {
    strategy = 'compat'
    reason =
      framework === 'rspack-react' || framework === 'webpack-react'
        ? 'The detected build runtime is not on the native host-integration carrier path. Keep the existing build/runtime contract intact and verify compatibility bridges before deciding whether host-integration assets should be added.'
        : 'The detected framework has its own routing/layout conventions. Keep those host conventions intact and verify preview isolation before deciding whether host-integration assets should be added.'
  }

  const adapterEntryHints = []
  if (framework === 'next-app-router') {
    if (nextAppLayoutPath) adapterEntryHints.push(path.relative(targetRoot, nextAppLayoutPath))
  } else if (framework === 'next-pages-router') {
    if (nextPagesAppPath) adapterEntryHints.push(path.relative(targetRoot, nextPagesAppPath))
  } else if (framework === 'umi-max' || framework === 'umi') {
    if (umiAppPath) adapterEntryHints.push(path.relative(targetRoot, umiAppPath))
    if (umiLayoutPath) adapterEntryHints.push(path.relative(targetRoot, umiLayoutPath))
    if (umiConfigPath) adapterEntryHints.push(path.relative(targetRoot, umiConfigPath))
  } else if (
    ['rspack-module-federation', 'webpack-module-federation', 'rspack-react', 'webpack-react'].includes(framework)
  ) {
    if (moduleFederationConfig.absolutePath) {
      adapterEntryHints.push(moduleFederationConfig.relativePath)
    }
    if (rspackConfigPath) adapterEntryHints.push(path.relative(targetRoot, rspackConfigPath))
    if (webpackConfigPath) adapterEntryHints.push(path.relative(targetRoot, webpackConfigPath))
    if (reactDomClientAliasConfig.absolutePath) {
      adapterEntryHints.push(reactDomClientAliasConfig.relativePath)
    }
    if (reactDomClientShimPath) {
      adapterEntryHints.push(path.relative(targetRoot, reactDomClientShimPath))
    }
  }
  const uniqueAdapterEntryHints = [...new Set(adapterEntryHints)]
  const remoteDebugContract = buildRemoteDebugContract({
    moduleFederationConfig,
    readmeRelativePath,
    readmeSource,
  })
  const remoteOnlyRuntime = buildRemoteOnlyRuntimeHints({
    moduleFederationConfig,
    readmeRelativePath,
    readmeSource,
    remoteDebugContract,
  })

  return {
    packageJsonPath,
    pkg,
    projectType,
    framework,
    runtime,
    routing,
    sourceCount,
    existingStructureMarkers,
    existingStructureSummary: getSourceMarkerSummary(targetRoot, existingStructureMarkers),
    viteConfigPath,
    umiConfigPath,
    umiAppPath,
    umiLayoutPath,
    nextConfigPath,
    nextAppLayoutPath,
    nextPagesAppPath,
    rspackConfigPath,
    webpackConfigPath,
    hasMicroFrontend,
    hasModuleFederation,
    moduleFederationConfigPath: moduleFederationConfig.absolutePath,
    reactSpec,
    reactDomSpec,
    installedReactVersion,
    installedReactDomVersion,
    reactMajor,
    legacyReactRuntime,
    reactDomClientAliasConfigPath: reactDomClientAliasConfig.absolutePath,
    reactDomClientShimPath,
    hasReactDomClientCompatAlias: Boolean(reactDomClientAliasConfig.absolutePath),
    reactJsxRuntimeAliasConfigPath: reactJsxRuntimeAliasConfig.absolutePath,
    reactJsxRuntimeShimPath,
    hasReactJsxRuntimeCompatAlias: Boolean(reactJsxRuntimeAliasConfig.absolutePath),
    hiuiFacts,
    riskLevel,
    riskTags,
    strategy,
    reason,
    adapterDoc,
    adapterEntryHints: uniqueAdapterEntryHints,
    readmePath,
    remoteOnlyRuntime,
    remoteDebugContract,
  }
}
