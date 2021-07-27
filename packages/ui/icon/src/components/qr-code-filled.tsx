
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-qr-code-filled'
const _prefix = getPrefixCls(_role)

export const QrCodeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M544 592a8 8 0 0 1 8 8v304a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V600a8 8 0 0 1 8-8h64zM120 552a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h352V120a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v424a8 8 0 0 1-8 8H120z m480-80h304a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H600a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8zM424 112a8 8 0 0 1 8 8v304a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h304zM424 592a8 8 0 0 1 8 8v304a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V600a8 8 0 0 1 8-8h304zM904 112a8 8 0 0 1 8 8v304a8 8 0 0 1-8 8H600a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h304zM904 592a8 8 0 0 1 8 8v304a8 8 0 0 1-8 8H600a8 8 0 0 1-8-8V600a8 8 0 0 1 8-8h304z" p-id="12035"></path></svg>
    )
  }
)

if (__DEV__) {
  QrCodeFilled.displayName = 'QrCodeFilled'
}
  