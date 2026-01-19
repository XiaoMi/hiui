import React from 'react'
import { CalendarItemV3, DatePickerProps, DatePickerValueV3 } from './types'
import moment from 'moment'
import type { UseLocaleContext } from '@hi-ui/core'
import { CalenderSelectedRange } from './hooks/useCalenderData'

const DPContext = React.createContext<DPContextData>({} as DPContextData)

type ExtendsType = Omit<
  DatePickerProps,
  | 'max'
  | 'min'
  | 'type'
  | 'showTime'
  | 'disabledDate'
  | 'onSelect'
  | 'hourStep'
  | 'minuteStep'
  | 'secondStep'
  | 'disabledHours'
  | 'disabledMinutes'
  | 'disabledSeconds'
  | 'weekOffset'
  | 'timeInterval'
  | 'value'
  | 'altCalendar'
  | 'defaultPickerValue'
> &
  Required<
    Pick<
      DatePickerProps,
      | 'type'
      | 'showTime'
      | 'disabledDate'
      | 'onSelect'
      | 'hourStep'
      | 'minuteStep'
      | 'secondStep'
      | 'disabledHours'
      | 'disabledMinutes'
      | 'disabledSeconds'
      | 'weekOffset'
      | 'timeInterval'
      | 'appearance'
      | 'size'
    >
  >

export interface DPContextData extends ExtendsType {
  prefixCls: string
  i18n: UseLocaleContext
  outDate: (moment.Moment | null)[]
  onPick: (dates: (moment.Moment | null)[], isShowPanel?: boolean) => void
  realFormat: string
  altCalendarPresetData: any
  dateMarkPresetData: any
  showPanel: boolean
  min: Date | null
  max: Date | null
  isInDateRangeTimeMode: boolean
  // 内部现在暂时使用 v3 的数据格式
  value: DatePickerValueV3
  // 内部现在暂时使用 v3 的数据格式
  altCalendar?: CalendarItemV3[]
  onPanelChange?: (data: Date) => void
  rangeRef: React.MutableRefObject<CalenderSelectedRange | null>
  utcOffset?: number
  defaultPickerValue?: DatePickerValueV3
}
export default DPContext
