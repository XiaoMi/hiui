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
  onTimePick (flag, _date, bol) {
    const {date} = this.props
    const sd = flag === 'left' ? _date : date.startDate
    const ed = flag === 'right' ? _date : date.endDate
    let r = {
      startDate: sd,
      endDate: ed
    }
    this.props.onPick(r, bol)
  }
  render () {
    const { localeDatas, date, style } = this.props
    const {startDate, endDate} = date
    return (
      <div className='hi-timepicker hi-timepicker--timerange' style={style}>
        <Time localeDatas={localeDatas} date={startDate} onPick={this.onTimePick.bind(this, 'left')} onlyTime />
        <div className='hi-timepicker__split' />
        <Time localeDatas={localeDatas} date={endDate} onPick={this.onTimePick.bind(this, 'right')} onlyTime disableTime={startDate} />
      </div>
    )
  }
}

export default Provider(TimeRangePanel)
