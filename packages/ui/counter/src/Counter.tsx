import React, { forwardRef, useState } from 'react'
import NP from 'number-precision'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

const _role = 'counter'
const _prefix = getPrefixCls(_role)
const DEFAULT_VALUE = 0

const isNumeric = (val: unknown) => !Number.isNaN(Number(val))

/**
 * TODO: What is Counter
 */
export const Counter = forwardRef<HTMLDivElement | null, CounterProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      value: valueProp,
      defaultValue = DEFAULT_VALUE,
      step = 1,
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      disabled = false,
      onChange,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)
    const [inputValue, setInputValue] = useState<React.ReactText>(value)

    const isDisabledOnChange = valueProp !== undefined && !onChange
    const isDisabled = isDisabledOnChange || disabled

    const proxyTryChangeValue = (nextValue: number, syncInput: boolean) => {
      if (isDisabled) return

      if (__DEV__) {
        // TODO(统一规范): 对于 ts 类型无法约束到的，但是用户可能存在该行为的，需要开发模式警告提醒
        if (min > max) {
          console.log('Warning: the max must large than min.')
        }
      }

      if (nextValue > max) {
        nextValue = max
      } else if (nextValue < min) {
        nextValue = min
      }

      if (nextValue !== value) {
        tryChangeValue(nextValue)
      }

      if (syncInput) {
        setInputValue(nextValue)
      }
    }

    const reachMax = value >= max
    const reachMin = value <= min
    const isMinusDisabled = disabled || reachMin
    const isPlusDisabled = disabled || reachMax

    const onMinus = () => {
      if (isMinusDisabled) return
      proxyTryChangeValue(NP.minus(value, step), true)
    }

    const onPlus = () => {
      if (isPlusDisabled) return
      proxyTryChangeValue(NP.plus(value, step), true)
    }

    const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = evt.target

      // 如果是数值类型，则立即进行修改原始值，保证输入错误也能显示最接近的正确值
      if (isNumeric(value)) {
        proxyTryChangeValue(Number(value), false)
      }

      setInputValue(value)
    }

    const onInputBlur = () => {
      // 如果不合法，则设会之前值
      setInputValue(value)
    }

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // TODO(规范): 统一组件库键盘按键兼容方案
      // TODO: 为什么要用 preventDefault
      // 下键
      if (e.keyCode === 40) {
        e.preventDefault()
        onMinus()
      }

      // 上键
      if (e.keyCode === 38) {
        e.preventDefault()
        onPlus()
      }
    }

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <div className={`hi-counter-outer`}>
          <span
            className={`hi-counter-minus hi-counter-sign ${isMinusDisabled ? 'disabled' : ''}`}
            onClick={onMinus}
          >
            {/* TODO: minus icon 添加 */}
            {/* @ts-ignore */}
            <i name="minus">minus</i>
          </span>
          <input
            className={`hi-counter-input`}
            value={inputValue}
            data-value={value}
            disabled={disabled}
            onChange={onInputChange}
            onBlur={onInputBlur}
            onKeyDown={onInputKeyDown}
          />
          <span
            className={`hi-counter-plus hi-counter-sign ${isPlusDisabled ? 'disabled' : ''}`}
            onClick={onPlus}
          >
            {/* TODO: plus icon 添加 */}
            {/* @ts-ignore */}
            <i name="plus">plus</i>
          </span>
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
   * 改变值时的回调
   */
  onChange?: (value: number) => void
}

if (__DEV__) {
  Counter.displayName = 'Counter'
}
