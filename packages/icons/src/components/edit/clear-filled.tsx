
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-clear-filled')

export const ClearFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1326"  ><path d="M811.52 567.936a64 64 0 0 1 64 64V891.733333a64 64 0 0 1-64 64h-152.170667v-202.496a38.4 38.4 0 1 0-76.8 0V955.733333h-135.466666v-202.56a38.4 38.4 0 0 0-76.8 0V955.733333H212.693333a64 64 0 0 1-64-64V631.936a64 64 0 0 1 64-64h598.826667zM554.773333 68.266667c56.533333 0 102.4 45.845333 102.4 102.4v127.018666a25.6 25.6 0 0 0 25.6 25.6h117.269334a102.4 102.4 0 0 1 102.4 102.4v13.909334a64 64 0 0 1-64 64H185.685333a64 64 0 0 1-64-64v-13.909334a102.4 102.4 0 0 1 102.4-102.4h117.376a25.6 25.6 0 0 0 25.6-25.6V170.688a102.442667 102.442667 0 0 1 102.4-102.442667h85.312z" p-id="1327"></path></svg>
    )
  }
)

if (__DEV__) {
  ClearFilled.displayName = 'ClearFilled'
}
  