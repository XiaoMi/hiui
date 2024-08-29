import React from 'react'
import DatePicker from '../src'
import Input from '@hi-ui/input'

/**
 * @title 自定义触发器
 */
export const CustomRender = () => {
  return (
    <>
      <h1>日期</h1>
      <div className="date-picker-custom-render__wrap">
        <h2>基础</h2>
        <DatePicker
          style={{ width: 240 }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
          customRender={(data) => {
            return <Input value={data[0]} readOnly placeholder="请选择" />
          }}
        />
        <h2>日期时间范围</h2>
        <DatePicker
          style={{ width: 420 }}
          type="daterange"
          showTime
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          defaultValue={[new Date(), new Date()]}
          customRender={(data) => {
            const date1 = new Date(data[0])
            const date2 = new Date(data[1])
            const year1 = date1.getFullYear()
            const year2 = date2.getFullYear()
            const month1 = (date1.getMonth() + 1).toString().padStart(2, '0')
            const month2 = (date2.getMonth() + 1).toString().padStart(2, '0')
            const day1 = date1.getDate().toString().padStart(2, '0')
            const day2 = date2.getDate().toString().padStart(2, '0')
            const hours1 = date1.getHours().toString().padStart(2, '0')
            const hours2 = date2.getHours().toString().padStart(2, '0')
            const minutes1 = date1.getMinutes().toString().padStart(2, '0')
            const minutes2 = date2.getMinutes().toString().padStart(2, '0')
            const seconds1 = date1.getSeconds().toString().padStart(2, '0')
            const seconds2 = date2.getSeconds().toString().padStart(2, '0')
            const formattedDateTime1 = `${year1}-${month1}-${day1} ${hours1}:${minutes1}:${seconds1}`
            const formattedDateTime2 = `${year2}-${month2}-${day2} ${hours2}:${minutes2}:${seconds2}`
            return (
              <Input
                value={`${formattedDateTime1}  ~  ${formattedDateTime2}`}
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
