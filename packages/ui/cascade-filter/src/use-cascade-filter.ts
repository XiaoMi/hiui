import React, { useCallback } from 'react'
import {
  CascadeFilterDataItem,
  CascadeFilterEventDataItem,
  FlattedCascadeFilterDataItem,
} from './types'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { flattenTreeData, getActiveNodePaths } from './utils'
import { useSelect } from './hooks'

const NOOP_ARRAY = [] as []
const DEFAULT_VALUE = [] as []

export const useCascadeFilter = ({
  data: dataProp = NOOP_ARRAY,
  defaultValue = DEFAULT_VALUE,
  value: valueProp,
  onChange,
  ...rest
}: UseCascadeFilterProps) => {
  // const flattedData = React.useMemo(() => flattenTreeData(dataProp), [dataProp])

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

  // const proxyTryChangeValue = useCallback(
  //   (
  //     value: React.ReactText,
  //     item: CascadeFilterEventDataItem,
  //     itemPaths: FlattedCascadeFilterDataItem[]
  //   ) => {
  //     tryChangeValue(value, item, itemPaths)
  //   },
  //   [tryChangeValue, onSelect]
  // )

  // // 单击选中某项
  // const [selectedId, onOptionSelect, setSelectedId] = useSelect(proxyTryChangeValue)

  // // 选中 id 路径
  // const selectedIds = React.useMemo(
  //   () => getActiveNodePaths(flattedData, selectedId).map(({ id }) => id),
  //   [flattedData, selectedId]
  // )

  const onItemSelect = useCallback(
    (item: CascadeFilterDataItem, level: number) => {
      const nextValue = [...value]
      nextValue[level] = item.id

      tryChangeValue(nextValue)
    },
    [value, tryChangeValue]
  )

  const isSelectId = useCallback(
    (id, level) => {
      const curId = value[level]

      if (curId == null || curId === '') return false

      return value[level] === id
    },
    [value]
  )

  return { rootProps: rest, onItemSelect, isSelectId, data: dataProp, selectedIds: value }
}

export interface UseCascadeFilterProps {
  /**
   * 筛选选项数据
   */
  data?: CascadeFilterDataItem[]
  /**
   * 默认选中项的值
   */
  defaultValue?: React.ReactText[]
  /**
   * 被选中项的值
   */
  value?: React.ReactText[]
  /**
   * 选择时的回调函数，	value 表示选中项的 ID 集合
   */
  onChange?: (value: React.ReactText[]) => void
}

export type UseCascadeFilterReturn = ReturnType<typeof useCascadeFilter>
