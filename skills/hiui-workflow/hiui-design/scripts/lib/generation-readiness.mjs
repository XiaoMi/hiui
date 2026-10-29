import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  buildDirectoryTokens,
  detectBusinessEntryEvidence,
  findAddPageCalls,
  findModuleFederationConfigs,
  normalizeBusinessEntryRoutePath,
  scoreBusinessEntryEvidence,
  tokenizeBusinessEntryText,
} from './business-entry-evidence.mjs'
import { detectHostProfile } from './detect-host-profile.mjs'
import { buildExistingRouteRegistryMountAction } from './host-adapters/existing-route-registry.mjs'
import { buildFormalShellEntryMountAction } from './host-adapters/formal-shell-entry.mjs'
import { buildImplicitFeatureRegistryMountAction } from './host-adapters/implicit-feature-registry.mjs'
import { buildLegacyBusinessEntryMountAction } from './host-adapters/legacy-business-entry.mjs'
import { inspectLegacyReactCompatibilityClosure } from './legacy-react-compat-closure.mjs'
import {
  getManagedLocalRuntimeHostLogicalSource,
  getManagedLocalRuntimeRoot,
} from './managed-local-runtime-contract.mjs'
import { isRecognizedInstallMode } from './mode-contract.mjs'
import { inspectNodeRuntimePolicy } from './node-runtime-policy.mjs'
import { inspectInstalledReact19RuntimePatchCoverage } from './react19-runtime-patch-health.mjs'
import { recordScanEvent } from './scan-trace.mjs'
import { getContextScriptPath } from './skill-identity.mjs'

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const BUSINESS_ENTRY_AMBIGUITY_SCORE_THRESHOLD = 120
const BUSINESS_ROOT_CANDIDATES = new Set(['src/views', 'src/pages', 'src/features'])
const LEGACY_EXPLICIT_ENTRY_KINDS = new Set(['window.addPage', 'openNewPage'])
const EXPLICIT_BUSINESS_ENTRY_KINDS = new Set([
  ...LEGACY_EXPLICIT_ENTRY_KINDS,
  'module-federation-exposes',
  'module-federation-expose',
])

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeRelativePath(value) {
  return normalizeString(value).replace(/\\/g, '/')
}

function getBusinessRootCandidate(relativePath) {
  const normalized = normalizeRelativePath(relativePath)
  if (!normalized) return ''

  const segments = normalized.split('/').filter(Boolean)
  if (segments.length < 3 || segments[0] !== 'src') return ''

  const root = `${segments[0]}/${segments[1]}`
  return BUSINESS_ROOT_CANDIDATES.has(root) ? root : ''
}

function normalizeStringArray(values) {
  return Array.isArray(values)
    ? [...new Set(values.map((value) => normalizeString(value)).filter(Boolean))]
    : []
}

function cloneJson(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value))
}

function hasRequestedTokenCoverage(requestedTokens, candidateTokens) {
  if (!Array.isArray(requestedTokens) || requestedTokens.length === 0) return false
  const candidateSet = new Set(candidateTokens.map((item) => normalizeString(item).toLowerCase()).filter(Boolean))
  return requestedTokens.every((token) => candidateSet.has(normalizeString(token).toLowerCase()))
}

function hasSharedDirectorySignal(itemPath, dest) {
  const requestedDestTokens = buildDirectoryTokens(dest)
  if (requestedDestTokens.length === 0) return false
  const itemDirTokens = buildDirectoryTokens(itemPath)
  if (itemDirTokens.length === 0) return false
  const requestedSet = new Set(requestedDestTokens)
  return itemDirTokens.some((token) => requestedSet.has(token))
}

function hasExactBusinessEntryRouteMatch(item, routePath = '') {
  const normalizedRoutePath = normalizeBusinessEntryRoutePath(routePath)
  return Boolean(normalizedRoutePath) && item?.routePath === normalizedRoutePath
}

function hasStrongBusinessEntryTitleAndDirectoryMatch(item, { menuTitle = '', dest = '' } = {}) {
  const requestedTitleTokens = tokenizeBusinessEntryText(menuTitle)
  const candidateTitleTokens = [
    ...(Array.isArray(item?.titleTokens) ? item.titleTokens : []),
    ...(Array.isArray(item?.nameTokens) ? item.nameTokens : []),
  ]
  const directorySignalPath = item?.entryPath || item?.sourcePath || item?.path || ''

  return (
    hasRequestedTokenCoverage(requestedTitleTokens, candidateTitleTokens) &&
    hasSharedDirectorySignal(directorySignalPath, dest)
  )
}

function isModuleFederationBusinessEntryKind(kind = '') {
  return kind === 'module-federation-exposes' || kind === 'module-federation-expose'
}

function buildSelectedBusinessEntryLayers(entry = null) {
  const normalizedKind = normalizeString(entry?.kind)
  const normalizedPath = normalizeRelativePath(entry?.path || entry?.entryPath || '')

  const baseResult = {
    selectedLegacyMountEntryPath: '',
    selectedLegacyMountEntryKind: '',
    selectedLegacyBackRoutePath: '',
    selectedLegacyBackTitle: '',
    selectedLegacyBackName: '',
    selectedPublishEntryPath: '',
    selectedPublishEntryKind: '',
  }

  if (!normalizedKind || !normalizedPath) return baseResult

  if (isModuleFederationBusinessEntryKind(normalizedKind)) {
    return {
      ...baseResult,
      selectedPublishEntryPath: normalizedPath,
      selectedPublishEntryKind: normalizedKind,
    }
  }

  return {
    ...baseResult,
    selectedLegacyMountEntryPath: normalizedPath,
    selectedLegacyMountEntryKind: normalizedKind,
  }
}

function mergeSelectedBusinessEntryLayers(...layers) {
  const merged = buildSelectedBusinessEntryLayers()

  for (const layer of layers) {
    if (!layer || typeof layer !== 'object') continue

    if (normalizeRelativePath(layer.selectedLegacyMountEntryPath)) {
      merged.selectedLegacyMountEntryPath = normalizeRelativePath(layer.selectedLegacyMountEntryPath)
    }
    if (normalizeString(layer.selectedLegacyMountEntryKind)) {
      merged.selectedLegacyMountEntryKind = normalizeString(layer.selectedLegacyMountEntryKind)
    }
    if (normalizeRelativePath(layer.selectedPublishEntryPath)) {
      merged.selectedPublishEntryPath = normalizeRelativePath(layer.selectedPublishEntryPath)
    }
    if (normalizeString(layer.selectedPublishEntryKind)) {
      merged.selectedPublishEntryKind = normalizeString(layer.selectedPublishEntryKind)
    }
  }

  return merged
}

function isLegacyExplicitBusinessEntryKind(kind = '') {
  return LEGACY_EXPLICIT_ENTRY_KINDS.has(normalizeString(kind))
}

function buildLegacyMountCandidates(businessEntryEvidence = []) {
  return normalizeStringArray(
    (Array.isArray(businessEntryEvidence) ? businessEntryEvidence : [])
      .filter((item) => isLegacyExplicitBusinessEntryKind(item?.kind))
      .map((item) => {
        const parts = []
        const entryPath = normalizeRelativePath(item?.path)
        const entryKind = normalizeString(item?.kind)
        const routePath = normalizeString(item?.routePath)
        const title = normalizeString(item?.title)
        const name = normalizeString(item?.name)

        if (!entryPath || !entryKind) return ''
        parts.push(`${entryPath} (${entryKind})`)
        if (routePath) parts.push(`entryRoutePath=${routePath}`)
        if (title) parts.push(`entryTitle=${title}`)
        if (name) parts.push(`entryName=${name}`)
        return parts.join(', ')
      })
      .filter(Boolean)
  )
}

function buildLegacyMountContractSuggestion(businessEntryEvidence = []) {
  const candidate = (Array.isArray(businessEntryEvidence) ? businessEntryEvidence : []).find((item) =>
    isLegacyExplicitBusinessEntryKind(item?.kind)
  )
  if (!candidate) return ''

  const suggestion = {
    entryPath: normalizeRelativePath(candidate.path),
    entryKind: normalizeString(candidate.kind),
  }
  const routePath = normalizeString(candidate.routePath)
  const title = normalizeString(candidate.title)
  const name = normalizeString(candidate.name)

  if (routePath) suggestion.entryRoutePath = routePath
  if (title) suggestion.entryTitle = title
  if (name) suggestion.entryName = name

  return JSON.stringify(suggestion)
}

function buildBusinessEntrySelectionBlockReason({
  businessEntryEvidence = [],
  selectedPublishEntry = null,
} = {}) {
  const parts = []
  const publishEntryPath = normalizeRelativePath(
    selectedPublishEntry?.path || selectedPublishEntry?.entryPath || ''
  )
  const publishEntryKind = normalizeString(selectedPublishEntry?.kind)
  const legacyMountCandidates = buildLegacyMountCandidates(businessEntryEvidence)

  if (publishEntryPath && publishEntryKind) {
    parts.push(
      `Only publish entry ${publishEntryPath} (${publishEntryKind}) is confirmed right now; publish entries prove release wiring but do not prove the writable business source directory.`
    )
  }

  parts.push(
    'Business entry evidence was found, but no single writable entry could be selected with enough confidence.'
  )

  if (legacyMountCandidates.length > 0) {
    parts.push(
      `Candidate legacy mount entries were found but not uniquely confirmed yet: ${legacyMountCandidates.join('; ')}.`
    )
    const contractSuggestion = buildLegacyMountContractSuggestion(businessEntryEvidence)
    if (contractSuggestion) {
      parts.push(
        `If one of those is the real mount point, retry with navigationMountContract. Example: ${contractSuggestion}.`
      )
    }
  }

  return parts.join(' ')
}

function resolveSelectedBusinessEntryEvidence(
  businessEntryEvidence,
  { routePath = '', menuTitle = '', dest = '' } = {}
) {
  const candidates = Array.isArray(businessEntryEvidence) ? businessEntryEvidence : []
  const topCandidate = candidates[0]
  const secondCandidate = candidates[1]
  const exactRouteMatches = candidates.filter((item) => hasExactBusinessEntryRouteMatch(item, routePath))
  const strongTitleDirectoryMatches = candidates.filter((item) =>
    hasStrongBusinessEntryTitleAndDirectoryMatch(item, { menuTitle, dest })
  )
  const moduleFederationContractCandidates = candidates.filter(
    (item) => item.kind === 'module-federation-exposes'
  )
  const exactRouteMatchRoots = [...new Set(
    exactRouteMatches
      .map((item) => getBusinessRootCandidate(item?.entryPath || item?.sourcePath || item?.path || ''))
      .filter(Boolean)
  )]
  const destRoot = getBusinessRootCandidate(dest)

  if (!topCandidate) return null
  if (!secondCandidate) return topCandidate

  if (exactRouteMatches.length === 1) {
    return exactRouteMatches[0]
  }

  if (exactRouteMatches.length > 1) {
    const exactStrongMatches = exactRouteMatches.filter((item) =>
      hasStrongBusinessEntryTitleAndDirectoryMatch(item, { menuTitle, dest })
    )
    if (exactStrongMatches.length === 1) {
      return exactStrongMatches[0]
    }

    if (
      moduleFederationContractCandidates.length === 1 &&
      (exactRouteMatchRoots.length === 0 ||
        exactRouteMatchRoots.length === 1 ||
        (destRoot && exactRouteMatchRoots.every((root) => root === destRoot)))
    ) {
      return moduleFederationContractCandidates[0]
    }

    return null
  }

  if (strongTitleDirectoryMatches.length === 1) {
    return strongTitleDirectoryMatches[0]
  }

  if (strongTitleDirectoryMatches.length > 1) {
    return null
  }

  if (moduleFederationContractCandidates.length === 1) {
    return moduleFederationContractCandidates[0]
  }

  const topScore = scoreBusinessEntryEvidence(topCandidate, {
    routePath,
    title: menuTitle,
    dest,
  })
  const secondScore = scoreBusinessEntryEvidence(secondCandidate, {
    routePath,
    title: menuTitle,
    dest,
  })
  const secondHasStrongMatch =
    hasExactBusinessEntryRouteMatch(secondCandidate, routePath) ||
    hasStrongBusinessEntryTitleAndDirectoryMatch(secondCandidate, { menuTitle, dest })

  if (!secondHasStrongMatch && topScore - secondScore <= BUSINESS_ENTRY_AMBIGUITY_SCORE_THRESHOLD) {
    return null
  }

  return topCandidate
}

function normalizeInstallMode(mode) {
  const normalizedMode = normalizeString(mode)
  return isRecognizedInstallMode(normalizedMode, { allowAuto: false }) ? normalizedMode : 'rules-only'
}

function createCheck({ id, status, detail }) {
  return {
    id,
    status,
    detail,
  }
}

function normalizePublicShellLayer(layer = {}, options = {}) {
  const issues = Array.isArray(layer?.issues)
    ? layer.issues.map((issue) => ({
        kind: normalizeString(issue?.kind) || 'unknown',
        detail: normalizeString(issue?.detail) || 'Public shell compatibility issue detected.',
        filePath: normalizeRelativePath(issue?.filePath),
      }))
    : []

  return {
    status: normalizeString(layer?.status) || normalizeString(options.defaultStatus) || 'not-checked',
    reason:
      normalizeString(layer?.reason) ||
      normalizeString(options.defaultReason) ||
      'Public shell compatibility was not evaluated.',
    entryFile: normalizeRelativePath(layer?.entryFile),
    styleFiles: normalizeStringArray(layer?.styleFiles).map((value) => normalizeRelativePath(value)),
    issueCount: Number.isFinite(layer?.issueCount) ? layer.issueCount : issues.length,
    blockedBy: normalizeStringArray(layer?.blockedBy),
    issues,
    required: layer?.required === true,
    deliveryContract: normalizeString(layer?.deliveryContract),
    targetEntryKind: normalizeString(layer?.targetEntryKind),
    targetEntryPath: normalizeRelativePath(layer?.targetEntryPath),
    expectedShellStyleImport: normalizeString(layer?.expectedShellStyleImport),
  }
}

function requiresManagedMfPublishEntryShell({
  resolvedMode,
  hostProfile,
  formalNavigation,
  navigationMountAction,
}) {
  if (normalizeString(resolvedMode) !== 'rules-only') return false
  if (normalizeString(hostProfile?.projectType) !== 'existing-system') return false

  const candidateKinds = [
    navigationMountAction?.targetEntryKind,
    formalNavigation?.selectedPublishEntryKind,
  ]

  return candidateKinds.some((kind) => isModuleFederationBusinessEntryKind(kind))
}

function buildManagedMfPublishEntryShellLayer({
  publicShell,
  required,
  formalNavigation,
  navigationMountAction,
}) {
  if (!required) {
    return {
      status: 'not-applicable',
      reason: 'Managed Module Federation publish-entry shell delivery is not required for the current project.',
      required: false,
      blockedBy: [],
      deliveryContract: '',
      targetEntryKind: '',
      targetEntryPath: '',
      expectedShellStyleImport: '',
    }
  }

  const targetEntryPath = normalizeRelativePath(
    navigationMountAction?.targetEntryPath || formalNavigation?.selectedPublishEntryPath || ''
  )
  const targetEntryKind = normalizeString(
    navigationMountAction?.targetEntryKind || formalNavigation?.selectedPublishEntryKind
  )
  const expectedShellStyleImport = `${getManagedLocalRuntimeRoot()}/styles.css`
  const deliveryContract = 'managed-mf-publish-entry'

  if (normalizeString(publicShell?.status) === 'blocked') {
    return {
      status: 'blocked',
      reason:
        'Project entry shell baseline is currently blocked, so Module Federation direct-expose shell delivery cannot be proven yet.',
      required: true,
      blockedBy: normalizeStringArray([
        ...(Array.isArray(publicShell?.blockedBy) ? publicShell.blockedBy : []),
        'project-entry-shell-blocked',
      ]),
      deliveryContract,
      targetEntryKind,
      targetEntryPath,
      expectedShellStyleImport,
    }
  }

  if (normalizeString(publicShell?.status) !== 'ready') {
    return {
      status: 'not-checked',
      reason:
        'Project entry shell baseline is not yet fully proven, so Module Federation direct-expose shell delivery also remains unproven.',
      required: true,
      blockedBy: ['project-entry-shell-unproven'],
      deliveryContract,
      targetEntryKind,
      targetEntryPath,
      expectedShellStyleImport,
    }
  }

  return {
    status: 'not-checked',
    reason:
      'Project app entry shell baseline is ready, but each direct Module Federation expose still needs a managed publish entry that imports the local hiui-design runtime styles.css before re-exporting the page module.',
    required: true,
    blockedBy: ['managed-mf-publish-entry-shell-unproven'],
    deliveryContract,
    targetEntryKind,
    targetEntryPath,
    expectedShellStyleImport,
  }
}

function buildPublicShellContract({
  publicShell,
  resolvedMode,
  hostProfile,
  formalNavigation,
  navigationMountAction,
}) {
  const projectEntryShell = normalizePublicShellLayer(publicShell)
  const mfPublishEntryShell = normalizePublicShellLayer(
    buildManagedMfPublishEntryShellLayer({
      publicShell: projectEntryShell,
      required: requiresManagedMfPublishEntryShell({
        resolvedMode,
        hostProfile,
        formalNavigation,
        navigationMountAction,
      }),
      formalNavigation,
      navigationMountAction,
    }),
    {
      defaultStatus: 'not-applicable',
      defaultReason:
        'Managed Module Federation publish-entry shell delivery is not required for the current project.',
    }
  )

  const combinedReason =
    mfPublishEntryShell.required === true
      ? `${projectEntryShell.reason} This only proves project-entry baseline readiness; it does not automatically prove that Module Federation publish units will deliver shell styles until each direct expose points to a managed publish entry.`
      : projectEntryShell.reason

  return {
    ...cloneJson(projectEntryShell),
    reason: combinedReason,
    projectEntryShell,
    projectEntryShellReady: projectEntryShell.status === 'ready',
    projectEntryShellReason: projectEntryShell.reason,
    projectEntryShellBlockedBy: projectEntryShell.blockedBy,
    mfPublishEntryShell,
    mfPublishEntryShellRequired: mfPublishEntryShell.required === true,
    mfPublishEntryShellReady: mfPublishEntryShell.status === 'ready',
    mfPublishEntryShellReason: mfPublishEntryShell.reason,
    mfPublishEntryShellBlockedBy: mfPublishEntryShell.blockedBy,
  }
}

async function inspectReact19ManagedRuntimePatchBaseline({ targetRoot, hostProfile, pkg }) {
  const reactMajor = Number(hostProfile?.reactMajor || 0)
  if (reactMajor < 19) {
    return {
      required: false,
      ok: true,
      detail:
        reactMajor > 0
          ? `Detected React ${reactMajor}; the managed React 19 runtime patch baseline is not required.`
          : 'React major version could not be resolved; the managed React 19 runtime patch baseline is not required.',
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
        ? `React 19 host keeps the managed runtime patch baseline through package.json scripts.typical-page:runtime-patch, scripts.postinstall, and ${runtimePatchScriptRelativePath}.`
        : `React 19 host is missing the managed runtime patch baseline: ${missing.join(', ')}. Re-run apply-in-current-project or setup-for-designers so package.json and .local-context are resynced, reinstall dependencies so postinstall applies the managed patches, then rerun typical-page:preflight.`,
  }
}

export async function inferAppEntryPath(targetRoot) {
  const candidates = [
    'src/main.tsx',
    'src/main.jsx',
    'src/main.ts',
    'src/main.js',
    'src/index.tsx',
    'src/index.jsx',
    'src/index.ts',
    'src/index.js',
  ]

  for (const candidate of candidates) {
    if (await pathExists(path.join(targetRoot, candidate))) return candidate
  }

  return ''
}

export async function inspectAppEntryMountPlan(targetRoot, appEntryPath = '') {
  recordScanEvent('inspect-app-entry-mount-plan', {
    targetRoot: path.resolve(targetRoot),
    appEntryPath: normalizeRelativePath(appEntryPath),
  })

  const normalizedAppEntryPath = normalizeRelativePath(appEntryPath) || (await inferAppEntryPath(targetRoot))
  if (!normalizedAppEntryPath) {
    return {
      appEntryPath: '',
      supported: false,
      strategy: 'missing-app-entry',
      reason:
        'The target project real app entry is not yet confirmed. Ask the user for the router mount entry before creating the first formal business shell.',
    }
  }

  const absoluteAppEntryPath = path.join(targetRoot, normalizedAppEntryPath)
  const raw = await readTextIfExists(absoluteAppEntryPath)
  if (!raw) {
    return {
      appEntryPath: normalizedAppEntryPath,
      supported: false,
      strategy: 'missing-app-entry-content',
      reason:
        `The target project app entry ${normalizedAppEntryPath} could not be read. Ask the user for the real router mount entry before creating the first formal business shell.`,
    }
  }

  const hasCreateRootBootstrap = /createRoot\s*\(/.test(raw) || /ReactDOM\.createRoot\s*\(/.test(raw)
  const hasRootContainerLookup = /document\.getElementById\((['"])root\1\)/.test(raw)
  const hasExistingRouterRuntime =
    /RouterProvider/.test(raw) ||
    /createBrowserRouter/.test(raw) ||
    /createHashRouter/.test(raw) ||
    /useRoutes\s*\(/.test(raw) ||
    /<Routes[\s>]/.test(raw) ||
    /<Route[\s>]/.test(raw) ||
    /<BrowserRouter[\s>]/.test(raw) ||
    /<HashRouter[\s>]/.test(raw) ||
    /<MemoryRouter[\s>]/.test(raw)
  const hasExistingBusinessShellMount =
    /business-shell\/app-frame/.test(raw) || /business-shell\/routes/.test(raw)

  if (hasExistingBusinessShellMount) {
    return {
      appEntryPath: normalizedAppEntryPath,
      supported: false,
      strategy: 'existing-business-shell-entry',
      reason:
        `The target project app entry ${normalizedAppEntryPath} already references business-shell runtime files. Ask the user whether this entry should be migrated or replaced before creating another formal business shell.`,
    }
  }

  if (hasExistingRouterRuntime) {
    return {
      appEntryPath: normalizedAppEntryPath,
      supported: false,
      strategy: 'existing-router-runtime',
      reason:
        `The target project app entry ${normalizedAppEntryPath} already contains router runtime logic. Do not replace it automatically; ask the user for the exact mount point before creating the first formal business shell.`,
    }
  }

  if (!hasCreateRootBootstrap || !hasRootContainerLookup) {
    return {
      appEntryPath: normalizedAppEntryPath,
      supported: false,
      strategy: 'unsupported-bootstrap-shape',
      reason:
        `The target project app entry ${normalizedAppEntryPath} does not match the supported minimal ReactDOM bootstrap shape. Ask the user for the exact mount point before creating the first formal business shell.`,
    }
  }

  return {
    appEntryPath: normalizedAppEntryPath,
    supported: true,
    strategy: 'replace-minimal-reactdom-entry-with-formal-business-shell-router',
    reason:
      `The target project app entry ${normalizedAppEntryPath} matches the supported minimal ReactDOM bootstrap shape and can be patched with the first formal business shell router.`,
  }
}

export const FORMAL_HOST_SHELL_OFFICIAL_SOURCE_REQUIRED_FILES = [
  'examples/host-integration/src/app-frame-core.tsx',
  'examples/host-integration/src/host-shell-localization.ts',
  'examples/host-integration/src/route-base-path.ts',
  'examples/host-integration/src/components/layout/layout-content-context.tsx',
  'examples/host-integration/src/components/layout/page-header-portal.tsx',
  'examples/host-integration/src/components/layout/typical-page-host.tsx',
]

const OFFICIAL_SHELL_ROOT_CLASS_TOKENS = [
  'pro-table-page',
  'pro-stat-page',
  'pro-tree-split-page',
  'pro-detail-page',
  'pro-edit-page',
]

export const FORMAL_HOST_SHELL_CERTIFICATION_MARKER = 'hiuiDesignFormalShell'
export const FORMAL_HOST_SHELL_CERTIFICATION_VALUE = 'official-managed-host-shell-wrapper'
export const FORMAL_HOST_SHELL_LEGACY_CERTIFICATION_VALUE = 'official-preview-app-frame-wrapper'

function importsLegacyBrokenManagedHostAppFrame(source = '') {
  return /TypicalPageAppFrame/.test(source) && /@mit-design\/typical-page-shells\/host/.test(source)
}

function importsManagedLocalHostAppFrameCore(source = '') {
  return /TypicalPageAppFrameCore/.test(source) && /from\s+['"]\.\/app-frame-core['"]/.test(source)
}

function importsLegacyPreviewAppFrame(source = '') {
  return /TypicalPageAppFrame/.test(source) && /typical-page-preview\/app-frame/.test(source)
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

function hasManagedHostProviderPortal(source = '') {
  return (
    source.includes('TypicalPageHostProvider') &&
    ['headerPortal=', 'headerPortal:', 'footerPortal=', 'footerPortal:'].some((token) =>
      source.includes(token)
    )
  )
}

function hasOfficialHostCoreContract(source = '') {
  const referencesOfficialShellRoot = OFFICIAL_SHELL_ROOT_CLASS_TOKENS.some((token) =>
    source.includes(token)
  )
  const hasOfficialCoreStructureMarkers =
    source.includes('LayoutContentProvider') &&
    (source.includes('TypicalPageHostBridge') || hasManagedHostProviderPortal(source)) &&
    source.includes('headerRef') &&
    source.includes('footerRef') &&
    source.includes('styles.outlet')
  const hasHostBridge = source.includes('TypicalPageHostBridge') || hasManagedHostProviderPortal(source)
  const hasViewportAdaptiveCompatMarker =
    source.includes('data-hiui-height-contract="viewport-adaptive-legacy-mf"') ||
    source.includes("data-hiui-height-contract='viewport-adaptive-legacy-mf'")
  const hasLegacyViewportAdaptiveMinHeight =
    /min-height\s*:\s*['"]?calc\(100vh\s*-\s*60px\)['"]?/i.test(source) ||
    /(?:^|[^\w$])['"]?minHeight['"]?\s*:\s*['"]calc\(100vh\s*-\s*60px\)['"]/i.test(source) ||
    /height\s*:\s*['"]?calc\(100vh\s*-\s*60px\)['"]?/i.test(source) ||
    /(?:^|[^\w$])['"]?height['"]?\s*:\s*['"]calc\(100vh\s*-\s*60px\)['"]/i.test(source)
  const hasDynamicViewportAdaptiveMinHeight =
    (/min-height\s*:\s*['"]?var\(--hiui-managed-mf-viewport-height,\s*calc\(100vh\s*-\s*60px\)\)['"]?/i.test(
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
      )) &&
    source.includes('--hiui-managed-mf-viewport-height') &&
    source.includes('getBoundingClientRect().top') &&
    source.includes("style.setProperty(MANAGED_VIEWPORT_HEIGHT_VAR") &&
    source.includes('window.visualViewport')
  const hasViewportAdaptiveHeightContract =
    hasViewportAdaptiveCompatMarker &&
    /display\s*:\s*['"]?flex['"]?/i.test(source) &&
    (/flex-direction\s*:\s*column/i.test(source) ||
      /(?:^|[^\w$])['"]?flexDirection['"]?\s*:\s*['"]?column['"]?/i.test(source)) &&
    /overflow\s*:\s*['"]?hidden['"]?/i.test(source) &&
    (hasLegacyViewportAdaptiveMinHeight || hasDynamicViewportAdaptiveMinHeight)
  return (
    (referencesOfficialShellRoot || hasOfficialCoreStructureMarkers) &&
    hasHostBridge &&
    (hasFlexMinHeightOverflowContract(source) || hasViewportAdaptiveHeightContract)
  )
}

async function readAdjacentFormalHostCoreSource({ targetRoot, shellPath }) {
  if (!targetRoot || !shellPath) return ''
  const shellDir = path.dirname(shellPath)
  const coreCandidates = [
    'app-frame-core.tsx',
    'app-frame-core.jsx',
    'app-frame-core.ts',
    'app-frame-core.js',
  ]

  for (const candidate of coreCandidates) {
    const relativePath = path.join(shellDir, candidate)
    const absolutePath = path.join(targetRoot, relativePath)
    if (!(await pathExists(absolutePath))) continue
    return readTextIfExists(absolutePath)
  }

  return ''
}

async function readTextIfExists(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8')
  } catch {
    return ''
  }
}

async function inspectFormalHostShellCertification({ shellContent, shellPath = '', targetRoot = '' }) {
  const content = String(shellContent || '')
  const hasManagedStableMarker =
    content.includes(FORMAL_HOST_SHELL_CERTIFICATION_MARKER) &&
    content.includes(FORMAL_HOST_SHELL_CERTIFICATION_VALUE)
  const hasLegacyStableMarker =
    content.includes(FORMAL_HOST_SHELL_CERTIFICATION_MARKER) &&
    content.includes(FORMAL_HOST_SHELL_LEGACY_CERTIFICATION_VALUE)
  const hasLegacyBrokenManagedHostImport = importsLegacyBrokenManagedHostAppFrame(content)
  const hasManagedLocalCoreImport = importsManagedLocalHostAppFrameCore(content)
  const hasLegacyPreviewImport = importsLegacyPreviewAppFrame(content)
  const localCoreSource =
    hasManagedStableMarker && hasManagedLocalCoreImport
      ? await readAdjacentFormalHostCoreSource({ targetRoot, shellPath })
      : ''
  const hasCertifiedOfficialHostCore = hasOfficialHostCoreContract(localCoreSource)

  return {
    certified: hasManagedStableMarker && hasManagedLocalCoreImport && hasCertifiedOfficialHostCore,
    evidence: [
      hasManagedStableMarker ? 'stable-formal-shell-marker' : '',
      hasLegacyBrokenManagedHostImport ? 'legacy-broken-managed-host-package-import' : '',
      hasManagedLocalCoreImport ? 'official-managed-host-core-import' : '',
      hasCertifiedOfficialHostCore ? 'official-managed-host-core-contract' : '',
      hasManagedStableMarker && !hasManagedLocalCoreImport
        ? 'marker-without-official-host-core-import'
        : '',
      hasManagedStableMarker && hasManagedLocalCoreImport
        ? hasManagedLocalCoreImport && hasCertifiedOfficialHostCore
          ? 'marker-with-official-host-core-import'
          : 'marker-without-certified-official-host-core'
        : '',
      hasManagedStableMarker && hasLegacyBrokenManagedHostImport
        ? 'marker-with-legacy-broken-managed-host-package-import'
        : '',
      hasLegacyStableMarker ? 'legacy-preview-formal-shell-marker' : '',
      hasLegacyPreviewImport ? 'legacy-preview-app-frame-import' : '',
    ].filter(Boolean),
  }
}

function inferFormalShellMigrationTargets(shellPath = '') {
  const normalizedShellPath = normalizeRelativePath(shellPath)
  if (!normalizedShellPath) {
    return {
      targetShellPath: '',
      targetCorePath: '',
      targetHostResetPath: '',
      preferredExtension: '.tsx',
    }
  }

  const shellDir = path.posix.dirname(normalizedShellPath)
  const detectedExtension = path.posix.extname(normalizedShellPath)
  const preferredExtension =
    detectedExtension === '.js'
      ? '.jsx'
      : detectedExtension === '.ts'
        ? '.tsx'
        : detectedExtension || '.tsx'

  return {
    targetShellPath: normalizedShellPath,
    targetCorePath: path.posix.join(shellDir, `app-frame-core${preferredExtension}`),
    targetHostResetPath: path.posix.join(shellDir, 'host-reset.css'),
    preferredExtension,
  }
}

function buildFormalShellMigrationPlan({
  shellPath = '',
  shellCertification = null,
} = {}) {
  const targets = inferFormalShellMigrationTargets(shellPath)
  const evidence = Array.isArray(shellCertification?.evidence) ? shellCertification.evidence : []
  const referenceAppFrameCorePath = 'examples/host-integration/src/app-frame-core.tsx'
  const managedHostImportSource = getManagedLocalRuntimeHostLogicalSource()
  const normalizedShellPath = normalizeRelativePath(shellPath)
  const baseResult = {
    status: 'not-applicable',
    required: false,
    kind: normalizedShellPath ? 'unknown' : 'missing-formal-shell',
    blockingMode: 'none',
    reason: normalizedShellPath
      ? 'Existing formal shell evidence is present, but migration guidance could not be classified.'
      : 'Formal shell migration guidance is not required because no existing formal shell was detected.',
    targetShellPath: targets.targetShellPath,
    targetCorePath: targets.targetCorePath,
    targetHostResetPath: targets.targetHostResetPath,
    preferredExtension: targets.preferredExtension,
    referenceAppFrameCorePath,
    managedHostImportSource,
    recommendedStrategy: '',
    recommendedSteps: [],
    evidence,
  }

  if (shellCertification?.certified) {
    return {
      ...baseResult,
      status: 'not-needed',
      kind: 'certified-existing-shell',
      reason: normalizedShellPath
        ? `Existing formal shell ${normalizedShellPath} already matches the managed host-shell certification contract.`
        : 'Existing formal shell already matches the managed host-shell certification contract.',
    }
  }

  if (!normalizedShellPath) {
    return baseResult
  }

  const withRecommendedSteps = (result, steps) => ({
    ...result,
    recommendedSteps: steps.filter(Boolean),
  })

  if (
    evidence.includes('legacy-preview-formal-shell-marker') ||
    evidence.includes('legacy-preview-app-frame-import')
  ) {
    return withRecommendedSteps(
      {
        ...baseResult,
        status: 'migration-required',
        required: true,
        kind: 'legacy-preview-wrapper',
        blockingMode: 'migrate-existing-shell',
        reason: `Existing formal shell ${normalizedShellPath} still depends on the legacy preview app-frame wrapper. Migrate it to a thin managed wrapper over ${targets.targetCorePath || 'app-frame-core.tsx'} based on ${referenceAppFrameCorePath} before attaching new pages.`,
        recommendedStrategy: 'rewrite-shell-wrapper-over-local-app-frame-core',
      },
      [
        `Replace ${normalizedShellPath} with a thin wrapper that re-exports TypicalPageAppFrame over ${targets.targetCorePath || 'app-frame-core.tsx'}.`,
        `Materialize ${targets.targetCorePath || 'app-frame-core.tsx'} from ${referenceAppFrameCorePath} and keep the managed host import from ${managedHostImportSource}.`,
        `Keep ${targets.targetHostResetPath || 'host-reset.css'} aligned with the managed host baseline before rerunning typical-page:preflight.`,
      ]
    )
  }

  if (evidence.includes('legacy-broken-managed-host-package-import')) {
    return withRecommendedSteps(
      {
        ...baseResult,
        status: 'migration-required',
        required: true,
        kind: 'legacy-broken-managed-host-package-wrapper',
        blockingMode: 'migrate-existing-shell',
        reason: `Existing formal shell ${normalizedShellPath} still imports the legacy managed host package wrapper directly. Migrate it to a local thin wrapper over ${targets.targetCorePath || 'app-frame-core.tsx'} so the official host-core contract can be certified before attaching new pages.`,
        recommendedStrategy: 'replace-package-wrapper-with-local-app-frame-core-wrapper',
      },
      [
        `Replace the direct TypicalPageAppFrame package import in ${normalizedShellPath} with a local ${targets.targetCorePath || 'app-frame-core.tsx'} wrapper.`,
        `Materialize ${targets.targetCorePath || 'app-frame-core.tsx'} from ${referenceAppFrameCorePath} and keep the managed host import from ${managedHostImportSource}.`,
        `Confirm the adjacent host core keeps the official shell height chain and portal bridge, then rerun typical-page:preflight.`,
      ]
    )
  }

  if (evidence.includes('marker-without-official-host-core-import')) {
    return withRecommendedSteps(
      {
        ...baseResult,
        status: 'manual-review-required',
        kind: 'marker-only-custom-shell',
        blockingMode: 'manual-review-existing-shell',
        reason: `Existing formal shell ${normalizedShellPath} declares the stable marker but does not import a local managed app-frame-core. Treat it as a handwritten shell; replace it with the managed thin-wrapper structure before attaching new pages.`,
        recommendedStrategy: 'replace-handwritten-shell-with-managed-thin-wrapper',
      },
      [
        `Do not attach new pages to ${normalizedShellPath} as-is.`,
        `Replace the current shell with a managed thin wrapper over ${targets.targetCorePath || 'app-frame-core.tsx'} based on ${referenceAppFrameCorePath}.`,
      ]
    )
  }

  if (evidence.includes('marker-without-certified-official-host-core')) {
    return withRecommendedSteps(
      {
        ...baseResult,
        status: 'manual-review-required',
        kind: 'managed-core-contract-incomplete',
        blockingMode: 'manual-review-existing-shell',
        reason: `Existing formal shell ${normalizedShellPath} imports a local app-frame-core, but the adjacent core file does not yet prove the official managed host-shell contract. Repair the host core before attaching new pages.`,
        recommendedStrategy: 'repair-local-managed-host-core-contract',
      },
      [
        `Verify ${targets.targetCorePath || 'app-frame-core.tsx'} still contains the official host bridge and continuous height-chain contract.`,
        `Resync the local app-frame-core from ${referenceAppFrameCorePath} if the current host core has drifted.`,
      ]
    )
  }

  return withRecommendedSteps(
    {
      ...baseResult,
      status: 'manual-review-required',
      kind: 'unknown-uncertified-shell',
      blockingMode: 'manual-review-existing-shell',
      reason: `Existing formal shell ${normalizedShellPath} does not match the managed host-shell certification contract. Review it manually and migrate it to the managed thin-wrapper structure before attaching new pages.`,
      recommendedStrategy: 'manual-review-and-replace-with-managed-thin-wrapper',
    },
    [
      `Review ${normalizedShellPath} manually before attaching new pages.`,
      `If this shell should remain the formal business shell, migrate it to a thin wrapper over ${targets.targetCorePath || 'app-frame-core.tsx'} based on ${referenceAppFrameCorePath}.`,
    ]
  )
}

function normalizeProjectContractPath(targetRoot, rawValue, fieldLabel, violations) {
  const normalizedValue = normalizeRelativePath(rawValue)
  if (!normalizedValue) return ''

  const absolutePath = path.isAbsolute(normalizedValue)
    ? path.resolve(normalizedValue)
    : path.resolve(targetRoot, normalizedValue)
  const relativePath = normalizeRelativePath(path.relative(targetRoot, absolutePath))

  if (!relativePath || relativePath.startsWith('..')) {
    violations.push(`${fieldLabel} must resolve inside the target project root`)
    return ''
  }

  return relativePath
}

function matchesExplicitBusinessEntryCall(
  call,
  { entryRoutePath = '', entryTitle = '', entryName = '' } = {}
) {
  const normalizedEntryRoutePath = normalizeBusinessEntryRoutePath(entryRoutePath)
  const normalizedEntryTitle = normalizeString(entryTitle)
  const normalizedEntryName = normalizeString(entryName)

  if (
    normalizedEntryRoutePath &&
    call?.normalizedRoutePath !== normalizedEntryRoutePath &&
    call?.path !== normalizedEntryRoutePath
  ) {
    return false
  }
  if (normalizedEntryTitle && call?.title !== normalizedEntryTitle) {
    return false
  }
  if (normalizedEntryName && call?.name !== normalizedEntryName) {
    return false
  }

  return true
}

function normalizeModuleFederationExposeName(value = '') {
  const normalized = normalizeString(value)
  if (!normalized) return ''
  return normalized.startsWith('./') ? normalized : `./${normalized.replace(/^\/+/, '')}`
}

function formatLegacyBusinessEntrySelectorCandidates(entryCalls = [], entryKind = '') {
  const candidates = (Array.isArray(entryCalls) ? entryCalls : [])
    .map((call) => {
      const selectors = []
      const routePath = normalizeBusinessEntryRoutePath(call?.normalizedRoutePath || call?.path)
      const title = normalizeString(call?.title)
      const name = normalizeString(call?.name)

      if (routePath) selectors.push(`entryRoutePath=${routePath}`)
      if (title) selectors.push(`entryTitle=${title}`)
      if (name) selectors.push(`entryName=${name}`)

      if (selectors.length === 0) return ''
      return `${entryKind || call?.api || 'legacy-entry'}{${selectors.join(', ')}}`
    })
    .filter(Boolean)

  return candidates.length > 0
    ? ` Available selector candidates: ${candidates.join('; ')}.`
    : ''
}

function formatModuleFederationExposeSelectorCandidates(mfExposes = []) {
  const candidates = (Array.isArray(mfExposes) ? mfExposes : [])
    .map((item) => {
      const selectors = []
      const entryName = normalizeModuleFederationExposeName(item?.publicName || item?.name || '')
      const sourcePath = normalizeRelativePath(item?.sourcePath || item?.entryPath || '')

      if (entryName) selectors.push(`entryName=${entryName}`)
      if (sourcePath) selectors.push(`sourcePath=${sourcePath}`)

      if (selectors.length === 0) return ''
      return `module-federation-expose{${selectors.join(', ')}}`
    })
    .filter(Boolean)

  return candidates.length > 0
    ? ` Available selector candidates: ${candidates.join('; ')}.`
    : ''
}

function matchesExplicitModuleFederationExpose(
  item,
  { entryRoutePath = '', entryTitle = '', entryName = '' } = {}
) {
  const requestedRouteName = normalizeModuleFederationExposeName(entryRoutePath)
  const requestedRouteTokens = tokenizeBusinessEntryText(entryRoutePath)
  const requestedEntryName = normalizeModuleFederationExposeName(entryName)
  const requestedTitleTokens = tokenizeBusinessEntryText(entryTitle)
  const publicName = normalizeModuleFederationExposeName(item?.publicName || item?.name || '')
  const normalizedPublicName = publicName.replace(/^\.\//, '')
  const sourcePath = normalizeRelativePath(item?.sourcePath || item?.entryPath || '')
  const normalizedSourceLeaf = path.posix
    .basename(sourcePath)
    .replace(/\.[cm]?[jt]sx?$/i, '')
    .replace(/^index$/i, '')
  const candidateTitleTokens = [
    ...tokenizeBusinessEntryText(publicName),
    ...tokenizeBusinessEntryText(normalizedSourceLeaf),
    ...buildDirectoryTokens(item?.sourcePath || item?.entryPath || ''),
  ]

  if (requestedRouteName) {
    const normalizedRequestedRouteName = requestedRouteName.replace(/^\.\//, '')
    const exactRouteMatch =
      requestedRouteName === publicName ||
      normalizedRequestedRouteName === normalizedPublicName ||
      normalizedRequestedRouteName === normalizedSourceLeaf

    if (
      !exactRouteMatch &&
      (requestedRouteTokens.length === 0 ||
        !hasRequestedTokenCoverage(requestedRouteTokens, candidateTitleTokens))
    ) {
      return false
    }
  }

  if (requestedEntryName) {
    const normalizedRequestedEntryName = requestedEntryName.replace(/^\.\//, '')
    if (requestedEntryName !== publicName && normalizedRequestedEntryName !== normalizedPublicName) {
      return false
    }
  }

  if (
    requestedTitleTokens.length > 0 &&
    !hasRequestedTokenCoverage(requestedTitleTokens, candidateTitleTokens)
  ) {
    return false
  }

  return true
}

export async function resolveExplicitNavigationMountContract({
  targetRoot,
  contract,
  projectType = '',
}) {
  if (!contract) {
    return {
      provided: false,
      applied: false,
      violations: [],
      value: null,
    }
  }

  if (!contract || typeof contract !== 'object' || Array.isArray(contract)) {
    return {
      provided: true,
      applied: false,
      violations: ['navigationMountContract must be a JSON object'],
      value: null,
    }
  }

  const violations = []
  const normalizeParentFlowContract = async (value) => {
    if (value === undefined || value === null || value === '') return null
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      violations.push('navigationMountContract.parentFlowContract must be a JSON object')
      return null
    }

    const parentPagePath = normalizeProjectContractPath(
      targetRoot,
      value.parentPagePath,
      'navigationMountContract.parentFlowContract.parentPagePath',
      violations
    )
    const triggerKind = normalizeString(value.triggerKind)
    const targetPathPattern = normalizeString(value.targetPathPattern)
    const backBehavior = normalizeString(value.backBehavior)
    const triggerLocator =
      value.triggerLocator && typeof value.triggerLocator === 'object'
        ? JSON.parse(JSON.stringify(value.triggerLocator))
        : normalizeString(value.triggerLocator)
    const paramMap =
      value.paramMap && typeof value.paramMap === 'object' && !Array.isArray(value.paramMap)
        ? JSON.parse(JSON.stringify(value.paramMap))
        : null

    if (!parentPagePath) {
      violations.push('navigationMountContract.parentFlowContract.parentPagePath is required')
    } else if (!(await pathExists(path.join(targetRoot, parentPagePath)))) {
      violations.push(
        `navigationMountContract.parentFlowContract.parentPagePath does not exist: ${parentPagePath}`
      )
    }
    if (!triggerKind) {
      violations.push('navigationMountContract.parentFlowContract.triggerKind is required')
    }
    if (!targetPathPattern) {
      violations.push('navigationMountContract.parentFlowContract.targetPathPattern is required')
    }
    if (!triggerLocator) {
      violations.push('navigationMountContract.parentFlowContract.triggerLocator is required')
    }
    if (!paramMap) {
      violations.push('navigationMountContract.parentFlowContract.paramMap is required')
    }
    if (!backBehavior) {
      violations.push('navigationMountContract.parentFlowContract.backBehavior is required')
    }

    return {
      parentPagePath,
      triggerKind,
      triggerLocator,
      targetPathPattern,
      paramMap: paramMap || {},
      backBehavior,
    }
  }
  let normalizedProjectType = normalizeString(projectType)
  const normalizedParentFlowContract = await normalizeParentFlowContract(contract.parentFlowContract)
  const hasManagedFormalFields = Boolean(
    contract.routeRegistryPath || contract.menuRegistryPath || contract.formalShellPath
  )
  const hasLegacyEntryFields = Boolean(
    contract.entryPath ||
      contract.entryKind ||
      contract.entryRoutePath ||
      contract.entryTitle ||
      contract.entryName ||
      contract.backRoutePath ||
      contract.backTitle ||
      contract.backName
  )

  if (hasManagedFormalFields && hasLegacyEntryFields) {
    violations.push(
      'navigationMountContract must describe either the existing navigation registry contract or the legacy business entry contract, not both'
    )
  }

  if (!hasManagedFormalFields && !hasLegacyEntryFields) {
    violations.push(
      'navigationMountContract must provide either routeRegistryPath/formalShellPath for the existing navigation registry contract, or entryPath/entryKind for the legacy business entry contract'
    )
  }

  if (violations.length > 0) {
    return {
      provided: true,
      applied: false,
      violations,
      value: null,
    }
  }

  if (hasLegacyEntryFields) {
    if (!normalizedProjectType) {
      const detectedHostProfile = await detectHostProfile(targetRoot, {
        ignoreRelativePaths: ['src/typical-page-preview'],
      })
      normalizedProjectType = normalizeString(detectedHostProfile?.projectType)
    }

    if (normalizedProjectType && normalizedProjectType !== 'existing-system') {
      violations.push(
        'navigationMountContract.entryPath + entryKind is only supported for existing-system projects because it confirms an existing legacy business entry instead of creating first-time navigation.'
      )
    }

    const entryPath = normalizeProjectContractPath(
      targetRoot,
      contract.entryPath,
      'navigationMountContract.entryPath',
      violations
    )
    const entryKind = normalizeString(contract.entryKind)
    const entryRoutePath = normalizeBusinessEntryRoutePath(contract.entryRoutePath)
    const entryTitle = normalizeString(contract.entryTitle)
    const entryName = normalizeString(contract.entryName)
    const backRoutePath = normalizeBusinessEntryRoutePath(contract.backRoutePath)
    const backTitle = normalizeString(contract.backTitle)
    const backName = normalizeString(contract.backName)

    if (!entryPath) {
      violations.push('navigationMountContract.entryPath is required')
    }
    if (!entryKind) {
      violations.push('navigationMountContract.entryKind is required')
    } else if (!EXPLICIT_BUSINESS_ENTRY_KINDS.has(entryKind)) {
      violations.push(
        `navigationMountContract.entryKind must be one of ${Array.from(EXPLICIT_BUSINESS_ENTRY_KINDS).join(', ')}`
      )
    }

    if (entryPath && !(await pathExists(path.join(targetRoot, entryPath)))) {
      violations.push(`navigationMountContract.entryPath does not exist: ${entryPath}`)
    }
    if ((backTitle || backName) && !backRoutePath) {
      violations.push(
        'navigationMountContract.backRoutePath is required when backTitle or backName is provided'
      )
    }

    const entrySource = entryPath ? await readTextIfExists(path.join(targetRoot, entryPath)) : ''
    const hasExplicitSelector = Boolean(entryRoutePath || entryTitle || entryName)
    let selectedEntryCall = null
    let selectedMfExpose = null

    if (entryKind && LEGACY_EXPLICIT_ENTRY_KINDS.has(entryKind)) {
      const entryCalls =
        entrySource && LEGACY_EXPLICIT_ENTRY_KINDS.has(entryKind)
          ? findAddPageCalls(entrySource).filter((item) => item.api === entryKind)
          : []
      const matchedEntryCalls = hasExplicitSelector
        ? entryCalls.filter((item) =>
            matchesExplicitBusinessEntryCall(item, { entryRoutePath, entryTitle, entryName })
          )
        : entryCalls

      if (entrySource && entryCalls.length === 0) {
        violations.push(
          `navigationMountContract.entryPath ${entryPath} does not contain a ${entryKind}({...}) call`
        )
      } else if (!hasExplicitSelector && entryCalls.length > 1) {
        violations.push(
          `navigationMountContract.entryPath ${entryPath} contains multiple ${entryKind}({...}) calls; also provide entryRoutePath, entryTitle, or entryName so hiui-design can select one confirmed legacy business entry${formatLegacyBusinessEntrySelectorCandidates(entryCalls, entryKind)}`
        )
      } else if (hasExplicitSelector && matchedEntryCalls.length === 0) {
        violations.push(
          `navigationMountContract.entryPath ${entryPath} does not contain a ${entryKind}({...}) call that matches the provided entryRoutePath / entryTitle / entryName selector${formatLegacyBusinessEntrySelectorCandidates(entryCalls, entryKind)}`
        )
      } else if (matchedEntryCalls.length > 1) {
        violations.push(
          `navigationMountContract.entryPath ${entryPath} still matches multiple ${entryKind}({...}) calls; refine entryRoutePath, entryTitle, or entryName so hiui-design can select exactly one legacy business entry${formatLegacyBusinessEntrySelectorCandidates(matchedEntryCalls, entryKind)}`
        )
      }

      selectedEntryCall = matchedEntryCalls[0] || null
    } else if (entryKind && isModuleFederationBusinessEntryKind(entryKind)) {
      const mfConfigs = await findModuleFederationConfigs(targetRoot)
      const matchedConfig = mfConfigs.find(
        (config) => normalizeRelativePath(config.relativePath) === normalizeRelativePath(entryPath)
      )
      const mfExposes = Array.isArray(matchedConfig?.exposes)
        ? matchedConfig.exposes.map((item) => ({
            publicName: normalizeModuleFederationExposeName(item.publicName),
            sourcePath: normalizeRelativePath(item.sourcePath),
          }))
        : []
      const matchedMfExposes = hasExplicitSelector
        ? mfExposes.filter((item) =>
            matchesExplicitModuleFederationExpose(item, { entryRoutePath, entryTitle, entryName })
          )
        : mfExposes

      if (!matchedConfig || mfExposes.length === 0) {
        violations.push(
          `navigationMountContract.entryPath ${entryPath} does not contain a Module Federation expose contract`
        )
      } else if (!hasExplicitSelector && mfExposes.length > 1) {
        violations.push(
          `navigationMountContract.entryPath ${entryPath} contains multiple Module Federation exposes; also provide entryName, entryTitle, or entryRoutePath so hiui-design can select exactly one confirmed publish entry${formatModuleFederationExposeSelectorCandidates(mfExposes)}`
        )
      } else if (hasExplicitSelector && matchedMfExposes.length === 0) {
        violations.push(
          `navigationMountContract.entryPath ${entryPath} does not contain a Module Federation expose that matches the provided entryName / entryTitle / entryRoutePath selector${formatModuleFederationExposeSelectorCandidates(mfExposes)}`
        )
      } else if (matchedMfExposes.length > 1) {
        violations.push(
          `navigationMountContract.entryPath ${entryPath} still matches multiple Module Federation exposes; refine entryName, entryTitle, or entryRoutePath so hiui-design can select exactly one confirmed publish entry${formatModuleFederationExposeSelectorCandidates(matchedMfExposes)}`
        )
      }

      selectedMfExpose = matchedMfExposes[0] || (mfExposes.length === 1 ? mfExposes[0] : null)
    }

    return {
      provided: true,
      applied: violations.length === 0,
      violations,
      value:
        violations.length === 0
          ? {
              contractKind: 'legacy-business-entry',
              entryPath,
              entryKind,
              entryRoutePath: selectedEntryCall?.normalizedRoutePath || entryRoutePath || '',
              entryTitle: selectedEntryCall?.title || entryTitle || '',
              entryName:
                selectedEntryCall?.name ||
                selectedMfExpose?.publicName ||
                normalizeModuleFederationExposeName(entryName) ||
                entryName ||
                '',
              backRoutePath,
              backTitle,
              backName,
              entryPublicName: selectedMfExpose?.publicName || '',
              entrySourcePath: selectedMfExpose?.sourcePath || '',
              parentFlowContract: normalizedParentFlowContract,
              explicitNavigationMountProvided: true,
            }
          : null,
    }
  }

  const routeRegistryPath = normalizeProjectContractPath(
    targetRoot,
    contract.routeRegistryPath,
    'navigationMountContract.routeRegistryPath',
    violations
  )
  const menuRegistryPath = normalizeProjectContractPath(
    targetRoot,
    contract.menuRegistryPath || contract.routeRegistryPath,
    'navigationMountContract.menuRegistryPath',
    violations
  )
  const formalShellPath = normalizeProjectContractPath(
    targetRoot,
    contract.formalShellPath,
    'navigationMountContract.formalShellPath',
    violations
  )

  if (!routeRegistryPath) {
    violations.push('navigationMountContract.routeRegistryPath is required')
  }
  if (!formalShellPath) {
    violations.push('navigationMountContract.formalShellPath is required')
  }
  if (
    routeRegistryPath &&
    menuRegistryPath &&
    menuRegistryPath !== routeRegistryPath
  ) {
    violations.push(
      `navigationMountContract.menuRegistryPath must equal navigationMountContract.routeRegistryPath; split menu and route registries are not supported by the existing navigation registry contract yet`
    )
  }

  if (routeRegistryPath && !(await pathExists(path.join(targetRoot, routeRegistryPath)))) {
    violations.push(
      `navigationMountContract.routeRegistryPath does not exist: ${routeRegistryPath}`
    )
  }
  if (menuRegistryPath && !(await pathExists(path.join(targetRoot, menuRegistryPath)))) {
    violations.push(
      `navigationMountContract.menuRegistryPath does not exist: ${menuRegistryPath}`
    )
  }
  if (formalShellPath && !(await pathExists(path.join(targetRoot, formalShellPath)))) {
    violations.push(
      `navigationMountContract.formalShellPath does not exist: ${formalShellPath}`
    )
  }

  const shellContent = formalShellPath
    ? await readTextIfExists(path.join(targetRoot, formalShellPath))
    : ''
  const registryContent = routeRegistryPath
    ? await readTextIfExists(path.join(targetRoot, routeRegistryPath))
    : ''
  const registryInspection = inspectNavigationRegistrySource({
    registryPath: routeRegistryPath,
    registrySource: registryContent,
  })
  const shellCertification = await inspectFormalHostShellCertification({
    shellContent,
    shellPath: formalShellPath,
    targetRoot,
  })
  const formalShellMigration = buildFormalShellMigrationPlan({
    shellPath: formalShellPath,
    shellCertification,
  })
  if (!normalizedProjectType) {
    const detectedHostProfile = await detectHostProfile(targetRoot, {
      ignoreRelativePaths: ['src/typical-page-preview'],
    })
    normalizedProjectType = normalizeString(detectedHostProfile?.projectType)
  }

  if (
    formalShellPath &&
    shellContent &&
    !shellCertification.certified &&
    normalizedProjectType !== 'existing-system'
  ) {
    violations.push(
      `navigationMountContract.formalShellPath ${formalShellPath} is not certified; expected a managed wrapper backed by the official app-frame-core asset set. The stable marker ${FORMAL_HOST_SHELL_CERTIFICATION_MARKER}=${FORMAL_HOST_SHELL_CERTIFICATION_VALUE} is informational only and cannot certify a handwritten shell.`
    )
    if (formalShellMigration.reason) {
      violations.push(`Migration guidance: ${formalShellMigration.reason}`)
    }
  }

  return {
    provided: true,
    applied: violations.length === 0,
    violations,
    value:
      violations.length === 0
        ? {
            contractKind: 'managed-formal-navigation',
            routeRegistryPath,
            menuRegistryPath: routeRegistryPath,
            formalShellPath,
            formalNavigationRegistryStatus: registryInspection.status,
            formalNavigationRegistryKind: registryInspection.kind,
            formalNavigationRegistryAutoMountSupported:
              registryInspection.autoMountSupported === true,
            formalNavigationRegistrySupportReason: registryInspection.reason,
            shellCertification: shellCertification.certified
              ? 'certified-existing'
              : 'uncertified-existing',
            shellCertificationEvidence: [
              ...shellCertification.evidence,
              'explicit-navigation-mount-contract',
            ],
            parentFlowContract: normalizedParentFlowContract,
            explicitNavigationMountProvided: true,
          }
        : null,
  }
}

export function applyExplicitNavigationMountContract({
  formalNavigation,
  explicitNavigationMountContract,
}) {
  if (!explicitNavigationMountContract?.applied || !explicitNavigationMountContract.value) {
    return formalNavigation
  }

  const explicit = explicitNavigationMountContract.value
  if (explicit.contractKind === 'legacy-business-entry') {
    const businessEntryEvidence = Array.isArray(formalNavigation.businessEntryEvidence)
      ? [...formalNavigation.businessEntryEvidence]
      : []
    const normalizedEntryPath = normalizeRelativePath(explicit.entryPath)
    const entryEvidence = {
      kind: explicit.entryKind,
      path: normalizedEntryPath,
      routePath: explicit.entryRoutePath || '',
      title: explicit.entryTitle || '',
      name: explicit.entryName || '',
      titleTokens: tokenizeBusinessEntryText(explicit.entryTitle || ''),
      nameTokens: tokenizeBusinessEntryText(explicit.entryName || ''),
    }
    if (
      normalizedEntryPath &&
      !businessEntryEvidence.some(
        (item) => item.kind === entryEvidence.kind && item.path === normalizedEntryPath
      )
    ) {
      businessEntryEvidence.push(entryEvidence)
    }

    return {
      ...formalNavigation,
      hasBusinessEntryEvidence: true,
      businessEntryEvidence,
      businessEntryEvidencePaths: businessEntryEvidence.map((item) => item.path).filter(Boolean),
      businessEntryEvidenceKinds: businessEntryEvidence.map((item) => item.kind),
      selectedBusinessEntryPath: normalizedEntryPath,
      selectedBusinessEntryKind: explicit.entryKind,
      ...buildSelectedBusinessEntryLayers({
        kind: explicit.entryKind,
        path: normalizedEntryPath,
      }),
      selectedLegacyBackRoutePath: explicit.backRoutePath || '',
      selectedLegacyBackTitle: explicit.backTitle || '',
      selectedLegacyBackName: explicit.backName || '',
      businessEntrySelectionBlocked: false,
      businessEntrySelectionBlockReason: '',
      explicitNavigationMountProvided: true,
      explicitNavigationMountContractKind: explicit.contractKind,
    }
  }

  const navigationEvidence = Array.isArray(formalNavigation.navigationEvidence)
    ? [...formalNavigation.navigationEvidence]
    : []
  const pushNavigationEvidence = (kind, evidencePath) => {
    const normalizedPath = normalizeRelativePath(evidencePath)
    if (!normalizedPath) return
    if (navigationEvidence.some((item) => item.kind === kind && item.path === normalizedPath)) return
    navigationEvidence.push({ kind, path: normalizedPath })
  }

  pushNavigationEvidence('route-registry-file', explicit.routeRegistryPath)
  pushNavigationEvidence('formal-shell-file', explicit.formalShellPath)

  return {
    ...formalNavigation,
    hasNavigationEvidence: true,
    navigationEvidence,
    navigationEvidencePaths: navigationEvidence.map((item) => item.path).filter(Boolean),
    navigationEvidenceKinds: navigationEvidence.map((item) => item.kind),
    selectedNavigationEvidencePath:
      explicit.routeRegistryPath ||
      explicit.formalShellPath ||
      formalNavigation.selectedNavigationEvidencePath ||
      '',
    formalBusinessShellExists: true,
    formalNavigationRegistryExists: true,
    formalBusinessShellPath: explicit.formalShellPath,
    formalNavigationRegistryPath: explicit.routeRegistryPath,
    formalNavigationRegistryCandidatePaths: Array.from(
      new Set([
        ...(formalNavigation.formalNavigationRegistryCandidatePaths || []),
        explicit.routeRegistryPath,
      ].filter(Boolean))
    ),
    formalNavigationMenuRegistryPath: explicit.menuRegistryPath,
    formalNavigationRegistryStatus: explicit.formalNavigationRegistryStatus || 'not-checked',
    formalNavigationRegistryKind: explicit.formalNavigationRegistryKind || 'unknown-route-registry',
    formalNavigationRegistryAutoMountSupported:
      explicit.formalNavigationRegistryAutoMountSupported === true,
    formalNavigationRegistrySupportReason: explicit.formalNavigationRegistrySupportReason || '',
    shellCertification: explicit.shellCertification,
    shellCertificationEvidence: explicit.shellCertificationEvidence,
    explicitNavigationMountProvided: true,
    explicitNavigationMountContractKind: explicit.contractKind,
  }
}

const FORMAL_NAVIGATION_REGISTRY_CANDIDATES = [
  'src/business-shell/routes.jsx',
  'src/business-shell/routes.tsx',
  'src/business-shell/routes.js',
  'src/business-shell/routes.ts',
  'src/business-layout/routes.jsx',
  'src/business-layout/routes.tsx',
  'src/business-layout/routes.js',
  'src/business-layout/routes.ts',
  'src/routes.jsx',
  'src/routes.tsx',
  'src/routes.js',
  'src/routes.ts',
  'src/router/index.jsx',
  'src/router/index.tsx',
  'src/router/index.js',
  'src/router/index.ts',
  'src/router/routes.jsx',
  'src/router/routes.tsx',
  'src/router/routes.js',
  'src/router/routes.ts',
  'src/router.jsx',
  'src/router.tsx',
  'src/router.js',
  'src/router.ts',
]

const FORMAL_NAVIGATION_SHELL_CANDIDATES = [
  'src/business-shell/app-frame.tsx',
  'src/business-shell/app-frame.jsx',
  'src/business-shell/app-frame.ts',
  'src/business-shell/app-frame.js',
  'src/business-layout/app-frame.tsx',
  'src/business-layout/app-frame.jsx',
  'src/business-layout/app-frame.ts',
  'src/business-layout/app-frame.js',
]

const AMBIGUOUS_SHELL_CANDIDATES = [
  'src/business-shell.tsx',
  'src/business-shell.jsx',
  'src/business-shell.ts',
  'src/business-shell.js',
  'src/business-layout.tsx',
  'src/business-layout.jsx',
  'src/business-layout.ts',
  'src/business-layout.js',
]

const ROUTE_REGISTRY_FILE_PATTERN =
  /(^src\/routes\.(?:jsx|tsx|js|ts)$)|(^src\/router\/.+\.(?:jsx|tsx|js|ts)$)|(\/routes\.(?:jsx|tsx|js|ts)$)/
const ROUTER_EVIDENCE_PATTERNS = [
  { kind: 'useRoutes', pattern: /\buseRoutes\s*\(/ },
  { kind: 'RouterProvider', pattern: /\bRouterProvider\b/ },
  { kind: 'create-router', pattern: /\bcreate(?:Browser|Hash|Memory)Router\s*\(/ },
  {
    kind: 'layout-routes-derived-menu',
    pattern:
      /<[A-Z][A-Za-z0-9]*Layout[^>]*\broutes=|\b[A-Z][A-Za-z0-9]*Layout\s*\(\s*routes\s*\)|\b[A-Z][A-Za-z0-9]*AppShell\s*\(\s*routes\s*\)/,
  },
]
const BUSINESS_ROUTES_EXPORT_PATTERN =
  /export\s+const\s+businessRoutes(?:\s*:\s*[^=]+)?\s*=\s*\[/
const PLAIN_ROUTES_EXPORT_PATTERN = /export\s+const\s+routes(?:\s*:\s*[^=]+)?\s*=/

function inspectNavigationRegistrySource({ registryPath = '', registrySource = '' } = {}) {
  const normalizedRegistryPath = normalizeRelativePath(registryPath)
  const source = String(registrySource || '')

  if (!normalizedRegistryPath || !source) {
    return {
      status: normalizedRegistryPath ? 'not-checked' : 'missing',
      kind: normalizedRegistryPath ? 'unknown-route-registry' : 'missing',
      autoMountSupported: false,
      reason: normalizedRegistryPath
        ? `Existing navigation registry ${normalizedRegistryPath} could not be inspected yet.`
        : 'No existing navigation registry path was confirmed.',
    }
  }

  if (BUSINESS_ROUTES_EXPORT_PATTERN.test(source)) {
    return {
      status: 'auto-append-supported',
      kind: 'business-routes-registry',
      autoMountSupported: true,
      reason:
        `Existing navigation registry ${normalizedRegistryPath} exposes export const businessRoutes = [...], so hiui-design can append the generated page automatically.`,
    }
  }

  if (
    PLAIN_ROUTES_EXPORT_PATTERN.test(source) ||
    ROUTER_EVIDENCE_PATTERNS.some((matcher) => matcher.pattern.test(source))
  ) {
    return {
      status: 'manual-registration-required',
      kind: 'plain-router-registry',
      autoMountSupported: false,
      reason:
        `Existing navigation registry ${normalizedRegistryPath} looks like a plain router registry, but hiui-design only auto-patches managed businessRoutes registries today. Keep this mount point as manual registration guidance instead of claiming automatic patch support.`,
    }
  }

  return {
    status: 'manual-registration-required',
    kind: 'unknown-route-registry',
    autoMountSupported: false,
    reason:
      `Existing navigation registry ${normalizedRegistryPath} was found, but its export shape is not recognized as an auto-appendable managed businessRoutes registry yet.`,
  }
}

function pushEvidence(evidence, seen, item) {
  const key = `${item.kind}::${item.path || ''}`
  if (seen.has(key)) return
  seen.add(key)
  evidence.push(item)
}

async function findExistingRelativePaths(targetRoot, candidates) {
  const matches = []
  for (const candidate of candidates) {
    if (await pathExists(path.join(targetRoot, candidate))) {
      matches.push(candidate)
    }
  }
  return matches
}

async function walkCodeFiles(rootDir, onFile) {
  let entries = []
  try {
    entries = await fs.readdir(rootDir, { withFileTypes: true })
  } catch {
    return
  }

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const absolutePath = path.join(rootDir, entry.name)
    if (entry.isDirectory()) {
      await walkCodeFiles(absolutePath, onFile)
      continue
    }
    if (!/\.(?:js|jsx|ts|tsx)$/.test(entry.name)) continue
    await onFile(absolutePath)
  }
}

async function detectNavigationEvidence(targetRoot) {
  const evidence = []
  const seen = new Set()
  const routeRegistryCandidates = await findExistingRelativePaths(
    targetRoot,
    FORMAL_NAVIGATION_REGISTRY_CANDIDATES
  )
  const shellCandidates = await findExistingRelativePaths(targetRoot, FORMAL_NAVIGATION_SHELL_CANDIDATES)

  for (const relativePath of routeRegistryCandidates) {
    pushEvidence(evidence, seen, {
      kind: 'route-registry-file',
      path: relativePath,
    })
  }

  for (const relativePath of shellCandidates) {
    pushEvidence(evidence, seen, {
      kind: 'formal-shell-file',
      path: relativePath,
    })
  }

  await walkCodeFiles(path.join(targetRoot, 'src'), async (absolutePath) => {
    const source = await readTextIfExists(absolutePath)
    if (!source) return
    const relativePath = normalizeRelativePath(path.relative(targetRoot, absolutePath))

    if (ROUTE_REGISTRY_FILE_PATTERN.test(relativePath)) {
      pushEvidence(evidence, seen, {
        kind: 'route-registry-file',
        path: relativePath,
      })
    }

    for (const matcher of ROUTER_EVIDENCE_PATTERNS) {
      if (matcher.pattern.test(source)) {
        pushEvidence(evidence, seen, {
          kind: matcher.kind,
          path: relativePath,
        })
      }
    }

    if (/TypicalPageAppFrame/.test(source) && /typical-page-preview\/app-frame/.test(source)) {
      pushEvidence(evidence, seen, {
        kind: 'formal-shell-file',
        path: relativePath,
      })
    }
  })

  return evidence
}

function scoreRegistryCandidate(candidatePath, { shellPath = '' } = {}) {
  const normalizedCandidate = normalizeRelativePath(candidatePath)
  const normalizedShell = normalizeRelativePath(shellPath)
  let score = 0

  if (normalizedShell) {
    const candidateDir = path.posix.dirname(normalizedCandidate)
    const shellDir = path.posix.dirname(normalizedShell)
    if (candidateDir === shellDir) {
      score += 100
    } else if (candidateDir.startsWith(`${shellDir}/`) || shellDir.startsWith(`${candidateDir}/`)) {
      score += 60
    }
  }

  if (/\/routes\.(?:jsx|tsx|js|ts)$/.test(normalizedCandidate)) score += 20
  if (/\/(?:business-shell|business-layout)\//.test(normalizedCandidate)) score += 15
  if (/^src\/routes\.(?:jsx|tsx|js|ts)$/.test(normalizedCandidate)) score += 10
  if (/^src\/router\//.test(normalizedCandidate)) score += 5

  return score
}

function pickPreferredRegistryPath(registryCandidates, { shellPath = '' } = {}) {
  if (!Array.isArray(registryCandidates) || registryCandidates.length === 0) return ''

  return registryCandidates
    .map((candidate, index) => ({
      candidate,
      index,
      score: scoreRegistryCandidate(candidate, { shellPath }),
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index)[0]?.candidate
}

export async function detectFormalNavigation(
  targetRoot,
  { routePath = '', menuTitle = '', dest = '' } = {}
) {
  recordScanEvent('detect-formal-navigation', {
    targetRoot: path.resolve(targetRoot),
    routePath: normalizeString(routePath),
    menuTitle: normalizeString(menuTitle),
    dest: normalizeRelativePath(dest),
  })

  const navigationEvidence = await detectNavigationEvidence(targetRoot)
  const businessEntryEvidence = await detectBusinessEntryEvidence(targetRoot, {
    routePath,
    title: menuTitle,
    dest,
  })
  const selectedBusinessEntry = resolveSelectedBusinessEntryEvidence(businessEntryEvidence, {
    routePath,
    menuTitle,
    dest,
  })
  const selectedLegacyMountEntry = resolveSelectedBusinessEntryEvidence(
    businessEntryEvidence.filter((item) => !isModuleFederationBusinessEntryKind(item?.kind)),
    {
      routePath,
      menuTitle,
      dest,
    }
  )
  const selectedPublishEntry = resolveSelectedBusinessEntryEvidence(
    businessEntryEvidence.filter((item) => isModuleFederationBusinessEntryKind(item?.kind)),
    {
      routePath,
      menuTitle,
      dest,
    }
  )
  const businessEntrySelectionBlocked =
    businessEntryEvidence.length > 0 && !selectedBusinessEntry && navigationEvidence.length === 0
  const businessEntrySelectionBlockReason = businessEntrySelectionBlocked
    ? buildBusinessEntrySelectionBlockReason({
        businessEntryEvidence,
        selectedPublishEntry,
      })
    : ''
  const implicitFeatureRegistry =
    selectedLegacyMountEntry?.kind === 'implicit-feature-registry'
      ? selectedLegacyMountEntry
      : selectedBusinessEntry?.kind === 'implicit-feature-registry'
        ? selectedBusinessEntry
        : null
  const routeRegistryEvidencePaths = navigationEvidence
    .filter((item) => item.kind === 'route-registry-file' && item.path)
    .map((item) => item.path)
  const existingRegistryCandidates = Array.from(
    new Set([
      ...(await findExistingRelativePaths(targetRoot, FORMAL_NAVIGATION_REGISTRY_CANDIDATES)),
      ...routeRegistryEvidencePaths,
    ])
  )
  let shellPath = ''
  let shellContent = ''
  const shellEvidencePaths = navigationEvidence
    .filter((item) => item.kind === 'formal-shell-file' && item.path)
    .map((item) => item.path)
  const shellCandidates = Array.from(
    new Set([
      ...(await findExistingRelativePaths(targetRoot, FORMAL_NAVIGATION_SHELL_CANDIDATES)),
      ...shellEvidencePaths,
    ])
  )
  for (const candidate of shellCandidates) {
    const candidatePath = path.join(targetRoot, candidate)
    if (await pathExists(candidatePath)) {
      shellPath = candidate
      shellContent = await readTextIfExists(candidatePath)
      break
    }
  }
  const registryPath = pickPreferredRegistryPath(existingRegistryCandidates, { shellPath })
  const registrySource = registryPath ? await readTextIfExists(path.join(targetRoot, registryPath)) : ''
  const registryInspection = inspectNavigationRegistrySource({
    registryPath,
    registrySource,
  })

  const ambiguousShellPaths = []
  for (const candidate of AMBIGUOUS_SHELL_CANDIDATES) {
    if (await pathExists(path.join(targetRoot, candidate))) {
      ambiguousShellPaths.push(candidate)
    }
  }

  const shellCertificationCheck = await inspectFormalHostShellCertification({
    shellContent,
    shellPath,
    targetRoot,
  })
  const formalShellMigration = buildFormalShellMigrationPlan({
    shellPath,
    shellCertification: shellCertificationCheck,
  })
  const hasNavigationEvidence = navigationEvidence.length > 0 || ambiguousShellPaths.length > 0
  const shellCertification =
    shellPath && registryPath && shellCertificationCheck.certified
      ? 'certified-existing'
      : shellPath || ambiguousShellPaths.length > 0
        ? 'uncertified-existing'
        : 'missing'
  const selectedBusinessEntryLayers = mergeSelectedBusinessEntryLayers(
    buildSelectedBusinessEntryLayers(selectedBusinessEntry),
    buildSelectedBusinessEntryLayers(selectedLegacyMountEntry),
    buildSelectedBusinessEntryLayers(selectedPublishEntry)
  )

  return {
    formalBusinessShellExists: Boolean(shellPath),
    formalNavigationRegistryExists: Boolean(registryPath),
    formalBusinessShellPath: shellPath,
    formalNavigationRegistryPath: registryPath,
    formalNavigationRegistryCandidatePaths: existingRegistryCandidates,
    formalNavigationRegistryStatus: registryInspection.status,
    formalNavigationRegistryKind: registryInspection.kind,
    formalNavigationRegistryAutoMountSupported: registryInspection.autoMountSupported === true,
    formalNavigationRegistrySupportReason: registryInspection.reason,
    ambiguousFormalNavigationEvidencePaths: ambiguousShellPaths,
    hasNavigationEvidence,
    navigationEvidence,
    navigationEvidencePaths: navigationEvidence.map((item) => item.path).filter(Boolean),
    navigationEvidenceKinds: navigationEvidence.map((item) => item.kind),
    selectedNavigationEvidencePath: registryPath || navigationEvidence[0]?.path || '',
    hasBusinessEntryEvidence: businessEntryEvidence.length > 0,
    businessEntryEvidence,
    businessEntryEvidencePaths: businessEntryEvidence.map((item) => item.path),
    businessEntryEvidenceKinds: businessEntryEvidence.map((item) => item.kind),
    selectedBusinessEntryPath: selectedBusinessEntry?.path || '',
    selectedBusinessEntryKind: selectedBusinessEntry?.kind || '',
    selectedLegacyBackRoutePath: '',
    selectedLegacyBackTitle: '',
    selectedLegacyBackName: '',
    ...selectedBusinessEntryLayers,
    implicitFeatureRegistryExists: Boolean(implicitFeatureRegistry?.featureBaseDir),
    implicitFeatureRegistryPath: implicitFeatureRegistry?.path || '',
    implicitFeatureBaseDir: implicitFeatureRegistry?.featureBaseDir || '',
    implicitFeatureEntryPattern: implicitFeatureRegistry?.featureEntryPattern || '',
    implicitFeatureEntryFileName: implicitFeatureRegistry?.featureEntryFileName || '',
    implicitFeatureEntryExtension: implicitFeatureRegistry?.featureEntryExtension || '',
    businessEntrySelectionBlocked,
    businessEntrySelectionBlockReason,
    formalShellMigration,
    shellCertification,
    shellCertificationEvidence: shellCertificationCheck.evidence,
    shellCertificationMarker: `${FORMAL_HOST_SHELL_CERTIFICATION_MARKER}=${FORMAL_HOST_SHELL_CERTIFICATION_VALUE}`,
    requiredNavigationStyleReference: 'examples/host-integration/src/app-frame-core.tsx',
    formalNavigationMustContainOnlyGeneratedBusinessPages: true,
    forbidSyntheticLandingPage: true,
    defaultLandingPolicy: 'first-generated-business-route',
    previewMustRemainIsolated: true,
  }
}

export function resolveNavigationDecision({ resolvedMode, hostProfile, formalNavigation }) {
  const projectType = normalizeString(hostProfile?.projectType)
  const shellCertification = formalNavigation.shellCertification || 'missing'
  const registryAutoMountSupported = formalNavigation.formalNavigationRegistryAutoMountSupported === true
  const explicitNavigationMountContractKind = normalizeString(
    formalNavigation.explicitNavigationMountContractKind
  )
  const formalShellMigration =
    formalNavigation.formalShellMigration && typeof formalNavigation.formalShellMigration === 'object'
      ? formalNavigation.formalShellMigration
      : buildFormalShellMigrationPlan({
          shellPath: formalNavigation.formalBusinessShellPath,
          shellCertification: {
            certified: shellCertification === 'certified-existing',
            evidence: formalNavigation.shellCertificationEvidence,
          },
        })
  const hasSelectedBusinessEntry = Boolean(formalNavigation.selectedBusinessEntryPath)
  const hasSelectedImplicitFeatureRegistry =
    formalNavigation.implicitFeatureRegistryExists === true &&
    Boolean(formalNavigation.implicitFeatureBaseDir)
  const businessEntrySelectionBlocked = formalNavigation.businessEntrySelectionBlocked === true
  const explicitBusinessEntryMountProvided =
    projectType === 'existing-system' &&
    formalNavigation.explicitNavigationMountProvided === true &&
    explicitNavigationMountContractKind === 'legacy-business-entry' &&
    hasSelectedBusinessEntry
  const shouldAppendToExistingNavigation =
    !explicitBusinessEntryMountProvided &&
    !hasSelectedImplicitFeatureRegistry &&
    formalNavigation.formalNavigationRegistryExists &&
    registryAutoMountSupported &&
    (shellCertification === 'certified-existing' || projectType === 'existing-system')
  const shouldReuseExistingRegistryWithManualMount =
    projectType === 'existing-system' &&
    formalNavigation.formalNavigationRegistryExists &&
    !registryAutoMountSupported &&
    !explicitBusinessEntryMountProvided &&
    !hasSelectedImplicitFeatureRegistry
  const shouldAppendToExistingBusinessEntry =
    projectType === 'existing-system' &&
    hasSelectedBusinessEntry &&
    !businessEntrySelectionBlocked &&
    !shouldAppendToExistingNavigation &&
    !shouldReuseExistingRegistryWithManualMount &&
    !hasSelectedImplicitFeatureRegistry
  const shouldMaterializeImplicitFeatureModule =
    projectType === 'existing-system' &&
    hasSelectedImplicitFeatureRegistry
  const ambiguousNavigationEvidencePaths = [
    ...(formalNavigation.formalBusinessShellExists && !formalNavigation.formalNavigationRegistryExists
      ? [formalNavigation.formalBusinessShellPath]
      : []),
    ...(Array.isArray(formalNavigation.ambiguousFormalNavigationEvidencePaths)
      ? formalNavigation.ambiguousFormalNavigationEvidencePaths
      : []),
  ].filter(Boolean)
  const uncertifiedNavigationEvidencePaths = [
    formalNavigation.formalBusinessShellPath,
    formalNavigation.formalNavigationRegistryPath,
    ...(Array.isArray(formalNavigation.ambiguousFormalNavigationEvidencePaths)
      ? formalNavigation.ambiguousFormalNavigationEvidencePaths
      : []),
  ].filter(Boolean)
  const shouldBlockForUncertifiedExistingNavigation =
    projectType !== 'existing-system' &&
    shellCertification === 'uncertified-existing' &&
    !explicitBusinessEntryMountProvided
  const shouldBlockForAmbiguousNavigationEvidence =
    (projectType !== 'existing-system' || !formalNavigation.formalNavigationRegistryExists) &&
    !shouldBlockForUncertifiedExistingNavigation &&
    !formalNavigation.formalNavigationRegistryExists &&
    !explicitBusinessEntryMountProvided &&
    ambiguousNavigationEvidencePaths.length > 0
  const shouldAutoCreateFormalBusinessShell =
    resolvedMode === 'host-integration' &&
    projectType === 'greenfield' &&
    shellCertification === 'missing' &&
    !hasSelectedBusinessEntry &&
    !businessEntrySelectionBlocked &&
    !shouldBlockForAmbiguousNavigationEvidence
  const shouldBlockForMissingExistingNavigation =
    projectType === 'existing-system' &&
    !shouldAppendToExistingNavigation &&
    !shouldReuseExistingRegistryWithManualMount &&
    !shouldAppendToExistingBusinessEntry &&
    !shouldMaterializeImplicitFeatureModule &&
    !businessEntrySelectionBlocked
  const shouldReuseExistingProjectNavigation =
    projectType === 'existing-system' &&
    (
      shouldAppendToExistingNavigation ||
      shouldReuseExistingRegistryWithManualMount ||
      shouldAppendToExistingBusinessEntry ||
      shouldMaterializeImplicitFeatureModule
    )
  const selectedMountSource = explicitBusinessEntryMountProvided
    ? 'explicit-business-entry-contract'
    : formalNavigation.explicitNavigationMountProvided
    ? 'explicit-navigation-mount-contract'
    : shouldAppendToExistingNavigation
      ? 'navigation-evidence'
      : shouldMaterializeImplicitFeatureModule
        ? 'implicit-feature-registry'
      : shouldAppendToExistingBusinessEntry
        ? 'business-entry-evidence'
        : shouldAutoCreateFormalBusinessShell
          ? 'create-first-formal-shell'
          : 'unknown'

  let formalHostAction = 'no-formal-navigation-change'
  let requiredRegistrationMode = 'none'
  let navigationBlocked = false
  let blockReason = ''
  let mountPointStatus = 'unresolved'
  let mountPointKind = 'missing'
  let mountPointConfirmed = false

  if (shouldAppendToExistingNavigation) {
    formalHostAction = 'append-to-existing-navigation'
    requiredRegistrationMode = 'append-to-single-registry'
    mountPointStatus = 'confirmed'
    mountPointKind = 'existing-route-registry'
    mountPointConfirmed = true
  } else if (shouldReuseExistingRegistryWithManualMount) {
    formalHostAction = 'reuse-existing-navigation-with-manual-registration'
    requiredRegistrationMode = 'manual-register-existing-registry'
    mountPointStatus = 'confirmed'
    mountPointKind = 'existing-route-registry-manual'
    mountPointConfirmed = true
  } else if (shouldMaterializeImplicitFeatureModule) {
    formalHostAction = 'reuse-implicit-feature-navigation'
    requiredRegistrationMode = 'materialize-implicit-feature-entry'
    mountPointStatus = 'confirmed'
    mountPointKind = 'implicit-feature-entry'
    mountPointConfirmed = true
  } else if (shouldAppendToExistingBusinessEntry) {
    formalHostAction = 'reuse-existing-project-navigation'
    requiredRegistrationMode = 'append-to-existing-entry'
    mountPointStatus = 'confirmed'
    mountPointKind = 'legacy-business-entry'
    mountPointConfirmed = true
  } else if (shouldBlockForUncertifiedExistingNavigation) {
    formalHostAction = 'blocked-uncertified-formal-navigation'
    requiredRegistrationMode = 'blocked'
    navigationBlocked = true
    mountPointStatus = 'unresolved'
    mountPointKind = 'unmanaged-shell'
    blockReason = `Uncertified formal navigation evidence exists (${uncertifiedNavigationEvidencePaths.join(', ')}). ${
      formalShellMigration.reason ||
      'Do not attach to it or create a second shell; migrate it to the official managed host-shell wrapper or ask the user for the target navigation mount point.'
    }`
  } else if (businessEntrySelectionBlocked) {
    formalHostAction = 'blocked-ambiguous-business-entry-evidence'
    requiredRegistrationMode = 'blocked'
    navigationBlocked = true
    mountPointStatus = 'unresolved'
    mountPointKind = 'ambiguous-legacy-business-entry'
    blockReason =
      formalNavigation.businessEntrySelectionBlockReason ||
      'Business entry evidence was found, but no single writable mount point could be selected with enough confidence.'
  } else if (shouldBlockForAmbiguousNavigationEvidence) {
    formalHostAction = 'blocked-ambiguous-formal-navigation-evidence'
    requiredRegistrationMode = 'blocked'
    navigationBlocked = true
    mountPointStatus = 'unresolved'
    mountPointKind = 'ambiguous-existing-navigation'
    blockReason = `Existing navigation evidence is ambiguous (${ambiguousNavigationEvidencePaths.join(', ')}), and hiui-design cannot confirm a writable mount point from it yet. Ask the user which existing navigation or entry file should host the page.`
  } else if (shouldAutoCreateFormalBusinessShell) {
    formalHostAction = 'create-formal-host-and-register-first-page'
    requiredRegistrationMode = 'create-single-registry'
    mountPointStatus = 'requires-first-managed-shell'
    mountPointKind = 'create-first-managed-shell'
  } else if (shouldReuseExistingProjectNavigation) {
    formalHostAction = 'reuse-existing-project-navigation'
    requiredRegistrationMode = 'reuse-existing-project-navigation'
  } else if (shouldBlockForMissingExistingNavigation) {
    formalHostAction = 'blocked-missing-existing-navigation-evidence'
    requiredRegistrationMode = 'blocked'
    navigationBlocked = true
    mountPointStatus = 'unresolved'
    mountPointKind = 'missing'
    blockReason =
      'Existing-system project has no confirmed page mount point. Do not auto-create a new navigation; require a manual target entry point or an explicit navigationMountContract that points to the existing mount location.'
  }

  return {
    ...formalNavigation,
    formalShellMigration,
    formalHostAction,
    requiredRegistrationMode,
    selectedMountSource,
    shouldAutoCreateFormalBusinessShell,
    shouldAppendToExistingNavigation,
    shouldReuseExistingRegistryWithManualMount,
    shouldAppendToExistingBusinessEntry,
    shouldMaterializeImplicitFeatureModule,
    shouldReuseExistingProjectNavigation,
    shouldBlockForMissingExistingNavigation,
    shouldBlockForAmbiguousNavigationEvidence,
    shouldBlockForUncertifiedExistingNavigation,
    oldProjectMustNotCreateFormalNavigation: projectType === 'existing-system',
    mountPointStatus,
    mountPointKind,
    mountPointConfirmed,
    navigationBlocked,
    blockReason,
    requiresFormalBusinessShell:
      formalNavigation.formalBusinessShellExists || shouldAutoCreateFormalBusinessShell,
    mustAutoMountFuturePages:
      shouldAppendToExistingNavigation || shouldAutoCreateFormalBusinessShell,
  }
}

export function buildNavigationMountDecision({ navigationDecision }) {
  const decision = navigationDecision || {}
  const hasRegistry = Boolean(decision.formalNavigationRegistryExists)
  const hasShell = Boolean(decision.formalBusinessShellExists)
  const shellCertification = decision.shellCertification || 'missing'
  const explicitNavigationMountProvided = Boolean(decision.explicitNavigationMountProvided)
  const shouldCreateFirstShell = Boolean(decision.shouldAutoCreateFormalBusinessShell)
  const shouldAttachExisting = Boolean(
    decision.shouldAppendToExistingNavigation ||
      decision.shouldReuseExistingRegistryWithManualMount ||
      decision.shouldMaterializeImplicitFeatureModule ||
      decision.shouldAppendToExistingBusinessEntry ||
      decision.shouldReuseExistingProjectNavigation
  )
  const shouldAskUser = Boolean(decision.navigationBlocked) || (!hasRegistry && !shouldCreateFirstShell)
  const selectedMountSource = normalizeString(decision.selectedMountSource) || 'unknown'
  const mountPointStatus = normalizeString(decision.mountPointStatus) || 'unresolved'
  const mountPointKind = normalizeString(decision.mountPointKind) || 'missing'
  const mountPointConfirmed = decision.mountPointConfirmed === true

  let action = 'ask-user'
  if (
    shouldAttachExisting &&
    (hasRegistry || decision.selectedBusinessEntryPath || decision.implicitFeatureBaseDir)
  ) {
    action = 'attach-existing'
  } else if (shouldCreateFirstShell) {
    action = 'create-first-formal-shell'
  } else if (!shouldAskUser) {
    action = 'attach-existing'
  }

  const existingBusinessNavigation = shouldCreateFirstShell
    ? 'missing'
    : decision.shouldMaterializeImplicitFeatureModule
      ? 'implicit-feature-registry'
      : decision.shouldAppendToExistingBusinessEntry
        ? selectedMountSource === 'explicit-business-entry-contract'
          ? 'explicit-business-entry'
          : 'existing-business-entry'
      : decision.formalNavigationRegistryExists
        ? normalizeString(decision.formalNavigationRegistryKind) || shellCertification
      : shellCertification
  const shellSource =
    selectedMountSource === 'explicit-business-entry-contract'
      ? 'explicit-business-entry-contract'
      : explicitNavigationMountProvided
      ? 'explicit-navigation-mount-contract'
      : selectedMountSource === 'implicit-feature-registry'
        ? 'implicit-feature-registry'
      : selectedMountSource === 'business-entry-evidence'
        ? 'existing-business-entry'
      : action === 'create-first-formal-shell'
      ? 'official-host-app-frame'
      : hasShell && shellCertification === 'certified-existing'
        ? 'existing-business-shell'
        : 'unknown'

  let reason = decision.blockReason || ''
  if (!reason) {
    if (action === 'attach-existing') {
      reason =
        selectedMountSource === 'explicit-business-entry-contract'
          ? 'navigationMountContract confirmed a legacy business entry; reuse that mount point before writing page code.'
          : explicitNavigationMountProvided
        ? 'navigationMountContract confirmed an existing navigation registry; mount the page there before writing page code.'
        : selectedMountSource === 'implicit-feature-registry'
          ? 'Existing project navigation auto-discovers feature entry modules; materialize the new feature module before writing page code.'
        : isModuleFederationBusinessEntryKind(decision.selectedBusinessEntryKind)
          ? 'Existing Module Federation expose contract was confirmed as the formal publish entry; reuse that mount point before writing page code.'
        : selectedMountSource === 'business-entry-evidence'
          ? 'Existing project business entry evidence was selected as a confirmed mount point; reuse it before writing page code.'
        : 'Existing project navigation registry was confirmed; mount the page there before writing page code.'
    } else if (action === 'create-first-formal-shell') {
      reason = 'No existing navigation mount point was found in this greenfield host-integration project; create the first managed shell from the official host app-frame before writing page code.'
    } else {
      reason = 'The current project evidence does not confirm a writable page mount point yet; ask the user for the target mount point before writing page code.'
    }
  }

  return {
    existingBusinessNavigation,
    mountPointStatus,
    mountPointKind,
    mountPointConfirmed,
    action,
    selectedMountSource,
    navigationEvidence: decision.navigationEvidence || [],
    businessEntryEvidence: decision.businessEntryEvidence || [],
    formalShellMigration:
      decision.formalShellMigration && typeof decision.formalShellMigration === 'object'
        ? decision.formalShellMigration
        : null,
    routeRegistryPath: decision.formalNavigationRegistryPath || '',
    menuRegistryPath:
      decision.formalNavigationMenuRegistryPath || decision.formalNavigationRegistryPath || '',
    routeRegistryKind: decision.formalNavigationRegistryKind || '',
    routeRegistryStatus: decision.formalNavigationRegistryStatus || '',
    routeRegistryAutoMountSupported: decision.formalNavigationRegistryAutoMountSupported === true,
    routeRegistrySupportReason: decision.formalNavigationRegistrySupportReason || '',
    formalShellPath: decision.formalBusinessShellPath || '',
    businessEntryPath: decision.selectedBusinessEntryPath || '',
    businessEntryKind: decision.selectedBusinessEntryKind || '',
    backRoutePath: decision.selectedLegacyBackRoutePath || '',
    backTitle: decision.selectedLegacyBackTitle || '',
    backName: decision.selectedLegacyBackName || '',
    implicitFeatureBaseDir: decision.implicitFeatureBaseDir || '',
    implicitFeatureEntryPattern: decision.implicitFeatureEntryPattern || '',
    implicitFeatureEntryFileName: decision.implicitFeatureEntryFileName || '',
    implicitFeatureEntryExtension: decision.implicitFeatureEntryExtension || '',
    shellCertification,
    shellCertificationEvidence: decision.shellCertificationEvidence || [],
    shellSource,
    reason,
  }
}

export function buildNavigationMountAction({
  navigationMountDecision,
  navigationDecision,
  pageRelationDecision = null,
  relatedPagePath = '',
  pageRoutePath = '',
  menuTitle = '',
  appEntryPath = '',
  appEntryMountPlan = null,
  resolvedMode = '',
} = {}) {
  const mountDecision = navigationMountDecision || buildNavigationMountDecision({ navigationDecision })
  const decision = navigationDecision || {}
  const normalizedResolvedMode = normalizeInstallMode(resolvedMode)
  const normalizedAppEntryMountPlan =
    appEntryMountPlan && typeof appEntryMountPlan === 'object'
      ? appEntryMountPlan
      : {
          appEntryPath: normalizeRelativePath(appEntryPath),
          supported: Boolean(normalizeRelativePath(appEntryPath)),
          strategy: '',
          reason: '',
        }
  const normalizedAppEntryPath = normalizeRelativePath(
    normalizedAppEntryMountPlan.appEntryPath || appEntryPath
  )
  const normalizedRelatedPagePath = normalizeRelativePath(relatedPagePath)
  const normalizedPageRoutePath = normalizeRelativePath(pageRoutePath).replace(/^\/+/, '')
  const normalizedMenuTitle = normalizeString(menuTitle)
  const normalizedPageRelationKind = normalizeString(pageRelationDecision?.kind)
  const existingRegistryPath = mountDecision.routeRegistryPath || decision.formalNavigationRegistryPath || ''
  const existingRegistryKind =
    mountDecision.routeRegistryKind || decision.formalNavigationRegistryKind || ''
  const existingRegistryAutoMountSupported =
    mountDecision.routeRegistryAutoMountSupported === true ||
    decision.formalNavigationRegistryAutoMountSupported === true
  const existingRegistrySupportReason =
    mountDecision.routeRegistrySupportReason || decision.formalNavigationRegistrySupportReason || ''
  const existingShellPath = mountDecision.formalShellPath || decision.formalBusinessShellPath || ''
  const existingEntryPath = mountDecision.businessEntryPath || decision.selectedBusinessEntryPath || ''
  const existingEntryKind = mountDecision.businessEntryKind || decision.selectedBusinessEntryKind || ''
  const existingBackRoutePath =
    normalizeBusinessEntryRoutePath(mountDecision.backRoutePath || decision.selectedLegacyBackRoutePath) || ''
  const existingBackTitle = normalizeString(mountDecision.backTitle || decision.selectedLegacyBackTitle)
  const existingBackName = normalizeString(mountDecision.backName || decision.selectedLegacyBackName)
  const existingImplicitFeatureBaseDir =
    mountDecision.implicitFeatureBaseDir || decision.implicitFeatureBaseDir || ''
  const existingImplicitFeatureEntryPattern =
    mountDecision.implicitFeatureEntryPattern || decision.implicitFeatureEntryPattern || ''
  const existingImplicitFeatureEntryFileName =
    mountDecision.implicitFeatureEntryFileName || decision.implicitFeatureEntryFileName || ''
  const existingImplicitFeatureEntryExtension =
    mountDecision.implicitFeatureEntryExtension || decision.implicitFeatureEntryExtension || ''
  const selectedMountSource =
    normalizeString(mountDecision.selectedMountSource || decision.selectedMountSource) || 'unknown'

  if (mountDecision.action === 'attach-existing') {
    if (
      normalizedPageRelationKind === 'same-module-subview' &&
      normalizedRelatedPagePath &&
      selectedMountSource !== 'explicit-business-entry-contract'
    ) {
      return buildLegacyBusinessEntryMountAction({
        existingShellPath,
        existingEntryPath: normalizedRelatedPagePath,
        existingEntryKind: 'related-page-subview',
        normalizedAppEntryPath,
        normalizedPageRoutePath,
        normalizedMenuTitle,
        normalizedResolvedMode,
        pageRelationKind: normalizedPageRelationKind,
        selectedMountSource: 'related-page-evidence',
      })
    }

    if (
      (mountDecision.selectedMountSource || decision.selectedMountSource) === 'implicit-feature-registry'
    ) {
      return buildImplicitFeatureRegistryMountAction({
        existingShellPath,
        existingRegistryPath,
        existingImplicitFeatureBaseDir,
        existingImplicitFeatureEntryPattern,
        existingImplicitFeatureEntryFileName,
        existingImplicitFeatureEntryExtension,
        normalizedAppEntryPath,
        normalizedPageRoutePath,
        normalizedMenuTitle,
      })
    }

    if (
      (mountDecision.selectedMountSource || decision.selectedMountSource) ===
        'explicit-business-entry-contract' ||
      decision.shouldAppendToExistingBusinessEntry
    ) {
      return buildLegacyBusinessEntryMountAction({
        existingShellPath,
        existingEntryPath,
        existingEntryKind,
        existingBackRoutePath,
        existingBackTitle,
        existingBackName,
        normalizedAppEntryPath,
        normalizedPageRoutePath,
        normalizedMenuTitle,
        normalizedResolvedMode,
        pageRelationKind: normalizedPageRelationKind,
        selectedMountSource: selectedMountSource || 'business-entry-evidence',
      })
    }

    return buildExistingRouteRegistryMountAction({
      existingShellPath,
      existingRegistryPath,
      existingRegistryKind,
      existingRegistryAutoMountSupported,
      existingRegistrySupportReason,
      normalizedAppEntryPath,
      normalizedPageRoutePath,
      normalizedMenuTitle,
      selectedMountSource:
        mountDecision.selectedMountSource || decision.selectedMountSource || 'navigation-evidence',
    })
  }

  if (mountDecision.action === 'create-first-formal-shell') {
    return buildFormalShellEntryMountAction({
      existingShellPath,
      existingRegistryPath,
      normalizedAppEntryPath,
      normalizedPageRoutePath,
      normalizedMenuTitle,
      normalizedAppEntryMountPlan,
    })
  }

  return {
    action: 'ask-user',
    targetShellPath: existingShellPath,
    targetRegistryPath: existingRegistryPath,
    appEntryPath: normalizedAppEntryPath,
    pageRoutePath: normalizedPageRoutePath,
    menuTitle: normalizedMenuTitle,
    mustDoBeforePageCode: true,
    reason: mountDecision.reason || 'Ask the user for the target page mount point before writing page code.',
  }
}

export async function inspectFormalHostShellOfficialSource() {
  const missingFiles = []

  for (const relativePath of FORMAL_HOST_SHELL_OFFICIAL_SOURCE_REQUIRED_FILES) {
    if (!(await pathExists(path.join(skillRoot, relativePath)))) {
      missingFiles.push(relativePath)
    }
  }

  return {
    status: missingFiles.length === 0 ? 'ready' : 'missing-official-host-source',
    sourceAppFramePath: 'examples/host-integration/src/app-frame-core.tsx',
    managedHostImportSource: getManagedLocalRuntimeHostLogicalSource(),
    requiredFiles: FORMAL_HOST_SHELL_OFFICIAL_SOURCE_REQUIRED_FILES,
    missingFiles,
    reason:
      missingFiles.length === 0
        ? 'Official host-shell core sources are present in the hiui-design skill and can be materialized into the first formal business shell.'
        : `Official host-shell core sources required for the first formal business shell are missing from the hiui-design skill: ${missingFiles.join(', ')}.`,
  }
}

export async function evaluateProjectGenerationReadiness({
  targetRoot,
  mode = '',
  integrationReadiness = null,
  hostProfile = null,
}) {
  recordScanEvent('evaluate-project-generation-readiness', {
    targetRoot: path.resolve(targetRoot),
    mode: normalizeInstallMode(mode || integrationReadiness?.appliedMode),
    hostProfileProvided: Boolean(hostProfile),
  })

  const effectiveHostProfile =
    hostProfile ||
    (await detectHostProfile(targetRoot, {
      ignoreRelativePaths: ['src/typical-page-preview'],
    }))
  const formalNavigation = await detectFormalNavigation(targetRoot)
  const resolvedMode = normalizeInstallMode(mode || integrationReadiness?.appliedMode)
  const navigationDecision = resolveNavigationDecision({
    resolvedMode,
    hostProfile: effectiveHostProfile,
    formalNavigation,
  })
  const navigationMountDecision = buildNavigationMountDecision({ navigationDecision })
  const projectEntryMountCapability = await inspectAppEntryMountPlan(targetRoot)
  const navigationMountAction = buildNavigationMountAction({
    navigationMountDecision,
    navigationDecision,
    appEntryMountPlan: projectEntryMountCapability,
    resolvedMode,
  })
  const officialHostSourceReadiness = await inspectFormalHostShellOfficialSource()
  const checks = []
  const blockingFacts = []
  const rawHostCompatibility = integrationReadiness?.hostCompatibility || {}
  const legacyBusinessEntryProjectGateSatisfied =
    effectiveHostProfile.projectType === 'existing-system' &&
    formalNavigation.hasBusinessEntryEvidence === true &&
    formalNavigation.formalNavigationRegistryExists !== true &&
    navigationDecision.shouldBlockForUncertifiedExistingNavigation !== true &&
    navigationDecision.shouldBlockForAmbiguousNavigationEvidence !== true
  const deferredNavigationMountProjectGateSatisfied =
    effectiveHostProfile.projectType === 'existing-system' &&
    navigationDecision.shouldBlockForMissingExistingNavigation === true &&
    navigationDecision.shouldBlockForUncertifiedExistingNavigation !== true &&
    navigationDecision.shouldBlockForAmbiguousNavigationEvidence !== true
  const officialHostSourceRequired = Boolean(navigationDecision.shouldAutoCreateFormalBusinessShell)
  const react19RuntimePatchBaseline = await inspectReact19ManagedRuntimePatchBaseline({
    targetRoot,
    hostProfile: effectiveHostProfile,
    pkg: effectiveHostProfile?.pkg,
  })
  const installedReact19RuntimePatchCoverage = await inspectInstalledReact19RuntimePatchCoverage({
    targetRoot,
    reactMajor: Number(effectiveHostProfile?.reactMajor || 0),
  })
  const legacyReactCompatibilityClosure = await inspectLegacyReactCompatibilityClosure({
    targetRoot,
    hostProfile: effectiveHostProfile,
  })
  const nodeRuntimePolicy = await inspectNodeRuntimePolicy(targetRoot)
  const publicShell = buildPublicShellContract({
    publicShell: rawHostCompatibility.publicShell || {},
    resolvedMode,
    hostProfile: effectiveHostProfile,
    formalNavigation,
    navigationMountAction,
  })
  const hostCompatibility = {
    ...cloneJson(rawHostCompatibility),
    publicShell,
  }

  checks.push(
    createCheck({
      id: 'integration-readiness',
      status: integrationReadiness?.ready ? 'pass' : 'fail',
      detail: integrationReadiness?.ready
        ? `Project-local hiui-design materialization is ready in ${resolvedMode} mode.`
        : integrationReadiness?.reason || 'Project-local hiui-design materialization is not ready.',
    })
  )
  if (!integrationReadiness?.ready) {
    blockingFacts.push(
      createCheck({
        id: 'integration-readiness',
        status: 'fail',
        detail: integrationReadiness?.reason || 'Project-local hiui-design materialization is not ready.',
      })
    )
  }

  checks.push(
    createCheck({
      id: 'legacy-react-runtime-closure',
      status:
        legacyReactCompatibilityClosure.status === 'needs-closure'
          ? 'fail'
          : legacyReactCompatibilityClosure.status === 'ready'
            ? 'pass'
            : 'warn',
      detail: legacyReactCompatibilityClosure.reason,
    })
  )
  if (integrationReadiness?.ready && legacyReactCompatibilityClosure.status === 'needs-closure') {
    blockingFacts.push(
      createCheck({
        id: 'legacy-react-runtime-closure',
        status: 'fail',
        detail: legacyReactCompatibilityClosure.reason,
      })
    )
  }

  checks.push(
    createCheck({
      id: 'host-compatibility',
      status: hostCompatibility.status === 'ready' ? 'pass' : 'fail',
      detail:
        hostCompatibility.reason ||
        'Project host compatibility has not been proven for hiui-design page generation.',
    })
  )
  if (integrationReadiness?.ready && hostCompatibility.status !== 'ready') {
    blockingFacts.push(
      createCheck({
        id: 'host-compatibility',
        status: 'fail',
        detail:
          hostCompatibility.reason ||
          'Project host compatibility has not been proven for hiui-design page generation.',
      })
    )
  }

  checks.push(
    createCheck({
      id: 'public-shell-viewport-compatibility',
      status:
        publicShell.status === 'blocked'
          ? 'fail'
          : publicShell.status === 'not-checked'
            ? 'warn'
            : 'pass',
      detail:
        publicShell.reason ||
        'Public shell viewport compatibility has not been evaluated for the current host.',
    })
  )

  checks.push(
    createCheck({
      id: 'react19-managed-runtime-patch-baseline',
      status: react19RuntimePatchBaseline.ok ? 'pass' : 'fail',
      detail: react19RuntimePatchBaseline.detail,
    })
  )
  if (integrationReadiness?.ready && !react19RuntimePatchBaseline.ok) {
    blockingFacts.push(
      createCheck({
        id: 'react19-managed-runtime-patch-baseline',
        status: 'fail',
        detail: react19RuntimePatchBaseline.detail,
      })
    )
  }

  checks.push(
    createCheck({
      id: 'installed-react19-runtime-patch-coverage',
      status: installedReact19RuntimePatchCoverage.ok ? 'pass' : 'fail',
      detail: installedReact19RuntimePatchCoverage.detail,
    })
  )
  if (integrationReadiness?.ready && !installedReact19RuntimePatchCoverage.ok) {
    blockingFacts.push(
      createCheck({
        id: 'installed-react19-runtime-patch-coverage',
        status: 'fail',
        detail: installedReact19RuntimePatchCoverage.detail,
      })
    )
  }

  checks.push(
    createCheck({
      id: 'official-host-source-readiness',
      status:
        !officialHostSourceRequired || officialHostSourceReadiness.status === 'ready'
          ? 'pass'
          : 'fail',
      detail: officialHostSourceRequired
        ? officialHostSourceReadiness.reason
        : 'Official host-shell source readiness is not required for the current formal navigation strategy.',
    })
  )
  if (
    integrationReadiness?.ready &&
    officialHostSourceRequired &&
    officialHostSourceReadiness.status !== 'ready'
  ) {
    blockingFacts.push(
      createCheck({
        id: 'official-host-source-readiness',
        status: 'fail',
        detail: officialHostSourceReadiness.reason,
      })
    )
  }

  checks.push(
    createCheck({
      id: 'navigation-mount-readiness',
      status:
        navigationDecision.navigationBlocked &&
        (legacyBusinessEntryProjectGateSatisfied || deferredNavigationMountProjectGateSatisfied)
          ? 'warn'
          : navigationDecision.navigationBlocked
            ? 'fail'
            : 'pass',
      detail: navigationDecision.navigationBlocked
        ? legacyBusinessEntryProjectGateSatisfied
          ? 'Project-level preflight found candidate legacy business mount points in an existing-system host. This no longer blocks the project gate, but each page task must still confirm one concrete mount point through route/title signals or navigationMountContract.entryPath + entryKind before writing page code.'
          : deferredNavigationMountProjectGateSatisfied
            ? 'Project-level preflight did not resolve one concrete mount point yet. This no longer blocks the project gate for existing-system hosts, but each page task must still provide route/title evidence or an explicit navigationMountContract before writing page code.'
          : navigationDecision.blockReason ||
            'Page mount point is not confirmed for managed hiui-design page generation.'
        : 'A writable page mount point can be confirmed for the current project strategy.',
    })
  )
  if (
    integrationReadiness?.ready &&
    navigationDecision.navigationBlocked &&
    !legacyBusinessEntryProjectGateSatisfied &&
    !deferredNavigationMountProjectGateSatisfied
  ) {
    blockingFacts.push(
      createCheck({
        id: 'navigation-mount-readiness',
        status: 'fail',
        detail:
          navigationDecision.blockReason ||
          'Page mount point is not confirmed for managed hiui-design page generation.',
      })
    )
  }

  const status = blockingFacts.length === 0 ? 'ready' : 'blocked'
  const reason =
    status === 'ready'
      ? officialHostSourceRequired
        ? 'Project generation readiness passed, including the official host-shell source required for the first formal business shell.'
        : legacyBusinessEntryProjectGateSatisfied
          ? 'Project generation readiness passed at the project level. Candidate legacy business mount points exist, and each page task must still resolve the concrete mount target before writing page code.'
          : deferredNavigationMountProjectGateSatisfied
            ? 'Project generation readiness passed at the project level. The host supports deferred page mounting, and each page task must still confirm one concrete mount target before writing page code.'
          : 'Project generation readiness passed.'
      : blockingFacts.map((item) => item.detail).join(' ')
  const executionReadiness = nodeRuntimePolicy.blocking
    ? {
        status: 'runtime-blocked',
        blockedBy: ['node-runtime-mismatch'],
        reason: nodeRuntimePolicy.detail,
        nextAction: 'switch-node-runtime',
        nextCommand: '',
        launcherNode: nodeRuntimePolicy.launcherNode,
        effectiveNodeVersion: nodeRuntimePolicy.effectiveNodeVersion,
        expectedNodeRange: nodeRuntimePolicy.expectation?.spec || '',
        source: nodeRuntimePolicy.resolvedRuntime?.source || '',
        reliable: nodeRuntimePolicy.resolvedRuntime?.reliable === true,
      }
    : {}

  return {
    status,
    reason,
    mode: resolvedMode,
    integrationReadiness,
    hostProfile: effectiveHostProfile,
    hostCompatibility,
    formalNavigation,
    projectEntryMountCapability,
    navigationDecision,
    navigationMountDecision,
    navigationMountAction,
    legacyBusinessEntryProjectGateSatisfied,
    deferredNavigationMountProjectGateSatisfied,
    officialHostSourceReadiness,
    officialHostSourceRequired,
    react19RuntimePatchBaseline,
    legacyReactCompatibilityClosure,
    executionReadiness,
    checks,
    blockingFacts,
  }
}
