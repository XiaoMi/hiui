import React from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useSelect as useSelectDefault } from '@hi-ui/use-check'
import { FlattedSelectItem, SelectItemEventData, SelectItemRequiredProps } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'

const NOOP_VALUE = ''

const allowSelect = (option: any) => !option.disabled

export const useSelect = ({
  disabled = false,
  value: valueProp,
  defaultValue = NOOP_VALUE,
  onChange: onChangeProp,
  onSelect: onSelectProp,
  ...rest
}: UseSelectProps) => {
  const [value, tryChangeValue] = useUncontrolledState(
    defaultValue,
    valueProp,
    onChangeProp,
    Object.is
  )

  const [onSelect, isSelectedId] = useSelectDefault({
    disabled,
    allowSelect,
    selectedId: value,
    onSelect: (value: React.ReactText, item: SelectItemEventData) => {
      tryChangeValue(value, item)
      onSelectProp?.(value, item)
    },
  })

  const getRequiredProps = useLatestCallback(
    (id: React.ReactText): SelectItemRequiredProps => {
      return {
        selected: isSelectedId(id),
        focused: false,
      }
    }
  )

  const getSelectItemEventData = useLatestCallback((node: FlattedSelectItem) => {
    const event = {
      ...node,
      ...getRequiredProps(node.id),
    }

    // 数据污染清理
    delete event.depth
    return event
  })

  const rootProps = rest

  return {
    rootProps,
    value,
    tryChangeValue,
    onSelect,
    isSelectedId,
    getRequiredProps,
    getSelectItemEventData,
  }
}

export interface UseSelectProps {
  /**
   * 设置当前选中值
   */
  value?: React.ReactText
  /**
   * 设置当前选中值默认值
   */
  defaultValue?: React.ReactText
  /**
   * 选中值改变时的回调
   */
  onChange?: (selectedId: React.ReactText, changedItem: SelectItemEventData) => void
  /**
   * 选中值时回调
   */
  onSelect?: (value: React.ReactText, targetOption: SelectItemEventData) => void
  /**
   * 是否禁止使用
   */
  disabled?: boolean
}

export type UseSelectReturn = ReturnType<typeof useSelect>
