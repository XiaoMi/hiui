import {addMonths} from './dateUtil'

export const deconstructDate = (date) => {
  !(date instanceof Date) && (date = new Date(date))
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    week: getYearWeek(date),
    day: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    time: date.getTime()
  }
}
export const getYearWeek = (date) => {
  const year = date.getFullYear()
  let date1 = new Date(year, parseInt(date.getMonth()), date.getDate())
  let date2 = new Date(year, 0, 1)
  let d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
  return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7)
}

export const calcDayCount = (year, month) => {
  return new Date(year, parseInt(month, 10), 0).getDate()
}

export const nextMonth = function (date) {
  !(date instanceof Date) && (date = new Date(date))

  return addMonths(date, 1)
}
