
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-up-outlined')

export const UpOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2636"  ><path d="M183.146667 631.274667a38.4 38.4 0 1 0 54.314666 54.314666L512 411.029333l274.538667 274.56a38.4 38.4 0 1 0 54.293333-54.314666L554.24 344.661333a59.733333 59.733333 0 0 0-84.48 0L183.146667 631.274667z" p-id="2637"></path></svg>
    )
  }
)

if (__DEV__) {
  UpOutlined.displayName = 'UpOutlined'
}
  