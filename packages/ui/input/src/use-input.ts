import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestCallback } from '@hi-ui/use-latest'
import { setAttrStatus } from '@hi-ui/dom-utils'
import { callAllFuncs } from '@hi-ui/func-utils'
import { format, formatAmount, pure } from './utils'
import { useInputCursor } from './use-input-cursor'

const EXTRA_TYPE = ['text', 'id', 'tel', 'card', 'amount', 'email']
// 需要格式化后校对光标的类型
const RESET_CURSOR_TYPE = ['id', 'tel', 'card']

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
  onKeyDown,
  trimValueOnBlur = false,
  type = 'text',
  clearElementRef,
  inputElementRef,
}: UseInputProps) => {
  // Object.is 避免 trimValueOnBlur 和 点击 clearIcon 触发 2 次相同的 onCHange
  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange, Object.is)

  const { handleChange: formatHandleChange, handleOnKeyDown, position } = useInputCursor({
    inputElementRef,
    value: format(value, type),
  })

  /**
   * 修复值格式化时光标位置问题：https://github.com/XiaoMi/hiui/issues/2438
   */
  const needResetCursorPosition = useMemo(() => {
    return RESET_CURSOR_TYPE.includes(type)
  }, [type])

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

      needResetCursorPosition && formatHandleChange(event)
    },
    [formatHandleChange, needResetCursorPosition, tryChangeValue, type]
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
      onKeyDown: needResetCursorPosition ? callAllFuncs(handleOnKeyDown, onKeyDown) : onKeyDown,
    }
  }, [
    type,
    nativeInputProps,
    value,
    handleChange,
    handleFocus,
    handleBlur,
    needResetCursorPosition,
    handleOnKeyDown,
    onKeyDown,
  ])

  useEffect(() => {
    // 满足以下条件时需要校对光标位置
    if (needResetCursorPosition && inputElementRef.current) {
      inputElementRef.current.selectionStart = position
      inputElementRef.current.selectionEnd = position
    }
  }, [inputElementRef, needResetCursorPosition, position, type])

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
   * 输入框按下时的回调
   */
  onKeyDown?: (evt: React.KeyboardEvent<any>) => void
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
  /**
   * 输入框 ref
   */
  inputElementRef?: any
}

export type useInputReturn = ReturnType<typeof useInput>
