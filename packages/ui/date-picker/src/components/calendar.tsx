import React, { useContext, useState, useEffect, useRef, useMemo } from 'react'
import DPContext, { DPContextData } from '../context'
import moment from 'moment'
import useCalenderData, { CalendarColInfo, CalenderSelectedRange } from '../hooks/useCalenderData'
import { clone as cloneDeep } from '@hi-ui/object-utils'
import { getFullTime } from '../utils'
import { CSSTransition } from 'react-transition-group'
import { CalendarViewEnum, FormatCalendarItem } from '../types'
import { cx } from '@hi-ui/classname'

const Calendar = ({
  view = 'date',
  originDate,
  onPick,
  range,
  mouseMove,
  // panelPosition,
  renderDate,
  disabledDate,
}: {
  view: CalendarViewEnum
  originDate: moment.Moment | null
  onPick: (date: moment.Moment) => void
  range?: CalenderSelectedRange
  mouseMove?: (date: moment.Moment) => void
  renderDate: moment.Moment | null
  disabledDate: DPContextData['disabledDate']
}) => {
  const {
    weekOffset,
    i18n,
    type,
    min,
    max,
    altCalendar,
    altCalendarPreset,
    dateMarkRender,
    dateMarkPreset,
    altCalendarPresetData,
    dateMarkPresetData,
    prefixCls,
  } = useContext(DPContext)

  // const largeCell = !!(altCalendar || altCalendarPreset || dateMarkRender || dateMarkPreset)

  // 是否处于周模式，选择器需要特殊处理(只有日期选择面板才有周模式)
  const isInWeekMode = useMemo(() => type.toLowerCase().includes('week') && view === 'date', [
    type,
    view,
  ])

  const [holidayFullName, setHolidayFullName] = useState('')
  const [holidayFullNameShow, setHolidayFullNameShow] = useState(false)
  const holidayTime = useRef<number>()
  const [rows] = useCalenderData({
    type,
    view,
    renderDate,
    originDate,
    i18n,
    weekOffset,
    range,
    min,
    max,
    // panelPosition,
    disabledDate,
  })

  const [calendarCls, setCalenderCls] = useState(`${prefixCls}__calendar`)

  const getTDClass = (td: CalendarColInfo, isLarge: boolean) => {
    const _class = [`${prefixCls}__cell`]
    if (isLarge) {
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
    isInWeekMode && _class.push(`${prefixCls}__cell--week-mode-select`)

    return _class.join(' ')
  }

  useEffect(() => {
    setCalenderCls(cx(`${prefixCls}__calendar`, `${prefixCls}__calendar--${view}`))
  }, [prefixCls, view])

  const getWeeks = () => {
    const week: string[] = i18n.get('datePicker.week') as any
    // 根据偏移做数组移位，展示顶部星期文案
    return week.slice(weekOffset).concat(week.slice(0, weekOffset))
  }

  const onTableClick = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
    const td = e.target as HTMLTableElement
    const value = td.getAttribute('value') as string
    const isBelongFullOurOfRange = td.getAttribute('belong-full-out-of-range') === 'true'

    if (!['SPAN', 'DIV'].includes(td.nodeName) || td.getAttribute('type') === 'disabled') {
      return false
    }
    const clickVal = parseInt(value)
    const _date = moment(renderDate) as any
    const cellType = td.getAttribute('type')
    const cellWeekType = td.getAttribute('weektype')

    if (type !== 'weekrange' || isBelongFullOurOfRange) {
      if (cellType === 'prev' || cellWeekType === 'prev') {
        _date.subtract(1, 'months')
      }
      if (cellType === 'next' || cellWeekType === 'next') {
        _date.add(1, 'months')
      }
      _date[view](clickVal)
    } else {
      // 点击的上个月的部分，鼠标还在本月的panel上，则视作，鼠标正在本月第一天
      if (cellType === 'prev') {
        _date.set('date', 1)
      }
      // 点击的下个月的部分，鼠标还在本月的panel上，则视作，鼠标正在本月最后一天
      else if (cellType === 'next') {
        _date.set('date', _date.endOf('month').date())
      } else {
        _date[view](clickVal)
      }
    }

    onPick(_date)
  }

  const onTableMouseMove = (e: React.MouseEvent<HTMLTableElement, MouseEvent>) => {
    const ele = e.target as HTMLTableElement
    const panelDate = cloneDeep(renderDate)!
    if (type.includes('range')) {
      const val = ele.getAttribute('value')
      const cellType = ele.getAttribute('type')
      const isBelongFullOurOfRange = ele.getAttribute('belong-full-out-of-range') === 'true'

      // 不要在此处之前转化为数字操作，这样会使 !val 失去作用，1月 val = 0
      if (!val || (ele as any).disabled || !range?.selecting || cellType === 'disabled') {
        return false
      }
      if (range?.end && Number(val) === (range.end as any)[view]() * 1) {
        return false
      }

      if (type !== 'weekrange' || isBelongFullOurOfRange) {
        ;(panelDate as any)[view](val)
        if (cellType === 'prev') {
          panelDate.subtract(1, 'month')
        }
        if (cellType === 'next') {
          panelDate.add(1, 'months')
        }
      }
      // 周范围选择器特殊处理
      else {
        // 点击的上个月的部分，鼠标还在本月的panel上，则视作，鼠标正在本月第一天
        if (cellType === 'prev') {
          panelDate.set('date', 1)
        }
        // 点击的下个月的部分，鼠标还在本月的panel上，则视作，鼠标正在本月最后一天
        else if (cellType === 'next') {
          panelDate.set('date', panelDate.endOf('month').date())
        } else {
          ;(panelDate as any)[view](val)
        }
      }

      mouseMove && mouseMove(panelDate)
    }
  }

  const isLarge = useMemo(() => {
    const isNeedMorePlace = altCalendar || altCalendarPreset || dateMarkRender || dateMarkPreset
    // V4新增逻辑：月选择、年选择，保持原样，无需增大
    const isSelectDate =
      !type.toLowerCase().includes('year') && !type.toLowerCase().includes('month')
    // 只有 date 才需要大格子展示
    return !!(isNeedMorePlace && isSelectDate && view === 'date')
  }, [altCalendar, altCalendarPreset, dateMarkRender, dateMarkPreset, type, view])

  const showHolidayDetail = (fullTimeInfo: FormatCalendarItem) => {
    clearTimeout(holidayTime.current)
    setHolidayFullName(fullTimeInfo.FullText || String(fullTimeInfo.text))
    setHolidayFullNameShow(true)
    holidayTime.current = setTimeout(() => {
      setHolidayFullNameShow(false)
    }, 2000) as any
  }
  const renderAltCalendar = (cell: CalendarColInfo, isBelongFullOutOfRange: string) => {
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
          {fullTimeInfo.nodeMark && (
            <div
              className={`${prefixCls}__node-mark`}
              // @ts-ignore
              value={cell.value}
              type={cell.type}
              weektype={cell.weekType}
              // @ts-ignore
              belong-full-out-of-range={isBelongFullOutOfRange}
            >
              {fullTimeInfo.nodeMark}
            </div>
          )}
          {fullTimeInfo.text || fullTimeInfo.name ? (
            <span
              onMouseEnter={() => {
                altCalendarPreset === 'id-ID' && showHolidayDetail(fullTimeInfo)
              }}
              // @ts-ignore
              value={cell.value}
              type={cell.type}
              weektype={cell.weekType}
              // @ts-ignore
              belong-full-out-of-range={isBelongFullOutOfRange}
              className={`${prefixCls}__lunar ${
                fullTimeInfo.highlight ? `${prefixCls}__lunar--highlight` : ''
              }`}
            >
              {/* 如果是节气，使用 fullTimeInfo.name */}
              {fullTimeInfo.name || fullTimeInfo.text}
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
      className={cx(
        `${prefixCls}__calendar-wrap`,
        `${prefixCls}__calendar-wrap--${isLarge ? 'lg' : 'md'}`
      )}
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
            const isBelongFullOutOfRange = String(
              row.every((item) => item.type === 'prev' || item.type === 'next')
            )
            return (
              <tr
                key={index}
                className={cx(`${prefixCls}__row`, {
                  [`${prefixCls}__row--has-selected`]: row.some((item) => item.type === 'selected'),
                  [`${prefixCls}__row--has-start`]: row.some((item) => item.rangeStart),
                  [`${prefixCls}__row--has-end`]: row.some((item) => item.rangeEnd),
                  [`${prefixCls}__row--week-mode-select`]: isInWeekMode,
                  [`${prefixCls}__row--range-mode`]: range,
                  [`${prefixCls}__row--large`]: isLarge,
                })}
              >
                {row.map((cell, _index) => {
                  return (
                    <td
                      key={_index}
                      // @ts-ignore
                      value={cell.value}
                      type={cell.type}
                      weektype={cell.weekType}
                      // 完全超出范围之外，所在的那一行，全部都在当前月之外
                      // @ts-ignore
                      belong-full-out-of-range={isBelongFullOutOfRange}
                      // className='hi-datepicker__cell'
                      className={getTDClass(cell, isLarge)}
                    >
                      {isInWeekMode && <div className={`${prefixCls}__cell-week-indicator`} />}
                      <div
                        className={`${prefixCls}__cell-text`}
                        // @ts-ignore
                        value={cell.value}
                        type={cell.type}
                        weektype={cell.weekType}
                        // 完全超出范围之外，所在的那一行，全部都在当前月之外
                        // @ts-ignore
                        belong-full-out-of-range={isBelongFullOutOfRange}
                      >
                        <span
                          // @ts-ignore
                          value={cell.value}
                          type={cell.type}
                          weektype={cell.weekType}
                          className={`${prefixCls}__cellnum`}
                          // 完全超出范围之外，所在的那一行，全部都在当前月之外
                          // @ts-ignore
                          belong-full-out-of-range={isBelongFullOutOfRange}
                        >
                          {parseInt(String(cell.text || cell.value)) < 10
                            ? '0' + (cell.text || cell.value)
                            : cell.text || cell.value}
                        </span>
                        {renderAltCalendar(cell, isBelongFullOutOfRange)}
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
