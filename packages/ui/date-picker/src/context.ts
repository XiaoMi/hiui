import React from 'react'
import { DatePickerProps } from './types'
import moment from 'moment'

const DPContext = React.createContext<DPContextData>({} as DPContextData)

export type LocaleData = {
  datePicker: any
}
type ExtendsType = Omit<DatePickerProps, 'max' | 'min' | 'type' | 'showTime' | 'disabledDate'> &
  Required<Pick<DatePickerProps, 'type' | 'showTime' | 'disabledDate'>>

interface DPContextData extends ExtendsType {
  prefixCls: string
  localeData: LocaleData
  outDate: (moment.Moment | null)[]
  onPick: (dates: (moment.Moment | null)[], isShowPanel: boolean) => void
  realFormat: string
  altCalendarPresetData: any
  dateMarkPresetData: any
  showPanel: boolean
  min: Date | null
  max: Date | null
}
export default DPContext
