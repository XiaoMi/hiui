
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-left-short-outlined')

export const LeftShortOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2927"  ><path d="M801.834667 550.4a38.4 38.4 0 0 0 0-76.8H297.173333L533.333333 237.44a38.4 38.4 0 1 0-54.293333-54.293333L207.509333 454.677333a81.066667 81.066667 0 0 0 0 114.645334l271.530667 271.530666A38.4 38.4 0 1 0 533.333333 786.56L297.173333 550.4h504.661334z" p-id="2928"></path></svg>
    )
  }
)

if (__DEV__) {
  LeftShortOutlined.displayName = 'LeftShortOutlined'
}
  