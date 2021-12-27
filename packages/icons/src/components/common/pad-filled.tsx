
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-pad-filled'
const _prefix = getPrefixCls(_role)

export const PadFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M810.666667 170.666667a128 128 0 0 1 128 128v426.666666a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V298.666667a128 128 0 0 1 128-128h597.333334z m0 298.666666a42.666667 42.666667 0 1 0 0 85.333334 42.666667 42.666667 0 0 0 0-85.333334z" p-id="15151"></path></svg>
    )
  }
)

if (__DEV__) {
  PadFilled.displayName = 'PadFilled'
}
  