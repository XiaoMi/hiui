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
export {
  getDaysInMonth, // 获取当月的天数
  subMonths, // 月份减法
  addMonths, // 月份加法
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
  isSameMonth
}
