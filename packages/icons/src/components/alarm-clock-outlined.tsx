
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-alarm-clock-outlined'
const _prefix = getPrefixCls(_role)

export const AlarmClockOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 180c215.392 0 390 174.608 390 390s-174.608 390-390 390S122 785.392 122 570 296.608 180 512 180z m0 80c-171.208 0-310 138.792-310 310s138.792 310 310 310 310-138.792 310-310-138.792-310-310-310z m20 122a8 8 0 0 1 8 8v150h105a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H468a8 8 0 0 1-8-8V390a8 8 0 0 1 8-8h64zM323.454 70.928l32 55.426a8 8 0 0 1-2.928 10.928l-183.598 106A8 8 0 0 1 158 240.354L126 184.928A8 8 0 0 1 128.928 174l183.598-106a8 8 0 0 1 10.928 2.928z m378.546 0a8 8 0 0 1 10.554-3.13l0.374 0.202 183.598 106a8 8 0 0 1 3.13 10.554l-0.202 0.374-32 55.426a8 8 0 0 1-10.554 3.13l-0.374-0.202-183.598-106a8 8 0 0 1-3.13-10.554l0.202-0.374 32-55.426z" p-id="12545"></path></svg>
    )
  }
)

if (__DEV__) {
  AlarmClockOutlined.displayName = 'AlarmClockOutlined'
}
  