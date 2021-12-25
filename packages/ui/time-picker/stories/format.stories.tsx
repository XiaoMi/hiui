import React, { useCallback, useState } from 'react'
import TimePicker, { TimePickerFormat } from '../src'

export const Format = () => {
  const [values, setValues] = useState([['11:11:11'], ['11:11'], ['11:11'], ['11'], ['11'], ['11']])

  const setMatchIndexValue = useCallback((newValue: string[], index: number) => {
    setValues((pre) => {
      const result = [...pre]
      result[index] = newValue
      return result
    })
  }, [])

  return (
    <>
      <h1>Basic use</h1>
      <div className="time-picker-format__wrap">
        {['HH:mm:ss', 'HH:mm', 'mm:ss', 'HH', 'mm', 'ss'].map((item, index) => (
          <React.Fragment key={index}>
            <h2>{item}</h2>
            <TimePicker
              format={item as TimePickerFormat}
              placeholder={['请选择时间']}
              value={values[index]}
              onChange={(e) => {
                console.log(item, e)
                setMatchIndexValue(e, index)
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </>
  )
}
