import React, {Component} from 'react'
import Modal from './Modal'
import classNames from 'classnames'
import {formatterDate, FORMATS, PLACEHOLDER, isVaildDate} from './constants'

import PropTypes from 'prop-types'
import DatePickerType from './Type'
import dateFormat from 'date-fns/format'
import {startOfDay, endOfDay} from 'date-fns'
export default class BasePicker extends Component {
  inputRoot = null
  input = null
  rInput = null
  constructor (props) {
    super(props)
    this.state = {
      showPanel: false,
      style: {},
      date: null,
      isFocus: false,
      text: '',
      rText: '',
      placeholder: '',
      format: ''
    }
  }
  static propTypes = {
    type: PropTypes.oneOf(Object.values(DatePickerType)),
    value: function (props, propName, componentName) {
      // Invalid Date
      const val = props[propName]
      if (val === undefined || val === null) {
        return null
      }
      if (val.start && val.end) {
        const _start = dateFormat(val.start)
        const _end = dateFormat(val.end)
        if (_start === 'Invalid Date' || _end === 'Invalid Date') {
          return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed. start or end is an invalid date.`)
        }
      } else {
        if (dateFormat(val) === 'Invalid Date') {
          return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed. value is an invalid data.`)
        }
      }
    },
    onChange: PropTypes.func,
    format: PropTypes.string,
    showTime: PropTypes.bool,
    disabled: PropTypes.bool,
    showWeekNumber: PropTypes.bool,
    weekOffset: PropTypes.oneOf([0, 1])
  }
  static defaultProps = {
    type: 'date',
    disabled: false,
    showWeekNumber: true,
    weekOffset: 0
  }
  _parseProps (props, callback) {
    let {value, showTime, type, format} = props
    format = format || FORMATS[type]
    // let text = formatterDate(type, value, format, showTime)
    // let rText = text
    let date = new Date() // 当前时间
    let startDate = startOfDay(date) // 用于范围时的开始时间 - 当前日期 00：00：00
    let endDate = endOfDay(date) // 用于范围时的结束时间- 当前日期 23：59：59
    // let rightDate = endDate
    /**
     * value 可能的格式：
     *  '' | undefined  | null | Date | String | Number | {start: xxx, end: xxx}
     */
    if (value === '' || !value) {
      // value 未传入情况
      date = new Date()
    }
    if (typeof value === 'number') {
      // value 为数字（times）
      date = format(value)
    }
    if (value instanceof Date) {
      date = value
    }

    if (type.indexOf('range') !== -1) {
      if (value instanceof Date) {
        date = {startDate, endDate}
      }
      if (value && value.start && value.end) {
        date = {startDate: value.start, endDate: value.end}
        endDate = value.end
      }
    }
    console.log(date)
    this.setState({
      text: formatterDate(type, date, format, showTime),
      rText: endDate ? formatterDate(type, endDate, format, showTime) : '',
      date,
      placeholder: PLACEHOLDER[props.type] || '请选择日期',
      format
    }, () => {
      callback && callback(this.state.date)
    })
  }
  componentDidMount () {
    this._parseProps(this.props, (date) => {
      if (date.startDate && date.endDate) {
        date = ({start: new Date(date.startDate), end: new Date(date.endDate)})
      } else {
        date = new Date(date)
      }
      this.props.value && this.props.onChange && this.props.onChange(date)
    })
    let rect = this.inputRoot.getBoundingClientRect()
    this.calcPanelPos(rect)
  }
  calcPanelPos (rect) {
    let _w = this.props.type.indexOf('range') !== -1 ? 578 : 288
    let _h = this.props.showTime ? 391 : 298
    this.props.type === 'time' && (_h = 232)
    const _cw = document.body.clientWidth || document.documentElement.clientWidth
    const _ch = document.body.clientHeight || document.documentElement.clientHeight
    const _st = document.body.scrollTop || document.documentElement.scrollTop
    let {left, width, top, height} = rect
    let _top = rect.top + rect.height + _st
    if (left + _w > _cw) {
      left = left + width - _w
    }
    if (top + _h + height > _ch) {
      _top = top - _h + _st
    }
    this.setState({
      // value: this.props.placeholder ? '' : formatterDate(type, date, this.state.format, showTime),
      style: {
        position: 'absolute',
        left: left,
        top: _top
      }
    })
  }
  componentWillReceiveProps (nextProps) {
    this._parseProps(nextProps)
  }
  onPick (date, showPanel) {
    const {type, showTime, onChange} = this.props
    const {format} = this.state
    this.setState({
      date,
      text: formatterDate(type, date.startDate || date, format, showTime),
      rText: date.endDate && formatterDate(type, date.endDate, format, showTime),
      showPanel,
      isFocus: false
    })
    if (onChange) {
      if (date.startDate && date.endDate) {
        onChange({start: date.startDate, end: date.endDate})
      } else {
        onChange(date)
      }
    }
  }
  timeConfirm (date, onlyTime) {
    const {type, showTime, onChange} = this.props
    let {format} = this.state
    onlyTime && (format = FORMATS['time'])
    this.setState({
      date: date,
      text: formatterDate(type, date.startDate || date, format, showTime),
      rText: date.endDate && formatterDate(type, date.endDate, format, showTime),
      showPanel: false,
      isFocus: false
    })
    if (onChange) {
      if (date.startDate && date.endDate) {
        onChange({start: date.startDate, end: date.endDate})
      } else {
        onChange(date)
      }
    }
  }
  timeCancel () {
    const {tempDate, format} = this.state
    const {type, showTime} = this.props
    if (tempDate) {
      this.setState({
        date: new Date(tempDate),
        text: formatterDate(type, new Date(tempDate), format, showTime),
        showPanel: false
      })
    } else {
      this.setState({
        showPanel: false,
        isFocus: false
      })
    }
  }
  clickOutSide (e) {
    const tar = e.target
    if (tar.className.indexOf('clear') !== -1) {
      this.setState({
        text: '',
        rText: '',
        showPanel: false
      })
      return false
    }
    if (tar !== this.input && tar !== this.rInput) {
      this.timeCancel()
    }
  }
  _input (text, ref = 'input') {
    return (
      <input
        type='text'
        ref={el => { this[ref] = el }}
        placeholder={this.state.placeholder}
        className={this.props.disabled ? 'disabled' : ''}
        disabled={this.props.disabled}
        onChange={e => {
          isVaildDate(new Date(e.target.value)) && this.props.type === 'date' && this.props.onChange(new Date(e.target.value))
          this.setState({
            text: e.target.value
          })
        }}
        onFocus={(e) => {
          this.setState({
            showPanel: true,
            isFocus: true
          })
          this.calcPanelPos(this.inputRoot.getBoundingClientRect())
        }}
        value={text}
      />
    )
  }
  _clear () {
    const {onChange} = this.props
    if (onChange) {
      onChange(null)
    }
    this.setState({text: '', isFocus: false})
  }
  _icon () {
    const {isFocus} = this.state
    const iconCls = classNames(
      'hi-datepicker__input-icon',
      'hi-icon',
      isFocus ? 'icon-close-circle clear' : 'icon-date'
    )
    return isFocus
      ? <span className={iconCls} onClick={this._clear.bind(this)} />
      : <span className={iconCls} onClick={(e) => {
        if (this.props.disabled) return
        this.setState({showPanel: true, isFocus: true})
      }} />
  }
  renderRangeInput () {
    const {
      disabled
    } = this.props
    const _cls = classNames(
      'hi-datepicker__input',
      'hi-datepicker__input--range',
      disabled && 'hi-datepicker__input--disabled'
    )
    return (
      <div className={_cls}>
        {this._input(this.state.text, 'input')}
        <span>至</span>
        {this._input(this.state.rText, 'rInput')}
        {this._icon()}
      </div>
    )
  }
  renderNormalInput () {
    const {
      disabled
    } = this.props
    const _cls = classNames(
      'hi-datepicker__input',
      'hi-datepicker__input--normal',
      disabled && 'hi-datepicker__input--disabled'
    )
    return (
      <div className={_cls}>
        {this._input(this.state.text, 'input')}
        {this._icon()}
      </div>
    )
  }
  render () {
    const {type, showTime} = this.props
    return (
      <span ref={el => { this.inputRoot = el }} className='hi-datepicker__input-root'>
        {
          type.indexOf('range') !== -1 ? this.renderRangeInput() : this.renderNormalInput()
        }
        {
          this.state.showPanel ? (
            <Modal clickOutSide={this.clickOutSide.bind(this)} showTime={showTime}>
              {this.initPanel(this.state, this.props)}
            </Modal>
          ) : null
        }
      </span>
    )
  }
}
