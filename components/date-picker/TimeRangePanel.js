import React, {Component} from 'react'
import Time from './Time'
import Provider from '../context'

class TimeRangePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      date: props.date,
      style: props.style
    }
  }
  onTimePick (date, bol) {
    const {showTime} = this.props
    if (showTime) {
      this.setState({
        date
      })
      this.props.onPick(date, true)
    } else {
      this.setState({
        date
      })
      this.props.onPick(date, bol)
    }
  }
  render () {
    const {startDate, endDate} = this.state.date
    return (
      <div className='hi-timepicker hi-timepicker--timerange' style={this.props.style}>
        <Time date={startDate} onPick={this.onTimePick.bind(this)} onlyTime />
        <div className='hi-timepicker__split' />
        <Time date={endDate} onPick={this.onTimePick.bind(this)} onlyTime />
      </div>
    )
  }
}

export default Provider(TimeRangePanel)
