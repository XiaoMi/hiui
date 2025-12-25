
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-position-outlined')

export const PositionOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6214"  ><path d="M512 100.266667c276.010667 0 407.125333 339.925333 202.602667 525.269333l-142.805334 129.429333a89.045333 89.045333 0 0 1-119.573333 0l-142.826667-129.429333C104.896 440.192 236.010667 100.266667 512 100.266667z m0 76.8c-205.738667 0-303.488 253.418667-151.04 391.573333l142.805333 129.429333a12.266667 12.266667 0 0 0 16.469334 0l142.805333-129.429333C815.509333 430.506667 717.76 177.066667 512 177.066667z" p-id="6215"></path><path d="M590.933333 405.333333a78.933333 78.933333 0 1 0-157.866666 0 78.933333 78.933333 0 0 0 157.866666 0z m76.8 0a155.733333 155.733333 0 1 1-311.466666 0 155.733333 155.733333 0 0 1 311.466666 0zM277.333333 923.733333a38.4 38.4 0 1 1 0-76.8h469.333334a38.4 38.4 0 1 1 0 76.8H277.333333z" p-id="6216"></path></svg>
    )
  }
)

if (__DEV__) {
  PositionOutlined.displayName = 'PositionOutlined'
}
  