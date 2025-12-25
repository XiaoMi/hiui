
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-call-outlined')

export const CallOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6946"  ><path d="M411.242667 345.536a54.229333 54.229333 0 0 1 82.688 26.154667l19.157333 54.528c5.781333 16.448 1.216 34.773333-11.626667 46.592l-6.037333 5.546666a10.944 10.944 0 0 0-0.32 15.786667l46.613333 46.613333a10.922667 10.922667 0 0 0 15.744-0.341333l5.546667-6.016a43.690667 43.690667 0 0 1 46.634667-11.648l54.506666 19.157333a54.229333 54.229333 0 0 1 26.154667 82.688 124.714667 124.714667 0 0 1-109.717333 51.861334 141.312 141.312 0 0 1-74.112-27.008l-22.08-16.213334a380.437333 380.437333 0 0 1-81.813334-81.770666l-16.192-22.101334a141.354667 141.354667 0 0 1-27.008-74.090666 124.736 124.736 0 0 1 51.861334-109.738667z"  p-id="6947"></path><path d="M785.770667 89.6a102.4 102.4 0 0 1 102.4 102.4v640c0 56.576-45.909333 102.4-102.442667 102.4H273.813333A102.421333 102.421333 0 0 1 171.370667 832V192a102.4 102.4 0 0 1 102.4-102.4h512z m-512 76.8a25.6 25.6 0 0 0-25.6 25.6v640c0 14.101333 11.477333 25.6 25.642666 25.6h511.914667c14.165333 0 25.642667-11.498667 25.642667-25.6V192a25.6 25.6 0 0 0-25.6-25.6h-512z"  p-id="6948"></path></svg>
    )
  }
)

if (__DEV__) {
  CallOutlined.displayName = 'CallOutlined'
}
  