import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { StepperDataItem } from './types'
import { StepperItem } from './StepperItem'

const _role = 'stepper'
const _prefix = getPrefixCls('stepper')

const NOOP_ARRAY = [] as []

/**
 * TODO: What is Stepper
 */
export const Stepper = forwardRef<HTMLDivElement | null, StepperProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      data = NOOP_ARRAY,
      current: currentProp,
      onChange,
      itemLayout = 'horizontal',
      placement = 'horizontal',
      type = 'default',
      ...rest
    },
    ref
  ) => {
    const [current, trySetCurrent] = useUncontrolledState(0, currentProp, onChange)

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--placement-${placement}`,
      `${prefixCls}--type-${type}`
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {data.map((item, index) => {
          const step = index + 1

          return (
            <StepperItem
              key={step}
              {...item}
              prefixCls={`${prefixCls}-item`}
              className={cx(placement === 'horizontal' && `${prefixCls}-item--${itemLayout}`)}
              step={step}
              type={type}
              current={current}
              onClick={() => trySetCurrent(step)}
            />
          )
        })}
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
   * 步骤项的变更回调
   */
  onChange?: (current: number) => void
  /**
   * 水平或垂直展示步骤条
   */
  placement?: 'vertical' | 'horizontal'
  /**
   * 步骤项的布局方式
   */
  itemLayout?: 'vertical' | 'horizontal'
  /**
   * 节点类型
   */
  type?: 'dot' | 'default'
}

if (__DEV__) {
  Stepper.displayName = 'Stepper'
}
