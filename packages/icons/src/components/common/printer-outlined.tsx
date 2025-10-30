
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-printer-outlined')

export const PrinterOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23910"  ><path d="M857.6 629.333333v-277.333333a25.6 25.6 0 0 0-25.6-25.6H192a25.6 25.6 0 0 0-25.6 25.6v277.333333A25.6 25.6 0 0 0 192 654.933333h128v76.8H192a102.4 102.4 0 0 1-102.4-102.4v-277.333333A102.4 102.4 0 0 1 192 249.6h640a102.4 102.4 0 0 1 102.4 102.4v277.333333a102.4 102.4 0 0 1-102.4 102.4h-128v-76.8h128a25.6 25.6 0 0 0 25.6-25.6z" p-id="23911"></path><path d="M697.6 625.066667H326.4v196.266666a25.6 25.6 0 0 0 25.6 25.6h320a25.6 25.6 0 0 0 25.6-25.6v-196.266666z m76.8 196.266666a102.4 102.4 0 0 1-102.4 102.4h-320a102.4 102.4 0 0 1-102.4-102.4v-213.333333a59.733333 59.733333 0 0 1 59.733333-59.733333h405.333334a59.733333 59.733333 0 0 1 59.733333 59.733333v213.333333zM708.266667 202.666667A25.6 25.6 0 0 0 682.666667 177.066667H341.333333a25.6 25.6 0 0 0-25.6 25.6v85.333333h-76.8v-85.333333A102.4 102.4 0 0 1 341.333333 100.266667h341.333334a102.4 102.4 0 0 1 102.4 102.4v85.333333h-76.8v-85.333333z" p-id="23912"></path></svg>
    )
  }
)

if (__DEV__) {
  PrinterOutlined.displayName = 'PrinterOutlined'
}
  