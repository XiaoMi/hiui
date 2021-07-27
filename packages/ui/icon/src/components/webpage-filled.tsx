
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-webpage-filled'
const _prefix = getPrefixCls(_role)

export const WebpageFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M912 416v488a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V416h800zM484 660H244a8 8 0 0 0-7.99 7.6l-0.01 0.4v64a8 8 0 0 0 7.6 7.99l0.4 0.01h240a8 8 0 0 0 7.99-7.6l0.01-0.4v-64a8 8 0 0 0-8-8z m256-144H244a8 8 0 0 0-7.99 7.6l-0.01 0.4v66a8 8 0 0 0 7.6 7.99l0.4 0.01h496a8 8 0 0 0 7.99-7.6l0.01-0.4v-66a8 8 0 0 0-8-8z m164-404a8 8 0 0 1 8 8v216H112V120a8 8 0 0 1 8-8h784zM276 188c-22.092 0-40 17.908-40 40s17.908 40 40 40 40-17.908 40-40-17.908-40-40-40z m140 0c-22.092 0-40 17.908-40 40s17.908 40 40 40 40-17.908 40-40-17.908-40-40-40z m140 0c-22.092 0-40 17.908-40 40s17.908 40 40 40 40-17.908 40-40-17.908-40-40-40z" p-id="12135"></path></svg>
    )
  }
)

if (__DEV__) {
  WebpageFilled.displayName = 'WebpageFilled'
}
  