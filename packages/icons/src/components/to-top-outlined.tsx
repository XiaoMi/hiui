
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-to-top-outlined'
const _prefix = getPrefixCls(_role)

export const ToTopOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M515.986 232.814l0.256 0.242 268.7 268.7a6 6 0 0 1 0 8.486l-48.082 48.084a6 6 0 0 1-8.486 0L552 381.952V890a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V381.952l-176.374 176.374a6 6 0 0 1-8.486 0l-48.084-48.084a6 6 0 0 1 0-8.484l268.7-268.7a6 6 0 0 1 8.23-0.244zM840 126a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H184a8 8 0 0 1-8-8V134a8 8 0 0 1 8-8h656z" p-id="13735"></path></svg>
    )
  }
)

if (__DEV__) {
  ToTopOutlined.displayName = 'ToTopOutlined'
}
  