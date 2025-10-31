
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-alarm-outlined')

export const AlarmOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11288"  ><path d="M550.4 549.333333a38.4 38.4 0 1 1-76.8 0v-170.666666a38.4 38.4 0 1 1 76.8 0v170.666666zM554.666667 694.4a42.666667 42.666667 0 1 1-85.333334 0 42.666667 42.666667 0 0 1 85.333334 0z" p-id="11289"></path><path d="M793.6 453.333333c0-155.52-126.08-281.6-281.6-281.6-155.52 0-281.6 126.08-281.6 281.6v405.333334H153.6v-405.333334c0-197.930667 160.469333-358.4 358.4-358.4s358.4 160.469333 358.4 358.4v405.333334h-76.8v-405.333334z" p-id="11290"></path><path d="M917.333333 852.266667a38.4 38.4 0 1 1 0 76.8H106.666667a38.4 38.4 0 1 1 0-76.8h810.666666z" p-id="11291"></path></svg>
    )
  }
)

if (__DEV__) {
  AlarmOutlined.displayName = 'AlarmOutlined'
}
  