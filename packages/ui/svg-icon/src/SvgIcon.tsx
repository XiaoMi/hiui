import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const SVG_ICON_PREFIX = getPrefixCls('svg-icon')

/**
 * TODO: What is SvgIcon
 */
export const SvgIcon = forwardRef<SVGSVGElement | null, SvgIconProps>(
  (
    {
      prefixCls = SVG_ICON_PREFIX,
      role = 'img',
      className,
      children,
      style,
      size,
      color,
      viewBox = '0 0 24 24',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        ref={ref}
        role={role}
        width="1em"
        height="1em"
        focusable="false"
        strokeWidth="0"
        fill="currentColor"
        stroke="currentColor"
        aria-hidden="true"
        color="currentColor"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className={cls}
        style={{
          ...style,
          color,
          fontSize: size,
        }}
        {...rest}
      >
        {children}
      </svg>
    )
  }
)

export interface SvgIconProps extends HiBaseHTMLProps<'svg'> {
  /**
   * svg 可视区盒
   */
  viewBox?: string
  /**
   * svg 尺寸大小
   */
  size?: number
}

if (__DEV__) {
  SvgIcon.displayName = 'SvgIcon'
}
