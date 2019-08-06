import React, {Component} from 'react'
import {deconstructDate, getYearWeek} from './util'
import Provider from '../context'

import {
  getDaysInMonth,
  subMonths,
  getDay,
  startOfMonth,
  isWithinRange,
  isSameDay,
  compareAsc,
  addMonths,
  isToday,
  getYear,
  parse
} from './dateUtil'
import {DAY_MILLISECONDS} from './constants'
class Calender extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rows: [[], [], [], [], [], []]
    }
    this.weekNum = 0
  }
  _getTime (week, y, m) {
    const r = new Date(y, m - 1, 1)
    const t = r.getTime() - week * DAY_MILLISECONDS
    return t
  }

  getRows () {
    let {type, range, date, minDate, maxDate, weekOffset} = this.props
    let _date = date
    let {year, month, week} = deconstructDate(_date, weekOffset)
    let {endDate, startDate} = range || {startDate: null, endDate: null}
    // *  dayCount: 当月天数
    // *  lastMonthDayCount: 上月总天数
    // *  firstDayWeek: 当月第一天是周几
    let firstDayWeek = getDay(startOfMonth(_date)) - weekOffset
    if (firstDayWeek <= 0) { // 如果为0 代表该月第一天是周日，在日历上需要第二行开始显示
      firstDayWeek = 7
    }
    const startTimeByCurrentPanel = this._getTime(firstDayWeek, year, month)// 当前日期面板中第一个日期的具体毫秒数(指向上一个月)
    const dayCount = getDaysInMonth(_date)

    let lastMonthDayCount = getDaysInMonth(subMonths(_date, 1)) // 上月总天数
    const {rows} = this.state
    let count = 0
    for (let i = 0; i < 6; i++) {
      let row = rows[i]
      for (let j = 0; j < 7; j++) {
        let col = row[j] || (row[j] = {type: 'normal', range: false, rangeStart: false, rangeEnd: false})
        col.type = 'normal'
        const currentTime = startTimeByCurrentPanel + DAY_MILLISECONDS * (i * 7 + j) // 当前日期的毫秒数
        if (i === 0) { // 处理第一行的日期数据
          if (j >= firstDayWeek) { // 本月
            col.value = ++count
          } else { // 上月
            col.value = lastMonthDayCount - firstDayWeek + j + 1
            col.type = 'prev'
          }
        } else {
          ++count
          if (count <= dayCount) { // 本月
            col.value = count
          } else { // 下月
            col.value = count - dayCount
            col.type = 'next'
          }
        }
        // if (range && (isSameDay(range.startDate, currentTime) || isSameDay(range.endDate, currentTime))) {
        //   col.type = 'current'
        // }

        if (isToday(currentTime) && (col.type !== 'next' && col.type !== 'prev')) {
          col.type = 'today'
        }
        if (isSameDay(_date, currentTime) && !range && type !== 'week') {
          col.type = 'current'
        }
        if (type === 'daterange' || type === 'weekrange') {
          col.rangeStart = startDate && isSameDay(currentTime, startDate)
          col.rangeEnd = endDate && isSameDay(currentTime, endDate)
          const _ds = [startDate, endDate].sort(compareAsc)
          col.range = endDate && isWithinRange(currentTime, ..._ds)
          row.weekNum = getYearWeek(new Date(currentTime), weekOffset).weekNum
        }
        col.disabled = (minDate && compareAsc(currentTime, parse(minDate).setHours(0, 0, 0, 0)) === -1) || (maxDate && compareAsc(currentTime, parse(maxDate).setHours(0, 0, 0, 0)) === 1)
      }
      if (type === 'week') {
        let _month = month
        let _year = year
        if (row[1].type === 'prev') {
          _month -= 1
          if (_month <= 0) {
            _year -= 1
            _month = 12
          }
        }
        if (row[1].type === 'next') {
          _month += 1
          if (_month >= 12) {
            _year += 1
            _month = 1
          }
        }
        const cw = getYearWeek(new Date(_year, _month - 1, row[1].value), weekOffset).weekNum
        let bol = cw === week
        row.forEach(col => {
          col.range = bol
        })
        row[0].rangeStart = bol
        row[6].rangeEnd = bol
        row.currentWeek = bol
        row.weekNum = cw
      }
    }
    return rows
  }
  _getClassName (ele) {
    if (!ele) return
    if (ele.nodeName !== 'TD') {
      return this._getClassName(ele.parentNode)
    } else {
      return ele.className
    }
  }
  handlerClick (e) {
    const {onPick, date, type, range} = this.props

    let { year, month, day, hours, minutes, seconds } = deconstructDate(date)

    const td = e.target
    const cls = this._getClassName(td)
    const value = td.getAttribute('value')
    if ((td.nodeName !== 'SPAN' && td.nodeName !== 'TD' && td.nodeName !== 'DIV') || td.disabled) return false
    if (cls.indexOf('disabled') !== -1) return false
    const clickVal = parseInt(value)
    let newDate = new Date(year, month - 1, day, hours, minutes, seconds)
    if (type === 'year') {
      year = parseInt(value)
      newDate.setFullYear(year)
    } else if (type === 'month') {
      month = parseInt(value)
      newDate.setMonth(month - 1)
    } else {
      newDate.setDate(clickVal)
    }
    if (cls.indexOf('prev') !== -1) {
      newDate = addMonths(newDate, -1)
    }
    if (cls.indexOf('next') !== -1) {
      newDate = addMonths(newDate, 1)
    }
    if (type === 'daterange' || type === 'weekrange') {
      if (range.selecting) {
        if (range.startDate > newDate) {
          range.selecting = false
          onPick(newDate, range.startDate)
        } else {
          range.selecting = false
          onPick(range.startDate, newDate)
        }
      } else {
        range.selecting = true
        onPick(newDate, null)
      }
    } else {
      onPick(newDate)
    }
  }
  handlerMouseMove (e) {
    let td = e.target
    const {mouseMove, date, type, range} = this.props
    let {year, month} = deconstructDate(date)
    if (td.nodeName !== 'SPAN' || td.disabled || type.indexOf('range') === -1 || !range.selecting) return false
    td = td.parentNode.parentNode
    const day = parseInt(td.innerText)
    const cls = td.className
    let newDate = new Date(year, month - 1, day)
    if (cls.indexOf('prev') !== -1) {
      newDate = addMonths(newDate, -1)
    }
    if (cls.indexOf('next') !== -1) {
      newDate = addMonths(newDate, 1)
    }
    mouseMove(newDate)
  }
  getTDClass (td) {
    const { type: layerType, date } = this.props
    let _class = ['hi-datepicker__cell']
    if (td.disabled) {
      _class.push('disabled')
      return _class.join(' ')
    }
    const nDate = getYear(new Date())
    const propDate = getYear(date)
    const isAddToday = nDate === propDate
    switch (td.type) {
      case 'normal':
        _class.push('normal')
        break
      case 'today':
        layerType !== 'week' && _class.push('today')
        layerType === 'month' && !isAddToday && _class.pop()
        break
      case 'current':
        _class.push('current')
        break
      default:
        _class.push(td.type)
        break
    }
    (td.range && _class.push('in-range'))
    if (td.rangeStart || td.rangeEnd) {
      _class.push('range-se')
    }
    return _class.join(' ')
  }
  getWeeks () {
    const {weekOffset, localeDatas} = this.props
    const week = localeDatas.datePicker.week

    return week.slice(weekOffset).concat(week.slice(0, weekOffset))
  }

  TRMouseOver (num) {
    const {type} = this.props
    if ((type === 'week' || type === 'weekrange') && this.weekNum !== num) {
      this.weekNum = num
    }
  }
  render () {
    const {type, data} = this.props
    const rows = data || this.getRows()
    return (
      <table
        className='hi-datepicker__calender'
        onClick={this.handlerClick.bind(this)}
        onMouseMove={this.handlerMouseMove.bind(this)}
      >
        {
          (type.indexOf('date') !== -1 || type.indexOf('week') !== -1 || type.indexOf('timeperiod') !== -1) && (
            <thead>
              <tr>
                {
                  this.getWeeks().map((item, index) => {
                    return <th key={index}>{item}</th>
                  })
                }
              </tr>
            </thead>
          )
        }
        <tbody>
          {
            rows.map((row, index) => {
              return (
                <tr
                  key={index}
                  className={`hi-datepicker__row ${row.currentWeek ? 'hi-datepicker__row--current-week' : ''}`}
                  onMouseEnter={this.TRMouseOver.bind(this, row.weekNum)}
                >
                  {
                    row.map((cell, _index) => {
                      return (
                        <td
                          key={_index}
                          value={cell.value}
                          className={this.getTDClass(cell)}
                        >
                          <div className='hi-datepicker__content' value={cell.value}>
                            <span value={cell.value} className='hi-datepicker__text'>
                              {cell.text || cell.value}
                            </span>
                          </div>
                        </td>
                      )
                    })
                  }
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}

Calender.defaultProps = {
  weekOffset: 0
}
export default Provider(Calender)
