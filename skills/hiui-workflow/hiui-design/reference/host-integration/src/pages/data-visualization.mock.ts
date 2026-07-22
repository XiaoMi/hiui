import type { GetDataSourceParamsType } from '@hi-ui/schema-core'
import { toValues } from '@hiui-design/typical-page-shells/pro-list-page/hooks/use-fetch-list'

type SelectOption = {
  id: string
  title: string
}

type VisualizationMetric = {
  chartType?: 'area' | 'column'
  seriesColor: string
  sparkline: number[]
  title: string
  value: string
  note: string
}

type TrendRow = {
  month: string
  label: string
  series: string
  value: number
}

type SourceRow = {
  type: string
  value: number
}

type RankingRow = {
  value: number
  team: string
  kind: string
}

type ServiceLoadRow = {
  period: string
  count: number
}

type RecoveryRow = {
  day: string
  duration: number
}

type DualAxisRow = {
  month: string
  taskCount: number
  completionRate: number
}

type GaugeRow = {
  label: string
  percent: number
  valueText: string
}

type StackedColumnRow = {
  month: string
  phase: string
  value: number
}

type GroupedColumnRow = {
  month: string
  team: string
  value: number
}

type FunnelRow = {
  stage: string
  value: number
}

type RadarRow = {
  team: string
  score: number
  dimension: string
}

type InsightRow = {
  id: string
  regionId: string
  regionTitle: string
  sourceType: string
  sourceTypeTitle: string
  trendLabel: string
  trendValue: string
  completionRate: string
  anomalyCount: number
  topRiskPoint: string
  updatedAt: string
}

type PagedResponse<T> = {
  list: T[]
  total: number
  current: number
  pageSize: number
}

const regionOptions: SelectOption[] = [
  { id: 'nationwide', title: '全国' },
  { id: 'east', title: '华东' },
  { id: 'south', title: '华南' },
  { id: 'north', title: '华北' },
]

const sourceTypeOptions: SelectOption[] = [
  { id: '巡检', title: '移动巡检' },
  { id: '驻场', title: '驻场工单' },
  { id: '告警', title: '设备告警' },
  { id: '派单', title: '人工派单' },
]

const visualizationMetrics: VisualizationMetric[] = [
  {
    title: '本月巡检任务',
    value: '12,846',
    note: '较上月 +8.4%',
    seriesColor: 'main',
    sparkline: [7800, 9050, 9860, 9540, 11020, 11780, 12846],
  },
  {
    title: '异常闭环率',
    value: '96.8%',
    note: '连续 3 周提升',
    seriesColor: 'positive',
    sparkline: [90.6, 92.4, 91.9, 94.3, 93.7, 95.8, 96.8],
  },
  {
    title: '平均响应时长',
    value: '18 min',
    note: '较基线 -2 min',
    chartType: 'column',
    seriesColor: 'main',
    sparkline: [27, 24, 25, 22, 20, 21, 18],
  },
  {
    title: '高风险设备',
    value: '42',
    note: '需优先跟进',
    seriesColor: 'negative',
    sparkline: [58, 55, 57, 51, 49, 46, 42],
  },
]

const trendData: TrendRow[] = [
  { month: '01', label: '任务量', series: 'main', value: 9200 },
  { month: '01', label: '闭环量', series: 'positive', value: 8100 },
  { month: '02', label: '任务量', series: 'main', value: 10120 },
  { month: '02', label: '闭环量', series: 'positive', value: 9040 },
  { month: '03', label: '任务量', series: 'main', value: 11040 },
  { month: '03', label: '闭环量', series: 'positive', value: 9850 },
  { month: '04', label: '任务量', series: 'main', value: 10880 },
  { month: '04', label: '闭环量', series: 'positive', value: 9970 },
  { month: '05', label: '任务量', series: 'main', value: 11860 },
  { month: '05', label: '闭环量', series: 'positive', value: 10620 },
  { month: '06', label: '任务量', series: 'main', value: 12846 },
  { month: '06', label: '闭环量', series: 'positive', value: 11790 },
  { month: '07', label: '任务量', series: 'main', value: 13280 },
  { month: '07', label: '闭环量', series: 'positive', value: 12140 },
]

const sourceData: SourceRow[] = [
  { type: '移动巡检', value: 42 },
  { type: '驻场工单', value: 25 },
  { type: '设备告警', value: 18 },
  { type: '人工派单', value: 15 },
]

const rankingData: RankingRow[] = [
  { team: '华东一区', value: 98, kind: 'positive' },
  { team: '华南联动组', value: 95, kind: 'positive' },
  { team: '西南保障组', value: 91, kind: 'info' },
  { team: '华北二组', value: 87, kind: 'warning' },
  { team: '总部支撑组', value: 82, kind: 'baseline' },
]

const serviceLoadData: ServiceLoadRow[] = [
  { period: '08:00', count: 118 },
  { period: '10:00', count: 162 },
  { period: '12:00', count: 104 },
  { period: '14:00', count: 176 },
  { period: '16:00', count: 148 },
  { period: '18:00', count: 126 },
  { period: '20:00', count: 96 },
]

const recoveryData: RecoveryRow[] = [
  { day: '周一', duration: 28 },
  { day: '周二', duration: 24 },
  { day: '周三', duration: 21 },
  { day: '周四', duration: 19 },
  { day: '周五', duration: 17 },
  { day: '周六', duration: 16 },
  { day: '周日', duration: 15 },
]

const dualAxisData: DualAxisRow[] = [
  { month: '01', taskCount: 9200, completionRate: 89.6 },
  { month: '02', taskCount: 10120, completionRate: 91.4 },
  { month: '03', taskCount: 11040, completionRate: 92.8 },
  { month: '04', taskCount: 10880, completionRate: 94.1 },
  { month: '05', taskCount: 11860, completionRate: 95.2 },
  { month: '06', taskCount: 12846, completionRate: 96.8 },
]

const gaugeData: GaugeRow = {
  label: '闭环达成率',
  percent: 0.968,
  valueText: '96.8%',
}

const stackedColumnData: StackedColumnRow[] = [
  { month: '01', phase: '自动处理', value: 3200 },
  { month: '01', phase: '人工介入', value: 2100 },
  { month: '01', phase: '闭环完成', value: 3900 },
  { month: '02', phase: '自动处理', value: 3480 },
  { month: '02', phase: '人工介入', value: 2280 },
  { month: '02', phase: '闭环完成', value: 4360 },
  { month: '03', phase: '自动处理', value: 3720 },
  { month: '03', phase: '人工介入', value: 2410 },
  { month: '03', phase: '闭环完成', value: 4910 },
  { month: '04', phase: '自动处理', value: 3650 },
  { month: '04', phase: '人工介入', value: 2330 },
  { month: '04', phase: '闭环完成', value: 4900 },
  { month: '05', phase: '自动处理', value: 3880 },
  { month: '05', phase: '人工介入', value: 2470 },
  { month: '05', phase: '闭环完成', value: 5510 },
  { month: '06', phase: '自动处理', value: 4160 },
  { month: '06', phase: '人工介入', value: 2590 },
  { month: '06', phase: '闭环完成', value: 6096 },
]

const groupedColumnData: GroupedColumnRow[] = [
  { month: '01', team: '华东一区', value: 1280 },
  { month: '01', team: '华南联动组', value: 1140 },
  { month: '01', team: '西南保障组', value: 980 },
  { month: '02', team: '华东一区', value: 1410 },
  { month: '02', team: '华南联动组', value: 1230 },
  { month: '02', team: '西南保障组', value: 1090 },
  { month: '03', team: '华东一区', value: 1560 },
  { month: '03', team: '华南联动组', value: 1360 },
  { month: '03', team: '西南保障组', value: 1180 },
  { month: '04', team: '华东一区', value: 1520 },
  { month: '04', team: '华南联动组', value: 1450 },
  { month: '04', team: '西南保障组', value: 1260 },
  { month: '05', team: '华东一区', value: 1680 },
  { month: '05', team: '华南联动组', value: 1580 },
  { month: '05', team: '西南保障组', value: 1370 },
  { month: '06', team: '华东一区', value: 1820 },
  { month: '06', team: '华南联动组', value: 1670 },
  { month: '06', team: '西南保障组', value: 1490 },
]

const liquidData = {
  label: '异常闭环率',
  percent: 0.56,
  valueText: '56%',
}

const funnelData: FunnelRow[] = [
  { stage: '告警触发', value: 12846 },
  { stage: '自动派单', value: 9860 },
  { stage: '工程师响应', value: 7420 },
  { stage: '现场处理', value: 4680 },
  { stage: '闭环完成', value: 2510 },
]

const radarData: RadarRow[] = [
  { team: '华东一区', dimension: '响应效率', score: 92 },
  { team: '华东一区', dimension: '一次修复', score: 88 },
  { team: '华东一区', dimension: '备件协同', score: 84 },
  { team: '华东一区', dimension: '用户满意', score: 90 },
  { team: '华东一区', dimension: '风险控制', score: 86 },
  { team: '华南联动组', dimension: '响应效率', score: 76 },
  { team: '华南联动组', dimension: '一次修复', score: 71 },
  { team: '华南联动组', dimension: '备件协同', score: 66 },
  { team: '华南联动组', dimension: '用户满意', score: 79 },
  { team: '华南联动组', dimension: '风险控制', score: 69 },
]

const insightRows: InsightRow[] = [
  {
    id: 'insight-001',
    regionId: 'east',
    regionTitle: '华东',
    sourceType: '巡检',
    sourceTypeTitle: '移动巡检',
    trendLabel: '任务量持续走高',
    trendValue: '+12.3%',
    completionRate: '97.6%',
    anomalyCount: 8,
    topRiskPoint: '苏州园区空调批次告警',
    updatedAt: '2026-04-28 10:20',
  },
  {
    id: 'insight-002',
    regionId: 'south',
    regionTitle: '华南',
    sourceType: '驻场',
    sourceTypeTitle: '驻场工单',
    trendLabel: '响应时长改善明显',
    trendValue: '-9.1%',
    completionRate: '95.2%',
    anomalyCount: 5,
    topRiskPoint: '深圳福田 UPS 电池波动',
    updatedAt: '2026-04-28 11:00',
  },
  {
    id: 'insight-003',
    regionId: 'north',
    regionTitle: '华北',
    sourceType: '告警',
    sourceTypeTitle: '设备告警',
    trendLabel: '高风险设备集中暴露',
    trendValue: '+6 台',
    completionRate: '93.8%',
    anomalyCount: 11,
    topRiskPoint: '北京核心机房温控告警',
    updatedAt: '2026-04-28 09:42',
  },
  {
    id: 'insight-004',
    regionId: 'nationwide',
    regionTitle: '全国',
    sourceType: '派单',
    sourceTypeTitle: '人工派单',
    trendLabel: '长尾工单持续收敛',
    trendValue: '-14.6%',
    completionRate: '96.1%',
    anomalyCount: 4,
    topRiskPoint: '临期备件补货延迟',
    updatedAt: '2026-04-27 18:35',
  },
]

function includesText(value: string | undefined, keyword: string) {
  if (!keyword) return true
  return (value ?? '').toLowerCase().includes(keyword.toLowerCase())
}

function buildPagedResponse<T>(list: T[], params: GetDataSourceParamsType): PagedResponse<T> {
  const current = params.pagination?.current ?? 1
  const pageSize = params.pagination?.pageSize ?? 20
  const start = (current - 1) * pageSize

  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    current,
    pageSize,
  }
}

export const visualizationRegionOptions = regionOptions
export const visualizationSourceTypeOptions = sourceTypeOptions

export async function getVisualizationMetrics() {
  return visualizationMetrics
}

export async function getVisualizationTrendData() {
  return trendData
}

export async function getVisualizationSourceData() {
  return sourceData
}

export async function getVisualizationRankingData() {
  return rankingData
}

export async function getVisualizationServiceLoadData() {
  return serviceLoadData
}

export async function getVisualizationRecoveryData() {
  return recoveryData
}

export async function getVisualizationDualAxisData() {
  return dualAxisData
}

export async function getVisualizationGaugeData() {
  return gaugeData
}

export async function getVisualizationStackedColumnData() {
  return stackedColumnData
}

export async function getVisualizationGroupedColumnData() {
  return groupedColumnData
}

export async function getVisualizationLiquidData() {
  return liquidData
}

export async function getVisualizationFunnelData() {
  return funnelData
}

export async function getVisualizationRadarData() {
  return radarData
}

export function queryVisualizationInsightRows(params: GetDataSourceParamsType) {
  const values = toValues((params.filters ?? []) as Required<GetDataSourceParamsType>['filters'])
  const keyword = values.keyword != null ? String(values.keyword) : ''
  const regionId = values.regionId != null ? String(values.regionId) : ''
  const sourceType = values.sourceType != null ? String(values.sourceType) : ''

  return insightRows.filter((row) => {
    const matchedRegion = !regionId || row.regionId === regionId
    const matchedSource = !sourceType || row.sourceType === sourceType
    const keywordMatched =
      !keyword ||
      includesText(row.regionTitle, keyword) ||
      includesText(row.topRiskPoint, keyword) ||
      includesText(row.trendLabel, keyword)

    return matchedRegion && matchedSource && keywordMatched
  })
}

export async function getVisualizationTableList(params: GetDataSourceParamsType) {
  return buildPagedResponse(queryVisualizationInsightRows(params), params)
}
