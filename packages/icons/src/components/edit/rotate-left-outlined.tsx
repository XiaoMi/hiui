
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-rotate-left-outlined'
const _prefix = getPrefixCls(_role)

export const RotateLeftOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M661.333333 298.666667a128 128 0 0 1 128 128v320a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V426.666667a128 128 0 0 1 128-128h448z m0 85.333333H213.333333a42.666667 42.666667 0 0 0-42.56 39.466667L170.666667 426.666667v320a42.666667 42.666667 0 0 0 39.466666 42.56L213.333333 789.333333h448a42.666667 42.666667 0 0 0 42.56-39.466666L704 746.666667V426.666667a42.666667 42.666667 0 0 0-39.466667-42.56L661.333333 384zM603.2 80.149333a42.666667 42.666667 0 0 1 2.496 57.6l-2.496 2.730667-9.365333 9.365333 110.08-0.192c127.573333-0.213333 231.509333 101.376 234.986666 228.117334l0.085334 6.165333V469.333333a42.666667 42.666667 0 0 1-85.205334 3.2l-0.128-3.2v-85.269333a149.333333 149.333333 0 0 0-144.426666-148.992l-5.141334-0.085333-213.333333 0.362666c-36.949333 0.064-56.021333-43.264-32.512-70.4l2.261333-2.432 82.368-82.368a42.666667 42.666667 0 0 1 60.330667 0z" p-id="45006"></path></svg>
    )
  }
)

if (__DEV__) {
  RotateLeftOutlined.displayName = 'RotateLeftOutlined'
}
  