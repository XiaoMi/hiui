
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-pause-outlined'
const _prefix = getPrefixCls(_role)

export const PauseOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M284 112a8 8 0 0 1 8 8v784a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h64z m520 0a8 8 0 0 1 8 8v784a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h64z" p-id="13035"></path></svg>
    )
  }
)

if (__DEV__) {
  PauseOutlined.displayName = 'PauseOutlined'
}
  