import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, GlobalConfig } from '@hi-ui/core'

const _prefix = getPrefixCls('content')

export const Content = forwardRef<HTMLDivElement | null, ContentProps>(
  ({ prefixCls: prefixClsProp, role = 'content', className, children, ...rest }, ref) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp || (globalPrefixCls && getPrefixCls('content', globalPrefixCls)) || _prefix
    const cls = cx(prefixCls, className)

    return (
      <main ref={ref} role={role} className={cls} {...rest}>
        {children}
      </main>
    )
  }
)

export interface ContentProps extends HiBaseHTMLProps<'div'> {}

if (__DEV__) {
  Content.displayName = 'Content'
}
