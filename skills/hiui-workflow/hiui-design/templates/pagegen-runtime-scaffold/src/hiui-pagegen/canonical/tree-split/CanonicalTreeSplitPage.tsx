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
  Tree,
} from '@hi-ui/hiui'
import type { TreeDataItem } from '@hi-ui/hiui'
import { useHostAdapter } from '../../host/useHostAdapter'
import styles from './CanonicalTreeSplitPage.module.scss'

const EMPTY_STATE_IMAGE =
  'https://files.fds.api.xiaomi.com/b2c-xms-01/repairWorkbench/9b52e36ddefe4bab9e9c1777ec4c323b.png'

type Primitive = string | number | null | undefined
type QueryFieldValue = Primitive | [Date, Date]

export type TreeSplitNode = {
  id: string | number
  title: string
  children?: TreeSplitNode[]
}

export type TreeSplitQueryField = {
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

export type TreeSplitColumn = {
  key: string
  label: string
  width?: number
}

export type TreeSplitRowAction = {
  key: string
  label: string
  message?: string
}

export type TreeSplitRow = {
  [key: string]: Primitive
}

export type TreeSplitSchema = {
  pageType: 'tree-split'
  title: string
  searchPlaceholder?: string
  treeSearchPlaceholder?: string
  pageSize?: number
  rowKey?: string
  treeFieldKey?: string
  defaultExpandedIds?: Array<string | number>
  primaryAction?: {
    label: string
    message?: string
  }
  secondaryAction?: {
    label: string
    message?: string
  }
  treeNodes: TreeSplitNode[]
  queryFields: TreeSplitQueryField[]
  columns: TreeSplitColumn[]
  rowActions?: TreeSplitRowAction[]
  rows: TreeSplitRow[]
}

function joinClassNames(...tokens: Array<string | undefined | null | false>) {
  return tokens.filter(Boolean).join(' ')
}

function buildEmptyFilters(schema: TreeSplitSchema) {
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

function renderQueryControl(field: TreeSplitQueryField) {
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

function filterTreeNodes(nodes: TreeSplitNode[], keyword: string): TreeSplitNode[] {
  const normalized = keyword.trim().toLowerCase()

  if (!normalized) {
    return nodes
  }

  return nodes.flatMap((node) => {
    const nextChildren = filterTreeNodes(node.children || [], keyword)
    const matched = String(node.title).toLowerCase().includes(normalized)

    if (matched) {
      return [{ ...node }]
    }

    if (nextChildren.length > 0) {
      return [{ ...node, children: nextChildren }]
    }

    return []
  })
}

function collectDescendantIds(nodes: TreeSplitNode[], targetId: string | number): Set<string> {
  const result = new Set<string>()

  const walk = (items: TreeSplitNode[]): boolean => {
    return items.some((item) => {
      const matched = String(item.id) === String(targetId)
      const childMatched = walk(item.children || [])

      if (matched || childMatched) {
        const collect = (node: TreeSplitNode) => {
          result.add(String(node.id))
          ;(node.children || []).forEach(collect)
        }

        collect(item)
        return true
      }

      return false
    })
  }

  walk(nodes)
  return result
}

function mapTreeItems(nodes: TreeSplitNode[]): TreeDataItem[] {
  return nodes.map((node) => ({
    id: node.id,
    title: node.title,
    children: node.children ? mapTreeItems(node.children) : undefined,
  }))
}

export function CanonicalTreeSplitPage({
  schema,
  className,
}: {
  schema: TreeSplitSchema
  className?: string
}) {
  const hostAdapter = useHostAdapter()
  const initialFilters = useMemo(() => buildEmptyFilters(schema), [schema])
  const [formValues, setFormValues] = useState<Record<string, QueryFieldValue>>(initialFilters)
  const [searchValue, setSearchValue] = useState('')
  const [treeQuery, setTreeQuery] = useState('')
  const [selectedTreeId, setSelectedTreeId] = useState<string | number | null>(null)
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

  const visibleTreeNodes = useMemo(
    () => filterTreeNodes(schema.treeNodes, treeQuery),
    [schema.treeNodes, treeQuery]
  )

  const selectedCategoryIds = useMemo(() => {
    if (selectedTreeId == null || selectedTreeId === '') {
      return null
    }

    return collectDescendantIds(schema.treeNodes, selectedTreeId)
  }, [schema.treeNodes, selectedTreeId])

  const filteredRows = useMemo(() => {
    return schema.rows.filter((row) => {
      const treeFieldKey = schema.treeFieldKey || 'categoryId'

      if (selectedCategoryIds && !selectedCategoryIds.has(String(row[treeFieldKey] ?? ''))) {
        return false
      }

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
  }, [formValues, schema, searchValue, selectedCategoryIds])

  const pagedRows = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize
    return filteredRows.slice(start, start + pagination.pageSize)
  }, [filteredRows, pagination.current, pagination.pageSize])

  const filteredCount = useMemo(() => {
    const formCount = Object.values(formValues).filter((value) => !isEmptyFilterValue(value)).length
    const treeCount = selectedTreeId == null || selectedTreeId === '' ? 0 : 1
    return formCount + treeCount + (searchValue.trim() ? 1 : 0)
  }, [formValues, searchValue, selectedTreeId])

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
        width: Math.max(schema.rowActions.length * 88, 120),
        render: (_: unknown, row: TreeSplitRow) => (
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
    setSelectedTreeId(null)
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
      data-hiui-pagegen-template="tree-split"
      data-hiui5-page-type="tree-split"
      data-hiui5-shell="hiui-pagegen-tree-split-v1"
    >
      <div className={styles.headerRegion} data-hiui5-region="header">
        <PageHeader className={styles.pageHeader} title={schema.title} extra={headerExtra} backIcon={false} />
      </div>

      <div className={styles.whiteBody} data-hiui5-region="white-body">
        <div className={styles.splitWorkspace} data-hiui5-region="split-workspace">
          <div className={styles.leftTree} data-hiui5-region="left-tree">
            <div className={styles.treeSearch}>
              <SearchInput
                className={styles.treeSearchInput}
                placeholder={schema.treeSearchPlaceholder || '搜索品类'}
                value={treeQuery}
                onChange={(_, value) => setTreeQuery(value)}
              />
            </div>
            <div className={styles.treeScroll}>
              <div className={styles.treePanel}>
                <Tree
                  data={mapTreeItems(visibleTreeNodes)}
                  selectedId={selectedTreeId || undefined}
                  defaultExpandedIds={schema.defaultExpandedIds || []}
                  onSelect={(id) => {
                    setSelectedTreeId(id == null || id === '' ? null : String(id))
                    setPagination((prev) => ({
                      ...prev,
                      current: 1,
                    }))
                  }}
                />
              </div>
            </div>
          </div>

          <div className={styles.rightList} data-hiui5-region="right-list">
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

            <div className={styles.tableRegion} data-hiui5-region="table">
              <div className={styles.tableContainer}>
                <Table
                  className={styles.table}
                  stickyFooter
                  fieldKey={schema.rowKey || 'id'}
                  maxHeight="calc(100vh - 360px)"
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
      </div>
    </div>
  )
}

export default CanonicalTreeSplitPage
