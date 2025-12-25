
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-acceptance-outlined')

export const AcceptanceOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10251"  ><path d="M793.642667 158.933333a102.4 102.4 0 0 1 102.4 102.4v576a102.4 102.4 0 0 1-102.4 102.4H238.976a102.4 102.4 0 0 1-102.4-102.4v-576a102.4 102.4 0 0 1 102.4-102.4h117.333333v76.8h-117.333333a25.6 25.6 0 0 0-25.621333 25.6v576c0 14.122667 11.456 25.6 25.621333 25.6h554.624c14.165333 0 25.621333-11.477333 25.621333-25.6v-576a25.6 25.6 0 0 0-25.6-25.6h-117.333333v-76.8h117.333333z" p-id="10252"></path><path d="M638.186667 463.808a38.4 38.4 0 0 1 54.912 53.717333l-156.522667 160a81.066667 81.066667 0 0 1-117.376-1.557333l-64.064-69.098667-15.296-15.296a38.4 38.4 0 1 1 54.293333-54.272l15.466667 15.445334 1.002667 1.045333 64.896 69.930667a4.266667 4.266667 0 0 0 6.186666 0.085333l156.501334-160zM644.309333 84.266667a81.066667 81.066667 0 0 1 81.066667 81.066666v64c0 44.8-36.373333 81.066667-81.109333 81.066667H388.352a81.088 81.088 0 0 1-81.109333-81.066667v-64a81.066667 81.066667 0 0 1 81.066666-81.066666h256z m-256 76.8a4.266667 4.266667 0 0 0-4.266666 4.266666v64c0 2.325333 1.92 4.266667 4.309333 4.266667H644.266667a4.309333 4.309333 0 0 0 4.309333-4.266667v-64a4.266667 4.266667 0 0 0-4.266667-4.266666h-256z" p-id="10253"></path></svg>
    )
  }
)

if (__DEV__) {
  AcceptanceOutlined.displayName = 'AcceptanceOutlined'
}
  