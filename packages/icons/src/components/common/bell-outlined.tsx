
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-bell-outlined')

export const BellOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M298.666667 853.333333a128 128 0 0 1-128-128V426.666667c0-188.522667 152.810667-341.333333 341.333333-341.333334s341.333333 152.810667 341.333333 341.333334v298.666666a128 128 0 0 1-128 128h-128a85.333333 85.333333 0 1 1-170.666666 0h-128zM512 170.666667c-139.2 0-252.458667 111.125333-255.914667 249.493333L256 426.666667v298.666666a42.666667 42.666667 0 0 0 39.466667 42.56L298.666667 768h426.666666a42.666667 42.666667 0 0 0 42.56-39.466667L768 725.333333V426.666667c0-141.376-114.624-256-256-256z" p-id="39165"></path></svg>
    )
  }
)

if (__DEV__) {
  BellOutlined.displayName = 'BellOutlined'
}
  