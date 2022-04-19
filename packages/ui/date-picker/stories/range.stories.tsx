import React, { useState } from 'react'
import DatePicker from '../src'
import DayJs from 'dayjs'

export const Range = () => {
  const [dynamicSelectedValue, setDynamicSelectedValue] = useState<any>('')
  return (
    <>
      <h1>范围</h1>
      <div className="range__wrap">
        <h2>日期</h2>
        <DatePicker
          type="daterange"
          format={'YYYY-MM-DD'}
          style={{ width: 480 }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
          defaultValue={[new Date(), new Date()]}
          disabledDate={(val) => {
            const tomorrow = DayJs(new Date()).isBefore(DayJs(val))
            if (tomorrow) return true

            if (dynamicSelectedValue) {
              const start_time = DayJs(dynamicSelectedValue).startOf('month').valueOf()
              const end_time = DayJs(dynamicSelectedValue).endOf('month').valueOf()

              if (DayJs(val).isBefore(start_time)) return true
              if (DayJs(val).isAfter(end_time)) return true
            }
            return false
          }}
        />
        <DatePicker
          type="daterange"
          style={{ width: 480 }}
          onSelect={console.log}
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
          onSelect={console.log}
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
          onSelect={console.log}
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
          onSelect={console.log}
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
          size={'md'}
          appearance={'unset'}
        />
        <h2>时间段快速选择</h2>
        <DatePicker
          type="timeperiod"
          onSelect={console.log}
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
