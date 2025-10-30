
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-umbrella-filled')

export const UmbrellaFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="30905"  ><path d="M512 113.514667c106.346667 0 208.384 42.24 283.605333 117.461333 60.565333 60.586667 98.282667 150.336 111.786667 235.2 9.898667 62.229333-42.026667 108.138667-96.725333 108.138667H571.733333v233.770666a102.421333 102.421333 0 0 1-174.826666 72.405334l-18.730667-18.773334a38.4 38.4 0 0 1 54.293333-54.272l18.752 18.730667a25.6 25.6 0 0 0 43.712-18.090667V574.293333H213.333333c-54.72 0-106.624-45.909333-96.746666-108.16 13.504-84.842667 51.221333-174.592 111.786666-235.178666A401.088 401.088 0 0 1 512 113.514667z"  p-id="30906"></path></svg>
    )
  }
)

if (__DEV__) {
  UmbrellaFilled.displayName = 'UmbrellaFilled'
}
  