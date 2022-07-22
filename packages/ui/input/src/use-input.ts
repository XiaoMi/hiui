import React, { useCallback, useMemo, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestCallback } from '@hi-ui/use-latest'
import { setAttrStatus } from '@hi-ui/dom-utils'
import { format, formatAmount, pure } from './utils'

const EXTRA_TYPE = ['text', 'id', 'tel', 'card', 'amount', 'email']

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
  type = 'text',
  clearElementRef,
}: UseInputProps) => {
  // Object.is 避免 trimValueOnBlur 和 点击 clearIcon 触发 2 次相同的 onCHange
  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange, Object.is)

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, trim = false) => {
      evt.persist()

      const nextValue = evt.target.value
      let valueTrue = pure(nextValue, type)

      // 防溢出，保证 onChange 拿到的是值是最新的 formatted value
      let value = format(nextValue, type)

      if (trim) {
        valueTrue = valueTrue.trim()
        value = value.trim()
      }

      const event = Object.create(evt)
      event.target = { ...evt.target, value }

      tryChangeValue(valueTrue, event)
    },
    [tryChangeValue, type]
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
      const relatedTarget = event.relatedTarget

      // 拦截 clearIcon 点击清空，阻止其触发 input 失焦
      if (clearElementRef && clearElementRef.current && clearElementRef.current === relatedTarget) {
        return
      }

      setFocused(false)

      // amount 自动添加小数
      if (type === 'amount') {
        event.target.value = formatAmount(value, true)
        handleChange(event, trimValueOnBlur)
      } else if (trimValueOnBlur) {
        handleChange(event, true)
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
    const nativeType = EXTRA_TYPE.includes(type) ? undefined : type

    return {
      ...nativeInputProps,
      value: format(value, type),
      type: nativeType,
      onChange: handleChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
    }
  }, [value, type, handleChange, handleFocus, handleBlur, nativeInputProps])

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
   * 在失焦时触发对值的 trim 并触发 onChange 回调
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
  /**
   * 设置输入框类型，支持原生 input 的 type 属性所有值
   */
  type?: 'text' | 'id' | 'tel' | 'card' | 'amount' | 'email' | string
  /** 。暂不对外暴露
   * @private
   */
  clearElementRef?: any
}

export type useInputReturn = ReturnType<typeof useInput>
