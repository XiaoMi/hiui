import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Funnel } from '@ant-design/charts'
import { DownloadOutlined } from '@hi-ui/icons'
import { extendDsl, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { useSubscribe } from '@hi-ui/use-subscription'
import { TypicalPageFieldMapProvider } from '@hiui-design/typical-page-shells'
import { TypicalPageHeaderPortal } from '@hiui-design/typical-page-shells/host'
import {
  ProListPage,
  ProListPageProvider,
  queryFilterPickerOverlay,
  useProListPageContext,
} from '@hiui-design/typical-page-shells/pro-list-page'
import { QueryFilter } from '@hiui-design/typical-page-shells/pro-list-page/bridge/query-filter'
import {
  toFilters,
  toValues,
} from '@hiui-design/typical-page-shells/pro-list-page/hooks/use-fetch-list'
import {
  createHiuiColorScale,
  hiuiSequentialBluePalette,
  withHiuiResponsiveChart,
} from '../../charts/hiui-chart-theme'
import {
  renderTableTextEllipsis,
} from '@hiui-design/typical-page-shells/pro-table-page'
import {
  Button,
  EmptyState,
  Loading,
  Message,
  PageHeader,
  Progress,
  Space,
  Table,
  Tag,
  Tabs,
} from '@hi-ui/hiui'
import {
  buildOverviewInitialFilters,
  departmentOptions,
  getOverviewData,
  getStatusType,
  jobLevelOptions,
  type OverviewFilters,
  sequenceOptions,
} from './recruitment-data'
import { createManagedQuerySelectField } from '@/typical-page-reuse/query-filter/managed-query-filter-fields'
import styles from './recruitment.module.scss'

const T = extendDsl(ReadonlyFieldCreator, {
  renderEllipsis() {
    return this.renderCell((cellValue) => renderTableTextEllipsis(cellValue))
  },
})

function OverviewInner() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { subscription } = useProListPageContext()
  const { allDepValues } = useSubscribe(subscription, ['filters'])
  const filters = useMemo(
    () => toValues((allDepValues.filters ?? []) as Array<{ id: string; value: unknown }>) as OverviewFilters,
    [allDepValues.filters]
  )
  const [activeDimension, setActiveDimension] = useState<'department' | 'sequence'>('department')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const nextFilters = buildOverviewInitialFilters(searchParams)
    subscription.setValue((prev) => ({
      ...prev,
      filters: toFilters(nextFilters),
      pagination: prev.pagination,
      sorters: prev.sorters,
    }))
  }, [searchParams, subscription])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 260)
    setLoading(true)

    return () => window.clearTimeout(timer)
  }, [filters.departmentId, filters.jobLevel, activeDimension])

  const data = useMemo(() => getOverviewData(filters, activeDimension), [activeDimension, filters])

  useEffect(() => {
    if (!data.allowDepartmentTab && activeDimension !== 'sequence') {
      setActiveDimension('sequence')
    }
  }, [activeDimension, data.allowDepartmentTab])

  const queryFields = useMemo(
    () => [
      createManagedQuerySelectField({
        field: 'departmentId',
        label: '部门选择器',
        data: departmentOptions.map((item) => ({ id: item.id, title: item.title })),
        overlay: queryFilterPickerOverlay,
      }),
      createManagedQuerySelectField({
        field: 'jobLevel',
        label: '职级选择器',
        data: jobLevelOptions,
        overlay: queryFilterPickerOverlay,
      }),
    ],
    []
  )

  const funnelConfig = useMemo(
    () =>
      withHiuiResponsiveChart({
        colorField: 'stage',
        data: data.funnelData,
        height: 280,
        label: {
          position: 'inside',
          text: (datum: { stage: string; value: number }) => `${datum.stage} ${datum.value}`,
          style: {
            textAlign: 'center',
          },
        },
        legend: false,
        scale: createHiuiColorScale(
          hiuiSequentialBluePalette.slice(0, Math.max(data.funnelData.length, 1))
        ),
        xField: 'stage',
        yField: 'value',
      }),
    [data.funnelData]
  )

  const progressColumns = useMemo(
    () => [
      {
        title: activeDimension === 'department' ? '部门' : '序列',
        dataKey: 'entityTitle',
        width: 172,
        render: (value: string) => renderTableTextEllipsis(value),
      },
      {
        title: '状态',
        dataKey: 'statusLabel',
        width: 100,
        render: (_value: string, row: { statusKey: 'overstaffed' | 'slow' | 'healthy'; statusLabel: string }) => (
          <Tag
            className={styles.statusTag}
            type={getStatusType(row.statusKey)}
            appearance="filled"
            shape="round"
            size="sm"
          >
            {row.statusLabel}
          </Tag>
        ),
      },
      {
        title: '待招人数',
        dataKey: 'waitCount',
        width: 112,
        render: (value: number, row: { entityId: string; entityTitle: string; entityType: 'department' | 'sequence' }) => (
          <Button
            className={styles.inlineLinkButton}
            type="primary"
            appearance="link"
            onClick={() =>
              navigate(
                `/examples/hr/waiting-detail?departmentId=${filters.departmentId ?? 'group'}&jobLevel=${filters.jobLevel ?? 'all'}&scopeType=${row.entityType}&scopeId=${row.entityId}`
              )
            }
          >
            {value}
          </Button>
        ),
      },
      {
        title: '在途人数',
        dataKey: 'inflightCount',
        width: 112,
        render: (value: number, row: { entityId: string; entityTitle: string; entityType: 'department' | 'sequence' }) => (
          <Button
            className={styles.inlineLinkButton}
            type="primary"
            appearance="link"
            onClick={() =>
              navigate(
                `/examples/hr/inflight-detail?departmentId=${filters.departmentId ?? 'group'}&jobLevel=${filters.jobLevel ?? 'all'}&scopeType=${row.entityType}&scopeId=${row.entityId}`
              )
            }
          >
            {value}
          </Button>
        ),
      },
      {
        title: '高招',
        dataKey: 'highLevelCount',
        width: 88,
      },
      {
        title: '预算满编率',
        dataKey: 'fullRate',
        width: 124,
        render: (value: number) => (
          <span style={{ color: value > 100 ? '#FA4646' : '#1A1D26', fontWeight: 600 }}>
            {value.toFixed(1)}%
          </span>
        ),
      },
    ],
    [activeDimension, filters.departmentId, filters.jobLevel, navigate]
  )

  return (
    <ProListPage queryFields={queryFields} tableFields={[T('占位', '_placeholder').val]}>
      <div className={styles.pageRoot}>
        <TypicalPageHeaderPortal>
          <PageHeader
            className={styles.pageHeader}
            title="组织档案 · 人力"
            subtitle="26 年招聘计划，仅正式员工"
            extra={
              <Space>
                <Button
                  type="default"
                  appearance="line"
                  icon={<DownloadOutlined />}
                  onClick={() => Message.open({ type: 'success', title: '招聘分析导出任务已创建' })}
                >
                  导出分析
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    navigate(
                      `/examples/hr/waiting-detail?departmentId=${filters.departmentId ?? 'group'}&jobLevel=${filters.jobLevel ?? 'all'}`
                    )
                  }
                >
                  查看待招详情
                </Button>
              </Space>
            }
          />
        </TypicalPageHeaderPortal>
        <div className={styles.whiteBody}>
          <div className={styles.filterContainer}>
            <QueryFilter showKeywordSearch={false} />
          </div>
          <Loading className={styles.loadingWrap} visible={loading}>
            {data.defaultState ? (
              <div className={styles.emptyWrap}>
                <EmptyState title="目前招聘分析仅支持下探到二级/S三级部门，更多功能开发中">
                  <div className={styles.emptyTip}>请切回集团、一级部门或二级 / S 三级部门继续查看招聘分析。</div>
                </EmptyState>
              </div>
            ) : data.emptyState ? (
              <div className={styles.emptyWrap}>
                <EmptyState title="当前筛选条件下暂无招聘数据">
                  <div className={styles.emptyTip}>可尝试切换职级或返回上一级部门范围。</div>
                </EmptyState>
              </div>
            ) : (
              <div className={styles.contentWrap}>
                <div className={styles.metricGrid}>
                  {data.metrics.map((metric) => (
                    <button
                      key={metric.key}
                      className={styles.metricCard}
                      style={{ textAlign: 'left', cursor: metric.key === 'full_rate' ? 'default' : 'pointer' }}
                      type="button"
                      onClick={() => {
                        if (metric.key === 'full_rate') return

                        navigate(
                          metric.key === 'waiting'
                            ? `/examples/hr/waiting-detail?departmentId=${filters.departmentId ?? 'group'}&jobLevel=${filters.jobLevel ?? 'all'}`
                            : `/examples/hr/inflight-detail?departmentId=${filters.departmentId ?? 'group'}&jobLevel=${filters.jobLevel ?? 'all'}`
                        )
                      }}
                    >
                      <span className={styles.metricTitle}>{metric.title}</span>
                      <span
                        className={`${styles.metricValue} ${metric.highlight === 'danger' ? styles.metricValueDanger : ''}`}
                      >
                        {metric.value}
                      </span>
                      <span className={styles.metricMeta}>
                        <span>{metric.subLabel}</span>
                        <span>{metric.subValue}</span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className={styles.rateCard}>
                  <div className={styles.rateHeader}>
                    <div>
                      <div className={styles.rateLabel}>HC 满编率进度</div>
                      <div className={styles.rateHint}>
                        超过 100% 自动切换为红色，蓝色为正常预算区间。
                      </div>
                    </div>
                    <div className={styles.rateNumbers}>
                      <span className={styles.rateValue} style={{ color: data.fullRateColor }}>
                        {data.fullRate.toFixed(2)}%
                      </span>
                      <span className={styles.rateCompare}>较上级 {data.fullRateCompare.toFixed(2)}%</span>
                    </div>
                  </div>
                  <Progress
                    color={data.fullRateColor}
                    height={10}
                    percent={Math.min(data.fullRate, 130)}
                    showInfo={false}
                  />
                </div>
                <div className={styles.boardGrid}>
                  <section className={styles.boardCard}>
                    <div className={styles.sectionHeader}>
                      <div>
                        <div className={styles.sectionTitle}>招聘进展列表</div>
                        <div className={styles.sectionDescription}>
                          点击待招人数或在途人数可进入二级详情；二级 / S 三级部门自动禁用部门视角。
                        </div>
                      </div>
                    </div>
                    <div className={styles.tabsWrap}>
                      <Tabs
                        activeId={activeDimension}
                        className={styles.progressTabs}
                        onChange={(nextId) => setActiveDimension(nextId as 'department' | 'sequence')}
                      >
                        <Tabs.Pane
                          disabled={!data.allowDepartmentTab}
                          tabId="department"
                          tabTitle={<span className={styles.tabTitle}>部门</span>}
                        />
                        <Tabs.Pane
                          tabId="sequence"
                          tabTitle={<span className={styles.tabTitle}>序列</span>}
                        />
                      </Tabs>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.tableWrap}>
                        <Table
                          fieldKey="entityId"
                          bordered={false}
                          columns={progressColumns}
                          data={data.progressRows}
                          maxHeight={360}
                          pagination={false}
                          resizable
                          sticky
                          striped={false}
                          styles={{
                            bodyCell: {
                              whiteSpace: 'nowrap',
                            },
                          }}
                        />
                      </div>
                    </div>
                  </section>
                </div>
                <section className={styles.boardCard}>
                  <div className={styles.sectionHeader}>
                    <div>
                      <div className={styles.sectionTitle}>招聘转化</div>
                      <div className={styles.sectionDescription}>6 层面试漏斗，弱转化环节会以橙色文案提示。</div>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.insightBlock}>
                      <div className={styles.insightLine}>{data.conversionInsight.lowest}</div>
                      <div className={styles.insightLine}>{data.conversionInsight.highest}</div>
                    </div>
                    <div className={styles.funnelContent}>
                      <div className={styles.funnelChartWrap}>
                        <Funnel {...funnelConfig} />
                      </div>
                      <div className={styles.funnelRateList}>
                        {data.stageRates.map((item) => (
                          <div key={item.label} className={styles.funnelRateRow}>
                            <span>{item.label}</span>
                            <span className={item.rate < 0.65 ? styles.funnelRateWeak : ''}>
                              {(item.rate * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </Loading>
        </div>
      </div>
    </ProListPage>
  )
}

export function RecruitmentOverviewPage() {
  return (
    <ProListPageProvider>
      <TypicalPageFieldMapProvider>
        <OverviewInner />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}
