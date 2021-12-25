import { useMemo } from 'react'
import { TimePickerFormat } from '@hi-ui/time-picker'
import moment from 'moment'

/**
 * 将 date-picker 数据格式 转换为 time-picker 所需数据格式
 * @param original date-picker 原始数据
 * @param format time-picker 数据格式
 */
export const useTimePickerData = (original: (moment.Moment | null)[], format: TimePickerFormat) => {
  return useMemo(() => {
    let result = original.map((item) => (item ? item.format(format) : ''))
    if (result.length !== 2) {
      // 此处为其补全空字符串
      result = result.concat(result.length === 1 ? [''] : ['', ''])
    }
    return result
  }, [original, format])
}
