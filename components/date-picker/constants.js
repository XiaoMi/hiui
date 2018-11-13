import {getYearWeek} from './util'
import dateFormat from 'date-fns/format'
export const MONTH_DATA = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
export const WEEK_DATA = [ '日', '一', '二', '三', '四', '五', '六' ]
export const TIME_BLOCK = {
  lineHeight: 22,
  padding: 8
}
export const DAY_MILLISECONDS = 86400000
export const RANGE_SPLIT = '~'
export const FORMATS = {
  date: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY',
  time: 'HH:mm:ss',
  daterange: 'YYYY-MM-DD',
  week: 'YYYY',
  weekrange: 'YYYY'
}
export const PLACEHOLDER = {
  date: '请选择日期',
  month: '请选择月',
  year: '请选择年',
  time: '请选择时间',
  daterange: '请选择日期',
  week: '请选择周',
  weekrange: '请选择周'
}
export const isVaildDate = (date) => {
  return date && (date instanceof Date || date.startDate || typeof date === 'number')
}
export const formatterDate = (type, date, formatter, showTime) => {
  if (!isVaildDate(date)) {
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
      str = `${date.getFullYear()}年 第${getYearWeek(date)}周`
      break
    case 'year':
    case 'month':
    case 'time':
      str = dateFormat(date, formatter)
      break
    case 'week':
      str = `${date.getFullYear()}年 第${getYearWeek(date)}周`
      break
    default:
      str = dateFormat(date, `${formatter}${showTime ? ' HH:mm:ss' : ''}`)
      break
  }

  return str
}
