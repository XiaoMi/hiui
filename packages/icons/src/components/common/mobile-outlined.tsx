
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-mobile-outlined')

export const MobileOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22224"  ><path d="M273.066667 853.333333a25.6 25.6 0 0 0 25.6 25.6h426.666666a25.6 25.6 0 0 0 25.6-25.6V170.666667A25.6 25.6 0 0 0 725.333333 145.066667H298.666667A25.6 25.6 0 0 0 273.066667 170.666667v682.666666zM196.266667 170.666667A102.4 102.4 0 0 1 298.666667 68.266667h426.666666A102.4 102.4 0 0 1 827.733333 170.666667v682.666666a102.4 102.4 0 0 1-102.4 102.4H298.666667A102.4 102.4 0 0 1 196.266667 853.333333V170.666667z" p-id="22225"></path><path d="M512 832a42.666667 42.666667 0 1 1 0-85.333333 42.666667 42.666667 0 0 1 0 85.333333z" p-id="22226"></path></svg>
    )
  }
)

if (__DEV__) {
  MobileOutlined.displayName = 'MobileOutlined'
}
  