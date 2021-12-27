import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-warning-filled'
const _prefix = getPrefixCls(_role)

export const WarningFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M465.066667 120.96a64.384 64.384 0 0 1 115.2 0l351.573333 703.189333A64.384 64.384 0 0 1 874.282667 917.333333H171.050667a64.384 64.384 0 0 1-57.6-93.184z m79.189333 560.277333h-43.178667a21.333333 21.333333 0 0 0-21.333333 21.333334v43.178666a21.333333 21.333333 0 0 0 21.333333 21.333334h43.178667a21.333333 21.333333 0 0 0 21.333333-21.333334v-43.178666a21.333333 21.333333 0 0 0-21.333333-21.333334z m0-279.018666h-43.178667a21.333333 21.333333 0 0 0-21.333333 21.333333v171.968a21.333333 21.333333 0 0 0 21.333333 21.333333h43.178667a21.333333 21.333333 0 0 0 21.333333-21.333333v-171.946667a21.333333 21.333333 0 0 0-21.333333-21.333333z"
          p-id="47621"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  WarningFilled.displayName = 'WarningFilled'
}
