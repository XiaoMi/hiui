import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { VerticalItem } from './VerticalItem'
import { HorizontalItem } from './HorizontalItem'
import { VerticalStepper } from './VerticalStepper'
import { StepperDataItem } from './types'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'stepper'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Stepper
 */
export const Stepper = forwardRef<HTMLDivElement | null, StepperProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      data,
      current,
      onChange,
      itemLayout = 'horizontal',
      placement = 'horizontal',
      type = 'default',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, `${prefixCls}--type-${type}`, className)

    return placement === 'vertical' ? (
      <VerticalStepper
        ref={ref}
        data={data}
        current={current}
        onChange={onChange}
        prefixCls={prefixCls}
        className={className}
        type={type}
        {...rest}
      />
    ) : (
      <div ref={ref} role={role} className={cls} {...rest}>
        {data.map((d, index) =>
          itemLayout === 'vertical' ? (
            <VerticalItem
              key={index}
              stepperItem={d}
              index={index}
              type={type}
              isActive={current !== undefined && current >= index + 1}
              isFirst={index === 0}
              isLast={index === data.length - 1}
              isLastActive={current === index + 1}
              onClick={() => {
                if (onChange) {
                  onChange(index + 1)
                }
              }}
            />
          ) : (
            <HorizontalItem
              key={index}
              stepperItem={d}
              index={index}
              type={type}
              isActive={current !== undefined && current >= index + 1}
              isFirst={index === 0}
              isLast={index === data.length - 1}
              isLastActive={current === index + 1}
              onClick={() => {
                if (onChange) {
                  onChange(index + 1)
                }
              }}
            />
          )
        )}
      </div>
    )
  }
)

export interface StepperProps extends HiBaseHTMLProps<'div'> {
  /**
   * 步骤条数据项
   */
  data: StepperDataItem[]
  /**
   * 当前步骤位置索引，从 1 开始计数
   */
  current?: number
  /**
   * 水平或垂直展示步骤条
   */
  placement?: 'vertical' | 'horizontal'
  /**
   * 步骤项的布局方式
   */
  itemLayout?: 'vertical' | 'horizontal'
  /**
   * 步骤项的变更回调
   */
  onChange?: (current: number) => void
  /**
   * 节点类型
   */
  type?: 'dot' | 'default'
}

if (__DEV__) {
  Stepper.displayName = 'Stepper'
}
