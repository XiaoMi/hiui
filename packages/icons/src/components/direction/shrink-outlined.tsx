
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-shrink-outlined'
const _prefix = getPrefixCls(_role)

export const ShrinkOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M416 565.333333l3.2 0.106667A42.666667 42.666667 0 0 1 458.666667 608v192l-0.106667 3.2A42.666667 42.666667 0 0 1 416 842.666667l-3.2-0.106667A42.666667 42.666667 0 0 1 373.333333 800v-88.981333l-193.834666 193.813333-2.709334 2.496a42.666667 42.666667 0 0 1-57.621333-62.826667L312.96 650.666667H224l-3.2-0.106667a42.666667 42.666667 0 0 1 3.2-85.226667h192zM847.210667 116.672a42.666667 42.666667 0 0 1 57.621333 62.826667L711.04 373.333333H800l3.2 0.106667a42.666667 42.666667 0 0 1-3.2 85.226667h-192l-3.2-0.106667A42.666667 42.666667 0 0 1 565.333333 416v-192l0.106667-3.2A42.666667 42.666667 0 0 1 608 181.333333l3.2 0.106667A42.666667 42.666667 0 0 1 650.666667 224v88.981333l193.834666-193.813333z" p-id="49696"></path></svg>
    )
  }
)

if (__DEV__) {
  ShrinkOutlined.displayName = 'ShrinkOutlined'
}
  