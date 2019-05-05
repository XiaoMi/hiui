import React from 'react'
import PropTypes from 'prop-types'
import './style/index'

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
    // prefixCls: 'hi-collapse',
    // activeIndex: 1
    value: 0,
    step: 1
    // max: null,
    // min: null
  }

  constructor (props) {
    super(props)

    const oldProps = Object.assign({}, this.props)

    this.attrs = this.getAttrs(oldProps)

    const val = +this.props.value
    const value =
      val > +this.props.max ? +this.props.max : val < +this.props.min ? +this.props.min : val

    this.state = {
      value: this.format(value),
      valueTrue: this.formatValue(value)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value && +nextProps.value !== +this.props.value) {
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

  /**
   * minus plus 事件
   * @param {string} minus 类型
   * @param {string} plus 类型
   */
  signEvent (type, disabled) {
    const min = +this.props.min
    const max = +this.props.max
    const step = +this.props.step

    if (disabled) {
      return false
    }

    let valueTrue = +this.state.valueTrue
    const steps = +step

    switch (type) {
      case 'minus':
        valueTrue -= steps

        if (valueTrue < min) {
          valueTrue = min
        }
        break
      case 'plus':
        valueTrue += steps

        if (valueTrue > max) {
          valueTrue = max
        }
        break
      default:
    }

    const value = this.format(valueTrue + '')
    this.setState({ value, valueTrue }, () => {
      const e = {
        target: this._Input
      }
      this.props.onChange && this.props.onChange(e, valueTrue)
    })
  }

  render () {
    const { className, id, disabled } = this.props
    const min = +this.props.min
    const max = +this.props.max
    let { value, valueTrue } = this.state

    return (
      <div className={`hi-counter ${className || ''}`} id={id}>
        <div className={`hi-counter-outer`}>
          <span
            className={`hi-counter-minus hi-counter-sign ${
              (min !== undefined && this.state.valueTrue <= min) || disabled ? 'disabled' : ''
            }`}
            onClick={e => {
              this.signEvent(
                'minus',
                (min !== undefined && this.state.valueTrue <= min) || disabled
              )
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
            {...this.attrs}
            onChange={e => {
              e.persist()

              let value = e.target.value
              value = this.format(value)
              let valueTrue = this.formatValue(value)
              this.setState({ value, valueTrue })
            }}
            onBlur={e => {
              e.persist()
              if (typeof min !== 'undefined' && +valueTrue < min) {
                value = this.format(min)
                valueTrue = min
              } else if (typeof max !== 'undefined' && +valueTrue > max) {
                value = this.format(max)
                valueTrue = max
              } else {
                value = this.format(valueTrue)
              }
              this.setState({ value, valueTrue }, () => {
                this.props.onChange && this.props.onChange(e, valueTrue)
              })
            }}
          />
          <span
            className={`hi-counter-plus hi-counter-sign ${
              (max !== undefined && this.state.valueTrue >= max) || disabled ? 'disabled' : ''
            }`}
            onClick={e => {
              this.signEvent('plus', (max !== undefined && this.state.valueTrue >= max) || disabled)
            }}
          >
            +
          </span>
        </div>
      </div>
    )
  }
}

export default Counter
