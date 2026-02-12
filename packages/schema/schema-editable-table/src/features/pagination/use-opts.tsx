import { useMemo } from 'react'
import { isEqual } from 'lodash-es'
import { getPaginationRowModel } from '@tanstack/react-table'
import type { PaginationOptions, TableOptions } from '@tanstack/react-table'
import type { InnerRefType } from '../../ctx'
import type { StaticOptsRefType } from '../../hooks/use-global-static'
import { resetRowSelectionAfterPaginationChange } from '../row-selection/hooks/use-opts'

type UsePaginationOptsCtxType<TData extends AnyObject = AnyObject> = {
  innerRef: InnerRefType<TData>
  // propsRef: PropsRefType<TData>
  staticOptsRef: StaticOptsRefType
}
type PaginationOptsType<TData extends AnyObject> = PaginationOptions &
  Pick<TableOptions<TData>, 'initialState'>
export function usePaginationOpts<TData extends AnyObject>(ctx: UsePaginationOptsCtxType<TData>) {
  const { innerRef, staticOptsRef } = ctx

  return useMemo(() => {
    return getPaginationOptions({ innerRef, staticOptsRef })
  }, [innerRef, staticOptsRef])
}

export const dftPageSize = 10

/**
 * 获取表格分页配置选项
 */
export function getPaginationOptions<TData extends AnyObject>(
  ctx: UsePaginationOptsCtxType<TData>
): PaginationOptions & Pick<TableOptions<TData>, 'initialState'> {
  const { enablePagination, enableAsyncData, enableRowGrouping } = ctx.staticOptsRef.current

  // 如果没有启用分页功能
  if (!enablePagination) {
    // 但启用了分组功能，则需要提供分页行模型以确保分组数据正确显示
    // 这是因为TanStack Table的行模型执行顺序中，分页模型在分组模型之后
    // 没有分页模型可能导致分组数据无法正确渲染
    if (enableRowGrouping) {
      return {
        manualPagination: false,
        // 提供分页行模型，但不显示分页控件（由外部控制）
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
        initialState: {
          pagination: {
            pageSize: Number.MAX_SAFE_INTEGER,
          },
        },
      } satisfies PaginationOptsType<TData>
    }

    // 既没有分页也没有分组，返回空配置
    return {}
  }

  const onPaginationChange: TableOptions<TData>['onPaginationChange'] = (updater) => {
    const { innerRef } = ctx
    const { table } = innerRef.current
    const state = table.getState().pagination
    const newState = typeof updater === 'function' ? updater(state) : updater

    // 如果分页状态没有变化，则不更新
    if (isEqual(state, newState)) return

    // NOTE 此处修改为先更新订阅，再更新内部状态
    // 原因是识别到，部分显式设置当前页的操作时，若先更新内部状态，可能会导致无法正确识别到页码的变化

    // 先更新订阅
    innerRef.current.paginationState.setValue(newState)
    // 再更新内部状态
    table.setState((state) => ({ ...state, pagination: newState }))

    // 如果开启了后端分页，并且没有配置 preserveSelectedRows，则需要清空选中状态
    resetRowSelectionAfterPaginationChange({ innerRef, state, newState })
  }

  if (enableAsyncData) {
    return {
      manualPagination: true,
      onPaginationChange,
    }
  }

  return {
    manualPagination: false,
    // 前端分页，才使用getPaginationRowModel
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange,
  } satisfies PaginationOptions
}
