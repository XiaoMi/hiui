import { useState, useEffect } from 'react'
import moment, { Moment } from 'moment'
import { DAY_MILLISECONDS } from '../utils/constants'
import { DatePickerTypeEnum, DisabledDate } from '../types'
import { getBelongWeek, getBelongWeekBoundary } from '../utils/week'
import { UseLocaleContext } from '@hi-ui/core'

const getYearOrMonthRows = ({
  originDate,
  renderDate,
  type,
  view,
  range,
  i18n,
  min,
  max,
  disabledDate,
}: {
  originDate: moment.Moment | null
  renderDate: moment.Moment | null
  type: DatePickerTypeEnum
  view: string
  range?: CalenderSelectedRange
  i18n: UseLocaleContext
  min: Date | null
  max: Date | null
  disabledDate: DisabledDate
}) => {
  const _date = renderDate ? moment(renderDate) : moment()
  const start = view === 'year' ? _date.year() - 4 : 0
  const trs: CalendarRowInfo[] = [[], [], [], []] as any
  let num = 0
  const current = moment()

  // 格式化范围数据，保证开始永远在结束之前
  const formatRange = range ? { ...range } : ({} as CalenderSelectedRange)
  if (formatRange.start && formatRange.end && formatRange.start.isAfter(formatRange.end)) {
    const temp = formatRange.start
    formatRange.start = formatRange.end
    formatRange.end = temp
  }

  const monthText = i18n.get('datePicker.month')

  for (let i = 0; i < 4; i++) {
    const row = trs[i]
    for (let j = 0; j < 3; j++) {
      const col = row[j] || (row[j] = { type: 'normal' } as CalendarColInfo)
      const y = start + num
      view === 'year' ? (col.text = y) : (col.text = monthText[y])
      col.value = y
      num++
      const currentYM = (_date as any)[view](y)
      if (currentYM.isSame(current, view)) {
        col.type = 'today'
      }
      if (type.includes('range') && type.includes(view)) {
        if (
          range?.start &&
          range?.end &&
          (currentYM.isBetween(formatRange.start, formatRange.end) ||
            currentYM.isBetween(formatRange.end, formatRange.start))
        ) {
          col.range = true
        }
        if (formatRange?.start && currentYM.isSame(formatRange.start, view)) {
          col.type = 'selected'
          col.range = false
          col.rangeStart = true
          // 当前，存在开始，结束不存在，范围选择现在只选择了一个值，视作，开始结束为同一个
          if (!formatRange.end) {
            col.rangeEnd = true
          }
        }
        if (formatRange?.end && currentYM.isSame(formatRange.end, view)) {
          col.type = 'selected'
          col.range = false
          col.rangeEnd = true
          // 当前，存在结束，开始不存在，范围选择现在只选择了一个值，视作，开始结束为同一个
          if (!formatRange.start) {
            col.rangeEnd = true
          }
        }

        // 判断年月可选状态
        const _y = currentYM.year()
        const _m = currentYM.month()
        if (disabledDate && view.includes('year')) {
          // col.type = disabledDate(_y) ? 'disabled' : col.type
          col.type = disabledDate(
            moment().set('year', _y).set('month', 1).set('date', 1).toDate(),
            'year'
          )
            ? 'disabled'
            : col.type
        }
        if (disabledDate && view.includes('month')) {
          // col.type = disabledDate(_y + '-' + _m) ? 'disabled' : col.type
          // 此处 _m - 1 是由于 Date 中的 month 是 0 - 11
          col.type = disabledDate(
            moment().set('year', _y).set('month', _m).set('date', 1).toDate(),
            'month'
          )
            ? 'disabled'
            : col.type
        }

        // 年的状态
        if (view.includes('year') && (min || max)) {
          if (min) {
            const minYear = moment(min).year()
            col.type = _y < minYear ? 'disabled' : col.type
          }
          if (max) {
            const maxYear = moment(max).year()
            col.type = _y > maxYear ? 'disabled' : col.type
          }
        }

        if (view.includes('month') && (min || max)) {
          if (min) {
            const minMoment = moment(min)
            const minYear = minMoment.year()
            const minMonth = minMoment.month()
            col.type = _y < minYear ? 'disabled' : col.type
            col.type = _y === minYear && _m < minMonth ? 'disabled' : col.type
          }
          if (max) {
            const maxMoment = moment(max)
            const maxYear = maxMoment.year()
            const maxMonth = maxMoment.month()
            col.type = _y > maxYear ? 'disabled' : col.type
            col.type = _y === maxYear && _m > maxMonth ? 'disabled' : col.type
          }
        }
        continue
      }
      if (originDate && (y === originDate.year() || y === originDate.month())) {
        col.type = 'selected'
      }

      // 判断年月可选状态
      const _y = currentYM.year()
      const _m = currentYM.month()
      if (disabledDate && view.includes('year')) {
        col.type = disabledDate(
          moment().set('year', _y).set('month', 1).set('date', 1).toDate(),
          'year'
        )
          ? 'disabled'
          : col.type
      }
      if (disabledDate && view.includes('month')) {
        col.type = disabledDate(
          moment().set('year', _y).set('month', _m).set('date', 1).toDate(),
          'month'
        )
          ? 'disabled'
          : col.type
      }
      // 年的状态
      if (view.includes('year') && (min || max)) {
        if (min) {
          const minYear = moment(min).year()
          col.type = _y < minYear ? 'disabled' : col.type
        }
        if (max) {
          const maxYear = moment(max).year()
          col.type = _y > maxYear ? 'disabled' : col.type
        }
      }

      if (view.includes('month') && (min || max)) {
        if (min) {
          const minMoment = moment(min)
          const minYear = minMoment.year()
          const minMonth = minMoment.month()
          col.type = _y < minYear ? 'disabled' : col.type
          col.type = _y === minYear && _m < minMonth ? 'disabled' : col.type
        }
        if (max) {
          const maxMoment = moment(max)
          const maxYear = maxMoment.year()
          const maxMonth = maxMoment.month()
          col.type = _y > maxYear ? 'disabled' : col.type
          col.type = _y === maxYear && _m > maxMonth ? 'disabled' : col.type
        }
      }
    }
  }
  return trs
}
const getTime = (week: number, y: number, m: number) => {
  const r = new Date(y, m - 1, 1)
  const t = r.getTime() - week * DAY_MILLISECONDS
  return t
}
const getDateRows = ({
  originDate,
  range,
  type,
  weekOffset,
  min,
  max,
  renderDate,
  disabledDate,
}: {
  originDate: moment.Moment | null
  range?: CalenderSelectedRange
  type: DatePickerTypeEnum
  weekOffset: number
  min: Date | null
  max: Date | null
  renderDate: moment.Moment | null
  disabledDate: DisabledDate
}) => {
  const rows: CalendarRowInfo[] = [[], [], [], [], [], []] as any
  const today = moment()
  const _date = moment(renderDate)
  // 格式化范围数据，保证开始永远在结束之前
  const formatRange = range ? { ...range } : ({} as CalenderSelectedRange)
  if (formatRange.start && formatRange.end && formatRange.start.isAfter(formatRange.end)) {
    const temp = formatRange.start
    formatRange.start = formatRange.end
    formatRange.end = temp
  }

  // *  dayCount: 当月天数
  // *  lastMonthDayCount: 上月总天数
  // *  firstDayWeek: 当月第一天是周几（不是现实的周几，而是在表中的偏移位置，展示位置）
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
          rangeEnd: false,
        } as CalendarColInfo)
      const currentTime = moment(startTimeByCurrentPanel + DAY_MILLISECONDS * (i * 7 + j))
      let isPN = false // is Prev Or Next Month
      const isDisabled =
        currentTime.isBefore(moment(min)) ||
        currentTime.isAfter(moment(max)) ||
        (disabledDate && disabledDate(currentTime.toDate(), 'date')) // isDisabled cell
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
        continue
      }
      if (!isPN && currentTime.isSame(today, 'day') && col.type !== 'disabled') {
        col.type = 'today'
      }
      if (type.includes('range') && !isPN) {
        if (
          currentTime.isBetween(formatRange?.start, formatRange?.end) ||
          currentTime.isBetween(formatRange?.end, formatRange?.start)
        ) {
          col.range = true
        }

        if (formatRange?.start && currentTime.isSame(formatRange.start, 'day')) {
          col.type = 'selected'
          col.range = false
          col.rangeStart = true
          // 当前，存在开始，结束不存在，范围选择现在只选择了一个值，视作，开始结束为同一个
          if (!formatRange.end) {
            col.rangeEnd = true
          }
        }
        if (formatRange?.end && currentTime.isSame(formatRange.end, 'day')) {
          col.type = 'selected'
          col.range = false
          col.rangeEnd = true
          // 当前，存在结束，开始不存在，范围选择现在只选择了一个值，视作，开始结束为同一个
          if (!formatRange.start) {
            col.rangeStart = true
          }
        }
        continue
      }
      if (originDate && currentTime.isSame(originDate, 'day') && !isPN) {
        col.type = 'selected'
      }

      if (type === 'week') {
        col.weekType = col.type
        if (originDate) {
          const wFirst = getBelongWeekBoundary(originDate, weekOffset)
          const wLast = getBelongWeekBoundary(originDate, weekOffset, false)
          if (currentTime.isSame(wFirst, 'day') || currentTime.isSame(wLast, 'day')) {
            col.type = 'selected'
            continue
          }
          // 处于周开始与结束之间，也看做，被选中了
          if (currentTime.isBetween(wFirst, wLast)) {
            // col.type = 'normal'
            // col.range = true
            col.type = 'selected'
          }
        }
      }
    }
  }

  // 新增功能：周选择显示周数
  // 如果是周类型，则计算出每一行的周数并放入每行数组第一个
  if (type === 'week' || type === 'weekrange') {
    const year = _date.year()
    const month = _date.month() + 1

    for (let i = 0, len = rows.length; i < len; i++) {
      const item = rows[i][0]
      const { type, value } = item
      let _year = year
      let _month = type === 'prev' ? month - 1 : type === 'next' ? month + 1 : month

      if (_month > 12) {
        _year = _year + 1
        _month = 1
      }

      if (_month < 1) {
        _year = _year - 1
        _month = 12
      }

      const weekStartDate = getBelongWeekBoundary(moment(`${_year}-${_month}-${value}`), weekOffset)

      rows[i].unshift({
        ...item,
        weekNum: getBelongWeek(weekStartDate, weekOffset),
        weekStartDate,
        renderDate: _date,
      })
    }
  }

  return rows
}

export interface CalenderSelectedRange {
  start: moment.Moment | null
  end: moment.Moment | null
  selecting?: boolean
}

export type CalendarRowType = 'normal' | 'selected' | 'today' | 'disabled' | 'next' | 'prev'
export interface CalendarColInfo {
  type: CalendarRowType
  range: boolean
  rangeStart: boolean
  rangeEnd: boolean
  value: number
  weekType: CalendarRowType
  text: string | number
  weekNum?: number
  weekStartDate?: Moment
  renderDate?: Moment
}
export type CalendarRowInfo = CalendarColInfo[] & {
  weekNum: number
}

const useDate = ({
  view,
  originDate,
  weekOffset,
  i18n,
  range,
  type,
  min,
  max,
  renderDate,
  disabledDate,
}: {
  originDate: moment.Moment | null
  renderDate: moment.Moment | null
  disabledDate: DisabledDate
  min: Date | null
  max: Date | null
  type: DatePickerTypeEnum
  weekOffset: number
  view: string
  i18n: UseLocaleContext
  range?: CalenderSelectedRange
}) => {
  const [rows, setRows] = useState<CalendarRowInfo[]>([])
  useEffect(() => {
    const _rows =
      view.includes('month') || view.includes('year')
        ? getYearOrMonthRows({
            originDate,
            renderDate,
            type,
            view,
            i18n,
            range,
            min,
            max,
            disabledDate,
          })
        : getDateRows({
            originDate,
            range,
            type,
            weekOffset,
            min,
            max,
            renderDate,
            disabledDate,
          })
    setRows(_rows)
  }, [renderDate, view, range, type, disabledDate, i18n, max, min, weekOffset, originDate])

  return [rows]
}

export default useDate
