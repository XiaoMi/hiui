
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-bank-card-filled'
const _prefix = getPrefixCls(_role)

export const BankCardFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M960 400v464a8 8 0 0 1-8 8H72a8 8 0 0 1-8-8V400h896z m-153.72 264h-172.56c-5.214 0-9.47 3.38-9.71 7.624L624 672v64c0 4.292 4.108 7.794 9.264 7.992l0.458 0.008h172.556c5.216 0 9.472-3.38 9.712-7.624L816 736v-64c0-4.42-4.352-8-9.72-8zM952 152a8 8 0 0 1 8 8v160H64V160a8 8 0 0 1 8-8h880z" p-id="11715"></path></svg>
    )
  }
)

if (__DEV__) {
  BankCardFilled.displayName = 'BankCardFilled'
}
  