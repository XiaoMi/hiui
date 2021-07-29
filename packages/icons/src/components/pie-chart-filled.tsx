
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-pie-chart-filled'
const _prefix = getPrefixCls(_role)

export const PieChartFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M471.996 65.76L472 546a8 8 0 0 0 7.6 7.99l0.4 0.01h72v-1l406.148 0.006C937.442 781.21 745.6 960 512 960 264.576 960 64 759.424 64 512c0-231.602 175.746-422.158 401.152-445.58l6.844-0.66zM958.326 473H552l0.006-407.236c215.836 19.1 387.694 191.262 406.32 407.236z" p-id="12265"></path></svg>
    )
  }
)

if (__DEV__) {
  PieChartFilled.displayName = 'PieChartFilled'
}
  