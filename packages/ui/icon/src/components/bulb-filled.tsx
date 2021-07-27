
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-bulb-filled'
const _prefix = getPrefixCls(_role)

export const BulbFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M668 878a8 8 0 0 1 8 8v64a8 8 0 0 1-8 8H356a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h312zM512 66c187.776 0 340 152.224 340 340 0 128.306-71.072 240.014-175.994 297.9L676 826a8 8 0 0 1-8 8H356a8 8 0 0 1-8-8l-0.004-122.098C243.072 646.016 172 534.308 172 406c0-187.776 152.224-340 340-340z" p-id="11755"></path></svg>
    )
  }
)

if (__DEV__) {
  BulbFilled.displayName = 'BulbFilled'
}
  