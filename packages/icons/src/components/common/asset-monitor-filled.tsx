
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-asset-monitor-filled'
const _prefix = getPrefixCls(_role)

export const AssetMonitorFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M789.333333 106.666667a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128H554.666667v85.333333h128a42.666667 42.666667 0 1 1 0 85.333333H341.333333a42.666667 42.666667 0 1 1 0-85.333333h128v-85.333333H234.666667a128 128 0 0 1-128-128V234.666667a128 128 0 0 1 128-128h554.666666z m-170.666666 362.666666H405.333333a42.666667 42.666667 0 1 0 0 85.333334h213.333334a42.666667 42.666667 0 1 0 0-85.333334z m0-149.333333H405.333333a42.666667 42.666667 0 1 0 0 85.333333h213.333334a42.666667 42.666667 0 1 0 0-85.333333z" p-id="14881"></path></svg>
    )
  }
)

if (__DEV__) {
  AssetMonitorFilled.displayName = 'AssetMonitorFilled'
}
  