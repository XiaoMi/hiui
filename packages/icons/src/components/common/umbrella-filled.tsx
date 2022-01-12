
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-umbrella-filled')

export const UmbrellaFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64a42.666667 42.666667 0 0 1 42.666667 42.666667v2.218666c201.472 21.077333 359.018667 189.717333 362.602666 395.904L917.333333 512v42.666667a42.666667 42.666667 0 0 1-39.466666 42.56L874.666667 597.333333H554.666667v234.666667a21.333333 21.333333 0 0 0 42.517333 2.496L597.333333 832v-14.784a42.666667 42.666667 0 0 1 85.226667-3.2l0.106667 3.2V832a106.666667 106.666667 0 0 1-213.226667 4.629333L469.333333 832V597.333333H149.333333a42.666667 42.666667 0 0 1-42.56-39.466666L106.666667 554.666667v-42.666667c0-209.450667 158.869333-381.802667 362.666666-403.114667V106.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z" p-id="15451"></path></svg>
    )
  }
)

if (__DEV__) {
  UmbrellaFilled.displayName = 'UmbrellaFilled'
}
  