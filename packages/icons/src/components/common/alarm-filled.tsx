
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-alarm-filled')

export const AlarmFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M149.333333 917.333333a42.666667 42.666667 0 1 1 0-85.333333h21.333334V448c0-188.522667 152.810667-341.333333 341.333333-341.333333s341.333333 152.810667 341.333333 341.333333v384h21.333334a42.666667 42.666667 0 1 1 0 85.333333H149.333333z m362.666667-640a42.666667 42.666667 0 1 0 0 85.333334 85.333333 85.333333 0 0 1 85.333333 85.333333v106.666667l0.106667 3.2A42.666667 42.666667 0 0 0 682.666667 554.666667v-106.666667l-0.085334-5.333333A170.666667 170.666667 0 0 0 512 277.333333z" p-id="14861"></path></svg>
    )
  }
)

if (__DEV__) {
  AlarmFilled.displayName = 'AlarmFilled'
}
  