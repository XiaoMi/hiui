
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-bar-chart-outlined'
const _prefix = getPrefixCls(_role)

export const BarChartOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M184 112a8 8 0 0 1 8 8v712h712a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h64z m160 256a8 8 0 0 1 8 8v328a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V376a8 8 0 0 1 8-8h64z m320 152a8 8 0 0 1 8 8v176a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-176a8 8 0 0 1 8-8h64z m-160-64a8 8 0 0 1 8 8v240a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V464a8 8 0 0 1 8-8h64z m320-224a8 8 0 0 1 8 8v464a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V240a8 8 0 0 1 8-8h64z" p-id="13625"></path></svg>
    )
  }
)

if (__DEV__) {
  BarChartOutlined.displayName = 'BarChartOutlined'
}
  