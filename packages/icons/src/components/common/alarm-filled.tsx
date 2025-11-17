
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-alarm-filled')

export const AlarmFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23136"  ><path d="M512 94.933333c197.930667 0 358.4 160.469333 358.4 358.4v398.933334H917.333333a38.4 38.4 0 1 1 0 76.8H106.666667a38.4 38.4 0 1 1 0-76.8h46.933333v-398.933334c0-197.930667 160.469333-358.4 358.4-358.4z m0 561.066667a42.666667 42.666667 0 1 0 0 85.333333 42.666667 42.666667 0 0 0 0-85.333333z m0-315.733333a38.4 38.4 0 0 0-38.4 38.4v170.666666a38.4 38.4 0 1 0 76.8 0v-170.666666a38.4 38.4 0 0 0-38.4-38.4z" p-id="23137"></path></svg>
    )
  }
)

if (__DEV__) {
  AlarmFilled.displayName = 'AlarmFilled'
}
  