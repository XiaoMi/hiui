#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { loadPageTypeManifest } from './lib/load-page-type-manifest.mjs'
import { loadHostProfileFact } from './lib/project-facts.mjs'
import {
  computeManagedPageSourceSnapshot,
  syncManagedPageRegistry,
  writeManagedPageContractArtifacts,
  writeUtf8FileIfChanged,
} from './lib/managed-page-artifacts.mjs'
import { buildTypicalPageReuseTargetError } from './lib/typical-page-route-ownership.mjs'
import { loadArchetypeDefinition } from './lib/archetypes/load-archetype-manifest.mjs'
import {
  getManagedPageSourceCommentLines,
  getManagedPageSourceOwnershipAttributes,
  getManagedPageSourceRegionAttributes,
  getManagedPageSourceRootAttributes,
  renderManagedPageSourceContractSnippet,
} from './lib/managed-page-source-guard.mjs'
import {
  MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT,
  RULES_ONLY_OWNERSHIP_MODES,
  buildRulesOnlyPageContract,
  findArchetypeSmokeBaselineEntry,
  getDefaultScrollStrategyForPageType,
  getManagedPageSemanticContract,
  getManagedPageRuntimeSmokeDefaultStatus,
  getRequiredOwnershipRolesForPageType,
  getRequiredRegionsForPageType,
  getRulesOnlyPageContractsDir,
  normalizeContractPath,
  toContractSlug,
  validateRulesOnlyPageContract,
} from './lib/rules-only-page-contracts.mjs'
import { isFreeformScaffoldBlockedForPageType } from './lib/page-mold-registry.mjs'

const FIXED_TEMPLATE_PAGE_TYPES = new Set([
  'data-visualization',
  'table-stat',
  'full-page-edit',
  'full-page-detail',
])

const FREEFORM_SCAFFOLD_BLOCKED_MODES = new Set(['legacy-host-compatible'])
const INTERNAL_PLAN_BUFFER_BYTES = 16 * 1024 * 1024

function parseMajorVersion(spec) {
  const match = String(spec || '').match(/(\d+)/)
  return match ? Number(match[1]) : 0
}

async function readTargetPackageJson(targetRoot) {
  const packageJsonPath = path.join(targetRoot, 'package.json')
  try {
    const raw = await fs.readFile(packageJsonPath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function normalizeModeId(mode) {
  const value = String(mode || '').trim()
  if (value === 'host-compatible') return 'legacy-host-compatible'
  if (['host-integration', 'rules-only', 'legacy-host-compatible'].includes(value)) return value
  return ''
}

function parseBootstrapSummaryMode(raw) {
  const modeMatch = String(raw || '').match(/^- mode:\s*(\S+)/m)
  const recommendedModeMatch = String(raw || '').match(/^- recommended mode:\s*(\S+)/m)
  return normalizeModeId(modeMatch?.[1]) || normalizeModeId(recommendedModeMatch?.[1])
}

async function readProjectModeFact(targetRoot) {
  const lockPath = path.join(targetRoot, '.local-context', 'hiui-design', 'outputs', 'project-mode.json')
  try {
    const lock = JSON.parse(await fs.readFile(lockPath, 'utf8'))
    const id = normalizeModeId(lock.mode || lock.id)
    if (id) {
      return {
        id,
        source: 'project-lock',
        factPath: '.local-context/hiui-design/outputs/project-mode.json',
      }
    }
  } catch {
    // Optional for older installs.
  }

  const bootstrapSummaryPaths = [
    path.join(targetRoot, 'src', 'typical-page-reuse', 'BOOTSTRAP_SUMMARY.md'),
    path.join(targetRoot, '.local-context', 'hiui-design', 'BOOTSTRAP_SUMMARY.md'),
  ]

  for (const summaryPath of bootstrapSummaryPaths) {
    try {
      const raw = await fs.readFile(summaryPath, 'utf8')
      const id = parseBootstrapSummaryMode(raw)
      if (id) {
        return {
          id,
          source: 'bootstrap-summary',
          factPath: path.relative(targetRoot, summaryPath),
        }
      }
    } catch {
      // Optional for older installs.
    }
  }

  return null
}

function inferMode(pkg, hostProfile, requestedMode, projectModeFact = null) {
  if (requestedMode && requestedMode !== 'auto') {
    return {
      id: normalizeModeId(requestedMode) || requestedMode,
      source: requestedMode === 'host-compatible' ? 'explicit-alias:host-compatible' : 'explicit',
    }
  }

  if (projectModeFact?.id) {
    return {
      id: projectModeFact.id,
      source: projectModeFact.source,
      factPath: projectModeFact.factPath,
      confirmed: true,
    }
  }

  const dependencies = {
    ...(pkg?.dependencies ?? {}),
    ...(pkg?.devDependencies ?? {}),
    ...(pkg?.peerDependencies ?? {}),
  }

  const reactMajor = parseMajorVersion(dependencies.react)
  const reactDomMajor = parseMajorVersion(dependencies['react-dom'])
  const hiuiMajor = parseMajorVersion(dependencies['@hi-ui/hiui'])
  const hasHiui5Alias = Boolean(dependencies.hiui5)

  if (
    (reactMajor > 0 && reactMajor < 18) ||
    (reactDomMajor > 0 && reactDomMajor < 18) ||
    (hasHiui5Alias && hiuiMajor > 0 && hiuiMajor < 5)
  ) {
    return { id: 'legacy-host-compatible', source: 'detected-dependencies' }
  }

  return {
    id: hostProfile?.recommendedMode || 'rules-only',
    source: hostProfile?.recommendedMode ? 'host-profile' : 'default',
  }
}

function buildPlannerChangeText(pageType) {
  return `新增一个${pageType?.label || pageType?.id || '典型页'}页面`
}

function parseStartPlanPayload(raw, sourceLabel) {
  try {
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`typical-page:start-page could not parse ${sourceLabel}: ${error.message}`)
  }
}

function validateProvidedStartPlan(plan, { pageTypeId }) {
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    throw new Error('typical-page:start-page expected the provided plan to be a JSON object')
  }

  if (plan.schemaVersion !== 'page-task-plan.v1') {
    throw new Error(
      `typical-page:start-page expected page-task-plan.v1 but received ${plan.schemaVersion || 'unknown-schema'}`
    )
  }

  if (plan.status !== 'ready') {
    throw new Error(
      `typical-page:start-page requires a ready plan, received status=${plan.status || 'unknown'}`
    )
  }

  const rootPageTypeId = String(plan?.pageType?.id || '').trim()
  const matchingUnits = Array.isArray(plan?.pageUnits)
    ? plan.pageUnits.filter((unit) => unit?.pageType?.id === pageTypeId)
    : []

  if (rootPageTypeId === pageTypeId || matchingUnits.length === 1) {
    return plan
  }

  if (matchingUnits.length > 1) {
    throw new Error(
      `typical-page:start-page found multiple pageUnits for ${pageTypeId} in the provided plan; pass a single-page plan or narrow the target page type`
    )
  }

  throw new Error(
    `typical-page:start-page expected the provided plan to include pageType=${pageTypeId}, received root pageType=${rootPageTypeId || 'none'}`
  )
}

async function loadProvidedStartPlan({ planFile, planJson, pageTypeId, targetRoot }) {
  if (!planFile && !planJson) {
    return null
  }

  const sourceLabel = planFile
    ? normalizeContractPath(targetRoot, planFile)
    : '--plan-json'
  const raw = planFile
    ? await fs.readFile(path.resolve(targetRoot, planFile), 'utf8')
    : planJson

  return validateProvidedStartPlan(parseStartPlanPayload(raw, sourceLabel), { pageTypeId })
}

function runPlanPageTaskForStartPage({
  mode,
  pagePath,
  pageType,
  skillRoot,
  targetRoot,
}) {
  const args = [
    path.join(skillRoot, 'scripts', 'plan-page-task.mjs'),
    '--change',
    buildPlannerChangeText(pageType),
    '--page-type',
    pageType.id,
    '--page',
    pagePath,
    '--mode',
    mode,
    '--target',
    targetRoot,
    '--json',
  ]

  const result = spawnSync(process.execPath, args, {
    cwd: targetRoot,
    encoding: 'utf8',
    maxBuffer: INTERNAL_PLAN_BUFFER_BYTES,
  })

  if (result.status !== 0) {
    throw new Error(
      `typical-page:start-page could not resolve the planner contract for ${pageType.id}: ${
        result.stderr || result.stdout
      }`
    )
  }

  return JSON.parse(result.stdout)
}

function normalizeStartPlanRuntimeSmokePlan(plan) {
  if (!plan || typeof plan !== 'object' || typeof plan.required !== 'boolean') {
    return null
  }

  return {
    required: plan.required,
    reason: plan.required
      ? 'derived from page-task-plan runtime smoke requirement'
      : 'page-task-plan marks runtime smoke as not-required for this scaffold start',
  }
}

function normalizeStartPlanContractSeed(plan) {
  if (!plan || typeof plan !== 'object') {
    return null
  }

  return {
    topology: plan.topology || '',
    layoutStrategy: String(plan.layoutStrategy || '').trim(),
    layoutArchetype: String(plan.layoutArchetype || '').trim(),
    nonTypicalScope: Array.isArray(plan.nonTypicalScope)
      ? plan.nonTypicalScope.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    mandatoryComponents: Array.isArray(plan.mandatoryComponents)
      ? plan.mandatoryComponents.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    compositionGuardrails: Array.isArray(plan.compositionGuardrails)
      ? plan.compositionGuardrails.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    strategyEvidence: Array.isArray(plan.strategyEvidence)
      ? plan.strategyEvidence.map((item) => String(item || '').trim()).filter(Boolean)
      : [],
    ownershipPlan: plan.ownershipPlan && typeof plan.ownershipPlan === 'object'
      ? {
          ownershipMode: String(plan.ownershipPlan.ownershipMode || '').trim(),
          targetHints: Array.isArray(plan.ownershipPlan.targetHints)
            ? plan.ownershipPlan.targetHints
                .map((item) => ({
                  role: String(item?.role || '').trim(),
                  target: String(item?.target || '').trim(),
                }))
                .filter((item) => item.role && item.target)
            : [],
        }
      : null,
    runtimeSmokePlan: normalizeStartPlanRuntimeSmokePlan(plan.runtimeSmokePlan),
    generationProfile: plan.generationProfile && typeof plan.generationProfile === 'object'
      ? plan.generationProfile
      : null,
    docBundle:
      plan?.generationInputs?.docBundle &&
      typeof plan.generationInputs.docBundle === 'object'
        ? {
            profile: String(plan.generationInputs.docBundle.profile || '').trim(),
            source: String(plan.generationInputs.docBundle.source || '').trim(),
            bundleIds: Array.isArray(plan.generationInputs.docBundle.bundleIds)
              ? plan.generationInputs.docBundle.bundleIds
                  .map((item) => String(item || '').trim())
                  .filter(Boolean)
              : [],
          }
        : null,
    fastPathSummary:
      plan?.generationInputs?.fastPathSummary &&
      typeof plan.generationInputs.fastPathSummary === 'object'
        ? {
            eligible: plan.generationInputs.fastPathSummary.eligible === true,
            executionMode: String(plan.generationInputs.fastPathSummary.executionMode || '').trim(),
            pageShellPolicy: String(plan.generationInputs.fastPathSummary.pageShellPolicy || '').trim(),
            queryFilterPolicy: String(plan.generationInputs.fastPathSummary.queryFilterPolicy || '').trim(),
            upgradeSignals: Array.isArray(plan.generationInputs.fastPathSummary.upgradeSignals)
              ? plan.generationInputs.fastPathSummary.upgradeSignals
                  .map((item) => String(item || '').trim())
                  .filter(Boolean)
              : [],
          }
        : null,
    compiledTypicalBaseline:
      plan?.generationInputs?.compiledTypicalBaseline &&
      typeof plan.generationInputs.compiledTypicalBaseline === 'object'
        ? {
            pageTypeId: String(plan.generationInputs.compiledTypicalBaseline.pageTypeId || '').trim(),
            requiredRegions: Array.isArray(plan.generationInputs.compiledTypicalBaseline.requiredRegions)
              ? plan.generationInputs.compiledTypicalBaseline.requiredRegions
                  .map((item) => String(item || '').trim())
                  .filter(Boolean)
              : [],
            hardConstraints: Array.isArray(plan.generationInputs.compiledTypicalBaseline.hardConstraints)
              ? plan.generationInputs.compiledTypicalBaseline.hardConstraints
                  .map((item) => String(item || '').trim())
                  .filter(Boolean)
              : [],
            headerLayout:
              plan.generationInputs.compiledTypicalBaseline.headerLayout &&
              typeof plan.generationInputs.compiledTypicalBaseline.headerLayout === 'object'
                ? {
                    required:
                      plan.generationInputs.compiledTypicalBaseline.headerLayout.required === true,
                    rhythmPx: Number(plan.generationInputs.compiledTypicalBaseline.headerLayout.rhythmPx || 0),
                  }
                : null,
            queryFilter:
              plan.generationInputs.compiledTypicalBaseline.queryFilter &&
              typeof plan.generationInputs.compiledTypicalBaseline.queryFilter === 'object'
                ? {
                    required: plan.generationInputs.compiledTypicalBaseline.queryFilter.required === true,
                    requiredComponent: String(
                      plan.generationInputs.compiledTypicalBaseline.queryFilter.requiredComponent || ''
                    ).trim(),
                  }
                : null,
            whiteBodyOwnership:
              plan.generationInputs.compiledTypicalBaseline.whiteBodyOwnership &&
              typeof plan.generationInputs.compiledTypicalBaseline.whiteBodyOwnership === 'object'
                ? {
                    required:
                      plan.generationInputs.compiledTypicalBaseline.whiteBodyOwnership.required === true,
                    forbidSecondWhiteBody:
                      plan.generationInputs.compiledTypicalBaseline.whiteBodyOwnership.forbidSecondWhiteBody === true,
                  }
                : null,
            pagination:
              plan.generationInputs.compiledTypicalBaseline.pagination &&
              typeof plan.generationInputs.compiledTypicalBaseline.pagination === 'object'
                ? {
                    required: plan.generationInputs.compiledTypicalBaseline.pagination.required === true,
                    mountPolicy: String(
                      plan.generationInputs.compiledTypicalBaseline.pagination.mountPolicy || ''
                    ).trim(),
                  }
                : null,
          }
        : null,
  }
}

function buildOwnershipMappingFromPlanHints(explicitOwnerships, ownershipPlan) {
  if (explicitOwnerships.length > 0) {
    return explicitOwnerships.map(({ key, target }) => ({ role: key, target }))
  }

  const hintedMappings = Array.isArray(ownershipPlan?.targetHints)
    ? ownershipPlan.targetHints
        .map((item) => ({
          role: String(item?.role || '').trim(),
          target: String(item?.target || '').trim(),
        }))
        .filter((item) => item.role && item.target)
    : []

  return hintedMappings
}

function ensureStartPageGenerationProfileRequiredGates(generationProfile, mode) {
  if (!generationProfile || typeof generationProfile !== 'object') {
    return null
  }

  const modeId = String(mode || '').trim()
  const strategy = String(generationProfile.strategy || '').trim()
  const startFrom = String(generationProfile.startFrom || '').trim()
  const requiredBaseline =
    modeId === 'legacy-host-compatible'
      ? strategy === 'page-component' && startFrom === 'page-component'
        ? ['source-gate', 'preflight', 'page-instance-validation']
        : ['source-gate', 'preflight']
      : ['slot-gate', 'preflight']
  const existingGates = Array.isArray(generationProfile.requiredGates)
    ? generationProfile.requiredGates.map((item) => String(item || '').trim()).filter(Boolean)
    : []

  return {
    ...generationProfile,
    requiredGates: Array.from(new Set([...requiredBaseline, ...existingGates])),
  }
}

function isLegacyPageComponentFastPathPlan(plan) {
  return (
    plan?.mode?.id === 'legacy-host-compatible' &&
    plan?.generationStrategyId === 'page-component' &&
    plan?.startFrom?.id === 'page-component'
  )
}

function isLegacyPageComponentFastPathReady(plan) {
  return (
    isLegacyPageComponentFastPathPlan(plan) &&
    plan?.pageComponent?.selected === true &&
    plan?.assetResolution?.status === 'available'
  )
}

function hasPlannerLockedPageComponentMaterialization(plan, pageTypeId) {
  return (
    plan?.generationStrategyId === 'page-component' &&
    String(plan?.startFrom?.id || '').trim() === 'page-component' &&
    String(plan?.primaryGenerationAsset?.type || '').trim() === 'page-component' &&
    String(plan?.assetResolution?.semanticStrategyId || '').trim() === 'page-component' &&
    String(plan?.generationProfile?.strategy || '').trim() === 'page-component' &&
    String(plan?.generationProfile?.startFrom || '').trim() === 'page-component' &&
    String(plan?.generationInputs?.startFrom?.id || '').trim() === 'page-component' &&
    String(plan?.generationInputs?.compiledTypicalBaseline?.pageTypeId || '').trim() ===
      String(pageTypeId || '').trim()
  )
}

function buildLegacyPageComponentStartBlockReason(plan, pageTypeId) {
  const details = [
    `status=${plan?.status || 'unknown'}`,
    `pageComponent=${plan?.pageComponent?.selected ? 'selected' : 'not-selected'}`,
    `assetResolution=${plan?.assetResolution?.status || 'missing'}`,
    `runtimeAdapterProof=${plan?.pageComponent?.runtimeAdapterProof?.status || 'missing'}`,
  ]

  return `typical-page:start-page cannot scaffold ${pageTypeId} in legacy-host-compatible until plan-page-task resolves the page-component fast path. Expected selected certified page component plus available runtime bridge asset; received ${details.join(', ')}. Resolve runtime adapter / certification facts first and refresh the planner contract.`
}

function assertComponentSemanticStartPlan(plan, pageTypeId) {
  const support = plan?.projectTypicalPageSupport
  if (!support?.enforcePageComponentSemantics) {
    return
  }

  if (support.status !== 'ready') {
    const blockingReasons = Array.isArray(support.blockingReasons)
      ? support.blockingReasons.filter(Boolean)
      : []
    throw new Error(
      `typical-page:start-page cannot scaffold ${pageTypeId} because component-semantic typical page support is ${support.status}. ${
        blockingReasons.length > 0 ? `Blocking reasons: ${blockingReasons.join(' | ')}` : 'Refresh the planner contract and repair the shared page-component support first.'
      }`
    )
  }

  if (plan?.generationStrategyId !== 'page-component') {
    throw new Error(
      `typical-page:start-page requires page-component semantics for ${pageTypeId}. Received generationStrategyId=${plan?.generationStrategyId || 'unknown'}. Refresh the planner contract instead of reusing a stale managed-fallback plan.`
    )
  }

  if (String(plan?.startFrom?.id || '').trim() !== 'page-component') {
    throw new Error(
      `typical-page:start-page requires startFrom=page-component for component-semantic page ${pageTypeId}. Received startFrom=${plan?.startFrom?.id || 'unknown'}. Refresh the planner contract before scaffolding.`
    )
  }

  if (!hasPlannerLockedPageComponentMaterialization(plan, pageTypeId)) {
    throw new Error(
      `typical-page:start-page requires planner-aligned page-component materialization facts for ${pageTypeId}. Expected primaryGenerationAsset.type=page-component, assetResolution.semanticStrategyId=page-component, generationProfile/startFrom to stay on page-component, and generationInputs.compiledTypicalBaseline.pageTypeId=${pageTypeId}. Refresh the planner contract instead of reusing a stale downgraded plan.`
    )
  }
}

function printUsage() {
  console.log(`Usage:
  node ".local-context/hiui-design/scripts/typical-page-start-page.mjs" --page-type <page-type-id> --page <relative-page-path> [--mode <auto|rules-only|host-integration|legacy-host-compatible>] [--topology <typical|non-typical-overlay>] [--layout-strategy <strategy-id>] [--non-typical-scope <scope-id[,scope-id...]> ...] [--runtime-smoke <auto|required|not-required>] [--archetype <relative-host-archetype-path>] [--query-filter-region-role <table-query-filter|dashboard-control-strip|not-applicable>] [--region <name=target> ...] [--ownership-mode <${RULES_ONLY_OWNERSHIP_MODES.join('|')}>] [--ownership <role=target> ...] [--local-bypass <package=<pkg>;gap=<capability-gap>;adapter=<relative-path>;bridge=<relative-path>;containment=<${MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT.join('|')}>> ...] [--plan-file <relative-plan-json-path> | --plan-json <json>] [--line <line-id>] [--target <project-root>] [--force] [--json] [--contract-fixture <table-basic-started>]

Default behavior:
  1. resolve the packaged page type + archetype
  2. write a started contract stub with workflow.status=started
  3. stamp default semantic-contract rules such as query-filter role and single spacing-owner policy
  4. create the planner-aligned scaffold: certified page-component paths copy the certified component source (legacy additionally emits the runtime-bridge wrapper + slot adapter), while managed-fallback paths keep the structured scaffold / template flow
  4. stop before delivery; fast typical pages complete with current-page preview + preflight + explainable lint/build, while formal acceptance still requires typical-page:finalize-page
`)
}

function parseKeyValueList(values, flagName) {
  return values.map((value) => {
    const separatorIndex = value.indexOf('=')
    if (separatorIndex <= 0 || separatorIndex === value.length - 1) {
      throw new Error(`Invalid ${flagName} value: ${value}. Expected name=target`)
    }

    const key = value.slice(0, separatorIndex).trim()
    const target = value.slice(separatorIndex + 1).trim()
    if (!key || !target) {
      throw new Error(`Invalid ${flagName} value: ${value}. Expected name=target`)
    }

    return { key, target }
  })
}

function parseStringList(values) {
  return values.flatMap((value) =>
    String(value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  )
}

function buildRuntimeSmokePlan({ runtimeSmoke, topology }) {
  const smokeMode = String(runtimeSmoke || 'auto').trim()
  const topologyId =
    topology && typeof topology === 'object'
      ? String(topology.id || '').trim()
      : String(topology || '').trim()

  if (!['auto', 'required', 'not-required'].includes(smokeMode)) {
    throw new Error('Expected --runtime-smoke to be one of: auto, required, not-required')
  }

  if (smokeMode === 'required') {
    return {
      required: true,
      reason: 'runtime smoke was explicitly requested by typical-page:start-page.',
    }
  }

  if (topologyId === 'non-typical-overlay') {
    return {
      required: true,
      reason:
        'non-typical-overlay pages combine a typical page shell with additional cross-region layout, so they must prove the composed runtime behavior in a real browser.',
    }
  }

  if (smokeMode === 'not-required') {
    return {
      required: false,
      reason: 'runtime smoke was explicitly marked not-required by typical-page:start-page.',
    }
  }

  return null
}

function parseArgs(argv) {
  const options = {
    archetype: '',
    contractFixture: '',
    force: false,
    json: false,
    layoutStrategy: '',
    line: '',
    localBypasses: [],
    mode: 'auto',
    nonTypicalScope: [],
    ownershipMode: '',
    ownerships: [],
    page: '',
    planFile: '',
    planJson: '',
    pageTypeId: '',
    queryFilterRegionRole: '',
    regions: [],
    runtimeSmoke: 'auto',
    target: process.cwd(),
    topology: '',
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

    if (
      arg === '--page-type' ||
      arg === '--page' ||
      arg === '--mode' ||
      arg === '--archetype' ||
      arg === '--line' ||
      arg === '--layout-strategy' ||
      arg === '--plan-file' ||
      arg === '--plan-json' ||
      arg === '--target' ||
      arg === '--topology' ||
      arg === '--ownership-mode' ||
      arg === '--query-filter-region-role' ||
      arg === '--runtime-smoke' ||
      arg === '--contract-fixture'
    ) {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--page-type') options.pageTypeId = value
      if (arg === '--page') options.page = value
      if (arg === '--mode') options.mode = value
      if (arg === '--archetype') options.archetype = value
      if (arg === '--line') options.line = value
      if (arg === '--layout-strategy') options.layoutStrategy = value
      if (arg === '--plan-file') options.planFile = value
      if (arg === '--plan-json') options.planJson = value
      if (arg === '--target') options.target = path.resolve(value)
      if (arg === '--topology') options.topology = value
      if (arg === '--ownership-mode') options.ownershipMode = value
      if (arg === '--query-filter-region-role') options.queryFilterRegionRole = value
      if (arg === '--runtime-smoke') options.runtimeSmoke = value
      if (arg === '--contract-fixture') options.contractFixture = value
      index += 1
      continue
    }

    if (
      arg === '--region' ||
      arg === '--ownership' ||
      arg === '--local-bypass' ||
      arg === '--non-typical-scope'
    ) {
      const value = argv[index + 1]
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`)
      }

      if (arg === '--region') options.regions.push(value)
      if (arg === '--ownership') options.ownerships.push(value)
      if (arg === '--local-bypass') options.localBypasses.push(value)
      if (arg === '--non-typical-scope') options.nonTypicalScope.push(value)
      index += 1
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
  if (options.planFile && options.planJson) {
    throw new Error('Use either --plan-file or --plan-json, not both')
  }
  if (options.runtimeSmoke && !['auto', 'required', 'not-required'].includes(options.runtimeSmoke)) {
    throw new Error('Expected --runtime-smoke to be one of: auto, required, not-required')
  }
  if (options.contractFixture && !['table-basic-started'].includes(options.contractFixture)) {
    throw new Error('Expected --contract-fixture to be one of: table-basic-started')
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

function toComponentName(pagePath) {
  const baseName = path.basename(pagePath, path.extname(pagePath)) || 'managed-page'
  const parentName = path.basename(path.dirname(pagePath))
  const rawName = baseName === 'index' ? parentName || 'managed-page' : baseName
  const normalized = String(rawName || 'managed-page').replace(/[^a-zA-Z0-9]+/g, ' ')

  const pascal = normalized
    .split(/\s+/)
    .filter(Boolean)
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join('')

  return pascal || 'ManagedTypicalPage'
}

function toDirectoryArtifactEntryPagePath(pagePath) {
  const extension = path.extname(pagePath)
  const baseName = path.basename(pagePath, extension)
  if (baseName === 'index') {
    return pagePath
  }

  return path.join(path.dirname(pagePath), baseName, `index${extension}`).replace(/\\/g, '/')
}

function buildArtifactPathMap(entryPagePath) {
  const extension = path.extname(entryPagePath)
  const entryDir = path.dirname(entryPagePath)

  return {
    entryPagePath,
    sectionsPagePath: path.join(entryDir, `sections${extension}`).replace(/\\/g, '/'),
    sectionsStylePath: path.join(entryDir, 'sections.module.scss').replace(/\\/g, '/'),
  }
}

function indentBlock(text, prefix) {
  return String(text || '')
    .split('\n')
    .map((line) => `${prefix}${line}`)
    .join('\n')
}

function replaceAllText(source, searchValue, replaceValue) {
  return String(source).split(String(searchValue)).join(String(replaceValue))
}

function toImportSpecifier(fromPagePath, targetPathWithoutExt) {
  const relativePath = path
    .relative(path.dirname(fromPagePath), targetPathWithoutExt)
    .replace(/\\/g, '/')

  if (!relativePath) return '.'
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`
}

function toJsxAttrList(attrs) {
  return attrs.map((attr) => `${attr.name}="${attr.value}"`)
}

function toArtifactList(singlePath, source) {
  return [
    {
      filePath: singlePath,
      source,
    },
  ]
}

function parseRuntimeComponentSource(spec) {
  const [rawModulePath = '', rawExportName = ''] = String(spec || '').split('::')
  return {
    modulePath: rawModulePath.trim(),
    exportName: rawExportName.trim(),
  }
}

function resolveRuntimeBridgeComponentImport(pagePath, runtimeComponentSource) {
  const { modulePath, exportName } = parseRuntimeComponentSource(runtimeComponentSource)
  if (!modulePath) {
    throw new Error('Missing runtime component source for legacy page-component scaffold.')
  }

  const importSource = modulePath.startsWith('src/') || modulePath.startsWith('./') || modulePath.startsWith('../')
    ? toImportSpecifier(pagePath, stripScriptExtension(modulePath))
    : stripScriptExtension(modulePath)

  return exportName
    ? {
        importLine: `import { ${exportName} as RuntimeBridgeShell } from '${importSource}'`,
        normalizedSource: `${modulePath}::${exportName}`,
      }
    : {
        importLine: `import RuntimeBridgeShell from '${importSource}'`,
        normalizedSource: modulePath,
      }
}

function getLegacyRuntimeBridgeArtifactPaths(pagePath) {
  const extension = path.extname(pagePath).toLowerCase()
  return {
    slotAdapterPath: path
      .join(path.dirname(pagePath), extension === '.jsx' ? 'slot-adapter.stub.js' : 'slot-adapter.stub.ts')
      .replace(/\\/g, '/'),
  }
}

function getContractSlotManifest(contract) {
  return Array.isArray(contract?.generationProfile?.slotManifest)
    ? contract.generationProfile.slotManifest.filter((slot) => String(slot?.slotId || '').trim())
    : []
}

function getStructuredQueryFilterPlaceholderComment(contract) {
  const semanticContract = getManagedPageSemanticContract(contract)

  if (semanticContract.queryFilterRegionRole === 'table-query-filter') {
    return 'TODO: mount the real QueryFilter carrier here; keep contained/showLabel=false defaults plus upstream field-map/provider wiring. Do not rebuild this region as a form grid, SearchForm, or dashboard control strip'
  }

  if (semanticContract.queryFilterRegionRole === 'dashboard-control-strip') {
    return 'TODO: mount the shared dashboard control strip here; keep segmented/radio/tab view switches outside QueryFilter semantics'
  }

  return 'TODO: keep this region aligned with the managed semantic contract'
}

function getStructuredTablePlaceholderComment(contract) {
  const semanticContract = getManagedPageSemanticContract(contract)

  if (semanticContract.listShellComposition === 'page-type-shell') {
    return 'TODO: mount the managed list/table shell here; keep pagination inside the same carrier and do not rebuild the table region with ad hoc wrappers'
  }

  return 'TODO: mount the managed table region here'
}

function getStructuredRegionPlaceholderComment(contract, regionName) {
  if (regionName === 'query-filter') {
    return getStructuredQueryFilterPlaceholderComment(contract)
  }

  if (regionName === 'stat-section') {
    return 'TODO: mount shared stat-grid / stat-card primitives here; keep this top-level block flat and let the white-body own the surface'
  }

  if (regionName === 'chart-section') {
    return 'TODO: mount the shared chart section + adaptive chart-body carriers here'
  }

  return `TODO: replace with the managed ${regionName} content`
}

function renderLegacySlotTodoLines(slotManifest, indent = '      ') {
  if (slotManifest.length === 0) {
    return [
      `${indent}// TODO: bind business slots declared by the selected page component`,
    ].join('\n')
  }

  return slotManifest
    .flatMap((slot) => {
      const slotId = String(slot.slotId || '').trim()
      const contentType = String(slot.contentType || 'business-slot').trim()
      return [
        `${indent}// ${slotId} (${contentType})`,
        `${indent}${slotId}: undefined,`,
      ]
    })
    .join('\n')
}

async function buildLegacyRuntimeBridgeArtifacts({ contract, pagePath, skillRoot }) {
  const mode = String(contract?.archetypeMode || '').trim()
  const generationProfile = contract?.generationProfile || {}
  const pageComponentId = String(generationProfile.pageComponentId || '').trim()
  const runtimeBridgeProfileId = String(generationProfile.runtimeBridgeProfileId || '').trim()
  const runtimeComponentSource = String(generationProfile.runtimeComponentSource || '').trim()

  if (
    mode !== 'legacy-host-compatible' ||
    generationProfile.strategy !== 'page-component' ||
    generationProfile.startFrom !== 'page-component'
  ) {
    return null
  }

  if (!pageComponentId || !runtimeBridgeProfileId || !runtimeComponentSource) {
    throw new Error(
      'typical-page:start-page cannot materialize legacy page-component scaffolding without pageComponentId, runtimeBridgeProfileId, and runtimeComponentSource in generationProfile.'
    )
  }

  const wrapperTemplatePath = path.join(
    skillRoot,
    'templates',
    'page-components',
    'runtime-bridge',
    'runtime-bridge-wrapper.template.tsx'
  )
  const slotAdapterTemplatePath = path.join(
    skillRoot,
    'templates',
    'page-components',
    'runtime-bridge',
    'slot-adapter.stub.ts'
  )
  const [wrapperTemplate, slotAdapterTemplate] = await Promise.all([
    fs.readFile(wrapperTemplatePath, 'utf8'),
    fs.readFile(slotAdapterTemplatePath, 'utf8'),
  ])
  const componentName = toComponentName(pagePath)
  const slotAdapterFactoryName = `create${componentName}SlotAdapterPayload`
  const slotAdapterInputType = `${componentName}SlotAdapterInput`
  const slotManifest = getContractSlotManifest(contract)
  const slotAdapterPaths = getLegacyRuntimeBridgeArtifactPaths(pagePath)
  const slotAdapterImportPath = toImportSpecifier(
    pagePath,
    stripScriptExtension(slotAdapterPaths.slotAdapterPath)
  )
  const commentLines = getManagedPageSourceCommentLines(contract)
  const sourceContractMarkers = commentLines.map((line) => `      {/* ${line} */}`).join('\n')
  const { importLine: runtimeComponentImportLine, normalizedSource } =
    resolveRuntimeBridgeComponentImport(pagePath, runtimeComponentSource)
  const extension = path.extname(pagePath).toLowerCase()
  const runtimeBridgeShellBindingLine =
    extension === '.tsx' ? 'const RuntimeBridgeShellAny = RuntimeBridgeShell as any' : 'const RuntimeBridgeShellAny = RuntimeBridgeShell'
  const slotAdapterInputDeclaration =
    extension === '.tsx'
      ? `  const slotAdapterInput: ${slotAdapterInputType} = {\n`
      : '  const slotAdapterInput = {\n'
  const runtimeBridgeShellUsage = [
    '<RuntimeBridgeShellAny',
    '        {...adaptedSlots.businessSlots}',
    '        controlledExtensions={adaptedSlots.controlledExtensions}',
    '        runtimeBridge={adaptedSlots.runtimeBridge}',
    '      />',
  ].join('\n')

  let entrySource = wrapperTemplate
  entrySource = replaceAllText(
    entrySource,
    "import type { __HIUI_SLOT_ADAPTER_PROPS__ } from './slot-adapter.stub'\n",
    extension === '.tsx'
      ? `import type { ${slotAdapterInputType} } from '${slotAdapterImportPath}'\n`
      : ''
  )
  entrySource = replaceAllText(
    entrySource,
    "import { __HIUI_SLOT_ADAPTER_NAME__ } from './slot-adapter.stub'",
    `import { ${slotAdapterFactoryName} } from '${slotAdapterImportPath}'\n${runtimeComponentImportLine}\n\n${runtimeBridgeShellBindingLine}`
  )
  entrySource = replaceAllText(
    entrySource,
    'export type __HIUI_RUNTIME_BRIDGE_WRAPPER_PROPS__ = __HIUI_SLOT_ADAPTER_PROPS__\n\n',
    ''
  )
  entrySource = replaceAllText(
    entrySource,
    'export default function __HIUI_RUNTIME_BRIDGE_WRAPPER_NAME__(\n  props: __HIUI_RUNTIME_BRIDGE_WRAPPER_PROPS__\n) {\n  const adaptedSlots = __HIUI_SLOT_ADAPTER_NAME__(props)\n',
    `export default function ${componentName}() {\n${slotAdapterInputDeclaration}    businessSlots: {\n${renderLegacySlotTodoLines(slotManifest, '      ')}\n    },\n    controlledExtensions: {\n      // TODO: add Level 1 controlled extensions only when the selected page component allows them\n    },\n    runtimeBridge: {\n      // TODO: bind request / response / message / i18n / permission / routeNavigation / theme at bridge scope only; never translate QueryFilter / Table / Pagination / PageHeader\n    },\n  }\n  const adaptedSlots = ${slotAdapterFactoryName}(slotAdapterInput)\n`
  )
  entrySource = replaceAllText(entrySource, '__HIUI_RUNTIME_BRIDGE_WRAPPER_NAME__', componentName)
  entrySource = replaceAllText(entrySource, '__HIUI_RUNTIME_BRIDGE_PROFILE_ID__', runtimeBridgeProfileId)
  entrySource = replaceAllText(entrySource, '__HIUI_PAGE_COMPONENT_ID__', pageComponentId)
  entrySource = replaceAllText(entrySource, '__HIUI_RUNTIME_COMPONENT_SOURCE__', normalizedSource)
  entrySource = replaceAllText(
    entrySource,
    '__HIUI_TEMPLATE_PATH__',
    'templates/page-components/runtime-bridge/runtime-bridge-wrapper.template.tsx'
  )
  entrySource = replaceAllText(entrySource, '__HIUI_SOURCE_CONTRACT_MARKERS__', sourceContractMarkers)
  entrySource = replaceAllText(entrySource, '__HIUI_RUNTIME_COMPONENT_USAGE__', runtimeBridgeShellUsage)

  let slotAdapterSource = slotAdapterTemplate
  slotAdapterSource = replaceAllText(
    slotAdapterSource,
    '__HIUI_TEMPLATE_PATH__',
    'templates/page-components/runtime-bridge/slot-adapter.stub.ts'
  )
  slotAdapterSource = replaceAllText(
    slotAdapterSource,
    '__HIUI_RUNTIME_BRIDGE_PROFILE_ID__',
    runtimeBridgeProfileId
  )
  slotAdapterSource = replaceAllText(slotAdapterSource, '__HIUI_PAGE_COMPONENT_ID__', pageComponentId)
  slotAdapterSource = replaceAllText(
    slotAdapterSource,
    '__HIUI_SLOT_ADAPTER_NAME__',
    slotAdapterFactoryName
  )

  if (extension !== '.tsx') {
    slotAdapterSource = replaceAllText(
      slotAdapterSource,
      "export type __HIUI_SLOT_ADAPTER_PROPS__ = {\n  businessSlots: Record<string, unknown>\n  controlledExtensions?: Record<string, unknown>\n  runtimeBridge: {\n    request?: unknown\n    response?: unknown\n    message?: unknown\n    i18n?: unknown\n    permission?: unknown\n    routeNavigation?: unknown\n    theme?: unknown\n    modalRoot?: unknown\n    dictionaries?: unknown\n  }\n}\n\n",
      ''
    )
    slotAdapterSource = replaceAllText(
      slotAdapterSource,
      "export function create__HIUI_SLOT_ADAPTER_NAME__({\n  businessSlots,\n  controlledExtensions = {},\n  runtimeBridge,\n}: __HIUI_SLOT_ADAPTER_PROPS__) {",
      ''
    )
  }

  if (extension === '.tsx') {
    slotAdapterSource = replaceAllText(
      slotAdapterSource,
      'export type __HIUI_SLOT_ADAPTER_PROPS__ = {\n',
      `export type ${slotAdapterInputType} = {\n`
    )
    slotAdapterSource = replaceAllText(
      slotAdapterSource,
      `export function ${slotAdapterFactoryName}({\n  businessSlots,\n  controlledExtensions = {},\n  runtimeBridge,\n}: __HIUI_SLOT_ADAPTER_PROPS__) {`,
      `export function ${slotAdapterFactoryName}({\n  businessSlots,\n  controlledExtensions = {},\n  runtimeBridge = {},\n}: ${slotAdapterInputType}) {`
    )
  } else {
    slotAdapterSource = `/* generated by typical-page:start-page */\n/* generated from hiui-design runtime bridge slot adapter template */\n/* template asset: templates/page-components/runtime-bridge/slot-adapter.stub.ts */\n/* runtime bridge profile: ${runtimeBridgeProfileId} */\n/* selected component: ${pageComponentId} */\n/* bridge rule: slot adapter may bind business slots only; do not translate QueryFilter/Table/Pagination/PageHeader or re-wrap managed regions */\n\nexport function ${slotAdapterFactoryName}({\n  businessSlots,\n  controlledExtensions = {},\n  runtimeBridge = {},\n}) {\n  return {\n    businessSlots,\n    controlledExtensions,\n    runtimeBridge,\n  }\n}\n\nexport default ${slotAdapterFactoryName}\n`
  }

  return [
    {
      filePath: pagePath,
      source: entrySource,
    },
    {
      filePath: slotAdapterPaths.slotAdapterPath,
      source: slotAdapterSource,
    },
  ]
}

function renderJsObjectLiteral(attrs) {
  if (!attrs || attrs.length === 0) {
    return '{}'
  }

  const body = attrs
    .map((attr) => `  '${attr.name}': ${JSON.stringify(attr.value)},`)
    .join('\n')

  return `{\n${body}\n}`
}

function isScriptLikeFile(filePath) {
  return /\.(?:[cm]?[jt]sx?)$/.test(String(filePath || ''))
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function isFilePath(targetPath) {
  try {
    const stat = await fs.stat(targetPath)
    return stat.isFile()
  } catch {
    return false
  }
}

async function resolveExistingImportCandidate(fromFilePath, specifier) {
  if (!specifier || !specifier.startsWith('.')) return ''

  const basePath = path.resolve(path.dirname(fromFilePath), specifier)
  const candidates = [
    basePath,
    ...[
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.mjs',
      '.cjs',
      '.scss',
      '.css',
      '.svg',
      '.png',
      '.jpg',
      '.jpeg',
      '.webp',
    ].map((extension) => `${basePath}${extension}`),
    ...['.ts', '.tsx', '.js', '.jsx'].map((extension) => path.join(basePath, `index${extension}`)),
  ]

  for (const candidate of candidates) {
    if (await isFilePath(candidate)) {
      return candidate
    }
  }

  return ''
}

function stripScriptExtension(filePath) {
  return String(filePath || '').replace(/\.(?:[cm]?[jt]sx?)$/, '')
}

function toRelativeImportSpecifier(fromFilePath, targetFilePath) {
  const relativePath = path
    .relative(path.dirname(fromFilePath), targetFilePath)
    .replace(/\\/g, '/')
  const normalized = relativePath.startsWith('.') ? relativePath : `./${relativePath}`

  return isScriptLikeFile(targetFilePath) ? stripScriptExtension(normalized) : normalized
}

function replaceImportSpecifiers(source, replacer) {
  return String(source || '')
    .replace(/(from\s+['"])([^'"]+)(['"])/g, (match, prefix, specifier, suffix) => {
      const nextSpecifier = replacer(specifier)
      return nextSpecifier ? `${prefix}${nextSpecifier}${suffix}` : match
    })
    .replace(/(import\s+['"])([^'"]+)(['"])/g, (match, prefix, specifier, suffix) => {
      const nextSpecifier = replacer(specifier)
      return nextSpecifier ? `${prefix}${nextSpecifier}${suffix}` : match
    })
}

function findInitialImportBlockEnd(source) {
  const lines = String(source || '').split('\n')
  let index = 0
  let end = 0

  while (index < lines.length) {
    const trimmed = lines[index].trim()
    if (!trimmed) {
      index += 1
      end = index
      continue
    }

    if (!trimmed.startsWith('import ')) break

    index += 1
    while (
      index < lines.length &&
      !/\bfrom\s+['"][^'"]+['"]\s*$/.test(lines[index - 1].trim()) &&
      !/^import\s+['"][^'"]+['"]\s*$/.test(lines[index - 1].trim())
    ) {
      index += 1
    }
    end = index
  }

  return lines.slice(0, end).join('\n').length + (end > 0 ? 1 : 0)
}

function renderHostIntegrationSourcePrelude(contract) {
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)

  return `/* generated by typical-page:start-page */
/* copied from the synced host-integration typical-page example; replace business slots only */
/* source contract markers */
${commentLines.map((line) => `/* ${line} */`).join('\n')}
const hiuiDesignSourceContract = ${renderJsObjectLiteral(rootAttrs)}
void hiuiDesignSourceContract
`
}

function renderPageComponentSourcePrelude(contract, { pageComponentId, certificationRef, componentSource }) {
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)

  return `/* generated by typical-page:start-page */
/* copied from the certified page-component source; replace business slots only */
/* selected component: ${pageComponentId} */
/* certification ref: ${certificationRef} */
/* component source: ${componentSource} */
/* source contract markers */
${commentLines.map((line) => `/* ${line} */`).join('\n')}
const hiuiDesignSourceContract = ${renderJsObjectLiteral(rootAttrs)}
void hiuiDesignSourceContract
`
}

function injectHostIntegrationPrelude(source, contract) {
  const insertionPoint = findInitialImportBlockEnd(source)
  const prelude = renderHostIntegrationSourcePrelude(contract)

  if (insertionPoint <= 0) {
    return `${prelude}\n${source}`
  }

  return `${source.slice(0, insertionPoint)}\n${prelude}\n${source.slice(insertionPoint)}`
}

function injectPageComponentSourcePrelude(source, contract, metadata) {
  const insertionPoint = findInitialImportBlockEnd(source)
  const prelude = renderPageComponentSourcePrelude(contract, metadata)

  if (insertionPoint <= 0) {
    return `${prelude}\n${source}`
  }

  return `${source.slice(0, insertionPoint)}\n${prelude}\n${source.slice(insertionPoint)}`
}

async function resolvePathFromSkillOrTarget({ relativePath, skillRoot, targetRoot }) {
  const normalized = String(relativePath || '').trim().replace(/\\/g, '/')
  if (!normalized) {
    return ''
  }

  const candidates = [
    path.join(targetRoot, normalized),
    path.join(skillRoot, normalized),
  ]

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate
    }
  }

  return ''
}

async function resolveHostIntegrationExampleSourcePath({ contract, pageType, skillRoot, targetRoot }) {
  const candidates = [
    pageType.examplePath ? path.join(targetRoot, pageType.examplePath) : '',
    contract.examplePath ? path.join(skillRoot, contract.examplePath) : '',
    pageType.assetExamplePath ? path.join(skillRoot, pageType.assetExamplePath) : '',
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate
    }
  }

  return ''
}

function isTargetTranslationPath(targetRoot, filePath) {
  const relativePath = path.relative(path.join(targetRoot, 'src', 'translation'), filePath)
  return Boolean(relativePath && !relativePath.startsWith('..') && !path.isAbsolute(relativePath))
}

function extractLocalImportSpecifiers(source) {
  return Array.from(String(source || '').matchAll(/(?:from\s+|import\s+)['"]([^'"]+)['"]/g))
    .map((match) => match[1])
    .filter((specifier) => specifier.startsWith('.'))
}

function normalizeCopiedSourceForArtifact({ artifactPath, source, sourcePath }) {
  const sourceExt = path.extname(sourcePath || '').toLowerCase()
  const artifactExt = path.extname(artifactPath || '').toLowerCase()
  const sourceIsTypeScript = sourceExt === '.ts' || sourceExt === '.tsx'
  const artifactIsJavaScript = artifactExt === '.js' || artifactExt === '.jsx'

  if (!sourceIsTypeScript || !artifactIsJavaScript) {
    return source
  }

  return String(source || '')
    .replace(/^\s*import\s+type\s+[^;\n]+;?\s*$/gm, '')
    .replace(/(\b\w+)\(this\)/g, '$1()')
    .replace(/\((\w+)\s*:\s*Parameters<typeof\s+[^>]+>\[0\]\)/g, '($1)')
}

function rewriteHostIntegrationPortalImports({ artifactPath, source }) {
  if (!String(source || '').includes('@hiui-design/typical-page-shells/host')) {
    return source
  }

  const hostHeaderSlotSpecifier = toImportSpecifier(
    artifactPath,
    'src/typical-page-reuse/components/layout/host-header-slot'
  )

  return String(source || '')
    .replace(
      /import\s+\{\s*TypicalPageHeaderPortal\s*\}\s+from\s+['"]@hiui-design\/typical-page-shells\/host['"];?/g,
      `import { HostHeaderSlot } from '${hostHeaderSlotSpecifier}'`
    )
    .replace(/<TypicalPageHeaderPortal(\s*[^>]*)>/g, '<HostHeaderSlot data-hiui5-region="header"$1>')
    .replace(/<\/TypicalPageHeaderPortal>/g, '</HostHeaderSlot>')
}

async function collectHostIntegrationExampleFiles({
  contract,
  entrySourcePath,
  pagePath,
  targetRoot,
  entrySourceInjector = null,
}) {
  const sourceToArtifact = new Map([[path.resolve(entrySourcePath), pagePath]])
  const queue = [path.resolve(entrySourcePath)]
  const visited = new Set()
  const targetEntryDir = path.dirname(pagePath)

  while (queue.length > 0) {
    const currentPath = queue.shift()
    if (!currentPath || visited.has(currentPath) || !isScriptLikeFile(currentPath)) {
      continue
    }

    visited.add(currentPath)
    const raw = await fs.readFile(currentPath, 'utf8')
    const localSpecifiers = extractLocalImportSpecifiers(raw)

    for (const specifier of localSpecifiers) {
      const resolved = await resolveExistingImportCandidate(currentPath, specifier)
      if (!resolved || isTargetTranslationPath(targetRoot, resolved)) {
        continue
      }

      const absoluteResolved = path.resolve(resolved)
      if (!sourceToArtifact.has(absoluteResolved)) {
        sourceToArtifact.set(
          absoluteResolved,
          path.join(targetEntryDir, path.basename(absoluteResolved)).replace(/\\/g, '/')
        )
      }

      if (isScriptLikeFile(absoluteResolved)) {
        queue.push(absoluteResolved)
      }
    }
  }

  const artifacts = []
  for (const [sourcePath, artifactPath] of sourceToArtifact.entries()) {
    let source = await fs.readFile(sourcePath, 'utf8')
    const replacementBySpecifier = new Map()

    if (sourcePath && isScriptLikeFile(sourcePath)) {
      for (const specifier of extractLocalImportSpecifiers(source)) {
        const resolved = await resolveExistingImportCandidate(sourcePath, specifier)
        if (!resolved) continue

        if (isTargetTranslationPath(targetRoot, resolved)) {
          replacementBySpecifier.set(specifier, toImportSpecifier(artifactPath, 'src/translation'))
          continue
        }

        const copiedArtifactPath = sourceToArtifact.get(path.resolve(resolved))
        if (copiedArtifactPath) {
          replacementBySpecifier.set(
            specifier,
            toRelativeImportSpecifier(artifactPath, copiedArtifactPath)
          )
        }
      }

      source = replaceImportSpecifiers(source, (specifier) => {
        return replacementBySpecifier.get(specifier) || ''
      })

      source = rewriteHostIntegrationPortalImports({ artifactPath, source })
    }

    artifacts.push({
      filePath: artifactPath,
      source: normalizeCopiedSourceForArtifact({
        artifactPath,
        source:
          sourcePath &&
          path.resolve(sourcePath) === path.resolve(entrySourcePath) &&
          typeof entrySourceInjector === 'function'
            ? entrySourceInjector(source)
            : source,
        sourcePath,
      }),
    })
  }

  return artifacts
}

async function buildHostIntegrationExampleArtifacts({ contract, pagePath, pageType, skillRoot, targetRoot }) {
  if (contract.archetypeMode !== 'host-integration') {
    return null
  }

  const entrySourcePath = await resolveHostIntegrationExampleSourcePath({
    contract,
    pageType,
    skillRoot,
    targetRoot,
  })

  if (!entrySourcePath) {
    return null
  }

  return collectHostIntegrationExampleFiles({
    contract,
    entrySourcePath,
    pagePath,
    targetRoot,
    entrySourceInjector: (source) => injectHostIntegrationPrelude(source, contract),
  })
}

async function resolvePageComponentSourceDescriptor({
  certificationRef,
  pageComponentId,
  skillRoot,
  targetRoot,
}) {
  if (!certificationRef) {
    throw new Error(
      `typical-page:start-page cannot materialize page-component scaffolding for ${pageComponentId || 'unknown component'} without a certificationRef.`
    )
  }

  const certificationPath = await resolvePathFromSkillOrTarget({
    relativePath: certificationRef,
    skillRoot,
    targetRoot,
  })
  if (!certificationPath) {
    throw new Error(
      `typical-page:start-page cannot resolve certificationRef ${certificationRef} for page-component ${pageComponentId || 'unknown component'}.`
    )
  }

  const certification = JSON.parse(await fs.readFile(certificationPath, 'utf8'))
  const componentSource = String(certification?.certificationInputs?.componentSource || '').trim()
  if (!componentSource) {
    throw new Error(
      `typical-page:start-page cannot materialize page-component scaffolding for ${pageComponentId || 'unknown component'} because certificationInputs.componentSource is empty in ${certificationRef}.`
    )
  }

  const componentSourcePath = await resolvePathFromSkillOrTarget({
    relativePath: componentSource,
    skillRoot,
    targetRoot,
  })
  if (!componentSourcePath) {
    throw new Error(
      `typical-page:start-page cannot resolve componentSource ${componentSource} for page-component ${pageComponentId || 'unknown component'}.`
    )
  }

  return {
    certificationRef,
    certificationPath,
    componentSource,
    componentSourcePath,
  }
}

async function buildCertifiedPageComponentArtifacts({
  contract,
  pagePath,
  skillRoot,
  targetRoot,
  startPlan,
}) {
  const generationProfile = contract?.generationProfile || {}
  if (
    contract?.archetypeMode === 'legacy-host-compatible' ||
    generationProfile.strategy !== 'page-component' ||
    generationProfile.startFrom !== 'page-component'
  ) {
    return null
  }

  const pageComponentId = String(
    generationProfile.pageComponentId ||
      startPlan?.pageComponent?.componentId ||
      startPlan?.assetResolution?.componentId ||
      ''
  ).trim()
  const certificationRef = String(
    startPlan?.assetResolution?.certificationRef ||
      startPlan?.pageComponent?.certificationRef ||
      ''
  ).trim()
  const componentSourceDescriptor = await resolvePageComponentSourceDescriptor({
    certificationRef,
    pageComponentId,
    skillRoot,
    targetRoot,
  })

  const renderCertifiedComponentSource = (source) => {
    const rawSource = String(source || '')
    if (
      !rawSource.includes('__COMPONENT_NAME__') &&
      !rawSource.includes('__HIUI_SOURCE_CONTRACT_MARKERS__') &&
      !rawSource.includes('__HIUI_OPTIONAL_CHART_SECTION__')
    ) {
      return rawSource
    }

    return renderStrictTemplateSource({
      contract,
      pagePath,
      templateAsset: {
        relativePath: componentSourceDescriptor.componentSource,
        source: rawSource,
      },
    })
  }

  return collectHostIntegrationExampleFiles({
    contract,
    entrySourcePath: componentSourceDescriptor.componentSourcePath,
    pagePath,
    targetRoot,
    entrySourceInjector: (source) =>
      injectPageComponentSourcePrelude(
        renderCertifiedComponentSource(source),
        contract,
        {
          pageComponentId,
          certificationRef: componentSourceDescriptor.certificationRef,
          componentSource: componentSourceDescriptor.componentSource,
        }
      ),
  })
}

function buildTemplateFileCandidates(templateDir) {
  const normalizedDir = String(templateDir || '').replace(/\\/g, '/').replace(/\/+$/, '')
  if (!normalizedDir) {
    return []
  }

  return [
    `${normalizedDir}/page.template.tsx`,
    `${normalizedDir}/page.template.jsx`,
    `${normalizedDir}/template.tsx`,
    `${normalizedDir}/template.jsx`,
  ]
}

async function resolveStrictTemplateAsset({ contract, skillRoot }) {
  if (!(contract?.strictExampleGeneration && FIXED_TEMPLATE_PAGE_TYPES.has(contract?.pageTypeId))) {
    return null
  }

  const candidates = buildTemplateFileCandidates(contract.archetypeTemplatePath)
  if (candidates.length === 0) {
    throw new Error(
      `strictExampleGeneration is enabled for ${contract.pageTypeId}, but archetypeTemplatePath is empty. start-page cannot fall back to a free-form scaffold for this page type.`
    )
  }

  for (const relativePath of candidates) {
    const absolutePath = path.join(skillRoot, relativePath)
    try {
      const source = await fs.readFile(absolutePath, 'utf8')
      if (String(source || '').trim()) {
        return {
          absolutePath,
          relativePath: relativePath.replace(/\\/g, '/'),
          source,
        }
      }
    } catch {
      // try the next candidate
    }
  }

  throw new Error(
    `strictExampleGeneration is enabled for ${contract.pageTypeId}, but no executable template was found under ${contract.archetypeTemplatePath}. Add page.template.tsx to the archetype template directory instead of relying on start-page scaffold synthesis.`
  )
}

function renderStrictTemplateSource({ contract, pagePath, templateAsset }) {
  const componentName = toComponentName(pagePath)
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const ownershipAttrs = getManagedPageSourceOwnershipAttributes(contract)
  const hasChartSection = Array.isArray(contract?.regionMapping)
    ? contract.regionMapping.some((item) => String(item?.region || '').trim().toLowerCase() === 'chart-section')
    : false
  const rootOwnerAttrs = ownershipAttrs.filter((attr) => attr.role !== 'white-body')
  const whiteBodyOwnerAttrs = ownershipAttrs.filter((attr) => attr.role === 'white-body')
  const fixedDashboardFrameImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/managed-page/fixed-dashboard-page-frame'
  )
  const dataVisualizationPrimitivesImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/managed-page/data-visualization-primitives'
  )
  const hostPageHeaderPortalImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/layout/page-header-portal'
  )

  const templateMarkers = commentLines
    .map((line) => `      {/* ${line} */}`)
    .join('\n')
  const pageRootPropsLiteral = indentBlock(
    renderJsObjectLiteral([
      ...rootAttrs,
      ...rootOwnerAttrs,
      { name: 'data-hiui5-shell-inheritance', value: 'shared-shell-carrier' },
      { name: 'data-hiui5-shell-carrier', value: 'FixedDashboardPageFrame' },
      { name: 'data-hiui5-chart-stack', value: 'approved-wrapper' },
    ]),
    '          '
  ).trimStart()
  const whiteBodyPropsLiteral = indentBlock(
    renderJsObjectLiteral(whiteBodyOwnerAttrs),
    '          '
  ).trimStart()
  const pageRootAttrLines = indentBlock(
    toJsxAttrList([...rootAttrs, ...rootOwnerAttrs]).join('\n'),
    '        '
  ).trimStart()
  const whiteBodyAttrLines = indentBlock(
    toJsxAttrList(whiteBodyOwnerAttrs).join('\n'),
    '        '
  ).trimStart()
  const pageRootAttrLinesWithoutMainScroll = indentBlock(
    toJsxAttrList([
      ...rootAttrs,
      ...rootOwnerAttrs.filter((attr) => attr.role !== 'main-scroll'),
    ]).join('\n'),
    '        '
  ).trimStart()
  const optionalChartSection = hasChartSection
    ? [
        '            <div data-hiui5-region="chart-section">',
        '              {/* hiui-design chart-stack: approved-wrapper */}',
        '              {/* TODO: replace with the managed chart section + adaptive chart-body carriers here */}',
        '            </div>',
      ].join('\n')
    : ''

  return [
    ['__COMPONENT_NAME__', componentName],
    ['__HIUI_SOURCE_CONTRACT_MARKERS__', templateMarkers],
    ['__HIUI_PAGE_ROOT_PROPS__', pageRootPropsLiteral],
    ['__HIUI_WHITE_BODY_PROPS__', whiteBodyPropsLiteral],
    ['__HIUI_PAGE_ROOT_ATTR_LINES__', pageRootAttrLines],
    ['__HIUI_PAGE_ROOT_ATTR_LINES_NO_MAIN_SCROLL__', pageRootAttrLinesWithoutMainScroll],
    ['__HIUI_WHITE_BODY_ATTR_LINES__', whiteBodyAttrLines],
    ['__HIUI_OPTIONAL_CHART_SECTION__', optionalChartSection],
    ['__HIUI_TEMPLATE_PATH__', templateAsset.relativePath],
    ['__FIXED_DASHBOARD_FRAME_IMPORT__', fixedDashboardFrameImportPath],
    ['__DATA_VISUALIZATION_PRIMITIVES_IMPORT__', dataVisualizationPrimitivesImportPath],
    ['__HOST_PAGE_HEADER_PORTAL_IMPORT__', hostPageHeaderPortalImportPath],
  ].reduce(
    (source, [searchValue, replaceValue]) =>
      replaceAllText(source, searchValue, replaceValue),
    templateAsset.source
  )
}

function buildFullPageDetailShellArtifacts(pagePath, contract) {
  if (contract.pageTypeId !== 'full-page-detail') {
    return null
  }

  const entryPagePath = toDirectoryArtifactEntryPagePath(pagePath)
  const { entryPagePath: normalizedEntryPagePath, sectionsPagePath, sectionsStylePath } =
    buildArtifactPathMap(entryPagePath)
  const componentName = toComponentName(normalizedEntryPagePath)
  const detailBodyComponentName = `${componentName}Body`
  const supportingSectionsComponentName = `${componentName}SupportingSections`
  const hasChartSection = Array.isArray(contract?.regionMapping)
    ? contract.regionMapping.some((item) => String(item?.region || '').trim().toLowerCase() === 'chart-section')
    : false
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const shellImportPath = toImportSpecifier(
    normalizedEntryPagePath,
    'src/typical-page-reuse/components/managed-page/managed-full-page-detail-shell'
  )
  const primitivesImportPath = toImportSpecifier(
    sectionsPagePath,
    'src/typical-page-reuse/components/managed-page/data-visualization-primitives'
  )

  const entrySource = `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before preflight/formal acceptance */
/* hiui-design shell: ManagedFullPageDetailShell */

import { ManagedFullPageDetailShell } from '${shellImportPath}'
import { ${detailBodyComponentName}${hasChartSection ? `, ${supportingSectionsComponentName}` : ''} } from './sections'

export default function ${componentName}() {
  return (
    <>
      {/* source contract markers */}
${commentLines.map((line) => `      {/* ${line} */}`).join('\n')}
      <div
${indentBlock(toJsxAttrList(rootAttrs).join('\n'), '        ')}
      >
        <ManagedFullPageDetailShell
          title="TODO: replace page title"
          detailBody={<${detailBodyComponentName} />}
${hasChartSection ? `          chartSection={<${supportingSectionsComponentName} />}` : ''}
        />
      </div>
    </>
  )
}
`

  const sectionsSource = `import { Table } from '@hi-ui/hiui'
import {
  ManagedSurfaceCard,
  SectionBlock,
} from '${primitivesImportPath}'
import styles from './sections.module.scss'

type WarrantyItem = {
  type: string
  remainingDays: number
  startAt: string
  endAt: string
}

const warrantyItems: WarrantyItem[] = [
  {
    type: 'TODO_RETURN_LABEL',
    remainingDays: 2,
    startAt: 'TODO_START_DATE',
    endAt: 'TODO_END_DATE',
  },
  {
    type: 'TODO_EXCHANGE_LABEL',
    remainingDays: 9,
    startAt: 'TODO_START_DATE',
    endAt: 'TODO_END_DATE',
  },
  {
    type: 'TODO_REPAIR_LABEL',
    remainingDays: 469,
    startAt: 'TODO_START_DATE',
    endAt: 'TODO_END_DATE',
  },
]

const serviceRecordColumns = [
  { title: 'TODO_SERVICE_TIME', dataKey: 'serviceTime', width: 180 },
  { title: 'TODO_SERVICE_ACTION', dataKey: 'serviceAction', width: 160 },
  { title: 'TODO_STATUS', dataKey: 'status', width: 120 },
  { title: 'TODO_DETAIL_DESCRIPTION', dataKey: 'detailDescription', width: 360 },
]

const serviceRecordData = [
  {
    id: 'record-001',
    serviceTime: 'TODO_SERVICE_TIME_VALUE',
    serviceAction: 'TODO_SERVICE_ACTION_VALUE',
    status: 'TODO_STATUS_VALUE',
    detailDescription: 'TODO_DETAIL_DESCRIPTION_VALUE',
  },
]

function WarrantyCard({ endAt, remainingDays, startAt, type }: WarrantyItem) {
  return (
    <article className={styles.warrantyCard}>
      <div className={styles.warrantyType}>{type}</div>
      <div className={styles.warrantyRemaining}>
        <span className={styles.warrantyRemainingValue}>{remainingDays}</span>
        <span className={styles.warrantyRemainingUnit}>TODO_DAY_UNIT</span>
      </div>
      <div className={styles.warrantyMeta}>TODO_REMAINING_DAYS_LABEL</div>
      <dl className={styles.warrantyDates}>
        <div>
          <dt>TODO_START_LABEL</dt>
          <dd>{startAt}</dd>
        </div>
        <div>
          <dt>TODO_END_LABEL</dt>
          <dd>{endAt}</dd>
        </div>
      </dl>
    </article>
  )
}

export function ${detailBodyComponentName}() {
  return (
    <div className={styles.groupStack}>
      <SectionBlock title="TODO_BASIC_INFO_TITLE">
        <div className={styles.sectionPlaceholder}>
          TODO: replace with grouped detail descriptions and long-text rows
        </div>
      </SectionBlock>

      <SectionBlock title="TODO_WARRANTY_SECTION_TITLE">
        <div className={styles.warrantyGrid}>
          {warrantyItems.map((item) => (
            <WarrantyCard key={item.type} {...item} />
          ))}
        </div>
      </SectionBlock>

      <SectionBlock title="TODO_CUSTOMER_INFO_TITLE">
        <div className={styles.sectionPlaceholder}>
          TODO: replace with customer descriptions
        </div>
      </SectionBlock>

      <SectionBlock title="TODO_SERVICE_INFO_TITLE">
        <div className={styles.sectionPlaceholder}>
          TODO: replace with service descriptions and long-text rows
        </div>
      </SectionBlock>

      <SectionBlock title="TODO_SERVICE_RECORDS_SECTION_TITLE">
        <div className={styles.serviceRecordTable}>
          <Table
            bordered={false}
            columns={serviceRecordColumns}
            data={serviceRecordData}
            fieldKey="id"
            striped={false}
          />
        </div>
      </SectionBlock>
    </div>
  )
}

${hasChartSection ? `export function ${supportingSectionsComponentName}() {
  return (
    <div className={styles.supportingStack}>
      <SectionBlock region="chart-section" title="TODO_SUPPORTING_SECTION_TITLE">
        <ManagedSurfaceCard>
          {/* hiui-design chart-stack: approved-wrapper */}
          <div className={styles.sectionPlaceholder}>
            TODO: replace with a managed chart section only when the detail page really owns an independent analysis block
          </div>
        </ManagedSurfaceCard>
      </SectionBlock>
    </div>
  )
}
` : ''}
`

  const stylesSource = `.groupStack {
  display: grid;
  gap: 20px;
}

.supportingStack {
  display: grid;
  gap: 20px;
}

.sectionPlaceholder {
  color: #5f6a7a;
  line-height: 1.6;
}

.warrantyGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  min-width: 0;
}

.warrantyCard {
  box-sizing: border-box;
  min-width: 0;
  padding: 16px;
  border: 1px solid #e4e8f0;
  border-radius: 8px;
  background: #fff;
}

.warrantyType {
  color: #1f2733;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
}

.warrantyRemaining {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 12px;
  color: #1f2733;
}

.warrantyRemainingValue {
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
}

.warrantyRemainingUnit {
  font-size: 14px;
  line-height: 22px;
}

.warrantyMeta {
  margin-top: 2px;
  color: #7a8494;
  font-size: 14px;
  line-height: 22px;
}

.warrantyDates {
  display: grid;
  gap: 8px;
  margin: 14px 0 0;

  div {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
  }

  dt,
  dd {
    margin: 0;
    font-size: 14px;
    line-height: 22px;
  }

  dt {
    flex: 0 0 auto;
    color: #7a8494;
  }

  dd {
    min-width: 0;
    color: #3c4658;
    text-align: right;
  }
}

.serviceRecordTable {
  min-width: 0;
  margin-bottom: 20px;

  :global(.hi-v5-table__cell) {
    color: #3c4658;
  }
}

@media (max-width: 900px) {
  .warrantyGrid {
    grid-template-columns: 1fr;
  }
}
`

  return [
    {
      filePath: normalizedEntryPagePath,
      source: entrySource,
    },
    {
      filePath: sectionsPagePath,
      source: sectionsSource,
    },
    {
      filePath: sectionsStylePath,
      source: stylesSource,
    },
  ]
}

function buildFixedDashboardManagedPageScaffold(pagePath, contract) {
  if (contract.pageTypeId !== 'data-visualization') {
    return ''
  }

  const componentName = toComponentName(pagePath)
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const regionAttrs = getManagedPageSourceRegionAttributes(contract)
  const ownershipAttrs = getManagedPageSourceOwnershipAttributes(contract)
  const regionNames = new Set(regionAttrs.map((attr) => attr.value))
  const rootOwnerAttrs = ownershipAttrs.filter((attr) => attr.role !== 'white-body')
  const whiteBodyOwnerAttrs = ownershipAttrs.filter((attr) => attr.role === 'white-body')

  if (!regionNames.has('header') || !regionNames.has('white-body')) {
    return ''
  }

  const frameImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/managed-page/fixed-dashboard-page-frame'
  )
  const primitivesImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/managed-page/data-visualization-primitives'
  )

  return `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before preflight/formal acceptance */

import { Button, Radio, Space } from '@hi-ui/hiui'
import { FixedDashboardPageFrame } from '${frameImportPath}'
import {
  DashboardControlStrip,
  JoinedTableSection,
  ManagedCardGrid,
  ManagedChartCard,
  ManagedMetricCard,
  ManagedSurfaceCard,
  SectionBlock,
} from '${primitivesImportPath}'

export default function ${componentName}() {
  const viewModeOptions = [
    { id: 'day', title: 'day' },
    { id: 'week', title: 'week' },
    { id: 'month', title: 'month' },
  ]

  const headerExtra = (
    <Space>
      <Button appearance="line" type="default">
        TODO_ACTION
      </Button>
    </Space>
  )

  return (
    <>
      {/* source contract markers */}
${commentLines.map((line) => `      {/* ${line} */}`).join('\n')}
      {/* hiui-design shell-inheritance: shared-shell-helper */}
      {/* hiui-design shell-carrier: FixedDashboardPageFrame -> ManagedWhiteBodyWorkspace */}
      {/* hiui-design shell-geometry guard: do not add pageRootStyle / whiteBodyStyle or style-bearing shell props here; geometry changes belong in shared shell variants */}
      {/* hiui-design chart-stack: approved-wrapper */}
      <FixedDashboardPageFrame
        extra={headerExtra}
        pageRootProps={${indentBlock(
          renderJsObjectLiteral([
            ...rootAttrs,
            ...rootOwnerAttrs,
            { name: 'data-hiui5-shell-inheritance', value: 'shared-shell-helper' },
            { name: 'data-hiui5-shell-carrier', value: 'FixedDashboardPageFrame' },
            { name: 'data-hiui5-chart-stack', value: 'approved-wrapper' },
          ]),
          '          '
        ).trimStart()}}
        title="TODO_PAGE_TITLE"
        whiteBodyProps={${indentBlock(renderJsObjectLiteral(whiteBodyOwnerAttrs), '          ').trimStart()}}
      >
        <SectionBlock
          description="TODO_OVERVIEW_DESCRIPTION"
          region="stat-section"
          title="TODO_OVERVIEW_TITLE"
        >
          <ManagedCardGrid minItemWidth={180}>
            <ManagedMetricCard
              label="TODO_METRIC_LABEL"
              meta="TODO_METRIC_META"
              value="--"
            />
            <ManagedMetricCard
              label="TODO_METRIC_LABEL"
              meta="TODO_METRIC_META"
              value="--"
            />
            <ManagedMetricCard
              label="TODO_METRIC_LABEL"
              meta="TODO_METRIC_META"
              value="--"
            />
          </ManagedCardGrid>
        </SectionBlock>

        <DashboardControlStrip
          leading={
            <Radio.Group
              data={viewModeOptions}
              type="button"
              value="day"
            />
          }
          trailing={
            <>
              {/* TODO: when filters exceed 4 fields, keep them in inline dropdown controls instead of button groups */}
            </>
          }
        />

        <SectionBlock
          description="TODO_RISK_SECTION_DESCRIPTION"
          title="TODO_RISK_SECTION_TITLE"
        >
          <ManagedCardGrid minItemWidth={260}>
            <ManagedSurfaceCard>
              <div>TODO_RISK_LINE_NAME</div>
              <div>TODO_RISK_METRICS</div>
              <div>TODO_RISK_ACTIONS</div>
            </ManagedSurfaceCard>
          </ManagedCardGrid>
        </SectionBlock>

        <SectionBlock
          description="TODO_CHART_SECTION_DESCRIPTION"
          region="chart-section"
          title="TODO_CHART_SECTION_TITLE"
        >
          <ManagedCardGrid minItemWidth={320}>
            <ManagedChartCard
              body={<div>{/* TODO: replace with chart content */}</div>}
              description="TODO_CHART_DESCRIPTION"
              title="TODO_CHART_TITLE"
            />
            <ManagedChartCard
              body={<div>{/* TODO: replace with chart content */}</div>}
              description="TODO_CHART_DESCRIPTION"
              title="TODO_CHART_TITLE"
            />
          </ManagedCardGrid>
          <ManagedChartCard
            body={<div>{/* TODO: replace with chart content */}</div>}
            description="TODO_CHART_DESCRIPTION"
            title="TODO_CHART_TITLE"
          />
        </SectionBlock>

        <SectionBlock
          description="TODO_RECORD_SECTION_DESCRIPTION"
          title="TODO_RECORD_SECTION_TITLE"
        >
          <ManagedCardGrid minItemWidth={260}>
            <ManagedSurfaceCard>
              <div>TODO_RECORD_TIME</div>
              <div>TODO_RECORD_ROUTE</div>
              <div>TODO_RECORD_STATUS</div>
            </ManagedSurfaceCard>
          </ManagedCardGrid>
        </SectionBlock>

        <JoinedTableSection
          description="TODO_TABLE_SECTION_DESCRIPTION"
          pagination={<div>{/* TODO: replace with Pagination */}</div>}
          table={<div>{/* TODO: replace with managed Table region content */}</div>}
          title="TODO_TABLE_SECTION_TITLE"
        />
      </FixedDashboardPageFrame>
    </>
  )
}
`
}

function buildStructuredManagedPageScaffold(pagePath, contract) {
  const componentName = toComponentName(pagePath)
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const regionAttrs = getManagedPageSourceRegionAttributes(contract)
  const ownershipAttrs = getManagedPageSourceOwnershipAttributes(contract)
  const regionNames = new Set(regionAttrs.map((attr) => attr.value))
  const whiteBodyOwnerAttrs = toJsxAttrList(
    ownershipAttrs.filter((attr) => attr.role === 'white-body')
  )
  const rootOwnerAttrs = toJsxAttrList(
    ownershipAttrs.filter((attr) => attr.role !== 'white-body')
  )
  const portalImportPath = toImportSpecifier(
    pagePath,
    'src/typical-page-reuse/components/layout/page-header-portal'
  )
  const hasHeader = regionNames.has('header')
  const hasWhiteBody = regionNames.has('white-body')
  const hasPagination = regionNames.has('pagination')
  const bodyRegionOrder = getDeclaredBodyRegionOrder(contract)

  if (!hasHeader || !hasWhiteBody) {
    return ''
  }

  const regionLines = []
  for (const regionName of bodyRegionOrder) {
    if (regionName === 'table' && hasPagination) {
      regionLines.push(
        '        <section',
        `          data-hiui5-region="table"`,
        '        >',
        `          {/* ${getStructuredTablePlaceholderComment(contract)} */}`,
        '          <div data-hiui5-region="pagination">',
        '            {/* TODO: replace with real pagination inside the table shell */}',
        '          </div>',
        '        </section>'
      )
      continue
    }

    regionLines.push(
      '        <section',
      `          data-hiui5-region="${regionName}"`,
      '        >',
      `          {/* ${getStructuredRegionPlaceholderComment(contract, regionName)} */}`,
      '        </section>'
    )
  }

  return `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before preflight/formal acceptance */

import { PageHeader } from '@hi-ui/hiui'
import { HostPageHeaderPortal } from '${portalImportPath}'

export default function ${componentName}() {
  return (
    <>
      {/* source contract markers */}
${commentLines.map((line) => `      {/* ${line} */}`).join('\n')}
      <div
${indentBlock([...toJsxAttrList(rootAttrs), ...rootOwnerAttrs].join('\n'), '        ')}
      >
        <HostPageHeaderPortal>
          <PageHeader
            data-hiui5-region="header"
            style={{ minHeight: 60 }}
            title="TODO: replace page title"
          >
          </PageHeader>
        </HostPageHeaderPortal>
        <div
          data-hiui5-region="white-body"
${whiteBodyOwnerAttrs.length > 0 ? indentBlock(whiteBodyOwnerAttrs.join('\n'), '          ') : ''}
        >
${regionLines.join('\n')}
        </div>
      </div>
    </>
  )
}
`
}

function buildStructuredManagedPageArtifacts(pagePath, contract) {
  const entryPagePath = toDirectoryArtifactEntryPagePath(pagePath)
  const { entryPagePath: normalizedEntryPagePath, sectionsPagePath, sectionsStylePath } =
    buildArtifactPathMap(entryPagePath)
  const componentName = toComponentName(normalizedEntryPagePath)
  const sectionsComponentName = `${componentName}Sections`
  const commentLines = getManagedPageSourceCommentLines(contract)
  const rootAttrs = getManagedPageSourceRootAttributes(contract)
  const regionAttrs = getManagedPageSourceRegionAttributes(contract)
  const ownershipAttrs = getManagedPageSourceOwnershipAttributes(contract)
  const regionNames = new Set(regionAttrs.map((attr) => attr.value))
  const whiteBodyOwnerAttrs = toJsxAttrList(
    ownershipAttrs.filter((attr) => attr.role === 'white-body')
  )
  const rootOwnerAttrs = toJsxAttrList(
    ownershipAttrs.filter((attr) => attr.role !== 'white-body')
  )
  const portalImportPath = toImportSpecifier(
    normalizedEntryPagePath,
    'src/typical-page-reuse/components/layout/page-header-portal'
  )
  const hasHeader = regionNames.has('header')
  const hasWhiteBody = regionNames.has('white-body')
  const hasPagination = regionNames.has('pagination')
  const bodyRegionOrder = getDeclaredBodyRegionOrder(contract)

  if (!hasHeader || !hasWhiteBody) {
    return null
  }

  const sectionLines = []
  for (const regionName of bodyRegionOrder) {
    if (regionName === 'table' && hasPagination) {
      sectionLines.push(
        '      <section',
        '        className={styles.sectionBlock}',
        '        data-hiui5-region="table"',
        '      >',
        '        <div className={styles.sectionPlaceholder}>',
        `          ${getStructuredTablePlaceholderComment(contract)}`,
        '        </div>',
        '        <div className={styles.paginationPlaceholder} data-hiui5-region="pagination">',
        '          TODO: replace with real pagination inside the table shell',
        '        </div>',
        '      </section>'
      )
      continue
    }

    sectionLines.push(
      '      <section',
      '        className={styles.sectionBlock}',
      `        data-hiui5-region="${regionName}"`,
      '      >',
      `        <div className={styles.sectionPlaceholder}>${getStructuredRegionPlaceholderComment(contract, regionName)}</div>`,
      '      </section>'
    )
  }

  const entrySource = `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before preflight/formal acceptance */
/* hiui-design page entry: managed-directory-artifacts */

import { PageHeader } from '@hi-ui/hiui'
import { HostPageHeaderPortal } from '${portalImportPath}'
import { ${sectionsComponentName} } from './sections'

export default function ${componentName}() {
  return (
    <>
      {/* source contract markers */}
${commentLines.map((line) => `      {/* ${line} */}`).join('\n')}
      <div
${indentBlock([...toJsxAttrList(rootAttrs), ...rootOwnerAttrs].join('\n'), '        ')}
      >
        <HostPageHeaderPortal>
          <PageHeader
            data-hiui5-region="header"
            style={{ minHeight: 60 }}
            title="TODO: replace page title"
          >
          </PageHeader>
        </HostPageHeaderPortal>
        <div
          data-hiui5-region="white-body"
${whiteBodyOwnerAttrs.length > 0 ? indentBlock(whiteBodyOwnerAttrs.join('\n'), '          ') : ''}
        >
          <${sectionsComponentName} />
        </div>
      </div>
    </>
  )
`

  const sectionsSource = `import styles from './sections.module.scss'

export function ${sectionsComponentName}() {
  return (
    <div className={styles.stack}>
${sectionLines.join('\n')}
    </div>
  )
}
`

  const stylesSource = `.stack {
  display: grid;
  gap: 20px;
}

.sectionBlock {
  display: grid;
  gap: 12px;
}

.sectionPlaceholder {
  color: #5f6a7a;
  line-height: 1.6;
}

.paginationPlaceholder {
  color: #7f8793;
  font-size: 12px;
}
`

  return [
    {
      filePath: normalizedEntryPagePath,
      source: entrySource,
    },
    {
      filePath: sectionsPagePath,
      source: sectionsSource,
    },
    {
      filePath: sectionsStylePath,
      source: stylesSource,
    },
  ]
}

function shouldBlockFreeformScaffold(contract, { skillRoot } = {}) {
  if (FREEFORM_SCAFFOLD_BLOCKED_MODES.has(String(contract?.archetypeMode || '').trim())) {
    return true
  }

  return isFreeformScaffoldBlockedForPageType(contract?.pageTypeId, { skillRoot })
}

function buildPlaceholderRegionMapping(pageTypeId, explicitRegions) {
  const requiredMappings = getRequiredRegionsForPageType(pageTypeId).map((region) => ({
    region,
    target: `TODO: map ${region} to a concrete host region`,
  }))

  if (explicitRegions.length === 0) {
    return requiredMappings
  }

  const requiredRegionNames = new Set(
    requiredMappings.map((item) => String(item.region || '').trim().toLowerCase())
  )
  const explicitMappingByRegion = new Map(
    explicitRegions.map(({ key, target }) => [
      String(key || '').trim().toLowerCase(),
      { region: key, target },
    ])
  )

  const mergedMappings = requiredMappings.map((item) => {
    const explicit = explicitMappingByRegion.get(String(item.region || '').trim().toLowerCase())
    return explicit || item
  })

  for (const { key, target } of explicitRegions) {
    const normalizedKey = String(key || '').trim().toLowerCase()
    if (!requiredRegionNames.has(normalizedKey)) {
      mergedMappings.push({ region: key, target })
    }
  }

  return mergedMappings
}

function getHostIntegrationRegionTarget(pageType, region) {
  const shell = pageType.shell || 'HostIntegrationShell'
  const targetByRegion = {
    header: `${shell}.title/extra`,
    'white-body': shell,
    'split-workspace': shell,
    'left-tree': `${shell}.leftPane`,
    'right-list': `${shell}.rightList`,
    'query-filter': `${shell}.queryFields`,
    'stat-section': `${shell}.statSection`,
    'chart-section': `${shell}.chartSection`,
    table: `${shell}.tableFields`,
    pagination: `${shell}.pagination`,
    'form-body': `${shell}.formFields`,
    footer: `${shell}.footer`,
    'detail-body': `${shell}.detailBody`,
    'feedback-panel': `${shell}.feedbackPanel`,
  }

  return targetByRegion[region] || `${shell}.${region}`
}

function buildHostIntegrationRegionMapping(pageType, explicitRegions) {
  const explicitMappingByRegion = new Map(
    explicitRegions.map(({ key, target }) => [
      String(key || '').trim().toLowerCase(),
      { region: key, target },
    ])
  )
  const mergedMappings = getRequiredRegionsForPageType(pageType.id).map((region) => {
    const explicit = explicitMappingByRegion.get(String(region || '').trim().toLowerCase())
    return explicit || { region, target: getHostIntegrationRegionTarget(pageType, region) }
  })
  const requiredRegionNames = new Set(
    mergedMappings.map((item) => String(item.region || '').trim().toLowerCase())
  )

  for (const { key, target } of explicitRegions) {
    const normalizedKey = String(key || '').trim().toLowerCase()
    if (!requiredRegionNames.has(normalizedKey)) {
      mergedMappings.push({ region: key, target })
    }
  }

  return mergedMappings
}

function buildPlaceholderOwnershipMapping(pageTypeId, explicitOwnerships) {
  if (explicitOwnerships.length > 0) {
    return explicitOwnerships.map(({ key, target }) => ({ role: key, target }))
  }

  return getRequiredOwnershipRolesForPageType(pageTypeId).map((role) => ({
    role,
    target: `TODO: bind ${role} to one concrete workspace owner`,
  }))
}

function buildHostIntegrationOwnershipMapping(pageType, explicitOwnerships) {
  if (explicitOwnerships.length > 0) {
    return explicitOwnerships.map(({ key, target }) => ({ role: key, target }))
  }

  const shell = pageType.shell || 'HostIntegrationShell'
  return getRequiredOwnershipRolesForPageType(pageType.id).map((role) => ({
    role,
    target:
      role === 'content-slot'
        ? 'TypicalPageAppFrame.content'
        : role === 'main-scroll'
          ? `${shell}.workspaceScroll`
          : shell,
  }))
}

function buildLegacyPageComponentRegionMapping(pageTypeId, explicitRegions) {
  if (explicitRegions.length > 0) {
    return explicitRegions.map(({ key, target }) => ({ region: key, target }))
  }

  return getRequiredRegionsForPageType(pageTypeId).map((region) => ({
    region,
    target: `page-component:${region}`,
  }))
}

function buildLegacyPageComponentOwnershipMapping(pageTypeId, explicitOwnerships) {
  if (explicitOwnerships.length > 0) {
    return explicitOwnerships.map(({ key, target }) => ({ role: key, target }))
  }

  return getRequiredOwnershipRolesForPageType(pageTypeId).map((role) => ({
    role,
    target: `page-component:${role}`,
  }))
}

function getDefaultHostIntegrationArchetypePath(pageType) {
  const packageByShell = {
    FeedbackStatePanel: '@hiui-design/typical-page-shells/host::TypicalPageHeaderPortal',
    ProDetailDrawer: '@hiui-design/typical-page-shells/pro-detail-drawer::ProDetailDrawer',
    ProDetailPage: '@hiui-design/typical-page-shells/pro-detail-page::ProDetailPage',
    ProEditPage: '@hiui-design/typical-page-shells/pro-edit-page::ProEditPage',
    ProFormDrawer: '@hiui-design/typical-page-shells/pro-form-drawer::ProFormDrawer',
    StatListPageFrame: '@hiui-design/typical-page-shells/pro-stat-page::StatListPageFrame',
    TablePageFrame: '@hiui-design/typical-page-shells/pro-table-page::TablePageFrame',
    TreeSplitPageFrame:
      '@hiui-design/typical-page-shells/pro-tree-split-page::TreeSplitPageFrame',
  }

  return packageByShell[pageType.shell] || `host-integration::${pageType.shell || pageType.id}`
}

function getDeclaredBodyRegionOrder(contract) {
  const seen = new Set()
  return Array.isArray(contract?.regionMapping)
    ? contract.regionMapping
        .map((item) => String(item?.region || '').trim())
        .filter((regionName) => {
          const normalized = String(regionName || '').trim().toLowerCase()
          if (!normalized || ['header', 'white-body', 'pagination'].includes(normalized) || seen.has(normalized)) {
            return false
          }

          seen.add(normalized)
          return true
        })
    : []
}

async function buildScaffoldArtifacts({ skillRoot, pagePath, pageType, targetRoot, contract, startPlan }) {
  const certifiedPageComponentArtifacts = await buildCertifiedPageComponentArtifacts({
    contract,
    pagePath,
    skillRoot,
    targetRoot,
    startPlan,
  })
  if (certifiedPageComponentArtifacts) {
    return certifiedPageComponentArtifacts
  }

  const hostIntegrationExampleArtifacts = await buildHostIntegrationExampleArtifacts({
    contract,
    pagePath,
    pageType,
    skillRoot,
    targetRoot,
  })
  if (hostIntegrationExampleArtifacts) {
    return hostIntegrationExampleArtifacts
  }

  const legacyRuntimeBridgeArtifacts = await buildLegacyRuntimeBridgeArtifacts({
    contract,
    pagePath,
    skillRoot,
  })
  if (legacyRuntimeBridgeArtifacts) {
    return legacyRuntimeBridgeArtifacts
  }

  const fullPageDetailArtifacts = buildFullPageDetailShellArtifacts(pagePath, contract)
  if (fullPageDetailArtifacts) {
    return fullPageDetailArtifacts
  }

  const strictTemplateAsset = await resolveStrictTemplateAsset({ contract, skillRoot })
  if (strictTemplateAsset) {
    return toArtifactList(
      pagePath,
      renderStrictTemplateSource({
        contract,
        pagePath,
        templateAsset: strictTemplateAsset,
      })
    )
  }

  const fixedDashboardScaffold = buildFixedDashboardManagedPageScaffold(pagePath, contract)
  if (fixedDashboardScaffold) {
    return toArtifactList(pagePath, fixedDashboardScaffold)
  }

  const structuredArtifacts = buildStructuredManagedPageArtifacts(pagePath, contract)
  if (structuredArtifacts) {
    return structuredArtifacts
  }

  if (shouldBlockFreeformScaffold(contract, { skillRoot })) {
    throw new Error(
      `typical-page:start-page cannot create a free-form scaffold for ${contract.pageTypeId} in ${contract.archetypeMode}. Provide an executable template, host archetype, structured managed artifact, or certified adapter before generating; do not synthesize critical regions from source markers.`
    )
  }

  const componentName = toComponentName(pagePath)
  const snippet = renderManagedPageSourceContractSnippet(contract)

  return toArtifactList(
    pagePath,
    `/* generated by typical-page:start-page */
/* replace placeholder targets and wrappers before preflight/formal acceptance */

export default function ${componentName}() {
  return (
${indentBlock(snippet, '    ')}
  )
}
`
  )
}

function buildStartPageReport({
  contract,
  contractJsonPath,
  contractMarkdownPath,
  mode,
  pagePath,
  pageType,
  requestedPagePath,
  scaffoldArtifacts,
}) {
  const generationProfile = contract.generationProfile || {}
  const legacyRuntimeBridgeReady =
    mode === 'legacy-host-compatible' &&
    (String(generationProfile.legacyStrategyId || '').trim() === 'runtime-bridged-page-component' ||
      (String(generationProfile.strategy || '').trim() === 'page-component' &&
        String(generationProfile.runtimeBridgeProfileId || '').trim()))
  const pageComponentManagedPath =
    legacyRuntimeBridgeReady || String(generationProfile.strategy || '').trim() === 'page-component'
  const executionDecisionSummary = {
    defaultAction: pageComponentManagedPath
      ? 'fill-business-slots-inside-managed-page-component'
      : 'complete-managed-start-point-before-business-filling',
    deliveryPath: legacyRuntimeBridgeReady
      ? 'page-component-plus-runtime-bridge-plus-slot-fill'
      : pageComponentManagedPath
        ? 'page-component-plus-slot-fill'
        : 'managed-scaffold-or-fallback-start-point',
    shellImportPolicy: legacyRuntimeBridgeReady
      ? 'legacy-main-tree-forbid-ad-hoc-standard-shell-import'
      : 'follow-selected-delivery-asset',
    runtimeDeliveryMode: String(generationProfile.runtimeBridgeDeliveryMode || '').trim() || '',
    allowedEditBoundary: pageComponentManagedPath
      ? 'business-slots-and-level-1-controlled-extensions-only'
      : 'follow-selected-contract-boundary',
    doNotDo: legacyRuntimeBridgeReady
      ? [
          'do-not-use-reference-as-runtime-delivery-asset',
          'do-not-rebuild-managed-regions-from-primitives',
        ]
      : pageComponentManagedPath
        ? ['do-not-rebuild-managed-regions-from-primitives']
        : [],
  }

  return {
    status: 'started',
    artifactRole: 'business-managed-page',
    pageType: {
      id: pageType.id,
      label: pageType.label,
    },
    mode,
    topology: contract.topology || null,
    layoutStrategy: contract.layoutStrategy || '',
    layoutArchetype: contract.layoutArchetype || '',
    nonTypicalScope: contract.nonTypicalScope || [],
    mandatoryComponents: contract.mandatoryComponents || [],
    compositionGuardrails: contract.compositionGuardrails || [],
    strategyEvidence: contract.strategyEvidence || [],
    runtimeSmokePlan: contract.runtimeSmokePlan || null,
    requestedPagePath,
    pagePath,
    examplePath: contract.examplePath,
    hostArchetypePath: contract.hostArchetypePath,
    requiredRegions: getRequiredRegionsForPageType(pageType.id),
    requiredOwnershipRoles: getRequiredOwnershipRolesForPageType(pageType.id),
    requiredCapabilities: contract.adapterContract.requiredCapabilities,
    localBypasses: contract.adapterContract.localBypasses,
    scaffoldArtifacts: scaffoldArtifacts.map((artifact) => ({ filePath: artifact.filePath })),
    executionDecisionSummary,
    contract: {
      jsonPath: contractJsonPath,
      markdownPath: contractMarkdownPath,
      workflow: {
        status: contract.workflow.status,
        deliveryStatus: contract.workflow.deliveryStatus,
        preflightStatus: contract.workflow.preflightStatus,
        sourceGateStatus: contract.workflow.sourceGateStatus,
        doctorStatus: contract.workflow.doctorStatus,
        runtimeSmokeStatus: contract.workflow.runtimeSmokeStatus,
        sourceSnapshotHash: contract.workflow.sourceSnapshotHash || '',
      },
      strictTemplateRequired: Boolean(contract.strictTemplateRequired),
      templateStatus: contract.templateStatus || '',
      archetypeTemplatePath: contract.archetypeTemplatePath || '',
    },
    nextSteps: [
      'replace TODO contract targets',
      'run typical-page:preflight',
      'for fast typical pages, verify current-page preview plus lint/build; run finalize-page only for formal acceptance, release, or shell/ownership/marker changes',
    ],
  }
}

function buildContractFixtureReport() {
  return {
    status: 'started',
    artifactRole: 'business-managed-page',
    pageType: {
      id: 'table-basic',
      label: '普通表格',
    },
    mode: 'rules-only',
    topology: null,
    layoutStrategy: '',
    layoutArchetype: '',
    nonTypicalScope: [],
    mandatoryComponents: [],
    compositionGuardrails: [],
    strategyEvidence: [],
    runtimeSmokePlan: null,
    requestedPagePath: 'src/pages/orders/index.tsx',
    pagePath: 'src/pages/orders/index.tsx',
    examplePath: 'examples/host-integration/src/pages/table-basic.tsx',
    hostArchetypePath: 'src/pages/orders/host-archetype.tsx',
    requiredRegions: ['header', 'white-body', 'query-filter', 'table', 'pagination'],
    requiredOwnershipRoles: ['content-slot', 'white-body', 'outer-padding', 'main-scroll'],
    requiredCapabilities: ['header-slot', 'white-body', 'query-filter', 'table', 'pagination'],
    localBypasses: [],
    scaffoldArtifacts: [{ filePath: 'src/pages/orders/index.tsx' }],
    executionDecisionSummary: {
      defaultAction: 'complete-managed-start-point-before-business-filling',
      deliveryPath: 'managed-scaffold-or-fallback-start-point',
      shellImportPolicy: 'follow-selected-delivery-asset',
      runtimeDeliveryMode: '',
      allowedEditBoundary: 'follow-selected-contract-boundary',
      doNotDo: [],
    },
    contract: {
      jsonPath: '.local-context/hiui-design/outputs/page-contracts/src__pages__orders__index.json',
      markdownPath: '.local-context/hiui-design/outputs/page-contracts/src__pages__orders__index.md',
      workflow: {
        status: 'started',
        deliveryStatus: 'not-finalized',
        preflightStatus: 'not-run',
        sourceGateStatus: 'not-run',
        doctorStatus: 'not-run',
        runtimeSmokeStatus: 'not-required',
        sourceSnapshotHash: 'start-page-contract-fixture-source',
      },
      strictTemplateRequired: true,
      templateStatus: 'executable',
      archetypeTemplatePath: 'templates/archetypes/rules-only/table-basic',
    },
    nextSteps: [
      'replace TODO contract targets',
      'run typical-page:preflight',
      'for fast typical pages, verify current-page preview plus lint/build; run finalize-page only for formal acceptance, release, or shell/ownership/marker changes',
    ],
  }
}

function emitJson(payload) {
  console.log(JSON.stringify(payload, null, 2))
}

async function ensureParentDir(targetPath) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true })
}

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2))
    const targetRoot = path.resolve(options.target)
    const scriptDir = path.dirname(fileURLToPath(import.meta.url))
    const skillRoot = path.resolve(scriptDir, '..')
    const pkg = await readTargetPackageJson(targetRoot)
    const hostProfile = await loadHostProfileFact({ targetRoot })
    const projectModeFact = await readProjectModeFact(targetRoot)
    const modeResult = inferMode(pkg, hostProfile, options.mode, projectModeFact)
    const mode = modeResult.id
    const { manifest } = await loadPageTypeManifest({ skillRoot, line: options.line })
    const pageType = manifest.pageTypes.find((item) => item.id === options.pageTypeId)

    if (!pageType) {
      throw new Error(`Unknown page type: ${options.pageTypeId}`)
    }

    if (options.contractFixture) {
      emitJson(buildContractFixtureReport())
      return
    }

    const requestedPagePath = normalizeContractPath(targetRoot, options.page)
    const routeOwnershipError = buildTypicalPageReuseTargetError(
      requestedPagePath,
      'typical-page:start-page'
    )
    if (routeOwnershipError) {
      throw new Error(routeOwnershipError)
    }

    let pagePath = requestedPagePath
    const pageExt = path.extname(pagePath)
    if (!['.jsx', '.tsx'].includes(pageExt)) {
      throw new Error(`typical-page:start-page expects a .jsx or .tsx page path. Received ${pagePath}`)
    }

    if (pageType.id === 'full-page-detail') {
      pagePath = toDirectoryArtifactEntryPagePath(pagePath)
    }

    const providedStartPlan = await loadProvidedStartPlan({
      planFile: options.planFile,
      planJson: options.planJson,
      pageTypeId: pageType.id,
      targetRoot,
    })

    const archetypeDefinition = await loadArchetypeDefinition({
      skillRoot,
      pageTypeId: pageType.id,
    })
    const baselineSpecPath = path.join(
      skillRoot,
      'docs',
      'validation',
      'archetype-smoke-baselines.json'
    )
    const baselineSpec = JSON.parse(await fs.readFile(baselineSpecPath, 'utf8'))
    const explicitRegions = parseKeyValueList(options.regions, '--region')
    const explicitOwnerships = parseKeyValueList(options.ownerships, '--ownership')
    const explicitNonTypicalScope = parseStringList(options.nonTypicalScope)
    const regionMapping =
      mode === 'host-integration'
        ? buildHostIntegrationRegionMapping(pageType, explicitRegions)
        : buildPlaceholderRegionMapping(pageType.id, explicitRegions)
    const ownershipMapping =
      mode === 'host-integration'
        ? buildHostIntegrationOwnershipMapping(pageType, explicitOwnerships)
        : buildPlaceholderOwnershipMapping(pageType.id, explicitOwnerships)
    const localBypasses = parseLocalBypasses(options.localBypasses, targetRoot)
    const startPlan =
      providedStartPlan ||
      runPlanPageTaskForStartPage({
        mode,
        pagePath,
        pageType,
        skillRoot,
        targetRoot,
      })

    if (startPlan) {
      assertComponentSemanticStartPlan(startPlan, pageType.id)
    }

    if (startPlan && isLegacyPageComponentFastPathPlan(startPlan) && !isLegacyPageComponentFastPathReady(startPlan)) {
      throw new Error(buildLegacyPageComponentStartBlockReason(startPlan, pageType.id))
    }

    if (startPlan && startPlan.status !== 'ready') {
      const blockingReasons = Array.isArray(startPlan.blockingReasons)
        ? startPlan.blockingReasons.filter(Boolean)
        : []
      throw new Error(
        `typical-page:start-page requires a ready page-task-plan before scaffolding ${pageType.id}. ${
          blockingReasons.length > 0 ? `Blocking reasons: ${blockingReasons.join(' | ')}` : `Received status=${startPlan.status || 'unknown'}`
        }`
      )
    }

    const startPlanSeed = normalizeStartPlanContractSeed(startPlan)
    const resolvedTopology = String(options.topology || '').trim()
      ? options.topology
      : startPlanSeed?.topology || ''
    const resolvedLayoutStrategy = String(options.layoutStrategy || '').trim() || startPlanSeed?.layoutStrategy || ''
    const resolvedLayoutArchetype = startPlanSeed?.layoutArchetype || ''
    const resolvedNonTypicalScope =
      explicitNonTypicalScope.length > 0 ? explicitNonTypicalScope : startPlanSeed?.nonTypicalScope || []
    const runtimeSmokePlan =
      buildRuntimeSmokePlan({
        runtimeSmoke: options.runtimeSmoke,
        topology: resolvedTopology,
      }) || startPlanSeed?.runtimeSmokePlan
    const legacyFastPathGenerationProfile =
      startPlan && isLegacyPageComponentFastPathReady(startPlan)
        ? startPlan.generationProfile
        : null
    const resolvedGenerationProfile = ensureStartPageGenerationProfileRequiredGates(
      legacyFastPathGenerationProfile || startPlanSeed?.generationProfile || null,
      mode
    )
    const hintedOwnershipMapping = buildOwnershipMappingFromPlanHints(explicitOwnerships, startPlanSeed?.ownershipPlan)
    const resolvedRegionMapping = legacyFastPathGenerationProfile
      ? buildLegacyPageComponentRegionMapping(pageType.id, explicitRegions)
      : regionMapping
    const resolvedOwnershipMapping = legacyFastPathGenerationProfile
      ? buildLegacyPageComponentOwnershipMapping(pageType.id, explicitOwnerships)
      : hintedOwnershipMapping.length > 0
        ? hintedOwnershipMapping
        : ownershipMapping
    const resolvedOwnershipMode =
      options.ownershipMode ||
      startPlanSeed?.ownershipPlan?.ownershipMode ||
      (getRequiredOwnershipRolesForPageType(pageType.id).length > 0
        ? 'page-surface-owns-workspace'
        : '')
    const contract = buildRulesOnlyPageContract({
      pageType,
      archetypeDefinition,
      archetypeSmokeBaseline: findArchetypeSmokeBaselineEntry(baselineSpec, pageType.id),
      generatedPagePath: pagePath,
      hostArchetypePath: legacyFastPathGenerationProfile
        ? ''
        : normalizeContractPath(
            targetRoot,
            options.archetype ||
              startPlan?.startFrom?.hostArchetypePath ||
              (mode === 'host-integration'
                ? getDefaultHostIntegrationArchetypePath(pageType)
                : `TODO: set host archetype path for ${pagePath}`)
          ),
      archetypeMode: mode,
      scrollStrategy: getDefaultScrollStrategyForPageType(pageType.id),
      topology: resolvedTopology,
      layoutStrategy: resolvedLayoutStrategy,
      layoutArchetype: resolvedLayoutArchetype,
      nonTypicalScope: resolvedNonTypicalScope,
      mandatoryComponents: startPlanSeed?.mandatoryComponents || [],
      compositionGuardrails: startPlanSeed?.compositionGuardrails || [],
      strategyEvidence: startPlanSeed?.strategyEvidence || [],
      runtimeSmokePlan,
      generationProfile: resolvedGenerationProfile,
      regionMapping: resolvedRegionMapping,
      ownershipMode: resolvedOwnershipMode,
      ownershipMapping: resolvedOwnershipMapping,
      adapterContract: {
        localBypasses,
      },
      semanticContract: {
        queryFilterRegionRole: options.queryFilterRegionRole,
      },
      notes: [
        'Generated by typical-page:start-page.',
        'Replace TODO targets with concrete host regions/ownership before preflight; run finalize-page only for formal acceptance, release, or shell/ownership/marker changes.',
        ...(startPlanSeed?.docBundle?.profile === 'minimal-doc-fast-path'
          ? ['Planner doc profile=minimal-doc-fast-path; keep implementation inside the selected carrier/slot path before reopening fallback scaffold strategies.']
          : []),
        ...(startPlanSeed?.fastPathSummary?.pageShellPolicy
          ? [`Planner shell policy=${startPlanSeed.fastPathSummary.pageShellPolicy}; keep white-body/query-filter/table/pagination ownership on the managed carrier.`]
          : []),
        ...(startPlanSeed?.fastPathSummary?.queryFilterPolicy === 'managed-query-filter'
          ? ['Planner query-filter policy is managed-query-filter; mount the real QueryFilter carrier and preserve contained/showLabel=false defaults instead of rebuilding this region as a form grid or dashboard strip.']
          : []),
        ...(startPlanSeed?.fastPathSummary?.queryFilterPolicy === 'managed-right-query-filter'
          ? ['Planner query-filter policy is managed-right-query-filter; keep the right-list search carrier on the managed QueryFilter path instead of translating it into free-form controls.']
          : []),
        ...(startPlanSeed?.compiledTypicalBaseline?.headerLayout?.required
          ? [
              `Planner typical baseline locks header rhythm at ${startPlanSeed.compiledTypicalBaseline.headerLayout.rhythmPx || 60}px; keep PageHeader stretch/right-dock/rhythm on the shared header carrier instead of local wrappers.`,
            ]
          : []),
        ...(startPlanSeed?.compiledTypicalBaseline?.queryFilter?.required
          ? [
              `Planner typical baseline requires a real ${startPlanSeed.compiledTypicalBaseline.queryFilter.requiredComponent || 'QueryFilter'} carrier for this page type; do not degrade the filter region into SearchForm or handwritten controls.`,
            ]
          : []),
        ...(startPlanSeed?.compiledTypicalBaseline?.whiteBodyOwnership?.required
          ? [
              'Planner typical baseline requires one white-body / outer-padding / main-scroll ownership chain; do not introduce a second page-level white surface or scroll owner.',
            ]
          : []),
        ...(startPlanSeed?.compiledTypicalBaseline?.pagination?.required
          ? [
              `Planner typical baseline keeps pagination on the managed list workspace (${startPlanSeed.compiledTypicalBaseline.pagination.mountPolicy || 'managed-pagination-mount'}); do not move it outside the white-body carrier.`,
            ]
          : []),
        ...(startPlanSeed?.layoutArchetype
          ? ['Planner layout facts were materialized into the started contract so scaffold and overlay guidance stay in sync from the first write.']
          : []),
        ...(legacyFastPathGenerationProfile
          ? ['Planner selected the legacy page-component fast path, so this scaffold uses the runtime bridge wrapper plus business-slot adapter instead of host archetype translation.']
          : []),
      ],
      workflow: {
        status: 'started',
        deliveryStatus: 'not-finalized',
        preflightStatus: 'not-run',
        sourceGateStatus: 'not-run',
        doctorStatus: 'not-run',
        lastCommand: 'typical-page:start-page',
      },
    })

    const scaffoldArtifacts = await buildScaffoldArtifacts({
      skillRoot,
      pagePath,
      pageType,
      targetRoot,
      contract,
      startPlan,
    })

    const validation = validateRulesOnlyPageContract({
      contract,
      manifest,
      targetRoot,
      archetypeDefinition,
      baselineSpec,
    })

    if (validation.errors.length > 0) {
      throw new Error(validation.errors.join('; '))
    }

    const contractsDir = getRulesOnlyPageContractsDir(targetRoot)
    const contractSlug =
      toContractSlug(pagePath.replace(/\.[cm]?[jt]sx?$/, '')) || `${pageType.id}-contract`
    const contractJsonPath = path.join(contractsDir, `${contractSlug}.json`)
    const contractMarkdownPath = path.join(contractsDir, `${contractSlug}.md`)
    const entryArtifact = scaffoldArtifacts.find((artifact) => artifact.filePath === pagePath)
    const existingArtifacts = []

    for (const artifact of scaffoldArtifacts) {
      const artifactAbsPath = path.join(targetRoot, artifact.filePath)
      const exists = await fs
        .access(artifactAbsPath)
        .then(() => true)
        .catch(() => false)
      if (exists) {
        existingArtifacts.push(artifact.filePath)
      }
    }

    const existingContract = await fs
      .access(contractJsonPath)
      .then(() => true)
      .catch(() => false)

    if (!options.force && (existingArtifacts.length > 0 || existingContract)) {
      throw new Error(
        `Refusing to overwrite existing scaffold artifacts. Re-run with --force if you want to replace ${[...existingArtifacts, contractJsonPath].join(', ')}.`
      )
    }

    if (!entryArtifact) {
      throw new Error(
        `typical-page:start-page could not determine the entry artifact for ${pagePath}.`
      )
    }

    for (const artifact of scaffoldArtifacts) {
      const artifactAbsPath = path.join(targetRoot, artifact.filePath)
      await ensureParentDir(artifactAbsPath)
      await writeUtf8FileIfChanged(artifactAbsPath, artifact.source)
    }
    await ensureParentDir(contractJsonPath)
    const snapshot = computeManagedPageSourceSnapshot({
      generatedPagePath: pagePath,
      targetRoot,
    })
    contract.workflow = {
      ...contract.workflow,
      runtimeSmokeStatus: getManagedPageRuntimeSmokeDefaultStatus(contract),
      runtimeSmokeSnapshotHash: '',
      runtimeSmokeReportPath: '',
      sourceSnapshotHash: snapshot.hash,
    }
    await writeManagedPageContractArtifacts({
      contract,
      contractJsonPath,
      contractMarkdownPath,
    })
    await syncManagedPageRegistry(targetRoot)

    if (options.json) {
      emitJson(
        buildStartPageReport({
          contract,
          contractJsonPath,
          contractMarkdownPath,
          mode,
          pagePath,
          pageType,
          requestedPagePath,
          scaffoldArtifacts,
        })
      )
      return
    }

    console.log('[typical-page:start-page] Started managed page scaffold:')
    console.log(`- page type: ${pageType.label} (${pageType.id})`)
    console.log(`- mode: ${mode}`)
    console.log(`- artifact role: business-managed-page`)
    if (contract.topology?.id) {
      console.log(`- topology: ${contract.topology.id}`)
    }
    if (contract.layoutStrategy) {
      console.log(`- layout strategy: ${contract.layoutStrategy}`)
    }
    if (contract.layoutArchetype) {
      console.log(`- layout archetype: ${contract.layoutArchetype}`)
    }
    if (contract.nonTypicalScope?.length > 0) {
      console.log(`- non-typical scope: ${contract.nonTypicalScope.join(', ')}`)
    }
    if (contract.mandatoryComponents?.length > 0) {
      console.log(`- mandatory components: ${contract.mandatoryComponents.join(', ')}`)
    }
    if (contract.runtimeSmokePlan) {
      console.log(
        `- runtime smoke plan: ${contract.runtimeSmokePlan.required ? 'required' : 'not-required'}`
      )
    }
    const generationProfile = contract.generationProfile || {}
    const legacyRuntimeBridgeReady =
      mode === 'legacy-host-compatible' &&
      (String(generationProfile.legacyStrategyId || '').trim() === 'runtime-bridged-page-component' ||
        (String(generationProfile.strategy || '').trim() === 'page-component' &&
          String(generationProfile.runtimeBridgeProfileId || '').trim()))
    const pageComponentManagedPath =
      legacyRuntimeBridgeReady || String(generationProfile.strategy || '').trim() === 'page-component'
    console.log(
      `- default action: ${
        pageComponentManagedPath
          ? 'fill-business-slots-inside-managed-page-component'
          : 'complete-managed-start-point-before-business-filling'
      }`
    )
    console.log(
      `- delivery path: ${
        legacyRuntimeBridgeReady
          ? 'page-component-plus-runtime-bridge-plus-slot-fill'
          : pageComponentManagedPath
            ? 'page-component-plus-slot-fill'
            : 'managed-scaffold-or-fallback-start-point'
      }`
    )
    console.log(
      `- shell import policy: ${
        legacyRuntimeBridgeReady
          ? 'legacy-main-tree-forbid-ad-hoc-standard-shell-import'
          : 'follow-selected-delivery-asset'
      }`
    )
    console.log(
      `- allowed edit boundary: ${
        pageComponentManagedPath
          ? 'business-slots-and-level-1-controlled-extensions-only'
          : 'follow-selected-contract-boundary'
      }`
    )
    if (requestedPagePath !== pagePath) {
      console.log(`- requested page path: ${requestedPagePath}`)
      console.log(`- normalized entry page: ${pagePath}`)
    }
    console.log(`- page: ${pagePath}`)
    console.log(`- example path: ${contract.examplePath}`)
    console.log(`- host archetype path: ${contract.hostArchetypePath}`)
    console.log(`- required regions: ${getRequiredRegionsForPageType(pageType.id).join(', ') || '(none)'}`)
    console.log(
      `- required ownership roles: ${getRequiredOwnershipRolesForPageType(pageType.id).join(', ') || '(none)'}`
    )
    console.log(
      `- required capabilities: ${contract.adapterContract.requiredCapabilities.join(', ') || '(none)'}`
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
    console.log(`- scaffold artifacts:`)
    scaffoldArtifacts.forEach((artifact) => {
      console.log(`  - ${path.join(targetRoot, artifact.filePath)}`)
    })
    console.log(`- scaffold contract: ${contractJsonPath}`)
    console.log(`- workflow status: ${contract.workflow.status}`)
    console.log(`- source snapshot hash: ${contract.workflow.sourceSnapshotHash}`)
    console.log('- next step: replace TODO contract targets, then run typical-page:preflight; fast typical pages complete with current-page preview plus lint/build, while finalize-page is for formal acceptance, release, or shell/ownership/marker changes')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[typical-page:start-page] ${message}`)
    printUsage()
    process.exit(1)
  }
}

main()
