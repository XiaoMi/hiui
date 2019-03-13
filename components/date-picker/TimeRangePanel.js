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
    console.log(11, this.props.style)
    return (
      <div className='hi-timepicker hi-timepicker--timerange' style={this.props.style}>
        <Time date={this.state.date} onPick={this.onTimePick.bind(this)} onlyTime={this.props.type === 'time'} />
        <div className='hi-timepicker__split' />
        <Time date={this.state.date} onPick={this.onTimePick.bind(this)} onlyTime={this.props.type === 'time'} />
      </div>
    )
  }
}

export default Provider(TimeRangePanel)
