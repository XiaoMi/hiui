
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-arrow-right-bold-outlined')

export const ArrowRightBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5248"  ><path d="M605.397333 791.914667a64 64 0 0 0 90.496 0l219.605334-219.584a85.333333 85.333333 0 0 0 0-120.661334L695.893333 232.085333a64 64 0 1 0-90.496 90.496L730.816 448H147.562667a64 64 0 0 0 0 128h583.232l-125.397334 125.418667a64 64 0 0 0 0 90.496z" p-id="5249"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowRightBoldOutlined.displayName = 'ArrowRightBoldOutlined'
}
  