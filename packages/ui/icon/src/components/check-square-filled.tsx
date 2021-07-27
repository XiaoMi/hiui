
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-check-square-filled'
const _prefix = getPrefixCls(_role)

export const CheckSquareFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M896 112a16 16 0 0 1 16 16v768a16 16 0 0 1-16 16H128a16 16 0 0 1-16-16V128a16 16 0 0 1 16-16h768zM693.02 353.55a8 8 0 0 0-11.314 0L438.46 596.792l-96.166-96.164a8 8 0 0 0-11.314 0l-45.254 45.254a8 8 0 0 0 0 11.314l147.078 147.08a8 8 0 0 0 11.314 0l294.156-294.16a8 8 0 0 0 0-11.312z" p-id="11605"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckSquareFilled.displayName = 'CheckSquareFilled'
}
  