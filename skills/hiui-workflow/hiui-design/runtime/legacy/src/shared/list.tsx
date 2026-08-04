import React from 'react'
import { TypicalPageFieldMapProvider } from '@hiui-design/typical-page-shells/schema-field-map'
import { ProListPageProvider } from '@hiui-design/typical-page-shells/pro-list-page'
import { StatOverviewGrid } from '@hiui-design/typical-page-shells/pro-stat-page'
import type { LegacyActionHandlers } from '../types'
import { renderRowActions, resolveArray } from './core'

type LegacyListRequestParams = {
  pagination?: {
    current?: number
    pageSize?: number
  }
}

function normalizeTableRecord(record: Record<string, unknown>, indexPath: string): Record<string, unknown> {
  const existingId = record.id ?? record.key
  const children = resolveArray<Record<string, unknown>>(record.children)
  const items = resolveArray<Record<string, unknown>>(record.items)
  const normalizedRecord: Record<string, unknown> = {
    ...record,
    id: existingId ?? `legacy-row-${indexPath}`,
  }

  if (children.length > 0) {
    normalizedRecord.children = children.map((child, index) => normalizeTableRecord(child, `${indexPath}-${index}`))
  }
  if (items.length > 0 && children.length === 0) {
    normalizedRecord.children = items.map((child, index) => normalizeTableRecord(child, `${indexPath}-${index}`))
  }

  return normalizedRecord
}

export function resolveTableData(pageSlots: Record<string, unknown>) {
  return resolveArray<Record<string, unknown>>(pageSlots.mockData).map((record, index) => normalizeTableRecord(record, String(index)))
}

function createListRequest(pageSlots: Record<string, unknown>) {
  return async (params: LegacyListRequestParams = {}) => {
    const list = resolveTableData(pageSlots)
    const current = params.pagination?.current ?? 1
    const pageSize = params.pagination?.pageSize ?? 20
    const start = (current - 1) * pageSize

    return {
      list: list.slice(start, start + pageSize),
      total: list.length,
      current,
      pageSize,
    }
  }
}

export function renderListShell(pageSlots: Record<string, unknown>, children: React.ReactNode) {
  return (
    <ProListPageProvider request={createListRequest(pageSlots)}>
      <TypicalPageFieldMapProvider>{children}</TypicalPageFieldMapProvider>
    </ProListPageProvider>
  )
}

function toSchemaValueType(type: unknown) {
  if (type === 'number') return 'number'
  if (type === 'select' || type === 'treeSelect') return 'select'
  if (type === 'date' || type === 'dateRange' || type === 'datetime') return 'date'
  return 'text'
}

function toSchemaQueryField(field: Record<string, unknown>, index: number) {
  const dataIndex = String(field.name || field.dataIndex || `query_${index}`)
  const title = String(field.label || field.title || dataIndex)
  const options = resolveArray<Record<string, unknown>>(field.options).map((option) => ({
    id: option.value ?? option.id,
    title: option.label ?? option.title ?? option.value ?? option.id,
  }))

  return {
    title,
    _titleText: title,
    dataIndex,
    key: dataIndex,
    valueType: toSchemaValueType(field.type),
    renderer: {},
    fieldProps: {
      placeholder: field.placeholder,
      data: options.length > 0 ? options : undefined,
    },
    formItemProps: {},
  }
}

export function resolveQueryFields(pageSlots: Record<string, unknown>) {
  return resolveArray<Record<string, unknown>>(pageSlots.queryFields).map(toSchemaQueryField)
}

function toSchemaTableField(field: Record<string, unknown>, actionHandlers: LegacyActionHandlers, rowActions: Array<Record<string, unknown>>, index: number) {
  const dataIndex = String(field.dataIndex || field.key || `column_${index}`)
  const title = String(field.title || field.label || dataIndex)
  const isActionColumn = field.renderType === 'actions' || dataIndex === '__actions' || dataIndex === 'action'
  const schemaField: Record<string, unknown> = {
    title,
    _titleText: title,
    dataIndex: isActionColumn ? '__actions' : dataIndex,
    key: isActionColumn ? '__actions' : dataIndex,
    valueType: toSchemaValueType(field.renderType),
    renderer: {
      render: (value: unknown) => <span>{value == null || value === '' ? '-' : String(value)}</span>,
      renderCell: (value: unknown) => <span>{value == null || value === '' ? '-' : String(value)}</span>,
    },
    fieldProps: {},
    formItemProps: {},
    wrapperProps: {
      width: field.width,
    },
  }

  if (field.fixed) {
    schemaField.control = { fixed: field.fixed === true ? 'right' : field.fixed }
  }

  if (isActionColumn) {
    schemaField.renderer = {
      renderCell: (_: unknown, context?: { rawData?: Record<string, unknown> }) => renderRowActions(rowActions, actionHandlers, context?.rawData),
    }
    schemaField.wrapperProps = { width: field.width ?? Math.max(rowActions.length * 72, 120) }
    schemaField.control = { fixed: field.fixed === true || !field.fixed ? 'right' : field.fixed }
  }

  return schemaField
}

export function resolveTableFields(pageSlots: Record<string, unknown>, actionHandlers: LegacyActionHandlers) {
  const tableFields = resolveArray<Record<string, unknown>>(pageSlots.tableColumns)
  const rowActions = resolveArray<Record<string, unknown>>(pageSlots.rowActions).filter((action) => action.visible !== false)
  const hasActionColumn = tableFields.some((field) => field.renderType === 'actions' || field.dataIndex === '__actions')
  const schemaFields = tableFields.map((field, index) => toSchemaTableField(field, actionHandlers, rowActions, index))

  if (rowActions.length === 0 || hasActionColumn) return schemaFields

  return [
    ...schemaFields,
    {
      title: '操作',
      _titleText: '操作',
      dataIndex: '__actions',
      key: '__actions',
      valueType: 'text',
      renderer: {
        renderCell: (_: unknown, context?: { rawData?: Record<string, unknown> }) => renderRowActions(rowActions, actionHandlers, context?.rawData),
        render: () => renderRowActions(rowActions, actionHandlers),
      },
      fieldProps: {},
      formItemProps: {},
      wrapperProps: { width: Math.max(rowActions.length * 72, 120) },
      control: { fixed: 'right' },
    },
  ]
}

function resolveTreeDepth(record: Record<string, unknown> | undefined) {
  const depth = Number(record?.__treeLevel ?? record?.treeLevel ?? record?.level ?? record?.depth ?? 0)
  return Number.isFinite(depth) && depth > 0 ? depth : 0
}

function hasTreeChildren(record: Record<string, unknown> | undefined) {
  return resolveArray(record?.children).length > 0 || resolveArray(record?.items).length > 0
}

function renderTreeTableCell(value: unknown, record?: Record<string, unknown>) {
  const text = value == null || value === '' ? '-' : String(value)
  const depth = resolveTreeDepth(record)

  return (
    <span className="hiui-legacy-tree-cell" data-hiui-legacy-region="tree-cell" style={{ paddingLeft: depth * 20 }}>
      <span className="hiui-legacy-tree-cell__switcher" aria-hidden="true">
        {hasTreeChildren(record) ? '▸' : ''}
      </span>
      <span className="hiui-legacy-tree-cell__text" title={text}>{text}</span>
    </span>
  )
}

export function resolveTreeTableFields(pageSlots: Record<string, unknown>, actionHandlers: LegacyActionHandlers) {
  const schemaFields = resolveTableFields(pageSlots, actionHandlers)
  const treeColumnIndex = schemaFields.findIndex((field) => {
    const dataIndex = String(field.dataIndex || '')
    return dataIndex !== '__actions'
  })

  if (treeColumnIndex < 0) return schemaFields

  return schemaFields.map((field, index) => {
    if (index !== treeColumnIndex) return field

    return {
      ...field,
      renderer: {
        ...(typeof field.renderer === 'object' && field.renderer !== null ? field.renderer : {}),
        renderCell: (value: unknown, context?: { rawData?: Record<string, unknown> }) => renderTreeTableCell(value, context?.rawData),
        render: (value: unknown) => renderTreeTableCell(value),
      },
    }
  })
}

export function resolveTableColumns(pageSlots: Record<string, unknown>, actionHandlers: LegacyActionHandlers) {
  const columns = resolveArray<Record<string, unknown>>(pageSlots.tableColumns)
  const rowActions = resolveArray<Record<string, unknown>>(pageSlots.rowActions).filter((action) => action.visible !== false)
  const hasActionColumn = columns.some((column) => column.renderType === 'actions' || column.dataIndex === '__actions')

  if (rowActions.length === 0 || hasActionColumn) return columns

  return [
    ...columns,
    {
      title: '操作',
      dataIndex: '__actions',
      key: '__actions',
      width: Math.max(rowActions.length * 72, 120),
      fixed: 'right',
      render: (_: unknown, record?: Record<string, unknown>) => renderRowActions(rowActions, actionHandlers, record),
    },
  ]
}

export function renderMetricSection(value: unknown) {
  const metrics = resolveArray<Record<string, unknown>>(value)
  if (metrics.length === 0) return null

  return (
    <div data-hiui-legacy-region="stat-section">
      <StatOverviewGrid
        request={async () => ({
          list: metrics.map((metric, index) => ({
            title: String(metric.name || `指标${index + 1}`),
            value: String(metric.value ?? metric.displayValue ?? metric.valueKey ?? '—'),
          })),
        })}
      />
    </div>
  )
}

export function renderTree(value: unknown) {
  const items = resolveArray<Record<string, unknown>>(value)
  if (items.length === 0) return null

  return (
    <ul className="hiui-legacy-tree" data-hiui-legacy-region="tree">
      {items.map((item, index) => (
        <li key={String(item.key || index)}>
          <span>{String(item.title || item.key || `节点${index + 1}`)}</span>
          {Array.isArray(item.items) && item.items.length > 0 ? renderTree(item.items) : null}
        </li>
      ))}
    </ul>
  )
}
