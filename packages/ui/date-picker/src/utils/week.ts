import moment from 'moment'

export const getBelongWeek = (date: moment.Moment, weekOffset: number) => {
  const polyfill = weekOffsetPolyfill(date, weekOffset)
  return polyfill.week()
}

export const getBelongWeekRange = (date: moment.Moment, weekOffset: number) => {
  return [getBelongWeekBoundary(date, weekOffset), getBelongWeekBoundary(date, weekOffset, false)]
}

export const getBelongWeekYear = (date: moment.Moment, weekOffset: number) => {
  const polyfill = weekOffsetPolyfill(date, weekOffset)
  return polyfill.weekYear()
}

export const getBelongWeekBoundary = (date: moment.Moment, weekOffset: number, isStart = true) => {
  const polyfill = weekOffsetPolyfill(date, weekOffset)
  return isStart ? moment(polyfill).startOf('week') : moment(polyfill).endOf('week')
}

const weekOffsetPolyfill = (date: moment.Moment, weekOffset: number) => {
  const clone = date.clone()
  // 根据 weekOffset 设置 moment 实例 locale，便于后面计算 week
  clone.locale(weekOffset === 1 ? 'zh-CN' : 'en-US')
  return clone
}
