import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, GlobalConfig } from '@hi-ui/core'

const _prefix = getPrefixCls('header')

export const Header = forwardRef<HTMLDivElement | null, HeaderProps>(
  ({ prefixCls: prefixClsProp, role = 'header', className, children, ...rest }, ref) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp || (globalPrefixCls && getPrefixCls('header', globalPrefixCls)) || _prefix
    const cls = cx(prefixCls, className)

    return (
      <header ref={ref} role={role} className={cls} {...rest}>
        {children}
      </header>
    )
  }
)

export interface HeaderProps extends HiBaseHTMLProps<'div'> {}

if (__DEV__) {
  Header.displayName = 'Header'
}
