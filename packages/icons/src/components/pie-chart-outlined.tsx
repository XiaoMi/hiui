
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-pie-chart-outlined'
const _prefix = getPrefixCls(_role)

export const PieChartOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64zM144 512c0 203.24 164.76 368 368 368 189.38 0 345.35-143.054 365.74-326.996L552 553v1h-72a8 8 0 0 1-8-8l-0.002-399.85C287.574 166.086 144 322.276 144 512zM552.004 146.15L552 473h325.958c-18.094-171.758-154.336-308.3-325.954-326.85z" p-id="13605"></path></svg>
    )
  }
)

if (__DEV__) {
  PieChartOutlined.displayName = 'PieChartOutlined'
}
  