
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-check-circle-outlined'
const _prefix = getPrefixCls(_role)

export const CheckCircleOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m0 85.333334C323.477333 170.666667 170.666667 323.477333 170.666667 512s152.810667 341.333333 341.333333 341.333333 341.333333-152.810667 341.333333-341.333333S700.522667 170.666667 512 170.666667z m164.544 180.672a42.666667 42.666667 0 0 1 57.621333 62.826666l-256 256-2.709333 2.496a42.666667 42.666667 0 0 1-57.621333-2.496l-128-128-2.496-2.709333a42.666667 42.666667 0 0 1 2.496-57.621333l2.709333-2.496a42.666667 42.666667 0 0 1 57.621333 2.496L448 579.626667l225.834667-225.813334z" p-id="47641"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckCircleOutlined.displayName = 'CheckCircleOutlined'
}
  