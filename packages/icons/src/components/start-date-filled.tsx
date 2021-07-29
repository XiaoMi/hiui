
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-start-date-filled'
const _prefix = getPrefixCls(_role)

export const StartDateFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M902 420v500a8 8 0 0 1-8 8H130a8 8 0 0 1-8-8V420h780z m-444 60h-184a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8h184a8 8 0 0 0 8-8v-64a8 8 0 0 0-8-8zM410 80a8 8 0 0 1 8 8v52h196V88a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v52h200a8 8 0 0 1 8 8v192H122V148a8 8 0 0 1 8-8h208V88a8 8 0 0 1 8-8h64z" p-id="12115"></path></svg>
    )
  }
)

if (__DEV__) {
  StartDateFilled.displayName = 'StartDateFilled'
}
  