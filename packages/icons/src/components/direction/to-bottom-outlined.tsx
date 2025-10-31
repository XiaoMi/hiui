
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-to-bottom-outlined')

export const ToBottomOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11955"  ><path d="M878.976 836.266667a38.4 38.4 0 1 1 0 76.8h-725.333333a38.4 38.4 0 1 1 0-76.8h725.333333zM313.173333 502.186667a38.4 38.4 0 0 0 0 54.272l160.917334 160.917333a59.733333 59.733333 0 0 0 84.458666 0l160.917334-160.917333a38.4 38.4 0 1 0-54.293334-54.293334l-110.464 110.464V149.333333a38.4 38.4 0 1 0-76.8 0v463.296l-110.442666-110.464a38.4 38.4 0 0 0-54.293334 0z" p-id="11956"></path></svg>
    )
  }
)

if (__DEV__) {
  ToBottomOutlined.displayName = 'ToBottomOutlined'
}
  