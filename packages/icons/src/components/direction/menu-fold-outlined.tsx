
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-menu-fold-outlined')

export const MenuFoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M128 789.333333a42.666667 42.666667 0 1 0 0 85.333334h768a42.666667 42.666667 0 1 0 0-85.333334H128z m158.165333-414.165333a42.666667 42.666667 0 0 0-60.330666 0l-106.666667 106.666667-2.496 2.709333a42.666667 42.666667 0 0 0 2.496 57.621333l106.666667 106.666667 2.709333 2.496a42.666667 42.666667 0 0 0 57.621333-2.496l2.496-2.709333a42.666667 42.666667 0 0 0-2.496-57.621334L209.706667 512l76.48-76.501333 2.496-2.709334a42.666667 42.666667 0 0 0-2.496-57.621333zM554.666667 469.333333a42.666667 42.666667 0 1 0 0 85.333334h320a42.666667 42.666667 0 1 0 0-85.333334zM128 149.333333a42.666667 42.666667 0 1 0 0 85.333334h768a42.666667 42.666667 0 1 0 0-85.333334H128z" p-id="49726"></path></svg>
    )
  }
)

if (__DEV__) {
  MenuFoldOutlined.displayName = 'MenuFoldOutlined'
}
  