import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { parseValue } from '../utils'
import { DatePickerTypeEnum, DatePickerValueV3 } from '../types'

interface IUseDateConfig {
  value: DatePickerValueV3
  defaultValue: DatePickerValueV3
  format?: string
  locale?: string
  cacheDate: React.MutableRefObject<(moment.Moment | null)[]>
  type: DatePickerTypeEnum
  weekOffset: number
}
export const useDate = (config: IUseDateConfig) => {
  const { value, defaultValue, cacheDate, type, format, locale, weekOffset } = config
  const [outDate, setOutDate] = useState<(moment.Moment | null)[]>(() => {
    const d = parseValue(value || defaultValue, type, weekOffset, format as any) as any
    cacheDate.current = d
    return d
  })

  const changeOutDate = (dates: any) => {
    const _datas = [
      dates[0] && moment(dates[0]).isValid() ? dates[0] : null,
      dates[1] && moment(dates[1]).isValid() ? dates[1] : null,
    ]
    setOutDate(_datas as any)
  }
  useEffect(() => {
    if (value === undefined) return
    const d = parseValue(value, type, weekOffset, format as any) as any
    setOutDate(d)
    cacheDate.current = d
  }, [value, type, weekOffset, format, locale, setOutDate, cacheDate])

  return [outDate, changeOutDate] as const
}
