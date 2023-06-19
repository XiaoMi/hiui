import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CheckOutlined } from '@hi-ui/icons'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { isUndef } from '@hi-ui/type-assertion'
import { StepperDataItem } from './types'

const _role = 'stepper-item'
const _prefix = getPrefixCls(_role)

export const StepperItem = forwardRef<HTMLDivElement | null, StepperItemProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      type = 'default',
      title,
      content,
      icon,
      step,
      current,
      ...rest
    },
    ref
  ) => {
    const active = step === current
    const done = step < current
    const pending = step > current

    const cls = cx(
      prefixCls,
      active && `${prefixCls}--active`,
      done && `${prefixCls}--done`,
      pending && `${prefixCls}--pending`,
      className
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <div className={`${prefixCls}-status`}>
          {renderIcon({
            prefixCls: `${prefixCls}-status`,
            icon: icon,
            type,
            step,
            done,
          })}
        </div>
        <div className={`${prefixCls}-tip`}>
          {isUndef(title) ? null : (
            <div className={`${prefixCls}-tip__title`}>
              <div>{title}</div>
            </div>
          )}
          {isUndef(content) ? null : <div className={`${prefixCls}-tip__content`}>{content}</div>}
        </div>
      </div>
    )
  }
)

export interface StepperItemProps extends HiBaseHTMLProps<'div'>, StepperDataItem {
  /**
   * 当前步骤位置索引
   */
  step: number
  /**
   * 当前正在处理中的 stepper 步骤索引
   */
  current: number
  /**
   * 默认展示 icon 类型
   */
  type?: 'dot' | 'default'
}

if (__DEV__) {
  StepperItem.displayName = 'StepperItem'
}

const renderIcon = ({
  prefixCls,
  icon,
  type,
  done,
  step,
}: {
  prefixCls: string
  icon?: React.ReactNode
  type?: 'dot' | 'default'
  done: boolean
  step: number
}) => {
  if (icon) {
    return <div className={`${prefixCls}__icon`}>{icon}</div>
  }

  if (type === 'dot') {
    return <div className={`${prefixCls}__dot`} />
  }

  return <div className={`${prefixCls}__step`}>{done ? <CheckOutlined /> : step}</div>
}
