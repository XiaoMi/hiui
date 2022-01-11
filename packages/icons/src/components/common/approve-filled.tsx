import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-approve-filled')

export const ApproveFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M746.666667 85.333333a128 128 0 0 1 128 128v597.333334a128 128 0 0 1-128 128H277.333333a128 128 0 0 1-128-128V213.333333a128 128 0 0 1 128-128h469.333334z m-128 576H405.333333a42.666667 42.666667 0 1 0 0 85.333334h213.333334a42.666667 42.666667 0 1 0 0-85.333334z m0-128H405.333333a42.666667 42.666667 0 1 0 0 85.333334h213.333334a42.666667 42.666667 0 1 0 0-85.333334z m52.138666-259.946666a42.666667 42.666667 0 0 0-60.309333-1.322667l-126.442667 121.066667-49.216-47.125334-2.773333-2.432a42.666667 42.666667 0 0 0-56.234667 64.064l78.72 75.392 2.837334 2.496a42.666667 42.666667 0 0 0 56.192-2.496l155.946666-149.333333 2.538667-2.645333a42.666667 42.666667 0 0 0-1.258667-57.664z"
          p-id="14921"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  ApproveFilled.displayName = 'ApproveFilled'
}
