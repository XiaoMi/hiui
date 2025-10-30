
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-printer-filled')

export const PrinterFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27638"  ><path d="M682.666667 118.4a102.4 102.4 0 0 1 102.4 102.4v46.933333H832a102.4 102.4 0 0 1 102.4 102.4v277.333334a102.4 102.4 0 0 1-102.4 102.4h-96v-123.733334a21.333333 21.333333 0 0 0-21.333333-21.333333h-405.333334a21.333333 21.333333 0 0 0-21.333333 21.333333v123.733334H192a102.4 102.4 0 0 1-102.4-102.4v-277.333334a102.4 102.4 0 0 1 102.4-102.4h46.933333v-46.933333a102.4 102.4 0 0 1 102.4-102.4h341.333334z m-341.333334 76.8a25.6 25.6 0 0 0-25.6 25.6v46.933333h392.533334v-46.933333a25.6 25.6 0 0 0-25.6-25.6H341.333333z" p-id="27639"></path><path d="M704 530.133333a59.733333 59.733333 0 0 1 59.733333 59.733334v213.333333a102.4 102.4 0 0 1-102.4 102.4H341.333333a102.4 102.4 0 0 1-102.4-102.4v-213.333333a59.733333 59.733333 0 0 1 59.733334-59.733334h405.333333z m-388.266667 273.066667a25.6 25.6 0 0 0 25.6 25.6h320a25.6 25.6 0 0 0 25.6-25.6v-196.266667H315.733333v196.266667z" p-id="27640"></path></svg>
    )
  }
)

if (__DEV__) {
  PrinterFilled.displayName = 'PrinterFilled'
}
  