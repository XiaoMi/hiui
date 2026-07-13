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
} from '@hi-ui/hiui'
import {
  buildDetailInitialFilters,
  getAvailableDepartmentOptions,
  getWaitDetailRows,
  getJobLevelRank,
  jobLevelOptions,
  sequenceOptions,
  type DetailFilters,
} from './recruitment-data'
import styles from './recruitment.module.scss'

const T = extendDsl(ReadonlyFieldCreator, {
  renderEllipsis() {
    return this.renderCell((cellValue) => renderTableTextEllipsis(cellValue))
  },
})

function WaitingDetailInner() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { subscription } = useProListPageContext()
  const { allDepValues } = useSubscribe(subscription, ['filters'])
  const filters = useMemo(
    () => toValues((allDepValues.filters ?? []) as Array<{ id: string; value: unknown }>) as DetailFilters,
    [allDepValues.filters]
  )
  const [loading, setLoading] = useState(false)
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
  }, [filters.departmentId, filters.jobLevel, filters.sequenceId])

  const rows = useMemo(
    () => getWaitDetailRows(filters, scopeType, scopeId),
    [filters, scopeId, scopeType]
  )
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
        title: '招需职位',
        dataKey: 'positionTitle',
        width: 220,
        fixed: 'left',
        render: (value: string) => renderTableTextEllipsis(value),
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
        title: '序列',
        dataKey: 'sequenceTitle',
        width: 120,
        render: (value: string) => renderTableTextEllipsis(value),
      },
      {
        title: '招需人数',
        dataKey: 'demandCount',
        width: 108,
        sorter: (left: { demandCount: number }, right: { demandCount: number }) =>
          left.demandCount - right.demandCount,
      },
      {
        title: '招需待招人数',
        dataKey: 'waitDemandCount',
        width: 128,
        sorter: (left: { waitDemandCount: number }, right: { waitDemandCount: number }) =>
          left.waitDemandCount - right.waitDemandCount,
      },
      {
        title: '简历筛选中',
        dataKey: 'screeningCount',
        width: 120,
        sorter: (left: { screeningCount: number }, right: { screeningCount: number }) =>
          left.screeningCount - right.screeningCount,
      },
      {
        title: '面试中',
        dataKey: 'interviewingCount',
        width: 108,
        sorter: (left: { interviewingCount: number }, right: { interviewingCount: number }) =>
          left.interviewingCount - right.interviewingCount,
      },
      {
        title: 'offer审批中',
        dataKey: 'offerApprovalCount',
        width: 126,
        sorter: (left: { offerApprovalCount: number }, right: { offerApprovalCount: number }) =>
          left.offerApprovalCount - right.offerApprovalCount,
      },
      {
        title: 'offer确认中',
        dataKey: 'offerConfirmCount',
        width: 126,
        sorter: (left: { offerConfirmCount: number }, right: { offerConfirmCount: number }) =>
          left.offerConfirmCount - right.offerConfirmCount,
      },
      {
        title: '招聘耗时',
        dataKey: 'recruitmentDays',
        width: 110,
        sorter: (left: { recruitmentDays: number }, right: { recruitmentDays: number }) =>
          left.recruitmentDays - right.recruitmentDays,
        render: (value: number) => `${value} 天`,
      },
      {
        title: '部门',
        dataKey: 'departmentTitle',
        width: 160,
        render: (value: string) => renderTableTextEllipsis(value),
      },
    ],
    []
  )

  return (
    <ProListPage queryFields={queryFields} tableFields={[T('占位', '_placeholder').val]}>
      <div className={styles.pageRoot}>
        <TypicalPageHeaderPortal>
          <PageHeader
            className={styles.pageHeader}
            onBack={() => navigate('/examples/hr/overview')}
            title="二级页 · 待招详情"
            subtitle="继承一级页筛选范围，表格支持排序"
            extra={
              <Space>
                <Button
                  type="default"
                  appearance="line"
                  icon={<DownloadOutlined />}
                  onClick={() => Message.open({ type: 'success', title: '待招明细导出任务已创建' })}
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
          <Loading className={styles.loadingWrap} visible={loading}>
            {rows.length === 0 ? (
              <div className={styles.emptyWrap}>
                <EmptyState title="当前筛选条件下暂无待招明细">
                  <div className={styles.emptyTip}>可以切换部门、序列或职级组合查看其他招需职位。</div>
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

export function RecruitmentWaitingDetailPage() {
  return (
    <ProListPageProvider>
      <TypicalPageFieldMapProvider>
        <WaitingDetailInner />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}
