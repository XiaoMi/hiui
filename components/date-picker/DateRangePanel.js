import React, {Component} from 'react'
import Calender from './Calender'
import {deconstructDate, nextMonth} from './util'
import {DAY_MILLISECONDS} from './constants'
import TimePanel from './TimePanel'
import Icon from '../icon'
import classNames from 'classnames'
import Provider from '../context'

class DatePanel extends Component {
  constructor (props) {
    super(props)
    let {startDate, endDate} = props.date
    let leftDate = new Date(startDate)
    let rightDate = endDate ? new Date(endDate) : nextMonth(leftDate)
    if (endDate) {
      const {year: sYear, month: sMonth} = deconstructDate(startDate)
      const {year: eYear, month: eMonth} = deconstructDate(endDate)
      if (sYear === eYear && sMonth === eMonth) {
        rightDate = nextMonth(leftDate)
      }
    }
    const range = {
      startDate,
      endDate,
      selecting: false
    }
    this.state = {
      date: leftDate,
      currentView: props.type || 'date',
      yearData: null,
      monthData: null,
      minDate: props.minDate,
      maxDate: props.maxDate,
      range,
      leftDate,
      rightDate,
      leftView: props.type,
      rightView: props.type,
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
  getHeaderCenterContent (year) {
    const {currentView} = this.state
    let d1 = year + '年'
    if (currentView === 'year') {
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
    const {currentView} = this.state
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
        <span className='hi-datepicker__header-text'>
          {this.getHeaderCenterContent(year)}
        </span>
        {
          (currentView === 'date' || currentView === 'daterange') && (
            <span className='hi-datepicker__header-text'>
              {month}月
            </span>
          )
        }
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
    const {onPick} = this.props
    range.startDate = startDate
    range.endDate = endDate
    this.setState({
      range
    })
    if (endDate) {
      onPick(range)
    }
    // if (endDate && !showTime) {
    //   onPick(range)
    // }
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
                // onMouseOver={this.shortcutsMouseEvent.bind(this)}
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
  renderTimeHeader (flag) {
    const {
      localeDatas
    } = this.props

    return (
      <div className='hi-datepicker__time-header'>
        <span onClick={() => this.setState({[flag === 'left' ? 'leftView' : 'rightView']: 'date'})}>{localeDatas.datePicker.dateChoose}</span>
        <em />
        <span onClick={() => this.setState({[flag === 'left' ? 'leftView' : 'rightView']: 'time'})}>{localeDatas.datePicker.timeChoose}</span>
      </div>
    )
  }
  renderTimeFooter () {
    return (
      <div
        className='hi-datepicker__time-footer'
        onClick={() => {
          this.props.timeConfirm(this.state.range)
          // this.props.onPick(this.state.date)
        }}
      >
        ok
      </div>
    )
  }
  render () {
    let {minDate, maxDate, currentView, range, leftDate, rightDate, leftView, rightView} = this.state
    // const rightDate = nextMonth(leftDate)
    const {shortcuts, theme} = this.props
    const _c = classNames(
      'hi-datepicker',
      theme && 'theme__' + theme
    )
    return (
      <div
        style={this.props.style}
        className={_c}
      >
        {
          shortcuts && this.renderShortcut(shortcuts)
        }
        <div className='hi-datepicker__body hi-datepicker__body--range'>
          <div className='hi-datepicker__panel hi-datepicker__panel--left'>
            {
              this.props.showTime && this.renderTimeHeader('left')
            }
            {
              leftView !== 'time' && this.renderHeader(currentView, leftDate, 'left')
            }
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${currentView}`}>
              {
                leftView === 'time' ? <TimePanel
                  {...this.props}
                  onPick={this.onTimePick.bind(this, 'leftDate')}
                  date={leftDate}
                  timeConfirm={this.timeConfirm.bind(this)}
                  timeCancel={this.timeCancel.bind(this)}
                /> : <Calender
                  date={leftDate}
                  range={range}
                  type={currentView}
                  minDate={minDate}
                  maxDate={maxDate}
                  onPick={this.pick.bind(this)}
                  mouseMove={this.onMouseMoveHandler.bind(this)}
                />
              }
            </div>
          </div>
          <div className='hi-datepicker__panel hi-datepicker__panel--right'>
            {
              this.props.showTime && this.renderTimeHeader('right')
            }
            {
              rightView !== 'time' && this.renderHeader(currentView, rightDate, 'right')
            }
            <div className={`hi-datepicker__calender-container hi-datepicker__calender-container--${currentView}`}>
              {
                rightView === 'time' ? <TimePanel
                  {...this.props}
                  onPick={this.onTimePick.bind(this, 'rightDate')}
                  date={rightDate}
                  timeConfirm={this.timeConfirm.bind(this)}
                  timeCancel={this.timeCancel.bind(this)}
                /> : <Calender
                  date={rightDate}
                  range={range}
                  minDate={minDate}
                  maxDate={maxDate}
                  type={currentView}
                  onPick={this.pick.bind(this)}
                  mouseMove={this.onMouseMoveHandler.bind(this)}
                />
              }
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
