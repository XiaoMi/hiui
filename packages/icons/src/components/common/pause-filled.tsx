
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-pause-filled'
const _prefix = getPrefixCls(_role)

export const PauseFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 85.333333c235.648 0 426.666667 191.018667 426.666667 426.666667s-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512 276.352 85.333333 512 85.333333z m-106.666667 298.666667a42.666667 42.666667 0 0 0-42.666666 42.666667v170.666666a42.666667 42.666667 0 1 0 85.333333 0v-170.666666a42.666667 42.666667 0 0 0-42.666667-42.666667z m213.333334 0a42.666667 42.666667 0 0 0-42.666667 42.666667v170.666666a42.666667 42.666667 0 1 0 85.333333 0v-170.666666a42.666667 42.666667 0 0 0-42.666666-42.666667z" p-id="15581"></path></svg>
    )
  }
)

if (__DEV__) {
  PauseFilled.displayName = 'PauseFilled'
}
  