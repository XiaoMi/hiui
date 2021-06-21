import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'

const prefixCls = 'hi-checkbox'

class Checkbox extends Component {
  static displayName = 'Checkbox'
  constructor(props) {
    super(props)
    this.state = getChecked(props)
  }

  static getDerivedStateFromProps(nextProps) {
    if (hasChecked(nextProps)) {
      return getChecked(nextProps)
    }
    return null
  }

  handleChange = (event) => {
    const { onChange } = this.props
    onChange && onChange(event)
    hasChecked(this.props) ||
      this.setState({
        checked: event.target.checked
      })
  }

  render() {
    const {
      autoFocus,
      className,
      children,
      disabled,
      indeterminate,
      style,
      theme,
      name,
      value,
      focusable = true
    } = this.props
    const { checked } = this.state
    const checkboxCls = classNames(prefixCls, className, disabled && `${prefixCls}--disabled`, `theme__${theme}`)
    const inputCls = classNames(
      `${prefixCls}__input`,
      checked && !indeterminate && `${prefixCls}__input--checked`,
      indeterminate && `${prefixCls}__input--indeterminate`
    )
    return (
      <label className={checkboxCls} style={style}>
        <input
          type="checkbox"
          autoFocus={autoFocus}
          onChange={this.handleChange}
          checked={checked}
          disabled={disabled}
          name={name}
          value={value}
          tabIndex={focusable ? 0 : -1}
        />
        <span className={inputCls} />
        {children !== undefined && <span className={`${prefixCls}__text`}>{children}</span>}
      </label>
    )
  }
}

Checkbox.propTypes = {
  checked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  className: PropTypes.string,
  style: PropTypes.object,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func
}

Checkbox.defaultProps = {
  defaultChecked: false
}

Checkbox._displayName = 'Checkbox'

function hasChecked(props) {
  const has = (key) => Object.prototype.hasOwnProperty.call(props, key)
  return has('checked')
}

function getChecked(props) {
  const { checked, defaultChecked } = props
  return {
    checked: hasChecked(props) ? checked || false : defaultChecked
  }
}

export default Provider(Checkbox)
