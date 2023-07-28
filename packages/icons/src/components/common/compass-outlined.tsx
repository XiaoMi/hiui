
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-compass-outlined')

export const CompassOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"  ><path d="M938.666667 512c0-235.648-191.018667-426.666667-426.666667-426.666667S85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667zM170.666667 512c0-188.522667 152.810667-341.333333 341.333333-341.333333s341.333333 152.810667 341.333333 341.333333-152.810667 341.333333-341.333333 341.333333S170.666667 700.522667 170.666667 512z m490.24-178.666667a42.666667 42.666667 0 0 0-68.629334-39.616l-180.565333 142.08a42.666667 42.666667 0 0 0-15.850667 27.456l-32.768 227.413334a42.666667 42.666667 0 0 0 68.629334 39.616l180.565333-142.08a42.666667 42.666667 0 0 0 15.850667-27.456l32.768-227.413334z m-198.122667 263.936l15.104-104.96 83.328-65.557333-15.104 104.96-83.328 65.557333z" p-id="11470"></path></svg>
    )
  }
)

if (__DEV__) {
  CompassOutlined.displayName = 'CompassOutlined'
}
  