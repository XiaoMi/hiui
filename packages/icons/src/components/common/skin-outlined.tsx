
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-skin-outlined')

export const SkinOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8260"  ><path d="M795.733333 810.666667a102.4 102.4 0 0 1-102.4 102.4h-362.666666a102.4 102.4 0 0 1-102.4-102.4V527.04l-88.96-36.629333a102.4 102.4 0 0 1-48.981334-147.114667l114.944-192.810667A81.066667 81.066667 0 0 1 274.901333 110.933333h86.890667c14.933333 0 29.397333 4.928 41.173333 13.930667l4.906667 4.053333 5.589333 4.949334a153.557333 153.557333 0 0 0 202.666667-4.928l4.906667-4.074667a67.904 67.904 0 0 1 41.173333-13.930667h86.890667a81.066667 81.066667 0 0 1 69.632 39.552l114.944 192.810667a102.4 102.4 0 0 1-48.96 147.114667L795.733333 527.04V810.666667z m-490.666666 0a25.6 25.6 0 0 0 25.6 25.6h362.666666a25.6 25.6 0 0 0 25.6-25.6V515.626667a59.733333 59.733333 0 0 1 36.992-55.232L855.466667 419.413333a25.6 25.6 0 0 0 12.245333-36.757333l-114.944-192.832a4.266667 4.266667 0 0 0-3.669333-2.069333h-83.562667a230.208 230.208 0 0 1-307.072 0h-83.562667a4.266667 4.266667 0 0 0-3.669333 2.069333l-114.944 192.832a25.6 25.6 0 0 0 12.245333 36.757333l99.541334 41.002667A59.733333 59.733333 0 0 1 305.066667 515.626667V810.666667z" p-id="8261"></path></svg>
    )
  }
)

if (__DEV__) {
  SkinOutlined.displayName = 'SkinOutlined'
}
  