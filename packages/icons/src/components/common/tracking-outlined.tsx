
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-tracking-outlined')

export const TrackingOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6504"  ><path d="M808.576 512c0-161.408-130.858667-292.266667-292.266667-292.266667-161.408 0-292.266667 130.858667-292.266666 292.266667 0 161.408 130.858667 292.266667 292.266666 292.266667 161.408 0 292.266667-130.858667 292.266667-292.266667z m76.8 0c0 203.818667-165.226667 369.066667-369.066667 369.066667-203.818667 0-369.066667-165.226667-369.066666-369.066667s165.248-369.066667 369.066666-369.066667c203.84 0 369.066667 165.226667 369.066667 369.066667z" p-id="6505"></path><path d="M573.909333 512a57.6 57.6 0 1 0-115.2 0 57.6 57.6 0 0 0 115.2 0z m76.8 0a134.4 134.4 0 1 1-268.8 0 134.4 134.4 0 0 1 268.8 0zM793.685333 550.4a38.4 38.4 0 0 1-0.085333-76.8l117.333333-0.106667a38.4 38.4 0 0 1 0.085334 76.8l-117.333334 0.106667zM121.642667 550.4a38.4 38.4 0 1 1 0-76.8h117.333333a38.4 38.4 0 1 1 0 76.8h-117.333333zM477.930667 789.376a38.4 38.4 0 0 1 76.8-0.085333l0.085333 117.333333a38.4 38.4 0 0 1-76.8 0.085333l-0.085333-117.333333zM477.930667 117.333333a38.4 38.4 0 1 1 76.8 0V234.666667a38.4 38.4 0 1 1-76.8 0V117.333333z" p-id="6506"></path></svg>
    )
  }
)

if (__DEV__) {
  TrackingOutlined.displayName = 'TrackingOutlined'
}
  