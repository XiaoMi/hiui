export interface CommonProps {
  value?: Date | string | number | DateRange | undefined | null
  disabled?: boolean
  clearable?: boolean
  placeholder?: string | string[]
  format?: string
  onChange?: (date: Date | DateRange, dateStr: string) => void
}
export type DateRange = {
  start: Date | string | number | undefined | null
  end: Date | string | number | undefined | null
}
interface DateProps extends CommonProps {
  type?: 'date' | 'daterange' | 'year' | 'month' | 'week' | 'weekrange' | 'timeperiod'
  min?: Date
  max?: Date
  disabledDate?: (currentDate: Date) => boolean
  showTime?: boolean
  shortcuts?: string[]
  weekOffset?: 0 | 1
}

declare const DatePicker: React.ComponentType<DateProps>
export default DatePicker
