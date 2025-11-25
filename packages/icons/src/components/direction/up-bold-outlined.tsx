
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-up-bold-outlined')

export const UpBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5103"  ><path d="M165.056 613.162667a64 64 0 0 0 90.496 90.517333L512 447.253333l256.426667 256.426667a64 64 0 1 0 90.517333-90.496L572.373333 326.528a85.333333 85.333333 0 0 0-120.682666 0L165.056 613.162667z" p-id="5104"></path></svg>
    )
  }
)

if (__DEV__) {
  UpBoldOutlined.displayName = 'UpBoldOutlined'
}
  