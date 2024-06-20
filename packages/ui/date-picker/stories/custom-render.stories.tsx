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
            return <Input value={data} readOnly placeholder="请选择" />
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
            return <Input value={`${data[0]}  ~  ${data[1]}`} readOnly placeholder="请选择" />
          }}
        />
      </div>
    </>
  )
}
