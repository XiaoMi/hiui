
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-line-chart-outlined'
const _prefix = getPrefixCls(_role)

export const LineChartOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M184 112a8 8 0 0 1 8 8v712h712a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h64z m708.54 78l-188.546 341.284h-239.38l-112.074 186.864H262l164.66-266.864h230.218L801.84 190h90.7z" p-id="13615"></path></svg>
    )
  }
)

if (__DEV__) {
  LineChartOutlined.displayName = 'LineChartOutlined'
}
  