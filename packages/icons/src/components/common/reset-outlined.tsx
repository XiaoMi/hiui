import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-reset-outlined'
const _prefix = getPrefixCls(_role)

export const ResetOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role={role}
        style={style}
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <path
          d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512l0.106667-3.2A42.666667 42.666667 0 0 1 170.666667 512c0 188.522667 152.810667 341.333333 341.333333 341.333333s341.333333-152.810667 341.333333-341.333333S700.522667 170.666667 512 170.666667a340.053333 340.053333 0 0 0-225.792 85.333333H341.333333a42.666667 42.666667 0 0 1 3.2 85.226667L341.333333 341.333333H192a43.008 43.008 0 0 1-7.850667-0.725333l-1.813333-0.362667a42.410667 42.410667 0 0 1-2.666667-0.725333l-0.576-0.170667a42.282667 42.282667 0 0 1-2.730666-0.981333l-0.917334-0.362667a42.432 42.432 0 0 1-2.112-0.96l-0.512-0.256a42.645333 42.645333 0 0 1-12.373333-9.386666l-1.344-1.557334a42.666667 42.666667 0 0 1-9.664-24L149.333333 298.666667V149.333333a42.666667 42.666667 0 0 1 85.226667-3.2L234.666667 149.333333v38.4A424.981333 424.981333 0 0 1 512 85.333333z"
          p-id="38825"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ResetOutlined.displayName = 'ResetOutlined'
}
