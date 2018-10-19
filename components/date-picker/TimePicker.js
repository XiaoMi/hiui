import React from 'react'
import PropTypes from 'prop-types'

import DatePickerType from './Type'
import BasePicker from './BasePicker'
import TimePanel from './TimePanel'

class TimePicker extends BasePicker {
  static propTypes = {
    type: PropTypes.oneOf(Object.values(DatePickerType)),
    date: PropTypes.instanceOf(Date),
    size: PropTypes.string,
    onChange: PropTypes.func,
    format: PropTypes.string
  }
  static defaultProps = {
    type: 'time',
    format: 'HH:mm:ss',
    disabled: false
  }
  initPanel (state, props) {
    return (
      <TimePanel
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
export default TimePicker
