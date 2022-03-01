import React from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { PopperOverlayProps } from '@hi-ui/popper'
import moment from 'moment'
import { TimePickerPanelType } from '@hi-ui/time-picker'

export type CalendarView = 'date' | 'year' | 'month'

export interface DateRange {
  start: Date | string | number | undefined | null
  end: Date | string | number | undefined | null
}

export interface CalendarItem {
  date: Date | string | number
  content: string
  /**
   * @default false
   */
  highlighted?: boolean
}

export interface CalendarItemV3 {
  date: Date | string | number
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

export type DatePickerValueV3 = Date | string | number | DateRange | undefined | null

export type DatePickerValue = Date | string | number

export type DatePickerOnSelectV3 = (data: moment.Moment, isCompleted: boolean) => void

export type DatePickerOnSelect = (data: Date, isCompleted: boolean) => void

export type DatePickerOnChange = (
  date: Date | Date[] | undefined,
  dateStr: string | string[] | undefined
) => void
export type DatePickerOnChangeV3 = (date: Date | DateRange, dateStr: string | DateRange) => void

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

export type DisabledDate = (currentDate: Date, view: CalendarView) => boolean

type ExtendsType = Omit<HiBaseHTMLProps<'div'>, 'placeholder'>

export interface DatePickerProps extends ExtendsType {
  type?: DatePickerType

  defaultValue?: DatePickerValue | DatePickerValue[]
  value?: DatePickerValue | DatePickerValue[]
  // width?: number | string
  minDate?: Date
  maxDate?: Date
  /**
   * @default false
   */
  disabled?: boolean
  /**
   * @default false
   */
  inputReadOnly?: boolean
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

  disabledHours?: ((panel: TimePickerPanelType) => number[]) | number[]

  disabledMinutes?: ((selectedHour: number, panel: TimePickerPanelType) => number[]) | number[]

  disabledSeconds?:
    | ((selectedHour: number, selectedMinute: number, panel: TimePickerPanelType) => number[])
    | number[]

  onSelect?: DatePickerOnSelect

  onChange?: DatePickerOnChange
  /**
   * 外观
   * @default 'line'
   */
  appearance?: 'line' | 'unset' | 'filled'
  /**
   * 尺寸
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 自定义控制弹出层 popper
   */
  overlay?: PopperOverlayProps
  /**
   * 是否非法
   * @default false
   */
  invalid?: boolean
}
