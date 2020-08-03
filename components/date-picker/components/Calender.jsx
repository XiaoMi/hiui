import React, {
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef
} from 'react'
import classNames from 'classnames'
import DPContext from '../context'
import moment from 'moment'
import { useCalenderData } from '../hooks'
import _ from 'lodash'
import { getFullTime } from '../utils'
import { CSSTransition } from 'react-transition-group'

const getTDClass = (td, largeCell) => {
  let _class = ['hi-datepicker__cell']
  if (largeCell) {
    _class.push('hi-datepicker__cell--large')
    // _index === 6 && _class.push('hi-datepicker__cell--large--laster')
  }
  // if (td.disabled) {
  //   _class.push('hi-datepicker__cell--disabled')
  // }
  switch (td.type) {
    case 'prev':
    case 'next':
      _class.push('hi-datepicker__cell--out')
      break
    default:
      _class.push(`hi-datepicker__cell--${td.type}`)
      break
  }
  td.range && _class.push('hi-datepicker__cell--range')
  td.rangeStart && _class.push('hi-datepicker__cell--range-start')
  td.rangeEnd && _class.push('hi-datepicker__cell--range-end')
  return _class.join(' ')
}

const Calender = ({
  view = 'date',
  originDate,
  onPick,
  range,
  mouseMove,
  panelPosition,
  renderDate
}) => {
  const {
    weekOffset,
    localeDatas,
    type,
    min,
    max,
    altCalendar,
    altCalendarPreset,
    dateMarkRender,
    dateMarkPreset,
    altCalendarPresetData,
    dateMarkPresetData
  } = useContext(DPContext)
  const largeCell =
    altCalendar || altCalendarPreset || dateMarkRender || dateMarkPreset

  const [holidayFullName, setHolidayFullName] = useState('')
  const [holidayFullNameShow, setHolidayFullNameShow] = useState(false)
  const holidayTime = useRef(null)
  const [rows] = useCalenderData({
    type,
    view,
    renderDate,
    originDate,
    localeDatas,
    weekOffset,
    range,
    min,
    max,
    panelPosition
  })
  const [calenderCls, setCalenderCls] = useState('hi-datepicker__calender')

  const [weekNum, setWeekNum] = useState(0)
  useEffect(() => {
    setCalenderCls(
      classNames('hi-datepicker__calender', `hi-datepicker__calender--${view}`)
    )
  }, [rows, view])
  const getWeeks = () => {
    const week = localeDatas.datePicker.week
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
    _date[view](clickVal)
    const cellType = td.getAttribute('type')
    if (cellType === 'prev') {
      _date.subtract(1, 'months')
    }
    if (cellType === 'next') {
      _date.add(1, 'months')
    }
    onPick(_date)
  }

  const onTableMouseMove = (e) => {
    let ele = e.target
    // let {year, month} = deconstructDate(date)
    const panelDate = _.cloneDeep(renderDate)
    if (type.includes('range')) {
      const val = ele.getAttribute('value')
      const cellType = ele.getAttribute('type')
      if (!val || ele.disabled || !range.selecting) return false
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

  const onTrMouseOver = useCallback((num) => {
    if (num && (type === 'week' || type === 'weekrange') && weekNum !== num) {
      setWeekNum(num)
    }
  }, [])
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
        dateMarkPresetData
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
              className={`hi-datepicker__lunar ${
                fullTimeInfo.highlight ? 'hi-datepicker__lunar--highlight' : ''
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
      className={`hi-datepicker__calender-wrap ${
        largeCell ? 'hi-datepicker__calender-wrap--large' : ''
      }`}
    >
      <CSSTransition
        in={holidayFullNameShow}
        timeout={300}
        classNames='hi-datepicker__indiaHoli'
      >
        <div className='hi-datepicker__indiaHoli'>
          <div className='hi-datepicker__indiaHoli-text'>{holidayFullName}</div>
        </div>
      </CSSTransition>
      <table
        className={calenderCls}
        onClick={onTableClick}
        onMouseMove={onTableMouseMove}
      >
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
                className={`hi-datepicker__row ${
                  row.weekNum === weekNum
                    ? 'hi-datepicker__row--currentweek'
                    : ''
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
                        className='hi-datepicker__cell-text'
                        value={cell.value}
                        type={cell.type}
                      >
                        <span
                          value={cell.value}
                          type={cell.type}
                          className='hi-datepicker__cellnum'
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
