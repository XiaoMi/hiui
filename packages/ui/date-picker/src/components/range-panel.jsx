import React, { useEffect, useState, useCallback, useContext, useRef } from 'react'
import classNames from 'classnames'
import Header from './header'
import Calendar from './calendar'
import moment from 'moment'
import DPContext from '../context'
import { TimePickerPopContent } from '@hi-ui/time-picker'
import useFormat from '../hooks/useFormat'
import _ from 'lodash'
import { getView, parseRenderDates, genNewDates } from '../utils'
import { useTimePickerFormat } from '../hooks/useTimePickerFormat'
import { useTimePickerData } from '../hooks/useTimePickerData'
import { timePickerValueAdaptor } from '../utils/timePickerValueAdaptor'
import TimePeriodPanel from './time-period-panel'

const RangePanel = () => {
  const {
    outDate,
    type,
    onPick,
    localeData,
    showTime,
    realFormat,
    timeInterval,
    shortcuts,
    theme,
    locale,
    onSelect,
    hourStep,
    minuteStep,
    secondStep,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    showPanel,
    prefixCls,
  } = useContext(DPContext)
  const calendarClickIsEnd = useRef(false)
  const [showRangeMask, setShowRangeMask] = useState(false)
  const [views, setViews] = useState([getView(type), getView(type)])
  const [calRenderDates, setCalRenderDates] = useState([])
  const [range, setRange] = useState({
    start: null,
    end: null,
    selecting: false,
  })
  useEffect(() => {
    const _outDate = _.cloneDeep(outDate)
    setRange({
      start: _outDate[0],
      end: _outDate[1],
      selecting: _outDate[0] && !_outDate[1],
    })
  }, [outDate])

  useEffect(() => {
    setCalRenderDates(parseRenderDates(outDate, type))
  }, [outDate, type])
  /**
   * Header 部分点击事件
   */
  const changeViewEvent = useCallback(
    (uIndex) => {
      setViews((pre) => {
        const p = [...pre]
        p[uIndex] = 'year'
        return p
      })
    },
    [type]
  )

  const setRanges = (date) => {
    const newRange = { ...range }
    if (range.selecting || !calendarClickIsEnd.current) {
      if (newRange.start >= date) {
        newRange.selecting = false
        newRange.end = newRange.start
        newRange.start = date
      }
      onSelect(date, calendarClickIsEnd)
      if (type === 'weekrange') {
        onPick([newRange.start.startOf('week'), newRange.end.endOf('week')], showTime)
      } else {
        onPick([newRange.start, newRange.end], showTime)
      }
    } else {
      newRange.selecting = true
      newRange.start = date
      newRange.end = null
      onSelect(date, false)
    }
    setRange(newRange)
  }
  /**
   * 日历面板点击事件
   * @param {*} date
   * @param {*} dir
   */
  const onCalenderPick = (date, uIndex) => {
    calendarClickIsEnd.current = !calendarClickIsEnd.current
    if (type === 'timeperiod' && views[uIndex] === 'date') {
      onPick([date, moment(date).hour(date.hour() + timeInterval / 60)], true)
      onSelect(date, true)
      return
    }
    if (type.includes(views[uIndex]) || type === 'weekrange') {
      setRanges(date)
    } else {
      const _innerDates = genNewDates(calRenderDates, date, uIndex)
      setCalRenderDates(_innerDates)
    }
    const _views = _.cloneDeep(views)
    if (views[uIndex] === 'month' && !type.includes('month')) {
      _views[uIndex] = 'date'
    }
    if (views[uIndex] === 'year' && !type.includes('year')) {
      _views[uIndex] = 'month'
    }
    setViews(_views)
  }

  const onMouseMove = (date) => {
    setRange({
      ...range,
      end: date,
    })
  }

  const onTimeChange = (date) => {
    // 关闭之后，不再响应事件
    if (showPanel) {
      const d = timePickerValueAdaptor({
        timePickerValue: date,
        format: timePickerFormat,
        data: calRenderDates,
        isRange: true,
      })
      // 此处函数调用未知作用，暂且注释
      // d[0].setCalRenderDates(d)

      onPick(d, true)
    }
  }
  const getRangeDateStr = () => {
    const _format = realFormat.substr(realFormat.match(/[H|h]\s*/).index)
    const cls = classNames(showRangeMask && `${prefixCls}__timetext`)
    const startOfDay = moment().startOf('day').format(_format)
    const endOfDay = moment().endOf('day').format(_format)
    return (
      <span className={cls}>
        {`${range.start ? range.start.format(_format) : startOfDay} - ${
          range.end ? range.end.format(_format) : endOfDay
        }`}
      </span>
    )
  }
  const onArrowEvent = (date, index) => {
    const _innerDates = genNewDates(calRenderDates, date, index)
    if (type.includes('range') && _innerDates[0].isSameOrAfter(_innerDates[1], 'month')) {
      return
    }
    setCalRenderDates(_innerDates)
  }
  const onTimePeriodPick = useCallback(
    (ts1, ts2) => {
      const [leftDate] = _.cloneDeep(calRenderDates)
      if (outDate[0]) {
        onPick([
          moment(leftDate).hour(parseInt(ts1)).minute(moment(ts1, 'HH:mm').format('mm')).second(0),
          moment(leftDate).hour(parseInt(ts2)).minute(moment(ts2, 'HH:mm').format('mm')).second(0),
        ])
      }
    },
    [calRenderDates]
  )

  const shortcutsClickEvent = (item) => {
    if (item.range) {
      // 新版 shortcuts
      onPick([moment(item.range[0]), moment(item.range[1])])
    } else {
      // 旧版
      let days
      const currentDate = moment()
      switch (item) {
        case localeData.datePicker.lastWeek:
          days = 7
          break
        case localeData.datePicker.lastMonth:
          days = 30
          break
        case localeData.datePicker.lastThreeMonth:
          days = 90
          break
        default:
          days = 365
          break
      }
      const startDate = moment().subtract(days, 'days')
      onPick([startDate, currentDate])
    }
  }
  const renderShortcut = () => {
    return (
      <div className={`${prefixCls}__shortcuts`}>
        <ul className={`${prefixCls}__shortcuts-list`}>
          {shortcuts.map((m, n) => {
            return (
              <li
                className={`${prefixCls}__shortcuts-item`}
                key={n}
                onClick={() => shortcutsClickEvent(m)}
              >
                {m.title || m}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  const isDisableFooter = range.start && range.end && !range.selecting
  const panelCls = classNames(
    `${prefixCls}__panel`,
    `theme__${theme}`,
    type.includes('range') && `${prefixCls}__panel--range`,
    type === 'timeperiod' && `${prefixCls}__panel--timeperiod`,
    (showTime || type === 'timeperiod') && `${prefixCls}__panel--noshadow`
  )

  const timePickerFormat = useTimePickerFormat(realFormat)
  const timePickerData = useTimePickerData(calRenderDates, timePickerFormat)

  return (
    <React.Fragment>
      <div className={panelCls}>
        {shortcuts && renderShortcut()}
        <div className={`${prefixCls}__panel--left`}>
          {calRenderDates[0] && (
            <React.Fragment>
              <Header
                renderDate={calRenderDates[0]}
                renderDates={calRenderDates}
                changeView={() => changeViewEvent(0)}
                onArrowEvent={onArrowEvent}
                localeData={localeData}
                view={views[0]}
                panelPosition={0}
                type={type}
                locale={locale}
                prefixCls={prefixCls}
              />
              <Calendar
                renderDate={calRenderDates[0]}
                originDate={outDate[0]}
                onPick={(date) => onCalenderPick(date, 0)}
                view={views[0]}
                range={range}
                mouseMove={onMouseMove}
                panelPosition="left"
              />
            </React.Fragment>
          )}
        </div>
        <div className={`${prefixCls}__panel--right`}>
          {calRenderDates[1] &&
            (type === 'timeperiod' ? (
              <TimePeriodPanel date={calRenderDates[0]} onTimePeriodPick={onTimePeriodPick} />
            ) : (
              <React.Fragment>
                <Header
                  renderDate={calRenderDates[1]}
                  changeView={() => changeViewEvent(1)}
                  onArrowEvent={onArrowEvent}
                  localeData={localeData}
                  view={views[1]}
                  leftDate={calRenderDates[0]}
                  panelPosition={1}
                  type={type}
                  locale={locale}
                  prefixCls={prefixCls}
                />
                <Calendar
                  originDate={outDate[1]}
                  renderDate={calRenderDates[1]}
                  range={range}
                  view={views[1]}
                  onPick={(date) => onCalenderPick(date, 1)}
                  mouseMove={onMouseMove}
                  leftDate={calRenderDates[0]}
                  panelPosition="right"
                />
              </React.Fragment>
            ))}
        </div>
      </div>
      {type === 'daterange' && showTime && (
        <div
          className={`${prefixCls}__footer ${
            !isDisableFooter ? `${prefixCls}__footer--disable` : ''
          }`}
          onClick={() => {
            isDisableFooter && setShowRangeMask(true)
          }}
        >
          {getRangeDateStr()}
        </div>
      )}
      {showRangeMask && (
        <React.Fragment>
          <div className={`${prefixCls}__mask`} onClick={() => setShowRangeMask(false)} />
          <TimePickerPopContent
            onChange={onTimeChange}
            value={timePickerData}
            hourStep={hourStep}
            minuteStep={minuteStep}
            secondStep={secondStep}
            itemHeight={32}
            fullDisplayItemNumber={7}
            format={timePickerFormat}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
            disabledSeconds={disabledSeconds}
            style={{
              position: 'absolute',
              top: 5,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
            }}
            type="range"
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default RangePanel
