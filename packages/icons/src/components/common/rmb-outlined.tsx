import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-rmb-outlined')

export const RmbOutlined = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 85.333334C323.477333 170.666667 170.666667 323.477333 170.666667 512s152.810667 341.333333 341.333333 341.333333 341.333333-152.810667 341.333333-341.333333S700.522667 170.666667 512 170.666667z m-79.210667 138.005333l2.709334 2.496L512 387.626667l76.501333-76.48 2.709334-2.496a42.666667 42.666667 0 0 1 57.621333 62.826666L572.330667 448H640a42.666667 42.666667 0 1 1 0 85.333333h-85.333333v42.666667h85.333333a42.666667 42.666667 0 1 1 0 85.333333h-85.333333v42.666667a42.666667 42.666667 0 1 1-85.333334 0v-42.666667h-85.333333a42.666667 42.666667 0 1 1 0-85.333333h85.333333v-42.666667h-85.333333a42.666667 42.666667 0 1 1 0-85.333333h67.648l-76.48-76.501333a42.666667 42.666667 0 0 1 57.621333-62.826667z"
          p-id="38815"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  RmbOutlined.displayName = 'RmbOutlined'
}
