import React, { forwardRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { ProgressSizeEnum, ProgressTypeEnum, ProgressPlacementEnum } from './types'

const PROGRESS_PREFIX = getPrefixCls('progress')

/**
 * 进度条
 */
export const Progress = forwardRef<HTMLDivElement | null, ProgressProps>(
  (
    {
      prefixCls = PROGRESS_PREFIX,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      percent = 0,
      bufferPercent = 0,
      type = 'primary',
      size: sizeProp,
      active = false,
      indeterminate = false,
      showInfo: showInfoProp,
      placement = 'outside',
      content,
      strokeWidth,
      width,
      color,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize, progress: progressConfig } = useGlobalContext() as ReturnType<
      typeof useGlobalContext
    > & { progress?: { classNames?: any; styles?: any } }
    const size = sizeProp ?? globalSize ?? 'md'

    const [barElement, setBarElement] = useState<HTMLSpanElement | null>(null)
    const [contentElement, setContentElement] = useState<HTMLSpanElement | null>(null)

    const rate = percent > 100 ? 100 : Number(percent)
    const bufferRate = bufferPercent > 100 ? 100 : Number(bufferPercent)

    const { classNames, styles } = useMergeSemantic<
      ProgressSemanticClassNames,
      ProgressSemanticStyles,
      ProgressProps
    >({
      classNamesList: [progressConfig?.classNames, classNamesProp],
      stylesList: [progressConfig?.styles, stylesProp],
      info: {
        props: {
          ...rest,
          percent: rate,
          bufferPercent: bufferRate,
          type,
          size: sizeProp,
          active,
          indeterminate,
          placement,
          showInfo: showInfoProp,
        },
      },
    })

    const cls = cx(
      prefixCls,
      className,
      classNames?.root,
      `${prefixCls}--${size}`,
      indeterminate && `${prefixCls}--indeterminate`
    )

    const showInfo = showInfoProp === undefined ? !indeterminate : showInfoProp

    let resolvedContent = content
    if (showInfo && resolvedContent === undefined) {
      resolvedContent = `${rate}%`
    }

    return (
      <div
        ref={ref}
        className={cls}
        role="progressbar"
        style={{ ...style, width, ...styles?.root }}
        {...rest}
      >
        <div
          className={cx(`${prefixCls}__inner`, classNames?.inner, {
            [`${prefixCls}__inner--active`]: active,
          })}
          style={{ height: strokeWidth, ...styles?.inner }}
        >
          {bufferRate > 0 ? (
            <span
              style={{ width: `${bufferRate}%`, ...styles?.buffer }}
              className={cx(`${prefixCls}__buffer`, classNames?.buffer)}
              aria-label="buffer"
            />
          ) : null}
          <span
            ref={setBarElement}
            style={{
              width: indeterminate ? undefined : `${rate}%`,
              backgroundColor: color,
              ...styles?.value,
            }}
            className={cx(`${prefixCls}__value`, `${prefixCls}__value--${type}`, classNames?.value)}
            aria-label="value"
          >
            {showInfo && placement === 'inside' && barElement && barElement.clientHeight >= 14 && (
              <span
                ref={setContentElement}
                className={cx(`${prefixCls}__content`, classNames?.content, {
                  [`${prefixCls}__content--right`]:
                    contentElement && contentElement?.clientWidth >= barElement?.clientWidth - 8,
                })}
                style={styles?.content}
              >
                {resolvedContent}
              </span>
            )}
          </span>
        </div>
        {showInfo && placement === 'outside' && (
          <div className={cx(`${prefixCls}__content`, classNames?.content)} style={styles?.content}>
            {resolvedContent}
          </div>
        )}
      </div>
    )
  }
)

export type ProgressSemanticName = 'root' | 'inner' | 'buffer' | 'value' | 'content'
export type ProgressSemanticClassNames = SemanticClassNamesType<ProgressProps, ProgressSemanticName>
export type ProgressSemanticStyles = SemanticStylesType<ProgressProps, ProgressSemanticName>
export type ProgressSemantic = ComponentSemantic<ProgressSemanticClassNames, ProgressSemanticStyles>

export interface ProgressProps extends HiBaseHTMLProps<'div'>, ProgressSemantic {
  /**
   * 进度条大小
   */
  size?: ProgressSizeEnum
  /**
   * 激活的动画效果（仅支持条形用法）
   */
  active?: boolean
  /**
   * 显示文本，默认是当前进度百分比
   */
  content?: React.ReactNode
  /**
   * 是否显示文本
   */
  showInfo?: boolean
  /**
   * 进度条类型
   */
  type?: ProgressTypeEnum
  /**
   * 环形进度条半径
   */
  radius?: number
  /**
   * 文字在进度条内显示，需配合 height 使用
   */
  placement?: ProgressPlacementEnum
  /**
   * 进度条宽度度，仅在 appearance = 'bar' 时有效
   */
  width?: number
  /**
   * 进度条高度，仅在 appearance = 'bar' 时有效
   */
  height?: number
  /**
   * 进度条百分比值
   */
  percent?: number
  /**
   * 进度条颜色
   */
  color?: string
  /**
   * 开启进度条加载
   */
  indeterminate?: boolean
  /**
   * 进度条线性宽度
   */
  strokeWidth?: number
  /**
   * 进度条缓冲区百分比值
   */
  bufferPercent?: number
}

if (__DEV__) {
  Progress.displayName = 'Progress'
}
