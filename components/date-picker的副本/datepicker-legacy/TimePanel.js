import React, {Component} from 'react'
import Time from './Time'
import Provider from '../../context'

class TimePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      style: props.style
    }
    if (this.props.type !== 'time') {
      this.state.style = {
        position: 'relative'
      }
    }
  }
  onTimePick (date, bol) {
    const {showTime} = this.props
    if (showTime) {
      this.props.onPick(date, true)
    } else {
      this.props.onPick(date, bol)
    }
  }
  render () {
    const { localeDatas, date, type } = this.props
    return (
      <div className='hi-timepicker-legacy' style={this.state.style}>
        <Time localeDatas={localeDatas} date={date} onPick={this.onTimePick.bind(this)} onlyTime={type === 'time'} />
      </div>
    )
  }
}

export default Provider(TimePanel)
