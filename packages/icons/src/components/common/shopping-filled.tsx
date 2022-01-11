import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-shopping-filled')

export const ShoppingFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M512 106.666667a170.666667 170.666667 0 0 1 170.581333 165.333333L682.666667 277.333333h106.666666c70.698667 0 128 53.717333 128 120v400C917.333333 863.616 860.032 917.333333 789.333333 917.333333H234.666667c-70.698667 0-128-53.717333-128-120v-400C106.666667 331.050667 163.968 277.333333 234.666667 277.333333h106.666666a170.666667 170.666667 0 0 1 170.666667-170.666666z m0 85.333333a85.333333 85.333333 0 0 0-85.226667 81.066667L426.666667 277.333333h170.666666a85.333333 85.333333 0 0 0-85.333333-85.333333z"
          p-id="15351"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ShoppingFilled.displayName = 'ShoppingFilled'
}
