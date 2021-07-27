
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-duplicate-outlined'
const _prefix = getPrefixCls(_role)

export const DuplicateOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M760 256a8 8 0 0 1 8 8v640a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V264a8 8 0 0 1 8-8h640z m-72 80H192v496h496V336z m224 448a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V192H240a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h664a8 8 0 0 1 8 8v664zM472 416a8 8 0 0 1 8 8l-0.002 119.998L600 544a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8l-120.002-0.002L480 744a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8l-0.002-120.002L280 624a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8l119.998-0.002L400 424a8 8 0 0 1 8-8h64z" p-id="11505"></path></svg>
    )
  }
)

if (__DEV__) {
  DuplicateOutlined.displayName = 'DuplicateOutlined'
}
  