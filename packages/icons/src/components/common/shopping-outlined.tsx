
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-shopping-outlined')

export const ShoppingOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 106.666667c79.530667 0 146.346667 54.4 165.290667 128H789.333333a128 128 0 0 1 128 128v426.666666a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V362.666667a128 128 0 0 1 128-128h112.042666c18.944-73.6 85.76-128 165.290667-128z m277.333333 213.333333h-106.666666v42.666667a42.666667 42.666667 0 0 1-85.226667 3.2L597.333333 362.666667v-42.666667h-170.666666v42.666667a42.666667 42.666667 0 0 1-85.226667 3.2L341.333333 362.666667v-42.666667h-106.666666a42.666667 42.666667 0 0 0-42.56 39.466667L192 362.666667v426.666666a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h554.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333V362.666667a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 320zM512 192c-31.573333 0-59.157333 17.152-73.92 42.666667h147.84A85.290667 85.290667 0 0 0 512 192z" p-id="38885"></path></svg>
    )
  }
)

if (__DEV__) {
  ShoppingOutlined.displayName = 'ShoppingOutlined'
}
  