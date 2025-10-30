
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-warning-filled')

export const WarningFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14886"  ><path d="M179.434667 902.4c-78.826667 0-128.085333-85.333333-88.661334-153.6l332.544-576c39.402667-68.266667 137.962667-68.266667 177.365334 0l332.544 576c39.402667 68.266667-9.856 153.6-88.661334 153.6H179.413333zM469.333333 704a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 0 0-85.333334 0z m4.266667-117.333333a38.4 38.4 0 1 0 76.8 0v-170.666667a38.4 38.4 0 0 0-76.8 0v170.666667z" p-id="14887"></path></svg>
    )
  }
)

if (__DEV__) {
  WarningFilled.displayName = 'WarningFilled'
}
  