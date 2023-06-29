
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-shield-outlined')

export const ShieldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M507.584 170.389333z m1.066667 0.618667l295.317333 170.496v215.850667a216.746667 216.746667 0 0 1-108.373333 187.733333l-186.944 107.904-186.944-107.925333a216.746667 216.746667 0 0 1-108.373334-187.733334V341.525333l295.317334-170.496z m41.6-74.538667a83.2 83.2 0 0 0-83.2 0L169.6 268.202667A83.2 83.2 0 0 0 128 340.266667v217.088a302.08 302.08 0 0 0 151.04 261.610666l188.010667 108.565334a83.2 83.2 0 0 0 83.2 0l188.010666-108.565334a302.08 302.08 0 0 0 151.04-261.610666V340.266667a83.2 83.2 0 0 0-41.6-72.042667l-297.450666-171.733333z" p-id="4832"></path><path d="M588.501333 439.168a42.666667 42.666667 0 1 1 60.330667 60.330667l-128 128a42.666667 42.666667 0 0 1-60.330667 0l-85.333333-85.333334a42.666667 42.666667 0 1 1 60.330667-60.330666L490.666667 537.002667l97.834666-97.834667z" p-id="4833"></path></svg>
    )
  }
)

if (__DEV__) {
  ShieldOutlined.displayName = 'ShieldOutlined'
}
  