
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-travel-filled'
const _prefix = getPrefixCls(_role)

export const TravelFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M724 64a8 8 0 0 1 8 8v114h120a8 8 0 0 1 8 8v704a8 8 0 0 1-8 8h-94v62a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-62H348v62a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-62H172a8 8 0 0 1-8-8V194a8 8 0 0 1 8-8h120V72a8 8 0 0 1 8-8h424zM424 384h-64a8 8 0 0 0-7.99 7.6l-0.01 0.4v320a8 8 0 0 0 7.6 7.99l0.4 0.01h64a8 8 0 0 0 7.99-7.6l0.01-0.4V392a8 8 0 0 0-7.6-7.99L424 384z m240 0h-64a8 8 0 0 0-7.99 7.6l-0.01 0.4v320a8 8 0 0 0 7.6 7.99l0.4 0.01h64a8 8 0 0 0 7.99-7.6l0.01-0.4V392a8 8 0 0 0-7.6-7.99L664 384z m-12-240H372v42h280V144z" p-id="12065"></path></svg>
    )
  }
)

if (__DEV__) {
  TravelFilled.displayName = 'TravelFilled'
}
  