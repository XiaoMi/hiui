import { getGroupedRowModel } from '@tanstack/react-table'
import type { GroupingOptions } from '@tanstack/react-table'
import { StaticOptsRefType } from '../../hooks/use-global-static'

export type GroupingOpts = {
  // 暂时没有选项，留个占位
}

type UseGroupedOptsCtxType = {
  staticOptsRef: StaticOptsRefType
}

export function useRowGroupedOpts(ctx: UseGroupedOptsCtxType) {
  return getRowGroupedOptions(ctx)
}

/**
 * 获取列分组配置选项
 */
export function getRowGroupedOptions(ctx: UseGroupedOptsCtxType) {
  const { enableRowGrouping } = ctx.staticOptsRef.current

  if (!enableRowGrouping) {
    return {
      enableGrouping: false,
      onGroupingChange: () => {
        // empty onGroupingChange
        // 起到即使主动设置 grouping 状态，也会被直接忽略的作用
      },
    } as GroupingOptions
  }

  return {
    enableGrouping: true,
    groupedColumnMode: false,
    getGroupedRowModel: getGroupedRowModel(),
    autoResetExpanded: false, // 数据变化时保持分组的展开状态
  } as GroupingOptions
}
