import React, { useEffect, useCallback, useRef } from 'react'
import { plus, minus } from 'number-precision'
import { cx } from '@hi-ui/classname'
import { invariant } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useLatestRef, useLatestCallback } from '@hi-ui/use-latest'
import { useToggle } from '@hi-ui/use-toggle'
import { isNumeric } from '@hi-ui/type-assertion'
import { CounterProps } from './Counter'

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
  ...rest
}: UseCounterProps) => {
  const min = minProp ?? Number.MIN_SAFE_INTEGER
  const max = maxProp ?? Number.MAX_SAFE_INTEGER

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange, Object.is)

  const valueRef = useLatestRef(value)

  const proxyTryChangeValue = useCallback(
    (nextValue: number, syncInput: boolean) => {
      if (disabled) return

      invariant(min <= max, 'The max must large than min.')

      if (nextValue > max) {
        nextValue = max
      } else if (nextValue < min) {
        nextValue = min
      }

      tryChangeValue(nextValue)
    },
    [disabled, max, min, tryChangeValue]
  )

  const inputRef = useRef<HTMLInputElement>(null)

  const reachMax = value >= max
  const reachMin = value <= min
  const disabledMinus = disabled || reachMin
  const disabledPlus = disabled || reachMax

  const inputNumericRef = useRef<number>(value)

  // 如果是数值类型，则立即进行修改原始值，保证输入错误也能显示最接近的正确值
  // 最终 input 显示的值是基于 inputNumericRef.current
  if (isNumeric(value)) {
    inputNumericRef.current = Number(value)
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
        focusedAction.on()
      }

      onMinus()
    },
    [onMinus, focusedAction, focusOnStep]
  )

  const handlePlusButtonTouch = useCallback(
    (evt: React.MouseEvent) => {
      if (focusOnStep) {
        evt.preventDefault()
        evt.stopPropagation()
        focusedAction.on()
      }

      onPlus()
    },
    [onPlus, focusedAction, focusOnStep]
  )

  const onInputChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return

      const { value } = evt.target

      tryChangeValue(value as any)
    },
    [disabled, tryChangeValue]
  )

  const onInputFocus = useCallback(
    (evt) => {
      focusedAction.on()
      onFocusLatest(evt)
    },
    [onFocusLatest, focusedAction]
  )

  const plusButtonElementRef = useRef<HTMLButtonElement | null>(null)
  const minusButtonElementRef = useRef<HTMLButtonElement | null>(null)

  const onInputBlur = useCallback(
    (evt) => {
      const relatedTarget = evt.relatedTarget

      // 拦截加减按钮点击，阻止其触发 input 失焦
      if (
        inputRef.current &&
        ((plusButtonElementRef.current && plusButtonElementRef.current === relatedTarget) ||
          (minusButtonElementRef.current && minusButtonElementRef.current === relatedTarget))
      ) {
        inputRef.current.focus()
        return
      }

      const currentValue = getCurrentValue()
      proxyTryChangeValue(currentValue, true)

      focusedAction.off()
      onBlurLatest(evt)
    },
    [getCurrentValue, proxyTryChangeValue, onBlurLatest, focusedAction]
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
    (invalid || !isNumeric(value)) && `${prefixCls}--invalid`,
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
      value,
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
    prefixCls,
    minProp,
    maxProp,
    value,
    tabIndex,
    autoFocus,
    disabled,
    onInputChange,
    onInputBlur,
    onInputKeyDown,
    onInputFocus,
    onInputWheel,
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
