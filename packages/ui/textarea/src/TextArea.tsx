import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

import { HiBaseAppearanceEnum, HiBaseHTMLFieldProps, useGlobalContext } from '@hi-ui/core'
import ResizeDetector from 'react-resize-detector'
import { useTextarea, UseTextareaProps } from './use-textarea'

const _prefix = getPrefixCls('textarea')

/**
 * 文本输入框
 */
export const TextArea = forwardRef<HTMLTextAreaElement | null, TextAreaProps>(
  (
    {
      prefixCls = _prefix,
      className,
      size: sizeProp,
      appearance = 'line',
      header,
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
    const { size: globalSize } = useGlobalContext()
    const size = sizeProp ?? globalSize ?? 'md'

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

      return (
        <>
          {valueLength > 0 ? (
            <span className={`${prefixCls}__count-value`}>{valueLength}</span>
          ) : (
            valueLength
          )}
          {max > 0 ? `/${max}` : ''}
        </>
      )
    }, [showCount, maxLength, value.length, prefixCls])

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--size-${size}`,
      `${prefixCls}--appearance-${appearance}`,
      `${prefixCls}-wrapper`,
      showCount && `${prefixCls}-wrapper--show-count`
    )

    const textareaNode = (
      <div className={cls}>
        <div
          className={cx(
            `${prefixCls}__inner`,
            focused && `${prefixCls}__inner--focused`,
            disabled && `${prefixCls}__inner--disabled`,
            readOnly && `${prefixCls}__inner--readonly`,
            invalid && `${prefixCls}__inner--invalid`
          )}
        >
          {header ? <div className={`${prefixCls}__header`}>{header}</div> : null}
          <textarea {...getTextareaProps(rest, ref)} className={`${prefixCls}__text`} />
        </div>
        <div className={`${prefixCls}__count`}>{dataCount}</div>
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
   * 输入框顶部内容
   */
  header?: React.ReactNode
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
