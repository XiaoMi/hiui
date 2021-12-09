import moment from 'moment'
import { DatePickerProps } from './DatePicker'
import { FC } from 'react'

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
  result.localeData = (String) => {
    return moment.localeData(String)
  }
  return result
}
