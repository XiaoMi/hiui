import React, { Component } from 'react'
import Calender from './Calender'
import { deconstructDate } from './util'
import TimePanel from './TimePanel'
import Icon from '../icon'
import classNames from 'classnames'
import Provider from '../context'
import TimePeriodPanel from './TimePeriodPanel'
import { dateFormat, parse, getStartDate, addMonths, subMonths, startOfWeek, endOfWeek } from './dateUtil'

class DatePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentView: props.type,
      yearData: [],
      monthData: []
    }
  }
  /**
   * 改变月份事件
   * @param {Number} num  加减值
   */
  changeMonth (flag) {
    let { date, onPick } = this.props
    let cDate = getStartDate(date)
    if (flag) {
      cDate = subMonths(cDate, 1)
    } else {
      cDate = addMonths(cDate, 1)
    }
    onPick(cDate, true)
  }

  /**
   * 改变年份事件
   * @param {Number} num  加减值
   */

  changeYear (flag) {
    let { currentView } = this.state
    let { date, onPick } = this.props
    const cDate = getStartDate(date)
    let { year } = deconstructDate(cDate)
    const num = currentView === 'year' ? 10 : 1
    if (flag) {
      year -= num
    } else {
      year += num
    }
    cDate.setFullYear(year)
    onPick(cDate, true)
  }

  renderInput () {
    return (
      <input
        type='text'
        className='dp-input'
        onClick={() => {
          this.setState({
            show: !this.state.show
          })
        }}
        value={this.state.value}
      />
    )
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
  /**
   * Header 中间部分内容
   * @param {String} type 选择器类型
   * @param {Number} year 当前年份
   * @param {Number} month 当前月份
   */
  getHeaderCenterContent () {
    const { localeDatas, locale, date } = this.props
    const { currentView } = this.state
    const { year, month } = deconstructDate(getStartDate(date))
    if (currentView === 'year') {
      return year - 4 + '~' + (year + 7)
    }
    if (currentView === 'month') {
      return year
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
  renderHeader (type) {
    return (
      <div className='hi-datepicker__header'>
        <div className='hi-datepicker__header-btns'>
          <span onClick={() => this.changeYear(true)}>
            <Icon name='double-left' />
          </span>
          {type !== 'month' &&
            type !== 'year' &&
            <span onClick={() => this.changeMonth(true)}>
              <Icon name='left' />
            </span>}
        </div>
        <span
          className='hi-datepicker__header-text'
          onClick={() => this.setState({ currentView: 'year' })}
        >
          {this.getHeaderCenterContent()}
        </span>
        <div className='hi-datepicker__header-btns'>
          {type !== 'month' &&
            type !== 'year' &&
            <span onClick={() => this.changeMonth(false)}>
              <Icon name='right' />
            </span>}
          <span onClick={() => this.changeYear(false)}>
            <Icon name='double-right' />
          </span>
        </div>
      </div>
    )
  }
  yearPick (date) {
    const { type, onPick } = this.props
    if (type === 'year') {
      onPick(date)
    } else {
      onPick(date, true)
      this.setState({
        currentView: 'month'
      })
    }
  }
  monthPick (_date) {
    const { type, onPick } = this.props
    if (type === 'month') {
      onPick(_date)
    } else {
      this.setState({
        currentView: 'date'
      })
      onPick(_date, true)
    }
  }
  onDatePick (_date) {
    const { type, showTime, onPick, timeInterval = 240, weekOffset } = this.props
    // const { hours, minutes, seconds } = deconstructDate(this.props.date)
    if (type === 'week') {
      const _weekOffset = {weekStartsOn: weekOffset}
      let weekStart = startOfWeek(_date, _weekOffset)
      let weekEnd = type === 'week' ? endOfWeek(_date, _weekOffset) : endOfWeek(_date, _weekOffset)
      onPick({
        startDate: weekStart,
        endDate: weekEnd
      }, false)
      return
    }
    if (type === 'timeperiod') {
      onPick(
        { startDate: _date, endDate: new Date(_date.getTime() + timeInterval * 60 * 1000) },
        true
      )
    } else {
      // date.setHours(hours, minutes, seconds)
      onPick(_date, showTime)
    }
  }
  onTimePeriodPick (periodS, periodE) {
    const date = getStartDate(this.props.date)
    const currentDate = dateFormat(date, 'YYYY-MM-DD')
    this.props.onPick(
      {
        startDate: parse(`${currentDate} ${periodS}`),
        endDate: parse(`${currentDate} ${periodE}`)
      },
      true
    )
  }
  onTimePick (date, bol) {
    this.setState({
      date
    })
    this.props.onPick(date, bol)
  }
  timeConfirm () {
    this.props.timeConfirm(this.state.date)
  }
  timeCancel () {}
  _getNormalComponent () {
    const { currentView } = this.state
    const { min, max, weekOffset, date } = this.props
    const validDate = getStartDate(date)
    const { year, month } = deconstructDate(validDate)
    let component = null
    switch (currentView) {
      case 'date':
      case 'timeperiod':
      case 'week':
        component = (
          <Calender
            date={validDate}
            weekOffset={weekOffset}
            minDate={min}
            maxDate={max}
            type={currentView}
            onPick={this.onDatePick.bind(this)}
          />
        )
        break
      case 'year':
        const yearData = this.getYearOrMonthData(year, 'year')
        component = (
          <Calender
            date={validDate}
            data={yearData}
            type={currentView}
            onPick={this.yearPick.bind(this)}
          />
        )
        break
      case 'month':
        const monthData = this.getYearOrMonthData(month, 'month')
        component = (
          <Calender
            date={validDate}
            data={monthData}
            type={currentView}
            onPick={this.monthPick.bind(this)}
          />
        )
        break
      default:
        component = (
          <Calender
            {...this.props}
            date={date}
            onClick={data => {
              this.changeDay(data.value)
            }}
          />
        )
        break
    }
    return component
  }
  render () {
    const { date, currentView } = this.state
    const { theme, showTime, type, timeInterval } = this.props
    const _c = classNames('hi-datepicker', theme && 'theme__' + theme)
    const bodyCls = classNames(
      'hi-datepicker__body',
      showTime && 'hi-datepicker__body--hastime',
      type === 'timeperiod' && 'hi-datepicker__body--period'
    )
    return (
      <div style={this.props.style} className={_c}>
        <div className={bodyCls}>
          <div className='hi-datepicker__panel hi-datepicker__panel--left'>
            {currentView !== 'time' && this.renderHeader(currentView, date)}
            <div
              className={`hi-datepicker__calender-container hi-datepicker__calender-container--${currentView}`}
            >
              {this._getNormalComponent()}
            </div>
          </div>
          {showTime &&
            <TimePanel
              {...this.props}
              onPick={this.onTimePick.bind(this)}
              date={getStartDate(this.props.date)}
              timeConfirm={this.timeConfirm.bind(this)}
              timeCancel={this.timeCancel.bind(this)}
            />}
          {type === 'timeperiod' &&
            <TimePeriodPanel
              timeInterval={timeInterval}
              onTimePeriodPick={this.onTimePeriodPick.bind(this)}
              date={getStartDate(this.props.date)}
            />}
        </div>
      </div>
    )
  }
}

export default Provider(DatePanel)
