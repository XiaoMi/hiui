import { useCheck } from '@hi-ui/use-check'
import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { FlattedTableRowData, TableRowSelection } from '../types'

const DEFAULT_CHECKED_ROW_KEYS = [] as any[]

export const useTableCheck = ({
  rowSelection,
  flattedData,
  getRowKeyField,
}: {
  rowSelection: TableRowSelection | undefined
  flattedData: FlattedTableRowData[]
  getRowKeyField: (item: any) => string
}) => {
  const checkRowIsDisabledCheckbox = React.useCallback(
    (rowItem: any) => {
      const checkboxConfig = rowSelection?.getCheckboxConfig?.(rowItem)
      const disabled = checkboxConfig?.disabled ?? false
      return disabled
    },
    [rowSelection]
  )

  const [checkedRowKeys, trySetCheckedRowKeys] = useUncontrolledState(
    DEFAULT_CHECKED_ROW_KEYS,
    rowSelection?.selectedRowKeys,
    rowSelection?.onChange
  )

  // 暂时不支持正反选
  const [onCheckedRowKeysChange, isCheckedRowKey] = useCheck({
    checkedIds: checkedRowKeys,
    onCheck: trySetCheckedRowKeys as any,
    idFieldName: 'id',
  })

  // 判断是否全选
  const [checkedAll, semiChecked] = React.useMemo(() => {
    if (rowSelection) {
      if (flattedData.length === 0 || checkedRowKeys.length === 0) {
        return [false, false]
      }

      // TODO: 对于分页来讲，此处的 flattedData 应该是当前页的数据
      // TODO: flattedTree 处理出来的对象对用户来说应该是无感知的。
      const checkedAll = flattedData
        .filter((item: any) => !checkRowIsDisabledCheckbox(item.raw))
        // TODO: 数组项内容完全匹配工具函数
        .every((item: any) => isCheckedRowKey(getRowKeyField(item.raw)))

      return [checkedAll, checkedAll ? false : checkedRowKeys.length > 0]
    }

    return [false, false]
  }, [
    flattedData,
    rowSelection,
    getRowKeyField,
    checkRowIsDisabledCheckbox,
    isCheckedRowKey,
    checkedRowKeys.length,
  ])

  const tryCheckAllRow = React.useCallback(() => {
    if (checkedAll) {
      trySetCheckedRowKeys([] as any, [], !checkedAll)
      return
    }

    const targetItems = flattedData.filter((item: any) => !checkRowIsDisabledCheckbox(item))
    const checkedRowKeys = targetItems.map((item: any) => getRowKeyField(item.raw))

    trySetCheckedRowKeys(checkedRowKeys, targetItems, !checkedAll)
  }, [trySetCheckedRowKeys, flattedData, checkRowIsDisabledCheckbox, getRowKeyField, checkedAll])

  return {
    tryCheckAllRow,
    checkedAll,
    semiChecked,
    onCheckedRowKeysChange,
    isCheckedRowKey,
    checkedRowKeys,
    trySetCheckedRowKeys,
  }
}
