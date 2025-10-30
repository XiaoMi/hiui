
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-columns-outlined')

export const ColumnsOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25249"  ><path d="M829.909333 224a25.6 25.6 0 0 0-25.6-25.6h-576a25.6 25.6 0 0 0-25.6 25.6v576a25.6 25.6 0 0 0 25.6 25.6h576a25.6 25.6 0 0 0 25.6-25.6v-576z m76.8 576a102.4 102.4 0 0 1-102.4 102.4h-576a102.4 102.4 0 0 1-102.4-102.4v-576a102.4 102.4 0 0 1 102.4-102.4h576a102.4 102.4 0 0 1 102.4 102.4v576z" p-id="25250"></path><path d="M360.576 853.333333V170.666667a38.4 38.4 0 1 1 76.8 0v682.666666a38.4 38.4 0 1 1-76.8 0zM595.242667 853.333333V170.666667a38.4 38.4 0 1 1 76.8 0v682.666666a38.4 38.4 0 1 1-76.8 0z" p-id="25251"></path></svg>
    )
  }
)

if (__DEV__) {
  ColumnsOutlined.displayName = 'ColumnsOutlined'
}
  