import React from 'react'
import DatePicker from '../src'

/**
 * @title 日期时间
 * @desc 以时间点为粒度，展示“YYYY-MM-DD HH:mm:ss”
 */
export const DateTime = () => {
  return (
    <>
      <h1>日期时间</h1>
      <div className="date-time__wrap">
        <h2>基础用法</h2>
        <DatePicker
          showTime
          defaultValue={new Date()}
          disabledHours={[2, 3, 4, 5, 6]}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>设置选择面板默认展示的时间</h2>
        <DatePicker
          showTime={{ defaultOpenValue: '09:00:00' }}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>设置选择面板默认展示的开始和结束时间</h2>
        <DatePicker
          type="daterange"
          showTime={{ defaultOpenValue: ['00:00:00', '23:59:59'] }}
          disabledHours={[2, 3, 4, 5, 6]}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
