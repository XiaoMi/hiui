
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-upload-outlined')

export const UploadOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11380"  ><path d="M115.242667 790.570667v-192a38.4 38.4 0 1 1 76.8 0v192a25.6 25.6 0 0 0 25.6 25.6h597.333333a25.6 25.6 0 0 0 25.6-25.6v-192a38.4 38.4 0 1 1 76.8 0v192a102.4 102.4 0 0 1-102.4 102.4h-597.333333a102.4 102.4 0 0 1-102.4-102.4z" p-id="11381"></path><path d="M327.829333 349.077333a38.4 38.4 0 0 1 0-54.293333l146.261334-146.261333a59.733333 59.733333 0 0 1 84.458666 0l146.24 146.261333a38.4 38.4 0 1 1-54.293333 54.293333l-95.786667-95.786666v377.941333a38.4 38.4 0 1 1-76.8 0V253.269333l-95.786666 95.786667a38.4 38.4 0 0 1-54.293334 0z" p-id="11382"></path></svg>
    )
  }
)

if (__DEV__) {
  UploadOutlined.displayName = 'UploadOutlined'
}
  