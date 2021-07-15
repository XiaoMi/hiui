
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-users-filled'
const _prefix = getPrefixCls(_role)

export const UsersFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M540 648c87.482 0 158.566 70.208 159.98 157.354L700 808v136a8 8 0 0 1-8 8h-64l-0.08-0.002H152.08L152 952H88a8 8 0 0 1-8-8v-136c0-87.482 70.208-158.566 157.354-159.98L240 648h300z m400 224a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-192a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h192z m0-300a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-192a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h192zM390 116c132.548 0 240 107.452 240 240s-107.452 240-240 240S150 488.548 150 356 257.452 116 390 116z m550 156a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-192a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h192z" p-id="12165"></path></svg>
    )
  }
)

if (__DEV__) {
  UsersFilled.displayName = 'UsersFilled'
}
  