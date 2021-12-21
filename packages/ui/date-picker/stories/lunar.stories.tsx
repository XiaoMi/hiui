import React, { useState } from 'react'
import DatePicker from '../src'

export const Lunar = () => {
  const [customValue, setCustomValue] = useState(new Date('2020/4/8'))

  return (
    <>
      <h1>日历面板</h1>
      <div className="lunar__wrap">
        <h2>预置农历</h2>
        <DatePicker
          altCalendarPreset="zh-CN"
          dateMarkPreset="zh-CN"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>自定义日期信息</h2>
        <DatePicker
          value={customValue}
          altCalendar={[
            {
              date: '2020/4/8',
              text: '十周年',
              highlight: true,
            },
          ]}
          dateMarkRender={(currentDate, today) => {
            const date = DatePicker.format(currentDate, 'yyyy/M/D')
            const yesterday = DatePicker.format(today - 86400000, 'yyyy/M/D')
            const currentday = DatePicker.format(customValue, 'yyyy/M/D')

            if (date === '2020/4/8') {
              return (
                <span style={{ color: '#ff6900', transform: 'scale(0.6)', fontWeight: 'bold' }}>
                  米
                </span>
              )
            } else if (date === yesterday) {
              return (
                <span style={{ color: '#63bbd0', transform: 'scale(0.6)', fontWeight: 'bold' }}>
                  昨
                </span>
              )
            } else {
              return ''
            }
          }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
            setCustomValue(date as Date)
          }}
        />
      </div>
    </>
  )
}
