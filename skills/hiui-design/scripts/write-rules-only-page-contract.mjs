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
import {
  buildRulesOnlyPageContract,
  getDefaultScrollStrategyForPageType,
  findArchetypeSmokeBaselineEntry,
  getManagedPageRuntimeSmokeDefaultStatus,
  MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT,
  getRequiredOwnershipRolesForPageType,
  getRequiredRegionsForPageType,
  getRulesOnlyPageContractsDir,
  normalizeContractPath,
  reconcileManagedPageRuntimeSmokeWorkflow,
  renderRulesOnlyPageContractMarkdown,
  RULES_ONLY_OWNERSHIP_MODES,
  RULES_ONLY_SCROLL_STRATEGIES,
  toContractSlug,
  validateRulesOnlyPageContract,
} from './lib/rules-only-page-contracts.mjs'

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/write-rules-only-page-contract.mjs" --page-type <page-type-id> --page <relative-page-path> [--preset standard] [--archetype <relative-archetype-path>] [--mode <rules-only|legacy-host-compatible|host-integration>] [--scroll-strategy <${RULES_ONLY_SCROLL_STRATEGIES.join('|')}>] [--query-filter-region-role <table-query-filter|dashboard-control-strip|not-applicable>] [--region <name=target> ...] [--ownership-mode <${RULES_ONLY_OWNERSHIP_MODES.join('|')}>] [--ownership <role=target> ...] [--local-bypass <package=<pkg>;gap=<capability-gap>;adapter=<relative-path>;bridge=<relative-path>;containment=<${MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT.join('|')}>> ...] [--note <text> ...] [--deviation <text> ...] [--id <contract-id>] [--line <line-id>]

Example:
  npm run typical-page:write-contract -- \\
    --page-type full-page-edit \\
    --page src/views/order/create-organization/index.jsx \\
    --archetype src/views/engineer-management/edit.tsx \\
    --region header=宿主编辑页header槽 \\
    --region white-body=宿主主白底编辑工作区 \\
    --region form-body=宿主scroll body \\
    --region footer=宿主sticky footer slot \\
    --ownership-mode page-surface-owns-workspace \\
    --ownership content-slot=宿主 LayoutContent 内容槽 \\
    --ownership white-body=页面根白底编辑主体 \\
    --ownership outer-padding=页面根白底主体承担外层留白 \\
    --ownership main-scroll=formScrollBody \\
    --local-bypass "package=@dnd-kit/sortable;gap=drag-sort-capability;adapter=src/components/kanban/kanban-board-adapter.tsx;bridge=src/components/kanban/kanban-board.tokens.ts;containment=panel-body"

Notes:
  - typical-page:write-contract only refreshes the auditable contract artifact.
  - delivery still has to finish through typical-page:finalize-page.
  - --preset standard infers the managed template path, required regions, and ownership targets for standard typical pages. Use it when converting an existing managed page from one typical page type to another.
  - --region chart-section=<target> is additive. The writer keeps the page type's required regions and appends optional managed regions such as chart-section when the page owns an independent analysis block.
`)
}

function parseArgs(argv) {
  const options = {
    archetype: '',
    contractId: '',
    deviations: [],
    line: '',
    localBypasses: [],
    mode: '',
    notes: [],
    ownershipMode: '',
    ownerships: [],
    page: '',
    pageTypeId: '',
    preset: '',
    queryFilterRegionRole: '',
    regions: [],
    scrollStrategy: '',
    target: process.cwd(),
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (
      arg === '--page-type' ||
      arg === '--page' ||
      arg === '--archetype' ||
      arg === '--id' ||
      arg === '--line' ||
      arg === '--mode' ||
      arg === '--preset' ||
      arg === '--scroll-strategy' ||
      arg === '--target' ||
      arg === '--ownership-mode' ||
      arg === '--query-filter-region-role'
    ) {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page-type') options.pageTypeId = value
      if (arg === '--page') options.page = value
      if (arg === '--archetype') options.archetype = value
      if (arg === '--id') options.contractId = value
      if (arg === '--line') options.line = value
      if (arg === '--mode') options.mode = value
      if (arg === '--preset') options.preset = value
      if (arg === '--scroll-strategy') options.scrollStrategy = value
      if (arg === '--target') options.target = value
      if (arg === '--ownership-mode') options.ownershipMode = value
      if (arg === '--query-filter-region-role') options.queryFilterRegionRole = value
      i += 1
      continue
    }

    if (
      arg === '--region' ||
      arg === '--ownership' ||
      arg === '--note' ||
      arg === '--deviation' ||
      arg === '--local-bypass'
    ) {
      const value = argv[i + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--region') options.regions.push(value)
      if (arg === '--ownership') options.ownerships.push(value)
      if (arg === '--note') options.notes.push(value)
      if (arg === '--deviation') options.deviations.push(value)
      if (arg === '--local-bypass') options.localBypasses.push(value)
      i += 1
      continue
    }

    if (arg === '--help' || arg === '-h') {
      printUsage()
      process.exit(0)
    }

    throw new Error(`Unknown argument: ${arg}`)
  }

  if (!options.pageTypeId) throw new Error('Missing --page-type')
  if (!options.page) throw new Error('Missing --page')
  if (options.preset && options.preset !== 'standard') {
    throw new Error('Expected --preset to be standard')
  }
  if (!options.archetype && !options.preset) throw new Error('Missing --archetype')
  if (options.regions.length === 0 && !options.preset) {
    throw new Error('At least one --region <name=target> is required')
  }
  if (options.mode && !['rules-only', 'legacy-host-compatible', 'host-integration'].includes(options.mode)) {
    throw new Error('Expected --mode to be rules-only, legacy-host-compatible, or host-integration')
  }
  if (options.scrollStrategy && !RULES_ONLY_SCROLL_STRATEGIES.includes(options.scrollStrategy)) {
    throw new Error(
      `Expected --scroll-strategy to be one of: ${RULES_ONLY_SCROLL_STRATEGIES.join(', ')}`
    )
  }

  return options
}

function parseLocalBypasses(values, targetRoot) {
  return values.map((value) => {
    const record = {}

    for (const segment of String(value || '').split(';')) {
      const trimmedSegment = segment.trim()
      if (!trimmedSegment) continue

      const separatorIndex = trimmedSegment.indexOf('=')
      if (separatorIndex <= 0 || separatorIndex === trimmedSegment.length - 1) {
        throw new Error(
          `Invalid --local-bypass value: ${value}. Expected package=<pkg>;gap=<capability-gap>;adapter=<path>;bridge=<path>;containment=<value>`
        )
      }

      const rawKey = trimmedSegment.slice(0, separatorIndex).trim()
      const rawValue = trimmedSegment.slice(separatorIndex + 1).trim()
      const normalizedKey = {
        package: 'packageSpec',
        packageSpec: 'packageSpec',
        gap: 'capabilityGap',
        capabilityGap: 'capabilityGap',
        adapter: 'adapterPath',
        adapterPath: 'adapterPath',
        bridge: 'tokenBridgePath',
        tokenBridgePath: 'tokenBridgePath',
        containment: 'ownerContainment',
        ownerContainment: 'ownerContainment',
      }[rawKey]

      if (!normalizedKey) {
        throw new Error(
          `Invalid --local-bypass key: ${rawKey}. Supported keys: package, gap, adapter, bridge, containment`
        )
      }

      record[normalizedKey] =
        normalizedKey === 'adapterPath' || normalizedKey === 'tokenBridgePath'
          ? normalizeContractPath(targetRoot, rawValue)
          : rawValue
    }

    if (
      record.ownerContainment &&
      !MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT.includes(record.ownerContainment)
    ) {
      throw new Error(
        `Invalid --local-bypass containment: ${record.ownerContainment}. Expected one of: ${MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT.join(
          ', '
        )}`
      )
    }

    return record
  })
}

function parseRegionMappings(values) {
  return values.map((value) => {
    const separatorIndex = value.indexOf('=')
    if (separatorIndex <= 0 || separatorIndex === value.length - 1) {
      throw new Error(`Invalid --region value: ${value}. Expected name=target`)
    }

    const region = value.slice(0, separatorIndex).trim()
    const target = value.slice(separatorIndex + 1).trim()

    if (!region || !target) {
      throw new Error(`Invalid --region value: ${value}. Expected name=target`)
    }

    return { region, target }
  })
}

const STANDARD_REGION_TARGETS_BY_PAGE_TYPE = Object.freeze({
  'table-basic': {
    header: 'TablePageFrame.title+extra',
    'white-body': 'TablePageFrame.root',
    'query-filter': 'TablePageFrame.queryFields',
    table: 'TablePageFrame.tableFields',
    pagination: 'TablePageFrame.managedPagination',
  },
  'table-stat': {
    header: 'StatListPageFrame.title+extra',
    'white-body': 'StatListPageFrame.root',
    'stat-section': 'StatOverviewGrid',
    'query-filter': 'StatListPageFrame.queryFields',
    table: 'StatListPageFrame.tableFields',
    pagination: 'StatListPageFrame.managedPagination',
  },
  'data-visualization': {
    header: 'DataVisualizationPageFrame.title+extra',
    'white-body': 'DataVisualizationPageFrame.root',
    'stat-section': 'StatOverviewGrid',
    'query-filter': 'DataVisualizationPageFrame.queryFields',
    'chart-section': 'managed chart-section',
    table: 'StatListPageFrame.tableFields',
    pagination: 'StatListPageFrame.managedPagination',
  },
  'tree-table': {
    header: 'TablePageFrame.title+extra',
    'white-body': 'TablePageFrame.root',
    'query-filter': 'TablePageFrame.queryFields',
    table: 'TablePageFrame.tableFields',
    pagination: 'TablePageFrame.managedPagination',
  },
  'tree-split': {
    header: 'TreeSplitPageFrame.title+extra',
    'split-workspace': 'TreeSplitPageFrame.root',
    'left-tree': 'TreeSplitPageFrame.leftPane',
    'right-list': 'TreeSplitPageFrame.rightPane',
    'query-filter': 'TreeSplitPageFrame.queryFields',
    table: 'TreeSplitPageFrame.tableFields',
    pagination: 'TreeSplitPageFrame.managedPagination',
  },
  'drawer-form': {
    header: 'DrawerFormPageFrame.header',
    'drawer-body': 'DrawerFormPageFrame.body',
    'form-body': 'DrawerFormPageFrame.formBody',
    'drawer-footer': 'DrawerFormPageFrame.footer',
    'footer-actions': 'DrawerFormPageFrame.footerActions',
  },
  'drawer-detail': {
    header: 'DrawerDetailPageFrame.header',
    'drawer-body': 'DrawerDetailPageFrame.body',
    'detail-body': 'DrawerDetailPageFrame.detailBody',
    'drawer-footer': 'DrawerDetailPageFrame.footer',
  },
  'feedback-status': {
    header: 'FeedbackStatusPageFrame.title+extra',
    'white-body': 'FeedbackStatusPageFrame.root',
    'feedback-panel': 'FeedbackStatusPageFrame.feedbackPanel',
  },
  'full-page-edit': {
    header: 'ProEditPage.header',
    'header-leading': 'ProEditPage.headerLeading',
    'header-actions': 'ProEditPage.headerActions',
    'white-body': 'ProEditPage.root',
    'form-body': 'ProEditPage.formBody',
    footer: 'ProEditPage.footer',
    'footer-actions': 'ProEditPage.footerActions',
  },
  'full-page-detail': {
    header: 'ProDetailPage.header',
    'white-body': 'ProDetailPage.root',
    'detail-body': 'ProDetailPage.detailBody',
  },
})

const STANDARD_WORKSPACE_OWNER_BY_PAGE_TYPE = Object.freeze({
  'table-basic': 'TablePageFrame',
  'table-stat': 'StatListPageFrame',
  'data-visualization': 'DataVisualizationPageFrame',
  'tree-table': 'TablePageFrame',
  'tree-split': 'TreeSplitPageFrame',
  'feedback-status': 'FeedbackStatusPageFrame',
  'full-page-edit': 'ProEditPage',
  'full-page-detail': 'ProDetailPage',
})

function buildStandardRegionValues(pageTypeId) {
  const targets = STANDARD_REGION_TARGETS_BY_PAGE_TYPE[pageTypeId]
  if (!targets) {
    throw new Error(`No standard region preset is defined for page type: ${pageTypeId}`)
  }

  return getRequiredRegionsForPageType(pageTypeId).map((region) => {
    const target = targets[region]
    if (!target) {
      throw new Error(`Standard region preset for ${pageTypeId} is missing target for ${region}`)
    }

    return `${region}=${target}`
  })
}

function buildStandardOwnershipValues(pageTypeId) {
  const workspaceOwner = STANDARD_WORKSPACE_OWNER_BY_PAGE_TYPE[pageTypeId]
  const roles = getRequiredOwnershipRolesForPageType(pageTypeId)
  if (roles.length === 0) {
    return []
  }

  if (!workspaceOwner) {
    throw new Error(`No standard ownership preset is defined for page type: ${pageTypeId}`)
  }

  return roles.map((role) => {
    const target = role === 'content-slot' ? 'TypicalPageAppFrame' : workspaceOwner
    return `${role}=${target}`
  })
}

function resolveStandardHostArchetypePath({ archetypeDefinition, archetypeMode }) {
  const templateDir = String(
    archetypeDefinition?.archetype?.modeAdapters?.[archetypeMode]?.templateDir || ''
  ).trim()
  return templateDir ? `${templateDir}/page.template.tsx` : ''
}

function buildRegionMappings(pageTypeId, values, existingMappings = []) {
  const explicitMappings = parseRegionMappings(values)
  const normalizedExistingMappings = (Array.isArray(existingMappings) ? existingMappings : [])
    .map((item) => ({
      region: String(item?.region || '').trim(),
      target: String(item?.target || '').trim(),
    }))
    .filter((item) => item.region && item.target)
  const existingMappingByRegion = new Map(
    normalizedExistingMappings.map((item) => [item.region.toLowerCase(), item])
  )
  const requiredMappings = getRequiredRegionsForPageType(pageTypeId).map((region) => ({
    region,
    target:
      existingMappingByRegion.get(String(region || '').trim().toLowerCase())?.target ||
      `TODO: map ${region} to a concrete host region`,
  }))

  const requiredRegionNames = new Set(
    requiredMappings.map((item) => String(item.region || '').trim().toLowerCase())
  )
  const explicitMappingByRegion = new Map(
    explicitMappings.map((item) => [String(item.region || '').trim().toLowerCase(), item])
  )

  const mergedMappings = requiredMappings.map((item) => {
    const explicit = explicitMappingByRegion.get(String(item.region || '').trim().toLowerCase())
    return explicit || item
  })

  for (const item of explicitMappings) {
    const normalizedRegion = String(item.region || '').trim().toLowerCase()
    if (!requiredRegionNames.has(normalizedRegion)) {
      mergedMappings.push(item)
    }
  }

  for (const item of normalizedExistingMappings) {
    const normalizedRegion = String(item.region || '').trim().toLowerCase()
    if (!requiredRegionNames.has(normalizedRegion) && !explicitMappingByRegion.has(normalizedRegion)) {
      mergedMappings.push(item)
    }
  }

  return mergedMappings
}

function buildOwnershipMappings(pageTypeId, values, existingMappings = []) {
  const explicitMappings = parseOwnershipMappings(values)
  const normalizedExistingMappings = (Array.isArray(existingMappings) ? existingMappings : [])
    .map((item) => ({
      role: String(item?.role || '').trim(),
      target: String(item?.target || '').trim(),
    }))
    .filter((item) => item.role && item.target)
  const existingMappingByRole = new Map(
    normalizedExistingMappings.map((item) => [item.role.toLowerCase(), item])
  )
  const requiredMappings = getRequiredOwnershipRolesForPageType(pageTypeId).map((role) => ({
    role,
    target:
      existingMappingByRole.get(String(role || '').trim().toLowerCase())?.target ||
      `TODO: bind ${role} to one concrete workspace owner`,
  }))

  if (explicitMappings.length === 0) {
    if (requiredMappings.length > 0) {
      const requiredRoleNames = new Set(
        requiredMappings.map((item) => String(item.role || '').trim().toLowerCase())
      )
      return [
        ...requiredMappings,
        ...normalizedExistingMappings.filter(
          (item) => !requiredRoleNames.has(String(item.role || '').trim().toLowerCase())
        ),
      ]
    }

    return normalizedExistingMappings
  }

  const requiredRoleNames = new Set(
    requiredMappings.map((item) => String(item.role || '').trim().toLowerCase())
  )
  const explicitMappingByRole = new Map(
    explicitMappings.map((item) => [String(item.role || '').trim().toLowerCase(), item])
  )
  const mergedMappings = requiredMappings.map((item) => {
    const explicit = explicitMappingByRole.get(String(item.role || '').trim().toLowerCase())
    return explicit || item
  })

  for (const item of explicitMappings) {
    const normalizedRole = String(item.role || '').trim().toLowerCase()
    if (!requiredRoleNames.has(normalizedRole)) {
      mergedMappings.push(item)
    }
  }

  for (const item of normalizedExistingMappings) {
    const normalizedRole = String(item.role || '').trim().toLowerCase()
    if (!requiredRoleNames.has(normalizedRole) && !explicitMappingByRole.has(normalizedRole)) {
      mergedMappings.push(item)
    }
  }

  return mergedMappings
}

function parseOwnershipMappings(values) {
  return values.map((value) => {
    const separatorIndex = value.indexOf('=')
    if (separatorIndex <= 0 || separatorIndex === value.length - 1) {
      throw new Error(`Invalid --ownership value: ${value}. Expected role=target`)
    }

    const role = value.slice(0, separatorIndex).trim()
    const target = value.slice(separatorIndex + 1).trim()

    if (!role || !target) {
      throw new Error(`Invalid --ownership value: ${value}. Expected role=target`)
    }

    return { role, target }
  })
}

function shouldCarryExistingContractMetadata({
  existingContract,
  generatedPagePath,
  pageTypeId,
  archetypeMode,
}) {
  if (!existingContract || typeof existingContract !== 'object') {
    return false
  }

  return (
    String(existingContract.generatedPagePath || '').trim() === String(generatedPagePath || '').trim() &&
    String(existingContract.pageTypeId || '').trim() === String(pageTypeId || '').trim() &&
    String(existingContract.archetypeMode || '').trim() === String(archetypeMode || '').trim()
  )
}

async function ensureDir(targetDir) {
  await fs.mkdir(targetDir, { recursive: true })
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const targetRoot = path.resolve(options.target)
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const { manifest } = await loadPageTypeManifest({ skillRoot, line: options.line })
    const baselineSpecPath = path.join(
      skillRoot,
      'docs',
      'validation',
      'archetype-smoke-baselines.json'
    )
    const baselineSpec = JSON.parse(await fs.readFile(baselineSpecPath, 'utf8'))
    const pageType = manifest.pageTypes.find((item) => item.id === options.pageTypeId)
    const archetypeDefinition = await loadArchetypeDefinition({
      skillRoot,
      pageTypeId: options.pageTypeId,
    })

    if (!pageType) {
      throw new Error(`Unknown page type: ${options.pageTypeId}`)
    }

    const generatedPagePath = normalizeContractPath(targetRoot, options.page)
    const routeOwnershipError = buildTypicalPageReuseTargetError(
      generatedPagePath,
      'typical-page:write-contract'
    )
    if (routeOwnershipError) {
      throw new Error(routeOwnershipError)
    }

    const archetypeMode = options.mode || 'rules-only'
    const inferredHostArchetypePath = options.preset
      ? resolveStandardHostArchetypePath({ archetypeDefinition, archetypeMode })
      : ''
    const hostArchetypePath = normalizeContractPath(
      targetRoot,
      options.archetype || inferredHostArchetypePath
    )
    if (!hostArchetypePath) {
      throw new Error(
        `Unable to infer host archetype path for ${pageType.id}. Pass --archetype explicitly.`
      )
    }
    const contractsDir = getRulesOnlyPageContractsDir(targetRoot)
    const contractSlug =
      toContractSlug(options.contractId) ||
      toContractSlug(generatedPagePath.replace(/\.[cm]?[jt]sx?$/, '')) ||
      `${pageType.id}-contract`
    const jsonPath = path.join(contractsDir, `${contractSlug}.json`)
    const markdownPath = path.join(contractsDir, `${contractSlug}.md`)
    const existingContract = await fs
      .readFile(jsonPath, 'utf8')
      .then((raw) => JSON.parse(raw))
      .catch(() => null)
    const shouldCarryExistingMappings = !options.preset && existingContract?.pageTypeId === pageType.id
    const shouldCarryExistingMetadata = shouldCarryExistingContractMetadata({
      existingContract,
      generatedPagePath,
      pageTypeId: pageType.id,
      archetypeMode,
    })
    const presetRegionValues = options.preset ? buildStandardRegionValues(pageType.id) : []
    const presetOwnershipValues = options.preset ? buildStandardOwnershipValues(pageType.id) : []
    const regionMapping = buildRegionMappings(
      pageType.id,
      [...presetRegionValues, ...options.regions],
      shouldCarryExistingMappings ? existingContract?.regionMapping || [] : []
    )
    const ownershipMapping = buildOwnershipMappings(
      pageType.id,
      [...presetOwnershipValues, ...options.ownerships],
      shouldCarryExistingMappings ? existingContract?.ownershipMapping || [] : []
    )
    const localBypasses = parseLocalBypasses(options.localBypasses, targetRoot)
    const contract = buildRulesOnlyPageContract({
      pageType,
      archetypeDefinition,
      archetypeSmokeBaseline: findArchetypeSmokeBaselineEntry(baselineSpec, pageType?.id),
      generatedPagePath,
      hostArchetypePath,
      archetypeMode,
      scrollStrategy: options.scrollStrategy || getDefaultScrollStrategyForPageType(pageType?.id),
      regionMapping,
      ownershipMode:
        options.ownershipMode ||
        (shouldCarryExistingMappings ? String(existingContract?.ownershipMode || '').trim() : '') ||
        (getRequiredOwnershipRolesForPageType(pageType.id).length > 0
          ? 'page-surface-owns-workspace'
          : ''),
      ownershipMapping,
      generationProfile: shouldCarryExistingMetadata ? existingContract?.generationProfile || null : null,
      productionContract: shouldCarryExistingMetadata ? existingContract?.productionContract || null : null,
      adapterContract: {
        ...(shouldCarryExistingMetadata && existingContract?.adapterContract
          ? existingContract.adapterContract
          : {}),
        localBypasses:
          localBypasses.length > 0
            ? localBypasses
            : shouldCarryExistingMetadata && Array.isArray(existingContract?.adapterContract?.localBypasses)
              ? existingContract.adapterContract.localBypasses
              : [],
      },
      semanticContract: {
        ...(shouldCarryExistingMetadata && existingContract?.semanticContract
          ? existingContract.semanticContract
          : {}),
        ...(options.queryFilterRegionRole
          ? { queryFilterRegionRole: options.queryFilterRegionRole }
          : {}),
      },
      notes: options.notes,
      deviations: options.deviations,
      workflow: {
        status: 'contract-written',
        deliveryStatus: 'not-finalized',
        lastCommand: 'typical-page:write-contract',
      },
    })
    const generatedPageAbsPath = path.join(targetRoot, generatedPagePath)
    const sourceSnapshotHash = await fs
      .access(generatedPageAbsPath)
      .then(() =>
        computeManagedPageSourceSnapshot({
          generatedPagePath,
          targetRoot,
        }).hash
      )
      .catch(() => '')
    const runtimeSmokeWorkflow = reconcileManagedPageRuntimeSmokeWorkflow(
      contract,
      existingContract?.workflow || {},
      sourceSnapshotHash
    )
    contract.workflow = {
      ...contract.workflow,
      runtimeSmokeStatus:
        sourceSnapshotHash && existingContract
          ? runtimeSmokeWorkflow.runtimeSmokeStatus
          : getManagedPageRuntimeSmokeDefaultStatus(contract),
      runtimeSmokeSnapshotHash:
        sourceSnapshotHash && existingContract ? runtimeSmokeWorkflow.runtimeSmokeSnapshotHash : '',
      runtimeSmokeReportPath:
        sourceSnapshotHash && existingContract ? runtimeSmokeWorkflow.runtimeSmokeReportPath : '',
      sourceSnapshotHash,
    }
    const validation = validateRulesOnlyPageContract({
      contract,
      manifest,
      targetRoot,
      archetypeDefinition,
      baselineSpec,
    })

    if (validation.errors.length > 0) {
      const requiredRegions = getRequiredRegionsForPageType(pageType.id)
      const requiredOwnershipRoles = getRequiredOwnershipRolesForPageType(pageType.id)
      const requiredRegionHint =
        requiredRegions.length > 0
          ? ` Required regions for ${pageType.id}: ${requiredRegions.join(', ')}.`
          : ''
      const requiredOwnershipHint =
        requiredOwnershipRoles.length > 0
          ? ` Required ownership roles for ${pageType.id}: ${requiredOwnershipRoles.join(', ')}.`
          : ''
      throw new Error(
        `${validation.errors.join('; ')}.${requiredRegionHint}${requiredOwnershipHint}`
      )
    }

    await ensureDir(contractsDir)
    await fs.writeFile(jsonPath, `${JSON.stringify(contract, null, 2)}\n`, 'utf8')
    await fs.writeFile(markdownPath, renderRulesOnlyPageContractMarkdown(contract), 'utf8')
    await syncManagedPageRegistry(targetRoot)

    console.log(`Wrote rules-only page contract:`)
    console.log(`- json: ${jsonPath}`)
    console.log(`- markdown: ${markdownPath}`)
    console.log(`- page type: ${pageType.label} (${pageType.id})`)
    console.log(`- example path: ${contract.examplePath}`)
    console.log(`- generated page: ${contract.generatedPagePath}`)
    console.log(`- host archetype path: ${contract.hostArchetypePath}`)
    console.log(`- archetype id: ${contract.archetypeId || '(none)'}`)
    console.log(`- archetype mode: ${contract.archetypeMode || '(none)'}`)
    console.log(`- scroll strategy: ${contract.scrollStrategy || '(none)'}`)
    console.log(`- workflow status: ${contract.workflow?.status || '(none)'}`)
    console.log(`- source snapshot hash: ${contract.workflow?.sourceSnapshotHash || '(none)'}`)
    console.log(
      `- i18n baseline provisioning: ${
        contract.i18nBaseline?.bootstrapCommands?.join(' | ') || '(not-declared)'
      }`
    )
    console.log(
      `- supported locales: ${
        contract.i18nBaseline?.supportedLocales?.join(', ') || '(not-declared)'
      }`
    )
    console.log(`- required regions: ${getRequiredRegionsForPageType(pageType.id).join(', ') || '(none)'}`)
    console.log(
      `- managed chart section: ${
        contract.regionMapping.some((item) => String(item.region || '').trim().toLowerCase() === 'chart-section')
          ? 'declared'
          : 'not-declared'
      }`
    )
    console.log(
      `- required ownership roles: ${
        getRequiredOwnershipRolesForPageType(pageType.id).join(', ') || '(none)'
      }`
    )
    console.log(
      `- local bypasses: ${
        contract.adapterContract.localBypasses.length > 0
          ? contract.adapterContract.localBypasses
              .map(
                (item) =>
                  `${item.packageSpec} -> ${item.adapterPath} | token bridge: ${item.tokenBridgePath} | containment: ${item.ownerContainment}`
              )
              .join(' || ')
          : '(none)'
      }`
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`write-rules-only-page-contract failed: ${message}`)
    printUsage()
    process.exit(1)
  }
}

main()
