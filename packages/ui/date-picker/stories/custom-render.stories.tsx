import React from 'react'
import DatePicker from '../src'
import Input from '@hi-ui/input'

/**
 * @title 自定义触发器
 */
export const CustomRender = () => {
  return (
    <>
      <h1>自定义触发器</h1>
      <div className="date-picker-custom-render__wrap">
        <h2>日期</h2>
        <DatePicker
          style={{ width: 240 }}
          defaultValue={new Date()}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
          customRender={(data) => {
            const date = new Date(data[0] ?? new Date())
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            const formattedDate = `${year}-${month}-${day}`
            return <Input value={formattedDate} readOnly placeholder="请选择" />
          }}
        />
        <h2>日期范围</h2>
        <DatePicker
          style={{ width: 240 }}
          type="daterange"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          defaultValue={[new Date(), new Date()]}
          customRender={(data) => {
            const date1 = new Date(data[0] ?? new Date())
            const date2 = new Date(data[1] ?? new Date())
            const year1 = date1.getFullYear()
            const year2 = date2.getFullYear()
            const month1 = (date1.getMonth() + 1).toString().padStart(2, '0')
            const month2 = (date2.getMonth() + 1).toString().padStart(2, '0')
            const day1 = date1.getDate().toString().padStart(2, '0')
            const day2 = date2.getDate().toString().padStart(2, '0')
            const formattedDateTime1 = `${year1}-${month1}-${day1}`
            const formattedDateTime2 = `${year2}-${month2}-${day2}`

            return (
              <Input
                value={`${formattedDateTime1} - ${formattedDateTime2}`}
                readOnly
                placeholder="请选择"
              />
            )
          }}
        />
      </div>
    </>
  )
}
