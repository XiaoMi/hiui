export const DAY_MILLISECONDS = 86400000
export const RANGE_SPLIT = '~'
export const FORMATS = (locale) => {
  return locale === 'zh-CN'
    ? {
        date: 'YYYY-MM-DD',
        month: 'YYYY-MM',
        year: 'YYYY',
        time: 'HH:mm:ss',
        timerange: 'HH:mm:ss',
        daterange: 'YYYY-MM-DD',
        week: 'YYYY-WW',
        weekrange: 'YYYY-WW',
        timeperiod: 'YYYY-MM-DD HH:mm:ss',
        monthrange: 'YYYY-MM',
        yearrange: 'YYYY'
      }
    : {
        date: 'MM/DD/YYYY',
        month: 'MM/YYYY',
        year: 'YYYY',
        time: 'HH:mm:ss',
        timerange: 'HH:mm:ss',
        daterange: 'MM/DD/YYYY',
        week: 'wo/YYYY',
        weekrange: 'wo/YYYY',
        timeperiod: 'MM/DD/YYYY HH:mm:ss',
        monthrange: 'MM/YYYY',
        yearrange: 'YYYY'
      }
}

export const INPUTTYPES = {
  date: 'normal',
  month: 'normal',
  year: 'normal',
  time: 'normal',
  timerange: 'range',
  daterange: 'range',
  week: 'normal',
  weekrange: 'range',
  timeperiod: 'range',
  monthrange: 'range',
  yearrange: 'range'
}
