
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-truck-outlined'
const _prefix = getPrefixCls(_role)

export const TruckOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M272 912c-71.128 0-128.914-57.124-129.984-127.998L68 784a8 8 0 0 1-8-8V423.24l160.5-88.506V152a8 8 0 0 1 8-8H956a8 8 0 0 1 8 8v624a8 8 0 0 1-8 8h-58.016v0.15C896.832 854.956 839.08 912 768 912c-71.128 0-128.914-57.124-129.984-127.998L401.984 784v0.15C400.832 854.956 343.08 912 272 912z m496-180c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50-22.386-50-50-50z m-496 0c-27.614 0-50 22.386-50 50s22.386 50 50 50 50-22.386 50-50-22.386-50-50-50z m612-508H300.498l0.002 157.976L140 470.48V704h27.99c23.718-31.576 61.48-52 104.01-52 42.532 0 80.292 20.424 104.01 52h287.98c23.718-31.576 61.48-52 104.01-52 42.532 0 80.292 20.424 104.01 52H884V224z m-390 54a8 8 0 0 1 8 8v272H294a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h128v-192a8 8 0 0 1 8-8h64z" p-id="11535"></path></svg>
    )
  }
)

if (__DEV__) {
  TruckOutlined.displayName = 'TruckOutlined'
}
  