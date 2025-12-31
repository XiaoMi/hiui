import React, { cloneElement, forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, GlobalConfig } from '@hi-ui/core'

const _prefix = getPrefixCls('input-group')

/**
 * 输入框组合器
 */
export const InputGroup = forwardRef<HTMLDivElement | null, InputGroupProps>(
  (
    { prefixCls: prefixClsProp, role = 'input-group', className, children, disabled, ...rest },
    ref
  ) => {
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp || (globalPrefixCls && getPrefixCls('input-group', globalPrefixCls)) || _prefix
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {React.Children.map(children, (child: any) => {
          return cloneElement(child, {
            disabled,
          })
        })}
      </div>
    )
  }
)

export interface InputGroupProps extends HiBaseHTMLProps<'div'> {
  /**
   * 统一设置被包裹表单控件的禁用状态
   */
  disabled?: boolean
}

if (__DEV__) {
  InputGroup.displayName = 'InputGroup'
}
