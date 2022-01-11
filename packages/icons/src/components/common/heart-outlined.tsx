import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-heart-outlined')

export const HeartOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M152 223.36c86.037333-86.037333 224.661333-87.445333 312.426667-4.224l4.352 4.245333 45.226666 45.226667 45.290667-45.226667c87.466667-87.466667 229.290667-87.466667 316.778667 0 87.466667 87.466667 87.466667 229.290667 0 316.778667L574.378667 841.856a85.333333 85.333333 0 0 1-117.610667 2.944l-3.072-2.944L152 540.16c-87.466667-87.466667-87.466667-229.312 0-316.8z m362.026667 558.165333l98.048-98.069333 3.456-3.562667a138.666667 138.666667 0 0 0 1.749333-187.050666l0.149333-0.128-209.002666-209.002667-3.562667-3.456a138.666667 138.666667 0 0 0-195.989333 195.989333l3.456 3.562667 301.696 301.717333z m105.6-497.813333l-45.248 45.248 98.048 98.069333a223.04 223.04 0 0 1 64.064 132.053334l79.232-79.274667a138.666667 138.666667 0 0 0-192.512-199.552l-3.584 3.456z"
          p-id="39645"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  HeartOutlined.displayName = 'HeartOutlined'
}
