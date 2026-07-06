#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadArchetypeDefinition } from './lib/archetypes/load-archetype-manifest.mjs'
import {
  computeManagedPageSourceSnapshot,
  syncManagedPageRegistry,
} from './lib/managed-page-artifacts.mjs'
import { buildTypicalPageReuseTargetError } from './lib/typical-page-route-ownership.mjs'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { validateManagedPageSource } from './lib/managed-page-source-guard.mjs'
import {
  getManagedPageSemanticContract,
  getManagedPageRuntimeSmokeRequirement,
  getRulesOnlyOutputRoot,
  getRequiredOwnershipRolesForPageType,
  getRequiredRegionsForPageType,
  loadRulesOnlyPageContracts,
  normalizeContractPath,
  reconcileManagedPageRuntimeSmokeWorkflow,
  renderRulesOnlyPageContractMarkdown,
  toContractSlug,
  validateRulesOnlyPageContract,
} from './lib/rules-only-page-contracts.mjs'

const HIGH_RISK_TRANSLATION_MAP_PAGE_TYPES = new Set([
  'table-stat',
  'tree-split',
  'drawer-form',
  'drawer-detail',
  'full-page-edit',
  'full-page-detail',
])

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-preflight.mjs" --page <relative-page-path> [--target <project-root>] [--line <line-id>] [--json] [--contract-fixture <quality-pass>]

Default behavior:
  - loads the page contract for the given managed page
  - checks unresolved placeholder mappings before implementation continues
  - runs the same source-level guard used by typical-page:source-gate, including transitive local imports
  - refreshes contract.workflow.preflightStatus so CI and collaborators can see whether the page cleared preflight
`)
}

function parseArgs(argv) {
  const options = {
    contractFixture: '',
    json: false,
    line: '',
    page: '',
    target: process.cwd(),
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === '--json') {
      options.json = true
      continue
    }

    if (arg === '--page' || arg === '--target' || arg === '--line' || arg === '--contract-fixture') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page') options.page = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--line') options.line = value
      if (arg === '--contract-fixture') options.contractFixture = value
      index += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.page) {
    throw new Error('Missing --page')
  }
  if (options.contractFixture && !['quality-pass'].includes(options.contractFixture)) {
    throw new Error('Expected --contract-fixture to be one of: quality-pass')
  }

  return options
}

function buildContractFixtureReport() {
  return {
    schemaVersion: 'preflight-report.v1',
    status: 'passed',
    page: 'src/pages/orders/index.tsx',
    pageType: 'table-basic',
    checks: [
      {
        id: 'preflightBaseline',
        status: 'passed',
        severity: 'info',
        message: 'managed page preflight completed without blocking failures',
        suggestedActionIds: [],
      },
    ],
    blockingReasons: [],
    blockingIssues: [],
    suggestedActions: [],
    pageTypeId: 'table-basic',
    pageTypeLabel: '普通表格',
    workflowStatus: 'preflight-pass',
    preflightStatus: 'pass',
    runtimeSmokeRequired: false,
    runtimeSmokeStatus: 'not-required',
    examplePath: 'examples/host-integration/src/pages/table-basic.tsx',
    hostArchetypePath: 'src/pages/orders/host-archetype.tsx',
    requiredRegions: ['header', 'white-body', 'query-filter', 'table', 'pagination'],
    requiredOwnershipRoles: ['content-slot', 'white-body', 'outer-padding', 'main-scroll'],
    requiredCapabilities: ['header-slot', 'white-body', 'query-filter', 'table', 'pagination'],
    semanticContract: {
      queryFilterRegionRole: 'table-query-filter',
      dimensionSwitchControl: 'not-applicable',
      listShellComposition: 'single-list-shell',
      spacingOwnership: 'single-spacing-owner',
      areaChartFill: 'not-applicable',
    },
    managedChartSection: 'not-declared',
    chartGovernance:
      'Any inserted chart still has to follow the HiUI managed chart stack. Only promote a local chart area into chart-section when the requirement forms an independent analysis block with its own section boundary.',
    i18nStrategy: '(not-declared)',
    formatterPolicy: [],
    warnings: [],
    failures: [],
  }
}

function findUnresolvedMappings(contract) {
  const failures = []
  const regionMappings = Array.isArray(contract?.regionMapping) ? contract.regionMapping : []
  const ownershipMappings = Array.isArray(contract?.ownershipMapping) ? contract.ownershipMapping : []

  for (const mapping of regionMappings) {
    if (String(mapping?.target || '').includes('TODO:')) {
      failures.push(`regionMapping.${mapping.region} still points to a TODO target`)
    }
  }

  for (const mapping of ownershipMappings) {
    if (String(mapping?.target || '').includes('TODO:')) {
      failures.push(`ownershipMapping.${mapping.role} still points to a TODO target`)
    }
  }

  if (String(contract?.hostArchetypePath || '').includes('TODO:')) {
    failures.push('hostArchetypePath still points to a TODO target')
  }

  return failures
}

function hasManagedChartSection(contract) {
  return Array.isArray(contract?.regionMapping)
    ? contract.regionMapping.some(
        (item) => String(item?.region || '').trim().toLowerCase() === 'chart-section'
      )
    : false
}

function getManagedChartGovernanceSummary(contract) {
  const pageTypeId = String(contract?.pageTypeId || '').trim()
  const pageTypeLabel = String(contract?.pageTypeLabel || pageTypeId || 'current page').trim()
  const chartSectionDeclared = hasManagedChartSection(contract)

  if (pageTypeId === 'data-visualization') {
    return {
      managedChartSection: 'required-by-page-type',
      chartGovernance:
        'data-visualization keeps charts and the detail table in one managed analytics workspace; all chart rendering must stay on the approved HiUI chart stack.',
    }
  }

  if (chartSectionDeclared) {
    return {
      managedChartSection: 'declared',
      chartGovernance: `${pageTypeLabel} keeps its original page type. chart-section here means the page owns an independent analysis block, not that the page has been promoted to data-visualization. Any inserted chart still has to follow the HiUI managed chart stack.`,
    }
  }

  return {
    managedChartSection: 'not-declared',
    chartGovernance:
      'Any inserted chart still has to follow the HiUI managed chart stack. Only promote a local chart area into chart-section when the requirement forms an independent analysis block with its own section boundary.',
  }
}

function isChartGovernanceFailure(message) {
  return [
    'chart-section',
    'chart stack',
    'chart-like content',
    'approved chart wrapper',
    '@ant-design/charts',
    'withHiuiResponsiveChart',
    'withHiuiMiniChart',
    'adaptive chart-body',
    'Area/Line/Bar',
  ].some((fragment) => String(message || '').includes(fragment))
}

export function checkIdForFailure(message) {
  const text = String(message || '')
  if (isLegacyRuntimeAdapterFailure(text)) {
    return 'legacyRuntimeAdapter'
  }
  if (text.includes('generationProfile.')) {
    return 'generationProfile'
  }
  if (text.includes('productionContract.')) {
    return 'productionContract'
  }
  if (text.includes('Missing generationProfile metadata')) {
    return 'generationProfile'
  }
  if (text.includes('Missing productionContract metadata')) {
    return 'productionContract'
  }
  if (text.includes('source declares pageType') && text.includes('managed contract is still')) {
    return 'contractPageType'
  }
  if (
    text.includes('regionMapping.') ||
    text.includes('required region') ||
    text.includes('region ')
  ) {
    return 'regionContract'
  }
  if (
    text.includes('ownershipMapping.') ||
    text.includes('ownership role') ||
    text.includes('ownership ')
  ) {
    return 'ownershipMapping'
  }
  if (
    text.includes('source marker') ||
    text.includes('data-hiui5-page-type') ||
    text.includes('hiui-design page-type')
  ) {
    return 'sourceMarker'
  }
  if (text.includes('example gallery') || text.includes('src/typical-page-reuse/')) {
    return 'routeOwnership'
  }
  if (text.includes('directory-page entry') || text.includes('sections.module.scss')) {
    return 'directoryArtifacts'
  }
  if (text.includes('translation-map')) {
    return 'translationMap'
  }
  if (isChartGovernanceFailure(text)) {
    return 'chartGovernance'
  }
  return 'sourceGuard'
}

function suggestedActionIdsForFailure(message) {
  const text = String(message || '')
  if (text.includes('source declares pageType') && text.includes('write-contract')) {
    return ['write-contract-standard']
  }
  if (
    text.includes('generationProfile.') ||
    text.includes('productionContract.') ||
    text.includes('Missing generationProfile metadata') ||
    text.includes('Missing productionContract metadata')
  ) {
    return ['refresh-production-contract']
  }
  if (text.includes('translation-map')) {
    return ['refresh-translation-map']
  }
  return []
}

export function failureCodeForCheckId(checkId) {
  if (checkId === 'contractPageType') return 'CONTRACT_PAGE_TYPE_MISMATCH'
  if (checkId === 'regionContract') return 'REGION_CONTRACT_MISMATCH'
  if (checkId === 'ownershipMapping') return 'OWNERSHIP_MAPPING_MISMATCH'
  if (checkId === 'legacyRuntimeAdapter') return 'LEGACY_RUNTIME_ADAPTER_MISMATCH'
  if (checkId === 'sourceMarker') return 'SOURCE_MARKER_MISSING'
  if (checkId === 'routeOwnership') return 'ROUTE_OWNER_MISSING'
  if (checkId === 'directoryArtifacts') return 'DIRECTORY_ARTIFACTS_MISSING'
  if (checkId === 'chartGovernance') return 'CHART_GOVERNANCE_MISMATCH'
  if (checkId === 'translationMap') return 'TRANSLATION_MAP_STALE'
  if (checkId === 'generationProfile') return 'GENERATION_PROFILE_MISMATCH'
  if (checkId === 'productionContract') return 'PRODUCTION_CONTRACT_MISMATCH'
  return 'PREFLIGHT_SOURCE_GUARD_FAILED'
}

function isLegacyRuntimeAdapterFailure(message) {
  return String(message || '').includes('legacy runtime adapter')
}

function legacyRuntimeAdapterProofFromContract(contract) {
  return contract?.generationProfile?.runtimeAdapterProof ||
    contract?.productionContract?.runtimeAdapterProof ||
    contract?.adapterContract?.runtimeAdapterProof ||
    null
}

export function shouldRequireLegacyRuntimeAdapterProof(contract) {
  const mode = contract?.archetypeMode || contract?.generationProfile?.mode || contract?.productionContract?.mode || ''
  if (mode !== 'legacy-host-compatible') return false

  const generationProfile = contract?.generationProfile || {}
  const legacyStrategyId = String(generationProfile.legacyStrategyId || '').trim()
  return (
    legacyStrategyId === 'runtime-bridged-page-component' ||
    generationProfile.strategy === 'page-component' ||
    generationProfile.strategy === 'controlled-extension' ||
    generationProfile.strategy === 'managed-analytics' ||
    generationProfile.pageComponentStatus === 'selected' ||
    Boolean(generationProfile.pageComponentId)
  )
}

export function findLegacyRuntimeAdapterFailures(contract) {
  if (!shouldRequireLegacyRuntimeAdapterProof(contract)) return []

  const proof = legacyRuntimeAdapterProofFromContract(contract)
  if (!proof) {
    return [
      'Missing legacy runtime adapter proof for selected page component. Regenerate the page contract from plan-page-task so adapter proof is persisted before preflight.',
    ]
  }

  const failures = []
  if (proof.kind !== 'legacy-runtime-adapter') {
    failures.push(`Invalid legacy runtime adapter kind "${proof.kind || '(missing)'}"; expected "legacy-runtime-adapter".`)
  }
  if (proof.status !== 'available') {
    failures.push(`Invalid legacy runtime adapter status "${proof.status || '(missing)'}"; expected "available".`)
  }
  if (proof.responsibility !== 'runtime-bridge-only') {
    failures.push(`Invalid legacy runtime adapter responsibility "${proof.responsibility || '(missing)'}"; adapter must be runtime-bridge-only and must not translate components.`)
  }

  const forbiddenTerms = [
    'translate-hiui-components-to-legacy-components',
    'replace-query-filter-with-legacy-form',
    'replace-managed-table-with-legacy-table',
    'reimplement-pagination-region',
    'wrap-typical-page-as-business-page-component',
  ]
  const declaredResponsibilities = [
    ...(Array.isArray(proof.responsibilities) ? proof.responsibilities : []),
    ...(Array.isArray(proof.allowedResponsibilities) ? proof.allowedResponsibilities : []),
  ]
  const forbiddenDeclared = declaredResponsibilities.filter((responsibility) =>
    forbiddenTerms.includes(responsibility)
  )
  if (forbiddenDeclared.length > 0) {
    failures.push(`Invalid legacy runtime adapter responsibilities: ${forbiddenDeclared.join(', ')}. Adapter proof cannot authorize component translation or region reimplementation.`)
  }

  return failures
}

function blockingIssuesForFailures(failures) {
  return failures.map((failure) => {
    const checkId = checkIdForFailure(failure)
    const suggestedActionIds = suggestedActionIdsForFailure(failure)
    return {
      code: failureCodeForCheckId(checkId),
      source: 'preflight',
      checkId,
      message: failure,
      blocking: true,
      autoFixable: suggestedActionIds.length > 0,
      suggestedActionIds,
    }
  })
}

function checksForPreflight({ failures, warnings }) {
  const failureChecks = failures.map((failure) => ({
    id: checkIdForFailure(failure),
    status: 'failed',
    severity: 'blocking',
    message: failure,
    suggestedActionIds: suggestedActionIdsForFailure(failure),
  }))

  const warningChecks = warnings.map((warning) => ({
    id: 'contractWarning',
    status: 'warning',
    severity: 'warning',
    message: warning,
    suggestedActionIds: [],
  }))

  if (failureChecks.length === 0 && warningChecks.length === 0) {
    return [
      {
        id: 'preflightBaseline',
        status: 'passed',
        severity: 'info',
        message: 'managed page preflight completed without blocking failures',
        suggestedActionIds: [],
      },
    ]
  }

  return [...failureChecks, ...warningChecks]
}

function suggestedActionsForPreflight({ failures, normalizedPagePath, contract }) {
  const actions = []
  if (
    failures.some((failure) =>
      suggestedActionIdsForFailure(failure).includes('write-contract-standard')
    )
  ) {
    actions.push({
      id: 'write-contract-standard',
      phase: 'WriteContract',
      tool: 'npm-script',
      command: 'typical-page:write-contract',
      args: {
        '--page-type': readPageTypeFromDriftFailure(failures) || '<page-type>',
        '--page': normalizedPagePath,
        '--mode': contract.archetypeMode || '<mode>',
        '--preset': 'standard',
      },
      required: true,
      reason: 'refresh stale managed contract before preflight',
      produces: [],
    })
  }
  if (
    failures.some((failure) =>
      suggestedActionIdsForFailure(failure).includes('refresh-translation-map')
    )
  ) {
    actions.push({
      id: 'refresh-translation-map',
      phase: 'TranslationMap',
      tool: 'npm-script',
      command: 'typical-page:translation-map',
      args: {
        '--page': normalizedPagePath,
        '--reason': 'legacy-preflight',
      },
      required: true,
      reason: 'refresh stale or missing legacy translation map before preflight',
      produces: [],
    })
  }
  if (
    failures.some((failure) =>
      suggestedActionIdsForFailure(failure).includes('refresh-production-contract')
    )
  ) {
    actions.push({
      id: 'refresh-production-contract',
      phase: 'WriteContract',
      tool: 'npm-script',
      command: 'typical-page:write-contract',
      args: {
        '--page-type': contract.pageTypeId || '<page-type>',
        '--page': normalizedPagePath,
        '--mode': contract.archetypeMode || '<mode>',
        '--preset': 'standard',
      },
      required: true,
      reason: 'refresh generationProfile and page-production-contract.v1 before preflight',
      produces: ['generationProfile', 'productionContract'],
    })
  }
  return actions
}

function readPageTypeFromDriftFailure(failures) {
  for (const failure of failures) {
    const match = String(failure || '').match(/source declares pageType "([^"]+)"/)
    if (match) return match[1]
  }
  return ''
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function readSourcePageTypeId({ generatedPagePath, targetRoot }) {
  const entryPath = path.join(targetRoot, generatedPagePath)
  try {
    const raw = await fs.readFile(entryPath, 'utf8')
    return (
      raw.match(/data-hiui5-page-type=["']([^"']+)["']/)?.[1] ||
      raw.match(/hiui-design page-type:\s*([^\s*]+)/)?.[1] ||
      ''
    )
  } catch {
    return ''
  }
}

async function findDirectoryArtifactFailures({ generatedPagePath, targetRoot }) {
  const failures = []
  const entryPath = path.join(targetRoot, generatedPagePath)
  const extension = path.extname(entryPath)
  const baseName = path.basename(entryPath, extension)

  if (baseName !== 'index') {
    return failures
  }

  const entryRaw = await fs.readFile(entryPath, 'utf8')
  const isManagedDirectoryEntry =
    /hiui-design page entry:\s*managed-directory-artifacts/.test(entryRaw) ||
    /from ['"]\.\/sections['"]/.test(entryRaw)

  if (!isManagedDirectoryEntry) {
    return failures
  }

  const sectionsPath = path.join(path.dirname(entryPath), `sections${extension}`)
  const sectionsStylePath = path.join(path.dirname(entryPath), 'sections.module.scss')

  if (!(await pathExists(sectionsPath))) {
    failures.push(
      `${generatedPagePath} is a directory-page entry but ${normalizeContractPath(targetRoot, sectionsPath)} is missing`
    )
  }

  if (!(await pathExists(sectionsStylePath))) {
    failures.push(
      `${generatedPagePath} is a directory-page entry but ${normalizeContractPath(targetRoot, sectionsStylePath)} is missing`
    )
  }

  if (failures.length > 0) {
    return failures
  }

  const sectionsRaw = await fs.readFile(sectionsPath, 'utf8')

  if (!/from ['"]\.\/sections['"]/.test(entryRaw)) {
    failures.push(
      `${generatedPagePath} is a directory-page entry but does not import ./sections. Directory-page managed entries must compose business sections from a sibling sections artifact.`
    )
  }

  if (!/\.\/sections\.module\.scss['"]/.test(sectionsRaw)) {
    failures.push(
      `${normalizeContractPath(targetRoot, sectionsPath)} does not import ./sections.module.scss. Directory-page sections must keep local business styles in the sibling sections.module.scss artifact.`
    )
  }

  return failures
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'))
  } catch {
    return null
  }
}

function translationMapPathForPage(targetRoot, page) {
  return path.join(getRulesOnlyOutputRoot(targetRoot), 'translation-maps', `${toContractSlug(page)}.json`)
}

async function findTranslationMapFailures({ contract, normalizedPagePath, snapshot, targetRoot }) {
  const mode = String(contract?.archetypeMode || '').trim()
  const pageTypeId = String(contract?.pageTypeId || '').trim()
  if (mode !== 'legacy-host-compatible' || !HIGH_RISK_TRANSLATION_MAP_PAGE_TYPES.has(pageTypeId)) {
    return []
  }

  const mapPath = translationMapPathForPage(targetRoot, normalizedPagePath)
  const relativeMapPath = normalizeContractPath(targetRoot, mapPath)
  const translationMap = await readJsonIfExists(mapPath)

  if (!translationMap) {
    return [
      `${normalizedPagePath} requires translation-map.v1 for legacy high-risk page type "${pageTypeId}", but ${relativeMapPath} is missing. Run npm run typical-page:translation-map -- --page ${normalizedPagePath} --reason legacy-preflight`,
    ]
  }

  if (translationMap.schemaVersion !== 'translation-map.v1') {
    return [
      `${relativeMapPath} must use schemaVersion "translation-map.v1" before preflight can trust legacy translation mapping. Run npm run typical-page:translation-map -- --page ${normalizedPagePath} --reason legacy-preflight`,
    ]
  }

  if (translationMap.sourceHash !== snapshot.hash) {
    return [
      `${relativeMapPath} translation-map sourceHash is stale for ${normalizedPagePath}. Run npm run typical-page:translation-map -- --page ${normalizedPagePath} --reason legacy-preflight`,
    ]
  }

  return []
}

async function writeContractArtifacts(contractEntry) {
  await fs.writeFile(
    contractEntry.filePath,
    `${JSON.stringify(contractEntry.contract, null, 2)}\n`,
    'utf8'
  )
  await fs.writeFile(
    contractEntry.filePath.replace(/\.json$/, '.md'),
    renderRulesOnlyPageContractMarkdown(contractEntry.contract),
    'utf8'
  )
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    if (options.contractFixture) {
      console.log(JSON.stringify(buildContractFixtureReport(), null, 2))
      return
    }

    const targetRoot = path.resolve(options.target)
    const normalizedPagePath = normalizeContractPath(targetRoot, options.page)
    const routeOwnershipError = buildTypicalPageReuseTargetError(
      normalizedPagePath,
      'typical-page:preflight'
    )
    if (routeOwnershipError) {
      throw new Error(routeOwnershipError)
    }

    const contractsResult = await loadRulesOnlyPageContracts(targetRoot)
    const contractEntry = contractsResult.contracts.find(
      (entry) => entry?.contract?.generatedPagePath === normalizedPagePath
    )

    if (!contractEntry?.contract) {
      throw new Error(
        `${normalizedPagePath} is not registered as a managed page. Run typical-page:start-page first. Use typical-page:write-contract only for low-level maintenance when a managed contract already exists conceptually.`
      )
    }

    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const { manifest } = await loadPageTypeManifest({ skillRoot, line: options.line })
    const sourcePageTypeId = await readSourcePageTypeId({
      generatedPagePath: normalizedPagePath,
      targetRoot,
    })
    const contractPageTypeId = String(contractEntry.contract.pageTypeId || '').trim()
    const hasPageTypeDrift =
      Boolean(sourcePageTypeId && contractPageTypeId) && sourcePageTypeId !== contractPageTypeId
    const pageTypeDriftFailures = hasPageTypeDrift
      ? [
          `${normalizedPagePath} source declares pageType "${sourcePageTypeId}" but the managed contract is still "${contractPageTypeId}". Refresh the contract before preflight so stale page-type rules do not produce misleading failures: npm run typical-page:write-contract -- --page-type ${sourcePageTypeId} --page ${normalizedPagePath} --mode ${contractEntry.contract.archetypeMode || '<mode>'} --preset standard`,
        ]
      : []
    const archetypeDefinition = await loadArchetypeDefinition({
      skillRoot,
      pageTypeId: contractEntry.contract.pageTypeId,
    })
    const baselineSpecPath = path.join(
      skillRoot,
      'docs',
      'validation',
      'archetype-smoke-baselines.json'
    )
    const baselineSpec = JSON.parse(await fs.readFile(baselineSpecPath, 'utf8'))
    const contractValidation = hasPageTypeDrift
      ? { errors: [], warnings: [] }
      : validateRulesOnlyPageContract({
          contract: contractEntry.contract,
          manifest,
          targetRoot,
          archetypeDefinition,
          baselineSpec,
        })
    const unresolvedMappings = hasPageTypeDrift ? [] : findUnresolvedMappings(contractEntry.contract)
    const directoryArtifactFailures = hasPageTypeDrift
      ? []
      : await findDirectoryArtifactFailures({
          generatedPagePath: normalizedPagePath,
          targetRoot,
        })
    const sourceErrors = hasPageTypeDrift
      ? []
      : validateManagedPageSource({
          contract: contractEntry.contract,
          generatedPagePath: normalizedPagePath,
          targetRoot,
        })
    const snapshot = computeManagedPageSourceSnapshot({
      generatedPagePath: normalizedPagePath,
      targetRoot,
    })
    const translationMapFailures = hasPageTypeDrift
      ? []
      : await findTranslationMapFailures({
          contract: contractEntry.contract,
          normalizedPagePath,
          snapshot,
          targetRoot,
        })
    const failures = [
      ...pageTypeDriftFailures,
      ...contractValidation.errors,
      ...findLegacyRuntimeAdapterFailures(contractEntry.contract),
      ...unresolvedMappings,
      ...directoryArtifactFailures,
      ...translationMapFailures,
      ...sourceErrors,
    ]

    const previousWorkflow = contractEntry.contract.workflow || {}
    const previousSnapshotHash = String(previousWorkflow.sourceSnapshotHash || '').trim()
    const wasFinalized = String(previousWorkflow.status || '').trim() === 'finalized'
    const runtimeSmokeWorkflow = reconcileManagedPageRuntimeSmokeWorkflow(
      contractEntry.contract,
      previousWorkflow,
      snapshot.hash
    )
    const workflowStatus =
      wasFinalized && previousSnapshotHash && previousSnapshotHash !== snapshot.hash
        ? 'stale'
        : failures.length === 0 && !wasFinalized
          ? 'preflight-pass'
          : previousWorkflow.status || 'started'

    contractEntry.contract.workflow = {
      ...previousWorkflow,
      status: workflowStatus,
      deliveryStatus: workflowStatus === 'stale' ? 'stale' : previousWorkflow.deliveryStatus || 'not-finalized',
      preflightStatus: failures.length > 0 ? 'fail' : 'pass',
      runtimeSmokeStatus: runtimeSmokeWorkflow.runtimeSmokeStatus,
      runtimeSmokeSnapshotHash: runtimeSmokeWorkflow.runtimeSmokeSnapshotHash,
      runtimeSmokeReportPath: runtimeSmokeWorkflow.runtimeSmokeReportPath,
      sourceSnapshotHash: snapshot.hash,
      staleReason:
        workflowStatus === 'stale'
          ? 'Source snapshot changed after finalize-page. Re-run typical-page:finalize-page on the latest page source.'
          : '',
      lastCommand: 'typical-page:preflight',
    }
    await writeContractArtifacts(contractEntry)
    await syncManagedPageRegistry(targetRoot)

    const warnings = contractValidation.warnings.filter(
      (warning) => !warning.startsWith('generated:')
    )
    const checks = checksForPreflight({ failures, warnings })
    const suggestedActions = suggestedActionsForPreflight({
      failures,
      normalizedPagePath,
      contract: contractEntry.contract,
    })
    const blockingIssues = blockingIssuesForFailures(failures)
    const payload = {
      schemaVersion: 'preflight-report.v1',
      status: failures.length > 0 ? 'failed' : 'passed',
      page: normalizedPagePath,
      pageType: contractEntry.contract.pageTypeId,
      checks,
      blockingReasons: failures,
      blockingIssues,
      suggestedActions,
      pageTypeId: contractEntry.contract.pageTypeId,
      pageTypeLabel: contractEntry.contract.pageTypeLabel,
      workflowStatus: contractEntry.contract.workflow?.status || '(missing)',
      preflightStatus: contractEntry.contract.workflow?.preflightStatus || '(missing)',
      runtimeSmokeRequired: getManagedPageRuntimeSmokeRequirement(contractEntry.contract).required,
      runtimeSmokeStatus: contractEntry.contract.workflow?.runtimeSmokeStatus || '(missing)',
      examplePath: contractEntry.contract.examplePath,
      hostArchetypePath: contractEntry.contract.hostArchetypePath,
      generationProfile: contractEntry.contract.generationProfile || null,
      productionContract: contractEntry.contract.productionContract || null,
      requiredRegions: getRequiredRegionsForPageType(contractEntry.contract.pageTypeId),
      requiredOwnershipRoles: getRequiredOwnershipRolesForPageType(contractEntry.contract.pageTypeId),
      requiredCapabilities: contractEntry.contract.adapterContract?.requiredCapabilities || [],
      semanticContract: getManagedPageSemanticContract(contractEntry.contract),
      ...getManagedChartGovernanceSummary(contractEntry.contract),
      i18nStrategy: contractEntry.contract.i18nBaseline?.runtimePolicy || '(not-declared)',
      formatterPolicy: contractEntry.contract.i18nBaseline?.formatterPolicy || [],
      warnings,
      failures,
    }

    if (options.json) {
      console.log(JSON.stringify(payload, null, 2))
      process.exitCode = failures.length > 0 ? 1 : 0
      return
    }

    console.log('[typical-page:preflight] Summary:')
    console.log(`- page type: ${payload.pageTypeLabel} (${payload.pageTypeId})`)
    console.log(`- workflow status: ${payload.workflowStatus}`)
    console.log(`- preflight status: ${payload.preflightStatus}`)
    console.log(`- example path: ${payload.examplePath}`)
    console.log(`- host archetype path: ${payload.hostArchetypePath}`)
    if (payload.generationProfile) {
      console.log(
        `- generation profile: mold=${payload.generationProfile.moldId || '(missing)'}, startFrom=${payload.generationProfile.startFrom || '(missing)'}, gates=${(payload.generationProfile.requiredGates || []).join(', ') || '(none)'}`
      )
    }
    if (payload.productionContract) {
      console.log(
        `- production contract: policy=${payload.productionContract.policy || '(missing)'}, proof=${payload.productionContract.sourceProofLevel || '(missing)'}`
      )
    }
    console.log(
      `- runtime smoke: required=${String(payload.runtimeSmokeRequired)}, status=${payload.runtimeSmokeStatus}`
    )
    console.log(`- required regions: ${payload.requiredRegions.join(', ') || '(none)'}`)
    console.log(
      `- required ownership roles: ${payload.requiredOwnershipRoles.join(', ') || '(none)'}`
    )
    console.log(`- required capabilities: ${payload.requiredCapabilities.join(', ') || '(none)'}`)
    console.log(
      `- semantic contract: query-filter=${payload.semanticContract.queryFilterRegionRole}, dimension-switch=${payload.semanticContract.dimensionSwitchControl}, list-shell=${payload.semanticContract.listShellComposition}, spacing=${payload.semanticContract.spacingOwnership}, area-fill=${payload.semanticContract.areaChartFill}`
    )
    console.log(`- managed chart section: ${payload.managedChartSection}`)
    console.log(`- chart governance: ${payload.chartGovernance}`)
    console.log(`- i18n strategy: ${payload.i18nStrategy}`)
    console.log(`- formatter policy: ${payload.formatterPolicy.join(', ') || '(none)'}`)

    if (payload.warnings.length > 0) {
      console.log('- contract warnings:')
      payload.warnings.forEach((warning) => {
        console.log(`  - ${warning}`)
      })
    }

    if (payload.failures.length > 0) {
      const chartFailures = payload.failures.filter((failure) => isChartGovernanceFailure(failure))
      console.error(
        '[typical-page:preflight] Failed. Current-page implementation must stop until contract placeholders and source-level issues are cleared.'
      )
      console.error(
        '[typical-page:preflight] Source checks include transitive local imports, so helper contamination is reported here before finalize-page.'
      )
      if (chartFailures.length > 0) {
        console.error(
          '[typical-page:preflight] Chart governance note: any inserted chart still follows the managed HiUI chart stack, and only independent analysis blocks should be declared as chart-section.'
        )
      }
      payload.failures.forEach((failure) => {
        console.error(`  - ${failure}`)
      })
      process.exit(1)
    }

    console.log('[typical-page:preflight] PASS')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:preflight] ${message}`)
    printUsage()
    process.exit(1)
  }
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isDirectRun) {
  main()
}
