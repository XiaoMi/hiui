import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-woman-outlined'
const _prefix = getPrefixCls(_role)

export const WomanOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M512 106.666667c153.173333 0 277.333333 124.16 277.333333 277.333333 0 138.688-101.802667 253.610667-234.773333 274.090667 0.064 1.066667 0.106667 2.133333 0.106667 3.242666v64h106.666666a42.666667 42.666667 0 1 1 0 85.333334h-106.666666v85.333333a42.666667 42.666667 0 1 1-85.333334 0v-85.333333h-106.666666a42.666667 42.666667 0 1 1 0-85.333334h106.666666v-64c0-1.109333 0.042667-2.197333 0.128-3.264C336.469333 637.610667 234.666667 522.666667 234.666667 384c0-153.173333 124.16-277.333333 277.333333-277.333333z m0 85.333333a192 192 0 1 0 0 384 192 192 0 0 0 0-384z"
          p-id="38655"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  WomanOutlined.displayName = 'WomanOutlined'
}
