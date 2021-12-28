import React, { useState } from 'react'
import DatePicker from '../src'

export const Basic = () => {
  const [controlledValue, setControlledValue] = useState(new Date())
  return (
    <>
      <h1>日期</h1>
      <div className="date-picker-basic__wrap">
        <h2>基础</h2>
        <DatePicker
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <DatePicker
          altCalendarPreset="zh-CN"
          dateMarkPreset="zh-CN"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>带默认值</h2>
        <DatePicker
          defaultValue={new Date()}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>受控</h2>
        <DatePicker
          value={controlledValue}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
            setControlledValue(date as Date)
          }}
        />
        <h2>禁用</h2>
        <DatePicker
          disabled
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>限制范围</h2>
        <DatePicker
          min={new Date()}
          max={new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>无边框</h2>
        <DatePicker
          bordered={false}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
