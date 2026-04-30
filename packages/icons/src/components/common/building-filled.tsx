
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-building-filled')

export const BuildingFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7215"  ><path d="M563.562667 101.546667c66.197333-21.674667 134.272 27.648 134.293333 97.301333v669.013333a59.733333 59.733333 0 0 1-59.733333 59.733334H202.666667a102.4 102.4 0 0 1-102.4-102.4V327.616a102.442667 102.442667 0 0 1 70.506666-97.322667L563.562667 101.546667zM313.6 573.44a38.4 38.4 0 0 0 0 76.8h170.666667a38.4 38.4 0 0 0 0-76.8h-170.666667z m0-149.333333a38.4 38.4 0 1 0 0 76.8h170.666667a38.4 38.4 0 0 0 0-76.8h-170.666667z"  p-id="7216"></path><path d="M749.034667 421.610667c0-47.082667 51.605333-75.093333 90.752-51.072l3.754666 2.496 58.709334 42.026666a102.442667 102.442667 0 0 1 42.816 83.264v326.869334c0 56.533333-45.866667 102.4-102.421334 102.4h-33.877333a59.733333 59.733333 0 0 1-59.733333-59.733334V421.610667z"  p-id="7217"></path></svg>
    )
  }
)

if (__DEV__) {
  BuildingFilled.displayName = 'BuildingFilled'
}
  