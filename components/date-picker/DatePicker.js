import React from 'react'

import BasePicker from './BasePicker'
import DatePanel from './DatePanel'
import DateRangePanel from './DateRangePanel'
import WeekRangePanel from './WeekRangePanel'
import Provider from '../context'
import dateFormat from 'date-fns/format'
class DatePicker extends BasePicker {
  initPanel (state, props) {
    let component = null
    let d = state.date
    if (!d.startDate) {
      d = {startDate: d, endDate: null}
    }
    switch (props.type) {
      case 'month':
      case 'year':
      case 'week':
      case 'date':
        component = (
          <DatePanel
            {...props}
            date={state.date}
            onPick={this.onPick.bind(this)}
            style={state.style}
            timeConfirm={this.timeConfirm.bind(this)}
            timeCancel={this.timeCancel.bind(this)}
          />
        )
        break
      case 'daterange':
        component = (
          <DateRangePanel
            {...props}
            date={d}
            timeConfirm={this.timeConfirm.bind(this)}
            onPick={this.onPick.bind(this)}
            style={state.style}
          />
        )
        break
      case 'weekrange':
        component = (
          <WeekRangePanel
            {...props}
            date={d}
            range={state.range}
            onPick={this.onPick.bind(this)}
            style={state.style}
          />
        )
        break
      default:
        throw new Error('类型未定义')
    }
    return component
  }
}
const pd = Provider(DatePicker)
pd.format = dateFormat
export default pd
