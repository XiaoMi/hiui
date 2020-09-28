import React, {Component} from 'react'
import Time from './Time'
import Provider from '../context'

class TimeRangePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      style: props.style
    }
  }
  onTimePick (flag, _date, bol) {
    const {date} = this.props
    const r = {}
    r.startDate = flag === 'left' ? _date : date.startDate
    r.endDate = flag === 'right' ? _date : date.endDate
    this.props.onPick(r, bol)
  }
  render () {
    const { date, style } = this.props
    const {startDate, endDate} = date
    return (
      <div className='hi-timepicker hi-timepicker--timerange' style={style}>
        <Time {...this.props} date={startDate} endDate={endDate} timeRangePanelType='left' changeEndDate={this.onTimePick.bind(this, 'right')} onPick={this.onTimePick.bind(this, 'left')} onlyTime />
        <div className='hi-timepicker__split' />
        <Time {...this.props} date={endDate} startDate={startDate} timeRangePanelType='right'  onPick={this.onTimePick.bind(this, 'right')} onlyTime />
      </div>
    )
  }
}

export default Provider(TimeRangePanel)
