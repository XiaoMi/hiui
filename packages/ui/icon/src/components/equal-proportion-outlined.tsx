
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-equal-proportion-outlined'
const _prefix = getPrefixCls(_role)

export const EqualProportionOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M912 112a8 8 0 0 1 8 8v784a8 8 0 0 1-8 8H112a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h800zM184 192v640h656V192H184z m200 112v440h-80V384h-48l20-80h108z m376 0v440h-80V384h-60l20-80h120zM552 566v80h-80v-80h80z m0-164v80h-80v-80h80z" p-id="11325"></path></svg>
    )
  }
)

if (__DEV__) {
  EqualProportionOutlined.displayName = 'EqualProportionOutlined'
}
  