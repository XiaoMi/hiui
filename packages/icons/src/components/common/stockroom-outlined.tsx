
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-stockroom-outlined')

export const StockroomOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6065"  ><path d="M836.266667 412.693333a25.6 25.6 0 0 0-11.690667-21.482666l-298.666667-193.28a25.621333 25.621333 0 0 0-27.818666 0l-298.666667 193.28a25.6 25.6 0 0 0-11.690667 21.482666v391.850667a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V412.693333z m76.8 391.850667a102.4 102.4 0 0 1-102.4 102.4H213.333333a102.4 102.4 0 0 1-102.4-102.4V412.693333a102.4 102.4 0 0 1 46.784-85.973333l298.666667-193.258667a102.4 102.4 0 0 1 111.232 0l298.666667 193.28a102.4 102.4 0 0 1 46.784 85.973334v391.829333z" p-id="6066"></path><path d="M384 633.877333a21.333333 21.333333 0 0 1 21.333333 21.333334v64a21.333333 21.333333 0 0 1-21.333333 21.333333h-64a21.333333 21.333333 0 0 1-21.333333-21.333333v-64a21.333333 21.333333 0 0 1 21.333333-21.333334h64zM384 463.210667a21.333333 21.333333 0 0 1 21.333333 21.333333v64a21.333333 21.333333 0 0 1-21.333333 21.333333h-64a21.333333 21.333333 0 0 1-21.333333-21.333333v-64a21.333333 21.333333 0 0 1 21.333333-21.333333h64zM554.666667 633.877333a21.333333 21.333333 0 0 1 21.333333 21.333334v64a21.333333 21.333333 0 0 1-21.333333 21.333333h-64a21.333333 21.333333 0 0 1-21.333334-21.333333v-64a21.333333 21.333333 0 0 1 21.333334-21.333334h64z" p-id="6067"></path></svg>
    )
  }
)

if (__DEV__) {
  StockroomOutlined.displayName = 'StockroomOutlined'
}
  