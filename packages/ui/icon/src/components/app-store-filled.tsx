
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-app-store-filled'
const _prefix = getPrefixCls(_role)

export const AppStoreFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M472 116a8 8 0 0 1 8 8v348a8 8 0 0 1-8 8H124a8 8 0 0 1-8-8V124a8 8 0 0 1 8-8h348zM472 544a8 8 0 0 1 8 8v348a8 8 0 0 1-8 8H124a8 8 0 0 1-8-8V552a8 8 0 0 1 8-8h348zM900 116a8 8 0 0 1 8 8v348a8 8 0 0 1-8 8H552a8 8 0 0 1-8-8V124a8 8 0 0 1 8-8h348zM900 544a8 8 0 0 1 8 8v348a8 8 0 0 1-8 8H552a8 8 0 0 1-8-8V552a8 8 0 0 1 8-8h348z" p-id="11695"></path></svg>
    )
  }
)

if (__DEV__) {
  AppStoreFilled.displayName = 'AppStoreFilled'
}
  