
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-pin-filled')

export const PinFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27320"  ><path d="M631.808 93.696a38.4 38.4 0 0 1 44.373333 7.146667l246.954667 246.741333a38.4 38.4 0 0 1-32.618667 65.194667l-81.813333-11.733334-132.074667 237.44c15.786667 36.181333 25.514667 72.405333 23.914667 108.458667-1.941333 43.797333-20.352 82.794667-54.997333 117.418667a38.4 38.4 0 0 1-54.293334 0l-188.650666-188.501334-247.466667 247.296a38.4 38.4 0 0 1-54.293333-54.314666l247.424-247.274667-189.184-189.056a38.4 38.4 0 0 1 0-54.314667c34.794667-34.752 75.050667-53.397333 119.125333-55.637333 36.352-1.834667 72.576 7.637333 107.648 24.149333L622.933333 215.402667l-11.904-81.877334a38.4 38.4 0 0 1 20.778667-39.829333z"  p-id="27321"></path></svg>
    )
  }
)

if (__DEV__) {
  PinFilled.displayName = 'PinFilled'
}
  