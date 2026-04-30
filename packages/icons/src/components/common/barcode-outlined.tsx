
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-barcode-outlined')

export const BarcodeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6214"  ><path d="M840.576 352v-85.333333a25.6 25.6 0 0 0-25.6-25.6h-85.333333a38.4 38.4 0 1 1 0-76.8h85.333333a102.4 102.4 0 0 1 102.4 102.4v85.333333a38.4 38.4 0 1 1-76.8 0zM192.042667 352v-85.333333a25.6 25.6 0 0 1 25.6-25.6h85.333333a38.4 38.4 0 1 0 0-76.8h-85.333333a102.4 102.4 0 0 0-102.4 102.4v85.333333a38.4 38.4 0 1 0 76.8 0zM840.576 672v85.333333a25.6 25.6 0 0 1-25.6 25.6h-85.333333a38.4 38.4 0 1 0 0 76.8h85.333333a102.4 102.4 0 0 0 102.4-102.4v-85.333333a38.4 38.4 0 1 0-76.8 0zM192.042667 672v85.333333a25.6 25.6 0 0 0 25.6 25.6h85.333333a38.4 38.4 0 1 1 0 76.8h-85.333333a102.4 102.4 0 0 1-102.4-102.4v-85.333333a38.4 38.4 0 1 1 76.8 0zM477.909333 405.333333a38.4 38.4 0 1 1 76.8 0v213.333334a38.4 38.4 0 1 1-76.8 0V405.333333zM307.242667 405.333333a38.4 38.4 0 1 1 76.8 0v213.333334a38.4 38.4 0 1 1-76.8 0V405.333333zM648.576 405.333333a38.4 38.4 0 1 1 76.8 0v213.333334a38.4 38.4 0 1 1-76.8 0V405.333333z" p-id="6215"></path></svg>
    )
  }
)

if (__DEV__) {
  BarcodeOutlined.displayName = 'BarcodeOutlined'
}
  