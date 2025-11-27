
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-left-short-bold-outlined')

export const LeftShortBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4958"  ><path d="M801.834667 576a64 64 0 0 0 0-128.021333H358.997333l192.426667-192.426667a64 64 0 1 0-90.496-90.517333L189.397333 436.565333a106.666667 106.666667 0 0 0 0 150.826667l271.530667 271.552a64 64 0 0 0 90.517333-90.517333L359.018667 576h442.816z" p-id="4959"></path></svg>
    )
  }
)

if (__DEV__) {
  LeftShortBoldOutlined.displayName = 'LeftShortBoldOutlined'
}
  