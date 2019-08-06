import getDaysInMonth from 'date-fns/get_days_in_month'
import subMonths from 'date-fns/sub_months'
import getDay from 'date-fns/get_day'
import startOfMonth from 'date-fns/start_of_month'
import isWithinRange from 'date-fns/is_within_range'
import isSameDay from 'date-fns/is_same_day'
import compareAsc from 'date-fns/compare_asc'
import startOfDay from 'date-fns/start_of_day'
import endOfDay from 'date-fns/end_of_day'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import dateFormat from 'date-fns/format'
import addMonths from 'date-fns/add_months'
import isSameMonth from 'date-fns/is_same_month'
import getYear from 'date-fns/get_year'
import getMonth from 'date-fns/get_month'
import isToday from 'date-fns/is_today'
import getHours from 'date-fns/get_hours'
import getMinutes from 'date-fns/get_minutes'
import getSeconds from 'date-fns/get_seconds'
import addHours from 'date-fns/add_hours'
import subDays from 'date-fns/sub_days'
import differenceInDays from 'date-fns/difference_in_days'
import dfIsValid from 'date-fns/is_valid'
import addYears from 'date-fns/add_years'
import subYears from 'date-fns/sub_years'

const isValid = (date) => {
  return (date && dfIsValid(parse(date)))
}
const getValidDate = (date) => {
  return isValid(date) ? parse(date) : new Date()
}
const getStartDate = (dateObj) => {
  return getValidDate(dateObj.startDate)
}
const getEndDate = (dateObj) => {
  return getValidDate(dateObj.endDate)
}

export {
  getDaysInMonth, // 获取当月的天数
  subMonths, // 月份减法
  addMonths, // 月份加法
  addYears, // 年份加
  subYears, // 年份减
  getDay, // 获取周几
  startOfMonth, // 指定日期月份的1日
  isWithinRange, // 是否在指定日期范围内
  isSameDay, // 是否是同一天（忽略时分秒）
  compareAsc, // 比较两个日期
  startOfDay, // 一天的开始
  endOfDay, // 一天的结束
  parse, // 解析成日期
  startOfWeek, // 一周的开始
  endOfWeek, // 一周的结束
  dateFormat, // 格式化时间
  isSameMonth, // 是否是同一个月
  getYear, // 获取年
  getMonth, // 获取月
  isToday, // 是否是今天
  getHours, // 获取小时
  getMinutes, // 获取分钟
  getSeconds, // 获取秒
  addHours, // 小时加
  subDays, // 天减
  differenceInDays, // 相差多少天
  isValid, // 是否有效时间
  getStartDate, // 封装 - 获取开始时间
  getEndDate, // 封装 - 获取结果时间
  getValidDate // 获取有效的时间
}
