import {getYearWeek} from './util'
import { isValid, dateFormat } from './dateUtil'
export const TIME_BLOCK = {
  lineHeight: 22,
  padding: 8
}
export const DAY_MILLISECONDS = 86400000
export const RANGE_SPLIT = '~'
export const FORMATS = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  year: 'yyyy',
  time: 'HH:mm:ss',
  daterange: 'yyyy-MM-dd',
  week: 'yyyy',
  weekrange: 'yyyy',
  timeperiod: 'yyyy-MM-dd HH:mm:ss'
}

export const isVaildDate = (date) => {
  return date && (date instanceof Date || date.startDate || typeof date === 'number')
}
export const formatterDate = (type, date, formatter, showTime, localeDatas, weekOffset, isFormat) => {
  weekOffset = weekOffset || 0
  if (!isValid(date)) {
    return ''
  }
  date = new Date(date)
  let str = ''
  switch (type) {
    // case 'daterange':
    //   if (date instanceof Date) { date = {startDate: date, endDate: date} }
    //   str = dateFormat(date.startDate, `${formatter}${showTime ? ' hh:mm:ss' : ''}`) + RANGE_SPLIT + dateFormat(date.endDate, `${formatter}${showTime ? ' hh:mm:ss' : ''}`)
    //   break
    case 'weekrange':
      // if (date instanceof Date) { date = {startDate: date, endDate: date} }
      str = localeDatas.datePicker.weekrange(date.getFullYear(), getYearWeek(date, weekOffset).weekNum)
      break
    case 'year':
    case 'month':
    case 'time':
      str = dateFormat(date, formatter)
      break
    case 'week':
      str = localeDatas.datePicker.weekrange(date.getFullYear(), getYearWeek(date, weekOffset).weekNum)
      break
    default:
      str = dateFormat(date, `${formatter}${(!isFormat && showTime) ? ' HH:mm:ss' : ''}`)
      break
  }

  return str
}
