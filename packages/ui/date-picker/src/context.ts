import React from 'react'
import { DatePickerProps, DatePickerValueV3 } from './types'
import moment from 'moment'

const DPContext = React.createContext<DPContextData>({} as DPContextData)

export type LocaleData = {
  datePicker: any
}
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
  localeData: LocaleData
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
}
export default DPContext
