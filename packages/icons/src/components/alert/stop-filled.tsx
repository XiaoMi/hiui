
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-stop-filled'
const _prefix = getPrefixCls(_role)

export const StopFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m-172.501333 193.834667a42.666667 42.666667 0 0 0-60.330667 60.330667l405.333333 405.333333a42.666667 42.666667 0 0 0 60.330667-60.330667z" p-id="47611"></path></svg>
    )
  }
)

if (__DEV__) {
  StopFilled.displayName = 'StopFilled'
}
  