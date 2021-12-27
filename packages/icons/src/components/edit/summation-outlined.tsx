import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-summation-outlined'
const _prefix = getPrefixCls(_role)

export const SummationOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M896 149.333333a42.666667 42.666667 0 1 1 0 85.333334H232.234667l247.168 247.168a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709333L232.213333 789.333333H896a42.666667 42.666667 0 1 1 0 85.333334H128a42.666667 42.666667 0 0 1-23.509333-78.272L388.885333 512 104.490667 227.605333A42.666667 42.666667 0 0 1 128 149.333333h768z"
          p-id="45016"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  SummationOutlined.displayName = 'SummationOutlined'
}
