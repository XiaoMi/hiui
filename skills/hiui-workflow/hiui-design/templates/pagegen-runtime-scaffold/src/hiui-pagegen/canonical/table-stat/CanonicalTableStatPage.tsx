import React, { useMemo, useState } from 'react'
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
import styles from './CanonicalTableStatPage.module.scss'

const EMPTY_STATE_IMAGE =
  'https://files.fds.api.xiaomi.com/b2c-xms-01/repairWorkbench/9b52e36ddefe4bab9e9c1777ec4c323b.png'

export type StatCard = {
  key: string
  label: string
  value: string
}

export type QueryField = {
  key: string
  label: string
  control?: 'input' | 'select' | 'dateRange'
  hidden?: boolean
  placeholder?: string | [string, string]
  options?: Array<{
    id: string | number
    title: string
  }>
  filterMode?: 'contains' | 'equals'
}

export type TableColumn = {
  key: string
  label: string
  width?: number
}

export type TableStatRowData = Record<string, string | number>

export type TableStatCellRenderer = (value: unknown, row: TableStatRowData) => React.ReactNode

export type RowAction = {
  key: string
  label: string
  message?: string
}

export type TableStatSchema = {
  pageType: 'table-stat'
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
  stats: StatCard[]
  queryFields: QueryField[]
  columns: TableColumn[]
  rowActions?: RowAction[]
  rows: TableStatRowData[]
}

type QueryFieldValue = string | number | null | [Date, Date]

function buildEmptyFilters(schema: TableStatSchema) {
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

function renderQueryControl(field: QueryField) {
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
    return <DatePicker appearance="contained" label={field.label} type="daterange" clearable />
  }

  return null
}

export function CanonicalTableStatPage({
  schema,
  className,
  stats,
  rows,
  onPrimaryAction,
  onSecondaryAction,
  primaryActionLoading = false,
  secondaryActionLoading = false,
  cellRenderers,
}: {
  schema: TableStatSchema
  className?: string
  stats?: StatCard[]
  rows?: TableStatRowData[]
  onPrimaryAction?: () => void
  onSecondaryAction?: () => void
  primaryActionLoading?: boolean
  secondaryActionLoading?: boolean
  cellRenderers?: Record<string, TableStatCellRenderer>
}) {
  const hostAdapter = useHostAdapter()
  const effectiveStats = stats || schema.stats
  const effectiveRows = rows || schema.rows
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
    return effectiveRows.filter((row) => {
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
  }, [effectiveRows, formValues, schema, searchValue])

  const pagedRows = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize
    return filteredRows.slice(start, start + pagination.pageSize)
  }, [filteredRows, pagination])

  const filteredCount = useMemo(() => {
    const formCount = Object.values(formValues).filter((value) => !isEmptyFilterValue(value)).length
    return formCount + (searchValue.trim() ? 1 : 0)
  }, [formValues, searchValue])

  const tableColumns = useMemo(() => {
    const baseColumns = schema.columns.map((column) => ({
      title: column.label,
      dataKey: column.key,
      width: column.width || 160,
      render: (value: unknown, row: TableStatRowData) => {
        const customRenderer = cellRenderers?.[column.key]
        if (customRenderer) {
          return customRenderer(value, row)
        }
        return String(value ?? '-')
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
        width: Math.max(schema.rowActions.length * 88, 160),
        render: (_: unknown, row: TableStatRowData) => (
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
  }, [cellRenderers, hostAdapter.message, schema])

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
      {schema.primaryAction ? (
        <Button
          type="default"
          appearance="line"
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
    </div>
  )

  return (
    <div
      className={`${styles.pageRoot}${className ? ` ${className}` : ''}`}
      data-hiui-pagegen-template="table-stat"
      data-hiui5-page-type="table-stat"
      data-hiui5-shell="hiui-pagegen-table-stat-v1"
    >
      <div className={styles.headerRegion}>
        <PageHeader
          className={styles.pageHeader}
          title={schema.title}
          extra={headerExtra}
          backIcon={false}
        />
      </div>

      <div className={styles.whiteBody} data-hiui5-region="white-body">
        <div
          className={styles.statSection}
          data-hiui5-region="stat-section"
          data-hiui5-stat-presentation="cards"
          data-hiui5-metric-surface="overview"
        >
          {effectiveStats.map((stat) => (
            <article key={stat.key} className={styles.statCard}>
              <div className={styles.statLabel}>{stat.label}</div>
              <div className={styles.statValue}>{stat.value}</div>
            </article>
          ))}
        </div>

        <div className={styles.queryRegion} data-hiui5-region="query-filter">
          <div className={styles.querySection}>
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
                      placeholder={schema.searchPlaceholder}
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
                  <FilterButton
                    key="all-filter"
                    count={filteredCount}
                    onClick={() => setDrawerVisible(true)}
                  >
                    全部筛选
                  </FilterButton>,
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
        </div>

        <div className={styles.tableRegion} data-hiui5-region="table">
          <div className={styles.tableContainer}>
            <Table
              className={styles.table}
              stickyFooter
              fieldKey={schema.columns[0]?.key || 'id'}
              maxHeight="calc(100vh - 480px)"
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

export default CanonicalTableStatPage
