import React, { useCallback, useRef, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { uniqBy } from '@hi-ui/array-utils'
import { useCheck as useCheckDefault } from '@hi-ui/use-check'
import { CheckSelectDataItem, CheckSelectItemEventData, CheckSelectMergedItem } from './types'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { useCache } from '@hi-ui/use-cache'
import { useFlattenData, useData } from './hooks'

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
  const [cacheData, setCacheData] = useCache<any[]>(data)
  const flattedData = useFlattenData({ data: cacheData, fieldNames })
  const flattedDataRef = useLatestRef(flattedData)

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const onSelectLatest = useLatestCallback(onSelect)

  const usedItemsRef = useRef<any[]>([])
  // 扁平化的选中数据，可能包括异步临时选中缓存数据
  const [checkedItems, setCheckedItems] = useState<CheckSelectItemEventData[]>([])

  /**
   * 更新缓存的 data 数据
   * 兼容在搜索异步加载结果的场景时，将选中的项加入到 cacheData 数据中，这样再次打开下拉框时可以显示之前选中的值
   */
  const updateCacheData = useCallback(
    (nextCheckedItems: any[]) => {
      const newData = [...cacheData]

      nextCheckedItems.forEach((item) => {
        if (!flattedData.find((dataItem) => dataItem.id === item.id)) {
          newData.push('raw' in item ? item.raw : item)
        }
      })

      setCacheData(newData)
    },
    [cacheData, flattedData, setCacheData]
  )

  const proxyTryChangeValue = useCallback(
    (
      value: React.ReactText[],
      item: CheckSelectItemEventData | CheckSelectItemEventData[],
      shouldChecked: boolean
    ) => {
      let changedItems = item as CheckSelectItemEventData[]

      if (!Array.isArray(item)) {
        changedItems = [item]

        onSelectLatest(value, item, shouldChecked)
      }

      const usedItems = uniqBy(
        [...changedItems, ...usedItemsRef.current, ...flattedDataRef.current],
        'id'
      )

      usedItemsRef.current = usedItems

      // 使用最新的value
      const nextCheckedItems = usedItems.filter((item) => value.includes(item.id))
      setCheckedItems(nextCheckedItems)

      tryChangeValue(
        value,
        // 处理脏数据
        changedItems.map((item) => ('raw' in item ? item.raw : item)),
        nextCheckedItems.map((item) => ('raw' in item ? item.raw : item))
      )

      // 每次更新 value 时，同步更新下 cacheData
      updateCacheData(nextCheckedItems)
    },
    [flattedDataRef, tryChangeValue, updateCacheData, onSelectLatest]
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
    checkedItems,
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
    changedItems: CheckSelectDataItem[],
    checkedItems: CheckSelectDataItem[]
  ) => void
  /**
   * 选中值时回调。暂不对外暴露
   * @private
   */
  onSelect?: (
    value: React.ReactText[],
    targetOption: CheckSelectItemEventData,
    shouldChecked: boolean
  ) => void
  /**
   * 是否禁止使用
   */
  disabled?: boolean
  /**
   * 选项数据
   */
  data?: CheckSelectMergedItem[]
  /**
   * JSX 子节点
   */
  children?: React.ReactNode
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key
   */
  fieldNames?: Record<string, string>
}

export type UseSelectReturn = ReturnType<typeof useCheckSelect>

const allowCheck = (option: any) => !option.disabled
