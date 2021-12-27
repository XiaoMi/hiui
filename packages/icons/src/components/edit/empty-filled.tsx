
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-empty-filled'
const _prefix = getPrefixCls(_role)

export const EmptyFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M723.413333 106.666667a85.333333 85.333333 0 0 1 81.365334 59.669333l1.194666 4.117333 100.544 385.28c6.890667 12.309333 10.816 26.496 10.816 41.6v192a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128v-192c0-15.146667 3.946667-29.354667 10.858666-41.664l100.48-385.216a85.333333 85.333333 0 0 1 78.293334-63.68L300.586667 106.666667h422.826666z m0 85.333333H300.586667l-83.477334 320H405.333333a106.666667 106.666667 0 0 0 213.333334 0h188.202666L723.413333 192z" p-id="44706"></path></svg>
    )
  }
)

if (__DEV__) {
  EmptyFilled.displayName = 'EmptyFilled'
}
  