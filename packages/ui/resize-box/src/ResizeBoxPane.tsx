import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const RESIZE_BOX_PANE_PREFIX = getPrefixCls('resize-box-pane')

export const ResizeBoxPane = forwardRef<HTMLDivElement | null, ResizeBoxPaneProps>(
  (
    {
      prefixCls = RESIZE_BOX_PANE_PREFIX,
      role = 'resize-box-pane',
      className,
      children,
      defaultWidth,
      minWidth,
      onResize,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

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
  onResize?: (width: number) => void
}

if (__DEV__) {
  ResizeBoxPane.displayName = 'ResizeBoxPane'
}
