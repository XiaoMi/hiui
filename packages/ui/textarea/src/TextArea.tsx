import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseAppearanceEnum, HiBaseHTMLFieldProps, useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
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
      style,
      classNames: classNamesProp,
      styles: stylesProp,
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
    const globalContext = useGlobalContext() as ReturnType<typeof useGlobalContext> & {
      textarea?: { classNames?: any; styles?: any }
    }
    const { size: globalSize } = globalContext
    const textareaConfig = globalContext.textarea
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

    const { classNames, styles } = useMergeSemantic<
      TextAreaSemanticClassNames,
      TextAreaSemanticStyles,
      TextAreaProps
    >({
      classNamesList: [textareaConfig?.classNames, classNamesProp],
      stylesList: [textareaConfig?.styles, stylesProp],
      info: {
        props: {
          ...rest,
          size,
          appearance,
          header,
          invalid,
          disabled,
          readOnly,
          showCount,
        },
      },
    })

    const cls = cx(
      prefixCls,
      className,
      classNames?.root,
      `${prefixCls}--size-${size}`,
      `${prefixCls}--appearance-${appearance}`,
      `${prefixCls}-wrapper`,
      showCount && `${prefixCls}-wrapper--show-count`
    )

    const textareaNode = (
      <div className={cls} style={{ ...style, ...styles?.root }}>
        <div
          className={cx(
            `${prefixCls}__inner`,
            classNames?.inner,
            focused && `${prefixCls}__inner--focused`,
            disabled && `${prefixCls}__inner--disabled`,
            readOnly && `${prefixCls}__inner--readonly`,
            invalid && `${prefixCls}__inner--invalid`
          )}
          style={styles?.inner}
        >
          {header ? (
            <div className={cx(`${prefixCls}__header`, classNames?.header)} style={styles?.header}>
              {header}
            </div>
          ) : null}
          <textarea
            {...getTextareaProps(rest, ref)}
            className={cx(`${prefixCls}__text`, classNames?.text)}
            style={styles?.text}
          />
        </div>
        <div className={cx(`${prefixCls}__count`, classNames?.count)} style={styles?.count}>
          {dataCount}
        </div>
      </div>
    )

    if (autoSize) {
      return <ResizeDetector onResize={onResize}>{textareaNode}</ResizeDetector>
    }

    return textareaNode
  }
)

export type TextAreaSemanticName = 'root' | 'inner' | 'header' | 'text' | 'count'
export type TextAreaSemanticClassNames = SemanticClassNamesType<TextAreaProps, TextAreaSemanticName>
export type TextAreaSemanticStyles = SemanticStylesType<TextAreaProps, TextAreaSemanticName>
export type TextAreaSemantic = ComponentSemantic<TextAreaSemanticClassNames, TextAreaSemanticStyles>

export interface TextAreaProps
  extends HiBaseHTMLFieldProps<'textarea'>,
    TextAreaSemantic,
    UseTextareaProps {
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
