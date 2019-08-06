import React, {Component} from 'react'
import {deconstructDate, nextMonth} from './util'
import Calender from './Calender'
import Icon from '../icon'
import classNames from 'classnames'
import {startOfWeek, endOfWeek, isSameMonth, isValid, getStartDate} from './dateUtil'

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
      ..._parseProps(props.date)
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
        <div className='hi-datepicker__header-btns'>
          <span onClick={() => this.changeYear(true, lr)} ><Icon name='double-left' /></span>
          <span onClick={() => this.changeMonth(true, lr)} ><Icon name='left' /></span>
        </div>
        <span className='hi-datepicker__header-text'>
          {this.getHeaderCenterContent(year, month)}
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
    } else {
      if (flag) {
        right.year -= 1
      } else {
        right.year += 1
      }
      nRightDate.setFullYear(right.year)
    }
    if (nLeftDate <= nRightDate) {
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
  render () {
    const {range, leftDate, rightDate} = this.state
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
            <div className='hi-datepicker__calender-container'>
              <Calender
                date={leftDate}
                range={range}
                type='weekrange'
                onPick={this.pick.bind(this)}
                mouseMove={this.onMouseMoveHandler.bind(this)}
              />
            </div>
          </div>
          <div className='hi-datepicker__panel hi-datepicker__panel--right'>
            {this.renderHeader(type, rightDate, 'right')}
            <div className='hi-datepicker__calender-container'>
              <Calender
                date={rightDate}
                range={range}
                type='weekrange'
                onPick={this.pick.bind(this)}
                mouseMove={this.onMouseMoveHandler.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
