import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { ResetOutlined } from '@hi-ui/icons'
import {
  Button,
  DatePicker,
  FilterButton,
  FilterDrawer,
  Pagination,
  PageHeader,
  QueryFilter,
  QueryFilterProvider,
  SearchInput,
  Select,
  Table,
} from '@hi-ui/hiui'
import { useHostAdapter } from '../../host/useHostAdapter'
import styles from './CanonicalDataVisualizationPage.module.scss'

const EMPTY_STATE_IMAGE =
  'https://files.fds.api.xiaomi.com/b2c-xms-01/repairWorkbench/9b52e36ddefe4bab9e9c1777ec4c323b.png'

type QueryFieldValue = string | number | null | [Date, Date]

export type VisualizationStatCard = {
  key: string
  label: string
  value: string
  note?: string
  trendColor?: string
  trendData?: number[]
  trendType?: 'line' | 'column'
}

export type VisualizationQueryField = {
  key: string
  label: string
  control?: 'select' | 'dateRange'
  hidden?: boolean
  options?: Array<{
    id: string | number
    title: string
  }>
  filterMode?: 'contains' | 'equals'
}

export type VisualizationChartDatum = {
  label: string
  value: number
}

export type VisualizationChart = {
  key: string
  title: string
  description?: string
  secondaryData?: number[]
  series?: Array<{
    label: string
    values: number[]
  }>
  type:
    | 'line'
    | 'area'
    | 'bar'
    | 'column'
    | 'pie'
    | 'gauge'
    | 'radar'
    | 'funnel'
    | 'combo'
    | 'liquid'
  data: VisualizationChartDatum[]
}

export type VisualizationTableColumn = {
  key: string
  label: string
  width?: number
}

export type VisualizationRowAction = {
  key: string
  label: string
  message?: string
}

export type DataVisualizationSchema = {
  pageType: 'data-visualization'
  title: string
  searchPlaceholder?: string
  pageSize?: number
  primaryAction?: {
    label: string
    message?: string
  }
  secondaryAction?: {
    label: string
    message?: string
  }
  stats: VisualizationStatCard[]
  queryFields: VisualizationQueryField[]
  charts: VisualizationChart[]
  columns: VisualizationTableColumn[]
  rowActions?: VisualizationRowAction[]
  rows: Array<Record<string, string | number>>
}

function joinClassNames(...tokens: Array<string | undefined | null | false>) {
  return tokens.filter(Boolean).join(' ')
}

function buildEmptyFilters(schema: DataVisualizationSchema) {
  return schema.queryFields.reduce<Record<string, QueryFieldValue>>((acc, field) => {
    acc[field.key] = field.control === 'dateRange' ? null : ''
    return acc
  }, {})
}

function isEmptyFilterValue(value: QueryFieldValue | string) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.every((item) => item == null || item === '')
  }

  return value == null || value === ''
}

function renderQueryControl(field: VisualizationQueryField) {
  if (field.control === 'dateRange') {
    return <DatePicker appearance="contained" label={field.label} type="daterange" clearable />
  }

  return (
    <Select
      className={styles.fullSelect}
      appearance="contained"
      optionWidth="auto"
      searchable
      clearable
      data={field.options || []}
    />
  )
}

function buildLineLikeSeries(
  chart: VisualizationChart,
  kind: 'line' | 'area'
): echarts.SeriesOption[] {
  const seriesList =
    chart.series && chart.series.length > 0
      ? chart.series
      : [
          {
            label: chart.title,
            values: chart.data.map((item) => item.value),
          },
        ]
  const palette = ['#2f63f6', '#46bf79', '#7c6cf6', '#ffb020', '#ff5d5d']

  return seriesList.map((series, index) => ({
    type: 'line',
    name: series.label,
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      color: palette[index % palette.length],
      width: 2,
    },
    itemStyle: {
      color: palette[index % palette.length],
      borderColor: '#fff',
      borderWidth: 2,
    },
    areaStyle:
      kind === 'area'
        ? {
            color: index === 0 ? 'rgba(47, 99, 246, 0.12)' : 'rgba(70, 191, 121, 0.12)',
          }
        : undefined,
    data: series.values,
  }))
}

function buildStatTrendOption(item: VisualizationStatCard): echarts.EChartsCoreOption {
  const values = item.trendData || []
  const color = item.trendColor || '#2f63f6'

  if (item.trendType === 'column') {
    return {
      animation: false,
      grid: {
        top: 4,
        right: 0,
        bottom: 0,
        left: 0,
        containLabel: false,
      },
      xAxis: {
        type: 'category',
        data: values.map((_, index) => String(index + 1)),
        show: false,
      },
      yAxis: {
        type: 'value',
        show: false,
      },
      series: [
        {
          type: 'bar',
          data: values,
          barWidth: 6,
          itemStyle: {
            color,
            borderRadius: [3, 3, 0, 0],
          },
        },
      ],
    }
  }

  return {
    animation: false,
    grid: {
      top: 8,
      right: 0,
      bottom: 0,
      left: 0,
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      data: values.map((_, index) => String(index + 1)),
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        type: 'line',
        data: values,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color,
          width: 2,
        },
        areaStyle: {
          color: `${color}12`,
        },
      },
    ],
  }
}

function buildChartOption(chart: VisualizationChart): echarts.EChartsCoreOption {
  const baseAxisLabel = { color: '#8c93a1', fontSize: 12 }
  const baseSplitLine = {
    lineStyle: { color: '#edf1f5' },
  }

  if (chart.type === 'pie') {
    return {
      animation: false,
      color: ['#2660ff', '#47b67b', '#ff9f1a', '#7a5af8', '#6a7383'],
      legend: {
        top: 0,
        left: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: '#5f6675',
          fontSize: 12,
        },
      },
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['42%', '66%'],
          center: ['50%', '60%'],
          label: {
            color: '#5f6675',
            formatter: '{b}',
          },
          labelLine: {
            length: 14,
            length2: 18,
          },
          data: chart.data.map((item) => ({
            name: item.label,
            value: item.value,
          })),
        },
      ],
    }
  }

  if (chart.type === 'gauge') {
    const rawValue = chart.data[0]?.value || 0
    const ratio = Math.min(Math.max(rawValue > 1 ? rawValue / 100 : rawValue, 0), 1)
    const percentText = `${(ratio * 100).toFixed(1)}%`

    return {
      animation: false,
      series: [
        {
          type: 'gauge',
          startAngle: 210,
          endAngle: -30,
          radius: '88%',
          min: 0,
          max: 1,
          splitNumber: 5,
          progress: {
            show: true,
            width: 12,
            itemStyle: {
              color: '#2660ff',
            },
          },
          axisLine: {
            lineStyle: {
              width: 12,
              color: [[1, '#edf2ff']],
            },
          },
          axisTick: {
            show: true,
            distance: -18,
            splitNumber: 5,
            lineStyle: {
              color: '#aeb7c4',
              width: 1,
            },
          },
          splitLine: {
            show: true,
            distance: -18,
            length: 12,
            lineStyle: {
              color: '#aeb7c4',
              width: 1,
            },
          },
          axisLabel: {
            show: true,
            distance: -36,
            color: '#8c93a1',
            fontSize: 12,
            formatter: (value: number) => {
              if (value === 0 || value === 1) {
                return String(value)
              }

              return value.toFixed(1)
            },
          },
          pointer: { show: false },
          anchor: { show: false },
          detail: {
            valueAnimation: false,
            formatter: percentText,
            color: '#161a2d',
            fontSize: 28,
            fontWeight: 600,
            offsetCenter: [0, '24%'],
          },
          title: {
            offsetCenter: [0, '64%'],
            color: '#5f6675',
            fontSize: 12,
          },
          data: [
            {
              value: ratio,
              name: chart.data[0]?.label || chart.title,
            },
          ],
        },
      ],
    }
  }

  if (chart.type === 'funnel') {
    return {
      animation: false,
      color: ['#2f63f6', '#4c7cff', '#6f94ff', '#92b0ff', '#bdd1ff'],
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'funnel',
          top: 24,
          left: '12%',
          width: '76%',
          minSize: '18%',
          maxSize: '90%',
          label: {
            color: '#5f6675',
            fontSize: 12,
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
          },
          data: chart.data.map((item) => ({
            name: item.label,
            value: item.value,
          })),
        },
      ],
    }
  }

  if (chart.type === 'radar') {
    const seriesList =
      chart.series && chart.series.length > 0
        ? chart.series
        : [
            {
              label: chart.title,
              values: chart.data.map((item) => item.value),
            },
          ]
    const maxValue = Math.max(100, ...seriesList.flatMap((series) => series.values))

    return {
      animation: false,
      color: ['#2f63f6', '#4fd1c5'],
      legend: {
        top: 0,
        left: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: '#5f6675',
          fontSize: 12,
        },
      },
      radar: {
        center: ['50%', '58%'],
        radius: '62%',
        splitNumber: 5,
        axisName: {
          color: '#8c93a1',
          fontSize: 12,
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(47, 99, 246, 0.01)', 'rgba(47, 99, 246, 0.03)'],
          },
        },
        splitLine: {
          lineStyle: {
            color: '#e7ebf1',
          },
        },
        axisLine: {
          lineStyle: {
            color: '#e7ebf1',
          },
        },
        indicator: chart.data.map((item) => ({
          name: item.label,
          max: Math.ceil(maxValue / 10) * 10,
        })),
      },
      series: [
        {
          type: 'radar',
          symbol: 'circle',
          symbolSize: 6,
          areaStyle: {
            opacity: 0.12,
          },
          data: seriesList.map((series) => ({
            name: series.label,
            value: series.values,
          })),
        },
      ],
    }
  }

  if (chart.type === 'combo') {
    return {
      animation: false,
      color: ['#2f63f6', '#30c3c9'],
      legend: {
        top: 0,
        left: 0,
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: '#5f6675',
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        top: 36,
        right: 16,
        bottom: 8,
        left: 36,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: chart.data.map((item) => item.label),
        axisLabel: baseAxisLabel,
        axisTick: { show: false },
        axisLine: {
          lineStyle: { color: '#d8dde6' },
        },
      },
      yAxis: [
        {
          type: 'value',
          axisLabel: baseAxisLabel,
          splitLine: baseSplitLine,
        },
        {
          type: 'value',
          min: 88,
          max: 100,
          interval: 2,
          axisLabel: baseAxisLabel,
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: chart.series?.[0]?.label || chart.title,
          type: 'bar',
          barWidth: 18,
          itemStyle: {
            color: '#2f63f6',
            borderRadius: [6, 6, 0, 0],
          },
          data: chart.data.map((item) => item.value),
        },
        {
          name: chart.series?.[1]?.label || '闭环率',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#30c3c9',
          },
          lineStyle: {
            color: '#30c3c9',
            width: 2,
          },
          data: chart.secondaryData || [],
        },
      ],
    }
  }

  if (chart.type === 'bar') {
    return {
      animation: false,
      color: ['#2f63f6', '#4fd1c5', '#7c6cf6', '#ffb020', '#46bf79'],
      legend: chart.series?.length
        ? {
            top: 0,
            left: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
              color: '#5f6675',
              fontSize: 12,
            },
          }
        : undefined,
      grid: {
        top: chart.series?.length ? 36 : 16,
        right: 12,
        bottom: 8,
        left: 48,
        containLabel: true,
      },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'value',
        axisLabel: baseAxisLabel,
        axisLine: { show: false },
        splitLine: baseSplitLine,
      },
      yAxis: {
        type: 'category',
        data: chart.data.map((item) => item.label),
        axisLabel: {
          ...baseAxisLabel,
          width: 80,
          overflow: 'truncate',
        },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      series:
        chart.series && chart.series.length > 0
          ? chart.series.map((series, index) => ({
              type: 'bar',
              name: series.label,
              barWidth: 12,
              itemStyle: {
                color: ['#2f63f6', '#4fd1c5', '#7c6cf6', '#ffb020', '#46bf79'][index % 5],
                borderRadius: [0, 6, 6, 0],
              },
              data: series.values,
            }))
          : [
              {
                type: 'bar',
                barWidth: 12,
                itemStyle: {
                  color: '#2f63f6',
                  borderRadius: [0, 6, 6, 0],
                },
                data: chart.data.map((item) => item.value),
              },
            ],
    }
  }

  if (chart.type === 'column') {
    return {
      animation: false,
      color: ['#2f63f6'],
      grid: {
        top: 16,
        right: 12,
        bottom: 8,
        left: 36,
        containLabel: true,
      },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: chart.data.map((item) => item.label),
        axisLabel: baseAxisLabel,
        axisTick: { show: false },
        axisLine: {
          lineStyle: { color: '#d8dde6' },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: baseAxisLabel,
        splitLine: baseSplitLine,
      },
      series: [
        {
          type: 'bar',
          barWidth: 16,
          itemStyle: {
            color: '#2f63f6',
            borderRadius: [6, 6, 0, 0],
          },
          data: chart.data.map((item) => item.value),
        },
      ],
    }
  }

  return {
    animation: false,
    color: ['#2f63f6', '#46bf79'],
    legend:
      chart.series && chart.series.length > 1
        ? {
            top: 0,
            left: 0,
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
              color: '#5f6675',
              fontSize: 12,
            },
          }
        : undefined,
    grid: {
      top: chart.series && chart.series.length > 1 ? 36 : 16,
      right: 12,
      bottom: 24,
      left: 36,
      containLabel: true,
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: chart.data.map((item) => item.label),
      axisLabel: baseAxisLabel,
      axisTick: { show: false },
      axisLine: {
        lineStyle: { color: '#d8dde6' },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: baseAxisLabel,
      splitLine: {
        lineStyle: { color: '#eef2f6' },
      },
    },
    series: buildLineLikeSeries(chart, chart.type === 'area' ? 'area' : 'line'),
  }
}

function ChartCanvas({
  chart,
  className,
  option,
}: {
  chart?: VisualizationChart
  className?: string
  option?: echarts.EChartsCoreOption
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const instance = echarts.init(containerRef.current)
    instance.setOption(option || buildChartOption(chart as VisualizationChart))

    const handleResize = () => instance.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      instance.dispose()
    }
  }, [chart, option])

  return <div ref={containerRef} className={joinClassNames(styles.chartCanvas, className)} />
}

function LiquidChart({ chart }: { chart: VisualizationChart }) {
  const rawValue = chart.data[0]?.value || 0
  const ratio = Math.min(Math.max(rawValue > 1 ? rawValue / 100 : rawValue, 0), 1)
  const percentText = `${Math.round(ratio * 100)}%`

  return (
    <div className={styles.liquidShell}>
      <div className={styles.liquidRing}>
        <div className={styles.liquidFill} style={{ height: `${ratio * 100}%` }}>
          <div className={styles.liquidWave} />
        </div>
        <div className={styles.liquidOverlay}>
          <div className={styles.liquidValue}>{percentText}</div>
          <div className={styles.liquidLabel}>{chart.data[0]?.label || chart.title}</div>
        </div>
      </div>
    </div>
  )
}

export function CanonicalDataVisualizationPage({
  schema,
  className,
}: {
  schema: DataVisualizationSchema
  className?: string
}) {
  const hostAdapter = useHostAdapter()
  const initialFilters = useMemo(() => buildEmptyFilters(schema), [schema])
  const [formValues, setFormValues] = useState<Record<string, QueryFieldValue>>(initialFilters)
  const [searchValue, setSearchValue] = useState('')
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [filterVisibility, setFilterVisibility] = useState<Record<string, boolean>>({})
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: schema.pageSize || 10,
  })

  const filterFields = useMemo(
    () =>
      schema.queryFields.map((field) => ({
        field: field.key,
        label: field.label,
        visible: filterVisibility[field.key] ?? !field.hidden,
        component: renderQueryControl(field),
      })),
    [filterVisibility, schema]
  )

  const showedFilterFields = useMemo(
    () => filterFields.filter((field) => field.visible !== false && field.component),
    [filterFields]
  )

  const filteredRows = useMemo(() => {
    return schema.rows.filter((row) => {
      const matchesKeyword =
        !searchValue ||
        Object.values(row).some((value) =>
          String(value ?? '')
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase())
        )

      if (!matchesKeyword) {
        return false
      }

      return schema.queryFields.every((field) => {
        const currentValue = formValues[field.key]
        const filterMode = field.filterMode || (field.control === 'select' ? 'equals' : 'contains')

        if (field.control === 'dateRange') {
          if (!Array.isArray(currentValue) || !currentValue[0] || !currentValue[1]) {
            return true
          }

          const rowValue = row[field.key]
          if (!rowValue) {
            return false
          }

          const rowTime = new Date(String(rowValue)).getTime()
          if (Number.isNaN(rowTime)) {
            return false
          }

          const startTime = currentValue[0].getTime()
          const endTime = currentValue[1].getTime()
          return rowTime >= startTime && rowTime <= endTime
        }

        const normalizedValue = String(currentValue ?? '')
          .trim()
          .toLowerCase()

        if (!normalizedValue) {
          return true
        }

        const rowValue = String(row[field.key] ?? '').toLowerCase()
        if (filterMode === 'equals') {
          return rowValue === normalizedValue
        }

        return rowValue.includes(normalizedValue)
      })
    })
  }, [formValues, schema, searchValue])

  const startIndex = (pagination.current - 1) * pagination.pageSize
  const pagedRows = filteredRows.slice(startIndex, startIndex + pagination.pageSize)

  const filteredCount = useMemo(() => {
    const formCount = Object.values(formValues).filter((value) => !isEmptyFilterValue(value)).length
    return formCount + (searchValue.trim() ? 1 : 0)
  }, [formValues, searchValue])

  const tableColumns = useMemo(() => {
    const baseColumns = schema.columns.map((column) => ({
      title: column.label,
      dataKey: column.key,
      width: column.width || 160,
      render: (value: unknown) => String(value ?? '-'),
    }))

    if (!schema.rowActions?.length) {
      return baseColumns
    }

    return [
      ...baseColumns,
      {
        title: '操作',
        dataKey: '__actions__',
        width: Math.max(schema.rowActions.length * 88, 160),
        render: (_: unknown, row: Record<string, string | number>) => (
          <div className={styles.linkActions}>
            {schema.rowActions?.map((action) => (
              <Button
                key={action.key}
                type="primary"
                appearance="link"
                onClick={() => {
                  const fallbackText = `${action.label}：${String(
                    row[schema.columns[0]?.key] ?? ''
                  )}`
                  hostAdapter.message.success(action.message || fallbackText)
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        ),
      },
    ]
  }, [hostAdapter.message, schema])

  const handleClear = () => {
    setFormValues(buildEmptyFilters(schema))
    setSearchValue('')
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }))
  }

  const headerExtra = (
    <div className={styles.headerActions}>
      {schema.secondaryAction ? (
        <Button
          type="default"
          appearance="line"
          onClick={() =>
            hostAdapter.message.success(
              schema.secondaryAction?.message || schema.secondaryAction?.label
            )
          }
        >
          {schema.secondaryAction.label}
        </Button>
      ) : null}
      {schema.primaryAction ? (
        <Button
          type="primary"
          onClick={() =>
            hostAdapter.message.success(
              schema.primaryAction?.message || schema.primaryAction?.label
            )
          }
        >
          {schema.primaryAction.label}
        </Button>
      ) : null}
    </div>
  )
  const hasQueryRegion = Boolean(schema.searchPlaceholder) || showedFilterFields.length > 0

  return (
    <div
      className={joinClassNames(styles.pageRoot, className)}
      data-hiui-pagegen-template="data-visualization"
      data-hiui5-page-type="data-visualization"
      data-hiui5-shell="hiui-pagegen-data-visualization-v1"
    >
      <div className={styles.headerRegion} data-hiui5-region="header">
        <PageHeader
          className={styles.pageHeader}
          title={schema.title}
          extra={headerExtra}
          backIcon={false}
        />
      </div>

      <div className={styles.whiteBody} data-hiui5-region="white-body">
        <div className={styles.statSection} data-hiui5-region="stat-section">
          {schema.stats.map((item) => (
            <article key={item.key} className={styles.statCard}>
              <div className={styles.statLabel}>{item.label}</div>
              <div className={styles.statValueRow}>
                <div className={styles.statValue}>{item.value}</div>
                {item.note ? <div className={styles.statNote}>{item.note}</div> : null}
              </div>
              {item.trendData && item.trendData.length > 0 ? (
                <ChartCanvas
                  className={styles.statTrendCanvas}
                  option={buildStatTrendOption(item)}
                />
              ) : null}
            </article>
          ))}
        </div>

        {hasQueryRegion ? (
          <div className={styles.queryRegion} data-hiui5-region="query-filter">
            <QueryFilterProvider>
              <QueryFilter
                className={styles.queryFilter}
                appearance="contained"
                showLabel={false}
                filterFields={showedFilterFields}
                formData={formValues}
                onChange={(nextFormData) => {
                  setFormValues((prev) => ({
                    ...prev,
                    ...(nextFormData as Record<string, QueryFieldValue>),
                  }))
                  setPagination((prev) => ({
                    ...prev,
                    current: 1,
                  }))
                }}
                prepend={
                  schema.searchPlaceholder ? (
                    <SearchInput
                      placeholder={schema.searchPlaceholder || '请输入关键词'}
                      value={searchValue}
                      onChange={(_, value) => {
                        setSearchValue(value)
                        setPagination((prev) => ({
                          ...prev,
                          current: 1,
                        }))
                      }}
                    />
                  ) : null
                }
                append={[
                  showedFilterFields.length > 0 ? (
                    <FilterButton
                      key="all-filter"
                      count={filteredCount}
                      onClick={() => setDrawerVisible(true)}
                    >
                      全部筛选
                    </FilterButton>
                  ) : null,
                  filteredCount > 0 ? (
                    <Button key="clear-filter" icon={<ResetOutlined />} onClick={handleClear}>
                      清空
                    </Button>
                  ) : null,
                ]}
              />
              <FilterDrawer
                width={360}
                visible={drawerVisible}
                title="全部筛选"
                formData={formValues}
                filterFields={filterFields}
                onChange={(nextFormData, nextFields) => {
                  setFilterVisibility((prev) => {
                    const nextVisibility = { ...prev }

                    nextFields.forEach((field) => {
                      nextVisibility[field.field] = field.visible ?? true
                    })

                    return nextVisibility
                  })
                  setFormValues((prev) => ({
                    ...prev,
                    ...(nextFormData as Record<string, QueryFieldValue>),
                  }))
                  setPagination((prev) => ({
                    ...prev,
                    current: 1,
                  }))
                }}
                onClose={() => setDrawerVisible(false)}
              />
            </QueryFilterProvider>
          </div>
        ) : null}

        <div className={styles.chartRegion} data-hiui5-region="chart-grid">
          <div className={styles.chartGrid}>
            {schema.charts.map((chart) => (
              <section key={chart.key} className={styles.chartCard}>
                <header className={styles.chartHeader}>
                  <div className={styles.chartTitle}>{chart.title}</div>
                  {chart.description ? (
                    <div className={styles.chartDescription}>{chart.description}</div>
                  ) : null}
                </header>
                {chart.type === 'liquid' ? (
                  <LiquidChart chart={chart} />
                ) : (
                  <ChartCanvas chart={chart} />
                )}
              </section>
            ))}
          </div>
        </div>

        <div className={styles.tableRegion} data-hiui5-region="table">
          <div className={styles.tableContainer}>
            <Table
              className={styles.table}
              stickyFooter
              fieldKey={schema.columns[0]?.key || 'id'}
              maxHeight="calc(100vh - 420px)"
              columns={tableColumns}
              data={pagedRows}
              emptyContent={
                <div className={styles.emptyContainer}>
                  <div className={styles.emptyContent}>
                    <div className={styles.emptyIcon}>
                      <img src={EMPTY_STATE_IMAGE} alt="" />
                    </div>
                    <div className={styles.emptyTitle}>当前无内容</div>
                    <div className={styles.emptyDescription}>请先进行筛选或输入内容</div>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        <div className={styles.paginationRegion} data-hiui5-region="pagination">
          <Pagination
            current={pagination.current}
            total={filteredRows.length}
            pageSize={pagination.pageSize}
            pageSizeOptions={[10, 20, 50]}
            showTotal
            showJumper
            onChange={(current) =>
              setPagination((prev) => ({
                ...prev,
                current,
              }))
            }
            onPageSizeChange={(pageSize) =>
              setPagination({
                current: 1,
                pageSize,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

export default CanonicalDataVisualizationPage
