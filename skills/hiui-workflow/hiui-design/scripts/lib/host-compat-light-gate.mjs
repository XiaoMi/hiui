import fs from 'node:fs/promises'
import path from 'node:path'

import { detectHostProfile } from './detect-host-profile.mjs'
import { inspectNodeRuntimePolicy } from './node-runtime-policy.mjs'
import {
  formatViewportRootIssueDetail,
  inspectViewportRootStyles,
} from './root-viewport-style.mjs'
import {
  describeSharedRuntimeDirectDependencyInspection,
  inspectDeclaredSharedRuntimeDirectDependencies,
  loadSharedRuntimeDirectDependencySnapshot,
  selectEntryImportedSharedRuntimeDirectDependencies,
} from './shared-runtime-direct-dependencies.mjs'
import { inspectManagedHostContract } from './managed-host-contract.mjs'
import { inspectLegacyReactCompatibilityClosure } from './legacy-react-compat-closure.mjs'

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

const HOST_CONTRACT_EXTENSIONS = /\.(?:[cm]?[jt]sx?|s?css)$/i

const OFFICIAL_SHELL_ROOT_CLASS_TOKENS = [
  'pro-table-page',
  'pro-stat-page',
  'pro-tree-split-page',
  'pro-detail-page',
  'pro-edit-page',
]
const LEGACY_HIUI_IMPORT_GLOB_EXTENSIONS = /\.(?:[cm]?[jt]sx?)$/i
const BUILD_CONFIG_CANDIDATES = [
  'vite.config.ts',
  'vite.config.js',
  'build/rspack.base.conf.js',
  'build/webpack.base.conf.js',
  'rspack.config.js',
  'webpack.config.js',
]
const LEGACY_HIUI_IMPORT_PATTERN = /@hi-ui\/hiui\/es\b/g
export const LEGACY_HIUI_IMPORT_FILE_THRESHOLD = 8

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

function isPreviewContractAssetPath(relativePath = '') {
  const normalizedPath = relativePath.replace(/\\/g, '/').toLowerCase()
  return (
    normalizedPath === 'src/typical-page-preview' ||
    normalizedPath.startsWith('src/typical-page-preview/')
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

function importsManagedLocalHostAppFrameCore(source = '') {
  return /TypicalPageAppFrameCore/.test(source) && /from\s+['"]\.\/app-frame-core['"]/.test(source)
}

function hasManagedHostProviderPortal(source = '') {
  return (
    source.includes('TypicalPageHostProvider') &&
    ['headerPortal=', 'headerPortal:', 'footerPortal=', 'footerPortal:'].some((token) =>
      source.includes(token)
    )
  )
}

function hasCollapsibleSharedHeaderSlotProof(source = '') {
  return [
    /hiuiDesignHeaderSlotPolicy\s*=\s*['"]collapses-when-empty['"]/,
    /headerSlotPolicy\s*:\s*['"]collapses-when-empty['"]/,
    /data-hiui-header-slot-policy\s*=\s*['"]collapses-when-empty['"]/,
    /hiui-design:header-slot-policy\s*=\s*collapses-when-empty/i,
  ].some((pattern) => pattern.test(source))
}

function detectContentOutletPath(source = '', referencesOfficialShellRoot = false) {
  const markers = [
    ['styles.mainContentOutlet', 'styles.mainContentOutlet'],
    ['mainContentOutlet', 'mainContentOutlet'],
    ['styles.outlet', 'styles.outlet'],
    ['data-hiui-main-content-outlet', '[data-hiui-main-content-outlet]'],
    ['data-hiui-content-outlet', '[data-hiui-content-outlet]'],
    ['hostOutlet', 'hostOutlet'],
  ]

  for (const [token, outletPath] of markers) {
    if (source.includes(token)) return outletPath
  }

  return referencesOfficialShellRoot ? 'official-shell-root' : ''
}

function detectRightViewportGutterPx(source = '', contentOutletPath = '') {
  if (!contentOutletPath) return 0

  const hasExplicitContentOutletGutterEvidence =
    /--hiui-content-inline-gutter\b/i.test(source) &&
    (/['"]16px['"]/.test(source) || /HOST_CONTENT_VIEWPORT_GUTTER\s*=\s*16\b/i.test(source))

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

  return hasGutterEvidence || hasManagedMainMarginGutterEvidence || hasExplicitContentOutletGutterEvidence
    ? 16
    : 0
}

export const HOST_COMPATIBILITY_STATUS = {
  NOT_CHECKED: 'not-checked',
  READY: 'ready',
  BLOCKED: 'blocked',
}

export const PUBLIC_SHELL_STATUS = {
  NOT_CHECKED: 'not-checked',
  READY: 'ready',
  BLOCKED: 'blocked',
}

function createEmptyFormalHostProfile() {
  return {
    layoutMode: 'unknown',
    headerSlotPolicy: 'unknown',
    hostProviderBridge: false,
    continuousHeightChain: false,
    contentOutletPath: '',
    scrollOwner: 'unknown',
    rightViewportGutterPx: 0,
    leftGapPxWhenMenuCollapsed: 0,
    evidenceFiles: [],
  }
}

function createEmptyFormalHostFacts() {
  return {
    hasHeaderPortalCarrier: false,
    headerPortalCarrierFiles: [],
    hasCollapsibleSharedHeaderSlot: false,
    collapsibleSharedHeaderSlotFiles: [],
    hasTypicalPageHostBridge: false,
    typicalPageHostBridgeFiles: [],
    hasOfficialShellHeightContract: false,
    officialShellHeightContractFiles: [],
    contentOutletPath: '',
    scrollOwner: 'unknown',
    rightViewportGutterPx: 0,
    leftGapPxWhenMenuCollapsed: 0,
    hasContentOutletHeightContract: false,
    contentOutletHeightContractFiles: [],
    hasContentGutterContract: false,
    contentGutterFiles: [],
    hasCertifiedHostShell: false,
    certifiedHostShellFiles: [],
    evidenceFiles: [],
  }
}

function createUncheckedManagedHostContractInspection(
  reason = 'Managed host contract was not evaluated.'
) {
  return {
    status: 'not-checked',
    contractPath: '',
    contractRelativePath: '',
    contract: null,
    errors: [],
    reason,
    evidenceFiles: [],
  }
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
  try {
    return JSON.parse(await fs.readFile(targetPath, 'utf8'))
  } catch {
    return null
  }
}

async function firstExistingPath(targetRoot, candidates) {
  for (const relativePath of candidates) {
    const absolutePath = path.join(targetRoot, relativePath)
    if (await pathExists(absolutePath)) return absolutePath
  }

  return ''
}

async function listProjectSourceFiles(targetRoot, relativeDir = 'src') {
  const sourceRoot = path.join(targetRoot, relativeDir)
  if (!(await pathExists(sourceRoot))) return []

  const files = []

  async function walk(dir) {
    let entries = []
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name)
      const relativePath = toRelative(targetRoot, absolutePath)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
        if (isPreviewContractAssetPath(relativePath)) continue
        await walk(absolutePath)
        continue
      }

      if (LEGACY_HIUI_IMPORT_GLOB_EXTENSIONS.test(entry.name)) {
        files.push(absolutePath)
      }
    }
  }

  await walk(sourceRoot)
  return files
}

async function inspectLegacyHiuiImportDensity(targetRoot) {
  const sourceFiles = await listProjectSourceFiles(targetRoot)
  let matchedFiles = 0
  let matchedImports = 0
  const samples = []

  for (const absolutePath of sourceFiles) {
    const source = await readTextIfExists(absolutePath)
    if (!source) continue
    const matches = source.match(LEGACY_HIUI_IMPORT_PATTERN) || []
    if (matches.length === 0) continue
    matchedFiles += 1
    matchedImports += matches.length
    if (samples.length < 5) {
      samples.push(toRelative(targetRoot, absolutePath))
    }
  }

  return {
    matchedFiles,
    matchedImports,
    samples,
  }
}

async function inspectSchemaTypesAlias(targetRoot) {
  for (const relativePath of BUILD_CONFIG_CANDIDATES) {
    const absolutePath = path.join(targetRoot, relativePath)
    const source = await readTextIfExists(absolutePath)
    if (!source) continue
    if (source.includes('@hi-ui/schema-types')) {
      return {
        ok: true,
        relativePath,
      }
    }
  }

  return {
    ok: false,
    relativePath: '',
  }
}

function toRelative(targetRoot, targetPath) {
  if (!targetPath) return ''
  return path.relative(targetRoot, targetPath).replace(/\\/g, '/')
}

export function createUncheckedHostCompatibility(reason = 'Host compatibility was not evaluated.') {
  return {
    status: HOST_COMPATIBILITY_STATUS.NOT_CHECKED,
    reason,
    riskLevel: 'unknown',
    riskTags: [],
    checks: [],
    blockingChecks: [],
    warnings: [],
    nextAction: 'run-light-host-compat-gate',
    legacyHiuiImportFiles: 0,
    legacyHiuiImportMatches: 0,
    legacyHiuiImportSamples: [],
    formalHostProfile: createEmptyFormalHostProfile(),
    managedHostContract: createUncheckedManagedHostContractInspection(),
    publicShell: createUncheckedPublicShell('Public shell compatibility was not evaluated.'),
  }
}

function createUncheckedPublicShell(reason = 'Public shell compatibility was not evaluated.') {
  return {
    status: PUBLIC_SHELL_STATUS.NOT_CHECKED,
    reason,
    entryFile: '',
    styleFiles: [],
    issueCount: 0,
    blockedBy: [],
    issues: [],
  }
}

function isStrictPublicShellMode({ hostProfile, appliedMode = '' } = {}) {
  return hostProfile?.projectType === 'greenfield' && String(appliedMode || '').trim() === 'host-integration'
}

async function inspectFormalHostPortalAndHeightContract(targetRoot) {
  const sourceRoot = path.join(targetRoot, 'src')
  const facts = {
    hasHeaderPortalCarrier: false,
    headerPortalCarrierFiles: [],
    hasCollapsibleSharedHeaderSlot: false,
    collapsibleSharedHeaderSlotFiles: [],
    hasTypicalPageHostBridge: false,
    typicalPageHostBridgeFiles: [],
    hasOfficialShellHeightContract: false,
    officialShellHeightContractFiles: [],
    contentOutletPath: '',
    scrollOwner: 'unknown',
    rightViewportGutterPx: 0,
    leftGapPxWhenMenuCollapsed: 0,
    hasContentOutletHeightContract: false,
    contentOutletHeightContractFiles: [],
    hasContentGutterContract: false,
    contentGutterFiles: [],
    hasCertifiedHostShell: false,
    certifiedHostShellFiles: [],
  }

  if (!(await pathExists(sourceRoot))) return facts

  async function walk(dir) {
    let entries = []
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const absolutePath = path.join(dir, entry.name)
      const relativePath = toRelative(targetRoot, absolutePath)
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
        if (isPreviewContractAssetPath(relativePath)) continue
        await walk(absolutePath)
        continue
      }

      if (!HOST_CONTRACT_EXTENSIONS.test(entry.name)) continue
      if (isPreviewContractAssetPath(relativePath)) continue
      const source = await readTextIfExists(absolutePath)
      if (!source) continue

      const isFormalHostContractFile = isLikelyFormalHostContractPath(relativePath)
      const referencesOfficialShellRoot = OFFICIAL_SHELL_ROOT_CLASS_TOKENS.some((token) =>
        source.includes(token),
      )
      const contentOutletPath = detectContentOutletPath(source, referencesOfficialShellRoot)
      const rightViewportGutterPx = detectRightViewportGutterPx(source, contentOutletPath)
      const hasHostHeightChainContract = hasFlexMinHeightOverflowContract(source)
      const hasGenericOutletChildContract =
        Boolean(contentOutletPath) &&
        source.includes('> *') &&
        hasHostHeightChainContract
      const looksLikeManagedSelfContainedShellCore =
        /(?:^|\/)app-frame-core\.(?:[cm]?[jt]sx?)$/i.test(relativePath) &&
        referencesOfficialShellRoot &&
        hasHostHeightChainContract &&
        (hasManagedHostProviderPortal(source) || source.includes('TypicalPageHostBridge'))
      const hasCertifiedHostShell =
        (source.includes('official-managed-host-shell-wrapper') &&
          importsManagedLocalHostAppFrameCore(source)) ||
        looksLikeManagedSelfContainedShellCore
      const hasHeaderCarrierToken =
        !looksLikeManagedSelfContainedShellCore &&
        ((isFormalHostContractFile && source.includes('PageHeaderPortal')) ||
          (isFormalHostContractFile && source.includes('TypicalPageHeaderPortal')) ||
          (isFormalHostContractFile && source.includes('role="page-header"')) ||
          (isFormalHostContractFile && source.includes("role='page-header'")) ||
          (isFormalHostContractFile && source.includes('headerRef')))
      if (hasHeaderCarrierToken) {
        facts.hasHeaderPortalCarrier = true
        if (facts.headerPortalCarrierFiles.length < 5) facts.headerPortalCarrierFiles.push(relativePath)
      }

      if (hasHeaderCarrierToken && hasCollapsibleSharedHeaderSlotProof(source)) {
        facts.hasCollapsibleSharedHeaderSlot = true
        if (facts.collapsibleSharedHeaderSlotFiles.length < 5) {
          facts.collapsibleSharedHeaderSlotFiles.push(relativePath)
        }
      }

      const hasHostProviderBridge =
        !looksLikeManagedSelfContainedShellCore &&
        hasManagedHostProviderPortal(source)
      if (hasHostProviderBridge) {
        facts.hasTypicalPageHostBridge = true
        if (facts.typicalPageHostBridgeFiles.length < 5) facts.typicalPageHostBridgeFiles.push(relativePath)
      }

      if (hasCertifiedHostShell) {
        facts.hasCertifiedHostShell = true
        if (facts.certifiedHostShellFiles.length < 5) facts.certifiedHostShellFiles.push(relativePath)
      }

      if (contentOutletPath && !facts.contentOutletPath) {
        facts.contentOutletPath = contentOutletPath
      }

      if (rightViewportGutterPx > facts.rightViewportGutterPx) {
        facts.rightViewportGutterPx = rightViewportGutterPx
        if (rightViewportGutterPx >= 16) {
          facts.leftGapPxWhenMenuCollapsed = Math.max(facts.leftGapPxWhenMenuCollapsed, 16)
        }
      }

      if (
        isFormalHostContractFile &&
        rightViewportGutterPx >= 16
      ) {
        facts.hasContentGutterContract = true
        if (facts.contentGutterFiles.length < 5) facts.contentGutterFiles.push(relativePath)
      }

      if (
        isFormalHostContractFile &&
        ((referencesOfficialShellRoot && hasHostHeightChainContract) ||
          hasGenericOutletChildContract ||
          hasCertifiedHostShell)
      ) {
        facts.hasOfficialShellHeightContract = true
        if (facts.officialShellHeightContractFiles.length < 5) {
          facts.officialShellHeightContractFiles.push(relativePath)
        }
      }

      if (
        isFormalHostContractFile &&
        ((contentOutletPath && hasGenericOutletChildContract) ||
          (contentOutletPath === 'official-shell-root' && hasHostHeightChainContract))
      ) {
        facts.hasContentOutletHeightContract = true
        if (facts.contentOutletHeightContractFiles.length < 5) {
          facts.contentOutletHeightContractFiles.push(relativePath)
        }
      }
    }
  }

  if (facts.hasContentOutletHeightContract) {
    facts.scrollOwner = 'formal-host-content-outlet'
  } else if (facts.hasOfficialShellHeightContract) {
    facts.scrollOwner = 'official-shell-root'
  }

  await walk(sourceRoot)
  return facts
}

function buildFormalHostProfile(formalHostContract = {}) {
  const evidenceFiles = [
    ...new Set(
      [
        ...(formalHostContract.evidenceFiles || []),
        ...(formalHostContract.headerPortalCarrierFiles || []),
        ...(formalHostContract.collapsibleSharedHeaderSlotFiles || []),
        ...(formalHostContract.typicalPageHostBridgeFiles || []),
        ...(formalHostContract.officialShellHeightContractFiles || []),
        ...(formalHostContract.contentOutletHeightContractFiles || []),
        ...(formalHostContract.contentGutterFiles || []),
        ...(formalHostContract.certifiedHostShellFiles || []),
      ].filter(Boolean)
    ),
  ]

  let layoutMode = 'unknown'
  if (formalHostContract.hasCertifiedHostShell) {
    layoutMode = 'self-contained-hiui-shell'
  } else if (formalHostContract.hasHeaderPortalCarrier) {
    layoutMode = 'shared-header-layout'
  }

  return {
    layoutMode,
    headerSlotPolicy:
      formalHostContract.hasCertifiedHostShell
        ? 'no-header-slot'
        : formalHostContract.hasCollapsibleSharedHeaderSlot
          ? 'collapses-when-empty'
        : formalHostContract.hasHeaderPortalCarrier
          ? 'present-unknown-empty-state'
          : 'no-header-slot',
    hostProviderBridge: formalHostContract.hasCertifiedHostShell
      ? false
      : Boolean(formalHostContract.hasTypicalPageHostBridge),
    continuousHeightChain: Boolean(formalHostContract.hasOfficialShellHeightContract),
    contentOutletPath: formalHostContract.contentOutletPath || '',
    scrollOwner: formalHostContract.scrollOwner || 'unknown',
    rightViewportGutterPx: Number.isFinite(formalHostContract.rightViewportGutterPx)
      ? formalHostContract.rightViewportGutterPx
      : 0,
    leftGapPxWhenMenuCollapsed: Number.isFinite(formalHostContract.leftGapPxWhenMenuCollapsed)
      ? formalHostContract.leftGapPxWhenMenuCollapsed
      : 0,
    evidenceFiles,
  }
}

function createCheck({ id, status, detail }) {
  return {
    id,
    status,
    detail,
  }
}

function buildPublicShellReadiness(targetRoot, viewportInspection = {}, options = {}) {
  const strictMode = isStrictPublicShellMode(options)
  const entryFile = toRelative(targetRoot, viewportInspection.entryFile)
  const styleFiles = Array.isArray(viewportInspection.styleFiles)
    ? viewportInspection.styleFiles.map((filePath) => toRelative(targetRoot, filePath)).filter(Boolean)
    : []
  const issues = Array.isArray(viewportInspection.issues)
    ? viewportInspection.issues.map((issue) => ({
        kind: String(issue?.kind || '').trim() || 'unknown',
        detail: String(issue?.detail || '').trim() || 'Public shell compatibility issue detected.',
        filePath: toRelative(targetRoot, issue?.filePath || ''),
      }))
    : []
  const blockedBy = [...new Set(issues.map((issue) => issue.kind).filter(Boolean))]

  if (!entryFile) {
    if (strictMode) {
      return {
        status: PUBLIC_SHELL_STATUS.BLOCKED,
        reason:
          'Public shell compatibility could not be proven because no recognized app entry file could be resolved for the greenfield host-integration project.',
        entryFile: '',
        styleFiles: [],
        issueCount: 1,
        blockedBy: ['unresolved-app-entry'],
        issues: [
          {
            kind: 'unresolved-app-entry',
            detail:
              'No recognized app entry file could be resolved while checking the public shell contract for the greenfield host-integration project.',
            filePath: '',
          },
        ],
      }
    }

    return createUncheckedPublicShell(
      'Public shell compatibility was not evaluated because no recognized app entry file could be resolved.',
    )
  }

  if (issues.length > 0) {
    return {
      status: PUBLIC_SHELL_STATUS.BLOCKED,
      reason: formatViewportRootIssueDetail(targetRoot, viewportInspection.issues || []),
      entryFile,
      styleFiles,
      issueCount: issues.length,
      blockedBy,
      issues,
    }
  }

  if (styleFiles.length === 0) {
    if (strictMode) {
      return {
        status: PUBLIC_SHELL_STATUS.BLOCKED,
        reason: `Public shell compatibility could not be proven because no entry-imported local style file was found from ${entryFile} in the greenfield host-integration project.`,
        entryFile,
        styleFiles: [],
        issueCount: 1,
        blockedBy: ['unverifiable-public-shell'],
        issues: [
          {
            kind: 'unverifiable-public-shell',
            detail: `No entry-imported local style file was found from ${entryFile} while checking the public shell contract for the greenfield host-integration project.`,
            filePath: entryFile,
          },
        ],
      }
    }

    return {
      ...createUncheckedPublicShell(
        `Public shell compatibility was not evaluated because no entry-imported local style file was found from ${entryFile}.`,
      ),
      entryFile,
    }
  }

  return {
    status: PUBLIC_SHELL_STATUS.READY,
    reason: `Public shell viewport compatibility looks ready through ${styleFiles.join(', ')}.`,
    entryFile,
    styleFiles,
    issueCount: 0,
    blockedBy: [],
    issues: [],
  }
}

function buildHostCompatibilityReason({ blockingChecks, hostProfile }) {
  if (blockingChecks.length === 0) {
    if (hostProfile.riskLevel === 'high') {
      return 'High-risk legacy host compatibility baseline is in place. Page generation can proceed through the light gate.'
    }
    return 'Host compatibility light gate passed. Page generation can proceed.'
  }

  return `Host compatibility light gate blocked page generation: ${blockingChecks.map((item) => item.detail).join(' ')}`
}

export async function inspectHostCompatibilityLight(targetRoot, options = {}) {
  const hostProfile =
    options?.hostProfile ||
    (await detectHostProfile(targetRoot, {
      ignoreRelativePaths: ['src/typical-page-preview'],
    }))
  const pkg = await readJsonIfExists(path.join(targetRoot, 'package.json'))
  const entryFilePath = await firstExistingPath(targetRoot, ENTRY_FILE_CANDIDATES)
  const entrySource = await readTextIfExists(entryFilePath)
  const managedHostContract = await inspectManagedHostContract(targetRoot, { hostProfile })
  const formalHostContract =
    managedHostContract.status === 'valid'
      ? managedHostContract.facts
      : managedHostContract.status === 'invalid'
        ? createEmptyFormalHostFacts()
        : await inspectFormalHostPortalAndHeightContract(targetRoot)
  const formalHostProfile = buildFormalHostProfile(formalHostContract)
  const publicShell = buildPublicShellReadiness(
    targetRoot,
    await inspectViewportRootStyles(targetRoot, { hostProfile }),
    {
      hostProfile,
      appliedMode: options.appliedMode,
    }
  )

  const checks = []
  const blockingChecks = []
  const warnings = []
  const nodeRuntimePolicy = await inspectNodeRuntimePolicy(targetRoot)
  const sharedRuntimeDependencyContract = await loadSharedRuntimeDirectDependencySnapshot()
  const requiredSharedRuntimeDirectDependencies = selectEntryImportedSharedRuntimeDirectDependencies({
    entrySource,
    dependencyMap: sharedRuntimeDependencyContract,
  })
  const sharedRuntimeDependencyInspection = await inspectDeclaredSharedRuntimeDirectDependencies({
    targetRoot,
    pkg,
    expectedDependencies: requiredSharedRuntimeDirectDependencies,
  })
  const legacyHiuiImportDensity = await inspectLegacyHiuiImportDensity(targetRoot)
  const schemaTypesAlias = await inspectSchemaTypesAlias(targetRoot)
  const reactPatchImported = entrySource.includes('@hi-ui/patch-for-react')
  const reactMajor = Number(hostProfile?.reactMajor || 0)
  const legacyReactCompatibilityClosure = await inspectLegacyReactCompatibilityClosure({
    targetRoot,
    hostProfile,
  })

  checks.push(
    createCheck({
      id: 'host-profile',
      status: 'pass',
      detail: `Detected ${hostProfile.projectType}/${hostProfile.framework} with risk=${hostProfile.riskLevel}.`,
    }),
  )
  const nodeRuntimeCheck = createCheck({
    id: 'node-runtime-compatibility',
    status: nodeRuntimePolicy.blocking ? 'warn' : 'pass',
    detail: nodeRuntimePolicy.detail,
  })
  checks.push(nodeRuntimeCheck)
  if (nodeRuntimePolicy.blocking) {
    warnings.push(nodeRuntimePolicy.detail)
  }

  const sharedRuntimeDependencyCheck = createCheck({
    id: 'shared-runtime-direct-dependencies',
    status:
      sharedRuntimeDependencyInspection.declaredOk && sharedRuntimeDependencyInspection.resolvableOk
        ? 'pass'
        : 'fail',
    detail: describeSharedRuntimeDirectDependencyInspection(sharedRuntimeDependencyInspection),
  })
  checks.push(sharedRuntimeDependencyCheck)
  if (
    Object.keys(requiredSharedRuntimeDirectDependencies).length > 0 &&
    (!sharedRuntimeDependencyInspection.declaredOk || !sharedRuntimeDependencyInspection.resolvableOk)
  ) {
    blockingChecks.push(sharedRuntimeDependencyCheck)
  }

  const schemaTypesAliasCheck = createCheck({
    id: 'schema-types-alias',
    status: schemaTypesAlias.ok ? 'pass' : 'fail',
    detail: schemaTypesAlias.ok
      ? `Detected @hi-ui/schema-types alias in ${schemaTypesAlias.relativePath}.`
      : 'Missing @hi-ui/schema-types alias in the detected build configuration.',
  })
  checks.push(schemaTypesAliasCheck)
  if (!schemaTypesAlias.ok) {
    blockingChecks.push(schemaTypesAliasCheck)
  }

  const reactPatchImportCheck = createCheck({
    id: 'react-patch-import',
    status: reactPatchImported ? 'pass' : 'fail',
    detail: reactPatchImported
      ? `Detected @hi-ui/patch-for-react import in ${toRelative(targetRoot, entryFilePath)}.`
      : `Missing @hi-ui/patch-for-react import in ${toRelative(targetRoot, entryFilePath) || 'the detected app entry'}.`,
  })
  checks.push(reactPatchImportCheck)
  if (!reactPatchImported) {
    blockingChecks.push(reactPatchImportCheck)
  }

  const reactDomClientCompatCheck = createCheck({
    id: 'react-dom-client-compat',
    status:
      reactMajor >= 18 || legacyReactCompatibilityClosure.status === 'ready' ? 'pass' : 'fail',
    detail:
      reactMajor >= 18
        ? `Detected React ${reactMajor}, which satisfies the react-dom/client managed shell baseline.`
        : legacyReactCompatibilityClosure.status === 'ready'
          ? `Detected legacy React ${reactMajor || 'unknown'} with an explicit compatibility closure, so the react-dom/client managed shell baseline is treated as compatible.`
          : `Detected React ${reactMajor || 'unknown'}, which does not satisfy the react-dom/client managed shell baseline.`,
  })
  checks.push(reactDomClientCompatCheck)
  if (reactMajor > 0 && reactMajor < 18 && legacyReactCompatibilityClosure.status !== 'ready') {
    blockingChecks.push(reactDomClientCompatCheck)
  }

  const legacyHiuiImportDensityCheck = createCheck({
    id: 'legacy-hiui-import-density',
    status:
      legacyHiuiImportDensity.matchedFiles > LEGACY_HIUI_IMPORT_FILE_THRESHOLD ? 'warn' : 'pass',
    detail:
      legacyHiuiImportDensity.matchedFiles > LEGACY_HIUI_IMPORT_FILE_THRESHOLD
        ? `Detected ${legacyHiuiImportDensity.matchedFiles} files importing legacy @hi-ui/hiui/es entrypoints.`
        : `Detected ${legacyHiuiImportDensity.matchedFiles} files importing legacy @hi-ui/hiui/es entrypoints.`,
  })
  checks.push(legacyHiuiImportDensityCheck)
  if (legacyHiuiImportDensityCheck.status === 'warn') {
    warnings.push(
      `Detected ${legacyHiuiImportDensity.matchedFiles} files with legacy @hi-ui/hiui/es imports.`
    )
  }

  const publicShellCheck = createCheck({
    id: 'public-shell-viewport-compatibility',
    status:
      publicShell.status === PUBLIC_SHELL_STATUS.READY
        ? 'pass'
        : publicShell.status === PUBLIC_SHELL_STATUS.BLOCKED
          ? 'fail'
          : 'warn',
    detail: publicShell.reason,
  })
  checks.push(publicShellCheck)
  if (publicShell.status === PUBLIC_SHELL_STATUS.BLOCKED) {
    blockingChecks.push(publicShellCheck)
  } else if (publicShell.status !== PUBLIC_SHELL_STATUS.READY) {
    warnings.push(publicShell.reason)
  }

  if (managedHostContract.status === 'valid' || managedHostContract.status === 'invalid') {
    const managedHostContractCheck = createCheck({
      id: 'managed-host-contract',
      status: managedHostContract.status === 'valid' ? 'pass' : 'fail',
      detail: managedHostContract.reason,
    })
    checks.push(managedHostContractCheck)
    if (managedHostContract.status === 'invalid') {
      blockingChecks.push(managedHostContractCheck)
    }
  }

  return {
    status:
      blockingChecks.length > 0 ? HOST_COMPATIBILITY_STATUS.BLOCKED : HOST_COMPATIBILITY_STATUS.READY,
    reason: buildHostCompatibilityReason({ blockingChecks, hostProfile }),
    riskLevel: hostProfile.riskLevel || 'low',
    riskTags: hostProfile.riskTags || [],
    hostProfile,
    checks,
    blockingChecks,
    warnings,
    nextAction:
      blockingChecks.length > 0 ? 'complete-host-compatibility-baseline' : 'allow-page-generation',
    legacyHiuiImportFiles: legacyHiuiImportDensity.matchedFiles,
    legacyHiuiImportMatches: legacyHiuiImportDensity.matchedImports,
    legacyHiuiImportSamples: legacyHiuiImportDensity.samples,
    formalHostProfile,
    managedHostContract,
    publicShell,
  }
}
