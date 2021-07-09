import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { StepperItem } from './Stepper'
const _role = 'stepper'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Stepper
 */
export const HorizontalItem = forwardRef<HTMLDivElement | null, StepperProps>(
  (
    {
      prefixCls = _prefix,
      className,
      stepperItem,
      onClick,
      isFirst,
      isLast,
      isActive,
      isLastActive,
      index,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <div
        ref={ref}
        onClick={() => onClick}
        className={cx(`${cls}__item`, {
          [`${cls}__item--horizontal`]: true,
          [`${cls}__item--active`]: isActive,
          [`${cls}__item--first`]: isFirst,
          [`${cls}__item--last`]: isLast,
          [`${cls}__item--left-active`]: isActive,
          [`${cls}__item--right-active`]: !isLastActive,
        })}
      >
        <div className={cx('item-step__wrapper')}>
          <div className={cx('item-step')}>{index + 1}</div>
          <div className={cx('item-step__title')}>{stepperItem.title}</div>
        </div>
        <div className={cx('item-step__content')}>{stepperItem.content}</div>
      </div>
    )
  }
)

export interface StepperProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string

  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties

  /**
   * 步骤条数据项
   */
  stepperItem: StepperItem
  /**
   * 是否高亮
   */
  isActive: boolean

  /**
   * 是否为最后一个
   */
  isLast: boolean
  /**
   * 是否为最后一个高亮
   */
  isLastActive: boolean
  /**
   * 是否为第一个
   */
  isFirst: boolean

  /**
   * 当前步骤位置索引，从 0 开始计数
   */

  index: number

  /**
   * 步骤项的变更回调
   */
  onClick?: (current: number) => void
}

if (__DEV__) {
  HorizontalItem.displayName = 'HorizontalItem'
}
