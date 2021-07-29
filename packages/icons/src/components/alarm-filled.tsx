
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-alarm-filled'
const _prefix = getPrefixCls(_role)

export const AlarmFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M832 860h60a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H132a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h60V404c0-176.732 143.268-320 320-320s320 143.268 320 320v456z m-80-100v-80H272v80h480z" p-id="11665"></path></svg>
    )
  }
)

if (__DEV__) {
  AlarmFilled.displayName = 'AlarmFilled'
}
  