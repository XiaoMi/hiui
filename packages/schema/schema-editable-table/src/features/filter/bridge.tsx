import React, { useEffect } from 'react'
import type { HeaderContext } from '@tanstack/react-table'
import { TableFilter } from '@hi-ui/table-extensions'
import { mergeProps, rawToItems, type RawItemType } from '@hi-ui/schema-utils'
import type { FieldConfigType, FieldFilterConfigType } from '@hi-ui/schema-core'
import type { FilterValueType, SelectFilterOptions } from '@hi-ui/table-extensions'
import { useEditableSchemaTableCtx, type EditTableCtxType } from '../../ctx'

type TableFilterBridgeProps<TData extends AnyObject> = {
  column: HeaderContext<TData, unknown>['column']
  field: FieldConfigType
  filter?: FieldFilterConfigType
}

// HeaderCell 中不便集成大量的过滤器逻辑，集中在此处处理桥接逻辑
export function TableFilterBridge<TData extends AnyObject>(props: TableFilterBridgeProps<TData>) {
  const { column, filter: filterConfig } = props
  const { table } = useEditableSchemaTableCtx()

  const [filters, setFilters] = React.useState<FilterValueType>([])

  // 外部主动设置时自动更新至内部
  const filterValue = column.getFilterValue()
  useEffect(() => {
    if (filterValue) {
      const nextValue = Array.isArray(filterValue) ? filterValue : [filterValue]
      setFilters(nextValue)
    } else setFilters([])
  }, [filterValue])

  const handleChange = (filters: FilterValueType = []) => {
    setFilters(filters ?? [])
    column.setFilterValue(filters)
  }

  const filterType = filterConfig?.type || 'text'
  // 仅在 type 为 select 时，此处才有效
  const options = getSelectOptions({ type: filterType, table, column, filterConfig })
  const popoverProps = mergeProps(props.field.extra?.popperProps, filterConfig?.popoverProps)
  return (
    <TableFilter
      // 这里实际上是一段魔法代码
      // TableFilter 支持按类型传入不同的 props
      // 但此处若根据类型做精确传入判断，会使代码变得很多
      // 读到这里时，请不要觉得困惑 😊
      {...filterConfig?.extraProps}
      type={filterType as 'select'}
      options={options as SelectFilterOptions}
      value={filters}
      onChange={handleChange}
      overlay={filterConfig?.custom as undefined}
      popoverProps={popoverProps}
    />
  )
}

type GetSelectOptionsCtx = {
  type: FieldFilterConfigType['type']
  table: EditTableCtxType['table']
  column: HeaderContext<AnyType, unknown>['column']
  filterConfig?: FieldFilterConfigType
}

function getSelectOptions(ctx: GetSelectOptionsCtx) {
  const { type, table, column, filterConfig } = ctx

  if (type !== 'select') return []

  // 如果用户没有传入自定义的异步选项函数
  // 则使用表格上下文自动生成选项信息
  const syncOptsRef = { current: null as unknown as RawItemType<string>[] }

  // 如果用户传入了自定义的异步选项函数
  // 则在此处包装表格上下文的选项信息
  if (filterConfig?.options) {
    const getOpts = filterConfig.options
    return function getAsyncOptsFromTableFilterBridge(keyword?: string) {
      const filterValue = column.getFilterValue()
      const allFilters = table.getState().columnFilters

      const asyncOpts = getOpts({ keyword, filterValue, allFilters, autoGenerateOpts })

      if (Array.isArray(asyncOpts)) return Promise.resolve(asyncOpts)
      else return asyncOpts
    }
  }

  function autoGenerateOpts() {
    // 有旧值时，直接返回旧值
    // 也就是说，下次挂载时，会重新执行 (因为选型隐藏时，会将筛选器卸载)
    if (syncOptsRef.current) return syncOptsRef.current

    const map = column.getFacetedUniqueValues()
    const opts = rawToItems(Array.from(map.keys()) as string[])

    syncOptsRef.current = opts
    return opts
  }
  autoGenerateOpts.syncOpts = true

  return autoGenerateOpts
}
