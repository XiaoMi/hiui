import getDaysInMonth from 'date-fns/getDaysInMonth'
import subMonths from 'date-fns/subMonths'
import getDay from 'date-fns/getDay'
import startOfMonth from 'date-fns/startOfMonth'
import isWithinInterval from 'date-fns/isWithinInterval'
import isSameDay from 'date-fns/isSameDay'
import compareAsc from 'date-fns/compareAsc'
import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'
import parse from 'date-fns/parse'
import toDate from 'date-fns/toDate'
import startOfWeek from 'date-fns/startOfWeek'
import endOfWeek from 'date-fns/endOfWeek'
import dateFormat from 'date-fns/format'
import addMonths from 'date-fns/addMonths'
import isSameMonth from 'date-fns/isSameMonth'
import getYear from 'date-fns/getYear'
import getMonth from 'date-fns/getMonth'
import isToday from 'date-fns/isToday'
import getHours from 'date-fns/getHours'
import getMinutes from 'date-fns/getMinutes'
import getSeconds from 'date-fns/getSeconds'
import addHours from 'date-fns/addHours'
import subDays from 'date-fns/subDays'
import differenceInDays from 'date-fns/differenceInDays'
import dfIsValid from 'date-fns/isValid'
import addYears from 'date-fns/addYears'
import subYears from 'date-fns/subYears'
import parseISO from 'date-fns/parseISO'

const isValid = (date) => {
  return (date && dfIsValid(toDate(date)))
}
const getValidDate = (date) => {
  return isValid(date) ? toDate(date) : new Date()
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
  isWithinInterval, // 是否在指定日期范围内
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
  getValidDate, // 获取有效的时间
  toDate,
  parseISO
}
