
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-synchronize-outlined')

export const SynchronizeOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9279"  ><path d="M153.642667 452.266667a38.4 38.4 0 0 1 38.4 38.4c0 193.813333 136.234667 345.6 324.266666 345.6 88.576 0 169.344-33.322667 230.528-88.170667h-44.138666a38.4 38.4 0 0 1 0-76.8h107.733333a59.733333 59.733333 0 0 1 59.733333 59.733333v107.733334a38.4 38.4 0 0 1-76.8 0v-29.269334A420.864 420.864 0 0 1 516.330667 913.066667c-236.117333 0-401.066667-192.064-401.066667-422.4a38.4 38.4 0 0 1 38.4-38.4zM516.309333 110.933333c236.117333 0 401.066667 192.064 401.066667 422.4a38.4 38.4 0 1 1-76.8 0c0-193.813333-136.234667-345.6-324.266667-345.6-88.576 0-169.386667 33.322667-230.570666 88.170667h44.202666a38.4 38.4 0 0 1 0 76.8h-107.733333a59.733333 59.733333 0 0 1-59.733333-59.733333v-107.733334a38.4 38.4 0 0 1 76.8 0v29.226667A420.864 420.864 0 0 1 516.309333 110.933333z"  p-id="9280"></path></svg>
    )
  }
)

if (__DEV__) {
  SynchronizeOutlined.displayName = 'SynchronizeOutlined'
}
  