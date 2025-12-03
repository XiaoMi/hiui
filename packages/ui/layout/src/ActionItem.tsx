import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const ACTION_ITEM_PREFIX = getPrefixCls('action-item')

export const ActionItem = forwardRef<HTMLDivElement | null, ActionItemProps>(
  (
    {
      prefixCls = ACTION_ITEM_PREFIX,
      role = 'action-item',
      className,
      children,
      icon,
      mini,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, mini && `${prefixCls}--mini`)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {icon && <div className={`${prefixCls}__icon`}>{icon}</div>}
        {children && !mini && <div className={`${prefixCls}__content`}>{children}</div>}
      </div>
    )
  }
)

export interface ActionItemProps extends HiBaseHTMLProps<'div'> {
  icon?: React.ReactNode
  mini?: boolean
}

if (__DEV__) {
  ActionItem.displayName = 'ActionItem'
}
