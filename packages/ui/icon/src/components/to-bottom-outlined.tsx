
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-to-bottom-outlined'
const _prefix = getPrefixCls(_role)

export const ToBottomOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M508.014 791.186l-0.256-0.242-268.7-268.7a6 6 0 0 1 0-8.486l48.082-48.084a6 6 0 0 1 8.486 0L472 642.048V134a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v508.048l176.374-176.374a6 6 0 0 1 8.486 0l48.084 48.084a6 6 0 0 1 0 8.484l-268.7 268.7a6 6 0 0 1-8.23 0.244zM184 898a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h656a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H184z" p-id="13745"></path></svg>
    )
  }
)

if (__DEV__) {
  ToBottomOutlined.displayName = 'ToBottomOutlined'
}
  