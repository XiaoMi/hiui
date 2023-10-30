
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-robot-outlined')

export const RobotOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M706.581333 466.752a42.666667 42.666667 0 0 0-60.330666 0l-48.661334 48.64a42.666667 42.666667 0 0 0 0.32 60.714667l48.341334 48.32a42.666667 42.666667 0 0 0 60.330666-60.330667l-18.496-18.496 18.496-18.517333a42.666667 42.666667 0 0 0 0-60.330667zM362.666667 469.333333a42.666667 42.666667 0 0 0-42.666667 42.666667v85.333333a42.666667 42.666667 0 1 0 85.333333 0v-85.333333a42.666667 42.666667 0 0 0-42.666666-42.666667z" p-id="15800"></path><path d="M469.333333 128a42.666667 42.666667 0 1 0 0 85.333333v42.666667h-106.666666C197.717333 256 64 389.717333 64 554.666667s133.717333 298.666667 298.666667 298.666666h298.666666c164.949333 0 298.666667-133.717333 298.666667-298.666666s-133.717333-298.666667-298.666667-298.666667h-106.666666v-42.666667a42.666667 42.666667 0 1 0 0-85.333333h-85.333334z m-106.666666 213.333333h298.666666c117.824 0 213.333333 95.509333 213.333334 213.333334s-95.509333 213.333333-213.333334 213.333333H362.666667c-117.824 0-213.333333-95.509333-213.333334-213.333333s95.509333-213.333333 213.333334-213.333334z" p-id="15801"></path></svg>
    )
  }
)

if (__DEV__) {
  RobotOutlined.displayName = 'RobotOutlined'
}
  