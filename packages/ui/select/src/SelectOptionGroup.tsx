import React, { forwardRef } from 'react'
import type { HiBaseHTMLProps } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const optionGroupPrefix = getPrefixCls('select-option-group')

export const SelectOptionGroup = forwardRef<HTMLDivElement | null, SelectOptionGroupProps>(
  ({ prefixCls = optionGroupPrefix, className, children, label, onClick, depth, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <>
        <div className={`${prefixCls}__divider`} />
        <div ref={ref} className={cls} {...rest}>
          <span>{label}</span>
        </div>
      </>
    )
  }
)

export interface SelectOptionGroupProps extends HiBaseHTMLProps<'div'> {
  /**
   * 祖名
   */
  label?: string
  /**
   * 深度
   */
  depth?: number
}

;(SelectOptionGroup as any).HiName = 'SelectOptionGroup'
if (__DEV__) {
  SelectOptionGroup.displayName = 'SelectOptionGroup'
}
