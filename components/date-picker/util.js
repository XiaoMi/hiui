import { addMonths, getDay, subDays, differenceInDays, startOfWeek, endOfWeek } from './dateUtil'

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

export const calcDayCount = (year, month) => {
  return new Date(year, parseInt(month, 10), 0).getDate()
}

export const nextMonth = function (date) {
  !(date instanceof Date) && (date = new Date(date))

  return addMonths(date, 1)
}
