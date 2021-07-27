
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-menu-fold-outlined'
const _prefix = getPrefixCls(_role)

export const MenuFoldOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M908 792a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H380a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h528z m0-320a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H380a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h528z m0-320a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H380a8 8 0 0 1-8-8V160a8 8 0 0 1 8-8h528z m-666.794 82.04l57.588 27.92a8 8 0 0 1 3.708 10.69L184.992 506.764a12 12 0 0 0 0 10.472l117.51 234.114a8 8 0 0 1-3.708 10.69l-57.588 27.92a8 8 0 0 1-10.688-3.708L96.084 517.236a12 12 0 0 1 0-10.472l134.434-269.016a8 8 0 0 1 10.688-3.708z" p-id="13695"></path></svg>
    )
  }
)

if (__DEV__) {
  MenuFoldOutlined.displayName = 'MenuFoldOutlined'
}
  