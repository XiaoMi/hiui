import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeftOutlined, DownloadOutlined } from '@hi-ui/icons'
import { extendDsl, F, ReadonlyFieldCreator } from '@hi-ui/schema-core'
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
import { renderTableTextEllipsis } from '@hiui-design/typical-page-shells/pro-table-page'
import {
  Button,
  EmptyState,
  Loading,
  Message,
  PageHeader,
  Space,
  Table,
  Tag,
  Tabs,
} from '@hi-ui/hiui'
import {
  buildDetailInitialFilters,
  getAvailableDepartmentOptions,
  getInFlightRows,
  getInFlightTagType,
  getJobLevelRank,
  jobLevelOptions,
  sequenceOptions,
  type DetailFilters,
  type InFlightStatusKey,
} from './recruitment-data'
import styles from './recruitment.module.scss'

const T = extendDsl(ReadonlyFieldCreator, {
  renderEllipsis() {
    return this.renderCell((cellValue) => renderTableTextEllipsis(cellValue))
  },
})

const tabOptions: Array<{ key: InFlightStatusKey; label: string }> = [
  { key: 'pre_entry', label: '预入职' },
  { key: 'transfer_in', label: '预转入' },
  { key: 'transfer_out', label: '预转出' },
  { key: 'pre_leave', label: '预离职' },
]

function InflightDetailInner() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { subscription } = useProListPageContext()
  const { allDepValues } = useSubscribe(subscription, ['filters'])
  const filters = useMemo(
    () => toValues((allDepValues.filters ?? []) as Array<{ id: string; value: unknown }>) as DetailFilters,
    [allDepValues.filters]
  )
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<InFlightStatusKey>('pre_entry')
  const scopeType = searchParams.get('scopeType')
  const scopeId = searchParams.get('scopeId')
  const baseDepartmentId = searchParams.get('departmentId') ?? 'group'

  useEffect(() => {
    const nextFilters = buildDetailInitialFilters(searchParams)
    subscription.setValue((prev) => ({
      ...prev,
      filters: toFilters(nextFilters),
      pagination: prev.pagination,
      sorters: prev.sorters,
    }))
  }, [searchParams, subscription])

  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => setLoading(false), 220)
    return () => window.clearTimeout(timer)
  }, [filters.departmentId, filters.jobLevel, filters.sequenceId, activeTab])

  const rows = useMemo(
    () => getInFlightRows(filters, activeTab, scopeType, scopeId),
    [activeTab, filters, scopeId, scopeType]
  )
  const tabCounts = useMemo(
    () =>
      Object.fromEntries(
        tabOptions.map((item) => [item.key, getInFlightRows(filters, item.key, scopeType, scopeId).length])
      ) as Record<InFlightStatusKey, number>,
    [filters, scopeId, scopeType]
  )
  const activeTabLabel = tabOptions.find((item) => item.key === activeTab)?.label ?? '在途'

  const queryFields = useMemo(
    () => [
      F('部门', 'departmentId')
        .Select({
          data: getAvailableDepartmentOptions(baseDepartmentId),
          overlay: queryFilterPickerOverlay,
        })
        .val,
      F('序列', 'sequenceId')
        .Select({
          data: sequenceOptions,
          overlay: queryFilterPickerOverlay,
        })
        .val,
      F('职级', 'jobLevel')
        .Select({
          data: jobLevelOptions,
          overlay: queryFilterPickerOverlay,
        })
        .val,
    ],
    [baseDepartmentId]
  )

  const columns = useMemo(
    () => [
      {
        title: '姓名',
        dataKey: 'name',
        width: 128,
        render: (value: string, row: { name: string; statusKey: InFlightStatusKey }) => (
          <Button
            className={styles.inlineLinkButton}
            type="primary"
            appearance="link"
            onClick={() => Message.open({ title: `已打开 ${row.name} 的人才档案（演示）` })}
          >
            {value}
          </Button>
        ),
      },
      {
        title: '职级',
        dataKey: 'jobLevel',
        width: 88,
        defaultSortOrder: 'descend',
        sorter: (left: { jobLevel: string }, right: { jobLevel: string }) =>
          getJobLevelRank(left.jobLevel) - getJobLevelRank(right.jobLevel),
      },
      {
        title:
          activeTab === 'pre_entry'
            ? '入职日期'
            : activeTab === 'transfer_in'
              ? '转入日期'
              : activeTab === 'transfer_out'
                ? '转出日期'
                : '离职日期',
        dataKey: 'effectiveDate',
        width: 120,
        sorter: (left: { effectiveDate: string }, right: { effectiveDate: string }) =>
          left.effectiveDate.localeCompare(right.effectiveDate),
      },
      {
        title: activeTab === 'transfer_in' || activeTab === 'transfer_out' ? '调转原因' : '高薪offer',
        dataKey: activeTab === 'transfer_in' || activeTab === 'transfer_out' ? 'transferReason' : 'highOffer',
        width: 108,
      },
      {
        title: '序列',
        dataKey: 'sequenceTitle',
        width: 120,
        render: (value: string) => renderTableTextEllipsis(value),
      },
      {
        title: '部门',
        dataKey: 'departmentTitle',
        width: 180,
        render: (value: string) => renderTableTextEllipsis(value),
      },
      {
        title: '状态',
        dataKey: 'statusTitle',
        width: 112,
        render: (value: string, row: { statusKey: InFlightStatusKey }) => (
          <Tag type={getInFlightTagType(row.statusKey)} appearance="filled" shape="round" size="sm">
            {value}
          </Tag>
        ),
      },
    ],
    [activeTab]
  )

  return (
    <ProListPage queryFields={queryFields} tableFields={[T('占位', '_placeholder').val]}>
      <div className={styles.pageRoot}>
        <TypicalPageHeaderPortal>
          <PageHeader
            className={styles.pageHeader}
            onBack={() => navigate('/examples/hr/overview')}
            title="二级页 · 在途详情"
            subtitle="预入职 / 预转入 / 预转出 / 预离职"
            extra={
              <Space>
                <Button
                  type="default"
                  appearance="line"
                  icon={<DownloadOutlined />}
                  onClick={() => Message.open({ type: 'success', title: '在途明细导出任务已创建' })}
                >
                  导出明细
                </Button>
                <Button
                  type="default"
                  appearance="line"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate('/examples/hr/overview')}
                >
                  返回概览
                </Button>
              </Space>
            }
          />
        </TypicalPageHeaderPortal>
        <div className={styles.whiteBody}>
          <div className={styles.filterContainer}>
            <QueryFilter showKeywordSearch={false} />
          </div>
          <div className={styles.detailTabsWrap}>
            <Tabs
              activeId={activeTab}
              className={styles.detailTabs}
              onChange={(nextId) => setActiveTab(nextId as InFlightStatusKey)}
            >
              {tabOptions.map((item) => (
                <Tabs.Pane
                  key={item.key}
                  tabId={item.key}
                  tabTitle={
                    <span className={styles.tabTitle}>
                      {item.label}
                      <span className={styles.tabCount}>{tabCounts[item.key]}</span>
                    </span>
                  }
                />
              ))}
            </Tabs>
          </div>
          <Loading className={styles.loadingWrap} visible={loading}>
            {rows.length === 0 ? (
              <div className={styles.emptyWrap}>
                <EmptyState title={`当前筛选条件下暂无${activeTabLabel}数据`}>
                  <div className={styles.emptyTip}>可切换 Tab 或筛选条件查看其他在途明细。</div>
                </EmptyState>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <Table
                  bordered={false}
                  columns={columns}
                  data={rows}
                  fieldKey="id"
                  maxHeight={520}
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
            )}
          </Loading>
        </div>
      </div>
    </ProListPage>
  )
}

export function RecruitmentInFlightDetailPage() {
  return (
    <ProListPageProvider>
      <TypicalPageFieldMapProvider>
        <InflightDetailInner />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}
