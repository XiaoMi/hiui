
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-video-camera-filled')

export const VideoCameraFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="31341"  ><path d="M672 164.266667a102.4 102.4 0 0 1 102.4 102.4v63.125333l66.56-19.712c51.968-15.381333 104.106667 23.552 104.106667 77.738667V614.826667c0 54.186667-52.138667 93.12-104.106667 77.738666l-66.56-19.733333v84.48a102.4 102.4 0 0 1-102.4 102.4h-490.666667a102.4 102.4 0 0 1-102.4-102.4v-490.666667a102.4 102.4 0 0 1 102.4-102.4h490.666667z m-426.666667 128a38.4 38.4 0 1 0 0 76.8h106.666667a38.4 38.4 0 1 0 0-76.8h-106.666667z"  p-id="31342"></path></svg>
    )
  }
)

if (__DEV__) {
  VideoCameraFilled.displayName = 'VideoCameraFilled'
}
  