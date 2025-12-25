
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-withdraw-outlined')

export const WithdrawOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6949"  ><path d="M261.610667 154.197333a38.4 38.4 0 0 1 54.314666 54.293334L232.106667 292.266667h408.64c156.714667 0 283.733333 127.04 283.733333 283.733333 0 156.693333-127.04 283.733333-283.733333 283.733333h-458.666667a38.4 38.4 0 0 1 0-76.8h458.666667c114.282667 0 206.933333-92.650667 206.933333-206.933333 0-114.282667-92.650667-206.933333-206.933333-206.933333H229.12l86.826667 86.826666a38.4 38.4 0 0 1-54.314667 54.272l-150.826667-150.826666a38.4 38.4 0 0 1-2.645333-51.413334l2.645333-2.901333 150.826667-150.826667z"  p-id="6950"></path></svg>
    )
  }
)

if (__DEV__) {
  WithdrawOutlined.displayName = 'WithdrawOutlined'
}
  