import React, {Component} from 'react'
import {deconstructDate} from './util'
import TimeList from './TimeList'
import { isSameDay, getValidDate } from './dateUtil'

class Time extends Component {
  constructor (props) {
    super(props)
    this.state = {
      date: getValidDate(props.date),
      prefix: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    }
  }
  callback (date) {
    this.setState({
      date
    })
    this.props.onPick(date, true)
  }
  componentWillReceiveProps (props) {
    if (!isSameDay(props.date, this.state.date)) {
      this.setState({
        date: getValidDate(props.date)
      })
    }
  }
  selectedEvent (type, value) {
    const { date } = this.state
    const currentDate = deconstructDate(date)
    const { disabledHours, disabledMinutes, disabledSeconds } = this.props
    if (type === 'hours' && !disabledHours().includes(value)) {
      date.setHours(value)
      this.callback(date)
    } else if (type === 'minutes' && !disabledMinutes(currentDate['hours']).includes(value)) {
      date.setMinutes(value)
      this.callback(date)
    } else if (type === 'seconds' && !disabledSeconds(currentDate['hours'], currentDate['minutes']).includes(value)) {
      date.setSeconds(value)
      this.callback(date)
    }
  }

  isShowHMS () {
    const { format } = this.props
    return {
      hours: format.indexOf('H') > -1 || format.indexOf('h') > -1,
      minutes: format.indexOf('m') > -1,
      seconds: format.indexOf('s') > -1
    }
  }
  generateDatas (type) {
    let count
    let datas = []
    let disabledTime
    let step = 1
    const currentDate = deconstructDate(this.state.date)
    const { disabledHours, disabledMinutes, disabledSeconds } = this.props
    if (type === 'hours') {
      count = 24
      disabledTime = disabledHours()
      step = this.props.hourStep || 1
    } else if (type === 'minutes') {
      count = 60
      disabledTime = disabledMinutes(currentDate['hours'])
      step = this.props.minuteStep || 1
    } else {
      count = 60
      disabledTime = disabledSeconds(currentDate['hours'], currentDate['minutes'])
      step = this.props.secondStep || 1
    }
    for (let i = 0; i < count; i += step) {
      datas.push({
        value: i,
        text: i < 10 ? '0' + i : i.toString(),
        disabled: disabledTime.includes(i),
        current: i === currentDate[type]
      })
    }
    return datas
  }
  renderTimeList (type) {
    const dDate = deconstructDate(this.state.date)
    const isShow = this.isShowHMS()[type]
    if (!isShow) { return null }
    return <TimeList
      type={type}
      value={dDate[type]}
      onlyTime={this.props.onlyTime}
      datas={this.generateDatas(type)}
      onSelect={this.selectedEvent.bind(this)}
      show={this.isShowHMS()[type]}
    />
  }
  render () {
    const { localeDatas } = this.props
    const { hours: lHours, minutes: lMinutes, seconds: lSeconds } = localeDatas.datePicker
    const {
      hours: showHour,
      minutes: showMinute,
      seconds: showSecond
    } = this.isShowHMS()
    return (
      <div className='hi-timepicker__body'>
        <div className='hi-timepicker__timeheader'>
          {
            showHour && <span className='hi-timepicker__mark'>{lHours}</span>
          }
          {
            showMinute && <span className='hi-timepicker__mark'>{lMinutes}</span>
          }
          {
            showSecond && <span className='hi-timepicker__mark'>{lSeconds}</span>
          }
        </div>
        <div className='hi-timepicker__timebody'>
          {this.renderTimeList('hours')}
          {this.renderTimeList('minutes')}
          {this.renderTimeList('seconds')}
          <div className='hi-timepicker__current-line' style={{top: this.props.onlyTime ? 108 : 140}} />
        </div>
      </div>
    )
  }
}
Time.defaultProps = {
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  format: 'HH:mm:ss',
  disabledHours: () => [],
  disabledMinutes: () => [],
  disabledSeconds: () => []
}

export default Time
