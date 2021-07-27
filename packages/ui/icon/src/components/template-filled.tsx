
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-template-filled'
const _prefix = getPrefixCls(_role)

export const TemplateFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M612 112v800H120a8 8 0 0 1-8-8V120a8 8 0 0 1 8-8h492z m300 512v280a8 8 0 0 1-8 8H692V624h220z m-8-512a8 8 0 0 1 8 8v424H692V112h212z" p-id="12075"></path></svg>
    )
  }
)

if (__DEV__) {
  TemplateFilled.displayName = 'TemplateFilled'
}
  