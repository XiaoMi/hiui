import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-direction-down-outlined')

export const DirectionDownOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M798.165333 481.834667a42.666667 42.666667 0 0 0-57.621333-2.496l-2.709333 2.496L512 707.626667 286.165333 481.834667a42.666667 42.666667 0 0 0-57.621333-2.496l-2.709333 2.496a42.666667 42.666667 0 0 0-2.496 57.621333l2.496 2.709333 256 256a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496 256-256a42.666667 42.666667 0 0 0 0-60.330666z m0-256a42.666667 42.666667 0 0 0-57.621333-2.496l-2.709333 2.496L512 451.626667 286.165333 225.834667a42.666667 42.666667 0 0 0-57.621333-2.496l-2.709333 2.496a42.666667 42.666667 0 0 0-2.496 57.621333l2.496 2.709333 256 256a42.666667 42.666667 0 0 0 57.621333 2.496l2.709333-2.496 256-256a42.666667 42.666667 0 0 0 0-60.330666z"
          p-id="49636"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  DirectionDownOutlined.displayName = 'DirectionDownOutlined'
}
