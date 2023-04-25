import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react'
import { plus, minus } from 'number-precision'
import { cx } from '@hi-ui/classname'
import { invariant } from '@hi-ui/env'
import { useLatestRef, useLatestCallback } from '@hi-ui/use-latest'
import { useToggle } from '@hi-ui/use-toggle'
import { isNumeric } from '@hi-ui/type-assertion'
import { CounterProps } from './Counter'

/**
 * 核心逻辑：
 * 1. 输入时不做数字处理，并且用 inputNumericRef.current 保存数字类型的值
 * 2. 失焦时拿 inputNumericRef.current 值做展示
 * 3. 有 formatter 时，处理逻辑是将输入时（inputValue）和失焦时（formattedValue）的值分开保存，并且在不同时机拿对应值去展示，另外给 onChange 回调的值是 parser 处理后的值（parsedValue）
 */
export const useCounter = ({
  prefixCls,
  className,
  value: valueProp,
  defaultValue = 0,
  step = 1,
  min: minProp,
  max: maxProp,
  disabled = false,
  onChange,
  tabIndex = 0,
  autoFocus = false,
  focusOnStep = true,
  onFocus,
  onBlur,
  changeOnWheel = false,
  onWheel,
  size = 'md',
  appearance = 'line',
  invalid = false,
  formatter,
  parser,
  ...rest
}: UseCounterProps) => {
  const min = minProp ?? Number.MIN_SAFE_INTEGER
  const max = maxProp ?? Number.MAX_SAFE_INTEGER

  const _value = valueProp ?? defaultValue
  // 输入时使用该值
  const [inputValue, tryChangeInputValue] = useState(_value)
  // 失焦时使用该值
  const [formattedValue, setFormattedValue] = useState(formatter ? formatter(_value) : _value)
  // onChange 回调中返回该值
  const parsedValue = (parser ? parser(formattedValue) : formattedValue) as number
  // 是否是受控的格式化操作
  const isControlledFormat = useMemo(() => {
    return valueProp !== undefined && formatter
  }, [formatter, valueProp])

  const valueRef = useLatestRef(inputValue)

  const proxyTryChangeValue = useCallback(
    (nextValue: number, syncInput: boolean) => {
      if (disabled) return

      invariant(min <= max, 'The max must large than min.')

      if (nextValue > max) {
        nextValue = max
      } else if (nextValue < min) {
        nextValue = min
      }

      if (isControlledFormat) {
        setFormattedValue(formatter!(nextValue))
      } else {
        tryChangeInputValue((formatter ? formatter(nextValue) : nextValue) as number)
      }

      onChange?.(parser ? parser(nextValue) : nextValue)
    },
    [disabled, formatter, isControlledFormat, max, min, onChange, parser]
  )

  const inputRef = useRef<HTMLInputElement>(null)

  const reachMax = parsedValue >= max
  const reachMin = parsedValue <= min
  const disabledMinus = disabled || reachMin
  const disabledPlus = disabled || reachMax

  const inputNumericRef = useRef<number>(parsedValue)

  // 如果是数值类型，则立即进行修改原始值，保证输入错误也能显示最接近的正确值
  // 最终 input 显示的值是基于 inputNumericRef.current
  if (isNumeric(parsedValue)) {
    inputNumericRef.current = Number(parsedValue)
  }

  const getCurrentValue = useCallback(() => {
    if (typeof inputNumericRef.current !== 'number') {
      inputNumericRef.current = valueRef.current
    }
    return inputNumericRef.current
  }, [valueRef])

  const onMinus = useCallback(() => {
    if (disabledMinus) return
    const currentValue = getCurrentValue()

    proxyTryChangeValue(minus(currentValue, step), false)
  }, [proxyTryChangeValue, disabledMinus, step, getCurrentValue])

  const onPlus = useCallback(() => {
    if (disabledPlus) return
    const currentValue = getCurrentValue()
    proxyTryChangeValue(plus(currentValue, step), false)
  }, [proxyTryChangeValue, disabledPlus, step, getCurrentValue])

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
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

      if (e.keyCode === 13) {
        e.preventDefault()
        const currentValue = getCurrentValue()
        proxyTryChangeValue(currentValue, false)
      }
    },
    [onMinus, onPlus, proxyTryChangeValue, getCurrentValue]
  )

  const [focused, focusedAction] = useToggle()

  const onFocusLatest = useLatestCallback(onFocus)
  const onBlurLatest = useLatestCallback(onBlur)

  useEffect(() => {
    // 输入时更新格式化后的值，方便失焦时拿来展示
    setFormattedValue(formatter ? formatter(inputValue) : inputValue)
  }, [formatter, inputValue])

  useEffect(() => {
    // 处理外部传入的受控值
    if (isControlledFormat) {
      setFormattedValue(formatter ? formatter(valueProp!) : valueProp!)
    } else {
      valueProp && tryChangeInputValue(valueProp)
    }
  }, [formatter, isControlledFormat, valueProp])

  useEffect(() => {
    if (autoFocus && !disabled) {
      focusedAction.on()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (disabled) return
    if (!inputRef.current) return

    if (focused) {
      inputRef.current.focus()
    }
  }, [disabled, focused])

  const handleMinusButtonTouch = useCallback(
    (evt: React.MouseEvent) => {
      if (focusOnStep) {
        evt.preventDefault()
        evt.stopPropagation()
        !formatter && focusedAction.on()
      }

      onMinus()
    },
    [focusOnStep, focusedAction, formatter, onMinus]
  )

  const handlePlusButtonTouch = useCallback(
    (evt: React.MouseEvent) => {
      if (focusOnStep) {
        evt.preventDefault()
        evt.stopPropagation()
        !formatter && focusedAction.on()
      }

      onPlus()
    },
    [focusOnStep, focusedAction, formatter, onPlus]
  )

  const onInputChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      focusedAction.on()
      const { value } = evt.target

      tryChangeInputValue(value as any)
    },
    [disabled, focusedAction]
  )

  const onInputFocus = useCallback(
    (evt) => {
      focusedAction.on()
      onFocusLatest(evt)

      if (formatter) {
        // focus 时需要拿到最新的可用值格式化后进行展示
        tryChangeInputValue(formatter(inputNumericRef.current) as number)
      }
    },
    [focusedAction, formatter, onFocusLatest]
  )

  const plusButtonElementRef = useRef<HTMLButtonElement | null>(null)
  const minusButtonElementRef = useRef<HTMLButtonElement | null>(null)

  const onInputBlur = useCallback(
    (evt) => {
      const relatedTarget = evt.relatedTarget

      focusedAction.off()

      if (!formatter) {
        // 拦截加减按钮点击，阻止其触发 input 失焦
        if (
          inputRef.current &&
          ((plusButtonElementRef.current && plusButtonElementRef.current === relatedTarget) ||
            (minusButtonElementRef.current && minusButtonElementRef.current === relatedTarget))
        ) {
          inputRef.current.focus()
          focusedAction.on()
          return
        }
      }

      const currentValue = getCurrentValue()
      proxyTryChangeValue(currentValue, true)

      onBlurLatest(evt)
    },
    [focusedAction, formatter, getCurrentValue, onBlurLatest, proxyTryChangeValue]
  )

  const onWheeLatest = useLatestCallback(onWheel)
  const onInputWheel = useCallback(
    (evt: React.WheelEvent<HTMLInputElement>) => {
      if (!disabled && changeOnWheel) {
        const nativeEvent = evt.nativeEvent as any
        const delta: number = nativeEvent.wheelDelta || -nativeEvent.deltaY || -nativeEvent.detail

        if (delta > 0) {
          onMinus()
        } else if (delta < 0) {
          onPlus()
        }
      }
      onWheeLatest(evt)
    },
    [onWheeLatest, disabled, onMinus, onPlus, changeOnWheel]
  )

  const cls = cx(
    prefixCls,
    className,
    `${prefixCls}--size-${size}`,
    `${prefixCls}--appearance-${appearance}`,
    focused && `${prefixCls}--focused`,
    disabled && `${prefixCls}--disabled`,
    (invalid || !isNumeric(parsedValue)) && `${prefixCls}--invalid`,
    isOutOfRange(parsedValue, min, max) && `${prefixCls}--out-of-bounds`
  )

  const rootProps = {
    ...rest,
    className: cls,
  }

  const getInputProps = useCallback(() => {
    return {
      ref: inputRef,
      className: `${prefixCls}__input`,
      type: 'text',
      role: 'spinbutton',
      'aria-valuenow': parsedValue,
      'aria-valuemin': minProp,
      'aria-valuemax': maxProp,
      // 有格式化处理且失焦时显示 formattedValue 值，否则显示 inputValue 值
      value: formatter && !focused ? formattedValue : inputValue,
      tabIndex,
      autoFocus: autoFocus,
      disabled: disabled,
      onChange: onInputChange,
      onFocus: onInputFocus,
      onBlur: onInputBlur,
      onKeyDown: onInputKeyDown,
      onWheel: onInputWheel,
    }
  }, [
    autoFocus,
    disabled,
    focused,
    formattedValue,
    formatter,
    maxProp,
    minProp,
    onInputBlur,
    onInputChange,
    onInputFocus,
    onInputKeyDown,
    onInputWheel,
    parsedValue,
    prefixCls,
    tabIndex,
    inputValue,
  ])

  const getMinusButtonProps = useCallback(() => {
    return {
      ref: minusButtonElementRef,
      className: cx(`${prefixCls}__minus`, disabledMinus && 'disabled'),
      role: 'button',
      'aria-disabled': disabledMinus ? true : undefined,
      tabIndex: -1,
      disabled: disabledMinus,
      onClick: handleMinusButtonTouch,
    }
  }, [prefixCls, disabledMinus, handleMinusButtonTouch])

  const getPlusButtonProps = useCallback(() => {
    return {
      ref: plusButtonElementRef,
      className: cx(`${prefixCls}__plus`, disabledPlus && 'disabled'),
      role: 'button',
      'aria-disabled': disabledPlus ? true : undefined,
      tabIndex: -1,
      disabled: disabledPlus,
      onClick: handlePlusButtonTouch,
    }
  }, [prefixCls, disabledPlus, handlePlusButtonTouch])

  const getContentProps = useCallback(() => {
    return {
      className: cx(`${prefixCls}__content`),
    }
  }, [prefixCls])

  const getInputWrapperProps = useCallback(() => {
    return {
      className: cx(`${prefixCls}__input-wrapper`),
    }
  }, [prefixCls])

  return {
    rootProps,
    getInputProps,
    getMinusButtonProps,
    getPlusButtonProps,
    getContentProps,
    getInputWrapperProps,
  }
}

export interface UseCounterProps extends CounterProps {
  prefixCls: string
}

const isOutOfRange = (val: number, min: number, max: number) => val > max || val < min
