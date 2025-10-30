
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-camera-filled')

export const CameraFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7796"  ><path d="M578.645333 138.666667a96 96 0 0 1 72.746667 33.365333l56.490667 65.621333a32 32 0 0 0 24.234666 11.114667H832a96 96 0 0 1 96 96V789.333333a96 96 0 0 1-96 96H192A96 96 0 0 1 96 789.333333V344.768a96 96 0 0 1 96-96h99.882667a32 32 0 0 0 24.234666-11.114667l56.490667-65.621333a96 96 0 0 1 72.746667-33.365333h133.290666zM512 384a166.4 166.4 0 1 0 0 332.8A166.4 166.4 0 0 0 512 384z" p-id="7797"></path></svg>
    )
  }
)

if (__DEV__) {
  CameraFilled.displayName = 'CameraFilled'
}
  