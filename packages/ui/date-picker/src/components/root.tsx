import React, { useContext, useEffect, useState } from 'react'
import { cx } from '@hi-ui/classname'
import Input, { InputChangeEvent } from './input'
import PickerIcon from './picker-icon'
import DPContext from '../context'
import usePlaceholder from '../hooks/usePlaceholders'
import { parseValue } from '../utils'

const Root = ({
  onTrigger,
  inputChangeEvent,
  onClear,
  inputFocus,
  setAttachEl,
  dateRangeTimePanelNow,
}: {
  onTrigger: (index: number) => void
  onClear: () => void
  setAttachEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  inputFocus: boolean
  inputChangeEvent: InputChangeEvent
  dateRangeTimePanelNow: number
}) => {
  const {
    localeData,
    type,
    outDate,
    placeholder,
    showTime,
    disabled,
    clearable,
    theme,
    width,
    value,
    format,
    bordered,
    prefixCls,
    weekOffset,
    isInDateRangeTimeMode,
    showPanel,
  } = useContext(DPContext)
  const [inputData, setInputData] = useState(outDate)

  const placeholders = usePlaceholder({
    type,
    showTime,
    placeholder,
    localeData,
  })
  useEffect(() => {
    setInputData(value ? parseValue(value, type, weekOffset, format) : outDate)
  }, [value, format, type, outDate, weekOffset])
  const onPickerClickEvent = (index: number) => {
    onTrigger(index)
  }

  const pickerIconClick = (isClear: boolean) => {
    if (isClear) {
      onClear()
      return
    }
    onPickerClickEvent(0)
  }
  const _cls = cx(
    `${prefixCls}__picker`,
    `theme__${theme}`,
    `${prefixCls}__picker--${type}`,
    inputFocus && `${prefixCls}__picker--focus`,
    disabled && `${prefixCls}__picker--disabled`,
    showTime && `${prefixCls}__picker--hastime`,
    { bordered }
  )

  const renderRange = type.includes('range') || type === 'timeperiod'

  return (
    <div className={_cls} ref={setAttachEl} style={{ width: width }}>
      <div className={`${prefixCls}__input`} style={{ width: width }}>
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
        >
          <Input
            date={inputData[0]}
            placeholder={placeholders[0]}
            onChange={inputChangeEvent}
            onFocus={() => onPickerClickEvent(0)}
            dir={0}
          />
        </div>
        {renderRange && (
          <React.Fragment>
            <span className={`${prefixCls}__input--connection`}>{localeData.datePicker.to}</span>
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
            >
              <Input
                date={inputData[1]}
                placeholder={placeholders[1]}
                onChange={inputChangeEvent}
                onFocus={() => onPickerClickEvent(1)}
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
