import React from 'react'

import BasePicker from './BasePicker'
import DatePanel from './DatePanel'
import DateRangePanel from './DateRangePanel'
import WeekRangePanel from './WeekRangePanel'
import Provider from '../context'

class DatePicker extends BasePicker {
  initPanel (state, props) {
    let component = null
    let d = state.date
    switch (props.type) {
      case 'month':
      case 'year':
      case 'week':
      case 'date':
      case 'timeperiod':
        component = (
          <DatePanel
            {...props}
            date={state.date}
            onPick={this.onPick.bind(this)}
            style={state.style}
          />
        )
        break
      case 'daterange':
        component = (
          <DateRangePanel
            {...props}
            date={d}
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
    }
    return component
  }
}
export default Provider(DatePicker)
export {DatePicker}
