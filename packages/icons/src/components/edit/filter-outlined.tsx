
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-filter-outlined')

export const FilterOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8115"  ><path d="M583.232 912V586.624a123.733333 123.733333 0 0 1 59.413333-105.685333l107.925334-65.706667a89.6 89.6 0 0 0 43.029333-76.522667V176a25.6 25.6 0 0 0-25.6-25.6H256a25.6 25.6 0 0 0-25.6 25.6v164.650667c0 30.528 15.573333 58.986667 41.28 75.456l101.589333 65.045333a123.733333 123.733333 0 0 1 57.002667 104.213333V816a38.4 38.4 0 1 1-76.8 0V585.365333a46.933333 46.933333 0 0 0-21.610667-39.530666l-101.589333-65.066667A166.4 166.4 0 0 1 153.6 340.650667V176a102.4 102.4 0 0 1 102.4-102.4h512a102.4 102.4 0 0 1 102.4 102.4v162.709333a166.4 166.4 0 0 1-79.893333 142.165334l-107.946667 65.664a46.933333 46.933333 0 0 0-22.528 40.085333V912a38.4 38.4 0 0 1-76.8 0z"  p-id="8116"></path></svg>
    )
  }
)

if (__DEV__) {
  FilterOutlined.displayName = 'FilterOutlined'
}
  