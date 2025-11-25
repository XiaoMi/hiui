
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-arrow-down-bold-outlined')

export const ArrowDownBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4523"  ><path d="M232.106667 605.376a64 64 0 0 0 0 90.496l219.584 219.605333a85.333333 85.333333 0 0 0 120.661333 0l219.584-219.605333a64 64 0 1 0-90.496-90.496L576 730.794667V147.541333a64 64 0 1 0-128 0v583.232l-125.397333-125.397333a64 64 0 0 0-90.496 0z" p-id="4524"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowDownBoldOutlined.displayName = 'ArrowDownBoldOutlined'
}
  