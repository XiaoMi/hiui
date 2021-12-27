
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-stop-outlined'
const _prefix = getPrefixCls(_role)

export const StopOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333zM170.666667 512c0 188.522667 152.810667 341.333333 341.333333 341.333333a339.84 339.84 0 0 0 209.301333-71.68l-478.933333-478.954666A339.84 339.84 0 0 0 170.666667 512zM512 170.666667a339.84 339.84 0 0 0-209.301333 71.68l478.933333 478.954666A339.84 339.84 0 0 0 853.333333 512c0-188.522667-152.810667-341.333333-341.333333-341.333333z" p-id="47771"></path></svg>
    )
  }
)

if (__DEV__) {
  StopOutlined.displayName = 'StopOutlined'
}
  