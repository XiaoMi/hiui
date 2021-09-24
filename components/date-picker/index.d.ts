
export export type DateRange = {
  start: Date | string | number | undefined | null
  end: Date | string | number | undefined | null
}
export type DateRangeString = {
  start: string
  end: string
}
export type CalendarItem = {
  date?: Date | string
  text?: string
  highlight?: boolean
}
export export interface CommonProps {
  value?: Date | string | number | DateRange | undefined | null
  defaultValue?: Date | string | number | DateRange | undefined | null
  disabled?: boolean
  clearable?: boolean
  placeholder?: string | string[]
  format?: string
  inputReadOnly?: boolean
  timeInterval?: number
  onChange?: (date: Date | DateRange, dateStr: string | DateRangeString) => void
  onSelect?: (date: Date, isCompleted: boolean) => void
}
export type Shortcuts = {
  title: string
  range: Date[] | number[]
}

export interface DateProps extends CommonProps {
  type?: 'date' | 'daterange' | 'year' | 'month' | 'week' | 'weekrange' | 'timeperiod' | 'yearrange' | 'monthrange'
  min?: Date
  minDate?: Date
  max?: Date
  maxDate?: Date
  bordered?: boolean
  timeperiod?: number
  disabledDate?: (currentDate: Date) => boolean
  showTime?: boolean
  shortcuts?: string[] | Shortcuts[]
  weekOffset?: 0 | 1
  altCalendar?: CalendarItem
  altCalendarPreset?: 'zh-CN' | 'id-ID'
  dateMarkRender?: (currentDate: Date, today: Date) => JSX.Element
  dateMarkPreset?: 'zh-CN'
  overlayClassName?: string
  style?: CSSProperties
  className?: string
}

declare const DatePicker: React.ComponentType<DateProps>
export default DatePicker
