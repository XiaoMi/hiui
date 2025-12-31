import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, GlobalConfig } from '@hi-ui/core'

const _prefix = getPrefixCls('footer')

export const Footer = forwardRef<HTMLDivElement | null, FooterProps>(
  ({ prefixCls: prefixClsProp, role = 'footer', className, children, ...rest }, ref) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp || (globalPrefixCls && getPrefixCls('footer', globalPrefixCls)) || _prefix
    const cls = cx(prefixCls, className)

    return (
      <footer ref={ref} role={role} className={cls} {...rest}>
        {children}
      </footer>
    )
  }
)

export interface FooterProps extends HiBaseHTMLProps<'div'> {}

if (__DEV__) {
  Footer.displayName = 'Footer'
}
