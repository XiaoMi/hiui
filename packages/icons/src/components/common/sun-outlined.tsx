
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-sun-outlined')

export const SunOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8986"  ><path d="M686.933333 511.936a174.933333 174.933333 0 1 0-349.866666 0 174.933333 174.933333 0 0 0 349.866666 0z m76.8 0c0 139.029333-112.704 251.733333-251.733333 251.733333s-251.733333-112.704-251.733333-251.733333 112.725333-251.733333 251.733333-251.733333c139.029333 0 251.733333 112.725333 251.733333 251.733333zM550.4 181.290667a38.4 38.4 0 1 1-76.8 0v-64a38.4 38.4 0 1 1 76.8 0v64zM550.293333 906.709333a38.4 38.4 0 1 1-76.8 0v-64a38.4 38.4 0 1 1 76.8 0v64zM842.730667 550.4a38.4 38.4 0 1 1 0-76.8h64a38.4 38.4 0 1 1 0 76.8h-64zM117.290667 550.293333a38.4 38.4 0 1 1 0-76.8h64a38.4 38.4 0 1 1 0 76.8h-64zM718.72 772.992a38.4 38.4 0 1 1 54.293333-54.293333l45.248 45.269333a38.4 38.4 0 1 1-54.293333 54.293333l-45.248-45.269333zM205.824 259.968a38.4 38.4 0 1 1 54.314667-54.293333l45.226666 45.226666a38.4 38.4 0 1 1-54.272 54.314667l-45.269333-45.248zM251.008 718.72a38.4 38.4 0 1 1 54.293333 54.272l-45.248 45.269333a38.4 38.4 0 1 1-54.293333-54.314666l45.248-45.226667zM764.053333 205.824a38.4 38.4 0 1 1 54.293334 54.293333l-45.248 45.248a38.4 38.4 0 1 1-54.314667-54.293333l45.269333-45.248z" p-id="8987"></path></svg>
    )
  }
)

if (__DEV__) {
  SunOutlined.displayName = 'SunOutlined'
}
  