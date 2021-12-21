import React, { useRef, useContext, useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { getTimePeriodData } from '../utils'
import DPContext from '../context'
import moment from 'moment'

const TimePeriodPanel = ({
  date,
  onTimePeriodPick,
}: {
  date: moment.Moment
  onTimePeriodPick: (ts1: string, ts2: string) => void
}) => {
  const { timeInterval = 240, localeData, prefixCls } = useContext(DPContext)
  const listEl = useRef<HTMLUListElement | null>(null)
  const [periodData, setPeriodData] = useState<ReturnType<typeof getTimePeriodData>>([])

  useEffect(() => {
    setPeriodData(getTimePeriodData(timeInterval))
  }, [timeInterval])

  const getActiveIndex = useCallback(() => {
    return timeInterval >= 60
      ? (date.hour() * 60) / timeInterval
      : (date.minute() + date.hour() * 60) / timeInterval
  }, [timeInterval, date])

  useEffect(() => {
    setTimeout(() => {
      console.error(getActiveIndex())
      listEl.current && (listEl.current.scrollTop = getActiveIndex() * 36)
    }, 0)
  }, [getActiveIndex])

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
