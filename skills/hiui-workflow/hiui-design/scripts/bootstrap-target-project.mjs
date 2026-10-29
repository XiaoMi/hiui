#!/usr/bin/env node

import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  APPLY_PROGRESS_STATUS,
  clearApplyProgress,
  resolveApplyProgressPath,
  resolveApplyStatePath,
  writeApplyProgress,
  writeApplyState,
} from './lib/apply-state.mjs'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { writeHostAdapterSnippet } from './lib/host-adapter-advice.mjs'
import { inspectIntegrationReadiness } from './lib/integration-readiness.mjs'
import { resolveAutoInstallMode } from './lib/install-mode-resolution.mjs'
import {
  findObjectPropertyRange,
  findRootConfigObjectRange,
  insertIntoObjectLiteral,
} from './lib/js-config-object-edit.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { inspectNodeRuntimePolicy } from './lib/node-runtime-policy.mjs'
import { runProjectNodeScriptSync } from './lib/project-node-launcher.mjs'
import { syncProjectContext } from './lib/project-context-sync.mjs'
import { patchViewportRootStyles } from './lib/root-viewport-style.mjs'
import { writeEnsureOnlyPageTaskStatus } from './lib/page-task-gate.mjs'
import {
  formatInstallModeUsage,
  getInstallModeErrorMessage,
  isRecognizedInstallMode,
} from './lib/mode-contract.mjs'
import { CliUsageError, isCliUsageError } from './lib/cli-usage-error.mjs'
import { getReusableScripts } from './lib/reusable-script-entries.mjs'
import {
  SKILL_PUBLIC_NAME,
  getContextDocPath,
  getContextPath,
  getContextScriptPath,
  resolveProjectContextPath,
} from './lib/skill-identity.mjs'
import {
  getIsolatedAliasCompatibility,
  getVersionFromAliasSpec,
} from './lib/isolated-alias-compat.mjs'
import { loadSharedRuntimeDirectDependencySnapshot } from './lib/shared-runtime-direct-dependencies.mjs'
import { isVersionCompatible } from './lib/version-compatibility.mjs'
import {
  getManagedLocalRuntimeRoot,
  getManagedLocalRuntimeStylePath,
} from './lib/managed-local-runtime-contract.mjs'
import { collectManagedLocalRuntimeProjectDistributionFiles } from './lib/managed-runtime-distribution.mjs'
import {
  loadManagedLocalRuntimeDependencyContract,
  loadManagedLocalRuntimePeerDependencies,
  resolveManagedLocalRuntimeEmbeddedSourceSnapshot,
} from './lib/managed-local-runtime-dependencies.mjs'

const LEGACY_PREVIEW_OUTPUT_ROOT = 'src/typical-page-preview'
const skillRequire = createRequire(import.meta.url)
const {
  HIUI5_ISOLATED_PEER_ALIASES,
  HIUI5_REQUIRED_TRANSITIVE_PEERS,
} = skillRequire('./lib/hiui5-peer-contract.cjs')
const HIUI5_ALIAS_SOURCE_BY_ALIAS_NAME = Object.fromEntries(
  Object.entries(HIUI5_ISOLATED_PEER_ALIASES).map(([sourceDepName, aliasDepName]) => [
    aliasDepName,
    sourceDepName,
  ])
)
const DEFAULT_INSTALL_TIMEOUT_MS = 5 * 60 * 1000

function stripJsonComments(source) {
  let output = ''
  let inString = false
  let quote = ''
  let escaped = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    const next = source[index + 1]

    if (inString) {
      output += char
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        inString = false
        quote = ''
      }
      continue
    }

    if (char === '"' || char === "'") {
      inString = true
      quote = char
      output += char
      continue
    }

    if (char === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') index += 1
      output += '\n'
      continue
    }

    if (char === '/' && next === '*') {
      index += 2
      while (index < source.length && !(source[index] === '*' && source[index + 1] === '/')) {
        if (source[index] === '\n') output += '\n'
        index += 1
      }
      index += 1
      continue
    }

    output += char
  }

  return output
}

function resolveManagedOutputRoot({ targetRoot, mode }) {
  const bucketName = mode === 'host-integration' ? 'host-integration-guidance' : 'rules-only-guidance'

  return resolveProjectContextPath(targetRoot, 'outputs', bucketName)
}

function resolveSchemaTypesShimPath(targetRoot) {
  return resolveProjectContextPath(
    targetRoot,
    'examples',
    'host-integration',
    'src',
    'shims',
    'schema-types-empty.js'
  )
}

function resolveManagedLocalRuntimeSourceRoot(skillRoot) {
  return path.join(
    skillRoot,
    'examples',
    'host-integration',
    'src',
    getManagedLocalRuntimeRoot()
  )
}

function resolveTargetManagedLocalRuntimeRoot(targetRoot) {
  return path.join(targetRoot, 'src', getManagedLocalRuntimeRoot())
}

function printUsage() {
  console.log(`Usage:
  node scripts/bootstrap-target-project.mjs --target <project-root> [--mode <${formatInstallModeUsage()}>] [--line <line-id>] [--install] [--install-timeout-ms <ms>] [--init-i18n]

Options:
  --target      Target project root. Required.
  --mode        Install mode. Default: auto. Auto reuses recorded mode evidence first, then chooses host-integration unless the target would require a project-local compatibility bridge.
  --line        Optional business-line overlay id. Example: retail
  --install     Run the target project's package manager install command after patching package.json
  --install-timeout-ms  Timeout for dependency install command. Default: ${DEFAULT_INSTALL_TIMEOUT_MS}
  --init-i18n   Explicitly provision src/translation baseline assets and register the rerun script.
`)
}

function parseArgs(argv) {
  const options = {
    i18nInitMode: 'none',
    install: false,
    installTimeoutMs: DEFAULT_INSTALL_TIMEOUT_MS,
    line: '',
    mode: 'auto',
    target: '',
  }
  const deprecatedArgs = new Set(['--shells-spec'])
  const removedPreviewArgs = new Set([
    '--materialize-preview',
    '--with-host-assets',
    '--dest',
    '--route-file',
    '--force',
  ])

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--install') {
      options.install = true
      continue
    }

    if (arg === '--init-i18n') {
      options.i18nInitMode = 'init'
      continue
    }

    if (deprecatedArgs.has(arg)) {
      throw new CliUsageError(
        `${arg} is no longer supported. Managed local runtime dependencies now come from docs/onboarding/managed-local-runtime-dependencies.json, so remove this flag.`
      )
    }

    if (removedPreviewArgs.has(arg)) {
      throw new CliUsageError(
        `${arg} is no longer supported. Preview examples now stay in the packaged preview runtime and are not materialized into target projects.`
      )
    }

    if (
      arg === '--target' ||
      arg === '--mode' ||
      arg === '--line' ||
      arg === '--install-timeout-ms'
    ) {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new CliUsageError(`Missing value for ${arg}`)
      }
      const key =
        arg === '--mode'
          ? 'mode'
          : arg === '--line'
            ? 'line'
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

    throw new CliUsageError(`Unknown argument: ${arg}`)
  }

  if (!options.target) {
    throw new CliUsageError('Missing required --target <project-root>')
  }

  if (!isRecognizedInstallMode(options.mode)) {
    throw new CliUsageError(getInstallModeErrorMessage())
  }

  if (!Number.isFinite(options.installTimeoutMs) || options.installTimeoutMs <= 0) {
    throw new CliUsageError('Expected --install-timeout-ms to be a positive number')
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

function sortObjectKeys(input) {
  return Object.fromEntries(Object.entries(input).sort(([a], [b]) => a.localeCompare(b)))
}

function splitScriptChain(scriptValue) {
  return String(scriptValue || '')
    .split('&&')
    .map((item) => item.trim())
    .filter(Boolean)
}

function upsertScriptCommand(scriptValue, command) {
  const commands = splitScriptChain(scriptValue)
  if (commands.includes(command)) {
    return {
      nextValue: scriptValue,
      action: 'unchanged',
    }
  }

  return {
    nextValue: commands.length === 0 ? command : `${commands.join(' && ')} && ${command}`,
    action: commands.length === 0 ? 'added' : 'updated',
  }
}

function removeScriptCommand(scriptValue, command) {
  const commands = splitScriptChain(scriptValue)
  const nextCommands = commands.filter((item) => item !== command)

  if (nextCommands.length === commands.length) {
    return {
      nextValue: scriptValue,
      action: 'unchanged',
    }
  }

  return {
    nextValue: nextCommands.join(' && '),
    action: 'updated',
  }
}

function upsertManagedDependency({
  dependencies,
  devDependencies,
  peerDeps,
  depName,
  depVersion,
  preserveCompatibleRange = false,
}) {
  if (Object.prototype.hasOwnProperty.call(dependencies, depName)) {
    const previous = dependencies[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }
    if (preserveCompatibleRange && isVersionCompatible(previous, depVersion)) {
      return { action: 'preserved-compatible', previous }
    }
    dependencies[depName] = depVersion
    return { action: 'updated', previous }
  }

  if (Object.prototype.hasOwnProperty.call(devDependencies, depName)) {
    const previous = devDependencies[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }
    if (preserveCompatibleRange && isVersionCompatible(previous, depVersion)) {
      return { action: 'preserved-compatible', previous }
    }
    devDependencies[depName] = depVersion
    return { action: 'updated', previous }
  }

  if (Object.prototype.hasOwnProperty.call(peerDeps, depName)) {
    const previous = peerDeps[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }
    if (preserveCompatibleRange && isVersionCompatible(previous, depVersion)) {
      return { action: 'preserved-compatible', previous }
    }
    peerDeps[depName] = depVersion
    return { action: 'updated', previous }
  }

  dependencies[depName] = depVersion
  return { action: 'added', previous: '' }
}

function findManagedDependencyEntry({ dependencies, devDependencies, peerDeps, depName }) {
  if (Object.prototype.hasOwnProperty.call(dependencies, depName)) {
    return {
      bucketName: 'dependencies',
      previous: dependencies[depName],
    }
  }

  if (Object.prototype.hasOwnProperty.call(devDependencies, depName)) {
    return {
      bucketName: 'devDependencies',
      previous: devDependencies[depName],
    }
  }

  if (Object.prototype.hasOwnProperty.call(peerDeps, depName)) {
    return {
      bucketName: 'peerDependencies',
      previous: peerDeps[depName],
    }
  }

  return {
    bucketName: '',
    previous: '',
  }
}

async function readJsonFile(jsonPath) {
  const raw = await fs.readFile(jsonPath, 'utf8')
  return JSON.parse(raw)
}

async function loadSkillVersion(skillRoot) {
  const manifestPath = path.join(skillRoot, 'skill.manifest.json')
  try {
    const manifest = await readJsonFile(manifestPath)
    const manifestVersion = String(manifest?.version || '').trim()
    if (manifestVersion) {
      return {
        contextPath: manifestPath,
        version: manifestVersion,
      }
    }
  } catch {
    // Fall back to the legacy context file when the manifest is unavailable.
  }

  const contextPath = path.join(skillRoot, '.context.jsonc')
  const raw = await fs.readFile(contextPath, 'utf8')
  const context = JSON.parse(stripJsonComments(raw))

  return {
    contextPath,
    version: String(context?.version || '').trim(),
  }
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

async function materializeManagedLocalRuntimeAssets({ skillRoot, targetRoot }) {
  const sourceRoot = resolveManagedLocalRuntimeSourceRoot(skillRoot)
  const targetRuntimeRoot = resolveTargetManagedLocalRuntimeRoot(targetRoot)
  const sourceFiles = await collectManagedLocalRuntimeProjectDistributionFiles({
    sourceRoot,
    targetRoot: targetRuntimeRoot,
  })

  const syncedFiles = []
  for (const file of sourceFiles) {
    await ensureDir(path.dirname(file.destPath))
    if (typeof file.content === 'string') {
      await fs.writeFile(file.destPath, file.content, 'utf8')
    } else {
      await fs.writeFile(file.destPath, file.binaryContent)
    }
    syncedFiles.push(file.destPath)
  }

  return {
    status: 'materialized',
    sourceRoot,
    targetRoot: targetRuntimeRoot,
    syncedFiles,
  }
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

function toNpmAliasSpec(depName, depVersion) {
  return `npm:${depName}@${depVersion}`
}

function buildHiui5IsolatedAliasDependencies(peerDependencies = {}) {
  const expectedSourceDependencies = {
    ...peerDependencies,
    ...HIUI5_REQUIRED_TRANSITIVE_PEERS,
  }
  const isolatedAliasDependencies = {}

  for (const [sourceDepName, aliasDepName] of Object.entries(HIUI5_ISOLATED_PEER_ALIASES)) {
    const depVersion = expectedSourceDependencies[sourceDepName]
    if (!depVersion) continue
    isolatedAliasDependencies[aliasDepName] = toNpmAliasSpec(sourceDepName, depVersion)
  }

  return isolatedAliasDependencies
}

function upsertManagedIsolatedAliasDependency({
  dependencies,
  devDependencies,
  peerDeps,
  depName,
  depVersion,
  expectedSourceDepName,
}) {
  const buckets = [dependencies, devDependencies, peerDeps]

  for (const bucket of buckets) {
    if (!Object.prototype.hasOwnProperty.call(bucket, depName)) continue

    const previous = bucket[depName]
    if (previous === depVersion) return { action: 'unchanged', previous }

    const compatibility = getIsolatedAliasCompatibility({
      actualSpec: previous,
      expectedSourceDepName,
      expectedVersion: getVersionFromAliasSpec(depVersion),
    })
    if (compatibility.compatible) {
      return { action: 'preserved-compatible', previous }
    }

    bucket[depName] = depVersion
    return { action: 'updated', previous }
  }

  dependencies[depName] = depVersion
  return { action: 'added', previous: '' }
}

async function loadHostIntegrationDependencies(
  skillRoot,
  peerDependencies,
  sharedRuntimeDirectDependencies = {},
  { sourcePackageName = '' } = {}
) {
  const referencePath = path.join(skillRoot, 'docs', 'onboarding', 'host-integration-dependencies.json')
  const assetRoot = path.join(skillRoot, 'examples', 'host-integration', 'src')
  const reference = await readJsonFile(referencePath)
  const versionMap = reference?.dependencies ?? {}
  const ignoredPackages = new Set([
    // The vendored upstream shell package remains provenance only; bootstrap
    // must not treat it as a direct dependency of the target project.
    ...(sourcePackageName ? [sourcePackageName] : []),
    'react',
    'react-dom',
    ...Object.keys(peerDependencies ?? {}),
    ...Object.keys(sharedRuntimeDirectDependencies ?? {}),
  ])

  const files = await collectSourceFiles(assetRoot)
  const requiredPackages = new Set()

  for (const filePath of files) {
    if (filePath.endsWith('.d.ts')) {
      continue
    }
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

function shouldRequireManagedRuntimePatch({ hostProfile, pkg }) {
  const reactMajor = Number(hostProfile?.reactMajor || 0)
  if (reactMajor >= 19) return true

  const declaredReactSpecs = [
    findDeclaredDependency(pkg, 'react'),
    findDeclaredDependency(pkg, 'react-dom'),
  ].filter(Boolean)

  if (declaredReactSpecs.some((spec) => parseDeclaredMajorVersion(spec) >= 19)) {
    return true
  }

  return shouldUseLegacyRulesOnlyPeerIsolation(hostProfile)
}

function shouldUseLegacyRulesOnlyPeerIsolation(hostProfile) {
  const framework = String(hostProfile?.framework || '')

  return (
    hostProfile?.projectType === 'existing-system' &&
    hostProfile?.riskLevel === 'high' &&
    (hostProfile?.hasModuleFederation ||
      hostProfile?.legacyReactRuntime ||
      hostProfile?.hiuiFacts?.hasMixedRuntimePackages ||
      hostProfile?.hiuiFacts?.hasLegacyRuntimePackages ||
      ['rspack-module-federation', 'webpack-module-federation', 'rspack-react', 'webpack-react', 'micro-frontend'].includes(
        framework
      ))
  )
}

function shouldIsolateRulesOnlyPeerAtAliasLayer({ mode, hostProfile, depName }) {
  return (
    mode === 'rules-only' &&
    shouldUseLegacyRulesOnlyPeerIsolation(hostProfile) &&
    Object.prototype.hasOwnProperty.call(HIUI5_ISOLATED_PEER_ALIASES, depName)
  )
}

async function patchPackageJson({
  targetRoot,
  peerDependencies,
  isolatedAliasDependencies,
  directDependencies,
  line,
  mode,
  hostProfile,
  managedRuntimePatchRequired,
  includeI18nInitScript = false,
}) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  if (!(await pathExists(packageJsonPath))) {
    return {
      status: 'missing',
      packageJsonPath,
      addedDeps: [],
      isolatedPeerDeps: [],
      preservedRootPeerDeps: [],
      updatedDeps: [],
      addedScripts: [],
      updatedScripts: [],
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
  const isolatedPeerDeps = []
  const preservedRootPeerDeps = []
  const updatedDeps = []
  const addedScripts = []
  const updatedScripts = []
  const skippedScripts = []
  const expectedScripts = getReusableScripts(line, {
    includeManagedRuntimePatchScripts: managedRuntimePatchRequired,
    includeI18nInitScript,
  })
  const managedRuntimePatchScripts = getReusableScripts(line, {
    includeManagedRuntimePatchScripts: true,
  })
  const i18nInitScripts = getReusableScripts(line, {
    includeManagedRuntimePatchScripts: false,
    includeI18nInitScript: true,
  })
  const managedRuntimePatchScriptNames = [
    'typical-page:runtime-patch',
    'typical-page:react19-runtime-patch',
  ]

  for (const [depName, depVersion] of Object.entries(peerDependencies)) {
    if (
      shouldIsolateRulesOnlyPeerAtAliasLayer({
        mode,
        hostProfile,
        depName,
      })
    ) {
      isolatedPeerDeps.push(depName)
      const existingEntry = findManagedDependencyEntry({
        dependencies,
        devDependencies,
        peerDeps,
        depName,
      })
      if (existingEntry.previous) {
        preservedRootPeerDeps.push(`${depName} (${existingEntry.previous})`)
      }
      continue
    }

    const result = upsertManagedDependency({
      dependencies,
      devDependencies,
      peerDeps,
      depName,
      depVersion,
      preserveCompatibleRange: depName === 'react' || depName === 'react-dom',
    })

    if (result.action === 'added') {
      addedDeps.push(depName)
    } else if (result.action === 'updated') {
      updatedDeps.push(`${depName} (${result.previous} -> ${depVersion})`)
    }
  }

  for (const [depName, depVersion] of Object.entries(isolatedAliasDependencies ?? {})) {
    const result = upsertManagedIsolatedAliasDependency({
      dependencies,
      devDependencies,
      peerDeps,
      depName,
      depVersion,
      expectedSourceDepName: HIUI5_ALIAS_SOURCE_BY_ALIAS_NAME[depName] || '',
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

  for (const [scriptName, scriptValue] of Object.entries(expectedScripts)) {
    if (scripts[scriptName] == null) {
      scripts[scriptName] = scriptValue
      addedScripts.push(scriptName)
      continue
    }

    if (scripts[scriptName] !== scriptValue) {
      skippedScripts.push(scriptName)
    }
  }

  if (!managedRuntimePatchRequired) {
    for (const scriptName of managedRuntimePatchScriptNames) {
      const expectedManagedScript = managedRuntimePatchScripts[scriptName]
      if (scripts[scriptName] !== expectedManagedScript) continue
      delete scripts[scriptName]
      updatedScripts.push(scriptName)
    }
  }

  if (!includeI18nInitScript) {
    const expectedI18nInitScript = i18nInitScripts['typical-page:i18n:init']
    if (scripts['typical-page:i18n:init'] === expectedI18nInitScript) {
      delete scripts['typical-page:i18n:init']
      updatedScripts.push('typical-page:i18n:init')
    }
  }

  const legacyReact19PatchCommand = `node "${getContextScriptPath('apply-react19-runtime-patches.mjs')}"`
  const runtimePatchCommand = `node "${getContextScriptPath('apply-runtime-patches.mjs')}"`
  const removeLegacyResult = removeScriptCommand(scripts.postinstall, legacyReact19PatchCommand)
  const removeManagedResult = removeScriptCommand(removeLegacyResult.nextValue, runtimePatchCommand)

  if (managedRuntimePatchRequired) {
    const postinstallResult = upsertScriptCommand(removeLegacyResult.nextValue, runtimePatchCommand)

    if (
      removeLegacyResult.action !== 'unchanged' ||
      postinstallResult.action !== 'unchanged'
    ) {
      scripts.postinstall = postinstallResult.nextValue
      if (
        removeLegacyResult.action === 'unchanged' &&
        postinstallResult.action === 'added'
      ) {
        addedScripts.push('postinstall')
      } else {
        updatedScripts.push('postinstall')
      }
    }
  } else if (
    removeLegacyResult.action !== 'unchanged' ||
    removeManagedResult.action !== 'unchanged'
  ) {
    if (removeManagedResult.nextValue) {
      scripts.postinstall = removeManagedResult.nextValue
    } else {
      delete scripts.postinstall
    }
    updatedScripts.push('postinstall')
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
      isolatedPeerDeps,
      preservedRootPeerDeps,
      updatedDeps,
      addedScripts,
      updatedScripts,
      skippedScripts,
    }
  }

  await fs.writeFile(packageJsonPath, nextRaw, 'utf8')
  return {
    status: 'updated',
    packageJsonPath,
    addedDeps,
    isolatedPeerDeps,
    preservedRootPeerDeps,
    updatedDeps,
    addedScripts,
    updatedScripts,
    skippedScripts,
  }
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

async function detectRspackLikeDevConfigFile(targetRoot) {
  const candidates = [
    'build/rspack.dev.conf.js',
    'build/rspack.dev.conf.ts',
    'build/webpack.dev.conf.js',
    'build/webpack.dev.conf.ts',
    'rspack.config.js',
    'rspack.config.ts',
    'webpack.config.js',
    'webpack.config.ts',
  ]

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) {
      return absPath
    }
  }

  return ''
}

const MANAGED_CAMORA_NO_CACHE_HEADERS = Object.freeze({
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
})

function escapeRegExp(source) {
  return String(source || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function hasObjectPropertyKey(source, propertyName) {
  return new RegExp(`(?:['"]${escapeRegExp(propertyName)}['"]|\\b${escapeRegExp(propertyName)}\\b)\\s*:`).test(
    source
  )
}

function buildManagedCamoraNoCacheHeaderBlock(missingHeaderEntries) {
  return missingHeaderEntries
    .map(([headerName, headerValue]) => `${JSON.stringify(headerName)}: ${JSON.stringify(headerValue)}`)
    .join(',\n')
}

async function writeCamoraDevServerNoCacheSnippet({ outputRoot, devConfigFile }) {
  const snippetPath = path.join(outputRoot, 'CAMORA_DEVSERVER_NO_CACHE_SNIPPET.md')
  const configLabel = devConfigFile
    ? path.relative(path.dirname(outputRoot), devConfigFile)
    : 'your Rspack/Webpack dev config'
  const headerBlock = buildManagedCamoraNoCacheHeaderBlock(
    Object.entries(MANAGED_CAMORA_NO_CACHE_HEADERS)
  )
  const content = `# Camora DevServer No-Cache Snippet

Camora regex proxy hosts can observe a mixed runtime when the browser or proxy keeps an older chunk while the live \`remoteEntry.js\` has already changed.
Add the managed no-cache headers below to the devServer responses so local remote debug uses a single fresh runtime source.

## Suggested target

- ${configLabel}

## Headers block

\`\`\`ts
devServer: {
  headers: {
    ${headerBlock.replace(/\n/g, '\n    ')}
  },
}
\`\`\`
`

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

async function patchCamoraDevServerNoCacheHeaders({ targetRoot, outputRoot, hostProfile }) {
  const remoteDebugContract = hostProfile?.remoteDebugContract || {}
  if (!(remoteDebugContract.enabled && remoteDebugContract.mode === 'camora-regex-proxy')) {
    return {
      status: 'not-applicable',
      devConfigFile: '',
      snippetPath: '',
      addedHeaders: [],
    }
  }

  const devConfigFile = await detectRspackLikeDevConfigFile(targetRoot)
  if (!devConfigFile) {
    const snippetPath = await writeCamoraDevServerNoCacheSnippet({ outputRoot, devConfigFile: '' })
    return {
      status: 'not-detected',
      devConfigFile: '',
      snippetPath,
      addedHeaders: [],
    }
  }

  const raw = await fs.readFile(devConfigFile, 'utf8')
  const missingHeaderEntries = Object.entries(MANAGED_CAMORA_NO_CACHE_HEADERS).filter(
    ([headerName]) => !hasObjectPropertyKey(raw, headerName)
  )

  if (missingHeaderEntries.length === 0) {
    return {
      status: 'already-patched',
      devConfigFile,
      snippetPath: '',
      addedHeaders: [],
    }
  }

  const headerBlock = buildManagedCamoraNoCacheHeaderBlock(missingHeaderEntries)
  const headersRange = findObjectPropertyRange(raw, 'headers')
  if (headersRange) {
    const nextRaw = insertIntoObjectLiteral(raw, headersRange, headerBlock)
    await fs.writeFile(devConfigFile, nextRaw, 'utf8')
    return {
      status: 'patched',
      devConfigFile,
      snippetPath: '',
      addedHeaders: missingHeaderEntries.map(([headerName]) => headerName),
    }
  }

  const devServerRange = findObjectPropertyRange(raw, 'devServer')
  if (devServerRange) {
    const nextRaw = insertIntoObjectLiteral(raw, devServerRange, `headers: {\n  ${headerBlock.replace(/\n/g, '\n  ')}\n}`)
    await fs.writeFile(devConfigFile, nextRaw, 'utf8')
    return {
      status: 'patched',
      devConfigFile,
      snippetPath: '',
      addedHeaders: missingHeaderEntries.map(([headerName]) => headerName),
    }
  }

  const rootRange = findRootConfigObjectRange(raw)
  if (rootRange) {
    const nextRaw = insertIntoObjectLiteral(
      raw,
      rootRange,
      `devServer: {\n  headers: {\n    ${headerBlock.replace(/\n/g, '\n    ')}\n  }\n}`
    )
    await fs.writeFile(devConfigFile, nextRaw, 'utf8')
    return {
      status: 'patched',
      devConfigFile,
      snippetPath: '',
      addedHeaders: missingHeaderEntries.map(([headerName]) => headerName),
    }
  }

  const snippetPath = await writeCamoraDevServerNoCacheSnippet({ outputRoot, devConfigFile })
  return {
    status: 'snippet-only',
    devConfigFile,
    snippetPath,
    addedHeaders: missingHeaderEntries.map(([headerName]) => headerName),
  }
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

async function patchViteSchemaTypesAlias({ targetRoot, outputRoot, shimPath }) {
  const viteFile = await detectViteConfigFile(targetRoot)

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
          ? `${command} timed out after ${timeoutMs}ms. Large first-time dependency installs can take longer; rerun with --install-timeout-ms <ms> if the target project is still provisioning packages normally.`
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

async function inspectInstallPreflight(targetRoot) {
  const manager = await detectPackageManager(targetRoot)
  const args = getInstallArgs(manager)
  const command = [manager, ...args].join(' ')
  const nodeRuntimePolicy = await inspectNodeRuntimePolicy(targetRoot)

  if (nodeRuntimePolicy.blocking) {
    return {
      status: 'blocked',
      command,
      message: `Dependency install was blocked before execution. ${nodeRuntimePolicy.detail}`,
    }
  }

  return {
    status: 'ready',
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
    status: 'initialized (--init-i18n)',
    command: `node ".local-context/hiui-design/scripts/init-i18n.mjs" --target ${targetRoot}`,
    ...details,
  }
}

async function runI18nInit({ skillRoot, targetRoot }) {
  const i18nScriptPath = path.join(skillRoot, 'scripts', 'init-i18n.mjs')
  const { result } = await runProjectNodeScriptSync({
    targetRoot,
    scriptPath: i18nScriptPath,
    scriptArgs: ['--target', targetRoot],
    cwd: skillRoot,
    capture: true,
  })

  if (result.status !== 0) {
    const stderr = result.stderr?.trim()
    const stdout = result.stdout?.trim()
    throw new Error(stderr || stdout || 'init-i18n.mjs failed')
  }

  return parseI18nInitOutput(result.stdout, targetRoot)
}

async function writeStyleImportSnippet({ outputRoot, entryFile, styleImportPath }) {
  const snippetPath = path.join(outputRoot, 'STYLE_IMPORT_SNIPPET.md')
  const entryLabel = entryFile ? path.basename(entryFile) : 'your app entry file'
  const content = `# Style Import Snippet

Import the React compatibility patch and the managed local runtime styles once in the target project's app entry.

## Imports

\`\`\`ts
import '@hi-ui/patch-for-react'
import '${styleImportPath || './components/hiui-design-runtime/styles.css'}'
\`\`\`

## Suggested target

- ${entryLabel}
`

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

function buildRulesOnlyHostBaselineSource() {
  return `/* hiui-design managed public viewport baseline for rules-only mode. */
body {
  margin: 0;
  width: 100%;
  min-width: 320px;
  min-height: 100vh;
}

html,
#root,
#app,
#__next {
  width: 100%;
  min-height: 100vh;
}
`
}

function buildRelativeImportSpecifier(fromFilePath, toFilePath) {
  const relativePath = path.relative(path.dirname(fromFilePath), toFilePath).replace(/\\/g, '/')
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}

function getSourceLines(source) {
  return source.match(/.*(?:\n|$)/g) ?? []
}

function isCompleteImportStatement(statement) {
  const normalizedStatement = statement.trim()
  if (!normalizedStatement.startsWith('import')) {
    return false
  }

  return (
    /^import\s+['"][^'"]+['"]\s*;?$/.test(normalizedStatement) ||
    /\bfrom\s+['"][^'"]+['"]\s*;?$/.test(normalizedStatement)
  )
}

function collectTopLevelImportStatements(source) {
  const imports = []
  const lines = getSourceLines(source)
  let offset = 0
  let blockCommentOpen = false
  let currentImportStart = -1
  let currentImportStatement = ''

  for (const line of lines) {
    const trimmedLine = line.trim()

    if (currentImportStart >= 0) {
      currentImportStatement += line

      if (isCompleteImportStatement(currentImportStatement)) {
        imports.push({
          end: offset + line.length,
          start: currentImportStart,
          statement: currentImportStatement,
        })
        currentImportStart = -1
        currentImportStatement = ''
      }

      offset += line.length
      continue
    }

    if (blockCommentOpen) {
      offset += line.length
      if (trimmedLine.includes('*/')) {
        blockCommentOpen = false
      }
      continue
    }

    if (!trimmedLine) {
      offset += line.length
      continue
    }

    if (trimmedLine.startsWith('//')) {
      offset += line.length
      continue
    }

    if (trimmedLine.startsWith('/*')) {
      offset += line.length
      if (!trimmedLine.includes('*/')) {
        blockCommentOpen = true
      }
      continue
    }

    if (/^\s*import\b/.test(line)) {
      currentImportStart = offset
      currentImportStatement = line

      if (isCompleteImportStatement(currentImportStatement)) {
        imports.push({
          end: offset + line.length,
          start: currentImportStart,
          statement: currentImportStatement,
        })
        currentImportStart = -1
        currentImportStatement = ''
      }

      offset += line.length
      continue
    }

    break
  }

  return imports
}

function appendImportStatement(source, importStatement) {
  const normalizedImportStatement = importStatement.trim().replace(/;$/, '').replace(/"/g, "'")
  const existingImportStatement = getSourceLines(source).some(
    (line) => line.trim().replace(/;$/, '').replace(/"/g, "'") === normalizedImportStatement
  )
  if (existingImportStatement) return source

  const importStatements = collectTopLevelImportStatements(source)
  const insertionIndex =
    importStatements.length > 0 ? importStatements[importStatements.length - 1].end : 0

  const prefix = source.slice(0, insertionIndex)
  const suffix = source.slice(insertionIndex)
  const needsLeadingNewline = insertionIndex > 0 && !prefix.endsWith('\n')
  const normalizedImport = `${needsLeadingNewline ? '\n' : ''}${importStatement}\n`
  return `${prefix}${normalizedImport}${suffix}`
}

function stripStandaloneImportLines(source, requiredImportLines) {
  const normalizedRequiredImportLines = new Set(
    requiredImportLines.map((line) => line.trim().replace(/;$/, '').replace(/"/g, "'"))
  )

  return getSourceLines(source)
    .filter((line) => {
      const normalizedLine = line.trim().replace(/;$/, '').replace(/"/g, "'")
      return !normalizedRequiredImportLines.has(normalizedLine)
    })
    .join('')
}

async function writeRulesOnlyHostBaselineSnippet({
  outputRoot,
  entryFile,
  hostBaselineImportPath,
  hostBaselineFile,
}) {
  const snippetPath = path.join(outputRoot, 'RULES_ONLY_HOST_BASELINE_SNIPPET.md')
  const entryLabel = entryFile ? path.basename(entryFile) : 'your app entry file'
  const baselineLabel = hostBaselineFile ? path.basename(hostBaselineFile) : 'hiui-design-host.generated.css'
  const content = `# Rules-Only Host Baseline Snippet

Rules-only mode still needs a project-local host baseline so the public viewport contract can be proven before page generation.

## Add this import to the app entry

\`\`\`ts
import '${hostBaselineImportPath || './hiui-design-host.generated.css'}'
\`\`\`

## Create this file next to the entry

\`\`\`css
${buildRulesOnlyHostBaselineSource().trim()}
\`\`\`

## Suggested target

- entry: ${entryLabel}
- host baseline file: ${baselineLabel}
`

  await ensureDir(path.dirname(snippetPath))
  await fs.writeFile(snippetPath, content, 'utf8')
  return snippetPath
}

async function patchStyleImport({ targetRoot, outputRoot }) {
  const resolvedEntryFile = await detectAppEntryFile(targetRoot)
  const localRuntimeStyleFile = path.join(
    targetRoot,
    getManagedLocalRuntimeStylePath(resolvedEntryFile || 'src/main.jsx')
  )
  const localRuntimeStyleImportPath = resolvedEntryFile
    ? buildRelativeImportSpecifier(resolvedEntryFile, localRuntimeStyleFile)
    : './components/hiui-design-runtime/styles.css'
  if (!resolvedEntryFile || !(await pathExists(resolvedEntryFile))) {
    const snippetPath = await writeStyleImportSnippet({
      outputRoot,
      entryFile: '',
      styleImportPath: localRuntimeStyleImportPath,
    })
    return { status: 'snippet-only', entryFile: '', snippetPath }
  }

  const raw = await fs.readFile(resolvedEntryFile, 'utf8')
  const requiredImportLines = [
    `import '@hi-ui/patch-for-react'`,
    `import '${localRuntimeStyleImportPath}'`,
  ]
  let nextSource = stripStandaloneImportLines(raw, requiredImportLines)
  for (const requiredImportLine of requiredImportLines) {
    nextSource = appendImportStatement(nextSource, requiredImportLine)
  }
  if (nextSource === raw || `${nextSource}\n` === raw) {
    return { status: 'already-imported', entryFile: resolvedEntryFile, snippetPath: '' }
  }
  await fs.writeFile(resolvedEntryFile, nextSource.endsWith('\n') ? nextSource : `${nextSource}\n`, 'utf8')

  return { status: 'patched', entryFile: resolvedEntryFile, snippetPath: '' }
}

async function patchRulesOnlyHostBaseline({ targetRoot, outputRoot, mode }) {
  if (mode !== 'rules-only') {
    return {
      status: 'not-applied',
      entryFile: '',
      hostBaselineFile: '',
      snippetPath: '',
    }
  }

  const resolvedEntryFile = await detectAppEntryFile(targetRoot)
  if (!resolvedEntryFile || !(await pathExists(resolvedEntryFile))) {
    const snippetPath = await writeRulesOnlyHostBaselineSnippet({
      outputRoot,
      entryFile: '',
      hostBaselineImportPath: './hiui-design-host.generated.css',
      hostBaselineFile: '',
    })
    return {
      status: 'snippet-only',
      entryFile: '',
      hostBaselineFile: '',
      snippetPath,
    }
  }

  const hostBaselineFile = path.join(path.dirname(resolvedEntryFile), 'hiui-design-host.generated.css')
  const hostBaselineSource = buildRulesOnlyHostBaselineSource()
  const relativeHostBaselineFile = path.relative(targetRoot, hostBaselineFile).replace(/\\/g, '/')
  const hostBaselineImportPath = buildRelativeImportSpecifier(resolvedEntryFile, hostBaselineFile)
  let baselineChanged = false

  if (!(await pathExists(hostBaselineFile))) {
    await ensureDir(path.dirname(hostBaselineFile))
    await fs.writeFile(hostBaselineFile, hostBaselineSource, 'utf8')
    baselineChanged = true
  } else {
    const rawBaseline = await fs.readFile(hostBaselineFile, 'utf8')
    if (rawBaseline !== hostBaselineSource) {
      await fs.writeFile(hostBaselineFile, hostBaselineSource, 'utf8')
      baselineChanged = true
    }
  }

  const rawEntry = await fs.readFile(resolvedEntryFile, 'utf8')
  const hasHostBaselineImport =
    rawEntry.includes(`import '${hostBaselineImportPath}'`) ||
    rawEntry.includes(`import "${hostBaselineImportPath}"`)

  if (hasHostBaselineImport) {
    return {
      status: baselineChanged ? 'patched' : 'already-patched',
      entryFile: resolvedEntryFile,
      hostBaselineFile: relativeHostBaselineFile,
      snippetPath: '',
    }
  }

  const lines = rawEntry.split('\n')
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
    `import '${hostBaselineImportPath}'`,
    ...lines.slice(insertIndex),
  ]
  await fs.writeFile(resolvedEntryFile, `${nextLines.join('\n')}\n`, 'utf8')

  return {
    status: 'patched',
    entryFile: resolvedEntryFile,
    hostBaselineFile: relativeHostBaselineFile,
    snippetPath: '',
  }
}

async function writeBootstrapSummary({
  applyStatePath,
  hostProfile,
  hostAdapterSnippetPath,
  skillVersion,
  line,
  manifestPath,
  mode,
  modeSource,
  outputRoot,
  legacyHiUi4Deps,
  localRuntimeMaterializationResult,
  packageResult,
  rulesOnlyHostBaselineResult,
  rootViewportResult,
  i18nInitResult,
  styleResult,
  viteResult,
  camoraDevServerNoCacheResult,
  installResult,
  installRequested,
}) {
  const summaryPath = path.join(outputRoot, 'BOOTSTRAP_SUMMARY.md')
  const lines = [
    '# Typical Page Preview Bootstrap Summary',
    '',
    '## Result',
    `- project type: ${hostProfile.projectType}`,
    `- detected framework: ${hostProfile.framework}`,
    `- runtime: ${hostProfile.runtime}`,
    `- routing: ${hostProfile.routing}`,
    `- integration strategy: ${hostProfile.strategy}`,
    `- mode: ${mode}`,
    `- mode source: ${modeSource}`,
    `- ${SKILL_PUBLIC_NAME} version: ${skillVersion || '(missing)'}`,
    ...(line ? [`- business line: ${line}`] : []),
    `- preview asset policy: ${mode === 'host-integration' ? 'global-skill-only' : `not-applicable (${mode})`}`,
    `- managed local runtime assets: ${localRuntimeMaterializationResult.status}`,
    `- package.json: ${packageResult.status}`,
    `- rules-only host baseline: ${rulesOnlyHostBaselineResult.status}`,
    `- root viewport styles: ${rootViewportResult.status}`,
    `- i18n baseline: ${i18nInitResult.status}`,
    `- style import: ${styleResult.status}`,
    `- vite schema-types alias: ${viteResult.status}`,
    `- camora dev-server anti-cache: ${camoraDevServerNoCacheResult.status}`,
    `- dependency install: ${installRequested ? installResult.status : 'not-requested'}`,
  ]

  if (packageResult.addedDeps.length > 0) {
    lines.push(`- added dependencies: ${packageResult.addedDeps.join(', ')}`)
  }

  if (packageResult.isolatedPeerDeps.length > 0) {
    lines.push(`- isolated shell peer deps: ${packageResult.isolatedPeerDeps.join(', ')}`)
  }

  if (packageResult.preservedRootPeerDeps.length > 0) {
    lines.push(`- preserved root peer deps: ${packageResult.preservedRootPeerDeps.join(', ')}`)
  }

  if (packageResult.updatedDeps.length > 0) {
    lines.push(`- normalized dependencies: ${packageResult.updatedDeps.join(', ')}`)
  }

  if (packageResult.addedScripts.length > 0) {
    lines.push(`- added scripts: ${packageResult.addedScripts.join(', ')}`)
  }

  if (packageResult.updatedScripts.length > 0) {
    lines.push(`- updated scripts: ${packageResult.updatedScripts.join(', ')}`)
  }

  if (packageResult.skippedScripts.length > 0) {
    lines.push(`- preserved existing scripts: ${packageResult.skippedScripts.join(', ')}`)
  }

  if (legacyHiUi4Deps.length > 0) {
    lines.push(`- detected legacy visual deps: ${legacyHiUi4Deps.join(', ')}`)
  }

  if (hostProfile.existingStructureSummary.length > 0) {
    lines.push(`- existing structure markers: ${hostProfile.existingStructureSummary.join(', ')}`)
  }
  if (hostProfile.adapterDoc) {
    lines.push(`- framework adapter guide: ${getContextPath(hostProfile.adapterDoc)}`)
  }
  if (hostProfile.adapterEntryHints.length > 0) {
    lines.push(`- candidate host entry files: ${hostProfile.adapterEntryHints.join(', ')}`)
  }
  if (hostProfile.remoteOnlyRuntime?.enabled) {
    lines.push(`- remote-only runtime: enabled`)
    if (hostProfile.remoteOnlyRuntime.remoteEntryFilenames?.length > 0) {
      lines.push(
        `- remote entry filenames: ${hostProfile.remoteOnlyRuntime.remoteEntryFilenames.join(', ')}`
      )
    }
    if (hostProfile.remoteOnlyRuntime.localOrigins?.length > 0) {
      lines.push(
        `- README localOrigin hints: ${hostProfile.remoteOnlyRuntime.localOrigins.join(', ')}`
      )
    }
  }
  if (hostAdapterSnippetPath) {
    lines.push(`- host adapter snippet: ${hostAdapterSnippetPath}`)
  }
  if (localRuntimeMaterializationResult.targetRoot) {
    lines.push(`- managed local runtime root: ${localRuntimeMaterializationResult.targetRoot}`)
  }
  if (localRuntimeMaterializationResult.syncedFiles?.length > 0) {
    lines.push(`- managed local runtime file count: ${localRuntimeMaterializationResult.syncedFiles.length}`)
  }

  if (manifestPath) {
    lines.push(`- manifest: ${manifestPath}`)
  }

  if (rootViewportResult.patchedFiles.length > 0) {
    lines.push(`- root viewport files: ${rootViewportResult.patchedFiles.join(', ')}`)
  }
  if (i18nInitResult.generatedPath) {
    lines.push(`- generated translation entry: ${i18nInitResult.generatedPath}`)
  }

  if (i18nInitResult.locales) {
    lines.push(`- supported locales: ${i18nInitResult.locales}`)
  }

  if (i18nInitResult.syncedFiles) {
    lines.push(`- synced locale files: ${i18nInitResult.syncedFiles}`)
  }
  if (applyStatePath) {
    lines.push(`- apply state file: ${applyStatePath}`)
  }

  if (styleResult.entryFile) {
    lines.push(`- app entry file: ${styleResult.entryFile}`)
  }

  if (rulesOnlyHostBaselineResult.hostBaselineFile) {
    lines.push(`- rules-only host baseline file: ${rulesOnlyHostBaselineResult.hostBaselineFile}`)
  }

  if (rootViewportResult.snippetPath) {
    lines.push(`- root viewport snippet: ${rootViewportResult.snippetPath}`)
  }

  if (rulesOnlyHostBaselineResult.snippetPath) {
    lines.push(`- rules-only host baseline snippet: ${rulesOnlyHostBaselineResult.snippetPath}`)
  }

  if (styleResult.snippetPath) {
    lines.push(`- style snippet: ${styleResult.snippetPath}`)
  }

  if (viteResult.viteFile) {
    lines.push(`- vite config: ${viteResult.viteFile}`)
  }

  if (viteResult.snippetPath) {
    lines.push(`- vite snippet: ${viteResult.snippetPath}`)
  }

  if (camoraDevServerNoCacheResult.devConfigFile) {
    lines.push(`- camora dev config: ${camoraDevServerNoCacheResult.devConfigFile}`)
  }

  if (camoraDevServerNoCacheResult.addedHeaders.length > 0) {
    lines.push(
      `- camora anti-cache headers: ${camoraDevServerNoCacheResult.addedHeaders.join(', ')}`
    )
  }

  if (camoraDevServerNoCacheResult.snippetPath) {
    lines.push(`- camora anti-cache snippet: ${camoraDevServerNoCacheResult.snippetPath}`)
  }

  if (installRequested && installResult.command) {
    lines.push(`- install command: ${installResult.command}`)
  }

  lines.push('', '## Next steps')
  lines.push(`- Host profile: ${hostProfile.reason}`)

  if (installRequested && ['failed', 'blocked'].includes(installResult.status)) {
    const lead =
      installResult.status === 'blocked'
        ? 'Fix the install blocker and then rerun'
        : 'Re-run'
    lines.push(`- ${lead} \`${installResult.command}\` in the target project. Failure detail: ${installResult.message}`)
  } else if (!installRequested) {
    lines.push('- Run your target project package manager install command after reviewing package.json changes.')
  }

  if (legacyHiUi4Deps.length > 0) {
    lines.push('- Clear the legacy visual dependencies above before installing the typical-page dependency set; keep schema 4.x packages only when they belong to the current schema ecosystem.')
  }

  if (rootViewportResult.status === 'snippet-only' && rootViewportResult.snippetPath) {
    lines.push(`- Apply the root viewport style guidance in \`${rootViewportResult.snippetPath}\` before opening preview or business pages.`)
  }

  if (styleResult.status === 'snippet-only' && styleResult.snippetPath) {
    lines.push(`- Add the manual style import from \`${styleResult.snippetPath}\` to your app entry before opening preview or business pages.`)
  }

  if (rulesOnlyHostBaselineResult.status === 'snippet-only' && rulesOnlyHostBaselineResult.snippetPath) {
    lines.push(
      `- In rules-only mode, add the managed local host baseline from \`${rulesOnlyHostBaselineResult.snippetPath}\` before opening preview or generating business pages.`
    )
  }

  if (viteResult.status === 'snippet-only' && viteResult.snippetPath) {
    lines.push(`- Apply the Vite alias snippet in \`${viteResult.snippetPath}\` before running dev/build commands.`)
  }

  if (camoraDevServerNoCacheResult.status === 'patched') {
    lines.push(
      '- Camora anti-cache headers were patched into the local devServer config. Restart the local remote once so the new response headers take effect before validating the test link.'
    )
  } else if (
    ['not-detected', 'snippet-only'].includes(camoraDevServerNoCacheResult.status) &&
    camoraDevServerNoCacheResult.snippetPath
  ) {
    lines.push(
      `- Camora runtime uses a proxy-backed local remote. Apply the anti-cache snippet in \`${camoraDevServerNoCacheResult.snippetPath}\` and restart the local remote before validating the test link.`
    )
  }

  if (packageResult.addedScripts.includes('typical-page:apply') || packageResult.status !== 'missing') {
    lines.push('- Re-run the rules-only installation later with `pnpm typical-page:apply`, `npm run typical-page:apply`, or the equivalent package-manager script command.')
  }
  if (packageResult.addedScripts.includes('typical-page:designer-setup') || packageResult.status !== 'missing') {
    lines.push('- For non-technical designers, prefer `pnpm typical-page:designer-setup` or `npm run typical-page:designer-setup`; that entry now opens the page-task gate through typical-page:preflight by default, and only runs doctor when `--with-doctor-gate` is added for acceptance.')
  }
  if (i18nInitResult.status === 'not-requested (default)') {
    lines.push('- Internationalization baseline was not provisioned by default. Only run `node ".local-context/hiui-design/scripts/init-i18n.mjs"` or re-run bootstrap/apply with `--init-i18n` when the user explicitly asks for i18n in this project.')
  } else if (packageResult.addedScripts.includes('typical-page:i18n:init') || packageResult.updatedScripts.includes('typical-page:i18n:init')) {
    lines.push('- The target project received locale resources, formatter bridge, and the managed `typical-page:i18n:init` rerun script because `--init-i18n` was requested during bootstrap.')
  }

  if (mode === 'host-integration') {
    lines.push('- If you used this advanced bootstrap/apply entry directly instead of `typical-page:designer-setup`, run `pnpm typical-page:preflight` or `npm run typical-page:preflight` before generating business pages.')
    lines.push('- Run `pnpm typical-page:doctor` or `npm run typical-page:doctor` for first-time acceptance, runtime troubleshooting, or formal handoff, not as the default generation gate.')
    lines.push('- Official preview examples now stay in the packaged preview runtime. Start them from the skill root with `node scripts/start-preview-runtime.mjs` instead of using project-local commands or preview routes.')
    lines.push(`- Review \`${path.join(outputRoot, 'SMOKE_REPORT.md')}\` and open the listed smoke pages through the packaged preview runtime before generating business pages.`)
    lines.push('- Do not create or keep `src/typical-page-preview/**`, `typical-page:materialize-preview`, or `typical-page:apply:host-assets` in target projects.')
    lines.push(`- Generate business pages from \`page-types.manifest.json\` and the official source templates inside \`${getContextPath('examples/host-integration/src/pages/*')}\`; project-local preview copies are no longer part of the contract.`)
  } else {
    lines.push('- No template pages, route gallery, or host bridge files were synced into the target project.')
    lines.push('- Generate new business pages directly under the target project’s existing structure; do not create a preview asset directory in the target project.')
    lines.push(`- When generating a page, first read \`${getContextDocPath('generation', 'generation-principles.md')}\`, then \`page-type-map.md\`, then \`figma-page-rules.md\`, then the matched \`figma-pages/*.md\` chapter.`)
    lines.push(`- Use \`${getContextPath('examples/host-integration/src/pages/*')}\` only as runtime contrast inside the skill package and open official examples through the packaged preview runtime when needed.`)
    lines.push('- Rules-only still uses the managed local runtime baseline. Keep `src/components/hiui-design-runtime/styles.css`, the local runtime files under `src/components/hiui-design-runtime`, the React compatibility patch, and the Vite schema-types alias in place before generating business pages.')
    lines.push('- If you used this advanced bootstrap/apply entry directly instead of `typical-page:designer-setup`, run `pnpm typical-page:preflight` or `npm run typical-page:preflight` before generating business pages.')
    lines.push('- Run `pnpm typical-page:doctor` or `npm run typical-page:doctor` only for first-time acceptance, runtime troubleshooting, or formal handoff.')
  }
  lines.push('')

  await ensureDir(path.dirname(summaryPath))
  await fs.writeFile(summaryPath, `${lines.join('\n')}\n`, 'utf8')
  return summaryPath
}

async function main() {
  let applyProgressPath = ''
  let applyProgressStartedAt = ''
  let applyProgressRequestedMode = ''
  let applyProgressSkillVersion = ''
  let applyProgressStage = ''

  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const targetRoot = path.resolve(options.target)
    const { manifestPath, lineId } = await loadPageTypeManifest({
      skillRoot,
      line: options.line,
    })
    const { version: skillVersion } = await loadSkillVersion(skillRoot)
    applyProgressSkillVersion = skillVersion
    const hostProfile = await detectHostProfile(targetRoot, {
      ignoreRelativePaths: [LEGACY_PREVIEW_OUTPUT_ROOT],
    })
    const modeResolution = await resolveAutoInstallMode({
      requestedMode: options.mode,
      targetRoot,
    })
    if (!modeResolution.mode) {
      throw new Error(
        `Install mode resolution returned no mode for ${targetRoot}. This indicates an internal bug in resolveAutoInstallMode().`
      )
    }
    const mode = modeResolution.mode
    const outputRoot = resolveManagedOutputRoot({
      targetRoot,
      mode,
    })
    const managedRuntimeDependencyContract =
      await loadManagedLocalRuntimeDependencyContract(skillRoot).catch(() => null)
    const managedRuntimeSourcePackageName =
      resolveManagedLocalRuntimeEmbeddedSourceSnapshot(managedRuntimeDependencyContract).name || ''
    const managedRuntimePeerDependencies = await loadManagedLocalRuntimePeerDependencies(skillRoot)
    const originalTargetPkg = await readTargetPackageJson(targetRoot)
    const legacyHiUi4Deps = detectLegacyHiUi4VisualDeps(originalTargetPkg)
    const isolatedAliasDependencies = buildHiui5IsolatedAliasDependencies(
      managedRuntimePeerDependencies
    )
    const managedRuntimePatchRequired = shouldRequireManagedRuntimePatch({
      hostProfile,
      pkg: originalTargetPkg,
    })

    if (!(await pathExists(targetRoot))) {
      throw new Error(`Target project root does not exist: ${targetRoot}`)
    }

    const projectContextSyncResult = await syncProjectContext({
      skillRoot,
      targetRoot,
    })
    if (projectContextSyncResult.status === 'completed-with-conflicts') {
      throw new Error(
        `Project context sync encountered conflicts under ${projectContextSyncResult.targetContextRoot}. Review ${projectContextSyncResult.syncManifestPath} and rerun from the packaged skill with --force-context-sync only if overwriting those files is safe.`
      )
    }

    applyProgressPath = resolveApplyProgressPath(targetRoot)
    applyProgressRequestedMode = mode
    const applyProgress = await writeApplyProgress({
      applyProgressPath,
      skillVersion,
      requestedMode: mode,
      stage: 'bootstrap-started',
      detail:
        'hiui-design bootstrap has started. Apply-state will be written after package and host baseline patch steps complete.',
    })
    applyProgressStartedAt = applyProgress.startedAt
    applyProgressStage = applyProgress.stage

    const sharedRuntimeDirectDependencies =
      await loadSharedRuntimeDirectDependencySnapshot(skillRoot)
    const hostIntegrationDependencies =
      mode === 'host-integration'
        ? await loadHostIntegrationDependencies(
            skillRoot,
            managedRuntimePeerDependencies,
            sharedRuntimeDirectDependencies,
            { sourcePackageName: managedRuntimeSourcePackageName },
          )
        : {}
    const directDependencies = {
      ...sharedRuntimeDirectDependencies,
      ...hostIntegrationDependencies,
    }

    const syncOutput =
      mode === 'host-integration'
        ? 'Host-integration mode: preview examples stay in the packaged skill runtime. No project-local preview assets were synced.'
        : 'Rules-only mode: no host integration assets were synced into the target project.'
    const skippedModeStatus =
      mode === 'host-integration'
          ? 'not-applied (preview-stays-in-skill-package)'
          : 'not-applied (rules-only)'
    const localRuntimeMaterializationResult =
      await materializeManagedLocalRuntimeAssets({
        skillRoot,
        targetRoot,
      })

    const packageResult = await patchPackageJson({
      targetRoot,
      peerDependencies: managedRuntimePeerDependencies,
      isolatedAliasDependencies,
      directDependencies,
      line: lineId,
      mode,
      hostProfile,
      managedRuntimePatchRequired,
      includeI18nInitScript: options.i18nInitMode === 'init',
    })
    const i18nInitResult =
      options.i18nInitMode !== 'init'
        ? {
            status: 'not-requested (default)',
            command: 'node ".local-context/hiui-design/scripts/init-i18n.mjs"',
            generatedPath: '',
            locales: '',
            syncedFiles: '',
          }
        : await runI18nInit({ skillRoot, targetRoot })

    const styleResult =
      await patchStyleImport({
        targetRoot,
        outputRoot,
      })
    const rulesOnlyHostBaselineResult =
      await patchRulesOnlyHostBaseline({
        targetRoot,
        outputRoot,
        mode,
      })
    const rootViewportResult =
      mode === 'host-integration'
        ? await patchViewportRootStyles({
            targetRoot,
            outputRoot,
          })
        : { status: skippedModeStatus, patchedFiles: [], snippetPath: '', issueSummary: '', styleFiles: [] }

    const viteResult =
      await patchViteSchemaTypesAlias({
        targetRoot,
        outputRoot,
        shimPath: resolveSchemaTypesShimPath(targetRoot),
      })
    const camoraDevServerNoCacheResult =
      await patchCamoraDevServerNoCacheHeaders({
        targetRoot,
        outputRoot,
        hostProfile,
      })

    const installPreflight = options.install
      ? await inspectInstallPreflight(targetRoot)
      : { status: 'skipped', command: '', message: '' }
    const installResult = options.install
      ? installPreflight.status === 'ready'
        ? await runInstall({ targetRoot, timeoutMs: options.installTimeoutMs })
        : installPreflight
      : { status: 'not-requested', command: '', message: '' }
    const shouldWriteApplyState = !options.install || installResult.status === 'installed'
    const { snippetPath: hostAdapterSnippetPath } = await writeHostAdapterSnippet({
      outputRoot,
      hostProfile,
    })
    const applyStatePath = shouldWriteApplyState ? resolveApplyStatePath(targetRoot) : ''

    const summaryPath = await writeBootstrapSummary({
      applyStatePath,
      hostProfile,
      hostAdapterSnippetPath,
      skillVersion,
      line: lineId,
      manifestPath,
      mode,
      modeSource: modeResolution.source,
      outputRoot,
      legacyHiUi4Deps,
      localRuntimeMaterializationResult,
      packageResult,
      rulesOnlyHostBaselineResult,
      rootViewportResult,
      i18nInitResult,
      styleResult,
      viteResult,
      camoraDevServerNoCacheResult,
      installResult,
      installRequested: options.install,
    })
    if (shouldWriteApplyState) {
      const applyProgress = await writeApplyProgress({
        applyProgressPath,
        skillVersion,
        requestedMode: mode,
        stage: 'writing-apply-state',
        startedAt: applyProgressStartedAt,
        detail:
          'Bootstrap patch steps finished. Writing apply-state and resetting the project page-task gate to ensure-only.',
      })
      applyProgressStage = applyProgress.stage
      await writeApplyState({
        applyStatePath,
        skillVersion,
        appliedMode: mode,
      })
      const integrationReadiness = await inspectIntegrationReadiness(targetRoot)
      if (integrationReadiness.ready) {
        await writeEnsureOnlyPageTaskStatus({
          targetRoot,
          integrationReadiness,
          updatedBy: 'scripts/bootstrap-target-project.mjs',
          reason: `hiui-design apply completed in ${mode} mode. Run typical-page:preflight before starting any hiui-design page task.`,
          mode,
          doctor: {
            lastStatus: 'not-run',
          },
        })
      }
    }
    await clearApplyProgress(applyProgressPath)

    console.log(syncOutput)
    console.log('')
    console.log('Bootstrap summary:')
    console.log(`- detected project type: ${hostProfile.projectType}`)
    console.log(`- detected framework: ${hostProfile.framework}`)
    console.log(`- chosen mode: ${mode}`)
    console.log(`- mode source: ${modeResolution.source}`)
    console.log(`- ${SKILL_PUBLIC_NAME} version: ${skillVersion || '(missing)'}`)
    if (hostProfile.adapterDoc) {
      console.log(`- framework adapter guide: ${getContextPath(hostProfile.adapterDoc)}`)
    }
    if (hostProfile.adapterEntryHints.length > 0) {
      console.log(`- candidate host entry files: ${hostProfile.adapterEntryHints.join(', ')}`)
    }
    if (hostProfile.remoteOnlyRuntime?.enabled) {
      console.log(`- remote-only runtime: enabled`)
      if (hostProfile.remoteOnlyRuntime.remoteEntryFilenames?.length > 0) {
        console.log(
          `  remote entry filenames: ${hostProfile.remoteOnlyRuntime.remoteEntryFilenames.join(', ')}`
        )
      }
      if (hostProfile.remoteOnlyRuntime.localOrigins?.length > 0) {
        console.log(
          `  README localOrigin hints: ${hostProfile.remoteOnlyRuntime.localOrigins.join(', ')}`
        )
      }
    }
    console.log(`- host adapter snippet: ${hostAdapterSnippetPath}`)
    console.log(`- managed local runtime assets: ${localRuntimeMaterializationResult.status}`)
    if (localRuntimeMaterializationResult.targetRoot) {
      console.log(`  root: ${localRuntimeMaterializationResult.targetRoot}`)
    }
    console.log(`- package.json: ${packageResult.status}`)
    if (packageResult.addedDeps.length > 0) {
      console.log(`  added deps: ${packageResult.addedDeps.join(', ')}`)
    }
    if (packageResult.isolatedPeerDeps.length > 0) {
      console.log(`  isolated shell peer deps: ${packageResult.isolatedPeerDeps.join(', ')}`)
    }
    if (packageResult.preservedRootPeerDeps.length > 0) {
      console.log(`  preserved root peer deps: ${packageResult.preservedRootPeerDeps.join(', ')}`)
    }
    if (packageResult.updatedDeps.length > 0) {
      console.log(`  normalized deps: ${packageResult.updatedDeps.join(', ')}`)
    }
    if (packageResult.addedScripts.length > 0) {
      console.log(`  added scripts: ${packageResult.addedScripts.join(', ')}`)
    }
    if (packageResult.updatedScripts.length > 0) {
      console.log(`  updated scripts: ${packageResult.updatedScripts.join(', ')}`)
    }
    if (packageResult.skippedScripts.length > 0) {
      console.log(`  preserved existing scripts: ${packageResult.skippedScripts.join(', ')}`)
    }
    if (legacyHiUi4Deps.length > 0) {
      console.log(`  legacy visual deps: ${legacyHiUi4Deps.join(', ')}`)
    }
    console.log(`- rules-only host baseline: ${rulesOnlyHostBaselineResult.status}`)
    if (rulesOnlyHostBaselineResult.hostBaselineFile) {
      console.log(`  file: ${rulesOnlyHostBaselineResult.hostBaselineFile}`)
    }
    if (rulesOnlyHostBaselineResult.snippetPath) {
      console.log(`  snippet: ${rulesOnlyHostBaselineResult.snippetPath}`)
    }
    console.log(`- root viewport styles: ${rootViewportResult.status}`)
    if (rootViewportResult.patchedFiles.length > 0) {
      console.log(`  files: ${rootViewportResult.patchedFiles.join(', ')}`)
    }
    if (rootViewportResult.snippetPath) {
      console.log(`  snippet: ${rootViewportResult.snippetPath}`)
    }
    console.log(`- i18n baseline: ${i18nInitResult.status}`)
    if (i18nInitResult.generatedPath) {
      console.log(`  generated: ${i18nInitResult.generatedPath}`)
    }
    if (i18nInitResult.locales) {
      console.log(`  locales: ${i18nInitResult.locales}`)
    }
    console.log(`- style import: ${styleResult.status}`)
    if (styleResult.entryFile) {
      console.log(`  entry file: ${styleResult.entryFile}`)
    }
    if (styleResult.snippetPath) {
      console.log(`  snippet: ${styleResult.snippetPath}`)
    }
    console.log(`- vite schema-types alias: ${viteResult.status}`)
    if (viteResult.viteFile) {
      console.log(`  vite file: ${viteResult.viteFile}`)
    }
    if (viteResult.snippetPath) {
      console.log(`  snippet: ${viteResult.snippetPath}`)
    }
    console.log(`- camora dev-server anti-cache: ${camoraDevServerNoCacheResult.status}`)
    if (camoraDevServerNoCacheResult.devConfigFile) {
      console.log(`  dev config: ${camoraDevServerNoCacheResult.devConfigFile}`)
    }
    if (camoraDevServerNoCacheResult.addedHeaders.length > 0) {
      console.log(`  added headers: ${camoraDevServerNoCacheResult.addedHeaders.join(', ')}`)
    }
    if (camoraDevServerNoCacheResult.snippetPath) {
      console.log(`  snippet: ${camoraDevServerNoCacheResult.snippetPath}`)
    }
    console.log(`- dependency install: ${options.install ? installResult.status : 'not-requested'}`)
    if (options.install && installResult.command) {
      console.log(`  command: ${installResult.command}`)
    }
    if (options.install && installResult.message) {
      console.log(`  detail: ${installResult.message}`)
    }
    console.log(
      `- apply state file: ${shouldWriteApplyState ? applyStatePath : `not-written (${installResult.status})`}`
    )
    console.log(`- summary file: ${summaryPath}`)
    if (mode === 'host-integration') {
      console.log('- preview asset policy: global-skill-only')
      console.log('- global preview start (from skill root): node scripts/start-preview-runtime.mjs')
    }

    if (options.install && installResult.status !== 'installed') {
      throw new Error(
        installResult.status === 'blocked'
          ? installResult.message
          : `Dependency install failed during apply. ${installResult.message}`
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (applyProgressPath) {
      try {
        await writeApplyProgress({
          applyProgressPath,
          skillVersion: applyProgressSkillVersion,
          requestedMode: applyProgressRequestedMode,
          stage: applyProgressStage || 'bootstrap-failed',
          status: APPLY_PROGRESS_STATUS.FAILED,
          startedAt: applyProgressStartedAt,
          detail:
            'hiui-design bootstrap did not complete, so apply-state was not finalized for this attempt.',
          lastError: message,
        })
      } catch {}
    }
    console.error(`bootstrap-target-project failed: ${message}`)
    if (isCliUsageError(error)) {
      printUsage()
    }
    process.exit(1)
  }
}

await main()
