
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-filter-filled'
const _prefix = getPrefixCls(_role)

export const FilterFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M890.676 86H133.43a56 56 0 0 0-30.986 9.354l-0.766 0.518C76.544 113.16 69.84 147.48 86.784 172.986l280.348 422.05v233.428a48 48 0 0 0 31.08 44.92l196.376 73.972a48 48 0 0 0 16.92 3.08h0.794c26.144-0.428 47.206-21.754 47.206-48l-0.002-307.49L937.45 172.794A56 56 0 0 0 946.676 142c0-30.928-25.072-56-56-56z" p-id="12205"></path></svg>
    )
  }
)

if (__DEV__) {
  FilterFilled.displayName = 'FilterFilled'
}
  