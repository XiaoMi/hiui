
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-pad-outlined'
const _prefix = getPrefixCls(_role)

export const PadOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M876 76a8 8 0 0 1 8 8v856a8 8 0 0 1-8 8H148a8 8 0 0 1-8-8V84a8 8 0 0 1 8-8h728z m-72 80H220v712h584V156zM442 740h142a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8h-142a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8z" p-id="13015"></path></svg>
    )
  }
)

if (__DEV__) {
  PadOutlined.displayName = 'PadOutlined'
}
  