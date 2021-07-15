
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-rotate-right-outlined'
const _prefix = getPrefixCls(_role)

export const RotateRightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M904 416a8 8 0 0 1 8 8v480a8 8 0 0 1-8 8H264a8 8 0 0 1-8-8V424a8 8 0 0 1 8-8h640z m-72 80H336v336h496V496zM596.742 69.6a4 4 0 0 0-0.8 2.4v70.032l-4.85 0.04C299.6 146.754 64.236 382.4 60 673.998l80.01 0.002c4.246-249.03 206.388-449.856 455.928-451.982l0.004 73.982a4 4 0 0 0 6.4 3.2l149.334-112a4 4 0 0 0 0-6.4l-149.334-112a4 4 0 0 0-5.6 0.8z" p-id="13465"></path></svg>
    )
  }
)

if (__DEV__) {
  RotateRightOutlined.displayName = 'RotateRightOutlined'
}
  