import React, { useContext, useEffect, useMemo, useState } from 'react'
import { cx } from '@hi-ui/classname'
import Input, { InputChangeEvent } from './input'
import PickerIcon from './picker-icon'
import DPContext from '../context'
import usePlaceholder from '../hooks/usePlaceholders'
import { parseValue } from '../utils'
import moment from 'moment'

const Root = ({
  onTrigger,
  inputChangeEvent,
  onClear,
  inputFocus,
  setAttachEl,
  dateRangeTimePanelNow,
  invalid,
  customRender,
}: {
  onTrigger: (index: number) => void
  onClear: () => void
  setAttachEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  inputFocus: boolean
  inputChangeEvent: InputChangeEvent
  dateRangeTimePanelNow: number
  invalid: boolean
  customRender?: React.ReactNode | ((option: (string | undefined)[]) => React.ReactNode)
}) => {
  const {
    i18n,
    type,
    outDate,
    placeholder,
    showTime,
    disabled,
    clearable,
    theme,
    value,
    format,
    prefixCls,
    weekOffset,
    isInDateRangeTimeMode,
    showPanel,
    appearance,
    min,
    max,
    size,
    strideSelectMode,
  } = useContext(DPContext)
  const [inputData, setInputData] = useState(outDate)

  const placeholders = usePlaceholder({
    type,
    showTime,
    placeholder,
    i18n,
  })

  useEffect(() => {
    setInputData(
      parseValue(
        value,
        type,
        weekOffset,
        typeof format === 'string' ? format : undefined,
        strideSelectMode
      )
    )
  }, [value, format, type, weekOffset, strideSelectMode])

  useEffect(() => {
    setInputData(outDate)
  }, [outDate])

  const onPickerClickEvent = (index: number) => {
    if (disabled) return
    onTrigger(index)
  }

  const pickerIconClick = (isClear: boolean) => {
    if (isClear) {
      onClear()
      return
    }
    onPickerClickEvent(0)
  }

  const renderRange = type.includes('range') || type === 'timeperiod'

  const isValueValid = useMemo(() => {
    const isInRange = (date: moment.Moment) => {
      let granularity: moment.unitOfTime.StartOf = 'date'

      if (type.includes('date')) {
        granularity = 'date'
      } else if (type.includes('week')) {
        granularity = 'week'
      } else if (type.includes('month')) {
        granularity = 'month'
      } else if (type.includes('year')) {
        granularity = 'year'
      } else if (type.includes('time')) {
        granularity = 'minute'
      }

      if (min && date.isBefore(min, granularity)) {
        return false
      }
      if (max && date.isAfter(max, granularity)) {
        return false
      }

      return true
    }

    if (inputData[0] && !isInRange(inputData[0])) {
      return false
    }

    if (renderRange && inputData[1] && !isInRange(inputData[1])) {
      return false
    }
    return true
  }, [inputData, min, max, renderRange, type])

  const _cls = cx(
    `${prefixCls}__picker`,
    `theme__${theme}`,
    `${prefixCls}__picker--${type}`,
    `${prefixCls}__picker--appearance-${appearance}`,
    `${prefixCls}__picker--size-${size}`,
    inputFocus && `${prefixCls}__picker--focus`,
    disabled && `${prefixCls}__picker--disabled`,
    showTime && `${prefixCls}__picker--hastime`,
    (invalid || !isValueValid) && `${prefixCls}__picker--invalid`
  )

  return customRender ? (
    <div
      ref={setAttachEl}
      onClick={() => {
        if (renderRange) {
          onPickerClickEvent(1)
        } else {
          onPickerClickEvent(0)
        }
      }}
    >
      {typeof customRender === 'function'
        ? customRender(inputData.map((item) => item?.format('YYYY-MM-DD')))
        : customRender}
    </div>
  ) : (
    <div className={_cls} ref={setAttachEl}>
      <div className={`${prefixCls}__picker__wrapper`}>
        <div
          className={cx(
            `${prefixCls}__input-selector`,
            // 选择器位于 日期时间范围 模式下
            isInDateRangeTimeMode && `${prefixCls}__input-selector--date-time-range`,
            // 只有在展示 panel，并且 位于特定模式下时，才会激活选择器
            isInDateRangeTimeMode &&
              showPanel &&
              dateRangeTimePanelNow === 0 &&
              `${prefixCls}__input-selector--active`
          )}
          onClick={() => onPickerClickEvent(0)}
        >
          <Input
            date={inputData[0]}
            placeholder={placeholders[0]}
            onChange={inputChangeEvent}
            dir={0}
          />
        </div>
        {renderRange && (
          <React.Fragment>
            <span className={`${prefixCls}__input--connection`}>-</span>
            <div
              className={cx(
                `${prefixCls}__input-selector`,
                // 选择器位于 日期时间范围 模式下
                isInDateRangeTimeMode && `${prefixCls}__input-selector--date-time-range`,
                // 只有在展示 panel，并且 位于特定模式下时，才会激活选择器
                isInDateRangeTimeMode &&
                  showPanel &&
                  dateRangeTimePanelNow === 1 &&
                  `${prefixCls}__input-selector--active`
              )}
              onClick={() => onPickerClickEvent(1)}
            >
              <Input
                date={inputData[1]}
                placeholder={placeholders[1]}
                onChange={inputChangeEvent}
                dir={1}
              />
            </div>
          </React.Fragment>
        )}
        <PickerIcon
          focus={inputFocus}
          type={type}
          showTime={showTime}
          disabled={disabled}
          clearable={clearable}
          onClick={pickerIconClick}
        />
      </div>
    </div>
  )
}

export default Root
