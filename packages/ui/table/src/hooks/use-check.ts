import { useCheck } from '@hi-ui/use-check'
import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { FlattedTableRowData, TableRowSelection } from '../types'

const DEFAULT_CHECKED_ROW_KEYS = [] as any[]

export const useTableCheck = ({
  rowSelection,
  flattedData,
  fieldKey,
}: {
  rowSelection: TableRowSelection | undefined
  flattedData: FlattedTableRowData[]
  fieldKey: string
}) => {
  const checkRowIsDisabledCheckbox = React.useCallback(
    (rowItem: any) => {
      const checkboxConfig =
        rowSelection && rowSelection.getCheckboxConfig && rowSelection.getCheckboxConfig(rowItem)

      return (checkboxConfig && checkboxConfig.disabled) || false
    },
    [rowSelection]
  )

  const [checkedRowKeys, trySetCheckedRowKeys] = useUncontrolledState(
    DEFAULT_CHECKED_ROW_KEYS,
    rowSelection?.selectedRowKeys,
    rowSelection?.onChange
  )

  // TODO: 暂时不支持正反选
  const [onCheckedRowKeysChange, isCheckedRowKey] = useCheck({
    checkedIds: checkedRowKeys,
    onCheck: trySetCheckedRowKeys as any,
    idFieldName: fieldKey,
  })

  // 判断是否全选
  const [checkedAll, semiChecked] = React.useMemo(() => {
    if (rowSelection) {
      if (flattedData.length === 0 || checkedRowKeys.length === 0) {
        return [false, false]
      }

      const idsCanBeChecked = flattedData
        .filter((item) => !checkRowIsDisabledCheckbox(item.raw))
        .map((item) => item.id)

      // TODO: 数组项完全匹配工具函数
      const checkedAll = idsCanBeChecked.every((id) => isCheckedRowKey(id))

      const semiChecked = checkedAll
        ? false
        : checkedRowKeys.length > 0 && idsCanBeChecked.some((id) => isCheckedRowKey(id))

      return [checkedAll, semiChecked]
    }

    return [false, false]
  }, [
    flattedData,
    rowSelection,
    isCheckedRowKey,
    checkedRowKeys.length,
    checkRowIsDisabledCheckbox,
  ])

  const tryCheckAllRow = React.useCallback(() => {
    const targetItems = flattedData.filter((item: any) => !checkRowIsDisabledCheckbox(item.raw))
    const checkedRowKeys = targetItems.map((item: any) => item.id)
    const checkedRowKeysSet = new Set(checkedRowKeys)

    if (checkedAll) {
      // 移除当前页所有行 ids
      trySetCheckedRowKeys(
        (prev) => prev.filter((id) => !checkedRowKeysSet.has(id)),
        targetItems,
        false
      )
      return
    }

    trySetCheckedRowKeys(
      // 添加当前页所有行 ids
      (prev) => {
        prev.forEach((id) => checkedRowKeysSet.add(id))
        return Array.from(checkedRowKeysSet)
      },
      targetItems,
      true
    )
  }, [trySetCheckedRowKeys, flattedData, checkRowIsDisabledCheckbox, checkedAll])

  return {
    tryCheckAllRow,
    checkedAll,
    semiChecked,
    onCheckedRowKeysChange,
    isCheckedRowKey,
    checkedRowKeys,
    trySetCheckedRowKeys,
    checkRowIsDisabledCheckbox,
  }
}
