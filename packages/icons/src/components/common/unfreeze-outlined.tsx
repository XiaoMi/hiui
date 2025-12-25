
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-unfreeze-outlined')

export const UnfreezeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6651"  ><path d="M878.976 473.6a38.4 38.4 0 1 1 0 76.8h-725.333333a38.4 38.4 0 1 1 0-76.8h725.333333zM553.450667 128a38.4 38.4 0 1 0-76.8 0v266.325333a38.4 38.4 0 1 0 76.8 0V128z" p-id="6652"></path><path d="M436.8 261.930667a38.4 38.4 0 1 0-54.314667 54.293333l105.6 105.6a38.4 38.4 0 1 0 54.293334-54.314667l-105.6-105.6z" p-id="6653"></path><path d="M647.978667 316.224a38.4 38.4 0 1 0-54.293334-54.293333l-105.6 105.6a38.4 38.4 0 0 0 54.293334 54.293333l105.6-105.6zM553.450667 896a38.4 38.4 0 1 1-76.8 0V629.653333a38.4 38.4 0 1 1 76.8 0v266.346667z" p-id="6654"></path><path d="M436.8 762.069333a38.4 38.4 0 1 1-54.314667-54.293333l105.6-105.6a38.4 38.4 0 1 1 54.293334 54.314667l-105.6 105.6z" p-id="6655"></path><path d="M647.978667 707.776a38.4 38.4 0 1 1-54.293334 54.293333l-105.6-105.6a38.4 38.4 0 1 1 54.293334-54.293333l105.6 105.6z" p-id="6656"></path></svg>
    )
  }
)

if (__DEV__) {
  UnfreezeOutlined.displayName = 'UnfreezeOutlined'
}
  