import React, { useContext, useCallback } from 'react'
import TimeList from './TimeList'
import DPContext from '../context'
import moment from 'moment'
import { deconstructDate } from '../utils'

const Time = ({ date, onChange }) => {
  const {
    localeDatas,
    format = 'HH:mm:ss',
    disabledHours = () => [],
    disabledMinutes = () => [],
    disabledSeconds = () => []
  } = useContext(DPContext)
  const isShowHMS = () => {
    return {
      hour: format.indexOf('H') > -1 || format.indexOf('h') > -1,
      minute: format.indexOf('m') > -1,
      second: format.indexOf('s') > -1
    }
  }
  const {
    hours: lHours,
    minutes: lMinutes,
    seconds: lSeconds
  } = localeDatas.datePicker
  const { hour: showHour, minute: showMinute, second: showSecond } = isShowHMS()

  const generateDatas = (type) => {
    let count
    let datas = []
    const currentDate = deconstructDate(date)
    const disabledList = _getDsiabledList()
    const disabledTime = disabledList[type]
    if (type === 'hour') {
      count = 24
    } else if (type === 'minute') {
      count = 60
    } else {
      count = 60
    }
    for (let i = 0; i < count; i += 1) {
      datas.push({
        value: i,
        text: i < 10 ? '0' + i : i.toString(),
        disabled: disabledTime.includes(i),
        current: i === currentDate[type]
      })
    }
    return datas
  }
  const _getDsiabledList = () => {
    const currentDate = deconstructDate(date)
    return {
      hour:
        Object.prototype.toString.call(disabledHours) === '[object Array]'
          ? disabledHours
          : disabledHours() || [],
      minute:
        Object.prototype.toString.call(disabledMinutes) === '[object Array]'
          ? disabledMinutes
          : disabledMinutes(currentDate['hours']) || [],
      second:
        Object.prototype.toString.call(disabledSeconds) === '[object Array]'
          ? disabledSeconds
          : disabledSeconds(currentDate['hours'], currentDate['minutes']) || []
    }
  }
  const whenDisableChange = (list, val, arrowVal) => {
    let _value = val + arrowVal
    while (list.includes(_value)) {
      _value += arrowVal
    }
    return _value
  }
  const selectedEvent = useCallback(
    (type, value, arrow) => {
      const cDate = moment(date)
      const disabledList = _getDsiabledList()[type]
      if (disabledList.includes(value) && arrow) {
        value = whenDisableChange(disabledList, value, arrow)
      }
      cDate[type](value)
      if (!cDate.isSame(date)) {
        onChange(cDate)
      }
    },
    [date]
  )
  const renderTimeList = (type) => {
    const disabledList = _getDsiabledList()[type]
    const dDate = deconstructDate(date)
    const isShow = isShowHMS()[type]
    if (!isShow) {
      return null
    }
    return (
      <TimeList
        type={type}
        value={dDate[type]}
        datas={generateDatas(type)}
        disabledList={disabledList}
        onSelect={selectedEvent}
      />
    )
  }
  return (
    <div className='hi-timepicker__body'>
      <div className='hi-timepicker__timeheader'>
        {showHour && <span className='hi-timepicker__mark'>{lHours}</span>}
        {showMinute && <span className='hi-timepicker__mark'>{lMinutes}</span>}
        {showSecond && <span className='hi-timepicker__mark'>{lSeconds}</span>}
      </div>
      <div className='hi-timepicker__timebody'>
        {renderTimeList('hour')}
        {renderTimeList('minute')}
        {renderTimeList('second')}
        <div className='hi-timepicker__current-line' style={{ top: 108 }} />
      </div>
    </div>
  )
}

export default Time
