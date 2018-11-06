import React, {Component} from 'react'
import Modal from './Modal'
import classNames from 'classnames'
import {formatterDate, FORMATS, PLACEHOLDER, isVaildDate} from './constants'

import PropTypes from 'prop-types'
import DatePickerType from './Type'
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
    date: PropTypes.instanceOf(Date),
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
    let text = formatterDate(type, value, format, showTime)
    let rText = text
    let l = ''
    let r = ''
    let date = new Date()
    if (value instanceof Date) {
      // type 为范围选择且 value 传入 一个 Date 类型时，需要计算开始和结束时间
      // value = value.getTime()
      // const start = value - 1 * DAY_MILLISECONDS // 得到前一天时间
      l = value
      r = value
      if (type.indexOf('range') !== -1) {
        l = l.setHours(0, 0, 0, 0)
        r = r.setHours(23, 59, 59, 0)
        date = {startDate: l, endDate: r}
      } else {
        date = value
      }
      // date = type.indexOf('range') !== -1 ? {startDate: l, endDate: r} : value
    }
    if (typeof value === 'string' || !value) {
      date = new Date().getTime()
      l = ''
      r = ''
    }
    if (value && value.start && value.end) {
      l = value.start.getTime()
      r = value.end.getTime()
      date = {startDate: l, endDate: r}
    }
    text = formatterDate(type, l, format, showTime)
    rText = formatterDate(type, r, format, showTime)
    this.setState({
      text,
      rText,
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
