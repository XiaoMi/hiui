import moment from 'moment'
import { DatePickerTypeEnum } from '../types'

export const DAY_MILLISECONDS = 86400000
export const RANGE_SPLIT = '~'

export const GranularityMap: {
  [key in DatePickerTypeEnum]: moment.unitOfTime.StartOf
} = {
  year: 'year',
  yearrange: 'year',
  daterange: 'date',
  date: 'date',
  week: 'date',
  weekrange: 'date',
  month: 'month',
  monthrange: 'month',
  quarter: 'quarter',
  quarterrange: 'quarter',
  timeperiod: 'second',
}
/**
 * 获取对应地域，type 对应的 format map
 * @param locale
 */
export const getLocaleTypeFormatMap = (locale: string) => {
  return locale === 'zh-CN'
    ? {
        date: 'YYYY-MM-DD',
        month: 'YYYY-MM',
        quarter: 'YYYY-qQ',
        year: 'YYYY',
        time: 'HH:mm:ss',
        timerange: 'HH:mm:ss',
        daterange: 'YYYY-MM-DD',
        week: 'YYYY-WW',
        weekrange: 'YYYY-WW',
        timeperiod: 'YYYY-MM-DD HH:mm:ss',
        monthrange: 'YYYY-MM',
        quarterrange: 'YYYY-qQ',
        yearrange: 'YYYY',
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
        quarterrange: 'qQ/YYYY',
        yearrange: 'YYYY',
      }
}

export const INPUTTYPES = {
  date: 'normal',
  month: 'normal',
  quarter: 'normal',
  year: 'normal',
  time: 'normal',
  timerange: 'range',
  daterange: 'range',
  week: 'normal',
  weekrange: 'range',
  timeperiod: 'range',
  monthrange: 'range',
  quarterrange: 'range',
  yearrange: 'range',
}
