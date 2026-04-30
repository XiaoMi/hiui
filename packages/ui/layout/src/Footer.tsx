import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const HEADER_PREFIX = getPrefixCls('footer')

export const Footer = forwardRef<HTMLDivElement | null, FooterProps>(
  ({ prefixCls = HEADER_PREFIX, role = 'footer', className, children, ...rest }, ref) => {
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
