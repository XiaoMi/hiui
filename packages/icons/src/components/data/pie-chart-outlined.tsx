
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
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10356"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m38.4 394.666667h315.797333C848.426667 307.52 716.48 175.573333 550.4 157.781333V473.6zM155.733333 512c0 196.757333 159.509333 356.266667 356.266667 356.266667 183.786667 0 335.061333-139.178667 354.197333-317.866667H516.266667a42.666667 42.666667 0 0 1-42.666667-42.666667V157.781333C294.890667 176.938667 155.733333 328.213333 155.733333 512z" p-id="10357"></path></svg>
    )
  }
)

if (__DEV__) {
  PieChartOutlined.displayName = 'PieChartOutlined'
}
  