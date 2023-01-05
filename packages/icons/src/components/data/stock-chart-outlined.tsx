
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-stock-chart-outlined')

export const StockChartOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}    viewBox="0 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g id="icon/01-line/stock-chart" stroke="none" >
        <path d="M35,4 C36.1045695,4 37,4.8954305 37,6 L37,12 L39,12 C41.209139,12 43,13.790861 43,16 L43,16 L43,35 C43,37.209139 41.209139,39 39,39 L39,39 L37,39 L37,43 C37,44.1045695 36.1045695,45 35,45 C33.8954305,45 33,44.1045695 33,43 L33,39 L31,39 C28.8578046,39 27.1089211,37.3160315 27.0048953,35.1996403 L27,35 L27,17 C27,14.790861 28.790861,12 31,12 L31,12 L33,12 L33,6 C33,4.8954305 33.8954305,4 35,4 Z M13,11 C14.1045695,11 15,11.8954305 15,13 L15,17 L17,17 C19.1421954,17 20.8910789,18.6839685 20.9951047,20.8003597 L21,21 L21,32 C21,34.209139 19.209139,36 17,36 L17,36 L15,36 L15,36 L15,39 C15,40.1045695 14.1045695,41 13,41 C11.8954305,41 11,40.1045695 11,39 L11,36 L9,36 C6.790861,36 5,34.209139 5,32 L5,32 L5,21 C5,18.790861 6.790861,17 9,17 L9,17 L11,17 L11,13 C11,11.8954305 11.8954305,11 13,11 Z M39,16 L31,16 L31,35 L39,35 L39,16 Z M17,21 L9,21 L9,32 L17,32 L17,21 Z" id="形状结合" ></path>
    </g>
</svg>
    )
  }
)

if (__DEV__) {
  StockChartOutlined.displayName = 'StockChartOutlined'
}
  