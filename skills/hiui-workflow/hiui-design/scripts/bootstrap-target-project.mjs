#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { syncArchetypeAssets } from './lib/archetypes/sync-archetype-assets.mjs'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { upsertHiuiGitignoreBoundary } from './lib/gitignore-boundary.mjs'
import { writeHostAdapterSnippet } from './lib/host-adapter-advice.mjs'
import { getLightFlowFeatureFlags } from './lib/light-flow-feature-flags.mjs'
import {
  assertInstallModePolicyAllowed,
  resolveInstallModePolicy,
} from './lib/install-mode-policy.mjs'
import { detectLegacyHostFamily } from './lib/legacy-host-family-registry.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { writeProjectIntegrationState } from './lib/project-integration-state.mjs'
import { RULES_ONLY_REFERENCE_DEST, RULES_ONLY_REFERENCE_PAGES_GLOB } from './lib/reference-assets.mjs'
import { getReusableScripts } from './lib/reusable-script-entries.mjs'
import {
  checkSyncProfileContract,
  findSyncProfileContract,
  loadSyncProfileContracts,
} from './lib/sync-profile-contract.mjs'
import {
  buildLegacyRuntimeGuardIssues,
  collectLegacyHiUiEsImports,
  inspectInstalledRootRuntime,
  parseLeadingMajorVersion,
  summarizeLegacyImportHits,
} from './lib/legacy-runtime-guard.mjs'
import { isSpecBelowMajor, isVersionRangeAtLeast } from './lib/semver-range-compat.mjs'

const RETIRED_LEGACY_SCRIPT_NAMES = [
  'typical-page:start-page',
  'typical-page:write-contract',
  'typical-page:finalize-page',
  'typical-page:select-archetype',
]

const DEFAULT_INSTALL_TIMEOUT_MS = 300000

function printUsage() {
  console.log(`Usage:
  node scripts/bootstrap-target-project.mjs --target <project-root> [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--line <line-id>] [--host-pack <id>] [--with-host-assets] [--dest <relative-dir>] [--route-file <relative-file>] [--shells-spec <version>] [--sync-profile <minimal|workbench>] [--include-workbench] [--install] [--no-install] [--install-timeout-ms <ms>] [--force] [--allow-mode-override --override-reason <reason>] [--skip-i18n-init] [--skip-project-images-init] [--json]

Options:
  --target      Target project root. Required.
  --mode        Install mode. Default: auto
  --line        Optional business-line overlay id. Example: retail
  --host-pack   Optional legacy host pack id for legacy-host-compatible init. Example: asp-fwt-common-front
  --with-host-assets  Alias of --mode host-integration
  --dest        Relative output directory inside target project for host-integration mode. Default: src/typical-page-reuse
  --route-file  Target route config file to patch. Optional. If omitted, common locations are probed.
	  --shells-spec Dependency version/range for @hiui-design/typical-page-shells. Default: ^<local-version>
  --sync-profile Project-local hiui-design asset profile. Default: minimal
  --include-workbench Alias of --sync-profile workbench for maintainers that need docs/examples/tests locally.
	  --install     Run the target project's package manager install command after patching package.json. legacy-host-compatible installs by default unless --no-install is passed.
  --no-install  Skip dependency install, including the legacy-host-compatible default install.
  --install-timeout-ms  Timeout for dependency install command. Default: 300000
  --force       Overwrite synced asset files in host-integration mode.
  --allow-mode-override  Allow an otherwise blocked mode mismatch. Requires --override-reason.
  --override-reason      Non-empty audit reason for --allow-mode-override.
  --skip-i18n-init  Skip automatic src/translation baseline provisioning.
  --skip-project-images-init  Skip automatic src/typical-page-reuse/assets project image catalog scaffold provisioning.
  --json        Emit a machine-readable bootstrap result instead of human text.
	`)
}

function parseArgs(argv) {
  const lightFlowFlags = getLightFlowFeatureFlags()
  const options = {
    dest: 'src/typical-page-reuse',
    force: false,
    install: false,
    installTimeoutMs: DEFAULT_INSTALL_TIMEOUT_MS,
    json: false,
    line: '',
    mode: 'auto',
    routeFile: '',
    hostPack: '',
    shellsSpec: '',
    skipI18nInit: false,
    skipProjectImagesInit: false,
    target: '',
	    noInstall: false,
    allowModeOverride: false,
    overrideReason: '',
	    syncProfile: lightFlowFlags.syncProfile,
	  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--force') {
      options.force = true
      continue
    }

    if (arg === '--install') {
      options.install = true
      options.noInstall = false
      continue
    }

    if (arg === '--no-install') {
      options.install = false
      options.noInstall = true
      continue
    }

    if (arg === '--skip-i18n-init') {
      options.skipI18nInit = true
      continue
    }

    if (arg === '--skip-project-images-init') {
      options.skipProjectImagesInit = true
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

	    if (arg === '--include-workbench') {
	      options.syncProfile = 'workbench'
	      continue
	    }

    if (arg === '--allow-mode-override') {
      options.allowModeOverride = true
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
      arg === '--host-pack' ||
	      arg === '--route-file' ||
	      arg === '--shells-spec' ||
	      arg === '--sync-profile' ||
	      arg === '--override-reason' ||
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
          : arg === '--host-pack'
            ? 'hostPack'
          : arg === '--route-file'
            ? 'routeFile'
	          : arg === '--shells-spec'
	            ? 'shellsSpec'
		          : arg === '--sync-profile'
		            ? 'syncProfile'
		            : arg === '--override-reason'
		              ? 'overrideReason'
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

  if (!['minimal', 'workbench'].includes(options.syncProfile)) {
    throw new Error('Expected --sync-profile to be minimal or workbench')
  }

	  if (!Number.isFinite(options.installTimeoutMs) || options.installTimeoutMs <= 0) {
	    throw new Error('Expected --install-timeout-ms to be a positive number')
	  }

  if (options.allowModeOverride && !String(options.overrideReason || '').trim()) {
    throw new Error('Expected --override-reason to be a non-empty audit reason when --allow-mode-override is used')
  }

  if (!options.allowModeOverride && String(options.overrideReason || '').trim()) {
    throw new Error('Unexpected --override-reason without --allow-mode-override')
  }

	  return options
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

function upsertManagedDependency({
  dependencies,
  devDependencies,
  peerDeps,
  depName,
  depVersion,
  preferredBucket = 'dependencies',
  keepExistingWhen = null,
}) {
  if (Object.prototype.hasOwnProperty.call(dependencies, depName)) {
    const previous = dependencies[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }
    if (keepExistingWhen?.(depName, previous, depVersion)) return { action: 'unchanged', previous }
    dependencies[depName] = depVersion
    return { action: 'updated', previous }
  }

  if (Object.prototype.hasOwnProperty.call(devDependencies, depName)) {
    const previous = devDependencies[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }
    if (keepExistingWhen?.(depName, previous, depVersion)) return { action: 'unchanged', previous }
    devDependencies[depName] = depVersion
    return { action: 'updated', previous }
  }

  if (Object.prototype.hasOwnProperty.call(peerDeps, depName)) {
    const previous = peerDeps[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }
    if (keepExistingWhen?.(depName, previous, depVersion)) return { action: 'unchanged', previous }
    peerDeps[depName] = depVersion
    return { action: 'updated', previous }
  }

  if (preferredBucket === 'devDependencies') {
    devDependencies[depName] = depVersion
    return { action: 'added', previous: '' }
  }

  if (preferredBucket === 'peerDependencies') {
    peerDeps[depName] = depVersion
    return { action: 'added', previous: '' }
  }

  dependencies[depName] = depVersion
  return { action: 'added', previous: '' }
}

async function loadLocalShellPackage(skillRoot) {
  const embeddedPackageJsonPath = path.join(skillRoot, 'vendor', 'typical-page-shells-package.json')
  const fallbackPackageJsonPath = path.resolve(skillRoot, '..', '..', 'packages', 'typical-page-shells', 'package.json')
  const packageJsonPath = (await pathExists(embeddedPackageJsonPath))
    ? embeddedPackageJsonPath
    : fallbackPackageJsonPath
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

function findDeclaredDependency(pkg, depName) {
  return String(
    pkg?.dependencies?.[depName] ||
      pkg?.devDependencies?.[depName] ||
      pkg?.peerDependencies?.[depName] ||
      ''
  ).trim()
}

async function resolveLegacyShellsSpec({ skillRoot, shellPackage, targetPkg, fallbackSpec }) {
  const reactSpec = findDeclaredDependency(targetPkg, 'react')
  const modernReactSpec = String(shellPackage?.peerDependencies?.react || '').trim()
  const legacyCompatibility = shellPackage?.legacyCompatibility || {}
  const legacyReactSpec = String(legacyCompatibility.targetReactRange || '>=16.8.0').trim()
  const legacyVendoredTarball = String(legacyCompatibility.legacyVendoredTarball || '').trim()

  if (reactSpec && modernReactSpec && isVersionRangeAtLeast(reactSpec, modernReactSpec)) {
    return fallbackSpec
  }

  if (
    legacyVendoredTarball &&
    (!reactSpec || isVersionRangeAtLeast(reactSpec, legacyReactSpec)) &&
    (await pathExists(path.join(skillRoot, legacyVendoredTarball)))
  ) {
    return `file:.local-context/hiui-design/vendor/${path.basename(legacyVendoredTarball)}`
  }

  return fallbackSpec
}

async function readJsonFile(jsonPath) {
  const raw = await fs.readFile(jsonPath, 'utf8')
  return JSON.parse(raw)
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

function resolveLegacyCarrierRuntimeDependencies({
  dependencies,
  devDependencies,
  peerDeps,
  shellPeerDependencies,
}) {
  const hiui5AliasSpec =
    String(dependencies.hiui5 || devDependencies.hiui5 || peerDeps.hiui5 || '').trim()
  if (hiui5AliasSpec) {
    return {}
  }

  const existingHiuiRuntimeSpec = [
    dependencies['@hi-ui/hiui'],
    devDependencies['@hi-ui/hiui'],
    peerDeps['@hi-ui/hiui'],
  ]
    .map((value) => String(value || '').trim())
    .find(Boolean)
  const existingHiuiRuntimeMajor = parseLeadingMajorVersion(existingHiuiRuntimeSpec)
  const fallbackHiuiRuntimeSpec = String(shellPeerDependencies?.['@hi-ui/hiui'] || '').trim()
  const resolvedHiuiRuntimeSpec =
    existingHiuiRuntimeMajor != null && existingHiuiRuntimeMajor >= 5
      ? existingHiuiRuntimeSpec
      : fallbackHiuiRuntimeSpec

  if (!resolvedHiuiRuntimeSpec) {
    return {}
  }

  return {
    hiui5: `npm:@hi-ui/hiui@${resolvedHiuiRuntimeSpec}`,
  }
}

async function loadHostIntegrationDependencies(skillRoot, peerDependencies, line = '') {
  const referencePath = path.join(skillRoot, 'docs', 'onboarding', 'host-integration-dependencies.json')
  const reference = await readJsonFile(referencePath)
  const runtimeVersionMap = reference?.dependencies ?? {}
  const buildVersionMap = reference?.devDependencies ?? {}
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

  const missingVersionSpecs = [...requiredPackages].filter(
    (depName) => !runtimeVersionMap[depName] && !buildVersionMap[depName]
  )
  if (missingVersionSpecs.length > 0) {
    throw new Error(
      `host-integration-dependencies.json is missing version specs for: ${missingVersionSpecs.join(', ')}`
    )
  }

  const managedRuntimePackages = new Set([
    ...[...requiredPackages].filter((depName) => runtimeVersionMap[depName]),
    ...Object.keys(runtimeVersionMap),
  ])
  const managedBuildPackages = new Set(Object.keys(buildVersionMap))

  return {
    dependencies: Object.fromEntries(
      [...managedRuntimePackages]
        .sort((a, b) => a.localeCompare(b))
        .map((depName) => [depName, runtimeVersionMap[depName]])
        .filter(([, depVersion]) => Boolean(depVersion))
    ),
    devDependencies: Object.fromEntries(
      [...managedBuildPackages]
        .sort((a, b) => a.localeCompare(b))
        .map((depName) => [depName, buildVersionMap[depName]])
        .filter(([, depVersion]) => Boolean(depVersion))
    ),
  }
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

  if (isSpecBelowMajor(reactSpec, 18)) {
    reasons.push(`react is pinned to ${reactSpec}`)
  }

  if (isSpecBelowMajor(reactDomSpec, 18)) {
    reasons.push(`react-dom is pinned to ${reactDomSpec}`)
  }

  if (isSpecBelowMajor(ahooksSpec, 3)) {
    reasons.push(`ahooks is pinned to ${ahooksSpec}`)
  }

  if (hiui5AliasSpec && isSpecBelowMajor(hiuiSpec, 5)) {
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
  directDevDependencies,
  line,
  mode,
  legacyCompatibilityOnly = false,
  syncProfile = '',
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
      removedScripts: [],
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
  const removedScripts = []
  const legacyRuntimeDependencies = legacyCompatibilityOnly
    ? {
        '@hiui-design/typical-page-shells': shellsSpec,
      }
    : {}

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
        keepExistingWhen:
          depName === 'react' || depName === 'react-dom'
            ? (name, previous, expected) => isVersionRangeAtLeast(previous, expected)
            : null,
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
        preferredBucket: 'dependencies',
      })

      if (result.action === 'added') {
        addedDeps.push(depName)
      } else if (result.action === 'updated') {
        updatedDeps.push(`${depName} (${result.previous} -> ${depVersion})`)
      }
    }

    for (const [depName, depVersion] of Object.entries(directDevDependencies ?? {})) {
      const result = upsertManagedDependency({
        dependencies,
        devDependencies,
        peerDeps,
        depName,
        depVersion,
        preferredBucket: 'devDependencies',
      })

      if (result.action === 'added') {
        addedDeps.push(depName)
      } else if (result.action === 'updated') {
        updatedDeps.push(`${depName} (${result.previous} -> ${depVersion})`)
      }
    }
  } else {
    for (const [depName, depVersion] of Object.entries(legacyRuntimeDependencies)) {
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

  for (const [scriptName, scriptValue] of Object.entries(getReusableScripts(line, { mode, syncProfile }))) {
    if (scripts[scriptName] == null) {
      scripts[scriptName] = scriptValue
      addedScripts.push(scriptName)
      continue
    }

    if (scripts[scriptName] !== scriptValue) {
      skippedScripts.push(scriptName)
    }
  }

  if (mode === 'legacy-host-compatible') {
    for (const scriptName of RETIRED_LEGACY_SCRIPT_NAMES) {
      if (Object.hasOwn(scripts, scriptName)) {
        delete scripts[scriptName]
        removedScripts.push(scriptName)
      }
    }
  }

  const nextPkg = {
    ...pkg,
    dependencies: sortObjectKeys(dependencies),
    scripts: sortObjectKeys(scripts),
  }

  if (pkg.devDependencies || Object.keys(devDependencies).length > 0) {
    nextPkg.devDependencies = sortObjectKeys(devDependencies)
  }

  if (pkg.peerDependencies || Object.keys(peerDeps).length > 0) {
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
      removedScripts,
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
    removedScripts,
  }
}

async function runSyncProfileContractGate({ skillRoot, mode, syncProfile }) {
  const { payload } = await loadSyncProfileContracts(skillRoot)
  const profile = findSyncProfileContract(payload, { mode, syncProfile })
  if (!profile) {
    return {
      status: 'skipped',
      profileId: '',
      mode,
      syncProfile,
      issues: [],
      warnings: [`No sync profile contract is declared for ${mode}/${syncProfile}`],
    }
  }

  const scripts = getReusableScripts('', { mode, syncProfile })
  return checkSyncProfileContract({ skillRoot, profile, scripts })
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

function escapeRegExp(source) {
  return String(source).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasViteAliasEntry(source, aliasName) {
  return new RegExp(`['"]${escapeRegExp(aliasName)}['"]\\s*:`, 'm').test(source)
}

async function writeViteAliasSnippet({ outputRoot, viteFile, shimPath, srcAliasPath }) {
  const snippetPath = path.join(outputRoot, 'VITE_ALIAS_SNIPPET.md')
  const viteLabel = viteFile ? path.relative(path.dirname(outputRoot), viteFile) : 'your vite config file'
  const content = `# Vite Alias Snippet

Host-integration example assets expect both the project-level \`@\` source alias and the
\`@hi-ui/schema-types\` shim alias. Add the block below to your Vite config before running
\`vite\`, \`pnpm dev\`, or \`pnpm build\`.

## Suggested target

- ${viteLabel}

## Alias block

\`\`\`ts
resolve: {
  alias: {
    '@': ${JSON.stringify(srcAliasPath)},
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
  const srcAliasPath = path.join(targetRoot, 'src')

  if (!viteFile) {
    return { status: 'not-detected', viteFile: '', snippetPath: '' }
  }

  const raw = await fs.readFile(viteFile, 'utf8')
  const missingAliasEntries = []

  if (!hasViteAliasEntry(raw, '@')) {
    missingAliasEntries.push(`'@': ${JSON.stringify(srcAliasPath)}`)
  }

  if (!hasViteAliasEntry(raw, '@hi-ui/schema-types')) {
    missingAliasEntries.push(`'@hi-ui/schema-types': ${JSON.stringify(shimPath)}`)
  }

  if (missingAliasEntries.length === 0) {
    return { status: 'already-patched', viteFile, snippetPath: '' }
  }

  const aliasRange = findObjectPropertyRange(raw, 'alias')

  if (aliasRange) {
    const nextRaw = insertIntoObjectLiteral(raw, aliasRange, missingAliasEntries.join(',\n'))
    await fs.writeFile(viteFile, nextRaw, 'utf8')
    return { status: 'patched', viteFile, snippetPath: '' }
  }

  const resolveRange = findObjectPropertyRange(raw, 'resolve')
  if (resolveRange) {
    const nextRaw = insertIntoObjectLiteral(
      raw,
      resolveRange,
      `alias: {\n  ${missingAliasEntries.join(',\n  ')}\n}`
    )
    await fs.writeFile(viteFile, nextRaw, 'utf8')
    return { status: 'patched', viteFile, snippetPath: '' }
  }

  const rootRange = findRootConfigObjectRange(raw)
  if (rootRange) {
    const nextRaw = insertIntoObjectLiteral(
      raw,
      rootRange,
      `resolve: {\n  alias: {\n    ${missingAliasEntries.join(',\n    ')}\n  }\n}`
    )
    await fs.writeFile(viteFile, nextRaw, 'utf8')
    return { status: 'patched', viteFile, snippetPath: '' }
  }

  const snippetPath = await writeViteAliasSnippet({
    outputRoot,
    viteFile,
    shimPath,
    srcAliasPath,
  })
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

function getInstallRecoveryCommand(manager) {
  if (manager === 'pnpm') return 'npx pnpm@8.6.12 install'
  return `${manager} install`
}

function shouldRetryPnpmWithNode16Fallback(result) {
  const failureText = `${result.stderr || ''}\n${result.stdout || ''}\n${result.error?.message || ''}`
  return (
    /pnpm/i.test(failureText) &&
    (/node\.js/i.test(failureText) || /\bnode\b/i.test(failureText) || /engine/i.test(failureText)) &&
    (/requires|require|unsupported|not compatible|expected version|ERR_PNPM_UNSUPPORTED_ENGINE/i.test(failureText))
  ) || result.error?.code === 'ENOENT'
}

function buildFallbackInstallCommand(manager) {
  if (manager !== 'pnpm') return null
  return {
    binary: 'npx',
    args: ['pnpm@8.6.12', 'install'],
    command: 'npx pnpm@8.6.12 install',
  }
}

function normalizeInstallFailure({ result, command, recoveryCommand, timeoutMs }) {
  if (result.error) {
    const timedOut = result.error.code === 'ETIMEDOUT'
    return {
      status: timedOut ? 'timed-out' : 'failed',
      command,
      recoveryCommand,
      timeoutMs,
      message:
        timedOut
          ? `${command} timed out after ${timeoutMs}ms`
          : result.error.message,
    }
  }

  const stderr = result.stderr?.trim()
  const stdout = result.stdout?.trim()
  return {
    status: 'failed',
    command,
    recoveryCommand,
    timeoutMs,
    message: stderr || stdout || `${command} exited with code ${result.status}`,
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
  const recoveryCommand = getInstallRecoveryCommand(manager)
  const result = spawnSync(manager, args, {
    cwd: targetRoot,
    encoding: 'utf8',
    timeout: timeoutMs,
  })

  if ((result.error || result.status !== 0) && shouldRetryPnpmWithNode16Fallback(result)) {
    const fallback = buildFallbackInstallCommand(manager)
    if (fallback) {
      const fallbackResult = spawnSync(fallback.binary, fallback.args, {
        cwd: targetRoot,
        encoding: 'utf8',
        timeout: timeoutMs,
      })

      if (!fallbackResult.error && fallbackResult.status === 0) {
        return {
          status: 'installed-with-fallback',
          command: fallback.command,
          attemptedCommand: command,
          recoveryCommand: fallback.command,
          timeoutMs,
          message: `${command} failed under the current Node runtime; retried with ${fallback.command}`,
        }
      }

      return {
        ...normalizeInstallFailure({
          result: fallbackResult,
          command: fallback.command,
          recoveryCommand: fallback.command,
          timeoutMs,
        }),
        attemptedCommand: command,
      }
    }
  }

  if (result.error) {
    return normalizeInstallFailure({ result, command, recoveryCommand, timeoutMs })
  }

  if (result.status !== 0) {
    return normalizeInstallFailure({ result, command, recoveryCommand, timeoutMs })
  }

  return {
    status: 'installed',
    command,
    recoveryCommand,
    timeoutMs,
    message: '',
  }
}

function summarizeDependencyInstallState({ installRequested, installResult }) {
  if (!installRequested) return 'not-requested'
  if (installResult.status === 'installed') return 'installed'
  if (installResult.status === 'installed-with-fallback') return 'installed-with-fallback'
  if (installResult.status === 'timed-out') return 'timed-out (recoverable: run install manually)'
  return installResult.status
}

function deriveDependencyInstalledGate({ installRequested, installResult }) {
  if (!installRequested) return 'skipped'
  if (installResult.status === 'installed' || installResult.status === 'installed-with-fallback') {
    return 'passed'
  }
  return 'failed'
}

function deriveBootstrapHostAssetsGate({ mode, hostProfile, routeResult, appFrameResult, viteResult }) {
  if (mode !== 'host-integration') return 'not-applicable'
  if (hostProfile?.projectType !== 'greenfield') return 'passed'

  const routeReady = ['patched', 'already-patched'].includes(routeResult?.status)
  const appFrameReady = ['patched', 'already-patched'].includes(appFrameResult?.status)
  const viteReady = !String(viteResult?.status || '').startsWith('snippet-only')
  return routeReady && appFrameReady && viteReady ? 'passed' : 'failed'
}

function deriveBootstrapCompletionGates({
  mode,
  hostProfile,
  installRequested,
  installResult,
  routeResult,
  appFrameResult,
  viteResult,
}) {
  return {
    bootstrapWritten: 'passed',
    modeLocked: 'passed',
    dependencyInstalled: deriveDependencyInstalledGate({ installRequested, installResult }),
    hostAssetsReady: deriveBootstrapHostAssetsGate({
      mode,
      hostProfile,
      routeResult,
      appFrameResult,
      viteResult,
    }),
    doctorPassed: 'not-run',
    engineeringPassed: 'not-run',
    modeRequiredGates: {
      legacyHostContractReady: mode === 'legacy-host-compatible' ? 'not-run' : 'not-applicable',
      legacyRuntimeReady: mode === 'legacy-host-compatible' ? 'not-run' : 'not-applicable',
      hostRouteReady:
        mode === 'host-integration' && hostProfile?.projectType === 'greenfield'
          ? deriveBootstrapHostAssetsGate({ mode, hostProfile, routeResult, appFrameResult, viteResult })
          : 'not-applicable',
    },
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

async function syncManagedQueryFilterBaseline({ skillRoot, targetRoot, force = false }) {
  const sourcePath = path.join(
    skillRoot,
    'examples',
    'host-integration',
    'src',
    'query-filter',
    'managed-query-filter-fields.js'
  )
  const targetPath = path.join(
    targetRoot,
    'src',
    'typical-page-reuse',
    'query-filter',
    'managed-query-filter-fields.js'
  )

  if (!(await pathExists(sourcePath))) {
    return { status: 'missing-source', sourcePath, targetPath }
  }

  if ((await pathExists(targetPath)) && !force) {
    const sourceRaw = await fs.readFile(sourcePath, 'utf8')
    const targetRaw = await fs.readFile(targetPath, 'utf8')
    return {
      status: sourceRaw === targetRaw ? 'up-to-date' : 'preserved-existing',
      sourcePath,
      targetPath,
    }
  }

  await ensureDir(path.dirname(targetPath))
  await fs.copyFile(sourcePath, targetPath)
  return { status: 'synced', sourcePath, targetPath }
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
  hostProfile,
  requestedMode,
  recommendedMode,
  hostAdapterSnippetPath,
  line,
	  manifestPath,
	  mode,
  modeSelectionStatus,
  overrideReason,
	  outputRoot,
  legacyHiUi4Deps,
  legacyHostRuntime,
  i18nInitResult,
  projectImagesInitResult,
  managedQueryFilterBaselineResult,
  packageResult,
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
	    requestedMode,
	    recommendedMode,
    modeSelectionStatus,
    ...(overrideReason ? { overrideReason } : {}),
	    framework: hostProfile.framework,
    projectType: hostProfile.projectType,
    runtime: hostProfile.runtime,
    routing: hostProfile.routing,
    confirmedAt: new Date().toISOString(),
    bootstrapSummary: path.relative(targetRoot, summaryPath),
  }
  const lines = [
    '# Typical Page Reuse Bootstrap Summary',
    '',
    '## Result',
    `- project type: ${hostProfile.projectType}`,
    `- detected framework: ${hostProfile.framework}`,
    `- runtime: ${hostProfile.runtime}`,
    `- routing: ${hostProfile.routing}`,
	    `- recommended strategy: ${hostProfile.strategy}`,
	    `- requested mode: ${requestedMode}`,
	    `- recommended mode: ${recommendedMode}`,
	    `- mode: ${mode}`,
    `- mode selection status: ${modeSelectionStatus}`,
    ...(overrideReason ? [`- mode override reason: ${overrideReason}`] : []),
	    `- project mode lock: ${path.relative(targetRoot, projectModePath)}`,
    ...(line ? [`- business line: ${line}`] : []),
    `- asset sync: ${syncStatus}`,
    `- package.json: ${packageResult.status}`,
    `- i18n baseline: ${i18nInitResult.status}`,
    `- project image scaffold: ${projectImagesInitResult.status}`,
    `- managed QueryFilter baseline: ${managedQueryFilterBaselineResult.status}`,
    `- style import: ${styleResult.status}`,
    `- app entry router: ${routerEntryResult.status}`,
    `- starter root styles: ${rootStyleResult.status}`,
    `- route integration: ${routeResult.status}`,
    `- app frame integration: ${appFrameResult.status}`,
    `- vite aliases: ${viteResult.status}`,
    `- dependency install: ${summarizeDependencyInstallState({ installRequested, installResult })}`,
  ]

  lines.push(
    '',
    '## Onboarding State',
    `- assetsSynced: ${syncStatus}`,
    `- packagePatched: ${packageResult.status}`,
    `- dependenciesInstalled: ${summarizeDependencyInstallState({ installRequested, installResult })}`,
    '- doctorPassed: not-run (setup-for-designers.mjs owns this gate)',
    '- buildPassed: not-run (setup-for-designers.mjs owns this gate)',
    '- lintExplained: not-run (setup-for-designers.mjs owns this gate)'
  )

  if (packageResult.addedDeps.length > 0) {
    lines.push(`- added dependencies: ${packageResult.addedDeps.join(', ')}`)
  }

  if (packageResult.updatedDeps.length > 0) {
    lines.push(`- normalized dependencies: ${packageResult.updatedDeps.join(', ')}`)
  }

  const addedScriptsSummary = summarizeAddedScriptsForMode({
    addedScripts: packageResult.addedScripts,
    mode,
  })
  if (addedScriptsSummary) {
    lines.push(`- added scripts: ${addedScriptsSummary}`)
  }

  if (packageResult.skippedScripts.length > 0) {
    lines.push(`- preserved existing scripts: ${packageResult.skippedScripts.join(', ')}`)
  }

  if (packageResult.removedScripts?.length > 0) {
    lines.push(`- removed retired scripts: ${packageResult.removedScripts.join(', ')}`)
  }

  if (i18nInitResult.generatedPath) {
    lines.push(`- generated translation entry: ${i18nInitResult.generatedPath}`)
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

  if (managedQueryFilterBaselineResult.targetPath) {
    lines.push(`- managed QueryFilter baseline file: ${path.relative(targetRoot, managedQueryFilterBaselineResult.targetPath)}`)
  }

  if (legacyHiUi4Deps.length > 0) {
    lines.push(`- detected legacy visual deps: ${legacyHiUi4Deps.join(', ')}`)
  }

  if (mode === 'legacy-host-compatible') {
    lines.push(`- legacy host runtime reasons: ${legacyHostRuntime.reasons.join('; ')}`)
    lines.push('- legacy page generation: host-contract + compiled PageSpec + HiuiLegacyPage runtime + typed page slots')
    lines.push('- legacy page-component provisioning: removed; this setup never writes src/page-components')
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

  if (installRequested && installResult.status === 'timed-out') {
    lines.push(`- install recovery command: ${installResult.recoveryCommand}`)
  }

  lines.push('', '## Next steps')
  lines.push(`- Host profile: ${hostProfile.reason}`)

  if (installRequested && installResult.status === 'timed-out') {
    lines.push(
      `- Dependency install timed out after ${installResult.timeoutMs}ms. The package.json and assets were still written; run \`${installResult.recoveryCommand}\` in the target project, then rerun \`node ".local-context/hiui-design/scripts/setup-for-designers.mjs" --no-install\` to continue doctor/build gates.`
    )
  } else if (installRequested && installResult.status === 'failed') {
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
    lines.push('- This host was detected as a legacy compatibility runtime. The legacy host main tree was not auto-patched into a generic `@hiui-design/typical-page-shells` host-integration runtime; ordinary typical pages should instead follow host-contract + compiled PageSpec + HiuiLegacyPage runtime + typed page slots.')
    lines.push('- Legacy integration now runs project-level `typical-page:legacy:init` during `typical-page:apply:legacy`; page generation continues through `typical-page:light-plan` plus `typical-page:legacy:new|rewrite --plan`, and page delivery is not accepted until `typical-page:legacy:accept` proves static gate, build, remoteEntry, runtime DOM, visual evidence, and warning classification. Project page-component provisioning is not supported.')
  } else if (!installRequested) {
    lines.push('- Run your target project package manager install command after reviewing package.json changes.')
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
    lines.push('- For non-technical designers, prefer `pnpm typical-page:designer-setup` or `npm run typical-page:designer-setup`; that entry now auto-runs doctor, checks build, and reports lint as an explainable follow-up when the script exists.')
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
    lines.push('- If the synced smoke/gallery assets drift behind the source-of-truth examples, refresh them with `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode host-integration --force`.')
    lines.push('- 槽位型典型页默认复制最接近的 `src/typical-page-reuse/pages/*` / reference 示例并只替换业务槽位。')
    lines.push('- 快速链路完成口径是当前页可预览、当前页 preflight 通过、lint / build 结果可解释；正式验收 / 发布时才追加 source-gate、doctor 与 finalize-page。')
  } else {
    lines.push('- No route gallery or host bridge files were wired into the target project source tree.')
    lines.push(`- A reference-only typical-page baseline was synced to \`${referencePagesPathLabel}\`. It is for generation guidance only, not for production routes or host bridging.`)
    lines.push(`- Archetype assets were synced to \`.local-context/hiui-design/archetypes\` and the current-mode template set. Copied files: ${archetypeAssetCount}.`)
    lines.push('- Generate new business pages directly under the target project’s existing structure; do not create `src/typical-page-reuse/*` unless you explicitly need host-integration mode.')
    lines.push(
      mode === 'legacy-host-compatible'
        ? '- When generating a page in this host, read `docs/generation/legacy-host-compatibility.md`, then `rules/page-type-map.md`, then `rules/typical-page-contracts/<pageType>.json`, then `docs/generation/figma-page-rules.md`, then the matched `docs/generation/figma-pages/*.md` chapter.'
        : '- When generating a page, first read `.local-context/hiui-design/rules/generation-rules.md`, then `rules/page-type-map.md`, then `docs/generation/figma-page-rules.md`, then the matched `docs/generation/figma-pages/*.md` chapter.'
    )
    lines.push('- 接入阶段的 mode 已写入 project mode lock；后续页面生成默认读取并确认该 mode，不再重新判定接入模式。')
    lines.push('- Legacy host contract, runtime mirror, PageSpec coverage, adapter facts, and runtime compatibility lock were initialized during apply. If project integration is not ready, follow the structured blockers before generating pages.')
    lines.push('- Generate a light plan first with `node ".local-context/hiui-design/scripts/typical-page-light-plan.mjs" --page-type <id> --page <generated-page-path> --summary <summary>`, then generate or rewrite with `node ".local-context/hiui-design/scripts/typical-page-legacy-new.mjs" --plan <light-plan.json>` or `node ".local-context/hiui-design/scripts/typical-page-legacy-rewrite.mjs" --plan <light-plan.json>`. Use `node ".local-context/hiui-design/scripts/typical-page-legacy-verify.mjs" --page-type <id> --page <generated-page-path>` only for troubleshooting.')
    lines.push(`- Use \`${referencePagesPathLabel}\` as the default local reference template set. If that directory is removed manually, fall back to \`.local-context/hiui-design/examples/host-integration/src/pages/*\`.`)
    lines.push('- Before visual/detail polish, run `pnpm typical-page:preflight -- --page <generated-page-path>` so placeholder mappings, source marker gaps, and transitive import contamination fail early.')
    lines.push(
      mode === 'legacy-host-compatible'
        ? '- legacy-host-compatible 完成口径是 `typical-page:legacy:accept` 汇总 `typical-page:legacy:verify`、宿主 lint / build、remoteEntry 实物模块、DOM marker、视觉验收与 warning 分类证据；不得用 `typical-page:finalize-page` 作为 legacy 页面交付门禁。'
        : '- 快速链路完成口径是当前页可预览、当前页 preflight 通过、lint / build 结果可解释；正式验收 / 发布、结构修复或 ownership / marker 变化时才执行 `typical-page:finalize-page`。'
    )
    lines.push(
      mode === 'legacy-host-compatible'
        ? '- In legacy-host-compatible mode, do not treat the legacy host main tree as a generic direct mount for `@hiui-design/typical-page-shells`. Ordinary typical pages use host-contract, compiled PageSpec, HiuiLegacyPage runtime, and typed page slots; only ad hoc host-integration-style shell imports remain out of bounds for the legacy main tree. If you later isolate a dedicated modern runtime entry, re-evaluate standard shell imports there instead of in the host main tree.'
        : '- If the generated page imports `@hiui-design/typical-page-shells`, then add `@hiui-design/typical-page-shells/styles.css` plus the Vite `@` and `@hi-ui/schema-types` aliases in the target project.'
    )
    lines.push('- Only when you explicitly want a host-integration baseline gallery demo, run `node ".local-context/hiui-design/scripts/apply-in-current-project.mjs" --mode host-integration`.')
    lines.push('- 接入阶段 doctor 已作为安装门槛；只有手工改宿主、依赖、路由或样式入口后，才需要重新执行 `pnpm typical-page:doctor` 或 `npm run typical-page:doctor`。')
  }
  lines.push('')

  await ensureDir(path.dirname(summaryPath))
  await ensureDir(path.dirname(projectModePath))
  await fs.writeFile(projectModePath, `${JSON.stringify(projectMode, null, 2)}\n`, 'utf8')
  await fs.writeFile(summaryPath, `${lines.join('\n')}\n`, 'utf8')
  return summaryPath
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

function runLegacyInitScript({ skillRoot, targetRoot, force, hostPack }) {
  const initScriptPath = path.join(skillRoot, 'scripts', 'typical-page-legacy-init.mjs')
  const args = [initScriptPath, '--target', targetRoot, '--json']
  if (hostPack) args.push('--host-pack', hostPack)
  if (force) args.push('--force')

  const result = spawnSync(process.execPath, args, {
    cwd: skillRoot,
    encoding: 'utf8',
  })

  if (result.error) {
    throw result.error
  }

  if ((result.status ?? 1) !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || 'typical-page:legacy:init failed')
  }

  try {
    return JSON.parse(result.stdout)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`typical-page:legacy:init returned invalid JSON: ${message}`)
  }
}

function formatSyncOutputForBootstrap({ syncOutput, mode }) {
  if (mode !== 'legacy-host-compatible') {
    return syncOutput
  }

  const [summary] = String(syncOutput || '').split(/\nNext steps:\n/)
  return [
    summary.trim(),
    '',
    'Next steps:',
    '1. `typical-page:apply:legacy` runs `typical-page:legacy:init` automatically to write the host contract, runtime mirror, PageSpec coverage, adapter facts, and runtime compatibility lock.',
    '2. If project integration is not ready, follow the structured blockers instead of editing adapters by guesswork.',
    '3. Create a light plan with `typical-page:light-plan`, then generate or rewrite business pages with `typical-page:legacy:new|rewrite --plan`; do not use the standard start-page entry for legacy pages.',
    '4. Accept delivery with `typical-page:legacy:accept` after typed slots are filled; it must prove static gate, build, remoteEntry, runtime DOM, visual evidence, and warning classification.',
    '5. Keep `src/page-components` absent from the legacy main chain; use `typical-page:legacy:verify` only when troubleshooting boundary or slot issues.',
  ].join('\n')
}

function summarizeAddedScriptsForMode({ addedScripts = [], mode }) {
  if (!Array.isArray(addedScripts) || addedScripts.length === 0) {
    return ''
  }

  if (mode !== 'legacy-host-compatible') {
    return addedScripts.join(', ')
  }

  const legacyScripts = addedScripts.filter(
    (scriptName) => scriptName.startsWith('typical-page:legacy:') && scriptName !== 'typical-page:legacy:verify'
  )
  const supportScripts = addedScripts.filter((scriptName) =>
    ['typical-page:apply:legacy', 'typical-page:plan-page-task', 'typical-page:doctor'].includes(scriptName)
  )

  return [...legacyScripts, ...supportScripts].join(', ')
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
    const embeddedShellsSpec = await resolveEmbeddedShellsSpec(skillRoot, shellPackage.version)
    const fallbackShellsSpec = embeddedShellsSpec || shellPackage.version
    const modePolicy = resolveInstallModePolicy({
      requestedMode: options.mode,
      hostProfile,
      legacyHostRuntime,
      allowModeOverride: options.allowModeOverride,
      overrideReason: options.overrideReason,
    })
    assertInstallModePolicyAllowed({ policy: modePolicy, hostProfile })
    const recommendedMode = modePolicy.recommendedMode
	    const mode = modePolicy.mode
    const modeSelection = modePolicy
	    const shellsSpec = options.shellsSpec || (mode === 'legacy-host-compatible'
      ? await resolveLegacyShellsSpec({
          skillRoot,
          shellPackage,
          targetPkg: originalTargetPkg,
          fallbackSpec: fallbackShellsSpec,
        })
      : fallbackShellsSpec)

    if (!(await pathExists(targetRoot))) {
      throw new Error(`Target project root does not exist: ${targetRoot}`)
    }

    if (legacyHostRuntime.incompatible && options.mode === 'host-integration') {
      console.warn(
        `Detected a legacy host-compatible runtime while explicit mode is host-integration: ${legacyHostRuntime.reasons.join(
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
        : { dependencies: {}, devDependencies: {} }

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
      syncProfile: options.syncProfile,
    })
    const syncProfileContractResult = await runSyncProfileContractGate({
      skillRoot,
      mode,
      syncProfile: archetypeSyncResult.syncProfile,
    })
    if (syncProfileContractResult.status === 'failed') {
      throw new Error(
        `Sync profile contract failed for ${syncProfileContractResult.profileId || `${mode}/${archetypeSyncResult.syncProfile}`}: ${syncProfileContractResult.issues.join('; ')}`
      )
    }
    const gitignoreBoundaryResult = await upsertHiuiGitignoreBoundary({
      targetRoot,
      syncProfile: archetypeSyncResult.syncProfile,
    })

    const packageResult = await patchPackageJson({
      targetRoot,
      shellsSpec,
      peerDependencies: shellPackage.peerDependencies ?? {},
      directDependencies: hostIntegrationDependencies.dependencies,
      directDevDependencies: hostIntegrationDependencies.devDependencies,
      line: lineId,
      mode,
      legacyCompatibilityOnly: mode === 'legacy-host-compatible',
      syncProfile: archetypeSyncResult.syncProfile,
    })
    const i18nInitResult = options.skipI18nInit
      ? { status: 'skipped (--skip-i18n-init)', command: '', generatedPath: '', locales: '', syncedFiles: '' }
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
    const managedQueryFilterBaselineResult = mode === 'legacy-host-compatible'
      ? await syncManagedQueryFilterBaseline({ skillRoot, targetRoot, force: options.force })
      : { status: 'not-required', sourcePath: '', targetPath: '' }
    const installRequested = options.install || (mode === 'legacy-host-compatible' && !options.noInstall)
    const installResult = installRequested
      ? await runInstall({ targetRoot, timeoutMs: options.installTimeoutMs })
      : { status: 'not-requested', command: '', message: '' }
    const legacyInitResult = mode === 'legacy-host-compatible'
      ? runLegacyInitScript({
          skillRoot,
          targetRoot,
          force: options.force,
          hostPack: options.hostPack,
        })
      : { status: 'not-required' }

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

    const { snippetPath: hostAdapterSnippetPath } = await writeHostAdapterSnippet({
      outputRoot: resolvedOutputRoot,
      hostProfile,
      recommendedModeOverride: recommendedMode,
    })
    const summaryPath = await writeBootstrapSummary({
      archetypeAssetCount: archetypeSyncResult.copiedFiles.length,
      targetRoot,
      hostProfile,
      requestedMode: modePolicy.requestedMode,
      recommendedMode,
      hostAdapterSnippetPath,
      line: lineId,
	      manifestPath,
	      mode,
      modeSelectionStatus: modeSelection.modeSelectionStatus,
      overrideReason: modeSelection.overrideReason,
	      outputRoot: resolvedOutputRoot,
      legacyHiUi4Deps,
      legacyHostRuntime,
      i18nInitResult,
      projectImagesInitResult,
      managedQueryFilterBaselineResult,
      packageResult,
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
      syncStatus: syncConfig.status,
      referencePagesPathLabel: syncConfig.referencePagesPathLabel,
    })
    const completionGates = deriveBootstrapCompletionGates({
      mode,
      hostProfile,
      installRequested,
      installResult,
      routeResult,
      appFrameResult,
      viteResult,
    })
    const legacyHostFamilySummary =
      mode === 'legacy-host-compatible'
        ? detectLegacyHostFamily({
            targetRoot,
            skillRoot,
            modeOverride: mode,
          })
        : null
    const projectIntegrationResult = await writeProjectIntegrationState({
      targetRoot,
      mode,
	      recommendedMode,
      modeSelectionStatus: modeSelection.modeSelectionStatus,
      overrideReason: modeSelection.overrideReason,
	      completionGates,
	      source: 'bootstrap-target-project',
      bootstrapSummary: path.relative(targetRoot, summaryPath),
      hostProfile,
      legacyHostFamilySummary,
    })
    const bootstrapStatus = mode === 'legacy-host-compatible' && legacyInitResult.status === 'blocked' ? 'blocked' : 'ready'

    if (options.json) {
      console.log(JSON.stringify({
        schemaVersion: 'bootstrap-target-project-result.v1',
        status: bootstrapStatus,
        targetRoot,
        detectedProjectType: hostProfile.projectType,
        detectedFramework: hostProfile.framework,
	        recommendedMode,
	        mode,
        modeSelectionStatus: modeSelection.modeSelectionStatus,
        ...(modeSelection.overrideReason ? { overrideReason: modeSelection.overrideReason } : {}),
	        completionGates,
	        onboardingCompletionReady: projectIntegrationResult.state.onboardingCompletionReady,
	        syncProfile: archetypeSyncResult.syncProfile,
        outputRoot: resolvedOutputRoot,
        summaryPath,
        hostAdapterSnippetPath,
        package: packageResult,
        i18n: i18nInitResult,
        projectImages: projectImagesInitResult,
        managedQueryFilterBaseline: managedQueryFilterBaselineResult,
        legacyInit: legacyInitResult,
        styleImport: styleResult,
        routeIntegration: routeResult,
        appFrameIntegration: appFrameResult,
        viteAliases: viteResult,
        dependencyInstall: installResult,
        archetypeAssets: {
          syncProfile: archetypeSyncResult.syncProfile,
          manifestPath: archetypeSyncResult.manifestPath,
          copiedFiles: archetypeSyncResult.copiedFiles.map((filePath) => path.relative(targetRoot, filePath)),
          cleanedPaths: archetypeSyncResult.cleanedPaths.map((filePath) => path.relative(targetRoot, filePath)),
        },
        syncProfileContract: syncProfileContractResult,
        gitignoreBoundary: {
          status: gitignoreBoundaryResult.status,
          changed: gitignoreBoundaryResult.changed,
          path: path.relative(targetRoot, gitignoreBoundaryResult.path),
          reason: gitignoreBoundaryResult.reason,
          syncProfile: gitignoreBoundaryResult.syncProfile,
        },
        projectIntegrationState: projectIntegrationResult.state,
        legacyHostFamily: legacyHostFamilySummary,
      }, null, 2))
      return
    }

    console.log(formatSyncOutputForBootstrap({ syncOutput, mode }))
    console.log('')
    console.log('Bootstrap summary:')
    console.log(`- detected project type: ${hostProfile.projectType}`)
	    console.log(`- detected framework: ${hostProfile.framework}`)
	    console.log(`- recommended mode: ${recommendedMode}`)
	    console.log(`- chosen mode: ${mode}`)
    console.log(`- mode selection status: ${modeSelection.modeSelectionStatus}`)
    if (modeSelection.overrideReason) {
      console.log(`  override reason: ${modeSelection.overrideReason}`)
    }
	    console.log(`- hiui-design sync profile: ${archetypeSyncResult.syncProfile}`)
    if (syncProfileContractResult.status === 'passed') {
      console.log(`- sync profile contract: ${syncProfileContractResult.profileId} passed`)
    } else if (syncProfileContractResult.status === 'skipped') {
      console.log(`- sync profile contract: skipped (${syncProfileContractResult.warnings.join('; ')})`)
    }
    console.log(`- hiui-design gitignore boundary: ${gitignoreBoundaryResult.status}`)
    if (mode === 'legacy-host-compatible') {
      console.log(`  reason: ${legacyHostRuntime.reasons.join('; ')}`)
      console.log('- legacy page-component provisioning: removed (no src/page-components provisioning)')
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
    console.log(`- managed QueryFilter baseline: ${managedQueryFilterBaselineResult.status}`)
    if (mode === 'legacy-host-compatible') {
      console.log(`- legacy init: ${legacyInitResult.status}`)
      console.log(`  host contract: ${legacyInitResult.hostContractPath}`)
      console.log(`  runtime compatibility lock: ${legacyInitResult.runtimeCompatibilityLock}`)
      console.log(`  shell runtime: ${legacyInitResult.shellRuntimeVariant} (${legacyInitResult.shellRuntimeStatus})`)
    }
    if (i18nInitResult.generatedPath) {
      console.log(`  generated: ${i18nInitResult.generatedPath}`)
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
    if (managedQueryFilterBaselineResult.targetPath) {
      console.log(`  file: ${managedQueryFilterBaselineResult.targetPath}`)
    }
    if (packageResult.addedDeps.length > 0) {
      console.log(`  added deps: ${packageResult.addedDeps.join(', ')}`)
    }
    if (packageResult.updatedDeps.length > 0) {
      console.log(`  normalized deps: ${packageResult.updatedDeps.join(', ')}`)
    }
    const addedScriptsSummary = summarizeAddedScriptsForMode({
      addedScripts: packageResult.addedScripts,
      mode,
    })
    if (addedScriptsSummary) {
      console.log(`  added scripts: ${addedScriptsSummary}`)
    }
    if (packageResult.skippedScripts.length > 0) {
      console.log(`  preserved existing scripts: ${packageResult.skippedScripts.join(', ')}`)
    }
    if (packageResult.removedScripts?.length > 0) {
      console.log(`  removed retired scripts: ${packageResult.removedScripts.join(', ')}`)
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
    console.log(`- vite aliases: ${viteResult.status}`)
    if (viteResult.viteFile) {
      console.log(`  vite file: ${viteResult.viteFile}`)
    }
    if (viteResult.snippetPath) {
      console.log(`  snippet: ${viteResult.snippetPath}`)
    }
    console.log(`- dependency install: ${summarizeDependencyInstallState({ installRequested, installResult })}`)
    if (installRequested && installResult.command) {
      console.log(`  command: ${installResult.command}`)
    }
    if (installRequested && installResult.status === 'timed-out' && installResult.recoveryCommand) {
      console.log(`  recovery: run ${installResult.recoveryCommand}, then rerun setup-for-designers.mjs --no-install`)
    }
    if (installRequested && installResult.message) {
      console.log(`  detail: ${installResult.message}`)
    }
    console.log(`- project integration state: ${projectIntegrationResult.status}`)
    console.log(`  runtime integration ready: ${projectIntegrationResult.state.runtimeIntegrationReady ? 'yes' : 'no'}`)
    console.log(`  onboarding completion ready: ${projectIntegrationResult.state.onboardingCompletionReady ? 'yes' : 'no'}`)
    if (projectIntegrationResult.state.blockingReasons.length > 0) {
      for (const reason of projectIntegrationResult.state.blockingReasons) {
        console.log(`  blocker: ${reason}`)
      }
    }
    console.log(`- summary file: ${summaryPath}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`bootstrap-target-project failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
