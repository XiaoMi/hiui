import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-direction-up-outlined'
const _prefix = getPrefixCls(_role)

export const DirectionUpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M225.834667 542.165333a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496L512 316.373333l225.834667 225.813334a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496a42.666667 42.666667 0 0 0 2.496-57.621334l-2.496-2.709333-256-256a42.666667 42.666667 0 0 0-57.621333-2.496l-2.709333 2.496-256 256a42.666667 42.666667 0 0 0 0 60.330667z m0 256a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496L512 572.373333l225.834667 225.813334a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496a42.666667 42.666667 0 0 0 2.496-57.621334l-2.496-2.709333-256-256a42.666667 42.666667 0 0 0-57.621333-2.496l-2.709333 2.496-256 256a42.666667 42.666667 0 0 0 0 60.330667z"
          p-id="49626"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  DirectionUpOutlined.displayName = 'DirectionUpOutlined'
}
