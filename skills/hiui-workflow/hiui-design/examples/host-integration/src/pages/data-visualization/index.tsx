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
import { extendDsl, F, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { TypicalPageFieldMapProvider } from '../../components/hiui-design-runtime'
import {
  ProListPageProvider,
  queryFilterDatePickerOverlay,
  queryFilterPickerOverlay,
} from '../../components/hiui-design-runtime/pro-list-page'
import {
  StatListPageFrame,
  renderStatTableTextEllipsis,
} from '../../components/hiui-design-runtime/pro-stat-page'
import {
  createHiuiBarLikeColorScale,
  createHiuiAreaTrendConfig,
  createHiuiCategoricalDomainScale,
  createHiuiColorScale,
  createHiuiColumnLikeColorScale,
  createHiuiColumnLikeScale,
  createHiuiSingleSeriesScale,
  hiuiBarMaxWidth,
  hiuiCartesianAxis,
  hiuiChartTokens,
  hiuiDistinctCategoricalPalette,
  hiuiRadarAxis,
  hiuiSequentialBluePalette,
  pickHiuiUniqueColors,
  resolveHiuiSeriesColor,
  withHiuiMiniChart,
  withHiuiResponsiveChart,
} from './chart-theme'
import {
  getVisualizationDualAxisData,
  getVisualizationFunnelData,
  getVisualizationGaugeData,
  getVisualizationGroupedColumnData,
  getVisualizationLiquidData,
  getVisualizationMetrics,
  getVisualizationRadarData,
  getVisualizationRankingData,
  getVisualizationRecoveryData,
  getVisualizationServiceLoadData,
  getVisualizationSourceData,
  getVisualizationStackedColumnData,
  getVisualizationTrendData,
  queryVisualizationInsightRows,
  visualizationRegionOptions,
  visualizationSourceTypeOptions,
} from './mock'
import {
  filterListByKeyword,
  getKeywordValue,
  getParamsWithoutKeyword,
  paginateList,
} from './request-utils'
import {
  ChartCard as AnalyticsChartCard,
  MetricCard as AnalyticsMetricCard,
} from '../../runtime/analytics-primitives'
import styles from './index.module.scss'
import { useTranslation } from './page-localization'

type VisualizationMetric = {
  chartType?: 'area' | 'column'
  note: string
  seriesColor: string
  sparkline?: number[]
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

type VisualizationChartType =
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

type VisualizationChartCard = {
  chartType: VisualizationChartType
  content: ReactNode
  contentStyle?: CSSProperties
  key: string
}

type VisualizationChartRow = {
  items: VisualizationChartCard[]
  key: string
  layout: 'featured' | 'standard'
}

function isVisualizationChartCard(
  item: VisualizationChartCard | undefined
): item is VisualizationChartCard {
  return Boolean(item)
}

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

const METRIC_CARD_INSET = 16
const CHART_CARD_INSET = 16
const sectionStyles = {
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
  chartCard: {
    background: hiuiChartTokens.surface,
    border: `1px solid ${hiuiChartTokens.border}`,
    borderRadius: 8,
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    gap: 12,
    height: '100%',
    minHeight: '100%',
    minWidth: 0,
    overflow: 'hidden',
    padding: CHART_CARD_INSET,
  },
  chartHeader: {
    display: 'grid',
    flex: '0 0 auto',
    gap: 4,
  },
  chartTitle: {
    color: hiuiChartTokens.text,
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '24px',
  },
  chartContent: {
    alignItems: 'stretch',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    margin: `0 -${CHART_CARD_INSET}px -${CHART_CARD_INSET}px`,
    minHeight: 0,
    minWidth: 0,
    overflow: 'hidden',
    width: `calc(100% + ${CHART_CARD_INSET * 2}px)`,
  },
  liquidChartContent: {
    alignItems: 'center',
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'center',
    margin: 0,
    minHeight: 0,
    minWidth: 0,
    overflow: 'hidden',
    paddingBottom: CHART_CARD_INSET,
    width: '100%',
  },
  gaugeChartContent: {
    minHeight: 320,
  },
  liquidChartShell: {
    height: 304,
    margin: '0 auto',
    maxWidth: '100%',
    minWidth: 0,
    overflow: 'hidden',
    position: 'relative',
    width: 'min(100%, 304px)',
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

  const metricVisualByTitle = useMemo(() => {
    const visualByTitle = new Map<string, ReactNode>()

    translatedMetrics.forEach((item) => {
      const seriesColor = resolveHiuiSeriesColor(item.seriesColor || 'main')
      const chartType = item.chartType ?? 'area'
      const sparklineValues = item.sparkline ?? []
      const hasMiniChart = sparklineValues.length > 0

      if (!hasMiniChart) return

      const sparklineData = sparklineValues.map((value, index) => ({
        index: String(index + 1),
        value,
      }))

      const sparklineExtent = (() => {
        const min = Math.min(...sparklineValues)
        const max = Math.max(...sparklineValues)
        return min === max ? [min - 1, max + 1] : [min, max]
      })()

      const sparklineConfig = withHiuiMiniChart({
        colorField: 'series',
        data: sparklineData.map((point) => ({
          ...point,
          series: item.title,
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
      })

      const sparklineColumnConfig = withHiuiMiniChart({
        colorField: 'series',
        data: sparklineData.map((point) => ({
          ...point,
          series: item.title,
        })),
        height: 52,
        scale: createHiuiColorScale([seriesColor], {
          x: {
            paddingInner: 0,
            paddingOuter: 0,
          },
          y: {
            domain: [0, Math.max(...sparklineValues, 1)],
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
      })

      visualByTitle.set(
        item.title,
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
      )
    })

    return visualByTitle
  }, [translatedMetrics])

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
      createHiuiAreaTrendConfig({
        data: translatedRecoveryData,
        scale: createHiuiSingleSeriesScale(),
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
        animate: false,
        children: [
          {
            axis: {
              x: {
                ...hiuiCartesianAxis.x,
                labelAutoHide: false,
                labelAutoRotate: false,
                title: false,
              },
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
        paddingBottom: 36,
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
        coordinate: {
          endAngle: 0,
          innerRadius: 0.82,
          outerRadius: 1,
          startAngle: -Math.PI,
        },
        data: { percent: translatedGaugeData?.percent ?? 0 },
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
          textY: '68%',
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
        height: 304,
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

  const radarConfig = useMemo(() => {
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
          itemMarker: (team) => (team === radarTeams[0] ? 'hyphen' : 'diamond'),
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
  }, [chartLegendConfig.color, translatedRadarData])

  const chartCards: VisualizationChartCard[] = [
    {
      chartType: 'line',
      content: <Line {...trendConfig} />,
      key: 'trend',
    },
    {
      chartType: 'pie',
      content: <Pie {...sourceConfig} />,
      key: 'source',
    },
    {
      chartType: 'dualAxes',
      content: <DualAxes {...dualAxisConfig} />,
      key: 'dualAxes',
    },
    {
      chartType: 'column',
      content: <Column {...serviceLoadConfig} />,
      key: 'serviceLoad',
    },
    {
      chartType: 'stackedColumn',
      content: <Column {...stackedColumnConfig} />,
      key: 'stackedColumn',
    },
    {
      chartType: 'groupedColumn',
      content: <Column {...groupedColumnConfig} />,
      key: 'groupedColumn',
    },
    {
      chartType: 'bar',
      content: <Bar {...rankingConfig} />,
      key: 'ranking',
    },
    {
      chartType: 'area',
      content: <Area {...recoveryConfig} />,
      key: 'recovery',
    },
    {
      chartType: 'gauge',
      content: <Gauge {...gaugeConfig} />,
      contentStyle: sectionStyles.gaugeChartContent,
      key: 'gauge',
    },
    {
      chartType: 'radar',
      content: <Radar {...radarConfig} />,
      key: 'radar',
    },
    {
      chartType: 'liquid',
      content: (
        <div style={sectionStyles.liquidChartShell}>
          <Liquid {...liquidConfig} />
          <div style={sectionStyles.liquidChartOverlay}>
            <div style={sectionStyles.liquidChartValue}>{liquidData?.valueText ?? '0%'}</div>
            <div style={sectionStyles.liquidChartLabel}>
              {translatedLiquidData?.label ?? t('闭环率')}
            </div>
          </div>
        </div>
      ),
      contentStyle: sectionStyles.liquidChartContent,
      key: 'liquid',
    },
    {
      chartType: 'funnel',
      content: <Funnel {...funnelConfig} />,
      key: 'funnel',
    },
  ]

  const chartCardMap = new Map(chartCards.map((item) => [item.key, item] as const))
  const chartRows: VisualizationChartRow[] = [
    {
      items: [chartCardMap.get('trend'), chartCardMap.get('source')].filter(
        isVisualizationChartCard
      ),
      key: 'trend-source',
      layout: 'featured',
    },
    {
      items: [chartCardMap.get('dualAxes'), chartCardMap.get('serviceLoad')].filter(
        isVisualizationChartCard
      ),
      key: 'dual-axis-service-load',
      layout: 'featured',
    },
    {
      items: [chartCardMap.get('stackedColumn'), chartCardMap.get('groupedColumn')].filter(
        isVisualizationChartCard
      ),
      key: 'stacked-grouped-column',
      layout: 'featured',
    },
    {
      items: [
        chartCardMap.get('ranking'),
        chartCardMap.get('recovery'),
        chartCardMap.get('gauge'),
      ].filter(isVisualizationChartCard),
      key: 'ranking-recovery-gauge',
      layout: 'standard',
    },
    {
      items: [chartCardMap.get('radar'), chartCardMap.get('liquid'), chartCardMap.get('funnel')]
        .filter(isVisualizationChartCard),
      key: 'radar-liquid-funnel',
      layout: 'standard',
    },
  ]

  return (
    <div className={styles.workspace}>
      <div className={styles.summaryGrid}>
        {translatedMetrics.map((item) => (
          <AnalyticsMetricCard
            key={item.title}
            note={item.note}
            title={item.title}
            titleTooltip={item.title}
            value={item.value}
            visual={metricVisualByTitle.get(item.title)}
          />
        ))}
      </div>

      <section className={styles.chartRows}>
        {chartRows.map((row) => (
          <div
            key={row.key}
            className={row.layout === 'featured' ? styles.chartRowFeatured : styles.chartRowStandard}
          >
            {row.items.map((item, index) => {
              const { chartType, content, contentStyle, key } = item
              const itemClassName =
                row.layout === 'featured' && index === 0
                  ? styles.chartRowFeaturedPrimary
                  : styles.chartRowCell

              return (
                <div key={key} className={itemClassName}>
                  <AnalyticsChartCard title={t(chartTypeTitleMap[chartType])}>
                    <div style={{ ...sectionStyles.chartContent, ...(contentStyle ?? null) }}>
                      {content}
                    </div>
                  </AnalyticsChartCard>
                </div>
              )
            })}
          </div>
        ))}
      </section>
    </div>
  )
}

function DataVisualizationInner() {
  const { t } = useTranslation()

  const queryFields = useMemo(
    () => [
      F(t('区域'), 'regionId')
        .Select({
          data: visualizationRegionOptions.map((item) => ({ ...item, title: t(item.title) })),
          clearable: true,
          overlay: queryFilterPickerOverlay,
        })
        .val,
      F(t('任务来源'), 'sourceType')
        .Select({
          data: visualizationSourceTypeOptions.map((item) => ({ ...item, title: t(item.title) })),
          clearable: true,
          overlay: queryFilterPickerOverlay,
        })
        .val,
      F(t('时间范围'), 'timeRange').Date({
        type: 'daterange',
        format: 'YYYY-MM-DD',
        clearable: true,
        overlay: queryFilterDatePickerOverlay,
      }).val,
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

export default DataVisualizationPage
