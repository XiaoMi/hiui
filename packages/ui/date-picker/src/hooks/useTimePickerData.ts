import { useMemo } from 'react'
import { TimePickerFormat, TimePickerValue } from '@hi-ui/time-picker'
import moment from 'moment'

function formatTimePickerValueToString(v: TimePickerValue, format: TimePickerFormat): string {
  const m = moment(v)
  if (m.isValid()) return m.format(format)
  if (typeof v === 'string') {
    const parsed = moment(v, [format, 'HH:mm', 'HH:mm:ss', 'H:mm'], true)
    if (parsed.isValid()) return parsed.format(format)
  }
  if (typeof v === 'number') {
    const parsed = moment(v)
    if (parsed.isValid()) return parsed.format(format)
  }
  return ''
}

/**
 * 将 date-picker 数据格式 转换为 time-picker 所需数据格式
 * @param original date-picker 原始数据
 * @param format time-picker 数据格式
 * @param selectedDates 与 original 下标对应的已选日期；某下标无有效日期时，该列时间使用 defaultOpenValue
 * @param defaultOpenValue showTime 为对象时传入，用于未选日期时仅展示默认时间
 */
export const useTimePickerData = (
  original: (moment.Moment | null)[],
  format: TimePickerFormat,
  selectedDates?: (moment.Moment | null)[],
  defaultOpenValue?: TimePickerValue[]
) => {
  return useMemo(() => {
    let result = original.map((item) => (item ? item.format(format) : ''))

    if (defaultOpenValue?.length && selectedDates?.length) {
      result = result.map((str, i) => {
        const selected = selectedDates[i]
        const hasNoSelectedDate = !selected || !selected.isValid()
        if (!hasNoSelectedDate) return str
        const v = defaultOpenValue[i] ?? defaultOpenValue[0]
        if (v == null || v === '') return str
        const next = formatTimePickerValueToString(v, format)
        return next || str
      })
    }

    if (result.length !== 2) {
      // 此处为其补全空字符串
      result = result.concat(result.length === 1 ? [''] : ['', ''])
    }
    return result
  }, [original, format, selectedDates, defaultOpenValue])
}
