import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const HEADER_PREFIX = getPrefixCls('header')

export const Header = forwardRef<HTMLDivElement | null, HeaderProps>(
  ({ prefixCls = HEADER_PREFIX, role = 'header', className, children, ...rest }, ref) => {
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
