import React, {Component} from 'react'
import Time from './Time'
import Provider from '../context'

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
    return (
      <div className='hi-timepicker' style={this.state.style}>
        <Time date={this.props.date} onPick={this.onTimePick.bind(this)} onlyTime={this.props.type === 'time'} />
      </div>
    )
  }
}

export default Provider(TimePanel)
