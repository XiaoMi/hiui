import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { parseValue } from '../utils'
import { DatePickerType, DatePickerValue } from '../types'

interface IUseDateConfig {
  value: DatePickerValue
  defaultValue: DatePickerValue
  format?: string
  locale?: string
  cacheDate: React.MutableRefObject<null>
  type: DatePickerType
}
export const useDate = (config: IUseDateConfig) => {
  const { value, defaultValue, cacheDate, type, format, locale } = config
  const [outDate, setOutDate] = useState<any[]>([])
  const changeOutDate = (dates: any) => {
    const _datas = [
      dates[0] && moment(dates[0]).isValid() ? dates[0] : null,
      dates[1] && moment(dates[1]).isValid() ? dates[1] : null,
    ]
    setOutDate(_datas as any)
  }
  useEffect(() => {
    const d = parseValue(value || defaultValue, type, format as any, locale) as any
    setOutDate(d)
    cacheDate.current = d
  }, [value, type])

  return [outDate, changeOutDate] as const
}
