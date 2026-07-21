import React, { useMemo, useState } from 'react'
import { ResetOutlined } from '@hi-ui/icons'
import {
  Button,
  DatePicker,
  FilterButton,
  FilterDrawer,
  Input,
  Pagination,
  PageHeader,
  QueryFilter,
  QueryFilterProvider,
  SearchInput,
  Select,
  Table,
} from '@hi-ui/hiui'
import { useHostAdapter } from '../../host/useHostAdapter'
import styles from './CanonicalTreeTablePage.module.scss'

const EMPTY_STATE_IMAGE =
  'https://files.fds.api.xiaomi.com/b2c-xms-01/repairWorkbench/9b52e36ddefe4bab9e9c1777ec4c323b.png'

type Primitive = string | number | null | undefined
type QueryFieldValue = Primitive | [Date, Date]

export type TreeTableQueryField = {
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

export type TreeTableColumn = {
  key: string
  label: string
  width?: number
}

export type TreeTableRowAction = {
  key: string
  label: string
  message?: string
}

export type TreeTableRow = {
  children?: TreeTableRow[]
  [key: string]: Primitive | TreeTableRow[] | undefined
}

export type TreeTableSchema = {
  pageType: 'tree-table'
  title: string
  searchPlaceholder?: string
  pageSize?: number
  rowKey?: string
  defaultExpandedRowKeys?: Array<string | number>
  primaryAction?: {
    label: string
    message?: string
  }
  secondaryAction?: {
    label: string
    message?: string
  }
  queryFields: TreeTableQueryField[]
  columns: TreeTableColumn[]
  rowActions?: TreeTableRowAction[]
  rows: TreeTableRow[]
}

function joinClassNames(...tokens: Array<string | undefined | null | false>) {
  return tokens.filter(Boolean).join(' ')
}

function buildEmptyFilters(schema: TreeTableSchema) {
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

function countRoots(rows: TreeTableRow[]) {
  return rows.length
}

function filterTreeRows(
  rows: TreeTableRow[],
  predicate: (row: TreeTableRow) => boolean
): TreeTableRow[] {
  return rows.flatMap((row) => {
    const nextChildren = filterTreeRows((row.children || []) as TreeTableRow[], predicate)
    const selfMatched = predicate(row)

    if (selfMatched || nextChildren.length > 0) {
      return [
        {
          ...row,
          children: nextChildren.length > 0 ? nextChildren : row.children,
        },
      ]
    }

    return []
  })
}

function renderQueryControl(field: TreeTableQueryField) {
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
      placeholder={typeof field.placeholder === 'string' ? field.placeholder : `请输入${field.label}`}
      appearance="filled"
      clearable
    />
  )
}

export function CanonicalTreeTablePage({
  schema,
  className,
}: {
  schema: TreeTableSchema
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
    () => filterFields.filter((field) => field.visible !== false),
    [filterFields]
  )

  const filteredRows = useMemo(() => {
    return filterTreeRows(schema.rows, (row) => {
      const matchesKeyword =
        !searchValue ||
        Object.values(row).some((value) =>
          typeof value === 'string' || typeof value === 'number'
            ? String(value)
                .toLowerCase()
                .includes(searchValue.trim().toLowerCase())
            : false
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

  const pagedRows = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize
    return filteredRows.slice(start, start + pagination.pageSize)
  }, [filteredRows, pagination.current, pagination.pageSize])

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
        width: Math.max(schema.rowActions.length * 88, 180),
        render: (_: unknown, row: TreeTableRow) => (
          <div className={styles.linkActions}>
            {schema.rowActions?.map((action) => (
              <Button
                key={action.key}
                type="primary"
                appearance="link"
                onClick={() => {
                  const fallbackText = `${action.label}：${String(row[schema.columns[0]?.key] ?? '')}`
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
            hostAdapter.message.success(schema.secondaryAction?.message || schema.secondaryAction?.label)
          }
        >
          {schema.secondaryAction.label}
        </Button>
      ) : null}
      {schema.primaryAction ? (
        <Button
          type="primary"
          onClick={() =>
            hostAdapter.message.success(schema.primaryAction?.message || schema.primaryAction?.label)
          }
        >
          {schema.primaryAction.label}
        </Button>
      ) : null}
    </div>
  )

  return (
    <div
      className={joinClassNames(styles.pageRoot, className)}
      data-hiui-pagegen-template="tree-table"
      data-hiui5-page-type="tree-table"
      data-hiui5-shell="hiui-pagegen-tree-table-v1"
      data-hiui5-tree-table-presentation="inline-tree"
    >
      <div className={styles.headerRegion} data-hiui5-region="header">
        <PageHeader className={styles.pageHeader} title={schema.title} extra={headerExtra} backIcon={false} />
      </div>

      <div className={styles.whiteBody} data-hiui5-region="white-body">
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
              fieldKey={schema.rowKey || 'id'}
              maxHeight="calc(100vh - 360px)"
              defaultExpandedRowKeys={schema.defaultExpandedRowKeys || []}
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
            total={countRoots(filteredRows)}
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

export default CanonicalTreeTablePage
