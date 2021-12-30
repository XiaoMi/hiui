import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

import { HiBaseHTMLFieldProps } from '@hi-ui/core'
import { useInput, UseInputProps } from './use-input'
import { useLatestCallback } from '@hi-ui/use-latest'

const _prefix = getPrefixCls('input')

/**
 * TODO: What is TextArea
 */
export const TextArea = forwardRef<HTMLTextAreaElement | null, TextAreaProps>(
  (
    {
      prefixCls = _prefix,
      className,
      style,
      size = 'md',
      appearance = 'outline',
      invalid = false,
      // use-input
      name,
      autoFocus,
      disabled,
      readOnly,
      maxLength,
      placeholder,
      defaultValue,
      value: valueProp,
      onChange,
      onFocus,
      onBlur,
      trimValueOnBlur,
      ...nativeProps
    },
    ref
  ) => {
    const proxyOnChange = useLatestCallback((_, evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(evt)
    })

    const { focused, getInputProps } = useInput({
      name,
      autoFocus,
      disabled,
      readOnly,
      maxLength,
      placeholder,
      defaultValue,
      value: valueProp,
      onChange: proxyOnChange,
      onFocus,
      onBlur,
      trimValueOnBlur,
    })

    const cls = cx(
      prefixCls,
      className,
      disabled && 'disabled',
      readOnly && 'readonly',
      focused && `focused`,
      invalid && 'invalid',
      `${prefixCls}--appearance-${appearance}`,
      `${prefixCls}--size-${size}`
    )

    return (
      <textarea
        ref={ref}
        className={cls}
        autoComplete="off"
        {...getInputProps()}
        {...nativeProps}
      />
    )
  }
)

export interface TextAreaProps
  extends HiBaseHTMLFieldProps<'textarea'>,
    Omit<UseInputProps, 'onFocus' | 'onBlur' | 'onChange'> {
  /**
   * 设置输入框尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 设置展现形式
   * 其中 `underline` 内部使用，不对外提供支持（风格去线型化：由线性过渡到面性）
   */
  appearance?: 'outline' | 'unset' | 'filled' | 'underline'
  /**
   * 是否聚焦
   */
  focused?: boolean
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

if (__DEV__) {
  TextArea.displayName = 'TextArea'
}
