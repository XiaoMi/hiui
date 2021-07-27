
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-start-date-outlined'
const _prefix = getPrefixCls(_role)

export const StartDateOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M406.1 80c4.418 0 7.9 3.58 7.9 8v52h196V88a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8v52h192a16 16 0 0 1 16 16v756a16 16 0 0 1-16 16H134a16 16 0 0 1-16-16V156a16 16 0 0 1 16-16h200V88a8 8 0 0 1 8-8h64.1zM198 419.998V848h620V419.998H198zM334 220H198v119.998L818 340v-120h-128v50a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-50h-196v50a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-50zM274 480h184a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-184a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8z" p-id="12305"></path></svg>
    )
  }
)

if (__DEV__) {
  StartDateOutlined.displayName = 'StartDateOutlined'
}
  