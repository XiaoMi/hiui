
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-bell-filled')

export const BellFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M597.333333 853.333333a85.333333 85.333333 0 1 1-170.666666 0zM512 85.333333c188.522667 0 341.333333 144.32 341.333333 322.368v282.069334C853.333333 756.544 796.032 810.666667 725.333333 810.666667H298.666667c-70.698667 0-128-54.122667-128-120.896V407.701333C170.666667 229.653333 323.477333 85.333333 512 85.333333z" p-id="15211"></path></svg>
    )
  }
)

if (__DEV__) {
  BellFilled.displayName = 'BellFilled'
}
  