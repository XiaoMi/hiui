
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-mobile-outlined'
const _prefix = getPrefixCls(_role)

export const MobileOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M864 64a8 8 0 0 1 8 8v880a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h704z m-72 80H232v736h560V144zM512 800m-48 0a48 48 0 1 0 96 0 48 48 0 1 0-96 0Z" p-id="12995"></path></svg>
    )
  }
)

if (__DEV__) {
  MobileOutlined.displayName = 'MobileOutlined'
}
  