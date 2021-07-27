
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-bank-card-outlined'
const _prefix = getPrefixCls(_role)

export const BankCardOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M960 864a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V160a8 8 0 0 1 8-8h880a8 8 0 0 1 8 8v704z m-80-72V232H144v560h736zM633.72 664h172.56c5.368 0 9.72 3.58 9.72 8v64c0 4.42-4.352 8-9.72 8h-172.56c-5.368 0-9.72-3.58-9.72-8v-64c0-4.42 4.352-8 9.72-8zM112 320h816v80H112z" p-id="12575"></path></svg>
    )
  }
)

if (__DEV__) {
  BankCardOutlined.displayName = 'BankCardOutlined'
}
  