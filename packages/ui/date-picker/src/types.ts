import React from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { PopperJS } from '@hi-ui/popper'
import moment from 'moment'

export interface DateRange {
  start: Date | string | number | undefined | null
  end: Date | string | number | undefined | null
}

export interface CalendarItem {
  date: Date | string
  text: string
  /**
   * @default false
   */
  highlight?: boolean
}
export type DatePickerValue = Date | string | number | DateRange | undefined | null
export type DatePickerType =
  | 'date'
  | 'daterange'
  | 'year'
  | 'month'
  | 'week'
  | 'weekrange'
  | 'timeperiod'
  | 'yearrange'
  | 'monthrange'

export type DataPickerAltCalendarPreset = 'zh-CN' | 'id-ID'

type ExtendsType = Omit<HiBaseHTMLProps<'div'>, 'placeholder'>

export interface DatePickerProps extends ExtendsType {
  type?: DatePickerType

  defaultValue?: DatePickerValue
  value?: DatePickerValue
  width?: number | string

  min?: Date
  max?: Date
  minDate?: Date
  maxDate?: Date
  /**
   * @default false
   */
  disabled?: boolean
  /**
   * @default true
   */
  bordered?: boolean
  /**
   * @default false
   */
  inputReadOnly?: boolean

  placement?: PopperJS.Placement
  /**
   * @default () => false
   */
  disabledDate?: (currentDate: Date) => boolean
  /**
   * @default true
   */
  clearable?: boolean
  /**
   * @default false
   */
  showTime?: boolean
  /**
   * @default 240
   */
  timeInterval?: number

  format?: string

  shortcuts?:
    | string[]
    | {
        title: string
        range: (Date | number)[]
      }[]

  theme?: any

  locale?: string
  /**
   * @default 0
   */
  weekOffset?: number

  hourStep?: number
  minuteStep?: number
  secondStep?: number

  placeholder?: string | string[]

  altCalendar?: CalendarItem[]

  altCalendarPreset?: DataPickerAltCalendarPreset

  dateMarkRender?: (currentDate: number, today: number) => React.ReactNode

  dateMarkPreset?: string

  overlayClassName?: string

  disabledHours?: (() => number[]) | number[]

  disabledMinutes?: ((selectedHour: number) => number[]) | number[]

  disabledSeconds?: ((selectedHour: number, selectedMinute: number) => number[]) | number[]

  onSelect?: (data: moment.Moment, isCompleted: boolean) => void

  onChange?: (date: Date | DateRange, dateStr: string | DateRange) => void
}
