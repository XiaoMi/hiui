
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-pie-chart-filled')

export const PieChartFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5163"  ><path d="M474.453333 506.88a42.666667 42.666667 0 0 0 42.666667 42.666667h427.093333c-19.434667 221.184-205.12 394.666667-431.36 394.666666-239.168 0-433.066667-193.898667-433.066666-433.066666 0-226.24 173.482667-411.925333 394.666666-431.36v427.093333z" p-id="5164"></path><path d="M551.253333 79.786667c208.533333 18.325333 374.634667 184.426667 392.96 392.96H551.253333V79.786667z" p-id="5165"></path></svg>
    )
  }
)

if (__DEV__) {
  PieChartFilled.displayName = 'PieChartFilled'
}
  