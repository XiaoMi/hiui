
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-video-camera-outlined')

export const VideoCameraOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11817"  ><path d="M697.6 266.666667a25.6 25.6 0 0 0-25.6-25.6h-490.666667a25.6 25.6 0 0 0-25.6 25.6v490.666666a25.6 25.6 0 0 0 25.6 25.6h490.666667a25.6 25.6 0 0 0 25.6-25.6v-490.666666z m76.8 490.666666a102.4 102.4 0 0 1-102.4 102.4h-490.666667a102.4 102.4 0 0 1-102.4-102.4v-490.666666a102.4 102.4 0 0 1 102.4-102.4h490.666667a102.4 102.4 0 0 1 102.4 102.4v490.666666z" p-id="11818"></path><path d="M394.666667 313.6a38.4 38.4 0 1 1 0 76.8h-106.666667a38.4 38.4 0 1 1 0-76.8h106.666667zM862.784 618.965333a4.266667 4.266667 0 0 0 5.482667-4.117333V387.84a4.266667 4.266667 0 0 0-5.482667-4.117333l-137.194667 40.682666-21.845333-73.664 137.237333-40.64c51.946667-15.381333 104.085333 23.552 104.085334 77.738667V614.826667c0 54.186667-52.138667 93.12-104.106667 77.738666l-137.216-40.64 21.845333-73.664 137.194667 40.682667z" p-id="11819"></path></svg>
    )
  }
)

if (__DEV__) {
  VideoCameraOutlined.displayName = 'VideoCameraOutlined'
}
  