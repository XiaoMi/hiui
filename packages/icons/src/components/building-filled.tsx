
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-building-filled'
const _prefix = getPrefixCls(_role)

export const BuildingFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M888 432a8 8 0 0 1 8 8v520h-140V432h132zM688 64a8 8 0 0 1 8 8v888h-182V732a8 8 0 0 0-7.6-7.99L506 724h-188a8 8 0 0 0-7.99 7.6l-0.01 0.4v228H128l3.964-888.036a8 8 0 0 1 8-7.964H688zM374 460h-56a8 8 0 0 0-7.99 7.6l-0.01 0.4v112a8 8 0 0 0 7.6 7.99l0.4 0.01h56a8 8 0 0 0 7.99-7.6l0.01-0.4v-112a8 8 0 0 0-8-8z m132 0h-56a8 8 0 0 0-7.99 7.6l-0.01 0.4v112a8 8 0 0 0 7.6 7.99l0.4 0.01h56a8 8 0 0 0 7.99-7.6l0.01-0.4v-112a8 8 0 0 0-8-8z m-132-232h-56a8 8 0 0 0-7.99 7.6l-0.01 0.4v112a8 8 0 0 0 7.6 7.99l0.4 0.01h56a8 8 0 0 0 7.99-7.6l0.01-0.4v-112a8 8 0 0 0-8-8z m132 0h-56a8 8 0 0 0-7.99 7.6l-0.01 0.4v112a8 8 0 0 0 7.6 7.99l0.4 0.01h56a8 8 0 0 0 7.99-7.6l0.01-0.4v-112a8 8 0 0 0-8-8z" p-id="11735"></path></svg>
    )
  }
)

if (__DEV__) {
  BuildingFilled.displayName = 'BuildingFilled'
}
  