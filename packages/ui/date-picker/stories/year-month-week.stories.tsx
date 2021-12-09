import React, { useState } from 'react'
import DatePicker from '../src'

export const YearMonthWeek = () => {
  const [controlledValue, setControlledValue] = useState(new Date())
  return (
    <>
      <h1>年份 / 月份 / 周</h1>
      <div className="date-picker-ymw__wrap">
        <h2>年份</h2>
        <DatePicker
          type="year"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>月份</h2>
        <DatePicker
          type="month"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>周(周一起始)</h2>
        <DatePicker
          type="week"
          weekOffset={1}
          defaultValue={new Date()}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>周(周日起始)</h2>
        <DatePicker
          type="week"
          defaultValue={new Date()}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
