
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-weighing-outlined')

export const WeighingOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6357"  ><path d="M749.696 356.266667a102.4 102.4 0 0 1 101.12 86.336l54.314667 341.333333a102.4 102.4 0 0 1-101.12 118.464h-575.36a102.4 102.4 0 0 1-101.141334-118.464l54.314667-341.333333a102.4 102.4 0 0 1 101.12-86.314667h466.752z m-466.752 76.8a25.6 25.6 0 0 0-25.28 21.589333l-54.293333 341.333333a25.6 25.6 0 0 0 25.258666 29.632h575.36a25.6 25.6 0 0 0 25.28-29.653333l-54.272-341.333333a25.6 25.6 0 0 0-25.301333-21.546667H282.944zM843.349333 145.728a38.4 38.4 0 0 1 71.274667 28.544l-26.56 66.432a102.4 102.4 0 0 1-95.082667 64.362667H239.658667a102.4 102.4 0 0 1-95.082667-64.362667L118.016 174.272a38.4 38.4 0 0 1 71.274667-28.544l26.602666 66.453333a25.6 25.6 0 0 0 23.765334 16.106667H792.96c10.453333 0 19.882667-6.4 23.765333-16.106667l26.602667-66.453333z" p-id="6358"></path><path d="M587.221333 516.864a38.4 38.4 0 0 1 54.293334 54.293333l-98.048 98.048a38.4 38.4 0 1 1-54.293334-54.293333l98.048-98.048z" p-id="6359"></path></svg>
    )
  }
)

if (__DEV__) {
  WeighingOutlined.displayName = 'WeighingOutlined'
}
  