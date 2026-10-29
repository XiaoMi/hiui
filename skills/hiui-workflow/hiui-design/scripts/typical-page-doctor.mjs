#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import {
  readApplyState,
  resolveApplyStatePath,
} from './lib/apply-state.mjs'
import { detectHostProfile } from './lib/detect-host-profile.mjs'
import { writeHostAdapterSnippet } from './lib/host-adapter-advice.mjs'
import { resolveAutoInstallMode } from './lib/install-mode-resolution.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { validateMinimumGenerationContract } from './lib/minimum-generation-contract.mjs'
import { inspectNodeRuntimePolicy } from './lib/node-runtime-policy.mjs'
import { syncPageTaskStatusFromDoctor } from './lib/page-task-gate.mjs'
import {
  formatViewportRootIssueDetail,
  inspectViewportRootStyles,
} from './lib/root-viewport-style.mjs'
import {
  formatInstallModeUsage,
  getInstallModeErrorMessage,
  isRecognizedInstallMode,
} from './lib/mode-contract.mjs'
import { collectPageSourceSanityViolations } from './lib/page-template-sanity.mjs'
import { hasScopedHiui5BridgeMarkers } from './lib/legacy-hiui5-bridge-signals.mjs'
import { getManagedLocalRuntimeRoot } from './lib/managed-local-runtime-contract.mjs'
import {
  loadManagedLocalRuntimeDependencyContract,
  resolveManagedLocalRuntimeEmbeddedSourceSnapshot,
  resolveManagedLocalRuntimeEmbeddedSourceSnapshotFiles,
} from './lib/managed-local-runtime-dependencies.mjs'
import { inspectManagedHostContract } from './lib/managed-host-contract.mjs'
import { inspectInstalledReact19RuntimePatchCoverage as inspectInstalledReact19RuntimePatchCoverageShared } from './lib/react19-runtime-patch-health.mjs'
import { verifyStyleDeliveryDecision } from './lib/style-delivery-decision.mjs'
import { getReusableScripts } from './lib/reusable-script-entries.mjs'
import {
  SKILL_CONTEXT_DIR,
  SKILL_PUBLIC_NAME,
  getContextOutputPath,
  getContextScriptPath,
  resolveProjectContextPath,
  toContextVendorFileSpec,
} from './lib/skill-identity.mjs'
import { getIsolatedAliasCompatibility } from './lib/isolated-alias-compat.mjs'
import { ensureProjectNodeRuntime, resolveComparablePath } from './lib/project-node-launcher.mjs'
import {
  describeSharedRuntimeDirectDependencyInspection,
  inspectDeclaredSharedRuntimeDirectDependencies,
  loadSharedRuntimeDirectDependencySnapshot,
  selectEntryImportedSharedRuntimeDirectDependencies,
} from './lib/shared-runtime-direct-dependencies.mjs'
import { isVersionCompatible } from './lib/version-compatibility.mjs'
import { finalizeUsageSession, startUsageSession } from './lib/usage-telemetry.mjs'

const skillRequire = createRequire(import.meta.url)
const { HIUI5_ISOLATED_PEER_ALIASES } = skillRequire('./lib/hiui5-peer-contract.cjs')

const LAYOUT_CONTRACT_CHECK_IDS = new Set([
  'formal-host-provider-bridge-for-package-shells',
  'formal-host-outlet-height-chain-contract',
  'formal-host-height-chain-for-official-shells',
  'formal-host-content-gutter-contract',
  'formal-host-shared-header-slot-collapse',
  'root-viewport-style-contract',
  'public-shell-viewport-compatibility',
])

function normalizeRelativePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .trim()
}

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

function printUsage() {
  console.log(`Usage:
  node "${getContextScriptPath('typical-page-doctor.mjs')}" [--target <project-root>] [--mode <${formatInstallModeUsage()}>] [--line <line-id>] [--telemetry-prompt <text>] [--telemetry-prompt-file <path>] [--json]

Default behavior:
  - target project: current working directory
  - mode: auto
  - auto mode reuses recorded appliedMode when it exists; otherwise it follows the same compatibility-bridge check used by bootstrap
  - preview examples stay in the packaged preview runtime; doctor treats project-local preview assets or preview routes as legacy leftovers to remove
  - doctor reports default to ${getContextOutputPath()}
  - usage stats can capture the verbatim original user prompt via --telemetry-prompt-file (preferred) or --telemetry-prompt
`)
}

function parseArgs(argv) {
  const options = {
    json: false,
    line: '',
    mode: 'auto',
    telemetryPrompt: '',
    telemetryPromptFile: '',
    target: process.cwd(),
  }
  const removedPreviewArgs = new Set(['--dest'])

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--') {
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--telemetry-prompt' || arg === '--telemetry-prompt-file') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      options[arg === '--telemetry-prompt' ? 'telemetryPrompt' : 'telemetryPromptFile'] = value
      i += 1
      continue
    }

    if (removedPreviewArgs.has(arg)) {
      throw new Error(
        `${arg} is no longer supported. Preview examples now stay in the packaged preview runtime and are not materialized into target projects.`
      )
    }

    if (arg === '--target' || arg === '--mode' || arg === '--line') {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      options[arg.slice(2)] = value
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!isRecognizedInstallMode(options.mode)) {
    throw new Error(getInstallModeErrorMessage())
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

async function readJsonIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return null
  return JSON.parse(await fs.readFile(targetPath, 'utf8'))
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeImportSpecifier(value) {
  return String(value || '').trim().replace(/\\/g, '/')
}

function hasLegacyRuntimeSourcePackageToken(value = '') {
  return normalizeImportSpecifier(value).includes('runtime-source-package')
}

function isPackageFamilyImport(specifier = '', packageName = '') {
  const normalizedSpecifier = normalizeImportSpecifier(specifier)
  const normalizedPackageName = normalizeImportSpecifier(packageName)
  if (!normalizedSpecifier) return false
  if (!normalizedPackageName) {
    return hasLegacyRuntimeSourcePackageToken(normalizedSpecifier)
  }

  return (
    normalizedSpecifier === normalizedPackageName ||
    normalizedSpecifier.startsWith(`${normalizedPackageName}/`)
  )
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

function hasManagedLocalRuntimeStyleImport(source = '') {
  return /import\s+['"][^'"]*hiui-design-runtime\/styles\.css['"]/.test(String(source || ''))
}

function hasManagedLocalRuntimePath(specifier = '') {
  const normalizedSpecifier = normalizeImportSpecifier(specifier)
  return normalizedSpecifier.includes(`${getManagedLocalRuntimeRoot()}/`)
}

function isWorkspaceSourceImport(specifier = '') {
  const normalizedSpecifier = normalizeImportSpecifier(specifier)
  return normalizedSpecifier.includes('/packages/') && normalizedSpecifier.includes('/src/')
}

async function hashFileIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return 'missing'

  try {
    const content = await fs.readFile(targetPath)
    return createHash('sha256').update(content).digest('hex')
  } catch {
    return 'unknown'
  }
}

async function collectReportSnapshot(targetRoot) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  const lockfileCandidates = [
    'pnpm-lock.yaml',
    'package-lock.json',
    'yarn.lock',
    'bun.lock',
    'bun.lockb',
  ]
  let lockfile = 'missing'
  let lockfileHash = 'missing'

  for (const candidate of lockfileCandidates) {
    const lockfilePath = path.join(targetRoot, candidate)
    if (!(await pathExists(lockfilePath))) continue
    lockfile = candidate
    lockfileHash = await hashFileIfExists(lockfilePath)
    break
  }

  return {
    generatedAt: new Date().toISOString(),
    packageJson: 'package.json',
    packageJsonHash: await hashFileIfExists(packageJsonPath),
    lockfile,
    lockfileHash,
    note:
      'This report is a project-level historical snapshot; re-run doctor after package.json, lockfile, manifest, source, or generated-page metadata changes.',
  }
}

function getRuntimeExamplePath(pageType) {
  return pageType.runtimeExamplePath || pageType?.generationContract?.baseTemplatePath || ''
}

async function detectMaterializedPreviewAssets(outputRoot) {
  const markers = [
    path.join(outputRoot, 'README.md'),
    path.join(outputRoot, 'routes', 'config.tsx'),
    path.join(outputRoot, 'app-frame.tsx'),
  ]

  for (const marker of markers) {
    if (await pathExists(marker)) {
      return true
    }
  }

  return false
}

async function loadShellPackageSnapshot(skillRoot) {
  const managedRuntimeContract = await loadManagedLocalRuntimeDependencyContract(skillRoot).catch(() => null)
  const { snapshotPackageJsonPath } = resolveManagedLocalRuntimeEmbeddedSourceSnapshotFiles(
    skillRoot,
    managedRuntimeContract
  )

  if (!snapshotPackageJsonPath || !(await pathExists(snapshotPackageJsonPath))) {
    return null
  }

  return readJsonIfExists(snapshotPackageJsonPath)
}

async function resolveEmbeddedShellsSpec(skillRoot, managedRuntimeContract) {
  const { tarball = '', tarballPath = '' } = resolveManagedLocalRuntimeEmbeddedSourceSnapshotFiles(
    skillRoot,
    managedRuntimeContract
  )

  if (!tarball || !tarballPath || !(await pathExists(tarballPath))) {
    return ''
  }

  return toContextVendorFileSpec(path.basename(tarball))
}

async function resolveEmbeddedShellTarballPath(skillRoot, managedRuntimeContract) {
  const { tarballPath = '' } = resolveManagedLocalRuntimeEmbeddedSourceSnapshotFiles(
    skillRoot,
    managedRuntimeContract
  )

  return tarballPath && (await pathExists(tarballPath)) ? tarballPath : ''
}

async function loadHostIntegrationDependencySnapshot(skillRoot) {
  const referencePath = path.join(skillRoot, 'docs', 'onboarding', 'host-integration-dependencies.json')
  const reference = await readJsonIfExists(referencePath)
  return reference?.dependencies ?? {}
}

async function loadSkillVersion(skillRoot) {
  const manifestPath = path.join(skillRoot, 'skill.manifest.json')
  const manifest = await readJsonIfExists(manifestPath)
  const manifestVersion = String(manifest?.version || '').trim()
  if (manifestVersion) {
    return {
      versionPath: manifestPath,
      version: manifestVersion,
    }
  }

  const contextPath = path.join(skillRoot, '.context.jsonc')
  const raw = await fs.readFile(contextPath, 'utf8')
  const context = JSON.parse(stripJsonComments(raw))

  return {
    versionPath: contextPath,
    version: String(context?.version || '').trim(),
  }
}

function pushCheck(checks, { id, ok, severity, summary, detail }) {
  checks.push({ id, ok, severity, summary, detail })
}

function overallStatusFromChecks(checks) {
  const failedHard = checks.some((item) => !item.ok && item.severity === 'error')
  if (failedHard) return 'fail'
  const needsManual = checks.some((item) => !item.ok && item.severity === 'manual')
  if (needsManual) return 'manual'
  const hasWarnings = checks.some((item) => !item.ok && item.severity === 'warn')
  if (hasWarnings) return 'warn'
  return 'pass'
}

async function loadManifest(skillRoot, line = '') {
  return loadPageTypeManifest({ skillRoot, line })
}

function findDependency(pkg, depName) {
  return (
    pkg?.dependencies?.[depName] ||
    pkg?.devDependencies?.[depName] ||
    pkg?.peerDependencies?.[depName] ||
    ''
  )
}

function isAcceptableShellSpec(spec, version, embeddedShellsSpec = '') {
  if (!spec) return false
  if (spec === version) return true
  if (embeddedShellsSpec && spec === embeddedShellsSpec) return true
  if (spec.startsWith('link:')) return true
  return false
}

function formatNodeRuntimeExpectationDetail(expectation) {
  return `${expectation.source} ${expectation.spec}${
    expectation.secondarySpec ? ` (package.json engines.node=${expectation.secondarySpec})` : ''
  }`
}

function formatDoctorNodeRuntimeHardFailureDetail(nodeRuntimePolicy) {
  const { expectation, resolvedRuntime, effectiveNodeVersion } = nodeRuntimePolicy

  if (resolvedRuntime.source === 'project-node-policy-conflict') {
    return `Fix the local runtime before attributing build noise to ${SKILL_PUBLIC_NAME}. ${nodeRuntimePolicy.detail}`
  }

  const summary =
    `Resolved target Node ${effectiveNodeVersion} via ${resolvedRuntime.source} does not satisfy ` +
    `${formatNodeRuntimeExpectationDetail(expectation)}.`
  const extraDetail =
    !resolvedRuntime.reliable && resolvedRuntime.detail && resolvedRuntime.detail !== nodeRuntimePolicy.detail
      ? ` ${resolvedRuntime.detail}`
      : ''

  return `Fix the local runtime before attributing build noise to ${SKILL_PUBLIC_NAME}. ${summary}${extraDetail}`
}

function collectManagedDependencyVersionDrift({
  pkg,
  managedRuntimeDependencies,
  embeddedShellsSpec,
  hostIntegrationDependencies,
  mode,
}) {
  const drifts = []

  for (const [depName, expected] of Object.entries(managedRuntimeDependencies ?? {})) {
    const actual = findDependency(pkg, depName)
    const aliasName = HIUI5_ISOLATED_PEER_ALIASES[depName]
    const aliasSpec = aliasName ? findDependency(pkg, aliasName) : ''
    const aliasCompatibility = aliasName
      ? getIsolatedAliasCompatibility({
          actualSpec: aliasSpec,
          expectedSourceDepName: depName,
          expectedVersion: expected,
        })
      : { compatible: false }
    if (!isVersionCompatible(actual, expected) && !aliasCompatibility.compatible) {
      drifts.push({ depName, actual: actual || '(missing)', expected })
    }
  }

  if (mode === 'host-integration') {
    for (const [depName, expected] of Object.entries(hostIntegrationDependencies ?? {})) {
      const actual = findDependency(pkg, depName)
      if (actual !== expected) {
        drifts.push({ depName, actual: actual || '(missing)', expected })
      }
    }
  }

  return drifts.sort((a, b) => a.depName.localeCompare(b.depName))
}

function analyzeQueryFilterBridge(raw) {
  const reasons = []

  if (!raw) {
    reasons.push('missing QueryFilter adaptation content')
    return reasons
  }

  if (raw.includes('withQueryFilterFieldDefaults')) {
    reasons.push('contains legacy withQueryFilterFieldDefaults helper')
  }

  if (/appearance:\s*\w+\s*=\s*['"]line['"]/.test(raw)) {
    reasons.push('defaults QueryFilter appearance to line')
  }

  if (/showLabel:\s*\w+\s*=\s*(?:!0|true)/.test(raw)) {
    reasons.push('defaults inline QueryFilter labels to visible')
  }

  if (/appearance:\s*['"]filled['"]/.test(raw)) {
    reasons.push('forces QueryFilter field appearance to filled')
  }

  if (/children:\s*['"]重置['"]/.test(raw)) {
    reasons.push('injects a permanent reset button instead of the official all-filter clear action')
  }

  if (!/children:\s*['"]清空['"]/.test(raw)) {
    reasons.push('does not provide the official clear action for active filters')
  }

  if (!/\b(?:filteredCount|m)\s*>\s*0\b/.test(raw)) {
    reasons.push('does not gate the clear action on active filters')
  }

  return reasons
}

function analyzeQueryFilterPackage(raw) {
  const reasons = []

  if (!raw) {
    reasons.push('missing @hi-ui/query-filter FilterForm content')
    return reasons
  }

  const forwardsGap =
    /columnGap:\s*gap\s*\+\s*["']px["']/.test(raw) &&
    /rowGap:\s*gap\s*\+\s*["']px["']/.test(raw)

  if (!forwardsGap) {
    reasons.push('does not forward QueryFilter gap to the inner flex layout')
  }

  return reasons
}

function readTarEntry(tarballPath, entryPath) {
  const result = spawnSync('tar', ['-xOf', tarballPath, entryPath], {
    encoding: 'utf8',
    stdio: 'pipe',
  })

  if (result.error || (result.status ?? 1) !== 0) {
    return ''
  }

  return result.stdout ?? ''
}

async function inspectQueryFilterBridgeFile(filePath) {
  const raw = await readTextIfExists(filePath)
  return {
    exists: Boolean(raw),
    filePath,
    raw,
    reasons: analyzeQueryFilterBridge(raw),
  }
}

async function inspectQueryFilterPackageFile(filePath) {
  const raw = await readTextIfExists(filePath)
  return {
    exists: Boolean(raw),
    filePath,
    raw,
    reasons: analyzeQueryFilterPackage(raw),
  }
}

async function inspectQueryFilterBridgeTarball(tarballPath) {
  const raw = readTarEntry(tarballPath, 'package/dist/pro-list-page/bridge/query-filter.js')
  return {
    exists: Boolean(raw),
    filePath: tarballPath,
    raw,
    reasons: analyzeQueryFilterBridge(raw),
  }
}

const REACT19_RUNTIME_PATCH_REACT_RESIZE_DETECTOR_PACKAGE_PATHS = [
  ['@hi-ui', 'tag-input'],
  ['@hi-ui', 'textarea'],
  ['hiui5-tag-input'],
  ['hiui5-textarea'],
]

const REACT19_RUNTIME_PATCH_RC_RESIZE_OBSERVER_PACKAGE_PATHS = [
  ['@hi-ui', 'table'],
  ['@hi-ui', 'virtual-list'],
  ['@hi-ui', 'check-cascader'],
  ['hiui5-table'],
  ['hiui5-check-cascader'],
]

function buildReact19RuntimePatchDetectorTargets(targetRoot) {
  return REACT19_RUNTIME_PATCH_REACT_RESIZE_DETECTOR_PACKAGE_PATHS.flatMap((packagePath) => {
    const packageRoot = path.join(targetRoot, 'node_modules', ...packagePath)
    return [
      path.join(packageRoot, 'node_modules', 'react-resize-detector', 'build', 'index.esm.js'),
      path.join(packageRoot, 'node_modules', 'react-resize-detector', 'build', 'index.js'),
      path.join(packageRoot, 'node_modules', 'react-resize-detector', 'build', 'withPolyfill.js'),
    ]
  })
}

function buildReact19RuntimePatchObserverTargets(targetRoot) {
  const baseTargets = REACT19_RUNTIME_PATCH_RC_RESIZE_OBSERVER_PACKAGE_PATHS.flatMap((packagePath) => {
    const packageRoot = path.join(targetRoot, 'node_modules', ...packagePath)
    return [
      path.join(packageRoot, 'lib', 'esm', 'node_modules', 'rc-resize-observer', 'es', 'index.js'),
      path.join(packageRoot, 'lib', 'cjs', 'node_modules', 'rc-resize-observer', 'es', 'index.js'),
    ]
  })

  const nestedCheckCascaderTargets = [
    ['@hi-ui', 'check-cascader'],
    ['hiui5-check-cascader'],
  ].flatMap((packagePath) => {
    const packageRoot = path.join(targetRoot, 'node_modules', ...packagePath)
    return [
      path.join(
        packageRoot,
        'lib',
        'esm',
        'ui',
        'virtual-list',
        'lib',
        'esm',
        'node_modules',
        'rc-resize-observer',
        'es',
        'index.js'
      ),
      path.join(
        packageRoot,
        'lib',
        'cjs',
        'ui',
        'virtual-list',
        'lib',
        'esm',
        'node_modules',
        'rc-resize-observer',
        'es',
        'index.js'
      ),
    ]
  })

  return [...baseTargets, ...nestedCheckCascaderTargets]
}

function analyzeReact19RuntimePatchDetector(raw) {
  const source = String(raw || '')
  if (!source.includes('findDOMNode(')) return []

  const hasGuard =
    source.includes("typeof findDOMNode === 'function' ? findDOMNode(_this) : null;") ||
    source.includes("typeof ReactDOM.findDOMNode === 'function' ? ReactDOM.findDOMNode(_this) : null;") ||
    source.includes("typeof reactDom.findDOMNode === 'function' ? reactDom.findDOMNode(_this) : null;")

  return hasGuard ? [] : ['findDOMNode access is not guarded for React 19']
}

function analyzeReact19RuntimePatchObserver(raw) {
  const source = String(raw || '')
  if (!source.includes('childNode.ref')) return []
  return source.includes('childNode && childNode.props ? childNode.props.ref : undefined;')
    ? []
    : ['element.ref still reads childNode.ref directly under React 19']
}

async function inspectReact19ManagedRuntimePatchWiring({ targetRoot, hostProfile, pkg }) {
  const reactMajor = Number(hostProfile?.reactMajor || 0)
  if (reactMajor < 19) {
    return {
      required: false,
      ok: true,
      detail:
        reactMajor > 0
          ? `Detected React ${reactMajor}; managed React 19 runtime patch wiring is not required.`
          : 'React major version could not be resolved; managed React 19 runtime patch wiring is not required.',
      missing: [],
    }
  }

  const scripts = pkg?.scripts || {}
  const runtimePatchCommand = String(scripts['typical-page:runtime-patch'] || '').trim()
  const postinstallCommand = String(scripts.postinstall || '').trim()
  const runtimePatchScriptRelativePath = getContextScriptPath('apply-runtime-patches.mjs')
  const runtimePatchScriptPath = path.join(targetRoot, runtimePatchScriptRelativePath)
  const missing = []

  if (!runtimePatchCommand.includes('apply-runtime-patches.mjs')) {
    missing.push('package.json scripts.typical-page:runtime-patch')
  }
  if (!postinstallCommand.includes('apply-runtime-patches.mjs')) {
    missing.push('package.json scripts.postinstall')
  }
  if (!(await pathExists(runtimePatchScriptPath))) {
    missing.push(runtimePatchScriptRelativePath)
  }

  return {
    required: true,
    ok: missing.length === 0,
    missing,
    detail:
      missing.length === 0
        ? `React 19 host keeps the managed runtime patch wiring through package.json scripts.typical-page:runtime-patch, scripts.postinstall, and ${runtimePatchScriptRelativePath}.`
        : `React 19 host is missing managed runtime patch wiring: ${missing.join(', ')}. Re-run apply-in-current-project or setup-for-designers, reinstall dependencies so postinstall can apply the managed patches, then rerun doctor.`,
  }
}

async function inspectInstalledReact19RuntimePatchCoverage({ targetRoot, hostProfile }) {
  return inspectInstalledReact19RuntimePatchCoverageShared({
    targetRoot,
    reactMajor: Number(hostProfile?.reactMajor || 0),
  })
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
    'src/application.tsx',
    'src/application.ts',
    'src/application.jsx',
    'src/application.js',
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
    if (!(await pathExists(absPath))) continue

    const raw = await readTextIfExists(absPath)
    if (raw.trim()) return absPath
  }

  return ''
}

const LEGACY_BUILD_CONFIG_CANDIDATES = [
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
  'vite.config.ts',
  'vite.config.tsx',
  'vite.config.mts',
  'vite.config.js',
  'vite.config.jsx',
  'vite.config.mjs',
  'vite.config.cjs',
  'vite.config.cts',
]

const REACT_DOM_CLIENT_SHIM_CANDIDATES = [
  'src/shims/react-dom-client.ts',
  'src/shims/react-dom-client.tsx',
  'src/shims/react-dom-client.js',
  'src/shims/react-dom-client.jsx',
]
const REACT_JSX_RUNTIME_SHIM_CANDIDATES = [
  'src/shims/react-jsx-runtime.ts',
  'src/shims/react-jsx-runtime.tsx',
  'src/shims/react-jsx-runtime.js',
  'src/shims/react-jsx-runtime.jsx',
]

async function inspectReactDomClientCompatibility({ targetRoot, hostProfile }) {
  const reactMajor = Number(hostProfile?.reactMajor || 0)
  const needsCompatBranch =
    reactMajor > 0 && reactMajor < 18 && hostProfile?.riskLevel === 'high'
  const aliasConfigMatches = []

  for (const candidate of LEGACY_BUILD_CONFIG_CANDIDATES) {
    const absolutePath = path.join(targetRoot, candidate)
    const raw = await readTextIfExists(absolutePath)
    if (!raw.includes('react-dom/client')) continue
    aliasConfigMatches.push(absolutePath)
  }

  let shimPath = ''
  for (const candidate of REACT_DOM_CLIENT_SHIM_CANDIDATES) {
    const absolutePath = path.join(targetRoot, candidate)
    if (await pathExists(absolutePath)) {
      shimPath = absolutePath
      break
    }
  }

  const shimRaw = shimPath ? await readTextIfExists(shimPath) : ''
  const shimLooksCompatible =
    Boolean(shimRaw) &&
    shimRaw.includes('ReactDOM.render') &&
    shimRaw.includes('unmountComponentAtNode')

  return {
    reactMajor,
    needsCompatBranch,
    aliasConfigMatches,
    shimPath,
    shimLooksCompatible,
    ok: !needsCompatBranch || (aliasConfigMatches.length > 0 && shimLooksCompatible),
  }
}

async function inspectReactJsxRuntimeCompatibility({ targetRoot, hostProfile }) {
  const reactMajor = Number(hostProfile?.reactMajor || 0)
  const needsCompatBranch =
    reactMajor > 0 && reactMajor < 17 && hostProfile?.riskLevel === 'high'
  const aliasConfigMatches = []

  for (const candidate of LEGACY_BUILD_CONFIG_CANDIDATES) {
    const absolutePath = path.join(targetRoot, candidate)
    const raw = await readTextIfExists(absolutePath)
    if (!raw.includes('react/jsx-runtime') && !raw.includes('react/jsx-dev-runtime')) continue
    aliasConfigMatches.push(absolutePath)
  }

  let shimPath = ''
  for (const candidate of REACT_JSX_RUNTIME_SHIM_CANDIDATES) {
    const absolutePath = path.join(targetRoot, candidate)
    if (await pathExists(absolutePath)) {
      shimPath = absolutePath
      break
    }
  }

  const shimRaw = shimPath ? await readTextIfExists(shimPath) : ''
  const shimLooksCompatible =
    Boolean(shimRaw) &&
    shimRaw.includes('React.createElement') &&
    shimRaw.includes('Fragment') &&
    shimRaw.includes('export function jsx')

  return {
    reactMajor,
    needsCompatBranch,
    aliasConfigMatches,
    shimPath,
    shimLooksCompatible,
    ok: !needsCompatBranch || (aliasConfigMatches.length > 0 && shimLooksCompatible),
  }
}

function buildLegacyReactCompatAutofixHint() {
  return 'If the project has exactly one supported Vite/Rspack config and no conflicting local shims, run typical-page:legacy-react-compat; otherwise patch the compatibility branch manually.'
}

async function detectRouteFile(targetRoot) {
  const candidates = [
    'src/App.tsx',
    'src/App.ts',
    'src/App.jsx',
    'src/App.js',
    'src/routes.tsx',
    'src/routes.ts',
    'src/routes.jsx',
    'src/routes.js',
    'src/routes/config.tsx',
    'src/routes/config.ts',
    'src/routes/index.tsx',
    'src/routes/index.ts',
    'src/router/routes.tsx',
    'src/router/routes.ts',
    'src/router/index.tsx',
    'src/router/index.ts',
  ]

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) return absPath
  }

  return ''
}

async function detectTypicalPageSourceRepo(targetRoot) {
  const markers = [
    path.join(targetRoot, 'packages', 'typical-page-shells', 'package.json'),
    resolveProjectContextPath(targetRoot, 'examples', 'host-integration', 'README.md'),
    resolveProjectContextPath(
      targetRoot,
      'examples',
      'host-integration',
      'src',
      'routes',
      'config.tsx'
    ),
  ]

  for (const marker of markers) {
    if (!(await pathExists(marker))) return false
  }

  return true
}

function detectTypicalPageRouteMountInSource(routeRaw) {
  if (!routeRaw) return false

  const importsTypicalPreviewRoutes =
    routeRaw.includes('typicalPagePreviewRoutes') &&
    routeRaw.includes('typical-page-preview/routes/config')

  if (!importsTypicalPreviewRoutes) return false

  return (
    routeRaw.includes('...typicalPagePreviewRoutes') ||
    routeRaw.includes('children: typicalPagePreviewRoutes') ||
    routeRaw.includes('children={typicalPagePreviewRoutes}') ||
    routeRaw.includes('routes: typicalPagePreviewRoutes') ||
    routeRaw.includes('routes={typicalPagePreviewRoutes}') ||
    routeRaw.includes('element: typicalPagePreviewRoutes')
  )
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
    if (await pathExists(absPath)) return absPath
  }

  return ''
}

async function collectSourceFiles(rootDir) {
  if (!(await pathExists(rootDir))) return []

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

async function readImportedStyleSources(sourceFilePath, sourceRaw) {
  const localStyleSpecifiers = extractImportSpecifiers(sourceRaw).filter(
    (specifier) => specifier.startsWith('.') && /\.(?:css|scss)$/.test(specifier)
  )
  const contents = []

  for (const specifier of localStyleSpecifiers) {
    const absPath = path.resolve(path.dirname(sourceFilePath), specifier)
    if (!(await pathExists(absPath))) continue
    contents.push(await fs.readFile(absPath, 'utf8'))
  }

  return contents.join('\n')
}

async function collectTextFiles(rootDir, pattern) {
  if (!(await pathExists(rootDir))) return []

  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles(absPath, pattern)))
      continue
    }

    if (entry.isFile() && pattern.test(entry.name)) {
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

function collectDeclaredDependencies(pkg) {
  return new Set([
    ...Object.keys(pkg?.dependencies ?? {}),
    ...Object.keys(pkg?.devDependencies ?? {}),
    ...Object.keys(pkg?.peerDependencies ?? {}),
  ])
}

async function collectUndeclaredImports({ rootDir, pkg }) {
  const files = await collectSourceFiles(rootDir)
  const declaredDependencies = collectDeclaredDependencies(pkg)
  const missingImports = []

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8')
    for (const specifier of extractImportSpecifiers(raw)) {
      const depName = normalizePackageName(specifier)
      if (!depName || declaredDependencies.has(depName)) continue
      missingImports.push({
        depName,
        filePath,
        specifier,
      })
    }
  }

  return missingImports
}

function summarizeMissingImports(targetRoot, missingImports) {
  const grouped = new Map()

  for (const item of missingImports) {
    if (!grouped.has(item.depName)) {
      grouped.set(item.depName, [])
    }
    grouped.get(item.depName).push(item)
  }

  const depList = [...grouped.keys()].sort((a, b) => a.localeCompare(b))
  const exampleLines = depList.slice(0, 6).map((depName) => {
    const firstHit = grouped.get(depName)?.[0]
    const relativeFile = firstHit ? path.relative(targetRoot, firstHit.filePath) : ''
    return `${depName} <- ${relativeFile} (${firstHit?.specifier ?? depName})`
  })

  return `${depList.join(', ')}. Examples: ${exampleLines.join('; ')}`
}

async function collectTypicalPageSourceSignals(rootDir, { legacySourcePackageName = '' } = {}) {
  const files = await collectSourceFiles(rootDir)
  const signals = {
    usesShells: [],
    legacySourcePackageImports: [],
    privateImportViolations: [],
    tableHeaderExtraViolations: [],
    localHostAdapterImports: [],
    staleQueryFilterBridgeViolations: [],
    queryFilterShowLabelViolations: [],
    formalHeaderPortalCarrierFiles: [],
    formalTypicalPageHostBridgeFiles: [],
    formalOfficialShellHeightContractFiles: [],
    formalContentOutletHeightContractFiles: [],
    formalContentGutterFiles: [],
  }

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8')
    const importedStyleRaw = await readImportedStyleSources(filePath, raw)
    const formalContractRaw = `${raw}\n${importedStyleRaw}`
    const specifiers = extractImportSpecifiers(raw)
    const usesShells = specifiers.some((specifier) => hasManagedLocalRuntimePath(specifier))
    const usesLegacyShellPackage = specifiers.some(
      (specifier) => isPackageFamilyImport(specifier, legacySourcePackageName)
    )
    const usesPrivateShellImport = specifiers.some(
      (specifier) =>
        specifier.includes('/node_modules/') ||
        specifier.includes('.pnpm/') ||
        isWorkspaceSourceImport(specifier) ||
        isPackagePrivateDistImport(specifier, legacySourcePackageName) ||
        specifier.endsWith('/dist/index.js') ||
        specifier.endsWith('/dist/index.mjs')
    )

    if (usesShells || usesPrivateShellImport) {
      signals.usesShells.push(filePath)
    }

    if (usesLegacyShellPackage) {
      signals.legacySourcePackageImports.push(filePath)
    }

    const usesLocalHostAdapter = specifiers.some(
      (specifier) =>
        specifier.includes('hiui-design-runtime/host') ||
        specifier.endsWith('/typical-page-host') ||
        specifier.includes('components/typical-page-host')
    )
    const isHostIntegrationExampleFile = filePath.includes(`${path.sep}typical-page-preview${path.sep}`)
    const formalContractRelativePath = path.relative(rootDir, filePath).replace(/\\/g, '/')
    if (!isHostIntegrationExampleFile && isLikelyFormalHostContractPath(formalContractRelativePath)) {
      const formalHostContract = inspectFormalHostContractSource(formalContractRaw)
      if (formalHostContract.hasHeaderPortalCarrier) {
        signals.formalHeaderPortalCarrierFiles.push(filePath)
      }
      if (formalHostContract.hasTypicalPageHostBridge) {
        signals.formalTypicalPageHostBridgeFiles.push(filePath)
      }
      if (formalHostContract.hasOfficialShellHeightContract) {
        signals.formalOfficialShellHeightContractFiles.push(filePath)
      }
      if (formalHostContract.hasContentOutletHeightContract) {
        signals.formalContentOutletHeightContractFiles.push(filePath)
      }
      if (formalHostContract.hasContentGutterContract) {
        signals.formalContentGutterFiles.push(filePath)
      }
    }

    if (usesLocalHostAdapter && !isHostIntegrationExampleFile) {
      signals.localHostAdapterImports.push(filePath)
    }

    if (usesPrivateShellImport) {
      signals.privateImportViolations.push({
        filePath,
        specifiers: specifiers.filter(
          (specifier) =>
        specifier.includes('/node_modules/') ||
        specifier.includes('.pnpm/') ||
        isWorkspaceSourceImport(specifier) ||
        isPackagePrivateDistImport(specifier, legacySourcePackageName) ||
        specifier.endsWith('/dist/index.js') ||
        specifier.endsWith('/dist/index.mjs')
        ),
      })
    }

    const looksLikeLegacyQueryFilterBridge =
      raw.includes('QueryFilter as HiUIQueryFilter') &&
      raw.includes('matchFieldRenderFn') &&
      raw.includes("name: 'QueryFilter'")
    if (looksLikeLegacyQueryFilterBridge) {
      const reasons = []

      if (raw.includes('withQueryFilterFieldDefaults')) {
        reasons.push('contains legacy withQueryFilterFieldDefaults helper')
      }
      if (raw.includes("appearance: 'filled'") || raw.includes('appearance: "filled"')) {
        reasons.push('forces QueryFilter field appearance to filled')
      }
      if (raw.includes("appearance = 'line'") || raw.includes('appearance = "line"')) {
        reasons.push('overrides QueryFilter default appearance back to line')
      }

      if (reasons.length > 0) {
        signals.staleQueryFilterBridgeViolations.push({ filePath, reasons })
      }
    }

    const usesManagedProListQueryFilter = specifiers.some((specifier) => {
      const normalizedSpecifier = normalizeImportSpecifier(specifier)
      return (
        isPackageFamilyImport(normalizedSpecifier, `${legacySourcePackageName}/pro-list-page`) ||
        normalizedSpecifier.includes(`${getManagedLocalRuntimeRoot()}/pro-list-page`)
      )
    })
    if (usesManagedProListQueryFilter && /<QueryFilter\b[\s\S]{0,320}showLabel=\{true\}/.test(raw)) {
      signals.queryFilterShowLabelViolations.push(filePath)
    }

    const usesTableFrame = raw.includes('TablePageFrame')
    const hasHeaderExtraClass =
      raw.includes('proTablePageStyles.headerExtra') || raw.includes('proStatPageStyles.headerExtra')
    const hasExtraSpace =
      /extra=\{[\s\S]{0,240}<Space\b/.test(raw) || /extra:\s*<Space\b/.test(raw)
    if (usesTableFrame && hasExtraSpace && !hasHeaderExtraClass) {
      signals.tableHeaderExtraViolations.push(filePath)
    }
  }

  return signals
}

function appendManagedHostContractSignalFiles(targetRoot, targetList, relativePaths = []) {
  if (!Array.isArray(targetList) || !Array.isArray(relativePaths)) return

  for (const relativePath of relativePaths) {
    if (typeof relativePath !== 'string' || relativePath.length === 0) continue
    const absolutePath = path.resolve(targetRoot, relativePath)
    if (!targetList.includes(absolutePath)) {
      targetList.push(absolutePath)
    }
  }
}

function mergeManagedHostContractSignals(targetRoot, signals, managedHostContract) {
  if (!managedHostContract || managedHostContract.status !== 'valid') return signals

  const facts = managedHostContract.facts || {}

  if (facts.hasHeaderPortalCarrier) {
    appendManagedHostContractSignalFiles(
      targetRoot,
      signals.formalHeaderPortalCarrierFiles,
      facts.headerPortalCarrierFiles
    )
  }

  if (facts.hasTypicalPageHostBridge) {
    appendManagedHostContractSignalFiles(
      targetRoot,
      signals.formalTypicalPageHostBridgeFiles,
      facts.typicalPageHostBridgeFiles
    )
  }

  if (facts.hasOfficialShellHeightContract) {
    appendManagedHostContractSignalFiles(
      targetRoot,
      signals.formalOfficialShellHeightContractFiles,
      facts.officialShellHeightContractFiles
    )
  }

  if (facts.hasContentOutletHeightContract) {
    appendManagedHostContractSignalFiles(
      targetRoot,
      signals.formalContentOutletHeightContractFiles,
      facts.contentOutletHeightContractFiles
    )
  }

  if (facts.hasContentGutterContract) {
    appendManagedHostContractSignalFiles(
      targetRoot,
      signals.formalContentGutterFiles,
      facts.contentGutterFiles
    )
  }

  return signals
}

function summarizePrivateImportViolations(targetRoot, violations) {
  return violations
    .slice(0, 6)
    .map((item) => `${path.relative(targetRoot, item.filePath)} <- ${item.specifiers.join(', ')}`)
    .join('; ')
}

function summarizePathList(targetRoot, filePaths) {
  return filePaths.slice(0, 6).map((filePath) => path.relative(targetRoot, filePath)).join('; ')
}

function summarizeQueryFilterBridgeViolations(targetRoot, violations) {
  return violations
    .slice(0, 6)
    .map((item) => `${path.relative(targetRoot, item.filePath)} <- ${item.reasons.join(', ')}`)
    .join('; ')
}

const OFFICIAL_SHELL_ROOT_CLASS_TOKENS = [
  'pro-table-page',
  'pro-stat-page',
  'pro-tree-split-page',
  'pro-detail-page',
  'pro-edit-page',
]

function isLikelyFormalHostContractPath(relativePath = '') {
  const normalizedPath = relativePath.replace(/\\/g, '/').toLowerCase()
  const fileName = path.posix.basename(normalizedPath)

  return (
    normalizedPath.startsWith('components/layout/') ||
    normalizedPath.includes('/components/layout/') ||
    normalizedPath.startsWith('business-layout/') ||
    normalizedPath.includes('/business-layout/') ||
    normalizedPath.startsWith('business-shell/') ||
    normalizedPath.includes('/business-shell/') ||
    normalizedPath.startsWith('layouts/') ||
    normalizedPath.includes('/layouts/') ||
    normalizedPath.startsWith('layout/') ||
    normalizedPath.includes('/layout/') ||
    /(?:^|\/)(?:app|application|main-content|app-frame|app-shell|layout|shell|frame)(?:\.module)?\.(?:[cm]?[jt]sx?|s?css)$/i.test(fileName)
  )
}

function hasFlexMinHeightOverflowContract(source = '') {
  const hasFlexDisplay = /display\s*:\s*['"]?flex['"]?/i.test(source)
  const hasColumnDirection =
    /flex-direction\s*:\s*column/i.test(source) ||
    /(?:^|[^\w$])['"]?flexDirection['"]?\s*:\s*['"]?column['"]?/i.test(source)
  const hasStretchFlex =
    /flex\s*:\s*1\s+1\s+0%/i.test(source) ||
    /flex\s*:\s*['"]1\s+1\s+0%['"]/i.test(source) ||
    /(?:^|[^\w$])['"]?flex['"]?\s*:\s*(?:['"]1['"]|1)\s*(?:[,;}]|$)/i.test(source)
  const hasZeroMinHeight =
    /min-height\s*:\s*0(?:\b|;|\n)/i.test(source) ||
    /(?:^|[^\w$])['"]?minHeight['"]?\s*:\s*(?:['"]0['"]|0)\s*(?:[,;}]|$)/i.test(source)
  const hasHiddenOverflow = /overflow\s*:\s*['"]?hidden['"]?/i.test(source)

  return hasFlexDisplay && hasColumnDirection && hasStretchFlex && hasZeroMinHeight && hasHiddenOverflow
}

function detectContentOutletPath(source = '', referencesOfficialShellRoot = false) {
  const markers = [
    'styles.mainContentOutlet',
    'mainContentOutlet',
    'styles.outlet',
    'data-hiui-main-content-outlet',
    'data-hiui-content-outlet',
    'hostOutlet',
  ]

  for (const marker of markers) {
    if (source.includes(marker)) return marker
  }

  return referencesOfficialShellRoot ? 'official-shell-root' : ''
}

function detectRightViewportGutterPx(source = '', contentOutletPath = '') {
  if (!contentOutletPath) return 0

  const hasManagedMainMarginGutterEvidence =
    (/margin-inline-end\s*:\s*16px/i.test(source) ||
      /margin-right\s*:\s*16px/i.test(source) ||
      /marginInlineEnd\s*:\s*(?:['"]16px['"]|16)\b/i.test(source) ||
      (/HOST_CONTENT_VIEWPORT_GUTTER\s*=\s*16\b/i.test(source) &&
        /marginInlineEnd\s*:\s*HOST_CONTENT_VIEWPORT_GUTTER\b/i.test(source)))

  const hasGutterEvidence = [
    /padding-right\s*:\s*16px/i,
    /padding-inline(?:-end)?\s*:\s*16px/i,
    /padding\s*:\s*16px(?:\s+16px(?:\s+16px\s+16px)?)?/i,
    /padding\s*:\s*0\s+16px(?:\s+0\s+16px)?/i,
    /paddingRight\s*:\s*(?:['"]16px['"]|16)\b/i,
    /paddingInline(?:End)?\s*:\s*(?:['"]16px['"]|16)\b/i,
    /padding\s*:\s*['"][^'"]*\b16px\b[^'"]*['"]/i,
  ].some((pattern) => pattern.test(source))

  return hasGutterEvidence || hasManagedMainMarginGutterEvidence ? 16 : 0
}

function inspectFormalHostContractSource(source = '') {
  const hasHeaderPortalCarrier =
    source.includes('PageHeaderPortal') ||
    source.includes('TypicalPageHeaderPortal') ||
    source.includes('role="page-header"') ||
    source.includes("role='page-header'") ||
    source.includes('headerRef')
  const hasTypicalPageHostBridge =
    (source.includes('TypicalPageHostProvider') &&
      (source.includes('headerPortal=') || source.includes('headerPortal:'))) ||
    source.includes('TypicalPageHostBridge')
  const referencesOfficialShellRoot = OFFICIAL_SHELL_ROOT_CLASS_TOKENS.some((token) =>
    source.includes(token)
  )
  const contentOutletPath = detectContentOutletPath(source, referencesOfficialShellRoot)
  const hasHostHeightChainContract = hasFlexMinHeightOverflowContract(source)
  const hasGenericOutletChildContract =
    Boolean(contentOutletPath) && source.includes('> *') && hasHostHeightChainContract
  const rightViewportGutterPx = detectRightViewportGutterPx(source, contentOutletPath)
  return {
    hasHeaderPortalCarrier,
    hasTypicalPageHostBridge,
    hasOfficialShellHeightContract:
      (referencesOfficialShellRoot && hasHostHeightChainContract) ||
      hasGenericOutletChildContract,
    hasContentOutletHeightContract:
      (contentOutletPath === 'official-shell-root' && hasHostHeightChainContract) ||
      hasGenericOutletChildContract,
    hasContentGutterContract: rightViewportGutterPx >= 16,
  }
}

function summarizeChecks(checks) {
  return {
    passed: checks.filter((item) => item.ok).length,
    failed: checks.filter((item) => !item.ok).length,
    hardFailures: checks.filter((item) => !item.ok && item.severity === 'error').length,
    manualSteps: checks.filter((item) => !item.ok && item.severity === 'manual').length,
    warnings: checks.filter((item) => !item.ok && item.severity === 'warn').length,
  }
}

function summarizeOutstandingChecks(checks) {
  if (!Array.isArray(checks) || checks.length === 0) {
    return ''
  }

  const summaries = checks
    .map((item) => String(item?.summary || '').trim())
    .filter(Boolean)

  if (summaries.length === 0) {
    return ''
  }

  if (summaries.length <= 2) {
    return summaries.join('; ')
  }

  return `${summaries.slice(0, 2).join('; ')}; plus ${summaries.length - 2} more`
}

function formatAssessmentStatusLabel(status) {
  return String(status || '').trim().toUpperCase() || 'UNKNOWN'
}

function summarizeDoctorAssessment({ checks, overallStatus, hostProfile }) {
  const layoutChecks = checks.filter((item) => LAYOUT_CONTRACT_CHECK_IDS.has(item.id))
  const layoutFailedChecks = layoutChecks.filter((item) => !item.ok)
  const runtimeChecks = checks.filter((item) => !LAYOUT_CONTRACT_CHECK_IDS.has(item.id))
  const runtimeFailedChecks = runtimeChecks.filter((item) => !item.ok)
  const runtimeBaselineStatus = overallStatusFromChecks(runtimeChecks)

  let layoutContractStatus = 'pass'
  if (layoutFailedChecks.some((item) => item.severity === 'error' || item.severity === 'manual')) {
    layoutContractStatus = 'blocked'
  } else if (layoutFailedChecks.some((item) => item.severity === 'warn')) {
    layoutContractStatus = 'warn'
  } else if (hostProfile?.riskLevel === 'high') {
    layoutContractStatus = 'partial'
  }

  const runtimeOutstandingSummary = summarizeOutstandingChecks(runtimeFailedChecks)
  const layoutOutstandingSummary = summarizeOutstandingChecks(layoutFailedChecks)

  let runtimeBaselineSummary = 'Managed runtime baseline and generation wiring checks passed.'
  if (runtimeBaselineStatus === 'warn') {
    runtimeBaselineSummary = runtimeOutstandingSummary
      ? `Managed runtime baseline is mostly in place, but warning items remain: ${runtimeOutstandingSummary}.`
      : 'Managed runtime baseline is mostly in place, but warning items remain.'
  } else if (runtimeBaselineStatus === 'manual') {
    runtimeBaselineSummary = runtimeOutstandingSummary
      ? `Managed runtime baseline still needs manual integration evidence: ${runtimeOutstandingSummary}.`
      : 'Managed runtime baseline still needs manual integration evidence.'
  } else if (runtimeBaselineStatus === 'fail') {
    runtimeBaselineSummary = runtimeOutstandingSummary
      ? `Managed runtime baseline is not ready yet: ${runtimeOutstandingSummary}.`
      : 'Managed runtime baseline is not ready yet.'
  }

  let layoutContractSummary = 'Host layout contract checks passed for the current host shape.'
  if (layoutContractStatus === 'warn') {
    layoutContractSummary = layoutOutstandingSummary
      ? `Host layout contract has warning-level gaps: ${layoutOutstandingSummary}.`
      : 'Host layout contract has warning-level gaps.'
  } else if (layoutContractStatus === 'blocked') {
    layoutContractSummary = layoutOutstandingSummary
      ? `Host layout contract is not proven yet: ${layoutOutstandingSummary}.`
      : 'Host layout contract is not proven yet.'
  } else if (layoutContractStatus === 'partial') {
    layoutContractSummary =
      'No blocking layout-contract failure was found in this run, but high-risk legacy hosts are still treated as runtime-baseline pass with partial layout certification, not a full layout-contract pass.'
  }

  let decision =
    'Runtime baseline passed and the current host layout contract checks also passed.'
  if (overallStatus === 'pass' && layoutContractStatus === 'partial') {
    decision =
      'Runtime baseline passed. Layout contract has no blocking findings in this run, but it is still only partially certified for this high-risk legacy host.'
  } else if (overallStatus === 'warn') {
    decision =
      layoutContractStatus === 'pass'
        ? 'Runtime baseline is basically ready and layout contract checks passed, but warning items should be cleared before large-scale page generation.'
        : 'Runtime baseline is basically ready, but layout contract or compatibility follow-up is still required before large-scale page generation.'
  } else if (overallStatus === 'manual') {
    decision =
      runtimeBaselineStatus === 'pass' && layoutContractStatus === 'blocked'
        ? 'Managed runtime baseline passed, but the host layout contract still needs manual proof before page generation should begin.'
        : 'Manual route or host integration work is still required before page generation should begin.'
  } else if (overallStatus === 'fail') {
    if (runtimeBaselineStatus === 'pass' && layoutContractStatus === 'blocked') {
      decision =
        'Managed runtime baseline passed, but the host layout contract failed. Fix the blocking layout checks before generating non-drawer pages.'
    } else if (runtimeBaselineStatus !== 'pass' && layoutContractStatus === 'pass') {
      decision =
        'Host layout contract checks passed, but the managed runtime baseline failed. Fix the runtime baseline before page generation.'
    } else {
      decision =
        'Do not continue with new hiui-design page generation or integration work yet. Fix the hard failures first.'
    }
  }

  return {
    runtimeBaseline: {
      status: runtimeBaselineStatus,
      failedCheckIds: runtimeFailedChecks.map((item) => item.id),
      summary: runtimeBaselineSummary,
    },
    layoutContract: {
      status: layoutContractStatus,
      failedCheckIds: layoutFailedChecks.map((item) => item.id),
      summary: layoutContractSummary,
    },
    decision,
  }
}

function getFrameworkHostEntryRequirement(hostProfile, targetRoot) {
  switch (hostProfile.framework) {
    case 'umi':
    case 'umi-max':
      return {
        required: true,
        ok: Boolean(hostProfile.umiAppPath || hostProfile.umiLayoutPath),
        severity: 'manual',
        summary: 'Umi host entry can be detected for mounting TypicalPageHostProvider',
        detail:
          hostProfile.umiAppPath || hostProfile.umiLayoutPath
            ? [hostProfile.umiAppPath, hostProfile.umiLayoutPath]
                .filter(Boolean)
                .map((entry) => path.relative(targetRoot, entry))
                .join(', ')
            : 'Expected src/app.tsx or src/layouts/index.tsx for Umi host integration',
      }
    case 'next-app-router':
      return {
        required: true,
        ok: Boolean(hostProfile.nextAppLayoutPath),
        severity: 'manual',
        summary: 'Next App Router layout can be detected for mounting the client host bridge',
        detail: hostProfile.nextAppLayoutPath
          ? path.relative(targetRoot, hostProfile.nextAppLayoutPath)
          : 'Expected app/layout.tsx or src/app/layout.tsx for Next App Router host integration',
      }
    case 'next-pages-router':
      return {
        required: true,
        ok: Boolean(hostProfile.nextPagesAppPath),
        severity: 'manual',
        summary: 'Next Pages Router app entry can be detected for mounting TypicalPageHostProvider',
        detail: hostProfile.nextPagesAppPath
          ? path.relative(targetRoot, hostProfile.nextPagesAppPath)
          : 'Expected pages/_app.tsx or src/pages/_app.tsx for Next Pages Router host integration',
      }
    default:
      return {
        required: false,
      }
  }
}

async function writeDoctorReport({
  outputRoot,
  targetRoot,
  status,
  checks,
  summary,
  assessment,
  line,
  manifestPath,
  mode,
  modeSource,
  hostProfile,
  hostAdapterSnippetPath,
  reportSnapshot,
}) {
  const reportPath = path.join(outputRoot, 'DOCTOR_REPORT.md')
  const lines = [
    '# HiUI Design Doctor Report',
    '',
    `- scope: project-level ${SKILL_PUBLIC_NAME} health check`,
    `- report intent: validate whether the current project is ready for ${SKILL_PUBLIC_NAME} page generation, integration, and runtime verification`,
    `- target root: ${targetRoot}`,
    `- mode: ${mode}`,
    `- mode source: ${modeSource}`,
    `- project type: ${hostProfile.projectType}`,
    `- detected framework: ${hostProfile.framework}`,
    `- recommended project strategy: ${hostProfile.strategy}`,
    `- host risk level: ${hostProfile.riskLevel || 'low'}`,
    `- host risk tags: ${hostProfile.riskTags?.length ? hostProfile.riskTags.join(', ') : 'none'}`,
    ...(line ? [`- business line: ${line}`] : []),
    ...(hostProfile.adapterDoc
      ? [`- framework adapter guide: ${resolveAdapterGuideLabel(outputRoot, hostProfile.adapterDoc)}`]
      : []),
    ...(hostAdapterSnippetPath ? [`- host adapter snippet: ${hostAdapterSnippetPath}`] : []),
    `- overall status: ${status}`,
    `- runtime baseline status: ${assessment.runtimeBaseline.status}`,
    `- layout contract status: ${assessment.layoutContract.status}`,
    `- manifest: ${manifestPath}`,
    `- checks passed: ${summary.passed}`,
    `- checks failed: ${summary.failed}`,
    '',
    '## Snapshot',
    `- generatedAt: ${reportSnapshot.generatedAt}`,
    `- packageJson: ${reportSnapshot.packageJson}`,
    `- packageJsonHash: ${reportSnapshot.packageJsonHash}`,
    `- lockfile: ${reportSnapshot.lockfile}`,
    `- lockfileHash: ${reportSnapshot.lockfileHash}`,
    `- note: ${reportSnapshot.note}`,
    '',
    '## Checks',
  ]

  for (const item of checks) {
    const mark = item.ok ? 'PASS' : item.severity.toUpperCase()
    lines.push(`- [${mark}] ${item.summary}`)
    if (item.detail) {
      lines.push(`  ${item.detail}`)
    }
  }

  lines.push('', '## Decision')
  lines.push(
    `- runtime baseline: ${formatAssessmentStatusLabel(assessment.runtimeBaseline.status)}. ${assessment.runtimeBaseline.summary}`
  )
  lines.push(
    `- layout contract: ${formatAssessmentStatusLabel(assessment.layoutContract.status)}. ${assessment.layoutContract.summary}`
  )
  lines.push(`- overall decision: ${assessment.decision}`)

  await ensureDir(path.dirname(reportPath))
  await fs.writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8')
  return reportPath
}

function getSmokeCases(manifest) {
  return manifest.pageTypes.filter((pageType) => pageType.smokePath && pageType.smokeGroup)
}

function getPrimarySmokeCases(manifest) {
  return getSmokeCases(manifest).filter((pageType) => pageType.smokePriority === 'primary')
}

async function collectGenerationContractViolations({ manifest, skillRoot }) {
  const requiredKeys = [
    'baseTemplatePath',
    'requiredShell',
    'requiredImports',
    'requiredSlots',
    'businessSlots',
    'lockedRegions',
    'forbiddenTokens',
    'lightSanityChecks',
    'generationNotes',
    'hostCapabilityContract',
    'layoutContract',
    'dataShapeContract',
    'domClassContract',
    'fallbackPolicy',
  ]
  const violations = []

  for (const pageType of manifest.pageTypes ?? []) {
    const contract = pageType.generationContract
    if (!contract) {
      violations.push(`${pageType.id}: missing generationContract`)
      continue
    }

    for (const key of requiredKeys) {
      const value = contract[key]
      if (!value || (Array.isArray(value) && value.length === 0)) {
        violations.push(`${pageType.id}: missing ${key}`)
      }
    }

    if (contract.requiredShell && contract.requiredShell !== pageType.shell) {
      violations.push(`${pageType.id}: requiredShell ${contract.requiredShell} does not match shell ${pageType.shell}`)
    }

    if (
      contract.baseTemplatePath &&
      !contract.baseTemplatePath.startsWith('examples/host-integration/src/pages/')
    ) {
      violations.push(`${pageType.id}: baseTemplatePath must point to examples/host-integration/src/pages/`)
    }

    if (contract.baseTemplatePath) {
      const templatePath = path.join(skillRoot, contract.baseTemplatePath)
      if (!(await pathExists(templatePath))) {
        violations.push(`${pageType.id}: missing base template ${contract.baseTemplatePath}`)
      }
    }

    if (contract.baseStylePath !== null && typeof contract.baseStylePath !== 'string') {
      violations.push(`${pageType.id}: baseStylePath must be a string or null`)
    }

    if (typeof contract.baseStylePath === 'string') {
      if (!contract.baseStylePath.startsWith('examples/host-integration/src/pages/')) {
        violations.push(`${pageType.id}: baseStylePath must point to examples/host-integration/src/pages/`)
      }

      const stylePath = path.join(skillRoot, contract.baseStylePath)
      if (!(await pathExists(stylePath))) {
        violations.push(`${pageType.id}: missing base style ${contract.baseStylePath}`)
      }
    }

    if (contract.layoutContract?.requiresFlexMinHeightChain !== true) {
      violations.push(`${pageType.id}: layoutContract.requiresFlexMinHeightChain must be true`)
    }

    const requiresSchemaGroupDataIndexMapping =
      contract.requiredImports?.some((requiredImport) =>
        (requiredImport.symbols ?? []).some(
          (symbol) => symbol === 'SchemaGroup' || symbol === 'GroupMapProvider'
        )
      ) || contract.lightSanityChecks?.includes('required-grouped-detail-sections')
    if (requiresSchemaGroupDataIndexMapping && contract.dataShapeContract?.schemaGroupDataIndexMustExistInRequestResult !== true) {
      violations.push(`${pageType.id}: dataShapeContract must require SchemaGroup dataIndex mapping`)
    }

    if (contract.domClassContract?.selectorMustMatchResolvedRuntimeClass !== true) {
      violations.push(`${pageType.id}: domClassContract.selectorMustMatchResolvedRuntimeClass must be true`)
    }

    violations.push(
      ...validateMinimumGenerationContract({
        pageTypeId: pageType.id,
        contract: contract.minimumGenerationContract,
      })
    )

    if (
      Array.isArray(contract.lightSanityChecks) &&
      !contract.lightSanityChecks.includes(`required-shell:${pageType.shell}`)
    ) {
      violations.push(`${pageType.id}: lightSanityChecks missing required-shell:${pageType.shell}`)
    }
  }

  return violations
}

async function collectTemplateSanityViolations({ manifest, skillRoot }) {
  const violations = []

  for (const pageType of manifest.pageTypes ?? []) {
    const contract = pageType.generationContract
    if (!contract?.baseTemplatePath) continue

    const templatePath = path.join(skillRoot, contract.baseTemplatePath)
    const source = await readTextIfExists(templatePath)
    if (!source) {
      violations.push(`${pageType.id}: missing readable template ${contract.baseTemplatePath}`)
      continue
    }

    const styleSource =
      typeof contract.baseStylePath === 'string' && contract.baseStylePath
        ? await readTextIfExists(path.join(skillRoot, contract.baseStylePath))
        : ''
    violations.push(
      ...collectPageSourceSanityViolations({
        pageType,
        contract,
        source,
        styleSource,
        sourceLabel: 'template',
      })
    )
  }

  return violations
}

function extractSchemaGroupDataIndexes(source) {
  const indexes = []
  const pattern = /\bG\(\s*['"][^'"]+['"]\s*,\s*['"]([^'"]+)['"]\s*\)/g
  let match = pattern.exec(source)

  while (match) {
    indexes.push(match[1])
    match = pattern.exec(source)
  }

  return [...new Set(indexes)]
}

function extractStyleImport(source) {
  const match = source.match(/import\s+\w+\s+from\s+['"](\.\.?\/[^'"]+\.module\.(?:scss|css|less))['"]/)
  return match?.[1] ?? ''
}

async function resolveSourceImportFile(sourceFilePath, importPath) {
  if (!importPath) return ''
  const basePath = path.resolve(path.dirname(sourceFilePath), importPath)
  const candidates = [basePath, `${basePath}.scss`, `${basePath}.css`, `${basePath}.less`]

  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate
  }

  return basePath
}

function extractModuleFederationExposes(source) {
  const exposes = []
  const exposesBlock = source.match(/exposes\s*:\s*\{([\s\S]*?)\n\s*\}/)
  if (!exposesBlock) return exposes

  const entryPattern = /['"](\.\/[^'"]+)['"]\s*:\s*['"]([^'"]+)['"]/g
  let match = entryPattern.exec(exposesBlock[1])

  while (match) {
    exposes.push({ publicName: match[1], sourcePath: match[2] })
    match = entryPattern.exec(exposesBlock[1])
  }

  return exposes
}

function extractModuleFederationSharedEntries(source) {
  const entries = []
  const sharedBlock = source.match(/shared\s*:\s*\{([\s\S]*?)\n\s*\}/)
  if (!sharedBlock) return entries

  const entryPattern = /(['"]?)(@?[\w./-]+)\1\s*:\s*\{([^{}]*)\}/g
  let match = entryPattern.exec(sharedBlock[1])

  while (match) {
    const depName = String(match[2] || '').trim()
    const rawOptions = String(match[3] || '')
    if (!depName) {
      match = entryPattern.exec(sharedBlock[1])
      continue
    }

    const requiredVersionMatch = rawOptions.match(
      /\brequiredVersion\s*:\s*(['"])(.*?)\1/
    )

    entries.push({
      depName,
      singleton: /\bsingleton\s*:\s*true\b/.test(rawOptions),
      eager: /\beager\s*:\s*true\b/.test(rawOptions),
      requiredVersion: requiredVersionMatch?.[2] || '',
      rawOptions: rawOptions.trim(),
    })
    match = entryPattern.exec(sharedBlock[1])
  }

  return entries
}

function shouldInspectLegacyMfSharedRuntimeContract(hostProfile = {}) {
  const projectType = normalizeString(hostProfile?.projectType)
  const framework = normalizeString(hostProfile?.framework)
  const legacyReactRuntime = hostProfile?.legacyReactRuntime === true
  const hiuiFacts = hostProfile?.hiuiFacts || {}

  return (
    projectType === 'existing-system' &&
    ['rspack-module-federation', 'webpack-module-federation'].includes(framework) &&
    (legacyReactRuntime === true ||
      hiuiFacts.hasLegacyRuntimePackages === true ||
      hiuiFacts.hasMixedRuntimePackages === true)
  )
}

async function inspectLegacyMfSharedRuntimeContract({ targetRoot, hostProfile, pkg }) {
  if (!shouldInspectLegacyMfSharedRuntimeContract(hostProfile)) {
    return {
      inScope: false,
      ok: true,
      detail:
        'Legacy Module Federation shared-runtime repair only applies to existing-system legacy MF hosts; greenfield or non-MF projects should stay on the standard host/runtime path.',
    }
  }

  const configCandidates = [
    'build/rspack.base.conf.js',
    'build/webpack.base.conf.js',
    'rspack.config.js',
    'webpack.config.js',
  ]
  const findings = []

  for (const relativePath of configCandidates) {
    const configPath = path.join(targetRoot, relativePath)
    const raw = await readTextIfExists(configPath)
    if (!raw) continue

    const sharedEntries = extractModuleFederationSharedEntries(raw)
    const scopedBridgeDetected = hasScopedHiui5BridgeMarkers(raw)

    findings.push({
      configPath: relativePath,
      scopedBridgeDetected,
      sharedEntries,
    })
  }

  if (findings.length === 0) {
    return {
      inScope: true,
      ok: true,
      detail:
        'No Rspack/Webpack Module Federation config file was found for legacy shared-runtime inspection. Keep this repair path scoped to existing-system legacy MF hosts only.',
    }
  }

  const declaredLegacyHiuiSpec = findDependency(pkg, '@hi-ui/hiui')
  const declaredLegacyHiuiRuntime =
    Boolean(declaredLegacyHiuiSpec) &&
    !isVersionCompatible(declaredLegacyHiuiSpec, '>=5.0.0-experimental.0')
  const riskyFindings = findings.filter((finding) => {
    const sharedSingletons = new Map(
      finding.sharedEntries.map((entry) => [entry.depName, entry.singleton === true])
    )
    return finding.scopedBridgeDetected && sharedSingletons.get('@hi-ui/hiui') === true
  })

  if (riskyFindings.length === 0 || !declaredLegacyHiuiRuntime) {
    return {
      inScope: true,
      ok: true,
      detail:
        'No legacy MF shared-singleton hijack signature was detected. Keep host shared-contract repair scoped to existing-system legacy Module Federation projects instead of applying it globally.',
    }
  }

  const riskyDetails = riskyFindings
    .map((finding) => {
      const sharedDepNames = finding.sharedEntries
        .filter((entry) => entry.singleton)
        .map((entry) => entry.depName)
      return `${finding.configPath} shares [${sharedDepNames.join(', ')}] while scoped HiUI5 bridge wiring is present`
    })
    .join('; ')
  const reactSharedSingletonDetected = riskyFindings.some((finding) =>
    finding.sharedEntries.some(
      (entry) =>
        entry.singleton === true &&
        (entry.depName === 'react' || entry.depName === 'react-dom')
    )
  )

  return {
    inScope: true,
    ok: false,
    detail:
      `Legacy existing-system Module Federation host risk detected: package.json still declares @hi-ui/hiui=${declaredLegacyHiuiSpec}, but the build also keeps a scoped HiUI5 replacement bridge plus a shared singleton for @hi-ui/hiui. ${riskyDetails}. ` +
      (reactSharedSingletonDetected
        ? 'React/ReactDOM are also shared as singletons on this legacy carrier, so runtime warnings can stack with the HiUI mismatch.'
        : '') +
      ' Repair the host shared contract in this legacy project only; do not generalize this repair to greenfield or non-Module-Federation projects, and do not keep patching business-page source to chase the symptom.',
  }
}

async function resolveModuleFederationExposeFiles(targetRoot) {
  const configCandidates = [
    'build/rspack.base.conf.js',
    'build/webpack.base.conf.js',
    'rspack.config.js',
    'webpack.config.js',
  ]
  const exposes = []

  for (const relativePath of configCandidates) {
    const configPath = path.join(targetRoot, relativePath)
    const raw = await readTextIfExists(configPath)
    if (!raw) continue

    for (const expose of extractModuleFederationExposes(raw)) {
      const basePath = path.resolve(targetRoot, expose.sourcePath)
      const candidates = [
        `${basePath}.tsx`,
        `${basePath}.ts`,
        `${basePath}.jsx`,
        `${basePath}.js`,
        path.join(basePath, 'index.tsx'),
        path.join(basePath, 'index.ts'),
        path.join(basePath, 'index.jsx'),
        path.join(basePath, 'index.js'),
        basePath,
      ]
      const resolvedPath = candidates.find((candidate) => fsSyncPathExists(candidate)) || basePath
      exposes.push({ ...expose, configPath, resolvedPath })
    }
  }

  return exposes
}

function fsSyncPathExists(targetPath) {
  try {
    return Boolean(targetPath) && requireFsAccessSync(targetPath)
  } catch {
    return false
  }
}

function requireFsAccessSync(targetPath) {
  try {
    // Keep sync access local and tiny to avoid making every expose resolver async-heavy.
    const stat = spawnSync('test', ['-e', targetPath], { stdio: 'ignore' })
    return (stat.status ?? 1) === 0
  } catch {
    return false
  }
}

function isFullPageDetailSource(source, { legacySourcePackageName = '' } = {}) {
  return (
    (source.includes(`${legacySourcePackageName}/pro-detail-page`) ||
      source.includes('hiui-design-runtime/pro-detail-page')) &&
    source.includes('ProDetailPage') &&
    source.includes('<PageHeader') &&
    source.includes('SchemaGroup') &&
    source.includes('SchemaDescriptionsBridge')
  )
}

function checkFullPageDetailLayoutSource(source) {
  const hasWhiteBody = source.includes('styles.whiteBody') || source.includes('className={styles.whiteBody}')
  const headerIndex = source.indexOf('<PageHeader')
  const whiteBodyIndex = source.indexOf('styles.whiteBody')
  const proDetailIndex = source.indexOf('<ProDetailPage')
  const schemaGroupIndex = source.indexOf('<SchemaGroup')

  return {
    hasPageHeader: headerIndex >= 0,
    hasWhiteBody,
    pageHeaderBeforeWhiteBody: headerIndex >= 0 && whiteBodyIndex >= 0 && headerIndex < whiteBodyIndex,
    proDetailBeforeSchemaGroup: proDetailIndex >= 0 && schemaGroupIndex >= 0 && proDetailIndex < schemaGroupIndex,
  }
}

function checkFullPageDetailStyle(styleSource) {
  return {
    hasWhiteBodyClass: /\.whiteBody\s*\{/.test(styleSource),
    whiteBodyFlexFill: /\.whiteBody\s*\{[\s\S]*flex\s*:\s*1\s+1\s+0%/.test(styleSource),
    hasMinHeightZero: /min-height\s*:\s*0/.test(styleSource),
    hasWhiteBackground: /background(?:-color)?\s*:\s*(?:#fff|white)/.test(styleSource),
    hasV5DescriptionLabelAlignment:
      styleSource.includes('hi-v5-descriptions--placement-vertical') && styleSource.includes('text-align: left'),
  }
}

async function collectPageContractFindings({ targetRoot, legacySourcePackageName = '' }) {
  const sourceRoot = path.join(targetRoot, 'src')
  const sourceFiles = (await pathExists(sourceRoot)) ? await collectSourceFiles(sourceRoot) : []
  const findings = []

  for (const filePath of sourceFiles) {
    const source = await fs.readFile(filePath, 'utf8')
    if (!isFullPageDetailSource(source, { legacySourcePackageName })) continue

    const styleImport = extractStyleImport(source)
    const stylePath = await resolveSourceImportFile(filePath, styleImport)
    const styleSource = await readTextIfExists(stylePath)
    const groupDataIndexes = extractSchemaGroupDataIndexes(source)
    const missingInlineGroupDataMappers = groupDataIndexes.filter((dataIndex) => {
      const mapperPattern = new RegExp(`\\b${dataIndex}\\s*:`)
      return !mapperPattern.test(source)
    })

    findings.push({
      pageType: 'full-page-detail',
      filePath,
      stylePath,
      styleExists: Boolean(styleSource),
      styleImport,
      groupDataIndexes,
      missingInlineGroupDataMappers,
      layout: checkFullPageDetailLayoutSource(source),
      style: checkFullPageDetailStyle(styleSource),
    })
  }

  return findings
}

function summarizePageContractFindings(targetRoot, findings) {
  if (findings.length === 0) return 'No full-page detail source files were found under src.'
  return findings
    .map((finding) => {
      const issues = []
      if (!finding.styleExists) issues.push('missing module style file')
      if (!finding.layout.hasWhiteBody) issues.push('missing whiteBody carrier')
      if (!finding.layout.pageHeaderBeforeWhiteBody) issues.push('PageHeader is not before whiteBody')
      if (!finding.style.whiteBodyFlexFill) issues.push('whiteBody does not flex-fill')
      if (!finding.style.hasV5DescriptionLabelAlignment) {
        issues.push('HiUI5 description label alignment selector missing')
      }
      if (finding.missingInlineGroupDataMappers.length > 0) {
        issues.push(`missing explicit group data mapper for ${finding.missingInlineGroupDataMappers.join(', ')}`)
      }

      return `${path.relative(targetRoot, finding.filePath)}: ${issues.length ? issues.join('; ') : 'contract ok'}`
    })
    .join(' | ')
}

async function writePageContractReport({ outputRoot, targetRoot, findings }) {
  const reportPath = path.join(outputRoot, 'PAGE_CONTRACT_REPORT.md')
  const lines = [
    '# HiUI5 Page Contract Report',
    '',
    `- target root: ${targetRoot}`,
    `- checked full-page detail files: ${findings.length}`,
    '',
  ]

  for (const finding of findings) {
    lines.push(`## ${path.relative(targetRoot, finding.filePath)}`, '')
    lines.push(`- pageType: ${finding.pageType}`)
    lines.push(`- stylePath: ${finding.stylePath ? path.relative(targetRoot, finding.stylePath) : '—'}`)
    lines.push(`- styleExists: ${finding.styleExists}`)
    lines.push(`- groupDataIndexes: ${finding.groupDataIndexes.join(', ') || '—'}`)
    lines.push(`- missingInlineGroupDataMappers: ${finding.missingInlineGroupDataMappers.join(', ') || '—'}`)
    lines.push('', '### Layout', '')
    for (const [key, value] of Object.entries(finding.layout)) {
      lines.push(`- ${key}: ${value}`)
    }
    lines.push('', '### Style', '')
    for (const [key, value] of Object.entries(finding.style)) {
      lines.push(`- ${key}: ${value}`)
    }
    lines.push('')
  }

  await ensureDir(path.dirname(reportPath))
  await fs.writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8')
  return reportPath
}

async function collectFilesNamed(rootDir, fileName) {
  if (!(await pathExists(rootDir))) return []

  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFilesNamed(absPath, fileName)))
      continue
    }

    if (entry.isFile() && entry.name === fileName) {
      files.push(absPath)
    }
  }

  return files
}

async function resolveExistingModulePath(basePath) {
  if (!basePath) return ''

  const hasExplicitExtension = /\.[cm]?[jt]sx?$/.test(basePath)
  const candidates = hasExplicitExtension
    ? [basePath]
    : [
        basePath,
        `${basePath}.tsx`,
        `${basePath}.ts`,
        `${basePath}.jsx`,
        `${basePath}.js`,
        path.join(basePath, 'index.tsx'),
        path.join(basePath, 'index.ts'),
        path.join(basePath, 'index.jsx'),
        path.join(basePath, 'index.js'),
      ]

  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate
  }

  return ''
}

async function resolveManagedMfPublishEntryPath({ targetRoot, pageDir, managedMfPublishEntry = {} }) {
  const configuredRelativePath = normalizeString(managedMfPublishEntry?.path)
  if (configuredRelativePath) {
    const configuredPath = await resolveExistingModulePath(path.join(targetRoot, configuredRelativePath))
    if (configuredPath) return configuredPath
  }

  for (const candidate of ['mf-entry', 'publish-entry']) {
    const resolvedCandidate = await resolveExistingModulePath(path.join(pageDir, candidate))
    if (resolvedCandidate) return resolvedCandidate
  }

  return ''
}

async function collectMfPublishEntryContractFindings({ targetRoot, mode, hostProfile }) {
  const rulesOnlyExistingSystem =
    mode === 'rules-only' && normalizeString(hostProfile?.projectType) === 'existing-system'
  if (!rulesOnlyExistingSystem) {
    return {
      inScope: false,
      reason:
        'Managed Module Federation publish-entry delivery checks only run for rules-only existing-system projects.',
      findings: [],
    }
  }

  const moduleFederationExposes = await resolveModuleFederationExposeFiles(targetRoot)
  if (moduleFederationExposes.length === 0) {
    return {
      inScope: false,
      reason:
        'Managed Module Federation publish-entry delivery checks are not required because no Module Federation direct-expose contracts were found.',
      findings: [],
    }
  }

  const metaFiles = await collectFilesNamed(path.join(targetRoot, 'src'), 'hiui-pagegen.meta.json')
  const findings = []

  for (const metaFile of metaFiles) {
    const metadata = await readJsonIfExists(metaFile)
    if (!metadata || typeof metadata !== 'object') continue

    const pageRelationDecision = metadata.pageRelationDecision || {}
    const navigationMountAction = metadata.navigationMountAction || {}
    const managedMfPublishEntry = metadata.managedMfPublishEntry || {}
    const targetEntryKind = normalizeString(
      navigationMountAction.targetEntryKind || managedMfPublishEntry.targetEntryKind
    )
    const isSameModuleSubview =
      normalizeString(pageRelationDecision.kind) === 'same-module-subview'
    const publishDeliveryKind = normalizeString(metadata.publishDeliveryDecision?.kind)
    const requiresManagedPublishEntry =
      publishDeliveryKind === 'managed-mf-publish-entry' ||
      (!isSameModuleSubview &&
        (managedMfPublishEntry.required === true ||
        normalizeString(navigationMountAction.action) === 'materialize-mf-publish-entry' ||
        targetEntryKind === 'module-federation-exposes' ||
        targetEntryKind === 'module-federation-expose'))

    if (!requiresManagedPublishEntry) continue

    const pageDir = path.dirname(metaFile)
    const pageModulePath = await resolveExistingModulePath(path.join(pageDir, 'index'))
    const managedPublishEntryPath = await resolveManagedMfPublishEntryPath({
      targetRoot,
      pageDir,
      managedMfPublishEntry,
    })
    const managedPublishEntrySource = await readTextIfExists(managedPublishEntryPath)
    const directExposeEntries = pageModulePath
      ? moduleFederationExposes.filter(
          (item) => path.resolve(item.resolvedPath) === path.resolve(pageModulePath)
        )
      : []
    const publishEntryExposeEntries = managedPublishEntryPath
      ? moduleFederationExposes.filter(
          (item) => path.resolve(item.resolvedPath) === path.resolve(managedPublishEntryPath)
        )
      : []

    findings.push({
      metaFile,
      pageDir,
      pageModulePath,
      pageModuleExists: Boolean(pageModulePath),
      managedPublishEntryPath,
      managedPublishEntryExists: Boolean(managedPublishEntryPath),
      managedPublishEntryImportsShellStyles: /hiui-design-runtime\/styles\.css/.test(
        managedPublishEntrySource
      ),
      directExposeEntries,
      publishEntryExposeEntries,
      expectedShellStyleImport:
        normalizeString(managedMfPublishEntry.expectedShellStyleImport) ||
        `${getManagedLocalRuntimeRoot()}/styles.css`,
    })
  }

  return {
    inScope: true,
    reason:
      findings.length === 0
        ? 'No hiui-design generated pages currently require the managed Module Federation publish-entry delivery contract.'
        : 'Doctor verified whether rules-only direct-expose pages publish shell styles through managed Module Federation publish entries.',
    findings,
  }
}

function summarizeMfPublishEntryContractFindings(targetRoot, findings) {
  if (findings.length === 0) {
    return 'No hiui-design generated pages currently require the managed Module Federation publish-entry delivery contract.'
  }

  return findings
    .map((finding) => {
      const issues = []
      if (!finding.pageModuleExists) issues.push('generated page module is missing')
      if (finding.directExposeEntries.length > 0) {
        issues.push(
          `direct expose still targets generated page module (${finding.directExposeEntries
            .map((item) => item.publicName)
            .join(', ')})`
        )
      }
      if (!finding.managedPublishEntryExists) {
        issues.push('managed publish entry file is missing')
      }
      if (finding.managedPublishEntryExists && !finding.managedPublishEntryImportsShellStyles) {
        issues.push('managed publish entry does not import shell styles')
      }
      if (finding.publishEntryExposeEntries.length === 0) {
        issues.push('no expose currently points to the managed publish entry')
      }

      return `${path.relative(targetRoot, finding.metaFile)}: ${issues.length ? issues.join('; ') : 'contract ok'}`
    })
    .join(' | ')
}

async function collectSameModuleSubviewStyleDeliveryFindings({ targetRoot }) {
  const metaFiles = await collectFilesNamed(path.join(targetRoot, 'src'), 'hiui-pagegen.meta.json')
  const findings = []

  for (const metaFile of metaFiles) {
    const metadata = await readJsonIfExists(metaFile)
    if (!metadata || typeof metadata !== 'object') continue

    const pageRelationKind = normalizeString(metadata.pageRelationDecision?.kind)
    if (pageRelationKind !== 'same-module-subview') continue

    const styleDeliveryDecision = metadata.styleDeliveryDecision || null
    const verification = await verifyStyleDeliveryDecision({
      targetRoot,
      styleDeliveryDecision,
    })

    findings.push({
      metaFile,
      pageRelationKind,
      publishDeliveryDecision: metadata.publishDeliveryDecision || {},
      styleDeliveryDecision,
      mfExposeTargetPath: normalizeRelativePath(metadata.mfExposeTargetPath || ''),
      mfExposeUsesManagedPublishEntry: metadata.mfExposeUsesManagedPublishEntry === true,
      verification,
    })
  }

  return {
    inScope: findings.length > 0,
    reason:
      findings.length === 0
        ? 'No persisted same-module-subview hiui-design pages were found for style-delivery contract checks.'
        : 'Doctor verified whether persisted same-module-subview pages still satisfy their declared style-delivery owner.',
    findings,
  }
}

function summarizeSameModuleSubviewStyleDeliveryFindings(targetRoot, findings) {
  if (findings.length === 0) {
    return 'No persisted same-module-subview hiui-design pages were found for style-delivery contract checks.'
  }

  return findings
    .map((finding) => {
      const owner = normalizeString(finding.styleDeliveryDecision?.owner) || 'missing-owner'
      const entryPath =
        normalizeString(finding.styleDeliveryDecision?.effectiveEntryPath) || 'missing-entry'
      return `${path.relative(targetRoot, finding.metaFile)}: ${
        finding.verification.ok
          ? `contract ok (${owner} -> ${entryPath})`
          : `${finding.verification.reason || 'style-delivery contract failed'} (${owner} -> ${entryPath})`
      }`
    })
    .join(' | ')
}

async function collectSameModuleSubviewManagedPublishBypassFindings({ targetRoot }) {
  const metaFiles = await collectFilesNamed(path.join(targetRoot, 'src'), 'hiui-pagegen.meta.json')
  const findings = []

  for (const metaFile of metaFiles) {
    const metadata = await readJsonIfExists(metaFile)
    if (!metadata || typeof metadata !== 'object') continue

    if (normalizeString(metadata.pageRelationDecision?.kind) !== 'same-module-subview') continue
    if (normalizeString(metadata.publishDeliveryDecision?.kind) !== 'managed-mf-publish-entry') continue

    const pageDir = path.dirname(metaFile)
    const pageModulePath = await resolveExistingModulePath(path.join(pageDir, 'index'))
    const normalizedPageModulePath = pageModulePath
      ? normalizeRelativePath(path.relative(targetRoot, pageModulePath))
      : ''
    const normalizedExposeTargetPath = normalizeRelativePath(metadata.mfExposeTargetPath || '')
    const styleOwner = normalizeString(metadata.styleDeliveryDecision?.owner)
    const exposeTargetsGeneratedPage =
      Boolean(normalizedExposeTargetPath) &&
      Boolean(normalizedPageModulePath) &&
      normalizeRelativePath(normalizedExposeTargetPath) === normalizeRelativePath(normalizedPageModulePath)

    findings.push({
      metaFile,
      styleOwner,
      pageModulePath: normalizedPageModulePath,
      mfExposeTargetPath: normalizedExposeTargetPath,
      mfExposeUsesManagedPublishEntry: metadata.mfExposeUsesManagedPublishEntry === true,
      exposeTargetsGeneratedPage,
      violated:
        styleOwner === 'page-local-fallback' &&
        exposeTargetsGeneratedPage &&
        metadata.mfExposeUsesManagedPublishEntry !== true,
    })
  }

  return {
    inScope: findings.length > 0,
    reason:
      findings.length === 0
        ? 'No same-module-subview pages currently declare managed publish delivery.'
        : 'Doctor verified whether same-module-subview pages that require managed publish delivery still bypass the host shell through page-local direct exposes.',
    findings,
  }
}

function summarizeSameModuleSubviewManagedPublishBypassFindings(targetRoot, findings) {
  if (findings.length === 0) {
    return 'No same-module-subview pages currently declare managed publish delivery.'
  }

  return findings
    .map((finding) => {
      const issues = []
      if (finding.styleOwner === 'page-local-fallback') {
        issues.push('styleDeliveryDecision still falls back to page-local-fallback')
      }
      if (finding.exposeTargetsGeneratedPage) {
        issues.push(`Module Federation expose still targets generated page module (${finding.mfExposeTargetPath || 'unknown'})`)
      }
      if (finding.mfExposeUsesManagedPublishEntry !== true) {
        issues.push('managed publish entry is not the active expose target')
      }

      return `${path.relative(targetRoot, finding.metaFile)}: ${issues.length ? issues.join('; ') : 'contract ok'}`
    })
    .join(' | ')
}

function getSmokeExpectations(pageType) {
  switch (pageType.smokeGroup) {
    case 'table':
      return [
        '页头、白底主区、筛选区、表格、分页节奏连续',
        '数据统计表时指标卡仍是白卡描边，不是裸文本',
        '表格高度可以收口，不出现整页双滚动',
      ]
    case 'drawer':
      return [
        '抽屉标题、body、footer 节奏正常',
        'footer 顶线和阴影没有回退成默认样式',
        '抽屉内容没有多余卡片和异常行距',
      ]
    case 'full-page':
      return [
        '页面保持单一 PageHeader；若宿主存在共享 header slot，其空态不会保留额外空白',
        '主白底、滚动区、底栏关系正常',
        '不要退化成宿主灰底上的单张白卡页面',
      ]
    default:
      return ['页面整体节奏应接近当前仓库典型页基线']
  }
}

function resolveAdapterGuideLabel(outputRoot, adapterDoc) {
  const base = outputRoot.includes(`${path.sep}.local-context${path.sep}`)
    ? '.'
    : SKILL_CONTEXT_DIR
  return `${base}/${adapterDoc}`.replace(/\\/g, '/')
}

async function writeSmokeReport({
  outputRoot,
  targetRoot,
  manifest,
  doctorStatus,
  mode,
}) {
  const reportPath = path.join(outputRoot, 'SMOKE_REPORT.md')
  if (mode === 'rules-only') {
    const lines = [
      '# Typical Page Preview Smoke Report',
      '',
      `- target root: ${targetRoot}`,
      `- doctor status before smoke: ${doctorStatus}`,
      `- mode: ${mode}`,
      '',
      '## Purpose',
      '',
      '- Rules-only mode does not sync a route gallery, template pages, or host bridge files into the target project.',
      '- Smoke verification should happen on the actual business page after it is generated inside the target project’s own structure.',
      '',
      '## What To Check After Page Generation',
      '',
      '1. Start the target project dev server.',
      '2. Open the real generated page in the target project route tree.',
      '3. Verify the page still matches the selected typical-page shell, spacing rhythm, and right-aligned action areas.',
      '4. If the page imports the managed local runtime, confirm the local styles.css import and the Vite `@hi-ui/schema-types` alias have been handled in the target project.',
      '',
    ]

    await ensureDir(path.dirname(reportPath))
    await fs.writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8')
    return reportPath
  }

  const primaryCases = getPrimarySmokeCases(manifest)
  const lines = [
    '# Typical Page Preview Smoke Report',
    '',
    `- target root: ${targetRoot}`,
    `- doctor status before smoke: ${doctorStatus}`,
    '',
    '## Purpose',
    '',
    '- This report lists the minimum official preview examples that should be opened through the packaged preview runtime before generating business pages.',
    '- The goal is not to verify every route. The goal is to verify that the target project can still render the core shells close to the Figma typical-page baseline.',
    '',
    '## Recommended smoke sequence',
    '',
    '1. Run `pnpm typical-page:doctor` or `npm run typical-page:doctor` first.',
    '2. From the packaged skill root, start the preview runtime with `node scripts/start-preview-runtime.mjs`.',
    '3. Open the primary smoke pages below through the packaged preview runtime routes; do not materialize `src/typical-page-preview/**` into target projects.',
    '4. If multiple smoke pages fail at the same time, stop business-page generation and fix host integration or style loading first.',
    '',
    '## Primary smoke pages',
    '',
    '| Group | Page | Preview route | Official example file |',
    '| --- | --- | --- | --- |',
  ]

  for (const pageType of primaryCases) {
    const runtimeExamplePath = getRuntimeExamplePath(pageType)
    lines.push(
      `| ${pageType.smokeGroup} | ${pageType.label} | \`${pageType.smokePath}\` | \`${runtimeExamplePath}\` |`
    )
  }

  lines.push('', '## Visual pass criteria')

  for (const pageType of primaryCases) {
    lines.push('')
    lines.push(`### ${pageType.label}`)
    for (const item of getSmokeExpectations(pageType)) {
      lines.push(`- ${item}`)
    }
  }

  lines.push('', '## Stop rules', '')
  lines.push('- If the table smoke page fails, first suspect style resources or the host height chain.')
  lines.push('- If the drawer smoke page fails, first suspect default Drawer styles overriding the packaged shell styles.')
  lines.push('- If the full-page smoke page fails, first suspect host header/footer portals or page-shell mounting order.')
  lines.push('- If two or more primary smoke pages fail together, do not continue generating business pages.')

  await ensureDir(path.dirname(reportPath))
  await fs.writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8')
  return reportPath
}

async function main(options) {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const targetRoot = path.resolve(options.target)
    const hostOutputRoot = path.join(targetRoot, 'src', 'typical-page-preview')
    const hostProfile = await detectHostProfile(targetRoot, {
      ignoreRelativePaths: ['src/typical-page-preview'],
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
    const isTypicalPageSourceRepo = await detectTypicalPageSourceRepo(targetRoot)
    const { manifest, manifestPath, lineId } = await loadManifest(skillRoot, options.line)
    const { versionPath, version: skillVersion } = await loadSkillVersion(skillRoot)
    const managedRuntimeDependencyContract =
      await loadManagedLocalRuntimeDependencyContract(skillRoot).catch(() => null)
    const legacySourcePackageName = normalizeImportSpecifier(
      resolveManagedLocalRuntimeEmbeddedSourceSnapshot(managedRuntimeDependencyContract).name
    )
    const shellPackage = await loadShellPackageSnapshot(skillRoot)
    const embeddedShellsSpec = await resolveEmbeddedShellsSpec(
      skillRoot,
      managedRuntimeDependencyContract
    )
    const embeddedShellTarballPath = await resolveEmbeddedShellTarballPath(
      skillRoot,
      managedRuntimeDependencyContract
    )
    const hostIntegrationDependencies = await loadHostIntegrationDependencySnapshot(skillRoot)
    const checks = []

    if (!(await pathExists(targetRoot))) {
      throw new Error(`Target project root does not exist: ${targetRoot}`)
    }

    const packageJsonPath = path.join(targetRoot, 'package.json')
    const pkg = await readJsonIfExists(packageJsonPath)
    const applyStatePath = resolveApplyStatePath(targetRoot)
    const applyState = await readApplyState(applyStatePath)
    const hasLegacyMaterializedPreviewAssets = await detectMaterializedPreviewAssets(hostOutputRoot)
    const outputRoot =
      resolveProjectContextPath(
        targetRoot,
        'outputs',
        mode === 'host-integration' ? 'host-integration-guidance' : 'doctor'
      )
    const appliedSkillVersion = String(applyState?.appliedSkillVersion || '').trim()
    pushCheck(checks, {
      id: 'package-json',
      ok: Boolean(pkg),
      severity: 'error',
      summary: 'package.json exists',
      detail: pkg ? packageJsonPath : `Missing ${packageJsonPath}`,
    })
    pushCheck(checks, {
      id: `${SKILL_PUBLIC_NAME}-apply-version-sync`,
      ok: Boolean(skillVersion) && appliedSkillVersion === skillVersion,
      severity: 'warn',
      summary: `current ${SKILL_PUBLIC_NAME} version matches the last recorded apply version`,
      detail: !skillVersion
        ? `Missing version in ${versionPath}`
        : !applyState
          ? `Missing ${applyStatePath}; re-run pnpm typical-page:apply or npm run typical-page:apply to record ${SKILL_PUBLIC_NAME} ${skillVersion}`
          : !appliedSkillVersion
            ? `Missing appliedSkillVersion in ${applyStatePath}; re-run pnpm typical-page:apply or npm run typical-page:apply`
            : appliedSkillVersion === skillVersion
            ? `${appliedSkillVersion} (${applyStatePath})`
            : `Recorded apply version ${appliedSkillVersion} does not match current ${SKILL_PUBLIC_NAME} ${skillVersion} (${versionPath}); re-run pnpm typical-page:apply or npm run typical-page:apply`,
    })
    pushCheck(checks, {
      id: 'preview-remains-global-skill-only',
      ok: mode !== 'host-integration' || !hasLegacyMaterializedPreviewAssets,
      severity: mode === 'host-integration' ? 'error' : 'warn',
      summary: 'preview examples stay in the packaged preview runtime instead of being materialized into the target project',
      detail:
        mode !== 'host-integration'
          ? `Install mode is ${mode}; project-local preview assets are not part of the contract.`
          : hasLegacyMaterializedPreviewAssets
            ? `Legacy project-local preview assets were detected under ${hostOutputRoot}. Remove src/typical-page-preview/** and use the packaged preview runtime instead.`
            : 'No project-local preview assets were detected. Official examples should be opened from the packaged preview runtime.',
    })
    const nodeRuntimePolicy = await inspectNodeRuntimePolicy(targetRoot)
    const resolvedNodeRuntime = nodeRuntimePolicy.resolvedRuntime
    const isProjectLocalDoctorRun =
      (await resolveComparablePath(targetRoot)) === (await resolveComparablePath(process.cwd()))
    const treatNodeMismatchAsHardFailure =
      nodeRuntimePolicy.expectation.required && isProjectLocalDoctorRun
    pushCheck(checks, {
      id: 'node-runtime-compatibility',
      ok:
        !nodeRuntimePolicy.expectation.required ||
        nodeRuntimePolicy.compatible ||
        !treatNodeMismatchAsHardFailure,
      severity: !nodeRuntimePolicy.expectation.required
        ? 'warn'
        : treatNodeMismatchAsHardFailure
          ? 'error'
          : 'warn',
      summary: 'current Node runtime matches the project engine before hiui-design integration proceeds',
      detail:
        !nodeRuntimePolicy.expectation.required
          ? nodeRuntimePolicy.detail
          : nodeRuntimePolicy.compatible
            ? nodeRuntimePolicy.detail
            : treatNodeMismatchAsHardFailure
              ? formatDoctorNodeRuntimeHardFailureDetail(nodeRuntimePolicy)
              : `${nodeRuntimePolicy.detail} Because this run is targeting another project root, keep this as a warning and rerun doctor from the target project runtime before treating it as a blocking integration failure.`,
    })
    const shouldExpectLauncherAlignment =
      isProjectLocalDoctorRun && nodeRuntimePolicy.expectation.type === 'explicit-version'
    const launcherAligned =
      resolvedNodeRuntime.nodeVersion === nodeRuntimePolicy.launcherNode || !resolvedNodeRuntime.reliable
    pushCheck(checks, {
      id: 'node-runtime-launcher-drift',
      ok: !shouldExpectLauncherAlignment || launcherAligned,
      severity: shouldExpectLauncherAlignment ? 'error' : 'warn',
      summary: shouldExpectLauncherAlignment
        ? 'launcher Node stays aligned with the explicit project runtime after doctor entry handoff'
        : 'launcher Node and target project runtime are aligned when doctor is run externally',
      detail:
        !resolvedNodeRuntime.reliable
          ? resolvedNodeRuntime.detail
          : launcherAligned
            ? `Launcher Node ${nodeRuntimePolicy.launcherNode} matches the resolved ${resolvedNodeRuntime.packageManager} runtime.`
            : shouldExpectLauncherAlignment
              ? `Launcher Node ${nodeRuntimePolicy.launcherNode} differs from resolved target runtime ${resolvedNodeRuntime.nodeVersion} even though this local doctor run should already have been re-executed under ${nodeRuntimePolicy.expectation.source} ${nodeRuntimePolicy.expectation.spec}. This indicates a runtime handoff gap in the doctor entry or one of its child launch paths.`
              : `Launcher Node ${nodeRuntimePolicy.launcherNode} differs from resolved target runtime ${resolvedNodeRuntime.nodeVersion}. External doctor runs should prefer the target project's package manager runtime.`,
    })

    const targetManagedLocalRuntimeRoot = path.join(targetRoot, 'src', getManagedLocalRuntimeRoot())
    const targetManagedLocalRuntimeEntryPath = path.join(targetManagedLocalRuntimeRoot, 'index.js')
    const targetManagedLocalRuntimeQueryFilterBridgePath = path.join(
      targetManagedLocalRuntimeRoot,
      'pro-list-page',
      'bridge',
      'query-filter.js'
    )
    const managedDependencyDrifts =
      pkg && managedRuntimeDependencyContract
        ? collectManagedDependencyVersionDrift({
            pkg,
            managedRuntimeDependencies: managedRuntimeDependencyContract.dependencies,
            embeddedShellsSpec,
            hostIntegrationDependencies,
            mode,
          })
        : []
    pushCheck(checks, {
      id: 'host-profile',
      ok: true,
      severity: 'warn',
      summary: 'target project host profile is detected for adapter guidance and risk context',
      detail: `${hostProfile.projectType} / ${hostProfile.framework} / ${hostProfile.runtime} / ${hostProfile.routing} / risk=${hostProfile.riskLevel || 'low'}${hostProfile.riskTags?.length ? ` (${hostProfile.riskTags.join(', ')})` : ''}`,
    })
    pushCheck(checks, {
      id: 'legacy-host-risk-surfaced',
      ok: true,
      severity: 'warn',
      summary: 'legacy host risk is surfaced explicitly instead of being flattened into a generic ready/pass signal',
      detail:
        hostProfile.riskLevel === 'high'
          ? `High-risk legacy host detected. ${hostProfile.reason}`
          : hostProfile.riskLevel === 'medium'
            ? `Medium-risk compatibility host detected. ${hostProfile.reason}`
            : 'No elevated legacy-host risk traits were detected beyond the standard adapter guidance path.',
    })
    const legacyMfSharedRuntimeContract = await inspectLegacyMfSharedRuntimeContract({
      targetRoot,
      hostProfile,
      pkg,
    })
    pushCheck(checks, {
      id: 'legacy-mf-shared-runtime-contract',
      ok: legacyMfSharedRuntimeContract.ok,
      severity: 'warn',
      summary:
        'legacy existing-system Module Federation hosts keep the old shared singleton contract from hijacking isolated HiUI5 typical-page runtimes',
      detail: legacyMfSharedRuntimeContract.detail,
    })
    pushCheck(checks, {
      id: 'mode-resolution',
      ok: true,
      severity: 'warn',
      summary: 'doctor mode is derived from explicit input, recorded evidence, or the compatibility-bridge probe',
      detail:
        modeResolution.source === 'explicit'
          ? `Doctor ran with explicit --mode ${mode}.`
          : modeResolution.source === 'apply-state'
            ? `Doctor reused appliedMode ${mode} from ${applyStatePath}.`
            : modeResolution.source === 'environment-probe'
              ? `Doctor resolved ${mode} by checking whether the target requires a project-local compatibility bridge. ${modeResolution.reason || ''}`.trim()
              : `Doctor resolved mode ${mode} from source ${modeResolution.source}.`,
    })
    const generationContractViolations = await collectGenerationContractViolations({
      manifest,
      skillRoot,
    })
    pushCheck(checks, {
      id: 'page-type-generation-contracts',
      ok: generationContractViolations.length === 0,
      severity: 'error',
      summary:
        'every registered page type has a machine-readable generation contract before AI writes code',
      detail:
        generationContractViolations.length === 0
          ? `${manifest.pageTypes.length} page types have generationContract, official base templates, required shell checks, business slots, forbidden tokens, and light sanity checks`
          : generationContractViolations.slice(0, 20).join('; '),
    })
    const templateSanityViolations = await collectTemplateSanityViolations({
      manifest,
      skillRoot,
    })
    pushCheck(checks, {
      id: 'page-type-template-sanity',
      ok: templateSanityViolations.length === 0,
      severity: 'error',
      summary: 'each official page template satisfies its page-specific component contract',
      detail:
        templateSanityViolations.length === 0
          ? `${manifest.pageTypes.length} official templates satisfy their required imports, shell components, providers, page-specific slots, forbidden tokens, and field-count gates`
          : templateSanityViolations.slice(0, 30).join('; '),
    })
    const pageContractFindings = await collectPageContractFindings({
      targetRoot,
      legacySourcePackageName,
    })
    const pageContractViolations = pageContractFindings.filter((finding) => {
      const layoutOk =
        finding.layout.hasPageHeader &&
        finding.layout.hasWhiteBody &&
        finding.layout.pageHeaderBeforeWhiteBody &&
        finding.layout.proDetailBeforeSchemaGroup
      const styleOk =
        finding.styleExists &&
        finding.style.hasWhiteBodyClass &&
        finding.style.whiteBodyFlexFill &&
        finding.style.hasMinHeightZero &&
        finding.style.hasWhiteBackground &&
        finding.style.hasV5DescriptionLabelAlignment
      const dataShapeOk = finding.missingInlineGroupDataMappers.length === 0
      return !(layoutOk && styleOk && dataShapeOk)
    })

    pushCheck(checks, {
      id: 'page-contract-full-page-detail',
      ok: pageContractViolations.length === 0,
      severity: 'error',
      summary: 'generated full-page detail pages keep the complete official template contract',
      detail:
        pageContractViolations.length === 0
          ? summarizePageContractFindings(targetRoot, pageContractFindings)
          : summarizePageContractFindings(targetRoot, pageContractViolations),
    })
    const mfPublishEntryContract = await collectMfPublishEntryContractFindings({
      targetRoot,
      mode,
      hostProfile,
    })
    const mfPublishEntryViolations = mfPublishEntryContract.findings.filter((finding) => {
      return (
        !finding.pageModuleExists ||
        finding.directExposeEntries.length > 0 ||
        !finding.managedPublishEntryExists ||
        !finding.managedPublishEntryImportsShellStyles ||
        finding.publishEntryExposeEntries.length === 0
      )
    })
    pushCheck(checks, {
      id: 'rules-only-mf-publish-entry-contract',
      ok: !mfPublishEntryContract.inScope || mfPublishEntryViolations.length === 0,
      severity: 'error',
      summary:
        'rules-only direct-expose pages deliver shell styles through managed Module Federation publish entries',
      detail: !mfPublishEntryContract.inScope
        ? mfPublishEntryContract.reason
        : mfPublishEntryViolations.length === 0
          ? summarizeMfPublishEntryContractFindings(targetRoot, mfPublishEntryContract.findings)
          : summarizeMfPublishEntryContractFindings(targetRoot, mfPublishEntryViolations),
    })
    const sameModuleSubviewStyleDeliveryContract =
      await collectSameModuleSubviewStyleDeliveryFindings({
        targetRoot,
      })
    const sameModuleSubviewManagedPublishBypassContract =
      await collectSameModuleSubviewManagedPublishBypassFindings({
        targetRoot,
      })
    const sameModuleSubviewStyleDeliveryViolations =
      sameModuleSubviewStyleDeliveryContract.findings.filter(
        (finding) => !finding.verification.ok
      )
    pushCheck(checks, {
      id: 'same-module-subview-style-delivery-contract',
      ok:
        !sameModuleSubviewStyleDeliveryContract.inScope ||
        sameModuleSubviewStyleDeliveryViolations.length === 0,
      severity: 'error',
      summary:
        'same-module-subview pages keep an explicit style-delivery owner and that owner really imports the managed runtime styles',
      detail: !sameModuleSubviewStyleDeliveryContract.inScope
        ? sameModuleSubviewStyleDeliveryContract.reason
        : sameModuleSubviewStyleDeliveryViolations.length === 0
          ? summarizeSameModuleSubviewStyleDeliveryFindings(
              targetRoot,
              sameModuleSubviewStyleDeliveryContract.findings
            )
          : summarizeSameModuleSubviewStyleDeliveryFindings(
              targetRoot,
              sameModuleSubviewStyleDeliveryViolations
            ),
    })
    pushCheck(checks, {
      id: 'mode-profile-compatibility',
      ok: mode === 'rules-only' || mode === 'host-integration',
      severity: 'warn',
      summary: 'the chosen install mode remains compatible with the detected host profile constraints',
      detail:
        mode === 'host-integration'
          ? `host-integration is acceptable when the target project keeps preview examples in the packaged preview runtime and does not retain project-local preview routes or galleries. ${hostProfile.reason}`
          : mode === 'rules-only'
            ? `rules-only keeps the existing host in place while reusing generation rules and shell runtime contracts. ${hostProfile.reason}`
            : `Current doctor mode ${mode} is not recognized as compatible with the detected host profile. ${hostProfile.reason}`,
    })
    pushCheck(checks, {
      id: 'framework-adapter-guide',
      ok: true,
      severity: 'warn',
      summary: 'a framework-specific host adapter guide is available when needed',
      detail: hostProfile.adapterDoc
        ? `${hostProfile.adapterDoc}${hostProfile.adapterEntryHints.length > 0 ? `; candidate entry files: ${hostProfile.adapterEntryHints.join(', ')}` : ''}`
        : 'No framework-specific adapter guide is required for the detected host profile',
    })
    const frameworkHostEntryRequirement = getFrameworkHostEntryRequirement(hostProfile, targetRoot)
    if (frameworkHostEntryRequirement.required) {
      pushCheck(checks, {
        id: 'framework-host-entry',
        ok: frameworkHostEntryRequirement.ok,
        severity: frameworkHostEntryRequirement.severity,
        summary: frameworkHostEntryRequirement.summary,
        detail: frameworkHostEntryRequirement.detail,
      })
    }

    pushCheck(checks, {
      id: 'shells-declared',
      ok: await pathExists(targetManagedLocalRuntimeEntryPath),
      severity: mode === 'host-integration' ? 'error' : 'warn',
      summary: 'managed local runtime assets are materialized in src/components/hiui-design-runtime',
      detail: (await pathExists(targetManagedLocalRuntimeEntryPath))
        ? targetManagedLocalRuntimeRoot
        : mode === 'host-integration'
          ? 'Managed local runtime assets were not materialized under src/components/hiui-design-runtime'
          : 'Rules-only mode requires the managed local runtime assets before generating business pages.',
    })
    pushCheck(checks, {
      id: 'managed-dependency-versions',
      ok: managedDependencyDrifts.length === 0,
      severity: 'error',
      summary:
        'typical-page managed dependencies satisfy docs/onboarding/managed-local-runtime-dependencies.json, while compatible isolated aliases may remain on an equivalent prerelease channel',
      detail:
        managedDependencyDrifts.length === 0
          ? 'package.json managed deps satisfy docs/onboarding/managed-local-runtime-dependencies.json'
          : managedDependencyDrifts
              .slice(0, 10)
              .map((item) => `${item.depName}: ${item.actual} -> ${item.expected}`)
              .join('; '),
    })

    const installedQueryFilterFormPath = path.join(
      targetRoot,
      'node_modules',
      '@hi-ui',
      'query-filter',
      'lib',
      'esm',
      'FilterForm',
      'index.js'
    )
    const targetEmbeddedShellTarballPath = shellPackage
      ? resolveProjectContextPath(targetRoot, 'vendor', `runtime-source-package-${shellPackage.version}.tgz`)
      : ''
    pushCheck(checks, {
      id: 'shells-installed',
      ok: await pathExists(targetManagedLocalRuntimeEntryPath),
      severity: 'warn',
      summary: 'managed local runtime assets exist in the target project source tree',
      detail: (await pathExists(targetManagedLocalRuntimeEntryPath))
        ? targetManagedLocalRuntimeRoot
        : 'Managed local runtime files were not found under src/components/hiui-design-runtime.',
    })

    if (targetEmbeddedShellTarballPath) {
      const vendoredShellTarball = await inspectQueryFilterBridgeTarball(targetEmbeddedShellTarballPath)
      pushCheck(checks, {
        id: 'vendored-shells-query-filter-defaults',
        ok: vendoredShellTarball.exists && vendoredShellTarball.reasons.length === 0,
        severity: 'error',
        summary:
          'optional embedded runtime-source-package tarball keeps the HiUI5 QueryFilter contained/no-label defaults and official all-filter clear behavior',
        detail:
          !vendoredShellTarball.exists
            ? `Expected optional embedded tarball was not found at ${targetEmbeddedShellTarballPath}`
            : vendoredShellTarball.reasons.length === 0
              ? path.relative(targetRoot, vendoredShellTarball.filePath)
              : `${path.relative(targetRoot, vendoredShellTarball.filePath)} -> ${vendoredShellTarball.reasons.join('; ')}`,
      })
    }

    const installedShellBridge = await inspectQueryFilterBridgeFile(
      targetManagedLocalRuntimeQueryFilterBridgePath
    )
    pushCheck(checks, {
      id: 'installed-shells-query-filter-defaults',
      ok: !installedShellBridge.exists || installedShellBridge.reasons.length === 0,
      severity: 'error',
      summary:
        'managed local runtime keeps the HiUI5 QueryFilter contained/no-label defaults and official all-filter clear behavior',
      detail:
        !installedShellBridge.exists
          ? 'Managed local runtime QueryFilter bridge was not found; re-run bootstrap or regenerate the managed local runtime assets.'
          : installedShellBridge.reasons.length === 0
            ? path.relative(targetRoot, installedShellBridge.filePath)
            : `${path.relative(targetRoot, installedShellBridge.filePath)} -> ${installedShellBridge.reasons.join('; ')}. Re-run bootstrap or refresh the managed local runtime assets after updating .local-context.`,
    })

    const installedQueryFilterForm = await inspectQueryFilterPackageFile(installedQueryFilterFormPath)
    pushCheck(checks, {
      id: 'installed-query-filter-gap-forwarding',
      ok: !installedQueryFilterForm.exists || installedQueryFilterForm.reasons.length === 0,
      severity: 'error',
      summary: '@hi-ui/query-filter forwards its own 8px gap to the rendered flex layout',
      detail:
        !installedQueryFilterForm.exists
          ? 'Installed @hi-ui/query-filter FilterForm was not found; run dependency install before visual acceptance'
          : installedQueryFilterForm.reasons.length === 0
            ? path.relative(targetRoot, installedQueryFilterForm.filePath)
            : `${path.relative(targetRoot, installedQueryFilterForm.filePath)} -> ${installedQueryFilterForm.reasons.join('; ')}. Do not patch page CSS or @hi-ui/form globally; patch @hi-ui/query-filter or upgrade to a fixed package.`,
    })

    const entryFile = await detectAppEntryFile(targetRoot)
    pushCheck(checks, {
      id: 'app-entry',
      ok: Boolean(entryFile),
      severity: mode === 'host-integration' ? 'error' : 'manual',
      summary: 'app entry file can be detected',
      detail: entryFile || 'Expected a src/main.* or src/index.* entry file',
    })

    const entryRaw = entryFile ? await readTextIfExists(entryFile) : ''
    const hasStyleImport = hasManagedLocalRuntimeStyleImport(entryRaw)
    const hasReactCompatImport =
      entryRaw.includes(`import '@hi-ui/patch-for-react'`) ||
      entryRaw.includes('import "@hi-ui/patch-for-react"')
    const react19ManagedRuntimePatchWiring = await inspectReact19ManagedRuntimePatchWiring({
      targetRoot,
      hostProfile,
      pkg,
    })
    const installedReact19RuntimePatchCoverage = await inspectInstalledReact19RuntimePatchCoverage({
      targetRoot,
      hostProfile,
    })
    const reactDomClientCompatibility = await inspectReactDomClientCompatibility({
      targetRoot,
      hostProfile,
    })
    const reactJsxRuntimeCompatibility = await inspectReactJsxRuntimeCompatibility({
      targetRoot,
      hostProfile,
    })
    const targetSourceRoot = path.join(targetRoot, 'src')
    const managedHostContract = await inspectManagedHostContract(targetRoot)
    const targetSourceSignals = mergeManagedHostContractSignals(
      targetRoot,
      await collectTypicalPageSourceSignals(targetSourceRoot, { legacySourcePackageName }),
      managedHostContract
    )
    const sharedRuntimeDependencyContract = await loadSharedRuntimeDirectDependencySnapshot(skillRoot)
    const requiredSharedRuntimeDirectDependencies = selectEntryImportedSharedRuntimeDirectDependencies({
      entrySource: entryRaw,
      dependencyMap: sharedRuntimeDependencyContract,
    })
    const sharedRuntimeDependencyInspection = await inspectDeclaredSharedRuntimeDirectDependencies({
      targetRoot,
      pkg,
      expectedDependencies: requiredSharedRuntimeDirectDependencies,
    })
    pushCheck(checks, {
      id: 'styles-import',
      ok: hasStyleImport,
      severity: 'error',
      summary: 'managed local runtime styles are imported once in the app entry',
      detail: hasStyleImport
        ? entryFile
        : mode === 'host-integration'
          ? 'Missing managed local runtime styles.css import in the detected app entry'
          : 'Rules-only mode also relies on the managed local runtime baseline. Add the local hiui-design runtime styles.css import in the detected app entry before generating business pages.',
    })

    pushCheck(checks, {
      id: 'react-compat-import',
      ok: hasReactCompatImport,
      severity: 'error',
      summary: 'React compatibility patch is imported once in the app entry',
      detail: hasReactCompatImport
        ? entryFile
        : mode === 'host-integration'
          ? 'Missing `import \'@hi-ui/patch-for-react\'` in the detected app entry'
          : 'Rules-only mode also uses the managed local runtime compatibility baseline. Add `import \'@hi-ui/patch-for-react\'` in the detected app entry before generating business pages.',
    })
    pushCheck(checks, {
      id: 'shared-runtime-direct-dependencies',
      ok:
        sharedRuntimeDependencyInspection.declaredOk &&
        sharedRuntimeDependencyInspection.resolvableOk,
      severity: 'error',
      summary:
        'shared runtime direct dependencies imported by the app entry are declared and resolvable',
      detail: describeSharedRuntimeDirectDependencyInspection(sharedRuntimeDependencyInspection),
    })
    pushCheck(checks, {
      id: 'react19-managed-runtime-patch-wiring',
      ok: react19ManagedRuntimePatchWiring.ok,
      severity: react19ManagedRuntimePatchWiring.required ? 'error' : 'warn',
      summary: 'React 19 hosts keep the managed runtime patch wiring active in package.json and .local-context',
      detail: react19ManagedRuntimePatchWiring.detail,
    })
    pushCheck(checks, {
      id: 'installed-react19-runtime-patch-coverage',
      ok: installedReact19RuntimePatchCoverage.ok,
      severity: installedReact19RuntimePatchCoverage.required ? 'error' : 'warn',
      summary:
        'installed React 19 runtime hotspots are patched across @hi-ui and compatible hiui5 alias packages',
      detail: installedReact19RuntimePatchCoverage.detail,
    })
    pushCheck(checks, {
      id: 'react-dom-client-legacy-host-branch',
      ok: reactDomClientCompatibility.ok,
      severity: reactDomClientCompatibility.needsCompatBranch ? 'error' : 'warn',
      summary: 'legacy React hosts expose an explicit react-dom/client compatibility branch before typical-page shells run',
      detail: !reactDomClientCompatibility.needsCompatBranch
        ? `Detected React ${reactDomClientCompatibility.reactMajor || 'unknown'}; an explicit react-dom/client shim branch is not required.`
        : reactDomClientCompatibility.ok
          ? `Legacy React ${reactDomClientCompatibility.reactMajor} host keeps react-dom/client compatibility via ${reactDomClientCompatibility.aliasConfigMatches.map((filePath) => path.relative(targetRoot, filePath)).join(', ')} and ${path.relative(targetRoot, reactDomClientCompatibility.shimPath)}.`
          : reactDomClientCompatibility.aliasConfigMatches.length === 0
            ? `Legacy React ${reactDomClientCompatibility.reactMajor} host is missing a build alias or resolver branch for react-dom/client. ${buildLegacyReactCompatAutofixHint()}`
            : !reactDomClientCompatibility.shimPath
              ? `Legacy React ${reactDomClientCompatibility.reactMajor} host references react-dom/client in ${reactDomClientCompatibility.aliasConfigMatches.map((filePath) => path.relative(targetRoot, filePath)).join(', ')}, but no shim file was found under src/shims/react-dom-client.*. ${buildLegacyReactCompatAutofixHint()}`
              : `Legacy React ${reactDomClientCompatibility.reactMajor} host has ${path.relative(targetRoot, reactDomClientCompatibility.shimPath)}, but it does not look like a render/unmount compatibility shim.`,
    })
    pushCheck(checks, {
      id: 'react-jsx-runtime-legacy-host-branch',
      ok: reactJsxRuntimeCompatibility.ok,
      severity: reactJsxRuntimeCompatibility.needsCompatBranch ? 'error' : 'warn',
      summary: 'legacy React 16 hosts expose an explicit react/jsx-runtime compatibility branch before typical-page shells run',
      detail: !reactJsxRuntimeCompatibility.needsCompatBranch
        ? `Detected React ${reactJsxRuntimeCompatibility.reactMajor || 'unknown'} or a non-legacy host path; an explicit react/jsx-runtime shim branch is not required.`
        : reactJsxRuntimeCompatibility.ok
          ? `Legacy React ${reactJsxRuntimeCompatibility.reactMajor} host keeps react/jsx-runtime compatibility via ${reactJsxRuntimeCompatibility.aliasConfigMatches.map((filePath) => path.relative(targetRoot, filePath)).join(', ')} and ${path.relative(targetRoot, reactJsxRuntimeCompatibility.shimPath)}.`
          : reactJsxRuntimeCompatibility.aliasConfigMatches.length === 0
            ? `Legacy React ${reactJsxRuntimeCompatibility.reactMajor} host is missing a build alias or resolver branch for react/jsx-runtime. ${buildLegacyReactCompatAutofixHint()}`
            : !reactJsxRuntimeCompatibility.shimPath
              ? `Legacy React ${reactJsxRuntimeCompatibility.reactMajor} host references react/jsx-runtime in ${reactJsxRuntimeCompatibility.aliasConfigMatches.map((filePath) => path.relative(targetRoot, filePath)).join(', ')}, but no shim file was found under src/shims/react-jsx-runtime.*. ${buildLegacyReactCompatAutofixHint()}`
              : `Legacy React ${reactJsxRuntimeCompatibility.reactMajor} host has ${path.relative(targetRoot, reactJsxRuntimeCompatibility.shimPath)}, but it does not look like a jsx/jsxs compatibility shim.`,
    })

    pushCheck(checks, {
      id: 'no-legacy-source-package-imports',
      ok: targetSourceSignals.legacySourcePackageImports.length === 0,
      severity: 'error',
      summary: 'project source no longer imports the managed local runtime source-package family',
      detail:
        targetSourceSignals.legacySourcePackageImports.length === 0
          ? `No legacy source-package import${legacySourcePackageName ? ` from ${legacySourcePackageName}` : ''} was detected in the current project source.`
          : `Replace legacy source-package imports${legacySourcePackageName ? ` from ${legacySourcePackageName}` : ''} with src/components/hiui-design-runtime entrypoints before continuing. Examples: ${summarizePathList(targetRoot, targetSourceSignals.legacySourcePackageImports)}`,
    })

    pushCheck(checks, {
      id: 'no-private-source-package-import-paths',
      ok: targetSourceSignals.privateImportViolations.length === 0,
      severity: 'error',
      summary: 'project source does not import managed runtime source-package code through node_modules, .pnpm, or dist private paths',
      detail:
        targetSourceSignals.privateImportViolations.length === 0
          ? `${targetSourceRoot} uses only managed local runtime imports or public package import paths`
          : `Use managed local runtime imports or public package entrypoints instead of private install paths or workspace source paths. Examples: ${summarizePrivateImportViolations(targetRoot, targetSourceSignals.privateImportViolations)}`,
    })

    pushCheck(checks, {
      id: 'no-stale-query-filter-bridge',
      ok: targetSourceSignals.staleQueryFilterBridgeViolations.length === 0,
      severity: 'error',
      summary: 'project source does not keep an outdated QueryFilter adaptation layer that overrides HiUI5 defaults',
      detail:
        targetSourceSignals.staleQueryFilterBridgeViolations.length === 0
          ? 'No copied adaptation layer was found that forces QueryFilter field appearance or reintroduces the legacy defaults helper'
          : `Sync these files back to the public package adaptation layer before continuing: ${summarizeQueryFilterBridgeViolations(targetRoot, targetSourceSignals.staleQueryFilterBridgeViolations)}`,
    })

    pushCheck(checks, {
      id: 'inline-query-filter-show-label-default',
      ok: targetSourceSignals.queryFilterShowLabelViolations.length === 0,
      severity: 'error',
      summary: 'managed list-page QueryFilter is not forced back to showLabel={true} in project source',
      detail:
        targetSourceSignals.queryFilterShowLabelViolations.length === 0
          ? 'No managed list-page source forces QueryFilter back to the old external-label layout'
          : `Remove explicit showLabel={true} from: ${summarizePathList(targetRoot, targetSourceSignals.queryFilterShowLabelViolations)}`,
    })

    pushCheck(checks, {
      id: 'shells-declared-when-used',
      ok: targetSourceSignals.usesShells.length === 0 || await pathExists(targetManagedLocalRuntimeEntryPath),
      severity: 'error',
      summary: 'once project source uses runtime shells, managed local runtime assets are present in src/components/hiui-design-runtime',
      detail:
        targetSourceSignals.usesShells.length === 0 || await pathExists(targetManagedLocalRuntimeEntryPath)
          ? targetSourceSignals.usesShells.length === 0
            ? 'No current source file imports managed local runtime shells yet'
            : `Managed local runtime assets are present and used by: ${summarizePathList(targetRoot, targetSourceSignals.usesShells)}`
          : `Source files already import managed local runtime shells but src/components/hiui-design-runtime is missing. Examples: ${summarizePathList(targetRoot, targetSourceSignals.usesShells)}`,
    })

    pushCheck(checks, {
      id: 'styles-import-when-shells-used',
      ok: targetSourceSignals.usesShells.length === 0 || hasStyleImport,
      severity: 'error',
      summary: 'once project source uses managed local runtime shells, styles.css is already imported in the app entry',
      detail:
        targetSourceSignals.usesShells.length === 0 || hasStyleImport
          ? targetSourceSignals.usesShells.length === 0
            ? 'No current source file imports managed local runtime shells yet'
            : entryFile
          : `Source files already use managed local runtime shells, so add the local hiui-design runtime styles.css import in the app entry before continuing. Examples: ${summarizePathList(targetRoot, targetSourceSignals.usesShells)}`,
    })

    pushCheck(checks, {
      id: 'single-host-adapter-path-family',
      ok:
        targetSourceSignals.localHostAdapterImports.length === 0 ||
        targetSourceSignals.legacySourcePackageImports.length === 0,
      severity: 'error',
      summary: 'host provider and page shells do not mix local host-adapter paths with legacy source-package imports',
      detail:
        targetSourceSignals.localHostAdapterImports.length === 0 ||
        targetSourceSignals.legacySourcePackageImports.length === 0
          ? 'No mixed local-host-adapter and legacy source-package import pattern was detected'
          : `Do not mix local host adapter paths with legacy source-package imports${legacySourcePackageName ? ` from ${legacySourcePackageName}` : ''}. Local adapter examples: ${summarizePathList(targetRoot, targetSourceSignals.localHostAdapterImports)}; legacy package import examples: ${summarizePathList(targetRoot, targetSourceSignals.legacySourcePackageImports)}`,
    })

    const hasFormalHeaderPortalCarrier = targetSourceSignals.formalHeaderPortalCarrierFiles.length > 0
    pushCheck(checks, {
      id: 'formal-host-provider-bridge-for-package-shells',
      ok:
        !hasFormalHeaderPortalCarrier ||
        targetSourceSignals.formalTypicalPageHostBridgeFiles.length > 0,
      severity: 'warn',
      summary: 'formal host bridge for shared header/footer carriers is recorded as compatibility evidence only',
      detail:
        !hasFormalHeaderPortalCarrier || targetSourceSignals.formalTypicalPageHostBridgeFiles.length > 0
          ? hasFormalHeaderPortalCarrier
            ? `Formal host bridge found in: ${summarizePathList(targetRoot, targetSourceSignals.formalTypicalPageHostBridgeFiles)}`
            : 'No formal host page-header carrier was detected outside preview assets'
          : `Formal host has a shared page-header carrier (${summarizePathList(targetRoot, targetSourceSignals.formalHeaderPortalCarrierFiles)}), but no TypicalPageHostProvider headerPortal bridge was found outside preview assets. This no longer blocks self-contained standard pages, but any host-level shared carrier should remain explicitly governed as a compatibility bridge.`,
    })

    pushCheck(checks, {
      id: 'formal-host-outlet-height-chain-contract',
      ok:
        !hasFormalHeaderPortalCarrier ||
        targetSourceSignals.formalContentOutletHeightContractFiles.length > 0 ||
        targetSourceSignals.formalOfficialShellHeightContractFiles.length > 0,
      severity: 'error',
      summary: 'formal host shared content outlet preserves the flex/min-height/overflow contract required by non-drawer pages',
      detail:
        !hasFormalHeaderPortalCarrier ||
        targetSourceSignals.formalContentOutletHeightContractFiles.length > 0 ||
        targetSourceSignals.formalOfficialShellHeightContractFiles.length > 0
          ? hasFormalHeaderPortalCarrier
            ? `Formal host outlet height-chain contract found in: ${summarizePathList(
                targetRoot,
                targetSourceSignals.formalContentOutletHeightContractFiles.length > 0
                  ? targetSourceSignals.formalContentOutletHeightContractFiles
                  : targetSourceSignals.formalOfficialShellHeightContractFiles
              )}`
            : 'No formal host page-header carrier was detected outside preview assets'
          : `Formal host has a page-header carrier (${summarizePathList(targetRoot, targetSourceSignals.formalHeaderPortalCarrierFiles)}), but no shared content-outlet flex/min-height/overflow contract was found. Non-drawer pages can shrink to content height and expose blank space below the white body.`,
    })

    pushCheck(checks, {
      id: 'formal-host-height-chain-for-official-shells',
      ok:
        !hasFormalHeaderPortalCarrier ||
        targetSourceSignals.formalOfficialShellHeightContractFiles.length > 0,
      severity: 'error',
      summary: 'formal host gives official typical-page shells a continuous flex/min-height height chain',
      detail:
        !hasFormalHeaderPortalCarrier || targetSourceSignals.formalOfficialShellHeightContractFiles.length > 0
          ? hasFormalHeaderPortalCarrier
            ? `Formal host height-chain contract found in: ${summarizePathList(targetRoot, targetSourceSignals.formalOfficialShellHeightContractFiles)}`
            : 'No formal host page-header carrier was detected outside preview assets'
          : `Formal host has a page-header carrier (${summarizePathList(targetRoot, targetSourceSignals.formalHeaderPortalCarrierFiles)}), but no host-level flex/min-height/overflow contract for official shell roots (${OFFICIAL_SHELL_ROOT_CLASS_TOKENS.join(', ')}) was found. Official table/stat/tree/detail pages can shrink to content height and expose blank space below the white body.`,
    })

    pushCheck(checks, {
      id: 'formal-host-content-gutter-contract',
      ok:
        !hasFormalHeaderPortalCarrier || targetSourceSignals.formalContentGutterFiles.length > 0,
      severity: 'error',
      summary: 'formal host shared content outlet keeps the required 16px viewport gutter for non-drawer pages',
      detail:
        !hasFormalHeaderPortalCarrier || targetSourceSignals.formalContentGutterFiles.length > 0
          ? hasFormalHeaderPortalCarrier
            ? `Formal host content gutter contract found in: ${summarizePathList(targetRoot, targetSourceSignals.formalContentGutterFiles)}`
            : 'No formal host page-header carrier was detected outside preview assets'
          : `Formal host has a shared content area (${summarizePathList(targetRoot, targetSourceSignals.formalHeaderPortalCarrierFiles)}), but no proven 16px shared content-outlet gutter was found. Non-drawer pages can lose the required viewport breathing room and let the white content area stick to the right edge.`,
    })
    const sameModuleSubviewManagedPublishBypassViolations =
      sameModuleSubviewManagedPublishBypassContract.findings.filter((finding) => finding.violated)
    pushCheck(checks, {
      id: 'same-module-subview-managed-publish-entry-bypass',
      ok:
        !sameModuleSubviewManagedPublishBypassContract.inScope ||
        targetSourceSignals.formalContentGutterFiles.length === 0 ||
        sameModuleSubviewManagedPublishBypassViolations.length === 0,
      severity: 'error',
      summary:
        'same-module-subview pages that require managed publish delivery must not bypass the host shell through page-local direct exposes when the formal host declares the 16px content gutter contract',
      detail: !sameModuleSubviewManagedPublishBypassContract.inScope
        ? sameModuleSubviewManagedPublishBypassContract.reason
        : targetSourceSignals.formalContentGutterFiles.length === 0
          ? 'Formal host content gutter contract is not proven, so the publish-bypass contradiction check is informational only in this run.'
          : sameModuleSubviewManagedPublishBypassViolations.length === 0
            ? summarizeSameModuleSubviewManagedPublishBypassFindings(
                targetRoot,
                sameModuleSubviewManagedPublishBypassContract.findings
              )
            : summarizeSameModuleSubviewManagedPublishBypassFindings(
                targetRoot,
                sameModuleSubviewManagedPublishBypassViolations
              ),
    })

    pushCheck(checks, {
      id: 'table-header-extra-class',
      ok: targetSourceSignals.tableHeaderExtraViolations.length === 0,
      severity: 'warn',
      summary: 'TablePageFrame pages with title actions keep the typical-page header extra class rhythm',
      detail:
        targetSourceSignals.tableHeaderExtraViolations.length === 0
          ? 'No TablePageFrame page was found with an unclassified header action group'
          : `Add proTablePageStyles.headerExtra or proStatPageStyles.headerExtra to the title action container in: ${summarizePathList(targetRoot, targetSourceSignals.tableHeaderExtraViolations)}`,
    })

    const viteConfigPath = await detectViteConfigFile(targetRoot)
    if (viteConfigPath) {
      const viteRaw = await readTextIfExists(viteConfigPath)
      const hasSchemaTypesAlias = viteRaw.includes('@hi-ui/schema-types')
      const schemaTypesShimPath = resolveProjectContextPath(
        targetRoot,
        'examples',
        'host-integration',
        'src',
        'shims',
        'schema-types-empty.js'
      )

      pushCheck(checks, {
        id: 'vite-schema-types-alias',
        ok: hasSchemaTypesAlias,
        severity: 'error',
        summary: 'Vite config aliases @hi-ui/schema-types for the managed local runtime baseline',
        detail: hasSchemaTypesAlias
          ? viteConfigPath
          : `Add an alias in ${viteConfigPath} pointing @hi-ui/schema-types to ${schemaTypesShimPath} before generating business pages or opening the preview runtime.`,
      })
    }

    if (mode === 'rules-only') {
      pushCheck(checks, {
        id: 'rules-only-no-host-sync',
        ok: true,
        severity: 'warn',
        summary: 'rules-only mode keeps template pages and host bridge files inside .local-context',
        detail:
          'No src/typical-page-preview gallery, routes, or host bridge files are required. Rules-only still keeps the managed local runtime baseline in the target project, so generate new pages directly in the existing structure and use the source template path from page-types.manifest.json as the default start point.',
      })
    } else if (mode === 'host-integration') {
      pushCheck(checks, {
        id: 'host-integration-global-preview-default',
        ok: true,
        severity: 'warn',
        summary: 'host-integration keeps official preview examples in the packaged preview runtime',
        detail:
          'Use `node scripts/start-preview-runtime.mjs` from the packaged skill root for official preview examples. Do not keep project-local preview galleries, preview routes, or preview asset materialization commands in the target project.',
      })

      const rootViewportStyleInspection = await inspectViewportRootStyles(targetRoot)
      pushCheck(checks, {
        id: 'root-viewport-style-contract',
        ok: rootViewportStyleInspection.issues.length === 0,
        severity: 'error',
        summary: 'target project public shell lets the host shell fill the viewport instead of staying inside a boxed starter container',
        detail:
          rootViewportStyleInspection.issues.length === 0
            ? rootViewportStyleInspection.styleFiles.length > 0
              ? 'No centered body layout, boxed root mount constraints, or greenfield starter-shell boxing were detected in the target project style files.'
              : 'No src style files were found, and no centered body layout, boxed root mount constraints, or greenfield starter-shell boxing were detected.'
            : `${formatViewportRootIssueDetail(targetRoot, rootViewportStyleInspection.issues)} Remove centered body/root starter constraints and greenfield starter-shell boxing; otherwise the official shell baseline can appear boxed even when preview stays global.`,
      })

      const routeFile = await detectRouteFile(targetRoot)
      const routeRaw = routeFile ? await readTextIfExists(routeFile) : ''
      const hasRouteMount = detectTypicalPageRouteMountInSource(routeRaw)
      pushCheck(checks, {
        id: 'no-project-local-preview-route-mount',
        ok: !hasRouteMount,
        severity: hasRouteMount ? 'error' : 'warn',
        summary: 'target project does not mount project-local typical-page preview routes',
        detail: hasRouteMount
          ? `Detected a project-local preview route mount in ${routeFile}. Remove /__typical-preview style route trees and open official examples from the packaged preview runtime instead.`
          : routeFile
            ? `${routeFile} does not mount project-local typical-page preview routes.`
            : 'No common route config file was detected, and no project-local typical-page preview route mount was proven.',
      })
    }

    if (isTypicalPageSourceRepo) {
      const sourceShellPackagePath = path.join(targetRoot, 'packages', 'typical-page-shells', 'package.json')
      const sourceShellBridgePath = path.join(
        targetRoot,
        'packages',
        'typical-page-shells',
        'dist',
        'pro-list-page',
        'bridge',
        'query-filter.js'
      )
      const sourceShellPackage = await readJsonIfExists(sourceShellPackagePath)
      const sourceShellBridge = await inspectQueryFilterBridgeFile(sourceShellBridgePath)
      const embeddedShellTarball = embeddedShellTarballPath
        ? await inspectQueryFilterBridgeTarball(embeddedShellTarballPath)
        : { exists: false, filePath: '', raw: '', reasons: ['missing embedded shell tarball'] }
      const embeddedSourceSnapshotDeclared = Boolean(shellPackage?.version) && Boolean(embeddedShellTarballPath)

      pushCheck(checks, {
        id: 'source-shell-package-version-sync',
        ok:
          !embeddedSourceSnapshotDeclared ||
          (Boolean(sourceShellPackage?.version) && sourceShellPackage.version === shellPackage?.version),
        severity: embeddedSourceSnapshotDeclared ? 'error' : 'warn',
        summary:
          'managed local runtime optional embedded snapshot version matches the source workspace package.json when provenance is bundled',
        detail:
          !embeddedSourceSnapshotDeclared
            ? 'No embedded source snapshot is declared in the skill contract, so version sync is informational only for this source workspace.'
            : sourceShellPackage?.version && sourceShellPackage.version === shellPackage?.version
            ? `${sourceShellPackage.version}`
            : `source package version=${sourceShellPackage?.version ?? '(missing)'}; embedded snapshot version=${shellPackage?.version ?? '(missing)'}`,
      })

      pushCheck(checks, {
        id: 'source-shell-query-filter-defaults',
        ok: sourceShellBridge.exists && sourceShellBridge.reasons.length === 0,
        severity: 'error',
        summary:
          'the source workspace dist output keeps the QueryFilter defaults expected by the managed local runtime baseline',
        detail:
          sourceShellBridge.exists
            ? sourceShellBridge.reasons.length === 0
              ? path.relative(targetRoot, sourceShellBridge.filePath)
              : `${path.relative(targetRoot, sourceShellBridge.filePath)} -> ${sourceShellBridge.reasons.join('; ')}`
            : `Missing ${sourceShellBridgePath}`,
      })

      pushCheck(checks, {
        id: 'embedded-shell-snapshot-sync',
        ok:
          !embeddedSourceSnapshotDeclared ||
          (embeddedShellTarball.exists &&
            embeddedShellTarball.reasons.length === 0 &&
            embeddedShellTarball.raw.trim() === sourceShellBridge.raw.trim()),
        severity: embeddedSourceSnapshotDeclared ? 'error' : 'warn',
        summary:
          'managed local runtime embedded tgz stays aligned with the current source workspace dist bridge when provenance is bundled',
        detail:
          !embeddedSourceSnapshotDeclared
            ? 'No embedded source snapshot is declared in the skill contract, so tgz sync is informational only for this source workspace.'
          : !embeddedShellTarball.exists
            ? `Missing embedded shell tarball at ${embeddedShellTarballPath || '(unknown path)'}`
            : embeddedShellTarball.reasons.length > 0
              ? `${path.relative(targetRoot, embeddedShellTarball.filePath)} -> ${embeddedShellTarball.reasons.join('; ')}`
              : embeddedShellTarball.raw.trim() === sourceShellBridge.raw.trim()
                ? path.relative(targetRoot, embeddedShellTarball.filePath)
                : `Embedded tgz bridge does not match ${path.relative(targetRoot, sourceShellBridge.filePath)}. Refresh the embedded source snapshot before distributing this skill.`,
      })
    }

    const expectedScripts = getReusableScripts(lineId)
    const designerSetupScript =
      pkg?.scripts?.['typical-page:designer-setup'] === expectedScripts['typical-page:designer-setup']
    pushCheck(checks, {
      id: 'designer-setup-script',
      ok: designerSetupScript,
      severity: 'warn',
      summary: 'package.json exposes typical-page:designer-setup',
      detail: designerSetupScript
        ? 'Registered script matches the packaged setup entry'
        : `Expected \`${expectedScripts['typical-page:designer-setup']}\``,
    })

    const doctorScript =
      pkg?.scripts?.['typical-page:doctor'] === expectedScripts['typical-page:doctor']
    pushCheck(checks, {
      id: 'doctor-script',
      ok: doctorScript,
      severity: 'warn',
      summary: 'package.json exposes typical-page:doctor',
      detail: doctorScript
        ? 'Registered script matches the packaged doctor entry'
        : `Expected \`${expectedScripts['typical-page:doctor']}\``,
    })

    const reportSnapshot = await collectReportSnapshot(targetRoot)
    const status = overallStatusFromChecks(checks)
    const summary = summarizeChecks(checks)
    const assessment = summarizeDoctorAssessment({
      checks,
      overallStatus: status,
      hostProfile,
    })
    const reportPath = path.join(outputRoot, 'DOCTOR_REPORT.md')
    const smokeReportPath = path.join(outputRoot, 'SMOKE_REPORT.md')
    const hostAdapterSnippetPath = path.join(outputRoot, 'HOST_ADAPTER_SNIPPET.md')
    const pageContractReportPath = path.join(outputRoot, 'PAGE_CONTRACT_REPORT.md')

    if (!options.json) {
      await writeHostAdapterSnippet({
        outputRoot,
        hostProfile,
      })
      await writeSmokeReport({
        outputRoot,
        targetRoot,
        manifest,
        doctorStatus: status,
        mode,
      })
      await writePageContractReport({
        outputRoot,
        targetRoot,
        findings: pageContractFindings,
      })
      await writeDoctorReport({
        outputRoot,
        targetRoot,
        status,
        checks,
        summary,
        assessment,
        line: lineId,
        manifestPath,
        mode,
        modeSource: modeResolution.source,
        hostProfile,
        hostAdapterSnippetPath,
        reportSnapshot,
      })
    }

    if (options.json) {
      await writeDoctorReport({
        outputRoot,
        targetRoot,
        status,
        checks,
        summary,
        assessment,
        line: lineId,
        manifestPath,
        mode,
        modeSource: modeResolution.source,
        hostProfile,
        hostAdapterSnippetPath,
        reportSnapshot,
      })
    }

    const pageTaskGate = await syncPageTaskStatusFromDoctor({
      targetRoot,
      doctorStatus: status,
      doctorAssessment: assessment,
      updatedBy: 'scripts/typical-page-doctor.mjs',
      mode,
      reportSnapshot,
      hostProfile,
    })

    if (options.json) {
      console.log(
        JSON.stringify(
          {
            status,
            summary,
            assessment,
            reportPath,
            smokeReportPath,
            hostAdapterSnippetPath,
            pageContractReportPath,
            manifestPath,
            reportSnapshot,
            modeSource: modeResolution.source,
            checks,
            pageContractFindings,
            pageTaskGate,
          },
          null,
          2
        )
      )
      return {
        exitCode: 0,
        reportMode: mode,
        success: status !== 'fail',
      }
    }

    console.log(`Typical Page Doctor: ${status.toUpperCase()}`)
    console.log(`- target root: ${targetRoot}`)
    console.log(`- mode: ${mode}`)
    console.log(`- project type: ${hostProfile.projectType}`)
    console.log(`- framework: ${hostProfile.framework}`)
    console.log(`- host risk level: ${hostProfile.riskLevel || 'low'}`)
    if (hostProfile.riskTags?.length) {
      console.log(`- host risk tags: ${hostProfile.riskTags.join(', ')}`)
    }
    console.log(`- mode: ${mode}`)
    console.log(`- mode source: ${modeResolution.source}`)
    console.log(`- page task gate: ${pageTaskGate.transition}`)
    if (hostProfile.adapterDoc) {
      console.log(`- framework adapter guide: ${resolveAdapterGuideLabel(outputRoot, hostProfile.adapterDoc)}`)
    }
    if (hostProfile.adapterEntryHints.length > 0) {
      console.log(`- candidate host entry files: ${hostProfile.adapterEntryHints.join(', ')}`)
    }
    console.log(`- host adapter snippet: ${hostAdapterSnippetPath}`)
    console.log(`- report: ${reportPath}`)
    console.log(`- smoke report: ${smokeReportPath}`)
    console.log(`- page contract report: ${pageContractReportPath}`)
    console.log(`- generatedAt: ${reportSnapshot.generatedAt}`)
    console.log(`- packageJsonHash: ${reportSnapshot.packageJsonHash}`)
    console.log(`- lockfile: ${reportSnapshot.lockfile}`)
    console.log(`- lockfileHash: ${reportSnapshot.lockfileHash}`)
    console.log(`- passed: ${summary.passed}`)
    console.log(`- failed: ${summary.failed}`)
    console.log(`- runtime baseline: ${formatAssessmentStatusLabel(assessment.runtimeBaseline.status)}`)
    console.log(`- layout contract: ${formatAssessmentStatusLabel(assessment.layoutContract.status)}`)
    console.log('')

    for (const item of checks) {
      const mark = item.ok ? 'PASS' : item.severity.toUpperCase()
      console.log(`[${mark}] ${item.summary}`)
      if (item.detail) {
        console.log(`  ${item.detail}`)
      }
    }

    console.log('')
    console.log(
      `Runtime baseline: ${formatAssessmentStatusLabel(assessment.runtimeBaseline.status)}. ${assessment.runtimeBaseline.summary}`
    )
    console.log(
      `Layout contract: ${formatAssessmentStatusLabel(assessment.layoutContract.status)}. ${assessment.layoutContract.summary}`
    )
    console.log(assessment.decision)
    if (status === 'fail') {
      return {
        exitCode: 1,
        reportMode: mode,
        success: false,
      }
    }

    return {
      exitCode: 0,
      reportMode: mode,
      success: status !== 'fail',
    }
}

async function runCli() {
  const rawArgs = process.argv.slice(2)
  const options = parseArgs(rawArgs)
  let usageSession = null
  let reportMode = options.mode || 'auto'
  let success = false
  let exitCode = 1

  try {
    const targetRoot = path.resolve(options.target)
    const scriptPath = fileURLToPath(import.meta.url)
    const runtimeReset = await ensureProjectNodeRuntime({
      targetRoot,
      scriptPath,
      scriptArgs: rawArgs,
      preferLoginShell: true,
    })
    if (runtimeReset.reexecuted) {
      process.exitCode = runtimeReset.exitCode ?? 0
      return
    }
    usageSession = await startUsageSession({
      prompt: options.telemetryPrompt,
      promptFile: options.telemetryPromptFile,
      reportMode,
      source: 'typical-page-doctor',
      targetRoot: options.target,
    })
    const result = await main(options)
    reportMode = result.reportMode || reportMode
    success = result.success === true
    exitCode = Number.isInteger(result.exitCode) ? result.exitCode : 0
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`typical-page-doctor failed: ${message}`)
    printUsage()
  } finally {
    await finalizeUsageSession(usageSession, {
      reportMode,
      success,
    })
  }

  process.exitCode = exitCode
}

await runCli()
