import React, {Component} from 'react'
import classNames from 'classnames'
import {getHours} from './dateUtil'
export default class TimePeriodPanel extends Component {
  render () {
    const list = [
      '00:00 ~ 04:00',
      '04:00 ~ 08:00',
      '08:00 ~ 12:00',
      '12:00 ~ 16:00',
      '16:00 ~ 20:00',
      '20:00 ~ 24:00'
    ]
    console.log(this.props.date)
    return <div
      className='hi-datepicker__time-period'
    >
      <div className='hi-datepicker__period-header'>时间段</div>
      <div className='hi-datepicker__period-body'>
        <ul className='hi-datepicker__period-list'>
          {
            list.map((item, index) => {
              const cls = classNames(
                'hi-datepicker__period-item',
                getHours(this.props.date) / 4 === index && 'hi-datepicker__period-item--active'
              )
              return <li
                className={cls}
                key={index}
                onClick={(e) => {
                  const ts = item.split(' ~ ')
                  this.props.onTimePeriodPick(ts[0], ts[1])
                }}
              >{item}</li>
            })
          }
        </ul>
      </div>
    </div>
  }
}
