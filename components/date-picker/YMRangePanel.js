import React, {Component} from 'react'
import Calender from './Calender'
import { deconstructDate, colDisabled } from './util'
import Icon from '../icon'
import classNames from 'classnames'
import Provider from '../context'
import { isValid, getStartDate, toDate, changeYear, isWithinInterval, isSameYear, isSameMonth, compareAsc, startOfYear, startOfMonth, endOfYear, endOfMonth } from './dateUtil'

class YMRangePanel extends Component {
  constructor (props) {
    super(props)
    const {range, leftDate, rightDate} = this._generatePanelData()
    this.maskRef = React.createRef()
    this.state = {
      date: leftDate,
      minDate: props.min,
      maxDate: props.max,
      range,
      leftDate,
      rightDate
    }
  }
  _generatePanelData () {
    const { type, date } = this.props
    let {startDate, endDate} = date
    // 组件内左右面板中日期
    let leftDate = getStartDate(date)
    const {year: sYear} = deconstructDate(leftDate)
    let rightDate = isValid(endDate) ? new Date(endDate) : new Date(sYear + '')
    const {year: eYear} = deconstructDate(rightDate)
    if (type === 'yearrange') {
      if (eYear - sYear < 12) {
        rightDate.setFullYear(sYear + 12)
      }
    } else {
      if (eYear === sYear) {
        rightDate.setFullYear(sYear + 1)
      }
    }
    const range = {
      startDate: isValid(startDate) ? startDate : null,
      endDate: isValid(endDate) ? endDate : null,
      selecting: false
    }
    return {
      range,
      leftDate,
      rightDate
    }
  }
  /**
   * 改变年份事件
   * @param {Number} num  加减值
   */
  changeYear (flag, pos) {
    let {leftDate, rightDate} = this.state
    const { type } = this.props
    let nLeftDate = toDate(leftDate)
    let nRightDate = toDate(rightDate)
    const num = type === 'yearrange' ? 12 : 1
    if (pos === 'left') {
      nLeftDate = changeYear(leftDate, flag, num)
    } else {
      nRightDate = changeYear(rightDate, flag, num)
    }
    if (nLeftDate.getFullYear() < nRightDate.getFullYear()) {
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
  getHeaderCenterContent (year) {
    const { locale, type } = this.props
    if (type === 'yearrange') {
      return (year - 4) + '-' + (year + 7)
    }
    if (locale === 'zh-CN') {
      return year + '年'
    } else {
      return `${year}`
    }
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
  renderHeader (value, lr) {
    const {year} = deconstructDate(value)

    return (
      <div className='hi-datepicker__header'>
        {
          <div className='hi-datepicker__header-btns'>
            <span onClick={() => this.changeYear(true, lr)} ><Icon name='double-left' /></span>
          </div>
        }
        <span
          className='hi-datepicker__header-text'
        >
          {this.getHeaderCenterContent(year)}
        </span>
        {
          <div className='hi-datepicker__header-btns'>
            <span onClick={() => this.changeYear(false, lr)} ><Icon name='double-right' /></span>
          </div>
        }
      </div>
    )
  }
  pick (startDate, endDate) {
    const {range} = this.state
    const {onPick, type} = this.props
    range.startDate = type === 'yearrange' ? startOfYear(startDate) : startOfMonth(startDate)
    this.setState({
      range
    })
    if (endDate) {
      range.endDate = type === 'yearrange' ? endOfYear(endDate) : endOfMonth(endDate)
      onPick(range)
    }
  }
  onMouseMoveHandler (date) {
    const {range} = this.state
    range.endDate = date
    this.setState({
      range
    })
  }
  getYearOrMonthData (year, type, _year) {
    const start = type === 'year' ? year - 4 : 1
    const { type: pType } = this.props
    let trs = [[], [], [], []]
    let num = 0
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const { range } = this.state
    const _fun = (sDate, tDate) => {
      return pType === 'yearrange' ? isSameYear(sDate, tDate) : isSameMonth(sDate, tDate)
    }
    for (let i = 0; i < 4; i++) {
      let row = trs[i]
      for (let j = 0; j < 3; j++) {
        let col = row[j] || (row[j] = { type: 'normal' })
        const y = start + num
        if (y === currentYear || (y === currentMonth + 1 && year === currentYear)) {
          col.type = 'today'
        }
        col = colDisabled(type, col, _year, this.props, y)

        col.value = y
        let _val = pType === 'yearrange' ? new Date(y + '') : new Date(year, y - 1)
        col.rangeStart = _fun(_val, range.startDate)
        col.rangeEnd = _fun(_val, range.endDate)
        const _ds = [range.startDate, range.endDate].sort(compareAsc)
        col.range = range.endDate && isWithinInterval(_val, {start: _ds[0], end: _ds[1]})
        num++
      }
    }
    return trs
  }
  _getNormalComponent (date, flag) {
    let { range } = this.state
    const { altCalendar, altCalendarPreset, dateMarkRender, dateMarkPreset, altCalendarPresetData, dateMarkPresetData, type } = this.props
    let component = null
    const { year } = deconstructDate(date)
    switch (type) {
      case 'yearrange':
        const yearData = this.getYearOrMonthData(year, 'year', year)
        component = (
          <Calender
            range={range}
            altCalendar={altCalendar}
            altCalendarPreset={altCalendarPreset}
            dateMarkRender={dateMarkRender}
            dateMarkPreset={dateMarkPreset}
            date={date}
            data={yearData}
            type={'yearrange'}
            onPick={this.pick.bind(this)}
            mouseMove={this.onMouseMoveHandler.bind(this)}
          />
        )
        break
      case 'monthrange':
        const monthData = this.getYearOrMonthData(year, 'month', year)
        component = (
          <Calender
            range={range}
            altCalendarPresetData={altCalendarPresetData}
            dateMarkPresetData={dateMarkPresetData}
            altCalendar={altCalendar}
            altCalendarPreset={altCalendarPreset}
            dateMarkRender={dateMarkRender}
            dateMarkPreset={dateMarkPreset}
            date={date}
            data={monthData}
            type={'monthrange'}
            onPick={this.pick.bind(this)}
            mouseMove={this.onMouseMoveHandler.bind(this)}
          />
        )
        break
      default:
        break
    }
    return component
  }
  render () {
    let { leftDate, rightDate } = this.state
    const { theme } = this.props
    const _c = classNames(
      'hi-datepicker',
      theme && 'theme__' + theme
    )
    const bodyCls = classNames(
      'hi-datepicker__body',
      'hi-datepicker__body--range'

    )
    return (
      <div
        style={this.props.style}
        className={_c}
      >
        <div className={bodyCls}>
          <div className='hi-datepicker__panel hi-datepicker__panel--left'>
            {
              this.renderHeader(leftDate, 'left')
            }
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--year`}>
              {this._getNormalComponent(leftDate, 'left')}
            </div>
          </div>
          <div className='hi-datepicker__panel hi-datepicker__panel--right'>
            {
              this.renderHeader(rightDate, 'right')
            }
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--year`}>
              {this._getNormalComponent(rightDate, 'right')}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Provider(YMRangePanel)
