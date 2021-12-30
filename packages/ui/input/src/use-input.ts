import React, { useCallback, useMemo, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestCallback } from '@hi-ui/use-latest'
import { setAttrStatus } from '@hi-ui/dom-utils'

export const useInput = ({
  name,
  autoFocus = false,
  disabled = false,
  readOnly = false,
  maxLength,
  placeholder,
  defaultValue = '',
  value: valueProp,
  onChange,
  onFocus,
  onBlur,
  trimValueOnBlur = false,
}: UseInputProps) => {
  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = evt.target.value
      tryChangeValue(nextValue, evt)
    },
    [tryChangeValue]
  )

  const [focused, setFocused] = useState(autoFocus)

  const handleFocus = useLatestCallback(
    (evt: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(true)
      onFocus?.(evt)
    }
  )

  const handleBlur = useLatestCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFocused(false)

      if (trimValueOnBlur) {
        const nextValue = event.target.value
        tryChangeValue(nextValue.trim(), event)
      }

      onBlur?.(event)
    }
  )

  const nativeInputProps = useMemo(
    () => ({
      name,
      disabled,
      readOnly,
      autoFocus,
      placeholder,
      maxLength,
      'data-focused': setAttrStatus(focused),
    }),
    [disabled, readOnly, autoFocus, placeholder, maxLength, name, focused]
  )

  const getInputProps = useCallback(() => {
    return {
      ...nativeInputProps,
      value,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
    }
  }, [value, handleChange, handleFocus, handleBlur, nativeInputProps])

  return {
    focused,
    value,
    tryChangeValue,
    getInputProps,
  }
}

export interface UseInputProps {
  /**
   * 开启输入框只读
   */
  readOnly?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 开启输入框自动聚焦
   */
  autoFocus?: boolean
  /**
   * 输入框字段名称
   */
  name?: string
  /**
   * 设置输入框的值
   */
  value?: string
  /**
   * 设置输入框的默认值
   */
  defaultValue?: string
  /**
   * 输入最大长度
   */
  maxLength?: number
  /**
   * 再失焦时触发对值的 trim onChange 给用户
   */
  trimValueOnBlur?: boolean
  /**
   * 输入框占位符
   */
  placeholder?: string
  /**
   * 值改变时的回调
   */
  onChange?: (value: string, evt: React.ChangeEvent<any>) => void
  /**
   * 输入框聚焦时的回调
   */
  onFocus?: (evt: React.FocusEvent<any>) => void
  /**
   * 输入框失焦时的回调
   */
  onBlur?: (evt: React.FocusEvent<any>) => void
}

export type useInputReturn = ReturnType<typeof useInput>
