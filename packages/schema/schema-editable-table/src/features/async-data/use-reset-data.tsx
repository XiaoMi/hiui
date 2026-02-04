import { useCallback } from 'react'
import { Schedular } from '@hi-ui/schema-utils'
import type { InnerRefType } from '../../ctx'

export type ResetDataSourceCtxType<TData extends AnyObject> = {
  innerRef: InnerRefType<TData>
}

export type InnerResetDataSourceType = (opts?: ResetDataSourceOpts) => Promise<void>

export type ResetDataSourceOpts = {
  /**
   * 重置状态时，是否强制触发请求，并更新表格数据
   * @desc 默认情况下，只有状态发生变化时才会触发请求
   * @desc 启用后，无论状态是否发生变化，都会触发请求
   */
  forceRequest?: boolean
}

export function useResetDataSource<TData extends AnyObject>(ctx: ResetDataSourceCtxType<TData>) {
  const { innerRef } = ctx

  const resetDataSource: InnerResetDataSourceType = useCallback(
    async function resetDataSource(opts) {
      const { table, globalStaticRef, propsRef } = innerRef.current

      const { enableAsyncData } = globalStaticRef.current
      if (!enableAsyncData) return

      const prevState = table.getState()

      const { filterState, sorterState, paginationState } = innerRef.current

      // 先重置内部订阅
      filterState.setValue((prev) => (prev.length > 0 ? [] : prev))
      sorterState.setValue((prev) => (prev.length > 0 ? [] : prev))
      paginationState.mergeValue({
        pageIndex: 0,
        pageSize: propsRef.current.pagination?.pageSize,
      })
      // 再更新表格状态
      table.setState((state) => ({
        ...state,
        columnFilters: filterState.getValue(),
        sorting: sorterState.getValue(),
        pagination: paginationState.getValue(),
      }))

      // 有任意一个状态变更，均可触发请求(只触发一次)
      // 方式是通过暂存的 prevState 来判断前后是否发生变化
      Schedular.nextMicro(() => {
        if (prevState.pagination.pageIndex !== 0) {
          return table.setPageIndex(paginationState.getValue().pageIndex)
        }

        if (prevState.pagination.pageSize !== propsRef.current.pagination?.pageSize) {
          return table.setPageSize(paginationState.getValue().pageSize)
        }

        if (prevState.columnFilters.length > 0) {
          return table.setColumnFilters(filterState.getValue())
        }

        // 启用强制请求时，无论是否有变化都请求一次
        if (opts?.forceRequest) {
          innerRef.current.globalActionsRef.current.updateDataSource()
        }
      })
    },
    [innerRef]
  )

  return resetDataSource
}
