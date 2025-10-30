
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-check-outlined')

export const CheckOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="40972"  ><path d="M822.442667 257.493333a38.4 38.4 0 0 1 55.488 53.077334L475.093333 731.989333a81.066667 81.066667 0 0 1-117.205333 0l-203.136-212.48a38.4 38.4 0 0 1 55.509333-53.098666l203.136 212.501333a4.266667 4.266667 0 0 0 6.186667 0L822.421333 257.493333z" p-id="40973"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckOutlined.displayName = 'CheckOutlined'
}
  