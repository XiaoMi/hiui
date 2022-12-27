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

  // 已选中的行数据集合
  const checkedRowDataItemsRef = React.useRef<Record<string, any>[]>([])
  const checkedRowDataItems = checkedRowDataItemsRef.current

  // TODO: 暂时不支持正反选
  const [handleCheckedRowKeysChange, isCheckedRowKey] = useCheck({
    checkedIds: checkedRowKeys,
    onCheck(checkedRowKeys: any, rowItem: Record<string, any>, checked: boolean) {
      trySetCheckedRowKeys(checkedRowKeys, rowItem, checked, checkedRowDataItemsRef.current)
    },
    idFieldName: fieldKey,
  })

  // 选中项变化会触发该函数
  const onCheckedRowKeysChange = React.useCallback(
    (rowItem: Record<string, any>, checked: boolean) => {
      // 记录选中的行数据集合
      const nextCheckedDataItems = checkedRowDataItems

      if (checked) {
        if (!nextCheckedDataItems.find((item) => item[fieldKey] === rowItem[fieldKey])) {
          checkedRowDataItemsRef.current = nextCheckedDataItems.concat(rowItem)
        }
      } else {
        checkedRowDataItemsRef.current = nextCheckedDataItems.filter(
          (item) => item[fieldKey] !== rowItem[fieldKey]
        )
      }

      handleCheckedRowKeysChange(rowItem, checked)
    },
    [checkedRowDataItems, fieldKey, handleCheckedRowKeysChange]
  )

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
    const targetRowItems = targetItems.map((item: any) => item.raw)
    const checkedRowKeysSet = new Set(checkedRowKeys)

    if (checkedAll) {
      // 移除当前页所有行 ids
      trySetCheckedRowKeys(
        (prev) => prev.filter((id) => !checkedRowKeysSet.has(id)),
        targetRowItems,
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
      targetRowItems,
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
