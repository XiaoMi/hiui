import React, { FC, useCallback, useMemo } from 'react'
import {
  TimePickerFilterProps,
  TimePickerFormat,
  TimePickerPanelType,
  TimePickerSelectorType,
  TimePickerStep,
  TimePickerType,
} from './@types'
import { getRange } from './utils/getRange'
import { Panel } from './Panel'
import { analysisFormat } from './utils/analysisFormat'
import { getFormatDefault } from './utils/getFormatDefault'
import { _prefix } from './TimePicker'
import { useFilter } from './hooks/useFilter'

type ExtendType = Partial<TimePickerFilterProps> & Required<TimePickerStep>

interface PopContentProps extends ExtendType {
  prefix?: string
  value: string[]
  onChange: (value: string[]) => void
  format: TimePickerFormat
  type: TimePickerType
  itemHeight: number
  fullDisplayItemNumber: number
  style?: React.CSSProperties
}

const DefaultDisabledFunc = () => []

export const PopContent: FC<PopContentProps> = (props) => {
  const {
    prefix = _prefix,
    value: dangerousValue,
    onChange,
    format,
    type,
    itemHeight,
    fullDisplayItemNumber,
    hourStep,
    minuteStep,
    secondStep,
    disabledHours: originalDisabledHours = DefaultDisabledFunc,
    disabledSeconds: originalDisabledSeconds = DefaultDisabledFunc,
    disabledMinutes: originalDisabledMinutes = DefaultDisabledFunc,
    style,
  } = props

  // 将值统一转化为函数
  // 由于 pop content 会被 date-picker 直接调用，故而在此多做一次兼容处理
  const { disabledHours, disabledMinutes, disabledSeconds } = useFilter({
    disabledHours: originalDisabledHours,
    disabledMinutes: originalDisabledMinutes,
    disabledSeconds: originalDisabledSeconds,
  })

  const value = useMemo(() => dangerousValue.map((item) => item || getFormatDefault(format)), [
    dangerousValue,
    format,
  ])

  const selectorTypes = useMemo(() => analysisFormat(format), [format])
  const separateValue = useMemo(
    () =>
      value.map((disposeItem) =>
        disposeItem
          .split(':')
          .filter((item) => item)
          .map((item) => Number(item))
      ),
    [value]
  )

  const getMatchTypeValue = useCallback(
    (index: number, type: TimePickerSelectorType) => {
      const matchValue = separateValue[index]
      const typeIndex = selectorTypes.indexOf(type)
      const result = matchValue[typeIndex]
      return result !== undefined && result >= 0 ? result : -1
    },
    [separateValue, selectorTypes]
  )

  const judgeTypeIsLastOne = useCallback(
    (type: TimePickerSelectorType) => selectorTypes.indexOf(type) === selectorTypes.length - 1,
    [selectorTypes]
  )

  const customDisabledHours = useCallback(
    (panel: TimePickerPanelType) => {
      let result = disabledHours(panel)
      if (panel === 'range-end') {
        const startHour = getMatchTypeValue(0, TimePickerSelectorType.hour)
        const isLastOne = judgeTypeIsLastOne(TimePickerSelectorType.hour)
        // 当当前类型为最后一个类型的时候
        // 不能够选择与开始一致的值
        result = [...result, ...getRange(0, isLastOne ? startHour : startHour - 1)]
      }
      return result
    },
    [getMatchTypeValue, disabledHours, judgeTypeIsLastOne]
  )

  const customDisabledMinute = useCallback(
    (hour: number, panel: TimePickerPanelType) => {
      let result = disabledMinutes(hour, panel)

      if (panel === 'range-end') {
        const startHour = getMatchTypeValue(0, TimePickerSelectorType.hour)
        const startMinute = getMatchTypeValue(0, TimePickerSelectorType.minute)

        // 当前类型中包含了小时
        // minute 有值
        if (hour >= 0) {
          // 开始时间等于结束时间，则直接禁用开始时间之前的时间
          if (startHour === hour) {
            const isLastOne = judgeTypeIsLastOne(TimePickerSelectorType.minute)
            // 当当前类型为最后一个类型的时候
            // 不能够选择与开始一致的值
            result = [...result, ...getRange(0, isLastOne ? startMinute : startMinute - 1)]
          }
          // 开始时间大于结束时间，直接禁用所有
          else if (startHour > hour) {
            result = [...result, ...getRange(0, 59)]
          }
        }
      }
      return result
    },
    [getMatchTypeValue, judgeTypeIsLastOne, disabledMinutes]
  )

  const customDisabledSeconds = useCallback(
    (hour: number, minute: number, panel: TimePickerPanelType) => {
      let result = disabledSeconds(hour, minute, panel)
      if (panel === 'range-end') {
        const startHour = getMatchTypeValue(0, TimePickerSelectorType.hour)
        const startMinute = getMatchTypeValue(0, TimePickerSelectorType.minute)
        const startSecond = getMatchTypeValue(0, TimePickerSelectorType.second)

        let allDisabled = false

        // 如果小时存在，并且开始小时大于结束，禁用所有秒
        if (hour >= 0 && startHour > hour) {
          allDisabled = true
        }
        // 如果小时存在，并且开始结束小时一样，并且开始分钟大于结束分钟，禁用所有秒
        if (hour >= 0 && startHour === hour && minute >= 0 && startMinute > minute) {
          allDisabled = true
        }

        if (allDisabled) {
          result = [...result, ...getRange(0, 59)]
        } else {
          // hour 不存在 或者存在并且开始与结束相同
          // 则视作，小时相等
          const isHourEqual = hour < 0 || startHour === hour
          // minute 不存在 或者存在并且开始与结束相同
          // 则视作，分钟相等
          const isMinuteEqual = minute < 0 || startMinute === minute

          // 分钟小时相等，则需要根据 开始 秒 做禁用处理
          if (isHourEqual && isMinuteEqual) {
            result = [...result, ...getRange(0, startSecond)]
          }
        }
      }
      return result
    },
    [getMatchTypeValue, disabledSeconds]
  )

  const componentClass = useMemo(() => `${prefix}__pop-content`, [prefix])
  const renderPanel = useCallback(
    (index: number) => {
      return (
        <div className={`${componentClass}__panel-container`}>
          <Panel
            itemHeight={itemHeight}
            fullDisplayItemNumber={fullDisplayItemNumber}
            hourStep={hourStep}
            secondStep={secondStep}
            minuteStep={minuteStep}
            disabledHours={customDisabledHours}
            disabledMinutes={customDisabledMinute}
            disabledSeconds={customDisabledSeconds}
            prefix={prefix}
            format={format}
            value={value[index]}
            panel={type === 'single' ? 'single' : index === 0 ? 'range-start' : 'range-end'}
            onChange={(e) => {
              const result = [...value]
              result[index] = e
              onChange(result)
            }}
          />
        </div>
      )
    },
    [
      hourStep,
      minuteStep,
      secondStep,
      customDisabledHours,
      customDisabledMinute,
      customDisabledSeconds,
      format,
      prefix,
      type,
      value,
      onChange,
      fullDisplayItemNumber,
      itemHeight,
      componentClass,
    ]
  )

  return (
    <div className={componentClass} style={style}>
      {renderPanel(0)}
      {type === 'range' && <div className={`${componentClass}__separator`} />}
      {type === 'range' && renderPanel(1)}
    </div>
  )
}
