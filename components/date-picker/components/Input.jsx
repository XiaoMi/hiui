import React, { useRef, useState, useEffect, useContext } from 'react'
import moment from 'moment'
import DPContext from '../context'
import { useFormat } from '../hooks'
const Input = ({ date, onChange, onFocus, dir, placeholder }) => {
  const { type, format, disabled, showTime, hourStep, minuteStep, secondStep, inputReadOnly, locale } = useContext(
    DPContext
  )
  const [iFormat] = useFormat({
    type,
    showTime,
    format,
    locale
  })

  const cacheValues = useRef(null)
  const [value, setValue] = useState('')
  useEffect(() => {
    let vals = date && moment(date).format(iFormat)
    if (type.includes('week') && date) {
      const y = moment(date).weekYear()
      const _date = moment(date).year(y)
      vals = moment(_date).format(iFormat)
    }
    setValue(vals)
    cacheValues.current = vals
  }, [date])
  const inputChangeEvent = (e) => {
    const val = e.target.value
    setValue(val)
    if (val && val.trim().length === iFormat.length) {
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
      readOnly={hourStep || minuteStep || secondStep || inputReadOnly ? 'readOnly' : false}
      className={disabled ? 'disabled' : ''}
      disabled={disabled}
      onChange={inputChangeEvent}
      onFocus={onFocus}
      value={value || ''}
    />
  )
}

export default Input
