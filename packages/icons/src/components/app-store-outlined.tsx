
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-app-store-outlined'
const _prefix = getPrefixCls(_role)

export const AppStoreOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M472 116a8 8 0 0 1 8 8v348a8 8 0 0 1-8 8H124a8 8 0 0 1-8-8V124a8 8 0 0 1 8-8h348z m-72 80H196v204h204V196zM472 544a8 8 0 0 1 8 8v348a8 8 0 0 1-8 8H124a8 8 0 0 1-8-8V552a8 8 0 0 1 8-8h348z m-72 80H196v204h204V624zM900 116a8 8 0 0 1 8 8v348a8 8 0 0 1-8 8H552a8 8 0 0 1-8-8V124a8 8 0 0 1 8-8h348z m-72 80H624v204h204V196zM900 544a8 8 0 0 1 8 8v348a8 8 0 0 1-8 8H552a8 8 0 0 1-8-8V552a8 8 0 0 1 8-8h348z m-72 80H624v204h204V624z" p-id="12525"></path></svg>
    )
  }
)

if (__DEV__) {
  AppStoreOutlined.displayName = 'AppStoreOutlined'
}
  