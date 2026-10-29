import path from 'node:path'

const DESIGN_RESTORE_INPUT_MODE_DEFINITIONS = {
  'figma-design-restore': {
    label: 'Figma 设计还原',
    evidenceType: 'structured-design-reference',
  },
  'design-screenshot-restore': {
    label: '设计稿截图还原',
    evidenceType: 'design-visual-reference',
  },
}

const ALLOWED_ADAPTATION_LEVELS = new Set([
  'none',
  'props-only',
  'wrapper-only',
  'light-extension',
])

const ALLOWED_RISK_LEVELS = new Set(['low', 'medium', 'high'])

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function isPlainObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
}

function normalizeString(value) {
  return String(value || '').trim()
}

function normalizeStringArray(value) {
  return [...new Set(asArray(value).map((item) => normalizeString(item)).filter(Boolean))]
}

function normalizeBoolean(value, fallback = false) {
  return typeof value === 'boolean' ? value : fallback
}

function normalizePositiveInteger(value) {
  const normalized = Number(value)
  return Number.isInteger(normalized) && normalized > 0 ? normalized : undefined
}

function normalizeHintText(...values) {
  return values
    .map((value) => normalizeString(value).toLowerCase())
    .filter(Boolean)
    .join(' ')
}

export function isDesignRestoreInputMode(inputModeId) {
  return Boolean(DESIGN_RESTORE_INPUT_MODE_DEFINITIONS[normalizeString(inputModeId)])
}

export function normalizeDesignRestoreInputMode(inputModeId) {
  const normalizedId = normalizeString(inputModeId)
  const definition = DESIGN_RESTORE_INPUT_MODE_DEFINITIONS[normalizedId]
  if (!definition) return null

  return {
    id: normalizedId,
    label: definition.label,
    evidenceType: definition.evidenceType,
  }
}

function normalizeDesignRestoreEvidence(inputModeId, value) {
  if (!isPlainObject(value)) {
    return {
      figmaUrl: '',
      fileKey: '',
      nodeId: '',
      screenshotPath: '',
    }
  }

  return {
    figmaUrl: normalizeString(value.figmaUrl),
    fileKey: normalizeString(value.fileKey),
    nodeId: normalizeString(value.nodeId),
    screenshotPath:
      inputModeId === 'design-screenshot-restore' ? normalizeString(value.screenshotPath) : '',
  }
}

function normalizeTargetViewport(value) {
  if (!isPlainObject(value)) {
    return {
      kind: '',
      width: undefined,
    }
  }

  return {
    kind: normalizeString(value.kind),
    width: normalizePositiveInteger(value.width),
  }
}

function normalizeTargetState(value) {
  if (!isPlainObject(value)) {
    return {
      stateId: '',
      label: '',
    }
  }

  return {
    stateId: normalizeString(value.stateId),
    label: normalizeString(value.label),
  }
}

function normalizeMustMatchRegion(value) {
  if (!isPlainObject(value)) {
    return {
      regionId: '',
      reason: '',
    }
  }

  return {
    regionId: normalizeString(value.regionId),
    reason: normalizeString(value.reason),
  }
}

function normalizeAssetPolicy(value) {
  if (!isPlainObject(value)) {
    return {
      icons: '',
      images: '',
      allowHandwrittenReplacement: false,
    }
  }

  return {
    icons: normalizeString(value.icons),
    images: normalizeString(value.images),
    allowHandwrittenReplacement: normalizeBoolean(value.allowHandwrittenReplacement, false),
  }
}

function normalizeRecognizedControl(value) {
  if (!isPlainObject(value)) {
    return {
      controlType: '',
      labelText: '',
      visualRole: '',
    }
  }

  return {
    controlType: normalizeString(value.controlType),
    labelText: normalizeString(value.labelText),
    visualRole: normalizeString(value.visualRole),
  }
}

function normalizeLayoutRelation(value) {
  if (!isPlainObject(value)) {
    return {
      type: '',
      sourceId: '',
      targetId: '',
      description: '',
    }
  }

  return {
    type: normalizeString(value.type),
    sourceId: normalizeString(value.sourceId),
    targetId: normalizeString(value.targetId),
    description: normalizeString(value.description),
  }
}

function normalizeRegionDecision(value) {
  if (!isPlainObject(value)) {
    return {
      regionId: '',
      regionType: '',
      priority: '',
      mustMatch: false,
      preferredHiuiStrategy: '',
      allowedAdaptationLevel: '',
      riskLevel: '',
      recognizedControls: [],
      layoutRelations: [],
      mustKeepAssets: [],
      riskNotes: [],
    }
  }

  return {
    regionId: normalizeString(value.regionId),
    regionType: normalizeString(value.regionType),
    priority: normalizeString(value.priority),
    mustMatch: normalizeBoolean(value.mustMatch, false),
    preferredHiuiStrategy: normalizeString(value.preferredHiuiStrategy),
    allowedAdaptationLevel: normalizeString(value.allowedAdaptationLevel),
    riskLevel: normalizeString(value.riskLevel),
    recognizedControls: asArray(value.recognizedControls).map((item) =>
      normalizeRecognizedControl(item)
    ),
    layoutRelations: asArray(value.layoutRelations).map((item) => normalizeLayoutRelation(item)),
    mustKeepAssets: normalizeStringArray(value.mustKeepAssets),
    riskNotes: normalizeStringArray(value.riskNotes),
  }
}

function normalizeRestoreDecisionPackage(value) {
  if (!isPlainObject(value)) {
    return {
      pageGoal: '',
      layoutIntent: '',
      regionDecisionTable: [],
    }
  }

  return {
    pageGoal: normalizeString(value.pageGoal),
    layoutIntent: normalizeString(value.layoutIntent),
    regionDecisionTable: asArray(value.regionDecisionTable).map((item) =>
      normalizeRegionDecision(item)
    ),
  }
}

function inferRegionType(regionId, reason = '') {
  const hint = normalizeHintText(regionId, reason)

  if (
    hint.includes('page-header') ||
    hint.includes('header') ||
    hint.includes('页头') ||
    hint.includes('标题')
  ) {
    return 'page-header'
  }
  if (
    hint.includes('stage') ||
    hint.includes('timeline') ||
    hint.includes('step') ||
    hint.includes('rail') ||
    hint.includes('阶段') ||
    hint.includes('流程')
  ) {
    return 'stage-navigation'
  }
  if (
    hint.includes('snapshot') ||
    hint.includes('summary') ||
    hint.includes('inspector') ||
    hint.includes('side panel') ||
    hint.includes('快照') ||
    hint.includes('摘要')
  ) {
    return 'snapshot-panel'
  }
  if (
    hint.includes('metric') ||
    hint.includes('kpi') ||
    hint.includes('stat') ||
    hint.includes('overview') ||
    hint.includes('指标') ||
    hint.includes('统计')
  ) {
    return 'metric-summary'
  }
  if (
    hint.includes('chart') ||
    hint.includes('graph') ||
    hint.includes('trend') ||
    hint.includes('图表') ||
    hint.includes('趋势')
  ) {
    return 'chart-insight'
  }
  if (
    hint.includes('filter') ||
    hint.includes('query') ||
    hint.includes('search') ||
    hint.includes('筛选') ||
    hint.includes('查询')
  ) {
    return 'query-filter'
  }
  if (
    hint.includes('table') ||
    hint.includes('grid') ||
    hint.includes('list') ||
    hint.includes('表格') ||
    hint.includes('列表')
  ) {
    return 'data-table'
  }
  if (
    hint.includes('form') ||
    hint.includes('field') ||
    hint.includes('editor') ||
    hint.includes('edit') ||
    hint.includes('表单') ||
    hint.includes('编辑')
  ) {
    return 'form-fields'
  }
  if (
    hint.includes('action') ||
    hint.includes('button') ||
    hint.includes('toolbar') ||
    hint.includes('footer') ||
    hint.includes('操作') ||
    hint.includes('按钮')
  ) {
    return 'action-strip'
  }
  if (
    hint.includes('tree') ||
    hint.includes('left-pane') ||
    hint.includes('left pane') ||
    hint.includes('sidebar') ||
    hint.includes('目录') ||
    hint.includes('左侧')
  ) {
    return 'tree-pane'
  }
  if (
    hint.includes('detail') ||
    hint.includes('description') ||
    hint.includes('section') ||
    hint.includes('详情') ||
    hint.includes('描述')
  ) {
    return 'detail-sections'
  }
  if (
    hint.includes('workspace') ||
    hint.includes('body') ||
    hint.includes('content') ||
    hint.includes('main') ||
    hint.includes('工作区') ||
    hint.includes('主体')
  ) {
    return 'primary-workspace'
  }

  return 'detail-sections'
}

function inferPreferredHiuiStrategy(regionType) {
  switch (regionType) {
    case 'page-header':
      return 'page-header-structure'
    case 'stage-navigation':
      return 'stage-rail-structure'
    case 'snapshot-panel':
      return 'snapshot-panel-structure'
    case 'metric-summary':
      return 'metric-card-group'
    case 'chart-insight':
      return 'chart-card-group'
    case 'query-filter':
      return 'query-filter-strip'
    case 'data-table':
      return 'data-table-structure'
    case 'form-fields':
      return 'form-section-structure'
    case 'action-strip':
      return 'action-strip-structure'
    case 'tree-pane':
      return 'tree-pane-structure'
    case 'primary-workspace':
      return 'workspace-shell'
    default:
      return 'detail-section-groups'
  }
}

function inferPriority({ mustMatch = false, regionType = '' } = {}) {
  if (mustMatch) return 'p0'
  if (regionType === 'page-header' || regionType === 'primary-workspace') return 'p1'
  return 'p2'
}

function inferRiskLevel({
  inputMode = '',
  regionType = '',
  allowedAdaptationLevel = '',
}) {
  if (allowedAdaptationLevel === 'none' || allowedAdaptationLevel === 'props-only') {
    return inputMode === 'design-screenshot-restore' ? 'medium' : 'low'
  }

  if (
    inputMode === 'design-screenshot-restore' ||
    regionType === 'chart-insight' ||
    regionType === 'tree-pane'
  ) {
    return 'medium'
  }

  return 'low'
}

function inferRecognizedControls(regionType) {
  switch (regionType) {
    case 'page-header':
      return [
        {
          controlType: 'page-title',
          labelText: 'Page Header',
          visualRole: 'title',
        },
      ]
    case 'query-filter':
      return [
        {
          controlType: 'query-filter',
          labelText: 'Query Filter',
          visualRole: 'filter-strip',
        },
      ]
    case 'data-table':
      return [
        {
          controlType: 'data-table',
          labelText: 'Data Table',
          visualRole: 'primary-data-grid',
        },
      ]
    case 'form-fields':
      return [
        {
          controlType: 'schema-form',
          labelText: 'Schema Form',
          visualRole: 'form-workspace',
        },
      ]
    case 'stage-navigation':
      return [
        {
          controlType: 'stage-rail',
          labelText: 'Stage Rail',
          visualRole: 'stage-navigation',
        },
      ]
    case 'snapshot-panel':
      return [
        {
          controlType: 'snapshot-panel',
          labelText: 'Snapshot Panel',
          visualRole: 'supporting-panel',
        },
      ]
    default:
      return []
  }
}

function inferPageGoal({ pageGoal, confirmation, targetState }) {
  if (pageGoal) return pageGoal
  if (confirmation?.finalPrompt) return confirmation.finalPrompt
  if (targetState?.label) {
    return `在 ${targetState.label} 状态下完成设计还原页面生成`
  }
  return ''
}

function inferLayoutIntent({ layoutIntent, materializedRegionDecisionTable, targetViewport }) {
  if (layoutIntent) return layoutIntent

  const regionTypes = new Set(materializedRegionDecisionTable.map((item) => item.regionType))

  if (regionTypes.has('page-header') && regionTypes.has('stage-navigation')) {
    return 'header -> workspace -> stage rail'
  }
  if (regionTypes.has('page-header') && regionTypes.has('snapshot-panel')) {
    return 'header -> workspace -> side snapshot'
  }
  if (regionTypes.has('page-header') && regionTypes.has('query-filter') && regionTypes.has('data-table')) {
    return 'header -> query filter -> table'
  }
  if (regionTypes.has('page-header') && regionTypes.has('tree-pane') && regionTypes.has('data-table')) {
    return 'header -> tree split workspace'
  }
  if (regionTypes.has('page-header') && regionTypes.has('form-fields')) {
    return 'header -> form workspace'
  }
  if (regionTypes.has('page-header') && regionTypes.has('detail-sections')) {
    return 'header -> detail workspace'
  }

  if (targetViewport?.kind) {
    return `${targetViewport.kind} workspace`
  }
  return ''
}

function materializeRegionDecision({
  explicitDecision = null,
  mustMatchRegion = null,
  inputMode = '',
  defaultAllowedAdaptationLevel = '',
}) {
  const regionId = normalizeString(explicitDecision?.regionId || mustMatchRegion?.regionId)
  const reason = normalizeString(mustMatchRegion?.reason)
  const regionType = normalizeString(explicitDecision?.regionType) || inferRegionType(regionId, reason)
  const mustMatch = explicitDecision?.mustMatch === true || Boolean(mustMatchRegion)
  const preferredHiuiStrategy =
    normalizeString(explicitDecision?.preferredHiuiStrategy) || inferPreferredHiuiStrategy(regionType)
  const allowedAdaptationLevel =
    normalizeString(explicitDecision?.allowedAdaptationLevel) || defaultAllowedAdaptationLevel
  const riskLevel =
    normalizeString(explicitDecision?.riskLevel) ||
    inferRiskLevel({
      inputMode,
      regionType,
      allowedAdaptationLevel,
    })
  const recognizedControls =
    asArray(explicitDecision?.recognizedControls).length > 0
      ? asArray(explicitDecision.recognizedControls).map((item) => normalizeRecognizedControl(item))
      : inferRecognizedControls(regionType)

  return {
    regionId,
    regionType,
    priority: normalizeString(explicitDecision?.priority) || inferPriority({ mustMatch, regionType }),
    mustMatch,
    preferredHiuiStrategy,
    allowedAdaptationLevel,
    riskLevel,
    recognizedControls,
    layoutRelations: asArray(explicitDecision?.layoutRelations).map((item) => normalizeLayoutRelation(item)),
    mustKeepAssets: normalizeStringArray(explicitDecision?.mustKeepAssets),
    riskNotes: normalizeStringArray(explicitDecision?.riskNotes),
  }
}

function materializeRestoreDecisionPackage({
  inputMode,
  restoreDecisionPackage,
  mustMatchRegions,
  allowedAdaptationLevel,
  targetViewport,
  targetState,
  confirmation,
}) {
  const normalizedRestoreDecisionPackage = normalizeRestoreDecisionPackage(restoreDecisionPackage)
  const normalizedMustMatchRegions = asArray(mustMatchRegions).map((item) => normalizeMustMatchRegion(item))
  const explicitRegionDecisionById = new Map(
    normalizedRestoreDecisionPackage.regionDecisionTable.map((item) => [item.regionId, item])
  )
  const materializedRegionDecisionTable = []

  for (const explicitDecision of normalizedRestoreDecisionPackage.regionDecisionTable) {
    const mustMatchRegion =
      normalizedMustMatchRegions.find((item) => item.regionId === explicitDecision.regionId) || null
    materializedRegionDecisionTable.push(
      materializeRegionDecision({
        explicitDecision,
        mustMatchRegion,
        inputMode,
        defaultAllowedAdaptationLevel: allowedAdaptationLevel,
      })
    )
  }

  for (const mustMatchRegion of normalizedMustMatchRegions) {
    if (explicitRegionDecisionById.has(mustMatchRegion.regionId)) continue
    materializedRegionDecisionTable.push(
      materializeRegionDecision({
        explicitDecision: null,
        mustMatchRegion,
        inputMode,
        defaultAllowedAdaptationLevel: allowedAdaptationLevel,
      })
    )
  }

  return {
    pageGoal: inferPageGoal({
      pageGoal: normalizedRestoreDecisionPackage.pageGoal,
      confirmation,
      targetState,
    }),
    layoutIntent: inferLayoutIntent({
      layoutIntent: normalizedRestoreDecisionPackage.layoutIntent,
      materializedRegionDecisionTable,
      targetViewport,
    }),
    regionDecisionTable: materializedRegionDecisionTable,
  }
}

function normalizeConfirmation(value) {
  if (!isPlainObject(value)) {
    return {
      confirmed: false,
      finalPrompt: '',
    }
  }

  return {
    confirmed: value.confirmed === true,
    finalPrompt: normalizeString(value.finalPrompt),
  }
}

export function normalizeConfirmedDesignRestoreInput(value) {
  if (!isPlainObject(value)) return null

  const inputMode = normalizeString(value.inputMode)
  const targetViewport = normalizeTargetViewport(value.targetViewport)
  const targetState = normalizeTargetState(value.targetState)
  const mustMatchRegions = asArray(value.mustMatchRegions).map((item) => normalizeMustMatchRegion(item))
  const allowedAdaptationLevel = normalizeString(value.allowedAdaptationLevel)
  const confirmation = normalizeConfirmation(value.confirmation)

  return {
    inputMode,
    evidence: normalizeDesignRestoreEvidence(inputMode, value.evidence),
    targetViewport,
    targetState,
    mustMatchRegions,
    allowedAdaptationLevel,
    assetPolicy: normalizeAssetPolicy(value.assetPolicy),
    restoreDecisionPackage: materializeRestoreDecisionPackage({
      inputMode,
      restoreDecisionPackage: value.restoreDecisionPackage,
      mustMatchRegions,
      allowedAdaptationLevel,
      targetViewport,
      targetState,
      confirmation,
    }),
    confirmation,
  }
}

export function validateConfirmedDesignRestoreInput({
  normalizedInputMode,
  confirmedDesignRestoreInput,
}) {
  const violations = []
  const normalizedInputModeId = normalizeString(normalizedInputMode?.id)
  const expectsDesignRestoreInput = isDesignRestoreInputMode(normalizedInputModeId)

  if (!expectsDesignRestoreInput) {
    if (confirmedDesignRestoreInput) {
      violations.push(
        'confirmedDesignRestoreInput is only allowed when inputMode is a design-restore mode'
      )
    }
    return violations
  }

  if (!confirmedDesignRestoreInput) {
    violations.push(`${normalizedInputModeId} mode requires confirmedDesignRestoreInput`)
    return violations
  }

  if (confirmedDesignRestoreInput.inputMode !== normalizedInputModeId) {
    violations.push(`confirmedDesignRestoreInput.inputMode must equal ${normalizedInputModeId}`)
  }

  if (normalizedInputModeId === 'figma-design-restore') {
    if (!confirmedDesignRestoreInput.evidence.figmaUrl) {
      violations.push('confirmedDesignRestoreInput.evidence.figmaUrl is required')
    }
    if (!confirmedDesignRestoreInput.evidence.nodeId) {
      violations.push('confirmedDesignRestoreInput.evidence.nodeId is required')
    }
  }

  if (normalizedInputModeId === 'design-screenshot-restore') {
    if (!confirmedDesignRestoreInput.evidence.screenshotPath) {
      violations.push('confirmedDesignRestoreInput.evidence.screenshotPath is required')
    } else if (!path.isAbsolute(confirmedDesignRestoreInput.evidence.screenshotPath)) {
      violations.push(
        'confirmedDesignRestoreInput.evidence.screenshotPath must be an absolute path'
      )
    }
  }

  if (!confirmedDesignRestoreInput.targetViewport.kind) {
    violations.push('confirmedDesignRestoreInput.targetViewport.kind is required')
  }
  if (!confirmedDesignRestoreInput.targetViewport.width) {
    violations.push('confirmedDesignRestoreInput.targetViewport.width is required')
  }
  if (!confirmedDesignRestoreInput.targetState.stateId) {
    violations.push('confirmedDesignRestoreInput.targetState.stateId is required')
  }
  if (!confirmedDesignRestoreInput.targetState.label) {
    violations.push('confirmedDesignRestoreInput.targetState.label is required')
  }
  if (confirmedDesignRestoreInput.mustMatchRegions.length === 0) {
    violations.push('confirmedDesignRestoreInput.mustMatchRegions must be a non-empty array')
  }
  if (!ALLOWED_ADAPTATION_LEVELS.has(confirmedDesignRestoreInput.allowedAdaptationLevel)) {
    violations.push(
      `confirmedDesignRestoreInput.allowedAdaptationLevel must be one of ${Array.from(ALLOWED_ADAPTATION_LEVELS).join(', ')}`
    )
  }
  if (!confirmedDesignRestoreInput.assetPolicy.icons) {
    violations.push('confirmedDesignRestoreInput.assetPolicy.icons is required')
  }
  if (!confirmedDesignRestoreInput.assetPolicy.images) {
    violations.push('confirmedDesignRestoreInput.assetPolicy.images is required')
  }
  if (!confirmedDesignRestoreInput.restoreDecisionPackage.pageGoal) {
    violations.push('confirmedDesignRestoreInput.restoreDecisionPackage.pageGoal is required')
  }
  if (!confirmedDesignRestoreInput.restoreDecisionPackage.layoutIntent) {
    violations.push('confirmedDesignRestoreInput.restoreDecisionPackage.layoutIntent is required')
  }
  if (confirmedDesignRestoreInput.restoreDecisionPackage.regionDecisionTable.length === 0) {
    violations.push(
      'confirmedDesignRestoreInput.restoreDecisionPackage.regionDecisionTable must be a non-empty array'
    )
  }

  for (const [index, region] of confirmedDesignRestoreInput.restoreDecisionPackage.regionDecisionTable.entries()) {
    const prefix = `confirmedDesignRestoreInput.restoreDecisionPackage.regionDecisionTable[${index}]`
    if (!region.regionId) violations.push(`${prefix}.regionId is required`)
    if (!region.regionType) violations.push(`${prefix}.regionType is required`)
    if (!region.priority) violations.push(`${prefix}.priority is required`)
    if (!region.preferredHiuiStrategy) {
      violations.push(`${prefix}.preferredHiuiStrategy is required`)
    }
    if (!ALLOWED_ADAPTATION_LEVELS.has(region.allowedAdaptationLevel)) {
      violations.push(
        `${prefix}.allowedAdaptationLevel must be one of ${Array.from(ALLOWED_ADAPTATION_LEVELS).join(', ')}`
      )
    }
    if (!ALLOWED_RISK_LEVELS.has(region.riskLevel)) {
      violations.push(
        `${prefix}.riskLevel must be one of ${Array.from(ALLOWED_RISK_LEVELS).join(', ')}`
      )
    }
  }

  if (confirmedDesignRestoreInput.confirmation.confirmed !== true) {
    violations.push('design-restore mode requires chat confirmation before brief creation')
  }
  if (!confirmedDesignRestoreInput.confirmation.finalPrompt) {
    violations.push('confirmedDesignRestoreInput.confirmation.finalPrompt is required')
  }

  return violations
}

export function intakeDesignRestoreInput({
  inputMode,
  confirmedDesignRestoreInput,
}) {
  const normalizedInputMode = normalizeDesignRestoreInputMode(inputMode)
  const normalizedConfirmedDesignRestoreInput = normalizeConfirmedDesignRestoreInput(
    confirmedDesignRestoreInput
  )
  const violations = []

  if (!normalizedInputMode) {
    violations.push(
      `inputMode must be one of ${Object.keys(DESIGN_RESTORE_INPUT_MODE_DEFINITIONS).join(', ')}`
    )
  }

  violations.push(
    ...validateConfirmedDesignRestoreInput({
      normalizedInputMode,
      confirmedDesignRestoreInput: normalizedConfirmedDesignRestoreInput,
    })
  )

  return {
    inputMode: normalizedInputMode,
    confirmedDesignRestoreInput: normalizedConfirmedDesignRestoreInput,
    violations,
    ok: violations.length === 0,
  }
}
