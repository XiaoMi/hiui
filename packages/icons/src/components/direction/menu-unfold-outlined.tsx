
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-menu-unfold-outlined')

export const MenuUnfoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25257"  ><path d="M720.576 513.194667a38.4 38.4 0 0 1 54.314667 0l148.266666 148.245333a38.4 38.4 0 0 1 0 54.314667l-148.266666 148.245333a38.4 38.4 0 0 1-54.314667-54.293333l121.109333-121.130667-121.109333-121.088a38.4 38.4 0 0 1 0-54.293333zM512 804.266667a38.4 38.4 0 1 1 0 76.8H149.333333a38.4 38.4 0 1 1 0-76.8h362.666667zM512 484.266667a38.4 38.4 0 1 1 0 76.8H149.333333a38.4 38.4 0 1 1 0-76.8h362.666667zM881.536 174.933333a38.4 38.4 0 1 1 0 76.8H144.170667a38.4 38.4 0 1 1 0-76.8h737.344z"  p-id="25258"></path></svg>
    )
  }
)

if (__DEV__) {
  MenuUnfoldOutlined.displayName = 'MenuUnfoldOutlined'
}
  