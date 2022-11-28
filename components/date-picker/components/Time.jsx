import React, { useContext, useCallback } from 'react'
import TimeList from './TimeList'
import DPContext from '../context'
import moment from 'moment'
import { deconstructDate } from '../utils'

const Time = ({ date, onChange, timeRangePanelType, startDate, currentDate }) => {
  const {
    localeDatas,
    format = 'HH:mm:ss',
    disabledHours = () => [],
    disabledMinutes = () => [],
    disabledSeconds = () => [],
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    type: PropsType,
    showTime
  } = useContext(DPContext)
  const isShowHMS = () => {
    return {
      hour: format.indexOf('H') > -1 || format.indexOf('h') > -1,
      minute: format.indexOf('m') > -1,
      second: format.indexOf('s') > -1
    }
  }
  const { hours: lHours, minutes: lMinutes, seconds: lSeconds } = localeDatas.datePicker
  const { hour: showHour, minute: showMinute, second: showSecond } = isShowHMS()
  // 设置Date的选中状态
  const setDisableTime = (type, i, disabledTime = []) => {
    let isDisabled = disabledTime.includes(i)
    if (PropsType === 'timerange' || PropsType === 'time' || PropsType === 'default' || showTime) {
      if (timeRangePanelType === 'right') {
        const { hour, minute, second } = deconstructDate(startDate)
        const { hour: endHour, minute: endMinute } = date ? deconstructDate(date) : deconstructDate(new Date())
        const dateDiff = moment(date).diff(moment(startDate), 'days')
        const hourDiff = moment(date).diff(moment(startDate), 'hour')
        const minuteDiff = moment(date).diff(moment(startDate), 'minutes')

        // 不在同一天
        if (dateDiff !== 0) {
          isDisabled = dateDiff < 0
        }
        // 在同一天，则比较小时
        else {
          if (type === 'hour') {
            isDisabled = hour > i
          } else {
            // 不在同一小时
            if (hourDiff !== 0) {
              isDisabled = hourDiff < 0
            }
            // 在同一小时，则比较分钟
            else {
              if (type === 'minute') {
                if (endHour === hour) {
                  isDisabled = minute > i
                }
                if (endHour < hour) {
                  isDisabled = true
                }
              } else {
                // 不在同一分
                if (minuteDiff !== 0) {
                  isDisabled = minuteDiff < 0
                }
                // 在同一分钟，则比较秒
                else {
                  if (endHour === hour) {
                    isDisabled = endMinute === minute && second > i
                    if (endMinute < minute) {
                      isDisabled = true
                    }
                  }
                  if (endHour < hour) {
                    isDisabled = true
                  }
                }
              }
            }
          }
        }
      }

      return isDisabled
    }
  }
  const getStep = (type) => {
    let step = 1
    const directionStep = 1
    switch (type) {
      case 'hour':
        step = hourStep || directionStep
        break
      case 'minute':
        step = minuteStep || directionStep
        break
      case 'second':
        step = secondStep || directionStep
        break
      default:
        step = 1
        break
    }
    return step
  }
  const generateDatas = (type) => {
    let count
    const datas = []
    const currentDate = deconstructDate(date)
    const step = getStep(type)
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
      if (i % step === 0 || i === 0) {
        datas.push({
          value: i,
          text: i < 10 ? '0' + i : i.toString(),
          disabled: setDisableTime(type, i, disabledTime),
          current: i === currentDate[type]
        })
      }
    }
    return datas
  }

  const _getDsiabledList = () => {
    const currentDate = deconstructDate(date)
    return {
      hour: Object.prototype.toString.call(disabledHours) === '[object Array]' ? disabledHours : disabledHours() || [],
      minute:
        Object.prototype.toString.call(disabledMinutes) === '[object Array]'
          ? disabledMinutes
          : disabledMinutes(currentDate.hour) || [],
      second:
        Object.prototype.toString.call(disabledSeconds) === '[object Array]'
          ? disabledSeconds
          : disabledSeconds(currentDate.hour, currentDate.minute) || []
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
    (type, value, arrow, target) => {
      // 避免空值时 点开 select 自动更新 input
      // 这里的 `scroll` 是 TimeList 内部暴露的自定义事件，需要规避处理
      if (target === 'scroll' && !currentDate) return

      const cDate = moment(date)
      const disabledList = _getDsiabledList()[type]
      if (disabledList.includes(value) && arrow) {
        value = whenDisableChange(disabledList, value, arrow)
      }
      cDate[type](value)
      if (!cDate.isSame(date) || (target !== 'scroll' && !cDate.isSame(currentDate))) {
        onChange(cDate)
      }
    },
    [date, onChange, whenDisableChange]
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
        hourStep={hourStep}
        minuteStep={minuteStep}
        secondStep={secondStep}
        timeRangePanelType={timeRangePanelType}
      />
    )
  }
  return (
    <div className="hi-timepicker__body">
      <div className="hi-timepicker__timeheader">
        {showHour && <span className="hi-timepicker__mark">{lHours}</span>}
        {showMinute && <span className="hi-timepicker__mark">{lMinutes}</span>}
        {showSecond && <span className="hi-timepicker__mark">{lSeconds}</span>}
      </div>
      <div className="hi-timepicker__timebody">
        {renderTimeList('hour')}
        {renderTimeList('minute')}
        {renderTimeList('second')}
        <div className="hi-timepicker__current-line" style={{ top: 108 }} />
      </div>
    </div>
  )
}

export default Time
