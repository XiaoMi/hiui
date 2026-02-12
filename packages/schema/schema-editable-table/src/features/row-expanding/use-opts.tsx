import { getExpandedRowModel } from '@tanstack/react-table'
import type { ExpandedOptions, RowSelectionOptions, TableOptions } from '@tanstack/react-table'
import { StaticOptsRefType } from '../../hooks/use-global-static'

export type ExpandedOpts = {
  // 暂时没有选项，留个占位
}

type UseExpandedOptsCtxType = {
  staticOptsRef: StaticOptsRefType
}

export function useRowExpandedOpts<TData extends AnyObject>(ctx: UseExpandedOptsCtxType) {
  return getRowExpandedOptions<TData>(ctx)
}

/**
 * 获取行展开配置选项
 */
export function getRowExpandedOptions<TData extends AnyObject>(ctx: UseExpandedOptsCtxType) {
  const { enableRowExpanding } = ctx.staticOptsRef.current

  if (!enableRowExpanding) {
    return {
      enableExpanding: false,
      enableSubRowSelection: false,
      getSubRows: undefined,
    } as ExpandedOptions<TData> &
      Pick<RowSelectionOptions<TData>, 'enableSubRowSelection'> &
      Pick<TableOptions<TData>, 'getSubRows'>
  }

  return {
    enableExpanding: true,
    getExpandedRowModel: getExpandedRowModel(),
    // 子行不参与分页，也就是所有的子行都在本页展示
    paginateExpandedRows: false,
  } as ExpandedOptions<TData>
}
