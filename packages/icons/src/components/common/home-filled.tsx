
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-home-filled'
const _prefix = getPrefixCls(_role)

export const HomeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M576.128 143.786667l277.333333 160.576A128 128 0 0 1 917.333333 415.125333V789.333333a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V415.146667a128 128 0 0 1 63.872-110.784l277.333333-160.576a128 128 0 0 1 128.256 0zM512 597.333333a42.666667 42.666667 0 0 0-42.666667 42.666667v192h85.333334v-192a42.666667 42.666667 0 0 0-42.666667-42.666667z" p-id="15191"></path></svg>
    )
  }
)

if (__DEV__) {
  HomeFilled.displayName = 'HomeFilled'
}
  