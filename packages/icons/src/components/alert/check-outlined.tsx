
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-check-outlined')

export const CheckOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M840.832 328.832a42.666667 42.666667 0 0 0-57.621333-62.826667l-2.709334 2.496L405.333333 643.626667l-161.834666-161.813334a42.666667 42.666667 0 0 0-57.621334-2.496l-2.709333 2.496a42.666667 42.666667 0 0 0-2.496 57.621334l2.496 2.709333 192 192a42.666667 42.666667 0 0 0 57.621333 2.496l2.709334-2.496 405.333333-405.333333z" p-id="47651"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckOutlined.displayName = 'CheckOutlined'
}
  