
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-paste-filled'
const _prefix = getPrefixCls(_role)

export const PasteFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M904 560a8 8 0 0 1 8 8v344a8 8 0 0 1-8 8H340a8 8 0 0 1-8-8V568a8 8 0 0 1 8-8h564zM780 104a8 8 0 0 1 8 8v376.022a8 8 0 0 1-8 8h-64c-0.188 0-0.374-0.006-0.558-0.02L267.998 496v231.926L268 728v64a8 8 0 0 1-8 8H120a8 8 0 0 1-8-8V112a8 8 0 0 1 8-8h660z" p-id="12255"></path></svg>
    )
  }
)

if (__DEV__) {
  PasteFilled.displayName = 'PasteFilled'
}
  