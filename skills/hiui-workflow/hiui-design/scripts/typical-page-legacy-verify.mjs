#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {
  RUNTIME_SEAL_RELATIVE_PATH,
  verifyCanonicalShellBinding,
  verifyPrimitiveRegionFallback,
  verifyRuntimeSeal,
} from './lib/legacy-runtime-provenance.mjs'
import {
  RUNTIME_PROVIDER_CONTRACT_RELATIVE_PATH,
  getRuntimeProviderPageEntry,
  verifyRuntimeProviderContract,
} from './lib/legacy-runtime-provider-policy.mjs'

const HOST_CONTRACT_RELATIVE_PATH = '.local-context/hiui-design/host-contract.json'
const PROJECT_MODE_RELATIVE_PATH = '.local-context/hiui-design/outputs/project-mode.json'
const PROJECT_INTEGRATION_STATE_RELATIVE_PATH = '.local-context/hiui-design/outputs/project-integration-state.json'
const RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH = '.local-context/hiui-design/outputs/runtime-compatibility-lock.json'
const PAGE_CONTRACTS_RELATIVE_DIR = '.local-context/hiui-design/outputs/page-contracts'
const LEGACY_RUNTIME_RELATIVE_PATH = 'src/hiui-runtime/HiuiLegacyPage.tsx'
const WEBPACK_BASE_RELATIVE_PATH = 'build/webpack.base.conf.js'
const DEFAULT_REMOTE_ENTRY_RELATIVE_PATH = 'dist/remoteEntry.js'
const CONTRACT_DIR = 'rules/typical-page-contracts'
const REQUIRED_ADAPTERS = ['request', 'message', 'permission', 'route', 'theme']
const SHELL_COMPONENT_PATTERNS = [
  /<\s*PageHeader\b/,
  /<\s*QueryFilter\b/,
  /<\s*Table\b/,
  /<\s*Pagination\b/,
  /<\s*PageTable\b/,
  /<\s*StatListPageFrame\b/,
  /<\s*TablePageFrame\b/,
  /<\s*TreeTablePageFrame\b/,
  /<\s*TreeSplitPageFrame\b/,
  /<\s*DrawerFormFrame\b/,
  /<\s*DrawerDetailFrame\b/,
  /<\s*FullPageEditFrame\b/,
  /<\s*FullPageDetailFrame\b/,
  /<\s*FeedbackStatusFrame\b/,
  /\brenderQueryFilter\b/,
  /\brenderTable\b/,
  /\brenderPagination\b/,
]
const RUNTIME_COMPONENT_BY_PAGE_TYPE = {
  'table-basic': 'TableBasicPage',
  'table-stat': 'TableStatPage',
  'tree-table': 'TreeTablePage',
  'tree-split': 'TreeSplitPage',
  'drawer-form': 'DrawerFormPage',
  'drawer-detail': 'DrawerDetailPage',
  'full-page-edit': 'FullPageEditPage',
  'full-page-detail': 'FullPageDetailPage',
  'feedback-status': 'FeedbackStatusPage',
}
const OLD_RUNTIME_PATTERNS = [
  /\bHiuiPageBoundary\b/,
  /\bHiuiManagedPageRenderer\b/,
]
const FORBIDDEN_BUSINESS_IMPORT_PATTERNS = [
  [/@hiui-design\/typical-page-shells/, 'business pages must not import @hiui-design/typical-page-shells directly; only src/hiui-runtime may consume shell packages'],
  [/\bfrom\s+['"]hiui5['"]/, 'business pages must not import hiui5 primitives to own locked regions; fill typed slots and let HiuiLegacyPage render the shell'],
  [/\bfrom\s+['"]@hi-ui\/hiui['"]/, 'business pages must not import @hi-ui/hiui primitives to own locked regions; fill typed slots and let HiuiLegacyPage render the shell'],
]
const REGION_PATTERN = /data-hiui5-region\s*=\s*['"]([^'"]+)['"]/g
const TOKEN_OVERRIDE_PATTERN = /--hiui-page-[a-z0-9-]+\s*:/i

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-legacy-verify.mjs" --page-type <id> --page <page-dir-or-page.instance.tsx> [--target <project-root>] [--remote-entry <path>] [--require-remote-entry] [--json]

Checks:
  - host contract exists and required legacy adapters are ready
  - page.instance.tsx uses HiuiLegacyPage with typed slots
  - page.instance.tsx does not handwrite HiUI region roots
  - page.slots.ts exists and only fills editable business slots
  - new legacy flow does not create src/page-components
`)
}

function parseArgs(argv) {
  const options = {
    target: process.cwd(),
    pageType: '',
    page: '',
    remoteEntry: DEFAULT_REMOTE_ENTRY_RELATIVE_PATH,
    requireRemoteEntry: false,
    json: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--require-remote-entry') {
      options.requireRemoteEntry = true
      continue
    }

    if (arg === '--target' || arg === '--page-type' || arg === '--page' || arg === '--remote-entry') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--page-type') options.pageType = value
      if (arg === '--page') options.page = value
      if (arg === '--remote-entry') options.remoteEntry = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.pageType) throw new Error('Missing required --page-type')
  if (!options.page) throw new Error('Missing required --page')
  return options
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath)
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

async function readTextIfExists(filePath) {
  if (!(await pathExists(filePath))) return null
  return fs.readFile(filePath, 'utf8')
}

async function readRuntimeSourceBundle(target, pageType, runtimeProviderEntry = null) {
  const runtimeRoot = path.join(target, 'src', 'hiui-runtime')
  const componentName = RUNTIME_COMPONENT_BY_PAGE_TYPE[pageType]
  const candidates = [
    path.join(runtimeRoot, 'HiuiLegacyPage.tsx'),
    path.join(runtimeRoot, 'shared', 'core.tsx'),
    path.join(runtimeRoot, 'shared', 'list.tsx'),
    path.join(runtimeRoot, 'shared', 'form.tsx'),
    path.join(runtimeRoot, 'shared', 'detail.tsx'),
    componentName ? path.join(runtimeRoot, 'pages', `${componentName}.tsx`) : '',
    runtimeProviderEntry?.runtimeEntry ? path.join(target, runtimeProviderEntry.runtimeEntry) : '',
  ].filter(Boolean)
  const sources = []
  for (const candidate of candidates) {
    const text = await readTextIfExists(candidate)
    if (text !== null) sources.push(text)
  }
  return sources.length > 0 ? sources.join('\n') : null
}

function resolvePagePaths(target, page) {
  const absolutePage = path.resolve(target, page)
  const instancePath = page.endsWith('.tsx') || page.endsWith('.jsx') || page.endsWith('.ts') || page.endsWith('.js')
    ? absolutePage
    : path.join(absolutePage, 'page.instance.tsx')
  const pageDir = path.dirname(instancePath)
  return {
    pageDir,
    instancePath,
    indexPath: path.join(pageDir, 'index.tsx'),
    slotsPath: path.join(pageDir, 'page.slots.ts'),
    requestPath: path.join(pageDir, 'page.request.ts'),
  }
}

function pushIssue(issues, code, message, filePath = '') {
  issues.push({ code, message, path: filePath })
}

function normalizeRelativePath(value) {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\//, '')
}

async function findPageContractForInstance(target, instancePath) {
  const pageContractsDir = path.join(target, PAGE_CONTRACTS_RELATIVE_DIR)
  if (!(await pathExists(pageContractsDir))) {
    return { pageContractsDir, contractPath: '', contract: null }
  }

  const expectedGeneratedPagePath = normalizeRelativePath(path.relative(target, instancePath))
  const entries = await fs.readdir(pageContractsDir).catch(() => [])
  for (const entry of entries.filter((name) => name.endsWith('.json')).sort()) {
    const contractPath = path.join(pageContractsDir, entry)
    try {
      const contract = await readJson(contractPath)
      if (normalizeRelativePath(contract.generatedPagePath) === expectedGeneratedPagePath) {
        return { pageContractsDir, contractPath, contract }
      }
    } catch {
      // Invalid JSON is reported by the matching contract path only; ignore unrelated files here.
    }
  }

  return { pageContractsDir, contractPath: '', contract: null }
}

function hasReadyRuntimeFromIntegrationState(projectIntegrationState) {
  if (!projectIntegrationState || typeof projectIntegrationState !== 'object') return false
  return projectIntegrationState.runtimeIntegrationReady === true && projectIntegrationState.legacyRuntimeSurfaceReady === true
}

function validateProjectMode(projectMode, projectIntegrationState, issues, projectModePath) {
  if (!projectMode || typeof projectMode !== 'object') {
    pushIssue(issues, 'project-mode.missing', `${PROJECT_MODE_RELATIVE_PATH} is required for legacy page-level readiness`, projectModePath)
    return
  }

  if (projectMode.mode && projectMode.mode !== 'legacy-host-compatible') {
    pushIssue(issues, 'project-mode.mode', 'project-mode mode must be legacy-host-compatible', projectModePath)
  }
  if (projectMode.runtime === 'unknown' && !hasReadyRuntimeFromIntegrationState(projectIntegrationState)) {
    pushIssue(issues, 'project-mode.runtimeUnknown', 'project-mode runtime=unknown blocks legacy page-level readiness', projectModePath)
  }
}

function validateRuntimePeerResolution(runtimeCompatibilityLock, issues, lockPath) {
  if (!runtimeCompatibilityLock) {
    pushIssue(issues, 'runtime.compatibilityLock.missing', `Missing ${RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH}`, lockPath)
    return false
  }

  const peerResolutionStatus = String(runtimeCompatibilityLock.peerResolution?.status || '').trim()
  if (peerResolutionStatus === 'blocked') {
    const reasons = Array.isArray(runtimeCompatibilityLock.peerResolution?.blockingReasons)
      ? runtimeCompatibilityLock.peerResolution.blockingReasons.filter(Boolean)
      : []
    pushIssue(
      issues,
      'runtime.peerResolution.blocked',
      reasons.length > 0 ? reasons.join('; ') : 'legacy runtime peer/export resolution is blocked',
      lockPath,
    )
    return false
  }
  return true
}

const RUNTIME_MARKER_PATTERNS_BY_PAGE_TYPE = {
  'table-basic': [
    ['runtime.list.queryBinding', /queryFields\s*=/, 'HiuiLegacyPage runtime must bind typed queryFields into the managed list shell'],
    ['runtime.list.tableBinding', /tableFields\s*=/, 'HiuiLegacyPage runtime must bind typed tableColumns into the managed list shell'],
    ['runtime.table.shell', /TablePageFrame/, 'table-basic runtime must render TablePageFrame'],
  ],
  'tree-table': [
    ['runtime.list.queryBinding', /queryFields\s*=/, 'HiuiLegacyPage runtime must bind typed queryFields into the managed list shell'],
    ['runtime.list.tableBinding', /tableFields=\{resolveTreeTableFields\(pageSlots, actionHandlers\)\}/, 'tree-table runtime must bind typed tableColumns through the governed tree-table field mapper'],
    ['runtime.treeTable.cellRenderer', /renderTreeTableCell/, 'tree-table runtime must preserve tree cell text, indentation, and expander semantics'],
    ['runtime.table.shell', /TablePageFrame/, 'tree-table runtime must render TablePageFrame'],
  ],
  'table-stat': [
    ['runtime.list.queryBinding', /queryFields\s*=/, 'HiuiLegacyPage runtime must bind typed queryFields into the managed list shell'],
    ['runtime.list.tableBinding', /tableFields\s*=/, 'HiuiLegacyPage runtime must bind typed tableColumns into the managed list shell'],
    ['runtime.stat.shell', /StatListPageFrame/, 'table-stat runtime must render StatListPageFrame'],
    ['runtime.stat.officialGrid', /StatOverviewGrid/, 'table-stat runtime must render metric cards through the official StatOverviewGrid'],
    ['runtime.stat.section', /statSection=\{renderMetricSection\(pageSlots\.statItems\)\}/, 'table-stat runtime must bind typed statItems into the stat-section slot'],
  ],
  'tree-split': [
    ['runtime.list.queryBinding', /queryFields\s*=/, 'HiuiLegacyPage runtime must bind typed queryFields into the managed split shell'],
    ['runtime.list.tableBinding', /tableFields\s*=/, 'HiuiLegacyPage runtime must bind typed tableColumns into the managed split shell'],
    ['runtime.treeSplit.shell', /TreeSplitPageFrame/, 'tree-split runtime must render TreeSplitPageFrame'],
    ['runtime.treeSplit.leftPane', /leftPane=\{renderTree\(pageSlots\.treeFields\)\}/, 'tree-split runtime must bind typed treeFields into the leftPane slot'],
  ],
  'drawer-form': [
    ['runtime.drawerForm.shell', /ProFormDrawer/, 'drawer-form runtime must render ProFormDrawer'],
    ['runtime.drawerForm.visible', /\bvisible\b(?!\s*=\s*\{false\})/, 'drawer-form runtime must be visible for runtime evidence'],
    ['runtime.drawerForm.drawerShell', /data-hiui-legacy-region=["']drawer-shell["']/, 'drawer-form runtime must mark drawer-shell'],
    ['runtime.drawerForm.drawerBody', /data-hiui-legacy-region=["']drawer-body["']/, 'drawer-form runtime must mark drawer-body'],
    ['runtime.drawerForm.formBody', /data-hiui-legacy-region=["']form-body["']/, 'drawer-form runtime must mark form-body'],
    ['runtime.drawerForm.drawerFooter', /data-hiui-legacy-region=["']drawer-footer["']/, 'drawer-form runtime must mark drawer-footer'],
  ],
  'drawer-detail': [
    ['runtime.drawerDetail.shell', /ProDetailDrawer/, 'drawer-detail runtime must render ProDetailDrawer'],
    ['runtime.drawerDetail.visible', /\bvisible\b(?!\s*=\s*\{false\})/, 'drawer-detail runtime must be visible for runtime evidence'],
    ['runtime.drawerDetail.drawerShell', /data-hiui-legacy-region=["']drawer-shell["']/, 'drawer-detail runtime must mark drawer-shell'],
    ['runtime.drawerDetail.drawerBody', /data-hiui-legacy-region=["']drawer-body["']/, 'drawer-detail runtime must mark drawer-body'],
    ['runtime.drawerDetail.detailBody', /data-hiui-legacy-region=["']detail-body["']/, 'drawer-detail runtime must mark detail-body'],
    ['runtime.drawerDetail.drawerFooter', /data-hiui-legacy-region=["']drawer-footer["']/, 'drawer-detail runtime must mark drawer-footer'],
  ],
  'full-page-edit': [
    ['runtime.fullPageEdit.provider', /ProEditPageProvider/, 'full-page-edit runtime must render ProEditPageProvider'],
    ['runtime.fullPageEdit.form', /\bForm\b/, 'full-page-edit runtime must render the official Form bridge'],
    ['runtime.fullPageEdit.headerPortal', /TypicalPageHeaderPortal/, 'full-page-edit runtime must render the page header through TypicalPageHeaderPortal'],
    ['runtime.fullPageEdit.formBody', /data-hiui-legacy-region=["']form-body["']/, 'full-page-edit runtime must mark form-body'],
    ['runtime.fullPageEdit.footer', /data-hiui-legacy-region=["']footer["']/, 'full-page-edit runtime must mark footer'],
    ['runtime.fullPageEdit.footerActions', /data-hiui-legacy-region=["']footer-actions["']/, 'full-page-edit runtime must mark footer-actions'],
  ],
  'full-page-detail': [
    ['runtime.fullPageDetail.provider', /ProDetailPageProvider/, 'full-page-detail runtime must render ProDetailPageProvider'],
    ['runtime.fullPageDetail.shell', /ProDetailPage/, 'full-page-detail runtime must render ProDetailPage'],
    ['runtime.fullPageDetail.headerPortal', /TypicalPageHeaderPortal/, 'full-page-detail runtime must render the page header through TypicalPageHeaderPortal'],
    ['runtime.fullPageDetail.whiteBody', /data-hiui-legacy-region=["']white-body["']/, 'full-page-detail runtime must mark white-body'],
    ['runtime.fullPageDetail.detailBody', /data-hiui-legacy-region=["']detail-body["']/, 'full-page-detail runtime must mark detail-body'],
  ],
  'feedback-status': [
    ['runtime.feedback.emptyState', /EmptyState/, 'feedback-status runtime must render the governed EmptyState fallback under the FeedbackStatePanel carrier marker'],
    ['runtime.feedback.header', /data-hiui-legacy-region=["']header["']/, 'feedback-status runtime must mark header'],
    ['runtime.feedback.whiteBody', /data-hiui-legacy-region=["']white-body["']/, 'feedback-status runtime must mark white-body'],
    ['runtime.feedback.panel', /data-hiui-legacy-region=["']feedback-panel["']/, 'feedback-status runtime must mark feedback-panel'],
  ],
}

function validateRuntimeDomMarkers(runtimeText, issues, runtimePath, pageType) {
  if (runtimeText === null) {
    pushIssue(issues, 'runtime.missing', `Missing ${LEGACY_RUNTIME_RELATIVE_PATH}`, runtimePath)
    return
  }

  const requiredMarkers = [
    ['runtime.dom.pageRoot', /data-hiui-page-root\s*=/, 'HiuiLegacyPage runtime must expose data-hiui-page-root for DOM and visual acceptance'],
    ['runtime.dom.shell', /data-hiui-legacy-shell\s*=/, 'HiuiLegacyPage runtime must expose data-hiui-legacy-shell for shell ownership checks'],
    ['runtime.dom.regionOrder', /data-hiui-legacy-region-order\s*=/, 'HiuiLegacyPage runtime must expose data-hiui-legacy-region-order for region ownership checks'],
    ...(RUNTIME_MARKER_PATTERNS_BY_PAGE_TYPE[pageType] || []),
  ]

  for (const [code, pattern, message] of requiredMarkers) {
    if (!pattern.test(runtimeText)) {
      pushIssue(issues, code, message, runtimePath)
    }
  }
}

function isRuntimeParitySample(pageContract) {
  return pageContract?.artifactRole === 'runtime-parity-sample'
}

function validatePageContractBinding(pageContract, issues, pageContractPath, instancePath, target) {
  if (!pageContract) {
    pushIssue(issues, 'page-contract.missing', `Missing page contract whose generatedPagePath matches ${path.relative(target, instancePath)}`, pageContractPath)
    return
  }

  const expectedGeneratedPagePath = normalizeRelativePath(path.relative(target, instancePath))
  const actualGeneratedPagePath = normalizeRelativePath(pageContract.generatedPagePath)
  if (actualGeneratedPagePath !== expectedGeneratedPagePath) {
    pushIssue(issues, 'page-contract.generatedPagePath', `page contract generatedPagePath must be ${expectedGeneratedPagePath}`, pageContractPath)
  }
}

function validateIndexBinding(indexText, issues, indexPath) {
  if (indexText === null) return

  const reexportsPageInstance = /export\s+\{\s*default\s*\}\s+from\s+['"]\.\/page\.instance['"]/.test(indexText)
  const importsPageInstance = /from\s+['"]\.\/page\.instance['"]/.test(indexText)
  const usesHiuiLegacyPage = /\bHiuiLegacyPage\b/.test(indexText)
  const hasMixedDefaultReexport = /export\s+\{[^}]*\bdefault\b\s*,[^}]*\bdefault\s+as\b[^}]*\}\s+from\s+['"]\.\/page\.instance['"]/.test(indexText)
    || /export\s+\{[^}]*\bdefault\s+as\b[^}]*,\s*\bdefault\b[^}]*\}\s+from\s+['"]\.\/page\.instance['"]/.test(indexText)

  if (hasMixedDefaultReexport) {
    pushIssue(
      issues,
      'page.index.exportShape',
      'index.tsx must not mix default and default-as named re-exports from page.instance.tsx; use a simple default re-export or explicit import plus default/named exports so legacy host import checkers can resolve it',
      indexPath,
    )
  }

  if (!reexportsPageInstance && !importsPageInstance && !usesHiuiLegacyPage) {
    pushIssue(
      issues,
      'page.index.binding',
      'index.tsx must re-export page.instance.tsx or otherwise route the exposed entry into HiuiLegacyPage',
      indexPath,
    )
  }
}

function validateActionHandlerBinding(instanceText, slotsText, issues, instancePath) {
  if (instanceText === null || slotsText === null) return
  if (!/\bhandler\s*:/.test(slotsText)) return

  if (!/\bactionHandlers\s*=\s*\{/.test(instanceText)) {
    pushIssue(
      issues,
      'page.instance.actionHandlers',
      'page.slots.ts declares action handler names, so page.instance.tsx must pass actionHandlers into HiuiLegacyPage',
      instancePath,
    )
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function findRemoteExposeKeysForPage(webpackText, pageDir, target) {
  if (webpackText === null) return []

  const relativePageDir = normalizeRelativePath(path.relative(target, pageDir))
  const pageDirSource = `./${relativePageDir}`
  const exposePattern = new RegExp(`["']([^"']+)["']\\s*:\\s*["']${escapeRegExp(pageDirSource)}["']`, 'g')
  const exposedKeys = []
  let match = exposePattern.exec(webpackText)

  while (match) {
    exposedKeys.push(match[1])
    match = exposePattern.exec(webpackText)
  }

  return exposedKeys
}

function validateRemoteExposeBinding(webpackText, issues, webpackPath, pageDir, target) {
  if (webpackText === null) return []
  if (!/ModuleFederationPlugin/.test(webpackText) || !/\bexposes\s*:/.test(webpackText)) return []

  const relativePageDir = normalizeRelativePath(path.relative(target, pageDir))
  const exposedKeys = findRemoteExposeKeysForPage(webpackText, pageDir, target)
  if (exposedKeys.length === 0) {
    pushIssue(
      issues,
      'remote.expose.missing',
      `ModuleFederation exposes must include ${relativePageDir} or the host may keep loading an old remoteEntry module`,
      webpackPath,
    )
  }

  return exposedKeys
}

function validateRemoteEntryArtifact(remoteEntryText, issues, remoteEntryPath, exposedKeys, requireRemoteEntry) {
  if (remoteEntryText === null) {
    if (requireRemoteEntry) {
      pushIssue(
        issues,
        'remote.entry.missing',
        'remoteEntry.js must exist after host build when --require-remote-entry is used',
        remoteEntryPath,
      )
    }
    return false
  }

  if (exposedKeys.length === 0) {
    if (requireRemoteEntry) {
      pushIssue(
        issues,
        'remote.entry.exposeKeyUnknown',
        'remoteEntry.js cannot be verified because webpack exposes does not identify the current page module key',
        remoteEntryPath,
      )
    }
    return false
  }

  const missingKeys = exposedKeys.filter((exposedKey) => !remoteEntryText.includes(exposedKey))
  if (missingKeys.length > 0) {
    if (requireRemoteEntry) {
      pushIssue(
        issues,
        'remote.entry.exposeMissing',
        `remoteEntry.js must include exposed module key(s): ${missingKeys.join(', ')}`,
        remoteEntryPath,
      )
    }
    return false
  }

  return true
}

function validateHostContract(hostContract, issues, hostContractPath) {
  if (hostContract.schemaVersion !== 'host-contract.v1') {
    pushIssue(issues, 'host-contract.schemaVersion', 'host contract schemaVersion must be host-contract.v1', hostContractPath)
  }
  if (hostContract.mode !== 'legacy-host-compatible') {
    pushIssue(issues, 'host-contract.mode', 'host contract mode must be legacy-host-compatible', hostContractPath)
  }
  if (hostContract.styleBoundary?.scopeAttribute !== 'data-hiui-page-root') {
    pushIssue(issues, 'host-contract.styleBoundary', 'styleBoundary.scopeAttribute must be data-hiui-page-root', hostContractPath)
  }

  for (const adapterName of REQUIRED_ADAPTERS) {
    const adapter = hostContract.adapters?.[adapterName]
    if (!adapter) {
      pushIssue(issues, `host-contract.adapter.${adapterName}`, `${adapterName} adapter is required`, hostContractPath)
      continue
    }
    if (adapter.status !== 'ready' && adapter.status !== 'not-required') {
      pushIssue(
        issues,
        `host-contract.adapter.${adapterName}.status`,
        `${adapterName} adapter must be ready or not-required before generating or troubleshooting a page; current status is ${adapter.status}`,
        hostContractPath,
      )
    }
  }
}

function validateTypicalContract(contract, pageType, issues, contractPath) {
  if (contract.schemaVersion !== 'typical-page-contract.v1') {
    pushIssue(issues, 'typical-page-contract.schemaVersion', 'typical page contract schemaVersion must be typical-page-contract.v1', contractPath)
  }
  if (contract.pageTypeId !== pageType) {
    pushIssue(issues, 'typical-page-contract.pageTypeId', `typical page contract pageTypeId must be ${pageType}`, contractPath)
  }
  if (!Array.isArray(contract.regions) || contract.regions.length === 0) {
    pushIssue(issues, 'typical-page-contract.regions', 'typical page contract must declare regions', contractPath)
  }
  if (!Array.isArray(contract.slotSchema?.editableSlots) || contract.slotSchema.editableSlots.length === 0) {
    pushIssue(issues, 'typical-page-contract.slotSchema', 'typical page contract must declare editableSlots', contractPath)
  }
  if (contract.visualTokens?.scope !== 'data-hiui-page-root') {
    pushIssue(issues, 'typical-page-contract.visualTokens', 'visual token scope must be data-hiui-page-root', contractPath)
  }
  if (contract.visualTokens?.tokenSource !== 'src/hiui-runtime/styles.css') {
    pushIssue(issues, 'typical-page-contract.visualTokens.tokenSource', 'visual token source must be src/hiui-runtime/styles.css', contractPath)
  }
}

function validateInstance(instanceText, contract, issues, instancePath, runtimeProviderContract) {
  const runtimeComponent = RUNTIME_COMPONENT_BY_PAGE_TYPE[contract.pageTypeId] || 'HiuiLegacyPage'
  const providerEntry = getRuntimeProviderPageEntry(runtimeProviderContract, contract.pageTypeId)
  const allowedProviderComponent = providerEntry?.componentName || ''
  const usesSpecificRuntime = new RegExp(`\\b${runtimeComponent}\\b`).test(instanceText)
  const usesProviderRuntime = allowedProviderComponent ? new RegExp(`\\b${allowedProviderComponent}\\b`).test(instanceText) : false
  const usesLegacyFacade = /\bHiuiLegacyPage\b/.test(instanceText)
  if (!usesSpecificRuntime && !usesProviderRuntime && !usesLegacyFacade) {
    pushIssue(issues, 'page.instance.runtime', `page.instance.tsx must render through ${runtimeComponent}, a verified runtime provider adapter, or the compatibility HiuiLegacyPage facade`, instancePath)
  }
  if (usesLegacyFacade && !new RegExp(`pageType\\s*=\\s*['"]${contract.pageTypeId}['"]`).test(instanceText)) {
    pushIssue(issues, 'page.instance.pageType', `page.instance.tsx must pass pageType="${contract.pageTypeId}" to HiuiLegacyPage`, instancePath)
  }
  if (!/slots\s*=\s*\{\s*slots\s*\}/.test(instanceText)) {
    pushIssue(issues, 'page.instance.slotsBinding', 'page.instance.tsx must pass typed slots from page.slots.ts into the managed legacy runtime component', instancePath)
  }
  for (const pattern of OLD_RUNTIME_PATTERNS) {
    if (pattern.test(instanceText)) {
      pushIssue(issues, 'page.instance.deprecatedRuntime', `page.instance.tsx must not use deprecated runtime matching ${pattern}`, instancePath)
    }
  }
  if (!/data-hiui-page-root\s*=\s*['"]legacy-host-compatible['"]/.test(instanceText) && /data-hiui-page-root\s*=/.test(instanceText)) {
    pushIssue(issues, 'page.instance.styleBoundary', 'page.instance.tsx must not override data-hiui-page-root manually', instancePath)
  }

  const regionMatches = [...instanceText.matchAll(REGION_PATTERN)]
  for (const match of regionMatches) {
    const region = match[1]
    if (contract.regions?.includes(region)) {
      pushIssue(issues, 'page.instance.regionOwnership', `page.instance.tsx must not handwrite managed region root: ${region}`, instancePath)
    }
  }

  for (const pattern of SHELL_COMPONENT_PATTERNS) {
    if (pattern.test(instanceText)) {
      pushIssue(issues, 'page.instance.shellPrimitive', `page.instance.tsx must not instantiate shell primitive matching ${pattern}`, instancePath)
    }
  }

  if (TOKEN_OVERRIDE_PATTERN.test(instanceText)) {
    pushIssue(issues, 'page.instance.visualToken', 'page.instance.tsx must not override HiUI page visual tokens', instancePath)
  }
}

function validateBusinessPageImports(sourceText, issues, filePath) {
  if (sourceText === null) return
  for (const [pattern, message] of FORBIDDEN_BUSINESS_IMPORT_PATTERNS) {
    if (pattern.test(sourceText)) {
      pushIssue(issues, 'page.businessImport.boundary', message, filePath)
    }
  }
}

function validateNativeFallback(indexText, instanceText, slotsText, issues, indexPath) {
  if (indexText === null) return
  const importsHiuiPrimitives = /\bfrom\s+['"](?:hiui5|@hi-ui\/hiui)['"]/.test(indexText)
  if (!importsHiuiPrimitives) return
  if (instanceText !== null && slotsText !== null) return

  pushIssue(
    issues,
    'page.nativeFallback.disallowed',
    'HiUI typical pages generated by hiui-design must not be converted to native handwritten HiUI pages after runtime failures; keep page.instance.tsx/page.slots.ts and fix the managed HiuiLegacyPage runtime, peer dependencies, or typed slots instead.',
    indexPath,
  )
}

function validateSlots(slotsText, contract, issues, slotsPath) {
  for (const pattern of SHELL_COMPONENT_PATTERNS) {
    if (pattern.test(slotsText)) {
      pushIssue(issues, 'page.slots.shellPrimitive', `page.slots.ts must not replace shell primitive matching ${pattern}`, slotsPath)
    }
  }

  const regionMatches = [...slotsText.matchAll(REGION_PATTERN)]
  for (const match of regionMatches) {
    const region = match[1]
    if (contract.regions?.includes(region)) {
      pushIssue(issues, 'page.slots.regionOwnership', `page.slots.ts must not handwrite managed region root: ${region}`, slotsPath)
    }
  }

  if (TOKEN_OVERRIDE_PATTERN.test(slotsText)) {
    pushIssue(issues, 'page.slots.visualToken', 'page.slots.ts must not override HiUI page visual tokens', slotsPath)
  }

  const editableSlots = contract.slotSchema?.editableSlots || []
  for (const slotId of editableSlots) {
    const slotPattern = new RegExp(`\\b${slotId}\\b`)
    if (!slotPattern.test(slotsText)) {
      pushIssue(issues, 'page.slots.missingSlot', `page.slots.ts must expose editable slot: ${slotId}`, slotsPath)
    }
  }
}

export async function verifyLegacyPage(options) {
  const target = path.resolve(options.target || process.cwd())
  const pageType = options.pageType
  const pagePaths = resolvePagePaths(target, options.page)
  const hostContractPath = path.join(target, HOST_CONTRACT_RELATIVE_PATH)
  const projectModePath = path.join(target, PROJECT_MODE_RELATIVE_PATH)
  const projectIntegrationStatePath = path.join(target, PROJECT_INTEGRATION_STATE_RELATIVE_PATH)
  const runtimeCompatibilityLockPath = path.join(target, RUNTIME_COMPATIBILITY_LOCK_RELATIVE_PATH)
  const legacyRuntimePath = path.join(target, LEGACY_RUNTIME_RELATIVE_PATH)
  const webpackPath = path.join(target, WEBPACK_BASE_RELATIVE_PATH)
  const remoteEntryPath = path.resolve(target, options.remoteEntry || DEFAULT_REMOTE_ENTRY_RELATIVE_PATH)
  const contractPath = path.join(path.dirname(new URL(import.meta.url).pathname), '..', CONTRACT_DIR, `${pageType}.json`)
  const pageComponentsDir = path.join(target, 'src', 'page-components')
  const issues = []

  const [hostContractExists, contractExists, projectMode, projectIntegrationState, runtimeCompatibilityLock, runtimeProviderResult, instanceText, indexText, slotsText, webpackText, remoteEntryText] = await Promise.all([
    pathExists(hostContractPath),
    pathExists(contractPath),
    readJsonIfExists(projectModePath),
    readJsonIfExists(projectIntegrationStatePath),
    readJsonIfExists(runtimeCompatibilityLockPath),
    verifyRuntimeProviderContract({ targetRoot: target, pageType }),
    readTextIfExists(pagePaths.instancePath),
    readTextIfExists(pagePaths.indexPath),
    readTextIfExists(pagePaths.slotsPath),
    readTextIfExists(webpackPath),
    readTextIfExists(remoteEntryPath),
  ])
  const runtimeText = await readRuntimeSourceBundle(target, pageType, runtimeProviderResult.entry)

  let hostContract = null
  if (!hostContractExists) {
    pushIssue(issues, 'host-contract.missing', `Missing ${HOST_CONTRACT_RELATIVE_PATH}. Run typical-page:apply:legacy first; it runs typical-page:legacy:init internally.`, hostContractPath)
  } else {
    try {
      hostContract = await readJson(hostContractPath)
      validateHostContract(hostContract, issues, hostContractPath)
    } catch (error) {
      pushIssue(issues, 'host-contract.invalidJson', `host contract is not valid JSON: ${error instanceof Error ? error.message : String(error)}`, hostContractPath)
    }
  }

  let contract = null
  if (!contractExists) {
    pushIssue(issues, 'typical-page-contract.missing', `Missing typical page contract for ${pageType}`, contractPath)
  } else {
    try {
      contract = await readJson(contractPath)
      validateTypicalContract(contract, pageType, issues, contractPath)
    } catch (error) {
      pushIssue(issues, 'typical-page-contract.invalidJson', `typical page contract is not valid JSON: ${error instanceof Error ? error.message : String(error)}`, contractPath)
    }
  }

  if (instanceText === null) {
    pushIssue(issues, 'page.instance.missing', 'Missing page.instance.tsx', pagePaths.instancePath)
  } else if (contract) {
    validateInstance(instanceText, contract, issues, pagePaths.instancePath, runtimeProviderResult.contract)
  }
  validateBusinessPageImports(instanceText, issues, pagePaths.instancePath)
  validateBusinessPageImports(indexText, issues, pagePaths.indexPath)
  validateNativeFallback(indexText, instanceText, slotsText, issues, pagePaths.indexPath)

  if (slotsText === null) {
    pushIssue(issues, 'page.slots.missing', 'Missing page.slots.ts', pagePaths.slotsPath)
  } else if (contract) {
    validateSlots(slotsText, contract, issues, pagePaths.slotsPath)
  }
  validateBusinessPageImports(slotsText, issues, pagePaths.slotsPath)

  validateProjectMode(projectMode, projectIntegrationState, issues, projectModePath)
  issues.push(...runtimeProviderResult.issues)
  const runtimePeerResolutionOk = runtimeProviderResult.ok || validateRuntimePeerResolution(runtimeCompatibilityLock, issues, runtimeCompatibilityLockPath)
  validateRuntimeDomMarkers(runtimeText, issues, legacyRuntimePath, pageType)
  const runtimeSeal = await verifyRuntimeSeal({ targetRoot: target })
  issues.push(...runtimeSeal.issues)
  const runtimeShellBinding = await verifyCanonicalShellBinding({ targetRoot: target, pageType })
  if (!runtimeProviderResult.ok) issues.push(...runtimeShellBinding.issues)
  const runtimePrimitiveFallback = await verifyPrimitiveRegionFallback({ targetRoot: target, pageType })
  if (!runtimeProviderResult.ok) issues.push(...runtimePrimitiveFallback.issues)

  const pageContractResult = await findPageContractForInstance(target, pagePaths.instancePath)
  validatePageContractBinding(
    pageContractResult.contract,
    issues,
    pageContractResult.contractPath || pageContractResult.pageContractsDir,
    pagePaths.instancePath,
    target,
  )

  validateIndexBinding(indexText, issues, pagePaths.indexPath)
  validateActionHandlerBinding(instanceText, slotsText, issues, pagePaths.instancePath)
  const skipRemoteExposeForParitySample = isRuntimeParitySample(pageContractResult.contract) && !options.requireRemoteEntry
  const exposedKeys = skipRemoteExposeForParitySample ? [] : validateRemoteExposeBinding(webpackText, issues, webpackPath, pagePaths.pageDir, target)
  const remoteEntryArtifact = skipRemoteExposeForParitySample ? false : validateRemoteEntryArtifact(remoteEntryText, issues, remoteEntryPath, exposedKeys, options.requireRemoteEntry)
  const actualRemoteEntryContainsExpose =
    remoteEntryText !== null && exposedKeys.length > 0 && exposedKeys.every((exposedKey) => remoteEntryText.includes(exposedKey))

  if (await pathExists(pageComponentsDir)) {
    pushIssue(issues, 'legacy.pageComponents.created', 'New legacy lightweight flow must not create src/page-components', pageComponentsDir)
  }

  return {
    schemaVersion: 'legacy-verify-result.v1',
    status: issues.length === 0 ? 'passed' : 'failed',
    target,
    pageType,
    page: path.relative(target, pagePaths.pageDir),
    files: {
      hostContract: path.relative(target, hostContractPath),
      typicalPageContract: path.relative(target, contractPath),
      pageContract: pageContractResult.contractPath ? path.relative(target, pageContractResult.contractPath) : '',
      projectMode: path.relative(target, projectModePath),
      projectIntegrationState: projectIntegrationState ? path.relative(target, projectIntegrationStatePath) : '',
      runtimeCompatibilityLock: runtimeCompatibilityLock ? path.relative(target, runtimeCompatibilityLockPath) : '',
      runtimeProviderContract: runtimeProviderResult.contract ? RUNTIME_PROVIDER_CONTRACT_RELATIVE_PATH : '',
      runtimeSeal: RUNTIME_SEAL_RELATIVE_PATH,
      legacyRuntime: path.relative(target, legacyRuntimePath),
      webpackRemoteConfig: webpackText === null ? '' : path.relative(target, webpackPath),
      remoteEntry: remoteEntryText === null ? '' : path.relative(target, remoteEntryPath),
      instance: path.relative(target, pagePaths.instancePath),
      index: path.relative(target, pagePaths.indexPath),
      slots: path.relative(target, pagePaths.slotsPath),
    },
    checks: {
      hostContract: hostContractExists,
      typicalPageContract: contractExists,
      projectMode: Boolean(projectMode),
      runtimeKnown: projectMode?.runtime !== 'unknown' || hasReadyRuntimeFromIntegrationState(projectIntegrationState),
      runtimeDomMarkers: runtimeText !== null && !issues.some((issue) => issue.code === 'runtime.missing' || issue.code.startsWith('runtime.dom.')),
      runtimeSeal: runtimeSeal.ok,
      runtimeCoreHash: runtimeSeal.ok,
      runtimeProvider: runtimeProviderResult.status === 'missing' || runtimeProviderResult.ok,
      runtimeProviderDeclared: Boolean(runtimeProviderResult.contract),
      runtimeCanonicalShell: runtimeProviderResult.ok || runtimeShellBinding.ok,
      runtimePrimitiveFallback: runtimeProviderResult.ok || runtimePrimitiveFallback.ok,
      runtimePeerResolution: runtimePeerResolutionOk,
      remoteExpose: webpackText === null || !issues.some((issue) => issue.code === 'remote.expose.missing'),
      remoteEntryArtifact,
      expectedExposeKeys: exposedKeys,
      actualRemoteEntryContainsExpose,
      pageContract: Boolean(pageContractResult.contract),
      instance: instanceText !== null,
      indexBinding: indexText === null ? false : !issues.some((issue) => issue.code.startsWith('page.index.')),
      slots: slotsText !== null,
      srcPageComponentsAbsent: !(await pathExists(pageComponentsDir)),
    },
    issues,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const result = await verifyLegacyPage(options)

  if (options.json) {
    console.log(JSON.stringify(result, null, 2))
  } else {
    console.log('[hiui-design][typical-page:legacy:verify]')
    console.log(`- status: ${result.status}`)
    if (result.issues.length > 0) {
      console.log('- issues:')
      for (const issue of result.issues) {
        console.log(`  - ${issue.code}: ${issue.message}${issue.path ? ` (${issue.path})` : ''}`)
      }
    }
  }

  if (result.status !== 'passed') {
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:legacy:verify] ${message}`)
    process.exit(1)
  })
}
