
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-location-filled')

export const LocationFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25254"  ><path d="M512 85.973333c206.848 0 379.733333 155.776 379.733333 354.133334 0 108.650667-61.866667 212.266667-129.024 293.76-68.117333 82.624-147.050667 148.949333-191.744 183.765333a95.424 95.424 0 0 1-117.930666 0c-44.693333-34.837333-123.626667-101.12-191.744-183.786667C194.112 652.373333 132.266667 548.757333 132.266667 440.106667 132.266667 241.770667 305.152 85.973333 512 85.973333z m0 209.066667a160 160 0 1 0 0 320 160 160 0 0 0 0-320z" p-id="25255"></path></svg>
    )
  }
)

if (__DEV__) {
  LocationFilled.displayName = 'LocationFilled'
}
  