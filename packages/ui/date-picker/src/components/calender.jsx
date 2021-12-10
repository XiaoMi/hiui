import React, { useContext, useCallback, useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import DPContext from '../context'
import moment from 'moment'
import useCalenderData from '../hooks/useCalenderData'
import _ from 'lodash'
import { getFullTime } from '../utils'
import { CSSTransition } from 'react-transition-group'

const Calender = ({
  view = 'date',
  originDate,
  onPick,
  range,
  mouseMove,
  panelPosition,
  renderDate,
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

  const largeCell = altCalendar || altCalendarPreset || dateMarkRender || dateMarkPreset

  const [holidayFullName, setHolidayFullName] = useState('')
  const [holidayFullNameShow, setHolidayFullNameShow] = useState(false)
  const holidayTime = useRef(null)
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
    panelPosition,
    disabledDate,
  })
  const [calenderCls, setCalenderCls] = useState(`${prefixCls}__calender`)

  const getTDClass = (td, largeCell) => {
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
    setCalenderCls(classNames(`${prefixCls}__calender`, `${prefixCls}__calender--${view}`))
  }, [rows, view])
  const getWeeks = () => {
    const week = localeData.datePicker.week
    return week.slice(weekOffset).concat(week.slice(0, weekOffset))
  }

  const onTableClick = (e) => {
    const td = e.target
    const value = td.getAttribute('value')
    if (!['SPAN', 'DIV'].includes(td.nodeName) || td.getAttribute('type') === 'disabled') {
      return false
    }
    const clickVal = parseInt(value)
    const _date = moment(renderDate)
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

  const onTableMouseMove = (e) => {
    const ele = e.target
    const panelDate = _.cloneDeep(renderDate)
    if (type.includes('range')) {
      const val = ele.getAttribute('value')
      const cellType = ele.getAttribute('type')
      if (!val || ele.disabled || !range.selecting || cellType === 'disabled') return false
      if (range.end && val * 1 === range.end[view]() * 1) return false
      panelDate[view](val)
      if (cellType === 'prev') {
        panelDate.subtract(1, 'month')
      }
      if (cellType === 'next') {
        panelDate.add(1, 'months')
      }
      mouseMove(panelDate)
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
  const showHolidayDetail = (fullTimeInfo) => {
    clearTimeout(holidayTime.current)
    setHolidayFullName(fullTimeInfo.FullText || fullTimeInfo.text)
    setHolidayFullNameShow(true)
    holidayTime.current = setTimeout(() => {
      setHolidayFullNameShow(false)
    }, 2000)
  }
  const renderAltCalendar = (cell) => {
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
        dateMarkPreset,
        altCalendarPresetData,
        dateMarkPresetData,
      })
      return (
        <React.Fragment>
          {fullTimeInfo.nodeMark}
          {fullTimeInfo.text ? (
            <span
              onMouseEnter={() => {
                altCalendarPreset === 'id-ID' && showHolidayDetail(fullTimeInfo)
              }}
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
      className={`${prefixCls}__calender-wrap ${
        largeCell ? `${prefixCls}__calender-wrap--large` : ''
      }`}
    >
      <CSSTransition in={holidayFullNameShow} timeout={300} classNames={`${prefixCls}__indiaHoli`}>
        <div className={`${prefixCls}__indiaHoli`}>
          <div className={`${prefixCls}__indiaHoli-text`}>{holidayFullName}</div>
        </div>
      </CSSTransition>
      <table className={calenderCls} onClick={onTableClick} onMouseMove={onTableMouseMove}>
        {(view.includes('date') || view.includes('week')) && (
          <thead>
            <tr>
              {getWeeks().map((item, index) => {
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
                      value={cell.value}
                      type={cell.type}
                      // className='hi-datepicker__cell'
                      className={getTDClass(cell, largeCell)}
                    >
                      <div
                        className={`${prefixCls}__cell-text`}
                        value={cell.value}
                        type={cell.type}
                      >
                        <span
                          value={cell.value}
                          type={cell.type}
                          weektype={cell.weekType}
                          className={`${prefixCls}__cellnum`}
                        >
                          {parseInt(cell.text || cell.value) < 10
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

export default Calender
