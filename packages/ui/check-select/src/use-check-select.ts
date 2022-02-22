import React, { useCallback, useRef } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import uniqBy from 'lodash/uniqBy'
import { useCheck as useCheckDefault } from '@hi-ui/use-check'
import { CheckSelectDataItem, CheckSelectEventData } from './types'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { useFlattenData, useData } from './hooks'
import { HiBaseFieldNames } from '@hi-ui/core'

const NOOP_ARRAY = [] as []
const NOOP_VALUE = [] as []

export const useCheckSelect = ({
  data: dataProp = NOOP_ARRAY,
  children,
  disabled = false,
  value: valueProp,
  defaultValue = NOOP_VALUE,
  onChange: onChangeProp,
  onSelect,
  fieldNames,
  ...rest
}: UseCheckSelectProps) => {
  const data = useData({ data: dataProp, children })
  const flattedData = useFlattenData({ data, fieldNames })
  const flattedDataRef = useLatestRef(flattedData)

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const onSelectLatest = useLatestCallback(onSelect)

  const selectedItemsRef = useRef<any[]>([])

  const proxyTryChangeValue = useCallback(
    (
      value: React.ReactText[],
      item: CheckSelectEventData | CheckSelectEventData[],
      shouldChecked: boolean
    ) => {
      let changedItems = item as CheckSelectEventData[]

      if (!Array.isArray(item)) {
        changedItems = [item]

        if (shouldChecked) {
          selectedItemsRef.current.push(item)
        }
        onSelectLatest(value, item, shouldChecked)
      }

      const selectedItems = uniqBy(
        [...changedItems, ...selectedItemsRef.current, ...flattedDataRef.current],
        'id'
      )

      // 调用用户的select
      const checkedItems = selectedItems
        // 使用最新的value
        .filter((item) => value.includes(item.id))
        .map((item) => ('raw' in item ? item.raw : item))

      tryChangeValue(
        value,
        // TODO: 处理脏数据
        changedItems.map((item) => ('raw' in item ? item.raw : item)),
        checkedItems
      )
    },
    [tryChangeValue, onSelectLatest, flattedDataRef, selectedItemsRef]
  )

  const [onOptionCheck, isCheckedId] = useCheckDefault({
    disabled,
    checkedIds: value,
    onCheck: proxyTryChangeValue,
    allowCheck,
  })

  return {
    rootProps: rest,
    data,
    flattedData,
    value,
    tryChangeValue: proxyTryChangeValue,
    onSelect: onOptionCheck,
    isCheckedId,
  }
}

export interface UseCheckSelectProps {
  /**
   * 设置当前选中值
   */
  value?: React.ReactText[]
  /**
   * 设置当前选中值默认值
   */
  defaultValue?: React.ReactText[]
  /**
   * 选中值改变时的回调
   * value: 所有选中项的 id 集合
   * changedItems: 变更的选项集合
   * checkedItems：所有选中项的选项集合
   */
  onChange?: (
    value: React.ReactText[],
    changedItems?: CheckSelectDataItem[],
    checkedItems?: CheckSelectDataItem[]
  ) => void
  /**
   * 选中值时回调。暂不对外暴露
   * @private
   */
  onSelect?: (
    value: React.ReactText[],
    targetOption: CheckSelectEventData,
    shouldChecked: boolean
  ) => void
  /**
   * 是否禁止使用
   */
  disabled?: boolean
  /**
   * 选项数据
   */
  data?: CheckSelectDataItem[]
  /**
   * JSX 子节点
   */
  children?: React.ReactNode
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key
   */
  fieldNames?: HiBaseFieldNames
}

export type UseSelectReturn = ReturnType<typeof useCheckSelect>

const allowCheck = (option: any) => !option.disabled
