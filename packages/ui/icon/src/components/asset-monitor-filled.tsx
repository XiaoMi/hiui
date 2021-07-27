
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-asset-monitor-filled'
const _prefix = getPrefixCls(_role)

export const AssetMonitorFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M936 120a16 16 0 0 1 16 16v576a16 16 0 0 1-16 16H552v96h208a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H264a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8l208-0.002V728H88a16 16 0 0 1-16-16V136a16 16 0 0 1 16-16h848zM404 472h-144a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8h144a8 8 0 0 0 8-8v-64a8 8 0 0 0-8-8z m360 0H460a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8h304a8 8 0 0 0 8-8v-64a8 8 0 0 0-8-8z m-360-168h-144a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8h144a8 8 0 0 0 8-8v-64a8 8 0 0 0-8-8z m360 0H460a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8h304a8 8 0 0 0 8-8v-64a8 8 0 0 0-8-8z" p-id="11675"></path></svg>
    )
  }
)

if (__DEV__) {
  AssetMonitorFilled.displayName = 'AssetMonitorFilled'
}
  