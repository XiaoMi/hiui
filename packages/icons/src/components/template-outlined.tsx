
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-template-outlined'
const _prefix = getPrefixCls(_role)

export const TemplateOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M896 112a16 16 0 0 1 16 16v768a16 16 0 0 1-16 16H128a16 16 0 0 1-16-16V128a16 16 0 0 1 16-16h768zM610 192H192v640h418V192z m80 429.998V832h142V622l-142-0.002zM832 192h-142v349.998l142 0.002V192z" p-id="12355"></path></svg>
    )
  }
)

if (__DEV__) {
  TemplateOutlined.displayName = 'TemplateOutlined'
}
  