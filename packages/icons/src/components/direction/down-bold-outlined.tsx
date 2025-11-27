
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-down-bold-outlined')

export const DownBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5683"  ><path d="M165.098667 410.816a64 64 0 1 1 90.496-90.496l256.448 256.426667 256.426666-256.426667a64 64 0 0 1 90.538667 90.496L572.373333 697.429333a85.333333 85.333333 0 0 1-120.661333 0L165.098667 410.816z" p-id="5684"></path></svg>
    )
  }
)

if (__DEV__) {
  DownBoldOutlined.displayName = 'DownBoldOutlined'
}
  