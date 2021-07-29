
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-mobile-filled'
const _prefix = getPrefixCls(_role)

export const MobileFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M864 64a8 8 0 0 1 8 8v880a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h704zM512 752c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z" p-id="11905"></path></svg>
    )
  }
)

if (__DEV__) {
  MobileFilled.displayName = 'MobileFilled'
}
  