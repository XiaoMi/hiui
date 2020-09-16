import React, {Component} from 'react'
import _ from 'lodash'
import Modal from './Modal'
import classNames from 'classnames'
import {formatterDate, FORMATS} from './constants'
import {showLargeCalendar, getInRangeDate} from './util'
import PropTypes from 'prop-types'
import DatePickerType from './Type'

import { dateFormat, isValid, startOfWeek, endOfWeek, parse, compatibleToDate, compatibleFormatString, toDate } from './dateUtil'
class BasePicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showPanel: false,
      style: {},
      date: null,
      isFocus: false,
      texts: ['', ''],
      placeholder: '',
      leftPlaceholder: '',
      rightPlaceholder: '',
      format: this.getFormatString(props)
    }
    this.inputRoot = React.createRef()
    this.input = null
    this.rInput = null
  }
  setPlaceholder (_props) {
    const {placeholder} = _props
    const {localeDatas, type, showTime} = this.props
    const typePlaceholder = localeDatas.datePicker.placeholders[type]
    const tempPlaceholder = showTime
      ? localeDatas.datePicker.placeholderTimeperiod
      : typePlaceholder || localeDatas.datePicker.placeholder

    let leftPlaceholder = tempPlaceholder
    let rightPlaceholder = tempPlaceholder

    if (typePlaceholder instanceof Array) {
      if (showTime) {
        const timeperiodPlaceholder = localeDatas.datePicker.placeholders.timeperiod
        leftPlaceholder = timeperiodPlaceholder[0]
        rightPlaceholder = timeperiodPlaceholder[1]
      } else {
        leftPlaceholder = tempPlaceholder[0]
        rightPlaceholder = tempPlaceholder[1]
      }
    }
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
  componentDidMount () {
    this._parseProps(this.props)
    this.setPlaceholder(this.props)
    let rect = this.inputRoot.current.getBoundingClientRect()
    this.calcPanelPos(rect)
  }
  calcPanelPos (rect) {
    const {showTime, type} = this.props
    let _w = type.indexOf('range') !== -1 ? 578 : 288
    if (type === 'timerange') {
      _w = 400
    }

    let _h = 298
    if (type === 'daterange' && showTime) {
      _h = 344
    }
    if (showLargeCalendar(this.props)) {
      _h = 440
    }
    const _cw = document.documentElement.clientWidth || document.body.clientWidth
    const _ch = document.documentElement.clientHeight || document.body.clientHeight
    const _st = document.documentElement.scrollTop || document.body.scrollTop
    let {left, width, top, height} = rect
    let _top = rect.top + rect.height + _st + 4

    if (left + _w > _cw) {
      left = left + width - _w
    }
    if (top + _h + height > _ch) {
      _top = top - _h + _st - 4
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
    if (nextProps.value !== this.props.value) {
      this._parseProps(nextProps)
    }
    if (!_.isEqual(nextProps.placeholder, this.props.placeholder)) {
      this.setPlaceholder(nextProps)
    }
  }

  getFormatString (props) {
    let { format, showTime, type } = props
    format = compatibleFormatString(format || FORMATS[type])
    if ((showTime || type === 'timeperiod') && !/[H|h|m|s]/.test(format)) {
      format = format + ' HH:mm:ss'
    }
    return format
  }
  callFormatterDate (date) {
    let { type, showTime, localeDatas, weekOffset } = this.props
    return formatterDate(type, date, this.state.format, showTime, localeDatas, weekOffset)
  }
  _parseProps (props) {
    let {value, defaultValue, type, timeInterval = 240} = props
    const { format } = this.state
    let _value = value || defaultValue
    let start
    let end
    let date
    let leftText = ''
    let rightText = ''
    if (_value) {
      if (Object.prototype.toString.call(_value) === '[object Object]') {
        start = compatibleToDate(_value.start, format)
        end = compatibleToDate(_value.end, format)
      } else {
        start = compatibleToDate(_value, format)
        if (type.includes('range')) {
          end = compatibleToDate(start, format)
          if (type === 'weekrange') {
            start = startOfWeek(start)
            end = endOfWeek(end)
          }
        }
      }

      if (type === 'timeperiod' && isValid(start)) {
        let startTime = start.getTime()
        startTime += timeInterval * 60 * 1000
        end = new Date(startTime)
      }
    }

    date = {
      startDate: compatibleToDate(start, format),
      endDate: compatibleToDate(end, format)
    }
    leftText = isValid(date.startDate) ? this.callFormatterDate(date.startDate) : ''
    rightText = isValid(date.endDate) ? this.callFormatterDate(date.endDate) : ''
    this.setState({
      texts: [leftText, rightText],
      date
    })
  }
  onPick (date, showPanel) {
    if (!date.startDate) {
      date = {startDate: date, endDate: undefined}
    }
    this.setState({
      date,
      texts: [this.callFormatterDate(date.startDate), this.callFormatterDate(date.endDate)],
      showPanel,
      isFocus: false
    }, () => {
      if (!showPanel) {
        this.callback()
      }
    })
  }

  callback () {
    const { type, onChange, disabled, max, min } = this.props

    const { date, format } = this.state
    if (onChange && !disabled) {
      let {startDate, endDate} = getInRangeDate(_.cloneDeep(date.startDate), _.cloneDeep(date.endDate), max, min)
      startDate = isValid(startDate) ? startDate : ''
      endDate = isValid(endDate) ? endDate : ''
      if (type === 'week' || type === 'weekrange') {
        this.setState({
          texts: [this.callFormatterDate(startDate), this.callFormatterDate(endDate)]
        })
        onChange(date)
        return
      }

      if (type === 'time') {
        this.setState({
          texts: [this.callFormatterDate(startDate), '']
        })
        onChange(startDate, dateFormat(startDate, format))
        return
      }
      if (['timerange', 'timeperiod', 'daterange', 'yearrange', 'monthrange'].includes(type)) {
        if(Date.parse(toDate(startDate)) > Date.parse(toDate(endDate))){
          endDate = startDate
        }
        this.setState({
          texts: [this.callFormatterDate(startDate), this.callFormatterDate(endDate)]
        })
        onChange({start: startDate, end: endDate}, {start: dateFormat(startDate, format), end: dateFormat(endDate, format)})

        return
      }

      if (isValid(startDate) || startDate === '') {
        this.setState({
          texts: [this.callFormatterDate(startDate), '']
        })
        onChange(startDate, startDate ? dateFormat(startDate, format) : '')
      }
    }
  }
  timeCancel () {
    this.setState({
      showPanel: false,
      isFocus: false
    })
  }
  inputChangeEvent () {
    let { texts, date, format } = this.state
    let startDate = parse(texts[0], format, new Date())
    let endDate = parse(texts[1], format, new Date())
    if (startDate && isValid(startDate)) {
      date.startDate ? date.startDate = startDate : date = startDate
      this.setState({date})
    }
    if (endDate && isValid(endDate)) {
      date.endDate && (date.endDate = endDate)
      this.setState({date})
    }
    if (texts[0].trim().length === 0) {
      date.startDate = null
      this.setState({date})
    }
    if (texts[1].trim().length === 0) {
      date.endDate = null
      this.setState({date})
    }
  }
  getTempTime (time) {
    let hour = time.split(':')[0];
    let min = time.split(':')[1];
    let sec = time.split(':')[2];

    return Number(hour*3600) + Number(min*60) + Number(sec);

  }
  clickOutSide (e) {
    const {max, min} = this.props
    const tar = e.target
    this.inputChangeEvent()

    if (tar.className.indexOf('clear') !== -1) {
      this.setState({
        texts: ['', ''],
        showPanel: false
      })
      return false
    }
    if (tar !== this.input && tar !== this.rInput) {
      let { texts } = this.state
      let {startDate, endDate} = getInRangeDate(texts[0], texts[1], max, min)
      texts = [this.callFormatterDate(startDate), this.callFormatterDate(endDate)]
      this.setState({
        texts
      }, () => {
        this.timeCancel()
        this.callback()
      })
    }
  }
  _input (text, ref, placeholder) {
    const {disabled} = this.props
    const { texts } = this.state
    return (
      <input
        type='text'
        ref={el => { this[ref] = el }}
        placeholder={placeholder}
        className={disabled ? 'disabled' : ''}
        disabled={disabled}
        onChange={e => {
          ref === 'input' ? (texts[0] = e.target.value) : (texts[1] = e.target.value)
          this.setState({
            texts
          }, () => {
            this.inputChangeEvent()
          })
        }}
        onFocus={(e) => {
          this.setState({
            showPanel: true,
            isFocus: true
          })
          this.calcPanelPos(this.inputRoot.current.getBoundingClientRect())
        }}
        value={text}
      />
    )
  }
  _clear () {
    const { disabled } = this.props
    !disabled && this.setState({date: {startDate: null, endDate: null}, texts: ['', ''], isFocus: false}, () => { this.callback() })
  }
  _icon () {
    const {isFocus, texts} = this.state
    const { clearable, type, showTime, disabled } = this.props
    const iconCls = classNames(
      'hi-datepicker__input-icon',
      'hi-icon',
      (texts[0].length && isFocus && clearable && !disabled)
        ? 'icon-close-circle clear'
        : ((type.includes('time') || showTime) ? 'icon-time' : 'icon-date')
    )
    return (texts[0].length && isFocus && clearable)
      ? <span className={iconCls} onClick={this._clear.bind(this)} />
      : <span className={iconCls} onClick={(e) => {
        if (this.props.disabled) return
        this.calcPanelPos(this.inputRoot.current.getBoundingClientRect())
        this.setState({showPanel: true, isFocus: true})
      }} />
  }
  renderRangeInput () {
    const {
      localeDatas,
      disabled,
      showTime,
      type,
      width,
      theme
    } = this.props
    const {isFocus} = this.state
    const _cls = classNames(
      'hi-datepicker__input',
      `theme__${theme}`,
      isFocus && 'hi-datepicker__input--focus',
      `hi-datepicker__input--${type}`,
      'hi-datepicker__input--range',
      (showTime || type === 'timeperiod') && 'hi-datepicker__input--range-time',
      disabled && 'hi-datepicker__input--disabled'
    )
    return (
      <div
        className={_cls}
        style={{width: width}}
        onMouseEnter={() => {
          this.setState({ isFocus: true })
        }}
        onMouseLeave={() => {
          this.setState({ isFocus: false })
        }}
      >
        {this._input(this.state.texts[0], 'input', this.state.leftPlaceholder)}
        <span className='hi-datepicker__input--connection'>{localeDatas.datePicker.to}</span>
        {this._input(this.state.texts[1], 'rInput', this.state.rightPlaceholder)}
        {this._icon()}
      </div>
    )
  }
  renderNormalInput () {
    const {
      disabled,
      showTime,
      type,
      width,
      theme
    } = this.props
    const {isFocus} = this.state

    const _cls = classNames(
      'hi-datepicker__input',
      `theme__${theme}`,
      isFocus && 'hi-datepicker__input--focus',
      `hi-datepicker__input--${type}`,
      disabled && 'hi-datepicker__input--disabled',
      showTime && 'hi-datepicker__input--middle'
    )
    return (
      <div
        className={_cls}
        style={{width: width}}
        onMouseEnter={() => {
          this.setState({ isFocus: true })
        }}
        onMouseLeave={() => {
          this.setState({ isFocus: false })
        }}
      >
        {this._input(
          this.state.texts[0],
          'input',
          this.state.leftPlaceholder
        )}
        {this._icon()}
      </div>
    )
  }
  render () {
    const {type, showTime, width} = this.props
    return (
      <span ref={this.inputRoot} className='hi-datepicker__input-root' style={{width: width}}>
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
BasePicker.propTypes = {
  type: PropTypes.oneOf(Object.values(DatePickerType)),
  value: function (props, propName, componentName) {
    const val = props[propName]
    if (val === undefined || val === null) {
      return null
    }
    if (!val) {
      return null
    }
    if (val.start && val.end) {
      const _start = isValid(val.start)
      const _end = isValid(val.end)
      if (!_start || !_end) {
        return new Error(`Invalid prop ${propName} supplied to ${componentName}. Validation failed. start or end is an invalid date.`)
      }
    } else {
      if (!isValid(val)) {
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
  },
  clearable: PropTypes.bool
}
BasePicker.defaultProps = {
  type: 'date',
  disabled: false,
  showWeekNumber: true,
  weekOffset: 0,
  timeInterval: 240,
  clearable: true
}
export default BasePicker
