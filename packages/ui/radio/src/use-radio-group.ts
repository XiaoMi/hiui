import React, { useCallback } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

export const useRadioGroup = ({
  name,
  value: valueProp,
  onChange,
  defaultValue = '',
  disabled = false,
  ...rest
}: UseRadioGroupProps) => {
  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

  const handleChange = useCallback(
    (value: React.ReactText) => {
      if (disabled) {
        return
      }

      tryChangeValue(value)
    },
    [disabled, tryChangeValue]
  )

  const isChecked = useCallback((valueArg: React.ReactText) => valueArg === value, [value])

  const rootProps = {
    ...rest,
    role: 'radiogroup',
  }

  return { rootProps, value, onChange: handleChange, name, isChecked, disabled }
}

export interface UseRadioGroupProps {
  /**
   * `RadioGroup` 下透传给所有 Radio 的 name 属性
   */
  name?: string
  /**
   * 选中项的值（受控）
   */
  value?: React.ReactText

  /**
   * 默认选中项的值
   */
  defaultValue?: React.ReactText
  /**
   * 选中态改变时的回调
   */
  onChange?: (value: React.ReactText) => void
  /**
   * 是否禁用
   */
  disabled?: boolean
}

export type RadioGroupType = 'default' | 'button'
export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>
