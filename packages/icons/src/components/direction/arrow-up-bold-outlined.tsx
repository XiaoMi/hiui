
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-arrow-up-bold-outlined')

export const ArrowUpBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5393"  ><path d="M232.106667 418.624a64 64 0 0 1 0-90.496L451.690667 108.522667a85.333333 85.333333 0 0 1 120.661333 0.021333L791.936 328.106667a64 64 0 1 1-90.496 90.496L576 293.205333v583.253334a64 64 0 1 1-128 0V293.226667l-125.397333 125.397333a64 64 0 0 1-90.496 0z" p-id="5394"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowUpBoldOutlined.displayName = 'ArrowUpBoldOutlined'
}
  