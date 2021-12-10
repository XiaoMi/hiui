import React, { useRef, useContext, useState, useEffect } from 'react'
import classNames from 'classnames'
import { getTimePeriodData } from '../utils'
import DPContext from '../context'

const TimePeriodPanel = ({ date, onTimePeriodPick }) => {
  const { timeInterval = 240, localeData, prefixCls } = useContext(DPContext)
  const listEl = useRef(null)
  const [periodData, setPeriodData] = useState([])
  useEffect(() => {
    setPeriodData(getTimePeriodData(timeInterval))
  }, [])
  const getActiveIndex = () => {
    return timeInterval >= 60
      ? (date.hour() * 60) / timeInterval
      : (date.minute() + date.hour() * 60) / timeInterval
  }
  useEffect(() => {
    setTimeout(() => {
      listEl.current && (listEl.current.scrollTop = getActiveIndex() * 37)
    }, 0)
  }, [])
  return (
    <div className={`${prefixCls}__time-period`}>
      <div className={`${prefixCls}__period-header`}>{localeData.datePicker.timePeriod}</div>
      <div className={`${prefixCls}__period-body`}>
        <ul className={`${prefixCls}__period-list`} ref={listEl}>
          {periodData.map((item, index) => {
            const cls = classNames(
              `${prefixCls}__period-item`,
              getActiveIndex() === index && `${prefixCls}__period-item--active`
            )
            return (
              <li
                className={cls}
                key={index}
                onClick={(e) => {
                  const [ts, te] = item.timeStr.split('~')
                  onTimePeriodPick(ts, te)
                }}
              >
                {item.timeStr}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default TimePeriodPanel
