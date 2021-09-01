import React, { useState, useEffect, useCallback, useRef } from 'react'
import NP from 'number-precision'
import { cx } from '@hi-ui/classname'
import { isBrowser, __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestRef, useLatestCallback } from '@hi-ui/use-latest'
import { useToggle } from '@hi-ui/use-toggle'
import { isNumeric } from '@hi-ui/type-assertion'
import { CounterProps } from './Counter'

const DEFAULT_VALUE = 0

const pointerDown =
  isBrowser && 'ontouchstart' in document.documentElement ? 'onTouchStart' : 'onMouseDown'

export const useCounter = ({
  prefixCls,
  className,
  value: valueProp,
  defaultValue = DEFAULT_VALUE,
  step = 1,
  min: minProp,
  max: maxProp,
  disabled: disabledProp = false,
  onChange,
  tabIndex = 0,
  autoFocus = false,
  focusOnStep = true,
  onFocus,
  onBlur,
  ...rest
}: UseCounterProps) => {
  const min = minProp ?? Number.MIN_SAFE_INTEGER
  const max = maxProp ?? Number.MAX_SAFE_INTEGER

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

  const [inputValue, setInputValue] = useState<React.ReactText>(value)

  const valueRef = useLatestRef(value)

  const blockedChange = valueProp !== undefined && !onChange
  const disabled = blockedChange || disabledProp

  const proxyTryChangeValue = useCallback(
    (nextValue: number, syncInput: boolean) => {
      if (disabled) return

      if (__DEV__) {
        // TODO(统一规范): 对于 ts 类型无法约束到的，但是用户可能存在该行为的，需要开发模式警告提醒
        if (min > max) {
          console.info('Warning: the max must large than min.')
        }
      }

      if (nextValue > max) {
        nextValue = max
      } else if (nextValue < min) {
        nextValue = min
      }

      tryChangeValue(nextValue)
      if (syncInput) {
        setInputValue(nextValue)
      }
    },
    [disabled, max, min, tryChangeValue]
  )

  const inputRef = useRef<HTMLInputElement>(null)

  const reachMax = value >= max
  const reachMin = value <= min
  const disabledMinus = disabled || reachMin
  const disabledPlus = disabled || reachMax

  const onMinus = useCallback(() => {
    if (disabledMinus) return
    proxyTryChangeValue(NP.minus(valueRef.current, step), true)
  }, [proxyTryChangeValue, disabledMinus, valueRef, step])

  const onPlus = useCallback(() => {
    if (disabledPlus) return
    proxyTryChangeValue(NP.plus(valueRef.current, step), true)
  }, [proxyTryChangeValue, disabledPlus, valueRef, step])

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // TODO(规范): 统一组件库键盘按键兼容方案
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
    },
    [onMinus, onPlus]
  )

  const [focus, focusAction] = useToggle()

  const onFocusLatest = useLatestCallback(onFocus)
  const onBlurLatest = useLatestCallback(onBlur)

  useEffect(() => {
    if (autoFocus && !disabled) {
      focusAction.on()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (disabled) return
    if (!inputRef.current) return

    if (focus) {
      inputRef.current.focus()
    }
  }, [disabled, focus])

  const handleMinusButtonTouch = useCallback(
    (evt: React.MouseEvent) => {
      if (focusOnStep) {
        evt.preventDefault()
        focusAction.on()
      }

      onMinus()
    },
    [onMinus, focusAction, focusOnStep]
  )

  const handlePlusButtonTouch = useCallback(
    (evt: React.MouseEvent) => {
      if (focusOnStep) {
        evt.preventDefault()
        focusAction.on()
      }

      onPlus()
    },
    [onPlus, focusAction, focusOnStep]
  )

  const inputNumericRef = useRef<number>(value)

  useEffect(() => {
    // 如果是数值类型，则立即进行修改原始值，保证输入错误也能显示最接近的正确值
    if (isNumeric(inputValue)) {
      inputNumericRef.current = Number(inputValue)
    }
  }, [inputValue])

  const onInputChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      const { value } = evt.target

      setInputValue(value)
    },
    [disabled]
  )

  const onInputFocus = useCallback(
    (evt) => {
      focusAction.on()
      onFocusLatest(evt)
    },
    [onFocusLatest, focusAction]
  )

  const onInputBlur = useCallback(
    (evt) => {
      // 如果不合法，则设会之前值
      if (typeof inputNumericRef.current !== 'number') {
        inputNumericRef.current = valueRef.current
      }

      proxyTryChangeValue(inputNumericRef.current, true)

      focusAction.off()
      onBlurLatest(evt)
    },
    [valueRef, proxyTryChangeValue, onBlurLatest, focusAction]
  )

  const cls = cx(
    prefixCls,
    className,
    focus && `${prefixCls}--focused`,
    !isNumeric(value) && `${prefixCls}--invalid`,
    isOutOfRange(value, min, max) && `${prefixCls}--out-of-bounds`
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
      'aria-valuenow': value,
      'aria-valuemin': minProp,
      'aria-valuemax': maxProp,
      value: inputValue,
      tabIndex,
      autoFocus: autoFocus,
      disabled: disabled,
      onChange: onInputChange,
      onFocus: onInputFocus,
      onBlur: onInputBlur,
      onKeyDown: onInputKeyDown,
    }
  }, [
    prefixCls,
    minProp,
    maxProp,
    value,
    inputValue,
    tabIndex,
    autoFocus,
    disabled,
    onInputChange,
    onInputBlur,
    onInputKeyDown,
    onInputFocus,
  ])

  const getMinusButtonProps = useCallback(() => {
    return {
      className: cx(`${prefixCls}__minus`, disabledMinus && 'disabled'),
      role: 'button',
      'aria-disabled': disabledMinus ? true : undefined,
      tabIndex: -1,
      disabled: disabledMinus,
      [pointerDown]: handleMinusButtonTouch,
    }
  }, [prefixCls, disabledMinus, handleMinusButtonTouch])

  const getPlusButtonProps = useCallback(() => {
    return {
      className: cx(`${prefixCls}__plus`, disabledPlus && 'disabled'),
      role: 'button',
      'aria-disabled': disabledPlus ? true : undefined,
      tabIndex: -1,
      disabled: disabledPlus,
      [pointerDown]: handlePlusButtonTouch,
    }
  }, [prefixCls, disabledPlus, handlePlusButtonTouch])

  return {
    rootProps,
    getInputProps,
    getMinusButtonProps,
    getPlusButtonProps,
  }
}

export interface UseCounterProps extends CounterProps {
  prefixCls: string
}

const isOutOfRange = (val: number, min: number, max: number) => val > max || val < min
