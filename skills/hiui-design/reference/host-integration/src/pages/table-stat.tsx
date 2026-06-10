import { useMemo } from 'react'
import { Button, Message, Space } from '@hi-ui/hiui'
import { DownloadOutlined } from '@hi-ui/icons'
import { extendDsl, F, ReadonlyFieldCreator } from '@hi-ui/schema-core'
import { TypicalPageFieldMapProvider } from '@hiui-design/typical-page-shells'
import {
  ProListPageProvider,
  queryFilterDatePickerOverlay,
  queryFilterPickerOverlay,
} from '@hiui-design/typical-page-shells/pro-list-page'
import {
  StatListPageFrame,
  StatOverviewGrid,
  proStatPageStyles,
  renderStatTableTextEllipsis,
} from '@hiui-design/typical-page-shells/pro-stat-page'
import { engineerOptions, getTableStatOverview, queryTableStatRows } from './typical-pages.mock'
import {
  filterListByKeyword,
  getKeywordValue,
  getParamsWithoutKeyword,
  paginateList,
} from './request-utils'
import { useTranslation } from '../../translation'

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
      statSection={<StatOverviewGrid key={locale} request={statRequest} />}
      extra={
        <Space className={proStatPageStyles.headerExtra}>
          <Button
            type="default"
            appearance="line"
            icon={<DownloadOutlined />}
            onClick={() => Message.open({ type: 'success', title: t('导出任务已创建（示例）') })}
          >
            {t('导出')}
          </Button>
          <Button type="default" onClick={() => Message.open({ title: t('列表已刷新（示例）') })}>
            {t('刷新')}
          </Button>
        </Space>
      }
    />
  )
}

export function TableStatPage() {
  const { locale, t } = useTranslation()
  const request = useMemo(
    () => async (params: Parameters<typeof queryTableStatRows>[0]) => {
      const keyword = getKeywordValue(params)
      const nextParams = getParamsWithoutKeyword(params)
      const translatedList = queryTableStatRows(nextParams).map((row) => ({
        ...row,
        engineerName: t(row.engineerName),
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
