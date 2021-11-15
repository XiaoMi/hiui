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
  border: boolean
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
    border,
    type,
    placeholders,
    onChange,
  } = props
  const componentClass = useMemo(() => `${prefix}__input`, [prefix])

  const [cacheValue, setCacheValue] = useState<string[]>(value)

  const getPanelType = useCallback(
    (index: number): TimePickerPanelType => {
      if (cacheValue.length === 1) {
        return 'single'
      } else {
        return index === 0 ? 'range-start' : 'range-end'
      }
    },
    [cacheValue]
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

  const isValid = useMemo(() => {
    const valueValid = cacheValue.every((item, index) => validChecker(item, getPanelType(index)))

    if (type === 'range' && valueValid) {
      // 数据格式正确，检查范围数据
      // 全为空字符串，则认为是合法的（还未选择）
      if (cacheValue.every((item) => item === '')) {
        return true
      }
      // 结束时间要>开始时间
      return cacheValue[1] > cacheValue[0]
    } else {
      return valueValid
    }
  }, [cacheValue, validChecker, getPanelType, type])

  const renderInput = useCallback(
    (matchValue: string, index: number) => {
      const dispose = (disposeValue: string) => {
        const newValue = disposeInputValue(format, disposeValue)
        const result = [...cacheValue]
        // 值未改变，则不继续处理
        if (result[index] === newValue) {
          return
        }

        result[index] = newValue
        setCacheValue(result)
        // 合法，则通知外部
        if (validChecker(newValue, getPanelType(index))) {
          onChange([...result])
        }
      }
      return (
        <input
          className={`${componentClass}__interact-area`}
          onChange={(e) => dispose(e.target.value)}
          // 失去焦点，添加 : 引起输入自动格式化处理功能
          onBlur={() => {
            dispose(cacheValue[index] + ':')
          }}
          value={matchValue}
          placeholder={placeholders[index]}
        />
      )
    },
    [placeholders, format, onChange, cacheValue, getPanelType, validChecker, componentClass]
  )

  return (
    <div
      className={cx(componentClass, {
        [`${componentClass}--not-valid`]: !isValid,
        [`${componentClass}--border`]: border,
      })}
    >
      <div className={`${componentClass}__wrapper`}>
        {renderInput(cacheValue[0], 0)}
        {type === 'range' && <div className={`${componentClass}__range-separator`}>至</div>}
        {type === 'range' && renderInput(cacheValue[1], 1)}
      </div>
    </div>
  )
}
