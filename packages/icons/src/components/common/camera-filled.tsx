import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-camera-filled'
const _prefix = getPrefixCls(_role)

export const CameraFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M335.68 149.333333a85.333333 85.333333 0 0 1 73.173333 41.429334L460.8 277.333333H810.666667a128 128 0 0 1 128 128v341.333334a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V234.666667a85.333333 85.333333 0 0 1 85.333334-85.333334h165.013333zM533.333333 405.333333a170.666667 170.666667 0 1 0 0 341.333334 170.666667 170.666667 0 0 0 0-341.333334zM810.666667 149.333333a42.666667 42.666667 0 1 1 0 85.333334h-149.333334a42.666667 42.666667 0 1 1 0-85.333334h149.333334z"
          p-id="14911"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  CameraFilled.displayName = 'CameraFilled'
}
