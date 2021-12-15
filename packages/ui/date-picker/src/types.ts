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

/**
 * 组件内部使用，格式化之后的历法item
 */
export interface FormatCalendarItem {
  date: string
  text?: string | null | number
  /**
   * @default false
   */
  highlight?: boolean
  /**
   * 节点标记
   */
  nodeMark?: React.ReactNode

  FullText?: string
}

/**
 * 组件内部使用，历法信息
 * key -> YYYY/MM/DD
 */
export interface CalendarAltCalendarPreset {
  [key: string]: FormatCalendarItem
}

/**
 * 组件内部使用，日历标签信息（休/班）
 * key -> YYYY/MM/DD
 */
export interface CalendarMarkPreset {
  [key: string]: React.ReactNode
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

export type DatePickerAltCalendarPreset = 'zh-CN' | 'id-ID'

export type DateMarkRender = (currentDate: number, today: number) => React.ReactNode

export type DisabledDate = (currentDate: Date) => boolean

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
  disabledDate?: DisabledDate
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

  altCalendarPreset?: DatePickerAltCalendarPreset

  dateMarkRender?: DateMarkRender

  dateMarkPreset?: string

  overlayClassName?: string

  disabledHours?: (() => number[]) | number[]

  disabledMinutes?: ((selectedHour: number) => number[]) | number[]

  disabledSeconds?: ((selectedHour: number, selectedMinute: number) => number[]) | number[]

  onSelect?: (data: moment.Moment, isCompleted: boolean) => void

  onChange?: (date: Date | DateRange, dateStr: string | DateRange) => void
}
