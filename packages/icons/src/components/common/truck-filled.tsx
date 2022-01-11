import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-truck-filled')

export const TruckFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg
        className={cls}
        ref={ref}
        role="icon"
        {...rest}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <path
          d="M298.666667 768a21.333333 21.333333 0 0 0 42.666666 0h85.333334a106.666667 106.666667 0 0 1-213.333334 0h85.333334z m469.333333 0a21.333333 21.333333 0 0 0 42.666667 0h85.333333a106.666667 106.666667 0 0 1-213.333333 0h85.333333zM490.666667 149.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v405.333333a85.333333 85.333333 0 0 1-85.333333 85.333333H170.666667a85.333333 85.333333 0 0 1-85.333334-85.333333V234.666667a85.333333 85.333333 0 0 1 85.333334-85.333334h320z m320 170.666667l128 128v192a85.333333 85.333333 0 0 1-85.333334 85.333333h-128a85.333333 85.333333 0 0 1-85.333333-85.333333V405.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h85.333334z"
          p-id="15331"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  TruckFilled.displayName = 'TruckFilled'
}
