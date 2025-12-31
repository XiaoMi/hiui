import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, GlobalConfig } from '@hi-ui/core'

const _role = 'button-group'
const _prefix = getPrefixCls(_role)

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ prefixCls: prefixClsProp, role = _role, className, children, ...rest }, ref) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp || (globalPrefixCls && getPrefixCls('button-group', globalPrefixCls)) || _prefix
    const cls = cx(prefixCls, className)

    return (
      <div role={role} className={cls} ref={ref} {...rest}>
        {children}
      </div>
    )
  }
)

export interface ButtonGroupProps extends HiBaseHTMLProps<'div'> {
  /**
   * 孩子节点，传入单个或多个 Button 组件
   */
  children?: React.ReactNode
}

if (__DEV__) {
  ButtonGroup.displayName = 'ButtonGroup'
}
