import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import {
  TimePickerFilter,
  TimePickerFormat,
  TimePickerPanelType,
  TimePickerStep,
  TimePickerType,
} from './@types'
import { cx } from '@hi-ui/classname'
import { valueChecker } from './utils/valueChecker'
import { disposeInputValue } from './utils/disposeInputValue'

type ExtendType = Required<TimePickerFilter> & Required<TimePickerStep>

interface InputProps extends ExtendType {
  value: string[]
  onChange: (value: string[]) => void
  placeholders: string[]
  type: TimePickerType
  prefix: string
  format: TimePickerFormat
  onFocus: () => void
  disabled: boolean
}

export const Input: FC<InputProps> = (props) => {
  const {
    prefix,
    value,
    format,
    hourStep,
    minuteStep,
    secondStep,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    type,
    placeholders,
    onChange,
    onFocus,
    disabled,
  } = props
  const componentClass = useMemo(() => `${prefix}__input`, [prefix])

  const [cacheValue, setCacheValue] = useState<string[]>(value)

  const getPanelType = useCallback(
    (index: number): TimePickerPanelType => {
      if (type === 'single') {
        return 'single'
      } else {
        return index === 0 ? 'range-start' : 'range-end'
      }
    },
    [type]
  )
  // 检查值是否合规
  const validChecker = useCallback(
    (checkValue: string, panelType: TimePickerPanelType) => {
      return valueChecker({
        value: checkValue,
        format,
        filter: {
          disabledSeconds,
          disabledMinutes,
          disabledHours,
        },
        step: {
          hourStep,
          minuteStep,
          secondStep,
        },
        panelType,
      })
    },
    [hourStep, minuteStep, secondStep, disabledHours, disabledMinutes, disabledSeconds, format]
  )

  // 缓存同步外部
  useEffect(() => {
    setCacheValue(value.slice(0, type === 'single' ? 1 : 2))
  }, [value, type])

  const judgeIsValid = useCallback(
    (disposeValue: string[]) => {
      const valueValid = disposeValue.every((item, index) =>
        validChecker(item, getPanelType(index))
      )

      if (type === 'range' && valueValid) {
        // 数据格式正确，检查范围数据
        // 全为空字符串，则认为是合法的（还未选择）
        if (disposeValue.every((item) => item === '')) {
          return true
        }
        // 结束时间要>开始时间
        return disposeValue[1] > disposeValue[0]
      } else {
        return valueValid
      }
    },
    [validChecker, getPanelType, type]
  )

  const renderInput = useCallback(
    (matchValue: string, index: number) => {
      const dispose = (disposeValue: string) => {
        const newValue = disposeInputValue(format, disposeValue)
        const result = [...cacheValue]
        // 值未改变，则不继续处理
        if (result[index] === newValue) {
          return undefined
        }

        result[index] = newValue
        setCacheValue(result)
        // 合法，则通知外部
        if (validChecker(newValue, getPanelType(index))) {
          return [...result]
        }

        return undefined
      }
      return (
        <div className={`${componentClass}__wrapper`}>
          <input
            className={`${componentClass}__interact-area`}
            onChange={(e) => {
              const result = dispose(e.target.value)
              if (result) {
                onChange(result)
              }
            }}
            // 失去焦点，添加 : 开始自动值处理
            // 如果此时还是不正确，则，直接重置值
            onBlur={() => {
              const result = dispose(cacheValue[index] + ':')
              if (!result) {
                setCacheValue(value)
              } else {
                onChange(result)
              }
            }}
            disabled={disabled}
            onFocus={() => {
              onFocus()
            }}
            value={matchValue}
            placeholder={placeholders[index]}
          />
        </div>
      )
    },
    [
      placeholders,
      format,
      value,
      onFocus,
      onChange,
      cacheValue,
      getPanelType,
      validChecker,
      componentClass,
      disabled,
    ]
  )

  return (
    <div
      className={cx(componentClass, {
        [`${componentClass}--not-valid`]: !judgeIsValid(cacheValue),
        [`${componentClass}--range`]: type === 'range',
        [`${componentClass}--disabled`]: disabled,
      })}
    >
      {renderInput(cacheValue[0], 0)}
      {type === 'range' && <div className={`${componentClass}__range-separator`}>至</div>}
      {type === 'range' && renderInput(cacheValue[1], 1)}
    </div>
  )
}
