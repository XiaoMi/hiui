import React, {Component} from 'react'
import Time from './Time'
import { isValid } from './dateUtil'
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
    let { localeDatas, date, type, format, theme } = this.props
    return (
      <div className={`theme__${theme} `}>
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
      </div>
    )
  }
}

export default Provider(TimePanel)
