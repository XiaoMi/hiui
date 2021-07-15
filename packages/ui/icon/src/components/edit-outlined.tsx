
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-edit-outlined'
const _prefix = getPrefixCls(_role)

export const EditOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M472 112a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H192v640h640V552a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v344a16 16 0 0 1-16 16H128a16 16 0 0 1-16-16V128a16 16 0 0 1 16-16h344z m363.99 25.1l50.912 50.91a8 8 0 0 1 0 11.314L451.32 634.9a8 8 0 0 1-11.312 0l-50.912-50.912a8 8 0 0 1 0-11.314L824.68 137.1a8 8 0 0 1 11.312 0z" p-id="13525"></path></svg>
    )
  }
)

if (__DEV__) {
  EditOutlined.displayName = 'EditOutlined'
}
  