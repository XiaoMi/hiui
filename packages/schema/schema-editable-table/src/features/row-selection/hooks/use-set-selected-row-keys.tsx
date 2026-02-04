import { useCallback } from 'react'
import { isNil } from 'lodash-es'
import type { InnerRefType } from '../../../ctx'

type SetSelectedRowKeysCtxType<TData extends AnyObject> = {
  innerRef: InnerRefType<TData>
}

type RowKeyType = string | number
type GetRowKeysType = (keys: RowKeyType[]) => RowKeyType[] | null
export type InnerSetSelectedRowKeys = (keys: RowKeyType[] | GetRowKeysType | null) => void

export function useSetSelectedRowKeys<TData extends AnyObject>(
  ctx: SetSelectedRowKeysCtxType<TData>
) {
  const { innerRef } = ctx

  const setSelectedRowKeys: InnerSetSelectedRowKeys = useCallback(
    function setSelectedRowKeys(keys) {
      const { table } = innerRef.current

      // 传入 null 时，清空所有选中的行
      if (keys === null) {
        table.setRowSelection({})
        return
      }

      const nextKeys = Array.isArray(keys)
        ? keys
        : // 如果 keys 是函数，则取出当前选中的全部行的ID
          keys(Object.keys(table.getState().rowSelection))

      // 函数返回 null 也可清空所有选中的行
      if (nextKeys === null) {
        table.setRowSelection({})
        return
      }

      // 只要不是 undefined 或者 null 都认为是有效的
      const validKeys = nextKeys.filter((key) => !isNil(key))
      if (validKeys.length === 0) return

      // 有效的key全部认为要被选中
      const newState = Object.fromEntries(validKeys.map((key) => [key, true]))
      // 设置行选择状态
      table.setRowSelection(newState)
    },
    [innerRef]
  )

  return setSelectedRowKeys
}
