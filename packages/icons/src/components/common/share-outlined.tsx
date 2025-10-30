
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-share-outlined')

export const ShareOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25457"  ><path d="M551.637333 529.152a38.4 38.4 0 1 1-76.8 0V156.16a38.4 38.4 0 1 1 76.8 0v372.992z"  p-id="25458"></path><path d="M403.349333 320.170667a38.4 38.4 0 1 1-54.293333-54.314667l137.216-137.194667a38.4 38.4 0 1 1 54.293333 54.293334l-137.194666 137.216z"  p-id="25459"></path><path d="M677.674667 265.770667a38.4 38.4 0 1 1-54.293334 54.314666l-137.130666-137.130666a38.4 38.4 0 1 1 54.314666-54.293334l137.109334 137.109334zM829.909333 498.432v305.749333a25.6 25.6 0 0 1-25.6 25.6h-576a25.6 25.6 0 0 1-25.6-25.6V498.432a25.6 25.6 0 0 1 25.6-25.6h69.333334c21.205333 0 40.533333-17.706667 40.533333-38.912 0-21.205333-19.328-37.888-40.533333-37.888h-69.333334a102.4 102.4 0 0 0-102.4 102.4v305.749333a102.4 102.4 0 0 0 102.4 102.4h576a102.4 102.4 0 0 0 102.4-102.4V498.432a102.4 102.4 0 0 0-102.4-102.4h-69.333333a38.4 38.4 0 1 0 0 76.8h69.333333a25.6 25.6 0 0 1 25.6 25.6z"  p-id="25460"></path></svg>
    )
  }
)

if (__DEV__) {
  ShareOutlined.displayName = 'ShareOutlined'
}
  