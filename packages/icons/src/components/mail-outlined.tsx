
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-mail-outlined'
const _prefix = getPrefixCls(_role)

export const MailOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M137.224 160.136l375.92 265.44 373.54-265.366 50.632 61.94L517.972 525.4a8 8 0 0 1-9.356 0.014L86.776 222.224l50.448-62.088zM960 864a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V160a8 8 0 0 1 8-8h880a8 8 0 0 1 8 8v704z m-80-72V232H144v560h736z" p-id="12915"></path></svg>
    )
  }
)

if (__DEV__) {
  MailOutlined.displayName = 'MailOutlined'
}
  