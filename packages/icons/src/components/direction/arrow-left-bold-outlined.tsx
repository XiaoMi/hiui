
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-arrow-left-bold-outlined')

export const ArrowLeftBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5828"  ><path d="M418.645333 791.914667a64 64 0 0 1-90.496 0L108.544 572.330667a85.333333 85.333333 0 0 1 0-120.661334l219.605333-219.584a64 64 0 1 1 90.496 90.496L293.226667 448h583.253333a64 64 0 0 1 0 128H293.248l125.397333 125.418667a64 64 0 0 1 0 90.496z" p-id="5829"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowLeftBoldOutlined.displayName = 'ArrowLeftBoldOutlined'
}
  