
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-filter-filled'
const _prefix = getPrefixCls(_role)

export const FilterFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M834.986667 106.666667a42.666667 42.666667 0 0 1 34.858666 67.264L661.333333 469.333333v302.528a85.333333 85.333333 0 0 1-56.64 80.362667l-185.002666 66.069333A42.666667 42.666667 0 0 1 362.666667 878.122667V469.333333L154.154667 173.930667A42.666667 42.666667 0 0 1 189.013333 106.666667h645.973334z" p-id="44716"></path></svg>
    )
  }
)

if (__DEV__) {
  FilterFilled.displayName = 'FilterFilled'
}
  