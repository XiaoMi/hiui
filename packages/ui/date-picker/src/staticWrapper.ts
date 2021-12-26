import moment from 'moment'
import { FC } from 'react'
import { DatePickerProps } from './types'

export interface DatePickerStatic {
  format: (date: any, format: string) => string
  localeData: (data: any) => moment.Locale
}
export const withStaticWrapper = (
  component: FC<DatePickerProps>
): FC<DatePickerProps> & DatePickerStatic => {
  const result = component as FC<DatePickerProps> & DatePickerStatic
  result.format = (date, format) => {
    return moment(date).format(format)
  }
  result.localeData = (data: string | string[] | undefined) => {
    return moment.localeData(data)
  }
  return result
}
