import { isEqual } from 'lodash-es'
import { getFilteredRowModel, getFacetedUniqueValues } from '@tanstack/react-table'
import type { ColumnFiltersState, TableOptions } from '@tanstack/react-table'
import { Schedular } from '@hi-ui/schema-utils'
import { ensureStateFields, type OnChangeFnCtxType } from '../../utils'
import type { InnerRefType } from '../../ctx'
import type { StaticOptsRefType } from '../../hooks/use-global-static'
import { filterFns } from './filter-fns'

export type FilterOpts = {
  remote?: boolean
  onChange?: (state: ColumnFiltersState, ctx: OnChangeFnCtxType<ColumnFiltersState>) => void
}

type UseFilterOptsCtxType<TData extends AnyObject> = {
  innerRef: InnerRefType<TData>
  staticOptsRef: StaticOptsRefType
}

export function useFilterOpts<TData extends AnyObject>(ctx: UseFilterOptsCtxType<TData>) {
  const { innerRef, staticOptsRef } = ctx
  return getFilterOptions<TData>({ innerRef, staticOptsRef })
}

/**
 * 获取表格筛选配置选项
 */
export function getFilterOptions<TData extends AnyObject>(ctx: UseFilterOptsCtxType<TData>) {
  const { enableFilter, enableRemoteFilter } = ctx.staticOptsRef.current

  if (!enableFilter) return {}

  const onColumnFiltersChange: TableOptions<TData>['onColumnFiltersChange'] = (updater) => {
    const { innerRef } = ctx
    const { table, propsRef } = innerRef.current
    const state = table.getState().columnFilters
    const newState = typeof updater === 'function' ? updater(state) : updater

    // 如果筛选状态没有变化，则不更新
    if (isEqual(state, newState)) return

    // 先更新内部状态
    table.setState((state) => ({ ...state, columnFilters: newState }))
    // 再更新订阅
    innerRef.current.filterState.setValue(newState)

    // 通知外部更新
    const notifyState = ensureStateFields(state, newState, 'value', [])
    propsRef.current.filter?.onChange?.(notifyState, { rawState: newState })

    // 在筛选状态更新后，更新分页状态
    Schedular.nextMicro(() => {
      table.setPageIndex(0) // 恢复到第一页 // 同时触发重渲染
    })
  }

  if (enableRemoteFilter) {
    return {
      manualFiltering: true,
      getFacetedUniqueValues: getFacetedUniqueValues<TData>(),
      onColumnFiltersChange,
      filterFns, // 添加自定义筛选函数
    }
  }

  return {
    manualFiltering: false,
    // 前端筛选，使用 getFilteredRowModel
    getFilteredRowModel: getFilteredRowModel<TData>(),
    getFacetedUniqueValues: getFacetedUniqueValues<TData>(),
    onColumnFiltersChange,
    filterFns, // 添加自定义筛选函数
  }
}
