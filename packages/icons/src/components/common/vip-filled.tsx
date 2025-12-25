
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-vip-filled')

export const VipFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5161"  ><path d="M696.96 109.568a102.4 102.4 0 0 1 85.034667 45.354667l160.32 239.018666a102.4 102.4 0 0 1-10.090667 126.784L602.581333 874.986667a123.733333 123.733333 0 0 1-181.162666 0L91.776 520.725333a102.4 102.4 0 0 1-10.090667-126.784l160.32-239.018666a102.4 102.4 0 0 1 85.034667-45.354667h369.92z m-40.490667 405.909333a38.4 38.4 0 0 0-54.272 0l-87.168 87.168a4.266667 4.266667 0 0 1-6.058666 0l-87.168-87.168a38.4 38.4 0 1 0-54.272 54.293334l87.146666 87.168a81.066667 81.066667 0 0 0 114.624 0l87.168-87.168a38.4 38.4 0 0 0 0-54.293334z" p-id="5162"></path></svg>
    )
  }
)

if (__DEV__) {
  VipFilled.displayName = 'VipFilled'
}
  