import React, { cloneElement, forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const INPUT_GROUP_PREFIX = getPrefixCls('input-group')

/**
 * TODO: What is InputGroup
 */
export const InputGroup = forwardRef<HTMLDivElement | null, InputGroupProps>(
  (
    {
      prefixCls = INPUT_GROUP_PREFIX,
      role = 'input-group',
      className,
      children,
      disabled,
      ...rest
    },
    ref
  ) => {
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
