
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-direction-down-bold-outlined')

export const DirectionDownBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3943"  ><path d="M421.482667 526.762667a128 128 0 0 0 181.013333 0l256.426667-256.426667a64 64 0 1 0-90.474667-90.517333L512 436.266667 255.530667 179.84a64 64 0 1 0-90.496 90.496l256.426666 256.426667z m0 298.666666a128 128 0 0 0 181.013333 0l256.426667-256.426666a64 64 0 1 0-90.474667-90.517334L512 734.933333 255.530667 478.506667a64 64 0 1 0-90.496 90.496l256.426666 256.426666z" p-id="3944"></path></svg>
    )
  }
)

if (__DEV__) {
  DirectionDownBoldOutlined.displayName = 'DirectionDownBoldOutlined'
}
  