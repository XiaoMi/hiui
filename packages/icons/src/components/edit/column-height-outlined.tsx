
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-column-height-outlined')

export const ColumnHeightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25104"  ><path d="M868.309333 825.6a38.4 38.4 0 1 1 0 76.8h-704a38.4 38.4 0 1 1 0-76.8h704zM489.024 266.304c15.061333-14.912 39.509333-14.912 54.570667 0l106.666666 105.6c15.061333 14.933333 15.082667 39.125333 0 54.037333-15.061333 14.933333-39.466667 14.912-54.549333 0l-40.810667-40.405333V512c0 1.194667-0.085333 2.346667-0.192 3.52v122.837333l40.810667-40.405333a38.869333 38.869333 0 0 1 54.570667 0c15.061333 14.933333 15.061333 39.104 0 54.016l-106.666667 105.6-2.944 2.645333a38.869333 38.869333 0 0 1-51.626667-2.624l-106.666666-105.6a37.930667 37.930667 0 0 1 0-54.037333c15.04-14.912 39.488-14.912 54.570666 0l41.173334 40.746667V512c0-1.194667 0.064-2.389333 0.170666-3.562667v-123.264l-41.173333 40.746667c-15.082667 14.933333-39.509333 14.933333-54.570667 0a37.930667 37.930667 0 0 1 0-53.994667l106.666667-105.6zM868.309333 121.6a38.4 38.4 0 1 1 0 76.8h-704a38.4 38.4 0 1 1 0-76.8h704z"  p-id="25105"></path></svg>
    )
  }
)

if (__DEV__) {
  ColumnHeightOutlined.displayName = 'ColumnHeightOutlined'
}
  