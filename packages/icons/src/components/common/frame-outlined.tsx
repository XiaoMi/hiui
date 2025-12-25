
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-frame-outlined')

export const FrameOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6065"  ><path d="M145.066667 549.333333a25.6 25.6 0 0 0 25.6 25.6h682.666666a25.6 25.6 0 0 0 25.6-25.6v-320a25.6 25.6 0 0 0-25.6-25.6H170.666667a25.6 25.6 0 0 0-25.6 25.6v320z m-76.8-320A102.4 102.4 0 0 1 170.666667 126.933333h682.666666a102.4 102.4 0 0 1 102.4 102.4v320a102.4 102.4 0 0 1-102.4 102.4H170.666667a102.4 102.4 0 0 1-102.4-102.4v-320z" p-id="6066"></path><path d="M128 502.4v-76.8h757.333333v76.8H128zM228.842667 747.157333a38.4 38.4 0 0 1 54.314666-54.314666 128.917333 128.917333 0 0 1 0 182.314666 38.4 38.4 0 1 1-54.314666-54.314666c20.352-20.352 20.352-53.333333 0-73.685334zM473.6 858.666667v-138.666667a38.4 38.4 0 1 1 76.8 0v138.666667a38.4 38.4 0 1 1-76.8 0zM796.202667 747.157333a38.4 38.4 0 0 0-54.314667-54.314666 128.917333 128.917333 0 0 0 0 182.314666 38.4 38.4 0 1 0 54.314667-54.314666 52.096 52.096 0 0 1 0-73.685334z" p-id="6067"></path></svg>
    )
  }
)

if (__DEV__) {
  FrameOutlined.displayName = 'FrameOutlined'
}
  