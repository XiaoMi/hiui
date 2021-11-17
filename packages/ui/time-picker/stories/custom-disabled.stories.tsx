import React, { useState } from 'react'
import TimePicker from '../src'

export const CustomDisabled = () => {
  const [hourValue, setHourValue] = useState(['11:11:11', '13:13:13'])
  const [minuteValue, setMinuteValue] = useState(['11:11:11', '13:13:13'])
  const [secondValue, setSecondValue] = useState(['11:11:11', '13:13:13'])

  return (
    <>
      <h1>Custom disabled</h1>
      <div className="time-picker-custom-disabled__wrap" style={{ height: 400 }}>
        <h2>hour</h2>
        <TimePicker
          value={hourValue}
          placeholder={['请选择开始时间', '请选择结束时间']}
          onChange={(e) => {
            console.log('custom-hour-value', e)
            setHourValue(e)
          }}
          disabledHours={() => [5]}
          type="range"
        />
        <h2>minute</h2>
        <TimePicker
          value={minuteValue}
          placeholder={['请选择开始时间', '请选择结束时间']}
          onChange={(e) => {
            console.log('custom-minute-value', e)
            setMinuteValue(e)
          }}
          disabledMinutes={(hour) => {
            if (hour === 5) {
              return [2]
            }
            return []
          }}
          type="range"
        />
        <h2>second</h2>
        <TimePicker
          value={secondValue}
          placeholder={['请选择开始时间', '请选择结束时间']}
          onChange={(e) => {
            console.log('custom-second-value', e)
            setSecondValue(e)
          }}
          disabledSeconds={(hour, minute) => {
            if (hour === 5 && minute === 2) {
              return [0]
            }
            return []
          }}
          type="range"
        />
      </div>
    </>
  )
}
