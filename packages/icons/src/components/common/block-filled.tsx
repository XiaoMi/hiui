
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-block-filled')

export const BlockFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role="icon" {...rest}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M832 362.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v384a85.333333 85.333333 0 0 1-85.333333 85.333333H448a85.333333 85.333333 0 0 1-85.333333-85.333333V448a85.333333 85.333333 0 0 1 85.333333-85.333333h384zM576 106.666667a85.333333 85.333333 0 0 1 85.333333 85.333333v106.666667H426.666667a128 128 0 0 0-128 128v234.666666H192a85.333333 85.333333 0 0 1-85.333333-85.333333V192a85.333333 85.333333 0 0 1 85.333333-85.333333h384z" p-id="14961"></path></svg>
    )
  }
)

if (__DEV__) {
  BlockFilled.displayName = 'BlockFilled'
}
  