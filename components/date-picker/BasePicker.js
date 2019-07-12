import React, { Component } from 'react'
import Modal from './Modal'
import classNames from 'classnames'
import { formatterDate, FORMATS, isVaildDate } from './constants'

import PropTypes from 'prop-types'
import DatePickerType from './Type'

import { startOfDay, endOfDay, parse, startOfWeek, endOfWeek, dateFormat } from './dateUtil'
import { addHours } from 'date-fns'
class BasePicker extends Component {
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
      // input 框内的显示的时间内容
      texts: ['', ''],
      placeholder: '',
      rText: '',
      leftPlaceholder: '',
      rightPlaceholder: '',
      format: ''
    }
  }
  setPlaceholder () {
    const { placeholder, localeDatas, type } = this.props
    const tempPlaceholder = localeDatas.datePicker.placeholders[type] || localeDatas.datePicker.placeholder
    let leftPlaceholder = tempPlaceholder
    let rightPlaceholder = tempPlaceholder

    if (placeholder instanceof Array) {
      leftPlaceholder = placeholder[0]
      rightPlaceholder = placeholder[1] || placeholder[0]
    } else if (typeof placeholder === 'string') {
      leftPlaceholder = placeholder
      rightPlaceholder = placeholder
    }
    this.setState({
      leftPlaceholder,
      rightPlaceholder
    })
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
    weekOffset: PropTypes.oneOf([0, 1]),
    timeInterval: function (props, propName, componentName) {
      const val = props[propName]
      if (val < 5 || val > 480 || (val > 60 && val % 60 !== 0) || (val < 60 && 60 % val !== 0)) {
        return new Error(`Invalid prop ${propName} supplied to ${componentName}. This value must be greater than 5 and less than 480 and is a multiple of 60.`)
      }
    }
  }
  static defaultProps = {
    type: 'date',
    disabled: false,
    showWeekNumber: true,
    weekOffset: 0,
    timeInterval: 240
  }
  _parseProps (props, callback) {
    let { value, showTime, type, format, localeDatas, weekOffset } = props
    format = format || FORMATS[type]
    let date = new Date() // 当前时间
    let noText = false
    /**
     * value 可能的格式：
     *  '' | undefined  | null | Date | String | Number | {start: xxx, end: xxx}
     */
    if (value === '' || !value) {
      // value 未传入情况
      date = new Date()
      noText = true
    }
    if (typeof value === 'number' || (typeof value === 'string' && value.trim().length > 4)) {
      // value 为数字（times）
      date = parse(value)
    }
    if (value instanceof Date) {
      date = value
    }

    if (type.includes('range') || type === 'timeperiod') {
      if (value instanceof Date || !value) {
        // 如果为时间段选择，则取默认的第一个范围
        date = { startDate: startOfDay(date), endDate: type === 'timeperiod' ? addHours(startOfDay(date), 4) : endOfDay(date) }
      }
      if (value && value.start && value.end) {
        date = { startDate: value.start, endDate: value.end }
      }
    }
    const leftText = noText ? '' : formatterDate(type, date.startDate || date, format, showTime, localeDatas, weekOffset)
    const rightText = noText ? '' : formatterDate(type, date.endDate || date, format, showTime, localeDatas, weekOffset)
    this.setState({
      texts: [leftText, rightText],
      date,
      format
    }, () => {
      callback && callback(this.state.date)
    })
  }
  componentDidMount () {
    this._parseProps(this.props, (date) => {
      if (date.startDate && date.endDate) {
        date = ({ start: new Date(date.startDate), end: new Date(date.endDate) })
      } else {
        date = new Date(date)
      }
      this.props.value && this.props.onChange && this.props.onChange(date)
    })
    this.setPlaceholder()
    let rect = this.inputRoot.getBoundingClientRect()
    this.calcPanelPos(rect)
  }
  calcPanelPos (rect) {
    const { showTime, type } = this.props
    let _w = type.indexOf('range') !== -1 ? 578 : 288
    let _h = 298
    if (type === 'daterange' && showTime) {
      _h = 344
    }
    const _cw = document.body.clientWidth || document.documentElement.clientWidth
    const _ch = document.body.clientHeight || document.documentElement.clientHeight
    const _st = document.body.scrollTop || document.documentElement.scrollTop
    let { left, width, top, height } = rect
    let _top = rect.top + rect.height + _st
    if (left + _w > _cw) {
      left = left + width - _w
    }
    if (top + _h + height > _ch) {
      _top = top - _h + _st
    }
    this.setState({
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
    const { type, showTime, localeDatas, weekOffset } = this.props
    const { format } = this.state
    this.setState({
      date,
      texts: [formatterDate(type, date.startDate || date, format, showTime, localeDatas, weekOffset), formatterDate(type, date.endDate, format, showTime, localeDatas, weekOffset)],
      showPanel,
      isFocus: false
    }, () => {
      if (!showPanel) {
        this.callback()
      }
    })
  }
  callback () {
    const { type, onChange, weekOffset } = this.props
    const { date } = this.state
    if (onChange) {
      const { startDate, endDate } = date
      const _weekOffset = { weekStartsOn: weekOffset }
      if (type === 'week') {
        onChange({ start: startOfWeek(date, _weekOffset), end: endOfWeek(date, _weekOffset) })
        return
      }
      if (startDate && endDate) {
        if (type === 'weekrange') {
          onChange({ start: startOfWeek(startDate, _weekOffset), end: endOfWeek(endDate, _weekOffset) })
        } else if (['timerange', 'timeperiod', 'daterange'].includes(type)) {
          onChange({ start: startDate, end: endDate })
        } else {
          onChange({ start: startOfDay(startDate), end: endOfDay(endDate) })
        }
      } else {
        onChange(date)
      }
    }
  }
  timeConfirm (date, onlyTime) {
    const { type, showTime, onChange, localeDatas, weekOffset } = this.props
    let { format } = this.state
    onlyTime && (format = FORMATS['time'])
    this.setState({
      date: date,
      texts: [formatterDate(type, date.startDate || date, format, showTime, localeDatas, weekOffset), formatterDate(type, date.endDate, format, showTime, localeDatas, weekOffset)],
      showPanel: false,
      isFocus: false
    })
    if (onChange) {
      if (date.startDate && date.endDate) {
        onChange({ start: date.startDate, end: date.endDate })
      } else {
        onChange(date)
      }
    }
  }
  timeCancel () {
    const { tempDate, format } = this.state
    const { type, showTime, localeDatas, weekOffset } = this.props
    if (tempDate) {
      this.setState({
        date: new Date(tempDate),
        text: formatterDate(type, new Date(tempDate), format, showTime, localeDatas, weekOffset),
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
        texts: ['', ''],
        showPanel: false
      })
      return false
    }
    if (tar !== this.input && tar !== this.rInput) {
      this.timeCancel()
    }
    this.callback()
  }
  _input (text, ref = 'input', placeholder = 'Please Select...') {
    const { disabled, type, onChange } = this.props

    return (
      <input
        type='text'
        ref={el => { this[ref] = el }}
        placeholder={placeholder}
        className={disabled ? 'disabled' : ''}
        disabled={disabled}
        onChange={e => {
          isVaildDate(new Date(e.target.value)) && type === 'date' && onChange(new Date(e.target.value))
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
    const { onChange } = this.props
    if (onChange) {
      onChange(null)
    }
    this.setState({ texts: ['', ''], isFocus: false })
  }
  _icon () {
    const { isFocus } = this.state
    const iconCls = classNames(
      'hi-datepicker__input-icon',
      'hi-icon',
      isFocus ? 'icon-close-circle clear' : 'icon-date'
    )
    return isFocus
      ? <span className={iconCls} onClick={this._clear.bind(this)} />
      : <span className={iconCls} onClick={(e) => {
        if (this.props.disabled) return
        this.calcPanelPos(this.inputRoot.getBoundingClientRect())
        this.setState({ showPanel: true, isFocus: true })
      }} />
  }
  renderRangeInput () {
    const {
      localeDatas,
      disabled,
      showTime
    } = this.props
    const _cls = classNames(
      'hi-datepicker__input',
      'hi-datepicker__input--range',
      showTime && 'hi-datepicker__input--range-time',
      disabled && 'hi-datepicker__input--disabled'
    )
    return (
      <div className={_cls}>
        {this._input(this.state.texts[0], 'input', this.state.leftPlaceholder)}
        <span>{localeDatas.datePicker.to}</span>
        {this._input(this.state.texts[1], 'rInput', this.state.rightPlaceholder)}
        {this._icon()}
      </div>
    )
  }
  renderNormalInput () {
    const {
      disabled,
      showTime
    } = this.props
    const _cls = classNames(
      'hi-datepicker__input',
      'hi-datepicker__input--normal',
      disabled && 'hi-datepicker__input--disabled',
      showTime && 'hi-datepicker__input--middle'
    )
    return (
      <div className={_cls}>
        {this._input(this.state.texts[0], 'input', this.state.leftPlaceholder)}
        {this._icon()}
      </div>
    )
  }
  render () {
    const { type, showTime } = this.props
    return (
      <span ref={el => { this.inputRoot = el }} className='hi-datepicker__input-root'>
        {
          (type.indexOf('range') !== -1 || type === 'timeperiod') ? this.renderRangeInput() : this.renderNormalInput()
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

export default BasePicker
