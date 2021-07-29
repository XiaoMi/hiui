
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-data-monitor-filled'
const _prefix = getPrefixCls(_role)

export const DataMonitorFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M936 120a16 16 0 0 1 16 16v576a16 16 0 0 1-16 16H552v96h208a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H264a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8l208-0.002V728H88a16 16 0 0 1-16-16V136a16 16 0 0 1 16-16h848z m-187.912 165.82a8 8 0 0 0-11.284-0.806l-171.658 148.78-109.72-113.564a8 8 0 0 0-10.81-0.64L240.92 485.7a8 8 0 0 0-1.144 11.256l40.448 49.6 0.286 0.332a8 8 0 0 0 10.97 0.81l152.4-124.284 111.128 115.02a8 8 0 0 0 10.994 0.486L789.2 345.466a8 8 0 0 0 0.806-11.284z" p-id="11795"></path></svg>
    )
  }
)

if (__DEV__) {
  DataMonitorFilled.displayName = 'DataMonitorFilled'
}
  