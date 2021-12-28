import React, { forwardRef } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { MinusOutlined, PlusOutlined } from '@hi-ui/icons'
import { useCounter } from './use-counter'

const _role = 'counter'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Counter
 */
export const Counter = forwardRef<HTMLDivElement | null, CounterProps>(
  ({ prefixCls = _prefix, role = _role, ...rest }, ref) => {
    const {
      rootProps,
      getInputProps,
      getMinusButtonProps,
      getPlusButtonProps,
      getContentProps,
      getInputWrapperProps,
    } = useCounter({
      prefixCls,
      role,
      ...rest,
    })

    return (
      <div ref={ref} {...rootProps}>
        <div {...getContentProps()}>
          <button {...getMinusButtonProps()}>
            <MinusOutlined />
          </button>
          <div {...getInputWrapperProps()}>
            <input {...getInputProps()} />
          </div>
          <button {...getPlusButtonProps()}>
            <PlusOutlined />
          </button>
        </div>
      </div>
    )
  }
)

export interface CounterProps {
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
   * 指示是否可以聚焦
   */
  tabIndex?: number
  /**
   * 允许自动聚焦
   */
  autoFocus?: boolean
  /**
   * 设置当前值
   */
  value?: number
  /**
   * 设置默认值
   */
  defaultValue?: number
  /**
   * 每次改变值的大小
   */
  step?: number
  /**
   * 最小值
   */
  min?: number
  /**
   * 最大值
   */
  max?: number
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 点击加减器改变值时触发聚焦
   */
  focusOnStep?: boolean
  /**
   * 改变值时的回调
   */
  onChange?: (value: number) => void
  /**
   * 设置展现形式
   * @default 'outline'
   */
  appearance?: 'outline' | 'filled'
  /**
   * 设置计数器尺寸
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * 开启滑轮改值
   */
  changeOnWheel?: boolean
  onWheel?: (evt: React.WheelEvent<HTMLDivElement>) => void
  onFocus?: (evt: React.FocusEvent<HTMLDivElement>) => void
  onBlur?: (evt: React.FocusEvent<HTMLDivElement>) => void
}

if (__DEV__) {
  Counter.displayName = 'Counter'
}
