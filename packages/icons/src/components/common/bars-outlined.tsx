
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-bars-outlined')

export const BarsOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12543"  ><path d="M878.976 174.933333a38.4 38.4 0 1 1 0 76.8h-533.333333a38.4 38.4 0 1 1 0-76.8h533.333333zM196.309333 174.933333a38.4 38.4 0 1 1 0 76.8h-42.666666a38.4 38.4 0 1 1 0-76.8h42.666666zM196.309333 473.6a38.4 38.4 0 1 1 0 76.8h-42.666666a38.4 38.4 0 1 1 0-76.8h42.666666zM196.309333 772.266667a38.4 38.4 0 1 1 0 76.8h-42.666666a38.4 38.4 0 1 1 0-76.8h42.666666zM868.309333 473.6a38.4 38.4 0 1 1 0 76.8h-533.333333a38.4 38.4 0 1 1 0-76.8h533.333333zM868.309333 772.266667a38.4 38.4 0 1 1 0 76.8h-533.333333a38.4 38.4 0 1 1 0-76.8h533.333333z" p-id="12544"></path></svg>
    )
  }
)

if (__DEV__) {
  BarsOutlined.displayName = 'BarsOutlined'
}
  