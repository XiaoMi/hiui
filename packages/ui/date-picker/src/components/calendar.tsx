import React, { useContext, useCallback, useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import DPContext from '../context'
import moment from 'moment'
import useCalenderData, { CalendarColInfo, CalenderSelectedRange } from '../hooks/useCalenderData'
import _ from 'lodash'
import { getFullTime } from '../utils'
import { CSSTransition } from 'react-transition-group'
import { FormatCalendarItem } from '../types'

const Calendar = ({
  view = 'date',
  originDate,
  onPick,
  range,
  mouseMove,
  // panelPosition,
  renderDate,
}: {
  view: string
  originDate: moment.Moment | null
  onPick: (date: moment.Moment) => void
  range?: CalenderSelectedRange
  mouseMove?: (date: moment.Moment) => void
  renderDate: moment.Moment | null
}) => {
  const {
    weekOffset,
    localeData,
    type,
    min,
    max,
    altCalendar,
    altCalendarPreset,
    dateMarkRender,
    dateMarkPreset,
    altCalendarPresetData,
    dateMarkPresetData,
    disabledDate,
    prefixCls,
  } = useContext(DPContext)

  const largeCell = !!(altCalendar || altCalendarPreset || dateMarkRender || dateMarkPreset)

  const [holidayFullName, setHolidayFullName] = useState('')
  const [holidayFullNameShow, setHolidayFullNameShow] = useState(false)
  const holidayTime = useRef<number>()
  const [rows] = useCalenderData({
    type,
    view,
    renderDate,
    originDate,
    localeData,
    weekOffset,
    range,
    min,
    max,
    // panelPosition,
    disabledDate,
  })
  const [calendarCls, setCalenderCls] = useState(`${prefixCls}__calendar`)

  const getTDClass = (td: CalendarColInfo, largeCell: boolean) => {
    const _class = [`${prefixCls}__cell`]
    if (largeCell) {
      _class.push(`${prefixCls}__cell--large`)
      // _index === 6 && _class.push('hi-datepicker__cell--large--laster')
    }
    // if (td.disabled) {
    //   _class.push('hi-datepicker__cell--disabled')
    // }
    switch (td.type) {
      case 'prev':
      case 'next':
        _class.push(`${prefixCls}__cell--out`)
        break
      default:
        _class.push(`${prefixCls}__cell--${td.type}`)
        break
    }
    td.range && _class.push(`${prefixCls}__cell--range`)
    td.rangeStart && _class.push(`${prefixCls}__cell--range-start`)
    td.rangeEnd && _class.push(`${prefixCls}__cell--range-end`)
    return _class.join(' ')
  }

  const [weekNum, setWeekNum] = useState(0)

  useEffect(() => {
    setCalenderCls(classNames(`${prefixCls}__calendar`, `${prefixCls}__calendar--${view}`))
  }, [rows, view])

  const getWeeks = () => {
    const week = localeData.datePicker.week
    return week.slice(weekOffset).concat(week.slice(0, weekOffset))
  }

  const onTableClick = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
    const td = e.target as HTMLTableElement
    const value = td.getAttribute('value') as string
    if (!['SPAN', 'DIV'].includes(td.nodeName) || td.getAttribute('type') === 'disabled') {
      return false
    }
    const clickVal = parseInt(value)
    const _date = moment(renderDate) as any
    const cellType = td.getAttribute('type')
    const cellWeekType = td.getAttribute('weektype')
    if (cellType === 'prev' || cellWeekType === 'prev') {
      _date.subtract(1, 'months')
    }
    if (cellType === 'next' || cellWeekType === 'next') {
      _date.add(1, 'months')
    }
    // 需要放在修改月后，再设置日期
    _date[view](clickVal)
    onPick(_date)
  }

  const onTableMouseMove = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
    const ele = e.target as HTMLTableElement
    const panelDate = _.cloneDeep(renderDate)!
    if (type.includes('range')) {
      const val = Number(ele.getAttribute('value'))
      const cellType = ele.getAttribute('type')
      if (!val || (ele as any).disabled || !range?.selecting || cellType === 'disabled')
        return false
      if (range?.end && val === (range.end as any)[view]() * 1) {
        return false
      }
      ;(panelDate as any)[view](val)
      if (cellType === 'prev') {
        panelDate.subtract(1, 'month')
      }
      if (cellType === 'next') {
        panelDate.add(1, 'months')
      }
      mouseMove && mouseMove(panelDate)
    }
  }

  const onTrMouseOver = useCallback(
    (num) => {
      if (num && (type === 'week' || type === 'weekrange') && weekNum !== num) {
        setWeekNum(num)
      }
    },
    [type]
  )
  const showHolidayDetail = (fullTimeInfo: FormatCalendarItem) => {
    clearTimeout(holidayTime.current)
    setHolidayFullName(fullTimeInfo.FullText || String(fullTimeInfo.text))
    setHolidayFullNameShow(true)
    holidayTime.current = setTimeout(() => {
      setHolidayFullNameShow(false)
    }, 2000) as any
  }
  const renderAltCalendar = (cell: CalendarColInfo) => {
    if (view.includes('year') || view.includes('month')) return
    if (
      Object.keys(altCalendarPresetData).length > 0 ||
      Object.keys(dateMarkPresetData).length > 0 ||
      dateMarkRender ||
      altCalendar
    ) {
      const fullTimeInfo = getFullTime({
        cell,
        renderDate,
        altCalendar,
        altCalendarPreset,
        dateMarkRender,
        // dateMarkPreset,
        altCalendarPresetData,
        dateMarkPresetData,
      }) as FormatCalendarItem
      return (
        <React.Fragment>
          {fullTimeInfo.nodeMark}
          {fullTimeInfo.text ? (
            <span
              onMouseEnter={() => {
                altCalendarPreset === 'id-ID' && showHolidayDetail(fullTimeInfo)
              }}
              // @ts-ignore
              value={cell.value}
              className={`${prefixCls}__lunar ${
                fullTimeInfo.highlight ? `${prefixCls}__lunar--highlight` : ''
              }`}
            >
              {fullTimeInfo.text}
            </span>
          ) : null}
        </React.Fragment>
      )
    } else {
      return null
    }
  }

  return (
    <div
      className={`${prefixCls}__calendar-wrap ${
        largeCell ? `${prefixCls}__calendar-wrap--large` : ''
      }`}
    >
      <CSSTransition in={holidayFullNameShow} timeout={300} classNames={`${prefixCls}__indiaHoli`}>
        <div className={`${prefixCls}__indiaHoli`}>
          <div className={`${prefixCls}__indiaHoli-text`}>{holidayFullName}</div>
        </div>
      </CSSTransition>
      <table className={calendarCls} onClick={onTableClick} onMouseMove={onTableMouseMove}>
        {(view.includes('date') || view.includes('week')) && (
          <thead>
            <tr>
              {getWeeks().map((item: React.ReactNode, index: number) => {
                return <th key={index}>{item}</th>
              })}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, index) => {
            return (
              <tr
                key={index}
                className={`${prefixCls}__row ${
                  row.weekNum === weekNum ? `${prefixCls}__row--currentweek` : ''
                }`}
                onMouseEnter={() => onTrMouseOver(row.weekNum)}
              >
                {row.map((cell, _index) => {
                  return (
                    <td
                      key={_index}
                      // @ts-ignore
                      value={cell.value}
                      type={cell.type}
                      // className='hi-datepicker__cell'
                      className={getTDClass(cell, largeCell)}
                    >
                      <div
                        className={`${prefixCls}__cell-text`}
                        // @ts-ignore
                        value={cell.value}
                        type={cell.type}
                      >
                        <span
                          // @ts-ignore
                          value={cell.value}
                          type={cell.type}
                          weektype={cell.weekType}
                          className={`${prefixCls}__cellnum`}
                        >
                          {parseInt(String(cell.text || cell.value)) < 10
                            ? '0' + (cell.text || cell.value)
                            : cell.text || cell.value}
                        </span>
                        {renderAltCalendar(cell)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Calendar
