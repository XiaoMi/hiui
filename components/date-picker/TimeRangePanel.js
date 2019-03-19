import React, {Component} from 'react'
import Time from './Time'
import Provider from '../context'

class TimeRangePanel extends Component {
  constructor (props) {
    super(props)
    console.log(props.date)
    this.state = {
      date: props.date,
      style: props.style
    }
  }
  onTimePick (flag, date, bol) {
    const {startDate, endDate} = this.props

    this.props.onPick({startDate: flag === 'left' ? date : startDate, endDate: flag === 'right' ? date : endDate}, bol)
  }
  render () {
    const {startDate, endDate} = this.props.date
    return (
      <div className='hi-timepicker hi-timepicker--timerange' style={this.props.style}>
        <Time date={startDate} onPick={this.onTimePick.bind(this, 'left')} onlyTime />
        <div className='hi-timepicker__split' />
        <Time date={endDate} onPick={this.onTimePick.bind(this, 'right')} onlyTime />
      </div>
    )
  }
}

export default Provider(TimeRangePanel)
