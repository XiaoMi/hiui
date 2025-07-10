import React, { useState } from 'react'
import TimePicker from '../src'

/**
 * @title 自定义禁选值
 * @desc 自定义禁选的时、分、秒数据
 */
export const CustomDisabled = () => {
  const [hourValue, setHourValue] = useState(['11:11:11', '13:13:13'])
  const [minuteValue, setMinuteValue] = useState(['11:11:11', '13:13:13'])
  const [secondValue, setSecondValue] = useState(['11:11:11', '13:13:13'])

  return (
    <>
      <h1>Custom Disabled</h1>
      <div className="time-picker-custom-disabled__wrap" style={{ height: 400 }}>
        <h2>hour</h2>
        <TimePicker
          style={{ width: '240px' }}
          value={hourValue}
          placeholder={['请选择开始时间', '请选择结束时间']}
          onChange={(value: any) => {
            console.log('custom-hour-value', value)
            setHourValue(value)
          }}
          disabledHours={() => [5]}
          type="range"
        />
        <h2>minute</h2>
        <TimePicker
          style={{ width: '240px' }}
          value={minuteValue}
          placeholder={['请选择开始时间', '请选择结束时间']}
          onChange={(value: any) => {
            console.log('custom-minute-value', value)
            setMinuteValue(value)
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
          style={{ width: '240px' }}
          value={secondValue}
          placeholder={['请选择开始时间', '请选择结束时间']}
          onChange={(value: any) => {
            console.log('custom-second-value', value)
            setSecondValue(value)
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
