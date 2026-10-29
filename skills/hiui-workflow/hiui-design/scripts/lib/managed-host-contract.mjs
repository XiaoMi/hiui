import fs from 'node:fs/promises'
import path from 'node:path'
import { detectHostProfile } from './detect-host-profile.mjs'
import { getManagedLocalRuntimeHostLogicalSource } from './managed-local-runtime-contract.mjs'
import {
  hasExplicitLegacyReactRuntimeImport,
  shouldPreserveExplicitReactImport,
  sourceNeedsExplicitLegacyReactRuntimeImport,
} from './legacy-react-runtime.mjs'

export const MANAGED_HOST_CONTRACT_SCHEMA = 'hiui-design-managed-host-contract.v1'
export const MANAGED_HOST_CONTRACT_KIND = 'managed-isolated-mf-host-shell'
export const MANAGED_HOST_HEIGHT_CONTRACT_MODES = {
  STRICT_FLEX_CHAIN: 'strict-flex-chain',
  VIEWPORT_ADAPTIVE_LEGACY_MF: 'viewport-adaptive-legacy-mf',
}
export const MANAGED_HOST_CONTRACT_CANDIDATES = [
  'src/business-shell/hiui-managed-host.contract.json',
  'src/business-layout/hiui-managed-host.contract.json',
  'src/layout/hiui-managed-host.contract.json',
  'src/layouts/hiui-managed-host.contract.json',
]
const MANAGED_HOST_IMPORT_SOURCE = getManagedLocalRuntimeHostLogicalSource()

function normalizeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeRelativePath(value) {
  return normalizeString(value).replace(/\\/g, '/')
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

async function firstExistingPath(targetRoot, candidates) {
  for (const relativePath of candidates) {
    const absolutePath = path.join(targetRoot, relativePath)
    if (await pathExists(absolutePath)) return absolutePath
  }

  return ''
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

function hasViewportAdaptiveCompatMarker(source = '') {
  return (
    source.includes('data-hiui-height-contract="viewport-adaptive-legacy-mf"') ||
    source.includes("data-hiui-height-contract='viewport-adaptive-legacy-mf'")
  )
}

function hasLegacyViewportAdaptiveMinHeight(source = '') {
  return (
    /min-height\s*:\s*['"]?calc\(100vh\s*-\s*60px\)['"]?/i.test(source) ||
    /(?:^|[^\w$])['"]?minHeight['"]?\s*:\s*['"]calc\(100vh\s*-\s*60px\)['"]/i.test(source) ||
    /height\s*:\s*['"]?calc\(100vh\s*-\s*60px\)['"]?/i.test(source) ||
    /(?:^|[^\w$])['"]?height['"]?\s*:\s*['"]calc\(100vh\s*-\s*60px\)['"]/i.test(source)
  )
}

function hasDynamicViewportAdaptiveMinHeight(source = '') {
  const hasViewportVarFallback =
    /min-height\s*:\s*['"]?var\(--hiui-managed-mf-viewport-height,\s*calc\(100vh\s*-\s*60px\)\)['"]?/i.test(
      source
    ) ||
    /(?:^|[^\w$])['"]?minHeight['"]?\s*:\s*['"]var\(--hiui-managed-mf-viewport-height,\s*calc\(100vh\s*-\s*60px\)\)['"]/i.test(
      source
    ) ||
    /height\s*:\s*['"]?var\(--hiui-managed-mf-viewport-height,\s*calc\(100vh\s*-\s*60px\)\)['"]?/i.test(
      source
    ) ||
    /(?:^|[^\w$])['"]?height['"]?\s*:\s*['"]var\(--hiui-managed-mf-viewport-height,\s*calc\(100vh\s*-\s*60px\)\)['"]/i.test(
      source
    )
  const hasRuntimeHeightSync =
    source.includes('--hiui-managed-mf-viewport-height') &&
    source.includes('getBoundingClientRect().top') &&
    source.includes("style.setProperty(MANAGED_VIEWPORT_HEIGHT_VAR") &&
    source.includes('window.visualViewport')

  return hasViewportVarFallback && hasRuntimeHeightSync
}

function hasViewportAdaptiveHeightContract(source = '') {
  const hasFlexDisplay = /display\s*:\s*['"]?flex['"]?/i.test(source)
  const hasColumnDirection =
    /flex-direction\s*:\s*column/i.test(source) ||
    /(?:^|[^\w$])['"]?flexDirection['"]?\s*:\s*['"]?column['"]?/i.test(source)
  const hasHiddenOverflow = /overflow\s*:\s*['"]?hidden['"]?/i.test(source)
  const hasViewportMinHeight =
    hasLegacyViewportAdaptiveMinHeight(source) || hasDynamicViewportAdaptiveMinHeight(source)

  return (
    hasFlexDisplay &&
    hasColumnDirection &&
    hasHiddenOverflow &&
    hasViewportMinHeight &&
    hasViewportAdaptiveCompatMarker(source)
  )
}

function normalizeManagedHostHeightContractMode(value = '') {
  const normalized = normalizeString(value)
  if (
    normalized === MANAGED_HOST_HEIGHT_CONTRACT_MODES.VIEWPORT_ADAPTIVE_LEGACY_MF
  ) {
    return MANAGED_HOST_HEIGHT_CONTRACT_MODES.VIEWPORT_ADAPTIVE_LEGACY_MF
  }
  return MANAGED_HOST_HEIGHT_CONTRACT_MODES.STRICT_FLEX_CHAIN
}

function importsManagedLocalHostAppFrameCore(source = '') {
  return /TypicalPageAppFrameCore/.test(source) && /from\s+['"]\.\/app-frame-core['"]/.test(source)
}

function stripScriptModuleExtension(value = '') {
  return String(value || '').replace(/\.(?:[cm]?[jt]sx?)$/, '')
}

function ensureRelativeImportPath(value) {
  const normalized = normalizeRelativePath(value)
  if (!normalized) return './'
  return normalized.startsWith('.') ? normalized : `./${normalized}`
}

function createMissingManagedHostContractInspection() {
  return {
    status: 'missing',
    contractPath: '',
    contractRelativePath: '',
    contract: null,
    errors: [],
    reason:
      'No managed host contract file was found. Falling back to legacy source heuristics for formal host detection.',
    evidenceFiles: [],
  }
}

function createInvalidManagedHostContractInspection({
  contractPath = '',
  contractRelativePath = '',
  contract = null,
  errors = [],
}) {
  return {
    status: 'invalid',
    contractPath,
    contractRelativePath,
    contract,
    errors,
    reason:
      errors.length > 0
        ? `Managed host contract ${contractRelativePath || contractPath || '(unknown)'} is invalid: ${errors.join(' ')}`
        : `Managed host contract ${contractRelativePath || contractPath || '(unknown)'} is invalid.`,
    evidenceFiles: [],
  }
}

function buildContractFacts({
  shellPath = '',
  corePath = '',
  hostResetPath = '',
  publishEntryPath = '',
  contentOutletPath = 'official-shell-root',
  scrollOwner = 'official-shell-root',
  rightViewportGutterPx = 16,
  heightContractMode = MANAGED_HOST_HEIGHT_CONTRACT_MODES.STRICT_FLEX_CHAIN,
}) {
  const evidenceFiles = [shellPath, corePath, hostResetPath, publishEntryPath].filter(Boolean)
  const hasContentGutterContract = rightViewportGutterPx >= 16

  return {
    hasHeaderPortalCarrier: false,
    headerPortalCarrierFiles: [],
    hasCollapsibleSharedHeaderSlot: false,
    collapsibleSharedHeaderSlotFiles: [],
    hasTypicalPageHostBridge: false,
    typicalPageHostBridgeFiles: [],
    hasOfficialShellHeightContract: true,
    officialShellHeightContractFiles: [corePath].filter(Boolean),
    contentOutletPath,
    scrollOwner,
    heightContractMode,
    rightViewportGutterPx,
    leftGapPxWhenMenuCollapsed: hasContentGutterContract ? 16 : 0,
    hasContentOutletHeightContract: true,
    contentOutletHeightContractFiles: [corePath].filter(Boolean),
    hasContentGutterContract,
    contentGutterFiles: hasContentGutterContract ? [corePath].filter(Boolean) : [],
    hasCertifiedHostShell: true,
    certifiedHostShellFiles: [shellPath, corePath].filter(Boolean),
    evidenceFiles,
  }
}

export async function inspectManagedHostContract(targetRoot, options = {}) {
  const hostProfile =
    options?.hostProfile ||
    (await detectHostProfile(targetRoot, {
      ignoreRelativePaths: ['src/typical-page-preview'],
    }))
  const contractPath = await firstExistingPath(targetRoot, MANAGED_HOST_CONTRACT_CANDIDATES)
  if (!contractPath) return createMissingManagedHostContractInspection()

  const contractRelativePath = path.relative(targetRoot, contractPath).replace(/\\/g, '/')
  let contract = null
  try {
    contract = JSON.parse(await fs.readFile(contractPath, 'utf8'))
  } catch (error) {
    return createInvalidManagedHostContractInspection({
      contractPath,
      contractRelativePath,
      errors: [`Failed to parse JSON: ${error.message}`],
    })
  }

  const schema = normalizeString(contract?.schema)
  const kind = normalizeString(contract?.kind)
  const layoutMode = normalizeString(contract?.layoutMode)
  const shellPath = normalizeRelativePath(contract?.shellPath)
  const corePath = normalizeRelativePath(contract?.corePath)
  const hostResetPath = normalizeRelativePath(contract?.hostResetPath)
  const headerSlotPolicy = normalizeString(contract?.headerSlotPolicy)
  const managedHostImportSource = normalizeString(contract?.managedHostImportSource)
  const deliveryUnitKind = normalizeString(contract?.deliveryUnitKind)
  const publishEntryPath = normalizeRelativePath(contract?.publishEntryPath)
  const contentOutletPath = normalizeString(contract?.contentOutletPath) || 'official-shell-root'
  const scrollOwner = normalizeString(contract?.scrollOwner) || 'official-shell-root'
  const continuousHeightChain = contract?.continuousHeightChain === true
  const declaredHeightContractMode = normalizeManagedHostHeightContractMode(
    contract?.heightContractMode
  )
  const wrapsPageWithBusinessShell = contract?.wrapsPageWithBusinessShell === true
  const rightViewportGutterPx = Number.isFinite(contract?.rightViewportGutterPx)
    ? Number(contract.rightViewportGutterPx)
    : 0
  const errors = []

  if (schema !== MANAGED_HOST_CONTRACT_SCHEMA) {
    errors.push(`schema must be ${MANAGED_HOST_CONTRACT_SCHEMA}.`)
  }
  if (kind !== MANAGED_HOST_CONTRACT_KIND) {
    errors.push(`kind must be ${MANAGED_HOST_CONTRACT_KIND}.`)
  }
  if (layoutMode !== 'self-contained-hiui-shell') {
    errors.push("layoutMode must be 'self-contained-hiui-shell'.")
  }
  if (!shellPath) errors.push('shellPath is required.')
  if (!corePath) errors.push('corePath is required.')
  if (!hostResetPath) errors.push('hostResetPath is required.')
  if (headerSlotPolicy !== 'no-header-slot') {
    errors.push("headerSlotPolicy must be 'no-header-slot'.")
  }
  if (continuousHeightChain !== true) {
    errors.push('continuousHeightChain must be true.')
  }
  if (managedHostImportSource !== MANAGED_HOST_IMPORT_SOURCE) {
    errors.push(`managedHostImportSource must be '${MANAGED_HOST_IMPORT_SOURCE}'.`)
  }
  if (deliveryUnitKind !== 'module-federation-direct-expose') {
    errors.push("deliveryUnitKind must be 'module-federation-direct-expose'.")
  }
  if (!publishEntryPath) errors.push('publishEntryPath is required.')
  if (wrapsPageWithBusinessShell !== true) {
    errors.push('wrapsPageWithBusinessShell must be true.')
  }
  if (!(rightViewportGutterPx >= 16)) {
    errors.push('rightViewportGutterPx must be at least 16.')
  }

  const absoluteShellPath = shellPath ? path.join(targetRoot, shellPath) : ''
  const absoluteCorePath = corePath ? path.join(targetRoot, corePath) : ''
  const absoluteHostResetPath = hostResetPath ? path.join(targetRoot, hostResetPath) : ''
  const absolutePublishEntryPath = publishEntryPath ? path.join(targetRoot, publishEntryPath) : ''
  const shellExists = absoluteShellPath ? await pathExists(absoluteShellPath) : false
  const coreExists = absoluteCorePath ? await pathExists(absoluteCorePath) : false
  const hostResetExists = absoluteHostResetPath ? await pathExists(absoluteHostResetPath) : false
  const publishEntryExists = absolutePublishEntryPath ? await pathExists(absolutePublishEntryPath) : false

  if (shellPath && !shellExists) errors.push(`shellPath ${shellPath} does not exist.`)
  if (corePath && !coreExists) errors.push(`corePath ${corePath} does not exist.`)
  if (hostResetPath && !hostResetExists) errors.push(`hostResetPath ${hostResetPath} does not exist.`)
  if (publishEntryPath && !publishEntryExists) {
    errors.push(`publishEntryPath ${publishEntryPath} does not exist.`)
  }

  const shellSource = shellExists ? await readTextIfExists(absoluteShellPath) : ''
  const coreSource = coreExists ? await readTextIfExists(absoluteCorePath) : ''
  const publishEntrySource = publishEntryExists ? await readTextIfExists(absolutePublishEntryPath) : ''
  const inferredHeightContractMode = hasViewportAdaptiveHeightContract(coreSource)
    ? MANAGED_HOST_HEIGHT_CONTRACT_MODES.VIEWPORT_ADAPTIVE_LEGACY_MF
    : declaredHeightContractMode
  const requiresLegacyReactRuntimeImport = shouldPreserveExplicitReactImport(hostProfile)
  const legacyReactRuntimeDetail =
    hostProfile.legacyReactRuntime === true && Number(hostProfile.reactMajor || 0) > 0
      ? `for the legacy React ${hostProfile.reactMajor} classic JSX runtime`
      : 'for the detected classic JSX runtime'

  if (shellSource) {
    if (!shellSource.includes('official-managed-host-shell-wrapper')) {
      errors.push(
        `shellPath ${shellPath} must declare hiuiDesignFormalShell='official-managed-host-shell-wrapper'.`
      )
    }
    if (!importsManagedLocalHostAppFrameCore(shellSource)) {
      errors.push(`shellPath ${shellPath} must import a local ./app-frame-core thin wrapper.`)
    }
    if (
      requiresLegacyReactRuntimeImport &&
      sourceNeedsExplicitLegacyReactRuntimeImport(shellSource) &&
      !hasExplicitLegacyReactRuntimeImport(shellSource)
    ) {
      errors.push(`shellPath ${shellPath} must explicitly import React ${legacyReactRuntimeDetail}.`)
    }
  }

  if (coreSource) {
    if (!coreSource.includes('TypicalPageHostProvider')) {
      errors.push(`corePath ${corePath} must import or render TypicalPageHostProvider.`)
    }
    const heightContractIsValid =
      inferredHeightContractMode === MANAGED_HOST_HEIGHT_CONTRACT_MODES.VIEWPORT_ADAPTIVE_LEGACY_MF
        ? hasViewportAdaptiveHeightContract(coreSource)
        : hasFlexMinHeightOverflowContract(coreSource)
    if (!heightContractIsValid) {
      errors.push(
        inferredHeightContractMode === MANAGED_HOST_HEIGHT_CONTRACT_MODES.VIEWPORT_ADAPTIVE_LEGACY_MF
          ? `corePath ${corePath} must prove the viewport-adaptive legacy MF height contract.`
          : `corePath ${corePath} must prove a continuous flex/min-height/overflow height-chain contract.`
      )
    }
    if (
      requiresLegacyReactRuntimeImport &&
      sourceNeedsExplicitLegacyReactRuntimeImport(coreSource) &&
      !hasExplicitLegacyReactRuntimeImport(coreSource)
    ) {
      errors.push(`corePath ${corePath} must explicitly import React ${legacyReactRuntimeDetail}.`)
    }
  }

  if (publishEntrySource) {
    const expectedShellImportPath = ensureRelativeImportPath(
      stripScriptModuleExtension(path.posix.relative(path.posix.dirname(publishEntryPath), shellPath))
    )
    if (!publishEntrySource.includes('BusinessShell')) {
      errors.push(`publishEntryPath ${publishEntryPath} must wrap the page with BusinessShell.`)
    }
    if (!publishEntrySource.includes(expectedShellImportPath)) {
      errors.push(
        `publishEntryPath ${publishEntryPath} must import the managed shell from ${expectedShellImportPath}.`
      )
    }
    if (
      requiresLegacyReactRuntimeImport &&
      sourceNeedsExplicitLegacyReactRuntimeImport(publishEntrySource) &&
      !hasExplicitLegacyReactRuntimeImport(publishEntrySource)
    ) {
      errors.push(
        `publishEntryPath ${publishEntryPath} must explicitly import React ${legacyReactRuntimeDetail}.`
      )
    }
  }

  if (errors.length > 0) {
    return createInvalidManagedHostContractInspection({
      contractPath,
      contractRelativePath,
      contract,
      errors,
    })
  }

  return {
    status: 'valid',
    contractPath,
    contractRelativePath,
    contract,
    errors: [],
    reason: `Managed host contract ${contractRelativePath} is valid and bound to a self-contained managed Module Federation host shell.`,
    evidenceFiles: [contractRelativePath, shellPath, corePath, hostResetPath, publishEntryPath].filter(
      Boolean
    ),
    facts: buildContractFacts({
      shellPath,
      corePath,
      hostResetPath,
      publishEntryPath,
      contentOutletPath,
      scrollOwner,
      rightViewportGutterPx,
      heightContractMode: inferredHeightContractMode,
    }),
  }
}

export function getManagedHostContractCandidatePaths() {
  return [...MANAGED_HOST_CONTRACT_CANDIDATES]
}
