import React from 'react'
import { DatePickerProps } from './types'
import moment from 'moment'

const DPContext = React.createContext<DPContextData>({} as DPContextData)

type ExtendsType = Omit<DatePickerProps, 'max' | 'min'>

interface DPContextData extends ExtendsType {
  prefixCls: string
  localeData: {
    datePicker: any
  }
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
