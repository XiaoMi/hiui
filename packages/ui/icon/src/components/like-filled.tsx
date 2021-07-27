
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-like-filled'
const _prefix = getPrefixCls(_role)

export const LikeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M477.75 88.434c64.146 0 116.268 51.48 117.304 115.38l0.016 1.94V342h232.62a100 100 0 0 1 23.264 2.744c53.176 12.72 86.176 65.73 74.364 118.908l-0.37 1.61-91.848 384c-10.656 44.548-50.188 76.1-95.872 76.728l-1.386 0.01H268V414h0.432l82.14-224c19.228-60.484 63.71-101.566 127.178-101.566zM196 414v512H124a8 8 0 0 1-8-8V422a8 8 0 0 1 8-8h72z" p-id="11915"></path></svg>
    )
  }
)

if (__DEV__) {
  LikeFilled.displayName = 'LikeFilled'
}
  