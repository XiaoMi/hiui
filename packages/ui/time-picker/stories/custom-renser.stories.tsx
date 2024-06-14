import React, { useState } from 'react'
import TimePicker from '../src'
import Input from '@hi-ui/input'

/**
 * @title 新增自定义触发器
 */
export const CustomRender = () => {
  const [basicValue, setBasicValue] = useState<string | string[]>(['12:00:00'])
  const [rangeValue, setRangeValue] = useState<string | string[]>(['11:11:11', '12:00:00'])

  return (
    <>
      <h1>CustomRender-Basic</h1>
      <div className="time-picker-basic__wrap">
        <TimePicker
          placeholder={['请选择时间']}
          value={basicValue}
          onChange={(e) => {
            console.log('basic-default', e)
            setBasicValue(e)
          }}
          customRender={(data) => {
            return <Input value={data[0]} readOnly placeholder="请选择" />
          }}
        />
      </div>
      <h1>CustomRender-Range</h1>
      <div className="time-picker-range__wrap">
        <TimePicker
          value={rangeValue}
          placeholder={['请选择开始时间', '请选择结束时间']}
          onChange={(value) => {
            console.log('range-value', value)
            setRangeValue(value)
          }}
          type="range"
          customRender={(data) => {
            return <Input value={data.join('-')} readOnly placeholder="请选择" />
          }}
        />
      </div>
    </>
  )
}
