import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { isArray } from '@hi-ui/type-assertion'
import { FilterDataItem } from './types'
import { transformTreeData } from './utils'
import { HiBaseFieldNames } from '@hi-ui/core'

const DEFAULT_DATA = [] as []
const DEFAULT_VALUE = [] as []
const DEFAULT_LABEL = [] as []

export const useFilter = ({
  label: labels = DEFAULT_LABEL,
  data: dataProp = DEFAULT_DATA,
  defaultValue = DEFAULT_VALUE,
  value: valueProp,
  fieldNames,
  onChange,
  ...rest
}: UseFilterProps) => {
  const transformedData = useMemo(() => transformTreeData(dataProp, fieldNames), [dataProp, fieldNames])
  // 选中的级联路径 id 列表
  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

  /**
   * 根据级联路径生成面板数据
   */
  const menusData = useMemo(() => {
    let lastMenu = transformedData
    const menus = [lastMenu]

    const menuPathLength = value.length

    // 遍历 value 依次匹配 当前层的 item，并将 children 加入到面板数据中
    for (let depth = 0; depth < menuPathLength; ++depth) {
      const id = value[depth]
      const foundItem = lastMenu.find((item) => item.id === id)

      if (foundItem && isArray(foundItem.children)) {
        lastMenu = foundItem.children
        menus.push(lastMenu)
      } else {
        break
      }
    }

    return menus
  }, [transformedData, value])

  const menusWithLabel = useMemo(() => {
    return labels.map((label, depth) => {
      return {
        label,
        value: value[depth] ?? '',
        data: menusData[depth] ?? [],
        depth,
      }
    })
  }, [labels, value, menusData])

  const onItemSelect = useCallback(
    (item: FilterDataItem, level: number) => {
      const nextValue = value.slice(0, level)
      nextValue[level] = item.id

      tryChangeValue(nextValue, item)
    },
    [value, tryChangeValue]
  )

  const isSelectId = useCallback(
    (id: React.ReactText, level: number) => {
      const curId = value[level]

      if (curId == null || curId === '') return false

      return value[level] === id
    },
    [value]
  )

  return {
    rootProps: rest,
    selectedIds: value,
    onItemSelect,
    isSelectId,
    menus: menusWithLabel,
  }
}

export interface UseFilterProps {
  /**
   * 	筛选标题列表
   */
  label?: React.ReactText[]
  /**
   * 筛选选项数据
   */
  data?: FilterDataItem[]
  /**
   * 设置 data 中 id, title, disabled, children 对应的 key
   */
  fieldNames?: HiBaseFieldNames
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
  onChange?: (value: React.ReactText[], targetItem: FilterDataItem) => void
}

export type UseFilterReturn = ReturnType<typeof useFilter>
