
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-move-outlined')

export const MoveOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22661"  ><path d="M878.976 849.066667a38.4 38.4 0 1 0 0-76.8h-725.333333a38.4 38.4 0 1 0 0 76.8h725.333333zM878.976 251.733333a38.4 38.4 0 1 0 0-76.8h-725.333333a38.4 38.4 0 1 0 0 76.8h725.333333zM878.976 550.4a38.4 38.4 0 1 0 0-76.8h-725.333333a38.4 38.4 0 1 0 0 76.8h725.333333z" p-id="22662"></path></svg>
    )
  }
)

if (__DEV__) {
  MoveOutlined.displayName = 'MoveOutlined'
}
  