
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-line-chart-outlined')

export const LineChartOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10211"  ><path d="M900.309333 781.013333a38.4 38.4 0 1 1 0 76.8h-768a38.4 38.4 0 1 1 0-76.8h768zM850.56 180.330667a38.4 38.4 0 0 1 59.52 48.490666L647.914667 550.848a59.733333 59.733333 0 0 1-95.914667-4.394667L386.325333 299.946667 183.829333 557.589333a38.4 38.4 0 0 1-60.373333-47.466666l216.981333-276.053334 2.410667-2.901333a59.733333 59.733333 0 0 1 94.122667 6.485333l165.930666 246.826667L850.538667 180.330667z" p-id="10212"></path></svg>
    )
  }
)

if (__DEV__) {
  LineChartOutlined.displayName = 'LineChartOutlined'
}
  