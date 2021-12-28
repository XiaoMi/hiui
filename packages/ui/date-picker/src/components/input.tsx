import React, { useRef, useState, useEffect, useContext } from 'react'
import moment from 'moment'
import DPContext from '../context'
import { getBelongWeek, getBelongWeekYear } from '../utils/week'

export type InputChangeEvent = (val: moment.Moment, index: number) => void

const Input = ({
  date,
  onChange,
  onFocus,
  dir,
  placeholder,
}: {
  placeholder: string
  dir: number
  onFocus: () => void
  onChange: InputChangeEvent
  date: moment.Moment | null
}) => {
  const {
    type,
    format,
    disabled,
    hourStep,
    minuteStep,
    secondStep,
    inputReadOnly,
    localeData,
    realFormat,
    weekOffset,
    locale,
  } = useContext(DPContext)

  const cacheValues = useRef<string | null>(null)
  const [value, setValue] = useState<string | null>('')
  useEffect(() => {
    let vals = date && moment(date).format(realFormat)
    if (type.includes('week') && date) {
      // const _date = moment(date).year(y)
      // vals = moment(_date).format(realFormat)
      // if (locale === 'zh-CN' && typeof format === 'undefined') {
      //   vals = y + '-W' + moment(_date).week()
      // }

      if (typeof format === 'undefined') {
        vals = localeData.datePicker.weekrange(
          getBelongWeekYear(date, weekOffset),
          getBelongWeek(date, weekOffset)
        )
      } else {
        const y = moment(date).weekYear()
        const _date = moment(date).year(y)
        vals = moment(_date).format(realFormat)
      }
    }
    setValue(vals)
    cacheValues.current = vals
  }, [date, weekOffset, localeData, type, format, realFormat, locale])
  const inputChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue(val)
    if (val && val.trim().length === realFormat.length) {
      const nVal = moment(val)
      if (nVal.isValid()) {
        onChange(nVal, dir)
      } else {
        setValue(cacheValues.current)
      }
    }
  }
  return (
    <input
      type="text"
      placeholder={placeholder}
      // WARNING: 注释老逻辑，暂时无法理解为何存在 step 则不允许输入，按照便捷容错方法，应该是step不为1才会
      // readOnly={hourStep || minuteStep || secondStep || inputReadOnly ? 'readOnly' : false}
      readOnly={!!(hourStep !== 1 || minuteStep !== 1 || secondStep !== 1 || inputReadOnly)}
      className={disabled ? 'disabled' : ''}
      disabled={disabled}
      onChange={inputChangeEvent}
      onFocus={onFocus}
      value={value || ''}
    />
  )
}

export default Input
