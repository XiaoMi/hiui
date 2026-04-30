
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-key-outlined')

export const KeyOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20386"  ><path d="M590.933333 640a196.266667 196.266667 0 1 0-392.533333 0 196.266667 196.266667 0 0 0 392.533333 0z m76.8 0c0 150.826667-122.24 273.066667-273.066666 273.066667S121.6 790.826667 121.6 640s122.24-273.066667 273.066667-273.066667S667.733333 489.173333 667.733333 640z" p-id="20387"></path><path d="M836.842667 143.509333a38.4 38.4 0 1 1 54.314666 54.293334l-298.666666 298.666666a38.4 38.4 0 1 1-54.314667-54.293333l298.666667-298.666667z" p-id="20388"></path><path d="M827.157333 207.509333a38.4 38.4 0 1 1-54.314666 54.293334l-85.333334-85.333334a38.4 38.4 0 1 1 54.314667-54.293333l85.333333 85.333333zM720.490667 314.176a38.4 38.4 0 1 1-54.314667 54.293333l-85.333333-85.333333a38.4 38.4 0 1 1 54.314666-54.293333l85.333334 85.333333z" p-id="20389"></path></svg>
    )
  }
)

if (__DEV__) {
  KeyOutlined.displayName = 'KeyOutlined'
}
  