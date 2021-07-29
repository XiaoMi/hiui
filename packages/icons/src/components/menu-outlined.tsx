
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-menu-outlined'
const _prefix = getPrefixCls(_role)

export const MenuOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M904 812a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h784z m0-340a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h784z m0-340a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V140a8 8 0 0 1 8-8h784z" p-id="11555"></path></svg>
    )
  }
)

if (__DEV__) {
  MenuOutlined.displayName = 'MenuOutlined'
}
  