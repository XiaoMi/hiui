import { useMemo } from 'react'
import { Button, Message, Space } from '@hi-ui/hiui'
import { DownloadOutlined, PlusOutlined } from '@hi-ui/icons'
import { extendDsl, F, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { TypicalPageFieldMapProvider } from '../components/hiui-design-runtime'
import {
  ProListPageProvider,
  queryFilterDatePickerOverlay,
  queryFilterPickerOverlay,
} from '../components/hiui-design-runtime/pro-list-page'
import {
  StatListPageFrame,
  proStatPageStyles,
  renderStatTableTextEllipsis,
} from '../components/hiui-design-runtime/pro-stat-page'
import { MetricOverviewGrid } from '../runtime/analytics-primitives'
import {
  engineerGroupOptions,
  engineerOptions,
  getTableStatList,
  getTableStatOverview,
  queryTableStatRows,
} from './table-stat.mock'
import {
  filterListByKeyword,
  getKeywordValue,
  getParamsWithoutKeyword,
  paginateList,
} from './data-visualization/request-utils'
import { useTranslation } from './page-localization'

const T = extendDsl(ReadonlyFieldCreator, {
  renderEllipsis(this) {
    return this.renderCell((cellValue) => renderStatTableTextEllipsis(cellValue))
  },
})

function TableStatInner() {
  const { locale, t } = useTranslation()

  const queryFields = useMemo(
    () => [
      F(t('工程师'), 'engineerId')
        .Select({
          data: engineerOptions.map((option) => ({ ...option, title: t(option.title) })),
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
      F(t('工程师组别'), 'engineerGroupIds')
        .CheckSelect({
          data: engineerGroupOptions.map((option) => ({ ...option, title: t(option.title) })),
          clearable: true,
          overlay: queryFilterPickerOverlay,
        })
        .val,
    ],
    [t]
  )

  const tableFields = useMemo(
    () => [
      T(t('工程师姓名'), 'engineerName').W(128).renderEllipsis().val,
      T(t('时间范围'), 'timeRange').W(220).renderEllipsis().val,
      T(t('建单量'), 'createCount').W(104).val,
      T(t('签收量'), 'signCount').W(104).val,
      T(t('业务完成量'), 'completeCount').W(120).val,
      T(t('不予受理量'), 'rejectCount').W(120).val,
      T(t('取消量'), 'cancelCount').W(96).val,
      T(t('签收前取消量'), 'cancelBeforeSignCount').W(128).val,
      T(t('签收后取消量'), 'cancelAfterSignCount').W(128).val,
      T(t('取消重建量'), 'cancelRebuildCount').W(120).val,
      T(t('操作'), '_actions')
        .W(180)
        .Control({ fixed: 'right' })
        .renderCell((_, ctx) => {
          const row = ctx.rawData as { engineerName: string }

          return (
            <Space size={8}>
              <Button
                type="primary"
                appearance="link"
                onClick={() => Message.open({ title: `${t('查看')} ${row.engineerName}${t('统计明细（示例）')}` })}
              >
                {t('查看')}
              </Button>
              <Button
                type="primary"
                appearance="link"
                onClick={() => Message.open({ title: `${t('导出')} ${row.engineerName}${t('统计明细（示例）')}` })}
              >
                {t('导出')}
              </Button>
            </Space>
          )
        })
        .val,
    ],
    [t]
  )

  const statRequest = useMemo(
    () => async () => {
      const response = await getTableStatOverview()

      return {
        list: response.list.map((item) => ({
          ...item,
          title: t(item.title),
        })),
      }
    },
    [t]
  )

  return (
    <StatListPageFrame
      key={locale}
      title={t('数据统计表')}
      queryFields={queryFields}
      tableFields={tableFields}
      searchPlaceholder={t('工程师姓名')}
      statSection={<MetricOverviewGrid key={locale} request={statRequest} />}
      extra={
        <Space className={proStatPageStyles.headerExtra}>
          <Button type="default" onClick={() => Message.open({ title: t('列表已刷新（示例）') })}>
            {t('刷新')}
          </Button>
          <Button
            type="default"
            appearance="line"
            icon={<DownloadOutlined />}
            onClick={() => Message.open({ type: 'success', title: t('导出任务已创建（示例）') })}
          >
            {t('导出')}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => Message.open({ title: t('新建统计任务（示例）') })}
          >
            {t('新建统计任务')}
          </Button>
        </Space>
      }
    />
  )
}

export function TableStatPage() {
  const { locale, t } = useTranslation()
  const request = useMemo(
    () => async (params: Parameters<typeof getTableStatList>[0]) => {
      const keyword = getKeywordValue(params)
      const nextParams = getParamsWithoutKeyword(params)
      const translatedList = queryTableStatRows(nextParams).map((row) => ({
        ...row,
        engineerName: t(row.engineerName),
        timeRange: t(row.timeRange),
      }))
      const filteredList = filterListByKeyword(translatedList, keyword, [(row) => row.engineerName])

      return paginateList(filteredList, nextParams)
    },
    [t]
  )

  return (
    <ProListPageProvider key={locale} request={request}>
      <TypicalPageFieldMapProvider key={locale}>
        <TableStatInner />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}

export default TableStatPage
