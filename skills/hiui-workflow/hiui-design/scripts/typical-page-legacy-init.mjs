#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { writeProjectIntegrationState } from './lib/project-integration-state.mjs'
import { collectLegacyRuntimePeerResolution } from './lib/legacy-runtime-peer-resolution.mjs'
import { buildRuntimeSeal, writeRuntimeSeal } from './lib/legacy-runtime-provenance.mjs'
import { isVersionRangeAtLeast } from './lib/semver-range-compat.mjs'

const DEFAULT_HOST_PACK_ID = 'asp-fwt-common-front'
const HOST_CONTRACT_RELATIVE_PATH = '.local-context/hiui-design/host-contract.json'
const RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH = '.local-context/hiui-design/outputs/runtime-compatibility-lock.json'
const LEGACY_RUNTIME_SOURCE_DIR = 'runtime/legacy/src'
const RUNTIME_TARGET_DIR = 'src/hiui-runtime'
const LEGACY_DELIVERY_POLICY_PATH = 'rules/legacy-page-type-delivery-policy.json'
const REQUIRED_ADAPTERS = ['request', 'message', 'permission', 'route', 'theme']
const SHELL_SNAPSHOT_RELATIVE_PATH = 'vendor/typical-page-shells-package.json'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-legacy-init.mjs" [--target <project-root>] [--host-pack <id>] [--force] [--json]

Default behavior:
  - create .local-context/hiui-design/host-contract.json from a maintained host pack
  - create one-time src/hiui-runtime HiuiLegacyPage runtime mirror and typed PageSpec assets
  - do not create src/page-components or page-level carrier assets
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    hostPack: DEFAULT_HOST_PACK_ID,
    force: false,
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--force') {
      options.force = true
      continue
    }

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--target' || arg === '--host-pack' || arg === '--line') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--host-pack') options.hostPack = value
      index += 1
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

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, 'utf8'))
}

async function readJsonIfExists(filePath) {
  if (!(await pathExists(filePath))) return null
  return readJson(filePath)
}

async function writeTextIfAllowed(filePath, content, { force }) {
  const existed = await pathExists(filePath)
  if (existed && !force) {
    return { path: filePath, status: 'unchanged' }
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf8')
  return { path: filePath, status: existed ? 'overwritten' : 'written' }
}

async function writeJsonIfAllowed(filePath, value, options) {
  return writeTextIfAllowed(filePath, `${JSON.stringify(value, null, 2)}\n`, options)
}

function normalizeAdapterFact(adapterName, rawFact) {
  const status = String(rawFact?.status || '').trim()
  const normalizedStatus = ['ready', 'missing', 'partial', 'not-required'].includes(status)
    ? status
    : 'partial'
  const source = String(rawFact?.source || '').trim() || 'host-pack:init-required'
  const notes = String(rawFact?.notes || '').trim()
  const fact = {
    status: normalizedStatus,
    source,
  }

  if (notes) {
    fact.notes = notes
  }

  if (!rawFact || typeof rawFact !== 'object') {
    fact.source = `host-pack:${adapterName}:missing-consumption-fact`
  }

  return fact
}

function buildHostAdapters(hostPack) {
  const consumption = hostPack.adapterConsumption || {}
  const adapters = {}

  for (const adapterName of REQUIRED_ADAPTERS) {
    adapters[adapterName] = normalizeAdapterFact(adapterName, consumption[adapterName])
  }

  adapters.i18n = normalizeAdapterFact('i18n', {
    status: 'not-required',
    source: 'host-pack:init-default',
  })

  return adapters
}

function findDeclaredDependency(pkg, depName) {
  return String(
    pkg?.dependencies?.[depName] ||
      pkg?.devDependencies?.[depName] ||
      pkg?.peerDependencies?.[depName] ||
      ''
  ).trim()
}

function resolveShellCompatibility({ reactSpec, shellSnapshot }) {
  const legacyCompatibility = shellSnapshot?.legacyCompatibility || {}
  const minimumLegacyReactSpec = String(legacyCompatibility.targetReactRange || '>=16.8.0').trim()
  const minimumModernReactSpec = String(shellSnapshot?.peerDependencies?.react || '>=16.14.0').trim()
  const legacyVendoredTarball = String(legacyCompatibility.legacyVendoredTarball || '').trim()
  const currentTarballContainsJsxRuntime = Boolean(
    legacyCompatibility.currentVendoredTarballContainsReactJsxRuntime
  )

  if (!reactSpec) {
    return {
      status: 'unknown',
      shellRuntimeVariant: 'unknown',
      compatibleWithCurrentVendoredTarball: false,
      compatibleWithLegacyVendoredTarball: Boolean(legacyVendoredTarball),
      blockingReasons: ['target package.json does not declare react; shell runtime variant cannot be proven automatically'],
    }
  }

  if (!isVersionRangeAtLeast(reactSpec, minimumLegacyReactSpec)) {
    return {
      status: 'blocked',
      shellRuntimeVariant: 'unsupported-react',
      compatibleWithCurrentVendoredTarball: false,
      compatibleWithLegacyVendoredTarball: false,
      blockingReasons: [`react ${reactSpec} is below the legacy shell minimum ${minimumLegacyReactSpec}`],
    }
  }

  if (isVersionRangeAtLeast(reactSpec, minimumModernReactSpec)) {
    return {
      status: 'ready',
      shellRuntimeVariant: 'modern',
      compatibleWithCurrentVendoredTarball: true,
      compatibleWithLegacyVendoredTarball: Boolean(legacyVendoredTarball),
      blockingReasons: [],
    }
  }

  return {
    status: legacyVendoredTarball ? 'ready' : 'blocked',
    shellRuntimeVariant: 'legacy',
    compatibleWithCurrentVendoredTarball: !currentTarballContainsJsxRuntime,
    compatibleWithLegacyVendoredTarball: Boolean(legacyVendoredTarball),
    blockingReasons: legacyVendoredTarball
      ? []
      : [`react ${reactSpec} requires a legacy shell tarball, but legacyCompatibility.legacyVendoredTarball is not configured`],
  }
}

function collectAdapterStatuses(hostContract) {
  const statuses = {}
  for (const adapterName of REQUIRED_ADAPTERS) {
    statuses[adapterName] = String(hostContract.adapters?.[adapterName]?.status || '').trim() || 'missing'
  }
  return statuses
}

async function writeRuntimeCompatibilityLock({ targetRoot, skillRoot, hostPackId, hostContract, projectIntegrationState }) {
  const targetPkg = await readJsonIfExists(path.join(targetRoot, 'package.json'))
  const shellSnapshot = await readJson(path.join(skillRoot, SHELL_SNAPSHOT_RELATIVE_PATH))
  const reactSpec = findDeclaredDependency(targetPkg, 'react')
  const reactDomSpec = findDeclaredDependency(targetPkg, 'react-dom')
  const shellCompatibility = resolveShellCompatibility({ reactSpec, shellSnapshot })
  const peerResolution = await collectLegacyRuntimePeerResolution({ targetRoot })
  const shellStatus = shellCompatibility.status === 'blocked' || peerResolution.status === 'blocked'
    ? 'blocked'
    : shellCompatibility.status
  const shellBlockingReasons = [
    ...shellCompatibility.blockingReasons,
    ...(peerResolution.status === 'blocked' ? peerResolution.blockingReasons : []),
  ]
  const lockPath = path.join(targetRoot, RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH)
  const lock = {
    schemaVersion: 'runtime-compatibility-lock.v1',
    mode: 'legacy-host-compatible',
    hostPack: hostPackId,
    react: {
      spec: reactSpec,
      reactDomSpec,
    },
    shell: {
      packageName: shellSnapshot.name,
      version: shellSnapshot.version,
      runtimeVariant: shellCompatibility.shellRuntimeVariant,
      status: shellStatus,
      currentVendoredTarball: shellSnapshot.runtimeDelivery?.vendoredTarball || '',
      legacyVendoredTarball: shellSnapshot.legacyCompatibility?.legacyVendoredTarball || '',
      compatibleWithCurrentVendoredTarball: shellCompatibility.compatibleWithCurrentVendoredTarball,
      compatibleWithLegacyVendoredTarball: shellCompatibility.compatibleWithLegacyVendoredTarball,
      blockingReasons: shellBlockingReasons,
    },
    peerResolution,
    adapters: collectAdapterStatuses(hostContract),
    runtime: {
      dir: RUNTIME_TARGET_DIR,
      projectIntegrationReady: Boolean(projectIntegrationState?.runtimeIntegrationReady),
      legacyContractReady: Boolean(projectIntegrationState?.legacyContractReady),
      legacyRuntimeSurfaceReady: Boolean(projectIntegrationState?.legacyRuntimeSurfaceReady),
    },
  }

  await fs.mkdir(path.dirname(lockPath), { recursive: true })
  await fs.writeFile(lockPath, `${JSON.stringify(lock, null, 2)}\n`, 'utf8')
  return {
    path: lockPath,
    relativePath: RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH,
    lock,
  }
}

async function collectFiles(rootDir) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)))
    } else if (entry.isFile()) {
      files.push(entryPath)
    }
  }

  return files
}

function buildHostContract(hostPack) {
  const constraints = hostPack.stableConstraints || {}
  const runtime = constraints.runtime || {}
  const mounting = constraints.mounting || {}
  const ownership = constraints.ownership || {}

  return {
    schemaVersion: 'host-contract.v1',
    mode: 'legacy-host-compatible',
    hostId: hostPack.hostId,
    source: hostPack.sourceDoc || '',
    reactRuntime: {
      packageName: 'react',
      versionRange: runtime.reactHost || 'legacy-react',
      major: 16,
    },
    hiuiRuntime: {
      rootPackage: runtime.rootHiuiPackage || '@hi-ui/hiui',
      rootVersionRange: runtime.rootHiuiMajor ? `${runtime.rootHiuiMajor}.x` : 'legacy',
      hiui5Alias: runtime.hiui5Alias || '',
    },
    contentMount: {
      selector: '[data-hiui-legacy-content-mount]',
      owner: mounting.contentMountOwner === 'host' ? 'host' : 'hiui-page-boundary',
      notes: mounting.businessPageScope || '',
    },
    routeOwner: 'host',
    outerPaddingOwner: ownership.singleOwnerRequired ? 'host' : 'none',
    whiteBodyOwner: 'typical-page-shell',
    mainScrollOwner: 'typical-page-shell',
    portalRoot: {
      selector: '[data-hiui-legacy-portal-root]',
      owner: 'hiui-page-boundary',
    },
    styleBoundary: {
      scopeAttribute: 'data-hiui-page-root',
      tokenSource: 'src/hiui-runtime/styles.css',
      globalCssIsolation: true,
    },
    adapters: buildHostAdapters(hostPack),
  }
}

function buildLegacyHostFamilySummary(hostPack) {
  return {
    status: 'matched',
    mode: 'legacy-host-compatible',
    hostFamilyId: hostPack.hostId || '',
    familyStatus: hostPack.certificationStatus || hostPack.status || 'matched',
    confidence: hostPack.confidence || 'medium',
    adapterPackId: hostPack.adapterPackId || hostPack.hostId || '',
    matchedEvidence: [hostPack.sourceDoc || 'host-pack'].filter(Boolean),
    missingFacts: [],
    blockingReasons: [],
  }
}

function buildLegacyDeliveryPolicySummary(policy) {
  const pageTypes = Array.isArray(policy.pageTypes) ? policy.pageTypes : []
  const runtimeSurfaceRequiredPageTypes = Array.isArray(policy.runtimeSurfaceRequiredPageTypes)
    ? policy.runtimeSurfaceRequiredPageTypes
    : pageTypes
        .filter((pageType) => pageType?.deliveryPolicy === 'compiled-pagespec-runtime-required')
        .map((pageType) => pageType.pageTypeId)
        .filter(Boolean)

  return {
    status: 'ready',
    factPath: LEGACY_DELIVERY_POLICY_PATH,
    runtimeSurfaceRequiredPageTypes,
    runtimeSurfaceOptionalPageTypes: [],
    deferredLegacyPageTypes: Array.isArray(policy.deferredLegacyPageTypes) ? policy.deferredLegacyPageTypes : [],
    runtimeSurfaceCoveredPageTypes: runtimeSurfaceRequiredPageTypes,
    missingRuntimeSurfacePageTypes: [],
    legacyRolloutCoverageStatus: 'ready',
    pageTypes: pageTypes.map((pageType) => ({
      pageTypeId: String(pageType?.pageTypeId || '').trim(),
      deliveryPolicy: String(pageType?.deliveryPolicy || '').trim(),
      reason: String(pageType?.reason || '').trim(),
      policyStatus: 'ready',
      supportStatus: 'ready',
      selectedDeliveryKind: 'legacy-lightweight-contract',
      selectedComponentId: `${String(pageType?.pageTypeId || '').trim()}.legacy-runtime-surface.v1`,
      projectCarrierStatus: 'not-applicable',
      standardComponentStatus: 'ready',
      blockingReasons: [],
    })),
    blockingReasons: [],
  }
}

async function runLegacyInit(argv) {
  const options = parseArgs(argv)
  const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const hostPackPath = path.join(skillRoot, 'host-packs', `${options.hostPack}.json`)

  if (!(await pathExists(hostPackPath))) {
    throw new Error(`Unknown host pack: ${options.hostPack}`)
  }

  const hostPack = await readJson(hostPackPath)
  const legacyDeliveryPolicy = await readJson(path.join(skillRoot, LEGACY_DELIVERY_POLICY_PATH))
  if (hostPack.mode !== 'legacy-host-compatible') {
    throw new Error(`Host pack ${options.hostPack} is not legacy-host-compatible`)
  }

  const writes = []
  const hostContract = buildHostContract(hostPack)
  writes.push(
    await writeJsonIfAllowed(
      path.join(options.target, HOST_CONTRACT_RELATIVE_PATH),
      hostContract,
      { force: options.force }
    )
  )

  const runtimeSourceRoot = path.join(skillRoot, LEGACY_RUNTIME_SOURCE_DIR)
  const runtimeFiles = await collectFiles(runtimeSourceRoot)

  for (const sourcePath of runtimeFiles) {
    const relativeRuntimePath = path.relative(runtimeSourceRoot, sourcePath)
    const targetPath = path.join(options.target, RUNTIME_TARGET_DIR, relativeRuntimePath)
    const content = await fs.readFile(sourcePath, 'utf8')
    writes.push(await writeTextIfAllowed(targetPath, content, { force: options.force }))
  }
  const runtimeSeal = await writeRuntimeSeal({
    targetRoot: options.target,
    seal: await buildRuntimeSeal({
      targetRoot: options.target,
      skillRoot,
      runtimeSourceDir: LEGACY_RUNTIME_SOURCE_DIR,
      runtimeTargetDir: RUNTIME_TARGET_DIR,
    }),
  })

  await writeRuntimeCompatibilityLock({
    targetRoot: options.target,
    skillRoot,
    hostPackId: options.hostPack,
    hostContract,
    projectIntegrationState: null,
  })
  const projectIntegrationResult = await writeProjectIntegrationState({
    targetRoot: options.target,
    mode: 'legacy-host-compatible',
    recommendedMode: 'legacy-host-compatible',
    source: 'typical-page:legacy:init',
    hostProfile: {
      projectType: 'existing-system',
      framework: 'legacy-host',
      runtime: 'legacy-react',
      routing: 'host-router',
      strategy: 'compat',
    },
    legacyHostFamilySummary: buildLegacyHostFamilySummary(hostPack),
    legacyDeliveryPolicySummary: buildLegacyDeliveryPolicySummary(legacyDeliveryPolicy),
  })
  const runtimeCompatibilityLock = await writeRuntimeCompatibilityLock({
    targetRoot: options.target,
    skillRoot,
    hostPackId: options.hostPack,
    hostContract,
    projectIntegrationState: projectIntegrationResult.state,
  })

  const forbiddenPageComponentsDir = path.join(options.target, 'src', 'page-components')
  const result = {
    schemaVersion: 'legacy-init-result.v1',
    status: runtimeCompatibilityLock.lock.shell.status === 'blocked' ? 'blocked' : 'ready',
    hostPack: options.hostPack,
    hostContractPath: HOST_CONTRACT_RELATIVE_PATH,
    runtimeDir: RUNTIME_TARGET_DIR,
    runtimeCompatibilityLock: runtimeCompatibilityLock.relativePath,
    runtimeSeal: runtimeSeal.relativePath,
    shellRuntimeVariant: runtimeCompatibilityLock.lock.shell.runtimeVariant,
    shellRuntimeStatus: runtimeCompatibilityLock.lock.shell.status,
    projectIntegrationState: projectIntegrationResult.relativePath,
    projectIntegrationReady: projectIntegrationResult.state.runtimeIntegrationReady,
    legacyContractReady: projectIntegrationResult.state.legacyContractReady,
    legacyRuntimeSurfaceReady: projectIntegrationResult.state.legacyRuntimeSurfaceReady,
    wroteSrcPageComponents: false,
    srcPageComponentsExists: await pathExists(forbiddenPageComponentsDir),
    files: writes.map((write) => ({
      path: path.relative(options.target, write.path).replace(/\\/g, '/'),
      status: write.status,
    })),
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log('[hiui-design][typical-page:legacy:init]')
    console.log(`- host pack: ${result.hostPack}`)
    console.log(`- host contract: ${result.hostContractPath}`)
    console.log(`- runtime dir: ${result.runtimeDir}`)
    console.log(`- runtime compatibility lock: ${result.runtimeCompatibilityLock}`)
    console.log(`- runtime seal: ${result.runtimeSeal}`)
    console.log(`- shell runtime: ${result.shellRuntimeVariant} (${result.shellRuntimeStatus})`)
    console.log(`- project integration state: ${result.projectIntegrationState}`)
    console.log(`- project integration ready: ${result.projectIntegrationReady}`)
    console.log(`- wrote src/page-components: ${result.wroteSrcPageComponents}`)
    for (const file of result.files) {
      console.log(`- ${file.status}: ${file.path}`)
    }
  }

  return result
}

runLegacyInit(process.argv.slice(2)).catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[typical-page:legacy:init] ${message}`)
  process.exit(1)
})
