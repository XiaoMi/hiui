import React, {Component} from 'react'
import Calender from './Calender'
import { deconstructDate, nextMonth, showLargeCalendar } from './util'
import { DAY_MILLISECONDS } from './constants'
import Icon from '../icon'
import classNames from 'classnames'
import Provider from '../context'
import { dateFormat, isValid, getStartDate, toDate, changeYear, changeMonth, endOfDay } from './dateUtil'
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
          {this.getHeaderCenterContent(year, month, lr)}
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
    const nDate = new Date((endOfDay(_date).getTime() + 1) - days * DAY_MILLISECONDS)
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
  getRangeDateStr () {
    let { range, showMask, leftDate, rightDate } = this.state
    let { format } = this.props
    format = format.substr(format.match(/[H|h]\s*/).index)
    const cls = classNames(
      showMask && 'hi-datepicker__time-text'
    )
    return (
      <span className={cls}>
        {`${dateFormat(range.startDate ? range.startDate : leftDate, format)} - ${dateFormat(range.endDate ? range.endDate : rightDate, format)}`}
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
  _getNormalComponent (date, flag, showLunar) {
    let { minDate, maxDate, range, layout } = this.state
    const { altCalendar, altCalendarPreset, dateMarkRender, dateMarkPreset, altCalendarPresetData, dateMarkPresetData } = this.props

    let component = null
    const { year, month } = deconstructDate(date)
    switch (layout[flag]) {
      case 'year':
        const yearData = this.getYearOrMonthData(year, 'year')
        component = (
          <Calender
            altCalendar={altCalendar}
            altCalendarPreset={altCalendarPreset}
            dateMarkRender={dateMarkRender}
            dateMarkPreset={dateMarkPreset}
            showLunar={showLunar}
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
            altCalendarPresetData={altCalendarPresetData}
            dateMarkPresetData={dateMarkPresetData}
            altCalendar={altCalendar}
            altCalendarPreset={altCalendarPreset}
            dateMarkRender={dateMarkRender}
            dateMarkPreset={dateMarkPreset}
            showLunar={showLunar}
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
            altCalendarPresetData={altCalendarPresetData}
            dateMarkPresetData={dateMarkPresetData}
            altCalendar={altCalendar}
            altCalendarPreset={altCalendarPreset}
            dateMarkRender={dateMarkRender}
            dateMarkPreset={dateMarkPreset}
            showLunar={showLunar}
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
    const { shortcuts, theme, showTime, date, showLunar } = this.props
    const _c = classNames(
      'hi-datepicker',
      theme && 'theme__' + theme
    )
    console.log('showLargeCalendar(this.props)', showLargeCalendar(this.props))
    const bodyCls = classNames(
      'hi-datepicker__body',
      'hi-datepicker__body--range',
      shortcuts && 'hi-datepicker__body--shortcuts',
      shortcuts && showLargeCalendar(this.props) && 'hi-datepicker__body--shortcuts--large',
      (!shortcuts) && showLargeCalendar(this.props) && 'hi-datepicker__body--range--large'

    )
    const panelClsleft = classNames(
      'hi-datepicker__panel',
      'hi-datepicker__panel--left'
    )
    const panelClsright = classNames(
      'hi-datepicker__panel',
      'hi-datepicker__panel--right'
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
          <div className={panelClsleft}>
            {
              this.renderHeader(currentView, leftDate, 'left')
            }
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${layout['left']}`}>
              {this._getNormalComponent(leftDate, 'left', showLunar)}
            </div>
          </div>
          <div className={panelClsright}>
            {
              this.renderHeader(currentView, rightDate, 'right')
            }
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${layout['right']}`}>
              {this._getNormalComponent(rightDate, 'right', showLunar)}
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
              date={date}
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
