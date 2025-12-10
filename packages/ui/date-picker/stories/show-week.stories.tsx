import React from 'react'
import DatePicker from '../src'

/**
 * @title 展示周
 * @desc 仅在日期选择器中生效
 */
export const ShowWeek = () => {
  return (
    <>
      <h1>展示周</h1>
      <div className="date-picker-basic__wrap">
        <h2>展示周</h2>
        <DatePicker
          style={{ width: 240 }}
          showWeek
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
        />
        <h2>展示周-自定义内容</h2>
        <DatePicker
          style={{ width: 240 }}
          showWeek
          cellRender={(info) => {
            const { value, weekNum } = info
            return weekNum ? 'W' + weekNum : value
          }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
        />
      </div>
    </>
  )
}
