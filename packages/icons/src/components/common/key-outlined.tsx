
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-key-outlined')

export const KeyOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M904.832 119.168a42.666667 42.666667 0 0 1 2.496 57.621333l-2.496 2.709334-333.482667 333.504A254.826667 254.826667 0 0 1 618.666667 661.333333c0 141.376-114.624 256-256 256S106.666667 802.709333 106.666667 661.333333s114.624-256 256-256c55.296 0 106.474667 17.536 148.330666 47.317334l105.984-106.005334-51.114666-51.093333a42.666667 42.666667 0 1 1 60.352-60.352l51.093333 51.114667 46.336-46.336-51.114667-51.093334a42.666667 42.666667 0 1 1 60.352-60.352l51.093334 51.114667 60.522666-60.48a42.666667 42.666667 0 0 1 60.330667 0zM362.666667 490.666667a170.666667 170.666667 0 1 0 128.789333 58.688 42.666667 42.666667 0 0 1-16.853333-16.810667A169.728 169.728 0 0 0 362.666667 490.666667z" p-id="39575"></path></svg>
    )
  }
)

if (__DEV__) {
  KeyOutlined.displayName = 'KeyOutlined'
}
  