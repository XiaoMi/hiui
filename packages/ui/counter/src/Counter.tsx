import React, { forwardRef, useState } from 'react'
import NP from 'number-precision'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

const _role = 'counter'
const _prefix = getPrefixCls(_role)

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
      defaultValue = 0,
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

    const proxyTryChangeValue = (value: number) => {
      if (value >= max) {
        value = max
      } else if (value <= min) {
        value = min
      }

      tryChangeValue(value)
    }

    const reachMax = value >= max
    const reachMin = value <= max
    const isMinusDisabled = disabled || reachMin
    const isPlusDisabled = disabled || reachMax

    const onMinus = () => {
      proxyTryChangeValue(NP.minus(value, step))
    }

    const onPlus = () => {
      proxyTryChangeValue(NP.plus(value, step))
    }

    const formatValue = (val: React.ReactText) => {
      let _val = Number(val)
      if (Number.isNaN(Number(_val))) {
        _val = min && min > 0 ? min : 0
      }
      return _val
    }

    const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      evt.persist()
      const nextValue = formatValue(evt.target.value)
      if (typeof nextValue === 'number') {
        tryChangeValue(nextValue)
      }
      setInputValue(evt.target.value)
    }

    const onInputBlur = () => {
      const nextValue = formatValue(inputValue)

      tryChangeValue(nextValue)
    }

    const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // TODO: 统一组件库键盘按键兼容方案
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
            onClick={() => {
              if (isMinusDisabled) return
              onMinus()
            }}
          >
            <i name="minus" />
          </span>
          <input
            value={inputValue}
            data-value={value}
            disabled={disabled}
            onChange={onInputChange}
            onBlur={onInputBlur}
            onKeyDown={onInputKeyDown}
          />
          <span
            className={`hi-counter-plus hi-counter-sign ${isPlusDisabled ? 'disabled' : ''}`}
            onClick={(e) => {
              if (isMinusDisabled) return
              onPlus()
            }}
          >
            <i name="plus" />
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
