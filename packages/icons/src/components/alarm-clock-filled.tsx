
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-alarm-clock-filled'
const _prefix = getPrefixCls(_role)

export const AlarmClockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M512 180c215.392 0 390 174.608 390 390s-174.608 390-390 390S122 785.392 122 570 296.608 180 512 180z m20 202h-64a8 8 0 0 0-8 8v222a8 8 0 0 0 8 8h177a8 8 0 0 0 8-8v-64a8 8 0 0 0-8-8H540v-150a8 8 0 0 0-8-8zM323.454 70.928l32 55.426a8 8 0 0 1-2.928 10.928l-183.598 106A8 8 0 0 1 158 240.354L126 184.928A8 8 0 0 1 128.928 174l183.598-106a8 8 0 0 1 10.928 2.928z m389.1-3.13l0.374 0.202 183.598 106a8 8 0 0 1 3.13 10.554l-0.202 0.374-32 55.426a8 8 0 0 1-10.554 3.13l-0.374-0.202-183.598-106a8 8 0 0 1-3.13-10.554l0.202-0.374 32-55.426a8 8 0 0 1 10.554-3.13z" p-id="11805"></path></svg>
    )
  }
)

if (__DEV__) {
  AlarmClockFilled.displayName = 'AlarmClockFilled'
}
  