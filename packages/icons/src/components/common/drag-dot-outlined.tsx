
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-drag-dot-outlined')

export const DragDotOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9486"  ><path d="M661.333333 85.333333a64 64 0 0 1 64 64v42.666667a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64V149.333333a64 64 0 0 1 64-64h42.666666zM661.333333 405.333333a64 64 0 0 1 64 64v42.666667a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666667a64 64 0 0 1 64-64h42.666666zM725.333333 789.333333a64 64 0 0 0-64-64h-42.666666a64 64 0 0 0-64 64v42.666667a64 64 0 0 0 64 64h42.666666a64 64 0 0 0 64-64v-42.666667zM405.333333 85.333333a64 64 0 0 1 64 64v42.666667a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64V149.333333a64 64 0 0 1 64-64h42.666666zM405.333333 405.333333a64 64 0 0 1 64 64v42.666667a64 64 0 0 1-64 64h-42.666666a64 64 0 0 1-64-64v-42.666667a64 64 0 0 1 64-64h42.666666zM469.333333 789.333333a64 64 0 0 0-64-64h-42.666666a64 64 0 0 0-64 64v42.666667a64 64 0 0 0 64 64h42.666666a64 64 0 0 0 64-64v-42.666667z" p-id="9487"></path></svg>
    )
  }
)

if (__DEV__) {
  DragDotOutlined.displayName = 'DragDotOutlined'
}
  