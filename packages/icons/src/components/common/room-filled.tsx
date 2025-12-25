
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-room-filled')

export const RoomFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5014"  ><path d="M493.653333 88.021333c64.341333-15.274667 126.08 33.493333 126.08 99.626667v648.704c0 66.133333-61.738667 114.901333-126.08 99.626667l-298.666666-70.933334a102.4 102.4 0 0 1-78.72-99.626666V258.56a102.4 102.4 0 0 1 78.72-99.626667l298.666666-70.933333zM453.333333 433.066667a38.4 38.4 0 0 0-38.4 38.4v81.066666a38.4 38.4 0 0 0 76.8 0v-81.066666a38.4 38.4 0 0 0-38.4-38.4z"  p-id="5015"></path><path d="M805.333333 217.6a102.4 102.4 0 0 1 102.4 102.4v384a102.4 102.4 0 0 1-102.4 102.4h-85.333333a59.733333 59.733333 0 0 1-59.733333-59.733333V277.333333a59.733333 59.733333 0 0 1 59.733333-59.733333h85.333333z"  p-id="5016"></path></svg>
    )
  }
)

if (__DEV__) {
  RoomFilled.displayName = 'RoomFilled'
}
  