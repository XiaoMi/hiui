
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-calendar-outlined'
const _prefix = getPrefixCls(_role)

export const CalendarOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M661.333333 64a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666666h85.333333a128 128 0 0 1 128 128v512a128 128 0 0 1-128 128H234.666667a128 128 0 0 1-128-128V277.333333a128 128 0 0 1 128-128h85.333333V106.666667a42.666667 42.666667 0 1 1 85.333333 0v42.666666h213.333334V106.666667a42.666667 42.666667 0 0 1 42.666666-42.666667z m170.666667 426.666667H192v298.666666a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h554.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333V490.666667zM320 234.666667h-85.333333a42.666667 42.666667 0 0 0-42.56 39.466666L192 277.333333v128h640v-128a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 234.666667h-85.333333v42.666666a42.666667 42.666667 0 1 1-85.333333 0v-42.666666H405.333333v42.666666a42.666667 42.666667 0 1 1-85.333333 0v-42.666666z" p-id="39245"></path></svg>
    )
  }
)

if (__DEV__) {
  CalendarOutlined.displayName = 'CalendarOutlined'
}
  