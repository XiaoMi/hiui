import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { VerticalItem } from './VerticalItem'
import { HorizontalItem } from './HorizontalItem'
import { VerticalStepper } from './VerticalStepper'

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
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return placement === 'vertical' ? (
      <VerticalStepper data={data} />
    ) : (
      <div ref={ref} role={role} className={cls} {...rest}>
        {data.map((d, index) =>
          itemLayout === 'vertical' ? (
            <VerticalItem
              key={index}
              stepperItem={d}
              index={index}
              isActive={!!current && current >= index}
              isFirst={index === 0}
              isLast={index === data.length - 1}
              isLastActive={current === index}
              onClick={() => {
                if (onChange) {
                  onChange(index)
                }
              }}
            />
          ) : (
            <HorizontalItem
              key={index}
              stepperItem={d}
              index={index}
              isActive={!!current && current >= index}
              isFirst={index === 0}
              isLast={index === data.length - 1}
              isLastActive={current === index}
              onClick={() => {
                if (onChange) {
                  onChange(index)
                }
              }}
            />
          )
        )}
      </div>
    )
  }
)

export interface StepperItem {
  /**
   * 	步骤项标题
   */
  title?: React.ReactNode
  /**
   * 	步骤项内容
   */
  content?: React.ReactNode
  /**
   * 	步骤项 icon, 为 string 时为 HIUI Icon 组件的 name
   */
  // TODO: icon 组件迁移后需要再处理一下
  icon?: React.ReactNode
}

export interface StepperProps {
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
  data: StepperItem[]
  /**
   * 当前步骤位置索引，从 0 开始计数
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
}

if (__DEV__) {
  Stepper.displayName = 'Stepper'
}
