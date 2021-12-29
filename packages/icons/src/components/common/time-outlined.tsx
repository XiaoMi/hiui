
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-time-outlined'
const _prefix = getPrefixCls(_role)

export const TimeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 85.333334C323.477333 170.666667 170.666667 323.477333 170.666667 512s152.810667 341.333333 341.333333 341.333333 341.333333-152.810667 341.333333-341.333333S700.522667 170.666667 512 170.666667z m0 85.333333a42.666667 42.666667 0 0 1 42.56 39.466667L554.666667 298.666667v213.333333a42.666667 42.666667 0 0 1-9.962667 27.392l-2.538667 2.773333-149.333333 149.333334a42.666667 42.666667 0 0 1-62.826667-57.621334l2.496-2.709333L469.333333 494.293333V298.666667a42.666667 42.666667 0 0 1 39.466667-42.56L512 256z" p-id="39045"></path></svg>
    )
  }
)

if (__DEV__) {
  TimeOutlined.displayName = 'TimeOutlined'
}
  