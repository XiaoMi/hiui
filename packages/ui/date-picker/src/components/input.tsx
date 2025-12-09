import React, { useRef, useState, useEffect, useContext } from 'react'
import moment from 'moment'
import DPContext from '../context'
import { getBelongWeek, getBelongWeekYear } from '../utils/week'
import { cx } from '@hi-ui/classname'

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
  onFocus?: () => void
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
    i18n,
    realFormat,
    weekOffset,
    locale,
    prefixCls,
  } = useContext(DPContext)

  const cacheValues = useRef<string | null>(null)
  const [value, setValue] = useState<string | null>('')

  useEffect(() => {
    if (typeof format === 'function' && date) {
      cacheValues.current = format(date)
      setValue(cacheValues.current)
      return
    }

    let vals = date && moment(date).format(realFormat)

    if (type.includes('week') && date) {
      // const _date = moment(date).year(y)
      // vals = moment(_date).format(realFormat)
      // if (locale === 'zh-CN' && typeof format === 'undefined') {
      //   vals = y + '-W' + moment(_date).week()
      // }

      if (typeof format === 'undefined') {
        vals = i18n.get('datePicker.weekRange', {
          year: getBelongWeekYear(date, weekOffset),
          week: getBelongWeek(date, weekOffset),
        })
      } else {
        if (typeof format === 'function') {
          vals = format(date)
        } else {
          const y = moment(date).weekYear()
          const _date = moment(date).year(y)

          vals = moment(_date).format(realFormat)
        }
      }
    }

    if (type.includes('quarter') && vals) {
      vals = vals?.toLocaleUpperCase()
    }

    setValue(vals)

    cacheValues.current = vals
  }, [date, weekOffset, i18n, type, format, realFormat, locale])

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
    <div className={`${prefixCls}__picker__input-container`}>
      <input
        type="text"
        placeholder={placeholder}
        // WARNING: 注释老逻辑，暂时无法理解为何存在 step 则不允许输入，按照便捷容错方法，应该是step不为1才会
        // readOnly={hourStep || minuteStep || secondStep || inputReadOnly ? 'readOnly' : false}
        readOnly={!!(hourStep !== 1 || minuteStep !== 1 || secondStep !== 1 || inputReadOnly)}
        className={cx(
          disabled ? `${prefixCls}__picker__input--disabled` : '',
          `${prefixCls}__picker__input`
        )}
        disabled={disabled}
        onChange={inputChangeEvent}
        onFocus={onFocus}
        value={value || ''}
        onBlur={() => {
          if (!moment(value).isValid()) {
            setValue(cacheValues.current)
          }
        }}
      />
      <div className={`${prefixCls}__picker__input-shadow`}>{value || placeholder}</div>
    </div>
  )
}

export default Input
