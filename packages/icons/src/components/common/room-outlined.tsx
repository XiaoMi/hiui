
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-room-outlined')

export const RoomOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6212"  ><path d="M619.733333 836.352c0 66.133333-61.738667 114.901333-126.08 99.626667l-298.666666-70.933334a102.4 102.4 0 0 1-78.72-99.626666V258.56a102.4 102.4 0 0 1 78.72-99.626667l298.666666-70.933333c64.341333-15.274667 126.08 33.493333 126.08 99.626667v648.704z m-76.8-648.704a25.6 25.6 0 0 0-31.509333-24.896l-298.666667 70.912a25.6 25.6 0 0 0-19.690666 24.917333v506.837334a25.6 25.6 0 0 0 19.690666 24.917333l298.666667 70.912a25.6 25.6 0 0 0 31.509333-24.896V187.648z" p-id="6213"></path><path d="M491.733333 552.533333a38.4 38.4 0 1 1-76.8 0v-81.066666a38.4 38.4 0 1 1 76.8 0v81.066666zM805.333333 806.4h-213.333333a38.4 38.4 0 1 1 0-76.8h213.333333a25.6 25.6 0 0 0 25.6-25.6V320a25.6 25.6 0 0 0-25.6-25.6h-213.333333a38.4 38.4 0 1 1 0-76.8h213.333333a102.4 102.4 0 0 1 102.4 102.4v384a102.4 102.4 0 0 1-102.4 102.4z" p-id="6214"></path></svg>
    )
  }
)

if (__DEV__) {
  RoomOutlined.displayName = 'RoomOutlined'
}
  