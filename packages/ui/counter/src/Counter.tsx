import React, { forwardRef } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { MinusOutlined, PlusOutlined } from '@hi-ui/icons'
import { useCounter } from './use-counter'
import type { HiBaseHTMLFieldProps } from '@hi-ui/core'
import type { CounterSizeEnum } from './types'

const _role = 'counter'
const _prefix = getPrefixCls(_role)

/**
 * 数字加减器
 *
 * TODO:
 * 1. 修复完全受控时值变化 bug
 * 2. 优化 useCounter 代码，合理复用 pagination
 * 3. 支持 inputNumber 组件
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

export interface CounterProps extends HiBaseHTMLFieldProps<'div'> {
  /**
   * 开启自动聚焦
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
   * 点击加减器改变值时触发聚焦。暂不对外暴露
   * @private
   */
  focusOnStep?: boolean
  /**
   * 值改变时的回调
   */
  onChange?: (value: number) => void
  /**
   * 设置展现形式
   */
  appearance?: 'line' | 'filled'
  /**
   * 设置计数器尺寸
   */
  size?: CounterSizeEnum
  /**
   * 开启滑轮改值
   */
  changeOnWheel?: boolean
  /**
   * 指定输入框展示值的格式
   */
  formatter?: (value: string | number) => string | number
  /**
   * 指定从 formatter 里转换回数字的方式，和 formatter 搭配使用
   */
  parser?: (value: string | number) => number
}

if (__DEV__) {
  Counter.displayName = 'Counter'
}
