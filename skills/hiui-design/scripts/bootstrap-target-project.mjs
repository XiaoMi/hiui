#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { syncArchetypeAssets } from './lib/archetypes/sync-archetype-assets.mjs'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { writeHostAdapterSnippet } from './lib/host-adapter-advice.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import {
  loadLegacyHostFamilyFact,
  loadLegacyDeliveryPolicyFact,
  loadProjectCarrierRealizationFact,
  loadProjectTypicalPageSupportFact,
} from './lib/project-facts.mjs'
import { writeProjectIntegrationState } from './lib/project-integration-state.mjs'
import { RULES_ONLY_REFERENCE_DEST, RULES_ONLY_REFERENCE_PAGES_GLOB } from './lib/reference-assets.mjs'
import { getReusableScripts } from './lib/reusable-script-entries.mjs'
import {
  buildLegacyRuntimeGuardIssues,
  collectLegacyHiUiEsImports,
  inspectInstalledRootRuntime,
  parseLeadingMajorVersion,
  summarizeLegacyImportHits,
} from './lib/legacy-runtime-guard.mjs'

class BootstrapValidationError extends Error {}

function printUsage() {
  console.log(`Usage:
  node scripts/bootstrap-target-project.mjs --target <project-root> [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--line <line-id>] [--with-host-assets] [--dest <relative-dir>] [--route-file <relative-file>] [--shells-spec <version>] [--install] [--install-timeout-ms <ms>] [--force] [--init-i18n] [--skip-i18n-init] [--skip-project-images-init]

Options:
  --target      Target project root. Required.
  --mode        Install mode. Default: auto
  --line        Optional business-line overlay id. Example: retail
  --with-host-assets  Alias of --mode host-integration
  --dest        Relative output directory inside target project for host-integration mode. Default: src/typical-page-reuse
  --route-file  Target route config file to patch. Optional. If omitted, common locations are probed.
  --shells-spec Dependency version/range for @hiui-design/typical-page-shells. Default: ^<local-version>
  --install     Run the target project's package manager install command after patching package.json
  --install-timeout-ms  Timeout for dependency install command. Default: 60000
  --force       Overwrite synced asset files in host-integration mode.
  --init-i18n   Explicitly provision the optional src/translation baseline.
  --skip-i18n-init  Skip src/translation baseline provisioning. Kept for compatibility.
  --skip-project-images-init  Skip automatic src/typical-page-reuse/assets project image catalog scaffold provisioning.
`)
}

function parseArgs(argv) {
  const options = {
    dest: 'src/typical-page-reuse',
    force: false,
    install: false,
    installTimeoutMs: 60000,
    line: '',
    mode: 'auto',
    routeFile: '',
    shellsSpec: '',
    i18nInitExplicitlySkipped: false,
    skipI18nInit: true,
    skipProjectImagesInit: false,
    target: '',
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--force') {
      options.force = true
      continue
    }

    if (arg === '--install') {
      options.install = true
      continue
    }

    if (arg === '--init-i18n') {
      options.skipI18nInit = false
      options.i18nInitExplicitlySkipped = false
      continue
    }

    if (arg === '--skip-i18n-init') {
      options.skipI18nInit = true
      options.i18nInitExplicitlySkipped = true
      continue
    }

    if (arg === '--skip-project-images-init') {
      options.skipProjectImagesInit = true
      continue
    }

    if (arg === '--with-host-assets') {
      options.mode = 'host-integration'
      continue
    }

    if (arg === '--with-reference-assets') {
      options.mode = 'rules-only'
      continue
    }

    if (
      arg === '--target' ||
      arg === '--mode' ||
      arg === '--line' ||
      arg === '--dest' ||
      arg === '--route-file' ||
      arg === '--shells-spec' ||
      arg === '--install-timeout-ms'
    ) {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      const key =
        arg === '--mode'
          ? 'mode'
          : arg === '--line'
            ? 'line'
          : arg === '--route-file'
            ? 'routeFile'
            : arg === '--shells-spec'
              ? 'shellsSpec'
              : arg === '--install-timeout-ms'
                ? 'installTimeoutMs'
                : arg.slice(2)
      options[key] = arg === '--install-timeout-ms' ? Number(value) : value
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.target) {
    throw new Error('Missing required --target <project-root>')
  }

  if (!['auto', 'rules-only', 'host-integration', 'legacy-host-compatible'].includes(options.mode)) {
    throw new Error('Expected --mode to be auto, rules-only, host-integration, or legacy-host-compatible')
  }

  if (!Number.isFinite(options.installTimeoutMs) || options.installTimeoutMs <= 0) {
    throw new Error('Expected --install-timeout-ms to be a positive number')
  }

  return options
}

function shouldSkipI18nInitForMode(options, mode) {
  if (options.i18nInitExplicitlySkipped) {
    return true
  }

  if (mode === 'host-integration') {
    return false
  }

  return options.skipI18nInit
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

async function readTextIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return ''
  return fs.readFile(targetPath, 'utf8')
}

function sortObjectKeys(input) {
  return Object.fromEntries(Object.entries(input).sort(([a], [b]) => a.localeCompare(b)))
}

function upsertManagedDependency({ dependencies, devDependencies, peerDeps, depName, depVersion }) {
  if (Object.prototype.hasOwnProperty.call(dependencies, depName)) {
    const previous = dependencies[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }
    dependencies[depName] = depVersion
    return { action: 'updated', previous }
  }

  if (Object.prototype.hasOwnProperty.call(devDependencies, depName)) {
    const previous = devDependencies[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }
    devDependencies[depName] = depVersion
    return { action: 'updated', previous }
  }

  if (Object.prototype.hasOwnProperty.call(peerDeps, depName)) {
    const previous = peerDeps[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }
    peerDeps[depName] = depVersion
    return { action: 'updated', previous }
  }

  dependencies[depName] = depVersion
  return { action: 'added', previous: '' }
}

async function loadLocalShellPackage(skillRoot) {
  const packageJsonPath = path.join(skillRoot, 'vendor', 'typical-page-shells-package.json')
  const raw = await fs.readFile(packageJsonPath, 'utf8')
  return JSON.parse(raw)
}

async function resolveEmbeddedShellsSpec(skillRoot, version) {
  const filename = `hiui-design-typical-page-shells-${version}.tgz`
  const embeddedTarballPath = path.join(skillRoot, 'vendor', filename)

  if (!(await pathExists(embeddedTarballPath))) {
    return ''
  }

  return `file:.local-context/hiui-design/vendor/${filename}`
}

async function loadRuntimeDeliveryPolicy(skillRoot) {
  return readJsonFile(path.join(skillRoot, 'rules', 'runtime-delivery-policy.json'))
}

function resolvePublicRuntimeRegistry(runtimeDeliveryPolicy, shellPackage) {
  const configuredRegistry = String(
    shellPackage?.runtimeDelivery?.publicRegistry ||
      runtimeDeliveryPolicy?.runtimePackage?.publicRegistry ||
      'https://registry.npmjs.org'
  ).trim()

  return configuredRegistry || 'https://registry.npmjs.org'
}

function parseNpmViewVersion(stdout) {
  const text = String(stdout || '').trim()
  if (!text) {
    throw new Error('npm view returned empty stdout')
  }

  try {
    const parsed = JSON.parse(text)
    if (typeof parsed === 'string') return parsed
    if (Array.isArray(parsed) && typeof parsed[0] === 'string') return parsed[0]
    if (parsed && typeof parsed === 'object' && typeof parsed.version === 'string') return parsed.version
  } catch {
    // Fall back to plain text parsing.
  }

  return text.replace(/^"+|"+$/g, '')
}

function runNpmCommand(args, cwd, registry = '') {
  const result = spawnSync('npm', args, {
    cwd,
    encoding: 'utf8',
    env: registry
      ? {
          ...process.env,
          npm_config_registry: registry,
        }
      : process.env,
    maxBuffer: 32 * 1024 * 1024,
  })

  if (result.status !== 0) {
    const failureText = [result.stderr, result.stdout].filter(Boolean).join('\n').trim()
    throw new Error(failureText || `npm ${args.join(' ')} failed`)
  }

  return result
}

async function resolveManagedShellsSpec({
  explicitShellsSpec,
  runtimeDeliveryPolicy,
  shellPackage,
  skillRoot,
}) {
  if (explicitShellsSpec) {
    return {
      shellsSpec: explicitShellsSpec,
      source: 'user-override',
    }
  }

  const embeddedShellsSpec = await resolveEmbeddedShellsSpec(skillRoot, shellPackage.version)
  if (embeddedShellsSpec) {
    return {
      shellsSpec: embeddedShellsSpec,
      source: runtimeDeliveryPolicy.deliveryChannels['project-view'].runtimeResolution,
    }
  }

  const openSourceDelivery = runtimeDeliveryPolicy.deliveryChannels['open-source-package']
  if (openSourceDelivery?.runtimeResolution === 'vendored-tarball') {
    const expectedTarballPath = path.join(
      skillRoot,
      runtimeDeliveryPolicy.runtimePackage.vendoredTarballDirectory,
      `hiui-design-typical-page-shells-${shellPackage.version}.tgz`
    )

    throw new BootstrapValidationError(
      `Missing vendored runtime tarball for ${shellPackage.name}@${shellPackage.version}: expected ${path.relative(skillRoot, expectedTarballPath)}. This install source must ship the vendored tarball before bootstrap can continue.`
    )
  }

  const publicPackageJsonPath = path.join(skillRoot, runtimeDeliveryPolicy.runtimePackage.publicPackageRoot, 'package.json')
  if (await pathExists(publicPackageJsonPath)) {
    const publicPackage = await readJsonFile(publicPackageJsonPath)
    const publicRegistry = resolvePublicRuntimeRegistry(runtimeDeliveryPolicy, shellPackage)
    if (publicPackage.name !== shellPackage.name) {
      throw new BootstrapValidationError(
        `Public runtime package name mismatch: expected ${shellPackage.name}, received ${publicPackage.name}`
      )
    }
    if (publicPackage.version !== shellPackage.version) {
      throw new BootstrapValidationError(
        `Vendored shell snapshot version ${shellPackage.version} does not match public package version ${publicPackage.version}`
      )
    }

    let publishedVersion = ''
    try {
      const npmViewResult = runNpmCommand(
        ['view', `${publicPackage.name}@${publicPackage.version}`, 'version', '--json'],
        skillRoot,
        publicRegistry
      )
      publishedVersion = parseNpmViewVersion(npmViewResult.stdout)
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error)
      throw new BootstrapValidationError(
        `Open-source bootstrap requires ${publicPackage.name}@${publicPackage.version} to be published to npm before writing the dependency. npm view against ${publicRegistry} failed: ${detail}`
      )
    }

    if (publishedVersion !== publicPackage.version) {
      throw new BootstrapValidationError(
        `Open-source bootstrap requires npm to expose ${publicPackage.name}@${publicPackage.version}, but npm view returned ${publishedVersion || 'empty response'}`
      )
    }

    return {
      shellsSpec: publicPackage.version,
      source: runtimeDeliveryPolicy.deliveryChannels['open-source-package'].runtimeResolution,
    }
  }

  const expectedTarballPath = path.join(
    skillRoot,
    runtimeDeliveryPolicy.runtimePackage.vendoredTarballDirectory,
    `hiui-design-typical-page-shells-${shellPackage.version}.tgz`
  )

  throw new BootstrapValidationError(
    `Missing vendored runtime tarball for ${shellPackage.name}@${shellPackage.version}: expected ${path.relative(skillRoot, expectedTarballPath)}. This install source must ship the vendored tarball or the generated public package with a published npm release.`
  )
}

async function readJsonFile(jsonPath) {
  const raw = await fs.readFile(jsonPath, 'utf8')
  return JSON.parse(raw)
}

function getRecommendedMode({ hostProfile, legacyHostRuntime }) {
  return legacyHostRuntime?.incompatible ? 'legacy-host-compatible' : hostProfile.recommendedMode
}

function resolveInstallMode({ requestedMode, hostProfile, legacyHostRuntime }) {
  const baseMode = requestedMode !== 'auto' ? requestedMode : hostProfile.recommendedMode
  if (
    legacyHostRuntime?.incompatible &&
    (baseMode === 'rules-only' || baseMode === 'host-integration')
  ) {
    return 'legacy-host-compatible'
  }
  return baseMode
}

async function collectSourceFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectSourceFiles(absPath)))
      continue
    }

    if (entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name)) {
      files.push(absPath)
    }
  }

  return files
}

function extractImportSpecifiers(source) {
  const patterns = [
    /(?:import|export)\s+[\s\S]*?\s+from\s+['"]([^'"]+)['"]/g,
    /import\s+['"]([^'"]+)['"]/g,
    /import\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]
  const specifiers = new Set()

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1]
      if (specifier) {
        specifiers.add(specifier)
      }
    }
  }

  return [...specifiers]
}

function isBarePackageImport(specifier) {
  return (
    specifier &&
    !specifier.startsWith('.') &&
    !specifier.startsWith('/') &&
    !specifier.startsWith('@/') &&
    !specifier.startsWith('~/') &&
    !specifier.startsWith('node:')
  )
}

function normalizePackageName(specifier) {
  if (!isBarePackageImport(specifier)) return ''
  if (specifier.startsWith('@')) {
    const parts = specifier.split('/')
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : specifier
  }
  return specifier.split('/')[0]
}

async function loadHostIntegrationDependencies(skillRoot, peerDependencies, line = '') {
  const referencePath = path.join(skillRoot, 'docs', 'onboarding', 'host-integration-dependencies.json')
  const reference = await readJsonFile(referencePath)
  const versionMap = reference?.dependencies ?? {}
  const ignoredPackages = new Set([
    '@hiui-design/typical-page-shells',
    'react',
    'react-dom',
    ...Object.keys(peerDependencies ?? {}),
  ])

  const assetRoots = [path.join(skillRoot, 'examples', 'host-integration', 'src')]
  if (line) {
    const businessLineRoot = path.join(skillRoot, 'examples', 'business-lines', line, 'host-integration', 'src')
    if (await pathExists(businessLineRoot)) {
      assetRoots.push(businessLineRoot)
    }
  }

  const files = []
  for (const assetRoot of assetRoots) {
    files.push(...(await collectSourceFiles(assetRoot)))
  }
  const requiredPackages = new Set()

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8')
    for (const specifier of extractImportSpecifiers(raw)) {
      const depName = normalizePackageName(specifier)
      if (!depName || ignoredPackages.has(depName)) continue
      requiredPackages.add(depName)
    }
  }

  const missingVersionSpecs = [...requiredPackages].filter((depName) => !versionMap[depName])
  if (missingVersionSpecs.length > 0) {
    throw new Error(
      `host-integration-dependencies.json is missing version specs for: ${missingVersionSpecs.join(', ')}`
    )
  }

  const managedPackages = new Set([...requiredPackages, ...Object.keys(versionMap)])

  return Object.fromEntries(
    [...managedPackages]
      .sort((a, b) => a.localeCompare(b))
      .map((depName) => [depName, versionMap[depName]])
      .filter(([, depVersion]) => Boolean(depVersion))
  )
}

async function readTargetPackageJson(targetRoot) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return null
  }

  const raw = await fs.readFile(packageJsonPath, 'utf8')
  return JSON.parse(raw)
}

function detectLegacyHiUi4VisualDeps(pkg) {
  const allowedPrefixes = [
    '@hi-ui/schema-',
    '@hi-ui/use-ref-state',
    '@hi-ui/use-subscription',
    '@hi-ui/utility-types',
    '@hi-ui/global-context',
    '@hi-ui/group',
    '@hi-ui/dumb-wrapper',
  ]
  const versionPattern = /(^|[~^><= ])4\./
  const buckets = [pkg?.dependencies ?? {}, pkg?.devDependencies ?? {}, pkg?.peerDependencies ?? {}]
  const hits = []

  for (const bucket of buckets) {
    for (const [depName, depVersion] of Object.entries(bucket)) {
      if (!depName.startsWith('@hi-ui/')) continue
      if (allowedPrefixes.some((prefix) => depName.startsWith(prefix))) continue
      if (!versionPattern.test(String(depVersion))) continue
      hits.push(`${depName}@${depVersion}`)
    }
  }

  return [...new Set(hits)].sort((a, b) => a.localeCompare(b))
}

async function detectLegacyHostRuntimeMode({ targetRoot, pkg }) {
  const reasons = []
  const dependencies = {
    ...(pkg?.dependencies ?? {}),
    ...(pkg?.devDependencies ?? {}),
    ...(pkg?.peerDependencies ?? {}),
  }

  const reactSpec = dependencies.react ?? ''
  const reactDomSpec = dependencies['react-dom'] ?? ''
  const ahooksSpec = dependencies.ahooks ?? ''
  const hiuiSpec = dependencies['@hi-ui/hiui'] ?? ''
  const hiui5AliasSpec = dependencies.hiui5 ?? ''

  const reactMajor = parseLeadingMajorVersion(reactSpec)
  const reactDomMajor = parseLeadingMajorVersion(reactDomSpec)
  const ahooksMajor = parseLeadingMajorVersion(ahooksSpec)
  const hiuiMajor = parseLeadingMajorVersion(hiuiSpec)

  if (reactMajor > 0 && reactMajor < 18) {
    reasons.push(`react is pinned to ${reactSpec}`)
  }

  if (reactDomMajor > 0 && reactDomMajor < 18) {
    reasons.push(`react-dom is pinned to ${reactDomSpec}`)
  }

  if (ahooksMajor > 0 && ahooksMajor < 3) {
    reasons.push(`ahooks is pinned to ${ahooksSpec}`)
  }

  if (hiui5AliasSpec && hiuiMajor > 0 && hiuiMajor < 5) {
    reasons.push(
      `the host keeps legacy @hi-ui/hiui ${hiuiSpec} while exposing a separate hiui5 alias ${hiui5AliasSpec}`
    )
  }

  const buildConfigCandidates = [
    path.join(targetRoot, 'build', 'rspack.base.conf.js'),
    path.join(targetRoot, 'build', 'webpack.base.conf.js'),
    path.join(targetRoot, 'build', 'webpack.common.js'),
  ]

  for (const buildConfigPath of buildConfigCandidates) {
    const raw = await readTextIfExists(buildConfigPath)
    if (!raw) continue

    const usesLegacyFederationRuntime =
      raw.includes('ModuleFederationPlugin') &&
      raw.includes('shared:') &&
      raw.includes('singleton: true') &&
      (raw.includes("react$': reactPath") ||
        raw.includes('"react$": reactPath') ||
        raw.includes("'react-dom$': reactDomPath") ||
        raw.includes('"react-dom$": reactDomPath'))

    if (usesLegacyFederationRuntime) {
      reasons.push(
        `build config ${path.relative(targetRoot, buildConfigPath)} aliases and shares react/react-dom as a singleton host runtime`
      )
      break
    }
  }

  return {
    incompatible: reasons.length > 0,
    reasons,
  }
}

async function patchPackageJson({
  targetRoot,
  shellsSpec,
  peerDependencies,
  directDependencies,
  line,
  legacyCompatibilityOnly = false,
}) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return {
      status: 'missing',
      packageJsonPath,
      addedDeps: [],
      updatedDeps: [],
      addedScripts: [],
      skippedScripts: [],
    }
  }

  const raw = await fs.readFile(packageJsonPath, 'utf8')
  const pkg = JSON.parse(raw)
  const dependencies = { ...(pkg.dependencies ?? {}) }
  const devDependencies = { ...(pkg.devDependencies ?? {}) }
  const peerDeps = { ...(pkg.peerDependencies ?? {}) }
  const scripts = { ...(pkg.scripts ?? {}) }
  const addedDeps = []
  const updatedDeps = []
  const addedScripts = []
  const skippedScripts = []

  if (!legacyCompatibilityOnly) {
    {
      const result = upsertManagedDependency({
        dependencies,
        devDependencies,
        peerDeps,
        depName: '@hiui-design/typical-page-shells',
        depVersion: shellsSpec,
      })

      if (result.action === 'added') {
        addedDeps.push('@hiui-design/typical-page-shells')
      } else if (result.action === 'updated') {
        updatedDeps.push(`@hiui-design/typical-page-shells (${result.previous} -> ${shellsSpec})`)
      }
    }

    for (const [depName, depVersion] of Object.entries(peerDependencies)) {
      const result = upsertManagedDependency({
        dependencies,
        devDependencies,
        peerDeps,
        depName,
        depVersion,
      })

      if (result.action === 'added') {
        addedDeps.push(depName)
      } else if (result.action === 'updated') {
        updatedDeps.push(`${depName} (${result.previous} -> ${depVersion})`)
      }
    }

    for (const [depName, depVersion] of Object.entries(directDependencies ?? {})) {
      const result = upsertManagedDependency({
        dependencies,
        devDependencies,
        peerDeps,
        depName,
        depVersion,
      })

      if (result.action === 'added') {
        addedDeps.push(depName)
      } else if (result.action === 'updated') {
        updatedDeps.push(`${depName} (${result.previous} -> ${depVersion})`)
      }
    }
  }

  for (const [scriptName, scriptValue] of Object.entries(getReusableScripts(line))) {
    if (scripts[scriptName] == null) {
      scripts[scriptName] = scriptValue
      addedScripts.push(scriptName)
      continue
    }

    if (scripts[scriptName] !== scriptValue) {
      skippedScripts.push(scriptName)
    }
  }

  const nextPkg = {
    ...pkg,
    dependencies: sortObjectKeys(dependencies),
    scripts: sortObjectKeys(scripts),
  }

  if (pkg.devDependencies) {
    nextPkg.devDependencies = sortObjectKeys(devDependencies)
  }

  if (pkg.peerDependencies) {
    nextPkg.peerDependencies = sortObjectKeys(peerDeps)
  }

  const nextRaw = `${JSON.stringify(nextPkg, null, 2)}\n`
  if (nextRaw === raw) {
    return {
      status: 'unchanged',
      packageJsonPath,
      addedDeps,
      updatedDeps,
      addedScripts,
      skippedScripts,
    }
  }

  await fs.writeFile(packageJsonPath, nextRaw, 'utf8')
  return {
    status: legacyCompatibilityOnly ? 'updated (legacy-host-compatibility)' : 'updated',
    packageJsonPath,
    addedDeps,
    updatedDeps,
    addedScripts,
    skippedScripts,
  }
}

async function detectRouteFile(targetRoot) {
  const candidates = [
    'src/routes/config.tsx',
    'src/routes/config.jsx',
    'src/routes/config.ts',
    'src/routes/config.js',
    'src/routes/index.tsx',
    'src/routes/index.jsx',
    'src/routes/index.ts',
    'src/routes/index.js',
    'src/router/routes.tsx',
    'src/router/routes.jsx',
    'src/router/routes.ts',
    'src/router/routes.js',
    'src/router/index.tsx',
    'src/router/index.jsx',
    'src/router/index.ts',
    'src/router/index.js',
    'src/routes.tsx',
    'src/routes.jsx',
    'src/routes.ts',
    'src/routes.js',
  ]

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      return absPath
    }
  }

  return ''
}

async function detectAppShellFile(targetRoot) {
  const candidates = [
    'src/App.tsx',
    'src/App.jsx',
    'src/App.ts',
    'src/App.js',
    'src/app.tsx',
    'src/app.jsx',
    'src/app.ts',
    'src/app.js',
  ]

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      return absPath
    }
  }

  return ''
}

async function detectAppEntryFile(targetRoot) {
  const candidates = [
    'src/main.tsx',
    'src/main.ts',
    'src/main.jsx',
    'src/main.js',
    'src/index.tsx',
    'src/index.ts',
    'src/index.jsx',
    'src/index.js',
    'src/app.tsx',
    'src/app.ts',
    'pages/_app.tsx',
    'pages/_app.ts',
    'src/pages/_app.tsx',
    'src/pages/_app.ts',
    'app/layout.tsx',
    'app/layout.ts',
    'src/app/layout.tsx',
    'src/app/layout.ts',
  ]

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      return absPath
    }
  }

  return ''
}

async function detectStarterRootStyleFile(targetRoot) {
  const candidates = ['src/index.css', 'src/main.css', 'src/app.css', 'src/App.css']

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      return absPath
    }
  }

  return ''
}

async function detectViteConfigFile(targetRoot) {
  const candidates = [
    'vite.config.ts',
    'vite.config.tsx',
    'vite.config.mts',
    'vite.config.js',
    'vite.config.jsx',
    'vite.config.mjs',
    'vite.config.cjs',
    'vite.config.cts',
  ]

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      return absPath
    }
  }

  return ''
}

function findMatchingBrace(source, openBraceIndex) {
  let quote = ''
  let escaped = false
  let lineComment = false
  let blockComment = false
  let depth = 0

  for (let index = openBraceIndex; index < source.length; index += 1) {
    const char = source[index]
    const nextChar = source[index + 1]

    if (lineComment) {
      if (char === '\n') lineComment = false
      continue
    }

    if (blockComment) {
      if (char === '*' && nextChar === '/') {
        blockComment = false
        index += 1
      }
      continue
    }

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === quote) {
        quote = ''
      }
      continue
    }

    if (char === '/' && nextChar === '/') {
      lineComment = true
      index += 1
      continue
    }

    if (char === '/' && nextChar === '*') {
      blockComment = true
      index += 1
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '{') {
      depth += 1
      continue
    }

    if (char === '}') {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }

  return -1
}

function findObjectPropertyRange(source, propertyName) {
  const pattern = new RegExp(`(?:['"]${propertyName}['"]|\\b${propertyName}\\b)\\s*:`, 'g')

  for (const match of source.matchAll(pattern)) {
    const colonIndex = source.indexOf(':', match.index)
    if (colonIndex < 0) continue

    let cursor = colonIndex + 1
    while (cursor < source.length && /\s/.test(source[cursor])) {
      cursor += 1
    }

    if (source[cursor] !== '{') continue

    const closeIndex = findMatchingBrace(source, cursor)
    if (closeIndex < 0) continue

    return { openBraceIndex: cursor, closeBraceIndex: closeIndex }
  }

  return null
}

function findRootConfigObjectRange(source) {
  const patterns = [
    /defineConfig\s*\(/g,
    /export\s+default\s*\{/g,
    /module\.exports\s*=\s*\{/g,
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(source)
    if (!match) continue
    const openBraceIndex =
      pattern.source.includes('\\{') ? source.indexOf('{', match.index) : source.indexOf('{', match.index + match[0].length)
    if (openBraceIndex < 0) continue
    const closeBraceIndex = findMatchingBrace(source, openBraceIndex)
    if (closeBraceIndex < 0) continue
    return { openBraceIndex, closeBraceIndex }
  }

  return null
}

function insertIntoObjectLiteral(source, objectRange, entryText) {
  const beforeClose = source.slice(0, objectRange.closeBraceIndex)
  const afterClose = source.slice(objectRange.closeBraceIndex)
  const lineStart = source.lastIndexOf('\n', objectRange.closeBraceIndex - 1) + 1
  const closingIndent = source.slice(lineStart, objectRange.closeBraceIndex).match(/^\s*/)?.[0] ?? ''
  const innerIndent = `${closingIndent}  `
  const trimmedBefore = beforeClose.trimEnd()
  const separator = trimmedBefore.endsWith('{') || trimmedBefore.endsWith(',') ? '' : ','
  const body = entryText
    .split('\n')
    .map((line) => `${innerIndent}${line}`)
    .join('\n')

  return `${beforeClose}${separator}\n${body}\n${closingIndent}${afterClose}`
}

async function writeViteAliasSnippet({ outputRoot, viteFile, shimPath }) {
  const snippetPath = path.join(outputRoot, 'VITE_ALIAS_SNIPPET.md')
  const viteLabel = viteFile ? path.relative(path.dirname(outputRoot), viteFile) : 'your vite config file'
  const content = `# Vite Schema Types Alias Snippet

Vite prebundling fails on \`@hi-ui/schema-types\` because the package only ships declarations.
Add the alias below to your Vite config before running \`vite\`, \`pnpm dev\`, or \`pnpm build\`.

## Suggested target

- ${viteLabel}

## Alias block

\`\`\`ts
resolve: {
  alias: {
    '@hi-ui/schema-types': ${JSON.stringify(shimPath)},
  },
}
\`\`\`

## Synced shim file

- ${path.relative(path.dirname(outputRoot), shimPath)}
`

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

async function patchViteSchemaTypesAlias({ targetRoot, outputRoot }) {
  const viteFile = await detectViteConfigFile(targetRoot)
  const shimPath = path.join(outputRoot, 'shims', 'schema-types-empty.js')

  if (!viteFile) {
    return { status: 'not-detected', viteFile: '', snippetPath: '' }
  }

  const raw = await fs.readFile(viteFile, 'utf8')
  if (raw.includes('@hi-ui/schema-types')) {
    return { status: 'already-patched', viteFile, snippetPath: '' }
  }

  const aliasEntry = `'@hi-ui/schema-types': ${JSON.stringify(shimPath)}`
  const aliasRange = findObjectPropertyRange(raw, 'alias')

  if (aliasRange) {
    const nextRaw = insertIntoObjectLiteral(raw, aliasRange, aliasEntry)
    await fs.writeFile(viteFile, nextRaw, 'utf8')
    return { status: 'patched', viteFile, snippetPath: '' }
  }

  const resolveRange = findObjectPropertyRange(raw, 'resolve')
  if (resolveRange) {
    const nextRaw = insertIntoObjectLiteral(raw, resolveRange, `alias: {\n  ${aliasEntry}\n}`)
    await fs.writeFile(viteFile, nextRaw, 'utf8')
    return { status: 'patched', viteFile, snippetPath: '' }
  }

  const rootRange = findRootConfigObjectRange(raw)
  if (rootRange) {
    const nextRaw = insertIntoObjectLiteral(
      raw,
      rootRange,
      `resolve: {\n  alias: {\n    ${aliasEntry}\n  }\n}`
    )
    await fs.writeFile(viteFile, nextRaw, 'utf8')
    return { status: 'patched', viteFile, snippetPath: '' }
  }

  const snippetPath = await writeViteAliasSnippet({ outputRoot, viteFile, shimPath })
  return { status: 'snippet-only', viteFile, snippetPath }
}

async function detectPackageManager(targetRoot) {
  const pkg = await readTargetPackageJson(targetRoot)
  const packageManager = typeof pkg?.packageManager === 'string' ? pkg.packageManager : ''

  if (packageManager.startsWith('pnpm@')) return 'pnpm'
  if (packageManager.startsWith('yarn@')) return 'yarn'
  if (packageManager.startsWith('npm@')) return 'npm'
  if (packageManager.startsWith('bun@')) return 'bun'

  const lockfileManagers = [
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['package-lock.json', 'npm'],
    ['bun.lockb', 'bun'],
    ['bun.lock', 'bun'],
  ]

  for (const [filename, manager] of lockfileManagers) {
    if (await pathExists(path.join(targetRoot, filename))) {
      return manager
    }
  }

  return 'npm'
}

function getInstallArgs(manager) {
  switch (manager) {
    case 'pnpm':
    case 'yarn':
    case 'npm':
    case 'bun':
      return ['install']
    default:
      return ['install']
  }
}

async function runInstall({ targetRoot, timeoutMs }) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return {
      status: 'skipped',
      command: '',
      message: `Missing package.json at ${packageJsonPath}`,
    }
  }

  const manager = await detectPackageManager(targetRoot)
  const args = getInstallArgs(manager)
  const command = [manager, ...args].join(' ')
  const result = spawnSync(manager, args, {
    cwd: targetRoot,
    encoding: 'utf8',
    timeout: timeoutMs,
  })

  if (result.error) {
    return {
      status: 'failed',
      command,
      message:
        result.error.code === 'ETIMEDOUT'
          ? `${command} timed out after ${timeoutMs}ms`
          : result.error.message,
    }
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    return {
      status: 'failed',
      command,
      message: stderr || stdout || `${command} exited with code ${result.status}`,
    }
  }

  return {
    status: 'installed',
    command,
    message: '',
  }
}

function parseI18nInitOutput(stdout, targetRoot) {
  const details = {
    generatedPath: '',
    locales: '',
    syncedFiles: '',
  }

  for (const line of String(stdout ?? '').split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- generated: ')) {
      details.generatedPath = trimmed.slice('- generated: '.length)
      continue
    }
    if (trimmed.startsWith('- locales: ')) {
      details.locales = trimmed.slice('- locales: '.length)
      continue
    }
    if (trimmed.startsWith('- synced locale files: ')) {
      details.syncedFiles = trimmed.slice('- synced locale files: '.length)
    }
  }

  return {
    status: 'auto-synced',
    command: `node ".local-context/hiui-design/scripts/init-i18n.mjs" --target ${targetRoot}`,
    ...details,
  }
}

function runI18nInit({ skillRoot, targetRoot }) {
  const i18nScriptPath = path.join(skillRoot, 'scripts', 'init-i18n.mjs')
  const result = spawnSync(process.execPath, [i18nScriptPath, '--target', targetRoot], {
    cwd: skillRoot,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || 'init-i18n.mjs failed')
  }

  return parseI18nInitOutput(result.stdout, targetRoot)
}

function skippedI18nInitResult({ explicitSkip = false } = {}) {
  return {
    status: explicitSkip
      ? 'skipped (--skip-i18n-init)'
      : 'not-requested (pass --init-i18n to provision src/translation baseline)',
    command: '',
    generatedPath: '',
    locales: '',
    syncedFiles: '',
  }
}

function parseProjectImagesInitOutput(stdout, targetRoot) {
  const details = {
    registryPath: '',
    assetDir: '',
    syncedImageFiles: '',
    seededFiles: '',
    preservedFiles: '',
  }

  for (const line of String(stdout ?? '').split('\n')) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- registry: ')) {
      details.registryPath = trimmed.slice('- registry: '.length)
      continue
    }
    if (trimmed.startsWith('- asset dir: ')) {
      details.assetDir = trimmed.slice('- asset dir: '.length)
      continue
    }
    if (trimmed.startsWith('- synced image files: ')) {
      details.syncedImageFiles = trimmed.slice('- synced image files: '.length)
      continue
    }
    if (trimmed.startsWith('- seeded files: ')) {
      details.seededFiles = trimmed.slice('- seeded files: '.length)
      continue
    }
    if (trimmed.startsWith('- preserved existing files: ')) {
      details.preservedFiles = trimmed.slice('- preserved existing files: '.length)
    }
  }

  return {
    status: 'auto-synced',
    command: `node ".local-context/hiui-design/scripts/init-project-images.mjs" --target ${targetRoot}`,
    ...details,
  }
}

function runProjectImagesInit({ skillRoot, targetRoot }) {
  const scriptPath = path.join(skillRoot, 'scripts', 'init-project-images.mjs')
  const result = spawnSync(process.execPath, [scriptPath, '--target', targetRoot], {
    cwd: skillRoot,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || 'init-project-images.mjs failed')
  }

  return parseProjectImagesInitOutput(result.stdout, targetRoot)
}

function toImportPath(fromDir, targetFile) {
  const relative = path.relative(fromDir, targetFile).split(path.sep).join('/')
  const withoutExt = relative.replace(/\.[^.]+$/, '')
  return withoutExt.startsWith('.') ? withoutExt : `./${withoutExt}`
}

function getLineIndent(source, index) {
  const lineStart = source.lastIndexOf('\n', index - 1) + 1
  return source.slice(lineStart, index).match(/^\s*/)?.[0] ?? ''
}

function appendArrayEntry(source, closeBracketIndex, entryText) {
  const closeIndent = getLineIndent(source, closeBracketIndex)
  const beforeClose = source
    .slice(0, closeBracketIndex)
    .replace(/[ \t]*$/, '')
    .replace(/\n$/, '')
  const trimmedBeforeClose = beforeClose.trimEnd()
  const separator =
    trimmedBeforeClose.endsWith('[') || trimmedBeforeClose.endsWith(',') ? '' : ','

  return (
    beforeClose +
    `${separator}\n${entryText}\n${closeIndent}` +
    source.slice(closeBracketIndex)
  )
}

function createExampleMenuRouteBlock(baseIndent, importIdentifier, iconIdentifier) {
  return [
    `${baseIndent}{`,
    `${baseIndent}  title: '示例',`,
    `${baseIndent}  icon: <${iconIdentifier} />,`,
    `${baseIndent}  children: ${importIdentifier},`,
    `${baseIndent}}`,
  ].join('\n')
}

const FIRST_LEVEL_MENU_ICON_CONTRACT = [
  '- First-level navigation icons are information-architecture signals, not decorative placeholders.',
  '- Use semantic `@hi-ui/icons` Filled variants for every visible first-level route group.',
  '- Reserve `AppStoreFilled` for the `示例` smoke/gallery group only.',
  '- Business groups such as `业务` / `项目` / `订单` / `工单` must use domain-specific icons, for example `BusinessCardFilled`, `FolderOpenFilled`, or another matching Filled icon.',
  '- Do not reuse the same icon across multiple first-level groups unless the route owner documents that they intentionally represent the same domain.',
].join('\n')

function findMatchingToken(source, startIndex, openToken, closeToken) {
  if (startIndex < 0 || source[startIndex] !== openToken) {
    return -1
  }

  let depth = 0
  let quote = null
  let escaped = false
  let lineComment = false
  let blockComment = false

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index]
    const nextChar = source[index + 1]

    if (lineComment) {
      if (char === '\n') {
        lineComment = false
      }
      continue
    }

    if (blockComment) {
      if (char === '*' && nextChar === '/') {
        blockComment = false
        index += 1
      }
      continue
    }

    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '/' && nextChar === '/') {
      lineComment = true
      index += 1
      continue
    }

    if (char === '/' && nextChar === '*') {
      blockComment = true
      index += 1
      continue
    }

    if (char === "'" || char === '"' || char === '`') {
      quote = char
      continue
    }

    if (char === openToken) {
      depth += 1
      continue
    }

    if (char === closeToken) {
      depth -= 1
      if (depth === 0) {
        return index
      }
    }
  }

  return -1
}

function findExampleChildrenCloseIndex(source, title) {
  const titlePattern = new RegExp(`title\\s*:\\s*(['"])${title}\\1`, 'g')
  let titleMatch = titlePattern.exec(source)

  while (titleMatch) {
    const objectStart = source.lastIndexOf('{', titleMatch.index)
    if (objectStart >= 0) {
      const objectEnd = findMatchingToken(source, objectStart, '{', '}')
      if (objectEnd > objectStart) {
        const objectText = source.slice(objectStart, objectEnd + 1)
        const childrenMatch = /children\s*:\s*\[/.exec(objectText)

        if (childrenMatch) {
          const childrenStart =
            objectStart +
            childrenMatch.index +
            childrenMatch[0].lastIndexOf('[')
          const childrenCloseIndex = findMatchingToken(source, childrenStart, '[', ']')

          if (childrenCloseIndex > childrenStart) {
            return childrenCloseIndex
          }
        }
      }
    }

    titleMatch = titlePattern.exec(source)
  }

  return -1
}

async function writeRouteSnippet({ outputRoot, routeFile, importPath }) {
  const snippetPath = path.join(outputRoot, 'ROUTE_MOUNT_SNIPPET.md')
  const routeLabel = routeFile ? path.relative(path.dirname(outputRoot), routeFile) : 'your route config file'
  const content = `# Route Mount Snippet

Route auto-patch was not applied. Mount the typical page routes manually.

## Import

\`\`\`tsx
import { AppStoreFilled } from '@hi-ui/icons'
import typicalPageReuseRoutes from '${importPath}'
\`\`\`

## Preferred mount

\`\`\`tsx
{
  title: '示例',
  icon: <AppStoreFilled />,
  children: typicalPageReuseRoutes,
}
\`\`\`

If the target project already has a top-level \`示例\` menu group, merge
\`...typicalPageReuseRoutes\` into that group's \`children\` array instead of creating a
second \`示例\` node.

## First-level menu icon contract

${FIRST_LEVEL_MENU_ICON_CONTRACT}

## Suggested target

- ${routeLabel}
`

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

async function writeRouteGuardNote({ outputRoot, routeFile }) {
  const snippetPath = path.join(outputRoot, 'ROUTE_MOUNT_SNIPPET.md')
  const routeLabel = routeFile ? path.relative(path.dirname(outputRoot), routeFile) : 'your route config file'
  const content = `# Route Mount Guard

The target project was detected as an existing system, so the host-integration gallery was synced
for smoke/reference only and was not auto-mounted into the main route tree.

## Do not do this by default

- Do not append \`typicalPageReuseRoutes\` directly to the existing production route array.
- Do not expose the smoke gallery through the normal left navigation of an existing system.

## If you explicitly need the gallery

- Mount it under an isolated debug/dev-only route.
- Keep it out of the production navigation, permission tree, and default landing flow.

## Suggested route file to review

- ${routeLabel}
`

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

async function writeAppFrameSnippet({ outputRoot, appFile, importPath, routesIdentifier }) {
  return writeAppFrameSnippetWithReason({
    outputRoot,
    appFile,
    importPath,
    routesIdentifier,
    reason: '',
  })
}

async function writeAppFrameSnippetWithReason({
  outputRoot,
  appFile,
  importPath,
  routesIdentifier,
  reason,
}) {
  const snippetPath = path.join(outputRoot, 'APP_FRAME_SNIPPET.md')
  const appLabel = appFile ? path.relative(path.dirname(outputRoot), appFile) : 'your App file'
  const content = `# App Frame Mount Snippet

Mount the greenfield host-integration app frame so the synced example routes render inside an
application-level navigation shell instead of as standalone pages.

${reason ? `## Why auto-patch was skipped\n\n- ${reason}\n\n` : ''}## Import

\`\`\`tsx
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppStoreFilled } from '@hi-ui/icons'
import { TypicalPageAppFrame } from '${importPath}'
\`\`\`

## Wrap the route outlet

Use one host-level gallery route object for both page routing and the app-frame menu. Do not
pass bare \`${routesIdentifier}\` into \`TypicalPageAppFrame\`, because that makes the synced
typical-page categories render as first-level menus.

\`\`\`tsx
const typicalPageGalleryRoute = {
  title: '示例',
  path: 'examples',
  icon: <AppStoreFilled />,
  element: <Outlet />,
  children: ${routesIdentifier},
}

// New business route groups should sit beside this gallery route and use their
// own semantic Filled icons, for example BusinessCardFilled for 业务 and
// FolderOpenFilled for 项目. AppStoreFilled is reserved for 示例 only.
const appRoutes = [
  {
    path: '/',
    element: <Navigate to="/examples/table/common/basic" replace />,
  },
  typicalPageGalleryRoute,
]

export default function AppRoutes() {
  const element = useRoutes(appRoutes)
  return <TypicalPageAppFrame routes={[typicalPageGalleryRoute]}>{element}</TypicalPageAppFrame>
}
\`\`\`

## Keep HiUI component locale in sync

If the target project uses the generated \`src/translation\` bridge, also keep the top-level
HiUI locale provider in sync with the selected page locale.

## First-level menu icon contract

${FIRST_LEVEL_MENU_ICON_CONTRACT}

\`\`\`tsx
import { LocaleProvider } from '@hi-ui/hiui'
import { useTranslation } from './translation' // adjust the import path if needed

LocaleProvider.merge('en-US', 'id-ID', {})
LocaleProvider.merge('en-US', 'th-TH', {})
LocaleProvider.merge('en-US', 'de-DE', {})
LocaleProvider.merge('en-US', 'ar-SA', {})

const HIUI_LOCALE_MAP = {
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'en-US': 'en-US',
  'id-ID': 'id-ID',
  'th-TH': 'th-TH',
  'de-DE': 'de-DE',
  'ar-SA': 'ar-SA',
}

export default function App() {
  const { locale } = useTranslation()

  return <LocaleProvider locale={HIUI_LOCALE_MAP[locale]}>{/* app tree */}</LocaleProvider>
}
\`\`\`

## Suggested target

- ${appLabel}
`

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

async function writeEntryRouterSnippet({ outputRoot, entryFile, reason }) {
  const snippetPath = path.join(outputRoot, 'APP_ENTRY_ROUTER_SNIPPET.md')
  const entryLabel = entryFile ? path.relative(path.dirname(outputRoot), entryFile) : 'your app entry file'
  const content = `# App Entry Router Snippet

Wrap the top-level application render with \`BrowserRouter\` so \`useRoutes\`, \`useNavigate\`, and
\`TypicalPageAppFrame\` can run inside a router context.

${reason ? `## Why auto-patch was skipped\n\n- ${reason}\n\n` : ''}## Import

\`\`\`tsx
import { BrowserRouter } from 'react-router-dom'
\`\`\`

## Wrap the app root

\`\`\`tsx
<BrowserRouter>
  <App />
</BrowserRouter>
\`\`\`

## Suggested target

- ${entryLabel}
`

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

async function patchRouteFile({ targetRoot, routeFile, outputRoot }) {
  const resolvedRouteFile = routeFile
    ? path.resolve(targetRoot, routeFile)
    : await detectRouteFile(targetRoot)

  if (!resolvedRouteFile || !(await pathExists(resolvedRouteFile))) {
    const snippetPath = await writeRouteSnippet({
      outputRoot,
      routeFile: '',
      importPath: './routes/config',
    })
    return { status: 'snippet-only', routeFile: '', snippetPath }
  }

  const raw = await fs.readFile(resolvedRouteFile, 'utf8')
  const importIdentifier = 'typicalPageReuseRoutes'
  const iconIdentifier = 'AppStoreFilled'
  const importPath = toImportPath(path.dirname(resolvedRouteFile), path.join(outputRoot, 'routes', 'config.tsx'))
  const importLine = `import ${importIdentifier} from '${importPath}'`
  const iconImportLine = `import { ${iconIdentifier} } from '@hi-ui/icons'`

  if (
    raw.includes(`...${importIdentifier}`) ||
    raw.includes(`children: ${importIdentifier}`) ||
    raw.includes(`children:${importIdentifier}`)
  ) {
    return { status: 'already-mounted', routeFile: resolvedRouteFile, snippetPath: '' }
  }

  const exportMatch = raw.match(/export\s+default\s+([A-Za-z_$][\w$]*)\s*$/m)
  if (!exportMatch) {
    const snippetPath = await writeRouteSnippet({
      outputRoot,
      routeFile: resolvedRouteFile,
      importPath,
    })
    return { status: 'snippet-only', routeFile: resolvedRouteFile, snippetPath }
  }

  const routesVarName = exportMatch[1]
  const declarationRegex = new RegExp(`(?:const|let|var)\\s+${routesVarName}\\b[\\s\\S]*?=\\s*\\[`, 'm')
  const declarationMatch = declarationRegex.exec(raw)
  if (!declarationMatch || declarationMatch.index == null) {
    const snippetPath = await writeRouteSnippet({
      outputRoot,
      routeFile: resolvedRouteFile,
      importPath,
    })
    return { status: 'snippet-only', routeFile: resolvedRouteFile, snippetPath }
  }

  const exportIndex = raw.lastIndexOf(`export default ${routesVarName}`)
  const importInjected = raw.includes(importLine)
    ? raw
    : raw.match(/((?:import[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n)+)/)
      ? raw.replace(/((?:import[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n)+)/, `$1${importLine}\n`)
      : `${importLine}\n${raw}`

  const iconImportInjected =
    /import[\s\S]*?\bAppStoreFilled\b[\s\S]*?from\s+['"]@hi-ui\/icons['"]/.test(importInjected)
      ? importInjected
      : importInjected.match(/((?:import[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n)+)/)
        ? importInjected.replace(/((?:import[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n)+)/, `$1${iconImportLine}\n`)
        : `${iconImportLine}\n${importInjected}`

  if (!iconImportInjected.includes(importLine) || !iconImportInjected.includes(iconIdentifier)) {
    const snippetPath = await writeRouteSnippet({
      outputRoot,
      routeFile: resolvedRouteFile,
      importPath,
    })
    return { status: 'snippet-only', routeFile: resolvedRouteFile, snippetPath }
  }

  const exportIndexInjected = iconImportInjected.lastIndexOf(`export default ${routesVarName}`)
  const closeBracketIndex = iconImportInjected.lastIndexOf(']', exportIndexInjected)
  if (closeBracketIndex < 0) {
    const snippetPath = await writeRouteSnippet({
      outputRoot,
      routeFile: resolvedRouteFile,
      importPath,
    })
    return { status: 'snippet-only', routeFile: resolvedRouteFile, snippetPath }
  }

  const exampleChildrenCloseIndex = findExampleChildrenCloseIndex(iconImportInjected, '示例')
  const routeMounted =
    exampleChildrenCloseIndex >= 0
      ? appendArrayEntry(
          iconImportInjected,
          exampleChildrenCloseIndex,
          `${getLineIndent(iconImportInjected, exampleChildrenCloseIndex)}  ...${importIdentifier}`
        )
      : appendArrayEntry(
          iconImportInjected,
          closeBracketIndex,
          createExampleMenuRouteBlock(
            `${getLineIndent(iconImportInjected, closeBracketIndex)}  `,
            importIdentifier,
            iconIdentifier
          )
        )

  await fs.writeFile(resolvedRouteFile, routeMounted, 'utf8')
  return { status: 'patched', routeFile: resolvedRouteFile, snippetPath: '' }
}

async function patchGreenfieldAppFrame({ targetRoot, outputRoot, hostProfile }) {
  const supportsAppFrame =
    hostProfile.projectType === 'greenfield' &&
    ['react-vite-router', 'react-vite', 'react-router-custom'].includes(hostProfile.framework)

  if (!supportsAppFrame) {
    return { status: 'not-applied', appFile: '', snippetPath: '', routeHandledInApp: false, detail: '' }
  }

  const appFile = await detectAppShellFile(targetRoot)
  const importPath = toImportPath(path.join(targetRoot, 'src'), path.join(outputRoot, 'app-frame.tsx'))

  if (!appFile || !(await pathExists(appFile))) {
    const snippetPath = await writeAppFrameSnippetWithReason({
      outputRoot,
      appFile: '',
      importPath,
      routesIdentifier: 'routes',
      reason: 'No supported App.* entry was found in the target project.',
    })
    return { status: 'snippet-only', appFile: '', snippetPath, routeHandledInApp: false, detail: 'missing App.* entry' }
  }

  const raw = await fs.readFile(appFile, 'utf8')
  const importIdentifier = 'TypicalPageAppFrame'
  const iconIdentifier = 'AppStoreFilled'
  const routeImportPath = toImportPath(path.dirname(appFile), path.join(outputRoot, 'routes', 'config.tsx'))

  if (raw.includes(importIdentifier)) {
    const bareTypicalRoutesPattern =
      /<TypicalPageAppFrame([^>]*)\broutes=\{typicalPageReuseRoutes\}([^>]*)>/m

    if (
      bareTypicalRoutesPattern.test(raw) &&
      /(?:const|let|var)\s+typicalPageGalleryRoute\s*=/.test(raw)
    ) {
      const nextRaw = raw.replace(
        bareTypicalRoutesPattern,
        '<TypicalPageAppFrame$1routes={[typicalPageGalleryRoute]}$2>'
      )
      await fs.writeFile(appFile, nextRaw, 'utf8')
      return {
        status: 'patched',
        appFile,
        snippetPath: '',
        routeHandledInApp: true,
        detail: 'repointed TypicalPageAppFrame to the host-level typicalPageGalleryRoute menu tree',
      }
    }

    if (
      bareTypicalRoutesPattern.test(raw) &&
      /(?:const|let|var)\s+appRoutes\s*=/.test(raw) &&
      /title\s*:\s*['"]示例['"]/.test(raw) &&
      /children\s*:\s*typicalPageReuseRoutes/.test(raw)
    ) {
      const nextRaw = raw.replace(
        bareTypicalRoutesPattern,
        '<TypicalPageAppFrame$1routes={appRoutes}$2>'
      )
      await fs.writeFile(appFile, nextRaw, 'utf8')
      return {
        status: 'patched',
        appFile,
        snippetPath: '',
        routeHandledInApp: true,
        detail: 'repointed TypicalPageAppFrame to the appRoutes tree that owns the top-level 示例 group',
      }
    }

    return { status: 'already-patched', appFile, snippetPath: '', routeHandledInApp: true, detail: '' }
  }

  const routesImportMatch = raw.match(
    /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"][^'"]*routes(?:\/config)?(?:\.[^'"]+)?['"]/
  )
  const routesIdentifier = routesImportMatch?.[1] ?? 'routes'
  const appFrameImportPath = toImportPath(path.dirname(appFile), path.join(outputRoot, 'app-frame.tsx'))
  const importLine = `import { ${importIdentifier} } from '${appFrameImportPath}'`

  if (!routesImportMatch) {
    const isStarterLikeApp =
      /\.(?:jsx|tsx|js)$/.test(appFile) &&
      !raw.includes('useRoutes(') &&
      !raw.includes('react-router-dom') &&
      (/import\s+['"]\.\/App\.css['"]/.test(raw) ||
        /Vite \+ React/.test(raw) ||
        /count is/i.test(raw) ||
        /className=["']card["']/.test(raw) ||
        /className=["']logo["']/.test(raw))

    if (isStarterLikeApp) {
      const nextRaw = [
        `import { Navigate, Outlet, useRoutes } from 'react-router-dom'`,
        `import { ${iconIdentifier} } from '@hi-ui/icons'`,
        `import { ${importIdentifier} } from '${appFrameImportPath}'`,
        `import typicalPageReuseRoutes from '${routeImportPath}'`,
        '',
        'const typicalPageGalleryRoute = {',
        `  title: '示例',`,
        `  path: 'examples',`,
        `  icon: <${iconIdentifier} />,`,
        '  element: <Outlet />,',
        '  children: typicalPageReuseRoutes,',
        '}',
        '',
        'const appRoutes = [',
        '  {',
        `    path: '/',`,
        `    element: <Navigate to="/examples/table/common/basic" replace />,`,
        '  },',
        '  typicalPageGalleryRoute,',
        ']',
        '',
        'export default function App() {',
        '  const element = useRoutes(appRoutes)',
        `  return <${importIdentifier} routes={[typicalPageGalleryRoute]}>{element}</${importIdentifier}>`,
        '}',
        '',
      ].join('\n')

      await fs.writeFile(appFile, nextRaw, 'utf8')
      return {
        status: 'patched (starter app)',
        appFile,
        snippetPath: '',
        routeHandledInApp: true,
        detail: 'replaced the Vite starter placeholder app with typical-page route mounting',
      }
    }

    const snippetPath = await writeAppFrameSnippetWithReason({
      outputRoot,
      appFile,
      importPath: appFrameImportPath,
      routesIdentifier,
      reason:
        'No reusable route import was detected in App.* and the file did not match the supported greenfield Vite starter placeholder patterns.',
    })
    return { status: 'snippet-only', appFile, snippetPath, routeHandledInApp: false, detail: 'unsupported App.* shape' }
  }

  const importInjected = raw.includes(importLine)
    ? raw
    : raw.match(/((?:import[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n)+)/)
      ? raw.replace(/((?:import[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n)+)/, `$1${importLine}\n`)
      : `${importLine}\n${raw}`

  if (!importInjected.includes(importLine)) {
    const snippetPath = await writeAppFrameSnippetWithReason({
      outputRoot,
      appFile,
      importPath: appFrameImportPath,
      routesIdentifier,
      reason: 'Failed to inject TypicalPageAppFrame import into the App.* entry.',
    })
    return { status: 'snippet-only', appFile, snippetPath, routeHandledInApp: false, detail: 'failed to inject app-frame import' }
  }

  const useRoutesReturnPattern = new RegExp(
    `^([ \\t]*)return\\s+useRoutes\\(\\s*${routesIdentifier}\\s*\\)\\s*;?\\s*$`,
    'm'
  )
  const match = importInjected.match(useRoutesReturnPattern)

  if (!match) {
    const snippetPath = await writeAppFrameSnippetWithReason({
      outputRoot,
      appFile,
      importPath: appFrameImportPath,
      routesIdentifier,
      reason:
        'App.* already imports routes, but the return shape is not the supported `return useRoutes(routes)` pattern required for safe text patching.',
    })
    return { status: 'snippet-only', appFile, snippetPath, routeHandledInApp: false, detail: 'unsupported useRoutes return shape' }
  }

  const indent = match[1] ?? ''
  const replacement = [
    `${indent}const element = useRoutes(${routesIdentifier})`,
    `${indent}return <${importIdentifier} routes={${routesIdentifier}}>{element}</${importIdentifier}>`,
  ].join('\n')

  const nextRaw = importInjected.replace(useRoutesReturnPattern, replacement)
  await fs.writeFile(appFile, nextRaw, 'utf8')
  return { status: 'patched', appFile, snippetPath: '', routeHandledInApp: true, detail: 'wrapped existing useRoutes() outlet with TypicalPageAppFrame' }
}

async function patchGreenfieldRouterEntry({ targetRoot, outputRoot, hostProfile }) {
  const supportsRouterEntry =
    hostProfile.projectType === 'greenfield' &&
    ['react-vite-router', 'react-vite', 'react-router-custom'].includes(hostProfile.framework)

  if (!supportsRouterEntry) {
    return { status: 'not-applied', entryFile: '', snippetPath: '', detail: '' }
  }

  const entryFile = await detectAppEntryFile(targetRoot)
  if (!entryFile || !(await pathExists(entryFile))) {
    const snippetPath = await writeEntryRouterSnippet({
      outputRoot,
      entryFile: '',
      reason: 'No supported app entry file was found for BrowserRouter patching.',
    })
    return { status: 'snippet-only', entryFile: '', snippetPath, detail: 'missing app entry' }
  }

  const raw = await fs.readFile(entryFile, 'utf8')
  if (raw.includes('BrowserRouter') || raw.includes('createBrowserRouter(')) {
    return { status: 'already-patched', entryFile, snippetPath: '', detail: '' }
  }

  const appImportMatch = raw.match(/import\s+([A-Za-z_$][\w$]*)\s+from\s+['"][^'"]*App(?:\.[^'"]+)?['"]/)
  const appIdentifier = appImportMatch?.[1] ?? ''

  if (!appIdentifier) {
    const snippetPath = await writeEntryRouterSnippet({
      outputRoot,
      entryFile,
      reason: 'The entry file does not default-import App.*, so BrowserRouter could not be inserted safely.',
    })
    return { status: 'snippet-only', entryFile, snippetPath, detail: 'missing App import in entry file' }
  }

  const importLine = `import { BrowserRouter } from 'react-router-dom'`
  const importInjected =
    raw.includes(importLine) || raw.includes(`import { BrowserRouter } from "react-router-dom"`)
      ? raw
      : raw.match(/((?:import[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n)+)/)
        ? raw.replace(/((?:import[\s\S]*?from\s+['"][^'"]+['"]\s*;?\n)+)/, `$1${importLine}\n`)
        : `${importLine}\n${raw}`

  const appTagPattern = new RegExp(`^([ \\t]*)<${appIdentifier}\\s*/>\\s*$`, 'm')
  const appTagMatch = appTagPattern.exec(importInjected)

  if (!appTagMatch) {
    const snippetPath = await writeEntryRouterSnippet({
      outputRoot,
      entryFile,
      reason:
        'The entry file does not render a simple standalone <App /> node, so BrowserRouter wrapping requires manual review.',
    })
    return { status: 'snippet-only', entryFile, snippetPath, detail: 'unsupported entry render shape' }
  }

  const indent = appTagMatch[1] ?? ''
  const replacement = [
    `${indent}<BrowserRouter>`,
    `${indent}  <${appIdentifier} />`,
    `${indent}</BrowserRouter>`,
  ].join('\n')
  const nextRaw = importInjected.replace(appTagPattern, replacement)

  await fs.writeFile(entryFile, nextRaw, 'utf8')
  return {
    status: 'patched',
    entryFile,
    snippetPath: '',
    detail: 'wrapped the App root with BrowserRouter',
  }
}

function shouldAutoMountHostIntegrationRoutes(hostProfile) {
  return hostProfile.projectType === 'greenfield'
}

async function writeStyleImportSnippet({ outputRoot, entryFile }) {
  const snippetPath = path.join(outputRoot, 'STYLE_IMPORT_SNIPPET.md')
  const entryLabel = entryFile ? path.basename(entryFile) : 'your app entry file'
  const content = `# Style Import Snippet

Import the typical page shell styles once in the target project's app entry.

## Import

\`\`\`ts
import '@hiui-design/typical-page-shells/styles.css'
\`\`\`

## Suggested target

- ${entryLabel}
`

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

async function patchStyleImport({ targetRoot, outputRoot }) {
  const resolvedEntryFile = await detectAppEntryFile(targetRoot)
  if (!resolvedEntryFile || !(await pathExists(resolvedEntryFile))) {
    const snippetPath = await writeStyleImportSnippet({ outputRoot, entryFile: '' })
    return { status: 'snippet-only', entryFile: '', snippetPath }
  }

  const raw = await fs.readFile(resolvedEntryFile, 'utf8')
  const importLine = `import '@hiui-design/typical-page-shells/styles.css'`

  if (
    raw.includes(importLine) ||
    raw.includes(`import "@hiui-design/typical-page-shells/styles.css"`)
  ) {
    return { status: 'already-imported', entryFile: resolvedEntryFile, snippetPath: '' }
  }

  const lines = raw.split('\n')
  let insertIndex = 0
  let lastImportIndex = -1

  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim()
    if (trimmed.startsWith('import ')) {
      lastImportIndex = i
      continue
    }

    if (trimmed === '' && lastImportIndex >= 0) {
      insertIndex = i
      break
    }

    if (trimmed !== '') {
      insertIndex = lastImportIndex >= 0 ? lastImportIndex + 1 : 0
      break
    }

    insertIndex = i + 1
  }

  if (lastImportIndex >= 0 && insertIndex === 0) {
    insertIndex = lastImportIndex + 1
  }

  const nextLines = [
    ...lines.slice(0, insertIndex),
    importLine,
    ...lines.slice(insertIndex),
  ]
  await fs.writeFile(resolvedEntryFile, `${nextLines.join('\n')}\n`, 'utf8')

  return { status: 'patched', entryFile: resolvedEntryFile, snippetPath: '' }
}

async function patchGreenfieldRootStyles({ targetRoot, hostProfile }) {
  const supportsStyleReset =
    hostProfile.projectType === 'greenfield' &&
    ['react-vite-router', 'react-vite', 'react-router-custom'].includes(hostProfile.framework)

  if (!supportsStyleReset) {
    return { status: 'not-applied', cssFile: '', detail: '' }
  }

  const cssFile = await detectStarterRootStyleFile(targetRoot)
  if (!cssFile || !(await pathExists(cssFile))) {
    return { status: 'not-detected', cssFile: '', detail: '' }
  }

  const raw = await fs.readFile(cssFile, 'utf8')
  if (raw.includes('hiui-design host-integration root reset')) {
    return { status: 'already-patched', cssFile, detail: '' }
  }

  const hasViteStarterRootConflict =
    /body\s*\{[\s\S]*place-items\s*:\s*center/i.test(raw) ||
    /body\s*\{[\s\S]*display\s*:\s*flex/i.test(raw) ||
    /#root\s*\{[\s\S]*max-width\s*:\s*1280px/i.test(raw) ||
    /#root\s*\{[\s\S]*text-align\s*:\s*center/i.test(raw) ||
    /#root\s*\{[\s\S]*padding\s*:\s*2rem/i.test(raw)

  if (!hasViteStarterRootConflict) {
    return { status: 'not-needed', cssFile, detail: '' }
  }

  const resetBlock = [
    '',
    '/* hiui-design host-integration root reset */',
    ':root {',
    '  font-size: 16px;',
    '}',
    '',
    'html,',
    'body {',
    '  height: 100%;',
    '  min-height: 100%;',
    '}',
    '',
    'body {',
    '  margin: 0;',
    '  min-width: 320px;',
    '  min-height: 100%;',
    '  display: block;',
    '  overflow: hidden;',
    '  place-items: initial;',
    '}',
    '',
    '#root {',
    '  width: 100%;',
    '  height: 100%;',
    '  min-height: 100%;',
    '  max-width: none;',
    '  margin: 0;',
    '  padding: 0;',
    '  overflow: hidden;',
    '  display: flex;',
    '  flex-direction: column;',
    '  text-align: initial;',
    '}',
    '',
  ].join('\n')

  await fs.writeFile(cssFile, `${raw.replace(/\s*$/, '')}${resetBlock}`, 'utf8')
  return {
    status: 'patched',
    cssFile,
    detail: 'appended a root/container reset to neutralize Vite starter centering styles',
  }
}

async function writeBootstrapSummary({
  archetypeAssetCount,
  targetRoot,
  skillRoot,
  hostProfile,
  recommendedMode,
  hostAdapterSnippetPath,
  line,
  manifestPath,
  mode,
  outputRoot,
  legacyHiUi4Deps,
  legacyHostRuntime,
  i18nInitResult,
  projectImagesInitResult,
  packageResult,
  runtimeDelivery,
  styleResult,
  routerEntryResult,
  rootStyleResult,
  routeResult,
  appFrameResult,
  viteResult,
  installResult,
  installRequested,
  installedRootRuntime,
  legacyHiUiEsImports,
  legacyRuntimeGuardIssues,
  syncStatus,
  referencePagesPathLabel,
}) {
  const summaryPath = path.join(outputRoot, 'BOOTSTRAP_SUMMARY.md')
  const projectModePath = path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-mode.json')
  const projectMode = {
    mode,
    source: 'bootstrap',
    recommendedMode,
    framework: hostProfile.framework,
    projectType: hostProfile.projectType,
    runtime: hostProfile.runtime,
    routing: hostProfile.routing,
    confirmedAt: new Date().toISOString(),
    bootstrapSummary: path.relative(targetRoot, summaryPath),
  }
  await ensureDir(path.dirname(summaryPath))
  await ensureDir(path.dirname(projectModePath))
  await fs.writeFile(projectModePath, `${JSON.stringify(projectMode, null, 2)}\n`, 'utf8')
  const legacyHostFamily = await loadLegacyHostFamilyFact({
    targetRoot,
    skillRoot,
    modeOverride: mode,
  })
  const projectCarrierRealization = await loadProjectCarrierRealizationFact({
    targetRoot,
    skillRoot,
    modeOverride: mode,
  })
  const projectTypicalPageSupport = await loadProjectTypicalPageSupportFact({
    targetRoot,
    skillRoot,
    modeOverride: mode,
    legacyHostFamily,
    projectCarrierRealization,
  })
  const legacyDeliveryPolicy = await loadLegacyDeliveryPolicyFact({
    targetRoot,
    skillRoot,
    modeOverride: mode,
    projectTypicalPageSupport,
  })
  const integrationStateResult = await writeProjectIntegrationState({
    targetRoot,
    mode,
    recommendedMode,
    source: 'bootstrap',
    confirmedAt: projectMode.confirmedAt,
    bootstrapSummary: path.relative(targetRoot, summaryPath),
    projectModeFactPath: path.relative(targetRoot, projectModePath),
    hostProfile,
    legacyHostFamilySummary: legacyHostFamily,
    legacyDeliveryPolicySummary: legacyDeliveryPolicy,
    typicalPageSupportSummary: projectTypicalPageSupport,
  })
  const carrierValidation = integrationStateResult.state.carrierValidation
  const legacyBridgeValidation = integrationStateResult.state.legacyBridgeValidation
  const legacyRuntimeReady = integrationStateResult.state.legacyRuntimeReady
  const legacyCarrierReady = integrationStateResult.state.legacyCarrierReady
  const typicalPageSupport = integrationStateResult.state.typicalPageSupport
  const typicalPageSupportReady = typicalPageSupport.status !== 'blocked'
  const lines = [
    '# Typical Page Reuse Bootstrap Summary',
    '',
    '## Result',
    `- project type: ${hostProfile.projectType}`,
    `- detected framework: ${hostProfile.framework}`,
    `- runtime: ${hostProfile.runtime}`,
    `- routing: ${hostProfile.routing}`,
    `- recommended strategy: ${hostProfile.strategy}`,
    `- recommended mode: ${recommendedMode}`,
    `- mode: ${mode}`,
    `- project mode lock: ${path.relative(targetRoot, projectModePath)}`,
    '- project integration state: .local-context/hiui-design/outputs/project-integration-state.json',
    ...(line ? [`- business line: ${line}`] : []),
    `- asset sync: ${syncStatus}`,
    `- package.json: ${packageResult.status}`,
    `- typical-page runtime delivery: ${runtimeDelivery.source}`,
    `- i18n baseline: ${i18nInitResult.status}`,
    `- project image scaffold: ${projectImagesInitResult.status}`,
    `- style import: ${styleResult.status}`,
    `- app entry router: ${routerEntryResult.status}`,
    `- starter root styles: ${rootStyleResult.status}`,
    `- route integration: ${routeResult.status}`,
    `- app frame integration: ${appFrameResult.status}`,
    `- vite schema-types alias: ${viteResult.status}`,
    `- dependency install: ${installRequested ? installResult.status : 'not-requested'}`,
    `- project integration ready: ${integrationStateResult.state.integrationReady ? 'yes' : 'no'}`,
    `- project-certified carrier validation: ${carrierValidation.status}`,
    `- legacy bridge validation: ${legacyBridgeValidation.status}`,
    `- legacy runtime ready: ${
      legacyRuntimeReady === null || legacyRuntimeReady === undefined ? 'not-applicable' : legacyRuntimeReady ? 'yes' : 'no'
    }`,
    `- legacy carrier ready: ${
      legacyCarrierReady === null || legacyCarrierReady === undefined ? 'not-applicable' : legacyCarrierReady ? 'yes' : 'no'
    }`,
    `- page-type delivery policy: ${legacyDeliveryPolicy.status}`,
    `- typical page component support: ${typicalPageSupport.status}`,
  ]

  if (carrierValidation.status !== 'not-applicable') {
    lines.push(
      `- project-certified carriers checked: ${carrierValidation.checkedComponentCount}`,
      `- project-certified carriers blocked: ${carrierValidation.blockedComponentCount}`
    )
  }

  if (legacyBridgeValidation.status !== 'not-applicable') {
    lines.push(
      `- legacy host family status: ${legacyBridgeValidation.hostFamilyStatus}`,
      `- legacy bridge missing facts: ${legacyBridgeValidation.missingFacts.length}`
    )
    if (legacyBridgeValidation.hostFamilyId) {
      lines.push(`- legacy host family: ${legacyBridgeValidation.hostFamilyId}`)
    }
  }

  if (typicalPageSupport.status !== 'not-applicable') {
    lines.push(
      `- component-semantic typical pageTypes ready: ${typicalPageSupport.readyPageTypeIds.length}`,
      `- component-semantic typical pageTypes blocked: ${typicalPageSupport.blockedPageTypeIds.length}`
    )
    if (typicalPageSupport.readyPageTypeIds.length > 0) {
      lines.push(`- ready typical pageTypes: ${typicalPageSupport.readyPageTypeIds.join(', ')}`)
    }
    if (typicalPageSupport.blockedPageTypeIds.length > 0) {
      lines.push(`- blocked typical pageTypes: ${typicalPageSupport.blockedPageTypeIds.join(', ')}`)
    }
  }

  if (legacyDeliveryPolicy.status !== 'not-applicable') {
    lines.push(
      `- carrier-first required pageTypes: ${legacyDeliveryPolicy.carrierFirstRequiredPageTypes.length}`,
      `- direct-standard allowed pageTypes: ${legacyDeliveryPolicy.directStandardAllowedPageTypes.length}`,
      `- page-type delivery policy fact: ${legacyDeliveryPolicy.factPath}`
    )
  }

  if (packageResult.addedDeps.length > 0) {
    lines.push(`- added dependencies: ${packageResult.addedDeps.join(', ')}`)
  }

  if (packageResult.updatedDeps.length > 0) {
    lines.push(`- normalized dependencies: ${packageResult.updatedDeps.join(', ')}`)
  }

  if (packageResult.addedScripts.length > 0) {
    lines.push(`- added scripts: ${packageResult.addedScripts.join(', ')}`)
  }

  if (packageResult.skippedScripts.length > 0) {
    lines.push(`- preserved existing scripts: ${packageResult.skippedScripts.join(', ')}`)
  }

  if (i18nInitResult.generatedPath) {
    lines.push(`- generated translation catalog: ${i18nInitResult.generatedPath}`)
  }

  if (i18nInitResult.locales) {
    lines.push(`- supported locales: ${i18nInitResult.locales}`)
  }

  if (projectImagesInitResult.registryPath) {
    lines.push(`- image registry: ${projectImagesInitResult.registryPath}`)
  }

  if (projectImagesInitResult.assetDir) {
    lines.push(`- image asset dir: ${projectImagesInitResult.assetDir}`)
  }

  if (projectImagesInitResult.syncedImageFiles) {
    lines.push(`- synced default image files: ${projectImagesInitResult.syncedImageFiles}`)
  }

  if (legacyHiUi4Deps.length > 0) {
    lines.push(`- detected legacy visual deps: ${legacyHiUi4Deps.join(', ')}`)
  }

  if (mode === 'legacy-host-compatible') {
    lines.push(`- legacy host runtime reasons: ${legacyHostRuntime.reasons.join('; ')}`)
  }

  if (legacyHiUiEsImports.length > 0) {
    lines.push(`- legacy @hi-ui/hiui/es consumers: ${legacyHiUiEsImports.length}`)
  }

  if (legacyRuntimeGuardIssues.length > 0) {
    lines.push(`- installed root runtime guard: fail`)
  } else if (Object.keys(installedRootRuntime.installedPackages).length > 0) {
    lines.push(`- installed root runtime guard: pass`)
  }

  for (const depName of ['react', 'react-dom', '@hi-ui/hiui']) {
    const info = installedRootRuntime.installedPackages[depName]
    if (!info?.exists) continue
    lines.push(`- installed ${depName}: ${info.installedVersion}`)
  }

  if (hostProfile.existingStructureSummary.length > 0) {
    lines.push(`- existing structure markers: ${hostProfile.existingStructureSummary.join(', ')}`)
  }
  if (hostProfile.adapterDoc) {
    lines.push(`- framework adapter guide: .local-context/hiui-design/${hostProfile.adapterDoc}`)
  }
  if (hostProfile.adapterEntryHints.length > 0) {
    lines.push(`- candidate host entry files: ${hostProfile.adapterEntryHints.join(', ')}`)
  }
  if (hostAdapterSnippetPath) {
    lines.push(`- host adapter snippet: ${hostAdapterSnippetPath}`)
  }

  if (referencePagesPathLabel) {
    lines.push(`- local reference pages: ${referencePagesPathLabel}`)
  }

  if (manifestPath) {
    lines.push(`- manifest: ${manifestPath}`)
  }

  if (styleResult.entryFile) {
    lines.push(`- app entry file: ${styleResult.entryFile}`)
  }

  if (styleResult.snippetPath) {
    lines.push(`- style snippet: ${styleResult.snippetPath}`)
  }

  if (routerEntryResult.entryFile) {
    lines.push(`- app entry file: ${routerEntryResult.entryFile}`)
  }

  if (routerEntryResult.snippetPath) {
    lines.push(`- app entry router snippet: ${routerEntryResult.snippetPath}`)
  }

  if (rootStyleResult.cssFile) {
    lines.push(`- root style file: ${rootStyleResult.cssFile}`)
  }

  if (routeResult.routeFile) {
    lines.push(`- route file: ${routeResult.routeFile}`)
  }

  if (routeResult.snippetPath) {
    lines.push(`- route snippet: ${routeResult.snippetPath}`)
  }

  if (appFrameResult.appFile) {
    lines.push(`- app file: ${appFrameResult.appFile}`)
  }

  if (appFrameResult.snippetPath) {
    lines.push(`- app frame snippet: ${appFrameResult.snippetPath}`)
  }

  if (viteResult.viteFile) {
    lines.push(`- vite config: ${viteResult.viteFile}`)
  }

  if (viteResult.snippetPath) {
    lines.push(`- vite snippet: ${viteResult.snippetPath}`)
  }

  if (installRequested && installResult.command) {
    lines.push(`- install command: ${installResult.command}`)
  }

  if (carrierValidation.status === 'blocked') {
    const blockedComponentIds = carrierValidation.components
      .filter((component) => component.status === 'blocked')
      .map((component) => component.componentId)
    if (blockedComponentIds.length > 0) {
      lines.push(`- blocked project-certified carriers: ${blockedComponentIds.join(', ')}`)
    }
  }

  lines.push('', '## Next steps')
  lines.push(`- Host profile: ${hostProfile.reason}`)

  if (installRequested && installResult.status === 'failed') {
    lines.push(`- Re-run \`${installResult.command}\` in the target project. Failure detail: ${installResult.message}`)
  } else if (legacyRuntimeGuardIssues.length > 0) {
    lines.push(
      `- Installed root runtime drift was detected. Do not generate business pages yet. Repair node_modules so the host root stays on its declared legacy runtime and keep HiUI5 limited to the explicit alias lane.`
    )
    if (legacyHiUiEsImports.length > 0) {
      lines.push(
        `- Current source still imports @hi-ui/hiui/es* (${legacyHiUiEsImports.length} files). Examples: ${summarizeLegacyImportHits(targetRoot, legacyHiUiEsImports)}`
      )
    }
  } else if (mode === 'legacy-host-compatible') {
    lines.push('- This host was detected as a legacy compatibility runtime. The legacy host main tree was not auto-patched into a generic `@hiui-design/typical-page-shells` host-integration runtime; ordinary typical pages should instead follow the planner-selected carrier / runtimeAdapterProof path.')
  } else if (!installRequested) {
    lines.push('- Run your target project package manager install command after reviewing package.json changes.')
  }

  if (legacyBridgeValidation.status === 'blocked') {
    lines.push('- Legacy bridge readiness is blocked. Repair the legacy host family facts and runtime bridge evidence before treating this project as an integrated legacy typical-page host.')
    if (legacyBridgeValidation.blockingReasons.length > 0) {
      lines.push(`- Legacy bridge blocking reasons: ${legacyBridgeValidation.blockingReasons.join('; ')}`)
    }
  }

  if (carrierValidation.status === 'blocked') {
    if (mode === 'legacy-host-compatible') {
      lines.push('- Project integration is not ready because one or more legacy project-certified carriers do not resolve to real source files or exports yet.')
      lines.push('- Repair the shared carrier layer first so legacy planner contracts can reuse verified project bridge assets instead of deferring carrier debt to business-page generation.')
    } else if (typicalPageSupportReady) {
      lines.push('- Project-certified carrier debt was found, but component-semantic typical page support is already ready. Supported typical pages can still generate through page-component + slot-fill, preferring project carriers when ready and falling back to direct standard components otherwise.')
      lines.push('- Repair the blocked project-certified carriers to restore carrier-first delivery for the affected pageTypes, but do not patch an individual business page just to compensate for shared carrier debt.')
    } else {
      lines.push('- Project-certified carrier diagnostics and page-component asset support are both blocked. This does not invalidate modern-mode onboarding by itself, but it does mean the affected typical pageTypes cannot currently enter the page-component + slot-fill path.')
      lines.push('- Read `.local-context/hiui-design/outputs/project-integration-state.json` for carrier diagnostics and the typical page support summary before repairing shared assets.')
    }
  }

  if (typicalPageSupport.status === 'blocked') {
    const blockedPageTypes = typicalPageSupport.pageTypes
      .filter((pageType) => pageType.supportStatus === 'blocked')
      .map((pageType) => pageType.pageTypeId)
    if (blockedPageTypes.length > 0) {
      lines.push(`- Fix the blocked component-semantic typical pageTypes before generating business pages: ${blockedPageTypes.join(', ')}`)
    }
  }

  if (legacyHiUi4Deps.length > 0) {
    lines.push('- Clear the legacy visual dependencies above before installing the typical-page dependency set; keep schema 4.x packages only when they belong to the current schema ecosystem.')
  }

  if (styleResult.status === 'snippet-only' && styleResult.snippetPath) {
    lines.push(`- Add the manual style import from \`${styleResult.snippetPath}\` to your app entry before opening the example pages.`)
  }

  if (routerEntryResult.status === 'snippet-only' && routerEntryResult.snippetPath) {
    lines.push(`- Apply the app entry router snippet in \`${routerEntryResult.snippetPath}\` so BrowserRouter wraps the root app render.`)
  }

  if (routeResult.status === 'snippet-only' && routeResult.snippetPath) {
    lines.push(`- Apply the manual route snippet in \`${routeResult.snippetPath}\`.`)
  }

  if (routeResult.status === 'guarded (existing-system)' && routeResult.snippetPath) {
    lines.push(`- Auto route patch was intentionally skipped for the existing host. Review \`${routeResult.snippetPath}\` before wiring any smoke route manually.`)
  }

  if (appFrameResult.status === 'snippet-only' && appFrameResult.snippetPath) {
    lines.push(`- Apply the manual app frame snippet in \`${appFrameResult.snippetPath}\` so greenfield example pages render inside a navigation shell.`)
  }

  if (viteResult.status === 'snippet-only' && viteResult.snippetPath) {
    lines.push(`- Apply the Vite alias snippet in \`${viteResult.snippetPath}\` before running dev/build commands.`)
  }

  if (packageResult.addedScripts.includes('typical-page:apply') || packageResult.status !== 'missing') {
    lines.push('- Re-run the default reference-only installation later with `pnpm typical-page:apply`, `npm run typical-page:apply`, or the equivalent package-manager script command. It will auto-resolve to `rules-only` or `legacy-host-compatible` based on the host runtime.')
  }
  if (packageResult.addedScripts.includes('typical-page:designer-setup') || packageResult.status !== 'missing') {
    lines.push('- For non-technical designers, prefer `pnpm typical-page:designer-setup` or `npm run typical-page:designer-setup`; that entry now auto-runs doctor and stops on hard failures.')
  }
  if (packageResult.addedScripts.includes('typical-page:i18n:init') || packageResult.status !== 'missing') {
    lines.push('- The target project already received the default locale resources, formatter bridge, and RTL baseline during bootstrap. Re-run `pnpm typical-page:i18n:init` or `npm run typical-page:i18n:init` only when you want to resync locale files or refresh the wrapper template.')
  }
  if (packageResult.addedScripts.includes('typical-page:images:init') || packageResult.status !== 'missing') {
    lines.push('- The target project already received the project image catalog scaffold during bootstrap. Re-run `pnpm typical-page:images:init` or `npm run typical-page:images:init` only when you want to refresh the scaffold or seed a fresh project.')
  }

  if (mode === 'host-integration') {
    lines.push('- 接入阶段的 mode 已写入 project mode lock；后续页面生成默认读取并确认该 mode，不再重新判定接入模式。')
    lines.push('- 页面生成前先运行 `pnpm typical-page:plan-page-task -- --json ...` 或 `npm run typical-page:plan-page-task -- --json ...` 获取机器计划；不要从父级工作区或 skill 源码目录手工拼流程。')
    lines.push('- 接入阶段 doctor 已作为安装门槛；只有手工改宿主、依赖、路由或样式入口后，才需要重新执行 `pnpm typical-page:doctor` 或 `npm run typical-page:doctor`。')
    lines.push(`- Review \`${path.join(outputRoot, 'SMOKE_REPORT.md')}\` and open the listed smoke pages before generating business pages.`)
    lines.push('- If the synced smoke/gallery assets drift behind the source-of-truth examples, refresh them with `pnpm typical-page:apply:host-assets:force` or `npm run typical-page:apply:host-assets:force`.')
    lines.push('- 槽位型典型页默认复制最接近的 `src/typical-page-reuse/pages/*` / reference 示例并只替换业务槽位。')
    lines.push('- 快速链路完成口径是当前页可预览、当前页 preflight 通过、lint / build 结果可解释；正式验收 / 发布时才追加 source-gate、doctor 与 finalize-page。')
  } else {
    lines.push('- No route gallery or host bridge files were wired into the target project source tree.')
    lines.push(`- A reference-only typical-page baseline was synced to \`${referencePagesPathLabel}\`. It is for generation guidance only, not for production routes or host bridging.`)
    lines.push(`- Archetype assets were synced to \`.local-context/hiui-design/archetypes\` and the current-mode template set. Copied files: ${archetypeAssetCount}.`)
    lines.push('- Generate new business pages directly under the target project’s existing structure; do not create `src/typical-page-reuse/*` unless you explicitly need host-integration mode.')
    lines.push(
      mode === 'legacy-host-compatible'
        ? '- When generating a page in this host, read `.local-context/hiui-design/rules/generation-rules.md`, then `rules/page-type-map.md`, then `docs/generation/legacy-host-compatibility.md`, then `docs/generation/figma-page-rules.md`, then the matched `docs/generation/figma-pages/*.md` chapter.'
        : '- When generating a page, first read `.local-context/hiui-design/rules/generation-rules.md`, then `rules/page-type-map.md`, then `docs/generation/figma-page-rules.md`, then the matched `docs/generation/figma-pages/*.md` chapter.'
    )
    lines.push('- 接入阶段的 mode 已写入 project mode lock；后续页面生成默认读取并确认该 mode，不再重新判定接入模式。')
    lines.push('- Before generating a page, run `pnpm typical-page:select-archetype -- --page-type <id>` or the npm equivalent to lock the packaged example, mode template, and required regions/ownership contract.')
    lines.push('- Then plan the page with `pnpm typical-page:plan-page-task -- --page-type <id> --page <generated-page-path> --json`, and start the managed page with `pnpm typical-page:start-page -- --page-type <id> --page <generated-page-path>` so the file is born with source markers, root data attributes, and a started contract.')
    lines.push(`- Use \`${referencePagesPathLabel}\` as the default local reference template set. If that directory is removed manually, fall back to \`.local-context/hiui-design/examples/host-integration/src/pages/*\`.`)
    lines.push('- Before visual/detail polish, run `pnpm typical-page:preflight -- --page <generated-page-path>` so placeholder mappings, source marker gaps, and transitive import contamination fail early.')
    lines.push('- 快速链路完成口径是当前页可预览、当前页 preflight 通过、lint / build 结果可解释；正式验收 / 发布、结构修复或 ownership / marker 变化时才执行 `typical-page:finalize-page`。')
    lines.push(
      mode === 'legacy-host-compatible'
        ? '- In legacy-host-compatible (legacy host bridge) mode, do not treat the legacy host main tree as a generic direct mount for `@hiui-design/typical-page-shells`. Ordinary typical pages may still use planner-selected page components through a project-certified carrier or runtimeAdapterProof-backed standard component; only ad hoc host-integration-style shell imports remain out of bounds for the legacy main tree. If you later isolate a dedicated modern runtime entry, re-evaluate standard shell imports there instead of in the host main tree.'
        : '- If the generated page imports `@hiui-design/typical-page-shells`, then add `@hiui-design/typical-page-shells/styles.css` and the Vite `@hi-ui/schema-types` alias in the target project.'
    )
    lines.push('- Only when you explicitly want a baseline gallery and host bridge demo, run `pnpm typical-page:apply:host-assets` or `npm run typical-page:apply:host-assets`.')
    lines.push('- 接入阶段 doctor 已作为安装门槛；只有手工改宿主、依赖、路由或样式入口后，才需要重新执行 `pnpm typical-page:doctor` 或 `npm run typical-page:doctor`。')
  }
  lines.push('')

  await fs.writeFile(summaryPath, `${lines.join('\n')}\n`, 'utf8')
  return { summaryPath, integrationStateResult }
}

function runSyncScript({ skillRoot, targetRoot, dest, force, line = '', syncMode = 'host-integration' }) {
  const syncScriptPath = path.join(skillRoot, 'scripts', 'sync-host-integration.mjs')
  const args = [syncScriptPath, '--target', targetRoot, '--dest', dest, '--mode', syncMode]
  if (line) args.push('--line', line)
  if (force) args.push('--force')

  const result = spawnSync(process.execPath, args, {
    cwd: skillRoot,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || 'sync-host-integration.mjs failed')
  }

  return result.stdout?.trim() ?? ''
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const targetRoot = path.resolve(options.target)
    const { manifestPath, lineId } = await loadPageTypeManifest({
      skillRoot,
      line: options.line,
    })
    const hostProfile = await detectHostProfile(targetRoot, {
      ignoreRelativePaths: [options.dest],
    })
    const shellPackage = await loadLocalShellPackage(skillRoot)
    const runtimeDeliveryPolicy = await loadRuntimeDeliveryPolicy(skillRoot)
    const originalTargetPkg = await readTargetPackageJson(targetRoot)
    const legacyHiUi4Deps = detectLegacyHiUi4VisualDeps(originalTargetPkg)
    const legacyHostRuntime = await detectLegacyHostRuntimeMode({
      targetRoot,
      pkg: originalTargetPkg,
    })
    const legacyHiUiEsImports = await collectLegacyHiUiEsImports(path.join(targetRoot, 'src'))
    const installedRootRuntime = originalTargetPkg
      ? await inspectInstalledRootRuntime({
          targetRoot,
          pkg: originalTargetPkg,
        })
      : { installedPackages: {}, driftItems: [] }
    const legacyRuntimeGuardIssues = buildLegacyRuntimeGuardIssues({
      legacyHostRuntime,
      installedRootRuntime,
      legacyHiUiEsImports,
    })
    const runtimeDelivery = await resolveManagedShellsSpec({
      explicitShellsSpec: options.shellsSpec,
      runtimeDeliveryPolicy,
      shellPackage,
      skillRoot,
    })
    const shellsSpec = runtimeDelivery.shellsSpec
    const recommendedMode = getRecommendedMode({
      hostProfile,
      legacyHostRuntime,
    })
    const mode = resolveInstallMode({
      requestedMode: options.mode,
      hostProfile,
      legacyHostRuntime,
    })

    if (!(await pathExists(targetRoot))) {
      throw new Error(`Target project root does not exist: ${targetRoot}`)
    }

    if (legacyHostRuntime.incompatible && options.mode === 'host-integration') {
      console.warn(
        `Detected a legacy host-compatible runtime. Downgrading install mode from host-integration to legacy-host-compatible: ${legacyHostRuntime.reasons.join(
          '; '
        )}`
      )
    }

    const resolvedOutputRoot =
      mode === 'host-integration'
        ? path.join(targetRoot, options.dest)
        : path.join(targetRoot, '.local-context', 'hiui-design', 'outputs')

    const hostIntegrationDependencies =
      mode === 'host-integration'
        ? await loadHostIntegrationDependencies(skillRoot, shellPackage.peerDependencies ?? {}, lineId)
        : {}

    const syncConfig =
      mode === 'host-integration'
        ? {
            dest: options.dest,
            status: 'completed',
            mode: 'host-integration',
            referencePagesPathLabel: 'src/typical-page-reuse/pages/*',
          }
        : {
            dest: RULES_ONLY_REFERENCE_DEST,
            status: 'completed (reference-only)',
            mode: 'reference-only',
            referencePagesPathLabel: RULES_ONLY_REFERENCE_PAGES_GLOB,
          }

    const syncOutput = runSyncScript({
      skillRoot,
      targetRoot,
      dest: syncConfig.dest,
      force: options.force,
      line: lineId,
      syncMode: syncConfig.mode,
    })
    const archetypeSyncResult = await syncArchetypeAssets({
      skillRoot,
      targetRoot,
      mode,
      force: options.force,
    })

    const packageResult = await patchPackageJson({
      targetRoot,
      shellsSpec,
      peerDependencies: shellPackage.peerDependencies ?? {},
      directDependencies: hostIntegrationDependencies,
      line: lineId,
      legacyCompatibilityOnly: mode === 'legacy-host-compatible',
    })
    const i18nInitResult = shouldSkipI18nInitForMode(options, mode)
      ? skippedI18nInitResult({ explicitSkip: options.i18nInitExplicitlySkipped })
      : runI18nInit({ skillRoot, targetRoot })
    const projectImagesInitResult = options.skipProjectImagesInit
      ? {
          status: 'skipped (--skip-project-images-init)',
          command: '',
          registryPath: '',
          assetDir: '',
          syncedImageFiles: '',
          seededFiles: '',
          preservedFiles: '',
        }
      : runProjectImagesInit({ skillRoot, targetRoot })

    const styleResult =
      mode === 'host-integration'
        ? await patchStyleImport({
            targetRoot,
            outputRoot: resolvedOutputRoot,
          })
        : mode === 'legacy-host-compatible'
          ? { status: 'skipped (legacy-host-compatibility)', entryFile: '', snippetPath: '' }
          : { status: 'not-applied (rules-only)', entryFile: '', snippetPath: '' }

    const routerEntryResult =
      mode === 'host-integration'
        ? await patchGreenfieldRouterEntry({
            targetRoot,
            outputRoot: resolvedOutputRoot,
            hostProfile,
          })
        : mode === 'legacy-host-compatible'
          ? { status: 'skipped (legacy-host-compatibility)', entryFile: '', snippetPath: '', detail: '' }
          : { status: 'not-applied (rules-only)', entryFile: '', snippetPath: '', detail: '' }

    const rootStyleResult =
      mode === 'host-integration'
        ? await patchGreenfieldRootStyles({
            targetRoot,
            hostProfile,
          })
        : mode === 'legacy-host-compatible'
          ? { status: 'skipped (legacy-host-compatibility)', cssFile: '', detail: '' }
          : { status: 'not-applied (rules-only)', cssFile: '', detail: '' }

    let routeResult =
      mode === 'host-integration'
        ? shouldAutoMountHostIntegrationRoutes(hostProfile)
          ? await patchRouteFile({
              targetRoot,
              routeFile: options.routeFile,
              outputRoot: resolvedOutputRoot,
            })
          : {
              status: 'guarded (existing-system)',
              routeFile: await detectRouteFile(targetRoot),
              snippetPath: await writeRouteGuardNote({
                targetRoot,
                routeFile: options.routeFile
                  ? path.resolve(targetRoot, options.routeFile)
                  : await detectRouteFile(targetRoot),
                outputRoot: resolvedOutputRoot,
              }),
            }
        : mode === 'legacy-host-compatible'
          ? { status: 'skipped (legacy-host-compatibility)', routeFile: '', snippetPath: '' }
          : { status: 'not-applied (rules-only)', routeFile: '', snippetPath: '' }

    const appFrameResult =
      mode === 'host-integration'
        ? shouldAutoMountHostIntegrationRoutes(hostProfile)
          ? await patchGreenfieldAppFrame({
              targetRoot,
              outputRoot: resolvedOutputRoot,
              hostProfile,
            })
          : { status: 'not-applied (existing-system)', appFile: '', snippetPath: '' }
        : mode === 'legacy-host-compatible'
          ? { status: 'skipped (legacy-host-compatibility)', appFile: '', snippetPath: '', routeHandledInApp: false, detail: '' }
        : { status: 'not-applied (rules-only)', appFile: '', snippetPath: '', routeHandledInApp: false, detail: '' }

    if (routeResult.status === 'snippet-only' && appFrameResult.routeHandledInApp) {
      if (routeResult.snippetPath) {
        await fs.rm(routeResult.snippetPath, { force: true })
      }
      routeResult = {
        status: 'mounted-in-app',
        routeFile: appFrameResult.appFile,
        snippetPath: '',
      }
    }

    const viteResult =
      mode === 'host-integration'
        ? await patchViteSchemaTypesAlias({
            targetRoot,
            outputRoot: resolvedOutputRoot,
          })
        : mode === 'legacy-host-compatible'
          ? { status: 'skipped (legacy-host-compatibility)', viteFile: '', snippetPath: '' }
          : { status: 'not-applied (rules-only)', viteFile: '', snippetPath: '' }

    const installResult = options.install && mode !== 'legacy-host-compatible'
      ? await runInstall({ targetRoot, timeoutMs: options.installTimeoutMs })
      : mode === 'legacy-host-compatible'
        ? { status: 'skipped (legacy-host-compatibility)', command: '', message: '' }
        : { status: 'not-requested', command: '', message: '' }
    const { snippetPath: hostAdapterSnippetPath } = await writeHostAdapterSnippet({
      outputRoot: resolvedOutputRoot,
      hostProfile,
      recommendedModeOverride: recommendedMode,
    })

    const { summaryPath, integrationStateResult } = await writeBootstrapSummary({
      archetypeAssetCount: archetypeSyncResult.copiedFiles.length,
      targetRoot,
      skillRoot,
      hostProfile,
      recommendedMode,
      hostAdapterSnippetPath,
      line: lineId,
      manifestPath,
      mode,
      outputRoot: resolvedOutputRoot,
      legacyHiUi4Deps,
      legacyHostRuntime,
      i18nInitResult,
      projectImagesInitResult,
      packageResult,
      runtimeDelivery,
      styleResult,
      routerEntryResult,
      rootStyleResult,
      routeResult,
      appFrameResult,
      viteResult,
      installResult,
      installRequested: options.install,
      installedRootRuntime,
      legacyHiUiEsImports,
      legacyRuntimeGuardIssues,
      syncStatus: syncConfig.status,
      referencePagesPathLabel: syncConfig.referencePagesPathLabel,
    })

    console.log(syncOutput)
    console.log('')
    console.log('Bootstrap summary:')
    console.log(`- detected project type: ${hostProfile.projectType}`)
    console.log(`- detected framework: ${hostProfile.framework}`)
    console.log(`- recommended mode: ${recommendedMode}`)
    console.log(`- chosen mode: ${mode}`)
    if (mode === 'legacy-host-compatible') {
      console.log(`  reason: ${legacyHostRuntime.reasons.join('; ')}`)
    }
    if (legacyHiUiEsImports.length > 0) {
      console.log(`- legacy @hi-ui/hiui/es consumers: ${legacyHiUiEsImports.length}`)
    }
    if (legacyRuntimeGuardIssues.length > 0) {
      console.log(`- installed root runtime guard: FAIL`)
      for (const issue of legacyRuntimeGuardIssues) {
        console.log(`  ${issue.detail}`)
      }
    }
    if (hostProfile.adapterDoc) {
      console.log(`- framework adapter guide: .local-context/hiui-design/${hostProfile.adapterDoc}`)
    }
    if (hostProfile.adapterEntryHints.length > 0) {
      console.log(`- candidate host entry files: ${hostProfile.adapterEntryHints.join(', ')}`)
    }
    console.log(`- host adapter snippet: ${hostAdapterSnippetPath}`)
    console.log(`- package.json: ${packageResult.status}`)
    console.log(`- i18n baseline: ${i18nInitResult.status}`)
    console.log(`- project image scaffold: ${projectImagesInitResult.status}`)
    if (i18nInitResult.generatedPath) {
      console.log(`  generated catalog: ${i18nInitResult.generatedPath}`)
    }
    if (i18nInitResult.locales) {
      console.log(`  locales: ${i18nInitResult.locales}`)
    }
    if (projectImagesInitResult.registryPath) {
      console.log(`  registry: ${projectImagesInitResult.registryPath}`)
    }
    if (projectImagesInitResult.assetDir) {
      console.log(`  asset dir: ${projectImagesInitResult.assetDir}`)
    }
    if (projectImagesInitResult.syncedImageFiles) {
      console.log(`  synced image files: ${projectImagesInitResult.syncedImageFiles}`)
    }
    if (packageResult.addedDeps.length > 0) {
      console.log(`  added deps: ${packageResult.addedDeps.join(', ')}`)
    }
    if (packageResult.updatedDeps.length > 0) {
      console.log(`  normalized deps: ${packageResult.updatedDeps.join(', ')}`)
    }
    if (packageResult.addedScripts.length > 0) {
      console.log(`  added scripts: ${packageResult.addedScripts.join(', ')}`)
    }
    if (packageResult.skippedScripts.length > 0) {
      console.log(`  preserved existing scripts: ${packageResult.skippedScripts.join(', ')}`)
    }
    if (legacyHiUi4Deps.length > 0) {
      console.log(`  legacy visual deps: ${legacyHiUi4Deps.join(', ')}`)
    }
    console.log(`- style import: ${styleResult.status}`)
    if (styleResult.entryFile) {
      console.log(`  entry file: ${styleResult.entryFile}`)
    }
    if (styleResult.snippetPath) {
      console.log(`  snippet: ${styleResult.snippetPath}`)
    }
    console.log(`- app entry router: ${routerEntryResult.status}`)
    if (routerEntryResult.entryFile) {
      console.log(`  entry file: ${routerEntryResult.entryFile}`)
    }
    if (routerEntryResult.snippetPath) {
      console.log(`  snippet: ${routerEntryResult.snippetPath}`)
    }
    console.log(`- starter root styles: ${rootStyleResult.status}`)
    if (rootStyleResult.cssFile) {
      console.log(`  css file: ${rootStyleResult.cssFile}`)
    }
    console.log(`- route integration: ${routeResult.status}`)
    if (routeResult.routeFile) {
      console.log(`  route file: ${routeResult.routeFile}`)
    }
    if (routeResult.snippetPath) {
      console.log(`  snippet: ${routeResult.snippetPath}`)
    }
    console.log(`- app frame integration: ${appFrameResult.status}`)
    if (appFrameResult.appFile) {
      console.log(`  app file: ${appFrameResult.appFile}`)
    }
    if (appFrameResult.snippetPath) {
      console.log(`  snippet: ${appFrameResult.snippetPath}`)
    }
    console.log(`- vite schema-types alias: ${viteResult.status}`)
    if (viteResult.viteFile) {
      console.log(`  vite file: ${viteResult.viteFile}`)
    }
    if (viteResult.snippetPath) {
      console.log(`  snippet: ${viteResult.snippetPath}`)
    }
    console.log(`- dependency install: ${options.install ? installResult.status : 'not-requested'}`)
    if (options.install && installResult.command) {
      console.log(`  command: ${installResult.command}`)
    }
    if (options.install && installResult.message) {
      console.log(`  detail: ${installResult.message}`)
    }
    console.log(`- typical-page runtime delivery: ${runtimeDelivery.source}`)
    console.log(`- summary file: ${summaryPath}`)

    const typicalPageSupport = integrationStateResult.state.typicalPageSupport || {
      status: 'not-applicable',
      pageTypes: [],
    }
    const typicalPageSupportReady = typicalPageSupport.status !== 'blocked'

    if (integrationStateResult.state.integrationReady === false) {
      const carrierValidation = integrationStateResult.state.carrierValidation
      const legacyBridgeValidation = integrationStateResult.state.legacyBridgeValidation || {
        status: 'not-applicable',
      }
      const firstReasons = Array.isArray(integrationStateResult.state.blockingReasons)
        ? integrationStateResult.state.blockingReasons.slice(0, 5)
        : []
      console.error('- project integration ready: no')
      console.error(
        `- project-certified carrier validation: ${carrierValidation.status} (${carrierValidation.blockedComponentCount}/${carrierValidation.checkedComponentCount} blocked)`
      )
      console.error(`- legacy bridge validation: ${legacyBridgeValidation.status}`)
      console.error(`- typical page component support: ${typicalPageSupport.status}`)
      for (const reason of firstReasons) {
        console.error(`  - ${reason}`)
      }
      const totalReasons = (integrationStateResult.state.blockingReasons || []).length
      if (totalReasons > firstReasons.length) {
        console.error(
          `  - ... ${totalReasons - firstReasons.length} more blocking reason(s); see .local-context/hiui-design/outputs/project-integration-state.json`
        )
      }
      throw new BootstrapValidationError(
        'project integration is incomplete: repair project-level integration or legacy bridge facts before generating pages'
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (error instanceof BootstrapValidationError) {
      console.error(`bootstrap-target-project blocked: ${message}`)
    } else {
      console.error(`bootstrap-target-project failed: ${message}`)
      printUsage()
    }
    process.exit(1)
  }
}

await main()
