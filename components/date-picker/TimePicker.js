import React from 'react'
import PropTypes from 'prop-types'

import DatePickerType from './Type'
import BasePicker from './BasePicker'
import TimePanel from './TimePanel'
import Provider from '../context'
import TimeRangePanel from './TimeRangePanel'
class TimePicker extends BasePicker {
  initPanel (state, props) {
    return (
      props.type === 'time'
        ? <TimePanel
          {...props}
          onPick={this.onPick.bind(this)}
          style={state.style}
          date={state.date}
          timeConfirm={this.timeConfirm.bind(this)}
          timeCancel={this.timeCancel.bind(this)}
        />
        : <TimeRangePanel
          {...props}
          onPick={this.onPick.bind(this)}
          style={state.style}
          date={state.date}
          timeConfirm={this.timeConfirm.bind(this)}
          timeCancel={this.timeCancel.bind(this)}
        />
    )
  }
}
TimePicker.propTypes = {
  type: PropTypes.oneOf(Object.values(DatePickerType)),
  date: PropTypes.instanceOf(Date),
  size: PropTypes.string,
  onChange: PropTypes.func,
  format: PropTypes.string
}
TimePicker.defaultProps = {
  type: 'time',
  format: 'HH:mm:ss',
  disabled: false
}
export default Provider(TimePicker)
