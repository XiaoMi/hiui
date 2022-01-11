import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-edit-filled')

export const EditFilled = forwardRef<SVGSVGElement | null, IconProps>(
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
          d="M874.666667 832a42.666667 42.666667 0 1 1 0 85.333333H149.333333a42.666667 42.666667 0 1 1 0-85.333333h725.333334zM830.741333 143.850667l45.248 45.248a128 128 0 0 1 0 181.013333L501.248 744.874667a85.333333 85.333333 0 0 1-60.352 25.002666h-148.266667a42.666667 42.666667 0 0 1-42.666666-42.666666v-148.266667a85.333333 85.333333 0 0 1 25.002666-60.352L649.728 143.850667a128 128 0 0 1 181.013333 0z"
          p-id="44766"
        ></path>
      </svg>
    )
  }
)

if (__DEV__) {
  EditFilled.displayName = 'EditFilled'
}
