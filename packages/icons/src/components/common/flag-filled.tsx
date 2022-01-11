import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-flag-filled')

export const FlagFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M192 874.666667a42.666667 42.666667 0 1 1-85.333333 0V149.333333a42.666667 42.666667 0 1 1 85.333333 0h405.333333a128.042667 128.042667 0 0 1 126.229334 106.666667H832a85.333333 85.333333 0 0 1 85.333333 85.333333v298.666667a85.333333 85.333333 0 0 1-85.333333 85.333333H576a128.042667 128.042667 0 0 1-126.229333-106.666666H192v256z"
          p-id="15081"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  FlagFilled.displayName = 'FlagFilled'
}
