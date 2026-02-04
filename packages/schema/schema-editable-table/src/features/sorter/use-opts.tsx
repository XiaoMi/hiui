import { getSortedRowModel } from '@tanstack/react-table'
import type { SortingState, TableOptions, SortingColumnDef } from '@tanstack/react-table'
import type { TableSorterProps } from '@hi-ui/table-extensions'
import { ensureStateFields, type OnChangeFnCtxType } from '../../utils'
import type { InnerRefType, PropsRefType } from '../../ctx'
import type { StaticOptsRefType } from '../../hooks/use-global-static'

export type SorterOpts = {
  remote?: boolean
  tooltip?: TableSorterProps['tooltip']
  onChange?: (state: SortingState, ctx: OnChangeFnCtxType<SortingState>) => void
  /**
   * 是否开启多排序
   * @default true
   */
  enableMultiSort?: TableOptions<AnyObject>['enableMultiSort']
  /**
   * 最大多排序列数
   */
  maxMultiSortColCount?: TableOptions<AnyObject>['maxMultiSortColCount']
  /**
   * 如何排序 undefined 值
   * @default 'last' 也就是默认全部排在最后
   */
  sortUndefined?: SortingColumnDef<AnyObject>['sortUndefined']
}

type UseSorterOptsCtxType<TData extends AnyObject> = {
  innerRef: InnerRefType<TData>
  propsRef: PropsRefType<TData>
  staticOptsRef: StaticOptsRefType
}

export function useSorterOpts<TData extends AnyObject>(ctx: UseSorterOptsCtxType<TData>) {
  const { innerRef, propsRef, staticOptsRef } = ctx
  return getSorterOptions({ innerRef, propsRef, staticOptsRef })
}

/**
 * 获取表格排序配置选项
 */
export function getSorterOptions<TData extends AnyObject>(ctx: UseSorterOptsCtxType<TData>) {
  const { enableSorter, enableRemoteSorter } = ctx.staticOptsRef.current

  if (!enableSorter) return {}
  const sorterOpts = ctx.propsRef.current.sorter
  if (!sorterOpts) return {}

  const onSortingChange: TableOptions<TData>['onSortingChange'] = (updater) => {
    const { innerRef } = ctx
    const { table, propsRef } = innerRef.current
    const state = table.getState().sorting
    const newState = typeof updater === 'function' ? updater(state) : updater

    // 先更新内部状态
    table.setState((state) => ({ ...state, sorting: newState }))
    // 再更新订阅
    innerRef.current.sorterState.setValue(newState)

    // 通知外部更新
    const notifyState = ensureStateFields(state, newState, 'desc', undefined)
    propsRef.current.sorter?.onChange?.(notifyState, { rawState: newState })
  }

  if (enableRemoteSorter) {
    return {
      manualSorting: true,
      enableMultiSort: sorterOpts.enableMultiSort,
      maxMultiSortColCount: sorterOpts.maxMultiSortColCount,
      onSortingChange,
    }
  }

  return {
    manualSorting: false,
    enableMultiSort: sorterOpts.enableMultiSort,
    maxMultiSortColCount: sorterOpts.maxMultiSortColCount,
    // 前端排序,使用 getSortedRowModel
    getSortedRowModel: getSortedRowModel(),
    onSortingChange,
  }
}
