import { useState, useEffect } from 'react'
import moment from 'moment'
import { DAY_MILLISECONDS } from '../constants'
import _ from 'lodash'

const getYearOrMonthRows = ({ originDate, renderDate, type, view, range, localeDatas }) => {
  const _date = renderDate ? moment(renderDate) : moment()
  const start = view === 'year' ? _date.year() - 4 : 0
  const trs = [[], [], [], []]
  let num = 0
  const current = moment()
  for (let i = 0; i < 4; i++) {
    const row = trs[i]
    for (let j = 0; j < 3; j++) {
      const col = row[j] || (row[j] = { type: 'normal' })
      const y = start + num
      view === 'year' ? (col.text = y) : (col.text = localeDatas.datePicker.month[y])
      col.value = y
      num++
      const currentYM = _date[view](y)
      if (currentYM.isSame(current, view)) {
        col.type = 'today'
      }
      if (type.includes('range') && type.includes(view)) {
        if (
          range.start &&
          range.end &&
          (currentYM.isBetween(range.start, range.end) || currentYM.isBetween(range.end, range.start))
        ) {
          col.range = true
        }
        if (range.start && currentYM.isSame(range.start, view)) {
          col.type = 'selected'
          col.range = false
        }
        if (range.end && currentYM.isSame(range.end, view)) {
          col.type = 'selected'
          col.range = false
        }
        continue
      }
      if (originDate && (y === originDate.year() || y === originDate.month())) {
        col.type = 'selected'
      }
    }
  }
  return trs
}
const getTime = (week, y, m) => {
  const r = new Date(y, m - 1, 1)
  const t = r.getTime() - week * DAY_MILLISECONDS
  return t
}
const getDateRows = ({ originDate, range, type, weekOffset, min, max, renderDate, view }) => {
  const rows = [[], [], [], [], [], []]
  const today = moment()
  const _date = moment(renderDate)
  // *  dayCount: 当月天数
  // *  lastMonthDayCount: 上月总天数
  // *  firstDayWeek: 当月第一天是周几
  let firstDayWeek = _date.startOf('month').day() - weekOffset
  if (firstDayWeek === 0) {
    // 如果为0 代表该月第一天是周日，在日历上需要第二行开始显示
    firstDayWeek = 7
  } else if (firstDayWeek < 0) {
    firstDayWeek = 6
  }
  const startTimeByCurrentPanel = getTime(firstDayWeek, _date.year(), _date.month() + 1)
  const dayCount = _date.daysInMonth()
  const lastMonthDayCount = moment(_date).subtract(1, 'months').daysInMonth()
  let count = 0
  for (let i = 0; i < 6; i++) {
    const row = rows[i]
    for (let j = 0; j < 7; j++) {
      const col =
        row[j] ||
        (row[j] = {
          type: 'normal',
          range: false,
          rangeStart: false,
          rangeEnd: false
        })
      const currentTime = moment(startTimeByCurrentPanel + DAY_MILLISECONDS * (i * 7 + j))
      let isPN = false // is Prev Or Next Month
      const isDisabled = currentTime.isBefore(moment(min)) || currentTime.isAfter(moment(max)) // isDisabled cell
      if (i === 0) {
        // 处理第一行的日期数据
        if (j >= firstDayWeek) {
          // 本月
          col.value = ++count
        } else {
          // 上月
          col.value = lastMonthDayCount - firstDayWeek + j + 1
          col.type = 'prev'
          isPN = true
        }
      } else {
        ++count
        if (count <= dayCount) {
          // 本月
          col.value = count
        } else {
          // 下月
          col.value = count - dayCount
          col.type = 'next'
          isPN = true
        }
      }

      if (isDisabled) {
        col.type = 'disabled'
      }
      if (!isPN && currentTime.isSame(today, 'day')) {
        col.type = 'today'
      }
      if (type.includes('range') && !isPN) {
        if (currentTime.isBetween(range.start, range.end) || currentTime.isBetween(range.end, range.start)) {
          col.range = true
        }

        if (range.start && currentTime.isSame(range.start, 'day')) {
          col.type = 'selected'
          col.range = false
        }
        if (range.end && currentTime.isSame(range.end, 'day')) {
          col.type = 'selected'
          col.range = false
        }
        continue
      }
      if (originDate && currentTime.isSame(originDate, 'day') && !isPN) {
        col.type = 'selected'
      }

      if (type === 'week') {
        const weekNum = weekOffset ? currentTime.isoWeek() : currentTime.week()
        row.weekNum = weekNum
        if (originDate) {
          const _d = _.cloneDeep(originDate)
          const wFirst = moment(_d).startOf('week').add(weekOffset, 'days')
          const wLast = moment(_d).endOf('week').add(weekOffset, 'days')
          if (currentTime.isSame(wFirst, 'day') || currentTime.isSame(wLast, 'day')) {
            col.type = 'selected'
            continue
          }
          if (currentTime.isBetween(wFirst, wLast)) {
            col.type = 'normal'
            col.range = true
          }
        }
      }
    }
  }
  return rows
}
const useDate = ({ view, date, originDate, weekOffset, localeDatas, range, type, min, max, renderDate }) => {
  const [rows, setRows] = useState([])
  useEffect(() => {
    const _rows =
      view.includes('month') || view.includes('year')
        ? getYearOrMonthRows({
            originDate,
            renderDate,
            type,
            view,
            localeDatas,
            range
          })
        : getDateRows({
            originDate,
            range,
            type,
            weekOffset,
            min,
            max,
            renderDate,
            view
          })
    setRows(_rows)
  }, [renderDate, view, range, type])

  return [rows]
}

export default useDate
