
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-heart-filled'
const _prefix = getPrefixCls(_role)

export const HeartFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M513.96 160.29c109.632-81.594 265.398-72.64 364.902 26.868 108.254 108.252 109.336 283.094 3.248 392.68l-3.248 3.3-355.85 356.372a15.982 15.982 0 0 1-22.216 0.416l-0.404-0.39c-0.002-0.004-0.006-0.006 0-0.018L144.012 583.14c-109.348-109.348-109.348-286.634 0-395.98C244.28 86.884 401.684 78.564 511.44 162.194l2.52-1.904z" p-id="12225"></path></svg>
    )
  }
)

if (__DEV__) {
  HeartFilled.displayName = 'HeartFilled'
}
  