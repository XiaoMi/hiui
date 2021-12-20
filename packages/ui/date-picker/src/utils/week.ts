import moment from 'moment'

export const getBelongWeek = (date: moment.Moment, weekOffset: number) => {
  const clone = date.clone()
  // 根据 weekOffset 设置 moment 实例 locale，便于后面计算 week
  clone.locale(weekOffset === 1 ? 'zh-CN' : 'en-US')
  return clone.week()
}
