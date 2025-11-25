import React, { useState } from 'react'
import DatePicker from '../src'
import DayJs from 'dayjs'

/**
 * @title 范围
 * @desc 以天、周、月、季度、年等粒度展示一个时间的范围
 */
export const Range = () => {
  const [dynamicSelectedValue, setDynamicSelectedValue] = useState<any>('')
  const [start, setStart] = useState<Date[]>([])

  return (
    <>
      <h1>范围</h1>
      <div className="range__wrap">
        <h2>日期</h2>
        <DatePicker
          type="daterange"
          style={{ width: 480 }}
          defaultValue={[DayJs().subtract(7, 'day').toDate(), new Date()]}
          format="YYYY-MM-DD"
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
          disabledDate={(val) => {
            const tomorrow = DayJs(new Date()).isBefore(DayJs(val))
            if (tomorrow) return true

            if (dynamicSelectedValue) {
              const startTime = DayJs(dynamicSelectedValue).startOf('month').valueOf()
              const endTime = DayJs(dynamicSelectedValue).endOf('month').valueOf()

              if (DayJs(val).isBefore(startTime)) return true
              if (DayJs(val).isAfter(endTime)) return true
            }
            return false
          }}
        />

        <h2>年份</h2>
        <DatePicker
          style={{ width: 480 }}
          type="yearrange"
          defaultValue={[DayJs().subtract(2, 'year').toDate(), new Date()]}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
        />

        <h2>季度</h2>
        <DatePicker
          style={{ width: 480 }}
          type="quarterrange"
          defaultValue={[new Date(`${new Date().getFullYear()}-09-01`), new Date()]}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
        />

        <h2>月份</h2>
        <DatePicker
          style={{ width: 480 }}
          type="monthrange"
          defaultValue={[DayJs().subtract(2, 'month').toDate(), new Date()]}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
        />

        <h2>周</h2>
        {/* 如果遇到周范围选择选值问题，尝试手动引入 import 'moment/locale/zh-cn' */}
        <DatePicker
          style={{ width: 480 }}
          type="weekrange"
          defaultValue={[DayJs().subtract(2, 'week').toDate(), new Date()]}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
        />

        <h2>日期时间范围</h2>
        <DatePicker
          style={{ width: 480 }}
          type="daterange"
          showTime
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
          onSelect={console.log}
        />

        <h2>时间段快速选择</h2>
        <DatePicker
          style={{ width: 372 }}
          type="timeperiod"
          onSelect={console.log}
          timeInterval={30}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />

        <h2>动态限制日期范围</h2>
        <DatePicker
          style={{ width: 480 }}
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

        <h2>动态限制日期时间范围</h2>
        <DatePicker
          type="daterange"
          style={{ width: 480 }}
          format="YYYY-MM-DD"
          showTime
          onChange={(date, dateStr) => {
            if (!date) {
              setStart([])
            }
          }}
          onSelect={(val, isCompleted, index = 0) => {
            console.log('select', val, isCompleted, index)
            start[index] = val
            setStart([...start])
          }}
          disabledDate={(val, view, index) => {
            // 如果还没有选择开始日期，不禁用任何日期
            if (!start[0]) {
              return false
            }

            const currentTime = new Date(val).getTime()
            const startTime = new Date(start[0]).getTime()
            const sixtyDays = 60 * 24 * 60 * 60 * 1000 // 60天的毫秒数

            // 如果是选择第二个日期
            if (index === 1) {
              // 禁用超过开始日期一周范围的日期
              return currentTime < startTime || currentTime > startTime + sixtyDays
            }

            // 如果是选择第一个日期且已经选择了结束日期
            if (index === 0 && start[1]) {
              const endTime = new Date(start[1]).getTime()
              // 禁用导致日期范围超过一周的日期
              return currentTime > endTime || endTime - currentTime > sixtyDays
            }

            return false
          }}
        />
      </div>
    </>
  )
}
