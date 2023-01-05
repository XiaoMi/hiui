
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-pie-chart-outlined')

export const PieChartOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}    viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="icon/01-line/pie-chart" stroke="none" >
        <path d="M24,4 C35.045695,4 44,12.954305 44,24 C44,35.045695 35.045695,44 24,44 C12.954305,44 4,35.045695 4,24 C4,12.954305 12.954305,4 24,4 Z M24,8 C15.163444,8 8,15.163444 8,24 C8,32.836556 15.163444,40 24,40 C32.836556,40 40,32.836556 40,24 C40,15.163444 32.836556,8 24,8 Z" id="形状结合" ></path>
        <path d="M24,4 C25.1045695,4 26,4.8954305 26,6 L26,22 L42,22 C43.1045695,22 44,22.8954305 44,24 C44,25.1045695 43.1045695,26 42,26 L24,26 C22.8954305,26 22,25.1045695 22,24 L22,6 C22,4.8954305 22.8954305,4 24,4 Z" id="形状结合" ></path>
    </g>
</svg>
    )
  }
)

if (__DEV__) {
  PieChartOutlined.displayName = 'PieChartOutlined'
}
  