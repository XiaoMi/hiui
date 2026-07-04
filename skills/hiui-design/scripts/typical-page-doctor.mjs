#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { loadHostProfileFact } from './lib/project-facts.mjs'
import { writeHostAdapterSnippet } from './lib/host-adapter-advice.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import {
  inspectManagedPageRegistry,
  resolveManagedPageObservedSourceSnapshotHash,
  shouldPreferCurrentManagedPageSourceSnapshotForRuntimeSmoke,
} from './lib/managed-page-artifacts.mjs'
import { validateManagedPageSource } from './lib/managed-page-source-guard.mjs'
import { getReusableScripts } from './lib/reusable-script-entries.mjs'
import { RULES_ONLY_REFERENCE_PAGES_GLOB } from './lib/reference-assets.mjs'
import {
  getManagedPageRuntimeSmokeRequirement,
  getRequiredRegionsForPageType,
  getRequiredOwnershipRolesForPageType,
  loadRulesOnlyPageContracts,
  reconcileManagedPageRuntimeSmokeWorkflow,
  validateRulesOnlyPageContract,
} from './lib/rules-only-page-contracts.mjs'
import {
  buildLegacyRuntimeGuardIssues,
  collectLegacyHiUiEsImports,
  inspectInstalledRootRuntime,
  parseLeadingMajorVersion,
  summarizeLegacyImportHits,
} from './lib/legacy-runtime-guard.mjs'
import {
  formatNodeRuntimeRequirementDetail,
  getProjectNodeRuntimeRequirement,
} from './lib/node-runtime-requirements.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-doctor.mjs" [--target <project-root>] [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--line <line-id>] [--dest <relative-dir>] [--json]

Default behavior:
  - target project: current working directory
  - mode: auto
  - host-integration output dir: src/typical-page-reuse
  - rules-only report dir: .local-context/hiui-design/outputs
`)
}

function parseArgs(argv) {
  const options = {
    dest: 'src/typical-page-reuse',
    json: false,
    line: '',
    mode: 'auto',
    target: process.cwd(),
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--target' || arg === '--dest' || arg === '--mode' || arg === '--line') {
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

  return options
}

const pathExistsCache = new Map()
const textFileCache = new Map()
const sourceFileListCache = new Map()
const textFileListCache = new Map()
const explicitMetricSurfaceSignalCache = new Map()
const DEFAULT_TEXT_SCAN_SKIP_DIRS = new Set([
  '.git',
  '.idea',
  '.next',
  '.nuxt',
  '.output',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
  'outputs',
  'vendor',
])
const CONTENT_TEXT_FILE_PATTERN = /\.[cm]?[jt]sx?$|\.s?css$/i
const SCRIPT_TEXT_FILE_PATTERN = /\.[cm]?[jt]sx?$/i
const STYLE_FILE_PATTERN = /\.s?css$/i
const BUSINESS_GRADIENT_PATTERN = /\b(?:linear-gradient|radial-gradient|conic-gradient)\s*\(/i

async function pathExists(targetPath) {
  if (!targetPath) return false
  if (pathExistsCache.has(targetPath)) {
    return pathExistsCache.get(targetPath)
  }

  const pending = fs
    .access(targetPath)
    .then(() => true)
    .catch(() => false)
  pathExistsCache.set(targetPath, pending)
  return pending
}

async function readTextCached(targetPath) {
  if (textFileCache.has(targetPath)) {
    return textFileCache.get(targetPath)
  }

  const pending = fs.readFile(targetPath, 'utf8').catch((error) => {
    textFileCache.delete(targetPath)
    throw error
  })
  textFileCache.set(targetPath, pending)
  return pending
}

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

async function readTextIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return ''
  return readTextCached(targetPath)
}

async function readJsonIfExists(targetPath) {
  if (!(await pathExists(targetPath))) return null
  return JSON.parse(await readTextCached(targetPath))
}

async function detectLegacyHostRuntimeMode(targetRoot, pkg) {
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

  if (parseLeadingMajorVersion(reactSpec) > 0 && parseLeadingMajorVersion(reactSpec) < 18) {
    reasons.push(`react is pinned to ${reactSpec}`)
  }

  if (
    parseLeadingMajorVersion(reactDomSpec) > 0 &&
    parseLeadingMajorVersion(reactDomSpec) < 18
  ) {
    reasons.push(`react-dom is pinned to ${reactDomSpec}`)
  }

  if (parseLeadingMajorVersion(ahooksSpec) > 0 && parseLeadingMajorVersion(ahooksSpec) < 3) {
    reasons.push(`ahooks is pinned to ${ahooksSpec}`)
  }

  if (hiui5AliasSpec && parseLeadingMajorVersion(hiuiSpec) > 0 && parseLeadingMajorVersion(hiuiSpec) < 5) {
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

async function loadShellPackageSnapshot(skillRoot) {
  return readJsonIfExists(path.join(skillRoot, 'vendor', 'typical-page-shells-package.json'))
}

async function loadRuntimeDeliveryPolicy(skillRoot) {
  return readJsonIfExists(path.join(skillRoot, 'rules', 'runtime-delivery-policy.json'))
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

function resolvePublicRuntimeRegistry(runtimeDeliveryPolicy, shellPackage) {
  const configuredRegistry = String(
    shellPackage?.runtimeDelivery?.publicRegistry ||
      runtimeDeliveryPolicy?.runtimePackage?.publicRegistry ||
      'https://registry.npmjs.org'
  ).trim()

  return configuredRegistry || 'https://registry.npmjs.org'
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

async function detectCurrentRuntimeDeliveryChannel(skillRoot) {
  const markerPath = path.join(skillRoot, 'GENERATED_DO_NOT_EDIT.md')
  if (!(await pathExists(markerPath))) {
    return 'project-view'
  }

  const marker = await fs.readFile(markerPath, 'utf8')
  const targetMatch = marker.match(/^- target:\s+(.+)$/m)
  return targetMatch?.[1]?.trim() || 'project-view'
}

async function resolveShellRuntimeDelivery(skillRoot, shellPackage, runtimeDeliveryPolicy) {
  if (!shellPackage) {
    return {
      deliverySource: 'missing-snapshot',
      expectedShellSpecs: [],
      expectedShellSpecDetail: 'Missing vendor/typical-page-shells-package.json runtime snapshot',
      publicRegistryCheck: {
        required: false,
        ok: true,
        detail: 'Runtime snapshot is missing; cannot determine delivery policy.',
      },
      vendoredTarballPath: '',
      vendoredTarballRequired: false,
    }
  }

  const runtimeDelivery = shellPackage.runtimeDelivery ?? {}
  const vendoredTarballRelativePath =
    runtimeDelivery.vendoredTarball ||
    `vendor/hiui-design-typical-page-shells-${shellPackage.version}.tgz`
  const vendoredTarballPath = path.join(skillRoot, vendoredTarballRelativePath)
  const currentChannel = await detectCurrentRuntimeDeliveryChannel(skillRoot)
  const channelPolicy =
    runtimeDeliveryPolicy?.deliveryChannels?.[currentChannel] ||
    runtimeDeliveryPolicy?.deliveryChannels?.['project-view'] ||
    {}
  if (await pathExists(vendoredTarballPath)) {
    return {
      deliverySource: channelPolicy.runtimeResolution || 'vendored-tarball',
      expectedShellSpecs: [`file:.local-context/hiui-design/vendor/${path.basename(vendoredTarballRelativePath)}`],
      expectedShellSpecDetail: `Expected vendored tgz dependency: file:.local-context/hiui-design/vendor/${path.basename(
        vendoredTarballRelativePath
      )}`,
      publicRegistryCheck: {
        required: false,
        ok: true,
        detail: 'Vendored runtime delivery is active; npm registry is not part of the current install contract.',
      },
      vendoredTarballPath,
      vendoredTarballRequired: true,
    }
  }

  if (channelPolicy.registryResolution === 'forbidden') {
    return {
      deliverySource: 'missing-runtime-delivery',
      expectedShellSpecs: [],
      expectedShellSpecDetail: `Missing vendored tgz at ${path.relative(
        skillRoot,
        vendoredTarballPath
      )}. The current install source (${currentChannel}) requires vendored runtime delivery and does not allow npm registry fallback.`,
      publicRegistryCheck: {
        required: true,
        ok: false,
        detail: `Current delivery channel ${currentChannel} requires vendored tgz delivery, but the vendored runtime tarball is missing at ${path.relative(
          skillRoot,
          vendoredTarballPath
        )}.`,
      },
      vendoredTarballPath,
      vendoredTarballRequired: true,
    }
  }

  const publicPackageRoot =
    runtimeDelivery.publicPackageRoot || runtimeDeliveryPolicy?.runtimePackage?.publicPackageRoot || ''
  const publicPackageJsonPath = publicPackageRoot
    ? path.join(skillRoot, publicPackageRoot, 'package.json')
    : ''
  const publicPackage = publicPackageJsonPath ? await readJsonIfExists(publicPackageJsonPath) : null

  if (publicPackage) {
    const publicRegistry = resolvePublicRuntimeRegistry(runtimeDeliveryPolicy, shellPackage)
    if (publicPackage.name !== shellPackage.name) {
      return {
        deliverySource: 'invalid-public-package',
        expectedShellSpecs: [],
        expectedShellSpecDetail: `Public package name mismatch: expected ${shellPackage.name}, received ${publicPackage.name}`,
        publicRegistryCheck: {
          required: true,
          ok: false,
          detail: `Public package name mismatch at ${publicPackageJsonPath}: expected ${shellPackage.name}, received ${publicPackage.name}`,
        },
        vendoredTarballPath: '',
        vendoredTarballRequired: false,
      }
    }

    if (publicPackage.version !== shellPackage.version) {
      return {
        deliverySource: 'invalid-public-package',
        expectedShellSpecs: [],
        expectedShellSpecDetail: `Public package version mismatch: vendor snapshot=${shellPackage.version}, public package=${publicPackage.version}`,
        publicRegistryCheck: {
          required: true,
          ok: false,
          detail: `Public package version mismatch at ${publicPackageJsonPath}: vendor snapshot=${shellPackage.version}, public package=${publicPackage.version}`,
        },
        vendoredTarballPath: '',
        vendoredTarballRequired: false,
      }
    }

    try {
      const npmViewResult = runNpmCommand(
        ['view', `${publicPackage.name}@${publicPackage.version}`, 'version', '--json'],
        skillRoot,
        publicRegistry
      )
      const publishedVersion = parseNpmViewVersion(npmViewResult.stdout)
      if (publishedVersion !== publicPackage.version) {
        return {
          deliverySource: 'public-registry-unverified',
          expectedShellSpecs: [],
          expectedShellSpecDetail: `Open-source runtime delivery cannot rely on npm until ${publicPackage.name}@${publicPackage.version} is publicly published`,
          publicRegistryCheck: {
            required: true,
            ok: false,
            detail: `npm view against ${publicRegistry} returned ${publishedVersion || 'empty response'} for ${publicPackage.name}@${publicPackage.version}`,
          },
          vendoredTarballPath: '',
          vendoredTarballRequired: false,
        }
      }

      return {
        deliverySource: 'public-registry',
        expectedShellSpecs: [publicPackage.version],
        expectedShellSpecDetail: `Expected published npm version: ${publicPackage.version}`,
        publicRegistryCheck: {
          required: true,
          ok: true,
          detail: `${publicPackage.name}@${publicPackage.version} is published to ${publicRegistry} and matches packages/typical-page-shells/package.json.`,
        },
        vendoredTarballPath: '',
        vendoredTarballRequired: false,
      }
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error)
      return {
        deliverySource: 'public-registry-unverified',
        expectedShellSpecs: [],
        expectedShellSpecDetail: `Open-source runtime delivery cannot rely on npm until ${publicPackage.name}@${publicPackage.version} is publicly published`,
        publicRegistryCheck: {
          required: true,
          ok: false,
          detail: `npm view against ${publicRegistry} failed for ${publicPackage.name}@${publicPackage.version}: ${detail}`,
        },
        vendoredTarballPath: '',
        vendoredTarballRequired: false,
      }
    }
  }

  return {
    deliverySource: 'missing-runtime-delivery',
    expectedShellSpecs: [],
    expectedShellSpecDetail: `Missing vendored tgz at ${path.relative(
      skillRoot,
      vendoredTarballPath
    )} and no public package root is available for published-registry delivery`,
    publicRegistryCheck: {
      required: false,
      ok: false,
      detail: 'Neither vendored tgz nor public packages/typical-page-shells metadata is available.',
    },
    vendoredTarballPath,
    vendoredTarballRequired: true,
  }
}

async function loadHostIntegrationDependencySnapshot(skillRoot) {
  const referencePath = path.join(skillRoot, 'docs', 'onboarding', 'host-integration-dependencies.json')
  const reference = await readJsonIfExists(referencePath)
  return reference?.dependencies ?? {}
}

function pushCheck(checks, { id, ok, severity, summary, detail }) {
  checks.push({ id, ok, severity, summary, detail })
}

function isExternalComponentBypassFailure(message) {
  return [
    'directly imports external UI packages',
    'contract.adapterContract.localBypasses does not declare',
    'declares localBypasses package',
    'tokenBridgePath',
    'adapterPath',
    'page-level owner/header markers',
  ].some((fragment) => String(message || '').includes(fragment))
}

function isManagedChartGovernanceFailure(message) {
  return [
    'chart-section',
    'chart stack',
    'chart-like content',
    'approved chart wrapper',
    '@ant-design/charts',
    'withHiuiResponsiveChart',
    'withHiuiMiniChart',
    'adaptive chart-body',
    'renders charts without the shared HiUI chart baseline',
  ].some((fragment) => String(message || '').includes(fragment))
}

function contractDeclaresManagedChartGovernance(entry) {
  const pageTypeId = String(entry?.contract?.pageTypeId || '').trim()
  if (pageTypeId === 'data-visualization') {
    return true
  }

  return Array.isArray(entry?.contract?.regionMapping)
    ? entry.contract.regionMapping.some(
        (item) => String(item?.region || '').trim().toLowerCase() === 'chart-section'
      )
    : false
}

function formatRulesOnlyContractRepairDetail(invalidContracts, reason) {
  if (invalidContracts.length === 0) {
    return ''
  }

  return `Fix the rules-only managed page contracts first. ${reason}`
}

function formatRulesOnlyIssuesOrSuccess({
  invalidContracts,
  invalidReason,
  issues,
  successDetail,
}) {
  const invalidDetail = formatRulesOnlyContractRepairDetail(invalidContracts, invalidReason)
  if (invalidDetail) {
    return invalidDetail
  }

  if (issues.length > 0) {
    return issues.join(' | ')
  }

  return successDetail
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

function isCurrentPageReady(status) {
  return status === 'pass'
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

function isAcceptableShellSpec(spec, allowedSpecs = [], { allowLinkedShellSpec = false } = {}) {
  if (!spec) return false
  if (allowedSpecs.includes(spec)) return true
  if (allowLinkedShellSpec && spec.startsWith('link:')) return true
  return false
}

async function inspectManagedDataVisualizationSharedShells(entries, targetRoot) {
  const warnings = []
  let inspectedCount = 0

  for (const entry of entries) {
    if (entry?.contract?.pageTypeId !== 'data-visualization') {
      continue
    }

    const generatedPagePath = String(entry.contract.generatedPagePath || '').trim()
    if (!generatedPagePath) {
      continue
    }

    const absPath = path.join(targetRoot, generatedPagePath)
    const raw = await readTextIfExists(absPath)
    if (!raw) {
      continue
    }

    inspectedCount += 1
    const pathLabel = path.relative(targetRoot, absPath) || generatedPagePath
    const usesFixedFrame =
      /\bfixed-dashboard-page-frame\b/.test(raw) || /\bFixedDashboardPageFrame\b/.test(raw)
    const usesSharedDashboardPrimitives =
      /\bdata-visualization-primitives\b/.test(raw) ||
      /\b(DashboardControlStrip|ManagedChartCard|ManagedMetricCard|JoinedTableSection)\b/.test(raw)
    const rebuildsHeaderLocally =
      /\bHostPageHeaderPortal\b/.test(raw) ||
      /\bTypicalPageHeaderPortal\b/.test(raw) ||
      /\bPageHeader\b/.test(raw)
    const rebuildsShellLocally =
      /(?:pageStyles|styles)\.(?:pageRoot|whiteBody|controlBar|sectionCard|tableShell|riskCard|recordCard)\b/.test(
        raw
      ) ||
      /data-hiui5-region="white-body"[\s\S]{0,240}style=\{/.test(raw)

    if (usesFixedFrame) {
      continue
    }

    if (!usesSharedDashboardPrimitives && (rebuildsHeaderLocally || rebuildsShellLocally)) {
      warnings.push(
        `${pathLabel} still rebuilds the dashboard shell locally. Start from FixedDashboardPageFrame and shared data-visualization primitives instead of keeping page-level PageHeader / white-body / control-strip / chart-card / table-shell wrappers.`
      )
      continue
    }

    if (!usesSharedDashboardPrimitives) {
      warnings.push(
        `${pathLabel} does not expose the fixed dashboard shared-shell path. Data-visualization pages should either mount FixedDashboardPageFrame directly or clearly reuse the shared dashboard primitives instead of free-form shell assembly.`
      )
    }
  }

  return {
    inspectedCount,
    warnings,
  }
}

function collectManagedDependencyVersionDrift({
  pkg,
  shellPackage,
  allowedShellSpecs,
  allowLinkedShellSpec,
  shellExpectedDetail,
  hostIntegrationDependencies,
  mode,
}) {
  const drifts = []
  const shellSpec = findDependency(pkg, '@hiui-design/typical-page-shells')

  if (!isAcceptableShellSpec(shellSpec, allowedShellSpecs, { allowLinkedShellSpec })) {
    drifts.push({
      depName: '@hiui-design/typical-page-shells',
      actual: shellSpec || '(missing)',
      expected:
        shellExpectedDetail ||
        (allowedShellSpecs.length > 0
          ? `${allowedShellSpecs.join(' or ')}${allowLinkedShellSpec ? ' or link: local package spec' : ''}`
          : 'no accepted runtime delivery spec is currently available'),
    })
  }

  for (const [depName, expected] of Object.entries(shellPackage.peerDependencies ?? {})) {
    const actual = findDependency(pkg, depName)
    if (actual !== expected) {
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
    reasons.push('missing QueryFilter bridge content')
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

async function inspectQueryFilterBridgeTarball(tarballPath) {
  const raw = readTarEntry(tarballPath, 'package/dist/pro-list-page/bridge/query-filter.js')
  return {
    exists: Boolean(raw),
    filePath: tarballPath,
    raw,
    reasons: analyzeQueryFilterBridge(raw),
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
    if (await pathExists(absPath)) return absPath
  }

  return ''
}

async function detectStarterRootStyleFile(targetRoot) {
  const candidates = ['src/index.css', 'src/main.css', 'src/app.css', 'src/App.css']

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) return absPath
  }

  return ''
}

async function detectRouteFile(targetRoot) {
  const candidates = [
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
    'src/App.tsx',
    'src/App.ts',
    'src/App.jsx',
    'src/App.js',
    'App.tsx',
    'App.ts',
    'App.jsx',
    'App.js',
  ]

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) return absPath
  }

  return ''
}

async function detectExistingHostShellEntry(targetRoot) {
  const candidates = [
    'src/components/layout/main-content.tsx',
    'src/components/layout/main-content.ts',
    'src/components/layout/main-content.jsx',
    'src/components/layout/main-content.js',
    'src/layouts/index.tsx',
    'src/layouts/index.ts',
    'src/layouts/index.jsx',
    'src/layouts/index.js',
    'src/app.tsx',
    'src/app.ts',
    'app/layout.tsx',
    'app/layout.ts',
    'src/app/layout.tsx',
    'src/app/layout.ts',
  ]

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (!(await pathExists(absPath))) continue

    const raw = await readTextIfExists(absPath)
    const looksLikeHostShell =
      raw.includes('TypicalPageHostProvider') ||
      raw.includes('PageHeaderPortal') ||
      raw.includes("role='page-header'") ||
      raw.includes('role="page-header"')

    if (looksLikeHostShell) {
      return absPath
    }
  }

  return ''
}

async function detectTopLevelAppFile(targetRoot) {
  const candidates = [
    'src/App.tsx',
    'src/App.ts',
    'src/App.jsx',
    'src/App.js',
    'App.tsx',
    'App.ts',
    'App.jsx',
    'App.js',
  ]

  for (const candidate of candidates) {
    const absPath = path.join(targetRoot, candidate)
    if (await pathExists(absPath)) return absPath
  }

  return ''
}

function detectLegacyStandaloneWorkspaceShell(appRaw) {
  if (!appRaw) return false

  const importsExampleAppShell =
    appRaw.includes('ExampleAppShell') && appRaw.includes('typical-page-reuse/app-shell')
  const createsTypicalPageRoutes = appRaw.includes('createTypicalPageReuseRoutes')
  const ownsRouter = appRaw.includes('HashRouter') || appRaw.includes('BrowserRouter')
  const ownsWorkspaceNav =
    appRaw.includes('NavLink') ||
    appRaw.includes('TypicalPageWorkspace') ||
    appRaw.includes('app-sidebar') ||
    appRaw.includes('app-nav')
  const reusesAppFrame = appRaw.includes('TypicalPageAppFrame')

  return (
    importsExampleAppShell &&
    createsTypicalPageRoutes &&
    ownsRouter &&
    ownsWorkspaceNav &&
    !reusesAppFrame
  )
}

function detectTopLevelTypicalPageAppFrameMount(appRaw) {
  if (!appRaw) return false

  return (
    appRaw.includes('TypicalPageAppFrame') &&
    (appRaw.includes('useRoutes(') || /<TypicalPageAppFrame\b/.test(appRaw))
  )
}

async function detectTypicalPageSourceRepo(targetRoot) {
  const markers = [
    path.join(targetRoot, 'packages', 'typical-page-shells', 'package.json'),
    path.join(
      targetRoot,
      '.local-context',
      'hiui-design',
      'examples',
      'host-integration',
      'README.md'
    ),
    path.join(targetRoot, 'src', 'typical-page-reuse', 'routes', 'config.tsx'),
  ]

  for (const marker of markers) {
    if (!(await pathExists(marker))) return false
  }

  return true
}

function detectTypicalPageRouteMountInSource(routeRaw) {
  if (!routeRaw) return false

  const importsTypicalReuseRoutes =
    routeRaw.includes('typicalPageReuseRoutes') &&
    routeRaw.includes('typical-page-reuse/routes/config')

  if (!importsTypicalReuseRoutes) return false

  return (
    routeRaw.includes('...typicalPageReuseRoutes') ||
    routeRaw.includes('children: typicalPageReuseRoutes') ||
    routeRaw.includes('children={typicalPageReuseRoutes}') ||
    routeRaw.includes('routes: typicalPageReuseRoutes') ||
    routeRaw.includes('routes={typicalPageReuseRoutes}') ||
    routeRaw.includes('element: typicalPageReuseRoutes')
  )
}

function detectExampleTopLevelIcon(raw) {
  if (!raw) return false

  const singleQuoteIndex = raw.indexOf("title: '示例'")
  const doubleQuoteIndex = raw.indexOf('title: "示例"')
  const exampleTitleIndex =
    singleQuoteIndex >= 0 && doubleQuoteIndex >= 0
      ? Math.min(singleQuoteIndex, doubleQuoteIndex)
      : Math.max(singleQuoteIndex, doubleQuoteIndex)

  if (exampleTitleIndex < 0) return false

  const exampleSegment = raw.slice(exampleTitleIndex, exampleTitleIndex + 1200)
  const hasExampleIcon = /icon\s*:\s*</.test(exampleSegment)
  const mountsTypicalPageRoutes =
    exampleSegment.includes('children: typicalPageReuseRoutes') ||
    exampleSegment.includes('children={typicalPageReuseRoutes}') ||
    exampleSegment.includes('...typicalPageReuseRoutes')

  return hasExampleIcon && mountsTypicalPageRoutes
}

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

    if (char !== closeToken) continue

    depth -= 1
    if (depth === 0) {
      return index
    }
  }

  return -1
}

function collectTopLevelMenuGroupsMissingIcons(raw, routesIdentifier) {
  if (!raw || !routesIdentifier) return []

  const assignmentPattern = new RegExp(
    `(?:const|let|var|export\\s+const)\\s+${routesIdentifier}\\s*=\\s*\\[`,
    'm'
  )
  const match = assignmentPattern.exec(raw)
  if (!match) return []

  const arrayStartIndex = raw.indexOf('[', match.index)
  if (arrayStartIndex < 0) return []

  const arrayEndIndex = findMatchingToken(raw, arrayStartIndex, '[', ']')
  if (arrayEndIndex < 0) return []

  const arraySource = raw.slice(arrayStartIndex + 1, arrayEndIndex)
  const missing = []
  let braceDepth = 0
  let objectStart = -1
  let quote = null
  let escaped = false
  let lineComment = false
  let blockComment = false

  for (let index = 0; index < arraySource.length; index += 1) {
    const char = arraySource[index]
    const nextChar = arraySource[index + 1]

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

    if (char === '{') {
      if (braceDepth === 0) {
        objectStart = index
      }
      braceDepth += 1
      continue
    }

    if (char !== '}') continue

    braceDepth -= 1
    if (braceDepth !== 0 || objectStart < 0) continue

    const objectSource = arraySource.slice(objectStart, index + 1)
    const titleMatch =
      /title\s*:\s*'([^']+)'/.exec(objectSource) ||
      /title\s*:\s*"([^"]+)"/.exec(objectSource)
    const title = titleMatch?.[1]?.trim()
    const showInMenuFalse = /showInMenu\s*:\s*false/.test(objectSource)
    const hasChildren = /children\s*:/.test(objectSource)
    const hasIcon = /icon\s*:\s*</.test(objectSource)

    if (title && !showInMenuFalse && hasChildren && !hasIcon) {
      missing.push(title)
    }

    objectStart = -1
  }

  return missing
}

function splitTopLevelExpressionItems(source) {
  const items = []
  let startIndex = 0
  let depth = 0
  let quote = null
  let escaped = false
  let lineComment = false
  let blockComment = false

  for (let index = 0; index < source.length; index += 1) {
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

      if (char === quote) quote = null
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

    if (char === '[' || char === '{' || char === '(' || char === '<') {
      depth += 1
      continue
    }

    if (char === ']' || char === '}' || char === ')' || char === '>') {
      depth = Math.max(0, depth - 1)
      continue
    }

    if (char !== ',' || depth !== 0) continue

    const item = source.slice(startIndex, index).trim()
    if (item) items.push(item)
    startIndex = index + 1
  }

  const tail = source.slice(startIndex).trim()
  if (tail) items.push(tail)
  return items
}

function collectRouteObjectSourcesFromExpression(raw, expression, seen = new Set()) {
  const normalized = unwrapExpression(expression)
  if (!normalized) return []

  if (normalized.startsWith('[') && normalized.endsWith(']')) {
    return splitTopLevelExpressionItems(normalized.slice(1, -1)).flatMap((item) =>
      collectRouteObjectSourcesFromExpression(raw, item, seen)
    )
  }

  if (normalized.startsWith('{') && normalized.endsWith('}')) {
    return [normalized]
  }

  if (/^[A-Za-z_$][\w$]*$/.test(normalized)) {
    if (seen.has(normalized)) return []
    seen.add(normalized)

    const initializer = readIdentifierInitializer(raw, normalized)
    return initializer
      ? collectRouteObjectSourcesFromExpression(raw, initializer, seen)
      : []
  }

  return []
}

function collectTopLevelMenuIconSemanticIssues(raw) {
  if (!raw) return []

  const routesExpression = extractTypicalPageAppFrameRoutesExpression(raw)
  const routeObjectSources = collectRouteObjectSourcesFromExpression(raw, routesExpression)
  const entries = []

  for (const source of routeObjectSources) {
    const titleMatch =
      /title\s*:\s*'([^']+)'/.exec(source) || /title\s*:\s*"([^"]+)"/.exec(source)
    const title = titleMatch?.[1]?.trim()
    const showInMenuFalse = /showInMenu\s*:\s*false/.test(source)
    const hasChildren = /children\s*:/.test(source)
    if (!title || showInMenuFalse || !hasChildren) continue

    const iconMatch = /icon\s*:\s*<\s*([A-Z][A-Za-z0-9_$]*)\b/.exec(source)
    entries.push({
      title,
      iconName: iconMatch?.[1] || '',
    })
  }

  const issues = []
  for (const entry of entries) {
    if (!entry.iconName) {
      issues.push(`${entry.title} has no first-level icon`)
      continue
    }

    if (/Outlined$/.test(entry.iconName)) {
      issues.push(`${entry.title} uses line icon ${entry.iconName}; first-level menu icons should use Filled variants`)
    }

    if (entry.title !== '示例' && entry.iconName === 'AppStoreFilled') {
      issues.push(`${entry.title} uses AppStoreFilled, which is reserved for the 示例 gallery; choose a semantic business/project icon`)
    }
  }

  const iconOwners = new Map()
  for (const entry of entries) {
    if (!entry.iconName) continue
    iconOwners.set(entry.iconName, [...(iconOwners.get(entry.iconName) || []), entry.title])
  }

  for (const [iconName, titles] of iconOwners) {
    if (titles.length <= 1) continue
    issues.push(`${titles.join(' / ')} share ${iconName}; first-level menu icons should distinguish navigation domains`)
  }

  return issues
}

function detectRoutesIdentifierUsedByAppFrame(appRaw) {
  if (!appRaw) return ''

  const explicitPropMatch = /<TypicalPageAppFrame[^>]*\broutes=\{([A-Za-z_$][\w$]*)\}/.exec(appRaw)
  if (explicitPropMatch) return explicitPropMatch[1]

  const directPropMatch = /routes:\s*([A-Za-z_$][\w$]*)/.exec(appRaw)
  return directPropMatch?.[1] || ''
}

function detectTypicalPageRoutesImportIdentifier(raw) {
  if (!raw) return ''

  const match = /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"][^'"]*typical-page-reuse\/routes\/config(?:\.[^'"]+)?['"]/.exec(raw)
  return match?.[1] || ''
}

function extractTypicalPageAppFrameRoutesExpression(raw) {
  if (!raw) return ''

  const tagMatch = /<TypicalPageAppFrame\b/.exec(raw)
  if (!tagMatch) return ''

  const tagEnd = raw.indexOf('>', tagMatch.index)
  const searchEnd = tagEnd >= 0 ? tagEnd : raw.length
  const routesIndex = raw.indexOf('routes={', tagMatch.index)
  if (routesIndex < 0 || routesIndex > searchEnd) return ''

  const openIndex = raw.indexOf('{', routesIndex)
  if (openIndex < 0) return ''

  const closeIndex = findMatchingToken(raw, openIndex, '{', '}')
  if (closeIndex < 0) return ''

  return raw.slice(openIndex + 1, closeIndex).trim()
}

function readIdentifierInitializer(raw, identifier) {
  if (!raw || !identifier) return ''

  const declarationPattern = new RegExp(
    `(?:const|let|var)\\s+${identifier}\\s*=\\s*`,
    'm'
  )
  const match = declarationPattern.exec(raw)
  if (!match) return ''

  let startIndex = match.index + match[0].length
  while (/\s/.test(raw[startIndex] || '')) {
    startIndex += 1
  }

  const firstChar = raw[startIndex]
  if (firstChar === '[' || firstChar === '{') {
    const endIndex = findMatchingToken(raw, startIndex, firstChar, firstChar === '[' ? ']' : '}')
    return endIndex > startIndex ? raw.slice(startIndex, endIndex + 1).trim() : ''
  }

  const endMatch = /[\n;]/.exec(raw.slice(startIndex))
  const endIndex = endMatch ? startIndex + endMatch.index : raw.length
  return raw.slice(startIndex, endIndex).trim().replace(/,$/, '').trim()
}

function unwrapExpression(expression) {
  let current = String(expression || '').trim()

  while (current.startsWith('(') && current.endsWith(')')) {
    const closeIndex = findMatchingToken(current, 0, '(', ')')
    if (closeIndex !== current.length - 1) break
    current = current.slice(1, -1).trim()
  }

  return current
}

function containsExampleGalleryWrapper(source, typicalRoutesIdentifier) {
  if (!source || !typicalRoutesIdentifier) return false

  const hasExampleTitle = /title\s*:\s*['"]示例['"]/.test(source)
  const hasTypicalRoutesChildren = new RegExp(
    `children\\s*:\\s*${typicalRoutesIdentifier}\\b`
  ).test(source)

  return hasExampleTitle && hasTypicalRoutesChildren
}

function expressionUsesExampleGalleryWrapper(raw, expression, typicalRoutesIdentifier, seen = new Set()) {
  const normalized = unwrapExpression(expression)
  if (!normalized || !typicalRoutesIdentifier) return false
  if (normalized === typicalRoutesIdentifier) return false
  if (containsExampleGalleryWrapper(normalized, typicalRoutesIdentifier)) return true

  const identifiers = normalized.match(/\b[A-Za-z_$][\w$]*\b/g) || []
  for (const identifier of identifiers) {
    if (identifier === typicalRoutesIdentifier || seen.has(identifier)) continue
    seen.add(identifier)

    const initializer = readIdentifierInitializer(raw, identifier)
    if (!initializer) continue
    if (containsExampleGalleryWrapper(initializer, typicalRoutesIdentifier)) return true
    if (expressionUsesExampleGalleryWrapper(raw, initializer, typicalRoutesIdentifier, seen)) {
      return true
    }
  }

  return false
}

function analyzeHostRouteMenuSource(raw) {
  if (!raw || !detectTopLevelTypicalPageAppFrameMount(raw)) {
    return {
      ok: true,
      detail: 'No TypicalPageAppFrame mount was detected.',
    }
  }

  const importedTypicalRoutesIdentifier = detectTypicalPageRoutesImportIdentifier(raw)
  if (!importedTypicalRoutesIdentifier && !raw.includes('typicalPageReuseRoutes')) {
    return {
      ok: true,
      detail:
        'TypicalPageAppFrame is mounted, but no synced typical-page gallery route import was detected in App.*.',
    }
  }

  const typicalRoutesIdentifier = importedTypicalRoutesIdentifier || 'typicalPageReuseRoutes'
  const routesExpression = extractTypicalPageAppFrameRoutesExpression(raw)

  if (!routesExpression) {
    return {
      ok: false,
      detail:
        'TypicalPageAppFrame is mounted, but its routes prop could not be statically verified. Pass the host-level 示例 route group into routes instead of a separate or opaque menu tree.',
    }
  }

  if (unwrapExpression(routesExpression) === typicalRoutesIdentifier) {
    return {
      ok: false,
      detail: `TypicalPageAppFrame receives bare ${typicalRoutesIdentifier}, so 表格 / 图表 / 表单 / 详情 / 异常 become first-level menus. Wrap it in a top-level 示例 route and pass that same wrapper to TypicalPageAppFrame routes.`,
    }
  }

  if (
    routesExpression.includes(typicalRoutesIdentifier) &&
    !expressionUsesExampleGalleryWrapper(raw, routesExpression, typicalRoutesIdentifier)
  ) {
    return {
      ok: false,
      detail: `TypicalPageAppFrame routes references ${typicalRoutesIdentifier} without a verified top-level 示例 wrapper. The route tree and menu tree must share the same host-level gallery route.`,
    }
  }

  if (!expressionUsesExampleGalleryWrapper(raw, routesExpression, typicalRoutesIdentifier)) {
    return {
      ok: false,
      detail:
        'TypicalPageAppFrame routes does not expose a statically verifiable top-level 示例 route group. Keep one host-level gallery route object as the source of truth for both useRoutes() and the app-frame menu.',
    }
  }

  return {
    ok: true,
    detail:
      'TypicalPageAppFrame routes uses a host-level 示例 gallery route, so synced typical-page categories remain second-level menu groups.',
  }
}

function detectWrapInShellByDefault(routeConfigRaw) {
  if (!routeConfigRaw) return false

  return (
    routeConfigRaw.includes('element: renderInShell(') ||
    /export\s+default\s+createTypicalPageReuseRoutes\(\s*\{\s*wrapInShell\s*:\s*true\s*\}\s*\)/s.test(
      routeConfigRaw
    ) ||
    (/export\s+default\s+routes/.test(routeConfigRaw) && routeConfigRaw.includes('ExampleAppShell'))
  )
}

function isPathInside(parentPath, childPath) {
  const relativePath = path.relative(parentPath, childPath)
  return Boolean(relativePath) && !relativePath.startsWith('..') && !path.isAbsolute(relativePath)
}

function collectExampleGalleryBusinessRouteViolations({
  outputRoot,
  routeConfigPath,
  routeConfigRaw,
  targetRoot,
}) {
  if (!routeConfigRaw || !routeConfigPath || !outputRoot) return []

  const routeConfigDir = path.dirname(routeConfigPath)
  const outputRootAbs = path.resolve(outputRoot)
  const violations = []
  const importPattern = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g

  for (const match of routeConfigRaw.matchAll(importPattern)) {
    const specifier = String(match[1] || '').trim()
    if (!specifier.startsWith('.')) continue

    const resolvedPath = path.resolve(routeConfigDir, specifier)
    if (isPathInside(outputRootAbs, resolvedPath)) continue

    violations.push(
      `${path.relative(targetRoot, routeConfigPath)} imports "${specifier}" outside ${path.relative(
        targetRoot,
        outputRootAbs
      )}`
    )
  }

  return violations
}

function detectNestedBusinessHostShell(raw) {
  if (!raw) return false

  const importsExampleAppShell =
    /\bExampleAppShell\b/.test(raw) && /(?:^|\n)\s*import[\s\S]*?from\s+['"][^'"]*app-shell['"]/.test(raw)
  const importsLayoutContentProvider =
    /\bLayoutContentProvider\b/.test(raw) &&
    /(?:^|\n)\s*import[\s\S]*?from\s+['"][^'"]*layout-content-context['"]/.test(raw)
  const importsTypicalPageHostBridge =
    /\bTypicalPageHostBridge\b/.test(raw) &&
    /(?:^|\n)\s*import[\s\S]*?from\s+['"][^'"]*typical-page-host['"]/.test(raw)
  const importsTypicalPageHostProvider = /\bTypicalPageHostProvider\b/.test(raw)

  return (
    importsExampleAppShell ||
    (importsLayoutContentProvider && importsTypicalPageHostBridge) ||
    importsTypicalPageHostProvider
  )
}

async function collectBusinessHostShellConsumers(targetRoot, outputRoot) {
  const candidateRoots = ['src', 'app', 'pages']
  const files = []
  const seen = new Set()

  for (const candidateRoot of candidateRoots) {
    const absRoot = path.join(targetRoot, candidateRoot)
    if (!(await pathExists(absRoot))) continue

    for (const filePath of await collectSourceFiles(absRoot)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)
      files.push(filePath)
    }
  }

  const outputRootWithSep = outputRoot.endsWith(path.sep) ? outputRoot : `${outputRoot}${path.sep}`
  const offenders = []

  for (const filePath of files) {
    if (filePath === outputRoot || filePath.startsWith(outputRootWithSep)) continue
    const raw = await readTextIfExists(filePath)
    if (!detectNestedBusinessHostShell(raw)) continue
    offenders.push(filePath)
  }

  return offenders
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
  const cacheKey = rootDir
  if (sourceFileListCache.has(cacheKey)) {
    return sourceFileListCache.get(cacheKey)
  }

  const pending = (async () => {
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
  })().catch((error) => {
    sourceFileListCache.delete(cacheKey)
    throw error
  })

  sourceFileListCache.set(cacheKey, pending)
  return pending
}

async function readImportedStyleSources(sourceFilePath, sourceRaw) {
  const localStyleSpecifiers = extractImportSpecifiers(sourceRaw).filter(
    (specifier) => specifier.startsWith('.') && /\.(?:css|scss)$/.test(specifier)
  )
  const contents = []

  for (const specifier of localStyleSpecifiers) {
    const absPath = path.resolve(path.dirname(sourceFilePath), specifier)
    if (!(await pathExists(absPath))) continue
    contents.push(await readTextCached(absPath))
  }

  return contents.join('\n')
}

function extractLocalStyleImportBindings(sourceFilePath, sourceRaw) {
  const bindings = []
  const seen = new Set()
  const pattern = /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+\.(?:css|scss))['"]/g

  for (const match of sourceRaw.matchAll(pattern)) {
    const binding = match[1]
    const specifier = match[2]
    if (!binding || !specifier || !specifier.startsWith('.')) continue
    const absPath = path.resolve(path.dirname(sourceFilePath), specifier)
    const key = `${binding}::${absPath}`
    if (seen.has(key)) continue
    seen.add(key)
    bindings.push({ absPath, binding })
  }

  return bindings
}

function collectClassRefsNearMetricSurfaceMarker(sourceRaw, binding) {
  const overview = new Set()
  const embedded = new Set()
  const markerPattern = /data-hiui5-metric-surface\s*=\s*["'](overview|embedded)["']/g

  for (const match of sourceRaw.matchAll(markerPattern)) {
    const surface = match[1]
    const index = match.index ?? -1
    if (index < 0) continue
    const snippet = sourceRaw.slice(Math.max(0, index - 160), Math.min(sourceRaw.length, index + 900))
    const classRefPattern = new RegExp(`\\b${escapeRegExp(binding)}\\.([A-Za-z0-9_]+)\\b`, 'g')

    for (const classMatch of snippet.matchAll(classRefPattern)) {
      const className = classMatch[1]
      if (!className) continue
      if (surface === 'overview') {
        overview.add(className)
      } else {
        embedded.add(className)
      }
    }
  }

  return { embedded, overview }
}

function mergeExplicitMetricSurfaceSignals(target, incoming) {
  for (const className of incoming.overview) {
    target.overview.add(className)
  }
  for (const className of incoming.embedded) {
    target.embedded.add(className)
  }
}

async function collectExplicitMetricSurfaceSignals(rootDir) {
  if (explicitMetricSurfaceSignalCache.has(rootDir)) {
    return explicitMetricSurfaceSignalCache.get(rootDir)
  }

  const pending = (async () => {
    const signalMap = new Map()
    const sourceFiles = await collectSourceFiles(rootDir)

    for (const sourceFilePath of sourceFiles) {
      const sourceRaw = await readTextCached(sourceFilePath)
      if (!/data-hiui5-metric-surface\s*=/.test(sourceRaw)) continue

      const styleBindings = extractLocalStyleImportBindings(sourceFilePath, sourceRaw)
      for (const styleBinding of styleBindings) {
        const explicitSignals = collectClassRefsNearMetricSurfaceMarker(
          sourceRaw,
          styleBinding.binding
        )

        if (explicitSignals.overview.size === 0 && explicitSignals.embedded.size === 0) {
          continue
        }

        const existing =
          signalMap.get(styleBinding.absPath) ??
          {
            embedded: new Set(),
            overview: new Set(),
          }

        mergeExplicitMetricSurfaceSignals(existing, explicitSignals)
        signalMap.set(styleBinding.absPath, existing)
      }
    }

    return signalMap
  })().catch((error) => {
    explicitMetricSurfaceSignalCache.delete(rootDir)
    throw error
  })

  explicitMetricSurfaceSignalCache.set(rootDir, pending)
  return pending
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function collectNeedleSnippets(raw, needle, radius = 240) {
  if (!raw || !needle) return []

  const snippets = []
  const pattern = new RegExp(escapeRegExp(needle), 'gi')

  for (const match of raw.matchAll(pattern)) {
    const index = match.index ?? -1
    if (index < 0) continue
    snippets.push(raw.slice(index, Math.min(raw.length, index + radius)))
  }

  return snippets
}

function hasWorkspaceChromeSignal(snippet) {
  return /(padding(?:-[a-z]+)?\s*:|background(?:-color)?\s*:|border-radius\s*:|overflow(?:-[xy])?\s*:)/i.test(
    snippet
  )
}

function hasPaddingSignal(snippet) {
  return /padding(?:-[a-z]+)?\s*:/i.test(snippet)
}

function hasOverflowSignal(snippet) {
  return /overflow(?:-[xy])?\s*:/i.test(snippet)
}

function hasScrollableOverflowSignal(snippet) {
  return /overflow(?:-[xy])?\s*:\s*(auto|scroll)/i.test(snippet)
}

function hasBackgroundOrRadiusSignal(snippet) {
  return /(background(?:-color)?\s*:|border-radius\s*:)/i.test(snippet)
}

function hasTwentyPxInsetSignal(snippet) {
  return (
    /padding\s*:\s*20px(?:\s+20px(?:\s+0(?:px)?)?)?/i.test(snippet) ||
    (/padding-top\s*:\s*20px/i.test(snippet) &&
      /padding-left\s*:\s*20px/i.test(snippet) &&
      /padding-right\s*:\s*20px/i.test(snippet))
  )
}

function hasPaddingTopTwentySignal(snippet) {
  return (
    /padding-top\s*:\s*20px/i.test(snippet) ||
    /padding\s*:\s*20px(?:\s+\d+(?:px)?(?:\s+\d+(?:px)?(?:\s+\d+(?:px)?)?)?)?/i.test(snippet)
  )
}

function hasPaddingLeftTwentySignal(snippet) {
  return (
    /padding-left\s*:\s*20px/i.test(snippet) ||
    /padding\s*:\s*20px(?:\s+\d+(?:px)?){0,2}\s+20px/i.test(snippet) ||
    /padding\s*:\s*20px\s+20px/i.test(snippet)
  )
}

function hasPaddingRightTwentySignal(snippet) {
  return (
    /padding-right\s*:\s*20px/i.test(snippet) ||
    /padding\s*:\s*\d+(?:px)?\s+20px(?:\s+\d+(?:px)?(?:\s+\d+(?:px)?)?)?/i.test(snippet) ||
    /padding\s*:\s*20px\s+20px/i.test(snippet)
  )
}

function hasHorizontalTableShellInsetSignal(snippet) {
  return (
    /(padding-inline|padding-left|padding-right)\s*:\s*(?:16|20)px\b/i.test(snippet) ||
    /padding\s*:\s*(?:0\s+)?(?:16|20)px(?:\s+(?:16|20)px){0,3}\s*;/i.test(snippet)
  )
}

function hasHorizontalShellInsetSignal(snippet) {
  return (
    /(padding-inline|padding-left|padding-right)\s*:\s*(?:16|20)px\b/i.test(snippet) ||
    /padding\s*:\s*(?:16|20)px(?:\s+(?:16|20)px){0,3}\s*;/i.test(snippet) ||
    /padding\s*:\s*\d+(?:px)?\s+(?:16|20)px(?:\s+\d+(?:px)?(?:\s+(?:16|20)px)?)?\s*;/i.test(snippet)
  )
}

function hasVerticalDescriptionsPlacement(sourceRaw) {
  return (
    /placement\s*=\s*['"]vertical['"]/.test(sourceRaw) ||
    /placement\s*:\s*['"]vertical['"]/.test(sourceRaw)
  )
}

function hasFixedDescriptionsLabelWidth(sourceRaw) {
  return (
    /labelWidth\s*=\s*\{?\s*\d+\s*\}?/.test(sourceRaw) ||
    /labelWidth\s*:\s*\d+/.test(sourceRaw)
  )
}

function hasLeftDescriptionsLabelPlacement(sourceRaw) {
  return (
    /labelPlacement\s*=\s*['"]left['"]/.test(sourceRaw) ||
    /labelPlacement\s*:\s*['"]left['"]/.test(sourceRaw)
  )
}

function hasClearedDescriptionsLabelWidth(sourceRaw) {
  return (
    /labelWidth\s*=\s*\{\s*(?:null|undefined)\s*\}/.test(sourceRaw) ||
    /labelWidth\s*:\s*(?:null|undefined)/.test(sourceRaw)
  )
}

function usesSchemaDescriptionsBridge(sourceRaw) {
  return /\bSchemaDescriptionsBridge\b/.test(sourceRaw)
}

function hasTopAndHorizontalTwentySignal(snippet) {
  return (
    hasTwentyPxInsetSignal(snippet) ||
    (hasPaddingTopTwentySignal(snippet) &&
      hasPaddingLeftTwentySignal(snippet) &&
      hasPaddingRightTwentySignal(snippet))
  )
}

function normalizeOwnershipTargetText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function targetLooksLikeHostSlot(value) {
  return /(宿主|content slot|layout__content|ss-v1-layout__content|layout content|内容槽)/i.test(
    value
  )
}

function targetLooksLikePageSurface(value) {
  return /(white[- ]?body|白底|page surface|页面根|主体容器|主工作区容器)/i.test(value)
}

function collectWorkspaceSurfaceSnippets(raw, needles) {
  return needles.flatMap((needle) => collectNeedleSnippets(raw, needle))
}

function countStyleClassRef(sourceRaw, className) {
  if (!sourceRaw || !className) return 0

  const patterns = [
    new RegExp(`styles\\.${escapeRegExp(className)}\\b`, 'g'),
    new RegExp(`['"]${escapeRegExp(className)}['"]`, 'g'),
  ]

  return patterns.reduce(
    (total, pattern) => total + Array.from(sourceRaw.matchAll(pattern)).length,
    0
  )
}

function portalPageHeaderHasExtra(sourceRaw) {
  const portalPattern =
    /<(PageHeaderPortal|TypicalPageHeaderPortal|HostPageHeaderPortal)\b[^>]*>([\s\S]*?)<\/(?:PageHeaderPortal|TypicalPageHeaderPortal|HostPageHeaderPortal)>/g

  return (
    /\bheaderExtra\s*=/.test(sourceRaw) ||
    Array.from(sourceRaw.matchAll(portalPattern)).some((match) =>
      /<PageHeader\b[\s\S]{0,1600}\bextra\s*=/.test(String(match[2] || ''))
    )
  )
}

async function inspectRulesOnlyWorkspaceOwnership({
  contract,
  legacyHostCompatible,
  targetRoot,
}) {
  const warnings = []
  const requiredOwnershipRoles = getRequiredOwnershipRolesForPageType(contract.pageTypeId)

  if (contract.pageTypeId !== 'tree-split' && !requiredOwnershipRoles.includes('white-body')) {
    return warnings
  }

  if (!contract.generatedPagePath) {
    return warnings
  }

  const generatedPageAbsPath = path.join(targetRoot, contract.generatedPagePath)
  const sourceRaw = await readTextIfExists(generatedPageAbsPath)
  if (!sourceRaw) {
    return warnings
  }

  const importedStyleRaw = await readImportedStyleSources(generatedPageAbsPath, sourceRaw)
  const hostSlotSnippets = collectNeedleSnippets(importedStyleRaw, 'ss-v1-layout__content')
  const whiteBodyStyleSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.whiteBody',
    '.white-body',
  ])
  const genericWorkspaceShellSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.workspace',
    '.container',
    '.shell',
    '.pageBody',
    '.page-body',
    '.pageContainer',
    '.page-container',
    '.contentBody',
    '.content-body',
    '.mainContent',
    '.main-content',
  ])
  const splitWorkspaceStyleSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.splitWorkspace',
    '.split-workspace',
    '.mainSplit',
    '.main-split',
    '.splitContainer',
    '.split-container',
    '.leftColumn',
    '.left-column',
    '.rightColumn',
    '.right-column',
    '.leftPane',
    '.left-pane',
    '.rightPane',
    '.right-pane',
    '.leftTree',
    '.left-tree',
    '.rightList',
    '.right-list',
  ])
  const formScrollBodyStyleSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.formScrollBody',
    '.form-scroll-body',
  ])
  const sectionSurfaceSnippets =
    /styles\.(section|sectionRoot|sectionCard)\b/.test(sourceRaw) || /<Section\b/.test(sourceRaw)
      ? collectWorkspaceSurfaceSnippets(importedStyleRaw, [
          '.section',
          '.sectionRoot',
          '.section-root',
          '.sectionCard',
          '.section-card',
        ])
      : []

  const hostSlotOwnsWorkspaceChrome = hostSlotSnippets.some(hasWorkspaceChromeSignal)
  const hostSlotAddsPadding = hostSlotSnippets.some(hasPaddingSignal)
  const pageSurfaceOwnsWorkspaceChrome = whiteBodyStyleSnippets.some(hasWorkspaceChromeSignal)
  const genericWorkspaceAddsTwentyPxInset = genericWorkspaceShellSnippets.some(
    (snippet) => hasPaddingLeftTwentySignal(snippet) && hasPaddingRightTwentySignal(snippet)
  )
  const sourceMentionsLocalWhiteBody =
    /styles\.whiteBody/.test(sourceRaw) ||
    /['"`]whiteBody['"`]/.test(sourceRaw) ||
    /white-body/.test(sourceRaw) ||
    whiteBodyStyleSnippets.length > 0
  const sourceMentionsGenericWorkspaceShell =
    /styles\.(workspace|container|shell|pageBody|pageContainer|contentBody|mainContent)\b/.test(
      sourceRaw
    ) || genericWorkspaceShellSnippets.length > 0
  const sourceUsesGenericLayoutShell =
    /<Layout\b/.test(sourceRaw) || /\bLayout\b/.test(sourceRaw.split('\n').slice(0, 40).join('\n'))
  const sourceMentionsSplitWorkspace =
    /styles\.(splitWorkspace|mainSplit|splitContainer|leftColumn|rightColumn|leftPane|rightPane|leftTree|rightList)\b/.test(
      sourceRaw
    ) || /leftPane=/.test(sourceRaw)
  const splitWorkspaceOwnsWorkspaceChrome = splitWorkspaceStyleSnippets.some(hasWorkspaceChromeSignal)
  const sourceMentionsFormScrollBody =
    /styles\.formScrollBody\b/.test(sourceRaw) ||
    /formScrollBody/.test(sourceRaw) ||
    formScrollBodyStyleSnippets.length > 0
  const formScrollBodyOwnsScroll = formScrollBodyStyleSnippets.some(hasOverflowSignal)
  const formScrollBodyAddsPadding = formScrollBodyStyleSnippets.some(hasPaddingSignal)
  const sectionCardsOwnWorkspaceSurface = sectionSurfaceSnippets.some(hasBackgroundOrRadiusSignal)
  const localSectionCardsKeepInset = sectionSurfaceSnippets.some(
    (snippet) => hasBackgroundOrRadiusSignal(snippet) && hasPaddingSignal(snippet)
  )
  const localWhiteBodyKeepsInset = whiteBodyStyleSnippets.some(
    (snippet) => hasBackgroundOrRadiusSignal(snippet) && hasPaddingSignal(snippet)
  )
  const sourceMentionsInlineFooter =
    /styles\.(inlineEditFooter|footerActions)\b/.test(sourceRaw) || /footer=/.test(sourceRaw)
  const sourceMentionsTableRegion =
    /data-hiui5-region\s*=\s*["']table["']/.test(sourceRaw) ||
    /styles\.(tablePanel|tableShell|tableWorkspace|tableContainer|tableWrapper|tableRegion)\b/.test(
      sourceRaw
    )
  const tableShellSnippets = sourceMentionsTableRegion
    ? collectWorkspaceSurfaceSnippets(importedStyleRaw, [
        '.tablePanel',
        '.table-panel',
        '.tableShell',
        '.table-shell',
        '.tableWorkspace',
        '.table-workspace',
        '.tableContainer',
        '.table-container',
        '.tableWrapper',
        '.table-wrapper',
        '.tableRegion',
        '.table-region',
      ])
    : []
  const tableShellKeepsHorizontalInset = tableShellSnippets.some(hasHorizontalTableShellInsetSignal)

  const ownershipByRole = new Map(
    Array.isArray(contract.ownershipMapping)
      ? contract.ownershipMapping.map((item) => [
          String(item?.role || '').trim().toLowerCase(),
          normalizeOwnershipTargetText(item?.target),
        ])
      : []
  )
  const outerPaddingOwner = ownershipByRole.get('outer-padding') || ''
  const pageSurfaceOwner = ownershipByRole.get('white-body') || ''
  const contentSlotOwner = ownershipByRole.get('content-slot') || ''
  const hostSlotDeclaredAsOwner =
    targetLooksLikeHostSlot(contentSlotOwner) || targetLooksLikeHostSlot(outerPaddingOwner)
  const pageSurfaceDeclaredAsOwner =
    targetLooksLikePageSurface(pageSurfaceOwner) || targetLooksLikePageSurface(outerPaddingOwner)

  const pathLabel = path.relative(targetRoot, generatedPageAbsPath)
  if (
    sourceMentionsGenericWorkspaceShell &&
    genericWorkspaceAddsTwentyPxInset &&
    (localSectionCardsKeepInset || localWhiteBodyKeepsInset)
  ) {
    const detailParts = [
      `${pathLabel} promotes local region spacing into a generic workspace shell`,
      `ownershipMode=${contract.ownershipMode || '(missing)'}`,
      'a workspace/container wrapper keeps 20px horizontal shell padding',
    ]

    if (localWhiteBodyKeepsInset) {
      detailParts.push('local white-body still keeps its own surface and inset')
    }

    if (localSectionCardsKeepInset) {
      detailParts.push('local section/card wrappers still keep surfaced body spacing')
    }

    if (targetLooksLikeHostSlot(outerPaddingOwner) || targetLooksLikeHostSlot(contentSlotOwner)) {
      detailParts.push('contract already assigns outer/content ownership to the host slot')
    }

    if (targetLooksLikePageSurface(pageSurfaceOwner)) {
      detailParts.push('contract also declares a page-surface owner for the main white body')
    }

    if (legacyHostCompatible) {
      detailParts.push('legacy host compatibility does not justify reintroducing a second page-level shell')
    }

    warnings.push(
      `${detailParts.join('; ')}. This is the "region spacing promoted to shell padding" anti-pattern: keep outer-padding on exactly one owner, and keep 20px/16px spacing on the local white-body or section body instead of the generic workspace wrapper.`
    )
  }

  if (hostSlotOwnsWorkspaceChrome && sourceMentionsLocalWhiteBody && pageSurfaceOwnsWorkspaceChrome) {
    const detailParts = [
      `${pathLabel} styles the host content slot and a local white-body shell at the same time`,
      `ownershipMode=${contract.ownershipMode || '(missing)'}`,
    ]

    if (hostSlotAddsPadding) {
      detailParts.push('host content slot still carries outer padding')
    }

    if (sourceUsesGenericLayoutShell) {
      detailParts.push('page also mounts a generic Layout shell')
    }

    if (hostSlotDeclaredAsOwner && pageSurfaceDeclaredAsOwner) {
      detailParts.push('contract text itself still points both host slot and page surface at outer ownership')
    } else if (contract.ownershipMode === 'page-surface-owns-workspace') {
      detailParts.push('page-surface takeover mode requires locally zeroing host-slot padding/background/overflow')
    } else if (contract.ownershipMode === 'host-slot-owns-workspace') {
      detailParts.push('host-slot ownership mode should not recreate a second white-body workspace shell')
    }

    warnings.push(
      `${detailParts.join('; ')}. Keep a single owner for content-slot / white-body / outer-padding / main-scroll.`
    )
  }

  if (contract.pageTypeId === 'tree-split') {
    const splitWorkspaceDeclaredAsOwner = targetLooksLikePageSurface(outerPaddingOwner)

    if (hostSlotOwnsWorkspaceChrome && sourceMentionsSplitWorkspace && splitWorkspaceOwnsWorkspaceChrome) {
      const detailParts = [
        `${pathLabel} styles the host content slot and a local split workspace shell at the same time`,
        `ownershipMode=${contract.ownershipMode || '(missing)'}`,
      ]

      if (hostSlotAddsPadding) {
        detailParts.push('host content slot still carries outer padding')
      }

      if (sourceUsesGenericLayoutShell) {
        detailParts.push('page also mounts a generic Layout shell')
      }

      if (hostSlotDeclaredAsOwner && splitWorkspaceDeclaredAsOwner) {
        detailParts.push('contract text still points both host slot and split workspace at outer ownership')
      } else if (contract.ownershipMode === 'page-surface-owns-workspace') {
        detailParts.push('split-workspace takeover mode requires locally zeroing host-slot padding/background/overflow')
      } else if (contract.ownershipMode === 'host-slot-owns-workspace') {
        detailParts.push('host-slot ownership mode should not recreate a second split workspace surface')
      }

      warnings.push(
        `${detailParts.join('; ')}. Keep a single owner for content-slot / outer-padding / main-scroll in tree-split pages.`
      )
    }
  }

  if (contract.pageTypeId === 'full-page-edit') {
    const likelyLocalEditWorkspace =
      sourceMentionsLocalWhiteBody ||
      sourceMentionsFormScrollBody ||
      sectionCardsOwnWorkspaceSurface ||
      /styles\.(pageBody|pageContainer|contentBody)\b/.test(sourceRaw)

    if (hostSlotOwnsWorkspaceChrome && likelyLocalEditWorkspace) {
      const detailParts = [
        `${pathLabel} keeps host-slot workspace chrome while recreating a local full-page-edit workspace`,
        `ownershipMode=${contract.ownershipMode || '(missing)'}`,
      ]

      if (hostSlotAddsPadding) {
        detailParts.push('host content slot still carries outer padding')
      }

      if (sourceMentionsFormScrollBody && formScrollBodyOwnsScroll) {
        detailParts.push('local formScrollBody also owns vertical scrolling')
      }

      if (formScrollBodyAddsPadding) {
        detailParts.push('formScrollBody adds root padding')
      }

      if (sectionCardsOwnWorkspaceSurface) {
        detailParts.push('local section/card wrappers also paint white surfaces or radius')
      }

      if (sourceMentionsInlineFooter) {
        detailParts.push('footer behavior now depends on mixed outer ownership')
      }

      if (sourceUsesGenericLayoutShell) {
        detailParts.push('page also mounts a generic Layout shell')
      }

      if (hostSlotDeclaredAsOwner && pageSurfaceDeclaredAsOwner) {
        detailParts.push('contract text itself still points both host slot and page surface at outer ownership')
      } else if (contract.ownershipMode === 'page-surface-owns-workspace') {
        detailParts.push('page-surface takeover mode requires locally zeroing host-slot padding/background/overflow before formScrollBody becomes the main scroll')
      } else if (contract.ownershipMode === 'host-slot-owns-workspace') {
        detailParts.push('host-slot ownership mode should not recreate a second white-body/form workspace inside the page')
      }

      warnings.push(
        `${detailParts.join('; ')}. Keep a single owner for content-slot / white-body / outer-padding / main-scroll in full-page-edit pages.`
      )
    }
  }

  if (sourceMentionsTableRegion && tableShellKeepsHorizontalInset) {
    warnings.push(
      `${pathLabel} wraps the managed table region in a generic shell that still keeps 16px/20px horizontal padding. This is the "table region shell padding" anti-pattern: keep table-area spacing on the true table header/body region, not on an extra tablePanel/tableShell/tableWorkspace wrapper.`
    )
  }

  return warnings
}

async function inspectSourceMarkedNonTypicalPages(targetRoot) {
  const srcRoot = path.join(targetRoot, 'src')
  const warnings = []
  const sourceFiles = await collectSourceFiles(srcRoot)
  let inspectedCount = 0

  for (const sourceFilePath of sourceFiles) {
    const sourceRaw = await readTextCached(sourceFilePath)
    const looksLikeImplicitContextMainSplit =
      (/\bProDetailPage\b/.test(sourceRaw) || /\bProEditPage\b/.test(sourceRaw)) &&
      /styles\.leftPane\b/.test(sourceRaw) &&
      /styles\.rightPane\b/.test(sourceRaw)
    const declaresNonTypical =
      /hiui-design non-typical:\s*true/.test(sourceRaw) ||
      /data-hiui5-layout-strategy\s*=/.test(sourceRaw)

    if (!declaresNonTypical && !looksLikeImplicitContextMainSplit) {
      continue
    }

    inspectedCount += 1
    const importedStyleRaw = await readImportedStyleSources(sourceFilePath, sourceRaw)
    const pathLabel = path.relative(targetRoot, sourceFilePath)

    const missingOwnerMarkers = [
      'data-hiui5-owner-content-slot',
      'data-hiui5-owner-outer-padding',
      'data-hiui5-owner-main-scroll',
      'data-hiui5-owner-white-body',
    ].filter(
      (attrName) =>
        !new RegExp(`${escapeRegExp(attrName)}\\s*=`).test(sourceRaw) &&
        !new RegExp(`['"]${escapeRegExp(attrName)}['"]\\s*:`).test(sourceRaw)
    )
    const declaresContextMainSplit =
      looksLikeImplicitContextMainSplit ||
      /hiui-design layout archetype:\s*context-main-split/i.test(sourceRaw) ||
      /data-hiui5-layout-group\s*=\s*["']context-main-split["']/.test(sourceRaw)
    const missingContextMainSplitMarkers = declaresContextMainSplit
      ? [
          'hiui-design layout archetype: context-main-split',
          'data-hiui5-layout-group="context-main-split"',
          'data-hiui5-region="left-context"',
          'data-hiui5-region="right-main"',
        ].filter((marker) => !sourceRaw.includes(marker))
      : []

    if (missingOwnerMarkers.length > 0) {
      warnings.push(
        `${pathLabel} declares a non-typical layout but is missing runtime owner markers: ${missingOwnerMarkers.join(', ')}. Non-typical pages must expose machine-checkable ownership for content-slot / outer-padding / main-scroll / white-body.`
      )
    }

    if (looksLikeImplicitContextMainSplit && !declaresNonTypical) {
      warnings.push(
        `${pathLabel} looks like a split master-detail page implemented on ProDetailPage/ProEditPage with local leftPane/rightPane wrappers, but source does not declare the non-typical/context-main-split markers first. Do not bypass the fixed generation flow: lock the split shell carrier, add the layout markers, and then implement pane content.`
      )
    }

    if (missingContextMainSplitMarkers.length > 0) {
      warnings.push(
        `${pathLabel} declares layout archetype context-main-split but is missing required source/runtime markers: ${missingContextMainSplitMarkers.join(', ')}. Context-main-split pages must expose the archetype marker plus left-context/right-main runtime regions.`
      )
    }

    if (!importedStyleRaw) {
      continue
    }

    const genericWorkspaceShellSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
      '.pageRoot',
      '.page-root',
      '.workspace',
      '.container',
      '.shell',
      '.pageBody',
      '.page-body',
      '.pageContainer',
      '.page-container',
      '.contentBody',
      '.content-body',
      '.mainContent',
      '.main-content',
    ])
    const whiteBodyStyleSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
      '.whiteBody',
      '.white-body',
    ])
    const splitContentInsetSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
      '.tablePane',
      '.table-pane',
      '.tableRegion',
      '.table-region',
      '.tableContent',
      '.table-content',
      '.tableBody',
      '.table-body',
      '.detailTable',
      '.detail-table',
      '.rightScroll',
      '.right-scroll',
      '.detailScroll',
      '.detail-scroll',
      '.paneBody',
      '.pane-body',
    ])
    const sectionSurfaceSnippets =
      /styles\.(section|sectionRoot|sectionCard)\b/.test(sourceRaw) || /<Section\b/.test(sourceRaw)
        ? collectWorkspaceSurfaceSnippets(importedStyleRaw, [
            '.section',
            '.sectionRoot',
            '.section-root',
            '.sectionCard',
            '.section-card',
          ])
        : []
    const sourceMentionsTableRegion =
      /data-hiui5-region\s*=\s*["']table["']/.test(sourceRaw) ||
      /styles\.(tablePanel|tableShell|tableWorkspace|tableContainer|tableWrapper|tableRegion)\b/.test(
        sourceRaw
      )
    const tableShellSnippets = sourceMentionsTableRegion
      ? collectWorkspaceSurfaceSnippets(importedStyleRaw, [
          '.tablePanel',
          '.table-panel',
          '.tableShell',
          '.table-shell',
          '.tableWorkspace',
          '.table-workspace',
          '.tableContainer',
          '.table-container',
          '.tableWrapper',
          '.table-wrapper',
          '.tableRegion',
          '.table-region',
        ])
      : []

    const genericWorkspaceAddsTwentyPxInset = genericWorkspaceShellSnippets.some(
      (snippet) => hasPaddingLeftTwentySignal(snippet) && hasPaddingRightTwentySignal(snippet)
    )
    const genericWorkspaceAddsShellInset = genericWorkspaceShellSnippets.some(hasHorizontalShellInsetSignal)
    const genericWorkspaceOwnsScrollableOverflow = genericWorkspaceShellSnippets.some(
      hasScrollableOverflowSignal
    )
    const localWhiteBodyOwnsSurface = whiteBodyStyleSnippets.some(hasBackgroundOrRadiusSignal)
    const localWhiteBodyKeepsInset = whiteBodyStyleSnippets.some(
      (snippet) => hasBackgroundOrRadiusSignal(snippet) && hasPaddingSignal(snippet)
    )
    const localSectionCardsKeepInset = sectionSurfaceSnippets.some(
      (snippet) => hasBackgroundOrRadiusSignal(snippet) && hasPaddingSignal(snippet)
    )
    const tableShellKeepsHorizontalInset = tableShellSnippets.some(hasHorizontalTableShellInsetSignal)
    const declaresSplitMasterDetail =
      /data-hiui5-layout-group\s*=\s*["']split-master-detail["']/.test(sourceRaw) ||
      /data-hiui5-layout-group\s*=\s*["']context-main-split["']/.test(sourceRaw) ||
      /hiui-design split pane contract:/i.test(sourceRaw)
    const hostSlotOwnsContentSlot =
      /data-hiui5-owner-content-slot\s*=\s*["']host-slot["']/.test(sourceRaw) ||
      /hiui-design content-slot owner:\s*host-slot/i.test(sourceRaw)
    const duplicatedQueryShells = [
      'leftQuery',
      'queryRegion',
      'filterRegion',
      'leftFilter',
      'leftSearch',
      'searchRegion',
    ].filter((className) => countStyleClassRef(sourceRaw, className) > 1)
    const pageHeaderHasExtra = portalPageHeaderHasExtra(sourceRaw)
    const mountsManagedDashboardShell =
      /<(FixedDashboardPageFrame|ManagedWorkbenchPageFrame)\b/.test(sourceRaw)
    const hasSplitShellCarrierMarker =
      /hiui-design shell-carrier:/i.test(sourceRaw) ||
      /hiui-design shell-inheritance:/i.test(sourceRaw) ||
      /data-hiui5-shell-carrier\s*=/.test(sourceRaw) ||
      /data-hiui5-shell-inheritance\s*=/.test(sourceRaw)
    const mountsRealContextMainSplitShell =
      /\bContextMainSplitScaffold\b/.test(sourceRaw) || /\bTreeSplitPageFrame\b/.test(sourceRaw)
    const usesManualContextMainSplitShell =
      /styles\.(workspace|splitWorkspace|mainSplit|splitContainer|leftPane|rightPane|splitHandle|splitter)\b/.test(
        sourceRaw
      ) || /\b(leftPaneWidth|handleResizeStart|onResizeStart)\b/.test(sourceRaw)
    const usesProDetailPageShell =
      /\bProDetailPage\b/.test(sourceRaw) && /<ProDetailPage\b/.test(sourceRaw)
    const usesProEditPageShell =
      /\bProEditPage\b/.test(sourceRaw) && /<ProEditPage\b/.test(sourceRaw)
    const rightPaneActionsOutsideHeader =
      /<Space\b[^>]*className=\{styles\.(rightActions|detailActions|paneActions|headerActions)\}[\s\S]{0,600}<Button\b/.test(
        sourceRaw
      ) ||
      /<div\b[^>]*className=\{styles\.(rightHeader|detailHeader|paneHeader)\}[\s\S]{0,1200}<Button\b/.test(
        sourceRaw
      )
    const splitContentKeepsHorizontalInset =
      splitContentInsetSnippets.some(hasHorizontalTableShellInsetSignal) || tableShellKeepsHorizontalInset
    const overridesManagedShellGeometry =
      /<(FixedDashboardPageFrame|ManagedWorkbenchPageFrame)\b[\s\S]{0,1200}\b(pageRootStyle|whiteBodyStyle)\s*=/.test(
        sourceRaw
      ) ||
      /pageRootProps\s*=\s*\{\{[\s\S]{0,600}\bstyle\s*:/.test(sourceRaw) ||
      /whiteBodyProps\s*=\s*\{\{[\s\S]{0,600}\bstyle\s*:/.test(sourceRaw)

    if (
      genericWorkspaceAddsTwentyPxInset &&
      (localWhiteBodyKeepsInset || localSectionCardsKeepInset)
    ) {
      const detailParts = [
        `${pathLabel} promotes local region spacing into a generic workspace shell`,
        'a workspace/container wrapper keeps 20px horizontal shell padding',
      ]

      if (localWhiteBodyKeepsInset) {
        detailParts.push('local white-body still keeps its own surface and inset')
      }

      if (localSectionCardsKeepInset) {
        detailParts.push('local section/card wrappers still keep surfaced body spacing')
      }

      warnings.push(
        `${detailParts.join('; ')}. This is the "region spacing promoted to shell padding" anti-pattern. Keep 20px/16px spacing on the local white-body or section body, not on the generic workspace wrapper.`
      )
    }

    if (hostSlotOwnsContentSlot && genericWorkspaceAddsTwentyPxInset && localWhiteBodyOwnsSurface) {
      warnings.push(
        `${pathLabel} keeps host-slot as the content-slot owner but still adds a 20px generic page-root/workspace inset around a local white-body surface. In host-integrated non-typical pages, do not rebuild a second outer shell around the white-body unless the contract has explicitly zeroed the host slot first.`
      )
    }

    if (declaresContextMainSplit && genericWorkspaceOwnsScrollableOverflow) {
      warnings.push(
        `${pathLabel} lets a generic page-root/workspace wrapper own scrollable overflow in a context-main-split layout. In split pages, page root and split workspace must stay overflow-hidden; only left-context and right-main may own vertical scrolling.`
      )
    }

    if (declaresContextMainSplit && hostSlotOwnsContentSlot && genericWorkspaceAddsShellInset) {
      warnings.push(
        `${pathLabel} keeps host-slot as the content-slot owner but still adds 16px/20px horizontal inset on a generic page-root/workspace wrapper. Context-main-split pages must not promote pane-local spacing into an outer shell padding layer.`
      )
    }

    if (declaresContextMainSplit && (usesProDetailPageShell || usesProEditPageShell)) {
      warnings.push(
        `${pathLabel} mounts ${usesProDetailPageShell ? 'ProDetailPage' : 'ProEditPage'} as the top-level shell while declaring context-main-split. Complex right-pane detail content does not justify replacing the governed split carrier. Keep context-main-split on TreeSplitPageFrame, ContextMainSplitScaffold, or an approved host-translated split helper, then customize business content inside right-main.`
      )
    }

    if (
      declaresContextMainSplit &&
      !mountsRealContextMainSplitShell &&
      usesManualContextMainSplitShell &&
      !hasSplitShellCarrierMarker
    ) {
      warnings.push(
        `${pathLabel} hand-builds a split-looking workspace/leftPane/rightPane shell without any governed split carrier evidence. Context-main-split pages must either mount TreeSplitPageFrame/ContextMainSplitScaffold directly or expose shell-inheritance + shell-carrier markers for the host-translated split helper before business JSX starts.`
      )
    } else if (
      declaresContextMainSplit &&
      !mountsRealContextMainSplitShell &&
      !hasSplitShellCarrierMarker
    ) {
      warnings.push(
        `${pathLabel} declares context-main-split but source does not mount a governed split carrier and does not expose shell-inheritance/shell-carrier markers. split pane selectors alone do not prove split-shell reuse.`
      )
    }

    if (sourceMentionsTableRegion && tableShellKeepsHorizontalInset) {
      warnings.push(
        `${pathLabel} wraps the managed table region in a generic shell that still keeps 16px/20px horizontal padding. Non-typical pages must not reintroduce table region shell padding; keep the inset on the true table header/body region instead.`
      )
    }

    if (declaresSplitMasterDetail && /\bQueryFilter\b/.test(sourceRaw) && duplicatedQueryShells.length > 0) {
      warnings.push(
        `${pathLabel} repeats split-pane query shell wrappers (${duplicatedQueryShells.join(', ')}). Left-side search/filter regions must keep a single spacing owner instead of nesting duplicate leftQuery/filterRegion containers around QueryFilter and the list shell.`
      )
    }

    if (declaresSplitMasterDetail && !splitContentKeepsHorizontalInset) {
      warnings.push(
        `${pathLabel} leaves the right-side detail/table content flush against the pane edge. Split master-detail pages must keep 12px-20px horizontal inset on the true detail/table content owner instead of letting the table stick to the pane border.`
      )
    }

    if (declaresSplitMasterDetail && rightPaneActionsOutsideHeader && !pageHeaderHasExtra) {
      warnings.push(
        `${pathLabel} places likely page-level actions inside the split pane instead of PageHeader extra. In left-list/right-detail pages, page-level primary/secondary actions must stay in the header action slot; the pane header should only carry contextual detail title/meta.`
      )
    }

    if (mountsManagedDashboardShell && overridesManagedShellGeometry) {
      warnings.push(
        `${pathLabel} overrides shared-shell geometry through FixedDashboardPageFrame/ManagedWorkbenchPageFrame props. Non-typical pages may reorganize first-level groups, but must not use pageRootStyle, whiteBodyStyle, or style-bearing pageRootProps/whiteBodyProps to rewrite shared shell padding, white-body spacing, or scroll ownership. If geometry must differ, add or switch to a shared shell variant instead of patching the page.`
      )
    }
  }

  return { inspectedCount, warnings }
}

async function inspectRulesOnlyComponentSemanticDrift({
  contract,
  legacyHostCompatible,
  targetRoot,
}) {
  const warnings = []

  if (
    !legacyHostCompatible ||
    !['full-page-edit', 'full-page-detail'].includes(contract.pageTypeId) ||
    !contract.generatedPagePath
  ) {
    return warnings
  }

  const generatedPageAbsPath = path.join(targetRoot, contract.generatedPagePath)
  const sourceRaw = await readTextIfExists(generatedPageAbsPath)
  if (!sourceRaw) {
    return warnings
  }

  const importedStyleRaw = await readImportedStyleSources(generatedPageAbsPath, sourceRaw)
  const pathLabel = path.relative(targetRoot, generatedPageAbsPath)
  const usesGenericLayoutShell =
    /<Layout\b/.test(sourceRaw) || /\bLayout\b/.test(sourceRaw.split('\n').slice(0, 40).join('\n'))
  const usesLayoutFooterSlot = usesGenericLayoutShell && /footer=\{/.test(sourceRaw)
  const hasOnBack = /\bonBack\s*=/.test(sourceRaw)
  const usesTitleExtra = /titleExtra=\{/.test(sourceRaw) || /extra=\{/.test(sourceRaw)
  const hasBackIntent = /ArrowLeftOutlined/.test(sourceRaw) || /返回列表|返回\b/.test(sourceRaw)
  const usesBackIntentAsRightAction = !hasOnBack && usesTitleExtra && hasBackIntent
  const uploadUsesCustomContent =
    /<Upload[\s\S]{0,400}\bcontent=\{/.test(sourceRaw) || /\bcontent=\{uploadContent\}/.test(sourceRaw)
  const uploadTriggerHasExtraIcon = uploadUsesCustomContent && /UploadOutlined/.test(sourceRaw)
  const sectionSurfaceSnippets =
    /styles\.section\b/.test(sourceRaw) || /<Section\b/.test(sourceRaw)
      ? collectWorkspaceSurfaceSnippets(importedStyleRaw, ['.section'])
      : []
  const sectionCardsOwnSurface = sectionSurfaceSnippets.some(hasBackgroundOrRadiusSignal)
  const footerActionSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.footerActions',
    '.footer-actions',
    '.inlineEditFooter',
  ])
  const footerActionsRightAligned = footerActionSnippets.some((snippet) =>
    /justify-content\s*:\s*flex-end/i.test(snippet)
  )
  const detailSurfaceSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.heroCard',
    '.hero-card',
    '.fieldCard',
    '.field-card',
    '.mediaCard',
    '.media-card',
  ])
  const detailCardsOwnSurface = detailSurfaceSnippets.some(hasBackgroundOrRadiusSignal)
  const detailRootInsetSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.detailBody',
    '.detail-body',
    '.pageBody',
    '.page-body',
  ])
  const detailBodyRootAddsTwentyPxInset = detailRootInsetSnippets.some(hasTwentyPxInsetSignal)
  const summaryInsetSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.summarySection',
    '.summary-section',
    '.summaryBlock',
    '.summary-block',
    '.heroSection',
    '.hero-section',
    '.identitySection',
    '.identity-section',
  ])
  const topSummaryKeepsTwentyPxInset = summaryInsetSnippets.some(hasTwentyPxInsetSignal)
  const contentGridInsetSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.contentGrid',
    '.content-grid',
    '.detailLayout',
    '.detail-layout',
    '.detailMain',
    '.detail-main',
  ])
  const contentGridAddsLeftInset = contentGridInsetSnippets.some(hasPaddingLeftTwentySignal)
  const contentGridKeepsRightInset = contentGridInsetSnippets.some(hasPaddingRightTwentySignal)
  const chartSectionInsetSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
    '.chartSection',
    '.chart-section',
    '.chartAside',
    '.chart-aside',
  ])
  const chartSectionKeepsRightInset = chartSectionInsetSnippets.some(hasPaddingRightTwentySignal)
  const sourceMentionsTopSummaryBlock =
    /styles\.(summarySection|summaryBlock|heroSection|identitySection)\b/.test(sourceRaw) ||
    /\b(summarySection|summaryBlock|heroSection|identitySection)\b/.test(sourceRaw)
  const sourceMentionsContentGrid =
    /styles\.(contentGrid|detailLayout|detailMain)\b/.test(sourceRaw) ||
    /\b(contentGrid|detailLayout|detailMain)\b/.test(sourceRaw)
  const sourceMentionsChartSection =
    /data-hiui5-region\s*=\s*["']chart-section["']/.test(sourceRaw) ||
    /styles\.(chartSection|chartPanel)\b/.test(sourceRaw) ||
    /\b(chartSection|chartPanel)\b/.test(sourceRaw)
  const sourceMentionsBarLikeChart =
    /\b<Column\b/.test(sourceRaw) ||
    /\b<Bar\b/.test(sourceRaw) ||
    /\bchartType\s*=\s*["']column["']/.test(sourceRaw) ||
    /\bchartType\s*=\s*["']bar["']/.test(sourceRaw)
  const sourceMentionsPlotInsetGuard =
    /\bpaddingOuter\b/.test(sourceRaw) ||
    /\binsetRight\b/.test(sourceRaw) ||
    /\binsetLeft\b/.test(sourceRaw) ||
    /\bpaddingRight\b/.test(sourceRaw) ||
    /\bwithHiuiColumnLikeChart\b/.test(sourceRaw) ||
    /\bcreateHiuiColumnLikeScale\b/.test(sourceRaw) ||
    /\bcreateHiuiColumnLikeColorScale\b/.test(sourceRaw) ||
    /\bwithHiuiBarLikePlotInset\b/.test(sourceRaw) ||
    /\bwithHiuiBarLikeChart\b/.test(sourceRaw) ||
    /\bcreateHiuiBarLikeScale\b/.test(sourceRaw) ||
    /\bcreateHiuiBarLikeColorScale\b/.test(sourceRaw)
  const sourceMentionsDescriptions =
    /\bDescriptions\b/.test(sourceRaw) ||
    /SchemaDescriptionsBridge/.test(sourceRaw) ||
    /schema-descriptions/.test(sourceRaw) ||
    /descriptionsProps/.test(sourceRaw)
  const sourceMentionsHandRolledDetailGrid =
    /styles\.(fieldGrid|fieldCard|fieldLabel|fieldValue|mediaGrid|mediaCard)\b/.test(sourceRaw) ||
    /\bfield(Grid|Card|Label|Value)\b/.test(sourceRaw)
  const sourceMentionsHeroCard =
    /styles\.(heroCard|hero-card)\b/.test(sourceRaw) || /\bheroCard\b/.test(sourceRaw)
  const sourceUsesInlineMockImage =
    /data:image\//.test(sourceRaw) || /\bcreateMockImage\b/.test(sourceRaw)

  if (contract.pageTypeId === 'full-page-edit') {
    if (usesBackIntentAsRightAction) {
      warnings.push(
        `${pathLabel} moves the back affordance into titleExtra/right actions instead of a leading onBack action. In full-page-edit, the return path belongs to the header-leading slot, not the right toolbar.`
      )
    }

    if (usesLayoutFooterSlot) {
      warnings.push(
        `${pathLabel} mounts full-page-edit actions through a generic Layout footer slot. Reuse the archetype's sticky footer region instead of Layout.footer, otherwise action alignment and bottom-dock behavior drift in legacy hosts.`
      )
    }

    if (footerActionSnippets.length > 0 && !footerActionsRightAligned) {
      warnings.push(
        `${pathLabel} defines a footer action area that is not right-aligned. Full-page-edit footer actions must stay on the right edge of the footer region.`
      )
    }

    if (sectionCardsOwnSurface) {
      warnings.push(
        `${pathLabel} paints local section wrappers as white/radius cards. If the archetype expects one flat white-body, do not translate sections into separate surface cards.`
      )
    }

    if (uploadTriggerHasExtraIcon) {
      warnings.push(
        `${pathLabel} customizes Upload trigger content with UploadOutlined while also using the host Upload component. Do not add a second upload icon when the host trigger already renders one.`
      )
    }
  }

  if (contract.pageTypeId === 'full-page-detail') {
    if (usesBackIntentAsRightAction) {
      warnings.push(
        `${pathLabel} moves the back affordance into titleExtra/right actions instead of a leading onBack action. In full-page-detail, the return path belongs to the header-leading slot, not the right toolbar.`
      )
    }

    if (sourceMentionsHeroCard) {
      warnings.push(
        `${pathLabel} introduces a heroCard-style summary surface ahead of the detail groups. Full-page-detail should keep identity information inside the grouped detail-body unless an explicit design deviation was recorded.`
      )
    }

    if (sourceMentionsHandRolledDetailGrid && !sourceMentionsDescriptions) {
      warnings.push(
        `${pathLabel} hand-rolls detail presentation with fieldGrid/fieldCard-style markup but does not reference Descriptions semantics. Translate the packaged full-page-detail example into the host archetype instead of rebuilding a custom detail grid.`
      )
    } else if (sourceMentionsHandRolledDetailGrid) {
      warnings.push(
        `${pathLabel} mixes hand-rolled fieldGrid/fieldCard-style detail markup into a full-page-detail page. Keep grouped Descriptions as the primary field expression instead of introducing a second detail syntax.`
      )
    }

    if (detailCardsOwnSurface) {
      warnings.push(
        `${pathLabel} paints local hero/field/media wrappers as independent white or gray cards. Full-page-detail should keep one detail-body surface and avoid inventing extra summary or media card layers.`
      )
    }

    if (detailBodyRootAddsTwentyPxInset) {
      warnings.push(
        `${pathLabel} applies 20px inset on detail-body/pageBody root. In full-page-detail, top inset for summary/identity/chart supplements must live inside the top summary container, not on the detail-body root, otherwise downstream grouped details pick up a second spacing layer.`
      )
    }

    if (sourceMentionsTopSummaryBlock && !topSummaryKeepsTwentyPxInset) {
      warnings.push(
        `${pathLabel} adds a custom top summary/identity block but that block does not own the required 20px top and horizontal inset. The first visible content inside full-page-detail must not touch the white-body top edge or side edges, and that inset must be implemented inside the top summary container itself.`
      )
    }

    if (sourceMentionsDescriptions && sourceMentionsContentGrid && contentGridAddsLeftInset) {
      warnings.push(
        `${pathLabel} adds left-side 20px padding on the shared content grid while the detail column already relies on grouped card body padding. In full-page-detail, do not stack grid-level left inset on top of the grouped detail card inset, otherwise the detail content drifts inward by a second spacing layer.`
      )
    }

    if (sourceMentionsChartSection && !(contentGridKeepsRightInset || chartSectionKeepsRightInset)) {
      warnings.push(
        `${pathLabel} introduces chart-section content but neither the shared content grid nor the chart column owns the required 20px right-side inset. In full-page-detail, bordered chart panels and white supplementary surfaces must not touch the white-body right edge.`
      )
    }

    if (sourceMentionsChartSection && sourceMentionsBarLikeChart && !sourceMentionsPlotInsetGuard) {
      warnings.push(
        `${pathLabel} renders bar/column charts inside chart-section but does not declare any internal plot-edge guard such as x.paddingOuter, insetRight/insetLeft, or equivalent chart padding. In full-page-detail, chart cards must prevent the plot area itself from touching the card's inner right edge.`
      )
    }

    if (sourceUsesInlineMockImage) {
      warnings.push(
        `${pathLabel} embeds inline mock images via data:image or createMockImage-style helpers. Full-page-detail media blocks should use lightweight thumbnails or real resources instead of large inline image payloads.`
      )
    }
  }

  return warnings
}

async function collectTextFiles(rootDir, pattern, options = {}) {
  if (!(await pathExists(rootDir))) return []
  const skipDirs = new Set([
    ...DEFAULT_TEXT_SCAN_SKIP_DIRS,
    ...(options.skipDirs ?? []),
  ])
  const cacheKey = `${rootDir}::${pattern.source}::${pattern.flags}::${[...skipDirs]
    .sort()
    .join(',')}`
  if (textFileListCache.has(cacheKey)) {
    return textFileListCache.get(cacheKey)
  }

  const pending = (async () => {
    const entries = await fs.readdir(rootDir, { withFileTypes: true })
    const files = []

    for (const entry of entries) {
      const absPath = path.join(rootDir, entry.name)
      if (entry.isDirectory()) {
        if (skipDirs.has(entry.name)) {
          continue
        }
        files.push(...(await collectTextFiles(absPath, pattern, { skipDirs })))
        continue
      }

      if (entry.isFile() && pattern.test(entry.name)) {
        files.push(absPath)
      }
    }

    return files
  })().catch((error) => {
    textFileListCache.delete(cacheKey)
    throw error
  })

  textFileListCache.set(cacheKey, pending)
  return pending
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
    const raw = await readTextCached(filePath)
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

async function collectTypicalPageSourceSignals(rootDir) {
  const files = await collectSourceFiles(rootDir)
  const signals = {
    usesShells: [],
    privateImportViolations: [],
    tableHeaderExtraViolations: [],
    localHostAdapterImports: [],
    staleQueryFilterBridgeViolations: [],
    queryFilterShowLabelViolations: [],
  }

  for (const filePath of files) {
    const raw = await readTextCached(filePath)
    const specifiers = extractImportSpecifiers(raw)
    const relativeFilePath = path.relative(rootDir, filePath)
    const isNonBusinessAuxiliaryFile =
      relativeFilePath.startsWith(`typical-page-reuse${path.sep}`) ||
      /(?:^|[\\/])__codex_hiui_reference__\.[cm]?[jt]sx?$/.test(filePath)
    const usesShells = specifiers.some(
      (specifier) =>
        specifier === '@hiui-design/typical-page-shells' ||
        specifier.startsWith('@hiui-design/typical-page-shells/')
    )
    const usesPrivateShellImport = specifiers.some(
      (specifier) =>
        specifier.includes('/node_modules/') ||
        specifier.includes('.pnpm/') ||
        specifier.includes('packages/typical-page-shells/src/') ||
        specifier.includes('@hiui-design/typical-page-shells/dist/') ||
        specifier.endsWith('/dist/index.js') ||
        specifier.endsWith('/dist/index.mjs')
    )

    if ((usesShells || usesPrivateShellImport) && !isNonBusinessAuxiliaryFile) {
      signals.usesShells.push(filePath)
    }

    const usesLocalHostAdapter = specifiers.some(
      (specifier) =>
        specifier.endsWith('/typical-page-host') ||
        specifier.includes('components/typical-page-host')
    )
    const isHostIntegrationExampleFile = relativeFilePath.startsWith(`typical-page-reuse${path.sep}`)
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
        specifier.includes('packages/typical-page-shells/src/') ||
        specifier.includes('@hiui-design/typical-page-shells/dist/') ||
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

    const usesPublicProListQueryFilter = specifiers.some(
      (specifier) =>
        specifier === '@hiui-design/typical-page-shells/pro-list-page' ||
        specifier.startsWith('@hiui-design/typical-page-shells/pro-list-page')
    )
    if (usesPublicProListQueryFilter && /<QueryFilter\b[\s\S]{0,320}showLabel=\{true\}/.test(raw)) {
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

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length
}

function collectMissingTokens(source, tokens) {
  return tokens.filter((token) => !source.includes(token))
}

async function collectSchemaFormCheckSelectViolations(rootDir) {
  const files = await collectSourceFiles(rootDir)
  const violations = []

  for (const filePath of files) {
    const raw = await readTextCached(filePath)
    const usesRawSchemaForm =
      raw.includes("from '@hi-ui/schema-form'") || raw.includes('from "@hi-ui/schema-form"')
    const usesCheckSelect = raw.includes('.CheckSelect(')
    const usesTypicalFieldMapProvider =
      raw.includes('TypicalPageFieldMapProvider') &&
      (raw.includes("from '@hiui-design/typical-page-shells'") ||
        raw.includes('from "@hiui-design/typical-page-shells"'))

    if (usesRawSchemaForm && usesCheckSelect && !usesTypicalFieldMapProvider) {
      violations.push(filePath)
    }
  }

  return violations
}

async function collectLegacyHiUi4Violations(rootDirs) {
  const files = []
  const seen = new Set()
  const fileNamePattern = /\.[cm]?[jt]sx?$|\.s?css$/i
  const tokenPattern = /hi-v4-|--hi-v4-|HiUI\s*4(?:\.0)?|HiUI4(?:\.0)?/g
  const violations = []

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, fileNamePattern)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)
      files.push(filePath)
    }
  }

  for (const filePath of files) {
    const raw = await readTextCached(filePath)
    const matches = [...new Set(raw.match(tokenPattern) ?? [])]
    if (matches.length > 0) {
      violations.push({ filePath, matches })
    }
  }

  return violations
}

function summarizeLegacyHiUi4Violations(targetRoot, violations) {
  return violations
    .slice(0, 6)
    .map((item) => `${path.relative(targetRoot, item.filePath)} <- ${item.matches.join(', ')}`)
    .join('; ')
}

function collectPatternLineNumbers(raw, pattern, maxCount = 3) {
  const numbers = []
  const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`
  const matcher = new RegExp(pattern.source, flags)

  for (const match of raw.matchAll(matcher)) {
    const index = match.index ?? -1
    if (index < 0) continue
    numbers.push(raw.slice(0, index).split('\n').length)
    if (numbers.length >= maxCount) {
      break
    }
  }

  return numbers
}

function getLineNumberAtIndex(raw, index) {
  if (!raw || index < 0) return 0
  return raw.slice(0, index).split('\n').length
}

function formatViolationLocation(targetRoot, filePath, lineNumbers = []) {
  const relativePath = path.relative(targetRoot, filePath)
  return lineNumbers.length > 0 ? `${relativePath}:${lineNumbers.join(',')}` : relativePath
}

function getBusinessUiScanRoots({ targetRoot, hostOutputRoot }) {
  return [...new Set([
    path.join(targetRoot, 'src'),
    path.join(targetRoot, 'app'),
    path.join(targetRoot, 'pages'),
    hostOutputRoot,
    path.join(targetRoot, '.local-context', 'hiui-design', 'reference', 'host-integration', 'src'),
  ])]
}

async function collectBusinessGradientViolations(rootDirs) {
  const seen = new Set()
  const violations = []

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, CONTENT_TEXT_FILE_PATTERN)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)

      const normalizedPath = filePath.split(path.sep).join('/')
      if (normalizedPath.includes('/assets/')) {
        continue
      }

      const raw = await readTextCached(filePath)
      if (!BUSINESS_GRADIENT_PATTERN.test(raw)) {
        continue
      }

      violations.push({
        filePath,
        lineNumbers: collectPatternLineNumbers(raw, BUSINESS_GRADIENT_PATTERN),
      })
    }
  }

  return violations
}

function extractStyleBlocks(raw) {
  const blocks = []
  const pattern = /([^{}]+)\{([^{}]+)\}/g

  for (const match of raw.matchAll(pattern)) {
    const selector = String(match[1] || '').trim()
    const declarations = String(match[2] || '').trim()
    if (!selector || !declarations) continue
    blocks.push({ selector, declarations, index: match.index ?? -1 })
  }

  return blocks
}

function isBusinessMultiColumnSelector(selector) {
  return /\b(?:mainGrid|contentGrid|workspaceGrid|detailGrid|mainSplit|contentSplit|workspaceSplit|mainLayout|detailLayout|mainColumns|contentColumns|workspaceColumns)\b/i.test(
    selector
  )
}

function isBusinessCardSelector(selector) {
  return /\.(?:column|panel)\b|\b(?:leftPanel|rightPanel|middlePanel|detailPanel|sidePanel)\b/i.test(
    selector
  )
}

function isBusinessSecondaryPaneSelector(selector) {
  return /\.(?:leftPane|leftPanel|sidePane|sidePanel|secondaryPane|secondaryPanel|secondaryColumn|secondaryRegion|asidePane|asidePanel)\b|\b(?:leftPane|leftPanel|sidePane|sidePanel|secondaryPane|secondaryPanel|secondaryColumn|secondaryRegion|asidePane|asidePanel)\b/i.test(
    selector
  )
}

function isBusinessPrimaryPaneSelector(selector) {
  return /\.(?:rightPane|rightPanel|rightColumn|rightList|primaryPane|primaryPanel|primaryColumn|mainPane|mainPanel|contentPane|contentPanel|contentColumn|detailPane|detailPanel|detailColumn)\b|\b(?:rightPane|rightPanel|rightColumn|rightList|primaryPane|primaryPanel|primaryColumn|mainPane|mainPanel|contentPane|contentPanel|contentColumn|detailPane|detailPanel|detailColumn)\b/i.test(
    selector
  )
}

function hasZeroMinInlineSizeDeclaration(declarations) {
  return /(min-inline-size|min-width)\s*:\s*0(?:px)?\b/i.test(declarations)
}

function hasSplitRightTrackHardMinDeclaration(declarations) {
  return /grid-template-columns\s*:[^;]*minmax\([^)]*\)\s+minmax\(\s*(?:[1-9]\d*(?:\.\d+)?(?:px|rem))\s*,/i.test(
    declarations
  )
}

function isBusinessMetricGridSelector(selector) {
  return /\.(?:metricGrid|cardMetrics|summaryMetrics|overviewMetrics|statGrid|kpiGrid|metricCards|metricGroup)\b|\b(?:metricGrid|cardMetrics|summaryMetrics|overviewMetrics|statGrid|kpiGrid|metricCards|metricGroup)\b/i.test(
    selector
  )
}

function extractClassNamesFromSelector(selector) {
  const classNames = new Set()

  for (const match of selector.matchAll(/\.([A-Za-z0-9_-]+)/g)) {
    const className = match[1]
    if (className) {
      classNames.add(className)
    }
  }

  return classNames
}

function isBusinessMetricValueSelector(selector) {
  return /\.(?:metricValue|summaryMetricValue|statValue|kpiValue|overviewValue|metricMainValue|cardMetricValue|detailHeaderMetricValue|headerMetricValue|inlineMetricValue|localMetricValue)\b|\b(?:metricValue|summaryMetricValue|statValue|kpiValue|overviewValue|metricMainValue|cardMetricValue|detailHeaderMetricValue|headerMetricValue|inlineMetricValue|localMetricValue)\b/i.test(
    selector
  )
}

function isBusinessOverviewMetricSurfaceSelector(selector) {
  return /data-hiui5-metric-surface\s*=\s*["']overview["']/i.test(selector) || /\.(?:statSection|statOverview|overviewMetrics|overviewGrid|summaryBand|summarySection|summaryStrip|summaryMetrics|statCard|statBlock|overviewCard|heroMetrics|heroStats|summaryCard)\b|\b(?:statSection|statOverview|overviewMetrics|overviewGrid|summaryBand|summarySection|summaryStrip|summaryMetrics|statCard|statBlock|overviewCard|heroMetrics|heroStats|summaryCard)\b/i.test(
    selector
  )
}

function isBusinessRepeatedMetricCardListSelector(selector) {
  return /\.(?:cardList|listCard|orderCard|entityCard|recordCard|itemCard|metricCardList|repeatedMetricList)\b|\b(?:cardList|listCard|orderCard|entityCard|recordCard|itemCard|metricCardList|repeatedMetricList)\b/i.test(
    selector
  )
}

function isBusinessEmbeddedMetricSurfaceSelector(selector) {
  return /data-hiui5-metric-surface\s*=\s*["']embedded["']/i.test(selector) || isBusinessRepeatedMetricCardListSelector(selector) || /\.(?:selectionCard|detailHeader|detailHeaderMetrics|headerMetrics|localSummary|inlineMetrics|embeddedMetrics)\b|\b(?:selectionCard|detailHeader|detailHeaderMetrics|headerMetrics|localSummary|inlineMetrics|embeddedMetrics)\b/i.test(selector)
}

function parseMetricFontSize(declarations) {
  const match = /font-size\s*:\s*(\d+)px\b/i.exec(declarations)
  return match ? Number(match[1]) : null
}

function parseMetricLineHeight(declarations) {
  const match = /line-height\s*:\s*(\d+)px\b/i.exec(declarations)
  return match ? Number(match[1]) : null
}

function parseMetricFontWeight(declarations) {
  const match = /font-weight\s*:\s*(\d+)\b/i.exec(declarations)
  return match ? Number(match[1]) : null
}

function resolveMetricPrimaryValueToken({ fontSize, fontWeight, lineHeight }) {
  if (fontSize === 24 && lineHeight === 32 && fontWeight === 600) {
    return 'overview'
  }

  if (fontSize === 16 && lineHeight === 24 && fontWeight === 600) {
    return 'embedded'
  }

  return ''
}

function parseInlineMetricFontSize(declarations) {
  const match = /fontSize\s*:\s*['"]?(\d+)(?:px)?['"]?/i.exec(declarations)
  return match ? Number(match[1]) : null
}

function parseInlineMetricLineHeight(declarations) {
  const match = /lineHeight\s*:\s*['"]?(\d+)(?:px)?['"]?/i.exec(declarations)
  return match ? Number(match[1]) : null
}

function parseInlineMetricFontWeight(declarations) {
  const match = /fontWeight\s*:\s*(\d+)/i.exec(declarations)
  return match ? Number(match[1]) : null
}

function resolveInlineMetricSurfaceContext(filePath, blockName) {
  if (/data-visualization\.[cm]?[jt]sx?$/i.test(filePath)) {
    return 'overview'
  }

  if (
    /(?:metricValue|summaryMetricValue|statValue|kpiValue|overviewValue|liquidChartValue)/i.test(
      blockName
    )
  ) {
    return 'overview'
  }

  if (
    /(?:detailHeaderMetricValue|headerMetricValue|inlineMetricValue|embeddedMetricValue)/i.test(
      blockName
    )
  ) {
    return 'embedded'
  }

  return ''
}

async function collectInlineMetricSurfaceTokenViolations(rootDirs) {
  const seen = new Set()
  const violations = []

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, CONTENT_TEXT_FILE_PATTERN)) {
      if (!SCRIPT_TEXT_FILE_PATTERN.test(filePath)) continue
      if (seen.has(filePath)) continue
      seen.add(filePath)

      const raw = await readTextCached(filePath)
      const blockViolations = []
      const inlineStyleBlockPattern = /([A-Za-z_$][\w$]*)\s*:\s*\{([\s\S]{0,320}?)\n\s*},?/g

      for (const match of raw.matchAll(inlineStyleBlockPattern)) {
        const blockName = String(match[1] || '').trim()
        if (!blockName || !isBusinessMetricValueSelector(blockName)) continue

        const declarations = String(match[2] || '')
        const fontSize = parseInlineMetricFontSize(declarations)
        const lineHeight = parseInlineMetricLineHeight(declarations)
        const fontWeight = parseInlineMetricFontWeight(declarations)
        const token = resolveMetricPrimaryValueToken({
          fontSize,
          lineHeight,
          fontWeight,
        })
        const surfaceContext = resolveInlineMetricSurfaceContext(filePath, blockName)

        if (!surfaceContext) continue

        if (surfaceContext === 'overview' && token !== 'overview') {
          blockViolations.push({
            selector: blockName,
            reason:
              'overview metric surface should use 24px / 32px / 600 instead of an unsanctioned inline token',
            lineNumbers: [getLineNumberAtIndex(raw, match.index ?? 0)],
          })
        }

        if (surfaceContext === 'embedded' && token !== 'embedded') {
          blockViolations.push({
            selector: blockName,
            reason:
              'embedded metric surface should use 16px / 24px / 600 instead of an overview-sized inline token',
            lineNumbers: [getLineNumberAtIndex(raw, match.index ?? 0)],
          })
        }
      }

      if (blockViolations.length > 0) {
        violations.push({
          filePath,
          blocks: blockViolations.slice(0, 4),
        })
      }
    }
  }

  return violations
}

function formatMetricPrimaryValueToken({ fontSize, fontWeight, lineHeight }) {
  const sizeText = fontSize == null ? '?' : `${fontSize}px`
  const lineHeightText = lineHeight == null ? '?' : `${lineHeight}px`
  const weightText = fontWeight == null ? '?' : String(fontWeight)
  return `${sizeText} / ${lineHeightText} / ${weightText}`
}

function resolveMetricSurfaceContext({
  fileHasEmbeddedSurfaceSignal,
  fileHasOverviewSurfaceSignal,
  selector,
  selectorHasExplicitEmbeddedSurfaceSignal,
  selectorHasExplicitOverviewSurfaceSignal,
}) {
  if (selectorHasExplicitOverviewSurfaceSignal && !selectorHasExplicitEmbeddedSurfaceSignal) {
    return 'overview'
  }

  if (selectorHasExplicitEmbeddedSurfaceSignal && !selectorHasExplicitOverviewSurfaceSignal) {
    return 'embedded'
  }

  const selectorHasOverviewSurfaceSignal =
    isBusinessOverviewMetricSurfaceSelector(selector) ||
    /\.(?:summaryMetricValue|statValue|overviewValue)\b|\b(?:summaryMetricValue|statValue|overviewValue)\b/i.test(
      selector
    )
  const selectorHasEmbeddedSurfaceSignal =
    isBusinessEmbeddedMetricSurfaceSelector(selector) ||
    /\.(?:cardMetricValue|detailHeaderMetricValue|headerMetricValue|inlineMetricValue|localMetricValue)\b|\b(?:cardMetricValue|detailHeaderMetricValue|headerMetricValue|inlineMetricValue|localMetricValue)\b/i.test(
      selector
    )

  if (selectorHasOverviewSurfaceSignal && !selectorHasEmbeddedSurfaceSignal) {
    return 'overview'
  }

  if (selectorHasEmbeddedSurfaceSignal && !selectorHasOverviewSurfaceSignal) {
    return 'embedded'
  }

  if (fileHasOverviewSurfaceSignal && !fileHasEmbeddedSurfaceSignal) {
    return 'overview'
  }

  if (fileHasEmbeddedSurfaceSignal && !fileHasOverviewSurfaceSignal) {
    return 'embedded'
  }

  return 'ambiguous'
}

async function collectLayoutStretchRiskViolations(rootDirs) {
  const seen = new Set()
  const violations = []

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, STYLE_FILE_PATTERN)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)

      const raw = await readTextCached(filePath)
      const blockViolations = []

      for (const block of extractStyleBlocks(raw)) {
        const selector = block.selector.replace(/\s+/g, ' ').trim()
        const declarations = block.declarations.replace(/\s+/g, ' ').trim()

        const isGrid = /display\s*:\s*grid/i.test(declarations)
        const hasGridColumns = /grid-template-columns\s*:/i.test(declarations)
        const hasCrossAxisControl = /(?:align-items|place-items)\s*:/i.test(declarations)
        const hasContentAxisControl = /(?:align-content|place-content)\s*:/i.test(declarations)
        const usesFillRows = /grid-template-rows\s*:[^;]*\b1fr\b/i.test(declarations)
        const hasFlexGrowSignal =
          /(?:^|[;\s])flex\s*:\s*1(?:\s+1(?:\s+0(?:px|%)?)?)?\b/i.test(declarations) ||
          /(?:^|[;\s])flex-grow\s*:\s*1\b/i.test(declarations)

        if (isGrid && hasGridColumns && isBusinessMultiColumnSelector(selector) && !hasCrossAxisControl) {
          blockViolations.push({
            selector,
            reason: 'multi-column grid missing explicit align-items/place-items control',
            lineNumbers: [getLineNumberAtIndex(raw, block.index)],
          })
          continue
        }

        if (isGrid && usesFillRows && isBusinessCardSelector(selector)) {
          blockViolations.push({
            selector,
            reason: 'card/detail container uses grid-template-rows with 1fr and may create blank body gaps',
            lineNumbers: [getLineNumberAtIndex(raw, block.index)],
          })
          continue
        }

        if (
          isGrid &&
          /gap\s*:/i.test(declarations) &&
          isBusinessCardSelector(selector) &&
          !hasContentAxisControl &&
          /(column|panel|section|hero|metrics)/i.test(selector)
        ) {
          blockViolations.push({
            selector,
            reason: 'stacked grid container is missing explicit align-content/place-content control',
            lineNumbers: [getLineNumberAtIndex(raw, block.index)],
          })
        }

        if (
          isGrid &&
          hasGridColumns &&
          isBusinessMultiColumnSelector(selector) &&
          hasSplitRightTrackHardMinDeclaration(declarations)
        ) {
          blockViolations.push({
            selector,
            reason:
              'split/detail grid hard-codes a fixed minimum right track; keep the right pane elastic with minmax(0, 1fr) unless a documented exception is approved',
            lineNumbers: [getLineNumberAtIndex(raw, block.index)],
          })
          continue
        }

        if (
          isBusinessPrimaryPaneSelector(selector) &&
          (hasFlexGrowSignal || /display\s*:\s*flex/i.test(declarations) || /display\s*:\s*grid/i.test(declarations)) &&
          !hasZeroMinInlineSizeDeclaration(declarations)
        ) {
          blockViolations.push({
            selector,
            reason:
              'elastic right/detail pane is missing min-inline-size: 0 (or min-width: 0), which risks table content stretching the split workspace instead of staying contained',
            lineNumbers: [getLineNumberAtIndex(raw, block.index)],
          })
        }
      }

      if (blockViolations.length > 0) {
        violations.push({
          filePath,
          blocks: blockViolations.slice(0, 4),
        })
      }
    }
  }

  return violations
}

function summarizeBusinessGradientViolations(targetRoot, violations) {
  return violations
    .slice(0, 6)
    .map((item) => formatViolationLocation(targetRoot, item.filePath, item.lineNumbers))
    .join('; ')
}

function summarizeLayoutStretchRiskViolations(targetRoot, violations) {
  return violations
    .slice(0, 6)
    .map((item) => {
      const firstBlock = item.blocks[0]
      const lineNumbers = firstBlock?.lineNumbers ?? []
      const reason = firstBlock?.reason ?? 'layout stretch risk'
      return `${formatViolationLocation(targetRoot, item.filePath, lineNumbers)} <- ${reason}`
    })
    .join('; ')
}

async function collectMetricGridOverflowRiskViolations(rootDirs) {
  const seen = new Set()
  const violations = []

  for (const rootDir of rootDirs) {
    const explicitMetricSurfaceSignals = await collectExplicitMetricSurfaceSignals(rootDir)

    for (const filePath of await collectTextFiles(rootDir, STYLE_FILE_PATTERN)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)

      const raw = await readTextCached(filePath)
      const blocks = extractStyleBlocks(raw)
      const blockViolations = []
      const explicitSignals =
        explicitMetricSurfaceSignals.get(filePath) ?? {
          embedded: new Set(),
          overview: new Set(),
        }
      const fileHasEmbeddedSurfaceSignal = blocks.some((block) =>
        isBusinessEmbeddedMetricSurfaceSelector(block.selector.replace(/\s+/g, ' ').trim())
      ) || explicitSignals.embedded.size > 0
      const fileHasOverviewSurfaceSignal = blocks.some((block) =>
        isBusinessOverviewMetricSurfaceSelector(block.selector.replace(/\s+/g, ' ').trim())
      ) || explicitSignals.overview.size > 0
      let hasEmbeddedOverviewSizedMetricValueSignal = false

      for (const block of blocks) {
        const selector = block.selector.replace(/\s+/g, ' ').trim()
        const declarations = block.declarations.replace(/\s+/g, ' ').trim()
        const fontSize = parseMetricFontSize(declarations)
        const selectorClassNames = extractClassNamesFromSelector(selector)
        const selectorHasExplicitOverviewSurfaceSignal = [...selectorClassNames].some((className) =>
          explicitSignals.overview.has(className)
        )
        const selectorHasExplicitEmbeddedSurfaceSignal = [...selectorClassNames].some((className) =>
          explicitSignals.embedded.has(className)
        )
        const surfaceContext = resolveMetricSurfaceContext({
          fileHasEmbeddedSurfaceSignal,
          fileHasOverviewSurfaceSignal,
          selector,
          selectorHasExplicitEmbeddedSurfaceSignal,
          selectorHasExplicitOverviewSurfaceSignal,
        })

        const usesFixedEqualThreeCols =
          /grid-template-columns\s*:\s*repeat\(\s*3\s*,\s*minmax\(\s*0\s*,\s*1fr\s*\)\s*\)/i.test(
            declarations
          ) || /grid-template-columns\s*:\s*1fr\s+1fr\s+1fr\b/i.test(declarations)

        if (
          isBusinessMetricValueSelector(selector) &&
          fontSize != null &&
          fontSize >= 24 &&
          surfaceContext === 'embedded'
        ) {
          hasEmbeddedOverviewSizedMetricValueSignal = true
        }

        if (
          isBusinessMetricGridSelector(selector) &&
          usesFixedEqualThreeCols &&
          surfaceContext === 'embedded'
        ) {
          blockViolations.push({
            selector,
            reason:
              'embedded KPI grid still uses a fixed equal three-column split while metric values stay overview-sized or amount values may be long',
            lineNumbers: [getLineNumberAtIndex(raw, block.index)],
          })
        }
      }

      if (hasEmbeddedOverviewSizedMetricValueSignal && blockViolations.length > 0) {
        violations.push({
          filePath,
          blocks: blockViolations.slice(0, 4),
        })
      }
    }
  }

  return violations
}

function summarizeMetricGridOverflowRiskViolations(targetRoot, violations) {
  return violations
    .slice(0, 6)
    .map((item) => {
      const firstBlock = item.blocks[0]
      const lineNumbers = firstBlock?.lineNumbers ?? []
      const reason = firstBlock?.reason ?? 'embedded KPI grid compression risk'
      return `${formatViolationLocation(targetRoot, item.filePath, lineNumbers)} <- ${reason}`
    })
    .join('; ')
}

async function collectMetricSurfaceTokenViolations(rootDirs) {
  const seen = new Set()
  const violations = []

  for (const rootDir of rootDirs) {
    const explicitMetricSurfaceSignals = await collectExplicitMetricSurfaceSignals(rootDir)

    for (const filePath of await collectTextFiles(rootDir, STYLE_FILE_PATTERN)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)

      const raw = await readTextCached(filePath)
      const blocks = extractStyleBlocks(raw)
      const blockViolations = []
      const explicitSignals =
        explicitMetricSurfaceSignals.get(filePath) ?? {
          embedded: new Set(),
          overview: new Set(),
        }
      const fileHasOverviewSurfaceSignal = blocks.some((block) =>
        isBusinessOverviewMetricSurfaceSelector(block.selector.replace(/\s+/g, ' ').trim())
      ) || explicitSignals.overview.size > 0
      const fileHasEmbeddedSurfaceSignal = blocks.some((block) =>
        isBusinessEmbeddedMetricSurfaceSelector(block.selector.replace(/\s+/g, ' ').trim())
      ) || explicitSignals.embedded.size > 0

      for (const block of blocks) {
        const selector = block.selector.replace(/\s+/g, ' ').trim()
        if (!isBusinessMetricValueSelector(selector)) continue

        const declarations = block.declarations.replace(/\s+/g, ' ').trim()
        const selectorClassNames = extractClassNamesFromSelector(selector)
        const fontSize = parseMetricFontSize(declarations)
        const lineHeight = parseMetricLineHeight(declarations)
        const fontWeight = parseMetricFontWeight(declarations)
        const token = resolveMetricPrimaryValueToken({
          fontSize,
          lineHeight,
          fontWeight,
        })
        const selectorHasExplicitOverviewSurfaceSignal = [...selectorClassNames].some((className) =>
          explicitSignals.overview.has(className)
        )
        const selectorHasExplicitEmbeddedSurfaceSignal = [...selectorClassNames].some((className) =>
          explicitSignals.embedded.has(className)
        )
        const surfaceContext = resolveMetricSurfaceContext({
          selector,
          fileHasOverviewSurfaceSignal,
          fileHasEmbeddedSurfaceSignal,
          selectorHasExplicitEmbeddedSurfaceSignal,
          selectorHasExplicitOverviewSurfaceSignal,
        })

        if (!token) {
          blockViolations.push({
            selector,
            reason: `metric primary value must use either 24px / 32px / 600 or 16px / 24px / 600; found ${formatMetricPrimaryValueToken({ fontSize, lineHeight, fontWeight })}`,
            lineNumbers: [getLineNumberAtIndex(raw, block.index)],
          })
          continue
        }

        if (surfaceContext === 'overview' && token !== 'overview') {
          blockViolations.push({
            selector,
            reason:
              'overview metric surface should use 24px / 32px / 600 instead of the embedded 16px / 24px / 600 token',
            lineNumbers: [getLineNumberAtIndex(raw, block.index)],
          })
          continue
        }

        if (surfaceContext === 'embedded' && token !== 'embedded') {
          blockViolations.push({
            selector,
            reason:
              'embedded metric surface should use 16px / 24px / 600 instead of the overview 24px / 32px / 600 token',
            lineNumbers: [getLineNumberAtIndex(raw, block.index)],
          })
        }
      }

      if (blockViolations.length > 0) {
        violations.push({
          filePath,
          blocks: blockViolations.slice(0, 6),
        })
      }
    }
  }

  return violations
}

function summarizeMetricSurfaceTokenViolations(targetRoot, violations) {
  return violations
    .slice(0, 6)
    .map((item) => {
      const firstBlock = item.blocks[0]
      const lineNumbers = firstBlock?.lineNumbers ?? []
      const reason = firstBlock?.reason ?? 'metric token mismatch'
      return `${formatViolationLocation(targetRoot, item.filePath, lineNumbers)} <- ${reason}`
    })
    .join('; ')
}

async function collectChartPlotEdgeViolations(rootDirs) {
  const files = []
  const seen = new Set()
  const fileNamePattern = /\.[cm]?[jt]sx?$/i
  const violations = []

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, fileNamePattern)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)
      files.push(filePath)
    }
  }

  for (const filePath of files) {
    const raw = await readTextCached(filePath)
    const mentionsBarLikeChart =
      /\b<Column\b/.test(raw) ||
      /\b<Bar\b/.test(raw) ||
      /\bchartType\s*=\s*["']column["']/.test(raw) ||
      /\bchartType\s*=\s*["']bar["']/.test(raw)
    if (!mentionsBarLikeChart) continue

    const mentionsChartSurface =
      /data-hiui5-region\s*=\s*["']chart-section["']/.test(raw) ||
      /styles\.(chartSection|chartPanel|chartCard|chartContent)\b/.test(raw) ||
      /\b(chartSection|chartPanel|chartCard|chartContent)\b/.test(raw)
    if (!mentionsChartSurface) continue

    const hasPlotEdgeGuard =
      /\bpaddingOuter\b/.test(raw) ||
      /\binsetRight\b/.test(raw) ||
      /\binsetLeft\b/.test(raw) ||
      /\bwithHiuiColumnLikeChart\b/.test(raw) ||
      /\bcreateHiuiColumnLikeScale\b/.test(raw) ||
      /\bcreateHiuiColumnLikeColorScale\b/.test(raw) ||
      /\bwithHiuiBarLikePlotInset\b/.test(raw) ||
      /\bwithHiuiBarLikeChart\b/.test(raw) ||
      /\bcreateHiuiBarLikeScale\b/.test(raw) ||
      /\bcreateHiuiBarLikeColorScale\b/.test(raw)

    if (!hasPlotEdgeGuard) {
      violations.push(filePath)
    }
  }

  return violations
}

async function collectWhiteBodyEdgeTouchViolations(rootDirs) {
  const files = []
  const seen = new Set()
  const fileNamePattern = /\.[cm]?[jt]sx?$/i
  const violations = []

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, fileNamePattern)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)
      files.push(filePath)
    }
  }

  for (const filePath of files) {
    const raw = await readTextCached(filePath)
    if (
      /src[\\/]+typical-page-reuse[\\/]+components[\\/]+managed-page[\\/]+managed-.*shell\.[cm]?[jt]sx?$/.test(
        filePath
      )
    ) {
      continue
    }
    const usesProDetailPage = /\bProDetailPage\b/.test(raw)
    if (!usesProDetailPage) continue

    const hasCustomTopSection =
      /styles\.(summarySection|overviewSection|heroSection|identitySection|statSection)\b/.test(raw) ||
      /\b(summarySection|overviewSection|heroSection|identitySection|statSection)\b/.test(raw)
    const hasCustomChartOrStatRegion =
      /data-hiui5-region\s*=\s*["'](?:stat-section|chart-section)["']/.test(raw)

    if (!hasCustomTopSection && !hasCustomChartOrStatRegion) {
      continue
    }

    const importedStyleRaw = await readImportedStyleSources(filePath, raw)
    const rootInsetSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
      '.pageBody',
      '.page-body',
      '.detailBody',
      '.detail-body',
    ])
    const leadingSectionSnippets = collectWorkspaceSurfaceSnippets(importedStyleRaw, [
      '.summarySection',
      '.summary-section',
      '.overviewSection',
      '.overview-section',
      '.heroSection',
      '.hero-section',
      '.identitySection',
      '.identity-section',
      '.statSection',
      '.stat-section',
      '.contentGrid',
      '.content-grid',
    ])

    const hasInsetOwner =
      rootInsetSnippets.some(hasTopAndHorizontalTwentySignal) ||
      leadingSectionSnippets.some(hasTopAndHorizontalTwentySignal)

    if (!hasInsetOwner) {
      violations.push(filePath)
    }
  }

  return violations
}

async function collectProDetailProviderViolations(rootDirs) {
  const files = []
  const seen = new Set()
  const fileNamePattern = /\.[cm]?[jt]sx?$/i
  const violations = []

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, fileNamePattern)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)
      files.push(filePath)
    }
  }

  for (const filePath of files) {
    const raw = await readTextCached(filePath)
    if (
      /src[\\/]+typical-page-reuse[\\/]+components[\\/]+managed-page[\\/]+managed-.*shell\.[cm]?[jt]sx?$/.test(
        filePath
      )
    ) {
      continue
    }
    const usesProDetailPage = /\bProDetailPage\b/.test(raw) && /<ProDetailPage\b/.test(raw)

    if (!usesProDetailPage) continue

    const hasProviderSignal =
      /\bProDetailPageProvider\b/.test(raw) ||
      /\buseProDetailPageContext\b/.test(raw)

    if (!hasProviderSignal) {
      violations.push(filePath)
    }
  }

  return violations
}

async function collectVerticalDetailLabelWidthViolations(rootDirs) {
  const files = []
  const seen = new Set()
  const fileNamePattern = /\.[cm]?[jt]sx?$/i
  const violations = []

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, fileNamePattern)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)
      files.push(filePath)
    }
  }

  for (const filePath of files) {
    const raw = await readTextCached(filePath)
    if (
      /src[\\/]+typical-page-reuse[\\/]+components[\\/]+managed-page[\\/]+managed-.*shell\.[cm]?[jt]sx?$/.test(
        filePath
      )
    ) {
      continue
    }
    if (/[\\/]\.local-context[\\/]+hiui-design[\\/]+reference[\\/]/.test(filePath)) {
      continue
    }

    const usesDetailShell =
      (/\bProDetailPage\b/.test(raw) && /<ProDetailPage\b/.test(raw)) ||
      (/\bProDetailDrawer\b/.test(raw) && /<ProDetailDrawer\b/.test(raw)) ||
      /data-hiui5-region\s*=\s*["']detail-body["']/.test(raw) ||
      /data-hiui5-region\s*=\s*["']drawer-body["']/.test(raw)
    const usesDetailDescriptions =
      /\b(Descriptions|SchemaDescriptionsBridge)\b/.test(raw) &&
      hasVerticalDescriptionsPlacement(raw) &&
      (
        hasFixedDescriptionsLabelWidth(raw) ||
        !hasLeftDescriptionsLabelPlacement(raw) ||
        (usesSchemaDescriptionsBridge(raw) && !hasClearedDescriptionsLabelWidth(raw))
      )

    if (usesDetailShell && usesDetailDescriptions) {
      violations.push(filePath)
    }
  }

  return violations
}

async function collectProEditProviderViolations(rootDirs) {
  const files = []
  const seen = new Set()
  const fileNamePattern = /\.[cm]?[jt]sx?$/i
  const violations = []

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, fileNamePattern)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)
      files.push(filePath)
    }
  }

  for (const filePath of files) {
    const raw = await readTextCached(filePath)
    if (
      /src[\\/]+typical-page-reuse[\\/]+components[\\/]+managed-page[\\/]+managed-.*shell\.[cm]?[jt]sx?$/.test(
        filePath
      )
    ) {
      continue
    }
    const usesProEditPage = /\bProEditPage\b/.test(raw) && /<ProEditPage\b/.test(raw)
    const usesProEditContextDependents =
      /<Form\b/.test(raw) ||
      /<(CancelButton|StashButton|SubmitButton)\b/.test(raw) ||
      /\buseProEditPageContext\b/.test(raw)

    if (!usesProEditPage || !usesProEditContextDependents) continue

    const hasProviderSignal =
      /\bProEditPageProvider\b/.test(raw) ||
      /\buseProEditPageContext\b/.test(raw)

    if (!hasProviderSignal) {
      violations.push(filePath)
    }
  }

  return violations
}

async function collectSharedBarLikeHelperBypassViolations(rootDirs) {
  const files = []
  const seen = new Set()
  const fileNamePattern = /\.[cm]?[jt]sx?$/i

  for (const rootDir of rootDirs) {
    for (const filePath of await collectTextFiles(rootDir, fileNamePattern)) {
      if (seen.has(filePath)) continue
      seen.add(filePath)
      files.push(filePath)
    }
  }

  let sharedHelperAvailable = false

  for (const filePath of files) {
    if (!/hiui-chart-theme\.[cm]?[jt]sx?$/i.test(filePath)) continue
    const raw = await readTextCached(filePath)
    if (
      /\bexport function withHiuiColumnLikeChart\b/.test(raw) ||
      /\bexport function createHiuiColumnLikeScale\b/.test(raw) ||
      /\bexport function createHiuiColumnLikeColorScale\b/.test(raw) ||
      /\bexport function withHiuiBarLikeChart\b/.test(raw) ||
      /\bexport function createHiuiBarLikeScale\b/.test(raw) ||
      /\bexport function createHiuiBarLikeColorScale\b/.test(raw)
    ) {
      sharedHelperAvailable = true
      break
    }
  }

  if (!sharedHelperAvailable) {
    return []
  }

  const violations = []

  for (const filePath of files) {
    const raw = await readTextCached(filePath)
    const mentionsBarLikeChart =
      /\b<Column\b/.test(raw) ||
      /\b<Bar\b/.test(raw) ||
      /\bchartType\s*=\s*["']column["']/.test(raw) ||
      /\bchartType\s*=\s*["']bar["']/.test(raw)
    if (!mentionsBarLikeChart) continue

    const mentionsChartSurface =
      /data-hiui5-region\s*=\s*["']chart-section["']/.test(raw) ||
      /styles\.(chartSection|chartPanel|chartCard|chartContent)\b/.test(raw) ||
      /\b(chartSection|chartPanel|chartCard|chartContent)\b/.test(raw)
    if (!mentionsChartSurface) continue

    const usesSharedBarLikeHelper =
      /\bwithHiuiColumnLikeChart\b/.test(raw) ||
      /\bcreateHiuiColumnLikeScale\b/.test(raw) ||
      /\bcreateHiuiColumnLikeColorScale\b/.test(raw) ||
      /\bwithHiuiBarLikeChart\b/.test(raw) ||
      /\bcreateHiuiBarLikeScale\b/.test(raw) ||
      /\bcreateHiuiBarLikeColorScale\b/.test(raw)

    if (!usesSharedBarLikeHelper) {
      violations.push(filePath)
    }
  }

  return violations
}

function summarizeChartPlotEdgeViolations(targetRoot, filePaths) {
  return filePaths.slice(0, 6).map((filePath) => path.relative(targetRoot, filePath)).join('; ')
}

function summarizeWhiteBodyEdgeTouchViolations(targetRoot, filePaths) {
  return filePaths.slice(0, 6).map((filePath) => path.relative(targetRoot, filePath)).join('; ')
}

function summarizeSharedBarLikeHelperBypassViolations(targetRoot, filePaths) {
  return filePaths.slice(0, 6).map((filePath) => path.relative(targetRoot, filePath)).join('; ')
}

function summarizeProDetailProviderViolations(targetRoot, filePaths) {
  return filePaths.slice(0, 6).map((filePath) => path.relative(targetRoot, filePath)).join('; ')
}

function summarizeProEditProviderViolations(targetRoot, filePaths) {
  return filePaths.slice(0, 6).map((filePath) => path.relative(targetRoot, filePath)).join('; ')
}

function summarizeVerticalDetailLabelWidthViolations(targetRoot, filePaths) {
  return filePaths.slice(0, 6).map((filePath) => path.relative(targetRoot, filePath)).join('; ')
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
  line,
  manifestPath,
  mode,
  recommendedMode,
  hostProfile,
  hostAdapterSnippetPath,
}) {
  const reportPath = path.join(outputRoot, 'DOCTOR_REPORT.md')
  const currentPageReady = isCurrentPageReady(status)
  const lines = [
    '# Typical Page Reuse Doctor Report',
    '',
    `- target root: ${targetRoot}`,
    `- mode: ${mode}`,
    `- project type: ${hostProfile.projectType}`,
    `- detected framework: ${hostProfile.framework}`,
    `- recommended strategy: ${hostProfile.strategy}`,
    `- recommended mode: ${recommendedMode}`,
    ...(line ? [`- business line: ${line}`] : []),
    ...(hostProfile.adapterDoc
      ? [`- framework adapter guide: ${resolveAdapterGuideLabel(outputRoot, hostProfile.adapterDoc)}`]
      : []),
    ...(hostAdapterSnippetPath ? [`- host adapter snippet: ${hostAdapterSnippetPath}`] : []),
    `- overall status: ${status}`,
    `- current-page delivery ready: ${currentPageReady ? 'yes' : 'no'}`,
    `- manifest: ${manifestPath}`,
    `- checks passed: ${summary.passed}`,
    `- checks failed: ${summary.failed}`,
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

  if (status === 'pass') {
    lines.push('- This project is ready to generate pages following the Figma typical-page rules.')
  } else if (status === 'warn') {
    lines.push(
      '- Warnings remain. Treat the current page as not delivery-ready until every warning is cleared or explicitly proven to be unrelated historical debt outside the current page.'
    )
  } else if (status === 'manual') {
    lines.push(
      '- Manual route or host integration work is still blocking delivery. Do not mark the current page complete until those manual steps are finished and doctor returns PASS.'
    )
  } else {
    lines.push('- Do not continue generating business pages yet. Fix the hard failures first.')
  }

  await ensureDir(path.dirname(reportPath))
  await fs.writeFile(reportPath, renderPortableReport(lines, targetRoot), 'utf8')
  return reportPath
}

function getSmokeCases(manifest) {
  return manifest.pageTypes.filter((pageType) => pageType.smokePath && pageType.smokeGroup)
}

function getPrimarySmokeCases(manifest) {
  return getSmokeCases(manifest).filter((pageType) => pageType.smokePriority === 'primary')
}

function getArchetypeSmokeBaselineCases(manifest) {
  return getSmokeCases(manifest).filter((pageType) => pageType.archetypeSmokeBaseline === true)
}

function mapArchetypeSmokeBaselineSpecEntries(baselineSpec) {
  return new Map(
    Array.isArray(baselineSpec?.baselines)
      ? baselineSpec.baselines
          .filter((item) => item?.pageTypeId)
          .map((item) => [item.pageTypeId, item])
      : []
  )
}

function getRequiredArchetypeBaselineIds(baselineSpec) {
  if (Array.isArray(baselineSpec?.requiredPageTypes) && baselineSpec.requiredPageTypes.length > 0) {
    return baselineSpec.requiredPageTypes
      .map((item) => String(item || '').trim())
      .filter(Boolean)
  }

  return ['table-stat', 'full-page-edit', 'full-page-detail']
}

function getBaselineViewportLabel(baseline) {
  if (!baseline?.viewport) return '--'
  const { width, height } = baseline.viewport
  if (!width || !height) return '--'
  return `${width}x${height}`
}

function getBaselineRouteSuggestion(pageType, baseline) {
  return baseline?.routeSuggestion || pageType.smokePath || '--'
}

function getBaselineExamplePath(pageType, baseline) {
  return baseline?.examplePath || pageType.assetExamplePath || pageType.examplePath || '--'
}

function validateArchetypeSmokeBaselineSpecEntry(entry) {
  const issues = []

  if (!entry || typeof entry !== 'object') {
    issues.push('entry is missing')
    return issues
  }

  if (!entry.screenshotKey || typeof entry.screenshotKey !== 'string') {
    issues.push('missing screenshotKey')
  }

  if (
    !entry.viewport ||
    !Number.isFinite(entry.viewport.width) ||
    !Number.isFinite(entry.viewport.height)
  ) {
    issues.push('missing viewport width/height')
  }

  if (!entry.routeSuggestion || typeof entry.routeSuggestion !== 'string') {
    issues.push('missing routeSuggestion')
  }

  if (!entry.examplePath || typeof entry.examplePath !== 'string') {
    issues.push('missing examplePath')
  }

  if (!Array.isArray(entry.assertions) || entry.assertions.length === 0) {
    issues.push('missing assertions')
  }

  return issues
}

async function detectDoctorMode({
  requestedMode,
  targetRoot,
  outputRoot,
  recommendedMode,
  isTypicalPageSourceRepo = false,
}) {
  if (requestedMode !== 'auto') return requestedMode

  const localSkillRoot = path.join(targetRoot, '.local-context', 'hiui-design')
  if (
    !isTypicalPageSourceRepo &&
    recommendedMode &&
    recommendedMode !== 'host-integration' &&
    (await pathExists(localSkillRoot))
  ) {
    return recommendedMode
  }

  const hostMarkers = [
    path.join(outputRoot, 'routes', 'config.tsx'),
    path.join(outputRoot, 'pages', 'full-page-edit.tsx'),
    path.join(outputRoot, 'app-shell.tsx'),
  ]

  for (const marker of hostMarkers) {
    if (await pathExists(marker)) return 'host-integration'
  }

  if (await pathExists(localSkillRoot)) {
    return 'rules-only'
  }

  return 'host-integration'
}

function getRecommendedMode({ hostProfile, legacyHostRuntime }) {
  return legacyHostRuntime?.incompatible ? 'legacy-host-compatible' : hostProfile.recommendedMode
}

function isReferenceOnlyMode(mode) {
  return mode === 'rules-only' || mode === 'legacy-host-compatible'
}

function resolveDoctorMode({ requestedMode, legacyHostRuntime }) {
  if (
    legacyHostRuntime?.incompatible &&
    (requestedMode === 'rules-only' || requestedMode === 'host-integration')
  ) {
    return 'legacy-host-compatible'
  }
  return requestedMode
}

function getSmokeExpectations(pageType) {
  switch (pageType.smokeGroup) {
    case 'table':
      return [
        '页头、白底主区、筛选区、表格、分页节奏连续',
        '数据统计表时指标卡仍是白卡描边，不是裸文本',
        '表格高度可以收口，不出现整页双滚动',
      ]
    case 'chart':
      return [
        '页头、指标卡、多图表区和明细表仍在同一白底工作区',
        '图表主题、颜色和坐标轴没有回退成库默认样式',
        '图表区与明细表之间没有双滚动和额外主白卡层',
      ]
    case 'feedback':
      return [
        '页头、白底反馈面板和居中反馈内容关系正常',
        '反馈图示资源正常加载，不回退成破图或纯文本占位',
        '主次操作仍收口在反馈面板内，不误用表格或表单壳',
      ]
    case 'drawer':
      return [
        '抽屉标题、body、footer 节奏正常',
        'footer 顶线和阴影没有回退成默认样式',
        '抽屉内容没有多余卡片和异常行距',
      ]
    case 'full-page':
      return [
        'PageHeader 正确挂到宿主 header 区，不在内容区重复渲染',
        '主白底、滚动区、底栏关系正常',
        '不要退化成宿主灰底上的单张白卡页面',
      ]
    default:
      return ['页面整体节奏应接近当前仓库典型页基线']
  }
}

function getArchetypeBaselineExpectations(pageType) {
  switch (pageType.id) {
    case 'table-stat':
      return [
        '指标卡必须是真实白卡区，不退化成 tabs、摘要文本或普通标题计数。',
        '筛选区必须保持 QueryFilter 语义，不能退回手写 Input/Select/DatePicker flex 行。',
        '分页必须留在同一个白底主体内部，不能掉到宿主灰底外。',
      ]
    case 'full-page-edit':
      return [
        '页头、单一白底工作区、表单滚动区、底部操作区必须是同一个全页编辑壳层。',
        '不要退化成宿主灰底上的单张白卡 + 自由 footer。',
        '字段栅格、返回链路和 footer 吸底关系要先在这个基线页上锁定，再生成业务编辑页。',
      ]
    case 'full-page-detail':
      return [
        '页头必须保持 60px 垂直居中，标题维持 18px / 600，不能漂到内容区里或出现额外 header 间距。',
        "详情字段必须保持 Descriptions 的 vertical + 3 columns；detail-shell 需显式冻结 `labelPlacement: 'left'`，SchemaDescriptionsBridge 还要清空隐藏 `labelWidth`，不要再靠默认值碰巧成立。",
        '分组详情必须仍在单一白底主体内，不拆成多层白卡或独立摘要卡。',
      ]
    default:
      return getSmokeExpectations(pageType)
  }
}

function resolveAdapterGuideLabel(outputRoot, adapterDoc) {
  const base = outputRoot.includes(`${path.sep}.local-context${path.sep}`)
    ? '.'
    : '.local-context/hiui-design'
  return `${base}/${adapterDoc}`.replace(/\\/g, '/')
}

function sanitizePortableReportLine(line, targetRoot) {
  if (typeof line !== 'string' || !line) return line

  const normalizedRoot = String(targetRoot || '').replace(/[\\/]+$/, '')
  let result = line

  if (normalizedRoot) {
    result = result.split(`${normalizedRoot}${path.sep}`).join('')
    result = result.split(normalizedRoot).join('.')
  }

  return result.replace(/\\/g, '/')
}

function renderPortableReport(lines, targetRoot) {
  return `${lines.map((line) => sanitizePortableReportLine(line, targetRoot)).join('\n')}\n`
}

async function writeSmokeReport({
  outputRoot,
  targetRoot,
  manifest,
  doctorStatus,
  mode,
  baselineSpecPath = '',
  baselineSpec = null,
}) {
  const reportPath = path.join(outputRoot, 'SMOKE_REPORT.md')
  const archetypeBaselineCases = getArchetypeSmokeBaselineCases(manifest)
  const baselineSpecEntries = mapArchetypeSmokeBaselineSpecEntries(baselineSpec)
  if (isReferenceOnlyMode(mode)) {
    const isLegacyCompatibilityMode = mode === 'legacy-host-compatible'
    const lines = [
      '# Typical Page Reuse Smoke Report',
      '',
      `- target root: ${targetRoot}`,
      `- doctor status before smoke: ${doctorStatus}`,
      `- mode: ${mode}`,
      '',
      '## Purpose',
      '',
      '- Reference-only modes do not sync a route gallery, template pages, or host bridge files into the target project source tree.',
      `- A local reference-only example set should be available at \`${RULES_ONLY_REFERENCE_PAGES_GLOB}\`. Use it to lock a single page baseline before generating the real business page.`,
      ...(isLegacyCompatibilityMode
        ? [
            '- Legacy-host-compatible mode also forbids mounting the standard typical-page runtime directly in the current host. Generate against the local host abstractions only.',
          ]
        : []),
      '- Smoke verification should happen on the actual business page after it is generated inside the target project’s own structure.',
      ...(baselineSpecPath ? [`- Screenshot baseline spec: \`${baselineSpecPath}\``] : []),
      '',
      '## Required archetype baselines to lock first',
      '',
      '| Page | Page type | Example file | Suggested viewport | Screenshot key | Why it is mandatory |',
      '| --- | --- | --- | --- | --- | --- |',
      ...archetypeBaselineCases.map(
        (pageType) => {
          const baseline = baselineSpecEntries.get(pageType.id)
          const viewport = getBaselineViewportLabel(baseline)
          const screenshotKey = baseline?.screenshotKey || '--'

          return `| ${pageType.label} | \`${pageType.id}\` | \`${getBaselineExamplePath(pageType, baseline)}\` | \`${viewport}\` | \`${screenshotKey}\` | ${pageType.shell} archetype is a required visual baseline before generating same-type business pages |`
        }
      ),
      '',
      '## What To Check After Page Generation',
      '',
      '1. Start the target project dev server.',
      '2. Before bulk generation, open or recreate the required archetype baseline pages above and lock their visual structure first.',
      '3. Open the real generated page in the target project route tree.',
      '4. Verify the page still matches the selected typical-page shell, spacing rhythm, and right-aligned action areas.',
      '5. If the page imports `@hiui-design/typical-page-shells`, confirm styles.css and the Vite `@hi-ui/schema-types` alias have been handled in the target project.',
      '',
    ]

    lines.push('## Required baseline pass criteria', '')
    for (const pageType of archetypeBaselineCases) {
      lines.push(`### ${pageType.label}`)
      for (const item of getArchetypeBaselineExpectations(pageType)) {
        lines.push(`- ${item}`)
      }
      const baseline = baselineSpecEntries.get(pageType.id)
      lines.push(`- example file: \`${getBaselineExamplePath(pageType, baseline)}\``)
      lines.push(`- suggested viewport: \`${getBaselineViewportLabel(baseline)}\``)
      if (baseline?.screenshotKey) {
        lines.push(`- screenshot key: \`${baseline.screenshotKey}\``)
      }
      lines.push('')
    }

    await ensureDir(path.dirname(reportPath))
    await fs.writeFile(reportPath, renderPortableReport(lines, targetRoot), 'utf8')
    return reportPath
  }

  const primaryCases = getPrimarySmokeCases(manifest)
  const lines = [
    '# Typical Page Reuse Smoke Report',
    '',
    `- target root: ${targetRoot}`,
    `- doctor status before smoke: ${doctorStatus}`,
    '',
    '## Purpose',
    '',
    '- This report lists the minimum typical-page examples that should be opened before generating business pages.',
    '- The goal is not to verify every route. The goal is to verify that the target project can still render the core shells close to the Figma typical-page baseline.',
    '',
    '## Recommended smoke sequence',
    '',
    '1. Run `pnpm typical-page:doctor` or `npm run typical-page:doctor` first.',
    '2. Start the target project dev server.',
    '3. Open the primary smoke pages below through the route gallery that mounts `src/typical-page-reuse/routes/config.tsx`.',
    '4. If multiple smoke pages fail at the same time, stop business-page generation and fix host integration or style loading first.',
    '',
    ...(baselineSpecPath ? [`- Screenshot baseline spec: \`${baselineSpecPath}\``, ''] : []),
    '## Primary smoke pages',
    '',
    '| Group | Page | Relative route suggestion | Example file |',
    '| --- | --- | --- | --- |',
  ]

  for (const pageType of primaryCases) {
    lines.push(
      `| ${pageType.smokeGroup} | ${pageType.label} | \`${pageType.smokePath}\` | \`${pageType.examplePath}\` |`
    )
  }

  lines.push('', '## Required archetype baselines', '')
  lines.push('| Page | Page type | Relative route suggestion | Example file | Suggested viewport | Screenshot key |')
  lines.push('| --- | --- | --- | --- | --- | --- |')
  for (const pageType of archetypeBaselineCases) {
    const baseline = baselineSpecEntries.get(pageType.id)
    const viewport = getBaselineViewportLabel(baseline)
    const screenshotKey = baseline?.screenshotKey || '--'
    lines.push(
      `| ${pageType.label} | \`${pageType.id}\` | \`${getBaselineRouteSuggestion(pageType, baseline)}\` | \`${getBaselineExamplePath(pageType, baseline)}\` | \`${viewport}\` | \`${screenshotKey}\` |`
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

  lines.push('', '## Required archetype baseline criteria')
  for (const pageType of archetypeBaselineCases) {
    lines.push('')
    lines.push(`### ${pageType.label}`)
    for (const item of getArchetypeBaselineExpectations(pageType)) {
      lines.push(`- ${item}`)
    }
    const baseline = baselineSpecEntries.get(pageType.id)
    lines.push(`- example file: \`${getBaselineExamplePath(pageType, baseline)}\``)
    lines.push(`- relative route suggestion: \`${getBaselineRouteSuggestion(pageType, baseline)}\``)
    lines.push(`- suggested viewport: \`${getBaselineViewportLabel(baseline)}\``)
    if (baseline?.screenshotKey) {
      lines.push(`- screenshot key: \`${baseline.screenshotKey}\``)
    }
  }

  lines.push('', '## Stop rules', '')
  lines.push('- If the table smoke page fails, first suspect style resources or the host height chain.')
  lines.push('- If the drawer smoke page fails, first suspect default Drawer styles overriding the packaged shell styles.')
  lines.push('- If the full-page smoke page fails, first suspect host header/footer portals or page-shell mounting order.')
  lines.push('- If any required archetype baseline page is visually off, do not continue generating the same page type in business pages.')
  lines.push('- If two or more primary smoke pages fail together, do not continue generating business pages.')

  await ensureDir(path.dirname(reportPath))
  await fs.writeFile(reportPath, renderPortableReport(lines, targetRoot), 'utf8')
  return reportPath
}

async function analyzeRulesOnlyManagedPageFacts({
  baselineSpec,
  legacyCompatibilityMode,
  manifest,
  managedPageRegistryInspection,
  pageContractsResult,
  targetRoot,
}) {
  const registryJsonExists = await pathExists(managedPageRegistryInspection.registryJsonPath)
  const registryMarkdownExists = await pathExists(managedPageRegistryInspection.registryMarkdownPath)
  const managedPageCoverageIssues = [
    ...managedPageRegistryInspection.brokenContracts,
    ...managedPageRegistryInspection.duplicateContractTargets,
    ...managedPageRegistryInspection.contractsWithoutSourceFiles,
    ...managedPageRegistryInspection.sourceWithoutContracts,
    ...managedPageRegistryInspection.contractsWithoutSourceMarkers,
  ]
  const managedPageRegistryIssues = [
    ...(managedPageRegistryInspection.contracts.length > 0 && !registryJsonExists
      ? [`${path.relative(targetRoot, managedPageRegistryInspection.registryJsonPath)} is missing`]
      : []),
    ...(managedPageRegistryInspection.contracts.length > 0 && !registryMarkdownExists
      ? [`${path.relative(targetRoot, managedPageRegistryInspection.registryMarkdownPath)} is missing`]
      : []),
    ...(managedPageRegistryInspection.registryLoadError
      ? [
          `${path.relative(targetRoot, managedPageRegistryInspection.registryJsonPath)} could not be parsed: ${managedPageRegistryInspection.registryLoadError}`,
        ]
      : []),
    ...managedPageRegistryInspection.missingRegistryEntries,
    ...managedPageRegistryInspection.mismatchedRegistryEntries,
    ...managedPageRegistryInspection.unexpectedRegistryEntries,
  ]
  const validContracts = []
  const invalidContracts = []
  const contractWarnings = []
  const runtimeSmokeWarnings = []
  const runtimeSmokeRequiredContracts = []
  const ownershipWarnings = []
  const semanticWarnings = []
  const sourceGuardFailures = []
  const externalComponentBypassFailures = []
  const managedChartGovernanceFailures = []

  for (const entry of pageContractsResult.contracts) {
    if (entry.error || !entry.contract) {
      invalidContracts.push(
        `${path.relative(targetRoot, entry.filePath)} -> ${entry.error || 'invalid json'}`
      )
      continue
    }

    const validation = validateRulesOnlyPageContract({
      contract: entry.contract,
      manifest,
      targetRoot,
      baselineSpec,
    })

    if (validation.errors.length > 0) {
      invalidContracts.push(
        `${path.relative(targetRoot, entry.filePath)} -> ${validation.errors.join('; ')}`
      )
      continue
    }

    validContracts.push(entry)
    const visibleWarnings = validation.warnings.filter((item) => !item.startsWith('generated:'))
    if (visibleWarnings.length > 0) {
      contractWarnings.push(
        `${path.relative(targetRoot, entry.filePath)} -> ${visibleWarnings.join('; ')}`
      )
    }

    const sourceOwnershipWarnings = await inspectRulesOnlyWorkspaceOwnership({
      contract: entry.contract,
      legacyHostCompatible: legacyCompatibilityMode,
      targetRoot,
    })

    if (sourceOwnershipWarnings.length > 0) {
      ownershipWarnings.push(...sourceOwnershipWarnings)
    }

    const sourceSemanticWarnings = await inspectRulesOnlyComponentSemanticDrift({
      contract: entry.contract,
      legacyHostCompatible: legacyCompatibilityMode,
      targetRoot,
    })

    if (sourceSemanticWarnings.length > 0) {
      semanticWarnings.push(...sourceSemanticWarnings)
    }

    const sourceGuardErrors = validateManagedPageSource({
      contract: entry.contract,
      generatedPagePath: entry.contract.generatedPagePath,
      targetRoot,
    })

    if (sourceGuardErrors.length > 0) {
      sourceGuardFailures.push(...sourceGuardErrors)
      externalComponentBypassFailures.push(
        ...sourceGuardErrors.filter((item) => isExternalComponentBypassFailure(item))
      )
      managedChartGovernanceFailures.push(
        ...sourceGuardErrors.filter((item) => isManagedChartGovernanceFailure(item))
      )
    }

    const runtimeSmokeRequirement = getManagedPageRuntimeSmokeRequirement(entry.contract)
    const sourceSnapshotHash = resolveManagedPageObservedSourceSnapshotHash({
      contract: entry.contract,
      targetRoot,
      preferCurrentSource: shouldPreferCurrentManagedPageSourceSnapshotForRuntimeSmoke(
        entry.contract
      ),
    })
    const runtimeSmokeWorkflow = reconcileManagedPageRuntimeSmokeWorkflow(
      entry.contract,
      entry.contract?.workflow || {},
      sourceSnapshotHash
    )
    if (runtimeSmokeRequirement.required) {
      runtimeSmokeRequiredContracts.push(path.relative(targetRoot, entry.filePath))
    }
    if (runtimeSmokeRequirement.required && runtimeSmokeWorkflow.runtimeSmokeStatus !== 'pass') {
      runtimeSmokeWarnings.push(
        `${path.relative(targetRoot, entry.filePath)} -> runtime smoke is required (${runtimeSmokeRequirement.reason}) but current status is ${runtimeSmokeWorkflow.runtimeSmokeStatus || '(missing)'}. Run typical-page:runtime-smoke against the current page snapshot before treating this page as complete.`
      )
    }
  }

  const dataVisualizationSharedShellInspection = await inspectManagedDataVisualizationSharedShells(
    validContracts,
    targetRoot
  )

  const playwrightPackagePath = path.join(targetRoot, 'node_modules', 'playwright', 'package.json')
  const hasPlaywrightForRuntimeSmoke = await pathExists(playwrightPackagePath)

  return {
    contractWarnings,
    dataVisualizationSharedShellInspection,
    externalComponentBypassFailures,
    hasPlaywrightForRuntimeSmoke,
    invalidContracts,
    managedChartGovernanceFailures,
    managedPageCoverageIssues,
    managedPageRegistryIssues,
    ownershipWarnings,
    playwrightPackagePath,
    runtimeSmokeRequiredContracts,
    runtimeSmokeWarnings,
    semanticWarnings,
    sourceGuardFailures,
    validContracts,
  }
}

async function appendRulesOnlyManagedPageChecks({
  baselineSpec,
  checks,
  legacyCompatibilityMode,
  manifest,
  managedPageRegistryInspection,
  nonTypicalSourceOwnership,
  pageContractsResult,
  referenceOnlyMode,
  targetRoot,
}) {
  const facts = await analyzeRulesOnlyManagedPageFacts({
    baselineSpec,
    legacyCompatibilityMode,
    manifest,
    managedPageRegistryInspection,
    pageContractsResult,
    targetRoot,
  })
  const {
    contractWarnings,
    dataVisualizationSharedShellInspection,
    externalComponentBypassFailures,
    hasPlaywrightForRuntimeSmoke,
    invalidContracts,
    managedChartGovernanceFailures,
    managedPageCoverageIssues,
    managedPageRegistryIssues,
    ownershipWarnings,
    playwrightPackagePath,
    runtimeSmokeRequiredContracts,
    runtimeSmokeWarnings,
    semanticWarnings,
    sourceGuardFailures,
    validContracts,
  } = facts

  if (referenceOnlyMode) {
    pushCheck(checks, {
      id: 'rules-only-no-host-sync',
      ok: true,
      severity: 'warn',
      summary: 'reference-only modes keep route/gallery assets out of src while still providing local reference examples',
      detail: `No src/typical-page-reuse gallery, routes, or host bridge files are required. Generate new pages directly in the target project’s existing structure and use ${RULES_ONLY_REFERENCE_PAGES_GLOB} as the default local reference template set. If that directory is missing, fall back to .local-context/hiui-design/examples/host-integration/src/pages/*. In legacy-host-compatible, this reference set is only a local baseline/fallback; ordinary typical pages may still use planner-selected page components through the certified carrier/runtimeAdapterProof path.`,
    })
  }

  pushCheck(checks, {
    id: 'rules-only-page-contracts',
    ok: invalidContracts.length === 0,
    severity: invalidContracts.length > 0 ? 'error' : 'warn',
    summary: 'rules-only managed page contracts satisfy the packaged example/archetype/region structural guard',
    detail:
      invalidContracts.length > 0
        ? invalidContracts.join(' | ')
        : validContracts.length > 0
          ? `${validContracts.length} contract(s) found under ${path.relative(targetRoot, pageContractsResult.contractsDir)}`
          : `No rules-only managed page contracts found yet under ${path.relative(targetRoot, pageContractsResult.contractsDir)}. Start one with \`typical-page:start-page\`, then close delivery with \`typical-page:finalize-page\`.`,
  })
  pushCheck(checks, {
    id: 'rules-only-managed-page-coverage',
    ok: managedPageCoverageIssues.length === 0,
    severity: managedPageCoverageIssues.length > 0 ? 'error' : 'warn',
    summary:
      'rules-only source markers, managed contracts, and current page files stay in one-to-one coverage instead of drifting apart at project level',
    detail:
      managedPageCoverageIssues.length > 0
        ? managedPageCoverageIssues.join(' | ')
        : managedPageRegistryInspection.sourcePaths.length > 0 ||
            managedPageRegistryInspection.contracts.length > 0
          ? `Detected ${managedPageRegistryInspection.sourcePaths.length} source-marked managed page(s) and ${managedPageRegistryInspection.contracts.length} contract target(s); every managed page source is covered by one contract and every contract still points to a live source file.`
          : `No source-marked managed pages or rules-only contracts were found yet under ${path.relative(targetRoot, managedPageRegistryInspection.contractsDir)}. When the first managed page starts, keep source markers, contract registration, and finalize output in sync from the same command flow.`,
  })
  pushCheck(checks, {
    id: 'rules-only-managed-page-registry',
    ok: managedPageRegistryIssues.length === 0,
    severity: managedPageRegistryIssues.length > 0 ? 'error' : 'warn',
    summary:
      'rules-only managed page registry stays synced with contracts so project-level delivery state is machine-readable beyond a single page',
    detail:
      managedPageRegistryIssues.length > 0
        ? managedPageRegistryIssues.join(' | ')
        : managedPageRegistryInspection.contracts.length > 0
          ? `${path.relative(targetRoot, managedPageRegistryInspection.registryJsonPath)} and ${path.relative(targetRoot, managedPageRegistryInspection.registryMarkdownPath)} are synced to ${managedPageRegistryInspection.contracts.length} managed contract(s).`
          : 'No managed page registry is required yet because no rules-only contracts have been written.',
  })
  pushCheck(checks, {
    id: 'rules-only-example-parity-review',
    ok: validContracts.length > 0,
    severity: 'warn',
    summary: 'rules-only generation must be reviewed against the packaged example-parity contract before it is treated as aligned',
    detail:
      validContracts.length > 0
        ? `Verified ${validContracts.length} contract(s). Continue reviewing them against .local-context/hiui-design/docs/generation/rules-only-example-alignment.md before treating the generated pages as aligned.`
        : 'Before large-scale rules-only business page generation, review .local-context/hiui-design/docs/generation/rules-only-example-alignment.md and confirm each generated page can name a single example page, a single host archetype, and a one-to-one region mapping. Rules-only generation should translate the example shell into the host, not re-invent a visually similar page.',
  })
  pushCheck(checks, {
    id: 'rules-only-structural-guard',
    ok: invalidContracts.length === 0,
    severity: invalidContracts.length > 0 ? 'error' : 'warn',
    summary:
      'all rules-only managed page types must keep page-type-specific core regions instead of collapsing them into a generic main/body container',
    detail:
      invalidContracts.length > 0
        ? invalidContracts.join(' | ')
        : contractWarnings.length > 0
          ? contractWarnings.join(' | ')
          : `Required regions are enforced per page type. Examples: table-basic=${getRequiredRegionsForPageType('table-basic').join(', ')}; table-stat=${getRequiredRegionsForPageType('table-stat').join(', ')}; full-page-edit=${getRequiredRegionsForPageType('full-page-edit').join(', ')}.`,
  })
  pushCheck(checks, {
    id: 'rules-only-workspace-ownership',
    ok: invalidContracts.length === 0 && ownershipWarnings.length === 0,
    severity: invalidContracts.length > 0 || ownershipWarnings.length > 0 ? 'error' : 'warn',
    summary:
      'rules-only managed pages keep a single owner for content slot, page surface, outer padding, and main scroll',
    detail: formatRulesOnlyIssuesOrSuccess({
      invalidContracts,
      invalidReason:
        'ownership mapping is mandatory before the single-owner guard can be trusted.',
      issues: ownershipWarnings,
      successDetail: `Ownership mapping is enforced for white-body-based page types: ${getRequiredOwnershipRolesForPageType('table-stat').join(', ')}.`,
    }),
  })

  if (referenceOnlyMode || nonTypicalSourceOwnership.inspectedCount > 0) {
    pushCheck(checks, {
      id: 'non-typical-shell-ownership',
      ok: nonTypicalSourceOwnership.warnings.length === 0,
      severity: nonTypicalSourceOwnership.warnings.length > 0 ? 'error' : 'warn',
      summary:
        'source-marked non-typical pages keep complete owner markers, layout archetype markers, split-pane spacing owners, and header action ownership aligned',
      detail:
        nonTypicalSourceOwnership.warnings.length > 0
          ? nonTypicalSourceOwnership.warnings.join(' | ')
          : nonTypicalSourceOwnership.inspectedCount > 0
            ? `Validated ${nonTypicalSourceOwnership.inspectedCount} non-typical source file(s) with layout markers; no shell-ownership, archetype-marker, split-pane spacing, or header-action drift was detected.`
            : 'No source-marked non-typical pages were found under src/. Add the non-typical source contract markers before treating ad-hoc layouts as validated.',
    })
  }

  pushCheck(checks, {
    id: 'rules-only-component-semantic-guard',
    ok: invalidContracts.length === 0 && semanticWarnings.length === 0,
    severity: invalidContracts.length > 0 || semanticWarnings.length > 0 ? 'error' : 'warn',
    summary:
      'rules-only full-page pages keep header, white-body, detail/form body, media, and footer semantics aligned with the packaged archetype',
    detail: formatRulesOnlyIssuesOrSuccess({
      invalidContracts,
      invalidReason:
        'semantic drift review depends on the page type and archetype mapping being complete.',
      issues: semanticWarnings,
      successDetail: 'No full-page semantic drift was detected in the generated rules-only pages.',
    }),
  })
  pushCheck(checks, {
    id: 'rules-only-managed-source-guard',
    ok: invalidContracts.length === 0 && sourceGuardFailures.length === 0,
    severity: invalidContracts.length > 0 || sourceGuardFailures.length > 0 ? 'error' : 'warn',
    summary:
      'rules-only managed pages keep the exact source contract, chart governance, and example-level shell semantics enforced by source-gate',
    detail: formatRulesOnlyIssuesOrSuccess({
      invalidContracts,
      invalidReason:
        'source-level example alignment depends on complete page type / archetype / region mapping.',
      issues: sourceGuardFailures,
      successDetail:
        'All managed rules-only pages pass the same source-level contract guard that typical-page:source-gate enforces in CI, including global chart-stack rules for any inserted chart.',
    }),
  })
  const managedChartContractCount = validContracts.filter((entry) =>
    contractDeclaresManagedChartGovernance(entry)
  ).length
  pushCheck(checks, {
    id: 'rules-only-managed-chart-governance',
    ok: invalidContracts.length === 0 && managedChartGovernanceFailures.length === 0,
    severity:
      invalidContracts.length > 0 || managedChartGovernanceFailures.length > 0 ? 'error' : 'warn',
    summary:
      'rules-only managed pages keep global HiUI chart governance: any inserted chart stays on the approved chart stack, and only independent analysis blocks declare chart-section',
    detail: formatRulesOnlyIssuesOrSuccess({
      invalidContracts,
      invalidReason:
        'managed chart governance depends on a complete page-type / region contract and the same source-level guard used in CI.',
      issues: managedChartGovernanceFailures,
      successDetail:
        managedChartContractCount > 0
          ? `Validated ${managedChartContractCount} managed page contract(s) that already declare chart-section or use the data-visualization page type; no chart-stack or chart-section drift was detected.`
          : 'No current managed page contract declares chart-section or uses the data-visualization page type yet. When charts are added later, any inserted chart still has to follow the HiUI chart stack, and only independent analysis blocks should be promoted into chart-section.',
    }),
  })
  pushCheck(checks, {
    id: 'external-component-token-bridge',
    ok: invalidContracts.length === 0 && externalComponentBypassFailures.length === 0,
    severity:
      invalidContracts.length > 0 || externalComponentBypassFailures.length > 0 ? 'error' : 'warn',
    summary:
      'rules-only pages keep third-party UI packages behind declared local bypass adapters and HiUI token bridges instead of leaking library defaults into the page shell',
    detail: formatRulesOnlyIssuesOrSuccess({
      invalidContracts,
      invalidReason:
        'external-component bypass review depends on a valid adapterContract and machine-checkable localBypasses metadata.',
      issues: externalComponentBypassFailures,
      successDetail:
        'No external-component bypass drift was detected. Any approved third-party UI capability stays behind a declared adapter path, token bridge path, and local containment boundary.',
    }),
  })
  pushCheck(checks, {
    id: 'rules-only-fixed-dashboard-shell-reuse',
    ok:
      invalidContracts.length === 0 &&
      dataVisualizationSharedShellInspection.warnings.length === 0,
    severity:
      invalidContracts.length > 0 || dataVisualizationSharedShellInspection.warnings.length > 0
        ? 'error'
        : 'warn',
    summary:
      'rules-only data-visualization pages keep the fixed dashboard shell on shared helpers instead of rebuilding header, white-body, and table/chart shells locally',
    detail: formatRulesOnlyIssuesOrSuccess({
      invalidContracts,
      invalidReason:
        'Shared dashboard shell reuse depends on a complete page-type / region / ownership contract.',
      issues: dataVisualizationSharedShellInspection.warnings,
      successDetail:
        dataVisualizationSharedShellInspection.inspectedCount > 0
          ? `Validated ${dataVisualizationSharedShellInspection.inspectedCount} managed data-visualization page(s); the dashboard shell stays on FixedDashboardPageFrame or the shared dashboard primitives instead of page-local wrappers.`
          : 'No managed data-visualization page contract was found yet. Once one exists, keep the fixed dashboard shell in shared helpers and let the page file fill only business regions.',
    }),
  })
  pushCheck(checks, {
    id: 'rules-only-runtime-smoke-closure',
    ok: invalidContracts.length === 0 && runtimeSmokeWarnings.length === 0,
    severity: invalidContracts.length > 0 || runtimeSmokeWarnings.length > 0 ? 'warn' : 'warn',
    summary:
      'rules-only pages that depend on browser-level scroll continuity keep a current runtime-smoke pass bound to the same source snapshot',
    detail: formatRulesOnlyIssuesOrSuccess({
      invalidContracts,
      invalidReason:
        'runtime-smoke enforcement depends on complete page-type and scroll-strategy facts.',
      issues: runtimeSmokeWarnings,
      successDetail:
        'No managed page currently requires runtime smoke, or every required page already has a passing runtime-smoke result on the current source snapshot.',
    }),
  })
  pushCheck(checks, {
    id: 'runtime-smoke-playwright-installed',
    ok:
      invalidContracts.length === 0 &&
      (runtimeSmokeRequiredContracts.length === 0 || hasPlaywrightForRuntimeSmoke),
    severity:
      invalidContracts.length > 0 ||
      (runtimeSmokeRequiredContracts.length > 0 && !hasPlaywrightForRuntimeSmoke)
        ? 'warn'
        : 'warn',
    summary:
      'managed pages that require browser-level runtime smoke also keep playwright installed in the workspace',
    detail:
      formatRulesOnlyContractRepairDetail(
        invalidContracts,
        'playwright availability is only meaningful once the managed-page contracts can tell whether runtime smoke is required.'
      ) ||
      (runtimeSmokeRequiredContracts.length === 0
        ? 'No current managed page contract requires runtime smoke, so a local playwright install is not required yet.'
        : hasPlaywrightForRuntimeSmoke
          ? playwrightPackagePath
          : `Runtime smoke is required by: ${runtimeSmokeRequiredContracts.join(', ')}. Install playwright in this workspace before running typical-page:runtime-smoke or finalize-page on those source snapshots.`),
  })
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const targetRoot = path.resolve(options.target)
    const hostOutputRoot = path.join(targetRoot, options.dest)
    const hostProfile = await loadHostProfileFact({
      targetRoot,
      options: {
        ignoreRelativePaths: [options.dest],
      },
    })
    const isTypicalPageSourceRepo = await detectTypicalPageSourceRepo(targetRoot)
    const { manifest, manifestPath, lineId } = await loadManifest(skillRoot, options.line)
    const baselineSpecPath = path.join(
      skillRoot,
      'docs',
      'validation',
      'archetype-smoke-baselines.json'
    )
    const baselineSpec = await readJsonIfExists(baselineSpecPath)
    const requiredArchetypeBaselineIds = getRequiredArchetypeBaselineIds(baselineSpec)
    const baselineSpecEntries = mapArchetypeSmokeBaselineSpecEntries(baselineSpec)
    const shellPackage = await loadShellPackageSnapshot(skillRoot)
    const runtimeDeliveryPolicy = await loadRuntimeDeliveryPolicy(skillRoot)
    const runtimeShellDelivery = await resolveShellRuntimeDelivery(
      skillRoot,
      shellPackage,
      runtimeDeliveryPolicy
    )
    const embeddedShellsSpec =
      runtimeShellDelivery.expectedShellSpecs.find((spec) => spec.startsWith('file:')) || ''
    const embeddedShellTarballPath = runtimeShellDelivery.vendoredTarballPath
    const hostIntegrationDependencies = await loadHostIntegrationDependencySnapshot(skillRoot)
    const checks = []

    if (!(await pathExists(targetRoot))) {
      throw new Error(`Target project root does not exist: ${targetRoot}`)
    }

    const packageJsonPath = path.join(targetRoot, 'package.json')
    const pkg = await readJsonIfExists(packageJsonPath)
    pushCheck(checks, {
      id: 'package-json',
      ok: Boolean(pkg),
      severity: 'error',
      summary: 'package.json exists',
      detail: pkg ? packageJsonPath : `Missing ${packageJsonPath}`,
    })
    const nodeRuntimeRequirement = getProjectNodeRuntimeRequirement({
      pkg,
      hostProfile,
    })
    const legacyHostRuntime = pkg ? await detectLegacyHostRuntimeMode(targetRoot, pkg) : null
    const legacyHiUiEsImports = await collectLegacyHiUiEsImports(path.join(targetRoot, 'src'))
    const installedRootRuntime = pkg
      ? await inspectInstalledRootRuntime({ targetRoot, pkg })
      : { installedPackages: {}, driftItems: [] }
    const legacyRuntimeGuardIssues = buildLegacyRuntimeGuardIssues({
      legacyHostRuntime,
      installedRootRuntime,
      legacyHiUiEsImports,
    })
    const recommendedMode = getRecommendedMode({
      hostProfile,
      legacyHostRuntime,
    })
    const requestedMode = await detectDoctorMode({
      requestedMode: options.mode,
      targetRoot,
      outputRoot: hostOutputRoot,
      recommendedMode,
      isTypicalPageSourceRepo,
    })
    const mode = resolveDoctorMode({
      requestedMode,
      legacyHostRuntime,
    })
    const allowLinkedShellSpec = isTypicalPageSourceRepo
    const legacyCompatibilityMode = mode === 'legacy-host-compatible'
    const referenceOnlyMode = isReferenceOnlyMode(mode)
    const outputRoot =
      referenceOnlyMode ? path.join(skillRoot, 'outputs') : hostOutputRoot
    const pageContractsResult = await loadRulesOnlyPageContracts(targetRoot)
    const managedPageRegistryInspection = inspectManagedPageRegistry(targetRoot)
    const hasRulesOnlyManagedArtifacts =
      pageContractsResult.contracts.length > 0 ||
      managedPageRegistryInspection.contracts.length > 0 ||
      managedPageRegistryInspection.sourcePaths.length > 0 ||
      managedPageRegistryInspection.brokenContracts.length > 0 ||
      managedPageRegistryInspection.duplicateContractTargets.length > 0 ||
      managedPageRegistryInspection.contractsWithoutSourceFiles.length > 0 ||
      managedPageRegistryInspection.sourceWithoutContracts.length > 0 ||
      managedPageRegistryInspection.contractsWithoutSourceMarkers.length > 0
    const businessUiScanRoots = getBusinessUiScanRoots({ targetRoot, hostOutputRoot })
    const archetypeSmokeBaselines = getArchetypeSmokeBaselineCases(manifest)
    const businessGradientViolations = await collectBusinessGradientViolations(businessUiScanRoots)
    const layoutStretchRiskViolations = await collectLayoutStretchRiskViolations(businessUiScanRoots)
    const metricSurfaceTokenViolations = [
      ...(await collectMetricSurfaceTokenViolations(businessUiScanRoots)),
      ...(await collectInlineMetricSurfaceTokenViolations(businessUiScanRoots)),
    ]
    const metricGridOverflowRiskViolations =
      await collectMetricGridOverflowRiskViolations(businessUiScanRoots)
    const chartPlotEdgeViolations = await collectChartPlotEdgeViolations(businessUiScanRoots)
    const whiteBodyEdgeTouchViolations = await collectWhiteBodyEdgeTouchViolations(
      businessUiScanRoots
    )
    const verticalDetailLabelWidthViolations =
      await collectVerticalDetailLabelWidthViolations(businessUiScanRoots)
    const proDetailProviderViolations = await collectProDetailProviderViolations(
      businessUiScanRoots
    )
    const proEditProviderViolations = await collectProEditProviderViolations(businessUiScanRoots)
    const sharedBarLikeHelperBypassViolations = await collectSharedBarLikeHelperBypassViolations(
      businessUiScanRoots
    )
    const nonTypicalSourceOwnership = await inspectSourceMarkedNonTypicalPages(targetRoot)
    const topLevelAppFileForMenuIcons = await detectTopLevelAppFile(targetRoot)
    const topLevelAppRawForMenuIcons = await readTextIfExists(topLevelAppFileForMenuIcons)
    const mountsTopLevelAppFrameForMenuIcons =
      detectTopLevelTypicalPageAppFrameMount(topLevelAppRawForMenuIcons)
    const topLevelMenuIconSemanticIssues = mountsTopLevelAppFrameForMenuIcons
      ? collectTopLevelMenuIconSemanticIssues(topLevelAppRawForMenuIcons)
      : []
    const syncedRouteConfigPath = path.join(hostOutputRoot, 'routes', 'config.tsx')
    const syncedRouteConfigRaw = await readTextIfExists(syncedRouteConfigPath)
    const exampleGalleryBusinessRouteViolations =
      collectExampleGalleryBusinessRouteViolations({
        outputRoot: hostOutputRoot,
        routeConfigPath: syncedRouteConfigPath,
        routeConfigRaw: syncedRouteConfigRaw,
        targetRoot,
      })

    const depSpec = pkg ? findDependency(pkg, '@hiui-design/typical-page-shells') : ''
    const managedDependencyDrifts =
      pkg && shellPackage
        ? collectManagedDependencyVersionDrift({
            pkg,
            shellPackage,
            allowedShellSpecs: runtimeShellDelivery.expectedShellSpecs,
            allowLinkedShellSpec,
            shellExpectedDetail: runtimeShellDelivery.expectedShellSpecDetail,
            hostIntegrationDependencies,
            mode,
          })
        : []
    pushCheck(checks, {
      id: 'host-profile',
      ok: true,
      severity: 'warn',
      summary: 'target project host profile is detected before choosing an integration strategy',
      detail: `${hostProfile.projectType} / ${hostProfile.framework} / ${hostProfile.runtime} / ${hostProfile.routing}`,
    })
    if (nodeRuntimeRequirement.required || nodeRuntimeRequirement.advisory) {
      pushCheck(checks, {
        id: 'node-runtime',
        ok: !nodeRuntimeRequirement.required || nodeRuntimeRequirement.ok,
        severity: nodeRuntimeRequirement.required ? 'error' : 'warn',
        summary: 'current Node runtime satisfies the detected target-project build-tool baseline',
        detail: formatNodeRuntimeRequirementDetail(nodeRuntimeRequirement),
      })
    }
    pushCheck(checks, {
      id: 'recommended-install-strategy',
      ok:
        mode === recommendedMode ||
        (isTypicalPageSourceRepo && mode === 'host-integration'),
      severity: 'warn',
      summary: 'the chosen install mode matches the detected target project type',
      detail:
        mode === recommendedMode
          ? `${mode} matches the detected target project profile. ${hostProfile.reason}`
          : isTypicalPageSourceRepo && mode === 'host-integration'
            ? `This repository is the source repo for typical-page shells and intentionally keeps the host-integration gallery for smoke verification. External target projects with the same detected profile should still prefer ${recommendedMode}. ${hostProfile.reason}`
            : `Detected profile recommends ${recommendedMode}, but current doctor mode is ${mode}. ${hostProfile.reason}`,
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
    pushCheck(checks, {
      id: 'no-business-gradients',
      ok: businessGradientViolations.length === 0,
      severity: 'error',
      summary:
        'business pages do not use gradient backgrounds, borders, or highlight fills outside explicitly allowed illustration assets',
      detail:
        businessGradientViolations.length === 0
          ? 'No disallowed gradient usage found in business page source.'
          : summarizeBusinessGradientViolations(targetRoot, businessGradientViolations),
    })
    pushCheck(checks, {
      id: 'no-business-pages-in-example-gallery',
      ok: exampleGalleryBusinessRouteViolations.length === 0,
      severity: 'error',
      summary:
        'synced typical-page gallery routes stay demo-only and do not import real business pages',
      detail:
        exampleGalleryBusinessRouteViolations.length === 0
          ? syncedRouteConfigRaw
            ? `${path.relative(targetRoot, syncedRouteConfigPath)} only imports pages inside ${path.relative(
                targetRoot,
                hostOutputRoot
              )}; register generated business pages in the host route tree instead.`
            : `No synced gallery route config found at ${path.relative(
                targetRoot,
                syncedRouteConfigPath
              )}; reference-only hosts should register generated pages only in their real route tree.`
          : `${exampleGalleryBusinessRouteViolations.join(
              '; '
            )}. The synced gallery is smoke/reference infrastructure, not the business menu registry. Move generated pages into the host route tree, and keep src/typical-page-reuse/routes/config.tsx limited to pages under src/typical-page-reuse/.`,
    })
    pushCheck(checks, {
      id: 'top-level-menu-icon-semantics',
      ok: !mountsTopLevelAppFrameForMenuIcons || topLevelMenuIconSemanticIssues.length === 0,
      severity: mountsTopLevelAppFrameForMenuIcons ? 'error' : 'manual',
      summary:
        'top-level menu icons are semantic, distinct, and not reused as generic placeholders',
      detail:
        !mountsTopLevelAppFrameForMenuIcons
          ? topLevelAppFileForMenuIcons
            ? `${topLevelAppFileForMenuIcons} does not mount TypicalPageAppFrame, so semantic menu icons must be verified in the project-specific host shell.`
            : 'No top-level App file was detected, so semantic menu icons cannot be verified.'
          : topLevelMenuIconSemanticIssues.length === 0
            ? `${topLevelAppFileForMenuIcons} uses distinct semantic Filled icons for first-level route groups.`
            : `${topLevelMenuIconSemanticIssues.join('; ')}. Pick @hi-ui/icons Filled variants that match each first-level domain, for example BusinessCardFilled for 业务, FolderOpenFilled for 项目, and AppStoreFilled for 示例.`,
    })
    pushCheck(checks, {
      id: 'no-layout-stretch-anti-patterns',
      ok: layoutStretchRiskViolations.length === 0,
      severity: 'error',
      summary:
        'business page styles avoid high-risk grid stretch patterns that commonly create large blank card gaps',
      detail:
        layoutStretchRiskViolations.length === 0
          ? 'No high-risk multi-column grid or fill-row layout patterns found in page styles.'
          : summarizeLayoutStretchRiskViolations(targetRoot, layoutStretchRiskViolations),
    })
    pushCheck(checks, {
      id: 'metric-primary-value-surface-tokens',
      ok: metricSurfaceTokenViolations.length === 0,
      severity: 'error',
      summary:
        'business page metric primary values only use the approved overview or embedded tokens, and the chosen token matches the metric surface',
      detail:
        metricSurfaceTokenViolations.length === 0
          ? 'No metric primary value token mismatch found in managed business page styles.'
          : summarizeMetricSurfaceTokenViolations(targetRoot, metricSurfaceTokenViolations),
    })
    pushCheck(checks, {
      id: 'no-fixed-equal-kpi-grid-in-secondary',
      ok: metricGridOverflowRiskViolations.length === 0,
      severity: 'error',
      summary:
        'business pages do not keep embedded KPI groups on overview-sized tokens and fixed equal three-column grids at the same time',
      detail:
        metricGridOverflowRiskViolations.length === 0
          ? 'No embedded KPI surface was found combining overview-sized metric values with a fixed equal three-column split.'
          : summarizeMetricGridOverflowRiskViolations(
              targetRoot,
              metricGridOverflowRiskViolations
            ),
    })
    pushCheck(checks, {
      id: 'no-chart-plot-edge-collisions',
      ok: chartPlotEdgeViolations.length === 0,
      severity: 'error',
      summary:
        'business pages with bar or column charts keep plot content away from the card inner edges through chart-level safe-area config',
      detail:
        chartPlotEdgeViolations.length === 0
          ? 'No bar/column chart plot-edge collisions detected in managed business page source.'
          : summarizeChartPlotEdgeViolations(targetRoot, chartPlotEdgeViolations),
    })
    pushCheck(checks, {
      id: 'no-white-body-edge-touch',
      ok: whiteBodyEdgeTouchViolations.length === 0,
      severity: 'error',
      summary:
        'custom ProDetailPage workspaces keep the first visible content away from the white-body top and side edges',
      detail:
        whiteBodyEdgeTouchViolations.length === 0
          ? 'No ProDetailPage custom sections were found touching the white-body edges without an explicit inset owner.'
          : summarizeWhiteBodyEdgeTouchViolations(targetRoot, whiteBodyEdgeTouchViolations),
    })
    pushCheck(checks, {
      id: 'detail-vertical-descriptions-auto-label-width',
      ok: verticalDetailLabelWidthViolations.length === 0,
      severity: 'error',
      summary:
        'detail-shell pages freeze vertical Descriptions label invariants in source instead of relying on hidden defaults',
      detail:
        verticalDetailLabelWidthViolations.length === 0
          ? "All detected ProDetailPage/ProDetailDrawer detail pages explicitly freeze left label placement and avoid hidden fixed-width detail defaults."
          : summarizeVerticalDetailLabelWidthViolations(
              targetRoot,
              verticalDetailLabelWidthViolations
            ),
    })
    pushCheck(checks, {
      id: 'pro-detail-provider-chain',
      ok: proDetailProviderViolations.length === 0,
      severity: 'error',
      summary:
        'business pages using ProDetailPage also keep the required ProDetailPageProvider or equivalent detail context chain',
      detail:
        proDetailProviderViolations.length === 0
          ? 'All ProDetailPage business pages keep an explicit provider/context chain in source.'
          : summarizeProDetailProviderViolations(targetRoot, proDetailProviderViolations),
    })
    pushCheck(checks, {
      id: 'pro-edit-provider-chain',
      ok: proEditProviderViolations.length === 0,
      severity: 'error',
      summary:
        'business pages using ProEditPage with Form/edit actions also keep the required ProEditPageProvider or equivalent edit context chain',
      detail:
        proEditProviderViolations.length === 0
          ? 'All ProEditPage business pages keep an explicit provider/context chain in source.'
          : summarizeProEditProviderViolations(targetRoot, proEditProviderViolations),
    })
    pushCheck(checks, {
      id: 'reuse-shared-bar-like-helper',
      ok: sharedBarLikeHelperBypassViolations.length === 0,
      severity: 'error',
      summary:
        'once the project provides shared interval-chart helpers, business pages must reuse them instead of scattering local plot-padding fixes',
      detail:
        sharedBarLikeHelperBypassViolations.length === 0
          ? 'All managed business pages with bar/column charts reuse the shared interval-chart helper baseline.'
          : summarizeSharedBarLikeHelperBypassViolations(
              targetRoot,
              sharedBarLikeHelperBypassViolations
            ),
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
      id: 'managed-dependency-versions',
      ok: managedDependencyDrifts.length === 0 || legacyCompatibilityMode,
      severity: legacyCompatibilityMode ? 'warn' : 'error',
      summary:
        'typical-page managed dependencies match the verified snapshot instead of floating on loose experimental ranges',
      detail: legacyCompatibilityMode
        ? `Legacy host bridge mode (legacy-host-compatible) is active. The standard typical-page dependency snapshot is intentionally not required in this host main tree. Detected legacy runtime reasons: ${legacyHostRuntime.reasons.join(
            '; '
          )}`
        : managedDependencyDrifts.length === 0
          ? 'package.json managed deps match the current snapshot'
          : managedDependencyDrifts
              .slice(0, 10)
              .map((item) => `${item.depName}: ${item.actual} -> ${item.expected}`)
              .join('; '),
    })
    pushCheck(checks, {
      id: 'legacy-hiui-es-imports',
      ok: legacyHiUiEsImports.length === 0 || legacyCompatibilityMode,
      severity: legacyCompatibilityMode ? 'warn' : 'manual',
      summary:
        'legacy @hi-ui/hiui/es root imports are inventoried before compatibility generation continues',
      detail:
        legacyHiUiEsImports.length === 0
          ? 'No current source file imports @hi-ui/hiui/es*'
          : legacyCompatibilityMode
            ? `Legacy host compatibility mode stays active because the repository still contains ${legacyHiUiEsImports.length} @hi-ui/hiui/es* consumers. Any root-package upgrade must preserve that ABI or be isolated away from the host runtime. Examples: ${summarizeLegacyImportHits(targetRoot, legacyHiUiEsImports)}`
            : `Source still imports @hi-ui/hiui/es* even though this project was not classified as a legacy host. Examples: ${summarizeLegacyImportHits(targetRoot, legacyHiUiEsImports)}`,
    })
    pushCheck(checks, {
      id: 'public-shell-registry-release',
      ok: !runtimeShellDelivery.publicRegistryCheck.required || runtimeShellDelivery.publicRegistryCheck.ok,
      severity: runtimeShellDelivery.publicRegistryCheck.required ? 'error' : 'warn',
      summary:
        'runtime delivery source remains valid for the active @hiui-design/typical-page-shells install contract',
      detail: runtimeShellDelivery.publicRegistryCheck.detail,
    })
    pushCheck(checks, {
      id: 'installed-root-runtime-drift',
      ok: legacyRuntimeGuardIssues.length === 0,
      severity: 'error',
      summary:
        'installed root runtime still matches the compatibility contract for legacy host projects',
      detail:
        legacyRuntimeGuardIssues.length === 0
          ? 'No installed root-runtime drift or legacy ABI break was detected in node_modules.'
          : legacyRuntimeGuardIssues.map((item) => item.detail).join(' ; '),
    })

    const installedPackagePath = path.join(
      targetRoot,
      'node_modules',
      '@hiui-design',
      'typical-page-shells',
      'package.json'
    )
    const installedQueryFilterBridgePath = path.join(
      targetRoot,
      'node_modules',
      '@hiui-design',
      'typical-page-shells',
      'dist',
      'pro-list-page',
      'bridge',
      'query-filter.js'
    )
    const targetEmbeddedShellTarballPath = shellPackage
      ? isTypicalPageSourceRepo
        ? embeddedShellTarballPath
        : path.join(
            targetRoot,
            '.local-context',
            'hiui-design',
            'vendor',
            `hiui-design-typical-page-shells-${shellPackage.version}.tgz`
          )
      : ''
    const targetSourceRoot = path.join(targetRoot, 'src')
    const targetSourceSignals = await collectTypicalPageSourceSignals(targetSourceRoot)
    const compatibilityGenerationOnly =
      legacyCompatibilityMode && targetSourceSignals.usesShells.length === 0
    const directStandardShellRuntimeSelected =
      legacyCompatibilityMode && targetSourceSignals.usesShells.length > 0
    pushCheck(checks, {
      id: 'shells-declared',
      ok:
        compatibilityGenerationOnly ||
        isAcceptableShellSpec(depSpec, runtimeShellDelivery.expectedShellSpecs, {
          allowLinkedShellSpec,
        }),
      severity:
        compatibilityGenerationOnly
          ? 'warn'
          : mode === 'host-integration' || directStandardShellRuntimeSelected
            ? 'error'
            : 'warn',
      summary: '@hiui-design/typical-page-shells declaration matches the active runtime delivery mode',
      detail: legacyCompatibilityMode
        ? compatibilityGenerationOnly
          ? depSpec
            ? `Legacy host bridge mode (legacy-host-compatible) is active. @hiui-design/typical-page-shells is declared as ${depSpec}. In the default page-component + runtime bridge + slot fill path this declaration is not required-in-current-mode; it only becomes a hard requirement if current source actually selects the direct standard shell runtime.`
            : 'Legacy host bridge mode (legacy-host-compatible) is active. Ordinary typical pages may still use planner-selected page components through page-component + runtime bridge + slot fill, so package.json is not required to declare @hiui-design/typical-page-shells until the project explicitly selects the direct standard shell runtime.'
          : depSpec
            ? `Legacy host bridge mode (legacy-host-compatible) is active, and current source already imports direct standard shell runtime paths. package.json declares @hiui-design/typical-page-shells as ${depSpec}; keep that declaration aligned with the stricter runtime and source-usage checks below.`
            : 'Legacy host bridge mode (legacy-host-compatible) is active, but current source already imports direct standard shell runtime paths. package.json must now declare @hiui-design/typical-page-shells unless you remove the direct shell imports and return to page-component + runtime bridge + slot fill.'
        : depSpec
        ? `Declared version/range: ${depSpec}. ${runtimeShellDelivery.expectedShellSpecDetail}`
        : mode === 'host-integration'
          ? `Dependency is not declared in package.json. ${runtimeShellDelivery.expectedShellSpecDetail}`
          : `Reference-only mode allows this before the first page is generated, but the dependency should be declared before using @hiui-design/typical-page-shells in project code. ${runtimeShellDelivery.expectedShellSpecDetail}`,
    })
    pushCheck(checks, {
      id: 'shells-installed',
      ok:
        compatibilityGenerationOnly ||
        (!legacyCompatibilityMode && (await pathExists(installedPackagePath))) ||
        (directStandardShellRuntimeSelected && (await pathExists(installedPackagePath))),
      severity: directStandardShellRuntimeSelected ? 'error' : 'warn',
      summary: '@hiui-design/typical-page-shells installation state matches the active runtime delivery mode',
      detail: legacyCompatibilityMode
        ? compatibilityGenerationOnly
          ? 'Legacy host bridge mode (legacy-host-compatible) is active. Installation is not required-in-current-mode because ordinary typical pages may still use page-component + runtime bridge + slot fill without mounting the direct standard shell runtime.'
          : (await pathExists(installedPackagePath))
          ? `${installedPackagePath}. Current source has selected the direct standard shell runtime, so an installed package copy is now required.`
          : 'Legacy host bridge mode (legacy-host-compatible) is active, but current source already imports package shells. Installation is now required-if-direct-standard-shell-runtime-selected; either install @hiui-design/typical-page-shells or remove the direct shell imports and return to page-component + runtime bridge + slot fill.'
        : (await pathExists(installedPackagePath))
        ? installedPackagePath
        : 'node_modules copy was not found; run your package manager install if this project has not installed dependencies yet',
    })

    if (targetEmbeddedShellTarballPath && runtimeShellDelivery.vendoredTarballRequired) {
      const vendoredShellTarball = await inspectQueryFilterBridgeTarball(targetEmbeddedShellTarballPath)
      pushCheck(checks, {
        id: 'vendored-shells-query-filter-defaults',
        ok:
          compatibilityGenerationOnly ||
          (vendoredShellTarball.exists && vendoredShellTarball.reasons.length === 0),
        severity: compatibilityGenerationOnly ? 'warn' : 'error',
        summary:
          'vendored typical-page-shells tarball keeps the HiUI5 QueryFilter contained/no-label defaults',
        detail:
          compatibilityGenerationOnly
            ? 'Legacy host bridge mode (legacy-host-compatible) does not require carrying the vendored typical-page-shells tarball unless this project later isolates and mounts the standard shell runtime.'
            : !vendoredShellTarball.exists
            ? `Expected vendored tarball was not found at ${targetEmbeddedShellTarballPath}`
            : vendoredShellTarball.reasons.length === 0
              ? path.relative(targetRoot, vendoredShellTarball.filePath)
              : `${path.relative(targetRoot, vendoredShellTarball.filePath)} -> ${vendoredShellTarball.reasons.join('; ')}`,
      })
    }

    const installedShellBridge = await inspectQueryFilterBridgeFile(installedQueryFilterBridgePath)
    pushCheck(checks, {
      id: 'installed-shells-query-filter-defaults',
      ok: !installedShellBridge.exists || installedShellBridge.reasons.length === 0,
      severity: 'error',
      summary:
        'installed typical-page-shells runtime keeps the HiUI5 QueryFilter contained/no-label defaults',
      detail:
        !installedShellBridge.exists
          ? 'Installed QueryFilter bridge was not found; run dependency install after syncing package.json or the vendored tgz'
          : installedShellBridge.reasons.length === 0
            ? path.relative(targetRoot, installedShellBridge.filePath)
            : `${path.relative(targetRoot, installedShellBridge.filePath)} -> ${installedShellBridge.reasons.join('; ')}. Re-run designer setup or package-manager install after updating .local-context.`,
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
    const hasStyleImport =
      entryRaw.includes(`import '@hiui-design/typical-page-shells/styles.css'`) ||
      entryRaw.includes('import "@hiui-design/typical-page-shells/styles.css"')
    pushCheck(checks, {
      id: 'standard-typical-page-runtime',
      ok: !legacyCompatibilityMode || compatibilityGenerationOnly,
      severity: compatibilityGenerationOnly ? 'warn' : 'error',
      summary:
        'target project runtime delivery mode does not conflict with direct standard shell selection',
      detail:
        !legacyCompatibilityMode
          ? 'No legacy host-compatible runtime downgrade was detected'
          : compatibilityGenerationOnly
            ? `Detected a legacy host-compatible runtime: ${legacyHostRuntime.reasons.join(
                '; '
              )}. Current state: not-required-in-current-mode. This host should stay on the legacy bridge path: ordinary typical pages may still use planner-selected page components through page-component + runtime bridge + slot fill, but the legacy host main tree must not be treated as a generic direct mount for the standard @hiui-design/typical-page-shells runtime. Continue with the compatibility generation path: read .local-context/hiui-design/rules/generation-rules.md, then .local-context/hiui-design/docs/generation/legacy-host-compatibility.md, and follow the selected carrier/runtimeAdapterProof result when generating business pages.`
            : `Detected a legacy host-compatible runtime: ${legacyHostRuntime.reasons.join(
                '; '
              )}. Current state: required-if-direct-standard-shell-runtime-selected. This project already imports standard typical-page shell components, so it cannot stay on the downgraded host runtime. Either isolate a dedicated modern runtime entry/remote, or remove the standard shell imports and regenerate via legacy host bridge mode (legacy-host-compatible).`,
    })
    pushCheck(checks, {
      id: 'styles-import',
      ok: compatibilityGenerationOnly || hasStyleImport,
      severity:
        compatibilityGenerationOnly
          ? 'warn'
          : mode === 'host-integration' || directStandardShellRuntimeSelected
            ? 'error'
            : 'warn',
      summary: 'typical-page shell style import matches the active runtime delivery mode',
      detail: compatibilityGenerationOnly
        ? 'Legacy host bridge mode (legacy-host-compatible) is active. styles.css is not required-in-current-mode for page-component + runtime bridge + slot fill; it becomes mandatory only if the project later isolates and mounts the direct standard shell runtime.'
        : hasStyleImport
        ? legacyCompatibilityMode && directStandardShellRuntimeSelected
          ? `${entryFile}. Current source already imports package shells, so styles.css is required-if-direct-standard-shell-runtime-selected.`
          : entryFile
        : mode === 'host-integration'
          ? 'Missing `import \'@hiui-design/typical-page-shells/styles.css\'` in the detected app entry'
          : legacyCompatibilityMode && directStandardShellRuntimeSelected
            ? 'Legacy host bridge mode (legacy-host-compatible) is active, but current source already imports package shells. Add `import \'@hiui-design/typical-page-shells/styles.css\'` in the app entry, or remove the direct shell imports and return to page-component + runtime bridge + slot fill.'
          : 'Reference-only mode does not force this yet, but once generated pages import `@hiui-design/typical-page-shells` you should add `import \'@hiui-design/typical-page-shells/styles.css\'` in the app entry',
    })

    pushCheck(checks, {
      id: 'no-private-shell-import-paths',
      ok: targetSourceSignals.privateImportViolations.length === 0,
      severity: 'error',
      summary: 'project source does not import typical-page shells through node_modules, .pnpm, or dist private paths',
      detail:
        targetSourceSignals.privateImportViolations.length === 0
          ? `${targetSourceRoot} uses only package import paths`
          : `Use package imports such as @hiui-design/typical-page-shells or its public subpaths instead of private install paths or workspace source paths. Examples: ${summarizePrivateImportViolations(targetRoot, targetSourceSignals.privateImportViolations)}`,
    })

    pushCheck(checks, {
      id: 'no-stale-query-filter-bridge',
      ok: targetSourceSignals.staleQueryFilterBridgeViolations.length === 0,
      severity: 'error',
      summary: 'project source does not keep an outdated QueryFilter bridge that overrides HiUI5 defaults',
      detail:
        targetSourceSignals.staleQueryFilterBridgeViolations.length === 0
          ? 'No copied bridge was found that forces QueryFilter field appearance or reintroduces the legacy defaults helper'
          : `Sync these files back to the public package bridge before continuing: ${summarizeQueryFilterBridgeViolations(targetRoot, targetSourceSignals.staleQueryFilterBridgeViolations)}`,
    })

    pushCheck(checks, {
      id: 'inline-query-filter-show-label-default',
      ok: targetSourceSignals.queryFilterShowLabelViolations.length === 0,
      severity: 'error',
      summary: 'public package QueryFilter is not forced back to showLabel={true} in list-page usage',
      detail:
        targetSourceSignals.queryFilterShowLabelViolations.length === 0
          ? 'No list-page source forces public QueryFilter back to the old external-label layout'
          : `Remove explicit showLabel={true} from: ${summarizePathList(targetRoot, targetSourceSignals.queryFilterShowLabelViolations)}`,
    })

    pushCheck(checks, {
      id: 'shells-declared-when-used',
      ok: targetSourceSignals.usesShells.length === 0 || Boolean(depSpec),
      severity: 'error',
      summary: 'once project source uses typical-page shells, package.json also declares @hiui-design/typical-page-shells',
      detail:
        targetSourceSignals.usesShells.length === 0 || Boolean(depSpec)
          ? targetSourceSignals.usesShells.length === 0
            ? 'No current source file imports typical-page shell components yet'
            : `Shell package declared and used by: ${summarizePathList(targetRoot, targetSourceSignals.usesShells)}`
          : `Source files already import typical-page shell components but package.json does not declare @hiui-design/typical-page-shells. Examples: ${summarizePathList(targetRoot, targetSourceSignals.usesShells)}`,
    })

    pushCheck(checks, {
      id: 'styles-import-when-shells-used',
      ok: targetSourceSignals.usesShells.length === 0 || hasStyleImport,
      severity: 'error',
      summary: 'once project source uses typical-page shells, styles.css is already imported in the app entry',
      detail:
        targetSourceSignals.usesShells.length === 0 || hasStyleImport
          ? targetSourceSignals.usesShells.length === 0
            ? 'No current source file imports typical-page shell components yet'
            : entryFile
          : `Source files already use typical-page shell components, so add \`import '@hiui-design/typical-page-shells/styles.css'\` in the app entry before continuing. Examples: ${summarizePathList(targetRoot, targetSourceSignals.usesShells)}`,
    })

    pushCheck(checks, {
      id: 'single-host-adapter-path-family',
      ok:
        targetSourceSignals.localHostAdapterImports.length === 0 ||
        targetSourceSignals.usesShells.length === 0,
      severity: 'error',
      summary: 'host provider and page shells do not mix local host-adapter paths with package imports',
      detail:
        targetSourceSignals.localHostAdapterImports.length === 0 ||
        targetSourceSignals.usesShells.length === 0
          ? 'No mixed local-host-adapter and package shell import pattern was detected'
          : `Do not mix local host adapter paths with @hiui-design/typical-page-shells imports. Keep both provider and consumer on the package path family. Local adapter examples: ${summarizePathList(targetRoot, targetSourceSignals.localHostAdapterImports)}; package import examples: ${summarizePathList(targetRoot, targetSourceSignals.usesShells)}`,
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
    pushCheck(checks, {
      id: 'non-typical-split-shell-reuse',
      ok: nonTypicalSourceOwnership.warnings.length === 0,
      severity: nonTypicalSourceOwnership.warnings.length > 0 ? 'error' : 'warn',
      summary:
        'non-typical split pages keep explicit layout facts and governed split-shell reuse instead of hand-built split lookalikes',
      detail:
        nonTypicalSourceOwnership.warnings.length > 0
          ? nonTypicalSourceOwnership.warnings.join(' | ')
          : nonTypicalSourceOwnership.inspectedCount > 0
            ? `Validated ${nonTypicalSourceOwnership.inspectedCount} non-typical or implicit split source file(s); no context-main-split shell drift was detected.`
            : 'No source-marked non-typical pages or implicit context-main-split candidates were found under src.',
    })

    const coveredArchetypeBaselineIds = new Set(archetypeSmokeBaselines.map((item) => item.id))
    const missingArchetypeBaselineIds = requiredArchetypeBaselineIds.filter(
      (item) => !coveredArchetypeBaselineIds.has(item)
    )
    pushCheck(checks, {
      id: 'archetype-smoke-baselines',
      ok: missingArchetypeBaselineIds.length === 0,
      severity: 'error',
      summary: `manifest marks required archetype smoke baselines for ${requiredArchetypeBaselineIds.join(', ')}`,
      detail:
        missingArchetypeBaselineIds.length === 0
          ? archetypeSmokeBaselines.map((item) => item.id).join(', ')
          : `Missing required archetype smoke baselines: ${missingArchetypeBaselineIds.join(', ')}`,
    })

    const malformedArchetypeBaselineSpecs = requiredArchetypeBaselineIds
      .map((pageTypeId) => {
        const entry = baselineSpecEntries.get(pageTypeId)
        const issues = validateArchetypeSmokeBaselineSpecEntry(entry)
        return issues.length > 0 ? `${pageTypeId}: ${issues.join(', ')}` : ''
      })
      .filter(Boolean)
    pushCheck(checks, {
      id: 'archetype-smoke-baseline-spec',
      ok: malformedArchetypeBaselineSpecs.length === 0,
      severity: 'error',
      summary: 'required archetype smoke baselines have machine-readable screenshot specs',
      detail:
        malformedArchetypeBaselineSpecs.length === 0
          ? `${baselineSpecPath} covers ${requiredArchetypeBaselineIds.join(', ')}`
          : malformedArchetypeBaselineSpecs.join(' | '),
    })

    const viteConfigPath = await detectViteConfigFile(targetRoot)
    if (referenceOnlyMode && viteConfigPath) {
      const viteRaw = await readTextIfExists(viteConfigPath)
      const hasSchemaTypesAlias = viteRaw.includes('@hi-ui/schema-types')
      const schemaTypesShimPath = path.join(
        skillRoot,
        'examples',
        'host-integration',
        'src',
        'shims',
        'schema-types-empty.js'
      )

      pushCheck(checks, {
        id: 'vite-schema-types-alias',
        ok: hasSchemaTypesAlias,
        severity: 'warn',
        summary: 'Vite config can alias @hi-ui/schema-types when typical-page shells are used later',
        detail: hasSchemaTypesAlias
          ? viteConfigPath
          : `Reference-only modes do not patch Vite automatically. If generated pages later import shells that transitively touch @hi-ui/schema-types, add an alias in ${viteConfigPath} pointing to ${schemaTypesShimPath}`,
      })
    }

    if (referenceOnlyMode || hasRulesOnlyManagedArtifacts) {
      await appendRulesOnlyManagedPageChecks({
        baselineSpec,
        checks,
        legacyCompatibilityMode,
        manifest,
        managedPageRegistryInspection,
        nonTypicalSourceOwnership,
        pageContractsResult,
        referenceOnlyMode,
        targetRoot,
      })
    } else {
      const expectedCoreFiles = [
      path.join(outputRoot, 'README.md'),
      path.join(outputRoot, 'CHECKLIST.md'),
      path.join(outputRoot, 'routes', 'config.tsx'),
      ]
      const missingCoreFiles = []
      for (const filePath of expectedCoreFiles) {
        if (!(await pathExists(filePath))) missingCoreFiles.push(filePath)
      }
      pushCheck(checks, {
        id: 'core-files',
        ok: missingCoreFiles.length === 0,
        severity: 'error',
        summary: 'synced typical-page core files exist',
        detail:
          missingCoreFiles.length === 0
            ? outputRoot
            : `Missing synced files: ${missingCoreFiles.join(', ')}`,
      })

      const missingExamples = []
      for (const pageType of manifest.pageTypes) {
        const absExamplePath = path.join(targetRoot, pageType.examplePath)
        if (!(await pathExists(absExamplePath))) {
          missingExamples.push(pageType.examplePath)
        }
      }
      pushCheck(checks, {
        id: 'example-pages',
        ok: missingExamples.length === 0,
        severity: 'error',
        summary: 'all registered example pages exist in the target project',
        detail:
          missingExamples.length === 0
            ? `${manifest.pageTypes.length} example pages present`
            : `Missing examples: ${missingExamples.join(', ')}`,
      })

      const primarySmokeCases = getPrimarySmokeCases(manifest)
      const requiredSmokeGroups = ['table', 'chart', 'feedback', 'drawer', 'full-page']
      const coveredSmokeGroups = new Set(primarySmokeCases.map((item) => item.smokeGroup))
      const missingSmokeGroups = requiredSmokeGroups.filter((item) => !coveredSmokeGroups.has(item))
      pushCheck(checks, {
        id: 'smoke-groups',
        ok: missingSmokeGroups.length === 0,
        severity: 'error',
        summary: 'manifest provides primary smoke cases for table, chart, feedback, drawer, and full-page baseline checks',
        detail:
          missingSmokeGroups.length === 0
            ? primarySmokeCases.map((item) => `${item.smokeGroup}:${item.label}`).join(', ')
            : `Missing primary smoke groups: ${missingSmokeGroups.join(', ')}`,
      })

      const routeFile = await detectRouteFile(targetRoot)
      pushCheck(checks, {
        id: 'route-file',
        ok: Boolean(routeFile),
        severity: 'manual',
        summary: 'a route config file or app entry can be detected',
        detail:
          routeFile ||
          'No common route config file or app entry was detected; route mount must be wired manually',
      })

      const routeRaw = routeFile ? await readTextIfExists(routeFile) : ''
      const hasRouteMount = detectTypicalPageRouteMountInSource(routeRaw)
      const routeSnippetPath = path.join(outputRoot, 'ROUTE_MOUNT_SNIPPET.md')
      const routeSnippetRaw = await readTextIfExists(routeSnippetPath)
      const routeSnippetExists = await pathExists(routeSnippetPath)
      if (hostProfile.projectType === 'greenfield') {
        pushCheck(checks, {
          id: 'route-mounted',
          ok: hasRouteMount,
          severity: routeSnippetExists ? 'manual' : 'error',
          summary: 'typical-page routes are mounted into the target project',
          detail: hasRouteMount
            ? routeFile
            : routeSnippetExists
              ? `Routes are not mounted yet; apply ${routeSnippetPath} manually`
              : 'No route mount was detected and no manual route snippet was found',
        })
      } else {
        const sourceRepoKeepsSmokeGallery = isTypicalPageSourceRepo && hasRouteMount
        pushCheck(checks, {
          id: 'route-mounted',
          ok: sourceRepoKeepsSmokeGallery || !hasRouteMount,
          severity: sourceRepoKeepsSmokeGallery ? 'warn' : hasRouteMount ? 'error' : routeSnippetExists ? 'manual' : 'manual',
          summary: 'existing-system hosts should keep the smoke gallery out of the main route tree',
          detail: sourceRepoKeepsSmokeGallery
            ? `Detected typical-page smoke/gallery routes mounted in ${routeFile}. This is accepted because the current repository intentionally keeps the synced gallery in the main route tree for smoke verification; external existing-system targets should still keep these routes out of their production navigation by default.`
            : hasRouteMount
              ? `Detected typical-page smoke/gallery routes mounted in ${routeFile}. Existing systems should not merge these routes into the main navigation by default.`
            : routeSnippetExists
              ? `Auto route patch was intentionally skipped for the existing host. Review ${routeSnippetPath} before wiring any smoke route manually.`
              : 'No typical-page route mount was detected in the main route tree; this is expected for existing systems.',
        })
      }

      const mountedExampleRouteHasIcon = detectExampleTopLevelIcon(routeRaw)
      const snippetExampleRouteHasIcon = detectExampleTopLevelIcon(routeSnippetRaw)
      const shouldValidateMountedExampleIcon =
        hostProfile.projectType === 'greenfield' && hasRouteMount
      pushCheck(checks, {
        id: 'example-top-level-icon',
        ok: shouldValidateMountedExampleIcon
          ? mountedExampleRouteHasIcon
          : snippetExampleRouteHasIcon,
        severity: shouldValidateMountedExampleIcon
          ? 'error'
          : routeSnippetExists
            ? 'manual'
            : 'error',
        summary:
          'the top-level 示例 menu group keeps its own icon when mounting typical-page routes',
        detail: shouldValidateMountedExampleIcon
          ? mountedExampleRouteHasIcon
            ? routeFile
            : 'The mounted 示例 route group is missing its first-level icon. Keep the icon on the top-level 示例 node brought by host integration; do not move that fix onto second-level groups such as 表格 / 表单 / 详情.'
          : routeSnippetExists
            ? snippetExampleRouteHasIcon
              ? routeSnippetPath
              : `ROUTE_MOUNT_SNIPPET.md is missing the top-level 示例 icon contract: ${routeSnippetPath}`
            : 'No mounted route or manual route snippet was found, so the top-level 示例 icon contract cannot be verified.',
      })

      const appFile = await detectTopLevelAppFile(targetRoot)
      const appRaw = await readTextIfExists(appFile)
      const usesLegacyStandaloneWorkspaceShell = detectLegacyStandaloneWorkspaceShell(appRaw)
      const mountsTypicalPageAppFrame = detectTopLevelTypicalPageAppFrameMount(appRaw)
      const appFrameRoutesIdentifier = detectRoutesIdentifierUsedByAppFrame(appRaw)
      const hostRouteMenuSource = analyzeHostRouteMenuSource(appRaw)
      const topLevelMenuGroupsMissingIcons =
        routeFile && mountsTypicalPageAppFrame
          ? collectTopLevelMenuGroupsMissingIcons(routeRaw, appFrameRoutesIdentifier)
          : []
      const shouldEnforceSingleHostOwner =
        hostProfile.projectType === 'greenfield' && mode === 'host-integration'
      pushCheck(checks, {
        id: 'single-host-owner',
        ok: !shouldEnforceSingleHostOwner || !usesLegacyStandaloneWorkspaceShell,
        severity: 'error',
        summary:
          'greenfield host-integration keeps a single app-level host owner instead of an outdated standalone preview shell',
        detail:
          !shouldEnforceSingleHostOwner || !usesLegacyStandaloneWorkspaceShell
            ? mountsTypicalPageAppFrame
              ? `${appFile} mounts TypicalPageAppFrame as the top-level host shell`
              : appFile
                ? `${appFile} does not match the deprecated ExampleAppShell + custom sidebar workspace pattern`
                : 'No top-level App file was detected, so the deprecated standalone workspace pattern was not found'
            : `Detected the deprecated standalone preview shell in ${appFile}. Do not use ExampleAppShell + custom sidebar/nav as the top-level App workspace after syncing host-integration. That splits ownership of navigation, PageHeader portal, white page background, and outlet height chain, which leads to menu drift, the title rendering above the navigation, white bodies stopping before the bottom, and full-page edit footers losing sticky behavior. Replace the root shell with TypicalPageAppFrame and let app-frame.tsx own navigation, header/footer slots, route-title fallback, and the main outlet height chain.`,
      })
      pushCheck(checks, {
        id: 'host-route-menu-source-of-truth',
        ok: !mountsTypicalPageAppFrame || hostRouteMenuSource.ok,
        severity: mountsTypicalPageAppFrame ? 'error' : 'manual',
        summary:
          'TypicalPageAppFrame uses the same host-level 示例 route group as the page routing tree',
        detail: !mountsTypicalPageAppFrame
          ? appFile
            ? `${appFile} does not mount TypicalPageAppFrame, so route/menu source ownership must be verified in the project-specific host shell.`
            : 'No top-level App file was detected, so route/menu source ownership cannot be verified.'
          : hostRouteMenuSource.detail,
      })
      pushCheck(checks, {
        id: 'top-level-menu-icons',
        ok: !mountsTypicalPageAppFrame || topLevelMenuGroupsMissingIcons.length === 0,
        severity: mountsTypicalPageAppFrame ? 'error' : 'manual',
        summary:
          'top-level business menu groups rendered by TypicalPageAppFrame keep explicit first-level icons',
        detail:
          !mountsTypicalPageAppFrame
            ? appFile
              ? `${appFile} does not mount TypicalPageAppFrame, so first-level menu icon ownership must be verified in the project-specific host shell.`
              : 'No top-level App file was detected, so first-level menu icon ownership cannot be verified.'
            : topLevelMenuGroupsMissingIcons.length === 0
              ? routeFile
              : `The following first-level menu groups are missing icons in ${routeFile}: ${topLevelMenuGroupsMissingIcons.join(', ')}. TypicalPageAppFrame only renders icons from first-level menu nodes, so add explicit icons on those business route groups instead of compensating on second-level children.`,
      })

      const existingHostShellEntry = await detectExistingHostShellEntry(targetRoot)
      const syncedRouteConfigPath = path.join(outputRoot, 'routes', 'config.tsx')
      const syncedRouteConfigRaw = await readTextIfExists(syncedRouteConfigPath)
      const wrapsInShellByDefault = detectWrapInShellByDefault(syncedRouteConfigRaw)
      pushCheck(checks, {
        id: 'no-double-host-shell',
        ok: !existingHostShellEntry || !wrapsInShellByDefault,
        severity: 'error',
        summary:
          'typical-page route gallery does not wrap pages with a second example host when the target project already has a real host shell',
        detail:
          !existingHostShellEntry || !wrapsInShellByDefault
            ? existingHostShellEntry
              ? `${syncedRouteConfigPath} leaves shell wrapping opt-in and reuses the existing host shell at ${existingHostShellEntry}`
              : 'No existing host shell entry was detected, so standalone example wrapping remains optional'
            : `Detected an existing host shell at ${existingHostShellEntry}, but ${syncedRouteConfigPath} still wraps example pages with ExampleAppShell by default. This creates double header/footer containers in host-integration mode.`,
      })

      const nestedBusinessHostShellConsumers = mountsTypicalPageAppFrame
        ? await collectBusinessHostShellConsumers(targetRoot, outputRoot)
        : []
      pushCheck(checks, {
        id: 'no-business-route-double-host-shell',
        ok: !mountsTypicalPageAppFrame || nestedBusinessHostShellConsumers.length === 0,
        severity: mountsTypicalPageAppFrame ? 'error' : 'manual',
        summary:
          'business routes/pages do not rebuild a second host shell when TypicalPageAppFrame already owns header/footer slots',
        detail:
          !mountsTypicalPageAppFrame
            ? appFile
              ? `${appFile} does not mount TypicalPageAppFrame, so duplicate business host-shell ownership must be verified in the project-specific host.`
              : 'No top-level App file was detected, so duplicate business host-shell ownership cannot be verified.'
            : nestedBusinessHostShellConsumers.length === 0
              ? `${appFile} is the single host shell owner and no business source outside ${outputRoot} imports ExampleAppShell or rebuilds LayoutContentProvider + TypicalPageHostBridge.`
              : `Detected business source files that rebuild a second host shell even though ${appFile} already mounts TypicalPageAppFrame: ${nestedBusinessHostShellConsumers.join(', ')}. Do not wrap business routes/pages with ExampleAppShell or recreate LayoutContentProvider + TypicalPageHostBridge outside ${outputRoot}; otherwise an extra empty header slot is reserved and the page shows top whitespace / duplicate portal containers.`,
      })

      const hostFiles = [
      path.join(outputRoot, 'app-frame.tsx'),
      path.join(outputRoot, 'components', 'layout', 'layout-content-context.tsx'),
      path.join(outputRoot, 'components', 'layout', 'page-header-portal.tsx'),
      path.join(outputRoot, 'components', 'layout', 'typical-page-host.tsx'),
      path.join(outputRoot, 'app-shell.tsx'),
      ]
      const missingHostFiles = []
      for (const filePath of hostFiles) {
        if (!(await pathExists(filePath))) missingHostFiles.push(filePath)
      }
      pushCheck(checks, {
        id: 'host-assets',
        ok: missingHostFiles.length === 0,
        severity: 'error',
        summary: 'host bridge assets exist',
        detail:
          missingHostFiles.length === 0
            ? 'Layout bridge, portal bridge, and app shell example are present'
            : `Missing host assets: ${missingHostFiles.join(', ')}`,
      })

      const fixedDashboardHelperFiles = [
        path.join(outputRoot, 'components', 'managed-page', 'data-visualization-primitives.tsx'),
        path.join(outputRoot, 'components', 'managed-page', 'fixed-dashboard-page-frame.tsx'),
      ]
      const missingFixedDashboardHelperFiles = []
      for (const filePath of fixedDashboardHelperFiles) {
        if (!(await pathExists(filePath))) missingFixedDashboardHelperFiles.push(filePath)
      }
      pushCheck(checks, {
        id: 'fixed-dashboard-helper-assets',
        ok: missingFixedDashboardHelperFiles.length === 0,
        severity: 'error',
        summary:
          'host-integration exports the shared dashboard frame helpers used by data-visualization start-page generation',
        detail:
          missingFixedDashboardHelperFiles.length === 0
            ? fixedDashboardHelperFiles.join(', ')
            : `Missing shared dashboard frame helpers: ${missingFixedDashboardHelperFiles.join(', ')}. Keep the fixed dashboard frame and shared data-visualization primitives in the synced host assets so start-page can scaffold a reusable shell path instead of free-form page wrappers.`,
      })

      const fixedDashboardFramePath = path.join(
        outputRoot,
        'components',
        'managed-page',
        'fixed-dashboard-page-frame.tsx',
      )
      const fixedDashboardFrameRaw = await readTextIfExists(fixedDashboardFramePath)
      const fixedDashboardRootInlinePaddingMatch = (fixedDashboardFrameRaw || '').match(
        /\bdashboardPageRoot\b[\s\S]{0,260}\bpaddingInline\s*:\s*([^,\n}]+)/,
      )
      const fixedDashboardRootBlockEndPaddingMatch = (fixedDashboardFrameRaw || '').match(
        /\bdashboardPageRoot\b[\s\S]{0,260}\bpaddingBlockEnd\s*:\s*([^,\n}]+)/,
      )
      const fixedDashboardRootAddsInlinePadding =
        !!fixedDashboardRootInlinePaddingMatch &&
        fixedDashboardRootInlinePaddingMatch[1].trim() !== '0'
      const fixedDashboardRootAddsBlockEndPadding =
        !!fixedDashboardRootBlockEndPaddingMatch &&
        fixedDashboardRootBlockEndPaddingMatch[1].trim() !== '0'
      pushCheck(checks, {
        id: 'fixed-dashboard-root-spacing',
        ok:
          !fixedDashboardFrameRaw ||
          (!fixedDashboardRootAddsInlinePadding && !fixedDashboardRootAddsBlockEndPadding),
        severity: fixedDashboardFrameRaw ? 'error' : 'manual',
        summary:
          'shared fixed-dashboard shell keeps the page root flush instead of reintroducing outer inset above the white-body workspace',
        detail:
          !fixedDashboardFrameRaw
            ? `Could not read ${fixedDashboardFramePath}, so fixed-dashboard shell spacing must be verified manually.`
            : !fixedDashboardRootAddsInlinePadding && !fixedDashboardRootAddsBlockEndPadding
              ? `${fixedDashboardFramePath} keeps dashboardPageRoot padding at zero; outer gutter must stay on the true host/content-slot owner instead of a second page-root wrapper.`
              : `${fixedDashboardFramePath} still injects page-root inset through dashboardPageRoot (${[
                    fixedDashboardRootAddsInlinePadding ? 'paddingInline' : '',
                    fixedDashboardRootAddsBlockEndPadding ? 'paddingBlockEnd' : '',
                  ]
                    .filter(Boolean)
                    .join(', ')}). Do not keep a second outer padding layer above ManagedWhiteBodyWorkspace; otherwise host viewport gutter + page-root inset + white-body padding stack into a duplicated shell gap.`,
      })

      const missingImports = await collectUndeclaredImports({
        rootDir: outputRoot,
        pkg,
      })
      pushCheck(checks, {
        id: 'host-import-dependencies',
        ok: missingImports.length === 0,
        severity: 'error',
        summary: 'all non-relative imports used by synced typical-page files are declared in package.json',
        detail:
          missingImports.length === 0
            ? `${outputRoot} imports are covered by package.json declarations`
            : summarizeMissingImports(targetRoot, missingImports),
      })

      const schemaFormCheckSelectViolations = await collectSchemaFormCheckSelectViolations(outputRoot)
      pushCheck(checks, {
        id: 'schema-form-check-select-provider',
        ok: schemaFormCheckSelectViolations.length === 0,
        severity: 'error',
        summary: 'raw SchemaForm pages that use CheckSelect also mount TypicalPageFieldMapProvider',
        detail:
          schemaFormCheckSelectViolations.length === 0
            ? 'No raw SchemaForm + CheckSelect page is missing the typical-page field-map provider'
            : `Wrap these files with TypicalPageFieldMapProvider: ${schemaFormCheckSelectViolations.join(', ')}`,
      })

      const legacyHiUi4Violations = await collectLegacyHiUi4Violations([
      outputRoot,
      path.join(targetRoot, 'src', 'components'),
      path.join(targetRoot, 'src', 'styles'),
      ])
      pushCheck(checks, {
        id: 'legacy-hiui4-tokens',
        ok: legacyHiUi4Violations.length === 0,
        severity: 'error',
        summary: 'synced typical-page assets and copied helper components do not contain legacy visual class names, variables, or demo copy',
        detail:
          legacyHiUi4Violations.length === 0
            ? 'No legacy visual residue such as `hi-v4-*`, `--hi-v4-*`, or old demo wording was found in the reusable page assets'
            : summarizeLegacyHiUi4Violations(targetRoot, legacyHiUi4Violations),
      })

      const appFramePath = path.join(outputRoot, 'app-frame.tsx')
      const appFrameRaw = await readTextIfExists(appFramePath)
      const appFramePortalContractTokens = [
        'LayoutContentProvider',
        'TypicalPageHostBridge',
        'findRouteTitle(',
        'const headerRef = React.useRef<HTMLDivElement>(null)',
        'const footerRef = React.useRef<HTMLDivElement>(null)',
        'const titleTextRef = React.useRef(pageTitle)',
        'titleTextRef.current = pageTitle',
        'ref={headerRef}',
        'ref={footerRef}',
      ]
      const missingAppFramePortalTokens = collectMissingTokens(
        appFrameRaw,
        appFramePortalContractTokens
      )
      pushCheck(checks, {
        id: 'app-frame-host-portal-contract',
        ok: missingAppFramePortalTokens.length === 0,
        severity: 'error',
        summary:
          'app-frame keeps real host header/footer slots plus route-title fallback for typical-page portals',
        detail:
          missingAppFramePortalTokens.length === 0
            ? appFramePath
            : `Keep the app-frame host contract intact. Missing tokens: ${missingAppFramePortalTokens.join(', ')}. If the route outlet renders directly without LayoutContentProvider + TypicalPageHostBridge + header/footer refs, full-page edit/detail headers fall back into the white page shell instead of the host header area.`,
      })
      const appFrameHeaderSlotCentered =
        appFrameRaw.includes("headerSlot: {") &&
        (appFrameRaw.includes("display: 'flex'") || appFrameRaw.includes('display: "flex"')) &&
        (appFrameRaw.includes("alignItems: 'center'") || appFrameRaw.includes('alignItems: "center"'))
      pushCheck(checks, {
        id: 'app-frame-header-slot-center',
        ok: appFrameHeaderSlotCentered,
        severity: 'error',
        summary:
          'app-frame header slot keeps PageHeader vertically centered inside the shared 60px host header area',
        detail: appFrameHeaderSlotCentered
          ? appFramePath
          : 'Keep app-frame headerSlot on a flex + alignItems:center contract. The host slot may center the PageHeader vertically, but page-header-portal.tsx must still avoid mutating the PageHeader root layout itself.',
      })
      const appFrameHasScrollableOutlet =
        appFrameRaw.includes("overflow: 'auto'") ||
        appFrameRaw.includes('overflow: "auto"') ||
        appFrameRaw.includes('overflow: auto')
      const appFrameStretchOutletContract =
        (appFrameRaw.includes("display: 'flex'") ||
          appFrameRaw.includes('display: "flex"') ||
          appFrameRaw.includes('display: flex')) &&
        (appFrameRaw.includes("flexDirection: 'column'") ||
          appFrameRaw.includes('flexDirection: "column"') ||
          appFrameRaw.includes('flex-direction: column')) &&
        (appFrameRaw.includes("overflow: 'hidden'") ||
          appFrameRaw.includes('overflow: "hidden"') ||
          appFrameRaw.includes('overflow: hidden')) &&
        appFrameRaw.includes('minHeight: 0')
      pushCheck(checks, {
        id: 'app-frame-outlet-contract',
        ok: appFrameStretchOutletContract && !appFrameHasScrollableOutlet,
        severity: 'error',
        summary:
          'route gallery app frame keeps the content outlet in a flex/hidden container so typical pages can stretch to the bottom',
        detail:
          appFrameStretchOutletContract && !appFrameHasScrollableOutlet
            ? appFramePath
            : 'Keep the route-gallery outlet on a flex column + overflow hidden contract. Do not make the outer app-frame content slot own vertical scrolling, otherwise table white bodies stop filling the bottom and full-page edit footers stop sticking.',
      })
      const appFrameKeepsRightViewportGutter =
        /paddingInlineEnd:\s*(?:HOST_CONTENT_VIEWPORT_GUTTER|16)\b/.test(appFrameRaw) ||
        /padding-inline-end\s*:\s*16px\b/.test(appFrameRaw)
      const appFrameKeepsConditionalLeftViewportGutter =
        /paddingInlineStart:\s*floatContainerCollapsed\s*\?\s*(?:HOST_CONTENT_VIEWPORT_GUTTER|16)\s*:\s*0\b/.test(
          appFrameRaw
        ) ||
        /padding-inline-start\s*:\s*(?:var\([^)]+\)|16px)\s*;[\s\S]*data-float-menu-collapsed/i.test(
          appFrameRaw
        )
      const appFrameZeroesInlinePadding = /paddingInline:\s*0\b/.test(appFrameRaw)
      pushCheck(checks, {
        id: 'app-frame-viewport-gutter-contract',
        ok:
          appFrameKeepsRightViewportGutter &&
          appFrameKeepsConditionalLeftViewportGutter &&
          !appFrameZeroesInlinePadding,
        severity: 'error',
        summary:
          'app-frame keeps the required viewport gutter contract for host content',
        detail:
          appFrameKeepsRightViewportGutter &&
          appFrameKeepsConditionalLeftViewportGutter &&
          !appFrameZeroesInlinePadding
            ? appFramePath
            : 'Keep the host content gutter contract intact: main content must preserve the right-side 16px viewport gutter at all times, keep the left-side 16px gutter when the floating submenu is collapsed, and only collapse the left gutter when that submenu expands. Do not reset app-frame content padding back to `paddingInline: 0`.',
      })
      const rootStylePath = await detectStarterRootStyleFile(targetRoot)
      const rootStyleRaw = rootStylePath ? await readTextIfExists(rootStylePath) : ''
      const bodyLocksDocumentScroll =
        /body\s*\{[\s\S]*overflow\s*:\s*hidden/i.test(rootStyleRaw) ||
        /html\s*,\s*body\s*,\s*#root\s*\{[\s\S]*overflow\s*:\s*hidden/i.test(rootStyleRaw)
      const rootLocksDocumentScroll =
        /#root\s*\{[\s\S]*overflow\s*:\s*hidden/i.test(rootStyleRaw)
      pushCheck(checks, {
        id: 'host-root-scroll-lock',
        ok: bodyLocksDocumentScroll && rootLocksDocumentScroll,
        severity: 'error',
        summary:
          'starter root styles lock browser-level scrolling to the host app shell instead of letting the whole document scroll',
        detail:
          bodyLocksDocumentScroll && rootLocksDocumentScroll
            ? rootStylePath || 'starter root style file'
            : rootStylePath
              ? `Add \`overflow: hidden\` to both \`body\` and \`#root\` in ${rootStylePath}, and keep the root height chain at 100%. Otherwise the browser document becomes the scroll owner, the left navigation stops at the viewport bottom, and dashboard pages scroll together with the whole page.`
              : 'No starter root style file was detected. Host-integration examples need a root CSS file that locks document scrolling on body/#root and keeps the app shell at 100% height.',
      })

      const appShellPath = path.join(outputRoot, 'app-shell.tsx')
      const appShellRaw = await readTextIfExists(appShellPath)
      const appShellStyleRaw = appShellRaw ? await readImportedStyleSources(appShellPath, appShellRaw) : ''
      const appShellContractRaw = `${appShellRaw}\n${appShellStyleRaw}`
      const hasTypicalPageHostBridge = appShellRaw.includes('TypicalPageHostBridge')
      const flexChainCount = countMatches(
        appShellContractRaw,
        /flex:\s*(?:['"]1 1 0%['"]|1 1 0%)/g
      )
      const minHeightChainCount = countMatches(
        appShellContractRaw,
        /minHeight:\s*0|min-height:\s*0/g
      )
      const overflowHiddenCount = countMatches(
        appShellContractRaw,
        /overflow:\s*(?:['"]hidden['"]|hidden)/g
      )
      const hasHeightChain =
        flexChainCount >= 2 &&
        minHeightChainCount >= 2 &&
        overflowHiddenCount >= 2
      pushCheck(checks, {
        id: 'host-bridge-contract',
        ok: hasTypicalPageHostBridge && hasHeightChain,
        severity: 'error',
        summary: 'the synced app shell example still shows the required host bridge and height chain contract',
        detail:
          hasTypicalPageHostBridge && hasHeightChain
            ? appShellPath
            : 'The synced app-shell example is missing TypicalPageHostBridge or the flex/min-height/overflow chain expected by typical pages',
      })
      const appShellKeepsViewportGutter =
        /paddingInline:\s*(?:STANDALONE_CONTENT_VIEWPORT_GUTTER|16)\b/.test(appShellContractRaw) ||
        /padding-inline\s*:\s*0\s+16px\b/.test(appShellContractRaw) ||
        /padding-inline\s*:\s*16px\b/.test(appShellContractRaw)
      pushCheck(checks, {
        id: 'app-shell-viewport-gutter-contract',
        ok: appShellKeepsViewportGutter,
        severity: 'error',
        summary:
          'the synced app shell example keeps the default 16px viewport gutter around standalone content',
        detail: appShellKeepsViewportGutter
          ? appShellPath
          : 'Keep a 16px viewport gutter on the standalone app-shell content column. Without that inset, host previews drift away from the reference shell and users tend to copy a zero-padding content slot back into real host app-frame integrations.',
      })

      const pageHeaderPortalPath = path.join(outputRoot, 'components', 'layout', 'page-header-portal.tsx')
      const pageHeaderPortalRaw = await readTextIfExists(pageHeaderPortalPath)
      const mutatesPageHeaderRootLayout =
        pageHeaderPortalRaw.includes("display: 'flex'") ||
        pageHeaderPortalRaw.includes('display: "flex"') ||
        pageHeaderPortalRaw.includes("alignItems: 'center'") ||
        pageHeaderPortalRaw.includes('alignItems: "center"')
      const hasHeaderFullWidthContract =
        (appShellContractRaw.includes("width: '100%'") ||
          appShellContractRaw.includes('width: 100%')) &&
        (appShellContractRaw.includes('minWidth: 0') ||
          appShellContractRaw.includes('min-width: 0')) &&
        pageHeaderPortalRaw.includes("width: '100%'") &&
        pageHeaderPortalRaw.includes('minWidth: 0')
      pushCheck(checks, {
        id: 'header-full-width-contract',
        ok: hasHeaderFullWidthContract && !mutatesPageHeaderRootLayout,
        severity: 'error',
        summary: 'host header slot keeps PageHeader stretched to full width so header actions can stay right-aligned',
        detail:
          hasHeaderFullWidthContract && !mutatesPageHeaderRootLayout
            ? `${appShellPath}, ${pageHeaderPortalPath}`
            : mutatesPageHeaderRootLayout
              ? 'Do not force PageHeader root to display:flex or alignItems:center inside page-header-portal.tsx. Keep only width: 100% and minWidth: 0 so the internal content container can push extra actions to the right'
              : 'Host app-shell and page-header portal must keep the header slot full width; otherwise PageHeader extra actions drift next to the title instead of aligning right',
      })

      const fullPageEditExamplePath = path.join(outputRoot, 'pages', 'full-page-edit.tsx')
      const fullPageEditRaw = await readTextIfExists(fullPageEditExamplePath)
      const hasFullPageEditHeaderPortal =
        fullPageEditRaw.includes('TypicalPageHeaderPortal') ||
        fullPageEditRaw.includes('HostPageHeaderPortal')
      const hasFullPageEditProvider = fullPageEditRaw.includes('ProEditPageProvider')
      const requiredFullPageEditShellTokens = [
        'proEditPageShellStyles.formScrollBody',
        'proEditPageShellStyles.inlineEditFooter',
      ]
      const hasRequiredFullPageEditShellChain =
        hasFullPageEditHeaderPortal &&
        requiredFullPageEditShellTokens.every((token) => fullPageEditRaw.includes(token))
      const fullPageEditFormScrollIndex = fullPageEditRaw.indexOf(
        'proEditPageShellStyles.formScrollBody'
      )
      const fullPageEditFooterIndex = fullPageEditRaw.indexOf(
        'proEditPageShellStyles.inlineEditFooter'
      )
      const usesFooterPortalInFullPageEdit =
        fullPageEditRaw.includes('PageFooterPortal') ||
        fullPageEditRaw.includes('TypicalPageFooterPortal')
      pushCheck(checks, {
        id: 'full-page-edit-shell-chain',
        ok:
          hasRequiredFullPageEditShellChain &&
          fullPageEditFormScrollIndex >= 0 &&
          fullPageEditFooterIndex > fullPageEditFormScrollIndex &&
          !usesFooterPortalInFullPageEdit,
        severity: 'error',
        summary:
          'full-page edit example keeps the required shell chain so the action area can stay bottom-docked',
        detail:
          hasRequiredFullPageEditShellChain &&
          fullPageEditFormScrollIndex >= 0 &&
          fullPageEditFooterIndex > fullPageEditFormScrollIndex &&
          !usesFooterPortalInFullPageEdit
            ? fullPageEditExamplePath
            : 'Keep HostPageHeaderPortal or TypicalPageHeaderPortal, formScrollBody, and inlineEditFooter in the same ProEditPage. inlineEditFooter must stay after formScrollBody and must not be remounted through a footer portal, otherwise the action area stops sticking to the bottom.',
      })
      pushCheck(checks, {
        id: 'full-page-edit-provider-chain',
        ok: hasFullPageEditProvider,
        severity: 'error',
        summary:
          'full-page edit example keeps the required ProEditPageProvider context chain around the edit shell',
        detail: hasFullPageEditProvider
          ? fullPageEditExamplePath
          : 'Keep ProEditPageProvider around the full-page-edit shell. Form, CancelButton, StashButton, and SubmitButton all rely on the edit-page context, and omitting the provider causes runtime white screens.',
      })
      const hasExtraFormScrollPadding =
        fullPageEditRaw.includes("padding: '20px 20px 0'") ||
        fullPageEditRaw.includes('style={formBodyStyle}') ||
        /className=\{proEditPageShellStyles\.formScrollBody\}[\s\S]{0,80}style=/.test(fullPageEditRaw)
      pushCheck(checks, {
        id: 'full-page-edit-form-root-padding',
        ok: !hasExtraFormScrollPadding,
        severity: 'error',
        summary: 'full-page edit example does not add extra root padding on formScrollBody',
        detail: !hasExtraFormScrollPadding
          ? fullPageEditExamplePath
          : 'Remove extra padding from the formScrollBody root. Full-page edit spacing should come from the schema/card structure instead of wrapping the whole scroll body with 20px padding',
      })

      if (viteConfigPath) {
      const viteRaw = await readTextIfExists(viteConfigPath)
      const schemaTypesShimPath = path.join(outputRoot, 'shims', 'schema-types-empty.js')
      const schemaTypesSnippetPath = path.join(outputRoot, 'VITE_ALIAS_SNIPPET.md')
      const hasSchemaTypesAlias = viteRaw.includes('@hi-ui/schema-types')
      const hasSchemaTypesShim = await pathExists(schemaTypesShimPath)
      const hasSchemaTypesSnippet = await pathExists(schemaTypesSnippetPath)

      pushCheck(checks, {
        id: 'vite-schema-types-shim',
        ok: hasSchemaTypesShim,
        severity: 'error',
        summary: 'Vite compatibility shim for @hi-ui/schema-types exists',
        detail: hasSchemaTypesShim
          ? schemaTypesShimPath
          : `Missing Vite shim file: ${schemaTypesShimPath}`,
      })

        pushCheck(checks, {
          id: 'vite-schema-types-alias',
          ok: hasSchemaTypesAlias,
          severity: 'error',
          summary: 'Vite config aliases @hi-ui/schema-types to the synced empty shim',
          detail: hasSchemaTypesAlias
            ? viteConfigPath
            : hasSchemaTypesSnippet
              ? `Missing alias in ${viteConfigPath}; apply ${schemaTypesSnippetPath} before running Vite`
              : `Missing alias in ${viteConfigPath}; add @hi-ui/schema-types -> ${schemaTypesShimPath}`,
        })
      }
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

      pushCheck(checks, {
        id: 'source-shell-package-version-sync',
        ok: Boolean(sourceShellPackage?.version) && sourceShellPackage.version === shellPackage?.version,
        severity: 'error',
        summary: 'embedded shell package snapshot version matches packages/typical-page-shells/package.json',
        detail:
          sourceShellPackage?.version && sourceShellPackage.version === shellPackage?.version
            ? `${sourceShellPackage.version}`
            : `source package version=${sourceShellPackage?.version ?? '(missing)'}; embedded snapshot version=${shellPackage?.version ?? '(missing)'}`,
      })

      pushCheck(checks, {
        id: 'source-shell-query-filter-defaults',
        ok: sourceShellBridge.exists && sourceShellBridge.reasons.length === 0,
        severity: 'error',
        summary:
          'packages/typical-page-shells/dist QueryFilter bridge keeps the HiUI5 contained/no-label defaults',
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
          embeddedShellTarball.exists &&
          embeddedShellTarball.reasons.length === 0 &&
          embeddedShellTarball.raw.trim() === sourceShellBridge.raw.trim(),
        severity: 'error',
        summary:
          'embedded vendor tgz is refreshed from the current packages/typical-page-shells dist bridge',
        detail:
          !embeddedShellTarball.exists
            ? `Missing embedded shell tarball at ${embeddedShellTarballPath || '(unknown path)'}`
            : embeddedShellTarball.reasons.length > 0
              ? `${path.relative(targetRoot, embeddedShellTarball.filePath)} -> ${embeddedShellTarball.reasons.join('; ')}`
              : embeddedShellTarball.raw.trim() === sourceShellBridge.raw.trim()
                ? path.relative(targetRoot, embeddedShellTarball.filePath)
                : `Embedded tgz bridge does not match ${path.relative(targetRoot, sourceShellBridge.filePath)}. Run pnpm sync:typical-page-shell-snapshot before distributing this skill.`,
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

    const planPageTaskScript =
      pkg?.scripts?.['typical-page:plan-page-task'] ===
      expectedScripts['typical-page:plan-page-task']
    pushCheck(checks, {
      id: 'plan-page-task-script',
      ok: planPageTaskScript,
      severity: 'error',
      summary: 'package.json exposes typical-page:plan-page-task as the canonical page-task planning gate',
      detail: planPageTaskScript
        ? 'Registered script matches the packaged machine-plan entry'
        : `Expected \`${expectedScripts['typical-page:plan-page-task']}\``,
    })

    const doctorSelfCheckScript =
      pkg?.scripts?.['typical-page:doctor:self-check'] ===
      expectedScripts['typical-page:doctor:self-check']
    pushCheck(checks, {
      id: 'doctor-self-check-script',
      ok: doctorSelfCheckScript,
      severity: 'warn',
      summary:
        'package.json exposes typical-page:doctor:self-check for mixed-mode rules-only regression coverage',
      detail: doctorSelfCheckScript
        ? 'Registered script matches the packaged doctor regression self-check entry'
        : `Expected \`${expectedScripts['typical-page:doctor:self-check']}\``,
    })

    const maintainerSelfCheckScript =
      pkg?.scripts?.['typical-page:maintainer:self-check'] ===
      expectedScripts['typical-page:maintainer:self-check']
    pushCheck(checks, {
      id: 'maintainer-self-check-script',
      ok: maintainerSelfCheckScript,
      severity: 'warn',
      summary:
        'package.json exposes typical-page:maintainer:self-check for bundled maintainer regression coverage',
      detail: maintainerSelfCheckScript
        ? 'Registered script matches the packaged maintainer regression bundle entry'
        : `Expected \`${expectedScripts['typical-page:maintainer:self-check']}\``,
    })

    const writeContractScript =
      pkg?.scripts?.['typical-page:write-contract'] === expectedScripts['typical-page:write-contract']
    pushCheck(checks, {
      id: 'write-contract-script',
      ok: writeContractScript,
      severity: 'warn',
      summary: 'package.json exposes typical-page:write-contract as a maintenance-only contract writer',
      detail: writeContractScript
        ? 'Registered script matches the packaged maintenance writer entry'
        : `Expected \`${expectedScripts['typical-page:write-contract']}\``,
    })

    const finalizePageScript =
      pkg?.scripts?.['typical-page:finalize-page'] === expectedScripts['typical-page:finalize-page']
    pushCheck(checks, {
      id: 'finalize-page-script',
      ok: finalizePageScript,
      severity: 'warn',
      summary: 'package.json exposes typical-page:finalize-page as the managed-page delivery gate',
      detail: finalizePageScript
        ? 'Registered script matches the packaged delivery gate entry'
        : `Expected \`${expectedScripts['typical-page:finalize-page']}\``,
    })

    const startPageScript =
      pkg?.scripts?.['typical-page:start-page'] === expectedScripts['typical-page:start-page']
    pushCheck(checks, {
      id: 'start-page-script',
      ok: startPageScript,
      severity: 'warn',
      summary: 'package.json exposes typical-page:start-page for managed page scaffolding',
      detail: startPageScript
        ? 'Registered script matches the packaged start-page entry'
        : `Expected \`${expectedScripts['typical-page:start-page']}\``,
    })

    const preflightScript =
      pkg?.scripts?.['typical-page:preflight'] === expectedScripts['typical-page:preflight']
    pushCheck(checks, {
      id: 'preflight-script',
      ok: preflightScript,
      severity: 'warn',
      summary: 'package.json exposes typical-page:preflight for implementation blocking checks',
      detail: preflightScript
        ? 'Registered script matches the packaged preflight entry'
        : `Expected \`${expectedScripts['typical-page:preflight']}\``,
    })

    const runtimeSmokeScript =
      pkg?.scripts?.['typical-page:runtime-smoke'] === expectedScripts['typical-page:runtime-smoke']
    pushCheck(checks, {
      id: 'runtime-smoke-script',
      ok: runtimeSmokeScript,
      severity: 'warn',
      summary: 'package.json exposes typical-page:runtime-smoke for browser-level managed-page validation',
      detail: runtimeSmokeScript
        ? 'Registered script matches the packaged runtime-smoke entry'
        : `Expected \`${expectedScripts['typical-page:runtime-smoke']}\``,
    })

    const status = overallStatusFromChecks(checks)
    const currentPageReady = isCurrentPageReady(status)
    const summary = summarizeChecks(checks)
    const reportPath = path.join(outputRoot, 'DOCTOR_REPORT.md')
    const smokeReportPath = path.join(outputRoot, 'SMOKE_REPORT.md')
    const hostAdapterSnippetPath = path.join(outputRoot, 'HOST_ADAPTER_SNIPPET.md')

    await writeHostAdapterSnippet({
      outputRoot,
      hostProfile,
      recommendedModeOverride: recommendedMode,
    })
    await writeSmokeReport({
      outputRoot,
      targetRoot,
      manifest,
      doctorStatus: status,
      mode,
      baselineSpecPath,
      baselineSpec,
    })
    await writeDoctorReport({
      outputRoot,
      targetRoot,
      status,
      checks,
      summary,
      line: lineId,
      manifestPath,
      mode,
      recommendedMode,
      hostProfile,
      hostAdapterSnippetPath,
    })

    if (options.json) {
      console.log(
        JSON.stringify(
          {
            status,
            currentPageReady,
            summary,
            reportPath,
            smokeReportPath,
            hostAdapterSnippetPath,
            manifestPath,
            baselineSpecPath,
            checks,
          },
          null,
          2
        )
      )
      return
    }

    console.log(`Typical Page Doctor: ${status.toUpperCase()}`)
    console.log(`- target root: ${targetRoot}`)
    console.log(`- mode: ${mode}`)
    console.log(`- project type: ${hostProfile.projectType}`)
    console.log(`- framework: ${hostProfile.framework}`)
    console.log(`- recommended mode: ${recommendedMode}`)
    console.log(`- current-page delivery ready: ${currentPageReady ? 'yes' : 'no'}`)
    if (hostProfile.adapterDoc) {
      console.log(`- framework adapter guide: ${resolveAdapterGuideLabel(outputRoot, hostProfile.adapterDoc)}`)
    }
    if (hostProfile.adapterEntryHints.length > 0) {
      console.log(`- candidate host entry files: ${hostProfile.adapterEntryHints.join(', ')}`)
    }
    console.log(`- host adapter snippet: ${hostAdapterSnippetPath}`)
    console.log(`- report: ${reportPath}`)
    console.log(`- smoke report: ${smokeReportPath}`)
    console.log(`- passed: ${summary.passed}`)
    console.log(`- failed: ${summary.failed}`)
    console.log('')

    for (const item of checks) {
      const mark = item.ok ? 'PASS' : item.severity.toUpperCase()
      console.log(`[${mark}] ${item.summary}`)
      if (item.detail) {
        console.log(`  ${item.detail}`)
      }
    }

    console.log('')
    if (status === 'pass') {
      console.log('This project is ready to generate pages following the Figma typical-page rules.')
    } else if (status === 'warn') {
      console.log(
        'Warnings remain. Treat the current page as not delivery-ready until every warning is cleared or proven unrelated to the current page.'
      )
    } else if (status === 'manual') {
      console.log(
        'Manual route or host integration work is still blocking delivery. Do not treat the current page as complete yet.'
      )
    } else {
      console.log('Do not continue generating business pages yet. Fix the hard failures first.')
      process.exit(1)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`typical-page-doctor failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

await main()
