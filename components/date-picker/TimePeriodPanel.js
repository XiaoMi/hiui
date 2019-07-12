import React, { Component } from 'react'
import classNames from 'classnames'
import { getHours, getMinutes } from './dateUtil'
export default class TimePeriodPanel extends Component {
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
    // const { date, timeInterval } = this.props
    // const activeIndex = timeInterval >= 60 ? getHours(date) * 60 / timeInterval : (getMinutes(date) + getHours(date) * 60) / timeInterval
    setTimeout(() => {
      this.listEl.current.scrollTop = this.getActiveIndex() * 37
    }, 0)
  }
  render () {
    const list = this.calcInterval()
    // const list = [
    //   '00:00 ~ 04:00',
    //   '04:00 ~ 08:00',
    //   '08:00 ~ 12:00',
    //   '12:00 ~ 16:00',
    //   '16:00 ~ 20:00',
    //   '20:00 ~ 24:00'
    // ]
    const { onTimePeriodPick } = this.props
    // const activeIndex = timeInterval >= 60 ? getHours(date) * 60 / timeInterval : (getMinutes(date) + getHours(date) * 60) / timeInterval
    const activeIndex = this.getActiveIndex()
    return <div
      className='hi-datepicker__time-period'
    >
      <div className='hi-datepicker__period-header'>时间段</div>
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
