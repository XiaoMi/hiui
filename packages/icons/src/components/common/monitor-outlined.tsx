
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-monitor-outlined')

export const MonitorOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="22370"  ><path d="M187.733333 640a25.6 25.6 0 0 0 25.6 25.6h597.333334a25.6 25.6 0 0 0 25.6-25.6V234.666667A25.6 25.6 0 0 0 810.666667 209.066667H213.333333A25.6 25.6 0 0 0 187.733333 234.666667v405.333333zM110.933333 234.666667A102.4 102.4 0 0 1 213.333333 132.266667h597.333334a102.4 102.4 0 0 1 102.4 102.4v405.333333a102.4 102.4 0 0 1-102.4 102.4H213.333333A102.4 102.4 0 0 1 110.933333 640V234.666667zM384 891.733333a38.4 38.4 0 1 1 0-76.8h256a38.4 38.4 0 1 1 0 76.8H384z" p-id="22371"></path><path d="M473.6 704a38.4 38.4 0 1 1 76.8 0v149.333333a38.4 38.4 0 1 1-76.8 0v-149.333333z" p-id="22372"></path></svg>
    )
  }
)

if (__DEV__) {
  MonitorOutlined.displayName = 'MonitorOutlined'
}
  