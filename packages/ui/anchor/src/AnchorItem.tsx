import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const ANCHOR_ITEM_PREFIX = getPrefixCls('anchor-item')

/**
 * TODO: What is AnchorItem
 */
export const AnchorItem = forwardRef<HTMLDivElement | null, AnchorItemProps>(
  ({ prefixCls = ANCHOR_ITEM_PREFIX, role = 'anchor-item', className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {children}
      </div>
    )
  }
)

export interface AnchorItemProps extends HiBaseHTMLProps<'div'> {}

if (__DEV__) {
  AnchorItem.displayName = 'AnchorItem'
}
