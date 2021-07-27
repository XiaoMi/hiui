
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-check-circle-filled'
const _prefix = getPrefixCls(_role)

export const CheckCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960 64 759.424 64 512 264.576 64 512 64z m181.02 289.55a8 8 0 0 0-11.314 0L438.46 596.792l-96.166-96.164a8 8 0 0 0-11.314 0l-45.254 45.254a8 8 0 0 0 0 11.314l147.078 147.08a8 8 0 0 0 11.314 0l294.156-294.16a8 8 0 0 0 0-11.312z" p-id="11595"></path></svg>
    )
  }
)

if (__DEV__) {
  CheckCircleFilled.displayName = 'CheckCircleFilled'
}
  