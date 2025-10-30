
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-location-outlined')

export const LocationOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20908"  ><path d="M814.933333 440.106667c0-150.4-132.757333-277.333333-302.933333-277.333334-170.176 0-302.933333 126.933333-302.933333 277.333334 0 81.237333 47.488 167.253333 111.466666 244.906666 63.04 76.48 137.088 138.837333 179.690667 172.032a18.666667 18.666667 0 0 0 23.552 0c42.602667-33.194667 116.650667-95.573333 179.690667-172.053333 63.978667-77.632 111.466667-163.648 111.466666-244.906667z m76.8 0c0 108.650667-61.866667 212.266667-129.024 293.76-68.117333 82.624-147.050667 148.949333-191.744 183.765333a95.424 95.424 0 0 1-117.930666 0c-44.693333-34.837333-123.626667-101.12-191.744-183.786667C194.112 652.373333 132.266667 548.757333 132.266667 440.106667 132.266667 241.770667 305.152 85.973333 512 85.973333c206.848 0 379.733333 155.776 379.733333 354.133334z" p-id="20909"></path><path d="M612.266667 455.04a100.266667 100.266667 0 1 0-200.533334 0 100.266667 100.266667 0 0 0 200.533334 0z m76.8 0a177.066667 177.066667 0 1 1-354.133334 0 177.066667 177.066667 0 0 1 354.133334 0z" p-id="20910"></path></svg>
    )
  }
)

if (__DEV__) {
  LocationOutlined.displayName = 'LocationOutlined'
}
  