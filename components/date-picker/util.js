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
export const clearHours = (d) => {
  return new Date(d).setHours(0, 0, 0, 0)
}
export const dateFormat = (date, format) => {
  if (date instanceof String) {
    format = date
    date = new Date()
  }
  if (!date) {
    return
  }
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(format)) {
    format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return format
}

export const calcDayCount = (year, month) => {
  return new Date(year, parseInt(month, 10), 0).getDate()
}

export const calcDayWeek = (year, month, day) => {
  return new Date(year, parseInt(month, 10) - 1, day).getDay()
}
export const nextMonth = function (date) {
  !(date instanceof Date) && (date = new Date(date))
  let {year, month} = deconstructDate(date)
  if (month === 11) {
    year += 1
    month = 0
  }
  return new Date(year, month, 1)
}
export const getWeekRange = date => {
  !(date instanceof Date) && (date = new Date(date))
  var nowDayOfWeek = date.getDay()
  // var nowDay = date.getDate()
  // var nowMonth = date.getMonth()
  // var nowYear = date.getYear()
  let {year, month, day} = deconstructDate(date)
  year += (year < 2000) ? 1900 : 0
  var lastMonthDate = new Date()
  lastMonthDate.setDate(1)
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
  return {
    start: new Date(year, month - 1, day - nowDayOfWeek),
    end: new Date(year, month - 1, day + (6 - nowDayOfWeek))
  }
}
