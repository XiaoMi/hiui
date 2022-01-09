import { useCheck } from '@hi-ui/use-check'
import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { FlattedTableRowData, TableRowSelection } from '../types'

const DEFAULT_CHECKED_ROW_KEYS = [] as any[]

export const useTableCheck = ({
  rowSelection,
  flattedData,
}: {
  rowSelection: TableRowSelection | undefined
  flattedData: FlattedTableRowData[]
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
  })

  // 判断是否全选
  const [checkedAll, semiChecked] = React.useMemo(() => {
    if (rowSelection) {
      if (flattedData.length === 0 || checkedRowKeys.length === 0) {
        return [false, false]
      }

      const checkedAll = flattedData
        .filter((item) => !checkRowIsDisabledCheckbox(item.raw))
        // TODO: 数组项完全匹配工具函数
        .every((item) => isCheckedRowKey(item.id))

      return [checkedAll, checkedAll ? false : checkedRowKeys.length > 0]
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
    if (checkedAll) {
      trySetCheckedRowKeys([] as any, [], false)
      return
    }

    const targetItems = flattedData.filter((item: any) => !checkRowIsDisabledCheckbox(item.raw))
    const checkedRowKeys = targetItems.map((item: any) => item.id)

    trySetCheckedRowKeys(checkedRowKeys, targetItems, true)
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
