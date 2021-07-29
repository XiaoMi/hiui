
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-duplicate-filled'
const _prefix = getPrefixCls(_role)

export const DuplicateFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M760 256a8 8 0 0 1 8 8v640a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V264a8 8 0 0 1 8-8h640z m144-144a8 8 0 0 1 8 8v664a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V192H240a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h664zM472 416h-64a8 8 0 0 0-8 8l-0.002 119.998L280 544a8 8 0 0 0-8 8v64a8 8 0 0 0 8 8l119.998-0.002L400 744a8 8 0 0 0 8 8h64a8 8 0 0 0 8-8l-0.002-120.002L600 624a8 8 0 0 0 8-8v-64a8 8 0 0 0-8-8l-120.002-0.002L480 424a8 8 0 0 0-8-8z" p-id="12185"></path></svg>
    )
  }
)

if (__DEV__) {
  DuplicateFilled.displayName = 'DuplicateFilled'
}
  