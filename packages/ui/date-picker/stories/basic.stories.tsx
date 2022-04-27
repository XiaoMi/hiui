import React, { useState } from 'react'
import DatePicker from '../src'

/**
 * @title 基础用法
 * @desc 以天为粒度，展示“YYYY-MM-DD”
 */
export const Basic = () => {
  const [controlledValue, setControlledValue] = useState(new Date())
  return (
    <>
      <h1>日期</h1>
      <div className="date-picker-basic__wrap">
        <h2>基础</h2>
        <DatePicker
          style={{ width: 240 }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <DatePicker
          style={{ width: 338 }}
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
          minDate={new Date()}
          maxDate={new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
