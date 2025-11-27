
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-arrow-left-outlined')

export const ArrowLeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2491"  ><path d="M397.781333 245.909333a38.4 38.4 0 0 0-54.293333 0L123.882667 465.493333a59.733333 59.733333 0 0 0 0 84.48l219.605333 219.562667a38.4 38.4 0 1 0 54.293333-54.293333L228.650667 546.133333h645.056a38.4 38.4 0 1 0 0-76.8H228.693333l169.109334-169.109333a38.4 38.4 0 0 0 0-54.293333z" p-id="2492"></path></svg>
    )
  }
)

if (__DEV__) {
  ArrowLeftOutlined.displayName = 'ArrowLeftOutlined'
}
  