import React, {Component} from 'react'
import {deconstructDate, getYearWeek, calcDayCount, calcDayWeek, clearHours} from './util'
import {WEEK_DATA, DAY_MILLISECONDS} from './constants'
class Calender extends Component {
  constructor (props) {
    super(props)
    this.state = {
      range: this.props.range,
      activeRange: false,
      rows: [[], [], [], [], [], []]
    }
  }
  static defaultProps = {
    weekOffset: 0
  }
  _getTime (week, y, m) {
    const r = new Date(y, m - 1, 1)
    const t = r.getTime() - week * DAY_MILLISECONDS
    return t
  }

  getRows () {
    let {type, range, date, minDate, maxDate, weekOffset} = this.props
    let _date = new Date(new Date(date).getTime())
    minDate && clearHours(minDate)
    maxDate && clearHours(maxDate)
    let {year, month, week} = deconstructDate(_date)
    let {endDate, startDate} = range || {startDate: null, endDate: null}
    // *  dayCount: 当月天数
    // *  lastMonthDayCount: 上月总天数
    // *  firstDayWeek: 当月第一天是周几
    let firstDayWeek = calcDayWeek(year, month, 1) - weekOffset
    if (firstDayWeek <= 0) { // 如果为0 代表该月第一天是周日，在日历上需要第二行开始显示
      firstDayWeek = 7 - weekOffset
    }
    const _time = this._getTime(firstDayWeek, year, month)// 当前日期面板中第一个日期的具体毫秒数(指向上一个月)
    const dayCount = calcDayCount(year, month)
    let lastMonthDayCount = calcDayCount(year, month - 1) // 上月总天数
    const {rows} = this.state
    let count = 0
    const now = _date.setHours(0, 0, 0, 0) // 今天
    for (let i = 0; i < 6; i++) {
      let row = rows[i]
      for (let j = 0; j < 7; j++) {
        let col = row[j] || (row[j] = {type: 'normal', range: false, rangeStart: false, rangeEnd: false})
        col.type = 'normal'
        const time = _time + DAY_MILLISECONDS * (i * 7 + j) // 当前日期的毫秒数
        if (i === 0) { // 处理第一行的日期数据
          if (j >= firstDayWeek) { // 本月
            col.text = ++count
            col.value = count
          } else { // 上月
            col.text = lastMonthDayCount - firstDayWeek + j + 1
            col.value = lastMonthDayCount - firstDayWeek + j + 1
            col.type = 'prev'
          }
        } else {
          count++
          if (count <= dayCount) { // 本月
            col.text = count
            col.value = count
          } else { // 下月
            col.text = count - dayCount
            col.value = count - dayCount
            col.type = 'next'
          }
        }
        if (new Date(time).setHours(0, 0, 0, 0) === now && type.indexOf('range') === -1) {
          col.type = 'today'
        }
        if (type === 'daterange' || type === 'weekrange') {
          col.rangeStart = startDate && time === clearHours(startDate)
          col.rangeEnd = endDate && time === clearHours(endDate)
          col.range = time > startDate && endDate && time < clearHours(endDate)
          // col.range = time >= startDate && endDate && time <= clearHours(endDate) && col.type !== 'prev' && col.type !== 'next'
        }
        col.disabled = (minDate && new Date(time) < minDate) || (maxDate && new Date(time) > maxDate)
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
        const cw = getYearWeek(new Date(_year, _month - 1, row[1].text))
        let bol = cw === week
        row[0].range = bol
        row[0].rangeStart = bol
        row[6].range = bol
        row[6].rangeEnd = bol
        row.currentWeek = bol
      }
    }
    return rows
  }
  _getClassName (ele) {
    if (ele.nodeName !== 'TD') {
      return this._getClassName(ele.parentNode)
    } else {
      return ele.className
    }
  }
  handlerClick (e) {
    const {onPick, date, type, range} = this.props
    let {year, month, hours, minutes, seconds} = deconstructDate(date)
    const td = e.target
    const cls = this._getClassName(td)
    const value = td.getAttribute('value')
    if ((td.nodeName !== 'A' && td.nodeName !== 'TD' && td.nodeName !== 'DIV') || td.disabled) return false
    if (cls.indexOf('disabled') !== -1) return false
    if (cls.indexOf('prev') !== -1) {
      month -= 1
      if (month <= 0) {
        year -= 1
        month = 12
      }
    }
    if (cls.indexOf('next') !== -1) {
      month += 1
      if (month >= 12) {
        year += 1
        month = 1
      }
    }
    const day = parseInt(value)
    let newDate = new Date(year, month - 1, day)
    newDate.setHours(hours, minutes, seconds)
    if (type === 'year') {
      year = parseInt(value)
      newDate.setFullYear(year)
    }
    if (type === 'month') {
      month = parseInt(value)
      newDate.setMonth(month - 1)
    }
    if (type === 'daterange' || type === 'weekrange') {
      if (range.selecting) {
        if (range.startDate > newDate) {
          range.selecting = true
          onPick(newDate, null)
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
    if (td.nodeName !== 'A' || td.disabled || type.indexOf('range') === -1 || !range.selecting) return false
    td = td.parentNode.parentNode
    const day = parseInt(td.innerText)
    const cls = td.className
    if (cls.indexOf('prev') !== -1) {
      month -= 1
      if (month <= 0) {
        year -= 1
        month = 12
      }
    }
    if (cls.indexOf('next') !== -1) {
      month += 1
      if (month >= 12) {
        year += 1
        month = 1
      }
    }
    let newDate = new Date(year, month - 1, day)
    mouseMove(newDate)
  }
  getTDClass (td) {
    let _class = ['hi-datepicker__cell']
    if (td.disabled) {
      _class.push('disabled')
      return _class.join(' ')
    }
    switch (td.type) {
      case 'normal':
        _class.push('normal')
        break
      case 'today':
        this.props.type !== 'week' && _class.push('today')
        break
      default:
        _class.push(td.type)
        break
    }
    if (td.range) {
      _class.push('in-range')
    }
    if (td.rangeStart || td.rangeEnd) {
      _class.push('week-highlight range-start')
    }
    return _class.join(' ')
  }
  getWeeks () {
    const {weekOffset} = this.props
    return WEEK_DATA.slice(weekOffset).concat(WEEK_DATA.slice(0, weekOffset))
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
          (type.indexOf('date') !== -1 || type.indexOf('week') !== -1) && (
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
                            <a value={cell.value} className='hi-datepicker__text'>
                              {cell.text}
                            </a>
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
export default Calender
