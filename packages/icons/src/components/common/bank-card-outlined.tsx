
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _role = 'icon-bank-card-outlined'
const _prefix = getPrefixCls(_role)

export const BankCardOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M810.666667 149.333333a128 128 0 0 1 128 128v469.333334a128 128 0 0 1-128 128H213.333333a128 128 0 0 1-128-128V277.333333a128 128 0 0 1 128-128h597.333334z m42.666666 298.666667H170.666667v298.666667a42.666667 42.666667 0 0 0 39.466666 42.56L213.333333 789.333333h597.333334a42.666667 42.666667 0 0 0 42.56-39.466666L853.333333 746.666667V448z m-128 149.333333a42.666667 42.666667 0 1 1 0 85.333334h-128a42.666667 42.666667 0 1 1 0-85.333334h128z m85.333334-362.666666H213.333333a42.666667 42.666667 0 0 0-42.56 39.466666L170.666667 277.333333v85.333334h682.666666v-85.333334a42.666667 42.666667 0 0 0-39.466666-42.56L810.666667 234.666667z" p-id="39195"></path></svg>
    )
  }
)

if (__DEV__) {
  BankCardOutlined.displayName = 'BankCardOutlined'
}
  