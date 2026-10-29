#!/usr/bin/env node

import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  SKILL_PUBLIC_NAME,
  getContextScriptPath,
  toContextVendorFileSpec,
} from './lib/skill-identity.mjs'
import {
  getIsolatedAliasCompatibility,
  getVersionFromAliasSpec,
} from './lib/isolated-alias-compat.mjs'
import {
  describeSharedRuntimeDirectDependencyInspection,
  inspectDeclaredSharedRuntimeDirectDependencies,
  loadSharedRuntimeDirectDependencySnapshot,
  selectEntryImportedSharedRuntimeDirectDependencies,
} from './lib/shared-runtime-direct-dependencies.mjs'
import { getManagedLocalRuntimeRoot } from './lib/managed-local-runtime-contract.mjs'
import {
  loadManagedLocalRuntimeDependencyContract,
  resolveManagedLocalRuntimeEmbeddedSourceSnapshotFiles,
} from './lib/managed-local-runtime-dependencies.mjs'
import {
  bridgeCoversHiuiRuntimePackage,
  hasScopedHiui5BridgeMarkers,
} from './lib/legacy-hiui5-bridge-signals.mjs'
import { isVersionCompatible } from './lib/version-compatibility.mjs'

const skillRequire = createRequire(import.meta.url)
const {
  HIUI5_ISOLATED_PEER_ALIASES,
  HIUI5_REQUIRED_TRANSITIVE_PEERS,
} = skillRequire('./lib/hiui5-peer-contract.cjs')

function parseArgs(argv) {
  const options = {
    allowPendingManagedLocalRuntimeMaterialization: false,
    target: process.cwd(),
    json: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--') {
      continue
    }
    if (arg === '--target') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) throw new Error(`Missing value for ${arg}`)
      options.target = value
      i += 1
      continue
    }
    if (arg === '--json') {
      options.json = true
      continue
    }
    if (arg === '--allow-pending-managed-local-runtime-materialization') {
      options.allowPendingManagedLocalRuntimeMaterialization = true
      continue
    }
    if (arg === '--help' || arg === '-h') {
      console.log(
        `Usage: node ${getContextScriptPath('dependency-isolation-check.mjs')} [--target <project-root>] [--json] [--allow-pending-managed-local-runtime-materialization]`
      )
      process.exit(0)
    }
    throw new Error(`Unknown argument: ${arg}`)
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

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return ''
  }
}

async function readJsonIfExists(targetPath) {
  const text = await readTextIfExists(targetPath)
  return text ? JSON.parse(text) : null
}

function normalizeImportSpecifier(value) {
  return String(value || '').trim().replace(/\\/g, '/')
}

function hasLegacyRuntimeSourcePackageToken(value = '') {
  return normalizeImportSpecifier(value).includes('runtime-source-package')
}

function isPackagePrivateDistImport(specifier = '', packageName = '') {
  const normalizedSpecifier = normalizeImportSpecifier(specifier)
  const normalizedPackageName = normalizeImportSpecifier(packageName)
  if (!normalizedSpecifier) return false
  if (!normalizedPackageName) {
    return hasLegacyRuntimeSourcePackageToken(normalizedSpecifier) && normalizedSpecifier.includes('/dist/')
  }
  return normalizedSpecifier.includes(`${normalizedPackageName}/dist/`)
}

function findDependency(pkg, depName) {
  return pkg?.dependencies?.[depName] || pkg?.devDependencies?.[depName] || pkg?.peerDependencies?.[depName] || ''
}

function hasDeclaredDependency(pkg, depName) {
  return Boolean(findDependency(pkg, depName))
}

const LEGACY_BRIDGE_CONFIG_CANDIDATES = [
  'build/rspack.base.conf.js',
  'build/rspack.base.conf.ts',
  'build/rspack.dev.conf.js',
  'build/rspack.prod.conf.js',
  'build/webpack.base.conf.js',
  'build/webpack.base.conf.ts',
  'rspack.config.js',
  'rspack.config.ts',
  'webpack.config.js',
  'webpack.config.ts',
]
const ENTRY_FILE_CANDIDATES = [
  'src/main.tsx',
  'src/main.jsx',
  'src/main.ts',
  'src/main.js',
  'src/index.tsx',
  'src/index.jsx',
  'src/index.ts',
  'src/index.js',
]

export { isVersionCompatible }

async function findNearestPackageRoot(startPath) {
  let currentPath = startPath
  try {
    const stat = await fs.stat(currentPath)
    if (!stat.isDirectory()) currentPath = path.dirname(currentPath)
  } catch {
    currentPath = path.dirname(currentPath)
  }

  while (currentPath && currentPath !== path.dirname(currentPath)) {
    const packagePath = path.join(currentPath, 'package.json')
    if (await pathExists(packagePath)) return currentPath
    currentPath = path.dirname(currentPath)
  }

  return ''
}

async function resolveInstalledPackageVersion(targetRequire, depName, resolvePaths) {
  try {
    let entryPath = ''
    try {
      entryPath = targetRequire.resolve(depName, { paths: resolvePaths })
    } catch {
      entryPath = targetRequire.resolve(`${depName}/package.json`, { paths: resolvePaths })
    }
    const packageRoot = entryPath.endsWith('package.json') ? path.dirname(entryPath) : await findNearestPackageRoot(entryPath)
    const packageJson = packageRoot ? await readJsonIfExists(path.join(packageRoot, 'package.json')) : null
    return {
      version: packageJson?.version ?? '',
      packageRoot,
    }
  } catch (error) {
    return {
      version: '',
      packageRoot: '',
      error: error?.message ?? String(error),
    }
  }
}

function makeCheck(id, ok, severity, summary, detail, evidence = {}) {
  return { id, ok, severity, summary, detail, evidence }
}

function buildResultSummary(checks, failed) {
  return {
    totalChecks: checks.length,
    passedChecks: checks.filter((check) => check.ok).length,
    failedChecks: failed.length,
    failedCheckIds: failed.map((check) => check.id),
  }
}

function buildDecision({ failed }) {
  if (failed.length === 0) {
    return {
      canContinue: true,
      nextAction:
        `Dependency isolation is healthy. You can continue with ${SKILL_PUBLIC_NAME} page generation and runtime verification.`,
    }
  }

  return {
    canContinue: false,
    nextAction:
      `Do not continue with new ${SKILL_PUBLIC_NAME} page generation until the dependency isolation errors are fixed.`,
  }
}

function normalizeHiuiPackageName(specifier) {
  const parts = String(specifier || '').split('/')
  return parts[0] === '@hi-ui' && parts[1] ? `${parts[0]}/${parts[1]}` : ''
}

function expectedMajorForHiuiRuntimePackage(depName) {
  if (!depName.startsWith('@hi-ui/')) return 0
  if (depName.startsWith('@hi-ui/schema-')) return 4
  if (depName === '@hi-ui/use-ref-state') return 4
  if (depName === '@hi-ui/use-subscription') return 4
  if (depName === '@hi-ui/utility-types') return 4
  if (depName === '@hi-ui/number-range') return 4
  if (depName === '@hi-ui/dumb-wrapper') return 4
  if (depName === '@hi-ui/group') return 4
  if (depName === '@hi-ui/style-inject') return 4
  if (depName === '@hi-ui/schema-types') return 4
  return 5
}

function parseMajorVersion(version) {
  const match = String(version || '').match(/^(?:npm:[^@]+@)?(\d+)/)
  return match ? Number(match[1]) : 0
}

function bridgeDeclaresPackage(rspackBase, depName) {
  return bridgeCoversHiuiRuntimePackage(rspackBase, depName)
}

async function findLegacyBridgeConfig(targetRoot) {
  for (const relativePath of LEGACY_BRIDGE_CONFIG_CANDIDATES) {
    const absolutePath = path.join(targetRoot, relativePath)
    const source = await readTextIfExists(absolutePath)
    if (!source) continue
    return {
      relativePath,
      absolutePath,
      source,
    }
  }

  return {
    relativePath: '',
    absolutePath: '',
    source: '',
  }
}

async function firstExistingPath(targetRoot, candidates) {
  for (const relativePath of candidates) {
    const absolutePath = path.join(targetRoot, relativePath)
    if (await pathExists(absolutePath)) return absolutePath
  }

  return ''
}

function hasLegacyBridgeMarkers(source = '') {
  return hasScopedHiui5BridgeMarkers(source)
}

function detectLegacyBuildRuntime(pkg, legacyBridgeConfig) {
  if (legacyBridgeConfig.relativePath) {
    return {
      requiresBridge: true,
      detail: `${legacyBridgeConfig.relativePath} exists and should keep the HiUI5 schema peer replacement bridge`,
    }
  }

  const declaredLegacyBuilder =
    findDependency(pkg, '@rspack/core') ||
    findDependency(pkg, '@rspack/cli') ||
    findDependency(pkg, 'rspack') ||
    findDependency(pkg, 'webpack')

  if (declaredLegacyBuilder) {
    return {
      requiresBridge: true,
      detail: `package.json declares a legacy build runtime (${declaredLegacyBuilder}), so a rspack/webpack bridge config must be present`,
    }
  }

  if (hasDeclaredDependency(pkg, 'vite')) {
    return {
      requiresBridge: false,
      detail: 'no legacy rspack/webpack build config detected; Vite projects rely on package isolation and schema-types aliasing instead',
    }
  }

  return {
    requiresBridge: false,
    detail: 'no legacy rspack/webpack build config detected; schema peer replacement bridge is not required for this target',
  }
}

async function resolveHiui5PackageVersion(targetRoot, depName) {
  try {
    const hiui5Root = await fs.realpath(path.join(targetRoot, 'node_modules', 'hiui5'))
    const hiui5Require = createRequire(path.join(hiui5Root, 'package.json'))
    let entryPath = path.join(hiui5Root, 'package.json')
    if (depName !== '@hi-ui/hiui') {
      try {
        entryPath = hiui5Require.resolve(`${depName}/package.json`)
      } catch {
        entryPath = hiui5Require.resolve(depName)
      }
    }
    const packageRoot = entryPath.endsWith('package.json') ? path.dirname(entryPath) : await findNearestPackageRoot(entryPath)
    const packageJson = await readJsonIfExists(path.join(packageRoot, 'package.json'))
    return {
      version: packageJson?.version ?? '',
      packageRoot,
    }
  } catch (error) {
    return {
      version: '',
      packageRoot: '',
      error: error?.message ?? String(error),
    }
  }
}

function collectHiuiImportsFromSource(source) {
  const imports = new Set()
  const patterns = [
    /\bfrom\s+['"](@hi-ui\/[^'"]+)['"]/g,
    /\bimport\s+['"](@hi-ui\/[^'"]+)['"]/g,
    /\brequire\(\s*['"](@hi-ui\/[^'"]+)['"]\s*\)/g,
  ]

  for (const pattern of patterns) {
    let match = null
    while ((match = pattern.exec(source))) {
      const depName = normalizeHiuiPackageName(match[1])
      if (depName) imports.add(depName)
    }
  }

  return imports
}

async function collectHiuiImportsFromPackageRoot(packageRoot) {
  const imports = new Map()
  const roots = ['dist', 'lib']

  function addImport(depName) {
    const importerRoots = imports.get(depName) || new Set()
    importerRoots.add(packageRoot)
    imports.set(depName, importerRoots)
  }

  async function walk(dir) {
    let entries = []
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules') continue
        await walk(absolutePath)
        continue
      }
      if (!/\.(?:js|mjs|cjs)$/.test(entry.name)) continue
      const source = await readTextIfExists(absolutePath)
      for (const depName of collectHiuiImportsFromSource(source)) addImport(depName)
    }
  }

  for (const rootName of roots) {
    await walk(path.join(packageRoot, rootName))
  }

  return imports
}

async function collectHiuiImportsFromSourceRoot(sourceRoot) {
  const imports = new Map()

  function addImport(depName) {
    const importerRoots = imports.get(depName) || new Set()
    importerRoots.add(sourceRoot)
    imports.set(depName, importerRoots)
  }

  async function walk(dir) {
    let entries = []
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
        await walk(absolutePath)
        continue
      }
      if (!/\.(?:js|jsx|ts|tsx|mjs|cjs)$/.test(entry.name)) continue
      const source = await readTextIfExists(absolutePath)
      for (const depName of collectHiuiImportsFromSource(source)) addImport(depName)
    }
  }

  await walk(sourceRoot)
  return imports
}

async function collectHiuiRuntimeGraphViolations({
  targetRoot,
  targetRequire,
  runtimeResolvePaths,
  runtimeSourceRoot,
  managedRuntimePeerDependencies,
  pkg,
  rspackBase,
}) {
  const packageRootsToScan = new Set()
  const importsToValidate = new Map()
  const violations = []
  const validated = []

  function addImportToValidate(depName, importerRoot = '') {
    const importerRoots = importsToValidate.get(depName) || new Set()
    if (importerRoot) importerRoots.add(importerRoot)
    importsToValidate.set(depName, importerRoots)
  }

  if (runtimeSourceRoot) {
    const runtimeImportResolveRoot = path.relative(targetRoot, runtimeSourceRoot).startsWith('..')
      ? runtimeResolvePaths[0]
      : runtimeSourceRoot
    const runtimeImports = await collectHiuiImportsFromSourceRoot(runtimeSourceRoot)
    for (const [depName, importerRoots] of runtimeImports.entries()) {
      for (const importerRoot of importerRoots) {
        addImportToValidate(depName, runtimeImportResolveRoot || importerRoot)
      }
    }
  }

  for (const depName of Object.keys(managedRuntimePeerDependencies ?? {})) {
    if (!depName.startsWith('@hi-ui/')) continue
    addImportToValidate(depName, runtimeSourceRoot)
    if (!depName.startsWith('@hi-ui/schema-') && depName !== '@hi-ui/query-filter') continue

    const resolution = await resolveInstalledPackageVersion(targetRequire, depName, runtimeResolvePaths)
    if (resolution.packageRoot) packageRootsToScan.add(resolution.packageRoot)
  }

  for (const packageRoot of packageRootsToScan) {
    const packageImports = await collectHiuiImportsFromPackageRoot(packageRoot)
    for (const [depName, importerRoots] of packageImports.entries()) {
      for (const importerRoot of importerRoots) addImportToValidate(depName, importerRoot)
    }
  }

  for (const [depName, importerRoots] of [...importsToValidate.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const expectedMajor = expectedMajorForHiuiRuntimePackage(depName)
    if (!expectedMajor) continue

    const aliasName = HIUI5_ISOLATED_PEER_ALIASES[depName]
    const aliasSpec = aliasName ? findDependency(pkg, aliasName) : ''
    const aliasMajor = parseMajorVersion(getVersionFromAliasSpec(aliasSpec))
    if (aliasMajor === expectedMajor) {
      validated.push({ depName, expectedMajor, via: aliasName, version: getVersionFromAliasSpec(aliasSpec) })
      continue
    }

    if (expectedMajor === 5 && bridgeDeclaresPackage(rspackBase, depName)) {
      const bridgeResolution = await resolveHiui5PackageVersion(targetRoot, depName)
      if (parseMajorVersion(bridgeResolution.version) === expectedMajor) {
        validated.push({
          depName,
          expectedMajor,
          via: 'build:hiui5-peer-replacement-bridge-esm',
          version: bridgeResolution.version,
          packageRoot: bridgeResolution.packageRoot,
        })
        continue
      }
    }

    const resolvePaths = importerRoots.size > 0 ? [...importerRoots] : runtimeResolvePaths
    const resolution = await resolveInstalledPackageVersion(targetRequire, depName, resolvePaths)
    const actualMajor = parseMajorVersion(resolution.version)
    const item = {
      depName,
      expectedMajor,
      resolved: resolution.version || '(unresolved)',
      packageRoot: resolution.packageRoot,
    }
    if (actualMajor !== expectedMajor) {
      violations.push(item)
    } else {
      validated.push(item)
    }
  }

  return { violations, validated }
}

async function collectSourcePrivateImportViolations(targetRoot, { sourcePackageName = '' } = {}) {
  const violations = []
  const sourceRoot = path.join(targetRoot, 'src')
  const normalizedSourcePackageName = normalizeImportSpecifier(sourcePackageName)

  async function walk(dir) {
    let entries = []
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
        await walk(absolutePath)
        continue
      }
      if (!/\.(?:js|jsx|ts|tsx|scss|sass|css)$/.test(entry.name)) continue
      const source = await readTextIfExists(absolutePath)
      if (
        isPackagePrivateDistImport(source, sourcePackageName) ||
        source.includes('node_modules/.pnpm') ||
        source.includes('../node_modules') ||
        (!normalizedSourcePackageName && hasLegacyRuntimeSourcePackageToken(source)) ||
        (normalizedSourcePackageName &&
          source.includes(`node_modules/${normalizedSourcePackageName}`))
      ) {
        violations.push(path.relative(targetRoot, absolutePath))
      }
    }
  }

  await walk(sourceRoot)
  return violations
}

export async function runCheck({
  targetRoot,
  skillRoot,
  allowPendingManagedLocalRuntimeMaterialization = false,
}) {
  const packagePath = path.join(targetRoot, 'package.json')
  const pkg = await readJsonIfExists(packagePath)
  const managedRuntimeDependencyContract =
    await loadManagedLocalRuntimeDependencyContract(skillRoot)
  const managedRuntimeContractPath = path.join(
    skillRoot,
    'docs',
    'onboarding',
    'managed-local-runtime-dependencies.json'
  )
  const managedRuntimePeerDependencies =
    managedRuntimeDependencyContract?.dependencies ?? {}
  const embeddedSourceSnapshot = resolveManagedLocalRuntimeEmbeddedSourceSnapshotFiles(
    skillRoot,
    managedRuntimeDependencyContract
  )
  const sourcePackageName = embeddedSourceSnapshot.name || ''
  const sourcePackageVersion = embeddedSourceSnapshot.version || ''
  const embeddedSourceSnapshotPath = embeddedSourceSnapshot.snapshotPackageJsonPath || ''
  const sourcePackageTarballRelativePath = embeddedSourceSnapshot.tarball || ''
  const sourcePackageTarballPath = embeddedSourceSnapshot.tarballPath || ''
  const expectedSourcePackageSpec =
    sourcePackageTarballRelativePath
      ? toContextVendorFileSpec(path.basename(sourcePackageTarballRelativePath))
      : ''
  const localRuntimeRoot = path.join(targetRoot, 'src', getManagedLocalRuntimeRoot())
  const localRuntimeEntryPath = path.join(localRuntimeRoot, 'index.js')
  const managedRuntimeSourceRoot = path.join(
    skillRoot,
    'examples',
    'host-integration',
    'src',
    getManagedLocalRuntimeRoot()
  )
  const localRuntimeMaterialized = await pathExists(localRuntimeEntryPath)
  const managedRuntimeSourceAvailable = await pathExists(
    path.join(managedRuntimeSourceRoot, 'index.js')
  )
  const effectiveRuntimeSourceRoot = localRuntimeMaterialized
    ? localRuntimeRoot
    : allowPendingManagedLocalRuntimeMaterialization && managedRuntimeSourceAvailable
      ? managedRuntimeSourceRoot
      : localRuntimeRoot
  const pnpmLockPath = path.join(targetRoot, 'pnpm-lock.yaml')
  const packageLockPath = path.join(targetRoot, 'package-lock.json')
  const yarnLockPath = path.join(targetRoot, 'yarn.lock')
  const pnpmLock = await readTextIfExists(pnpmLockPath)
  const packageLock = await readTextIfExists(packageLockPath)
  const yarnLock = await readTextIfExists(yarnLockPath)
  const legacyBridgeConfig = await findLegacyBridgeConfig(targetRoot)
  const legacyBridgeSource = legacyBridgeConfig.source
  const legacyBridgePolicy = detectLegacyBuildRuntime(pkg, legacyBridgeConfig)
  const entryFilePath = await firstExistingPath(targetRoot, ENTRY_FILE_CANDIDATES)
  const entrySource = await readTextIfExists(entryFilePath)
  const sharedRuntimeDependencyContract = await loadSharedRuntimeDirectDependencySnapshot(skillRoot)
  const requiredSharedRuntimeDirectDependencies = selectEntryImportedSharedRuntimeDirectDependencies({
    entrySource,
    dependencyMap: sharedRuntimeDependencyContract,
  })
  const sharedRuntimeDependencyInspection = await inspectDeclaredSharedRuntimeDirectDependencies({
    targetRoot,
    pkg,
    expectedDependencies: requiredSharedRuntimeDirectDependencies,
  })
  const packageManagerLocks = [
    { name: 'pnpm-lock.yaml', exists: Boolean(pnpmLock), text: pnpmLock },
    { name: 'package-lock.json', exists: Boolean(packageLock), text: packageLock },
    { name: 'yarn.lock', exists: Boolean(yarnLock), text: yarnLock },
  ].filter((item) => item.exists)
  const peerDrifts = []
  const isolatedPeerResolutions = []
  const targetRequire = createRequire(path.join(targetRoot, 'package.json'))
  const runtimeResolvePaths = [targetRoot]
  const shellResolvePaths = [targetRoot]
  const hiuiRuntimeGraph = await collectHiuiRuntimeGraphViolations({
    targetRoot,
    targetRequire,
    runtimeResolvePaths,
    runtimeSourceRoot: effectiveRuntimeSourceRoot,
    managedRuntimePeerDependencies,
    pkg,
    rspackBase: legacyBridgeSource,
  })

  const requiredPeerDependencies = {
    ...managedRuntimePeerDependencies,
    ...HIUI5_REQUIRED_TRANSITIVE_PEERS,
  }

  for (const [depName, expected] of Object.entries(requiredPeerDependencies)) {
    const actual = findDependency(pkg, depName)
    if (isVersionCompatible(actual, expected)) continue

    if ((depName === 'react' || depName === 'react-dom') && actual && legacyBridgeSource.includes('hiui5DesignBridgeIssuerPattern')) {
      isolatedPeerResolutions.push({
        depName,
        declared: actual,
        resolved: actual,
        expected,
        via: 'legacy-host-singleton-runtime-exception',
      })
      continue
    }

    const aliasName = HIUI5_ISOLATED_PEER_ALIASES[depName]
    const aliasSpec = aliasName ? findDependency(pkg, aliasName) : ''
    const aliasCompatibility = aliasName
      ? getIsolatedAliasCompatibility({
          actualSpec: aliasSpec,
          expectedSourceDepName: depName,
          expectedVersion: expected,
        })
      : { compatible: false, actualVersion: '' }
    if (aliasName && aliasCompatibility.compatible) {
      isolatedPeerResolutions.push({
        depName,
        declared: actual || '(missing)',
        aliasName,
        aliasSpec,
        resolved: aliasCompatibility.actualVersion || getVersionFromAliasSpec(aliasSpec),
        expected,
        compatibility: aliasCompatibility.mode,
      })
      continue
    }

    if (expectedMajorForHiuiRuntimePackage(depName) === 5 && bridgeDeclaresPackage(legacyBridgeSource, depName)) {
      const bridgeResolution = await resolveHiui5PackageVersion(targetRoot, depName)
      if (isVersionCompatible(bridgeResolution.version, expected)) {
        isolatedPeerResolutions.push({
          depName,
          declared: actual || '(missing)',
          resolved: bridgeResolution.version,
          expected,
          packageRoot: bridgeResolution.packageRoot,
          via: 'build:hiui5-peer-replacement-bridge-esm',
        })
        continue
      }
    }

    const shellPeerResolution = await resolveInstalledPackageVersion(targetRequire, depName, shellResolvePaths)
    if (isVersionCompatible(shellPeerResolution.version, expected)) {
      isolatedPeerResolutions.push({
        depName,
        declared: actual || '(missing)',
        resolved: shellPeerResolution.version,
        expected,
        packageRoot: shellPeerResolution.packageRoot,
      })
    } else {
      peerDrifts.push({
        depName,
        actual: actual || '(missing)',
        resolved: shellPeerResolution.version || '(unresolved)',
        expected,
      })
    }
  }

  const privateImportViolations = await collectSourcePrivateImportViolations(targetRoot, {
    sourcePackageName,
  })
  const embeddedSourceSnapshotDeclared =
    Boolean(sourcePackageVersion) &&
    Boolean(sourcePackageName) &&
    Boolean(sourcePackageTarballPath) &&
    Boolean(embeddedSourceSnapshotPath)
  const embeddedSourceSnapshotAvailable =
    embeddedSourceSnapshotDeclared &&
    (await pathExists(embeddedSourceSnapshotPath)) &&
    (await pathExists(sourcePackageTarballPath))
  const checks = [
    makeCheck(
      'managed-local-runtime-dependency-contract',
      Object.keys(managedRuntimePeerDependencies).length > 0,
      'error',
      'managed local runtime dependency contract exists',
      Object.keys(managedRuntimePeerDependencies).length > 0
        ? `${path.relative(targetRoot, managedRuntimeContractPath)} declares ${Object.keys(managedRuntimePeerDependencies).length} managed runtime dependencies`
        : `missing or empty ${path.relative(targetRoot, managedRuntimeContractPath)}`,
      { managedRuntimeContractPath }
    ),
    makeCheck(
      'managed-local-runtime-source-package-snapshot',
      embeddedSourceSnapshotDeclared ? embeddedSourceSnapshotAvailable : true,
      embeddedSourceSnapshotDeclared ? 'error' : 'warning',
      'managed local runtime embedded source snapshot is optional in the open-skill distribution',
      embeddedSourceSnapshotDeclared
        ? embeddedSourceSnapshotAvailable
        ? `${sourcePackageName}@${sourcePackageVersion} (${path.relative(targetRoot, embeddedSourceSnapshotPath)}, ${path.relative(targetRoot, sourcePackageTarballPath)})`
        : `managed-local-runtime-dependencies.json declares an embedded source snapshot for ${sourcePackageName || '(missing package name)'}@${sourcePackageVersion || '(unknown version)'}, but the snapshot package.json or tarball is missing`
        : 'No embedded source-package snapshot is declared. The open-skill build treats the materialized runtime source tree as the primary source of truth.',
      {
        sourcePackageName,
        sourcePackageVersion,
        embeddedSourceSnapshotPath,
        sourcePackageTarballPath,
        embeddedSourceSnapshotDeclared,
      }
    ),
    makeCheck(
      'shared-runtime-direct-dependencies',
      sharedRuntimeDependencyInspection.declaredOk && sharedRuntimeDependencyInspection.resolvableOk,
      'error',
      'shared runtime direct dependencies imported by the app entry are declared and resolvable',
      describeSharedRuntimeDirectDependencyInspection(sharedRuntimeDependencyInspection),
      {
        entryFilePath,
        ...sharedRuntimeDependencyInspection,
      }
    ),
    makeCheck(
      'managed-local-runtime-materialized',
      localRuntimeMaterialized ||
        (allowPendingManagedLocalRuntimeMaterialization && managedRuntimeSourceAvailable),
      'error',
      'managed local runtime assets are materialized in the target project',
      localRuntimeMaterialized
        ? path.relative(targetRoot, localRuntimeEntryPath)
        : allowPendingManagedLocalRuntimeMaterialization && managedRuntimeSourceAvailable
          ? `pending materialization allowed; generator will seed from ${path.relative(targetRoot, managedRuntimeSourceRoot)}`
          : `missing ${path.relative(targetRoot, localRuntimeEntryPath)}`,
      {
        localRuntimeRoot: path.relative(targetRoot, localRuntimeRoot),
        localRuntimeEntryPath: path.relative(targetRoot, localRuntimeEntryPath),
        managedRuntimeSourceRoot: path.relative(targetRoot, managedRuntimeSourceRoot),
        pendingMaterializationAllowed:
          allowPendingManagedLocalRuntimeMaterialization && managedRuntimeSourceAvailable,
      }
    ),
    makeCheck(
      'lockfile-present',
      packageManagerLocks.length > 0,
      'error',
      'package manager lockfile exists for dependency isolation validation',
      packageManagerLocks.length > 0
        ? packageManagerLocks.map((item) => item.name).join(', ')
        : 'no supported lockfile found; dependency isolation cannot prove installed resolution stability',
      { lockfiles: packageManagerLocks.map((item) => item.name) }
    ),
    makeCheck(
      'peer-dependencies-compatible-with-managed-runtime-contract',
      peerDrifts.length === 0,
      'error',
      'managed local runtime dependencies stay within the managed runtime contract without breaking legacy root packages',
      peerDrifts.length === 0
        ? isolatedPeerResolutions.length === 0
          ? 'all managed peer dependencies satisfy the runtime contract directly from package.json declarations'
          : `direct=${Object.keys(requiredPeerDependencies).length - isolatedPeerResolutions.length}, isolated=${isolatedPeerResolutions.length}`
        : peerDrifts.slice(0, 20).map((item) => `${item.depName}: declared ${item.actual}, resolved ${item.resolved} -> expected ${item.expected}`).join('; '),
      { peerDrifts, isolatedPeerResolutions }
    ),
    makeCheck(
      'hiui-runtime-graph-uses-hiui5-only',
      hiuiRuntimeGraph.violations.length === 0,
      'error',
      `all @hi-ui visual packages reachable from ${SKILL_PUBLIC_NAME} shells resolve to HiUI5 only`,
      hiuiRuntimeGraph.violations.length === 0
        ? `${hiuiRuntimeGraph.validated.length} reachable @hi-ui package(s) satisfy the HiUI runtime major rule`
        : hiuiRuntimeGraph.violations
            .slice(0, 20)
            .map((item) => `${item.depName}: resolved ${item.resolved} -> expected major ${item.expectedMajor}`)
            .join('; '),
      hiuiRuntimeGraph
    ),
    makeCheck(
      'schema-peer-isolation-alias',
      !legacyBridgePolicy.requiresBridge || hasLegacyBridgeMarkers(legacyBridgeSource),
      'error',
      'legacy project build keeps HiUI5 schema peer packages isolated through the configured replacement bridge',
      !legacyBridgePolicy.requiresBridge
        ? legacyBridgePolicy.detail
        : hasLegacyBridgeMarkers(legacyBridgeSource)
          ? `${legacyBridgeConfig.relativePath} contains hiui5 peer replacement bridge`
          : `${legacyBridgeConfig.relativePath || 'rspack/webpack bridge config'} is missing hiui5 peer replacement bridge markers; keep an issuer-scoped replacement branch covering the managed local runtime plus @hi-ui/schema-*, @hi-ui/dumb-wrapper, and @hi-ui/number-range`,
      {
        rspackBasePath: legacyBridgeConfig.absolutePath || path.join(targetRoot, 'build', 'rspack.base.conf.js'),
        bridgeConfigPath: legacyBridgeConfig.absolutePath,
        bridgeConfigRelativePath: legacyBridgeConfig.relativePath,
      }
    ),
    makeCheck(
      'no-private-source-package-import-paths',
      privateImportViolations.length === 0,
      'error',
      'project source does not bypass dependency isolation with private source-package import paths',
      privateImportViolations.length === 0
        ? 'no private source-package import paths found'
        : privateImportViolations.slice(0, 20).join('; '),
      { privateImportViolations }
    ),
  ]

  const failed = checks.filter((check) => !check.ok && check.severity === 'error')
  return {
    schema: 'hiui-design-dependency-isolation-check.v1',
    reportIntent: `Validate that ${SKILL_PUBLIC_NAME} runtime dependencies remain isolated, pinned, and compatible before page generation.`,
    targetRoot,
    skillRoot,
    status: failed.length === 0 ? 'pass' : 'fail',
    expectedSourcePackageSpec,
    sourcePackageName,
    sourcePackageVersion,
    localRuntimeRoot: path.relative(targetRoot, localRuntimeRoot),
    checks,
    failed,
    summary: buildResultSummary(checks, failed),
    decision: buildDecision({ failed }),
    riskPolicy: {
      browserFreeByDefault: true,
      doesNotInstallDependencies: true,
      doesNotModifyLockfile: true,
    },
  }
}

function renderMarkdown(result) {
  return [
    '# HiUI5 Dependency Isolation Check',
    '',
    '- scope: project-level runtime dependency isolation check',
    `- report intent: ${result.reportIntent}`,
    `- status: ${result.status}`,
    `- sourcePackage: ${result.sourcePackageName || '—'}`,
    `- sourcePackageVersion: ${result.sourcePackageVersion || '—'}`,
    `- expectedSourcePackageSpec: ${result.expectedSourcePackageSpec || '—'}`,
    '',
    '## Summary',
    '',
    `- totalChecks: ${result.summary?.totalChecks ?? result.checks.length}`,
    `- passedChecks: ${result.summary?.passedChecks ?? result.checks.filter((check) => check.ok).length}`,
    `- failedChecks: ${result.summary?.failedChecks ?? result.failed.length}`,
    `- failedCheckIds: ${result.summary?.failedCheckIds?.join(', ') || '—'}`,
    '',
    '## Checks',
    '',
    ...result.checks.map((check) => `- ${check.id}: ${check.ok ? 'pass' : 'fail'} — ${check.detail}`),
    '',
    '## Decision',
    '',
    `- canContinue: ${result.decision?.canContinue}`,
    `- nextAction: ${result.decision?.nextAction}`,
    '',
  ].join('\n')
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
  const skillRoot = path.resolve(scriptDir, '..')
  const targetRoot = path.resolve(options.target)
  const result = await runCheck({
    targetRoot,
    skillRoot,
    allowPendingManagedLocalRuntimeMaterialization:
      options.allowPendingManagedLocalRuntimeMaterialization,
  })
  const jsonReportPath = path.join(skillRoot, 'outputs', 'DEPENDENCY_ISOLATION_REPORT.json')
  const markdownReportPath = path.join(skillRoot, 'outputs', 'DEPENDENCY_ISOLATION_REPORT.md')
  result.reportPath = jsonReportPath
  result.markdownReportPath = markdownReportPath
  await fs.mkdir(path.dirname(jsonReportPath), { recursive: true })
  await fs.writeFile(jsonReportPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  await fs.writeFile(markdownReportPath, `${renderMarkdown(result)}\n`, 'utf8')

  if (options.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
    if (result.status !== 'pass') process.exitCode = 1
    return
  }

  process.stdout.write(`${renderMarkdown(result)}\n`)
  if (result.status !== 'pass') process.exitCode = 1
}

function isDirectCliExecution() {
  if (!process.argv[1]) return false
  return path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
}

if (isDirectCliExecution()) {
  await main()
}
