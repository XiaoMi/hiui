
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-close-circle-filled'
const _prefix = getPrefixCls(_role)

export const CloseCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m-105.6 260.736a42.666667 42.666667 0 1 0-60.330667 60.330667L451.626667 512l-105.6 105.6a42.666667 42.666667 0 1 0 60.373333 60.330667l105.557333-105.6 105.6 105.6a42.666667 42.666667 0 1 0 60.373334-60.330667L572.309333 512l105.6-105.6a42.666667 42.666667 0 1 0-60.330666-60.330667L512 451.626667z" p-id="47571"></path></svg>
    )
  }
)

if (__DEV__) {
  CloseCircleFilled.displayName = 'CloseCircleFilled'
}
  