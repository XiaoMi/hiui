
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-out-of-stock-outlined')

export const OutOfStockOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6065"  ><path d="M838.741333 494.506667v-69.248c0-8.405333-4.138667-16.277333-11.093333-21.056l-298.666667-205.141334a25.621333 25.621333 0 0 0-29.013333 0l-298.666667 205.141334c-6.933333 4.778667-11.093333 12.672-11.093333 21.12V803.84a25.6 25.6 0 0 0 25.6 25.6h254.72a38.4 38.4 0 1 1 0 76.8h-254.72a102.4 102.4 0 0 1-102.4-102.4V425.301333c0-33.728 16.618667-65.301333 44.416-84.416l298.666667-205.141333a102.4 102.4 0 0 1 115.968 0l298.666666 205.141333a102.336 102.336 0 0 1 44.416 84.373334v69.248a38.4 38.4 0 1 1-76.8 0z" p-id="6066"></path><path d="M763.2 643.221333a38.4 38.4 0 1 1 54.314667-54.293333l90.496 90.517333a38.4 38.4 0 1 1-54.293334 54.293334l-90.517333-90.496z" p-id="6067"></path><path d="M817.493333 824.256a38.4 38.4 0 0 1-54.293333-54.314667l90.517333-90.496a38.4 38.4 0 1 1 54.293334 54.293334l-90.496 90.517333z" p-id="6068"></path><path d="M870.208 668.202667a38.4 38.4 0 0 1 0 76.8h-53.333333a153.706667 153.706667 0 0 0-146.261334 106.517333 38.4 38.4 0 0 1-73.130666-23.488c29.781333-92.693333 116.693333-159.829333 219.392-159.829333h53.333333z" p-id="6069"></path></svg>
    )
  }
)

if (__DEV__) {
  OutOfStockOutlined.displayName = 'OutOfStockOutlined'
}
  