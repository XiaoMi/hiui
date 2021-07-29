
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-user-filled'
const _prefix = getPrefixCls(_role)

export const UserFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M772 648c87.482 0 158.566 70.208 159.98 157.354L932 808v136a8 8 0 0 1-8 8H100a8 8 0 0 1-8-8v-136c0-87.482 70.208-158.566 157.354-159.98L252 648h520zM512 88c143.594 0 260 116.406 260 260s-116.406 260-260 260-260-116.406-260-260S368.406 88 512 88z" p-id="12105"></path></svg>
    )
  }
)

if (__DEV__) {
  UserFilled.displayName = 'UserFilled'
}
  