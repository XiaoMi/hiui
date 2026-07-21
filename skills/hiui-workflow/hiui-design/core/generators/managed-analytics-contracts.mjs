import {
  buildTaskWriteScope,
  buildVisualBaselinePlan,
  buildVisualizationRolePlan,
  normalizeManagedAnalyticsChartIntentItem,
} from '../../scripts/lib/managed-analytics-policy.mjs'

export const ANALYTICS_CHART_USAGE_CONTRACT_FILE = 'chart-usage.contract.json'
export const ANALYTICS_LAYOUT_PLAN_FILE = 'analytics-layout.plan.json'

const ANALYTICS_REQUIRED_DOCS = Object.freeze([
  {
    id: 'data-visualization',
    path: '.local-context/hiui-design/docs/generation/figma-pages/data-visualization.md',
    role: 'page-type-chapter',
  },
  {
    id: 'table-shared',
    path: '.local-context/hiui-design/docs/generation/figma-pages/table-shared.md',
    role: 'shared-rules',
  },
  {
    id: 'hiui5-visual-baseline',
    path: '.local-context/hiui-design/docs/generation/hiui5-visual-baseline.md',
    role: 'visual-baseline',
  },
])

const GENERIC_CHART_TITLE_PATTERN =
  /^(图表|趋势图|对比图|分析图|折线图|面积图|柱状图|堆叠柱状图|分组柱状图|条形图|饼图|环图|雷达图|仪表盘|双轴图|双轴柱线图|漏斗图|散点图|热力图|水波图)$/i
const WEAK_ANALYTICS_BRIEF_PATTERN =
  /^(生成|创建|制作|输出|做|产出|补一个|来一个)?\s*(手机)?\s*(零售)?\s*(经营)?\s*(数据)?\s*(可视化)?\s*(分析)?\s*(看板|页面|大屏|报表|dashboard)\s*$/i
const PROCESS_CENTRIC_PATTERN =
  /(流程|阶段|转化|漏斗|链路|路径|时序|逐步|预约|跟进|入职|process|funnel)/i
const PARALLEL_COMPARISON_PATTERN =
  /(对比|比较|横向|并列|分区|双区|多区|渠道|区域|门店|品牌|平台|parallel|section)/i
const LEADING_ACTION_PATTERN =
  /^[\s，,。.;；:：]*(生成|创建|制作|输出|做|产出|补一个|来一个|请生成|请创建|请输出)\s*/i
const PAGE_LABEL_PATTERN =
  /(数据可视化|分析页|分析看板|看板|页面|dashboard|报表)$/i
const BRIEF_SPLIT_PATTERN =
  /[，,。.;；:：/、\n]|关注|聚焦|侧重|重点看|重点关注|覆盖|包括|观察|查看|分析|以及|和|与|及|并/g
const GENERIC_BRIEF_TOKEN_PATTERN =
  /(生成|创建|制作|输出|做|产出|请生成|请创建|请输出|页面|看板|分析页|分析看板|dashboard|报表|数据可视化|数据|分析|洞察|概览|总览|维度|多维|场景|主题|业务|经营|运营|观察|查看|关注|聚焦|侧重|重点|以及|还有|并|与|和|及|按|基于|围绕|针对|关于|当前|最近|整体|全部|维度|趋势|走势|波动|变化|增长|下滑|对比|比较|排行|排名|排序|差异|构成|占比|结构|分布|份额|阶段|流程|转化|漏斗|链路|路径|时序|相关|关联|关系|聚类|离群|热力|密度|状态|达成|完成率|进度|健康|阈值)/g
const DIMENSION_ONLY_FRAGMENT_PATTERN = /^(区域|地区|城市|门店|渠道|时间|日期|月份|周|日|季度|年度|来源|类型|分类|分组|top|topn)$/i
const NON_SEMANTIC_VALUE_PATTERN =
  /^(\d+([.,]\d+)?%?|[A-Za-z0-9_-]{1,4}|(20\d{2}|19\d{2})[-/年]\d{1,2}([-/月]\d{1,2})?|[0-2]?\d:[0-5]\d)$/
const MAX_SCHEMA_TEXT_ENTRIES = 240

const BUSINESS_SEMANTIC_GROUPS = Object.freeze([
  {
    id: 'retail-commerce',
    terms: ['订单', '销量', '销售额', '销售', '零售', '门店', '库存', '商品', 'sku', '品类', 'gmv', '客单', '交易', '渠道'],
  },
  {
    id: 'service-ops',
    terms: ['巡检', '任务', '工单', '派单', '闭环', '响应', '时长', '设备', '告警', '异常', '驻场', '工程师', '备件', '维修'],
  },
  {
    id: 'supply-chain',
    terms: ['供应商', '交付', '采购', '到货', '发货', '物流', '履约', '仓储', '运输', '签收'],
  },
  {
    id: 'customer-growth',
    terms: ['客户', '用户', '会员', '留存', '复购', '转介绍', '线索', '商机', '转化'],
  },
  {
    id: 'finance-risk',
    terms: ['收入', '营收', '利润', '成本', '毛利', '回款', '逾期', '风险', '预警', '合规'],
  },
  {
    id: 'quality-after-sales',
    terms: ['售后', '返修', '退货', '缺陷', '质检', '投诉', '满意度', '维修率'],
  },
])

const ANALYSIS_INTENT_KEYWORDS = Object.freeze({
  trend: ['趋势', '走势', '波动', '变化', '增长', '下滑'],
  comparison: ['对比', '比较', '排行', '排名', 'top', '排序', '差异'],
  composition: ['构成', '占比', '结构', '分布', '份额'],
  process: ['阶段', '流程', '转化', '漏斗', '链路', '路径', '时序'],
  relationship: ['相关', '关联', '关系', '聚类', '离群', '热力', '密度'],
  status: ['状态', '达成', '完成率', '进度', '健康', '阈值'],
})

const CHART_TYPE_ALIASES = Object.freeze({
  line: 'line',
  area: 'area',
  column: 'column',
  bar: 'bar',
  pie: 'pie',
  donut: 'donut',
  radar: 'radar',
  funnel: 'funnel',
  gauge: 'gauge',
  liquid: 'gauge',
  combo: 'dual-axes',
  'dual-axes': 'dual-axes',
  'dual-axis': 'dual-axes',
  dualaxes: 'dual-axes',
  'stacked-area': 'stacked-area',
  stackedarea: 'stacked-area',
  'stacked-column': 'stacked-column',
  stackedcolumn: 'stacked-column',
  'grouped-column': 'grouped-column',
  groupedcolumn: 'grouped-column',
  scatter: 'scatter',
  heatmap: 'heatmap',
})

function toUniqueList(values) {
  if (!Array.isArray(values)) {
    return []
  }

  return [...new Set(values.map((value) => String(value || '').trim()).filter(Boolean))]
}

function toNormalizedText(value) {
  return String(value || '').trim().toLowerCase()
}

function intersectSets(left, right) {
  const result = new Set()

  for (const value of left) {
    if (right.has(value)) {
      result.add(value)
    }
  }

  return result
}

function hasStrongSemanticEvidence({ matchedTerms = [], matchedGroups = new Set() } = {}) {
  return (
    (Array.isArray(matchedTerms) ? matchedTerms.length : 0) >= 2 ||
    (matchedGroups instanceof Set ? matchedGroups.size : 0) >= 2
  )
}

function resolveMeaningfulText(value) {
  const text = String(value || '').trim()
  if (!text) {
    return ''
  }

  if (GENERIC_CHART_TITLE_PATTERN.test(text)) {
    return ''
  }

  return text
}

function resolveChartType(rawType) {
  const normalized = String(rawType || '').trim().toLowerCase()
  return CHART_TYPE_ALIASES[normalized] || normalized || 'line'
}

function resolveInfoTask(chartType) {
  if (chartType === 'area' || chartType === 'line' || chartType === 'stacked-area') {
    return 'trend'
  }

  if (
    chartType === 'column' ||
    chartType === 'bar' ||
    chartType === 'stacked-column' ||
    chartType === 'grouped-column'
  ) {
    return 'comparison'
  }

  if (chartType === 'pie' || chartType === 'donut') {
    return 'composition'
  }

  if (chartType === 'funnel') {
    return 'process'
  }

  if (chartType === 'scatter' || chartType === 'heatmap') {
    return 'relationship'
  }

  if (chartType === 'gauge') {
    return 'status'
  }

  if (chartType === 'radar') {
    return 'comparison'
  }

  if (chartType === 'dual-axes') {
    return 'trend'
  }

  return 'comparison'
}

function resolveChartLabel(chartType) {
  return (
    {
      line: '折线图',
      area: '面积图',
      column: '柱状图',
      bar: '条形图',
      pie: '饼图',
      donut: '环图',
      radar: '雷达图',
      funnel: '漏斗图',
      gauge: '仪表盘',
      'dual-axes': '双轴图',
      'stacked-area': '堆叠面积图',
      'stacked-column': '堆叠柱状图',
      'grouped-column': '分组柱状图',
      scatter: '散点图',
      heatmap: '热力图',
    }[chartType] || '图表'
  )
}

function resolveFallbackChartTitle(infoTask, index) {
  const baseTitle =
    {
      trend: '核心趋势走势',
      comparison: '关键对象对比',
      composition: '结构占比',
      process: '阶段转化分析',
      relationship: '关系分布分析',
      status: '目标达成状态',
    }[infoTask] || '业务分析图表'

  return index === 0 ? baseTitle : `${baseTitle} ${index + 1}`
}

function resolveBriefSubject(changeText) {
  const normalized = String(changeText || '')
    .replace(LEADING_ACTION_PATTERN, '')
    .replace(PAGE_LABEL_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized) {
    return '当前业务主题'
  }

  return normalized.length > 28 ? `${normalized.slice(0, 28)}...` : normalized
}

function matchSemanticGroups(text = '') {
  const normalizedText = toNormalizedText(text)
  const matchedGroups = new Set()
  const matchedTerms = []

  if (!normalizedText) {
    return {
      matchedGroups,
      matchedTerms,
    }
  }

  BUSINESS_SEMANTIC_GROUPS.forEach((group) => {
    const groupTerms = Array.isArray(group?.terms) ? group.terms : []
    const groupMatches = groupTerms.filter((term) => normalizedText.includes(toNormalizedText(term)))

    if (groupMatches.length > 0) {
      matchedGroups.add(String(group.id || '').trim())
      groupMatches.forEach((term) => matchedTerms.push(term))
    }
  })

  return {
    matchedGroups,
    matchedTerms: toUniqueList(matchedTerms),
  }
}

function matchAnalysisIntents(text = '') {
  const normalizedText = toNormalizedText(text)
  const matchedIntents = new Set()
  const matchedTerms = []

  if (!normalizedText) {
    return {
      matchedIntents,
      matchedTerms,
    }
  }

  Object.entries(ANALYSIS_INTENT_KEYWORDS).forEach(([intentId, terms]) => {
    const intentMatches = (Array.isArray(terms) ? terms : []).filter((term) =>
      normalizedText.includes(toNormalizedText(term))
    )

    if (intentMatches.length > 0) {
      matchedIntents.add(intentId)
      intentMatches.forEach((term) => matchedTerms.push(term))
    }
  })

  return {
    matchedIntents,
    matchedTerms: toUniqueList(matchedTerms),
  }
}

function collectSchemaSemanticText(schema = {}) {
  const chunks = []

  function pushValue(value) {
    const text = String(value || '').trim()

    if (!text || NON_SEMANTIC_VALUE_PATTERN.test(text)) {
      return
    }

    chunks.push(text)
  }

  pushValue(schema?.title)
  pushValue(schema?.searchPlaceholder)

  ;(Array.isArray(schema?.stats) ? schema.stats : []).forEach((stat) => {
    pushValue(stat?.key)
    pushValue(stat?.label)
    pushValue(stat?.note)
  })

  ;(Array.isArray(schema?.queryFields) ? schema.queryFields : []).forEach((field) => {
    pushValue(field?.key)
    pushValue(field?.label)
    pushValue(field?.matchKey)
    ;(Array.isArray(field?.options) ? field.options : []).forEach((option) => {
      pushValue(option?.id)
      pushValue(option?.title)
    })
  })

  ;(Array.isArray(schema?.charts) ? schema.charts : []).forEach((chart) => {
    pushValue(chart?.key)
    pushValue(chart?.title)
    ;(Array.isArray(chart?.series) ? chart.series : []).forEach((series) => {
      pushValue(series?.label)
      pushValue(series?.series)
    })
    ;(Array.isArray(chart?.data) ? chart.data : []).forEach((item) => {
      pushValue(item?.label)
      pushValue(item?.series)
    })
  })

  ;(Array.isArray(schema?.columns) ? schema.columns : []).forEach((column) => {
    pushValue(column?.key)
    pushValue(column?.label)
  })

  let rowValueCount = 0
  ;(Array.isArray(schema?.rows) ? schema.rows : []).forEach((row) => {
    if (!row || rowValueCount >= MAX_SCHEMA_TEXT_ENTRIES) {
      return
    }

    Object.values(row).forEach((value) => {
      if (rowValueCount >= MAX_SCHEMA_TEXT_ENTRIES) {
        return
      }

      const text = String(value || '').trim()

      if (!text || NON_SEMANTIC_VALUE_PATTERN.test(text)) {
        return
      }

      chunks.push(text)
      rowValueCount += 1
    })
  })

  return toUniqueList(chunks).join(' | ')
}

function extractBusinessFragments(changeText = '') {
  const normalized = String(changeText || '')
    .replace(LEADING_ACTION_PATTERN, '')
    .replace(PAGE_LABEL_PATTERN, '')
    .replace(/\s+/g, '')
    .trim()

  if (!normalized) {
    return []
  }

  const fragments = normalized
    .split(BRIEF_SPLIT_PATTERN)
    .flatMap((segment) => segment.split(/[、|]/))
    .map((segment) => segment.replace(GENERIC_BRIEF_TOKEN_PATTERN, '').trim())
    .filter((segment) => segment.length >= 2)
    .filter((segment) => !DIMENSION_ONLY_FRAGMENT_PATTERN.test(segment))
    .map((segment) => segment.slice(0, 24))

  return toUniqueList(fragments)
}

function analyzeAnalyticsBrief(changeText = '') {
  const text = String(changeText || '').trim()
  const semanticGroups = matchSemanticGroups(text)
  const analysisIntents = matchAnalysisIntents(text)
  const businessFragments = extractBusinessFragments(text)
  const nonGenericFragments = businessFragments.filter(
    (fragment) => !GENERIC_CHART_TITLE_PATTERN.test(fragment)
  )

  return {
    text,
    businessFragments: nonGenericFragments,
    businessSemanticGroups: semanticGroups.matchedGroups,
    businessSemanticTerms: semanticGroups.matchedTerms,
    analysisIntentGroups: analysisIntents.matchedIntents,
    analysisIntentTerms: analysisIntents.matchedTerms,
    hasBusinessFocus:
      semanticGroups.matchedGroups.size > 0 ||
      semanticGroups.matchedTerms.length > 0 ||
      nonGenericFragments.length > 0,
    hasAnalysisIntent: analysisIntents.matchedIntents.size > 0,
  }
}

function analyzeAnalyticsSchemaSemantics(schema = {}) {
  const semanticText = collectSchemaSemanticText(schema)
  const semanticGroups = matchSemanticGroups(semanticText)
  const supportedIntentGroups = new Set(
    (Array.isArray(schema?.charts) ? schema.charts : [])
      .map((chart) => resolveInfoTask(resolveChartType(chart?.type)))
      .filter(Boolean)
  )

  return {
    semanticText,
    businessSemanticGroups: semanticGroups.matchedGroups,
    businessSemanticTerms: semanticGroups.matchedTerms,
    supportedIntentGroups,
  }
}

function buildBusinessQuestion({ infoTask, title, changeText }) {
  const subject = resolveMeaningfulText(title) || resolveBriefSubject(changeText)

  if (infoTask === 'trend') {
    return `${subject}是否出现持续变化或异常波动`
  }

  if (infoTask === 'comparison') {
    return `${subject}之间的差异主要集中在哪里`
  }

  if (infoTask === 'composition') {
    return `${subject}的构成占比是否发生变化`
  }

  if (infoTask === 'process') {
    return `${subject}在各阶段是否存在明显流失`
  }

  if (infoTask === 'relationship') {
    return `${subject}之间是否存在关联或异常分布`
  }

  if (infoTask === 'status') {
    return `${subject}当前是否达到预期状态`
  }

  return `${subject}当前最需要优先解释的现象是什么`
}

function buildChartChoiceReason({ chartType, infoTask }) {
  const chartLabel = resolveChartLabel(chartType)

  if (infoTask === 'trend') {
    return `该图承担连续变化判断，使用${chartLabel}可以稳定表达时间走势与波动节奏。`
  }

  if (infoTask === 'comparison') {
    return `该图承担对象间对比，使用${chartLabel}可以更直接比较量级、排序或分组差异。`
  }

  if (infoTask === 'composition') {
    return `该图承担构成解释，使用${chartLabel}可以快速呈现占比关系与结构变化。`
  }

  if (infoTask === 'process') {
    return `该图承担阶段流转分析，使用${chartLabel}可以直接暴露转化链路中的掉队环节。`
  }

  if (infoTask === 'relationship') {
    return `该图承担关系分布判断，使用${chartLabel}可以识别相关性、密度或离群点。`
  }

  if (infoTask === 'status') {
    return `该图承担状态达成判断，使用${chartLabel}可以更快表达目标完成度与阈值状态。`
  }

  return `该图使用${chartLabel}承接当前业务问题，避免退化为无解释性的图表占位。`
}

function resolveLayoutArchetype({ changeText = '', schema = {} } = {}) {
  const normalizedChangeText = String(changeText || '').trim()

  if (PROCESS_CENTRIC_PATTERN.test(normalizedChangeText)) {
    return 'linear-stack'
  }

  if (PARALLEL_COMPARISON_PATTERN.test(normalizedChangeText)) {
    return 'parallel-sections'
  }

  return 'primary-secondary'
}

function resolvePriority(readingLane) {
  if (readingLane === 'primary') {
    return 'primary'
  }

  if (readingLane === 'summary') {
    return 'summary'
  }

  if (readingLane === 'full-span follow-up') {
    return 'follow-up'
  }

  return 'secondary'
}

function buildNormalizedChartCandidates({ charts = [], changeText = '', layoutArchetype = '' } = {}) {
  return charts.map((chart, index) => {
    const chartType = resolveChartType(chart?.type)
    const infoTask = resolveInfoTask(chartType)
    const rawTitle = String(chart?.title || '').trim()
    const resolvedTitle = resolveMeaningfulText(rawTitle) || resolveFallbackChartTitle(infoTask, index)
    const baseIntent = normalizeManagedAnalyticsChartIntentItem(
      {
        chartId: String(chart?.key || `chart-${index + 1}`).trim(),
        title: resolvedTitle,
        businessQuestion: buildBusinessQuestion({
          infoTask,
          title: rawTitle,
          changeText,
        }),
        informationTask: infoTask,
        chartType,
        readingLane: '',
      },
      {
        changeText,
        layoutArchetype,
      }
    )

    return {
      index,
      rawTitle,
      infoTask,
      chartType,
      resolvedTitle,
      baseIntent,
    }
  })
}

function resolvePrimaryChartIndex(candidates = []) {
  const directPrimary = candidates.findIndex(
    (candidate) =>
      candidate.baseIntent?.canOwnPrimaryRegion === true && candidate.infoTask !== 'status'
  )

  if (directPrimary >= 0) {
    return directPrimary
  }

  return -1
}

function resolveReadingLane({
  candidate,
  candidateIndex,
  primaryChartIndex,
  layoutArchetype,
} = {}) {
  if (candidateIndex === primaryChartIndex) {
    return 'primary'
  }

  if (candidate.infoTask === 'status') {
    return 'summary'
  }

  if (layoutArchetype === 'linear-stack' && candidateIndex > primaryChartIndex) {
    return 'full-span follow-up'
  }

  return 'secondary'
}

function countMeaningfulChartTitles(charts = []) {
  return charts.filter((chart) => resolveMeaningfulText(chart?.title)).length
}

function isWeakAnalyticsBrief(changeText = '') {
  const briefAnalysis = analyzeAnalyticsBrief(changeText)
  const text = briefAnalysis.text

  if (!text) {
    return true
  }

  if (text.length < 8 || WEAK_ANALYTICS_BRIEF_PATTERN.test(text)) {
    return true
  }

  const domainKeywordCount = [
    '销售',
    '零售',
    '库存',
    '门店',
    '渠道',
    '转化',
    '客流',
    '毛利',
    '售后',
    '补货',
    '经营',
    '排行',
    '效率',
    '任务',
    '风险',
  ].filter((keyword) => text.includes(keyword)).length
  const analysisKeywordCount = [
    '趋势',
    '对比',
    '构成',
    '占比',
    '阶段',
    '转化',
    '波动',
    '排名',
    '状态',
    '分析',
    '看板',
  ].filter((keyword) => text.includes(keyword)).length

  if (domainKeywordCount + analysisKeywordCount < 2) {
    return true
  }

  return !briefAnalysis.hasBusinessFocus || !briefAnalysis.hasAnalysisIntent
}

export function resolveManagedAnalyticsRequiredDocs() {
  return ANALYTICS_REQUIRED_DOCS.map((entry) => ({ ...entry }))
}

export function buildManagedAnalyticsArtifacts({
  pageType = '',
  targetPagePath = '',
  schema = {},
  changeText = '',
} = {}) {
  if (String(pageType || '').trim() !== 'data-visualization') {
    return null
  }

  const charts = Array.isArray(schema?.charts) ? schema.charts : []
  const requiredDocs = resolveManagedAnalyticsRequiredDocs()
  const blockingReasons = []
  const meaningfulChartTitleCount = countMeaningfulChartTitles(charts)
  const briefAnalysis = analyzeAnalyticsBrief(changeText)
  const schemaSemantics = analyzeAnalyticsSchemaSemantics(schema)
  const sharedBusinessGroups = intersectSets(
    briefAnalysis.businessSemanticGroups,
    schemaSemantics.businessSemanticGroups
  )
  const briefHasStrongSemanticEvidence = hasStrongSemanticEvidence({
    matchedTerms: briefAnalysis.businessSemanticTerms,
    matchedGroups: briefAnalysis.businessSemanticGroups,
  })
  const schemaHasStrongSemanticEvidence = hasStrongSemanticEvidence({
    matchedTerms: schemaSemantics.businessSemanticTerms,
    matchedGroups: schemaSemantics.businessSemanticGroups,
  })
  const schemaSemanticText = schemaSemantics.semanticText
  const overlappingBusinessFragments = briefAnalysis.businessFragments.filter((fragment) =>
    schemaSemanticText.includes(fragment)
  )
  const requestedIntentGroups = briefAnalysis.analysisIntentGroups
  const supportedIntentGroups = schemaSemantics.supportedIntentGroups
  const supportedRequestedIntents = intersectSets(requestedIntentGroups, supportedIntentGroups)
  const unsupportedRequestedIntents = [...requestedIntentGroups].filter(
    (intentId) => !supportedIntentGroups.has(intentId)
  )

  if (charts.length === 0) {
    blockingReasons.push('schema.charts 为空，无法冻结图表职责合同。')
  }

  if (isWeakAnalyticsBrief(changeText)) {
    blockingReasons.push(
      '缺少足够明确的业务 brief；请通过 --change 同时说明业务对象与分析任务，例如“订单/工单/库存 + 趋势/构成/排行/阶段”。'
    )
  }

  if (!briefAnalysis.hasBusinessFocus && meaningfulChartTitleCount === 0) {
    blockingReasons.push('当前 brief 没有给出明确业务对象，无法把数据可视化页面收口到稳定业务主题。')
  }

  if (!briefAnalysis.hasAnalysisIntent) {
    blockingReasons.push('当前 brief 没有给出明确分析任务，无法判断应优先承接趋势、对比、构成、阶段还是状态问题。')
  }

  if (
    briefAnalysis.hasBusinessFocus &&
    briefHasStrongSemanticEvidence &&
    schemaHasStrongSemanticEvidence &&
    schemaSemanticText &&
    sharedBusinessGroups.size === 0 &&
    overlappingBusinessFragments.length === 0
  ) {
    blockingReasons.push(
      `当前 brief 的业务语义（${briefAnalysis.businessSemanticTerms.concat(
        briefAnalysis.businessFragments
      ).slice(0, 4).join(' / ') || '未识别'}）与 schema 暴露的业务语义（${schemaSemantics.businessSemanticTerms
        .slice(0, 4)
        .join(' / ') || '未识别'}）不一致，请先统一业务主题再生成。`
    )
  }

  if (requestedIntentGroups.size > 0 && supportedRequestedIntents.size === 0) {
    blockingReasons.push(
      `当前 brief 要求的分析任务（${[...requestedIntentGroups].join(' / ')}）无法由 schema.charts 现有图表能力承接。`
    )
  }

  if (unsupportedRequestedIntents.length > 0) {
    blockingReasons.push(
      `当前 brief 仍有未被 schema.charts 承接的分析任务：${unsupportedRequestedIntents.join(
        ' / '
      )}。请补齐图表能力，或先收敛 brief。`
    )
  }

  const layoutArchetype = resolveLayoutArchetype({
    changeText,
    schema,
  })
  const visualBaselinePlan = buildVisualBaselinePlan({
    layoutArchetype,
  })
  const visualizationRolePlan = buildVisualizationRolePlan({
    changeText,
    layoutArchetype,
    layoutStrategy: '',
    pageTypeId: 'data-visualization',
  })
  const layoutStrategy = String(visualizationRolePlan?.layoutStrategy || '').trim()
  const readingPath = toUniqueList(visualizationRolePlan?.readingPath)
  const writeScope = buildTaskWriteScope({
    pagePath: `${String(targetPagePath || '').replace(/\\/g, '/')}/index.tsx`,
  })
  const candidates = buildNormalizedChartCandidates({
    charts,
    changeText,
    layoutArchetype,
  })
  const primaryChartIndex = resolvePrimaryChartIndex(candidates)

  if (primaryChartIndex < 0) {
    blockingReasons.push('当前图表集合里没有可承担主区域的主图候选，无法冻结主次阅读结构。')
  }

  if (!layoutStrategy) {
    blockingReasons.push('未能从受管数据可视化策略中解析出 layoutStrategy。')
  }

  if (blockingReasons.length > 0) {
    return {
      status: 'blocked',
      pageType: 'data-visualization',
      requiredDocs,
      blockingReasons,
      layoutArchetype,
      layoutStrategy,
    }
  }

  const chartIntentItems = candidates.map((candidate, candidateIndex) => {
    const readingLane = resolveReadingLane({
      candidate,
      candidateIndex,
      primaryChartIndex,
      layoutArchetype,
    })
    const resolvedIntent = normalizeManagedAnalyticsChartIntentItem(
      {
        chartId: candidate.baseIntent.chartId,
        title: candidate.resolvedTitle,
        businessQuestion: candidate.baseIntent.businessQuestion,
        informationTask: candidate.baseIntent.informationTask,
        chartType: candidate.baseIntent.chartType,
        readingLane,
        visualRole: candidate.baseIntent.visualRole,
        regionPriority: candidate.baseIntent.regionPriority,
        preferredRegionSize: candidate.baseIntent.preferredRegionSize,
        canOwnPrimaryRegion: candidate.baseIntent.canOwnPrimaryRegion,
        forbiddenPlacements: candidate.baseIntent.forbiddenPlacements,
      },
      {
        changeText,
        layoutArchetype,
      }
    )

    return {
      ...resolvedIntent,
      chartChoiceReason: buildChartChoiceReason({
        chartType: candidate.chartType,
        infoTask: candidate.infoTask,
      }),
      priority: resolvePriority(readingLane),
      sourceChartType: String(charts[candidateIndex]?.type || '').trim(),
      sourceChartTitle: String(charts[candidateIndex]?.title || '').trim(),
    }
  })

  const chartUsageContract = {
    schemaVersion: 'chart-usage-contract.v1',
    source: 'typical-page:analytics',
    pageType: 'data-visualization',
    contractStatus: 'ready',
    requiredDocs,
    readingPath: readingPath.length > 0 ? readingPath : ['summary', 'primary', 'secondary', 'detail-table'],
    chartIntentItems,
  }

  const analyticsLayoutPlan = {
    schemaVersion: 'analytics-layout-plan.v1',
    source: 'typical-page:analytics',
    pageType: 'data-visualization',
    requiredDocs,
    layoutArchetype,
    layoutStrategy,
    primaryCharts: chartIntentItems
      .filter((item) => item.readingLane === 'primary')
      .map((item) => item.chartId),
    secondaryCharts: chartIntentItems
      .filter((item) => item.readingLane === 'secondary')
      .map((item) => item.chartId),
    summaryCharts: chartIntentItems
      .filter((item) => item.readingLane === 'summary')
      .map((item) => item.chartId),
    fullSpanCharts: chartIntentItems
      .filter((item) => item.readingLane === 'full-span follow-up')
      .map((item) => item.chartId),
    readingPath: chartUsageContract.readingPath,
    controlStripRole: String(visualizationRolePlan?.controlStripPlan?.defaultRole || '').trim(),
    controlScope: String(visualizationRolePlan?.controlStripPlan?.defaultControlScope || '').trim(),
    controlStripPlacement: String(
      visualizationRolePlan?.controlStripPlan?.defaultPlacement || ''
    ).trim(),
    controlStripVisualTreatment: String(
      visualizationRolePlan?.controlStripPlan?.defaultVisualTreatment || ''
    ).trim(),
    visualBaselinePlan,
    visualizationRolePlan,
    writeScope,
  }

  return {
    status: 'ready',
    pageType: 'data-visualization',
    requiredDocs,
    layoutArchetype,
    layoutStrategy,
    visualBaselinePlan,
    visualizationRolePlan,
    writeScope,
    chartUsageContract,
    analyticsLayoutPlan,
  }
}

export function buildManagedAnalyticsBlockedError(artifacts) {
  const blockingReasons = Array.isArray(artifacts?.blockingReasons)
    ? artifacts.blockingReasons.filter(Boolean)
    : []
  const reasonText = blockingReasons.length > 0 ? blockingReasons.join('；') : '缺少受管数据可视化生成输入'

  return `data-visualization 必须先冻结最小分析契约后才能生成页面：${reasonText}`
}

export function buildManagedAnalyticsKickoffFacts(artifacts) {
  if (!artifacts || artifacts.status !== 'ready') {
    return null
  }

  const chartUsageContract = artifacts.chartUsageContract || {}
  const analyticsLayoutPlan = artifacts.analyticsLayoutPlan || {}

  return {
    contractGate: 'frozen-before-business-jsx',
    generationStrategy: 'managed-analytics',
    pageType: 'data-visualization',
    contractStatus: String(chartUsageContract.contractStatus || '').trim() || 'unknown',
    requiredDocs: Array.isArray(artifacts.requiredDocs) ? artifacts.requiredDocs : [],
    layoutArchetype:
      String(analyticsLayoutPlan.layoutArchetype || '').trim() || String(artifacts.layoutArchetype || '').trim(),
    layoutStrategy:
      String(analyticsLayoutPlan.layoutStrategy || '').trim() || String(artifacts.layoutStrategy || '').trim(),
    chartIntentCount: Array.isArray(chartUsageContract.chartIntentItems)
      ? chartUsageContract.chartIntentItems.length
      : 0,
    readingPath: Array.isArray(chartUsageContract.readingPath) ? chartUsageContract.readingPath : [],
    primaryCharts: Array.isArray(analyticsLayoutPlan.primaryCharts)
      ? analyticsLayoutPlan.primaryCharts
      : [],
    secondaryCharts: Array.isArray(analyticsLayoutPlan.secondaryCharts)
      ? analyticsLayoutPlan.secondaryCharts
      : [],
    summaryCharts: Array.isArray(analyticsLayoutPlan.summaryCharts)
      ? analyticsLayoutPlan.summaryCharts
      : [],
    fullSpanCharts: Array.isArray(analyticsLayoutPlan.fullSpanCharts)
      ? analyticsLayoutPlan.fullSpanCharts
      : [],
    controlStripRole: String(analyticsLayoutPlan.controlStripRole || '').trim(),
    controlScope: String(analyticsLayoutPlan.controlScope || '').trim(),
    controlStripPlacement: String(analyticsLayoutPlan.controlStripPlacement || '').trim(),
    writeScope: analyticsLayoutPlan.writeScope || artifacts.writeScope || null,
  }
}
