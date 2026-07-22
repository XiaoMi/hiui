/* hiui-pagegen generation-mode: __GENERATION_MODE__ */
/* hiui-pagegen template marker: __PAGE_TYPE__ */
/* hiui-pagegen reference mode: __REFERENCE_ASSET_MODE__ */
/* hiui-pagegen reference source: __REFERENCE_ASSET_SOURCE__ */
/* hiui-pagegen reference strategy: __REFERENCE_SOURCE_STRATEGY__ */
/* hiui-pagegen reference registry: __REFERENCE_PAGE_TYPE_REGISTRY__ */
/* hiui-pagegen reference example: __REFERENCE_EXAMPLE_PATH__ */
/* hiui-pagegen reference asset example: __REFERENCE_ASSET_EXAMPLE_PATH__ */
/* hiui-pagegen reference shell: __REFERENCE_SHELL__ */
/* hiui-pagegen reference template asset: __REFERENCE_TEMPLATE_ASSET_SOURCE__ */
/* hiui-pagegen reference canonical component: __REFERENCE_CANONICAL_COMPONENT_PATH__ */
import { useMemo } from 'react'
import { Button, Message, Space, Tag } from '@hi-ui/hiui'
import { DownloadOutlined, PlusOutlined } from '@hi-ui/icons'
import { extendDsl, F, ReadonlyFieldCreator, type GetDataSourceParamsType } from '@hi-ui/schema-core'
import { TypicalPageFieldMapProvider } from '@hiui-design/typical-page-shells'
import {
  ProListPageProvider,
  queryFilterDatePickerOverlay,
  queryFilterPickerOverlay,
} from '@hiui-design/typical-page-shells/pro-list-page'
import {
  TablePageFrame,
  proTablePageStyles,
  renderTableTextEllipsis,
} from '@hiui-design/typical-page-shells/pro-table-page'
import pageSchema from './page.schema.json'
import { useTranslation } from '__TRANSLATION_IMPORT__'
import { useHostAdapter } from '__HOST_ADAPTER_IMPORT__'

type TableBasicSchema = typeof pageSchema
type TableBasicRow = TableBasicSchema['rows'][number]

const schema = pageSchema as TableBasicSchema

const T = extendDsl(ReadonlyFieldCreator, {
  renderEllipsis() {
    return this.renderCell((cellValue) => renderTableTextEllipsis(cellValue))
  },
})

function getKeywordValue(params: GetDataSourceParamsType) {
  const keywordFilter = (params.filters ?? []).find((item) => item.id === 'keyword')
  return keywordFilter?.value != null ? String(keywordFilter.value).trim().toLowerCase() : ''
}

function getParamsWithoutKeyword(params: GetDataSourceParamsType): GetDataSourceParamsType {
  return {
    ...params,
    filters: (params.filters ?? []).filter((item) => item.id !== 'keyword'),
  }
}

function getFilterValue(params: GetDataSourceParamsType, fieldKey: string) {
  return (params.filters ?? []).find((item) => item.id === fieldKey)?.value
}

function filterListByKeyword<T>(
  list: T[],
  keyword: string,
  selectors: Array<(item: T) => unknown>
) {
  if (!keyword) return list

  return list.filter((item) =>
    selectors.some((selector) =>
      String(selector(item) ?? '')
        .toLowerCase()
        .includes(keyword)
    )
  )
}

function paginateList<T>(list: T[], params: GetDataSourceParamsType) {
  const current = params.pagination?.current ?? 1
  const pageSize = params.pagination?.pageSize ?? schema.pageSize ?? 10
  const start = (current - 1) * pageSize

  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
    current,
    pageSize,
  }
}

function toTimestamp(value: unknown) {
  if (value == null || value === '') {
    return null
  }

  const nextDate = value instanceof Date ? value : new Date(String(value))
  const timestamp = nextDate.getTime()
  return Number.isNaN(timestamp) ? null : timestamp
}

function resolveStatusTagType(rawValue: unknown) {
  const normalized = String(rawValue ?? '')
    .trim()
    .toLowerCase()

  if (['enabled', 'active', 'success', 'done', '已完成', '启用', '正常', '营业中'].includes(normalized)) {
    return 'success'
  }

  if (['paused', 'pending', '待回访', '待处理', '待确认', '筹备中'].includes(normalized)) {
    return 'warning'
  }

  if (['disabled', 'training', 'error', 'failed', '停用', '跟进中', '异常', '已闭店'].includes(normalized)) {
    return 'danger'
  }

  return 'default'
}

function matchesSchemaField(
  row: TableBasicRow,
  field: TableBasicSchema['queryFields'][number],
  rawValue: unknown
) {
  if (rawValue == null || rawValue === '') {
    return true
  }

  if (Array.isArray(rawValue) && rawValue.length === 0) {
    return true
  }

  if (field.control === 'dateRange') {
    if (!Array.isArray(rawValue) || rawValue.length < 2) {
      return true
    }

    const start = toTimestamp(rawValue[0])
    const end = toTimestamp(rawValue[1])
    const rowTime = toTimestamp(row[field.key as keyof TableBasicRow])

    if (start == null || end == null || rowTime == null) {
      return true
    }

    return rowTime >= start && rowTime <= end
  }

  const normalizedFilterValue = String(rawValue ?? '')
    .trim()
    .toLowerCase()

  if (!normalizedFilterValue) {
    return true
  }

  const rowValue = String(row[field.key as keyof TableBasicRow] ?? '')
    .trim()
    .toLowerCase()

  const filterMode = field.filterMode || (field.control === 'select' ? 'equals' : 'contains')
  return filterMode === 'equals'
    ? rowValue === normalizedFilterValue
    : rowValue.includes(normalizedFilterValue)
}

function BasicTableInner() {
  const { locale, t } = useTranslation()
  const hostAdapter = useHostAdapter()

  const keywordFields = useMemo(
    () => schema.queryFields.filter((field) => (field.control || 'input') === 'input'),
    []
  )

  const filterFields = useMemo(
    () => schema.queryFields.filter((field) => field.control === 'select' || field.control === 'dateRange'),
    []
  )

  const notify = (messageText: string) => {
    if (typeof hostAdapter?.message?.success === 'function') {
      hostAdapter.message.success(messageText)
      return
    }

    Message.open({
      type: 'success',
      title: messageText,
    })
  }

  const queryFields = useMemo(
    () =>
      filterFields.map((field) => {
        const label = t(field.label)

        if (field.control === 'dateRange') {
          return F(label, field.key)
            .Date({
              type: 'daterange',
              format: 'YYYY-MM-DD',
              clearable: true,
              overlay: queryFilterDatePickerOverlay,
              placeholder:
                Array.isArray(field.placeholder) && field.placeholder.length === 2
                  ? field.placeholder.map((item) => t(item))
                  : [t(`开始${field.label}`), t(`结束${field.label}`)],
            })
            .val
        }

        return F(label, field.key)
          .Select({
            data: (field.options || []).map((option) => ({
              ...option,
              title: t(option.title),
            })),
            clearable: true,
            overlay: queryFilterPickerOverlay,
          })
          .val
      }),
    [filterFields, t]
  )

  const tableFields = useMemo(
    () => [
      ...schema.columns.map((column) => {
        let field = T(t(column.label), column.key).W(column.width || 160)

        field = field.renderCell((cellValue, ctx) => {
          const row = ctx.rawData as TableBasicRow

          if (column.display === 'status') {
            return (
              <Tag appearance="filled" type={resolveStatusTagType(row[column.statusKey as keyof TableBasicRow])}>
                {String(cellValue ?? '')}
              </Tag>
            )
          }

          return renderTableTextEllipsis(cellValue)
        })

        return field.val
      }),
      ...(Array.isArray(schema.rowActions) && schema.rowActions.length > 0
        ? [
            T(t('操作'), '_actions')
              .W(180)
              .Control({ fixed: 'right' })
              .renderCell((_, ctx) => {
                const row = ctx.rawData as TableBasicRow

                return (
                  <Space size={8}>
                    {schema.rowActions.map((action) => (
                      <Button
                        key={action.key}
                        type="primary"
                        appearance="link"
                        onClick={() => {
                          notify(
                            action.message || `${t(action.label)}：${String(row[schema.columns[0]?.key as keyof TableBasicRow] ?? '')}`
                          )
                        }}
                      >
                        {t(action.label)}
                      </Button>
                    ))}
                  </Space>
                )
              })
              .val,
          ]
        : []),
    ],
    [t]
  )

  const searchPlaceholder = useMemo(() => {
    if (typeof schema.searchPlaceholder === 'string' && schema.searchPlaceholder.trim()) {
      return t(schema.searchPlaceholder)
    }

    return keywordFields
      .map((field) =>
        typeof field.placeholder === 'string' && field.placeholder.trim()
          ? t(field.placeholder)
          : t(field.label)
      )
      .join(' / ')
  }, [keywordFields, t])

  return (
    <TablePageFrame
      key={locale}
      title={t(schema.title)}
      queryFields={queryFields}
      tableFields={tableFields}
      searchPlaceholder={searchPlaceholder}
      extra={
        <Space className={proTablePageStyles.headerExtra}>
          <Button
            type="default"
            appearance="line"
            icon={<DownloadOutlined />}
            onClick={() => notify(schema.secondaryAction?.message || t(schema.secondaryAction?.label || '导出'))}
          >
            {t(schema.secondaryAction?.label || '导出')}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => notify(schema.primaryAction?.message || t(schema.primaryAction?.label || '新增'))}
          >
            {t(schema.primaryAction?.label || '新增')}
          </Button>
        </Space>
      }
    />
  )
}

export default function TableBasicPage() {
  const { locale } = useTranslation()

  const request = useMemo(
    () => async (params: GetDataSourceParamsType) => {
      const keyword = getKeywordValue(params)
      const nextParams = getParamsWithoutKeyword(params)

      const filteredList = schema.rows.filter((row) =>
        schema.queryFields
          .filter((field) => field.control === 'select' || field.control === 'dateRange')
          .every((field) => matchesSchemaField(row, field, getFilterValue(nextParams, field.key)))
      )

      const keywordMatchedList = filterListByKeyword(
        filteredList,
        keyword,
        keywordFieldsFromSchema.map((field) => (row: TableBasicRow) => row[field.key as keyof TableBasicRow])
      )

      return paginateList(keywordMatchedList, nextParams)
    },
    []
  )

  return (
    <ProListPageProvider key={locale} request={request}>
      <TypicalPageFieldMapProvider key={locale}>
        <BasicTableInner />
      </TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}

const keywordFieldsFromSchema = schema.queryFields.filter(
  (field) => (field.control || 'input') === 'input'
)
