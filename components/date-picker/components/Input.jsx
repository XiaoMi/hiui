import React, { useRef, useState, useEffect, useContext } from 'react'
import moment from 'moment'
import DPContext from '../context'
import { useFormat } from '../hooks'
const Input = ({ date, onChange, onFocus, dir, placeholder }) => {
  const { type, format, disabled, showTime } = useContext(DPContext)
  const [iFormat] = useFormat({
    type,
    showTime,
    format
  })

  const cacheValues = useRef(null)
  const [value, setValue] = useState('')
  useEffect(() => {
    const vals = date && moment(date).format(iFormat)
    setValue(vals)
    cacheValues.current = vals
  }, [date])
  const inputChangeEvent = e => {
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
      type='text'
      placeholder={placeholder}
      className={disabled ? 'disabled' : ''}
      disabled={disabled}
      onChange={inputChangeEvent}
      onFocus={onFocus}
      value={value || ''}
    />
  )
}

export default Input
