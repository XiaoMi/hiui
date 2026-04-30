import moment from 'moment'

// 手动计算周的边界，支持任意 weekOffset 值
// weekOffset: 0=周日, 1=周一, 2=周二, ..., 6=周六
const getWeekStartDate = (date: moment.Moment, weekOffset: number): moment.Moment => {
  const clone = date.clone()
  const dayOfWeek = clone.day() // 0=周日, 1=周一, ..., 6=周六

  // 计算距离周的第一天（weekOffset）有多少天
  // 使用模运算确保结果在 0-6 之间
  const daysToSubtract = (dayOfWeek - weekOffset + 7) % 7

  return clone.subtract(daysToSubtract, 'days').startOf('day')
}

const getWeekEndDate = (date: moment.Moment, weekOffset: number): moment.Moment => {
  const weekStart = getWeekStartDate(date, weekOffset)
  return weekStart.clone().add(6, 'days').endOf('day')
}

export const getBelongWeekBoundary = (date: moment.Moment, weekOffset: number, isStart = true) => {
  return isStart ? getWeekStartDate(date, weekOffset) : getWeekEndDate(date, weekOffset)
}

export const getBelongWeekRange = (date: moment.Moment, weekOffset: number) => {
  return [getBelongWeekBoundary(date, weekOffset), getBelongWeekBoundary(date, weekOffset, false)]
}

// 计算日期所属的周年份（周若包含某年的 1 月 1 日，则归属该年，用于正确显示跨年的「该年第一周」）
export const getBelongWeekYear = (date: moment.Moment, weekOffset: number) => {
  const weekStart = getWeekStartDate(date, weekOffset)
  const weekEnd = weekStart.clone().add(6, 'days')
  const jan1NextYear = moment(`${weekStart.year() + 1}-01-01`)
  // 若该周包含下一年的 1 月 1 日，则视为下一年的第一周（如 2025-12-28～2026-01-03 为 2026 年第 1 周）
  // 使用 'day' 粒度比较，避免时间部分影响跨天判断
  if (jan1NextYear.isSameOrAfter(weekStart, 'day') && jan1NextYear.isSameOrBefore(weekEnd, 'day')) {
    return weekStart.year() + 1
  }
  return weekStart.year()
}

// 计算日期所属的周数（基于 getBelongWeekYear 的周年，保证跨年第一周显示为第 1 周）
export const getBelongWeek = (date: moment.Moment, weekOffset: number) => {
  const weekStart = getWeekStartDate(date, weekOffset)
  const year = getBelongWeekYear(date, weekOffset)
  const yearStart = moment(`${year}-01-01`)
  const firstWeekStart = getWeekStartDate(yearStart, weekOffset)
  const diffDays = weekStart.diff(firstWeekStart, 'days')
  const weekNumber = Math.floor(diffDays / 7) + 1
  return weekNumber < 1 ? 1 : weekNumber > 53 ? 53 : weekNumber
}

/**
 * 按 format 模板格式化周日期为字符串（使用 getBelongWeekYear/getBelongWeek，保证 YYYY-WW 等格式正确）
 * 用于 onChange dateStr 与输入框回显，避免 moment 原生 format 在跨年第一周时得到错误年/周
 */
export const formatWeekByTemplate = (
  date: moment.Moment,
  weekOffset: number,
  formatStr: string
): string => {
  const y = getBelongWeekYear(date, weekOffset)
  const w = getBelongWeek(date, weekOffset)
  return formatStr
    .replace('YYYY', String(y))
    .replace('WW', String(w).padStart(2, '0'))
    .replace(/\bW\b/g, String(w))
}

// 保留旧的 weekOffsetPolyfill 函数以保持兼容性（虽然可能不再使用）
const weekOffsetPolyfill = (date: moment.Moment, weekOffset: number) => {
  const clone = date.clone()
  // 根据 weekOffset 设置 moment 实例 locale，便于后面计算 week
  clone.locale(weekOffset === 1 ? 'zh-CN' : 'en-US')
  return clone
}
