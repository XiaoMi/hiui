import React, { useState } from 'react'
import DatePicker from '../src'

export const Range = () => {
  const [dynamicSelectedValue, setDynamicSelectedValue] = useState<any>('')
  return (
    <>
      <h1>范围</h1>
      <div className="range__wrap">
        <h2>日期</h2>
        <DatePicker
          type="daterange"
          format="YYYY-MM-DD"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <DatePicker
          type="daterange"
          altCalendarPreset="zh-CN"
          dateMarkPreset="zh-CN"
          format="YYYY-MM-DD"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>年份</h2>
        <DatePicker
          type="yearrange"
          defaultValue={{ start: new Date(), end: new Date() }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <DatePicker
          type="yearrange"
          altCalendarPreset="zh-CN"
          dateMarkPreset="zh-CN"
          defaultValue={{ start: new Date(), end: new Date() }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>月份</h2>
        <DatePicker
          type="monthrange"
          defaultValue={{ start: new Date(), end: new Date() }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <DatePicker
          type="monthrange"
          altCalendarPreset="zh-CN"
          dateMarkPreset="zh-CN"
          defaultValue={{ start: new Date(), end: new Date() }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>周</h2>
        <DatePicker
          type="weekrange"
          defaultValue={{ start: new Date(), end: new Date() }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <DatePicker
          type="weekrange"
          altCalendarPreset="zh-CN"
          dateMarkPreset="zh-CN"
          defaultValue={{ start: new Date(), end: new Date() }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>日期时间范围</h2>
        <DatePicker
          type="daterange"
          showTime
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>时间段快速选择</h2>
        <DatePicker
          type="timeperiod"
          timeInterval={30}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>动态限制日期范围</h2>
        <DatePicker
          type="daterange"
          disabledDate={(val) => {
            if (dynamicSelectedValue) {
              const timestampCurrent = new Date(val).getTime()
              const timestampSelect = new Date(dynamicSelectedValue).getTime()
              const range = 7 * 24 * 60 * 60 * 1000
              return !(
                timestampSelect - range < timestampCurrent &&
                timestampCurrent < timestampSelect + range
              )
            }
            return false
          }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={(val, isCompleted) => {
            console.log(val, isCompleted)
            setDynamicSelectedValue(isCompleted ? '' : val)
          }}
        />
      </div>
    </>
  )
}
