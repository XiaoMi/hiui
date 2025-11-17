
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-pad-filled')

export const PadFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26739"  ><path d="M810.666667 170.666667a128 128 0 0 1 128 128v426.666666a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V298.666667a128 128 0 0 1 128-128h597.333334z m-4.8 288a53.333333 53.333333 0 1 0 0 106.666666 53.333333 53.333333 0 0 0 0-106.666666z"  p-id="26740"></path></svg>
    )
  }
)

if (__DEV__) {
  PadFilled.displayName = 'PadFilled'
}
  