
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-eye-outlined')

export const EyeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16715"  ><path d="M353.216 224.597333a391.04 391.04 0 0 1 326.186667 0 508.586667 508.586667 0 0 1 180.586666 139.072l79.68 96.853334a81.066667 81.066667 0 0 1 0 102.976l-79.68 96.853333a508.586667 508.586667 0 0 1-180.565333 139.050667 391.04 391.04 0 0 1-326.208 0 508.586667 508.586667 0 0 1-180.565333-139.072l-79.701334-96.832a81.066667 81.066667 0 0 1 0-102.997334l79.701334-96.832a508.586667 508.586667 0 0 1 180.565333-139.072zM647.381333 294.4a314.24 314.24 0 0 0-262.122666 0 431.829333 431.829333 0 0 0-153.322667 118.08l-79.658667 96.810667a4.266667 4.266667 0 0 0 0 5.418666l79.658667 96.810667A431.829333 431.829333 0 0 0 385.28 729.6a314.24 314.24 0 0 0 262.122667 0 431.829333 431.829333 0 0 0 153.301333-118.08l79.68-96.810667a4.266667 4.266667 0 0 0 0-5.418666l-79.68-96.810667a431.829333 431.829333 0 0 0-153.301333-118.08z" p-id="16716"></path><path d="M605.909333 512a89.6 89.6 0 1 0-179.2 0 89.6 89.6 0 0 0 179.2 0z m76.8 0a166.4 166.4 0 1 1-332.8 0 166.4 166.4 0 0 1 332.8 0z" p-id="16717"></path></svg>
    )
  }
)

if (__DEV__) {
  EyeOutlined.displayName = 'EyeOutlined'
}
  