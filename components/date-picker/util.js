import request from 'axios'
import { addMonths, getDay, subDays, differenceInDays, startOfWeek, endOfWeek, getYear, getMonth, toDate, isValid } from './dateUtil'
const holiday = {
  PRCHoliday: 'https://cdn.cnbj1.fds.api.mi-img.com/hiui/PRCHoliday.json?',
  PRCLunar: 'https://cdn.cnbj1.fds.api.mi-img.com/hiui/PRCLunar.json?',
  IndiaHoliday: 'https://cdn.cnbj1.fds.api.mi-img.com/hiui/IndiaHoliday.json?'
}

export const deconstructDate = (date, weekOffset = 0) => {
  !(date instanceof Date) && (date = new Date(date))
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    week: getYearWeek(date, weekOffset).weekNum,
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    time: date.getTime()
  }
}
export const getYearWeek = (date, weekStart = 0) => {
  const year = date.getFullYear()
  let date1 = new Date(year, parseInt(date.getMonth()), date.getDate())
  let date2 = new Date(year, 0, 1)
  let num = getDay(date2)
  date2 = subDays(date2, weekStart ? (num - 1) : num) // 周日开始
  const din = differenceInDays(date1, date2)
  return {
    weekNum: Math.ceil((din + 1) / 7),
    start: startOfWeek(date1, {weekStartsOn: weekStart}),
    end: endOfWeek(date1, {weekStartsOn: weekStart})
  }
}

export const nextMonth = function (date) {
  !(date instanceof Date) && (date = new Date(date))
  return addMonths(date, 1)
}

// 判读日期是不可点击
export const colDisabled = (type, col, _year, props, y) => {
  const {max: maxDate, min: minDate} = props
  const maxYear = maxDate && getYear(maxDate)
  const minYear = minDate && getYear(minDate)
  if (type === 'year') {
    col.text = y
    if (minDate || maxDate) {
      col.disabled = (y > maxYear || y < minYear)
    }
  } else {
    col.text = props.localeDatas.datePicker.month[y - 1]

    if (minDate || maxDate) {
      col.disabled = (_year > maxYear || _year < minYear)

      if (_year === minYear) {
        col.disabled = y - 1 < getMonth(minDate)
      }
      if (_year === maxYear && !col.disabled) {
        col.disabled = y - 1 > getMonth(maxDate)
      }
    }
  }
  return col
}
/**
 * 是否展示历法次要信息
 * @param {Object} props
 */
export const showLargeCalendar = (props) => {
  return (props.type !== 'yearrange' && props.type !== 'monthrange') && (props.altCalendar || props.altCalendarPreset || props.dateMarkRender || props.dateMarkPreset)
}

export const getPRCDate = (api) => {
  const url = holiday[api]
  let options = {
    url,
    method: 'GET'
  }
  return url ? request.create().request(options) : null
}

// 处理输入不在该范围内的处理
export const getInRangeDate = (startDate, endDate, max, min) => {
  let _startDate = isValid(startDate) ? startDate : ''
  let _endDate = isValid(endDate) ? endDate : ''
  if (min) {
    const minTimestamp = Date.parse(toDate(min))
    const startDateTimestamp = Date.parse(startDate)
    const endDateTimestamp = Date.parse(endDate)
    _startDate = startDateTimestamp < minTimestamp ? new Date(minTimestamp) : new Date(startDate)
    _endDate = endDateTimestamp < minTimestamp ? new Date(minTimestamp) : new Date(endDate)
  }
  if (max) {
    const maxTimestamp = Date.parse(toDate(max))
    const startDateTimestamp = Date.parse(_startDate)
    const endDateTimestamp = Date.parse(_endDate)
    _startDate = startDateTimestamp > maxTimestamp ? new Date(maxTimestamp) : new Date(_startDate)
    _endDate = endDateTimestamp > maxTimestamp ? new Date(maxTimestamp) : new Date(_endDate)
  }
  return {startDate: _startDate, endDate: _endDate}
}
