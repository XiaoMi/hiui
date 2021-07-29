
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-synchronize-outlined'
const _prefix = getPrefixCls(_role)

export const SynchronizeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M960 512c0 247.424-200.576 448-448 448-220.116 0-403.156-158.746-440.878-368l81.6 0.006C189.25 756.776 336.236 880 512 880s322.75-123.224 359.28-287.994L728 592v-80h232zM512 64c220.118 0 403.158 158.748 440.878 368l-81.6-0.004C834.75 267.224 687.766 144 512 144c-175.766 0-322.75 123.224-359.28 287.996L296 432v80H64C64 264.576 264.576 64 512 64z" p-id="11315"></path></svg>
    )
  }
)

if (__DEV__) {
  SynchronizeOutlined.displayName = 'SynchronizeOutlined'
}
  