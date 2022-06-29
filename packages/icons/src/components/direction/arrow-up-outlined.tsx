
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-arrow-up-outlined')

export const ArrowUpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7523"  ><path d="M268.501333 392.832a42.666667 42.666667 0 0 0 57.621334 2.496l2.709333-2.496L469.333333 252.309333V874.666667a42.666667 42.666667 0 1 0 85.333334 0V252.352l140.501333 140.48a42.666667 42.666667 0 0 0 57.621333 2.496l2.709334-2.496a42.666667 42.666667 0 0 0 2.496-57.621333l-2.496-2.709334-213.333334-213.333333-2.176-2.026667a42.922667 42.922667 0 0 0-0.341333-0.32l2.517333 2.346667a43.157333 43.157333 0 0 0-8.874666-6.826667A42.496 42.496 0 0 0 512 106.666667h-0.64l-1.856 0.064L512 106.666667a43.178667 43.178667 0 0 0-8.938667 0.938666 42.261333 42.261333 0 0 0-18.517333 9.066667l-0.192 0.149333c-0.853333 0.746667-1.706667 1.536-2.517333 2.346667l-213.333334 213.333333a42.666667 42.666667 0 0 0 0 60.330667z" p-id="7524"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowUpOutlined.displayName = 'ArrowUpOutlined'
}
  