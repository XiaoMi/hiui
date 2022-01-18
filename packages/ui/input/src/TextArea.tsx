import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

import { HiBaseAppearanceEnum, HiBaseHTMLFieldProps } from '@hi-ui/core'
import { useInput, UseInputProps } from './use-input'
import { useLatestCallback } from '@hi-ui/use-latest'

const _prefix = getPrefixCls('input')

/**
 * 动态文本域输入框
 *
 *  @TODO:
 * 1. 支持带数字展示
 * 2. 支持自适应行高大小
 * 3. 支持清空按钮
 * 4. 支持最大最小行支持
 * 5. 手动聚焦支持额外配置
 */
export const TextArea = forwardRef<HTMLTextAreaElement | null, TextAreaProps>(
  (
    {
      prefixCls = _prefix,
      className,
      style,
      size = 'md',
      appearance = 'line',
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
    Omit<UseInputProps, 'onFocus' | 'onBlur' | 'onChange' | 'type'> {
  /**
   * 设置输入框尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 设置展现形式
   * 其中 `underline` 内部使用，不对外提供支持（风格去线型化：由线性过渡到面性）
   */
  appearance?: HiBaseAppearanceEnum | 'underline'
  /**
   * 值改变时回调
   */
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

if (__DEV__) {
  TextArea.displayName = 'TextArea'
}
