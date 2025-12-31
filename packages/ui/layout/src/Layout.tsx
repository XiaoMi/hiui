import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, GlobalConfig } from '@hi-ui/core'

const _prefix = getPrefixCls('layout')

/**
 * 布局组件，用于布局页面结构
 */
export const Layout = forwardRef<HTMLDivElement | null, LayoutProps>(
  (
    { prefixCls: prefixClsProp, role = 'layout', className, children, direction = 'row', ...rest },
    ref
  ) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp || (globalPrefixCls && getPrefixCls('layout', globalPrefixCls)) || _prefix
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
