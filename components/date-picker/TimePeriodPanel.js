import React, {Component} from 'react'
import classNames from 'classnames'
import Provider from '../context'
import {getHours, getMinutes} from './dateUtil'
class TimePeriodPanel extends Component {
  constructor (props) {
    super(props)
    this.listEl = React.createRef()
  }
  calcInterval () {
    const { timeInterval } = this.props
    const segment = 24 * 60 / timeInterval
    let pre = 0
    let next = 0
    let arr = []
    const func = (val) => (val < 10 ? '0' + val : val)
    for (let i = 0; i < segment; i++) {
      next += timeInterval
      const time = func(parseInt(pre / 60)) + ':' + func(pre % 60) + ' ~ ' + func(parseInt(next / 60)) + ':' + func(next % 60)
      arr.push(time)
      pre = next
    }
    return arr
  }
  getActiveIndex () {
    const { date, timeInterval } = this.props
    return timeInterval >= 60 ? getHours(date) * 60 / timeInterval : (getMinutes(date) + getHours(date) * 60) / timeInterval
  }
  componentDidMount () {
    setTimeout(() => {
      this.listEl.current.scrollTop = this.getActiveIndex() * 37
    }, 0)
  }
  render () {
    const list = this.calcInterval()
    const { onTimePeriodPick, localeDatas } = this.props
    const activeIndex = this.getActiveIndex()
    return <div
      className='hi-datepicker__time-period'
    >
      <div className='hi-datepicker__period-header'>{localeDatas.datePicker.timePeriod}</div>
      <div className='hi-datepicker__period-body'>
        <ul className='hi-datepicker__period-list' ref={this.listEl}>
          {
            list.map((item, index) => {
              const cls = classNames(
                'hi-datepicker__period-item',
                activeIndex === index && 'hi-datepicker__period-item--active'
              )
              return <li
                className={cls}
                key={index}
                onClick={(e) => {
                  const ts = item.split(' ~ ')
                  onTimePeriodPick(ts[0], ts[1])
                }}
              >{item}</li>
            })
          }
        </ul>
      </div>
    </div>
  }
}

export default Provider(TimePeriodPanel)
