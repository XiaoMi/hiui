
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
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12688"  ><path d="M249.898667 660.010667c0 8.768-1.92 17.429333-5.653334 25.386666l-17.322666 36.906667a25.6 25.6 0 0 0 23.168 36.48h523.818666a25.6 25.6 0 0 0 23.168-36.48l-17.322666-36.906667a59.690667 59.690667 0 0 1-5.653334-25.386666v-204.16c0-143.445333-118.058667-260.266667-262.101333-260.266667s-262.101333 116.821333-262.101333 260.266667v204.16z m601.002666-3.797334l15.701334 33.450667c31.893333 67.904-17.664 145.92-92.693334 145.92H250.090667c-75.029333 0-124.586667-78.016-92.693334-145.92l15.701334-33.450667v-200.362666c0-186.453333 153.045333-337.066667 338.901333-337.066667s338.901333 150.613333 338.901333 337.066667v200.362666z" p-id="12689"></path><path d="M444.48 807.082667a68.266667 68.266667 0 0 0 136.533333 0h76.8a145.066667 145.066667 0 1 1-290.133333 0h76.8zM565.333333 125.184a53.333333 53.333333 0 1 1-106.666666 0 53.333333 53.333333 0 0 1 106.666666 0z" p-id="12690"></path></svg>
    )
  }
)

if (__DEV__) {
  BellOutlined.displayName = 'BellOutlined'
}
  