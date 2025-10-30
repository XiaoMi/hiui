
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-camera-outlined')

export const CameraOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14004"  ><path d="M192 319.146667a25.6 25.6 0 0 0-25.6 25.621333V789.333333A25.6 25.6 0 0 0 192 814.933333h640a25.6 25.6 0 0 0 25.6-25.6V344.768a25.6 25.6 0 0 0-25.6-25.6h-99.882667a102.4 102.4 0 0 1-77.589333-35.584l-56.490667-65.621333a25.6 25.6 0 0 0-19.392-8.896h-133.290666a25.6 25.6 0 0 0-19.413334 8.896l-56.469333 65.621333a102.4 102.4 0 0 1-77.589333 35.584H192z m99.882667-76.778667a25.6 25.6 0 0 0 19.392-8.896l56.469333-65.621333A102.4 102.4 0 0 1 445.354667 132.266667h133.290666a102.4 102.4 0 0 1 77.610667 35.584l56.469333 65.621333a25.6 25.6 0 0 0 19.413334 8.896H832a102.4 102.4 0 0 1 102.4 102.4V789.333333a102.4 102.4 0 0 1-102.4 102.4H192A102.4 102.4 0 0 1 89.6 789.333333V344.768a102.4 102.4 0 0 1 102.4-102.4h99.882667z" p-id="14005"></path><path d="M618.666667 550.4a106.666667 106.666667 0 1 0-213.333334 0 106.666667 106.666667 0 0 0 213.333334 0z m76.8 0a183.466667 183.466667 0 1 1-366.976 0 183.466667 183.466667 0 0 1 366.976 0z" p-id="14006"></path></svg>
    )
  }
)

if (__DEV__) {
  CameraOutlined.displayName = 'CameraOutlined'
}
  