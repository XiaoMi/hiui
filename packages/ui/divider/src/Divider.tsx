import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const DIVIDER_PREFIX = getPrefixCls('divider')
const DEFAULT_ORIENTATION_MARGIN = 0.05
const DEFAULT_VERTICAL_MARGIN_INLINE = 8
/**
 * TODO: What is Divider
 */
export const Divider = forwardRef<HTMLDivElement | null, DividerProps>(
  (
    {
      prefixCls = DIVIDER_PREFIX,
      role = 'divider',
      className,
      children,
      type = 'horizontal',
      dashed = false,
      color = 'rgba(5, 5, 5, 0.06)',
      lineWidth = 1,
      orientation = 'center',
      orientationMargin = DEFAULT_ORIENTATION_MARGIN,
      verticalMarginInline = DEFAULT_VERTICAL_MARGIN_INLINE,
      wrapperStyle = {},
      ...rest
    },
    ref
  ) => {
    const withContent = children && type !== 'vertical'

    const customOrientationMargin = useMemo(() => {
      const number = Number(orientationMargin)
      if (!isNaN(number) && number >= 0 && number <= 1) return number
      return DEFAULT_ORIENTATION_MARGIN
    }, [orientationMargin])

    const customVerticalMarginInline = useMemo(() => {
      const number = Number(verticalMarginInline)
      if (!isNaN(number) && number >= 0) return number
      return DEFAULT_VERTICAL_MARGIN_INLINE
    }, [verticalMarginInline])

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--type-${type}`,
      `${prefixCls}--orientation-${orientation}`,
      dashed && `${prefixCls}--dashed`,
      withContent && `${prefixCls}--with-content`
    )

    const dividerStyle = useMemo(() => {
      return {
        '--line-color': color,
        '--line-width': `${lineWidth}px`,
        '--orientation-margin': customOrientationMargin,
        '--vertical-margin-inline': `${customVerticalMarginInline}px`,
        ...wrapperStyle,
      } as React.CSSProperties
    }, [color, lineWidth, customOrientationMargin, customVerticalMarginInline, wrapperStyle])

    return (
      <div ref={ref} role={role} className={cls} {...rest} style={dividerStyle}>
        {children && type !== 'vertical' && (
          <span className={`${prefixCls}--inner-content`}>{children}</span>
        )}
      </div>
    )
  }
)

export interface DividerProps extends HiBaseHTMLProps<'div'> {
  /**
   * 设置分割线类型
   */
  type?: 'horizontal' | 'vertical'
  /**
   * 设置是否虚线
   */
  dashed?: boolean
  /**
   * 线条颜色
   */
  color?: string
  /**
   * 线条宽度（px）
   */
  lineWidth?: number
  /**
   * 设置分割线子节点位置
   */
  orientation?: 'left' | 'center' | 'right'
  /**
   * 设置orientation非center下分割线子节点与最近边距离占全长比例
   */
  orientationMargin?: string | number
  /**
   * 设置垂直模式下分割线左右margin（px）
   */
  verticalMarginInline?: number
  /**
   * 设置分割线样式
   */
  wrapperStyle?: React.CSSProperties
}

if (__DEV__) {
  Divider.displayName = 'Divider'
}
