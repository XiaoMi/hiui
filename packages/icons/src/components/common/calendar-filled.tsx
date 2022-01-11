import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-calendar-filled')

export const CalendarFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M917.333333 533.333333v256a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V533.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h725.333334a42.666667 42.666667 0 0 1 42.666666 42.666666zM106.666667 277.333333a128 128 0 0 1 128-128h85.333333V106.666667a42.666667 42.666667 0 1 1 85.333333 0v42.666666h213.333334V106.666667a42.666667 42.666667 0 1 1 85.333333 0v42.666666h85.333333a128 128 0 0 1 128 128v85.333334a42.666667 42.666667 0 0 1-42.666666 42.666666H149.333333a42.666667 42.666667 0 0 1-42.666666-42.666666v-85.333334z"
          p-id="15051"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  CalendarFilled.displayName = 'CalendarFilled'
}
