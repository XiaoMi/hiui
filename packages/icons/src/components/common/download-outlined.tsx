
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-download-outlined')

export const DownloadOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16192"  ><path d="M115.242667 794.986667v-192a38.4 38.4 0 1 1 76.8 0v192a25.6 25.6 0 0 0 25.6 25.6h597.333333a25.6 25.6 0 0 0 25.6-25.6v-192a38.4 38.4 0 1 1 76.8 0v192a102.4 102.4 0 0 1-102.4 102.4h-597.333333a102.4 102.4 0 0 1-102.4-102.4z" p-id="16193"></path><path d="M327.829333 447.146667a38.4 38.4 0 0 0 0 54.314666l146.261334 146.24a59.712 59.712 0 0 0 84.458666 0l146.24-146.24a38.4 38.4 0 1 0-54.293333-54.293333l-95.786667 95.786667V164.992a38.4 38.4 0 1 0-76.8 0v377.962667l-95.786666-95.786667a38.4 38.4 0 0 0-54.293334 0z" p-id="16194"></path></svg>
    )
  }
)

if (__DEV__) {
  DownloadOutlined.displayName = 'DownloadOutlined'
}
  