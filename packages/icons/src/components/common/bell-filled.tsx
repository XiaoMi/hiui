
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-bell-filled')

export const BellFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6778"  ><path d="M194.794667 448c0-164.949333 133.717333-298.666667 298.666666-298.666667h37.056c164.949333 0 298.666667 133.717333 298.666667 298.666667v236.650667a21.333333 21.333333 0 0 0 3.242667 11.306666l23.808 38.165334C882.837333 776.746667 852.181333 832 801.941333 832H222.037333c-50.24 0-80.896-55.253333-54.293333-97.877333l23.829333-38.186667a21.333333 21.333333 0 0 0 3.221334-11.306667V448zM618.666667 832a106.666667 106.666667 0 1 1-213.333334 0h213.333334z" p-id="6779"></path><path d="M565.333333 138.666667a53.333333 53.333333 0 1 1-106.666666 0 53.333333 53.333333 0 0 1 106.666666 0z" p-id="6780"></path></svg>
    )
  }
)

if (__DEV__) {
  BellFilled.displayName = 'BellFilled'
}
  