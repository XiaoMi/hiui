import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getManagedPageSourceCommentLines,
  getManagedPageSourceOwnershipAttributes,
  getManagedPageSourceRegionAttributes,
  getManagedPageSourceRootAttributes,
  renderManagedPageSourceContractSnippet,
} from './managed-page-source-guard.mjs'
import { findPageComponent } from './page-component-registry.mjs'
import {
  getEditableSlotsForPageType,
  getLockedRegionsForPageType,
  getMoldIdForPageType,
  getSlotManifestForPageType,
} from './page-mold-registry.mjs'
import {
  buildVisualBaselinePlan,
  buildVisualizationRolePlan,
  normalizeManagedAnalyticsChartIntentItem,
} from './managed-analytics-policy.mjs'
import {
  QUERY_FILTER_FIELD_RENDER_PROFILES,
  QUERY_FILTER_KEYWORD_FIELD_ROLES,
  QUERY_FILTER_SEMANTIC_KEYS,
  QUERY_FILTER_SELECT_DATE_FIELD_SURFACE_POLICIES,
  QUERY_FILTER_SURFACE_BASELINES,
  QUERY_FILTER_TEXT_FIELD_ROLES,
  buildQueryFilterSemanticDefaults,
  buildQueryFilterSemanticProfileErrors,
  buildQueryFilterSemanticValueSetErrors,
  getQueryFilterSemanticValidationProfile,
  queryFilterSemanticFactsRequired,
} from './query-filter-governance.mjs'

export const RULES_ONLY_PAGE_CONTRACT_VERSION = 15
const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
export const MANAGED_PAGE_WORKFLOW_STATUSES = Object.freeze([
  'contract-written',
  'started',
  'preflight-pass',
  'finalized',
  'stale',
])
export const MANAGED_PAGE_RUNTIME_SMOKE_STATUSES = Object.freeze([
  'not-required',
  'not-run',
  'pass',
  'fail',
])
export const MANAGED_PAGE_I18N_SUPPORTED_LOCALES = Object.freeze([
  'zh-CN',
  'zh-TW',
  'en-US',
  'id-ID',
  'th-TH',
  'de-DE',
  'ar-SA',
])
export const MANAGED_PAGE_TEXT_EXPANSION_MULTIPLIERS = Object.freeze({
  'zh-CN': 1,
  'zh-TW': 1,
  'en-US': 1.5,
  'id-ID': 1.5,
  'th-TH': 2,
  'de-DE': 2.5,
  'ar-SA': 2,
})
export const MANAGED_ANALYTICS_RUNTIME_CARRIER_FILE =
  'src/shared/managed-page/fixed-dashboard-page-frame.tsx'
export const MANAGED_ANALYTICS_RUNTIME_CARRIER_EXPORT = 'FixedDashboardPageFrame'
export const MANAGED_ANALYTICS_SHARED_PRIMITIVES_FILE =
  'src/shared/managed-page/data-visualization-primitives.tsx'
export const MANAGED_ANALYTICS_CARRIER_CERTIFICATION_REF =
  'rules/page-component-certifications/data-visualization.managed-analytics.v1.json'
const FIXED_TEMPLATE_PAGE_TYPES = new Set([
  'data-visualization',
  'table-stat',
  'full-page-edit',
  'full-page-detail',
])
const MANAGED_ANALYTICS_LAYOUT_ARCHETYPES = Object.freeze([
  'primary-secondary',
  'linear-stack',
  'parallel-sections',
])

function normalizeGenerationProfile(profile) {
  return profile && typeof profile === 'object' ? profile : null
}

function normalizeManagedAnalyticsTemplateRef(archetypeTemplatePath) {
  const normalizedTemplatePath = String(archetypeTemplatePath || '').trim().replace(/\\/g, '/')
  if (!normalizedTemplatePath) {
    return ''
  }

  if (normalizedTemplatePath.endsWith('/page.template.tsx')) {
    return normalizedTemplatePath
  }

  return `${normalizedTemplatePath.replace(/\/+$/, '')}/page.template.tsx`
}

function isManagedAnalyticsContractProfile({ pageTypeId, profile }) {
  if (String(pageTypeId || '').trim() === 'data-visualization') {
    return true
  }

  const normalizedProfile = normalizeGenerationProfile(profile) || {}
  return (
    String(normalizedProfile.strategy || '').trim() === 'managed-analytics' ||
    String(normalizedProfile.selectedDeliveryAssetKind || '').trim() === 'managed-analytics-shell' ||
    String(normalizedProfile.selectedDeliveryAssetId || '').trim() === 'data-visualization.managed-analytics.v1'
  )
}

export function buildManagedAnalyticsProvenance({
  pageTypeId,
  archetypeTemplatePath,
  selectedDeliveryAssetId,
} = {}) {
  if (!isManagedAnalyticsContractProfile({ pageTypeId, profile: { selectedDeliveryAssetId } })) {
    return null
  }

  const normalizedSelectedDeliveryAssetId =
    String(selectedDeliveryAssetId || '').trim() || 'data-visualization.managed-analytics.v1'

  return {
    scaffoldRef: normalizeManagedAnalyticsTemplateRef(archetypeTemplatePath),
    carrierRef: `${normalizedSelectedDeliveryAssetId}::${MANAGED_ANALYTICS_RUNTIME_CARRIER_EXPORT}`,
    runtimeCarrierPath: `${MANAGED_ANALYTICS_RUNTIME_CARRIER_FILE}::${MANAGED_ANALYTICS_RUNTIME_CARRIER_EXPORT}`,
    carrierCertificationRef: MANAGED_ANALYTICS_CARRIER_CERTIFICATION_REF,
    requiredRuntimeEvidence: [
      `runtime-carrier:${MANAGED_ANALYTICS_RUNTIME_CARRIER_FILE}`,
      `shared-primitives:${MANAGED_ANALYTICS_SHARED_PRIMITIVES_FILE}`,
      'runtime-smoke:required-when-page-scroll',
    ],
  }
}

function applyManagedAnalyticsProvenance(profile, { pageTypeId, archetypeTemplatePath } = {}) {
  const normalizedProfile = normalizeGenerationProfile(profile) || {}
  const provenance = buildManagedAnalyticsProvenance({
    pageTypeId,
    archetypeTemplatePath,
    selectedDeliveryAssetId: normalizedProfile.selectedDeliveryAssetId,
  })

  if (!provenance) {
    return normalizedProfile
  }

  return {
    ...normalizedProfile,
    ...provenance,
  }
}

function isLegacyPageComponentGenerationProfile({ mode, profile }) {
  if (String(mode || '').trim() !== 'legacy-host-compatible') {
    return false
  }

  const normalizedProfile = normalizeGenerationProfile(profile) || {}
  const strategy = String(normalizedProfile.strategy || '').trim()
  const legacyStrategyId = String(normalizedProfile.legacyStrategyId || '').trim()

  return strategy === 'page-component' || legacyStrategyId === 'runtime-bridged-page-component'
}

function expectedGenerationProfileSemantics({ mode, profile }) {
  const pageComponentStart =
    String(profile?.strategy || '').trim() === 'page-component' &&
    String(profile?.startFrom || '').trim() === 'page-component'
  const strictSourceProof =
    String(profile?.sourceProofLevel || '').trim() === 'strict-source-adapter-proof'

  return {
    hostArchetypeRequired: !pageComponentStart,
    requiredGates: pageComponentStart
      ? strictSourceProof
        ? ['source-gate', 'preflight', 'page-instance-validation']
        : ['slot-gate', 'preflight', 'page-instance-validation']
      : mode === 'legacy-host-compatible'
        ? ['source-gate', 'preflight']
        : ['slot-gate', 'preflight'],
    sourceProofLevel: strictSourceProof ? 'strict-source-adapter-proof' : 'slot-boundary-proof',
  }
}

function buildDefaultGenerationProfile({ pageTypeId, archetypeMode, archetypeTemplatePath }) {
  const mode = String(archetypeMode || '').trim() || 'rules-only'
  const usesLegacyRuntimeBridge = mode === 'legacy-host-compatible'
  const generationProfileDefaults = expectedGenerationProfileSemantics({
    mode,
    profile: {
      strategy: usesLegacyRuntimeBridge
        ? 'page-component'
        : 'managed-template-or-archetype-slot-fill',
      startFrom: usesLegacyRuntimeBridge ? 'page-component' : archetypeTemplatePath ? 'template' : 'reference-or-scaffold',
      legacyStrategyId: usesLegacyRuntimeBridge
        ? 'runtime-bridged-page-component'
        : 'managed-template-or-archetype-slot-fill',
    },
  })

  return applyManagedAnalyticsProvenance({
    schemaVersion: 'generation-profile.v1',
    strategy: usesLegacyRuntimeBridge
      ? 'page-component'
      : 'managed-template-or-archetype-slot-fill',
    legacyStrategyId: usesLegacyRuntimeBridge
      ? 'runtime-bridged-page-component'
      : 'managed-template-or-archetype-slot-fill',
    mode,
    moldId: getMoldIdForPageType(pageTypeId),
    startFrom: usesLegacyRuntimeBridge
      ? 'page-component'
      : archetypeTemplatePath
        ? 'template'
        : 'host-archetype',
    lockedRegions: getLockedRegionsForPageType(pageTypeId),
    editableSlots: getEditableSlotsForPageType(pageTypeId),
    slotManifest: getSlotManifestForPageType(pageTypeId),
    requiredGates: generationProfileDefaults.requiredGates,
    fallback: 'block-and-request-managed-mold-or-certified-adapter',
    sourceProofLevel: generationProfileDefaults.sourceProofLevel,
  }, { pageTypeId, archetypeTemplatePath })
}

function normalizeProductionContract(contract) {
  return contract && typeof contract === 'object' ? contract : null
}

function buildDefaultProductionContract({
  generatedPagePath,
  pageTypeId,
  archetypeMode,
  generationProfile,
}) {
  const normalizedGenerationProfile = normalizeGenerationProfile(generationProfile) || {}
  const provenance = buildManagedAnalyticsProvenance({
    pageTypeId,
    archetypeTemplatePath: normalizedGenerationProfile.scaffoldRef || '',
    selectedDeliveryAssetId: normalizedGenerationProfile.selectedDeliveryAssetId,
  })

  return {
    schemaVersion: 'page-production-contract.v1',
    page: generatedPagePath,
    pageTypeId,
    mode: archetypeMode,
    generationProfileRef: 'generationProfile',
    moldId: normalizedGenerationProfile.moldId || '',
    startFrom: normalizedGenerationProfile.startFrom || '',
    ...(provenance || {}),
    lockedRegions: Array.isArray(normalizedGenerationProfile.lockedRegions)
      ? normalizedGenerationProfile.lockedRegions
      : [],
    editableSlots: Array.isArray(normalizedGenerationProfile.editableSlots)
      ? normalizedGenerationProfile.editableSlots
      : [],
    slotManifest: Array.isArray(normalizedGenerationProfile.slotManifest)
      ? normalizedGenerationProfile.slotManifest
      : [],
    requiredGates: Array.isArray(normalizedGenerationProfile.requiredGates)
      ? normalizedGenerationProfile.requiredGates
      : [],
    fallback: normalizedGenerationProfile.fallback || '',
    sourceProofLevel: normalizedGenerationProfile.sourceProofLevel || '',
    policy: 'generate-from-managed-mold-and-fill-business-slots-only',
  }
}

function applyManagedAnalyticsProductionContractProvenance(contract, { pageTypeId, generationProfile } = {}) {
  const normalizedContract = normalizeProductionContract(contract) || {}
  const normalizedGenerationProfile = normalizeGenerationProfile(generationProfile) || {}
  const provenance = buildManagedAnalyticsProvenance({
    pageTypeId,
    archetypeTemplatePath: normalizedGenerationProfile.scaffoldRef || '',
    selectedDeliveryAssetId: normalizedGenerationProfile.selectedDeliveryAssetId,
  })

  if (!provenance) {
    return normalizedContract
  }

  return {
    ...normalizedContract,
    ...provenance,
    requiredRuntimeEvidence: [...provenance.requiredRuntimeEvidence],
  }
}

function buildManagedPageDisplayProfile({ archetypeMode, generationProfile }) {
  const normalizedProfile = normalizeGenerationProfile(generationProfile) || {}
  const strategy = String(normalizedProfile.strategy || '').trim()
  const legacyStrategyId = String(normalizedProfile.legacyStrategyId || '').trim()
  const legacyRuntimeBridgeReady =
    String(archetypeMode || '').trim() === 'legacy-host-compatible' &&
    (legacyStrategyId === 'runtime-bridged-page-component' ||
      (strategy === 'page-component' && String(normalizedProfile.runtimeBridgeProfileId || '').trim()))
  const pageComponentManagedPath = legacyRuntimeBridgeReady || strategy === 'page-component'

  return {
    artifactRole: 'business-managed-page',
    deliverySemantics: pageComponentManagedPath
      ? 'page-component-plus-slot-fill'
      : 'managed-start-point-plus-business-fill',
    runtimeDeliveryMode:
      String(normalizedProfile.runtimeBridgeDeliveryMode || '').trim() ||
      (legacyRuntimeBridgeReady ? 'runtime-component-filled-by-business-slots' : ''),
    shellImportPolicy: legacyRuntimeBridgeReady
      ? 'legacy-main-tree-forbid-ad-hoc-standard-shell-import'
      : 'follow-selected-delivery-asset',
    managedPath: legacyRuntimeBridgeReady
      ? 'runtime-bridge-wrapper-plus-business-slot-adapter'
      : pageComponentManagedPath
        ? 'selected-page-component-or-certified-carrier'
        : 'managed-template-or-host-archetype-start-point',
  }
}

export function getManagedPageTopologyId(contract) {
  const topology = contract?.topology
  if (topology && typeof topology === 'object') {
    return String(topology.id || '').trim()
  }

  return String(topology || '').trim()
}

function normalizeManagedPageTopology(topology) {
  if (!topology) {
    return null
  }

  if (typeof topology === 'object') {
    const id = String(topology.id || '').trim()
    if (!id) {
      return null
    }

    return {
      id,
      source: String(topology.source || '').trim(),
    }
  }

  const id = String(topology || '').trim()
  if (!id) {
    return null
  }

  return {
    id,
    source: 'typical-page:start-page',
  }
}

function normalizeManagedPageStringList(values) {
  if (!Array.isArray(values)) {
    return []
  }

  return values.map((value) => String(value || '').trim()).filter(Boolean)
}

function normalizeManagedPageRuntimeSmokePlan(plan) {
  if (!plan || typeof plan !== 'object') {
    return null
  }

  if (typeof plan.required !== 'boolean') {
    return null
  }

  return {
    required: plan.required,
    reason: String(plan.reason || '').trim(),
  }
}
export const RULES_ONLY_REQUIRED_REGIONS_BY_PAGE_TYPE = Object.freeze({
  'table-basic': ['header', 'white-body', 'query-filter', 'table', 'pagination'],
  'table-stat': ['header', 'white-body', 'stat-section', 'query-filter', 'table', 'pagination'],
  'data-visualization': [
    'header',
    'white-body',
    'stat-section',
    'query-filter',
    'chart-section',
    'table',
    'pagination',
  ],
  'tree-table': ['header', 'white-body', 'query-filter', 'table', 'pagination'],
  'tree-split': [
    'header',
    'split-workspace',
    'left-tree',
    'right-list',
    'query-filter',
    'table',
    'pagination',
  ],
  'drawer-form': ['header', 'drawer-body', 'form-body', 'drawer-footer', 'footer-actions'],
  'drawer-detail': ['header', 'drawer-body', 'detail-body', 'drawer-footer'],
  'feedback-status': ['header', 'white-body', 'feedback-panel'],
  'full-page-edit': [
    'header',
    'header-leading',
    'header-actions',
    'white-body',
    'form-body',
    'footer',
    'footer-actions',
  ],
  'full-page-detail': ['header', 'white-body', 'detail-body'],
})

export const RULES_ONLY_OWNERSHIP_MODES = Object.freeze([
  'host-slot-owns-workspace',
  'page-surface-owns-workspace',
])

export const RULES_ONLY_SCROLL_STRATEGIES = Object.freeze([
  'page-scroll',
  'table-body-scroll',
  'form-body-scroll',
  'drawer-body-scroll',
])

export const RULES_ONLY_OWNERSHIP_ROLE_DESCRIPTIONS = Object.freeze({
  'content-slot':
    '宿主内容槽本身，由宿主 layout/content slot 提供的最外层页面挂载区域',
  'white-body':
    '页面主白底主体；没有字面 white-body 的页型，也要指向承担该职责的 page surface',
  'outer-padding': '页面最外层留白/缩进节奏的唯一拥有者',
  'main-scroll': '主列表/主详情/主编辑工作区的纵向滚动拥有者',
})

export const RULES_ONLY_QUERY_FILTER_REGION_ROLES = Object.freeze([
  'table-query-filter',
  'dashboard-control-strip',
  'not-applicable',
])

export const RULES_ONLY_QUERY_FIELD_RENDER_PROFILES = QUERY_FILTER_FIELD_RENDER_PROFILES

export const RULES_ONLY_KEYWORD_FIELD_ROLES = QUERY_FILTER_KEYWORD_FIELD_ROLES

export const RULES_ONLY_TEXT_FIELD_ROLES = QUERY_FILTER_TEXT_FIELD_ROLES

export const RULES_ONLY_SELECT_DATE_FIELD_SURFACE_POLICIES =
  QUERY_FILTER_SELECT_DATE_FIELD_SURFACE_POLICIES

export const RULES_ONLY_FILTER_SURFACE_BASELINES = QUERY_FILTER_SURFACE_BASELINES

export const RULES_ONLY_DIMENSION_SWITCH_CONTROLS = Object.freeze([
  'segmented-radio-tabs',
  'not-applicable',
])

export const RULES_ONLY_CONTROL_SCOPES = Object.freeze([
  'page-global',
  'detail-table-only',
  'not-applicable',
])

export const RULES_ONLY_CONTROL_STRIP_PLACEMENTS = Object.freeze([
  'top-of-white-body-before-stat-section',
  'detail-section-before-table',
  'not-applicable',
])

export const RULES_ONLY_CONTROL_STRIP_VISUAL_TREATMENTS = Object.freeze([
  'plain-row-no-panel',
  'query-filter-form',
  'not-applicable',
])

export const RULES_ONLY_DETAIL_QUERY_FILTER_POLICIES = Object.freeze([
  'separate-detail-query-filter-near-detail-table',
  'managed-region-is-detail-query-filter',
  'not-applicable',
])

export const RULES_ONLY_MIXED_SCOPE_CONTROL_POLICIES = Object.freeze([
  'forbid-shared-control-row',
  'not-applicable',
])

export const RULES_ONLY_LIST_SHELL_COMPOSITIONS = Object.freeze([
  'page-type-shell',
  'forbid-table-list-scaffold',
])

export const RULES_ONLY_SPACING_OWNERSHIP_POLICIES = Object.freeze([
  'single-owner',
])

export const RULES_ONLY_AREA_CHART_FILL_POLICIES = Object.freeze([
  'same-series-color-fill-0.2',
  'not-applicable',
])

export const RULES_ONLY_BODY_SECTION_PRIMARY_EXPRESSIONS = Object.freeze([
  'form-schema',
  'descriptions',
  'not-applicable',
])

export const RULES_ONLY_BODY_SECTION_COMPOSITIONS = Object.freeze([
  'groups-only',
  'groups-with-inline-help',
  'groups-with-supporting-sections',
  'mixed-unapproved',
  'not-applicable',
])

export const RULES_ONLY_BODY_SECTION_SPACING_OWNERS = Object.freeze([
  'section-structure',
  'form-item',
  'descriptions-group',
  'field-local-wrapper',
  'not-applicable',
])

export const RULES_ONLY_BODY_SECTION_CONTAINER_POLICIES = Object.freeze([
  'flat-section-only',
  'approved-card-section',
  'no-extra-panel-shell',
  'not-applicable',
])

export const RULES_ONLY_BODY_SECTION_EMBEDDED_WIDGET_POLICIES = Object.freeze([
  'none',
  'section-toolbar',
  'simple-table',
  'readonly-chart-summary',
  'media-row',
  'declared-local-widget',
  'not-applicable',
])
const BODY_SECTION_SUPPORTING_WIDGET_POLICIES = new Set([
  'section-toolbar',
  'simple-table',
  'readonly-chart-summary',
  'media-row',
  'declared-local-widget',
])

export const MANAGED_PAGE_SPLIT_PANE_SCROLL_MODES = Object.freeze([
  'independent-pane-scroll',
  'shared-main-scroll',
  'not-applicable',
])

export const MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT = Object.freeze([
  'section-body',
  'panel-body',
  'chart-body',
  'detail-body',
  'field-control',
  'cell-body',
])

const DEFAULT_SCROLL_STRATEGY_BY_PAGE_TYPE = Object.freeze({
  'table-basic': 'table-body-scroll',
  'table-stat': 'table-body-scroll',
  'data-visualization': 'page-scroll',
  'tree-table': 'table-body-scroll',
  'tree-split': 'table-body-scroll',
  'drawer-form': 'drawer-body-scroll',
  'drawer-detail': 'drawer-body-scroll',
  'feedback-status': 'page-scroll',
  'full-page-edit': 'form-body-scroll',
  'full-page-detail': 'page-scroll',
})

const GENERIC_REGION_NAMES = new Set(['main', 'body', 'content', 'container', 'workspace'])

export function buildDefaultManagedPageI18nBaseline() {
  return {
    strategyDeclaration: 'required-before-visible-copy',
    referenceDoc: 'docs/generation/i18n-baseline.md',
    runtimePolicy: 'reuse-project-runtime-or-init-hiui-design-bridge',
    bootstrapCommands: [
      'auto via setup-for-designers/apply/bootstrap',
      'pnpm typical-page:i18n:init (manual resync)',
      'npm run typical-page:i18n:init (manual resync)',
    ],
    syncCommand: 'pnpm i18n:sync',
    supportedLocales: [...MANAGED_PAGE_I18N_SUPPORTED_LOCALES],
    formatterPolicy: ['date', 'number', 'currency', 'percent', 'collation'],
    directionStrategy: 'rtl-aware-logical-properties',
    textExpansionMultipliers: { ...MANAGED_PAGE_TEXT_EXPANSION_MULTIPLIERS },
  }
}

function getDefaultManagedPageSplitPaneContract(pageTypeId) {
  if (pageTypeId === 'tree-split') {
    return {
      enabled: true,
      leftPaneSelector: '[data-hiui5-region="left-tree"]',
      rightPaneSelector: '[data-hiui5-region="right-list"]',
      tableRegionSelector: '[data-hiui5-region="table"]',
      leftPaneScroll: 'independent-pane-scroll',
      rightPaneScroll: 'independent-pane-scroll',
    }
  }

  return {
    enabled: false,
    leftPaneSelector: '',
    rightPaneSelector: '',
    tableRegionSelector: '',
    leftPaneScroll: 'not-applicable',
    rightPaneScroll: 'not-applicable',
  }
}

export function getManagedPageRuntimeSmokeRequirement(contract) {
  const explicitPlan = normalizeManagedPageRuntimeSmokePlan(contract?.runtimeSmokePlan)
  if (explicitPlan?.required || contract?.runtimeSmokeRequired === true) {
    return {
      required: true,
      reason:
        explicitPlan?.reason ||
        'runtime smoke was explicitly required by the managed page contract.',
    }
  }

  const topologyId = getManagedPageTopologyId(contract)
  if (topologyId === 'non-typical-overlay') {
    return {
      required: true,
      reason:
        'non-typical-overlay pages combine a typical page shell with additional cross-region layout, so they must prove the composed runtime behavior in a real browser.',
    }
  }

  if (String(contract?.archetypeMode || '').trim() === 'host-integration') {
    return {
      required: false,
      reason: '',
    }
  }

  if (explicitPlan?.required === false) {
    return {
      required: false,
      reason: explicitPlan.reason,
    }
  }

  const pageTypeId = String(contract?.pageTypeId || '').trim()
  const scrollStrategy = String(contract?.scrollStrategy || '').trim()
  const selectedDeliveryAssetKind = String(
    contract?.generationProfile?.selectedDeliveryAssetKind || ''
  ).trim()
  const splitPaneContract = getManagedPageSplitPaneContract(contract)

  if (pageTypeId === 'table-basic' && selectedDeliveryAssetKind === 'project-certified-carrier') {
    return {
      required: true,
      reason:
        'table-basic pages that ship through a project-certified carrier are in the first strict rollout. They must prove header placement, QueryFilter/table ordering, and horizontal overflow ownership in a real browser before delivery.',
    }
  }

  if (pageTypeId === 'table-stat' && selectedDeliveryAssetKind === 'project-certified-carrier') {
    return {
      required: true,
      reason:
        'table-stat pages that ship through a project-certified carrier are in the strict stat-list rollout. They must prove stat-section presence, metrics-before-filter ordering, and the shared white-body/table chain in a real browser before delivery.',
    }
  }

  if (pageTypeId === 'tree-table' && selectedDeliveryAssetKind === 'project-certified-carrier') {
    return {
      required: true,
      reason:
        'tree-table pages that ship through a project-certified carrier are in the strict tree-list rollout. They must prove the shared list baseline and that tree semantics stay inside the single table region instead of drifting into split-pane carriers in a real browser before delivery.',
    }
  }

  if (pageTypeId === 'drawer-form' && selectedDeliveryAssetKind === 'project-certified-carrier') {
    return {
      required: true,
      reason:
        'drawer-form pages that ship through a project-certified carrier are in the strict drawer-form rollout. They must prove page-header ownership, drawer-shell / drawer-body / drawer-footer ownership, drawer-body scroll responsibility, and right-aligned footer actions in a real browser before delivery.',
    }
  }

  if (pageTypeId === 'full-page-detail' && selectedDeliveryAssetKind === 'project-certified-carrier') {
    return {
      required: true,
      reason:
        'full-page-detail pages that ship through a project-certified carrier are in the strict detail-page rollout. They must prove page-header ownership, white-body / detail-body ownership, page-scroll responsibility, and detail-body containment in a real browser before delivery.',
    }
  }

  if (pageTypeId === 'full-page-edit' && selectedDeliveryAssetKind === 'project-certified-carrier') {
    return {
      required: true,
      reason:
        'full-page-edit pages that ship through a project-certified carrier are in the strict edit-page rollout. They must prove header / form-body / footer ownership, sticky footer placement, and right-aligned footer actions in a real browser before delivery.',
    }
  }

  if (pageTypeId === 'data-visualization' && scrollStrategy === 'page-scroll') {
    return {
      required: true,
      reason:
        'data-visualization pages that keep page-scroll must prove white-body continuity, page-level scroll ownership, and non-nested table scrolling in a real browser.',
    }
  }

  if (
    splitPaneContract.enabled &&
    splitPaneContract.leftPaneScroll === 'independent-pane-scroll' &&
    splitPaneContract.rightPaneScroll === 'independent-pane-scroll'
  ) {
    return {
      required: true,
      reason:
        'split master-detail pages that declare independent left/right pane scrolling must prove both panes scroll independently and the right-side table does not fall back to a nested vertical scroll in a real browser.',
    }
  }

  return {
    required: false,
    reason: '',
  }
}

export function getManagedPageRuntimeSmokeDefaultStatus(contract) {
  return getManagedPageRuntimeSmokeRequirement(contract).required ? 'not-run' : 'not-required'
}

export function reconcileManagedPageRuntimeSmokeWorkflow(contract, workflow = {}, sourceSnapshotHash = '') {
  const requirement = getManagedPageRuntimeSmokeRequirement(contract)
  if (!requirement.required) {
    return {
      runtimeSmokeStatus: 'not-required',
      runtimeSmokeSnapshotHash: '',
      runtimeSmokeReportPath: '',
    }
  }

  const runtimeSmokeStatus = String(workflow.runtimeSmokeStatus || '').trim()
  const runtimeSmokeSnapshotHash = String(workflow.runtimeSmokeSnapshotHash || '').trim()
  const runtimeSmokeReportPath = String(workflow.runtimeSmokeReportPath || '').trim()

  if (
    (runtimeSmokeStatus === 'pass' || runtimeSmokeStatus === 'fail') &&
    runtimeSmokeSnapshotHash &&
    sourceSnapshotHash &&
    runtimeSmokeSnapshotHash === sourceSnapshotHash
  ) {
    return {
      runtimeSmokeStatus,
      runtimeSmokeSnapshotHash,
      runtimeSmokeReportPath,
    }
  }

  return {
    runtimeSmokeStatus: 'not-run',
    runtimeSmokeSnapshotHash: '',
    runtimeSmokeReportPath: '',
  }
}

export function buildManagedPageWorkflowMetadata(overrides = {}) {
  const status = String(overrides.status || 'contract-written').trim() || 'contract-written'
  const isFinalized = status === 'finalized'
  const isPreflightPass = status === 'preflight-pass'
  const isStale = status === 'stale'
  const normalizedDeferredChecks = Array.isArray(overrides.deferredChecks)
    ? [...new Set(overrides.deferredChecks.map((item) => String(item || '').trim()).filter(Boolean))]
    : []

  return {
    status,
    deliveryStatus:
      String(overrides.deliveryStatus || '').trim() ||
      (isFinalized ? 'finalized' : isStale ? 'stale' : 'not-finalized'),
    startedAt: String(overrides.startedAt || '').trim() || '',
    finalizedAt: String(overrides.finalizedAt || '').trim() || '',
    preflightStatus:
      String(overrides.preflightStatus || '').trim() ||
      (isFinalized || isPreflightPass ? 'pass' : 'not-run'),
    sourceGateStatus:
      String(overrides.sourceGateStatus || '').trim() || (isFinalized ? 'pass' : 'not-run'),
    doctorStatus:
      String(overrides.doctorStatus || '').trim() || (isFinalized ? 'pass' : 'not-run'),
    runtimeSmokeStatus:
      String(overrides.runtimeSmokeStatus || '').trim() ||
      (isFinalized ? 'not-required' : 'not-required'),
    runtimeSmokeSnapshotHash: String(overrides.runtimeSmokeSnapshotHash || '').trim() || '',
    runtimeSmokeReportPath: String(overrides.runtimeSmokeReportPath || '').trim() || '',
    sourceSnapshotHash: String(overrides.sourceSnapshotHash || '').trim() || '',
    staleReason: String(overrides.staleReason || '').trim() || '',
    preflightStage: String(overrides.preflightStage || '').trim() || '',
    readyForImplementation:
      typeof overrides.readyForImplementation === 'boolean'
        ? overrides.readyForImplementation
        : isPreflightPass || isFinalized || isStale,
    readyForDelivery:
      typeof overrides.readyForDelivery === 'boolean'
        ? overrides.readyForDelivery
        : isPreflightPass || isFinalized,
    deferredChecks:
      normalizedDeferredChecks.length > 0
        ? normalizedDeferredChecks
        : isStale
          ? ['finalizePage']
          : [],
    reportPath: String(overrides.reportPath || '').trim() || '',
    smokeReportPath: String(overrides.smokeReportPath || '').trim() || '',
    lastCommand: String(overrides.lastCommand || '').trim() || '',
  }
}

function getDataVisualizationSemanticContractDefaults(queryFilterRegionRole = 'dashboard-control-strip') {
  const normalizedRole = String(queryFilterRegionRole || '').trim() || 'dashboard-control-strip'

  if (normalizedRole === 'table-query-filter') {
    return {
      queryFilterRegionRole: 'table-query-filter',
      dimensionSwitchControl: 'segmented-radio-tabs',
      controlScope: 'detail-table-only',
      controlStripPlacement: 'detail-section-before-table',
      controlStripVisualTreatment: 'query-filter-form',
      detailQueryFilterPolicy: 'managed-region-is-detail-query-filter',
      mixedScopeControls: 'forbid-shared-control-row',
      listShellComposition: 'forbid-table-list-scaffold',
      spacingOwnership: 'single-owner',
      areaChartFill: 'same-series-color-fill-0.2',
      ...buildQueryFilterSemanticDefaults({ managed: true }),
    }
  }

  return {
    queryFilterRegionRole: 'dashboard-control-strip',
    dimensionSwitchControl: 'segmented-radio-tabs',
    controlScope: 'page-global',
    controlStripPlacement: 'top-of-white-body-before-stat-section',
    controlStripVisualTreatment: 'plain-row-no-panel',
    detailQueryFilterPolicy: 'separate-detail-query-filter-near-detail-table',
    mixedScopeControls: 'forbid-shared-control-row',
    listShellComposition: 'forbid-table-list-scaffold',
    spacingOwnership: 'single-owner',
    areaChartFill: 'same-series-color-fill-0.2',
    ...buildQueryFilterSemanticDefaults({ managed: false }),
  }
}

function isBodySectionGovernedPageType(pageTypeId) {
  return new Set([
    'full-page-edit',
    'drawer-form',
    'drawer-detail',
    'full-page-detail',
  ]).has(String(pageTypeId || '').trim())
}

function getDefaultManagedPageBodySectionContract(pageTypeId) {
  switch (String(pageTypeId || '').trim()) {
    case 'full-page-edit':
    case 'drawer-form':
      return {
        primaryExpression: 'form-schema',
        sectionComposition: 'groups-only',
        sectionSpacingOwnership: 'section-structure',
        sectionContainerPolicy: 'flat-section-only',
        embeddedWidgetPolicy: 'none',
      }
    case 'drawer-detail':
    case 'full-page-detail':
      return {
        primaryExpression: 'descriptions',
        sectionComposition: 'groups-only',
        sectionSpacingOwnership: 'descriptions-group',
        sectionContainerPolicy: 'flat-section-only',
        embeddedWidgetPolicy: 'none',
      }
    default:
      return {
        primaryExpression: 'not-applicable',
        sectionComposition: 'not-applicable',
        sectionSpacingOwnership: 'not-applicable',
        sectionContainerPolicy: 'not-applicable',
        embeddedWidgetPolicy: 'not-applicable',
      }
  }
}

function buildManagedPageBodySectionContract(pageTypeId, overrides = {}) {
  const defaults = getDefaultManagedPageBodySectionContract(pageTypeId)
  const source = overrides && typeof overrides === 'object' ? overrides : {}

  return {
    primaryExpression:
      String(source.primaryExpression || '').trim() || defaults.primaryExpression,
    sectionComposition:
      String(source.sectionComposition || '').trim() || defaults.sectionComposition,
    sectionSpacingOwnership:
      String(source.sectionSpacingOwnership || '').trim() || defaults.sectionSpacingOwnership,
    sectionContainerPolicy:
      String(source.sectionContainerPolicy || '').trim() || defaults.sectionContainerPolicy,
    embeddedWidgetPolicy:
      String(source.embeddedWidgetPolicy || '').trim() || defaults.embeddedWidgetPolicy,
  }
}

function getContractPageComponentId(contract) {
  return String(
    contract?.generationProfile?.pageComponentId || contract?.productionContract?.pageComponentId || ''
  ).trim()
}

function resolveContractPageComponent(contract, { targetRoot = '' } = {}) {
  const componentId = getContractPageComponentId(contract)
  if (!componentId) return null
  return findPageComponent(componentId, { skillRoot, targetRoot }) || null
}

function getSupportingSectionsAllowedContentTypes(component) {
  const supportingSections = Array.isArray(component?.allowedExtensions)
    ? component.allowedExtensions.find((extension) => extension?.slotId === 'supportingSections')
    : null

  return new Set(
    (Array.isArray(supportingSections?.contentType) ? supportingSections.contentType : [])
      .map((contentType) => String(contentType || '').trim())
      .filter(Boolean)
  )
}

function validateManagedBodySectionContractConsistency({
  contract,
  semanticContract,
  targetRoot = '',
}) {
  if (!isBodySectionGovernedPageType(contract?.pageTypeId)) return []

  const errors = []
  const bodySectionContract = semanticContract?.bodySectionContract || {}
  const sectionComposition = String(bodySectionContract.sectionComposition || '').trim()
  const embeddedWidgetPolicy = String(bodySectionContract.embeddedWidgetPolicy || '').trim()
  const requiresSupportingSections = BODY_SECTION_SUPPORTING_WIDGET_POLICIES.has(embeddedWidgetPolicy)
  const declaresSupportingSections = sectionComposition === 'groups-with-supporting-sections'

  if (requiresSupportingSections && !declaresSupportingSections) {
    errors.push(
      `semanticContract.bodySectionContract.embeddedWidgetPolicy=${embeddedWidgetPolicy} requires semanticContract.bodySectionContract.sectionComposition=groups-with-supporting-sections so governed supporting sections stay distinguishable from free-form body layout.`
    )
  }

  if (
    declaresSupportingSections &&
    !BODY_SECTION_SUPPORTING_WIDGET_POLICIES.has(embeddedWidgetPolicy)
  ) {
    errors.push(
      'semanticContract.bodySectionContract.sectionComposition=groups-with-supporting-sections requires a concrete embeddedWidgetPolicy (for example section-toolbar/simple-table/readonly-chart-summary/media-row) so preflight can explain which governed supporting widget expands the body scope.'
    )
  }

  if (!requiresSupportingSections) return errors

  const pageComponent = resolveContractPageComponent(contract, { targetRoot })
  if (!pageComponent) return errors

  const allowedContentTypes = getSupportingSectionsAllowedContentTypes(pageComponent)
  if (allowedContentTypes.size === 0) {
    errors.push(
      `${pageComponent.componentId} does not declare a supportingSections allowed extension. Body supporting widgets must stay inside page-component extension declarations instead of drifting into undeclared local scope.`
    )
    return errors
  }

  if (
    embeddedWidgetPolicy !== 'declared-local-widget' &&
    !allowedContentTypes.has(embeddedWidgetPolicy)
  ) {
    errors.push(
      `${pageComponent.componentId} does not whitelist bodySectionContract.embeddedWidgetPolicy=${embeddedWidgetPolicy} in supportingSections allowedExtensions. Supporting body widgets must stay inside page-component extension declarations instead of drifting into undeclared local scope.`
    )
  }

  return errors
}

function getDefaultManagedPageSemanticContract(pageTypeId, overrides = {}) {
  if (pageTypeId === 'data-visualization') {
    return getDataVisualizationSemanticContractDefaults(overrides.queryFilterRegionRole)
  }

  const hasRealQueryFilter =
    getRequiredRegionsForPageType(pageTypeId).includes('query-filter') &&
    String(overrides.queryFilterRegionRole || '').trim() !== 'dashboard-control-strip'

  return {
    queryFilterRegionRole: getRequiredRegionsForPageType(pageTypeId).includes('query-filter')
      ? 'table-query-filter'
      : 'not-applicable',
    dimensionSwitchControl: 'not-applicable',
    controlScope: 'not-applicable',
    controlStripPlacement: 'not-applicable',
    controlStripVisualTreatment: 'not-applicable',
    detailQueryFilterPolicy: 'not-applicable',
    mixedScopeControls: 'not-applicable',
    listShellComposition: 'page-type-shell',
    spacingOwnership: 'single-owner',
    areaChartFill: pageTypeId === 'table-stat' ? 'not-applicable' : 'not-applicable',
    ...buildQueryFilterSemanticDefaults({ managed: hasRealQueryFilter }),
  }
}

export function buildManagedPageSemanticContract(pageTypeId, overrides = {}) {
  const defaults = getDefaultManagedPageSemanticContract(pageTypeId, overrides)
  const queryFilterRegionRole =
    String(overrides.queryFilterRegionRole || '').trim() || defaults.queryFilterRegionRole
  const roleDefaults = getDefaultManagedPageSemanticContract(pageTypeId, {
    ...overrides,
    queryFilterRegionRole,
  })

  return {
    queryFilterRegionRole,
    dimensionSwitchControl:
      String(overrides.dimensionSwitchControl || '').trim() || roleDefaults.dimensionSwitchControl,
    controlScope: String(overrides.controlScope || '').trim() || roleDefaults.controlScope,
    controlStripPlacement:
      String(overrides.controlStripPlacement || '').trim() || roleDefaults.controlStripPlacement,
    controlStripVisualTreatment:
      String(overrides.controlStripVisualTreatment || '').trim() ||
      roleDefaults.controlStripVisualTreatment,
    detailQueryFilterPolicy:
      String(overrides.detailQueryFilterPolicy || '').trim() ||
      roleDefaults.detailQueryFilterPolicy,
    mixedScopeControls:
      String(overrides.mixedScopeControls || '').trim() || roleDefaults.mixedScopeControls,
    listShellComposition:
      String(overrides.listShellComposition || '').trim() || roleDefaults.listShellComposition,
    spacingOwnership:
      String(overrides.spacingOwnership || '').trim() || roleDefaults.spacingOwnership,
    areaChartFill:
      String(overrides.areaChartFill || '').trim() || roleDefaults.areaChartFill,
    queryFieldRenderProfile:
      String(overrides.queryFieldRenderProfile || '').trim() || roleDefaults.queryFieldRenderProfile,
    keywordFieldRole:
      String(overrides.keywordFieldRole || '').trim() || roleDefaults.keywordFieldRole,
    textFieldRole: String(overrides.textFieldRole || '').trim() || roleDefaults.textFieldRole,
    selectDateFieldSurfacePolicy:
      String(overrides.selectDateFieldSurfacePolicy || '').trim() ||
      roleDefaults.selectDateFieldSurfacePolicy,
    filterSurfaceBaseline:
      String(overrides.filterSurfaceBaseline || '').trim() || roleDefaults.filterSurfaceBaseline,
    bodySectionContract: buildManagedPageBodySectionContract(
      pageTypeId,
      overrides.bodySectionContract
    ),
  }
}

export function getManagedPageSemanticContract(contract) {
  const pageTypeId = String(contract?.pageTypeId || '').trim()
  return buildManagedPageSemanticContract(pageTypeId, contract?.semanticContract || {})
}

function buildDefaultManagedChartUsageContract(pageTypeId, overrides = {}, context = {}) {
  const normalizedPageTypeId = String(pageTypeId || '').trim()
  if (normalizedPageTypeId !== 'data-visualization') {
    return null
  }

  const normalizedChartIntentItems = Array.isArray(overrides.chartIntentItems)
    ? overrides.chartIntentItems.map((item) =>
        normalizeManagedAnalyticsChartIntentItem(item, {
          changeText: context.changeText,
          layoutArchetype: context.layoutArchetype,
        })
      )
    : [
        normalizeManagedAnalyticsChartIntentItem(
          {
            chartId: 'TODO_CHART_ID',
            title: 'TODO_CHART_TITLE',
            businessQuestion: 'TODO_BUSINESS_QUESTION',
            informationTask: 'TODO_INFORMATION_TASK',
            chartType: 'TODO_CHART_TYPE',
            readingLane: 'TODO_READING_LANE',
            visualRole: 'TODO_VISUAL_ROLE',
            regionPriority: 'TODO_REGION_PRIORITY',
            preferredRegionSize: 'TODO_REGION_SIZE',
            canOwnPrimaryRegion: null,
            forbiddenPlacements: ['TODO_FORBIDDEN_PLACEMENT'],
          },
          {
            changeText: context.changeText,
            layoutArchetype: context.layoutArchetype,
          }
        ),
      ]

  return {
    schemaVersion: 'chart-usage-contract.v1',
    contractStatus: String(overrides.contractStatus || '').trim() || 'pending-definition',
    readingPath:
      Array.isArray(overrides.readingPath) && overrides.readingPath.length > 0
        ? [...new Set(overrides.readingPath.map((item) => String(item || '').trim()).filter(Boolean))]
        : ['summary', 'primary', 'secondary', 'detail-table'],
    chartIntentItems: normalizedChartIntentItems,
  }
}

function hasPlaceholderChartIntentValue(value) {
  return typeof value === 'string' && value.trim().startsWith('TODO_')
}

export function buildManagedPageSplitPaneContract(pageTypeId, overrides = {}) {
  const defaults = getDefaultManagedPageSplitPaneContract(pageTypeId)
  return {
    enabled: typeof overrides.enabled === 'boolean' ? overrides.enabled : defaults.enabled,
    leftPaneSelector: String(overrides.leftPaneSelector || '').trim() || defaults.leftPaneSelector,
    rightPaneSelector:
      String(overrides.rightPaneSelector || '').trim() || defaults.rightPaneSelector,
    tableRegionSelector:
      String(overrides.tableRegionSelector || '').trim() || defaults.tableRegionSelector,
    leftPaneScroll: String(overrides.leftPaneScroll || '').trim() || defaults.leftPaneScroll,
    rightPaneScroll: String(overrides.rightPaneScroll || '').trim() || defaults.rightPaneScroll,
  }
}

export function getManagedPageSplitPaneContract(contract) {
  const pageTypeId = String(contract?.pageTypeId || '').trim()
  return buildManagedPageSplitPaneContract(pageTypeId, contract?.splitPaneContract || {})
}

function normalizeManagedPageLocalBypass(value) {
  if (!value || typeof value !== 'object') {
    return null
  }

  return {
    packageSpec: String(value.packageSpec || '').trim(),
    capabilityGap: String(value.capabilityGap || '').trim(),
    adapterPath: String(value.adapterPath || '').trim().replace(/\\/g, '/'),
    tokenBridgePath: String(value.tokenBridgePath || '').trim().replace(/\\/g, '/'),
    ownerContainment: String(value.ownerContainment || '').trim(),
  }
}

export function getManagedPageLocalBypasses(contract) {
  const rawEntries = Array.isArray(contract?.adapterContract?.localBypasses)
    ? contract.adapterContract.localBypasses
    : []

  return rawEntries.map((entry) => normalizeManagedPageLocalBypass(entry)).filter(Boolean)
}

export function getRulesOnlyOutputRoot(targetRoot) {
  return path.join(targetRoot, '.local-context', 'hiui-design', 'outputs')
}

export function getRulesOnlyPageContractsDir(targetRoot) {
  return path.join(getRulesOnlyOutputRoot(targetRoot), 'page-contracts')
}

export function normalizeContractPath(targetRoot, inputPath) {
  if (!inputPath) return ''
  return path.isAbsolute(inputPath)
    ? path.relative(targetRoot, inputPath)
    : inputPath.replace(/\\/g, '/')
}

export function toContractSlug(value) {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/[^a-zA-Z0-9/_-]+/g, '-')
    .replace(/\//g, '__')
    .replace(/-+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
}

export function getRequiredRegionsForPageType(pageTypeId) {
  return [...(RULES_ONLY_REQUIRED_REGIONS_BY_PAGE_TYPE[pageTypeId] ?? [])]
}

export function findArchetypeSmokeBaselineEntry(baselineSpec, pageTypeId) {
  if (!baselineSpec || !Array.isArray(baselineSpec.baselines)) {
    return null
  }

  return (
    baselineSpec.baselines.find((item) => String(item?.pageTypeId || '') === String(pageTypeId || '')) ||
    null
  )
}

function normalizeViewport(viewport) {
  if (!viewport || typeof viewport !== 'object') {
    return null
  }

  const width = Number(viewport.width)
  const height = Number(viewport.height)
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return null
  }

  return { width, height }
}

export function buildArchetypeSmokeBaselineContractEntry(entry) {
  if (!entry) {
    return null
  }

  return {
    pageTypeId: entry.pageTypeId || '',
    screenshotKey: entry.screenshotKey || '',
    routeSuggestion: entry.routeSuggestion || '',
    examplePath: entry.examplePath || '',
    viewport: normalizeViewport(entry.viewport),
    assertions: Array.isArray(entry.assertions) ? [...entry.assertions] : [],
  }
}

function normalizeRegionName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

function normalizeOwnershipRole(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

export function getRequiredOwnershipRolesForPageType(pageTypeId) {
  const requiredRegions = getRequiredRegionsForPageType(pageTypeId)

  if (requiredRegions.includes('white-body')) {
    return ['content-slot', 'white-body', 'outer-padding', 'main-scroll']
  }

  if (pageTypeId === 'tree-split') {
    return ['content-slot', 'outer-padding', 'main-scroll']
  }

  return []
}

export function getDefaultScrollStrategyForPageType(pageTypeId) {
  return DEFAULT_SCROLL_STRATEGY_BY_PAGE_TYPE[pageTypeId] || ''
}

function resolvePrimaryHostAdapter({ pageTypeId, archetypeMode, capabilityRegistry }) {
  if (!pageTypeId || !archetypeMode) {
    return null
  }

  const capabilities = Array.isArray(capabilityRegistry?.capabilities)
    ? capabilityRegistry.capabilities
    : []
  const matches = capabilities.filter((item) => {
    const pageTypes = Array.isArray(item?.pageTypes) ? item.pageTypes : []
    const supportedModes = Array.isArray(item?.supportedModes) ? item.supportedModes : []

    return pageTypes.includes(pageTypeId) && supportedModes.includes(archetypeMode)
  })

  if (matches.length !== 1) {
    return null
  }

  return {
    id: String(matches[0]?.id || '').trim(),
    label: String(matches[0]?.label || '').trim(),
  }
}

function getRequiredRegions(contract, archetypeDefinition) {
  const archetypeRegions = Array.isArray(archetypeDefinition?.archetype?.requiredRegions)
    ? archetypeDefinition.archetype.requiredRegions
    : []

  if (archetypeRegions.length > 0) {
    return [...archetypeRegions]
  }

  return getRequiredRegionsForPageType(contract.pageTypeId)
}

function getRequiredOwnershipRoles(contract, archetypeDefinition) {
  const archetypeRoles = Array.isArray(archetypeDefinition?.archetype?.requiredOwnershipRoles)
    ? archetypeDefinition.archetype.requiredOwnershipRoles
    : []

  if (archetypeRoles.length > 0) {
    return [...archetypeRoles]
  }

  return getRequiredOwnershipRolesForPageType(contract.pageTypeId)
}

export function buildRulesOnlyPageContract({
  pageType,
  archetypeDefinition = null,
  archetypeSmokeBaseline = null,
  generatedPagePath,
  hostArchetypePath,
  archetypeMode = 'rules-only',
  regionMapping,
  ownershipMode = '',
  ownershipMapping = [],
  scrollStrategy = '',
  topology = '',
  layoutStrategy = '',
  layoutArchetype = '',
  nonTypicalScope = [],
  mandatoryComponents = [],
  compositionGuardrails = [],
  strategyEvidence = [],
  runtimeSmokePlan = null,
  generationProfile = null,
  productionContract = null,
  chartUsageContract = null,
  visualBaselinePlan = null,
  visualizationRolePlan = null,
  notes = [],
  deviations = [],
  adapterContract = {},
  semanticContract = {},
  splitPaneContract = {},
  workflow = {},
}) {
  const createdAt = new Date().toISOString()
  const topologyContract = normalizeManagedPageTopology(topology)
  const normalizedLayoutStrategy = String(layoutStrategy || '').trim()
  const normalizedLayoutArchetype = String(layoutArchetype || '').trim()
  const normalizedNonTypicalScope = normalizeManagedPageStringList(nonTypicalScope)
  const normalizedMandatoryComponents = normalizeManagedPageStringList(mandatoryComponents)
  const normalizedCompositionGuardrails = normalizeManagedPageStringList(compositionGuardrails)
  const normalizedStrategyEvidence = normalizeManagedPageStringList(strategyEvidence)
  const normalizedRuntimeSmokePlan = normalizeManagedPageRuntimeSmokePlan(runtimeSmokePlan)
  const archetypeTemplatePath =
    archetypeDefinition?.archetype?.modeAdapters?.[archetypeMode]?.templateDir || ''
  const resolvedGenerationProfile = applyManagedAnalyticsProvenance(
    normalizeGenerationProfile(generationProfile) ||
      buildDefaultGenerationProfile({
        pageTypeId: pageType.id,
        archetypeMode,
        archetypeTemplatePath,
      }),
    {
      pageTypeId: pageType.id,
      archetypeTemplatePath,
    }
  )
  const primaryHostAdapter = resolvePrimaryHostAdapter({
    pageTypeId: pageType.id,
    archetypeMode,
    capabilityRegistry: archetypeDefinition?.capabilityRegistry,
  })
  const resolvedVisualBaselinePlan =
    pageType.id === 'data-visualization'
      ? visualBaselinePlan || buildVisualBaselinePlan({ layoutArchetype: normalizedLayoutArchetype })
      : null
  const resolvedVisualizationRolePlan =
    pageType.id === 'data-visualization'
      ? visualizationRolePlan ||
        buildVisualizationRolePlan({
          layoutArchetype: normalizedLayoutArchetype,
          layoutStrategy: normalizedLayoutStrategy,
          pageTypeId: pageType.id,
        })
      : null
  const resolvedChartUsageContract =
    buildDefaultManagedChartUsageContract(
      pageType.id,
      chartUsageContract || {},
      {
        layoutArchetype: normalizedLayoutArchetype,
      }
    )

  const resolvedProductionContract = applyManagedAnalyticsProductionContractProvenance(
    normalizeProductionContract(productionContract) || buildDefaultProductionContract({
      generatedPagePath,
      pageTypeId: pageType.id,
      archetypeMode,
      generationProfile: resolvedGenerationProfile,
    }),
    {
      pageTypeId: pageType.id,
      generationProfile: resolvedGenerationProfile,
    }
  )

  return {
    version: RULES_ONLY_PAGE_CONTRACT_VERSION,
    createdAt,
    artifactRole: 'business-managed-page',
    pageTypeId: pageType.id,
    pageTypeLabel: pageType.label,
    shell: pageType.shell ?? '',
    generatedPagePath,
    examplePath: pageType.assetExamplePath ?? pageType.examplePath ?? '',
    hostArchetypePath,
    archetypeId: archetypeDefinition?.archetype?.id || '',
    archetypeLabel: archetypeDefinition?.archetype?.label || '',
    archetypeVersion: archetypeDefinition?.archetype?.version || '',
    archetypeMode,
    archetypeTemplatePath,
    strictExampleGeneration: Boolean(archetypeDefinition?.archetype),
    archetypeSmokeBaseline: buildArchetypeSmokeBaselineContractEntry(archetypeSmokeBaseline),
    scrollStrategy: scrollStrategy || getDefaultScrollStrategyForPageType(pageType.id),
    generationProfile: resolvedGenerationProfile,
    displayProfile: buildManagedPageDisplayProfile({
      archetypeMode,
      generationProfile: resolvedGenerationProfile,
    }),
    productionContract: resolvedProductionContract,
    ...(topologyContract ? { topology: topologyContract } : {}),
    ...(normalizedLayoutStrategy ? { layoutStrategy: normalizedLayoutStrategy } : {}),
    ...(normalizedLayoutArchetype ? { layoutArchetype: normalizedLayoutArchetype } : {}),
    ...(resolvedVisualBaselinePlan ? { visualBaselinePlan: resolvedVisualBaselinePlan } : {}),
    ...(resolvedVisualizationRolePlan ? { visualizationRolePlan: resolvedVisualizationRolePlan } : {}),
    ...(normalizedNonTypicalScope.length > 0 ? { nonTypicalScope: normalizedNonTypicalScope } : {}),
    ...(normalizedMandatoryComponents.length > 0 ? { mandatoryComponents: normalizedMandatoryComponents } : {}),
    ...(normalizedCompositionGuardrails.length > 0 ? { compositionGuardrails: normalizedCompositionGuardrails } : {}),
    ...(normalizedStrategyEvidence.length > 0 ? { strategyEvidence: normalizedStrategyEvidence } : {}),
    ...(normalizedRuntimeSmokePlan ? { runtimeSmokePlan: normalizedRuntimeSmokePlan } : {}),
    i18nBaseline: buildDefaultManagedPageI18nBaseline(),
    regionMapping,
    ownershipMode,
    ownershipMapping,
    splitPaneContract: buildManagedPageSplitPaneContract(pageType.id, splitPaneContract),
    adapterContract: {
      requiredCapabilities: [...(archetypeDefinition?.archetype?.requiredCapabilities ?? [])],
      allowedOverrides: [...(archetypeDefinition?.allowedOverrides ?? [])],
      forbiddenEscapes: [...(archetypeDefinition?.forbiddenEscapes ?? [])],
      hostAdapterId: primaryHostAdapter?.id || '',
      hostAdapterLabel: primaryHostAdapter?.label || '',
      localBypasses: Array.isArray(adapterContract?.localBypasses)
        ? adapterContract.localBypasses
            .map((entry) => normalizeManagedPageLocalBypass(entry))
            .filter(Boolean)
        : [],
    },
    semanticContract: buildManagedPageSemanticContract(pageType.id, semanticContract),
    ...(resolvedChartUsageContract ? { chartUsageContract: resolvedChartUsageContract } : {}),
    workflow: buildManagedPageWorkflowMetadata({
      startedAt: createdAt,
      ...workflow,
    }),
    notes,
    deviations,
  }
}

export function validateRulesOnlyPageContract({
  contract,
  manifest,
  targetRoot,
  archetypeDefinition = null,
  baselineSpec = null,
}) {
  const errors = []
  const warnings = []
  const pageType = manifest.pageTypes.find((item) => item.id === contract.pageTypeId)

  if (!pageType) {
    errors.push(`Unknown pageTypeId: ${contract.pageTypeId}`)
    return { errors, warnings, pageType: null }
  }

  if (!contract.generatedPagePath) {
    errors.push('Missing generatedPagePath')
  }

  const generationProfile = contract.generationProfile
  const expectedMode = String(contract.archetypeMode || '').trim() || 'rules-only'
  const expectedProfileSemantics = expectedGenerationProfileSemantics({
    mode: expectedMode,
    profile: generationProfile,
  })

  if (expectedProfileSemantics.hostArchetypeRequired && !contract.hostArchetypePath) {
    errors.push('Missing hostArchetypePath')
  }

  if (contract.version !== RULES_ONLY_PAGE_CONTRACT_VERSION) {
    warnings.push(
      `Contract schema version is ${contract.version ?? '(missing)'}; current writer emits version ${RULES_ONLY_PAGE_CONTRACT_VERSION}. Re-write the contract after updating the page.`
    )
  }

  const expectedGates = expectedProfileSemantics.requiredGates

  if (!generationProfile || typeof generationProfile !== 'object') {
    errors.push(
      'Missing generationProfile metadata. Re-run typical-page:start-page or typical-page:write-contract so the page is generated from a managed mold before preflight.'
    )
  } else {
    if (generationProfile.schemaVersion !== 'generation-profile.v1') {
      errors.push(
        `generationProfile.schemaVersion must be generation-profile.v1; received ${generationProfile.schemaVersion || '(missing)'}`
      )
    }

    if (generationProfile.mode !== expectedMode) {
      errors.push(
        `generationProfile.mode must match archetypeMode ${expectedMode}; received ${generationProfile.mode || '(missing)'}`
      )
    }

    if (!String(generationProfile.moldId || '').trim()) {
      errors.push('generationProfile.moldId is required so preflight can verify the selected managed mold.')
    }

    if (!String(generationProfile.startFrom || '').trim()) {
      errors.push('generationProfile.startFrom is required so generation cannot fall back to a free-form page scaffold.')
    }

    const lockedRegions = Array.isArray(generationProfile.lockedRegions)
      ? generationProfile.lockedRegions
      : []
    const requiredCarrierRegions = contract.pageTypeId === 'drawer-form' || contract.pageTypeId === 'drawer-detail'
      ? ['drawer-shell', 'drawer-body']
      : getRequiredOwnershipRolesForPageType(contract.pageTypeId).includes('main-scroll')
        ? ['shell', 'main-scroll']
        : []
    const missingCarrierRegions = requiredCarrierRegions.filter((region) => !lockedRegions.includes(region))
    if (missingCarrierRegions.length > 0) {
      errors.push(
        `generationProfile.lockedRegions must include ${requiredCarrierRegions.join(' and ')} so page chrome and scrolling stay mold-owned.`
      )
    }

    const requiredGates = Array.isArray(generationProfile.requiredGates)
      ? generationProfile.requiredGates
      : []
    const missingRequiredGates = expectedGates.filter((gate) => !requiredGates.includes(gate))
    if (missingRequiredGates.length > 0) {
      errors.push(
        `generationProfile.requiredGates is missing required gate(s) for ${expectedMode}: ${missingRequiredGates.join(', ')}`
      )
    }

    const expectedSourceProofLevel = expectedProfileSemantics.sourceProofLevel
    if (generationProfile.sourceProofLevel !== expectedSourceProofLevel) {
      errors.push(
        `generationProfile.sourceProofLevel must be ${expectedSourceProofLevel} for ${expectedMode}; received ${generationProfile.sourceProofLevel || '(missing)'}`
      )
    }

    if (generationProfile.fallback !== 'block-and-request-managed-mold-or-certified-adapter') {
      errors.push(
        `generationProfile.fallback must be block-and-request-managed-mold-or-certified-adapter; received ${generationProfile.fallback || '(missing)'}`
      )
    }

    const editableSlots = Array.isArray(generationProfile.editableSlots)
      ? generationProfile.editableSlots
      : []
    const slotManifest = Array.isArray(generationProfile.slotManifest)
      ? generationProfile.slotManifest
      : []
    const slotManifestIds = new Set(slotManifest.map((slot) => String(slot?.slotId || '').trim()))
    const missingSlotManifestEntries = editableSlots.filter((slotId) => !slotManifestIds.has(slotId))
    if (editableSlots.length > 0 && missingSlotManifestEntries.length > 0) {
      errors.push(
        `generationProfile.slotManifest must describe every editable slot; missing ${missingSlotManifestEntries.join(', ')}`
      )
    }

    const managedAnalyticsProvenance = buildManagedAnalyticsProvenance({
      pageTypeId: contract.pageTypeId,
      archetypeTemplatePath: contract.archetypeTemplatePath || '',
      selectedDeliveryAssetId: generationProfile.selectedDeliveryAssetId,
    })
    if (managedAnalyticsProvenance) {
      const mirroredFields = [
        'scaffoldRef',
        'carrierRef',
        'runtimeCarrierPath',
        'carrierCertificationRef',
      ]
      for (const field of mirroredFields) {
        if (generationProfile[field] !== managedAnalyticsProvenance[field]) {
          errors.push(
            `generationProfile.${field} must match ${managedAnalyticsProvenance[field] || '(missing)'}; received ${generationProfile[field] || '(missing)'}`
          )
        }
      }

      const requiredRuntimeEvidence = Array.isArray(generationProfile.requiredRuntimeEvidence)
        ? generationProfile.requiredRuntimeEvidence.map((item) => String(item || '').trim()).filter(Boolean)
        : []
      const missingRuntimeEvidence = managedAnalyticsProvenance.requiredRuntimeEvidence.filter(
        (item) => !requiredRuntimeEvidence.includes(item)
      )
      if (missingRuntimeEvidence.length > 0) {
        errors.push(
          `generationProfile.requiredRuntimeEvidence must include ${missingRuntimeEvidence.join(', ')}`
        )
      }
    }
  }

  const productionContract = contract.productionContract
  if (!productionContract || typeof productionContract !== 'object') {
    errors.push(
      'Missing productionContract metadata. Re-run typical-page:start-page or typical-page:write-contract so preflight can prove generation used the managed mold pipeline.'
    )
  } else {
    if (productionContract.schemaVersion !== 'page-production-contract.v1') {
      errors.push(
        `productionContract.schemaVersion must be page-production-contract.v1; received ${productionContract.schemaVersion || '(missing)'}`
      )
    }

    if (productionContract.page !== contract.generatedPagePath) {
      errors.push(
        `productionContract.page must match generatedPagePath ${contract.generatedPagePath}; received ${productionContract.page || '(missing)'}`
      )
    }

    if (productionContract.pageTypeId !== contract.pageTypeId) {
      errors.push(
        `productionContract.pageTypeId must match pageTypeId ${contract.pageTypeId}; received ${productionContract.pageTypeId || '(missing)'}`
      )
    }

    if (productionContract.mode !== expectedMode) {
      errors.push(
        `productionContract.mode must match archetypeMode ${expectedMode}; received ${productionContract.mode || '(missing)'}`
      )
    }

    const profileForComparison = generationProfile && typeof generationProfile === 'object'
      ? generationProfile
      : {}
    const mirroredFields = ['moldId', 'startFrom', 'fallback', 'sourceProofLevel']
    for (const field of mirroredFields) {
      if (productionContract[field] !== profileForComparison[field]) {
        errors.push(
          `productionContract.${field} must mirror generationProfile.${field}; received ${productionContract[field] || '(missing)'} vs ${profileForComparison[field] || '(missing)'}`
        )
      }
    }

    const mirrorArrayFields = ['lockedRegions', 'editableSlots', 'requiredGates']
    for (const field of mirrorArrayFields) {
      const actual = Array.isArray(productionContract[field]) ? productionContract[field] : []
      const expected = Array.isArray(profileForComparison[field]) ? profileForComparison[field] : []
      const missing = expected.filter((item) => !actual.includes(item))
      if (missing.length > 0) {
        errors.push(
          `productionContract.${field} must include every generationProfile.${field} entry; missing ${missing.join(', ')}`
        )
      }
    }

    if (productionContract.policy !== 'generate-from-managed-mold-and-fill-business-slots-only') {
      errors.push(
        `productionContract.policy must be generate-from-managed-mold-and-fill-business-slots-only; received ${productionContract.policy || '(missing)'}`
      )
    }

    const managedAnalyticsProvenance = buildManagedAnalyticsProvenance({
      pageTypeId: contract.pageTypeId,
      archetypeTemplatePath: contract.archetypeTemplatePath || '',
      selectedDeliveryAssetId: profileForComparison.selectedDeliveryAssetId,
    })
    if (managedAnalyticsProvenance) {
      const mirroredProvenanceFields = [
        'scaffoldRef',
        'carrierRef',
        'runtimeCarrierPath',
        'carrierCertificationRef',
      ]
      for (const field of mirroredProvenanceFields) {
        if (productionContract[field] !== profileForComparison[field]) {
          errors.push(
            `productionContract.${field} must mirror generationProfile.${field}; received ${productionContract[field] || '(missing)'} vs ${profileForComparison[field] || '(missing)'}`
          )
        }
      }

      const generationEvidence = Array.isArray(profileForComparison.requiredRuntimeEvidence)
        ? profileForComparison.requiredRuntimeEvidence.map((item) => String(item || '').trim()).filter(Boolean)
        : []
      const productionEvidence = Array.isArray(productionContract.requiredRuntimeEvidence)
        ? productionContract.requiredRuntimeEvidence.map((item) => String(item || '').trim()).filter(Boolean)
        : []
      const missingEvidence = generationEvidence.filter((item) => !productionEvidence.includes(item))
      if (missingEvidence.length > 0) {
        errors.push(
          `productionContract.requiredRuntimeEvidence must include every generationProfile.requiredRuntimeEvidence entry; missing ${missingEvidence.join(', ')}`
        )
      }
    }
  }

  const i18nBaseline = contract.i18nBaseline
  if (!i18nBaseline || typeof i18nBaseline !== 'object') {
    warnings.push(
      'Missing i18nBaseline metadata. Re-write the contract with the current writer so generated pages stay bound to the managed-page i18n baseline.'
    )
  } else {
    const declaredLocales = Array.isArray(i18nBaseline.supportedLocales)
      ? i18nBaseline.supportedLocales
      : []
    const missingLocales = MANAGED_PAGE_I18N_SUPPORTED_LOCALES.filter(
      (locale) => !declaredLocales.includes(locale)
    )

    if (missingLocales.length > 0) {
      warnings.push(
        `i18nBaseline.supportedLocales is missing: ${missingLocales.join(', ')}`
      )
    }

    const formatterPolicy = Array.isArray(i18nBaseline.formatterPolicy)
      ? i18nBaseline.formatterPolicy
      : []
    const missingFormatterPolicies = ['date', 'number', 'currency', 'percent', 'collation'].filter(
      (item) => !formatterPolicy.includes(item)
    )

    if (missingFormatterPolicies.length > 0) {
      warnings.push(
        `i18nBaseline.formatterPolicy is missing: ${missingFormatterPolicies.join(', ')}`
      )
    }

    if (i18nBaseline.directionStrategy !== 'rtl-aware-logical-properties') {
      warnings.push(
        `i18nBaseline.directionStrategy should be rtl-aware-logical-properties, received ${i18nBaseline.directionStrategy || '(missing)'}`
      )
    }

    if (i18nBaseline.strategyDeclaration !== 'required-before-visible-copy') {
      warnings.push(
        `i18nBaseline.strategyDeclaration should be required-before-visible-copy, received ${i18nBaseline.strategyDeclaration || '(missing)'}`
      )
    }
  }

  const semanticContract = getManagedPageSemanticContract(contract)
  const splitPaneContract = getManagedPageSplitPaneContract(contract)
  const topologyId = getManagedPageTopologyId(contract)
  if (!contract.semanticContract || typeof contract.semanticContract !== 'object') {
    warnings.push(
      'Missing semanticContract metadata. Re-write the contract with the current writer so query-filter role, list-shell drift policy, spacing ownership, and area-chart fill rules stay machine-checkable.'
    )
  }

  const semanticContractSource =
    contract.semanticContract && typeof contract.semanticContract === 'object'
      ? contract.semanticContract
      : {}
  const queryFieldFactsRequired = queryFilterSemanticFactsRequired({
    semanticContract,
    requiredRegions: getRequiredRegionsForPageType(contract.pageTypeId),
  })
  if (
    queryFieldFactsRequired &&
    QUERY_FILTER_SEMANTIC_KEYS.some((key) => typeof semanticContractSource[key] !== 'string')
  ) {
    warnings.push(
      'Missing semanticContract query-field render metadata. Re-write the contract with the current writer so queryFieldRenderProfile, keyword/text roles, and filterSurfaceBaseline stay machine-checkable.'
    )
  }

  if (!RULES_ONLY_QUERY_FILTER_REGION_ROLES.includes(semanticContract.queryFilterRegionRole)) {
    errors.push(
      `semanticContract.queryFilterRegionRole must be one of: ${RULES_ONLY_QUERY_FILTER_REGION_ROLES.join(', ')}; received ${semanticContract.queryFilterRegionRole || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_DIMENSION_SWITCH_CONTROLS.includes(semanticContract.dimensionSwitchControl)
  ) {
    errors.push(
      `semanticContract.dimensionSwitchControl must be one of: ${RULES_ONLY_DIMENSION_SWITCH_CONTROLS.join(', ')}; received ${semanticContract.dimensionSwitchControl || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_LIST_SHELL_COMPOSITIONS.includes(semanticContract.listShellComposition)
  ) {
    errors.push(
      `semanticContract.listShellComposition must be one of: ${RULES_ONLY_LIST_SHELL_COMPOSITIONS.join(', ')}; received ${semanticContract.listShellComposition || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_SPACING_OWNERSHIP_POLICIES.includes(semanticContract.spacingOwnership)
  ) {
    errors.push(
      `semanticContract.spacingOwnership must be one of: ${RULES_ONLY_SPACING_OWNERSHIP_POLICIES.join(', ')}; received ${semanticContract.spacingOwnership || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_AREA_CHART_FILL_POLICIES.includes(semanticContract.areaChartFill)
  ) {
    errors.push(
      `semanticContract.areaChartFill must be one of: ${RULES_ONLY_AREA_CHART_FILL_POLICIES.join(', ')}; received ${semanticContract.areaChartFill || '(missing)'}`
    )
  }

  errors.push(...buildQueryFilterSemanticValueSetErrors(semanticContract))
  errors.push(
    ...buildQueryFilterSemanticProfileErrors({
      semanticContract,
      profile: getQueryFilterSemanticValidationProfile({
        pageTypeId: contract.pageTypeId,
        queryFilterRegionRole: semanticContract.queryFilterRegionRole,
        requiredRegions: getRequiredRegionsForPageType(contract.pageTypeId),
      }),
    })
  )

  if (
    isBodySectionGovernedPageType(contract.pageTypeId) &&
    (
      !contract.semanticContract ||
      typeof contract.semanticContract !== 'object' ||
      !contract.semanticContract.bodySectionContract ||
      typeof contract.semanticContract.bodySectionContract !== 'object'
    )
  ) {
    warnings.push(
      'Missing semanticContract.bodySectionContract metadata. Re-write the contract with the current writer so form/detail body section ownership, container policy, and embedded widget scope stay machine-checkable.'
    )
  }

  if (
    !RULES_ONLY_BODY_SECTION_PRIMARY_EXPRESSIONS.includes(
      semanticContract.bodySectionContract.primaryExpression
    )
  ) {
    errors.push(
      `semanticContract.bodySectionContract.primaryExpression must be one of: ${RULES_ONLY_BODY_SECTION_PRIMARY_EXPRESSIONS.join(', ')}; received ${semanticContract.bodySectionContract.primaryExpression || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_BODY_SECTION_COMPOSITIONS.includes(
      semanticContract.bodySectionContract.sectionComposition
    )
  ) {
    errors.push(
      `semanticContract.bodySectionContract.sectionComposition must be one of: ${RULES_ONLY_BODY_SECTION_COMPOSITIONS.join(', ')}; received ${semanticContract.bodySectionContract.sectionComposition || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_BODY_SECTION_SPACING_OWNERS.includes(
      semanticContract.bodySectionContract.sectionSpacingOwnership
    )
  ) {
    errors.push(
      `semanticContract.bodySectionContract.sectionSpacingOwnership must be one of: ${RULES_ONLY_BODY_SECTION_SPACING_OWNERS.join(', ')}; received ${semanticContract.bodySectionContract.sectionSpacingOwnership || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_BODY_SECTION_CONTAINER_POLICIES.includes(
      semanticContract.bodySectionContract.sectionContainerPolicy
    )
  ) {
    errors.push(
      `semanticContract.bodySectionContract.sectionContainerPolicy must be one of: ${RULES_ONLY_BODY_SECTION_CONTAINER_POLICIES.join(', ')}; received ${semanticContract.bodySectionContract.sectionContainerPolicy || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_BODY_SECTION_EMBEDDED_WIDGET_POLICIES.includes(
      semanticContract.bodySectionContract.embeddedWidgetPolicy
    )
  ) {
    errors.push(
      `semanticContract.bodySectionContract.embeddedWidgetPolicy must be one of: ${RULES_ONLY_BODY_SECTION_EMBEDDED_WIDGET_POLICIES.join(', ')}; received ${semanticContract.bodySectionContract.embeddedWidgetPolicy || '(missing)'}`
    )
  }

  errors.push(
    ...validateManagedBodySectionContractConsistency({
      contract,
      semanticContract,
      targetRoot,
    })
  )

  if (!RULES_ONLY_CONTROL_SCOPES.includes(semanticContract.controlScope)) {
    errors.push(
      `semanticContract.controlScope must be one of: ${RULES_ONLY_CONTROL_SCOPES.join(', ')}; received ${semanticContract.controlScope || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_CONTROL_STRIP_PLACEMENTS.includes(semanticContract.controlStripPlacement)
  ) {
    errors.push(
      `semanticContract.controlStripPlacement must be one of: ${RULES_ONLY_CONTROL_STRIP_PLACEMENTS.join(', ')}; received ${semanticContract.controlStripPlacement || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_CONTROL_STRIP_VISUAL_TREATMENTS.includes(
      semanticContract.controlStripVisualTreatment
    )
  ) {
    errors.push(
      `semanticContract.controlStripVisualTreatment must be one of: ${RULES_ONLY_CONTROL_STRIP_VISUAL_TREATMENTS.join(', ')}; received ${semanticContract.controlStripVisualTreatment || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_DETAIL_QUERY_FILTER_POLICIES.includes(
      semanticContract.detailQueryFilterPolicy
    )
  ) {
    errors.push(
      `semanticContract.detailQueryFilterPolicy must be one of: ${RULES_ONLY_DETAIL_QUERY_FILTER_POLICIES.join(', ')}; received ${semanticContract.detailQueryFilterPolicy || '(missing)'}`
    )
  }

  if (
    !RULES_ONLY_MIXED_SCOPE_CONTROL_POLICIES.includes(semanticContract.mixedScopeControls)
  ) {
    errors.push(
      `semanticContract.mixedScopeControls must be one of: ${RULES_ONLY_MIXED_SCOPE_CONTROL_POLICIES.join(', ')}; received ${semanticContract.mixedScopeControls || '(missing)'}`
    )
  }

  if (contract.pageTypeId === 'data-visualization') {
    if (semanticContract.queryFilterRegionRole !== 'dashboard-control-strip') {
      warnings.push(
        `data-visualization defaults semanticContract.queryFilterRegionRole to dashboard-control-strip. Override only when the page intentionally promotes a real detail-table QueryFilter into the managed contract.`
      )
    }

    if (semanticContract.dimensionSwitchControl !== 'segmented-radio-tabs') {
      warnings.push(
        `data-visualization defaults semanticContract.dimensionSwitchControl to segmented-radio-tabs so 日/周/月/年 and similar view switches stay off QueryFilter semantics.`
      )
    }

    if (semanticContract.listShellComposition !== 'forbid-table-list-scaffold') {
      warnings.push(
        `data-visualization should keep semanticContract.listShellComposition=forbid-table-list-scaffold so dashboards do not regress into ProListPage / TablePageFrame generation paths.`
      )
    }

    if (semanticContract.areaChartFill !== 'same-series-color-fill-0.2') {
      warnings.push(
        `data-visualization should keep semanticContract.areaChartFill=same-series-color-fill-0.2 so single-series area charts do not drift into per-metric fillOpacity variants.`
      )
    }

    if (semanticContract.queryFilterRegionRole === 'dashboard-control-strip') {
      if (semanticContract.controlScope !== 'page-global') {
        errors.push(
          'data-visualization dashboard-control-strip contracts must keep semanticContract.controlScope=page-global so the control row governs metrics, charts, and detail-table together.'
        )
      }

      if (
        semanticContract.controlStripPlacement !==
        'top-of-white-body-before-stat-section'
      ) {
        errors.push(
          'data-visualization dashboard-control-strip contracts must keep semanticContract.controlStripPlacement=top-of-white-body-before-stat-section so page-global controls sit above the managed analysis body.'
        )
      }

      if (semanticContract.controlStripVisualTreatment !== 'plain-row-no-panel') {
        errors.push(
          'data-visualization dashboard-control-strip contracts must keep semanticContract.controlStripVisualTreatment=plain-row-no-panel so the top control row does not regress into a grey query panel.'
        )
      }

      if (
        semanticContract.detailQueryFilterPolicy !==
        'separate-detail-query-filter-near-detail-table'
      ) {
        errors.push(
          'data-visualization dashboard-control-strip contracts must keep semanticContract.detailQueryFilterPolicy=separate-detail-query-filter-near-detail-table so real detail filters stay adjacent to the table.'
        )
      }
    }

    if (semanticContract.queryFilterRegionRole === 'table-query-filter') {
      if (semanticContract.controlScope !== 'detail-table-only') {
        errors.push(
          'data-visualization table-query-filter contracts must keep semanticContract.controlScope=detail-table-only so the managed query-filter region is not mistaken for a page-global dashboard strip.'
        )
      }

      if (semanticContract.controlStripPlacement !== 'detail-section-before-table') {
        errors.push(
          'data-visualization table-query-filter contracts must keep semanticContract.controlStripPlacement=detail-section-before-table so the managed filter region stays adjacent to the detail table.'
        )
      }

      if (semanticContract.controlStripVisualTreatment !== 'query-filter-form') {
        errors.push(
          'data-visualization table-query-filter contracts must keep semanticContract.controlStripVisualTreatment=query-filter-form so the managed region remains a real QueryFilter-compatible filter bar.'
        )
      }

      if (
        semanticContract.detailQueryFilterPolicy !==
        'managed-region-is-detail-query-filter'
      ) {
        errors.push(
          'data-visualization table-query-filter contracts must keep semanticContract.detailQueryFilterPolicy=managed-region-is-detail-query-filter when the managed region itself is the detail QueryFilter.'
        )
      }
    }

    if (semanticContract.mixedScopeControls !== 'forbid-shared-control-row') {
      errors.push(
        'data-visualization contracts must keep semanticContract.mixedScopeControls=forbid-shared-control-row so page-global controls and detail filters do not merge into one ambiguous bar.'
      )
    }
  }

  if (topologyId === 'non-typical-overlay') {
    if (!String(contract.layoutStrategy || '').trim()) {
      errors.push('Missing layoutStrategy. non-typical-overlay pages must declare the selected layout strategy before scaffolding.')
    }

    if (!String(contract.layoutArchetype || '').trim()) {
      errors.push('Missing layoutArchetype. non-typical-overlay pages must declare the selected layout archetype before scaffolding.')
    }

    if (!Array.isArray(contract.nonTypicalScope) || contract.nonTypicalScope.length === 0) {
      errors.push('Missing nonTypicalScope. non-typical-overlay pages must declare which一级组织 is free to recompose.')
    }

    if (!Array.isArray(contract.strategyEvidence) || contract.strategyEvidence.length === 0) {
      errors.push('Missing strategyEvidence. non-typical-overlay pages must declare how layout strategy/archetype will be proven in contract or source markers.')
    }

    if (!Array.isArray(contract.compositionGuardrails) || contract.compositionGuardrails.length === 0) {
      warnings.push('compositionGuardrails is empty. Re-write the contract so non-typical scaffolds keep carrier and component override boundaries machine-readable.')
    }

    if (!Array.isArray(contract.mandatoryComponents) || contract.mandatoryComponents.length === 0) {
      warnings.push('mandatoryComponents is empty. Re-write the contract so non-typical scaffolds keep required HiUI semantic components visible from the start.')
    }
  }

  const splitPaneRequired = contract.pageTypeId === 'tree-split' || splitPaneContract.enabled
  if (splitPaneRequired) {
    if (!contract.splitPaneContract || typeof contract.splitPaneContract !== 'object') {
      errors.push(
        'Missing splitPaneContract metadata. Split master-detail pages must declare left/right pane selectors and scroll ownership explicitly.'
      )
    }

    if (!splitPaneContract.leftPaneSelector) {
      errors.push(
        'splitPaneContract.leftPaneSelector is required when split master-detail behavior is declared.'
      )
    }

    if (!splitPaneContract.rightPaneSelector) {
      errors.push(
        'splitPaneContract.rightPaneSelector is required when split master-detail behavior is declared.'
      )
    }

    if (!splitPaneContract.tableRegionSelector) {
      errors.push(
        'splitPaneContract.tableRegionSelector is required when split master-detail behavior is declared.'
      )
    }

    if (!MANAGED_PAGE_SPLIT_PANE_SCROLL_MODES.includes(splitPaneContract.leftPaneScroll)) {
      errors.push(
        `splitPaneContract.leftPaneScroll must be one of: ${MANAGED_PAGE_SPLIT_PANE_SCROLL_MODES.join(', ')}; received ${splitPaneContract.leftPaneScroll || '(missing)'}`
      )
    }

    if (!MANAGED_PAGE_SPLIT_PANE_SCROLL_MODES.includes(splitPaneContract.rightPaneScroll)) {
      errors.push(
        `splitPaneContract.rightPaneScroll must be one of: ${MANAGED_PAGE_SPLIT_PANE_SCROLL_MODES.join(', ')}; received ${splitPaneContract.rightPaneScroll || '(missing)'}`
      )
    }

    if (
      splitPaneContract.leftPaneSelector &&
      splitPaneContract.rightPaneSelector &&
      splitPaneContract.leftPaneSelector === splitPaneContract.rightPaneSelector
    ) {
      errors.push('splitPaneContract.leftPaneSelector and rightPaneSelector must target different panes.')
    }

    if (
      contract.pageTypeId === 'tree-split' &&
      (splitPaneContract.leftPaneScroll !== 'independent-pane-scroll' ||
        splitPaneContract.rightPaneScroll !== 'independent-pane-scroll')
    ) {
      errors.push(
        'tree-split pages must keep splitPaneContract.leftPaneScroll and rightPaneScroll as independent-pane-scroll.'
      )
    }
  }

  const runtimeSmokeRequirement = getManagedPageRuntimeSmokeRequirement(contract)
  const workflow = contract.workflow
  if (!workflow || typeof workflow !== 'object') {
    warnings.push(
      'Missing workflow metadata. Re-write the contract with the current writer so CI can distinguish started pages from finalized delivery.'
    )
  } else {
    const allowedStatuses = new Set(MANAGED_PAGE_WORKFLOW_STATUSES)
    if (!allowedStatuses.has(String(workflow.status || ''))) {
      warnings.push(
        `workflow.status should be one of: ${[...allowedStatuses].join(', ')}; received ${workflow.status || '(missing)'}`
      )
    }

    if (
      workflow.runtimeSmokeStatus &&
      !MANAGED_PAGE_RUNTIME_SMOKE_STATUSES.includes(String(workflow.runtimeSmokeStatus || ''))
    ) {
      warnings.push(
        `workflow.runtimeSmokeStatus should be one of: ${MANAGED_PAGE_RUNTIME_SMOKE_STATUSES.join(', ')}; received ${workflow.runtimeSmokeStatus || '(missing)'}`
      )
    }

    if (workflow.status === 'preflight-pass' && workflow.preflightStatus !== 'pass') {
      warnings.push(
        `workflow.preflightStatus should be pass when workflow.status is preflight-pass; received ${workflow.preflightStatus || '(missing)'}`
      )
    }

    if (workflow.preflightStatus === 'pass') {
      if (!workflow.preflightStage) {
        warnings.push(
          'workflow.preflightStage is missing. Re-run typical-page:preflight so collaborators can distinguish scaffold-baseline from delivery-ready implementation.'
        )
      }
      if (typeof workflow.readyForImplementation !== 'boolean') {
        warnings.push(
          'workflow.readyForImplementation is missing. Re-run typical-page:preflight so workflow metadata records whether implementation may continue.'
        )
      }
      if (typeof workflow.readyForDelivery !== 'boolean') {
        warnings.push(
          'workflow.readyForDelivery is missing. Re-run typical-page:preflight so delivery summaries know whether this page is already delivery-ready.'
        )
      }
      if (!Array.isArray(workflow.deferredChecks)) {
        warnings.push(
          'workflow.deferredChecks is missing. Re-run typical-page:preflight so collaborators can see which checks remain deferred after a passing preflight.'
        )
      }
    }

    if (workflow.status === 'finalized') {
      if (workflow.deliveryStatus !== 'finalized') {
        warnings.push(
          `workflow.deliveryStatus should be finalized when workflow.status is finalized; received ${workflow.deliveryStatus || '(missing)'}`
        )
      }
      if (workflow.sourceGateStatus !== 'pass') {
        warnings.push(
          `workflow.sourceGateStatus should be pass when workflow.status is finalized; received ${workflow.sourceGateStatus || '(missing)'}`
        )
      }
      if (workflow.doctorStatus !== 'pass') {
        warnings.push(
          `workflow.doctorStatus should be pass when workflow.status is finalized; received ${workflow.doctorStatus || '(missing)'}`
        )
      }
      if (!workflow.finalizedAt) {
        warnings.push(
          'workflow.finalizedAt is missing. Re-run typical-page:finalize-page so CI can verify the delivery stamp.'
        )
      }
      if (!workflow.sourceSnapshotHash) {
        warnings.push(
          'workflow.sourceSnapshotHash is missing. Re-run typical-page:finalize-page so CI can detect stale contracts after source changes.'
        )
      }
      if (runtimeSmokeRequirement.required && workflow.runtimeSmokeStatus !== 'pass') {
        warnings.push(
          `workflow.runtimeSmokeStatus should be pass when finalized delivery requires runtime smoke. Re-run typical-page:runtime-smoke for the current source snapshot before treating this contract as complete. Requirement reason: ${runtimeSmokeRequirement.reason}`
        )
      }
      if (runtimeSmokeRequirement.required && !workflow.runtimeSmokeSnapshotHash) {
        warnings.push(
          'workflow.runtimeSmokeSnapshotHash is missing on a finalized contract that requires runtime smoke. Re-run typical-page:runtime-smoke so the browser-level result is bound to the same source snapshot.'
        )
      }
      if (
        runtimeSmokeRequirement.required &&
        workflow.runtimeSmokeSnapshotHash &&
        workflow.sourceSnapshotHash &&
        workflow.runtimeSmokeSnapshotHash !== workflow.sourceSnapshotHash
      ) {
        warnings.push(
          `workflow.runtimeSmokeSnapshotHash must match workflow.sourceSnapshotHash on finalized contracts that require runtime smoke; received ${workflow.runtimeSmokeSnapshotHash} vs ${workflow.sourceSnapshotHash}`
        )
      }
      if (runtimeSmokeRequirement.required && !workflow.runtimeSmokeReportPath) {
        warnings.push(
          'workflow.runtimeSmokeReportPath is missing on a finalized contract that requires runtime smoke. Re-run typical-page:runtime-smoke so collaborators can inspect the browser-level evidence.'
        )
      }
    }

    if (workflow.status === 'stale') {
      if (!workflow.sourceSnapshotHash) {
        warnings.push(
          'workflow.sourceSnapshotHash is missing on a stale contract. Re-run typical-page:finalize-page after repairing the page so the latest source snapshot becomes machine-checkable.'
        )
      }
      if (!workflow.staleReason) {
        warnings.push(
          'workflow.staleReason is missing. Keep one explicit reason so collaborators know why this contract must be re-finalized.'
        )
      }
    }
  }

  if (!Array.isArray(contract.regionMapping) || contract.regionMapping.length === 0) {
    errors.push('Missing regionMapping entries')
  } else {
    const seen = new Set()
    const normalizedRegions = new Set()
    const genericRegions = []

    for (const item of contract.regionMapping) {
      if (!item?.region || !item?.target) {
        errors.push('Each regionMapping entry must include region and target')
        continue
      }

      const normalizedRegion = normalizeRegionName(item.region)
      if (seen.has(normalizedRegion)) {
        errors.push(`Duplicate regionMapping region: ${item.region}`)
      }
      seen.add(normalizedRegion)
      normalizedRegions.add(normalizedRegion)

      if (GENERIC_REGION_NAMES.has(normalizedRegion)) {
        genericRegions.push(item.region)
      }
  }

  const isManagedAnalyticsPage =
    String(contract.pageTypeId || '').trim() === 'data-visualization' ||
    String(generationProfile?.strategy || '').trim() === 'managed-analytics'
  if (isManagedAnalyticsPage) {
    const chartUsageContract = contract.chartUsageContract
    const visualBaselinePlan = contract.visualBaselinePlan
    const visualizationRolePlan = contract.visualizationRolePlan
    const layoutStrategy = String(contract.layoutStrategy || '').trim()
    const layoutArchetype = String(contract.layoutArchetype || '').trim()

    if (!layoutStrategy) {
      errors.push('Missing layoutStrategy. managed-analytics pages must declare the analytics reading strategy before scaffolding.')
    } else if (layoutStrategy === 'typical-page') {
      errors.push('Invalid layoutStrategy: typical-page. managed-analytics pages must use an analytics layout strategy instead of falling back to the generic typical-page shell.')
    }

    if (!layoutArchetype) {
      errors.push('Missing layoutArchetype. managed-analytics pages must declare the selected analytics layout archetype before scaffolding.')
    } else if (!MANAGED_ANALYTICS_LAYOUT_ARCHETYPES.includes(layoutArchetype)) {
      errors.push(
        `Invalid layoutArchetype for managed-analytics: ${layoutArchetype}. Expected one of: ${MANAGED_ANALYTICS_LAYOUT_ARCHETYPES.join(', ')}`
      )
    }

    if (!chartUsageContract || typeof chartUsageContract !== 'object') {
      errors.push(
        'Missing chartUsageContract metadata. managed-analytics pages must persist a chart usage contract before preflight so chart intent, reading path, and chart-type choices stay machine-checkable.'
      )
    } else {
      if (chartUsageContract.schemaVersion !== 'chart-usage-contract.v1') {
        errors.push(
          `chartUsageContract.schemaVersion must be chart-usage-contract.v1; received ${chartUsageContract.schemaVersion || '(missing)'}`
        )
      }

      if (!Array.isArray(chartUsageContract.chartIntentItems)) {
        errors.push('chartUsageContract.chartIntentItems must be an array for managed-analytics pages.')
      } else if (String(chartUsageContract.contractStatus || '').trim() === 'ready') {
        chartUsageContract.chartIntentItems.forEach((item, index) => {
          const prefix = `chartUsageContract.chartIntentItems[${index}]`
          for (const field of ['chartId', 'title', 'businessQuestion', 'informationTask', 'chartType', 'readingLane', 'visualRole', 'regionPriority', 'preferredRegionSize']) {
            const value = item?.[field]
            if (!String(value || '').trim() || hasPlaceholderChartIntentValue(value)) {
              errors.push(`${prefix}.${field} must be a concrete non-placeholder value when contractStatus=ready.`)
            }
          }

          if (typeof item?.canOwnPrimaryRegion !== 'boolean') {
            errors.push(`${prefix}.canOwnPrimaryRegion must be boolean when contractStatus=ready.`)
          }

          if (!Array.isArray(item?.forbiddenPlacements)) {
            errors.push(`${prefix}.forbiddenPlacements must be an array when contractStatus=ready.`)
          }
        })
      }
    }

    if (!visualBaselinePlan || typeof visualBaselinePlan !== 'object') {
      errors.push('Missing visualBaselinePlan. managed-analytics pages must persist generation-time visual baseline facts.')
    }

    if (!visualizationRolePlan || typeof visualizationRolePlan !== 'object') {
      errors.push('Missing visualizationRolePlan. managed-analytics pages must persist chart primary/secondary role facts.')
    } else {
      const chartSectionLayoutPlan = visualizationRolePlan.chartSectionLayoutPlan
      const controlStripPlan = visualizationRolePlan.controlStripPlan

      if (!chartSectionLayoutPlan || typeof chartSectionLayoutPlan !== 'object') {
        errors.push(
          'Missing visualizationRolePlan.chartSectionLayoutPlan. managed-analytics pages must persist the chart-section base grid mode before scaffolding.'
        )
      } else {
        const baseGridMode = String(chartSectionLayoutPlan.baseGridMode || '').trim()
        const allowedBaseGridModes = Array.isArray(chartSectionLayoutPlan.allowedBaseGridModes)
          ? chartSectionLayoutPlan.allowedBaseGridModes
              .map((item) => String(item || '').trim())
              .filter(Boolean)
          : []
        const excludedContentTypes = Array.isArray(chartSectionLayoutPlan.excludedContentTypes)
          ? chartSectionLayoutPlan.excludedContentTypes
              .map((item) => String(item || '').trim())
              .filter(Boolean)
          : []
        const requiredExcludedContentTypes = [
          'metric-card',
          'metric-sparkline',
          'metric-mini-chart',
        ]

        if (!baseGridMode) {
          errors.push(
            'visualizationRolePlan.chartSectionLayoutPlan.baseGridMode is required for managed-analytics pages.'
          )
        } else if (
          allowedBaseGridModes.length > 0 &&
          !allowedBaseGridModes.includes(baseGridMode)
        ) {
          errors.push(
            `visualizationRolePlan.chartSectionLayoutPlan.baseGridMode must be one of ${allowedBaseGridModes.join(', ')}; received ${baseGridMode}.`
          )
        }

        if (
          String(chartSectionLayoutPlan.consistencyScope || '').trim() !==
          'single-mode-per-chart-section'
        ) {
          errors.push(
            'visualizationRolePlan.chartSectionLayoutPlan.consistencyScope must be single-mode-per-chart-section.'
          )
        }

        if (chartSectionLayoutPlan.fullSpanNeutral !== true) {
          errors.push(
            'visualizationRolePlan.chartSectionLayoutPlan.fullSpanNeutral must stay true so span 12 is treated as a neutral full-span row instead of a mode switch.'
          )
        }

        if (
          String(chartSectionLayoutPlan.fullSpanPolicy || '').trim() !==
          '12-is-neutral-span'
        ) {
          errors.push(
            'visualizationRolePlan.chartSectionLayoutPlan.fullSpanPolicy must be 12-is-neutral-span.'
          )
        }

        for (const excludedType of requiredExcludedContentTypes) {
          if (!excludedContentTypes.includes(excludedType)) {
            errors.push(
              `visualizationRolePlan.chartSectionLayoutPlan.excludedContentTypes must explicitly exclude ${excludedType} so stat-section KPI cards and their mini visuals do not participate in chart-section grid checks.`
            )
          }
        }
      }

      if (!controlStripPlan || typeof controlStripPlan !== 'object') {
        errors.push(
          'Missing visualizationRolePlan.controlStripPlan. managed-analytics pages must persist page-global control-strip semantics before scaffolding.'
        )
      } else {
        const defaultRole = String(controlStripPlan.defaultRole || '').trim()
        const defaultControlScope = String(controlStripPlan.defaultControlScope || '').trim()
        const defaultPlacement = String(controlStripPlan.defaultPlacement || '').trim()
        const defaultVisualTreatment = String(
          controlStripPlan.defaultVisualTreatment || ''
        ).trim()
        const detailQueryFilterPolicy = String(
          controlStripPlan.detailQueryFilterPolicy || ''
        ).trim()
        const mixedScopeControls = String(controlStripPlan.mixedScopeControls || '').trim()
        const allowedPlacementsByRole =
          controlStripPlan.allowedPlacementsByRole &&
          typeof controlStripPlan.allowedPlacementsByRole === 'object'
            ? controlStripPlan.allowedPlacementsByRole
            : {}
        const allowedVisualTreatmentsByRole =
          controlStripPlan.allowedVisualTreatmentsByRole &&
          typeof controlStripPlan.allowedVisualTreatmentsByRole === 'object'
            ? controlStripPlan.allowedVisualTreatmentsByRole
            : {}

        if (String(controlStripPlan.schemaVersion || '').trim() !== 'dashboard-control-strip-plan.v1') {
          errors.push(
            `visualizationRolePlan.controlStripPlan.schemaVersion must be dashboard-control-strip-plan.v1; received ${controlStripPlan.schemaVersion || '(missing)'}`
          )
        }

        if (defaultRole !== 'dashboard-control-strip') {
          errors.push(
            'visualizationRolePlan.controlStripPlan.defaultRole must stay dashboard-control-strip for managed-analytics pages.'
          )
        }

        if (defaultControlScope !== 'page-global') {
          errors.push(
            'visualizationRolePlan.controlStripPlan.defaultControlScope must stay page-global so dashboard view switches remain page-wide.'
          )
        }

        if (defaultPlacement !== 'top-of-white-body-before-stat-section') {
          errors.push(
            'visualizationRolePlan.controlStripPlan.defaultPlacement must stay top-of-white-body-before-stat-section.'
          )
        }

        if (defaultVisualTreatment !== 'plain-row-no-panel') {
          errors.push(
            'visualizationRolePlan.controlStripPlan.defaultVisualTreatment must stay plain-row-no-panel.'
          )
        }

        if (
          detailQueryFilterPolicy !==
          'separate-detail-query-filter-near-detail-table'
        ) {
          errors.push(
            'visualizationRolePlan.controlStripPlan.detailQueryFilterPolicy must stay separate-detail-query-filter-near-detail-table.'
          )
        }

        if (mixedScopeControls !== 'forbid-shared-control-row') {
          errors.push(
            'visualizationRolePlan.controlStripPlan.mixedScopeControls must stay forbid-shared-control-row.'
          )
        }

        if (
          !Array.isArray(allowedPlacementsByRole['dashboard-control-strip']) ||
          !allowedPlacementsByRole['dashboard-control-strip'].includes(
            'top-of-white-body-before-stat-section'
          )
        ) {
          errors.push(
            'visualizationRolePlan.controlStripPlan.allowedPlacementsByRole.dashboard-control-strip must include top-of-white-body-before-stat-section.'
          )
        }

        if (
          !Array.isArray(allowedVisualTreatmentsByRole['dashboard-control-strip']) ||
          !allowedVisualTreatmentsByRole['dashboard-control-strip'].includes(
            'plain-row-no-panel'
          )
        ) {
          errors.push(
            'visualizationRolePlan.controlStripPlan.allowedVisualTreatmentsByRole.dashboard-control-strip must include plain-row-no-panel.'
          )
        }
      }
    }
  }

  const requiredRegions = getRequiredRegions(contract, archetypeDefinition)
    const missingRequiredRegions = requiredRegions.filter(
      (region) => !normalizedRegions.has(normalizeRegionName(region))
    )

    if (missingRequiredRegions.length > 0) {
      errors.push(
        `Missing required regionMapping entries for ${contract.pageTypeId}: ${missingRequiredRegions.join(', ')}`
      )
    }

    if (genericRegions.length > 0) {
      warnings.push(
        `Generic region names detected (${genericRegions.join(', ')}). rules-only contracts should map host structure with page-type-specific regions.`
      )
    }
  }

  const requiredOwnershipRoles = getRequiredOwnershipRoles(contract, archetypeDefinition)
  const hasOwnershipRequirements = requiredOwnershipRoles.length > 0
  const expectedScrollStrategy = getDefaultScrollStrategyForPageType(contract.pageTypeId)

  if (!contract.scrollStrategy) {
    errors.push(
      `Missing scrollStrategy. Expected ${expectedScrollStrategy || `one of: ${RULES_ONLY_SCROLL_STRATEGIES.join(', ')}`}`
    )
  } else if (!RULES_ONLY_SCROLL_STRATEGIES.includes(contract.scrollStrategy)) {
    errors.push(
      `Invalid scrollStrategy: ${contract.scrollStrategy}. Expected one of: ${RULES_ONLY_SCROLL_STRATEGIES.join(', ')}`
    )
  } else if (expectedScrollStrategy && contract.scrollStrategy !== expectedScrollStrategy) {
    errors.push(
      `scrollStrategy must be ${expectedScrollStrategy} for ${contract.pageTypeId}, received ${contract.scrollStrategy}`
    )
  }

  if (hasOwnershipRequirements) {
    if (!contract.ownershipMode) {
      errors.push(
        `Missing ownershipMode. Expected one of: ${RULES_ONLY_OWNERSHIP_MODES.join(', ')}`
      )
    } else if (!RULES_ONLY_OWNERSHIP_MODES.includes(contract.ownershipMode)) {
      errors.push(
        `Invalid ownershipMode: ${contract.ownershipMode}. Expected one of: ${RULES_ONLY_OWNERSHIP_MODES.join(', ')}`
      )
    }

    if (!Array.isArray(contract.ownershipMapping) || contract.ownershipMapping.length === 0) {
      errors.push(
        `Missing ownershipMapping entries. Required roles for ${contract.pageTypeId}: ${requiredOwnershipRoles.join(', ')}`
      )
    } else {
      const seenOwnershipRoles = new Set()
      const normalizedOwnershipRoles = new Set()

      for (const item of contract.ownershipMapping) {
        if (!item?.role || !item?.target) {
          errors.push('Each ownershipMapping entry must include role and target')
          continue
        }

        const normalizedRole = normalizeOwnershipRole(item.role)
        if (seenOwnershipRoles.has(normalizedRole)) {
          errors.push(`Duplicate ownershipMapping role: ${item.role}`)
        }
        seenOwnershipRoles.add(normalizedRole)
        normalizedOwnershipRoles.add(normalizedRole)

        if (!Object.prototype.hasOwnProperty.call(RULES_ONLY_OWNERSHIP_ROLE_DESCRIPTIONS, normalizedRole)) {
          warnings.push(
            `Unknown ownership role detected (${item.role}). Prefer the registered roles: ${Object.keys(
              RULES_ONLY_OWNERSHIP_ROLE_DESCRIPTIONS
            ).join(', ')}`
          )
        }
      }

      const missingRequiredOwnershipRoles = requiredOwnershipRoles.filter(
        (role) => !normalizedOwnershipRoles.has(normalizeOwnershipRole(role))
      )

      if (missingRequiredOwnershipRoles.length > 0) {
        errors.push(
          `Missing required ownershipMapping entries for ${contract.pageTypeId}: ${missingRequiredOwnershipRoles.join(', ')}`
        )
      }
    }
  }

  const expectedExamplePath = pageType.assetExamplePath ?? pageType.examplePath ?? ''
  if (contract.examplePath !== expectedExamplePath) {
    errors.push(
      `examplePath must match manifest for ${pageType.id}: expected ${expectedExamplePath}, received ${contract.examplePath || '(missing)'}`
    )
  }

  const expectedBaselineEntry = findArchetypeSmokeBaselineEntry(baselineSpec, pageType.id)
  if (expectedBaselineEntry) {
    const actualBaselineEntry = contract.archetypeSmokeBaseline

    if (!actualBaselineEntry || typeof actualBaselineEntry !== 'object') {
      errors.push(
        `Missing archetypeSmokeBaseline metadata for ${pageType.id}. Re-write the contract with the current writer so this page stays bound to the required archetype smoke baseline.`
      )
    } else {
      const expectedContractBaseline = buildArchetypeSmokeBaselineContractEntry(expectedBaselineEntry)
      const expectedViewport = expectedContractBaseline?.viewport
      const actualViewport = normalizeViewport(actualBaselineEntry.viewport)
      const expectedAssertions = expectedContractBaseline?.assertions ?? []
      const actualAssertions = Array.isArray(actualBaselineEntry.assertions)
        ? actualBaselineEntry.assertions
        : []

      if (actualBaselineEntry.pageTypeId !== expectedContractBaseline.pageTypeId) {
        errors.push(
          `archetypeSmokeBaseline.pageTypeId must be ${expectedContractBaseline.pageTypeId}, received ${actualBaselineEntry.pageTypeId || '(missing)'}`
        )
      }

      if (actualBaselineEntry.screenshotKey !== expectedContractBaseline.screenshotKey) {
        errors.push(
          `archetypeSmokeBaseline.screenshotKey must be ${expectedContractBaseline.screenshotKey}, received ${actualBaselineEntry.screenshotKey || '(missing)'}`
        )
      }

      if (actualBaselineEntry.routeSuggestion !== expectedContractBaseline.routeSuggestion) {
        errors.push(
          `archetypeSmokeBaseline.routeSuggestion must be ${expectedContractBaseline.routeSuggestion}, received ${actualBaselineEntry.routeSuggestion || '(missing)'}`
        )
      }

      if (actualBaselineEntry.examplePath !== expectedContractBaseline.examplePath) {
        errors.push(
          `archetypeSmokeBaseline.examplePath must be ${expectedContractBaseline.examplePath}, received ${actualBaselineEntry.examplePath || '(missing)'}`
        )
      }

      if (
        !expectedViewport ||
        !actualViewport ||
        actualViewport.width !== expectedViewport.width ||
        actualViewport.height !== expectedViewport.height
      ) {
        errors.push(
          `archetypeSmokeBaseline.viewport must be ${expectedViewport ? `${expectedViewport.width}x${expectedViewport.height}` : '(declared in baseline spec)'}, received ${actualViewport ? `${actualViewport.width}x${actualViewport.height}` : '(missing)'}`
        )
      }

      if (
        expectedAssertions.length !== actualAssertions.length ||
        expectedAssertions.some((item, index) => actualAssertions[index] !== item)
      ) {
        errors.push(
          `archetypeSmokeBaseline.assertions must stay aligned with the packaged baseline spec for ${pageType.id}`
        )
      }
    }
  }

  if (archetypeDefinition?.archetype) {
    const expectedArchetypeId = archetypeDefinition.archetype.id
    const expectedArchetypeVersion = archetypeDefinition.archetype.version
    const expectedTemplatePath =
      archetypeDefinition?.archetype?.modeAdapters?.[contract.archetypeMode]?.templateDir || ''

    if (!contract.archetypeId) {
      warnings.push(
        `Missing archetypeId. Re-write the contract with the current writer so CI can enforce strict example generation for ${pageType.id}.`
      )
    } else if (contract.archetypeId !== expectedArchetypeId) {
      errors.push(
        `archetypeId must match the packaged archetype for ${pageType.id}: expected ${expectedArchetypeId}, received ${contract.archetypeId}`
      )
    }

    if (!contract.archetypeVersion) {
      warnings.push(
        `Missing archetypeVersion. Re-write the contract so archetype drift checks can compare against version ${expectedArchetypeVersion}.`
      )
    } else if (Number(contract.archetypeVersion) !== Number(expectedArchetypeVersion)) {
      warnings.push(
        `archetypeVersion is ${contract.archetypeVersion}; packaged archetype version is ${expectedArchetypeVersion}. Re-write the contract after updating the page.`
      )
    }

    if (contract.strictExampleGeneration !== true) {
      warnings.push(
        `strictExampleGeneration is ${String(
          contract.strictExampleGeneration
        )}; re-write the contract so strict example-generation gates can be enforced.`
      )
    }

    if (contract.strictExampleGeneration === true && FIXED_TEMPLATE_PAGE_TYPES.has(contract.pageTypeId)) {
      if (!expectedTemplatePath) {
        errors.push(
          `archetype ${expectedArchetypeId} requires strictExampleGeneration, but mode ${contract.archetypeMode || '(missing)'} does not declare a templateDir.`
        )
      }

      if (!contract.archetypeTemplatePath) {
        errors.push(
          `strictExampleGeneration requires archetypeTemplatePath for ${pageType.id}. Re-write the contract with the current writer after wiring a fixed template path.`
        )
      } else if (expectedTemplatePath && contract.archetypeTemplatePath !== expectedTemplatePath) {
        errors.push(
          `archetypeTemplatePath must match the packaged archetype template for ${pageType.id}: expected ${expectedTemplatePath}, received ${contract.archetypeTemplatePath}`
        )
      }
    }

    const adapterContract = contract.adapterContract
    if (!adapterContract || typeof adapterContract !== 'object') {
      warnings.push(
        'Missing adapterContract metadata. Re-write the contract so required capabilities, allowed overrides, and forbidden escapes become machine-checkable.'
      )
    } else {
      const requiredCapabilities = Array.isArray(adapterContract.requiredCapabilities)
        ? adapterContract.requiredCapabilities
        : []
      const missingCapabilities = (archetypeDefinition.archetype.requiredCapabilities || []).filter(
        (capability) => !requiredCapabilities.includes(capability)
      )
      const expectedHostAdapter = resolvePrimaryHostAdapter({
        pageTypeId: pageType.id,
        archetypeMode: contract.archetypeMode,
        capabilityRegistry: archetypeDefinition?.capabilityRegistry,
      })

      if (missingCapabilities.length > 0) {
        warnings.push(
          `adapterContract.requiredCapabilities is missing: ${missingCapabilities.join(', ')}`
        )
      }

      const pageComponentStart =
        String(generationProfile?.strategy || '').trim() === 'page-component' &&
        String(generationProfile?.startFrom || '').trim() === 'page-component'

      if (expectedHostAdapter?.id && !pageComponentStart) {
        const actualHostAdapterId = String(adapterContract.hostAdapterId || '').trim()

        if (!actualHostAdapterId) {
          errors.push(
            `adapterContract.hostAdapterId is missing. Re-write the contract so source-gate can require the named host adapter (${expectedHostAdapter.id}) instead of accepting primitive page-shell rewrites.`
          )
        } else if (actualHostAdapterId !== expectedHostAdapter.id) {
          errors.push(
            `adapterContract.hostAdapterId must be ${expectedHostAdapter.id}, received ${actualHostAdapterId}`
          )
        }
      }

    }
  }

  const genericAdapterContract = contract.adapterContract
  if (genericAdapterContract && typeof genericAdapterContract === 'object') {
    const localBypasses = getManagedPageLocalBypasses(contract)

    for (const [index, bypass] of localBypasses.entries()) {
      const label = `adapterContract.localBypasses[${index}]`

      if (!bypass.packageSpec) {
        errors.push(`${label}.packageSpec is required when local bypass metadata is declared.`)
      }

      if (!bypass.capabilityGap) {
        errors.push(`${label}.capabilityGap is required when local bypass metadata is declared.`)
      }

      if (!bypass.adapterPath) {
        errors.push(`${label}.adapterPath is required when local bypass metadata is declared.`)
      }

      if (!bypass.tokenBridgePath) {
        errors.push(`${label}.tokenBridgePath is required when local bypass metadata is declared.`)
      }

      if (!MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT.includes(bypass.ownerContainment)) {
        errors.push(
          `${label}.ownerContainment must be one of: ${MANAGED_PAGE_LOCAL_BYPASS_OWNER_CONTAINMENT.join(
            ', '
          )}; received ${bypass.ownerContainment || '(missing)'}`
        )
      }
    }
  }

  if (targetRoot && contract.generatedPagePath) {
    const generatedPageAbsPath = path.join(targetRoot, contract.generatedPagePath)
    warnings.push(`generated:${generatedPageAbsPath}`)
  }

  return { errors, warnings, pageType }
}

export async function loadRulesOnlyPageContracts(targetRoot) {
  const contractsDir = getRulesOnlyPageContractsDir(targetRoot)

  try {
    await fs.access(contractsDir)
  } catch {
    return {
      contractsDir,
      contracts: [],
      missing: true,
    }
  }

  const entries = await fs.readdir(contractsDir, { withFileTypes: true })
  const contracts = []

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.json')) continue
    const filePath = path.join(contractsDir, entry.name)

    try {
      const contract = JSON.parse(await fs.readFile(filePath, 'utf8'))
      contracts.push({ filePath, contract })
    } catch (error) {
      contracts.push({
        filePath,
        contract: null,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  contracts.sort((a, b) => a.filePath.localeCompare(b.filePath))

  return {
    contractsDir,
    contracts,
    missing: false,
  }
}

export function renderRulesOnlyPageContractMarkdown(contract) {
  const requiredRegions = getRequiredRegionsForPageType(contract.pageTypeId)
  const requiredOwnershipRoles = getRequiredOwnershipRolesForPageType(contract.pageTypeId)
  const semanticContract = getManagedPageSemanticContract(contract)
  const splitPaneContract = getManagedPageSplitPaneContract(contract)
  const runtimeSmokeRequirement = getManagedPageRuntimeSmokeRequirement(contract)
  const topologyId = getManagedPageTopologyId(contract)
  const generationProfile = contract.generationProfile || {}
  const displayProfile =
    (contract.displayProfile && typeof contract.displayProfile === 'object' ? contract.displayProfile : null) ||
    buildManagedPageDisplayProfile({
      archetypeMode: contract.archetypeMode,
      generationProfile,
    })
  const productionContract = contract.productionContract || {}
  const lines = [
    '# Managed Page Contract',
    '',
    '## Identity',
    `- artifact role: ${contract.artifactRole || displayProfile.artifactRole || '(not-declared)'}`,
    `- page type: ${contract.pageTypeLabel} (\`${contract.pageTypeId}\`)`,
    `- shell target: ${contract.shell || '(not-declared)'}`,
    `- generated page: \`${contract.generatedPagePath}\``,
    `- example path: \`${contract.examplePath}\``,
    `- host archetype path: \`${contract.hostArchetypePath}\``,
    `- archetype id: ${contract.archetypeId || '(not-declared)'}`,
    `- archetype label: ${contract.archetypeLabel || '(not-declared)'}`,
    `- archetype version: ${contract.archetypeVersion || '(not-declared)'}`,
    `- archetype mode: ${contract.archetypeMode || '(not-declared)'}`,
    `- archetype template path: \`${contract.archetypeTemplatePath || '(not-declared)'}\``,
    `- strict example generation: ${String(contract.strictExampleGeneration)}`,
    `- scroll strategy: ${contract.scrollStrategy || '(not-declared)'}`,
    `- delivery semantics: ${displayProfile.deliverySemantics || '(not-declared)'}`,
    `- runtime delivery mode: ${displayProfile.runtimeDeliveryMode || '(not-applicable)'}`,
    `- shell import policy: ${displayProfile.shellImportPolicy || '(not-declared)'}`,
    `- managed path: ${displayProfile.managedPath || '(not-declared)'}`,
    `- topology: ${topologyId || '(not-declared)'}`,
    `- layout strategy: ${contract.layoutStrategy || '(not-declared)'}`,
    `- layout archetype: ${contract.layoutArchetype || '(not-declared)'}`,
    `- non-typical scope: ${
      Array.isArray(contract.nonTypicalScope) && contract.nonTypicalScope.length > 0
        ? contract.nonTypicalScope.join(', ')
        : '(not-declared)'
    }`,
    `- mandatory components: ${
      Array.isArray(contract.mandatoryComponents) && contract.mandatoryComponents.length > 0
        ? contract.mandatoryComponents.join(', ')
        : '(not-declared)'
    }`,
    `- created at: ${contract.createdAt}`,
    '',
    '## Generation Profile',
    `- schema version: ${generationProfile.schemaVersion || '(not-declared)'}`,
    `- strategy: ${generationProfile.strategy || '(not-declared)'}`,
    `- mode: ${generationProfile.mode || '(not-declared)'}`,
    `- mold id: ${generationProfile.moldId || '(not-declared)'}`,
    `- start from: ${generationProfile.startFrom || '(not-declared)'}`,
    `- locked regions: ${Array.isArray(generationProfile.lockedRegions) ? generationProfile.lockedRegions.join(', ') || '(none)' : '(not-declared)'}`,
    `- editable slots: ${Array.isArray(generationProfile.editableSlots) ? generationProfile.editableSlots.join(', ') || '(none)' : '(not-declared)'}`,
    `- required gates: ${Array.isArray(generationProfile.requiredGates) ? generationProfile.requiredGates.join(', ') || '(none)' : '(not-declared)'}`,
    `- fallback: ${generationProfile.fallback || '(not-declared)'}`,
    `- source proof level: ${generationProfile.sourceProofLevel || '(not-declared)'}`,
    '',
    '## Production Contract',
    `- schema version: ${productionContract.schemaVersion || '(not-declared)'}`,
    `- policy: ${productionContract.policy || '(not-declared)'}`,
    `- page: \`${productionContract.page || '(not-declared)'}\``,
    `- mold id: ${productionContract.moldId || '(not-declared)'}`,
    `- start from: ${productionContract.startFrom || '(not-declared)'}`,
    `- required gates: ${Array.isArray(productionContract.requiredGates) ? productionContract.requiredGates.join(', ') || '(none)' : '(not-declared)'}`,
    `- source proof level: ${productionContract.sourceProofLevel || '(not-declared)'}`,
    '',
    '## Workflow',
    `- status: ${contract.workflow?.status || '(not-declared)'}`,
    `- delivery status: ${contract.workflow?.deliveryStatus || '(not-declared)'}`,
    `- started at: ${contract.workflow?.startedAt || '(not-declared)'}`,
    `- finalized at: ${contract.workflow?.finalizedAt || '(not-declared)'}`,
    `- preflight status: ${contract.workflow?.preflightStatus || '(not-declared)'}`,
    `- source gate status: ${contract.workflow?.sourceGateStatus || '(not-declared)'}`,
    `- doctor status: ${contract.workflow?.doctorStatus || '(not-declared)'}`,
    `- runtime smoke required: ${runtimeSmokeRequirement.required ? 'yes' : 'no'}`,
    `- runtime smoke requirement reason: ${
      runtimeSmokeRequirement.reason || '(not-required)'
    }`,
    `- runtime smoke status: ${contract.workflow?.runtimeSmokeStatus || '(not-declared)'}`,
    `- runtime smoke snapshot hash: ${
      contract.workflow?.runtimeSmokeSnapshotHash || '(not-declared)'
    }`,
    `- runtime smoke report path: \`${
      contract.workflow?.runtimeSmokeReportPath || '(not-declared)'
    }\``,
    `- source snapshot hash: ${contract.workflow?.sourceSnapshotHash || '(not-declared)'}`,
    `- stale reason: ${contract.workflow?.staleReason || '(not-declared)'}`,
    `- report path: \`${contract.workflow?.reportPath || '(not-declared)'}\``,
    `- smoke report path: \`${contract.workflow?.smokeReportPath || '(not-declared)'}\``,
    `- last command: ${contract.workflow?.lastCommand || '(not-declared)'}`,
    '',
    '## I18n Baseline',
  ]

  if (Array.isArray(contract.compositionGuardrails) && contract.compositionGuardrails.length > 0) {
    lines.splice(21, 0, `- composition guardrails: ${contract.compositionGuardrails.join(' | ')}`)
  }

  if (Array.isArray(contract.strategyEvidence) && contract.strategyEvidence.length > 0) {
    lines.splice(21, 0, `- strategy evidence: ${contract.strategyEvidence.join(' | ')}`)
  }

  if (!contract.i18nBaseline) {
    lines.push('- (not-declared)')
  } else {
    const i18nBaseline = contract.i18nBaseline
    const supportedLocales = Array.isArray(i18nBaseline.supportedLocales)
      ? i18nBaseline.supportedLocales
      : []
    const formatterPolicy = Array.isArray(i18nBaseline.formatterPolicy)
      ? i18nBaseline.formatterPolicy
      : []
    const bootstrapCommands = Array.isArray(i18nBaseline.bootstrapCommands)
      ? i18nBaseline.bootstrapCommands
      : []

    lines.push(`- strategy declaration: ${i18nBaseline.strategyDeclaration || '(not-declared)'}`)
    lines.push(`- reference doc: \`${i18nBaseline.referenceDoc || '(not-declared)'}\``)
    lines.push(`- runtime policy: ${i18nBaseline.runtimePolicy || '(not-declared)'}`)
    lines.push(
      `- bootstrap commands: ${
        bootstrapCommands.length > 0 ? bootstrapCommands.join(' | ') : '(not-declared)'
      }`
    )
    lines.push(`- sync command: ${i18nBaseline.syncCommand || '(not-declared)'}`)
    lines.push(
      `- supported locales: ${
        supportedLocales.length > 0 ? supportedLocales.join(', ') : '(not-declared)'
      }`
    )
    lines.push(
      `- formatter policy: ${
        formatterPolicy.length > 0 ? formatterPolicy.join(', ') : '(not-declared)'
      }`
    )
    lines.push(`- direction strategy: ${i18nBaseline.directionStrategy || '(not-declared)'}`)
    const multipliers =
      i18nBaseline.textExpansionMultipliers &&
      typeof i18nBaseline.textExpansionMultipliers === 'object'
        ? Object.entries(i18nBaseline.textExpansionMultipliers)
        : []
    lines.push(
      `- text expansion: ${
        multipliers.length > 0
          ? multipliers.map(([locale, value]) => `${locale}=${value}`).join(', ')
          : '(not-declared)'
      }`
    )
  }

  lines.push(
    '',
    '## Archetype Smoke Baseline',
  )

  if (!contract.archetypeSmokeBaseline) {
    lines.push('- (not-declared)')
  } else {
    const baseline = contract.archetypeSmokeBaseline
    const viewport = normalizeViewport(baseline.viewport)
    lines.push(`- page type: ${baseline.pageTypeId || '(not-declared)'}`)
    lines.push(`- screenshot key: ${baseline.screenshotKey || '(not-declared)'}`)
    lines.push(`- route suggestion: \`${baseline.routeSuggestion || '(not-declared)'}\``)
    lines.push(`- example path: \`${baseline.examplePath || '(not-declared)'}\``)
    lines.push(
      `- viewport: ${viewport ? `\`${viewport.width}x${viewport.height}\`` : '(not-declared)'}`
    )
    if (Array.isArray(baseline.assertions) && baseline.assertions.length > 0) {
      lines.push('- assertions:')
      for (const item of baseline.assertions) {
        lines.push(`  - ${item}`)
      }
    } else {
      lines.push('- assertions: (none)')
    }
  }

  lines.push(
    '',
    '## Required Regions',
  )

  if (requiredRegions.length === 0) {
    lines.push('- (no registered requirements)')
  } else {
    for (const region of requiredRegions) {
      lines.push(`- ${region}`)
    }
  }

  lines.push(
    '',
    '## Region Mapping',
  )

  const declaredRegions = Array.isArray(contract.regionMapping)
    ? contract.regionMapping.map((item) => String(item?.region || '').trim()).filter(Boolean)
    : []
  const optionalManagedRegions = declaredRegions.filter(
    (region) => !requiredRegions.includes(region)
  )
  const chartSectionTarget = Array.isArray(contract.regionMapping)
    ? contract.regionMapping.find(
        (item) => String(item?.region || '').trim().toLowerCase() === 'chart-section'
      )?.target || ''
    : ''

  lines.push(
    `- managed chart section: ${
      chartSectionTarget ? `declared (${chartSectionTarget})` : 'not-declared'
    }`
  )
  lines.push(
    '- chart baseline policy: any inserted charts must still follow hiui-design chart rules; only independent analysis blocks need chart-section.'
  )
  lines.push(
    `- optional managed regions: ${
      optionalManagedRegions.length > 0 ? optionalManagedRegions.join(', ') : '(none)'
    }`
  )

  for (const item of contract.regionMapping) {
    lines.push(`- ${item.region}: ${item.target}`)
  }

  lines.push('', '## Ownership')
  lines.push(`- ownership mode: ${contract.ownershipMode || '(not-declared)'}`)

  if (requiredOwnershipRoles.length === 0) {
    lines.push('- required roles: (none)')
  } else {
    lines.push(`- required roles: ${requiredOwnershipRoles.join(', ')}`)
  }

  if (!Array.isArray(contract.ownershipMapping) || contract.ownershipMapping.length === 0) {
    lines.push('- ownership mapping: (none)')
  } else {
    for (const item of contract.ownershipMapping) {
      lines.push(`- ${item.role}: ${item.target}`)
    }
  }

  lines.push('', '## Semantic Contract')
  lines.push(`- query-filter region role: ${semanticContract.queryFilterRegionRole}`)
  lines.push(`- dimension switch control: ${semanticContract.dimensionSwitchControl}`)
  lines.push(`- control scope: ${semanticContract.controlScope}`)
  lines.push(`- control strip placement: ${semanticContract.controlStripPlacement}`)
  lines.push(`- control strip visual treatment: ${semanticContract.controlStripVisualTreatment}`)
  lines.push(`- detail query-filter policy: ${semanticContract.detailQueryFilterPolicy}`)
  lines.push(`- mixed-scope controls: ${semanticContract.mixedScopeControls}`)
  lines.push(`- list shell composition: ${semanticContract.listShellComposition}`)
  lines.push(`- spacing ownership: ${semanticContract.spacingOwnership}`)
  lines.push(`- area chart fill: ${semanticContract.areaChartFill}`)
  lines.push(`- query field render profile: ${semanticContract.queryFieldRenderProfile}`)
  lines.push(`- keyword field role: ${semanticContract.keywordFieldRole}`)
  lines.push(`- text field role: ${semanticContract.textFieldRole}`)
  lines.push(
    `- select/date field surface policy: ${semanticContract.selectDateFieldSurfacePolicy}`
  )
  lines.push(`- filter surface baseline: ${semanticContract.filterSurfaceBaseline}`)
  lines.push(
    `- body section primary expression: ${semanticContract.bodySectionContract.primaryExpression}`
  )
  lines.push(
    `- body section composition: ${semanticContract.bodySectionContract.sectionComposition}`
  )
  lines.push(
    `- body section spacing ownership: ${semanticContract.bodySectionContract.sectionSpacingOwnership}`
  )
  lines.push(
    `- body section container policy: ${semanticContract.bodySectionContract.sectionContainerPolicy}`
  )
  lines.push(
    `- body section embedded widget policy: ${semanticContract.bodySectionContract.embeddedWidgetPolicy}`
  )

  lines.push('', '## Split Pane Contract')
  lines.push(`- enabled: ${String(splitPaneContract.enabled)}`)
  lines.push(`- left pane selector: \`${splitPaneContract.leftPaneSelector || '(not-declared)'}\``)
  lines.push(`- right pane selector: \`${splitPaneContract.rightPaneSelector || '(not-declared)'}\``)
  lines.push(`- table region selector: \`${splitPaneContract.tableRegionSelector || '(not-declared)'}\``)
  lines.push(`- left pane scroll: ${splitPaneContract.leftPaneScroll || '(not-declared)'}`)
  lines.push(`- right pane scroll: ${splitPaneContract.rightPaneScroll || '(not-declared)'}`)

  lines.push('', '## Adapter Contract')
  if (!contract.adapterContract || typeof contract.adapterContract !== 'object') {
    lines.push('- (none)')
  } else {
    const requiredCapabilities = Array.isArray(contract.adapterContract.requiredCapabilities)
      ? contract.adapterContract.requiredCapabilities
      : []
    const allowedOverrides = Array.isArray(contract.adapterContract.allowedOverrides)
      ? contract.adapterContract.allowedOverrides
      : []
    const forbiddenEscapes = Array.isArray(contract.adapterContract.forbiddenEscapes)
      ? contract.adapterContract.forbiddenEscapes
      : []
    const localBypasses = getManagedPageLocalBypasses(contract)

    lines.push(
      `- required capabilities: ${
        requiredCapabilities.length > 0 ? requiredCapabilities.join(', ') : '(none)'
      }`
    )
    lines.push(
      `- allowed overrides: ${
        allowedOverrides.length > 0 ? allowedOverrides.join(', ') : '(none)'
      }`
    )
    lines.push(
      `- forbidden escapes: ${
        forbiddenEscapes.length > 0 ? forbiddenEscapes.join(' | ') : '(none)'
      }`
    )
    lines.push(
      `- host adapter id: ${contract.adapterContract.hostAdapterId || '(not-declared)'}`
    )
    lines.push(
      `- host adapter label: ${contract.adapterContract.hostAdapterLabel || '(not-declared)'}`
    )
    lines.push(
      `- local bypasses: ${
        localBypasses.length > 0
          ? localBypasses
              .map(
                (entry) =>
                  `${entry.packageSpec || '(package-missing)'} -> ${entry.adapterPath || '(adapter-missing)'} | token bridge: ${
                    entry.tokenBridgePath || '(token-bridge-missing)'
                  } | containment: ${entry.ownerContainment || '(containment-missing)'}`
              )
              .join(' || ')
          : '(none)'
      }`
    )
  }

  lines.push('', '## Source Contract')
  lines.push('- required source markers:')
  for (const line of getManagedPageSourceCommentLines(contract)) {
    lines.push(`  - ${line}`)
  }

  lines.push('- required root attributes:')
  for (const attr of getManagedPageSourceRootAttributes(contract)) {
    lines.push(`  - ${attr.name}="${attr.value}"`)
  }

  lines.push('- required region anchors:')
  const regionAttrs = getManagedPageSourceRegionAttributes(contract)
  if (regionAttrs.length === 0) {
    lines.push('  - (none)')
  } else {
    for (const attr of regionAttrs) {
      lines.push(`  - ${attr.name}="${attr.value}"`)
    }
  }

  lines.push('- required ownership anchors:')
  const ownershipAttrs = getManagedPageSourceOwnershipAttributes(contract)
  if (ownershipAttrs.length === 0) {
    lines.push('  - (none)')
  } else {
    for (const attr of ownershipAttrs) {
      lines.push(`  - ${attr.name}="${attr.value}"`)
    }
  }

  lines.push('', '```jsx')
  lines.push(renderManagedPageSourceContractSnippet(contract))
  lines.push('```')

  lines.push('', '## Notes')
  if (contract.notes.length === 0) {
    lines.push('- (none)')
  } else {
    for (const note of contract.notes) {
      lines.push(`- ${note}`)
    }
  }

  lines.push('', '## Deviations')
  if (contract.deviations.length === 0) {
    lines.push('- (none)')
  } else {
    for (const deviation of contract.deviations) {
      lines.push(`- ${deviation}`)
    }
  }

  return `${lines.join('\n')}\n`
}
