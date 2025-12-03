
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-down-short-outlined')

export const DownShortOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2556"  ><path d="M473.6 222.186667a38.4 38.4 0 0 1 76.8 0v504.618666L786.538667 490.666667a38.4 38.4 0 1 1 54.293333 54.314666L569.301333 816.490667a81.066667 81.066667 0 0 1-114.624 0L183.146667 544.981333A38.4 38.4 0 1 1 237.44 490.666667L473.6 726.826667V222.165333z" p-id="2557"></path></svg>
    )
  }
)

if (__DEV__) {
  DownShortOutlined.displayName = 'DownShortOutlined'
}
  