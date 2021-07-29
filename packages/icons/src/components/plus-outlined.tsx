
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-plus-outlined'
const _prefix = getPrefixCls(_role)

export const PlusOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M544 144a8 8 0 0 1 8 8v320h320a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H552v320a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V552H152a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h320V152a8 8 0 0 1 8-8h64z" p-id="13255"></path></svg>
    )
  }
)

if (__DEV__) {
  PlusOutlined.displayName = 'PlusOutlined'
}
  