import React from 'react'
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

            return weekNum ? weekNum + 'W' : value
          }}
          onChange={(date, dateStr) => {
            console.log('onChange', date, dateStr)
          }}
        />
        <h2>周范围</h2>
        <DatePicker
          style={{ width: 560 }}
          type="weekrange"
          defaultValue={new Date()}
          format={`YYYY年第w周`}
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
          }}
        />
      </div>
    </>
  )
}
