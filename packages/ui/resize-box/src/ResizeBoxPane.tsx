import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, GlobalConfig } from '@hi-ui/core'

const _prefix = getPrefixCls('resize-box-pane')

export const ResizeBoxPane = forwardRef<HTMLDivElement | null, ResizeBoxPaneProps>(
  (
    {
      prefixCls: prefixClsProp,
      role = 'resize-box-pane',
      className,
      children,
      defaultWidth,
      minWidth,
      collapsible,
      collapsed,
      onCollapse,
      onResizeStart,
      onResizeEnd,
      onResize,
      ...rest
    },
    ref
  ) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp ||
      (globalPrefixCls && getPrefixCls('resize-box-pane', globalPrefixCls)) ||
      _prefix
    const cls = cx(prefixCls, className, collapsed && `${prefixCls}--collapsed`)

    return (
      <div ref={ref} role={role} className={cls} style={{ width: defaultWidth }} {...rest}>
        {children}
      </div>
    )
  }
)

export interface ResizeBoxPaneProps extends HiBaseHTMLProps<'div'> {
  defaultWidth?: number
  width?: number
  minWidth?: number
  collapsible?: boolean
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
  onResize?: (width: number) => void
}

if (__DEV__) {
  ResizeBoxPane.displayName = 'ResizeBoxPane'
}
