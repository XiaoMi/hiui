
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-data-monitor-filled'
const _prefix = getPrefixCls(_role)

export const DataMonitorFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M789.333333 106.666667a128 128 0 0 1 128 128v384a128 128 0 0 1-128 128H554.666667v85.333333h128a42.666667 42.666667 0 1 1 0 85.333333H341.333333a42.666667 42.666667 0 1 1 0-85.333333h128v-85.333333H234.666667a128 128 0 0 1-128-128V234.666667a128 128 0 0 1 128-128h554.666666z m-56 212.629333a42.666667 42.666667 0 0 0-60.330666 0l-111.04 111.018667-65.066667-65.066667-3.072-2.858667a64 64 0 0 0-87.424 2.88l-116.565333 116.565334-2.496 2.709333a42.666667 42.666667 0 0 0 2.496 57.621333l2.709333 2.496a42.666667 42.666667 0 0 0 57.621333-2.496l101.482667-101.461333 65.066667 65.066667 3.072 2.858666a64 64 0 0 0 87.445333-2.88l126.101333-126.101333 2.496-2.730667a42.666667 42.666667 0 0 0-2.496-57.6z" p-id="15011"></path></svg>
    )
  }
)

if (__DEV__) {
  DataMonitorFilled.displayName = 'DataMonitorFilled'
}
  