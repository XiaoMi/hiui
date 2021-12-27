import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-pin-filled'
const _prefix = getPrefixCls(_role)

export const PinFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M877.930667 342.186667a117.333333 117.333333 0 0 1-118.954667 194.666666l-0.213333-0.064-87.125334 87.082667 0.96 1.578667a138.730667 138.730667 0 0 1-17.493333 165.696l-3.456 3.584-15.082667 15.082666a117.333333 117.333333 0 0 1-165.930666 0l-98.069334-98.069333-195.797333 195.84a42.666667 42.666667 0 0 1-62.506667-58.026667l2.176-2.346666 195.776-195.797334-98.026666-98.048a117.333333 117.333333 0 0 1-3.264-162.517333l3.264-3.413333 15.082666-15.082667a138.730667 138.730667 0 0 1 169.28-20.949333l1.578667 0.938666 87.082667-87.082666-1.536-5.141334a117.397333 117.397333 0 0 1 26.752-110.421333l3.456-3.626667a117.333333 117.333333 0 0 1 165.930666 0z"
          p-id="15241"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  PinFilled.displayName = 'PinFilled'
}
