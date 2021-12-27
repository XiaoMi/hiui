import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-heart-filled'
const _prefix = getPrefixCls(_role)

export const HeartFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M152 223.36c87.466667-87.466667 229.290667-87.466667 316.778667 0l45.226666 45.248 45.290667-45.226667c87.466667-87.466667 229.290667-87.466667 316.778667 0 87.466667 87.466667 87.466667 229.290667 0 316.778667L574.378667 841.856a85.333333 85.333333 0 0 1-120.682667 0L152 540.16c-87.466667-87.466667-87.466667-229.312 0-316.8z"
          p-id="15171"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  HeartFilled.displayName = 'HeartFilled'
}
