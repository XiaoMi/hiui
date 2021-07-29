
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-menu-unfold-outlined'
const _prefix = getPrefixCls(_role)

export const MenuUnfoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M116 792a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8h528a8 8 0 0 0 8-8v-64a8 8 0 0 0-8-8H116z m0-320a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8h528a8 8 0 0 0 8-8v-64a8 8 0 0 0-8-8H116z m0-320a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8h528a8 8 0 0 0 8-8V160a8 8 0 0 0-8-8H116z m666.794 82.04l-57.588 27.92a8 8 0 0 0-3.708 10.69l117.51 234.114a12 12 0 0 1 0 10.472l-117.51 234.114a8 8 0 0 0 3.708 10.69l57.588 27.92a8 8 0 0 0 10.688-3.708l134.434-269.016a12 12 0 0 0 0-10.472L793.48 237.748a8 8 0 0 0-10.688-3.708z" p-id="13705"></path></svg>
    )
  }
)

if (__DEV__) {
  MenuUnfoldOutlined.displayName = 'MenuUnfoldOutlined'
}
  