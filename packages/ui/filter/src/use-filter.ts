import React from 'react'
import { FilterDataItem } from './types'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useSelect } from '@hi-ui/use-check'

const DEFAULT_DATA = [] as []
const allowSelect = (item: any) => !item.disabled

export const useFilter = ({
  data: dataProp = DEFAULT_DATA,
  defaultValue = '',
  value: valueProp,
  onChange,
  showUnderline = false,
  ...rest
}: UseFilterProps) => {
  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

  const [onItemSelect, isSelectedId] = useSelect({
    selectedId: value,
    onSelect: tryChangeValue,
    allowSelect,
  })

  return { rootProps: rest, isSelectedId, onItemSelect, showUnderline }
}

export interface UseFilterProps {
  /**
   * 是否显示下划线
   */
  showUnderline?: boolean
  /**
   * 筛选选项数据
   */
  data?: FilterDataItem[]
  /**
   * 默认选中项的值
   */
  defaultValue?: React.ReactText
  /**
   * 被选中项的值
   */
  value?: React.ReactText
  /**
   * 选择时的回调函数，	value 表示选中项的 ID 集合
   */
  onChange?: (value: React.ReactText) => void
}

export type UseFilterReturn = ReturnType<typeof useFilter>
