import React from 'react'
import DatePicker from '../src'

/**
 * @title 年份 / 季度 / 月份 / 周
 * @desc 以年份 / 季度 / 月份 / 周为展示粒度
 */
export const YearMonthWeek = () => {
  return (
    <>
      <h1>年份 / 季度 / 月份 / 周</h1>
      <div className="date-picker-ymw__wrap">
        <h2>年份</h2>
        <DatePicker
          style={{ width: 238 }}
          type="year"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />

        <h2>季度</h2>
        <DatePicker
          style={{ width: 238 }}
          type="quarter"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />

        <h2>月份</h2>
        <DatePicker
          style={{ width: 238 }}
          type="month"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />

        <h2>周</h2>
        {/* 如果遇到周选择选值问题，尝试手动引入 import 'moment/locale/zh-cn' */}
        <DatePicker
          style={{ width: 238 }}
          type="week"
          defaultValue={new Date()}
          weekOffset={0}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
      </div>
    </>
  )
}
