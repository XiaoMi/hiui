import React, {Component} from 'react'
import Time from './Time'
import { isValid } from './dateUtil'

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
    let { localeDatas, date, type, format } = this.props
    console.log(format)
    return (
      <div className='hi-timepicker' style={this.state.style}>
        <Time
          {...this.props}
          format={format || 'HH:mm:ss'}
          localeDatas={localeDatas}
          date={isValid(date) ? date : date.startDate}
          onPick={this.onTimePick.bind(this)}
          onlyTime={type === 'time'}
        />
      </div>
    )
  }
}

export default TimePanel
