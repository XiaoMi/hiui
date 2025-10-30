
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-warning-outlined')

export const WarningOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9892"  ><path d="M423.317333 172.8c39.402667-68.266667 137.962667-68.266667 177.365334 0l332.544 576c39.424 68.266667-9.834667 153.6-88.661334 153.6H179.413333c-78.826667 0-128.085333-85.333333-88.661333-153.6l332.544-576z m110.848 38.4a25.6 25.6 0 0 0-44.330666 0l-332.565334 576a25.6 25.6 0 0 0 22.165334 38.4h665.130666c19.690667 0 32-21.333333 22.165334-38.4l-332.586667-576z" p-id="9893"></path><path d="M550.4 586.666667a38.4 38.4 0 1 1-76.8 0v-170.666667a38.4 38.4 0 1 1 76.8 0v170.666667zM554.666667 704a42.666667 42.666667 0 1 1-85.333334 0 42.666667 42.666667 0 0 1 85.333334 0z" p-id="9894"></path></svg>
    )
  }
)

if (__DEV__) {
  WarningOutlined.displayName = 'WarningOutlined'
}
  