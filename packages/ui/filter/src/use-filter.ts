import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useSelect } from '@hi-ui/use-check'
import { FilterDataItem } from './types'

const allowSelect = (item: FilterDataItem) => !item.disabled

export const useFilter = ({
  defaultValue = '',
  value: valueProp,
  onChange,
  ...rest
}: UseFilterProps) => {
  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange, Object.is)

  const [onItemSelect, isSelectedId] = useSelect({
    selectedId: value,
    onSelect: tryChangeValue,
    allowSelect,
  })

  const rootProps = {
    role: 'radiogroup',
    ...rest,
  }

  return { rootProps, isSelectedId, onItemSelect }
}

export interface UseFilterProps {
  /**
   * 是否显示下划线
   */
  showUnderline?: boolean
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
  onChange?: (value: React.ReactText, targetItem: FilterDataItem) => void
}

export type UseFilterReturn = ReturnType<typeof useFilter>
