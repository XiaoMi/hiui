
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-menu-fold-outlined')

export const MenuFoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25402"  ><path d="M874.666667 804.266667a38.4 38.4 0 1 1 0 76.8H149.333333a38.4 38.4 0 0 1 0-76.8h725.333334zM874.666667 484.266667a38.4 38.4 0 1 1 0 76.8H512a38.4 38.4 0 0 1 0-76.8h362.666667zM265.706667 202.666667A38.4 38.4 0 1 1 320 256.96l-121.130667 121.109333L320 499.178667a38.4 38.4 0 0 1-54.293333 54.314666l-148.266667-148.266666a38.4 38.4 0 0 1 0-54.314667l148.266667-148.245333zM877.525333 174.933333a38.4 38.4 0 1 1 0 76.8H507.733333a38.4 38.4 0 0 1 0-76.8h369.792z"  p-id="25403"></path></svg>
    )
  }
)

if (__DEV__) {
  MenuFoldOutlined.displayName = 'MenuFoldOutlined'
}
  