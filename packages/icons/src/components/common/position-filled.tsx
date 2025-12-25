
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-position-filled')

export const PositionFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5161"  ><path d="M277.333333 934.4a38.4 38.4 0 1 1 0-76.8h469.333334a38.4 38.4 0 1 1 0 76.8H277.333333z" p-id="5162"></path><path d="M512 89.6c171.52 0 315.733333 129.28 315.733333 294.933333 0 88.234667-48.64 171.626667-101.482666 237.141334-53.674667 66.56-116.629333 120.682667-155.072 151.146666a94.890667 94.890667 0 0 1-118.357334 0c-38.442667-30.464-101.397333-84.586667-155.072-151.146666C244.906667 556.16 196.266667 472.746667 196.266667 384.533333 196.266667 218.901333 340.48 89.6 512 89.6z m0 179.456a127.616 127.616 0 1 0 0 255.210667 127.616 127.616 0 0 0 0-255.210667z" p-id="5163"></path></svg>
    )
  }
)

if (__DEV__) {
  PositionFilled.displayName = 'PositionFilled'
}
  