import React from 'react'

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
