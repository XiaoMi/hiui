
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-phone-3-filled')

export const Phone3Filled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5306"  ><path d="M252.437333 155.029333c72.768-51.989333 175.082667-17.066667 200.896 68.565334l28.586667 94.848a102.421333 102.421333 0 0 1-28.714667 104.896l-15.68 14.4a25.621333 25.621333 0 0 0-0.768 36.949333l109.269334 109.269333a25.6 25.6 0 0 0 36.949333-0.768l14.549333-15.786666a102.4 102.4 0 0 1 104.448-28.885334l91.946667 27.285334c86.208 25.536 121.6 128.384 69.333333 201.536l-10.752 15.082666a264.96 264.96 0 0 1-205.696 110.741334 298.901333 298.901333 0 0 1-187.904-57.642667l-54.805333-40.192a830.933333 830.933333 0 0 1-178.688-178.688l-40.533333-55.274667a301.269333 301.269333 0 0 1-58.197334-186.581333 266.965333 266.965333 0 0 1 111.701334-209.728l14.058666-10.026667z"  p-id="5307"></path><path d="M737.216 167.509333a32 32 0 0 1 45.248 0l105.6 105.6 2.197333 2.410667a32 32 0 0 1-2.197333 42.837333l-105.6 105.6a32 32 0 0 1-45.226667-45.269333l51.136-51.136h-189.610666a32 32 0 0 1 0-64h189.248l-50.773334-50.794667a32 32 0 0 1 0-45.248z"  p-id="5308"></path></svg>
    )
  }
)

if (__DEV__) {
  Phone3Filled.displayName = 'Phone3Filled'
}
  