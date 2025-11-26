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

// 计算日期所属的周数
export const getBelongWeek = (date: moment.Moment, weekOffset: number) => {
  const weekStart = getWeekStartDate(date, weekOffset)
  const year = weekStart.year()
  const yearStart = moment(`${year}-01-01`)

  // 找到该年第一个周的第一天（1月1日所在周的起始日期）
  const firstWeekStart = getWeekStartDate(yearStart, weekOffset)

  // 如果第一个周的第一天在上一年，说明第一周跨年了
  // 这种情况下，使用1月1日所在周的起始日期作为基准
  const baseWeekStart =
    firstWeekStart.year() < year ? getWeekStartDate(yearStart, weekOffset) : firstWeekStart

  // 计算周数差
  const diffDays = weekStart.diff(baseWeekStart, 'days')
  const weekNumber = Math.floor(diffDays / 7) + 1

  // 确保周数在合理范围内（1-53）
  if (weekNumber < 1) {
    // 如果周数小于1，说明可能跨年了，需要计算上一年的周数
    const prevYearStart = moment(`${year - 1}-01-01`)
    const prevYearFirstWeekStart = getWeekStartDate(prevYearStart, weekOffset)
    const prevYearDiffDays = weekStart.diff(prevYearFirstWeekStart, 'days')
    return Math.floor(prevYearDiffDays / 7) + 1
  }

  return weekNumber > 53 ? 53 : weekNumber
}

// 计算日期所属的周年份
export const getBelongWeekYear = (date: moment.Moment, weekOffset: number) => {
  const weekStart = getWeekStartDate(date, weekOffset)
  // 使用周的第一天的年份作为周年份
  return weekStart.year()
}

// 保留旧的 weekOffsetPolyfill 函数以保持兼容性（虽然可能不再使用）
const weekOffsetPolyfill = (date: moment.Moment, weekOffset: number) => {
  const clone = date.clone()
  // 根据 weekOffset 设置 moment 实例 locale，便于后面计算 week
  clone.locale(weekOffset === 1 ? 'zh-CN' : 'en-US')
  return clone
}
