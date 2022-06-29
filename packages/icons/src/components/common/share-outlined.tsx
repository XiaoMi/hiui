
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-share-outlined')

export const ShareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M320 341.333333a42.666667 42.666667 0 0 1 3.2 85.226667L320 426.666667h-85.333333a42.666667 42.666667 0 0 0-42.56 39.466666L192 469.333333v320a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h554.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333V469.333333a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 426.666667h-85.333333l-3.2-0.106667a42.666667 42.666667 0 0 1 0-85.12L704 341.333333h85.333333a128 128 0 0 1 127.914667 123.2L917.333333 469.333333v320a128 128 0 0 1-123.2 127.914667L789.333333 917.333333H234.666667a128 128 0 0 1-127.914667-123.2L106.666667 789.333333V469.333333a128 128 0 0 1 123.2-127.914666L234.666667 341.333333h85.333333z m164.544-267.328a42.666667 42.666667 0 0 1 57.621333 2.496l149.333334 149.333334 2.496 2.709333a42.666667 42.666667 0 0 1-2.496 57.621333l-2.709334 2.496a42.666667 42.666667 0 0 1-57.621333-2.496L554.666667 209.706667v383.466666a42.666667 42.666667 0 1 1-85.333334 0V209.664l-76.501333 76.501333-2.709333 2.496a42.666667 42.666667 0 0 1-57.621334-62.826666l149.333334-149.333334z" p-id="39005"></path></svg>
    )
  }
)

if (__DEV__) {
  ShareOutlined.displayName = 'ShareOutlined'
}
  