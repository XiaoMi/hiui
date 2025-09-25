import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const LAYOUT_PREFIX = getPrefixCls('layout')

/**
 * 布局组件，用于布局页面结构
 */
export const Layout = forwardRef<HTMLDivElement | null, LayoutProps>(
  (
    { prefixCls = LAYOUT_PREFIX, role = 'layout', className, children, direction = 'row', ...rest },
    ref
  ) => {
    const cls = cx(prefixCls, className, `${prefixCls}--direction-${direction}`)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {children}
      </div>
    )
  }
)

export interface LayoutProps extends HiBaseHTMLProps<'div'> {
  /**
   * 布局方向
   */
  direction?: 'row' | 'column'
}

if (__DEV__) {
  Layout.displayName = 'Layout'
}
