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

    const {
      value,
      defaultValue,
      min = -1 * Infinity,
      max = Infinity
    } = this.props
    const finalValue = Math.min(
      Math.max(Number(value === undefined ? defaultValue : value), Number(min)),
      Number(max)
    )
    this.state = {
      value: this.formatValue(finalValue),
      valueTrue: this.formatValue(finalValue)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.hasOwnProperty('value')) {
      this.setState({
        value: this.formatValue(nextProps.value),
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
    const noNeed = [
      'value',
      'className',
      'class',
      'id',
      'style',
      'type',
      'placeholder',
      'disabled'
    ]

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
   * 格式化数据
   * @param {string} val 值
   */
  formatValue (val) {
    const { min } = this.props
    let _val = Number(val)
    if (Number.isNaN(Number(_val))) {
      _val = min && min > 0 ? min : 0
    }
    return _val
  }

  render () {
    const { className, id, disabled } = this.props
    const { min = -1 * Infinity, max = Infinity, step, theme } = this.props
    let { valueTrue } = this.state
    const { defaultValue, ...attrs } = this.attrs
    const filterAttrs = filterObjProps(attrs, [
      'locale',
      'theme',
      'localeDatas',
      'localedatas',
      'innerRef'
    ])

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
            className={`hi-counter-minus hi-counter-sign ${
              isMinusDisabled ? 'disabled' : ''
            }`}
            onClick={e => {
              let value = new Decimal(this.getInputNumber())
                .minus(step)
                .valueOf()
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
                value: this.formatValue(value),
                valueTrue: this.formatValue(value)
              })
            }}
            onBlur={e => {
              let value = this.getInputNumber()

              this.update(value)
            }}
          />
          <span
            className={`hi-counter-plus hi-counter-sign ${
              isAddDisabled ? 'disabled' : ''
            }`}
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
    let _value = value
    if (this.props.hasOwnProperty('value')) {
      _value = this.props.value
      this.setState({
        value: this.formatValue(_value),
        valueTrue: this.formatValue(_value)
      })
    } else {
      this.setState({
        value: this.formatValue(value),
        valueTrue: this.formatValue(value)
      })
    }

    setTimeout(() => {
      this._Input.value = value
      onChange &&
        onChange(
          {
            target: this._Input
          },
          this.formatValue(value)
        )
    }, 0)
  }

  getInputNumber () {
    const { max, min } = this.props
    let value = this.valueTrue
    if (isNaN(value)) {
      value = 0
    }
    value = max && value - max >= 0 ? max : value
    value = min && value - min <= 0 ? min : value
    return value
  }

  get valueTrue () {
    return parseFloat(
      this.state.value.toString().replace(/[^0-9|.|\-(e+)]+/, '')
    )
  }

  get willReachMax () {
    const { max = Infinity, step } = this.props

    let num =
      new Decimal(this.valueTrue).plus(step > 0 ? step : -step).valueOf() * 1
    return max <= num
  }

  get willReachMin () {
    const { min = -1 * Infinity, step } = this.props
    let num =
      new Decimal(this.valueTrue).minus(step > 0 ? step : -step).valueOf() * 1
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
