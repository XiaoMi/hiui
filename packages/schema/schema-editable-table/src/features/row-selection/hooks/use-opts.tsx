import { useMount } from 'ahooks'
import { isEqual } from 'lodash-es'
import type { PaginationState, TableOptions } from '@tanstack/react-table'
import type { InnerRefType } from '../../../ctx'
import type { RowSelectionOptsType } from '../index'

type UseRowSelectionOptsCtxType<TData extends AnyObject> = {
  rowSelection: RowSelectionOptsType<TData> | undefined
  innerRef: InnerRefType<TData>
}

export function useRowSelectionOpts<TData extends AnyObject>(
  ctx: UseRowSelectionOptsCtxType<TData>
) {
  const { rowSelection, innerRef } = ctx

  // 挂载时将默认选中的行同步至内部状态
  useMount(() => {
    if (rowSelection?.dftSelectedRowKeys) {
      const { globalActionsRef } = innerRef.current
      const keys = rowSelection.dftSelectedRowKeys as string[]
      globalActionsRef.current.setSelectedRowKeys(keys)
    }
  })

  return {
    // 启用行选择
    enableRowSelection: rowSelection?.enableRowSelection
      ? function enableRowSelection(row) {
          const tableValue = innerRef.current.subscription
          const rowData = tableValue.getValue()[row.index]
          return rowSelection?.enableRowSelection?.(rowData, { row })
        }
      : true,
    // 启用子行选择
    enableSubRowSelection: rowSelection?.enableSubRowSelection
      ? function enableSubRowSelection(row) {
          const tableValue = innerRef.current.subscription
          const rowData = tableValue.getValue()[row.index]
          return rowSelection?.enableSubRowSelection?.(rowData, { row })
        }
      : true,
    // 单选模式下只允许选择一行
    enableMultiRowSelection: rowSelection?.type !== 'radio',
    // 选中状态变化时触发onChange
    onRowSelectionChange: (updater) => {
      if (!rowSelection) return
      const { table, rowSelectionState } = innerRef.current

      const state = table.getState().rowSelection
      const newState = typeof updater === 'function' ? updater(state) : updater
      // 如果行选择状态没有变化，则不更新
      if (isEqual(state, newState)) return

      // 先同步到订阅上
      const preState = rowSelectionState.getValue()
      // #region generate next state
      const nextState: typeof preState = {}
      // 请勿感到迷惑，此处把 preState 的 key 全部拿出来设置一遍值
      // 是因为取消选择时 newState 里是一个空对象，而不是 {[key]: false}，会导致状态丢失
      for (const key in preState) {
        nextState[key] = !!newState[key]
      }
      // 这里则是再加一步保险，确保 newState 的 key 全部设置一遍值
      // 其实不加也无所谓，因为 newState 的 key 是来自 preState 的
      for (const key in newState) {
        nextState[key] = !!newState[key]
      }
      // #endregion
      rowSelectionState.mergeValue(nextState)

      // 构造数据回传给外部
      const { selectedRows, selectedRowKeys, selectedRowEntries } = table.$getRowSelection(newState)
      // 更新选中行原始数据的缓存，内部会做判断，仅在启用 preserveSelectedRows 时才更新
      table.$updateSelectedRowsCache(selectedRowEntries)

      // 最后再更新内部状态 // 最后再触发重渲染
      table.setState((state) => ({ ...state, rowSelection: newState }))

      rowSelection.onChange?.({ keys: selectedRowKeys, rows: selectedRows })
    },
  } as Pick<
    TableOptions<TData>,
    | 'enableRowSelection'
    | 'enableMultiRowSelection'
    | 'onRowSelectionChange'
    | 'enableSubRowSelection'
  >
}

/** 如果开启了后端分页，并且没有配置 preserveSelectedRows，则需要在分页变化时清空选中状态 */
export function resetRowSelectionAfterPaginationChange<TData extends AnyObject>(ctx: {
  innerRef: InnerRefType<TData>
  state: PaginationState
  newState: PaginationState
}) {
  const { globalStaticRef } = ctx.innerRef.current
  const { enableAsyncData } = globalStaticRef.current

  // 如果开启了后端分页，并且没有配置preserveSelectedRows，则需要清空选中状态
  if (enableAsyncData) {
    const { propsRef } = ctx.innerRef.current

    const preserveSelectedRows = propsRef.current.rowSelection?.preserveSelectedRows

    // 并且没有配置 preserveSelectedRows
    if (!preserveSelectedRows) {
      // 并且页数发生变化
      const { state, newState } = ctx
      const hasPageIndexChanged = state.pageIndex !== newState.pageIndex

      // 则清空选中状态
      if (hasPageIndexChanged) {
        const { table } = ctx.innerRef.current

        table.setRowSelection({})
      }
    }
  }
}
