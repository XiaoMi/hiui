import React, {Component} from 'react'
import Calender from './Calender'
import {deconstructDate} from './util'
import TimePanel from './TimePanel'
import Icon from '../../icon'
import classNames from 'classnames'
import Provider from '../../context'
import TimePeriodPanel from './TimePeriodPanel'
import {dateFormat, parse, addHours} from './dateUtil'

class DatePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      date: props.date,
      currentView: props.type,
      yearData: [],
      monthData: []
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      date: nextProps.date
    })
  }
  /**
   * 改变月份事件
   * @param {Number} num  加减值
   */
  changeMonth (flag) {
    let {date} = this.state
    let {year, month} = deconstructDate(date)
    if (flag) {
      month -= 1
      if (month < 0) {
        month = 12
        year -= 1
      }
    } else {
      month += 1
      if (month > 12) {
        month = 1
        year += 1
      }
    }
    date.setFullYear(year)
    date.setMonth(month - 1)
    this.setState({
      date
    })
  }
  /**
   * 改变年份事件
   * @param {Number} num  加减值
   */
  changeYear (flag) {
    let {date, currentView} = this.state
    let {year} = deconstructDate(date)
    const num = currentView === 'year' ? 10 : 1
    if (flag) {
      year -= num
    } else {
      year += num
    }
    // day = this.calcDayCount(year, month)
    date.setFullYear(year)
    this.setState({
      date
    })
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
        let col = row[j] || (row[j] = {type: 'normal'})
        const y = start + num
        if (y === currentYear || y === (currentMonth + 1)) {
          col.type = 'today'
        }
        if (y === val) {
          col.type = 'current'
        }
        type === 'year' ? col.text = y : col.text = this.props.localeDatas.datePicker.month[y - 1]
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
    const { localeDatas, locale } = this.props
    const {date, currentView} = this.state
    const {year, month} = deconstructDate(date)
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
  renderHeader (type, value) {
    return (
      <div className='hi-datepicker__header'>
        <div className='hi-datepicker__header-btns'>
          <span onClick={() => this.changeYear(true)} ><Icon name='double-left' /></span>
          {
            (type !== 'month' && type !== 'year') && <span onClick={() => this.changeMonth(true)} ><Icon name='left' /></span>
          }
        </div>
        <span className='hi-datepicker__header-text' onClick={() => this.setState({currentView: 'year'})}>
          {this.getHeaderCenterContent()}
        </span>
        <div className='hi-datepicker__header-btns'>
          {
            (type !== 'month' && type !== 'year') && <span onClick={() => this.changeMonth(false)}><Icon name='right' /></span>
          }
          <span onClick={() => this.changeYear(false)} ><Icon name='double-right' /></span>
        </div>
      </div>
    )
  }
  yearPick (date) {
    const {type, onPick} = this.props
    if (type === 'year') {
      onPick(date)
    } else {
      this.setState({
        date,
        currentView: 'month'
      })
    }
  }
  monthPick (_date) {
    const {type, onPick} = this.props
    let {date} = this.state
    if (type === 'month') {
      onPick(_date)
    } else {
      date.setFullYear(_date.getFullYear())
      date.setMonth(_date.getMonth())
      this.setState({
        date,
        currentView: 'date'
      })
    }
  }
  onDatePick (date) {
    const {type, showTime} = this.props
    const {hours, minutes, seconds} = deconstructDate(this.state.date)
    if (type === 'timeperiod') {
      this.props.onPick({startDate: date, endDate: addHours(this.state.date, 4)}, true)
    } else {
      date.setHours(hours, minutes, seconds)
      this.props.onPick(date, showTime)
    }
  }
  onTimePeriodPick (periodS, periodE) {
    const currentDate = dateFormat(this.state.date, 'YYYY-MM-DD')
    parse(`${currentDate} ${periodS}`)
    this.props.onPick({startDate: parse(`${currentDate} ${periodS}`), endDate: parse(`${currentDate} ${periodE}`)}, true)
  }
  onTimePick (date, bol) {
    this.setState({
      date
    })
    // if (showTime) {
    //   this.setState({date})
    // } else {
    //   this.props.onPick(date)
    // }
    this.props.onPick(date, bol)
  }
  timeConfirm () {
    this.props.timeConfirm(this.state.date)
  }
  timeCancel () {

  }
  _getNormalComponent () {
    const {currentView, date} = this.state
    const {minDate, maxDate, weekOffset} = this.props
    const {year, month} = deconstructDate(date)
    let component = null
    switch (currentView) {
      case 'date':
      case 'timeperiod':
      case 'week':
        component = (<Calender
          date={date}
          weekOffset={weekOffset}
          minDate={minDate}
          maxDate={maxDate}
          type={currentView}
          onPick={this.onDatePick.bind(this)}
        />)
        break
      case 'year':
        const yearData = this.getYearOrMonthData(year, 'year')
        component = (<Calender
          date={date}
          data={yearData}
          type={currentView}
          onPick={this.yearPick.bind(this)}
        />)
        break
      case 'month':
        const monthData = this.getYearOrMonthData(month, 'month')
        component = (<Calender
          date={date}
          data={monthData}
          type={currentView}
          onPick={this.monthPick.bind(this)}
        />)
        break
      default:
        component = (<Calender
          {...this.props}
          date={date}
          onClick={data => {
            this.changeDay(data.value)
          }}
        />)
        break
    }
    return component
  }

  render () {
    const {date, currentView} = this.state
    const {theme, showTime, type, timeInterval} = this.props
    const _c = classNames(
      'hi-datepicker',
      theme && 'theme__' + theme
    )
    const bodyCls = classNames(
      'hi-datepicker__body',
      showTime && 'hi-datepicker__body--hastime',
      type === 'timeperiod' && 'hi-datepicker__body--period'
    )
    return (
      <div
        style={this.props.style}
        className={_c}
      >
        <div className={bodyCls}>
          <div className='hi-datepicker__panel hi-datepicker__panel--left'>
            {currentView !== 'time' && this.renderHeader(currentView, date)}
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${currentView}`}>
              {this._getNormalComponent()}
            </div>
          </div>
          {
            showTime && <TimePanel
              {...this.props}
              onPick={this.onTimePick.bind(this)}
              // date={date}
              timeConfirm={this.timeConfirm.bind(this)}
              timeCancel={this.timeCancel.bind(this)}
            />
          }
          {
            type === 'timeperiod' && (
              <TimePeriodPanel
                timeInterval={timeInterval}
                onTimePeriodPick={this.onTimePeriodPick.bind(this)}
                date={date}
              />
            )
          }
        </div>
      </div>
    )
  }
}

export default Provider(DatePanel)
