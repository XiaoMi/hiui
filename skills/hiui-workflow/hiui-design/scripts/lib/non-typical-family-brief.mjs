import {
  getNonTypicalWorkflowArchetype,
  getPageFamilyWorkflowEntry,
} from './load-page-family-workflow-manifest.mjs'

export const NON_TYPICAL_PAGE_FAMILY = 'non-typical-page'
export const NON_TYPICAL_BLOCK_DESIGN_MAP_PATH =
  'docs/generation/non-typical-block-design-map.md'

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function normalizeString(value) {
  return String(value || '').trim()
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function normalizeStringArray(value) {
  return unique(asArray(value).map((item) => normalizeString(item)))
}

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

function getByPath(value, dottedPath) {
  return String(dottedPath || '')
    .split('.')
    .filter(Boolean)
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), value)
}

function hasMeaningfulValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (typeof value === 'string') return normalizeString(value).length > 0
  if (typeof value === 'boolean') return true
  if (typeof value === 'number') return Number.isFinite(value)
  if (isPlainObject(value)) return Object.keys(value).length > 0
  return value !== null && value !== undefined
}

const COMPLEX_QUERY_FILTER_COMPLEXITIES = new Set([
  'complex',
  'structured',
  'multi-field',
  'multi-dimension',
  'field-combination',
])

const QUERY_FILTER_CONTROL_TARGETS = new Set([
  'table-top-filter',
  'table-top',
  'table-filter',
  'detail-table-filter',
  'page-control-strip',
  'page-global-control-strip',
  'page-global-filter',
  'global-filter',
])

function collectDisplayCarrierPolicyViolations({ policy, path }) {
  const violations = []
  if (!isPlainObject(policy)) {
    violations.push(`${path} is required`)
    return violations
  }

  const controlComplexity = normalizeString(policy.controlComplexity)
  const controlTarget = normalizeString(policy.controlTarget)
  const preferredCarrier = normalizeString(policy.preferredCarrier)

  if (!controlComplexity) {
    violations.push(`${path}.controlComplexity is required`)
  }

  if (!controlTarget) {
    violations.push(`${path}.controlTarget is required`)
  }

  if (!preferredCarrier) {
    violations.push(`${path}.preferredCarrier is required`)
  }

  if (!controlComplexity || !preferredCarrier) {
    return violations
  }

  if (controlComplexity === 'light' && preferredCarrier !== 'tag') {
    violations.push(`${path}.preferredCarrier must be tag when controlComplexity=light`)
  }

  if (
    controlComplexity === 'single-dimension-switch' &&
    preferredCarrier !== 'tabs'
  ) {
    violations.push(
      `${path}.preferredCarrier must be tabs when controlComplexity=single-dimension-switch`
    )
  }

  if (
    (COMPLEX_QUERY_FILTER_COMPLEXITIES.has(controlComplexity) ||
      QUERY_FILTER_CONTROL_TARGETS.has(controlTarget)) &&
    preferredCarrier !== 'query-filter'
  ) {
    violations.push(
      `${path}.preferredCarrier must be query-filter for complex filters or table-top/page-global filters`
    )
  }

  return violations
}

function collectSelectionDetailTablePolicyViolations({ policy, path }) {
  const violations = []
  if (!isPlainObject(policy)) {
    violations.push(`${path} is required`)
    return violations
  }

  if (normalizeString(policy.preferredCarrier) !== 'table') {
    violations.push(`${path}.preferredCarrier must equal table`)
  }

  if (normalizeString(policy.cellWrap) !== 'nowrap') {
    violations.push(`${path}.cellWrap must equal nowrap`)
  }

  if (normalizeString(policy.overflowX) !== 'auto') {
    violations.push(`${path}.overflowX must equal auto`)
  }

  return violations
}

function normalizeInputSummary(value) {
  if (!isPlainObject(value)) {
    return {
      inputMode: '',
      evidence: [],
      knowns: [],
      unknowns: [],
    }
  }

  return {
    inputMode: normalizeString(value.inputMode),
    evidence: normalizeStringArray(value.evidence),
    knowns: normalizeStringArray(value.knowns),
    unknowns: normalizeStringArray(value.unknowns),
  }
}

function normalizeClassification(value) {
  if (!isPlainObject(value)) {
    return {
      familyDecision: '',
      recommendedRoute: '',
      confidence: '',
      reasons: [],
      boundaryRisk: [],
      nextAction: '',
    }
  }

  return {
    familyDecision: normalizeString(value.familyDecision),
    recommendedRoute: normalizeString(value.recommendedRoute),
    confidence: normalizeString(value.confidence),
    reasons: normalizeStringArray(value.reasons),
    boundaryRisk: normalizeStringArray(value.boundaryRisk),
    nextAction: normalizeString(value.nextAction),
  }
}

function normalizePageHeaderPlan(value) {
  if (!isPlainObject(value)) {
    return {
      title: '',
      hasBack: false,
      primaryActions: [],
      hostConflictPolicy: '',
      restorePolicy: '',
    }
  }

  return {
    title: normalizeString(value.title),
    hasBack: value.hasBack === true,
    primaryActions: normalizeStringArray(value.primaryActions),
    hostConflictPolicy: normalizeString(value.hostConflictPolicy),
    restorePolicy: normalizeString(value.restorePolicy),
  }
}

function normalizeWhiteBodyPlan(value) {
  if (!isPlainObject(value)) {
    return {
      owner: '',
      workspaceMode: '',
      outerSurfaceMode: '',
      mountRegionFillPolicy: '',
      hostEscalationRule: '',
    }
  }

  return {
    owner: normalizeString(value.owner),
    workspaceMode: normalizeString(value.workspaceMode),
    outerSurfaceMode: normalizeString(value.outerSurfaceMode),
    mountRegionFillPolicy: normalizeString(value.mountRegionFillPolicy),
    hostEscalationRule: normalizeString(value.hostEscalationRule),
  }
}

function normalizeRegionPlan(value) {
  if (!isPlainObject(value)) {
    return {
      primaryRegion: '',
      secondaryRegions: [],
      stableRegions: [],
      mutableRegions: [],
      readingFlow: '',
    }
  }

  return {
    primaryRegion: normalizeString(value.primaryRegion),
    secondaryRegions: normalizeStringArray(value.secondaryRegions),
    stableRegions: normalizeStringArray(value.stableRegions),
    mutableRegions: normalizeStringArray(value.mutableRegions),
    readingFlow: normalizeString(value.readingFlow),
  }
}

function normalizeCoordinationModel(value) {
  if (!isPlainObject(value)) {
    return {
      type: '',
      coordinationPatternId: '',
      sourceRegion: '',
      targetRegions: [],
      interactionRule: '',
    }
  }

  const coordinationPatternId = normalizeString(
    value.coordinationPatternId || value.patternId || value.type
  )

  return {
    type: coordinationPatternId,
    coordinationPatternId,
    sourceRegion: normalizeString(value.sourceRegion),
    targetRegions: normalizeStringArray(value.targetRegions),
    interactionRule: normalizeString(value.interactionRule),
  }
}

function normalizeDesignSystemPlan(value) {
  if (!isPlainObject(value)) {
    return {
      preferredSources: [],
      approvedEscapes: [],
    }
  }

  return {
    preferredSources: normalizeStringArray(value.preferredSources),
    approvedEscapes: normalizeStringArray(value.approvedEscapes),
  }
}

function normalizeDataShapeRegion(value) {
  if (!isPlainObject(value)) {
    return {
      regionId: '',
      regionRole: '',
      entityShape: '',
      cardinality: '',
      density: '',
      updateMode: '',
      visualizationHint: '',
    }
  }

  return {
    regionId: normalizeString(value.regionId),
    regionRole: normalizeString(value.regionRole),
    entityShape: normalizeString(value.entityShape),
    cardinality: normalizeString(value.cardinality),
    density: normalizeString(value.density),
    updateMode: normalizeString(value.updateMode),
    visualizationHint: normalizeString(value.visualizationHint),
  }
}

function normalizeCrossRegionDependency(value) {
  if (!isPlainObject(value)) {
    return {
      sourceRegion: '',
      targetRegion: '',
      relationship: '',
    }
  }

  return {
    sourceRegion: normalizeString(value.sourceRegion),
    targetRegion: normalizeString(value.targetRegion),
    relationship: normalizeString(value.relationship),
  }
}

function normalizeDataShape(value) {
  if (!isPlainObject(value)) {
    return {
      chartUsage: '',
      regionShapes: [],
      crossRegionDependencies: [],
    }
  }

  return {
    chartUsage: normalizeString(value.chartUsage),
    regionShapes: asArray(value.regionShapes).map((item) => normalizeDataShapeRegion(item)),
    crossRegionDependencies: asArray(value.crossRegionDependencies).map((item) =>
      normalizeCrossRegionDependency(item)
    ),
  }
}

function normalizeDecisionPackage(value) {
  if (!isPlainObject(value)) return null

  return {
    pageFamily: normalizeString(value.pageFamily),
    pageGoal: normalizeString(value.pageGoal),
    primaryWorkflows: normalizeStringArray(value.primaryWorkflows),
    pageHeaderPlan: normalizePageHeaderPlan(value.pageHeaderPlan),
    whiteBodyPlan: normalizeWhiteBodyPlan(value.whiteBodyPlan),
    regionPlan: normalizeRegionPlan(value.regionPlan),
    coordinationModel: normalizeCoordinationModel(value.coordinationModel),
    dataCarriers: normalizeStringArray(value.dataCarriers),
    dataShape: normalizeDataShape(value.dataShape),
    interactionContracts: normalizeStringArray(value.interactionContracts),
    designSystemPlan: normalizeDesignSystemPlan(value.designSystemPlan),
    displayContentPlan: hasMeaningfulValue(value.displayContentPlan)
      ? cloneJson(value.displayContentPlan)
      : null,
    implementationNotes: normalizeStringArray(value.implementationNotes),
    sampleContentPlan: hasMeaningfulValue(value.sampleContentPlan)
      ? cloneJson(value.sampleContentPlan)
      : null,
    stopReason: normalizeString(value.stopReason),
  }
}

function normalizeStopDecision(value) {
  if (!isPlainObject(value)) {
    return {
      stopBeforeCode: true,
      stopReason: '',
    }
  }

  return {
    stopBeforeCode: value.stopBeforeCode === true,
    stopReason: normalizeString(value.stopReason),
  }
}

export function normalizeNonTypicalConversationOutput(value) {
  if (!isPlainObject(value)) return null

  return {
    inputSummary: normalizeInputSummary(value.inputSummary),
    classification: normalizeClassification(value.classification),
    nonTypicalDecisionPackage: normalizeDecisionPackage(value.nonTypicalDecisionPackage),
    stopDecision: normalizeStopDecision(value.stopDecision),
  }
}

export function resolveNonTypicalConversationOutput({
  explicitOutput,
  confirmedGenerationInput,
}) {
  const explicitNormalized = normalizeNonTypicalConversationOutput(explicitOutput)
  const nestedNormalized = normalizeNonTypicalConversationOutput(
    confirmedGenerationInput?.nonTypicalConversationOutput
  )

  if (!explicitNormalized) return nestedNormalized
  if (!nestedNormalized) return explicitNormalized

  const explicitSerialized = JSON.stringify(explicitNormalized)
  const nestedSerialized = JSON.stringify(nestedNormalized)

  if (explicitSerialized !== nestedSerialized) {
    throw new Error(
      'nonTypicalConversationOutput conflicts with confirmedGenerationInput.nonTypicalConversationOutput'
    )
  }

  return explicitNormalized
}

function collectSelectionDetailDisplayContentPlanViolations(displayContentPlan) {
  const violations = []
  if (!isPlainObject(displayContentPlan)) {
    violations.push('selection-detail-sync displayContentPlan must be an object when provided')
    return violations
  }

  const searchPlan = isPlainObject(displayContentPlan.leftSearch)
    ? displayContentPlan.leftSearch
    : isPlainObject(displayContentPlan.selectionSearch)
      ? displayContentPlan.selectionSearch
      : null
  if (!searchPlan || !hasMeaningfulValue(searchPlan.placeholder)) {
    violations.push('selection-detail-sync displayContentPlan must include leftSearch.placeholder')
  }
  if (searchPlan && normalizeString(searchPlan.preferredCarrier) !== 'search') {
    violations.push('selection-detail-sync displayContentPlan.leftSearch.preferredCarrier must equal search')
  }

  const filterPlan = Array.isArray(displayContentPlan.leftFilters)
    ? displayContentPlan.leftFilters
    : Array.isArray(displayContentPlan.selectionFilters)
      ? displayContentPlan.selectionFilters
      : []
  if (filterPlan.length === 0) {
    violations.push('selection-detail-sync displayContentPlan must include leftFilters or selectionFilters')
  }
  violations.push(
    ...collectDisplayCarrierPolicyViolations({
      policy: displayContentPlan.leftFiltersPolicy,
      path: 'selection-detail-sync displayContentPlan.leftFiltersPolicy',
    })
  )

  const selectionItems = Array.isArray(displayContentPlan.selectionItems)
    ? displayContentPlan.selectionItems
    : []
  if (selectionItems.length === 0) {
    violations.push('selection-detail-sync displayContentPlan must include non-empty selectionItems')
    return violations
  }

  for (const [index, item] of selectionItems.entries()) {
    if (!isPlainObject(item)) {
      violations.push(`selection-detail-sync displayContentPlan.selectionItems[${index}] must be an object`)
      continue
    }

    if (!hasMeaningfulValue(item.label)) {
      violations.push(`selection-detail-sync displayContentPlan.selectionItems[${index}].label is required`)
    }
    if (!Array.isArray(item.metrics) || item.metrics.length === 0) {
      violations.push(`selection-detail-sync displayContentPlan.selectionItems[${index}].metrics must be non-empty`)
    }
    if (!isPlainObject(item.detailHeader)) {
      violations.push(`selection-detail-sync displayContentPlan.selectionItems[${index}].detailHeader is required`)
    }
    if (!Array.isArray(item.statusTabs) || item.statusTabs.length === 0) {
      violations.push(`selection-detail-sync displayContentPlan.selectionItems[${index}].statusTabs must be non-empty`)
    }
    violations.push(
      ...collectDisplayCarrierPolicyViolations({
        policy: item.statusTabsPolicy,
        path: `selection-detail-sync displayContentPlan.selectionItems[${index}].statusTabsPolicy`,
      })
    )
    if (!isPlainObject(item.detailTable)) {
      violations.push(`selection-detail-sync displayContentPlan.selectionItems[${index}].detailTable is required`)
      continue
    }
    if (!Array.isArray(item.detailTable.columns) || item.detailTable.columns.length === 0) {
      violations.push(
        `selection-detail-sync displayContentPlan.selectionItems[${index}].detailTable.columns must be non-empty`
      )
    }
    violations.push(
      ...collectSelectionDetailTablePolicyViolations({
        policy: item.detailTable.tablePolicy,
        path: `selection-detail-sync displayContentPlan.selectionItems[${index}].detailTable.tablePolicy`,
      })
    )
  }

  return violations
}

export async function resolveNonTypicalFamilyExecution({
  skillRoot,
  normalizedInputModeId,
  resolvedMode,
  nonTypicalConversationOutput,
}) {
  const { entry: workflowEntry, manifestPath } = await getPageFamilyWorkflowEntry({
    skillRoot,
    pageFamily: NON_TYPICAL_PAGE_FAMILY,
  })
  const classification = nonTypicalConversationOutput?.classification
  const decisionPackage = nonTypicalConversationOutput?.nonTypicalDecisionPackage
  const resolvedCoordinationPatternId =
    decisionPackage?.coordinationModel?.coordinationPatternId ||
    decisionPackage?.coordinationModel?.type ||
    ''

  let archetype = null
  let archetypeManifestPath = ''
  let coordinationPatternManifestPath = ''

  // Only resolve the coordination pattern after the family classification has
  // actually allowed execution. Boundary/negative outputs should fail on the
  // classification contract first instead of leaking deeper manifest errors.
  if (
    classification?.familyDecision === 'yes' &&
    classification?.recommendedRoute === NON_TYPICAL_PAGE_FAMILY &&
    decisionPackage &&
    resolvedCoordinationPatternId
  ) {
    try {
      ;({
        archetype,
        archetypeManifestPath,
        coordinationPatternManifestPath,
      } = await getNonTypicalWorkflowArchetype({
        skillRoot,
        archetypeId: decisionPackage.coordinationModel?.type,
        coordinationPatternId: decisionPackage.coordinationModel?.coordinationPatternId,
      }))
    } catch {
      // Keep the lookup soft here so the contract validator can surface a
      // stable, user-facing violation set instead of an early manifest throw.
    }
  }

  const violations = validateNonTypicalConversationOutput({
    normalizedInputModeId,
    resolvedMode,
    nonTypicalConversationOutput,
    workflowEntry,
    archetype,
  })

  return {
    workflowEntry,
    workflowManifestPath: manifestPath,
    archetype,
    archetypeManifestPath,
    coordinationPatternManifestPath,
    violations,
  }
}

export function validateNonTypicalConversationOutput({
  normalizedInputModeId,
  resolvedMode,
  nonTypicalConversationOutput,
  workflowEntry,
  archetype,
}) {
  const violations = []

  if (!nonTypicalConversationOutput) {
    violations.push('nonTypicalConversationOutput is required')
    return violations
  }

  if (
    workflowEntry &&
    Array.isArray(workflowEntry.supportedInputModes) &&
    !workflowEntry.supportedInputModes.includes(normalizedInputModeId)
  ) {
    violations.push(
      `non-typical-page does not support inputMode ${normalizedInputModeId}`
    )
  }

  if (
    workflowEntry &&
    Array.isArray(workflowEntry.supportedIntegrationModes) &&
    !workflowEntry.supportedIntegrationModes.includes(resolvedMode)
  ) {
    violations.push(
      `non-typical-page does not support integration mode ${resolvedMode}`
    )
  }

  const inputModeFromOutput = nonTypicalConversationOutput.inputSummary.inputMode
  if (inputModeFromOutput && inputModeFromOutput !== normalizedInputModeId) {
    violations.push(
      `nonTypicalConversationOutput.inputSummary.inputMode must equal ${normalizedInputModeId}`
    )
  }

  const classification = nonTypicalConversationOutput.classification
  if (!['yes', 'partial', 'no'].includes(classification.familyDecision)) {
    violations.push(
      'nonTypicalConversationOutput.classification.familyDecision must be one of yes, partial, no'
    )
  }

  if (!['non-typical-page', 'typical-page-variant', 'analytics-page'].includes(classification.recommendedRoute)) {
    violations.push(
      'nonTypicalConversationOutput.classification.recommendedRoute must be one of non-typical-page, typical-page-variant, analytics-page'
    )
  }

  if (classification.boundaryRisk.length === 0) {
    violations.push('nonTypicalConversationOutput.classification.boundaryRisk must be a non-empty array')
  }

  if (classification.familyDecision !== 'yes') {
    violations.push(
      'nonTypicalConversationOutput.classification.familyDecision must equal yes before execution brief creation'
    )
  }

  if (classification.recommendedRoute !== NON_TYPICAL_PAGE_FAMILY) {
    violations.push(
      `nonTypicalConversationOutput.classification.recommendedRoute must equal ${NON_TYPICAL_PAGE_FAMILY}`
    )
  }

  if (!nonTypicalConversationOutput.nonTypicalDecisionPackage) {
    violations.push('nonTypicalConversationOutput.nonTypicalDecisionPackage is required')
  }

  if (nonTypicalConversationOutput.stopDecision.stopBeforeCode) {
    violations.push('nonTypicalConversationOutput.stopDecision.stopBeforeCode must be false')
  }

  const decisionPackage = nonTypicalConversationOutput.nonTypicalDecisionPackage
  if (!decisionPackage) return violations

  if (
    decisionPackage.pageFamily &&
    decisionPackage.pageFamily !== NON_TYPICAL_PAGE_FAMILY
  ) {
    violations.push(
      `nonTypicalConversationOutput.nonTypicalDecisionPackage.pageFamily must equal ${NON_TYPICAL_PAGE_FAMILY}`
    )
  }

  if (
    decisionPackage.whiteBodyPlan.owner &&
    decisionPackage.whiteBodyPlan.owner !== 'single-primary-workspace-owner'
  ) {
    violations.push(
      'nonTypicalConversationOutput.nonTypicalDecisionPackage.whiteBodyPlan.owner must equal single-primary-workspace-owner'
    )
  }

  if (
    decisionPackage.regionPlan.primaryRegion &&
    decisionPackage.regionPlan.stableRegions.length > 0 &&
    !decisionPackage.regionPlan.stableRegions.includes(decisionPackage.regionPlan.primaryRegion)
  ) {
    violations.push(
      'nonTypicalConversationOutput.nonTypicalDecisionPackage.regionPlan.primaryRegion must appear in stableRegions'
    )
  }

  if (
    decisionPackage.regionPlan.primaryRegion &&
    decisionPackage.regionPlan.mutableRegions.includes(decisionPackage.regionPlan.primaryRegion)
  ) {
    violations.push(
      'nonTypicalConversationOutput.nonTypicalDecisionPackage.regionPlan.primaryRegion must not appear in mutableRegions'
    )
  }

  const preferredSources = decisionPackage.designSystemPlan.preferredSources
  const allowedSources = normalizeStringArray(workflowEntry?.designSystemPolicy?.preferredSources)
  if (preferredSources.length === 0) {
    violations.push(
      'nonTypicalConversationOutput.nonTypicalDecisionPackage.designSystemPlan.preferredSources must be a non-empty array'
    )
  } else if (
    allowedSources.length > 0 &&
    preferredSources.some((item) => !allowedSources.includes(item))
  ) {
    violations.push(
      `nonTypicalConversationOutput.nonTypicalDecisionPackage.designSystemPlan.preferredSources must stay inside ${allowedSources.join(', ')}`
    )
  }

  if (workflowEntry?.designSystemPolicy?.allowUnapprovedEscapesByDefault === false) {
    const approvedEscapes = decisionPackage.designSystemPlan.approvedEscapes
    if (!Array.isArray(approvedEscapes)) {
      violations.push(
        'nonTypicalConversationOutput.nonTypicalDecisionPackage.designSystemPlan.approvedEscapes must be an array'
      )
    }
  }

  for (const [index, regionShape] of (decisionPackage.dataShape?.regionShapes ?? []).entries()) {
    if (!regionShape.regionId) {
      violations.push(
        `nonTypicalConversationOutput.nonTypicalDecisionPackage.dataShape.regionShapes[${index}].regionId is required`
      )
    }

    if (!regionShape.entityShape) {
      violations.push(
        `nonTypicalConversationOutput.nonTypicalDecisionPackage.dataShape.regionShapes[${index}].entityShape is required`
      )
    }

    if (!regionShape.updateMode) {
      violations.push(
        `nonTypicalConversationOutput.nonTypicalDecisionPackage.dataShape.regionShapes[${index}].updateMode is required`
      )
    }
  }

  const regionShapeIds = new Set(
    (decisionPackage.dataShape?.regionShapes ?? []).map((item) => item.regionId).filter(Boolean)
  )
  if (
    decisionPackage.regionPlan.primaryRegion &&
    regionShapeIds.size > 0 &&
    !regionShapeIds.has(decisionPackage.regionPlan.primaryRegion)
  ) {
    violations.push(
      'nonTypicalConversationOutput.nonTypicalDecisionPackage.dataShape.regionShapes must include regionPlan.primaryRegion'
    )
  }

  if (
    decisionPackage.coordinationModel.sourceRegion &&
    regionShapeIds.size > 0 &&
    !regionShapeIds.has(decisionPackage.coordinationModel.sourceRegion)
  ) {
    violations.push(
      'nonTypicalConversationOutput.nonTypicalDecisionPackage.dataShape.regionShapes must include coordinationModel.sourceRegion'
    )
  }

  for (const targetRegion of decisionPackage.coordinationModel.targetRegions) {
    if (regionShapeIds.size > 0 && !regionShapeIds.has(targetRegion)) {
      violations.push(
        `nonTypicalConversationOutput.nonTypicalDecisionPackage.dataShape.regionShapes must include coordinationModel.targetRegion ${targetRegion}`
      )
    }
  }

  for (const fieldPath of workflowEntry?.requiredDecisionFields ?? []) {
    if (!hasMeaningfulValue(getByPath(nonTypicalConversationOutput, fieldPath))) {
      violations.push(`nonTypicalConversationOutput.${fieldPath} is required`)
    }
  }

  const supportedArchetypes = normalizeStringArray(
    workflowEntry?.supportedCoordinationPatterns ?? workflowEntry?.supportedArchetypes
  )
  const resolvedArchetypeId =
    decisionPackage.coordinationModel.coordinationPatternId ||
    decisionPackage.coordinationModel.type
  if (!resolvedArchetypeId) {
    violations.push(
      'nonTypicalConversationOutput.nonTypicalDecisionPackage.coordinationModel.type or coordinationPatternId is required'
    )
  } else if (
    supportedArchetypes.length > 0 &&
    !supportedArchetypes.includes(resolvedArchetypeId)
  ) {
    violations.push(
      `workflow coordination pattern ${resolvedArchetypeId} is not registered in page-family-workflows.manifest.json`
    )
  }

  if (
    resolvedArchetypeId === 'selection-detail-sync' &&
    hasMeaningfulValue(decisionPackage.displayContentPlan)
  ) {
    violations.push(
      ...collectSelectionDetailDisplayContentPlanViolations(decisionPackage.displayContentPlan)
    )
  }

  if (!archetype) {
    violations.push(
      `non-typical workflow coordination pattern ${resolvedArchetypeId || 'unknown'} is not available`
    )
    return violations
  }

  if (decisionPackage.coordinationModel.sourceRegion !== archetype.coordinationSchema?.sourceRegionRole &&
      decisionPackage.coordinationModel.sourceRegion &&
      archetype.coordinationSchema?.sourceRegionRole) {
    // The page-level decision uses concrete region ids, while the archetype uses role names.
    // Do not force equality here; execution only requires a concrete source region to exist.
  }

  return violations
}

export function buildNonTypicalPageType({ workflowEntry }) {
  return {
    id: '',
    label: workflowEntry?.label || '非典型页面',
    pageFamily: NON_TYPICAL_PAGE_FAMILY,
    kind: 'family-rules-composition',
    whenToUse:
      'Use this family only when multiple stable regions jointly carry the main task and no existing typical or analytics carrier remains dominant.',
    shell: 'NonTypicalPageFrame + WhiteBodyWorkspace',
    docEntry: 'docs/generation/non-typical-ai-generation-guidance.md',
    sharedDocs: workflowEntry?.planningDocs ?? [],
    smokePath: '',
  }
}

export function buildNonTypicalWorkflowSummary({ workflowEntry, archetype }) {
  return {
    kind: 'family-rules-composition',
    defaultFlow: 'rules-composition-with-shell-primitives',
    replaceBusinessSlotsByDefault: false,
    generatorMode: workflowEntry?.generatorMode || 'family-specific-generator',
    contentGenerationMode: 'rules-composition',
    templateUsageMode: 'shell-primitives-and-design-gates',
    requiredModuleSet: archetype?.requiredPrimitives ?? [],
    fixedRegions: ['page-header', 'white-body'],
    referenceModules: workflowEntry?.planningDocs ?? [],
    description:
      'Use fixed page-header and whiteBody ownership, then compose family primitives under the approved HiUI design system gate.',
    manualRefactorOwners: [],
    sectionLayoutSemantics: {},
    chartLayoutPlanningRequired: false,
    chartCount: undefined,
    slotPlan: undefined,
    slotRemainder: undefined,
    selectedChartArchetype: undefined,
    rowFillDecision: undefined,
    chartReusePolicy: '',
    stopAutoReplacementReason:
      'non-typical-page does not use template business-slot replacement; execution begins from a family-level decision package.',
  }
}

export function buildNonTypicalGenerationContract({ workflowEntry }) {
  return {
    requiredShell: 'NonTypicalPageFrame + WhiteBodyWorkspace',
    requiredImports: [],
    requiredSlots: [],
    businessSlots: [],
    lockedRegions: ['page-header', 'white-body'],
    forbiddenTokens: [],
    lightSanityChecks: workflowEntry?.lightSanityChecks ?? [],
    generationNotes: [
      'This family uses rules-composition instead of page-template slot replacement.',
      'Keep page header and white body ownership stable, then compose only approved primitives.',
      'Do not introduce a second visual system or local ad-hoc tokens by default.',
    ],
  }
}

export function buildNonTypicalCoverageDecision() {
  return {
    status: 'family-rules-composition',
    managedByTemplate: false,
    adjustmentHandling: 'not-applicable',
    requiredDecisions: {
      componentDecision: false,
      tokenDecision: false,
    },
    coveredRegions: ['page-header', 'white-body'],
    uncoveredUi: ['family-composed-primary-region', 'family-composed-secondary-regions'],
    escapeHatches: [],
  }
}

function inferDominantBlock(regionShape) {
  const hint = regionShape.visualizationHint
  const entityShape = regionShape.entityShape
  const regionRole = regionShape.regionRole

  if (hint === 'timeline' || entityShape === 'state-flow') return 'stage-navigation'
  if (hint === 'chart' || entityShape === 'chart-series') return 'chart-insight'
  if (hint === 'table' || entityShape === 'collection') return 'collection-review'
  if (hint === 'metrics' || entityShape === 'metric-set') return 'metric-summary'
  if (hint === 'actions') return 'action-strip'
  if (hint === 'snapshot') return 'snapshot-summary'
  if (hint === 'form' || entityShape === 'section-list') return 'detail-sections'
  if (hint === 'descriptions' || entityShape === 'single-record') {
    return regionRole === 'contextRegion' ? 'context-facts' : 'detail-sections'
  }
  return 'generic-section-group'
}

function inferApprovedCarrier(blockKind) {
  switch (blockKind) {
    case 'stage-navigation':
      return 'step rail / progress navigation'
    case 'chart-insight':
      return 'chart card + approved chart runtime'
    case 'collection-review':
      return 'table or grouped collection review'
    case 'metric-summary':
      return 'metric card group'
    case 'action-strip':
      return 'action strip'
    case 'snapshot-summary':
      return 'snapshot facts / compact summary list'
    case 'context-facts':
      return 'compact facts / descriptions'
    case 'detail-sections':
      return 'section groups + fields'
    default:
      return 'section group'
  }
}

function inferRecommendedPrimitive(blockKind, regionShape = {}) {
  if (regionShape.regionRole === 'sourceRegion' && regionShape.entityShape === 'collection') {
    return 'SelectionPane'
  }
  if (
    regionShape.regionRole === 'supportingRegion' &&
    regionShape.entityShape === 'single-record' &&
    regionShape.updateMode === 'selection-driven'
  ) {
    return 'DetailHeaderPane'
  }
  if (
    regionShape.regionRole === 'mutableRegion' &&
    (regionShape.visualizationHint === 'actions' || regionShape.entityShape === 'metric-set')
  ) {
    return 'StatusTabStrip'
  }
  if (regionShape.regionRole === 'primaryRegion' && regionShape.visualizationHint === 'table') {
    return 'DataTable'
  }

  switch (blockKind) {
    case 'stage-navigation':
      return 'StageRail'
    case 'snapshot-summary':
      return 'SnapshotPane'
    case 'action-strip':
      return 'ActionStrip'
    default:
      return 'SectionGroup'
  }
}

function inferDominantBlockFromRestoreDecision(regionDecision) {
  const strategy = normalizeString(regionDecision?.preferredHiuiStrategy)
  const regionType = normalizeString(regionDecision?.regionType)

  if (regionType === 'page-header' || strategy.includes('page-header')) {
    return 'page-header'
  }
  if (strategy.includes('stage') || strategy.includes('timeline')) {
    return 'stage-navigation'
  }
  if (strategy.includes('snapshot')) {
    return 'snapshot-summary'
  }
  if (strategy.includes('action')) {
    return 'action-strip'
  }
  if (strategy.includes('metric')) {
    return 'metric-summary'
  }
  if (strategy.includes('chart') || regionType.includes('chart')) {
    return 'chart-insight'
  }

  return 'detail-sections'
}

function inferApprovedCarrierFromRestoreDecision(regionDecision, dominantBlock) {
  const strategy = normalizeString(regionDecision?.preferredHiuiStrategy)
  const regionType = normalizeString(regionDecision?.regionType)

  if (regionType === 'page-header' || strategy.includes('page-header')) {
    return 'single page header'
  }

  return inferApprovedCarrier(dominantBlock)
}

function inferRecommendedPrimitiveFromRestoreDecision(regionDecision, dominantBlock) {
  const strategy = normalizeString(regionDecision?.preferredHiuiStrategy)
  const regionType = normalizeString(regionDecision?.regionType)

  if (regionType === 'page-header' || strategy.includes('page-header')) {
    return 'PageHeader'
  }
  if (strategy.includes('metric')) {
    return 'MetricCardGroup'
  }
  if (strategy.includes('chart') || regionType.includes('chart')) {
    return 'ChartCardGroup'
  }

  return inferRecommendedPrimitive(dominantBlock)
}

function buildNonTypicalDesignMappingPlan({ decisionPackage, confirmedDesignRestoreInput = null }) {
  const regionShapes = decisionPackage.dataShape?.regionShapes ?? []
  const regionDecisionById = new Map(
    (confirmedDesignRestoreInput?.restoreDecisionPackage?.regionDecisionTable ?? []).map((item) => [
      item.regionId,
      item,
    ])
  )
  const mustMatchReasonById = new Map(
    (confirmedDesignRestoreInput?.mustMatchRegions ?? []).map((item) => [item.regionId, item.reason])
  )
  const regionBlockMappings = regionShapes.map((regionShape) => {
    const dominantBlock = inferDominantBlock(regionShape)
    const restoreDecision = regionDecisionById.get(regionShape.regionId) || null

    return {
      regionId: regionShape.regionId,
      regionRole: regionShape.regionRole,
      dominantBlock,
      approvedCarrier: inferApprovedCarrier(dominantBlock),
      recommendedPrimitive: inferRecommendedPrimitive(dominantBlock, regionShape),
      entityShape: regionShape.entityShape,
      updateMode: regionShape.updateMode,
      visualizationHint: regionShape.visualizationHint,
      designRestoreRegionBinding: restoreDecision
        ? {
            regionType: restoreDecision.regionType,
            priority: restoreDecision.priority,
            mustMatch: restoreDecision.mustMatch === true,
            mustMatchReason: mustMatchReasonById.get(regionShape.regionId) || '',
            preferredHiuiStrategy: restoreDecision.preferredHiuiStrategy,
            allowedAdaptationLevel: restoreDecision.allowedAdaptationLevel,
            riskLevel: restoreDecision.riskLevel,
            mustKeepAssets: cloneJson(restoreDecision.mustKeepAssets ?? []),
            riskNotes: cloneJson(restoreDecision.riskNotes ?? []),
          }
        : null,
    }
  })

  const chartDriven =
    decisionPackage.dataShape?.chartUsage === 'primary' ||
    regionBlockMappings.some((item) => item.dominantBlock === 'chart-insight')

  return {
    designMapPath: NON_TYPICAL_BLOCK_DESIGN_MAP_PATH,
    derivedFrom: confirmedDesignRestoreInput
      ? 'decisionPackage.dataShape + confirmedDesignRestoreInput.restoreDecisionPackage'
      : 'decisionPackage.dataShape',
    chartPolicy: chartDriven ? 'inherit-hiui-chart-theme-only' : 'not-applicable',
    regionBlockMappings,
  }
}

function buildRestorePrimitivePlan({
  confirmedDesignRestoreInput = null,
  designMappingPlan = null,
}) {
  if (!confirmedDesignRestoreInput) return null

  const regionBlockMappingById = new Map(
    (designMappingPlan?.regionBlockMappings ?? []).map((item) => [item.regionId, item])
  )
  const mustMatchReasonById = new Map(
    (confirmedDesignRestoreInput.mustMatchRegions ?? []).map((item) => [item.regionId, item.reason])
  )

  const regionBindings = (confirmedDesignRestoreInput.restoreDecisionPackage?.regionDecisionTable ?? []).map(
    (regionDecision) => {
      const mapped = regionBlockMappingById.get(regionDecision.regionId) || null
      const dominantBlock =
        mapped?.dominantBlock || inferDominantBlockFromRestoreDecision(regionDecision)

      return {
        regionId: regionDecision.regionId,
        regionRole: mapped?.regionRole || '',
        regionType: regionDecision.regionType,
        priority: regionDecision.priority,
        mustMatch: regionDecision.mustMatch === true,
        mustMatchReason: mustMatchReasonById.get(regionDecision.regionId) || '',
        preferredHiuiStrategy: regionDecision.preferredHiuiStrategy,
        allowedAdaptationLevel: regionDecision.allowedAdaptationLevel,
        riskLevel: regionDecision.riskLevel,
        dominantBlock,
        approvedCarrier:
          mapped?.approvedCarrier ||
          inferApprovedCarrierFromRestoreDecision(regionDecision, dominantBlock),
        recommendedPrimitive:
          mapped?.recommendedPrimitive ||
          inferRecommendedPrimitiveFromRestoreDecision(regionDecision, dominantBlock),
        mustKeepAssets: cloneJson(regionDecision.mustKeepAssets ?? []),
        riskNotes: cloneJson(regionDecision.riskNotes ?? []),
      }
    }
  )

  const matchedRegionIds = regionBindings
    .filter((item) => Boolean(regionBlockMappingById.get(item.regionId)))
    .map((item) => item.regionId)
  const unmatchedRegionIds = regionBindings
    .filter((item) => !regionBlockMappingById.has(item.regionId))
    .map((item) => item.regionId)

  return {
    inputMode: confirmedDesignRestoreInput.inputMode,
    pageGoal: confirmedDesignRestoreInput.restoreDecisionPackage?.pageGoal || '',
    layoutIntent: confirmedDesignRestoreInput.restoreDecisionPackage?.layoutIntent || '',
    allowedAdaptationLevel: confirmedDesignRestoreInput.allowedAdaptationLevel || '',
    mustMatchRegionIds: cloneJson(
      (confirmedDesignRestoreInput.mustMatchRegions ?? []).map((item) => item.regionId)
    ),
    assetPolicy: cloneJson(confirmedDesignRestoreInput.assetPolicy ?? {}),
    mappingCoverage: {
      matchedRegionIds,
      unmatchedRegionIds,
    },
    regionBindings,
  }
}

export function buildNonTypicalExecutionBrief({
  workflowEntry,
  workflowManifestPath,
  archetype,
  archetypeManifestPath,
  coordinationPatternManifestPath,
  nonTypicalConversationOutput,
  confirmedDesignRestoreInput = null,
  resolvedMode,
  businessTarget,
}) {
  const decisionPackage = cloneJson(nonTypicalConversationOutput.nonTypicalDecisionPackage)
  const designMappingPlan = buildNonTypicalDesignMappingPlan({
    decisionPackage,
    confirmedDesignRestoreInput,
  })
  const restorePrimitivePlan = buildRestorePrimitivePlan({
    confirmedDesignRestoreInput,
    designMappingPlan,
  })

  return {
    schema: 'hiui-design-non-typical-execution-brief.v1',
    pageFamily: NON_TYPICAL_PAGE_FAMILY,
    workflowId: workflowEntry.workflowId,
    workflowLabel: workflowEntry.label,
    briefMode: workflowEntry.briefMode,
    workflowManifestPath,
    archetypeManifestPath,
    coordinationPatternManifestPath: coordinationPatternManifestPath || archetypeManifestPath,
    readiness: {
      status: workflowEntry.status,
      plannerReady: workflowEntry.plannerReady === true,
      briefReady: workflowEntry.briefReady === true,
      generatorReady: workflowEntry.generatorReady === true,
      legacyRefactorReady: workflowEntry.legacyRefactorReady === true,
    },
    classification: cloneJson(nonTypicalConversationOutput.classification),
    decisionPackage,
    coordinationPattern: {
      coordinationPatternId: archetype.coordinationPatternId || archetype.archetypeId,
      label: archetype.label,
      description: archetype.description,
      requiredPrimitives: cloneJson(archetype.requiredPrimitives ?? []),
      optionalPrimitives: cloneJson(archetype.optionalPrimitives ?? []),
      requiredRegions: cloneJson(archetype.requiredRegions ?? []),
      primaryRegionRule: archetype.primaryRegionRule || '',
      stopRules: cloneJson(archetype.stopRules ?? []),
      coordinationSchema: cloneJson(archetype.coordinationSchema ?? {}),
    },
    archetype: {
      archetypeId: archetype.archetypeId,
      coordinationPatternId: archetype.coordinationPatternId || archetype.archetypeId,
      label: archetype.label,
      description: archetype.description,
      requiredPrimitives: cloneJson(archetype.requiredPrimitives ?? []),
      optionalPrimitives: cloneJson(archetype.optionalPrimitives ?? []),
      requiredRegions: cloneJson(archetype.requiredRegions ?? []),
      primaryRegionRule: archetype.primaryRegionRule || '',
      stopRules: cloneJson(archetype.stopRules ?? []),
      coordinationSchema: cloneJson(archetype.coordinationSchema ?? {}),
    },
    primitivePlan: {
      frame: 'NonTypicalPageFrame',
      pageHeaderPlan: cloneJson(decisionPackage.pageHeaderPlan),
      whiteBodyPlan: cloneJson(decisionPackage.whiteBodyPlan),
      regionPlan: cloneJson(decisionPackage.regionPlan),
      requiredPrimitives: cloneJson(archetype.requiredPrimitives ?? []),
      optionalPrimitives: cloneJson(archetype.optionalPrimitives ?? []),
      restorePrimitivePlan: cloneJson(restorePrimitivePlan),
    },
    restorePrimitivePlan: cloneJson(restorePrimitivePlan),
    designMappingPlan,
    coordinationBindings: {
      modelType: decisionPackage.coordinationModel.type,
      coordinationPatternId:
        decisionPackage.coordinationModel.coordinationPatternId ||
        decisionPackage.coordinationModel.type,
      sourceRegion: decisionPackage.coordinationModel.sourceRegion,
      targetRegions: cloneJson(decisionPackage.coordinationModel.targetRegions),
      interactionRule: decisionPackage.coordinationModel.interactionRule,
      sourceRegionRole: archetype.coordinationSchema?.sourceRegionRole || '',
      targetRegionRoles: cloneJson(archetype.coordinationSchema?.targetRegionRoles ?? []),
      requiredInteractionRule: archetype.coordinationSchema?.requiredInteractionRule || '',
    },
    integrationPlan: {
      mode: resolvedMode,
      supportedInputModes: cloneJson(workflowEntry.supportedInputModes ?? []),
      supportedIntegrationModes: cloneJson(workflowEntry.supportedIntegrationModes ?? []),
      supportedScenarios: cloneJson(workflowEntry.supportedScenarios ?? []),
      supportedCoordinationPatterns: cloneJson(
        workflowEntry.supportedCoordinationPatterns ?? workflowEntry.supportedArchetypes ?? []
      ),
      supportedArchetypes: cloneJson(workflowEntry.supportedArchetypes ?? []),
      targetBusinessPath: businessTarget.targetBusinessPath,
      previewReferencePolicy: businessTarget.previewReferencePolicy,
      routeIsolationPolicy: businessTarget.routeIsolationPolicy,
    },
    lightSanityPlan: {
      requiredDecisionFields: cloneJson(workflowEntry.requiredDecisionFields ?? []),
      lightSanityChecks: cloneJson(workflowEntry.lightSanityChecks ?? []),
      blockedConditions: cloneJson(workflowEntry.blockedConditions ?? []),
      coordinationPatternStopRules: cloneJson(archetype.stopRules ?? []),
      archetypeStopRules: cloneJson(archetype.stopRules ?? []),
      designSystemPolicy: cloneJson(workflowEntry.designSystemPolicy ?? {}),
    },
  }
}

export function buildNonTypicalDocSet({ workflowEntry, familyContract }) {
  return unique([
    familyContract.workflowManifestPath,
    familyContract.coordinationPatternManifestPath || familyContract.archetypeManifestPath,
    familyContract.archetypeManifestPath,
    NON_TYPICAL_BLOCK_DESIGN_MAP_PATH,
    'docs/generation/non-typical-ai-generation-guidance.md',
    'docs/generation/non-typical-conversation-output-template.md',
    'docs/generation/non-typical-page-contract.json',
    ...(workflowEntry?.planningDocs ?? []),
  ])
}
