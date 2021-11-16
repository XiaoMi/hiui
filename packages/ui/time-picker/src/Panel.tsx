import React, { FC, useCallback, useMemo } from 'react'
import {
  TimePickerFilter,
  TimePickerFormat,
  TimePickerPanelType,
  TimePickerSelectorType,
  TimePickerStep,
} from './@types'
import { analysisFormat } from './utils/analysisFormat'
import { generateSelectorData } from './utils/generateSelectorData'
import { getSelectorTitle } from './utils/getSelectorTitle'
import { Selector } from './Selector'

type ExtendType = Required<TimePickerFilter> & Required<TimePickerStep>

interface PanelProps extends ExtendType {
  prefix: string
  panel: TimePickerPanelType
  value: string
  onChange: (value: string) => void
  format: TimePickerFormat
  itemHeight: number
  fullDisplayItemNumber: number
}

export const Panel: FC<PanelProps> = (props) => {
  const {
    hourStep,
    secondStep,
    minuteStep,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    prefix,
    format,
    value,
    panel,
    onChange,
    itemHeight,
    fullDisplayItemNumber,
  } = props

  const componentPrefix = useMemo(() => `${prefix}__panel`, [prefix])

  const selectorTypes = useMemo(() => analysisFormat(format), [format])
  const separateValue = useMemo(
    () =>
      value
        .split(':')
        .filter((item) => item)
        .map((item) => Number(item)),
    [value]
  )

  const getSelectorData = useCallback(
    (type: TimePickerSelectorType) =>
      generateSelectorData({
        panelType: panel,
        type,
        filter: {
          disabledHours,
          disabledMinutes,
          disabledSeconds,
        },
        step: {
          secondStep,
          hourStep,
          minuteStep,
        },
        selectorTypes,
        separateValue,
      }),
    [
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      secondStep,
      hourStep,
      minuteStep,
      panel,
      selectorTypes,
      separateValue,
    ]
  )

  const renderHeader = useCallback(() => {
    return (
      <div className={`${componentPrefix}__header`}>
        {selectorTypes.map((item) => (
          <div className={`${componentPrefix}__header-title`} key={item}>
            {getSelectorTitle(item)}
          </div>
        ))}
      </div>
    )
  }, [selectorTypes, componentPrefix])

  const renderSelectors = useCallback(() => {
    return (
      <div className={`${componentPrefix}__selector-container`}>
        {selectorTypes.map((type, index) => {
          return (
            <Selector
              value={String(separateValue[index])}
              prefix={prefix}
              key={type}
              itemHeight={itemHeight}
              fullDisplayItemNumber={fullDisplayItemNumber}
              onChange={(e) => {
                let result = [...separateValue].slice(0, selectorTypes.length)
                // 如果 value = ''，则代表为空值
                // 此时选择任意项，其他项直接视作 0
                if (value === '') {
                  result = [0, 0, 0].slice(0, selectorTypes.length)
                }

                result[index] = Number(e.id)
                onChange(result.map((item) => String(item).padStart(2, '0')).join(':'))
              }}
              data={getSelectorData(type)}
            />
          )
        })}
        <div className={`${componentPrefix}__indicator`} style={{ height: `${itemHeight}px` }} />
      </div>
    )
  }, [
    selectorTypes,
    componentPrefix,
    prefix,
    getSelectorData,
    onChange,
    separateValue,
    itemHeight,
    fullDisplayItemNumber,
    value,
  ])

  return (
    <div className={componentPrefix}>
      {renderHeader()}
      {renderSelectors()}
    </div>
  )
}
