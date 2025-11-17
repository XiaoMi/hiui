
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-ellipsis-vertical-outlined')

export const EllipsisVerticalOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26499"  ><path d="M494.997333 874.666667a42.666667 42.666667 0 0 1-42.666666-42.666667v-42.666667a42.666667 42.666667 0 0 1 42.666666-42.666666h42.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v42.666667a42.666667 42.666667 0 0 1-42.666667 42.666667h-42.666667zM494.997333 576a42.666667 42.666667 0 0 1-42.666666-42.666667v-42.666666a42.666667 42.666667 0 0 1 42.666666-42.666667h42.666667a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666666a42.666667 42.666667 0 0 1-42.666667 42.666667h-42.666667zM494.997333 277.333333a42.666667 42.666667 0 0 1-42.666666-42.666666V192a42.666667 42.666667 0 0 1 42.666666-42.666667h42.666667a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667a42.666667 42.666667 0 0 1-42.666667 42.666666h-42.666667z" p-id="26500"></path></svg>
    )
  }
)

if (__DEV__) {
  EllipsisVerticalOutlined.displayName = 'EllipsisVerticalOutlined'
}
  