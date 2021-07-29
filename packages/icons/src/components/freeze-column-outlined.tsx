
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-freeze-column-outlined'
const _prefix = getPrefixCls(_role)

export const FreezeColumnOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M896 112a16 16 0 0 1 16 16v768a16 16 0 0 1-16 16H128a16 16 0 0 1-16-16V128a16 16 0 0 1 16-16h768zM346 552H192v280h154V552z m80 71.044V832h120.64L426 623.044zM832 552h-154v280h154V552z m-234 0h-120.642L598 760.958V552zM346 192H192v280h154V192z m80 63.044V472h125.26L426 255.044zM832 192h-154v280h154V192z m-234 0h-116.022L598 392.958V192z" p-id="13425"></path></svg>
    )
  }
)

if (__DEV__) {
  FreezeColumnOutlined.displayName = 'FreezeColumnOutlined'
}
  