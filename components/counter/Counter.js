import React from 'react'
import PropTypes from 'prop-types'
import { filterObjProps } from '../input/util'
import { Decimal } from 'decimal.js'
import Provider from '../context'

import Icon from '../icon'
/**
 * 加减器
 */
class Counter extends React.Component {
  static _Input = ''
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func
  }
  static defaultProps = {
    defaultValue: 0,
    step: 1
  }

  constructor (props) {
    super(props)

    const oldProps = Object.assign({}, this.props)

    this.attrs = this.getAttrs(oldProps)

    const { value, defaultValue, min = -1 * Infinity, max = Infinity } = this.props
    const finalValue = Math.min(
      Math.max(Number(value === undefined ? defaultValue : value), Number(min)),
      Number(max)
    )
    this.state = {
      value: this.format(finalValue),
      valueTrue: this.formatValue(finalValue)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.hasOwnProperty('value')) {
      this.setState({
        value: this.format(nextProps.value),
        valueTrue: this.formatValue(nextProps.value)
      })
    }
  }

  /**
   * 提取非函数属性
   * @param {object} oldProps 原始props
   */
  getAttrs (oldProps) {
    const attrs = {}
    const noNeed = ['value', 'className', 'class', 'id', 'style', 'type', 'placeholder', 'disabled']

    for (let i in oldProps) {
      if (!(oldProps[i] instanceof Function)) {
        if (noNeed.indexOf(i) === -1) {
          attrs[i] = oldProps[i]
        }
      }
    }

    return attrs
  }

  /**
   * 净化数据
   * @param {string} val 值
   */
  formatValue (value) {
    return isNaN(Number(value)) ? value.toString().replace(/[^-\d]/g, '') : value
  }

  /**
   * 格式化数据
   * 88,888
   * @param {string} val 值
   */
  format (val) {
    return val
  }

  render () {
    const { className, id, disabled } = this.props
    const { min = -1 * Infinity, max = Infinity, step, theme } = this.props
    let { valueTrue } = this.state
    const { defaultValue, ...attrs } = this.attrs
    const filterAttrs = filterObjProps(attrs, ['locale', 'theme', 'localeDatas', 'localedatas', 'innerRef'])

    let isAddDisabled = false
    let isMinusDisabled = false
    if (step > 0) {
      isMinusDisabled = this.hasReachedMin || disabled
      isAddDisabled = this.hasReachedMax || disabled
    } else {
      isMinusDisabled = this.hasReachedMax || disabled
      isAddDisabled = this.hasReachedMin || disabled
    }

    return (
      <div className={`hi-counter theme__${theme} ${className || ''}`} id={id}>
        <div className={`hi-counter-outer`}>
          <span
            className={`hi-counter-minus hi-counter-sign ${isMinusDisabled ? 'disabled' : ''}`}
            onClick={e => {
              let value = new Decimal(this.getInputNumber()).minus(step).valueOf()
              if (isMinusDisabled) {
                return
              }
              if (step > 0) {
                if (this.willReachMin) {
                  value = min
                }
              } else {
                if (this.willReachMax) {
                  value = max
                }
              }
              this.update(value)
            }}
          >
            <Icon name='minus' />
          </span>
          <input
            id={id ? `${id}_value` : ''}
            ref={arg => {
              this._Input = arg
            }}
            value={this.state.value}
            disabled={disabled}
            data-value={this.state.valueTrue}
            {...filterAttrs}
            onChange={e => {
              e.persist()
              let value = e.target.value
              this.setState({
                value: this.format(value),
                valueTrue: this.formatValue(value)
              })
            }}
            onBlur={e => {
              let value = this.getInputNumber()

              this.update(value)
            }}
          />
          <span
            className={`hi-counter-plus hi-counter-sign ${isAddDisabled ? 'disabled' : ''}`}
            onClick={e => {
              let value = new Decimal(valueTrue).plus(step).valueOf()
              if (isAddDisabled) {
                return
              }
              if (step > 0) {
                if (this.willReachMax) {
                  value = max
                }
              } else {
                if (this.willReachMin) {
                  value = min
                }
              }
              this.update(value)
            }}
          >
            <Icon name='plus' />
          </span>
        </div>
      </div>
    )
  }

  update (value) {
    const { onChange } = this.props

    if (this.isControlledComponent) {
      this.setState({
        value: this.format(this.props.value),
        valueTrue: this.formatValue(this.props.value)
      })
    }

    if (this.isUncontrolledComponent) {
      this.setState({
        value: this.format(value),
        valueTrue: this.formatValue(value)
      })
    }
    setTimeout(() => {
      onChange &&
        onChange(
          {
            target: this._Input
          },
          value
        )
    }, 0)
  }

  get isControlledComponent () {
    return this.props.hasOwnProperty('value')
  }

  get isUncontrolledComponent () {
    return !this.isControlledComponent
  }

  getInputNumber () {
    const { max = Infinity, min = 0 } = this.props
    let value = this.valueTrue
    if (isNaN(value)) {
      value = min
    }
    if (value - max >= 0) {
      value = max
    }
    if (value - min <= 0) {
      value = min
    }
    return value
  }

  get valueTrue () {
    return parseFloat(this.state.value.toString().replace(/[^0-9|.|\-(e+)]+/, ''))
  }

  get willReachMax () {
    const { max = Infinity, step } = this.props

    let num = new Decimal(this.valueTrue).plus(step > 0 ? step : -step).valueOf() * 1
    return max <= num
  }

  get willReachMin () {
    const { min = -1 * Infinity, step } = this.props
    let num = new Decimal(this.valueTrue).minus(step > 0 ? step : -step).valueOf() * 1
    return min >= num
  }

  get hasReachedMax () {
    const { max = Infinity } = this.props

    return max <= this.valueTrue * 1
  }
  get hasReachedMin () {
    const { min = -1 * Infinity } = this.props
    return min >= this.valueTrue * 1
  }
}

export default Provider(Counter)
