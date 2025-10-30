
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-audio-outlined')

export const AudioOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12223"  ><path d="M708.266667 341.333333a196.266667 196.266667 0 0 0-392.533334 0v106.666667a196.266667 196.266667 0 0 0 392.533334 0v-106.666667z m76.8 106.666667c0 150.826667-122.24 273.066667-273.066667 273.066667-150.805333 0-273.066667-122.24-273.066667-273.066667v-106.666667c0-150.826667 122.261333-273.066667 273.066667-273.066666 150.826667 0 273.066667 122.24 273.066667 273.066666v106.666667z" p-id="12224"></path><path d="M473.6 917.333333v-59.264c-112.576-9.642667-212.928-61.866667-275.562667-153.770666a38.4 38.4 0 1 1 63.445334-43.264C314.688 739.114667 405.333333 782.933333 512 782.933333s197.333333-43.84 250.517333-121.898666a38.4 38.4 0 0 1 63.466667 43.264c-62.634667 91.904-162.986667 144.128-275.584 153.770666V917.333333a38.4 38.4 0 1 1-76.8 0z" p-id="12225"></path></svg>
    )
  }
)

if (__DEV__) {
  AudioOutlined.displayName = 'AudioOutlined'
}
  