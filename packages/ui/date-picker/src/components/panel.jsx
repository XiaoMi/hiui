import React, { useEffect, useState, useContext, useMemo } from 'react'
import classNames from 'classnames'
import Header from './header'
import Calender from './calender'
import moment from 'moment'
import DPContext from '../context'
import { TimePickerPopContent } from '@hi-ui/time-picker'
import { getView, genNewDates } from '../utils'
import { useTimePickerData } from '../hooks/useTimePickerData'
import { timePickerValueAdaptor } from '../utils/timePickerValueAdaptor'
import { useTimePickerFormat } from '../hooks/useTimePickerFormat'

const Panel = () => {
  const {
    outDate,
    type,
    onPick,
    localeData,
    showTime,
    theme,
    weekOffset,
    locale,
    onSelect,
    hourStep,
    minuteStep,
    secondStep,
    disabledHours,
    realFormat,
    disabledMinutes,
    disabledSeconds,
    prefixCls,
    showPanel,
  } = useContext(DPContext)
  const [view, setView] = useState(getView(type))

  const [calRenderDates, setCalRenderDates] = useState([])
  useState(() => {
    setView(getView(type))
  }, [type])

  useEffect(() => {
    const rDate = outDate[0] ? moment(outDate[0]) : moment()
    setCalRenderDates([rDate])
  }, [outDate])

  const onCalenderPick = (date) => {
    onSelect(date, true)
    if (type === 'year' || (type === 'month' && view === 'month')) {
      // year || month picker
      onPick(
        [
          type === 'year'
            ? moment(date.year().toString())
            : moment(`${date.year().toString()}-${date.month() + 1}`),
        ],
        false
      )
      return
    }
    if (type === 'week' && view === 'date') {
      // week picker
      const weekMethod = weekOffset ? 'isoWeek' : 'week'
      const weekNum = date[weekMethod]()
      onPick([moment(date).startOf(weekMethod), moment(date).endOf(weekMethod)], false, weekNum)
      return
    }
    let _view = view
    if (view === 'year') {
      _view = 'month'
    }
    if (view === 'month') {
      _view = 'date'
    }
    setView(_view)
    const _innerDates = genNewDates(calRenderDates, date)
    if (view === 'date') {
      onPick(_innerDates, showTime)
      return
    }
    setCalRenderDates(_innerDates)
  }

  const panelCls = classNames(
    `${prefixCls}__panel`,
    `theme__${theme}`,
    showTime && `${prefixCls}__panel--time ${prefixCls}__panel--noshadow`
  )

  const timePickerFormat = useTimePickerFormat(realFormat)
  const timePickerData = useTimePickerData(calRenderDates, timePickerFormat)

  const onTimeChange = (date) => {
    // 关闭之后，不再响应事件
    if (showPanel) {
      const d = timePickerValueAdaptor({
        timePickerValue: date,
        format: timePickerFormat,
        data: calRenderDates,
        isRange: false,
      })
      // 此处函数调用未知作用，暂且注释
      // d[0].setCalRenderDates(d)

      onPick(d, true)
    }
  }

  const onArrowEvent = (date) => {
    const _innerDates = genNewDates(calRenderDates, date)
    if (type.includes('range') && _innerDates[0] >= _innerDates[1]) return
    setCalRenderDates(_innerDates)
  }

  return (
    <div className={panelCls}>
      <div className={`${prefixCls}__panel--left`}>
        {calRenderDates[0] && (
          <React.Fragment>
            <Header
              renderDate={calRenderDates[0]}
              renderDates={calRenderDates}
              changeView={() => setView('year')}
              onArrowEvent={onArrowEvent}
              localeData={localeData}
              view={view}
              panelPosition={0}
              type={type}
              locale={locale}
              prefixCls={prefixCls}
            />
            <Calender
              renderDate={calRenderDates[0]}
              originDate={outDate[0]}
              onPick={onCalenderPick}
              view={view}
              panelPosition="left"
            />
          </React.Fragment>
        )}
      </div>
      {type === 'date' && showTime && (
        <div className={`${prefixCls}__panel--right`}>
          <TimePickerPopContent
            onChange={onTimeChange}
            value={timePickerData}
            hourStep={hourStep}
            minuteStep={minuteStep}
            secondStep={secondStep}
            itemHeight={32}
            fullDisplayItemNumber={7}
            type="single"
            format={timePickerFormat}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
          />
        </div>
      )}
    </div>
  )
}

export default Panel
