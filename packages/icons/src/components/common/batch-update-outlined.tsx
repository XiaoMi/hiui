
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-batch-update-outlined')

export const BatchUpdateOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6065"  ><path d="M551.637333 861.333333a38.4 38.4 0 1 1-76.8-0.021333V531.008a38.4 38.4 0 1 1 76.8 0v330.325333z" p-id="6066"></path><path d="M434.986667 663.402667a38.4 38.4 0 1 1-54.314667-54.293334l105.6-105.6a38.4 38.4 0 1 1 54.293333 54.293334l-105.6 105.6z" p-id="6067"></path><path d="M646.144 609.109333a38.4 38.4 0 1 1-54.293333 54.293334l-105.6-105.6a38.4 38.4 0 1 1 54.314666-54.293334l105.6 105.6z" p-id="6068"></path><path d="M829.909333 695.978667v-320a25.6 25.6 0 0 0-25.6-25.6h-576a25.6 25.6 0 0 0-25.6 25.6v320a25.6 25.6 0 0 0 25.6 25.6h90.666667a38.4 38.4 0 1 1 0 76.8h-90.666667a102.4 102.4 0 0 1-102.4-102.4v-320a102.4 102.4 0 0 1 102.4-102.4h576a102.4 102.4 0 0 1 102.4 102.4v320a102.4 102.4 0 0 1-102.4 102.4h-90.666666a38.4 38.4 0 1 1 0-76.8h90.666666a25.6 25.6 0 0 0 25.6-25.6zM228.309333 201.045333a38.4 38.4 0 1 1 0-76.8h576a38.4 38.4 0 1 1 0 76.8h-576z" p-id="6069"></path></svg>
    )
  }
)

if (__DEV__) {
  BatchUpdateOutlined.displayName = 'BatchUpdateOutlined'
}
  