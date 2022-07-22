import { TimePickerFormat } from '../@types'

export const getFormatDefault = (format: TimePickerFormat) => {
  return format.replace(/[Hms]/g, '0')
}
