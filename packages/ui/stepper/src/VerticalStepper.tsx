import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { StepperDataItem } from './types'
import { CheckOutlined } from '@hi-ui/icons'

const _role = 'stepper'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Stepper
 */
export const VerticalStepper = forwardRef<HTMLDivElement | null, VStepperProps>(
  (
    { prefixCls = _prefix, role = _role, className, data, current, onChange, type, ...rest },
    ref
  ) => {
    const cls = cx(`${prefixCls}--vertical`, `${prefixCls}--type-${type}`, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {data.map((stepperItem, index) => (
          <div
            key={index}
            onClick={() => {
              if (onChange) {
                onChange(index + 1)
              }
            }}
            className={cx(`${prefixCls}__item`, {
              [`${prefixCls}__item--active`]: current !== undefined && current >= index + 1,
              [`${prefixCls}__item--first`]: index === 0,
              [`${prefixCls}__item--last`]: index === data.length - 1,
              [`${prefixCls}__item--left-active`]: current !== undefined && current >= index + 1,
              [`${prefixCls}__item--right-active`]: current !== undefined && current > index + 1,
            })}
          >
            <div className={cx('item-step__wrapper')}>
              {stepperItem.icon ? (
                <div className={cx('item-step__icon')}>{stepperItem.icon}</div>
              ) : type === 'dot' ? (
                <div className={cx('item-step__dot')} />
              ) : current !== undefined && current > index + 1 ? (
                <div className={cx('item-step')}>
                  <CheckOutlined />
                </div>
              ) : (
                <div className={cx('item-step')}>{index + 1}</div>
              )}
            </div>
            <div className="vertical-wrapper">
              <div className={cx('item-step__title')}>{stepperItem.title}</div>
              <div className={cx('item-step__content')}>{stepperItem.content}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }
)

export interface VStepperProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
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
  data: StepperDataItem[]
  /**
   * 当前步骤位置索引，从 0 开始计数
   */
  current?: number
  /**
   * 步骤项的变更回调
   */
  onChange?: (current: number) => void
  type?: 'dot' | 'default'
}

if (__DEV__) {
  VerticalStepper.displayName = 'VerticalStepper'
}
