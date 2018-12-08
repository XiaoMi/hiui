import React, {Component} from 'react'
import Calender from './Calender'
import {deconstructDate} from './util'
import TimePanel from './TimePanel'
import Icon from '../icon'
import classNames from 'classnames'
import Provider from '../context'

class DatePanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      date: new Date(props.date),
      currentView: props.type,
      yearData: [],
      monthData: [],
      tempDate: new Date(props.date)
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
    const start = type === 'year' ? val - 6 : 1
    let trs = [[], [], [], []]
    let num = 0
    for (let i = 0; i < 4; i++) {
      let row = trs[i]
      for (let j = 0; j < 3; j++) {
        let col = row[j] || (row[j] = {type: 'normal'})
        const y = start + num
        if (y === val) {
          col.type = 'today'
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
    const {date, currentView} = this.state
    const {year} = deconstructDate(date)
    let d1 = year + '年'
    // let d2 = month + '月'
    if (currentView === 'year') {
      // const ys = this.getYearSelectorRange(year)
      return (year - 6) + '~' + (year + 5)
    }
    return d1
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
    const {month} = deconstructDate(value)
    return (
      <div className='hi-datepicker__header'>
        <div className='hi-datepicker__header-btns'>
          {/* <span className='hi-icon icon-left-double' onClick={() => this.changeYear(true)} /> */}
          <span onClick={() => this.changeYear(true)} ><Icon name='double-left' /></span>
          {
            (type !== 'month' && type !== 'year') && <span onClick={() => this.changeMonth(true)} ><Icon name='left' /></span>
          }
        </div>
        <span className='hi-datepicker__header-text' onClick={() => this.setState({currentView: 'year'})}>
          {this.getHeaderCenterContent()}
        </span>
        {
          type !== 'month' && type !== 'year' && (
            <span className='hi-datepicker__header-text'>
              {month}月
            </span>
          )
        }
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
    const {showTime} = this.props
    const {hours, minutes, seconds} = deconstructDate(this.state.date)
    date.setHours(hours, minutes, seconds)
    if (showTime) {
      // 又改成了实时生效
      this.setState({date, currentView: 'time'}, () => { this.props.onPick(date, true) })
    } else {
      this.props.onPick(date)
    }
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
      case 'time':
        component = (
          <TimePanel
            {...this.props}
            onPick={this.onTimePick.bind(this)}
            date={date}
            timeConfirm={this.timeConfirm.bind(this)}
            timeCancel={this.timeCancel.bind(this)}
          />
        )
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
  renderTimeHeader () {
    const {
      localeDatas
    } = this.props

    return (
      <div className='hi-datepicker__time-header'>
        <span onClick={() => this.setState({currentView: 'date'})} className={this.state.currentView === 'date' ? 'hi-datepicker__time-header--active' : ''}>{localeDatas.datePicker.dateChoose}</span>
        <em />
        <span onClick={() => this.setState({currentView: 'time'})} className={this.state.currentView === 'time' ? 'hi-datepicker__time-header--active' : ''}>{localeDatas.datePicker.timeChoose}</span>
      </div>
    )
  }
  renderTimeFooter () {
    return (
      <div
        className='hi-datepicker__time-footer'
        onClick={() => this.props.timeConfirm(this.state.date)}
      >
        ok
      </div>
    )
  }
  render () {
    const {date, currentView} = this.state
    const {theme} = this.props
    const _c = classNames(
      'hi-datepicker',
      theme && 'theme__' + theme
    )
    return (
      <div
        style={this.props.style}
        className={_c}
      >
        <div className='hi-datepicker__body'>
          {
            this.props.showTime && this.renderTimeHeader()
          }
          <div className='hi-datepicker__panel hi-datepicker__panel--left'>
            {currentView !== 'time' && this.renderHeader(currentView, date)}
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${currentView}`}>
              {this._getNormalComponent()}
            </div>
          </div>
          {
            this.props.showTime && this.renderTimeFooter()
          }
        </div>
      </div>
    )
  }
}

export default Provider(DatePanel)
