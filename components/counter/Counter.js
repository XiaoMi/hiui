import React from 'react'
import PropTypes from 'prop-types'
import { filterObjProps } from '../input/util'

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
    const finalValue = Math.min(Math.max(Number(value === undefined ? defaultValue : value), Number(min)), Number(max))
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
    const type = typeof value
    if (type !== 'string' && type !== 'number') {
      value = ''
    }

    return isNaN(Number(value)) ? value.toString().replace(/[^-\d]/g, '') : value
  }

  /**
   * 格式化数据
   * 88,888
   * @param {string} val 值
   */
  format (val) {
    return (
      val &&
      (val.toString().indexOf('.') !== -1
        ? val.toString().replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {
          return $1 + ','
        })
        : val.toString().replace(/(\d)(?=(\d{3}))/g, ($0, $1) => {
          return $1 + ','
        }))
    )
  }

  render () {
    const { className, id, disabled } = this.props
    const {
      min = -1 * Infinity,
      max = Infinity,
      step
    } = this.props
    let { valueTrue } = this.state
    const { defaultValue, ...attrs } = this.attrs
    const filterAttrs = filterObjProps(attrs, ['locale', 'theme', 'localeDatas', 'localedatas'])
    return (
      <div className={`hi-counter ${className || ''}`} id={id}>
        <div className={`hi-counter-outer`}>
          <span
            className={`hi-counter-minus hi-counter-sign ${this.hasReachedMin ? 'disabled' : ''}`}
            onClick={e => {
              let value = valueTrue - parseInt(step)
              if (this.willReachMin) {
                value = min
              }
              if (this.hasReachedMin) {
                return
              }
              this.update(value)
            }}
          >
            -
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
            className={`hi-counter-plus hi-counter-sign ${this.hasReachedMax ? 'disabled' : ''}`}
            onClick={e => {
              let value = parseInt(valueTrue) + parseInt(step)
              if (this.willReachMax) {
                value = max
              }
              if (this.hasReachedMax) {
                return
              }
              this.update(value)
            }}
          >
            +
          </span>
        </div>
      </div>
    )
  }

  update (value) {
    const {
      onChange
    } = this.props
    if (!this.props.hasOwnProperty('value')) {
      this.setState({
        value: this.format(value),
        valueTrue: this.formatValue(value)
      })
    }
    onChange && onChange({
      target: this._Input
    }, value)
  }

  getInputNumber () {
    const {
      max = Infinity,
      min = 0
    } = this.props
    let value = this.state.value

    if (/[^0-9]/.test(value)) {
      value = value.match(/\d/)[0]
    }

    if (value - max >= 0) {
      value = max
    }
    if (value - min <= 0) {
      value = min
    }
    return value
  }

  get willReachMax () {
    const {
      max = Infinity,
      step
    } = this.props
    return max <= this.state.valueTrue * 1 + step * 1
  }

  get willReachMin () {
    const {
      min = -1 * Infinity,
      step
    } = this.props
    return min >= parseInt(this.state.valueTrue) - parseInt(step)
  }

  get hasReachedMax () {
    const {
      max = Infinity
    } = this.props
    return max <= this.state.valueTrue
  }
  get hasReachedMin () {
    const {
      min = -1 * Infinity
    } = this.props
    return min >= this.state.valueTrue
  }
}

export default Counter
