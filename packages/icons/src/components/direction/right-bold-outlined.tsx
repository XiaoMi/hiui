
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-right-bold-outlined')

export const RightBoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4813"  ><path d="M410.837333 165.056a64 64 0 0 0-90.517333 90.496L576.746667 512l-256.426667 256.426667a64 64 0 1 0 90.517333 90.517333L697.450667 572.373333a85.333333 85.333333 0 0 0 0-120.682666L410.837333 165.056z" p-id="4814"></path></svg>
    )
  }
)

if (__DEV__) {
  RightBoldOutlined.displayName = 'RightBoldOutlined'
}
  