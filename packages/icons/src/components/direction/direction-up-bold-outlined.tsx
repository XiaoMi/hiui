
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-direction-up-bold-outlined')

export const DirectionUpBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5538"  ><path d="M421.504 497.237333a128 128 0 0 1 181.013333 0l256.426667 256.426667a64 64 0 1 1-90.496 90.517333l-256.426667-256.426666-256.469333 256.426666a64 64 0 1 1-90.496-90.517333l256.426667-256.426667z m0-298.666666a128 128 0 0 1 181.013333 0l256.426667 256.426666a64 64 0 1 1-90.496 90.517334l-256.426667-256.426667-256.469333 256.426667a64 64 0 1 1-90.496-90.517334l256.426667-256.426666z" p-id="5539"></path></svg>
    )
  }
)

if (__DEV__) {
  DirectionUpBoldOutlined.displayName = 'DirectionUpBoldOutlined'
}
  