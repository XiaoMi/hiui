import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-rotate-right-outlined'
const _prefix = getPrefixCls(_role)

export const RotateRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M362.986667 298.666667a128 128 0 0 0-128 128v320a128 128 0 0 0 128 128h448a128 128 0 0 0 128-128V426.666667a128 128 0 0 0-128-128h-448z m0 85.333333h448a42.666667 42.666667 0 0 1 42.56 39.466667l0.106666 3.2v320a42.666667 42.666667 0 0 1-39.466666 42.56l-3.2 0.106666h-448a42.666667 42.666667 0 0 1-42.538667-39.466666l-0.128-3.2V426.666667a42.666667 42.666667 0 0 1 39.488-42.56l3.2-0.106667zM421.12 80.149333a42.666667 42.666667 0 0 0-2.496 57.6l2.496 2.730667 9.386667 9.365333-110.101334-0.192c-127.573333-0.213333-231.509333 101.376-234.986666 228.117334L85.333333 383.936V469.333333a42.666667 42.666667 0 0 0 85.226667 3.2L170.666667 469.333333v-85.269333a149.333333 149.333333 0 0 1 144.448-148.992l5.12-0.085333 213.354666 0.362666c36.928 0.064 56-43.264 32.490667-70.4l-2.24-2.432-82.389333-82.368a42.666667 42.666667 0 0 0-60.330667 0z"
          p-id="45046"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  RotateRightOutlined.displayName = 'RotateRightOutlined'
}
