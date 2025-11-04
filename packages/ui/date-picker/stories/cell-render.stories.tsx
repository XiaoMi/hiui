import React from 'react'
import moment from 'moment'
import DatePicker from '../src'

/**
 * @title 自定义单元格内容
 */
export const CellRender = () => {
  return (
    <>
      <h1>CellRender</h1>
      <div className="date-picker-ymw__wrap">
        <h2>年份</h2>
        <DatePicker
          style={{ width: 238 }}
          type="year"
          cellRender={(info) => {
            const { type, text } = info

            return type === 'today' ? <strong>{text}</strong> : text
          }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>月份</h2>
        <DatePicker
          style={{ width: 238 }}
          type="month"
          cellRender={(info) => {
            const { type, text } = info
            return type === 'today' ? <strong>{text}</strong> : text
          }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />

        <h2>周</h2>
        <DatePicker
          style={{ width: 238 }}
          type="week"
          defaultValue={new Date()}
          cellRender={(info) => {
            const { value, weekNum } = info

            return weekNum ? 'W' + weekNum : value
          }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>周范围</h2>
        <DatePicker
          style={{ width: 560 }}
          type="weekrange"
          defaultValue={[new Date(), new Date()]}
          strideSelectMode="fixed"
          format={(value) => {
            // console.log('format', value)

            const lastDay = value.clone().endOf('month').date()
            const startOfWeek = value.clone().startOf('week')
            const endOfWeek = value.clone().endOf('week')
            const week = value.clone().week()
            const weekYear = value.clone().weekYear()

            // 如果当前日期是当月第一天或者或者小于周一，并且周一不是当月第一天，则该周视为 B 周
            if (
              (value.date() === 1 || startOfWeek.date() > value.date()) &&
              startOfWeek.date() !== 1
            ) {
              return `${weekYear}-${week}B`
            }

            // 如果当前日期是当月最后一天或者大于周日，并且周日不是最后一天，则该周视为 A 周
            if (
              (value.date() === lastDay || value.date() > endOfWeek.date()) &&
              endOfWeek.date() !== lastDay
            ) {
              return `${weekYear}-${week}A`
            }

            return `${weekYear}-${week}`
          }}
          // 自定义渲染出 AB 周，逻辑：
          // 在当前月周选择面板下，如果当月第一天位于第一行并且不是周一，则该周视为B周
          // 如果当前月最后一天位于最后一行并且不是周日，则该周视为A周
          cellRender={(cellInfo) => {
            // console.log('cellInfo', cellInfo)

            const { value, weekNum } = cellInfo

            if (weekNum) {
              // weekStartDate 周一日期
              // renderDate 当前月日期
              const { weekStartDate, renderDate } = cellInfo
              // 当前周最后一天
              const weekEndDate = weekStartDate?.clone().add(6, 'day')

              if (
                weekEndDate &&
                renderDate &&
                (weekEndDate?.month() > renderDate?.month() ||
                  weekEndDate?.year() > renderDate?.year()) &&
                weekStartDate?.month() === renderDate?.month()
              ) {
                return weekNum + 'A'
              }

              if (
                weekStartDate &&
                renderDate &&
                (weekStartDate?.month() < renderDate?.month() ||
                  weekStartDate?.year() < renderDate?.year()) &&
                weekEndDate?.month() === renderDate?.month()
              ) {
                return weekNum + 'B'
              }

              return weekNum
            } else {
              return value
            }
          }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)

            const _date = date as Date[]
            const start = moment(_date?.[0])
            const end = moment(_date?.[1])
            const lastDay = end.clone().endOf('month').date()

            // 如果开始日期是当月第一天并且不是周一，则该周视为 B 周
            if (start.date() === 1 && start.clone().startOf('week').date() !== 1) {
              console.log('start week', dateStr?.[0] + 'B')
            }

            // 如果当前日期是当月最后一天并且不是周末，则该周视为 A 周
            if (end.date() === lastDay && end.clone().endOf('week').date() !== lastDay) {
              console.log('end week', dateStr?.[1] + 'A')
            }
          }}
        />
      </div>
    </>
  )
}
