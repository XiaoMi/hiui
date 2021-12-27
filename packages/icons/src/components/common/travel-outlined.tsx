import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-travel-outlined'
const _prefix = getPrefixCls(_role)

export const TravelOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M640 64a85.333333 85.333333 0 0 1 85.333333 85.333333v21.333334h21.333334a128 128 0 0 1 127.914666 123.2L874.666667 298.666667v448a128 128 0 0 1-128 128h-42.666667v21.333333a42.666667 42.666667 0 1 1-85.333333 0v-21.333333H405.333333v21.333333a42.666667 42.666667 0 1 1-85.333333 0v-21.333333h-42.666667a128 128 0 0 1-127.914666-123.2L149.333333 746.666667V298.666667a128 128 0 0 1 128-128h21.333334V149.333333a85.333333 85.333333 0 0 1 81.066666-85.226666L384 64z m106.666667 192H277.333333a42.666667 42.666667 0 0 0-42.666666 42.666667v448a42.666667 42.666667 0 0 0 42.666666 42.666666h469.333334a42.666667 42.666667 0 0 0 42.666666-42.666666V298.666667a42.666667 42.666667 0 0 0-42.666666-42.666667z m-341.333334 85.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v256a42.666667 42.666667 0 1 1-85.333333 0V384a42.666667 42.666667 0 0 1 42.666666-42.666667z m213.333334 0a42.666667 42.666667 0 0 1 42.666666 42.666667v256a42.666667 42.666667 0 1 1-85.333333 0V384a42.666667 42.666667 0 0 1 42.666667-42.666667z m21.333333-192H384v21.333334h256V149.333333z"
          p-id="39055"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  TravelOutlined.displayName = 'TravelOutlined'
}
