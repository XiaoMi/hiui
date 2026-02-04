import React from 'react'
import type { HeaderContext } from '@tanstack/react-table'
import type { FieldConfigType } from '@hi-ui/schema-core'
import type { GlobalStaticRefType } from '../../ctx'
import { TableFilterBridge } from '../filter'
import { TableSorterBridge } from '../sorter'

type GetHeaderActionsCtxType<TData extends AnyObject> = Pick<
  HeaderContext<TData, unknown>,
  'column' | 'table'
> & {
  field: FieldConfigType
  globalStaticRef: GlobalStaticRefType<TData>
}

export function getHeaderActions<TData extends AnyObject>(props: GetHeaderActionsCtxType<TData>) {
  const { column, field, globalStaticRef } = props
  const filterConfig = props.column.columnDef.meta?.filter
  const sorterConfig = props.column.columnDef.meta?.sorter

  // filterConfig 已经在 columnDef 中转换为对象，此处仅作类型收窄
  // 简而言之 filterConfig 实际为 FieldFilterConfigType | true | undefined
  if (typeof filterConfig === 'boolean') return null
  // 简而言之 sorterConfig 实际为 FieldSorterConfigType | true | undefined
  if (typeof sorterConfig === 'boolean') return null

  // 筛选器
  const enableFilter = globalStaticRef.current.enableFilter // 指全局开启了过滤器
  const filterAvailable = enableFilter && !!filterConfig // 指当前字段的过滤器可用
  const filterEl = filterAvailable ? (
    <TableFilterBridge key="filter" field={field} column={column} filter={filterConfig} />
  ) : null

  // 排序器
  const enableSorter = globalStaticRef.current.enableSorter && !!field.control?.sorter
  const sorterAvailable = enableSorter && !!sorterConfig
  const sorterEl = sorterAvailable ? (
    <TableSorterBridge key="sorter" field={field} column={column} sorter={sorterConfig} />
  ) : null

  // 自定义的 actions
  const actions = field.extra?.headerActions?.({
    field,
    builtin: {
      sorter: sorterEl,
      filter: filterEl,
    },
    table: props.table,
    column: props.column,
  }) || [sorterEl, filterEl]

  return {
    filterAvailable,
    sorterAvailable,
    elements: actions.filter(Boolean),
  }
}
