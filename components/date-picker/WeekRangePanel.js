import React, {Component} from 'react'
import {deconstructDate, nextMonth, getWeekRange} from './util'
import Calender from './Calender'
import Icon from '../icon'
export default class WeekRangePanel extends Component {
  constructor (props) {
    super(props)
    const {startDate, endDate} = props.date
    let leftDate = new Date(startDate)
    let rightDate = endDate || nextMonth(leftDate)
    if (endDate) {
      const {year: sYear, month: sMonth} = deconstructDate(startDate)
      const {year: eYear, month: eMonth} = deconstructDate(endDate)
      if (sYear === eYear && sMonth === eMonth) {
        rightDate = nextMonth(leftDate)
      }
    }
    this.state = {
      date: leftDate,
      range: {
        startDate: getWeekRange(startDate).start,
        endDate: endDate ? getWeekRange(endDate).end : getWeekRange(startDate).end,
        selecting: false
      },
      leftDate,
      rightDate
    }
  }
  /**
   * Header 中间部分内容
   * @param {String} type 选择器类型
   * @param {Number} year 当前年份
   * @param {Number} month 当前月份
   */
  getHeaderCenterContent (year) {
    const {currentView} = this.state
    // const {year} = deconstructDate(date)
    let d1 = year + '年'
    // let d2 = month + '月'
    if (currentView === 'year') {
      // const ys = this.getYearSelectorRange(year)
      return (year - 6) + '~' + (year + 4)
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
  renderHeader (type, value, lr) {
    const {year, month} = deconstructDate(value)
    return (
      <div className='date-header'>
        <div className='left-btns'>
          <span onClick={() => this.changeYear(true, lr)} ><Icon name='double-left' /></span>
          <span onClick={() => this.changeMonth(true, lr)} ><Icon name='left' /></span>
        </div>
        <span className='center-year'>
          {this.getHeaderCenterContent(year)}
        </span>
        <span className='center-month'>
          {month}月
        </span>
        <div className='right-btns'>
          <span onClick={() => this.changeMonth(false, lr)} ><Icon name='right' /></span>
          <span onClick={() => this.changeYear(false, lr)} ><Icon name='double-right' /></span>
        </div>
      </div>
      // <div className='date-header'>
      //   <div className='left-btns'>
      //     <button onClick={() => this.changeYear(true, lr)}>
      //       &lt;&lt;
      //     </button>
      //     <button onClick={() => this.changeMonth(true, lr)}>
      //       &lt;
      //     </button>
      //   </div>
      //   <span className='center-year'>
      //     {this.getHeaderCenterContent(year)}
      //   </span>
      //   <span className='center-month'>
      //     {month}月
      //   </span>
      //   <div className='right-btns'>
      //     <button onClick={() => this.changeMonth(false, lr)}>
      //       &gt;
      //     </button>
      //     <button onClick={() => this.changeYear(false, lr)}>
      //       &gt;&gt;
      //     </button>
      //   </div>
      // </div>
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
  pick (startDate, endDate) {
    const {range} = this.state
    const {onPick} = this.props
    range.startDate = startDate
    range.endDate = endDate
    this.setState({
      range
    })
    if (endDate) {
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
  render () {
    const {range, leftDate, rightDate} = this.state
    const {type} = this.props
    // const {year, month, day} = deconstructDate(date)
    // const _date = new Date(year, month, day)
    return (
      <div
        style={this.props.style}
        className='hi-datepicker'
      >
        <div className='hi-datepicker-body  hi-datepicker-range-body'>
          <div className='range-left'>
            <div className='hi-datepicker-header'>
              {this.renderHeader(type, leftDate, 'left')}
            </div>
            <div className='hi-datepicker-calender'>
              <Calender
                date={leftDate}
                range={range}
                type='weekrange'
                onPick={this.pick.bind(this)}
                mouseMove={this.onMouseMoveHandler.bind(this)}
              />
            </div>
          </div>
          <div className='range-right'>
            <div className='hi-datepicker-header'>
              {this.renderHeader(type, rightDate, 'right')}
            </div>
            <div className='hi-datepicker-calender'>
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
