import React, {Component} from 'react'
import {deconstructDate, nextMonth, colDisabled} from './util'
import Calender from './Calender'
import Icon from '../icon'
import classNames from 'classnames'
import {startOfWeek, endOfWeek, isSameMonth, isValid, getStartDate, toDate, changeYear, changeMonth} from './dateUtil'

const _parseProps = (date) => {
  const {startDate, endDate} = date
  let leftDate = getStartDate(date)
  let rightDate = isValid(endDate) ? endDate : nextMonth(leftDate)
  if (endDate) {
    if (isSameMonth(startDate, endDate)) {
      rightDate = nextMonth(leftDate)
    }
  }
  return {
    range: {
      startDate,
      endDate,
      selecting: false
    },
    leftDate,
    rightDate
  }
}
export default class WeekRangePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ..._parseProps(props.date),
      layout: {
        left: 'date',
        right: 'date'
      }
    }
  }

  /**
   * Header 中间部分内容
   * @param {String} type 选择器类型
   * @param {Number} year 当前年份
   * @param {Number} month 当前月份
   */
  getHeaderCenterContent (year, month, flag) {
    const { localeDatas, locale } = this.props
    const { layout } = this.state
    if (layout[flag] === 'year') {
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
  getYearOrMonthData (val, type, _year) {
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
        col = colDisabled(type, col, _year, this.props, y)
        col.value = y
        num++
      }
    }
    return trs
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
        <div className='hi-datepicker__header-btns'>
          <span onClick={() => this.changeYear(true, lr)} ><Icon name='double-left' /></span>
          <span onClick={() => this.changeMonth(true, lr)} ><Icon name='left' /></span>
        </div>
        <span
          className='hi-datepicker__header-text'
          onClick={() => {
            const layout = Object.assign({}, this.state.layout, {[lr]: 'year'})
            this.setState({ layout })
          }}>
          {this.getHeaderCenterContent(year, month, lr)}
        </span>
        <div className='hi-datepicker__header-btns'>
          <span onClick={() => this.changeMonth(false, lr)} ><Icon name='right' /></span>
          <span onClick={() => this.changeYear(false, lr)} ><Icon name='double-right' /></span>
        </div>
      </div>
    )
  }
  /**
   * 改变月份事件
   * @param {Number} num  加减值
   */
  changeMonth (flag, pos) {
    let {leftDate, rightDate} = this.state
    let nLeftDate = toDate(leftDate)
    let nRightDate = toDate(rightDate)
    if (pos === 'left') {
      nLeftDate = changeMonth(leftDate, flag)
    } else {
      nRightDate = changeMonth(rightDate, flag)
    }
    if (nLeftDate < nRightDate) {
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
    let nLeftDate = toDate(leftDate)
    let nRightDate = toDate(rightDate)
    if (pos === 'left') {
      nLeftDate = changeYear(leftDate, flag)
    } else {
      nRightDate = changeYear(rightDate, flag)
    }
    if (nLeftDate < nRightDate) {
      this.setState({
        leftDate: nLeftDate,
        rightDate: nRightDate
      })
    }
  }
  pick (startDate, endDate) {
    const {range} = this.state
    const {onPick} = this.props
    range.startDate = startDate
    range.endDate = endDate
    this.setState({
      range,
      leftDate: startDate || this.state.leftDate,
      rightDate: endDate || this.state.rightDate
    })
    if (endDate) {
      onPick({
        startDate: startOfWeek(range.startDate),
        endDate: endOfWeek(range.endDate)
      })
    }
  }
  onMouseMoveHandler (date) {
    const {range} = this.state
    range.endDate = date
    this.setState({
      range
    })
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
    let { range, layout } = this.state
    const { altCalendar, altCalendarPreset, dateMarkRender, dateMarkPreset, altCalendarPresetData, dateMarkPresetData, max: maxDate, min: minDate, weekOffset } = this.props

    let component = null
    const { year, month } = deconstructDate(date)
    switch (layout[flag]) {
      case 'year':
        const yearData = this.getYearOrMonthData(year, 'year')
        component = (
          <Calender
            altCalendarPresetData={altCalendarPresetData}
            dateMarkPresetData={dateMarkPresetData}
            altCalendar={altCalendar}
            altCalendarPreset={altCalendarPreset}
            dateMarkRender={dateMarkRender}
            dateMarkPreset={dateMarkPreset}
            date={date}
            weekOffset={weekOffset}
            data={yearData}
            type={layout[flag]}
            onPick={this.yearPick.bind(this, flag)}
          />
        )
        break
      case 'month':
        const monthData = this.getYearOrMonthData(month, 'month', year)
        component = (
          <Calender
            altCalendarPresetData={altCalendarPresetData}
            dateMarkPresetData={dateMarkPresetData}
            altCalendar={altCalendar}
            weekOffset={weekOffset}
            altCalendarPreset={altCalendarPreset}
            dateMarkRender={dateMarkRender}
            dateMarkPreset={dateMarkPreset}
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
            type='weekrange'
            weekOffset={weekOffset}
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
    const { leftDate, rightDate, layout } = this.state
    const {type, theme} = this.props
    const _c = classNames(
      'hi-datepicker',
      theme && 'theme__' + theme
    )
    return (
      <div
        style={this.props.style}
        className={_c}
      >
        <div className='hi-datepicker__body  hi-datepicker__body--range'>
          <div className='hi-datepicker__panel hi-datepicker__panel--left'>
            {this.renderHeader(type, leftDate, 'left')}
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${layout['left']}`}>
              {this._getNormalComponent(leftDate, 'left')}
            </div>
          </div>
          <div className='hi-datepicker__panel hi-datepicker__panel--right'>
            {this.renderHeader(type, rightDate, 'right')}
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${layout['right']}`}>
              {this._getNormalComponent(rightDate, 'right')}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
