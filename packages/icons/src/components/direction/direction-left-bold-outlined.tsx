
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-direction-left-bold-outlined')

export const DirectionLeftBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4378"  ><path d="M497.237333 602.517333a128 128 0 0 1 0-181.034666l256.426667-256.426667a64 64 0 1 1 90.517333 90.496l-256.426666 256.426667 256.426666 256.469333a64 64 0 1 1-90.496 90.496l-256.426666-256.426667z m-298.666666 0a128 128 0 0 1 0-181.034666l256.426666-256.426667a64 64 0 1 1 90.517334 90.496l-256.426667 256.426667 256.426667 256.469333a64 64 0 1 1-90.496 90.496l-256.426667-256.426667z" p-id="4379"></path></svg>
    )
  }
)

if (__DEV__) {
  DirectionLeftBoldOutlined.displayName = 'DirectionLeftBoldOutlined'
}
  