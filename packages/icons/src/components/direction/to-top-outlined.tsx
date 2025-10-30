
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-to-top-outlined')

export const ToTopOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11810"  ><path d="M878.976 187.733333a38.4 38.4 0 1 0 0-76.8h-725.333333a38.4 38.4 0 1 0 0 76.8h725.333333zM313.173333 521.813333a38.4 38.4 0 0 1 0-54.272l160.917334-160.917333a59.733333 59.733333 0 0 1 84.458666 0l160.917334 160.917333a38.4 38.4 0 1 1-54.293334 54.293334l-110.464-110.464V874.666667a38.4 38.4 0 1 1-76.8 0V411.370667l-110.442666 110.464a38.4 38.4 0 0 1-54.293334 0z" p-id="11811"></path></svg>
    )
  }
)

if (__DEV__) {
  ToTopOutlined.displayName = 'ToTopOutlined'
}
  