import React, {Component} from 'react'
import Time from './Time'
import Button from '../button'
export default class TimePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date(props.date),
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
    return (
      <div className='hi-timepicker' style={this.state.style}>
        <Time date={this.state.date} onPick={this.onTimePick.bind(this)} onlyTime={this.props.type === 'time'} />
        {
          this.props.type === 'time' && (
            <div className='time-footer'>
              <Button type='primary' size='small' onClick={() => this.props.timeConfirm(this.state.date, true)}>确认</Button>
            </div>
          )
        }

      </div>
    )
  }
}
