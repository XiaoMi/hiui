import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

import { HiBaseAppearanceEnum, HiBaseHTMLFieldProps } from '@hi-ui/core'
import ResizeDetector from 'react-resize-detector'
import { useTextarea, UseTextareaProps } from './use-textarea'

const _prefix = getPrefixCls('textarea')

/**
 * 动态文本域输入框
 *
 *  @TODO:
 * 1. 支持带数字展示
 * 3. 支持清空按钮
 * 5. 手动聚焦支持额外配置
 */
export const TextArea = forwardRef<HTMLTextAreaElement | null, TextAreaProps>(
  (
    {
      prefixCls = _prefix,
      className,
      size = 'md',
      appearance = 'line',
      suspend,
      invalid = false,
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
      maxRows,
      minRows,
      autoSize: autoSizeProp,
      showCount = false,
      ...rest
    },
    ref
  ) => {
    const { focused, autoSize, value, getTextareaProps, onResize } = useTextarea({
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
      maxRows,
      minRows,
      autoSize: autoSizeProp,
    })

    const dataCount = useMemo(() => {
      if (!showCount) return undefined

      const max = Number(maxLength)
      const valueLength = value.length

      return `${valueLength}${max > 0 ? `/${max}` : ''}`
    }, [showCount, maxLength, value])

    const cls = cx(
      prefixCls,
      className,
      disabled && `${prefixCls}--disabled`,
      readOnly && `${prefixCls}--readonly`,
      focused && `${prefixCls}--focused`,
      invalid && `${prefixCls}--invalid`,
      `${prefixCls}--appearance-${appearance}`,
      `${prefixCls}--size-${size}`
    )

    const textareaNode = (
      <div
        className={cx(
          `${prefixCls}-wrapper`,
          showCount && `${prefixCls}-wrapper--show-count`,
          suspend && `${prefixCls}-wrapper--suspend`
        )}
        data-count={dataCount}
      >
        <textarea {...getTextareaProps(rest, ref)} className={cls} />
        {suspend ? <span className={`${prefixCls}__suspend`}>{suspend}</span> : null}
      </div>
    )

    if (autoSize) {
      return <ResizeDetector onResize={onResize}>{textareaNode}</ResizeDetector>
    }

    return textareaNode
  }
)

export interface TextAreaProps extends HiBaseHTMLFieldProps<'textarea'>, UseTextareaProps {
  /**
   * 设置输入框尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 输入框浮层内容
   */
  suspend?: React.ReactNode
  /**
   * 设置展现形式
   * 其中 `underline` 内部使用，不对外提供支持（风格去线型化：由线性过渡到面性）
   */
  appearance?: HiBaseAppearanceEnum | 'underline'
  /**
   * 是否展示字数
   */
  showCount?: boolean
}

if (__DEV__) {
  TextArea.displayName = 'TextArea'
}
