import React, { forwardRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { ProgressSizeEnum, ProgressTypeEnum, ProgressPlacementEnum } from './types'

const PROGRESS_PREFIX = getPrefixCls('progress')

/**
 * TODO: What is Progress
 */
export const Progress = forwardRef<HTMLDivElement | null, ProgressProps>(
  (
    {
      prefixCls = PROGRESS_PREFIX,
      className,
      children,
      percent = 0,
      bufferPercent = 0,
      type = 'primary',
      size = 'md',
      active = false,
      indeterminate = false,
      showInfo: showInfoProp,
      placement = 'outside',
      style,
      content,
      strokeWidth,
      width,
      ...rest
    },
    ref
  ) => {
    const [barElement, setBarElement] = useState<HTMLSpanElement | null>(null)
    const [contentElement, setContentElement] = useState<HTMLSpanElement | null>(null)

    const rate = percent > 100 ? 100 : Number(percent)
    const bufferRate = bufferPercent > 100 ? 100 : Number(bufferPercent)

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--${size}`,
      indeterminate && `${prefixCls}--indeterminate`
    )

    const showInfo = showInfoProp === undefined ? !indeterminate : showInfoProp

    if (showInfo && content === undefined) {
      content = `${rate}%`
    }

    return (
      <div ref={ref} className={cls} role="progressbar" style={{ ...style, width }} {...rest}>
        <div
          className={cx(`${prefixCls}__inner`, { [`${prefixCls}__inner--active`]: active })}
          style={{ height: strokeWidth }}
        >
          {bufferRate > 0 ? (
            <span
              style={{ width: `${bufferRate}%` }}
              className={`${prefixCls}__buffer`}
              aria-label="buffer"
            />
          ) : null}
          <span
            ref={setBarElement}
            style={{ width: indeterminate ? undefined : `${rate}%` }}
            className={cx(`${prefixCls}__value`, `${prefixCls}__value--${type}`)}
            aria-label="value"
          >
            {showInfo && placement === 'inside' && barElement && barElement.clientHeight >= 14 && (
              <span
                ref={setContentElement}
                className={cx(`${prefixCls}__content`, {
                  [`${prefixCls}__content--right`]:
                    contentElement && contentElement?.clientWidth >= barElement?.clientWidth - 8,
                })}
              >
                {content}
              </span>
            )}
          </span>
        </div>
        {showInfo && placement === 'outside' && (
          <div className={`${prefixCls}__content`}>{content}</div>
        )}
      </div>
    )
  }
)

export interface ProgressProps extends HiBaseHTMLProps<'div'> {
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
