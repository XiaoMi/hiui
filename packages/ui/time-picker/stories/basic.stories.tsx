import React, { useState } from 'react'
import TimePicker from '../src'

export const Basic = () => {
  const [basicValue, setBasicValue] = useState(['12:00:00'])
  const [rangeValue, setRangeValue] = useState(['11:11:11', '12:00:00'])
  const [inputReadonlyValue, setInputReadonlyValue] = useState(['11:11:11'])

  return (
    <>
      <h1>Basic use</h1>
      <div className="time-picker-basic__wrap">
        <h2>default</h2>
        <TimePicker
          placeholder={['请选择时间']}
          value={basicValue}
          onChange={(e) => {
            console.log('basic-default', e)
            setBasicValue(e)
          }}
        />
        <h2>range</h2>
        <TimePicker
          value={rangeValue}
          placeholder={['请选择开始时间', '请选择结束时间']}
          onChange={(e) => {
            console.log('range-value', e)
            setRangeValue(e)
          }}
          type="range"
        />
        <h2>input readonly</h2>
        <TimePicker
          placeholder={['请选择时间']}
          value={inputReadonlyValue}
          onChange={(e) => {
            console.log('input-readonly', e)
            setInputReadonlyValue(e)
          }}
          inputReadonly
        />
        <h2>disabled</h2>
        <TimePicker disabled placeholder={['请选择时间']} />
      </div>
    </>
  )
}
