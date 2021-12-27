import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-bars-outlined'
const _prefix = getPrefixCls(_role)

export const BarsOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M896 789.333333a42.666667 42.666667 0 1 1 0 85.333334H128a42.666667 42.666667 0 1 1 0-85.333334h768z m0-320a42.666667 42.666667 0 1 1 0 85.333334H128a42.666667 42.666667 0 1 1 0-85.333334h768z m0-320a42.666667 42.666667 0 1 1 0 85.333334H128a42.666667 42.666667 0 1 1 0-85.333334h768z"
          p-id="39145"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  BarsOutlined.displayName = 'BarsOutlined'
}
