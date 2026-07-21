import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultSkillRoot = path.resolve(scriptDir, '..', '..')

const chartSemanticPolicyPath = path.join(defaultSkillRoot, 'rules', 'chart-semantic-policy.json')
const dataVisualizationLayoutPolicyPath = path.join(
  defaultSkillRoot,
  'rules',
  'data-visualization-layout-policy.json'
)

let cachedPolicyBundle = null

function readJsonIfExists(targetPath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(targetPath, 'utf8'))
  } catch {
    return fallback
  }
}

function normalizeStringList(values) {
  if (!Array.isArray(values)) {
    return []
  }

  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))]
}

function normalizeStringMapOfLists(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, list]) => [String(key || '').trim(), normalizeStringList(list)])
      .filter(([key]) => Boolean(key))
  )
}

function normalizeManagedRegionPolicyByRole(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value)
      .map(([key, definition]) => {
        const normalizedKey = String(key || '').trim()
        if (!normalizedKey || !definition || typeof definition !== 'object') {
          return null
        }

        return [
          normalizedKey,
          {
            controlScope: String(definition.controlScope || '').trim(),
            controlStripPlacement: String(definition.controlStripPlacement || '').trim(),
            controlStripVisualTreatment: String(
              definition.controlStripVisualTreatment || ''
            ).trim(),
            detailQueryFilterPolicy: String(definition.detailQueryFilterPolicy || '').trim(),
            mixedScopeControls: String(definition.mixedScopeControls || '').trim(),
          },
        ]
      })
      .filter(Boolean)
  )
}

const SUMMARY_CHART_TYPES = new Set(['pie', 'donut', 'radar', 'gauge'])
const CHART_SECTION_GRID_MODE_COLUMN_COUNT = {
  'two-column': 2,
  'three-column': 3,
  'four-column': 4,
}
const DEFAULT_GRID_MODE_BY_LAYOUT_ARCHETYPE = {
  'primary-secondary': 'three-column',
  'linear-stack': 'three-column',
  'parallel-sections': 'two-column',
}
const CHART_SECTION_GRID_MODE_CUES = [
  {
    mode: 'four-column',
    pattern:
      /(四栏布局|四列布局|4栏布局|4列布局|四栏图表|四列图表|一行四图|四图并排|四等分图表)/i,
  },
  {
    mode: 'three-column',
    pattern: /(三栏布局|三列布局|3栏布局|3列布局|三栏图表|三列图表|一主两辅|一行三图|三等分图表)/i,
  },
  {
    mode: 'two-column',
    pattern:
      /(双栏布局|两栏布局|二栏布局|双列布局|两列布局|二列布局|2栏布局|2列布局|两栏图表|双栏图表|双图对比|左右双图|并排双图|二等分图表)/i,
  },
]
const CHART_SECTION_BLOCK_PATTERNS = [
  /<SectionBlock\b(?=[^>]*\bregion\s*=\s*["']chart-section["'])[^>]*>[\s\S]*?<\/SectionBlock>/g,
  /<section\b(?=[^>]*\bdata-hiui5-region\s*=\s*["']chart-section["'])[^>]*>[\s\S]*?<\/section>/g,
]

function resolvePolicyBundle(skillRoot = defaultSkillRoot) {
  if (skillRoot === defaultSkillRoot && cachedPolicyBundle) {
    return cachedPolicyBundle
  }

  const bundle = {
    chartSemanticPolicy: readJsonIfExists(
      skillRoot === defaultSkillRoot
        ? chartSemanticPolicyPath
        : path.join(skillRoot, 'rules', 'chart-semantic-policy.json'),
      { chartTypes: {} }
    ),
    dataVisualizationLayoutPolicy: readJsonIfExists(
      skillRoot === defaultSkillRoot
        ? dataVisualizationLayoutPolicyPath
        : path.join(skillRoot, 'rules', 'data-visualization-layout-policy.json'),
      { layoutTemplates: {}, visualBaseline: {} }
    ),
  }

  if (skillRoot === defaultSkillRoot) {
    cachedPolicyBundle = bundle
  }

  return bundle
}

function isProcessCentricBrief(changeText) {
  return /(流程|阶段|漏斗|链路|路径|时序|逐步|预约|跟进|入职|process|funnel)/i.test(
    String(changeText || '')
  )
}

function laneToRole(readingLane) {
  const lane = String(readingLane || '').trim()
  if (lane === 'primary') return 'primary'
  if (lane === 'summary') return 'summary'
  if (lane === 'full-span follow-up' || lane === 'full-span-follow-up' || lane === 'follow-up') {
    return 'follow-up'
  }
  return lane ? 'supporting' : ''
}

function laneToRegionPriority(readingLane) {
  const lane = String(readingLane || '').trim()
  if (lane === 'primary') return 'primary'
  if (lane === 'summary') return 'summary'
  if (lane === 'full-span follow-up' || lane === 'full-span-follow-up' || lane === 'follow-up') {
    return 'follow-up'
  }
  if (lane === 'secondary') return 'secondary'
  return ''
}

function getConditionalPrimaryChartFamilies(template, processCentric) {
  return new Set(
    processCentric ? normalizeStringList(template?.primaryRegion?.conditionalPrimaryChartFamilies) : []
  )
}

function normalizeChartSectionGridMode(mode, allowedBaseGridModes) {
  const normalizedMode = String(mode || '').trim()

  if (normalizedMode && allowedBaseGridModes.includes(normalizedMode)) {
    return normalizedMode
  }

  return ''
}

function inferChartSectionBaseGridMode({
  allowedBaseGridModes,
  changeText = '',
  layoutArchetype = '',
} = {}) {
  const normalizedChangeText = String(changeText || '').trim()

  for (const cue of CHART_SECTION_GRID_MODE_CUES) {
    if (cue.pattern.test(normalizedChangeText) && allowedBaseGridModes.includes(cue.mode)) {
      return cue.mode
    }
  }

  const defaultMode = normalizeChartSectionGridMode(
    DEFAULT_GRID_MODE_BY_LAYOUT_ARCHETYPE[String(layoutArchetype || '').trim()],
    allowedBaseGridModes
  )
  if (defaultMode) {
    return defaultMode
  }

  if (allowedBaseGridModes.includes('three-column')) {
    return 'three-column'
  }

  return allowedBaseGridModes[0] || ''
}

function buildChartSectionLayoutPlan({
  changeText = '',
  layoutArchetype = '',
  gridPolicy = {},
} = {}) {
  const allowedBaseGridModes = normalizeStringList(gridPolicy?.allowedBaseGridModes)
  const baseGridMode = inferChartSectionBaseGridMode({
    allowedBaseGridModes,
    changeText,
    layoutArchetype,
  })
  const modeDefinition =
    gridPolicy?.modes?.[baseGridMode] && typeof gridPolicy.modes[baseGridMode] === 'object'
      ? gridPolicy.modes[baseGridMode]
      : {}
  const minChartSpanColumns =
    Number.isFinite(Number(modeDefinition?.minChartSpan)) &&
    Number(modeDefinition.minChartSpan) > 0
      ? Number(modeDefinition.minChartSpan)
      : 1

  return {
    schemaVersion: 'chart-section-layout-plan.v1',
    source: 'rules/data-visualization-layout-policy.json',
    scope: String(gridPolicy?.scope || '').trim(),
    baseGridMode,
    baseColumnCount: CHART_SECTION_GRID_MODE_COLUMN_COUNT[baseGridMode] || 0,
    allowedBaseGridModes,
    consistencyScope: String(gridPolicy?.consistencyScope || '').trim(),
    fullSpanPolicy: String(gridPolicy?.fullSpanPolicy || '').trim(),
    fullSpanNeutral: String(gridPolicy?.fullSpanPolicy || '').trim() === '12-is-neutral-span',
    fullSpanSpan: 12,
    defaultAssumption: String(gridPolicy?.defaultAssumption || '').trim(),
    excludedContentTypes: normalizeStringList(gridPolicy?.excludeContentTypes),
    allowedPatterns: normalizeStringList(modeDefinition?.allowedPatterns),
    forbiddenPatterns: normalizeStringList(modeDefinition?.forbiddenPatterns),
    minChartSpanColumns,
    forbiddenMixedModeExamples: normalizeStringList(gridPolicy?.forbiddenMixedModeExamples),
  }
}

function extractChartSectionBlocks(sourceRaw) {
  const blocks = []
  const normalizedSource = String(sourceRaw || '')

  for (const pattern of CHART_SECTION_BLOCK_PATTERNS) {
    let match = pattern.exec(normalizedSource)
    while (match) {
      const block = String(match[0] || '')
      if (block) {
        blocks.push(block)
      }
      match = pattern.exec(normalizedSource)
    }
  }

  return blocks
}

function extractManagedCardGridRows(sectionRaw) {
  const rows = []
  const pattern = /<ManagedCardGrid\b([^>]*)>([\s\S]*?)<\/ManagedCardGrid>/g
  let match = pattern.exec(sectionRaw)

  while (match) {
    rows.push({
      propsRaw: String(match[1] || ''),
      bodyRaw: String(match[2] || ''),
      raw: String(match[0] || ''),
    })
    match = pattern.exec(sectionRaw)
  }

  return rows
}

function extractStringProp(raw, propName) {
  const matched = String(raw || '').match(
    new RegExp(`\\b${propName}\\s*=\\s*["']([^"']+)["']`)
  )
  return matched?.[1] ? String(matched[1]).trim() : ''
}

function extractNumericProp(raw, propName) {
  const matched = String(raw || '').match(
    new RegExp(`\\b${propName}\\s*=\\s*(?:\\{\\s*)?(\\d+)(?:\\s*\\})?`)
  )
  return matched?.[1] ? Number(matched[1]) : null
}

function classifyChartSectionContentType(raw) {
  const normalizedRaw = String(raw || '')

  if (/\bManagedMetricCard\b/.test(normalizedRaw)) {
    return 'metric-card'
  }

  if (/\bManagedChartCard\b/.test(normalizedRaw)) {
    return 'chart-card'
  }

  if (/\bManagedSurfaceCard\b/.test(normalizedRaw)) {
    return 'surface-card'
  }

  return 'unknown'
}

function extractChartGridItems(raw) {
  const items = []
  const normalizedRaw = String(raw || '')
  const attributePattern =
    /<([A-Za-z][\w.]*)\b[^>]*\bdata-hiui5-chart-grid-span\s*=\s*(?:\{\s*)?["']?(\d+)["']?(?:\s*\})?[^>]*>([\s\S]*?)<\/\1>/g
  const managedGridItemPattern = /<ManagedChartGridItem\b([^>]*)>([\s\S]*?)<\/ManagedChartGridItem>/g

  let match = attributePattern.exec(normalizedRaw)

  while (match) {
    const span = Number(match[2] || 0)
    items.push({
      span,
      raw: String(match[0] || ''),
      contentRaw: String(match[3] || ''),
      contentType: classifyChartSectionContentType(match[3]),
    })
    match = attributePattern.exec(normalizedRaw)
  }

  match = managedGridItemPattern.exec(normalizedRaw)
  while (match) {
    const propsRaw = String(match[1] || '')
    const span = extractNumericProp(propsRaw, 'gridSpan')

    items.push({
      span: Number(span || 0),
      raw: String(match[0] || ''),
      contentRaw: String(match[2] || ''),
      contentType: classifyChartSectionContentType(match[2]),
    })
    match = managedGridItemPattern.exec(normalizedRaw)
  }

  return items
}

function buildChartRowPattern(items, excludedContentTypes) {
  return items
    .filter((item) => !excludedContentTypes.has(item.contentType))
    .map((item) => String(item.span))
    .filter(Boolean)
    .join('-')
}

export function analyzeManagedAnalyticsChartSectionLayout({
  sourceRaw = '',
  visualizationRolePlan,
} = {}) {
  const chartSectionLayoutPlan = visualizationRolePlan?.chartSectionLayoutPlan

  if (!chartSectionLayoutPlan || typeof chartSectionLayoutPlan !== 'object') {
    return {
      chartSectionLayoutPlan: null,
      rows: [],
      issues: [],
    }
  }

  const issues = []
  const rows = []
  const plannedMode = String(chartSectionLayoutPlan.baseGridMode || '').trim()
  const allowedPatterns = new Set(normalizeStringList(chartSectionLayoutPlan.allowedPatterns))
  const excludedContentTypes = new Set(
    normalizeStringList(chartSectionLayoutPlan.excludedContentTypes)
  )
  const fullSpanNeutral = chartSectionLayoutPlan.fullSpanNeutral === true
  const fullSpanSpan = Number(chartSectionLayoutPlan.fullSpanSpan || 12) || 12
  const baseColumnCount = Number(chartSectionLayoutPlan.baseColumnCount || 0) || 0
  const minChartSpanColumns = Number(chartSectionLayoutPlan.minChartSpanColumns || 1) || 1
  const minChartSpan =
    baseColumnCount > 0 ? Math.round((12 / baseColumnCount) * minChartSpanColumns) : 0
  const chartSectionBlocks = extractChartSectionBlocks(sourceRaw)
  const declaredModes = new Set()

  for (const sectionRaw of chartSectionBlocks) {
    const gridRows = extractManagedCardGridRows(sectionRaw)

    for (const row of gridRows) {
      const declaredMode =
        extractStringProp(row.propsRaw, 'baseGridMode') ||
        extractStringProp(row.propsRaw, 'chartSectionBaseGridMode')
      const gridItems = extractChartGridItems(row.bodyRaw)
      const pattern = buildChartRowPattern(gridItems, excludedContentTypes)

      if (!declaredMode) {
        issues.push({
          code: 'GRID_MODE_BYPASS',
          detail:
            'chart-section ManagedCardGrid is missing baseGridMode/chartSectionBaseGridMode, so source is still relying on raw auto-fit behavior instead of governed analytics grid rules.',
        })
      } else {
        declaredModes.add(declaredMode)
      }

      if (pattern && pattern !== String(fullSpanSpan) && !allowedPatterns.has(pattern)) {
        issues.push({
          code: 'GRID_PATTERN_INVALID',
          detail: `${pattern} is not an allowed chart-section row pattern for ${plannedMode}.`,
          pattern,
        })
      }

      for (const item of gridItems) {
        if (excludedContentTypes.has(item.contentType)) {
          continue
        }

        if (
          item.contentType === 'chart-card' &&
          minChartSpan > 0 &&
          item.span !== fullSpanSpan &&
          item.span < minChartSpan
        ) {
          issues.push({
            code: 'CHART_SPAN_BELOW_MINIMUM',
            detail: `chart-section chart span ${item.span} is below the minimum ${minChartSpan} for ${plannedMode}.`,
            span: item.span,
            minimumSpan: minChartSpan,
          })
        }
      }

      rows.push({
        type: 'managed-card-grid',
        declaredMode,
        pattern,
        items: gridItems,
      })
    }

    const standaloneItems = extractChartGridItems(sectionRaw).filter(
      (item) => item.span === fullSpanSpan
    )
    if (standaloneItems.length > 0 && fullSpanNeutral) {
      rows.push({
        type: 'full-span',
        declaredMode: '',
        pattern: String(fullSpanSpan),
        items: standaloneItems,
      })
    }
  }

  if (declaredModes.size > 1) {
    issues.push({
      code: 'GRID_MODE_MIXED',
      detail: `chart-section mixes multiple base grid modes: ${Array.from(declaredModes).join(', ')}.`,
      declaredModes: Array.from(declaredModes),
    })
  }

  for (const declaredMode of declaredModes) {
    if (declaredMode !== plannedMode) {
      issues.push({
        code: 'GRID_MODE_CONTRACT_MISMATCH',
        detail: `chart-section declares ${declaredMode} but visualizationRolePlan requires ${plannedMode}.`,
        declaredMode,
        plannedMode,
      })
    }
  }

  return {
    chartSectionLayoutPlan,
    rows,
    issues,
  }
}

export function buildVisualBaselinePlan({
  layoutArchetype = '',
  skillRoot = defaultSkillRoot,
} = {}) {
  const { dataVisualizationLayoutPolicy } = resolvePolicyBundle(skillRoot)
  const visualBaseline = dataVisualizationLayoutPolicy.visualBaseline || {}

  return {
    schemaVersion: 'analytics-visual-baseline-plan.v1',
    source:
      'rules/chart-semantic-policy.json + rules/data-visualization-layout-policy.json',
    layoutTemplateId: String(layoutArchetype || '').trim(),
    colorPolicyId: String(visualBaseline.colorPolicyId || '').trim(),
    chartThemePolicy: String(visualBaseline.chartThemePolicy || '').trim(),
    compactCardPolicyId: String(visualBaseline.compactCardPolicyId || '').trim(),
    compactCardBorderColor: String(visualBaseline.compactCardBorderColor || '').trim(),
    compactCardRadiusPx: Number(visualBaseline.compactCardRadiusPx || 0),
    compactCardPaddingPx: Number(visualBaseline.compactCardPaddingPx || 0),
    primaryRegionBias: String(visualBaseline.primaryRegionBias || '').trim(),
    forbidSharedShellMutation: Boolean(visualBaseline.forbidSharedShellMutation),
    forbidPublicComponentMutation: Boolean(visualBaseline.forbidPublicComponentMutation),
  }
}

export function buildDashboardControlStripPlan({
  skillRoot = defaultSkillRoot,
} = {}) {
  const { dataVisualizationLayoutPolicy } = resolvePolicyBundle(skillRoot)
  const controlStripPolicy = dataVisualizationLayoutPolicy.controlStripPolicy || {}

  return {
    schemaVersion: 'dashboard-control-strip-plan.v1',
    source: 'rules/data-visualization-layout-policy.json',
    defaultRole: String(controlStripPolicy.defaultRole || '').trim(),
    defaultControlScope: String(controlStripPolicy.scope || '').trim(),
    defaultPlacement: String(controlStripPolicy.defaultPlacement || '').trim(),
    defaultVisualTreatment: String(controlStripPolicy.defaultVisualTreatment || '').trim(),
    detailQueryFilterPolicy: String(controlStripPolicy.detailQueryFilterPolicy || '').trim(),
    mixedScopeControls: String(controlStripPolicy.mixedScopeControls || '').trim(),
    placementDecisionRule: String(controlStripPolicy.placementDecisionRule || '').trim(),
    detailFilterPlacementRule: String(controlStripPolicy.detailFilterPlacementRule || '').trim(),
    visualRule: String(controlStripPolicy.visualRule || '').trim(),
    allowedPlacementsByRole: normalizeStringMapOfLists(
      controlStripPolicy.allowedPlacementsByRole
    ),
    allowedVisualTreatmentsByRole: normalizeStringMapOfLists(
      controlStripPolicy.allowedVisualTreatmentsByRole
    ),
    managedRegionPolicyByRole: normalizeManagedRegionPolicyByRole(
      controlStripPolicy.managedRegionPolicyByRole
    ),
    forbiddenPatterns: normalizeStringList(controlStripPolicy.forbiddenPatterns),
  }
}

export function buildVisualizationRolePlan({
  changeText = '',
  layoutArchetype = '',
  layoutStrategy = '',
  pageTypeId = '',
  skillRoot = defaultSkillRoot,
} = {}) {
  if (String(pageTypeId || '').trim() !== 'data-visualization') {
    return null
  }

  const { chartSemanticPolicy, dataVisualizationLayoutPolicy } = resolvePolicyBundle(skillRoot)
  const template =
    dataVisualizationLayoutPolicy.layoutTemplates?.[String(layoutArchetype || '').trim()] || {}
  const chartSectionLayoutPlan = buildChartSectionLayoutPlan({
    changeText,
    layoutArchetype,
    gridPolicy: dataVisualizationLayoutPolicy.chartSectionGridPolicy || {},
  })
  const controlStripPlan = buildDashboardControlStripPlan({
    skillRoot,
  })
  const processCentric = isProcessCentricBrief(changeText)
  const conditionalPrimaryChartFamilies = getConditionalPrimaryChartFamilies(
    template,
    processCentric
  )

  const chartRoleHints = Object.entries(chartSemanticPolicy.chartTypes || {}).map(
    ([chartType, definition]) => {
      const allowsConditionalPrimary = conditionalPrimaryChartFamilies.has(chartType)
      const canOwnPrimaryRegion =
        typeof definition.canOwnPrimaryRegion === 'boolean'
          ? definition.canOwnPrimaryRegion ||
            allowsConditionalPrimary
          : allowsConditionalPrimary

      const forbiddenPlacements = normalizeStringList(definition.forbiddenPlacements).filter(
        (placement) =>
          !(
            allowsConditionalPrimary &&
            placement === 'primary-region-without-process-centric-brief'
          )
      )

      return {
        chartType,
        visualRole: String(definition.defaultVisualRole || '').trim(),
        regionPriority: String(definition.defaultRegionPriority || '').trim(),
        preferredRegionSize: String(definition.preferredRegionSize || '').trim(),
        canOwnPrimaryRegion,
        forbiddenPlacements,
        notes: normalizeStringList(definition.notes),
      }
    }
  )

  return {
    schemaVersion: 'analytics-visualization-role-plan.v1',
    layoutStrategy: String(layoutStrategy || template.layoutStrategy || '').trim(),
    layoutTemplateId: String(layoutArchetype || '').trim(),
    readingPath: normalizeStringList(template.readingPath),
    processCentric,
    primaryRegion: {
      id: String(template.primaryRegion?.id || '').trim(),
      size: String(template.primaryRegion?.size || '').trim(),
      preferredChartFamilies: normalizeStringList(
        template.primaryRegion?.preferredChartFamilies
      ),
      discouragedChartFamilies: normalizeStringList(
        template.primaryRegion?.discouragedChartFamilies
      ),
      conditionalPrimaryChartFamilies: normalizeStringList(
        processCentric ? template.primaryRegion?.conditionalPrimaryChartFamilies : []
      ),
    },
    secondaryRegions: Array.isArray(template.secondaryRegions)
      ? template.secondaryRegions.map((region) => ({
          id: String(region?.id || '').trim(),
          size: String(region?.size || '').trim(),
          preferredChartFamilies: normalizeStringList(region?.preferredChartFamilies),
        }))
      : [],
    chartSectionLayoutPlan,
    controlStripPlan,
    chartRoleHints,
  }
}

export function normalizeManagedAnalyticsChartIntentItem(
  item,
  {
    changeText = '',
    layoutArchetype = '',
    skillRoot = defaultSkillRoot,
  } = {}
) {
  const { chartSemanticPolicy, dataVisualizationLayoutPolicy } = resolvePolicyBundle(skillRoot)
  const chartType = String(item?.chartType || '').trim()
  const readingLane = String(item?.readingLane || '').trim()
  const definition = chartSemanticPolicy.chartTypes?.[chartType] || null
  const template =
    dataVisualizationLayoutPolicy.layoutTemplates?.[String(layoutArchetype || '').trim()] || {}
  const processCentric = isProcessCentricBrief(changeText)
  const allowsConditionalPrimary = getConditionalPrimaryChartFamilies(
    template,
    processCentric
  ).has(chartType)
  const visualRole =
    String(item?.visualRole || '').trim() ||
    String(definition?.defaultVisualRole || '').trim() ||
    laneToRole(readingLane) ||
    'TODO_VISUAL_ROLE'
  const regionPriority =
    String(item?.regionPriority || '').trim() ||
    String(definition?.defaultRegionPriority || '').trim() ||
    laneToRegionPriority(readingLane) ||
    'TODO_REGION_PRIORITY'
  const preferredRegionSize =
    String(item?.preferredRegionSize || '').trim() ||
    String(definition?.preferredRegionSize || '').trim() ||
    (regionPriority === 'primary'
      ? 'large'
      : regionPriority === 'summary'
        ? 'small'
        : regionPriority === 'follow-up'
          ? 'medium'
          : 'TODO_REGION_SIZE')

  let canOwnPrimaryRegion = item?.canOwnPrimaryRegion
  if (typeof canOwnPrimaryRegion !== 'boolean') {
    if (typeof definition?.canOwnPrimaryRegion === 'boolean') {
      canOwnPrimaryRegion = definition.canOwnPrimaryRegion || allowsConditionalPrimary
    } else if (allowsConditionalPrimary) {
      canOwnPrimaryRegion = true
    } else {
      canOwnPrimaryRegion = null
    }
  }

  const forbiddenPlacements =
    Array.isArray(item?.forbiddenPlacements) && item.forbiddenPlacements.length > 0
      ? normalizeStringList(item.forbiddenPlacements)
      : normalizeStringList(definition?.forbiddenPlacements).filter(
          (placement) =>
            !(
              allowsConditionalPrimary &&
              placement === 'primary-region-without-process-centric-brief'
            )
        )

  return {
    chartId: String(item?.chartId || '').trim(),
    title: String(item?.title || '').trim(),
    businessQuestion: String(item?.businessQuestion || '').trim(),
    informationTask: String(item?.informationTask || '').trim(),
    chartType,
    readingLane,
    visualRole,
    regionPriority,
    preferredRegionSize,
    canOwnPrimaryRegion,
    forbiddenPlacements,
  }
}

export function isSummaryChartType(chartType) {
  return SUMMARY_CHART_TYPES.has(String(chartType || '').trim())
}

export function analyzeManagedAnalyticsRolePlan({
  chartUsageContract,
  visualizationRolePlan,
} = {}) {
  const chartIntentItems = Array.isArray(chartUsageContract?.chartIntentItems)
    ? chartUsageContract.chartIntentItems
    : []
  const primaryItems = chartIntentItems.filter((item) => {
    const lane = String(item?.readingLane || '').trim()
    const priority = String(item?.regionPriority || '').trim()
    return lane === 'primary' || priority === 'primary'
  })
  const discouragedPrimaryChartFamilies = new Set(
    normalizeStringList(visualizationRolePlan?.primaryRegion?.discouragedChartFamilies)
  )
  const conditionalPrimaryChartFamilies = new Set(
    normalizeStringList(visualizationRolePlan?.primaryRegion?.conditionalPrimaryChartFamilies)
  )
  const issues = []

  if (primaryItems.length === 0) {
    issues.push({
      code: 'PRIMARY_ROLE_MISSING',
      detail: 'No primary chart intent item is declared.',
    })
  }

  for (const item of primaryItems) {
    const chartType = String(item?.chartType || '').trim()
    const canOwnPrimaryRegion = item?.canOwnPrimaryRegion === true

    if (!canOwnPrimaryRegion) {
      issues.push({
        code: 'PRIMARY_ROLE_MISMATCH',
        chartId: String(item?.chartId || '').trim(),
        chartType,
        detail: `${chartType || 'unknown chart type'} is marked as a primary-region chart but canOwnPrimaryRegion is not true.`,
      })
    }

    if (
      chartType &&
      discouragedPrimaryChartFamilies.has(chartType) &&
      !conditionalPrimaryChartFamilies.has(chartType)
    ) {
      issues.push({
        code: 'SUMMARY_CHART_IN_PRIMARY_REGION',
        chartId: String(item?.chartId || '').trim(),
        chartType,
        detail: `${chartType} is discouraged in the primary region by visualizationRolePlan.`,
      })
    } else if (chartType && isSummaryChartType(chartType)) {
      issues.push({
        code: 'SUMMARY_CHART_IN_PRIMARY_REGION',
        chartId: String(item?.chartId || '').trim(),
        chartType,
        detail: `${chartType} is a summary-oriented chart type and should not dominate the primary region without an explicit exception.`,
      })
    }
  }

  return {
    primaryItems,
    issues,
  }
}

export function buildTaskWriteScope({
  pagePath = '',
} = {}) {
  const normalizedPagePath = String(pagePath || '').trim().replace(/\\/g, '/')
  const basePathWithoutExtension = normalizedPagePath.replace(/\.[cm]?[jt]sx?$/, '')
  const styleSiblingHints = normalizedPagePath
    ? [
        `${basePathWithoutExtension}.module.scss`,
        `${basePathWithoutExtension}.scss`,
        `${basePathWithoutExtension}.css`,
      ]
    : ['<selected-page-file>.module.scss', '<selected-page-file>.scss']

  return {
    schemaVersion: 'task-write-scope.v1',
    policy: 'page-local-and-contract-artifacts-only',
    allowedPaths: normalizedPagePath
      ? [
          normalizedPagePath,
          ...styleSiblingHints,
          '.local-context/hiui-design/outputs/page-contracts/<selected-page-contract>.json',
          '.local-context/hiui-design/outputs/page-contracts/<selected-page-contract>.md',
          '.local-context/hiui-design/outputs/managed-pages.index.json',
          '.local-context/hiui-design/outputs/managed-pages.index.md',
        ]
      : [
          '<selected-page-file>',
          ...styleSiblingHints,
          '.local-context/hiui-design/outputs/page-contracts/<selected-page-contract>.json',
          '.local-context/hiui-design/outputs/page-contracts/<selected-page-contract>.md',
          '.local-context/hiui-design/outputs/managed-pages.index.json',
          '.local-context/hiui-design/outputs/managed-pages.index.md',
        ],
    forbiddenPaths: [
      'src/typical-page-reuse/**',
      'src/typical-page-reuse/components/**',
      'src/**/data-visualization-primitives.*',
      'src/**/fixed-dashboard-page-frame.*',
      'src/**/managed-page-frame.*',
      '.local-context/hiui-design/vendor/**',
      'vendor/**',
    ],
    hardBlockSharedAssetMutation: true,
    sharedAssetMutationPolicy: 'forbid-shared-shell-and-public-component-mutation',
  }
}
