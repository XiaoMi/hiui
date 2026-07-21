import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import {
  Area,
  Bar,
  Column,
  DualAxes,
  Funnel,
  Gauge,
  Line,
  Liquid,
  Pie,
  Radar,
} from '@ant-design/charts'
import { extendDsl, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { TypicalPageFieldMapProvider } from '@hiui-design/typical-page-shells'
import {
  ProListPageProvider,
  queryFilterDatePickerOverlay,
  queryFilterPickerOverlay,
} from '@hiui-design/typical-page-shells/pro-list-page'
import {
  StatListPageFrame,
  renderStatTableTextEllipsis,
} from '@hiui-design/typical-page-shells/pro-stat-page'
import {
  createHiuiBarLikeColorScale,
  createHiuiCategoricalDomainScale,
  createHiuiColorScale,
  createHiuiColumnLikeColorScale,
  createHiuiColumnLikeScale,
  hiuiBarMaxWidth,
  hiuiChartTokens,
  createHiuiSingleSeriesScale,
  hiuiCartesianAxis,
  hiuiDistinctCategoricalPalette,
  hiuiRadarAxis,
  hiuiSequentialBluePalette,
  pickHiuiUniqueColors,
  resolveHiuiSeriesColor,
  withHiuiMiniChart,
  withHiuiResponsiveChart,
} from '../charts/hiui-chart-theme'
import {
  getVisualizationFunnelData,
  getVisualizationGaugeData,
  getVisualizationGroupedColumnData,
  getVisualizationLiquidData,
  getVisualizationMetrics,
  getVisualizationDualAxisData,
  getVisualizationRecoveryData,
  getVisualizationRadarData,
  getVisualizationRankingData,
  getVisualizationServiceLoadData,
  getVisualizationSourceData,
  getVisualizationStackedColumnData,
  queryVisualizationInsightRows,
  getVisualizationTrendData,
  visualizationRegionOptions,
  visualizationSourceTypeOptions,
} from './data-visualization.mock'
import {
  filterListByKeyword,
  getKeywordValue,
  getParamsWithoutKeyword,
  paginateList,
} from './request-utils'
import {
  createManagedQueryDateRangeField,
  createManagedQuerySelectField,
} from '@/typical-page-reuse/query-filter/managed-query-filter-fields'
import styles from './data-visualization.module.scss'
import { useTranslation } from '../../translation'

type VisualizationMetric = {
  chartType?: 'area' | 'column'
  note: string
  seriesColor: string
  sparkline: number[]
  title: string
  value: string
}

type TrendDatum = {
  label: string
  month: string
  series: string
  value: number
}

type SourceDatum = {
  type: string
  value: number
}

type RankingDatum = {
  kind: string
  team: string
  value: number
}

type ServiceLoadDatum = {
  count: number
  period: string
}

type RecoveryDatum = {
  day: string
  duration: number
}

type DualAxisDatum = {
  completionRate: number
  month: string
  taskCount: number
}

type GaugeDatum = {
  label: string
  percent: number
  valueText: string
}

type StackedColumnDatum = {
  month: string
  phase: string
  value: number
}

type GroupedColumnDatum = {
  month: string
  team: string
  value: number
}

type LiquidDatum = {
  label: string
  percent: number
  valueText: string
}

type FunnelDatum = {
  stage: string
  value: number
}

type RadarDatum = {
  dimension: string
  score: number
  team: string
}

const METRIC_CARD_INSET = 16
const CHART_CARD_INSET = 16
const sectionStyles = {
  cardGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
  },
  metricCard: {
    background: hiuiChartTokens.surface,
    border: `1px solid ${hiuiChartTokens.border}`,
    borderRadius: 8,
    display: 'grid',
    gap: 10,
    minWidth: 0,
    overflow: 'hidden',
    padding: METRIC_CARD_INSET,
  },
  metricTitle: {
    color: hiuiChartTokens.textTertiary,
    fontSize: 14,
    lineHeight: '22px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  metricValue: {
    color: hiuiChartTokens.text,
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '32px',
  },
  metricValueRow: {
    alignItems: 'baseline',
    columnGap: 8,
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  metricNote: {
    color: hiuiChartTokens.textMeta,
    fontSize: 12,
    lineHeight: '20px',
  },
  metricSparkline: {
    minWidth: 0,
  },
  metricChartContent: {
    minWidth: 0,
    overflow: 'hidden',
  },
  chartGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
  },
  chartCard: {
    background: hiuiChartTokens.surface,
    border: `1px solid ${hiuiChartTokens.border}`,
    borderRadius: 8,
    display: 'grid',
    gap: 12,
    minWidth: 0,
    overflow: 'hidden',
    padding: CHART_CARD_INSET,
  },
  chartHeader: {
    display: 'grid',
    gap: 4,
  },
  chartTitle: {
    color: hiuiChartTokens.text,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px',
  },
  chartDescription: {
    color: hiuiChartTokens.textTertiary,
    fontSize: 12,
    lineHeight: '20px',
  },
  chartContent: {
    margin: `0 -${CHART_CARD_INSET}px -${CHART_CARD_INSET}px`,
    minWidth: 0,
    overflow: 'hidden',
    width: `calc(100% + ${CHART_CARD_INSET * 2}px)`,
  },
  liquidChartContent: {
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
    overflow: 'hidden',
    paddingBottom: CHART_CARD_INSET,
  },
  liquidChartShell: {
    height: 320,
    margin: '0 auto',
    maxWidth: '100%',
    minWidth: 0,
    overflow: 'hidden',
    position: 'relative',
    width: 'min(100%, 320px)',
  },
  liquidChartOverlay: {
    alignContent: 'center',
    display: 'grid',
    inset: 0,
    justifyItems: 'center',
    pointerEvents: 'none',
    position: 'absolute',
  },
  liquidChartValue: {
    color: hiuiChartTokens.text,
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '32px',
  },
  liquidChartLabel: {
    color: hiuiChartTokens.textTertiary,
    fontSize: 12,
    lineHeight: '20px',
  },
} as const

const T = extendDsl(ReadonlyFieldCreator, {
  renderEllipsis() {
    return this.renderCell((cellValue) => renderStatTableTextEllipsis(cellValue))
  },
})

function MetricCard({ item }: { item: VisualizationMetric }) {
  const { t } = useTranslation()
  const seriesColor = resolveHiuiSeriesColor(item.seriesColor || 'main')
  const chartType = item.chartType ?? 'area'
  const translatedTitle = t(item.title)
  const translatedNote = t(item.note)

  const sparklineData = useMemo(
    () =>
      item.sparkline.map((value, index) => ({
        index: String(index + 1),
        value,
      })),
    [item.sparkline]
  )

  const sparklineExtent = useMemo(() => {
    const values = item.sparkline
    const min = Math.min(...values)
    const max = Math.max(...values)
    return min === max ? [min - 1, max + 1] : [min, max]
  }, [item.sparkline])

  const sparklineConfig = useMemo(
    () =>
      withHiuiMiniChart({
        colorField: 'series',
        data: sparklineData.map((point) => ({
          ...point,
          series: translatedTitle,
        })),
        height: 52,
        line: {
          style: {
            lineWidth: 2,
            stroke: seriesColor,
          },
        },
        point: false,
        scale: createHiuiColorScale([seriesColor], {
          y: {
            domain: sparklineExtent,
            nice: false,
            zero: false,
          },
        }),
        smooth: true,
        style: {
          fillOpacity: 0.05,
        },
        xField: 'index',
        yField: 'value',
      }),
    [seriesColor, sparklineData, sparklineExtent, translatedTitle]
  )

  const sparklineColumnMax = useMemo(
    () => Math.max(...item.sparkline, 1),
    [item.sparkline]
  )

  const sparklineColumnConfig = useMemo(
    () =>
      withHiuiMiniChart({
        colorField: 'series',
        data: sparklineData.map((point) => ({
          ...point,
          series: translatedTitle,
        })),
        height: 52,
        scale: createHiuiColorScale([seriesColor], {
          x: {
            paddingInner: 0,
            paddingOuter: 0,
          },
          y: {
            domain: [0, sparklineColumnMax],
            nice: false,
            zero: true,
          },
        }),
        style: {
          fill: seriesColor,
          fillOpacity: 0.9,
          insetBottom: 0,
          insetLeft: 1,
          insetRight: 1,
          maxWidth: hiuiBarMaxWidth,
        },
        xField: 'index',
        yField: 'value',
      }),
    [seriesColor, sparklineColumnMax, sparklineData, translatedTitle]
  )

  return (
    <article style={sectionStyles.metricCard}>
      <div style={sectionStyles.metricTitle} title={translatedTitle}>
        {translatedTitle}
      </div>
      <div style={sectionStyles.metricValueRow}>
        <div style={sectionStyles.metricValue}>{item.value}</div>
        <div style={sectionStyles.metricNote}>{translatedNote}</div>
      </div>
      <div
        style={{
          ...sectionStyles.metricChartContent,
          ...(chartType === 'column' ? null : sectionStyles.metricSparkline),
        }}
      >
        {chartType === 'column' ? (
          <Column {...sparklineColumnConfig} />
        ) : (
          <Area {...sparklineConfig} />
        )}
      </div>
    </article>
  )
}

function ChartCard({
  chartType,
  children,
  contentStyle,
}: {
  chartType:
    | 'line'
    | 'pie'
    | 'column'
    | 'area'
    | 'bar'
    | 'dualAxes'
    | 'gauge'
    | 'stackedColumn'
    | 'groupedColumn'
    | 'liquid'
    | 'funnel'
    | 'radar'
  children: ReactNode
  contentStyle?: CSSProperties
}) {
  const { t } = useTranslation()
  const chartTypeTitleMap = {
    line: '折线图',
    pie: '饼图',
    column: '柱状图',
    area: '面积图',
    bar: '条形图',
    dualAxes: '双轴柱线图',
    gauge: '仪表盘',
    stackedColumn: '堆叠柱状图',
    groupedColumn: '分组柱状图',
    liquid: '水波图',
    funnel: '漏斗图',
    radar: '雷达图',
  } as const

  return (
    <section style={sectionStyles.chartCard}>
      <header style={sectionStyles.chartHeader}>
        <div style={sectionStyles.chartTitle}>{t(chartTypeTitleMap[chartType])}</div>
      </header>
      <div style={contentStyle ?? sectionStyles.chartContent}>
        {children}
      </div>
    </section>
  )
}

function VisualizationStatSection() {
  const { t } = useTranslation()
  const [dualAxisData, setDualAxisData] = useState<DualAxisDatum[]>([])
  const [funnelData, setFunnelData] = useState<FunnelDatum[]>([])
  const [gaugeData, setGaugeData] = useState<GaugeDatum | null>(null)
  const [groupedColumnData, setGroupedColumnData] = useState<GroupedColumnDatum[]>([])
  const [liquidData, setLiquidData] = useState<LiquidDatum | null>(null)
  const [metrics, setMetrics] = useState<VisualizationMetric[]>([])
  const [radarData, setRadarData] = useState<RadarDatum[]>([])
  const [rankingData, setRankingData] = useState<RankingDatum[]>([])
  const [recoveryData, setRecoveryData] = useState<RecoveryDatum[]>([])
  const [serviceLoadData, setServiceLoadData] = useState<ServiceLoadDatum[]>([])
  const [stackedColumnData, setStackedColumnData] = useState<StackedColumnDatum[]>([])
  const [sourceData, setSourceData] = useState<SourceDatum[]>([])
  const [trendData, setTrendData] = useState<TrendDatum[]>([])

  useEffect(() => {
    let active = true

    async function load() {
      const [
        nextMetrics,
        nextTrendData,
        nextSourceData,
        nextRankingData,
        nextServiceLoadData,
        nextRecoveryData,
        nextDualAxisData,
        nextGaugeData,
        nextStackedColumnData,
        nextGroupedColumnData,
        nextLiquidData,
        nextFunnelData,
        nextRadarData,
      ] = await Promise.all([
        getVisualizationMetrics(),
        getVisualizationTrendData(),
        getVisualizationSourceData(),
        getVisualizationRankingData(),
        getVisualizationServiceLoadData(),
        getVisualizationRecoveryData(),
        getVisualizationDualAxisData(),
        getVisualizationGaugeData(),
        getVisualizationStackedColumnData(),
        getVisualizationGroupedColumnData(),
        getVisualizationLiquidData(),
        getVisualizationFunnelData(),
        getVisualizationRadarData(),
      ])

      if (!active) return
      setDualAxisData(nextDualAxisData)
      setFunnelData(nextFunnelData)
      setGaugeData(nextGaugeData)
      setGroupedColumnData(nextGroupedColumnData)
      setLiquidData(nextLiquidData)
      setMetrics(nextMetrics)
      setRadarData(nextRadarData)
      setRankingData(nextRankingData)
      setRecoveryData(nextRecoveryData)
      setServiceLoadData(nextServiceLoadData)
      setStackedColumnData(nextStackedColumnData)
      setSourceData(nextSourceData)
      setTrendData(nextTrendData)
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  const chartLegendConfig = useMemo(
    () => ({
      color: {
        itemLabelFill: hiuiChartTokens.textSecondary,
        position: 'top' as const,
      },
    }),
    []
  )

  const translatedMetrics = useMemo(
    () => metrics.map((item) => ({ ...item, title: t(item.title), note: t(item.note) })),
    [metrics, t]
  )

  const translatedTrendData = useMemo(
    () => trendData.map((item) => ({ ...item, label: t(item.label) })),
    [trendData, t]
  )

  const translatedSourceData = useMemo(
    () => sourceData.map((item) => ({ ...item, type: t(item.type) })),
    [sourceData, t]
  )

  const translatedRankingData = useMemo(
    () => rankingData.map((item) => ({ ...item, team: t(item.team) })),
    [rankingData, t]
  )

  const translatedRecoveryData = useMemo(
    () => recoveryData.map((item) => ({ ...item, day: t(item.day) })),
    [recoveryData, t]
  )

  const translatedGaugeData = useMemo(
    () => (gaugeData ? { ...gaugeData, label: t(gaugeData.label) } : null),
    [gaugeData, t]
  )

  const translatedStackedColumnData = useMemo(
    () => stackedColumnData.map((item) => ({ ...item, phase: t(item.phase) })),
    [stackedColumnData, t]
  )

  const translatedGroupedColumnData = useMemo(
    () => groupedColumnData.map((item) => ({ ...item, team: t(item.team) })),
    [groupedColumnData, t]
  )

  const translatedLiquidData = useMemo(
    () => (liquidData ? { ...liquidData, label: t(liquidData.label) } : null),
    [liquidData, t]
  )

  const translatedFunnelData = useMemo(
    () => funnelData.map((item) => ({ ...item, stage: t(item.stage) })),
    [funnelData, t]
  )

  const translatedRadarData = useMemo(
    () =>
      radarData.map((item) => ({
        ...item,
        dimension: t(item.dimension),
        team: t(item.team),
      })),
    [radarData, t]
  )

  const taskCountLabel = t('任务量')
  const completionRateLabel = t('闭环率')

  const trendConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        axis: hiuiCartesianAxis,
        colorField: 'label',
        data: translatedTrendData,
        height: 280,
        legend: chartLegendConfig,
        point: {
          shapeField: 'circle',
          size: 4,
          style: {
            fill: hiuiChartTokens.surface,
            lineWidth: 2,
          },
        },
        scale: createHiuiCategoricalDomainScale(
          translatedTrendData.map((item) => item.label),
          [resolveHiuiSeriesColor('main'), resolveHiuiSeriesColor('positive')]
        ),
        smooth: true,
        xField: 'month',
        yField: 'value',
      }),
    [chartLegendConfig, translatedTrendData]
  )

  const sourceConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        angleField: 'value',
        colorField: 'type',
        data: translatedSourceData,
        height: 280,
        innerRadius: 0.62,
        label: {
          position: 'spider',
          text: 'type',
        },
        legend: chartLegendConfig,
        scale: createHiuiCategoricalDomainScale(
          translatedSourceData.map((item) => item.type),
          pickHiuiUniqueColors(translatedSourceData.length)
        ),
      }),
    [chartLegendConfig, translatedSourceData]
  )

  const serviceLoadConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        axis: hiuiCartesianAxis,
        data: serviceLoadData,
        height: 280,
        scale: {
          ...createHiuiSingleSeriesScale(),
          ...createHiuiColumnLikeScale(),
        },
        style: {
          fill: resolveHiuiSeriesColor('main'),
        },
        xField: 'period',
        yField: 'count',
      }),
    [serviceLoadData]
  )

  const recoveryConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        axis: hiuiCartesianAxis,
        data: translatedRecoveryData,
        height: 280,
        line: {
          style: {
            lineWidth: 2,
            stroke: resolveHiuiSeriesColor('main'),
          },
        },
        scale: createHiuiSingleSeriesScale(),
        smooth: true,
        style: {
          fill: `l(270) 0:${hiuiChartTokens.primaryWash} 1:${hiuiChartTokens.primary}`,
          fillOpacity: 0.2,
        },
        xField: 'day',
        yField: 'duration',
      }),
    [translatedRecoveryData]
  )

  const rankingConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        axis: hiuiCartesianAxis,
        colorField: 'team',
        data: translatedRankingData,
        height: 300,
        legend: chartLegendConfig,
        scale: createHiuiCategoricalDomainScale(
          translatedRankingData.map((item) => item.team),
          pickHiuiUniqueColors(translatedRankingData.length, hiuiDistinctCategoricalPalette),
          createHiuiBarLikeColorScale([], 'x')
        ),
        xField: 'team',
        yField: 'value',
      }),
    [chartLegendConfig, translatedRankingData]
  )

  const dualAxisConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        axis: {
          x: {
            ...hiuiCartesianAxis.x,
            labelAutoHide: false,
            title: false,
          },
          y: false,
        },
        animate: false,
        children: [
          {
            axis: {
              y: {
                ...hiuiCartesianAxis.y,
                position: 'left',
                title: false,
              },
            },
            colorField: () => taskCountLabel,
            scale: {
              ...createHiuiColumnLikeScale(),
              y: {
                key: 'taskCountScale',
                nice: true,
              },
            },
            style: {
              fill: resolveHiuiSeriesColor('main'),
              fillOpacity: 0.9,
            },
            type: 'interval',
            yField: 'taskCount',
          },
          {
            axis: {
              x: false,
              y: {
                grid: false,
                labelAutoHide: true,
                line: true,
                lineLineWidth: 1,
                lineStroke: hiuiChartTokens.border,
                lineStrokeOpacity: 1,
                position: 'right',
                tick: false,
                title: false,
              },
            },
            colorField: () => completionRateLabel,
            point: false,
            scale: {
              y: {
                domain: [88, 100],
                key: 'completionRateScale',
                nice: false,
              },
            },
            smooth: true,
            style: {
              lineWidth: 2,
              stroke: resolveHiuiSeriesColor('info'),
            },
            type: 'line',
            yField: 'completionRate',
          },
        ],
        data: dualAxisData,
        height: 336,
        interaction: {
          tooltip: {
            shared: true,
          },
        },
        legend: {
          color: {
            itemLabelFill: hiuiChartTokens.textSecondary,
            itemMarker: (value: string) => (value === completionRateLabel ? 'line' : 'square'),
            position: 'top',
          },
        },
        scale: {
          color: {
            domain: [taskCountLabel, completionRateLabel],
            range: [resolveHiuiSeriesColor('main'), resolveHiuiSeriesColor('info')],
          },
          y: {
            independent: true,
          },
        },
        xField: 'month',
      }),
    [completionRateLabel, dualAxisData, taskCountLabel]
  )

  const gaugeConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        data: { percent: translatedGaugeData?.percent ?? 0 },
        height: 280,
        legend: false,
        scale: createHiuiColorScale([
          resolveHiuiSeriesColor('main'),
          hiuiChartTokens.primaryWash,
        ]),
        style: {
          arcShape: 'round',
          pinFill: hiuiChartTokens.surface,
          pinLineWidth: 2,
          pinR: 8,
          pinStroke: resolveHiuiSeriesColor('main'),
          pointerLineCap: 'round',
          pointerLineWidth: 5,
          pointerStroke: hiuiChartTokens.primaryPressed,
          textContent: () => translatedGaugeData?.valueText ?? '0%',
          textFill: hiuiChartTokens.text,
          textFontSize: 28,
          textFontWeight: 600,
        },
        tooltip: false,
      }),
    [translatedGaugeData]
  )

  const stackedColumnConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        axis: hiuiCartesianAxis,
        colorField: 'phase',
        data: translatedStackedColumnData,
        height: 300,
        legend: chartLegendConfig,
        scale: createHiuiCategoricalDomainScale(
          translatedStackedColumnData.map((item) => item.phase),
          [
            resolveHiuiSeriesColor('main'),
            resolveHiuiSeriesColor('info'),
            resolveHiuiSeriesColor('positive'),
          ],
          createHiuiColumnLikeColorScale([], 'x')
        ),
        stack: true,
        xField: 'month',
        yField: 'value',
      }),
    [chartLegendConfig, translatedStackedColumnData]
  )

  const groupedColumnConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        axis: hiuiCartesianAxis,
        colorField: 'team',
        data: translatedGroupedColumnData,
        group: true,
        height: 300,
        legend: chartLegendConfig,
        scale: createHiuiCategoricalDomainScale(
          translatedGroupedColumnData.map((item) => item.team),
          [
            resolveHiuiSeriesColor('main'),
            resolveHiuiSeriesColor('info'),
            hiuiChartTokens.accent,
          ],
          createHiuiColumnLikeColorScale([], 'x')
        ),
        xField: 'month',
        yField: 'value',
      }),
    [chartLegendConfig, translatedGroupedColumnData]
  )

  const liquidConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        colorField: 'type',
        height: 320,
        legend: false,
        margin: 0,
        padding: 0,
        percent: translatedLiquidData?.percent ?? 0,
        scale: createHiuiColorScale([resolveHiuiSeriesColor('positive')]),
        style: {
          backgroundFill: hiuiChartTokens.surface,
          contentFill: 'transparent',
          fill: resolveHiuiSeriesColor('positive'),
          outlineStroke: resolveHiuiSeriesColor('positive'),
        },
        tooltip: false,
      }),
    [translatedLiquidData]
  )

  const funnelConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        colorField: 'stage',
        data: translatedFunnelData,
        height: 320,
        label: {
          position: 'inside',
          text: (datum: FunnelDatum) => `${datum.stage} ${datum.value}`,
          transform: [{ type: 'contrastReverse' }],
        },
        legend: false,
        scale: createHiuiCategoricalDomainScale(
          translatedFunnelData.map((item) => item.stage),
          hiuiSequentialBluePalette.slice(-Math.max(translatedFunnelData.length, 1)).reverse()
        ),
        xField: 'stage',
        yField: 'value',
      }),
    [translatedFunnelData]
  )

  const radarConfig = useMemo(
    () => {
      const radarTeams = Array.from(new Set(translatedRadarData.map((item) => item.team)))

      return withHiuiResponsiveChart({
        axis: hiuiRadarAxis,
        area: {
          style: {
            fillOpacity: 0.12,
          },
        },
        colorField: 'team',
        data: translatedRadarData,
        height: 320,
        legend: {
          color: {
            ...chartLegendConfig.color,
            itemMarker: (team) =>
              team === radarTeams[0] ? 'hyphen' : 'diamond',
          },
        },
        point: {
          size: 4,
        },
        scale: createHiuiCategoricalDomainScale(
          radarTeams,
          pickHiuiUniqueColors(new Set(translatedRadarData.map((item) => item.team)).size)
        ),
        style: {
          lineWidth: 2,
        },
        xField: 'dimension',
        yField: 'score',
      })
    },
    [chartLegendConfig, translatedRadarData]
  )

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={sectionStyles.cardGrid}>
        {translatedMetrics.map((item) => (
          <MetricCard key={item.title} item={item} />
        ))}
      </div>

      <div style={sectionStyles.chartGrid}>
        <ChartCard chartType="line">
          <Line {...trendConfig} />
        </ChartCard>

        <ChartCard chartType="pie">
          <Pie {...sourceConfig} />
        </ChartCard>
      </div>

      <div style={sectionStyles.chartGrid}>
        <ChartCard chartType="column">
          <Column {...serviceLoadConfig} />
        </ChartCard>

        <ChartCard chartType="area">
          <Area {...recoveryConfig} />
        </ChartCard>
      </div>

      <div style={sectionStyles.chartGrid}>
        <ChartCard chartType="bar">
          <Bar {...rankingConfig} />
        </ChartCard>

        <ChartCard chartType="dualAxes">
          <DualAxes {...dualAxisConfig} />
        </ChartCard>

      </div>

      <div style={sectionStyles.chartGrid}>
        <ChartCard chartType="gauge">
          <Gauge {...gaugeConfig} />
        </ChartCard>

        <ChartCard chartType="radar">
          <Radar {...radarConfig} />
        </ChartCard>
      </div>

      <div className={styles.chartPairGrid}>
        <ChartCard chartType="liquid" contentStyle={sectionStyles.liquidChartContent}>
          <div style={sectionStyles.liquidChartShell}>
            <Liquid {...liquidConfig} />
            <div style={sectionStyles.liquidChartOverlay}>
              <div style={sectionStyles.liquidChartValue}>
                {liquidData?.valueText ?? '0%'}
              </div>
              <div style={sectionStyles.liquidChartLabel}>
                {translatedLiquidData?.label ?? t('闭环率')}
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard chartType="funnel">
          <Funnel {...funnelConfig} />
        </ChartCard>
      </div>

      <div style={sectionStyles.chartGrid}>
        <ChartCard chartType="stackedColumn">
          <Column {...stackedColumnConfig} />
        </ChartCard>

        <ChartCard chartType="groupedColumn">
          <Column {...groupedColumnConfig} />
        </ChartCard>
      </div>
    </div>
  )
}

function DataVisualizationInner() {
  const { t } = useTranslation()

  const queryFields = useMemo(
    () => [
      createManagedQuerySelectField({
        field: 'regionId',
        label: t('区域'),
        data: visualizationRegionOptions.map((item) => ({ ...item, title: t(item.title) })),
        overlay: queryFilterPickerOverlay,
      }),
      createManagedQuerySelectField({
        field: 'sourceType',
        label: t('任务来源'),
        data: visualizationSourceTypeOptions.map((item) => ({ ...item, title: t(item.title) })),
        overlay: queryFilterPickerOverlay,
      }),
      createManagedQueryDateRangeField({
        field: 'timeRange',
        label: t('时间范围'),
        format: 'YYYY-MM-DD',
        overlay: queryFilterDatePickerOverlay,
      }),
    ],
    [t]
  )

  const tableFields = useMemo(
    () => [
      T(t('区域'), 'regionTitle').W(100).renderEllipsis().val,
      T(t('任务来源'), 'sourceTypeTitle').W(120).renderEllipsis().val,
      T(t('趋势洞察'), 'trendLabel').W(180).renderEllipsis().val,
      T(t('趋势变化'), 'trendValue').W(100).val,
      T(t('闭环率'), 'completionRate').W(100).val,
      T(t('异常数'), 'anomalyCount').W(90).val,
      T(t('重点风险点'), 'topRiskPoint').W(240).renderEllipsis().val,
      T(t('最近更新'), 'updatedAt').W(160).renderEllipsis().val,
    ],
    [t]
  )

  return (
    <div className={styles.pageRoot}>
      <StatListPageFrame
        title={t('数据可视化')}
        queryFields={queryFields}
        searchPlaceholder={t('区域 / 风险点 / 趋势洞察')}
        statSection={<VisualizationStatSection />}
        tableFields={tableFields}
        tableProps={{ maxHeight: undefined }}
      />
    </div>
  )
}

export function DataVisualizationPage() {
  const { locale, t } = useTranslation()
  const translatedRequest = useCallback(
    async (params: Parameters<typeof queryVisualizationInsightRows>[0]) => {
      const keyword = getKeywordValue(params)
      const nextParams = getParamsWithoutKeyword(params)
      const translatedList = queryVisualizationInsightRows(nextParams).map((row) => ({
        ...row,
        completionRate: t(row.completionRate),
        regionTitle: t(row.regionTitle),
        sourceTypeTitle: t(row.sourceTypeTitle),
        topRiskPoint: t(row.topRiskPoint),
        trendLabel: t(row.trendLabel),
        trendValue: t(row.trendValue),
      }))
      const filteredList = filterListByKeyword(translatedList, keyword, [
        (row) => row.regionTitle,
        (row) => row.topRiskPoint,
        (row) => row.trendLabel,
      ])

      return paginateList(filteredList, nextParams)
    },
    [t]
  )

  return (
    <ProListPageProvider key={locale} request={translatedRequest}>
      <TypicalPageFieldMapProvider key={locale}>
        <DataVisualizationInner />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}
