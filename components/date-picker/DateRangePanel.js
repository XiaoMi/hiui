import React, {Component} from 'react'
import Calender from './Calender'
import {deconstructDate, nextMonth} from './util'
import {DAY_MILLISECONDS} from './constants'
import Icon from '../icon'
import classNames from 'classnames'
import Provider from '../context'
import { dateFormat, isValid, getStartDate } from './dateUtil'
import TimeRangePanel from './TimeRangePanel'

class DateRangePanel extends Component {
  constructor (props) {
    super(props)
    let {startDate, endDate} = props.date
    let leftDate = getStartDate(props.date)
    let rightDate = isValid(endDate) ? endDate : nextMonth(leftDate)
    if (endDate) {
      const {year: sYear, month: sMonth} = deconstructDate(leftDate)
      const {year: eYear, month: eMonth} = deconstructDate(rightDate)
      if (sYear === eYear && sMonth === eMonth) {
        rightDate = nextMonth(leftDate)
      }
    }
    const range = {
      startDate,
      endDate,
      selecting: false
    }
    this.maskRef = React.createRef()
    this.state = {
      date: leftDate,
      currentView: props.type || 'date',
      layout: {
        left: 'date',
        right: 'date'
      },
      yearData: null,
      monthData: null,
      minDate: props.min,
      maxDate: props.max,
      range,
      leftDate,
      rightDate,
      showMask: false,
      disableArrow: {
        month: false,
        year: false
      }
    }
  }
  /**
   * 改变月份事件
   * @param {Number} num  加减值
   */
  changeMonth (flag, pos) {
    let {leftDate, rightDate} = this.state
    let nLeftDate = new Date(leftDate.getTime())
    let nRightDate = new Date(rightDate.getTime())
    let left = deconstructDate(nLeftDate)
    let right = deconstructDate(nRightDate)
    if (pos === 'left') {
      if (flag) {
        left.month -= 1
        if (left.month < 0) {
          left.month = 12
          left.year -= 1
        }
      } else {
        left.month += 1
        if (left.month > 12) {
          left.month = 1
          left.year += 1
        }
      }
      nLeftDate.setFullYear(left.year)
      nLeftDate.setMonth(left.month - 1)
    } else {
      if (flag) {
        right.month -= 1
        if (right.month < 0) {
          right.month = 12
          right.year -= 1
        }
      } else {
        right.month += 1
        if (right.month > 12) {
          right.month = 1
          right.year += 1
        }
      }
      if (left.month === right.month - 1) {
        this.setState({
          disableArrow: {
            month: false
          }
        })
      }
      nRightDate.setFullYear(right.year)
      nRightDate.setMonth(right.month - 1)
    }
    if (nLeftDate <= nRightDate) {
      this.setState({
        leftDate: nLeftDate,
        rightDate: nRightDate
      })
    }
  }
  /**
   * 改变年份事件
   * @param {Number} num  加减值
   */
  changeYear (flag, pos) {
    let {leftDate, rightDate} = this.state
    let nLeftDate = new Date(leftDate.getTime())
    let nRightDate = new Date(rightDate.getTime())
    let left = deconstructDate(nLeftDate)
    let right = deconstructDate(nRightDate)
    if (pos === 'left') {
      if (flag) {
        left.year -= 1
      } else {
        left.year += 1
      }
      nLeftDate.setFullYear(left.year)
      // this.setState({
      //   leftDate
      // })
    } else {
      if (flag) {
        right.year -= 1
      } else {
        right.year += 1
      }
      nRightDate.setFullYear(right.year)
      // this.setState({
      //   rightDate
      // })
    }
    if (nLeftDate <= nRightDate) {
      this.setState({
        leftDate: nLeftDate,
        rightDate: nRightDate
      })
    }
  }
  /**
   * Header 中间部分内容
   * @param {String} type 选择器类型
   * @param {Number} year 当前年份
   * @param {Number} month 当前月份
   */
  getHeaderCenterContent (year, month) {
    const { localeDatas, locale } = this.props
    const {currentView} = this.state
    if (currentView === 'year') {
      return (year - 4) + '~' + (year + 7)
    }
    let arr = [localeDatas.datePicker.monthShort[month - 1]]
    if (locale === 'zh-CN') {
      arr.unshift(year + '年    ')
    } else {
      arr.push(`    ${year}`)
    }
    return arr
  }
  /**
   * 渲染 Header 部分（包含箭头快捷操作）
   * @param {Object} args {
   *  year: 当前年份
   *  month: 当前月份
   *  type: 选择器类型
   *  num: 点击箭头时要步进的值 默认1 主要应用于年份选择时
   * }
   */
  renderHeader (type, value, lr) {
    const {year, month} = deconstructDate(value)

    return (
      <div className='hi-datepicker__header'>
        {
          <div className='hi-datepicker__header-btns'>
            <span onClick={() => this.changeYear(true, lr)} ><Icon name='double-left' /></span>
            {
              type.indexOf('date') !== -1 && <span onClick={() => this.changeMonth(true, lr)} ><Icon name='left' /></span>
            }
          </div>
        }
        <span
          className='hi-datepicker__header-text'
          onClick={() => {
            const layout = Object.assign({}, this.state.layout, {[lr]: 'year'})
            this.setState({ layout })
          }}
        >
          {this.getHeaderCenterContent(year, month)}
        </span>
        {
          <div className='hi-datepicker__header-btns'>
            {
              type.indexOf('date') !== -1 && <span onClick={() => this.changeMonth(false, lr)} ><Icon name='right' /></span>
            }
            <span onClick={() => this.changeYear(false, lr)} ><Icon name='double-right' /></span>
          </div>
        }
      </div>
    )
  }
  pick (startDate, endDate) {
    const {range} = this.state
    const {onPick, showTime} = this.props
    range.startDate = startDate
    range.endDate = endDate
    this.setState({
      range
    })
    if (endDate) {
      onPick(range, showTime)
    }
  }
  onMouseMoveHandler (date) {
    const {range} = this.state
    range.endDate = date
    this.setState({
      range
    })
  }
  shortcutsClickEvent (e) {
    const { localeDatas } = this.props
    const {range} = this.state
    const _date = new Date()
    const val = e.target.innerText
    let days = 0
    switch (val) {
      case localeDatas.datePicker.lastWeek:
        days = 7
        break
      case localeDatas.datePicker.lastMonth:
        days = 30
        break
      case localeDatas.datePicker.lastThreeMonth:
        days = 90
        break
      case localeDatas.datePicker.lastYear:
        days = 365
        break
    }
    const nDate = new Date(_date.getTime() - days * DAY_MILLISECONDS)
    range.startDate = nDate
    range.endDate = _date
    this.props.onPick(range)
  }
  renderShortcut (shortcuts) {
    return (
      <div className='hi-datepicker__shortcuts'>
        {
          shortcuts.map((m, n) => {
            return (
              <p
                key={n}
                onClick={this.shortcutsClickEvent.bind(this)}
              >
                {m}
              </p>
            )
          })
        }
      </div>
    )
  }
  onTimePick (pos, date) {
    const {range} = this.state
    pos === 'leftDate' && (range.startDate = date)
    pos === 'rightDate' && (range.endDate = date)
    this.setState({
      [pos]: date
    })
  }
  timeConfirm () {
    this.props.onPick(this.state.date)
  }
  timeCancel () {

  }

  getRangeDateStr () {
    let {leftDate, rightDate, showMask} = this.state
    let { format } = this.props
    format = format.substr(format.match(/[H|h]\s*/).index)
    const cls = classNames(
      showMask && 'hi-datepicker__time-text'
    )
    return (
      <span className={cls}>
        {`${dateFormat(leftDate, format)} - ${dateFormat(rightDate, format)}`}
      </span>
    )
  }
  selectTimeEvent () {
    this.setState({
      showMask: !this.state.showMask
    })
  }
  getYearOrMonthData (val, type) {
    const start = type === 'year' ? val - 4 : 1
    let trs = [[], [], [], []]
    let num = 0
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    for (let i = 0; i < 4; i++) {
      let row = trs[i]
      for (let j = 0; j < 3; j++) {
        let col = row[j] || (row[j] = { type: 'normal' })
        const y = start + num
        if (y === currentYear || y === currentMonth + 1) {
          col.type = 'today'
        }
        if (y === val) {
          col.type = 'current'
        }
        type === 'year'
          ? (col.text = y)
          : (col.text = this.props.localeDatas.datePicker.month[y - 1])
        col.value = y
        num++
      }
    }
    return trs
  }
  yearPick (flag, date) {
    const layout = Object.assign({}, this.state.layout, {[flag]: 'month'})
    const _d = flag === 'left' ? {leftDate: date} : {rightDate: date}
    this.setState({
      ..._d,
      layout
    })
  }
  monthPick (flag, date) {
    const layout = Object.assign({}, this.state.layout, {[flag]: 'date'})
    const _d = flag === 'left' ? {leftDate: date} : {rightDate: date}
    this.setState({
      ..._d,
      layout
    })
  }
  _getNormalComponent (date, flag) {
    let { minDate, maxDate, range, layout } = this.state
    let component = null
    const { year, month } = deconstructDate(date)
    switch (layout[flag]) {
      case 'year':
        const yearData = this.getYearOrMonthData(year, 'year')
        component = (
          <Calender
            date={date}
            data={yearData}
            type={layout[flag]}
            onPick={this.yearPick.bind(this, flag)}
          />
        )
        break
      case 'month':
        const monthData = this.getYearOrMonthData(month, 'month')
        component = (
          <Calender
            date={date}
            data={monthData}
            type={layout[flag]}
            onPick={this.monthPick.bind(this, flag)}
          />
        )
        break
      default:
        component = (
          <Calender
            date={date}
            range={range}
            type={this.props.type}
            minDate={minDate}
            maxDate={maxDate}
            onPick={this.pick.bind(this)}
            mouseMove={this.onMouseMoveHandler.bind(this)}
          />
        )
        break
    }
    return component
  }
  render () {
    let { currentView, leftDate, rightDate, showMask, layout } = this.state
    const {shortcuts, theme, showTime, date} = this.props
    const _c = classNames(
      'hi-datepicker',
      theme && 'theme__' + theme
    )
    const bodyCls = classNames(
      'hi-datepicker__body',
      'hi-datepicker__body--range',
      shortcuts && 'hi-datepicker__body--shortcuts'
    )
    return (
      <div
        style={this.props.style}
        className={_c}
      >
        <div className={bodyCls}>
          {
            shortcuts && this.renderShortcut(shortcuts)
          }
          <div className='hi-datepicker__panel hi-datepicker__panel--left'>
            {
              this.renderHeader(currentView, leftDate, 'left')
            }
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${layout['left']}`}>
              {this._getNormalComponent(leftDate, 'left')}
            </div>
          </div>
          <div className='hi-datepicker__panel hi-datepicker__panel--right'>
            {
              this.renderHeader(currentView, rightDate, 'right')
            }
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${layout['right']}`}>
              {this._getNormalComponent(rightDate, 'right')}
            </div>
          </div>
        </div>
        {
          showTime && (
            <div
              className='hi-datepicker__footer'
              onClick={this.selectTimeEvent.bind(this)}
            >
              {this.getRangeDateStr()}
            </div>
          )
        }
        {
          showMask && (
            <div className='hi-datepicker__mask' ref={this.maskRef} onClick={() => { this.setState({showMask: false}) }} />
          )
        }
        {
          showMask && (
            <TimeRangePanel
              {...this.props}
              style={{
                position: 'absolute',
                top: 5,
                left: 89
              }}
              date={range}
              onPick={(d, r) => {
                this.setState({
                  range: d,
                  leftDate: d.startDate,
                  rightDate: d.endDate
                })
                this.props.onPick(d, r)
              }}
            />
          )
        }
      </div>
    )
  }
}

export default Provider(DateRangePanel)
