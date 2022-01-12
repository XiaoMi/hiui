
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-column-height-outlined')

export const ColumnHeightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M874.666667 832a42.666667 42.666667 0 1 1 0 85.333333H149.333333a42.666667 42.666667 0 1 1 0-85.333333h725.333334zM484.544 223.338667a42.666667 42.666667 0 0 1 57.621333 2.496l106.666667 106.666666 2.496 2.709334a42.666667 42.666667 0 0 1-2.496 57.621333l-2.709333 2.496a42.666667 42.666667 0 0 1-57.621334-2.496L554.666667 359.04V664.96l33.834666-33.792 2.709334-2.496a42.666667 42.666667 0 0 1 54.912 0l2.709333 2.496 2.496 2.709333a42.666667 42.666667 0 0 1 0 54.912l-2.496 2.709334-106.666667 106.666666-2.709333 2.496a42.666667 42.666667 0 0 1-54.912 0l-2.709333-2.496-106.666667-106.666666-2.496-2.709334a42.666667 42.666667 0 0 1 60.117333-60.117333l2.709334 2.496L469.333333 664.96V358.997333l-33.834666 33.834667-2.709334 2.496a42.666667 42.666667 0 0 1-57.621333-62.826667l106.666667-106.666666zM874.666667 106.666667a42.666667 42.666667 0 1 1 0 85.333333H149.333333a42.666667 42.666667 0 1 1 0-85.333333h725.333334z" p-id="45086"></path></svg>
    )
  }
)

if (__DEV__) {
  ColumnHeightOutlined.displayName = 'ColumnHeightOutlined'
}
  