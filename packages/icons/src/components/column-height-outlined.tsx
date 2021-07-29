
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-column-height-outlined'
const _prefix = getPrefixCls(_role)

export const ColumnHeightOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M904 826a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h784zM514.416 220.432a4 4 0 0 1 0.772 0.772l85.948 113.38a4 4 0 0 1-3.188 6.414H552v342h45.948a4 4 0 0 1 3.188 6.418l-85.948 113.378a4 4 0 0 1-6.376 0l-85.948-113.38a4 4 0 0 1 3.188-6.416H472v-342h-45.948a4 4 0 0 1-3.188-6.416l85.948-113.38a4 4 0 0 1 5.604-0.77zM904 118a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V126a8 8 0 0 1 8-8h784z" p-id="11515"></path></svg>
    )
  }
)

if (__DEV__) {
  ColumnHeightOutlined.displayName = 'ColumnHeightOutlined'
}
  