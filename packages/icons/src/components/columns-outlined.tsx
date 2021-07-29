
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-columns-outlined'
const _prefix = getPrefixCls(_role)

export const ColumnsOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M896 112a16 16 0 0 1 16 16v768a16 16 0 0 1-16 16H128a16 16 0 0 1-16-16V128a16 16 0 0 1 16-16h768zM346 192H192v640h154V192z m252 0h-172v640h172V192z m234 0h-154v640h154V192z" p-id="13375"></path></svg>
    )
  }
)

if (__DEV__) {
  ColumnsOutlined.displayName = 'ColumnsOutlined'
}
  