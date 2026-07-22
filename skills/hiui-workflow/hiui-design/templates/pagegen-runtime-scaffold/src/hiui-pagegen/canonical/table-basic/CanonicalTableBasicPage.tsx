import React, { useMemo, useState } from 'react'
import { ResetOutlined } from '@hi-ui/icons'
import {
  Button,
  DatePicker,
  FilterButton,
  FilterDrawer,
  Input,
  Pagination,
  QueryFilter,
  QueryFilterProvider,
  SearchInput,
  Select,
  Table,
  PageHeader,
} from '@hi-ui/hiui'
import { useHostAdapter } from '../../host/useHostAdapter'
import styles from './CanonicalTableBasicPage.module.scss'

const EMPTY_STATE_IMAGE =
  'https://files.fds.api.xiaomi.com/b2c-xms-01/repairWorkbench/9b52e36ddefe4bab9e9c1777ec4c323b.png'

export type QueryField = {
  key: string
  label: string
  control?: 'input' | 'select' | 'dateRange'
  hidden?: boolean
  placeholder?: string | [string, string]
  width?: number
  span?: number
  options?: Array<{
    id: string | number
    title: string
  }>
  filterMode?: 'contains' | 'equals'
}

export type TableColumn = {
  key: string
  label: string
  display?: 'status'
  statusKey?: string
  width?: number
}

export type RowAction = {
  key: string
  label: string
  message?: string
}

export type PrimaryAction = {
  label: string
  message?: string
}

export type TableBasicSchema = {
  pageType: 'table-basic'
  title: string
  description?: string
  resetMessage?: string
  queryMessage?: string
  emptyTitle?: string
  emptyDescription?: string
  pageSize?: number
  primaryAction?: PrimaryAction
  secondaryAction?: PrimaryAction
  queryFields: QueryField[]
  columns: TableColumn[]
  rowActions?: RowAction[]
  rows: Array<Record<string, string | number>>
}

export type TableBasicRowData = Record<string, string | number>
export type TableBasicFilterState = Record<string, QueryFieldValue>
export type TableBasicPaginationState = {
  current: number
  pageSize: number
  total: number
}
export type QueryFieldOverride = {
  component?: React.ReactElement
  visible?: boolean
}
export type TableColumnOverride = {
  title?: React.ReactNode
  width?: number
  render?: (value: unknown, row: TableBasicRowData) => React.ReactNode
}
export type TableFixedToColumn = {
  left?: string
  right?: string
}

type QueryFilterFieldLike = {
  field: string
}

type TableField = {
  title: React.ReactNode
  dataKey: string
  width?: number
  render?: (value: unknown, row: TableBasicRowData) => React.ReactNode
}

type CanonicalTableBasicPageProps = {
  schema: TableBasicSchema
  className?: string
  loading?: boolean
  queryMode?: 'local' | 'external'
  filterValues?: TableBasicFilterState
  onFilterValuesChange?: (nextValues: TableBasicFilterState) => void
  onClearFilters?: () => void
  paginationState?: TableBasicPaginationState
  pageSizeOptions?: number[]
  onPaginationChange?: (current: number) => void
  onPageSizeChange?: (pageSize: number) => void
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  primaryActionLoading?: boolean
  secondaryActionLoading?: boolean
  onRowAction?: (action: RowAction, row: TableBasicRowData) => void
  queryFieldOverrides?: Record<string, QueryFieldOverride>
  queryActions?: React.ReactNode | React.ReactNode[]
  columnOverrides?: Record<string, TableColumnOverride>
  emptyContent?: React.ReactNode
  rowKey?: string
  fixedToColumn?: TableFixedToColumn
  hidePaginationWhenEmpty?: boolean
}

type QueryFieldValue = string | number | null | Array<string | number> | [Date, Date]

function buildEmptyFilters(schema: TableBasicSchema) {
  return schema.queryFields.reduce<Record<string, QueryFieldValue>>((acc, field) => {
    acc[field.key] = field.control === 'dateRange' ? null : ''
    return acc
  }, {})
}

function isEmptyFilterValue(value: QueryFieldValue) {
  if (Array.isArray(value)) {
    return value.length === 0 || value.every((item) => item == null || item === '')
  }

  return value == null || value === ''
}

function resolveStatusTone(rawValue: unknown) {
  const normalized = String(rawValue ?? '')
    .trim()
    .toLowerCase()

  if (normalized === 'enabled' || normalized === '启用' || normalized === '在岗') {
    return 'success'
  }

  if (
    normalized === 'paused' ||
    normalized === 'disabled' ||
    normalized === '停用' ||
    normalized === '停岗'
  ) {
    return 'danger'
  }

  if (normalized === 'training' || normalized === '培训中') {
    return 'warning'
  }

  return 'default'
}

export function CanonicalTableBasicPage({
  schema,
  className,
  loading = false,
  queryMode = 'local',
  filterValues,
  onFilterValuesChange,
  onClearFilters,
  paginationState,
  pageSizeOptions = [10, 20, 50],
  onPaginationChange,
  onPageSizeChange,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLoading = false,
  secondaryActionLoading = false,
  onRowAction,
  queryFieldOverrides,
  queryActions,
  columnOverrides,
  emptyContent,
  rowKey,
  fixedToColumn,
  hidePaginationWhenEmpty = false,
}: CanonicalTableBasicPageProps) {
  const hostAdapter = useHostAdapter()
  const initialFilters = useMemo(() => buildEmptyFilters(schema), [schema])
  const externalQueryMode = queryMode === 'external'
  const [formValues, setFormValues] = useState<Record<string, QueryFieldValue>>(initialFilters)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [filterVisibility, setFilterVisibility] = useState<Record<string, boolean>>({})
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: schema.pageSize || 10,
  })
  const effectiveFilterValues = externalQueryMode ? filterValues || initialFilters : formValues
  const effectivePagination = externalQueryMode
    ? paginationState || {
        current: 1,
        pageSize: schema.pageSize || 10,
        total: schema.rows.length,
      }
    : {
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: 0,
      }
  const keywordField = useMemo(
    () => schema.queryFields.find((field) => field.key === 'keyword'),
    [schema]
  )
  const inlineSchemaFields = useMemo(
    () => schema.queryFields.filter((field) => field.key !== 'keyword'),
    [schema]
  )

  const filteredRows = useMemo(() => {
    if (externalQueryMode) {
      return schema.rows
    }

    return schema.rows.filter((row) => {
      return schema.queryFields.every((field) => {
        const currentValue = effectiveFilterValues[field.key]
        const filterMode = field.filterMode || (field.control === 'select' ? 'equals' : 'contains')

        if (field.control === 'dateRange') {
          if (
            !Array.isArray(currentValue) ||
            !currentValue[0] ||
            !currentValue[1] ||
            !(currentValue[0] instanceof Date) ||
            !(currentValue[1] instanceof Date)
          ) {
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
  }, [effectiveFilterValues, externalQueryMode, schema])

  const pagedRows = externalQueryMode
    ? schema.rows
    : filteredRows.slice(
        (pagination.current - 1) * pagination.pageSize,
        (pagination.current - 1) * pagination.pageSize + pagination.pageSize
      )

  const tableColumns = useMemo<TableField[]>(() => {
    const baseColumns = schema.columns.map<TableField>((column) => ({
      title: columnOverrides?.[column.key]?.title || column.label,
      dataKey: column.key,
      width: columnOverrides?.[column.key]?.width || column.width || 160,
      render: (value: unknown, row: TableBasicRowData) => {
        if (columnOverrides?.[column.key]?.render) {
          return columnOverrides[column.key].render?.(value, row)
        }

        if (column.display === 'status') {
          const tone = resolveStatusTone(row[column.statusKey || column.key])

          return (
            <span className={`${styles.statusTag} ${styles[`statusTag--${tone}`]}`}>
              {String(value ?? '-')}
            </span>
          )
        }

        return (
          <span className={styles.cellText} title={String(value ?? '-')}>
            {String(value ?? '-')}
          </span>
        )
      },
    }))

    if (!schema.rowActions?.length) {
      return baseColumns
    }

    return [
      ...baseColumns,
      {
        title: '操作',
        dataKey: '__actions__',
        width: Math.max(schema.rowActions.length * 72, 160),
        render: (_: unknown, row: TableBasicRowData) => (
          <div className={styles.linkActions}>
            {schema.rowActions?.map((action) => (
              <Button
                key={action.key}
                type="primary"
                appearance="link"
                onClick={() => {
                  if (onRowAction) {
                    onRowAction(action, row)
                    return
                  }
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
  }, [columnOverrides, hostAdapter.message, onRowAction, schema])

  const handleClear = () => {
    if (externalQueryMode) {
      if (onClearFilters) {
        onClearFilters()
      } else {
        onFilterValuesChange?.(buildEmptyFilters(schema))
        onPaginationChange?.(1)
      }
      return
    }

    const nextFilters = buildEmptyFilters(schema)
    setFormValues(nextFilters)
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }))
  }

  const applyFilterValues = (nextValues: TableBasicFilterState) => {
    if (externalQueryMode) {
      onFilterValuesChange?.(nextValues)
      if (effectivePagination.current !== 1) {
        onPaginationChange?.(1)
      }
      return
    }

    setFormValues(nextValues)
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }))
  }

  const renderQueryControl = (field: QueryField) => {
    const overrideComponent = queryFieldOverrides?.[field.key]?.component

    if (overrideComponent) {
      return overrideComponent
    }

    if (field.control === 'select') {
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

    if (field.control === 'dateRange') {
      const placeholder =
        Array.isArray(field.placeholder) && field.placeholder.length === 2
          ? field.placeholder
          : [`开始${field.label}`, `结束${field.label}`]

      return <DatePicker appearance="filled" type="daterange" placeholder={placeholder} />
    }

    return (
      <Input
        placeholder={
          typeof field.placeholder === 'string' ? field.placeholder : `请输入${field.label}`
        }
        appearance="filled"
        clearable
      />
    )
  }

  const filterFields = useMemo(
    () =>
      inlineSchemaFields.map((field) => ({
        field: field.key,
        label: field.label,
        visible:
          filterVisibility[field.key] ?? queryFieldOverrides?.[field.key]?.visible ?? !field.hidden,
        component: renderQueryControl(field),
      })),
    [filterVisibility, inlineSchemaFields, queryFieldOverrides]
  )

  const showedFilterFields = useMemo(
    () => filterFields.filter((field) => field.visible !== false),
    [filterFields]
  )

  const filteredCount = useMemo(() => {
    return Object.values(effectiveFilterValues).filter((value) => !isEmptyFilterValue(value)).length
  }, [effectiveFilterValues])
  const extraQueryActions = useMemo(() => {
    if (!queryActions) {
      return []
    }

    return Array.isArray(queryActions) ? queryActions : [queryActions]
  }, [queryActions])
  const queryActionBar = useMemo(() => {
    return (
      <div className={styles.queryActions}>
        <FilterButton key="all-filter" count={filteredCount} onClick={() => setDrawerVisible(true)}>
          全部筛选
        </FilterButton>
        {extraQueryActions}
        {filteredCount > 0 ? (
          <Button key="clear-filter" icon={<ResetOutlined />} onClick={handleClear}>
            清空
          </Button>
        ) : null}
      </div>
    )
  }, [extraQueryActions, filteredCount])

  const headerExtra = (
    <div className={styles.headerActions}>
      {schema.secondaryAction ? (
        <Button
          type="default"
          appearance="line"
          loading={secondaryActionLoading}
          onClick={() => {
            if (onSecondaryAction) {
              onSecondaryAction()
              return
            }

            hostAdapter.message.success(
              schema.secondaryAction?.message || schema.secondaryAction?.label
            )
          }}
        >
          {schema.secondaryAction.label}
        </Button>
      ) : null}
      {schema.primaryAction ? (
        <Button
          type="primary"
          loading={primaryActionLoading}
          onClick={() => {
            if (onPrimaryAction) {
              onPrimaryAction()
              return
            }

            hostAdapter.message.success(
              schema.primaryAction?.message || schema.primaryAction?.label
            )
          }}
        >
          {schema.primaryAction.label}
        </Button>
      ) : null}
    </div>
  )

  return (
    <div
      className={`${styles.pageRoot}${className ? ` ${className}` : ''}`}
      data-hiui-pagegen-template="table-basic"
      data-hiui5-page-type="table-basic"
      data-hiui5-shell="hiui-pagegen-table-basic-v1"
    >
      <div className={styles.headerRegion}>
        <PageHeader
          className={styles.pageHeader}
          title={schema.title}
          extra={headerExtra}
          backIcon={false}
        />
      </div>

      <div className={styles.whiteBody}>
        <div className={styles.queryRegion}>
          {schema.description ? <div className={styles.notice}>{schema.description}</div> : null}

          <div className={styles.querySection}>
            <QueryFilterProvider>
              <QueryFilter
                className={styles.queryFilter}
                classNames={{ form: styles.queryFilterForm }}
                appearance="contained"
                showLabel={false}
                filterFields={showedFilterFields}
                customFieldProps={(_filterField: QueryFilterFieldLike) => ({
                  style: {
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                  },
                })}
                formData={effectiveFilterValues}
                onChange={(nextFormData) => {
                  applyFilterValues({
                    ...effectiveFilterValues,
                    ...(nextFormData as Record<string, QueryFieldValue>),
                  })
                }}
                prepend={
                  keywordField ? (
                    <SearchInput
                      placeholder={
                        typeof keywordField.placeholder === 'string'
                          ? keywordField.placeholder
                          : `请输入${keywordField.label}`
                      }
                      value={String(effectiveFilterValues[keywordField.key] ?? '')}
                      onChange={(_, value) => {
                        applyFilterValues({
                          ...effectiveFilterValues,
                          [keywordField.key]: value,
                        })
                      }}
                    />
                  ) : null
                }
                append={queryActionBar}
              />
              <FilterDrawer
                width={360}
                visible={drawerVisible}
                title="全部筛选"
                formData={effectiveFilterValues}
                filterFields={filterFields}
                onChange={(nextFormData, nextFields) => {
                  setFilterVisibility((prev) => {
                    const nextVisibility = { ...prev }

                    nextFields.forEach((field) => {
                      nextVisibility[field.field] = field.visible ?? true
                    })

                    return nextVisibility
                  })
                  applyFilterValues({
                    ...effectiveFilterValues,
                    ...(nextFormData as Record<string, QueryFieldValue>),
                  })
                }}
                onClose={() => setDrawerVisible(false)}
              />
            </QueryFilterProvider>
          </div>
        </div>

        <div className={styles.tableRegion}>
          <div className={styles.tableContainer}>
            <Table
              className={styles.table}
              stickyFooter
              fieldKey={rowKey || schema.columns[0]?.key || 'id'}
              maxHeight="calc(100vh - 360px)"
              columns={tableColumns}
              data={pagedRows}
              loading={loading}
              fixedToColumn={fixedToColumn}
              emptyContent={
                emptyContent || (
                  <div className={styles.emptyContainer}>
                    <div className={styles.emptyContent}>
                      <div className={styles.emptyIcon}>
                        <img src={EMPTY_STATE_IMAGE} alt="" />
                      </div>
                      <div className={styles.emptyTitle}>{schema.emptyTitle || '当前无内容'}</div>
                      <div className={styles.emptyDescription}>
                        {schema.emptyDescription || '请先进行筛选或输入内容'}
                      </div>
                    </div>
                  </div>
                )
              }
            />
          </div>
        </div>

        {!(
          hidePaginationWhenEmpty &&
          (externalQueryMode ? effectivePagination.total : filteredRows.length) === 0
        ) ? (
          <div className={styles.paginationRegion}>
            <Pagination
              current={externalQueryMode ? effectivePagination.current : pagination.current}
              total={externalQueryMode ? effectivePagination.total : filteredRows.length}
              pageSize={externalQueryMode ? effectivePagination.pageSize : pagination.pageSize}
              pageSizeOptions={pageSizeOptions}
              showTotal
              showJumper
              onChange={(current) => {
                if (externalQueryMode) {
                  onPaginationChange?.(current)
                  return
                }

                setPagination((prev) => ({
                  ...prev,
                  current,
                }))
              }}
              onPageSizeChange={(nextPageSize) => {
                if (externalQueryMode) {
                  onPageSizeChange?.(nextPageSize)
                  return
                }

                setPagination({
                  current: 1,
                  pageSize: nextPageSize,
                })
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default CanonicalTableBasicPage
