
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-import-outlined'
const _prefix = getPrefixCls(_role)

export const ImportOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M828 64a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H232v736h296a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h668zM336 280h352a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H336a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8zM332.52 456h198.96c2.496 0 4.52 3.58 4.52 8v64c0 4.42-2.024 8-4.52 8h-198.96c-2.496 0-4.52-3.58-4.52-8v-64c0-4.42 2.024-8 4.52-8zM800 64h64a8 8 0 0 1 8 8v284a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8zM648.048 557.952l45.256 45.254a8 8 0 0 1 0 11.314l-67.482 67.478 254.57 0.002a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8l-254.57-0.002 67.48 67.482a8 8 0 0 1 0 11.314l-45.254 45.254a8 8 0 0 1-11.312 0l-158.392-158.392a8 8 0 0 1 0-11.312l158.392-158.392a8 8 0 0 1 11.312 0z" p-id="12945"></path></svg>
    )
  }
)

if (__DEV__) {
  ImportOutlined.displayName = 'ImportOutlined'
}
  