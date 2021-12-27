
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-dislike-filled'
const _prefix = getPrefixCls(_role)

export const DislikeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M763.648 104.682667a128 128 0 0 1 126.72 109.909333l48.768 341.333333a128 128 0 0 1-126.72 146.090667h-110.72a149.354667 149.354667 0 0 1-62.869333 187.477333l-18.474667 10.666667A128 128 0 0 1 445.482667 853.333333l-108.565334-188.032A127.616 127.616 0 0 1 298.666667 574.016v-341.333333a128 128 0 0 1 128-128zM149.333333 106.666667a85.333333 85.333333 0 0 1 85.333334 85.333333v320a85.333333 85.333333 0 0 1-85.333334 85.333333H128a85.333333 85.333333 0 0 1-85.333333-85.333333V192a85.333333 85.333333 0 0 1 85.333333-85.333333h21.333333z" p-id="15071"></path></svg>
    )
  }
)

if (__DEV__) {
  DislikeFilled.displayName = 'DislikeFilled'
}
  