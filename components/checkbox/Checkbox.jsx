import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'

const prefixCls = 'hi-checkbox'

class Checkbox extends Component {
  render () {
    const { children, disabled } = this.props
    const checkboxCls = classNames(
      prefixCls,
      disabled && `${prefixCls}--disabled`
    )
    const inputCls = classNames(`${prefixCls}__input`)
    return (
      <label className={checkboxCls}>
        <span className={inputCls} />
        <span>{children}</span>
      </label>
    )
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}

Checkbox.defaultProps = {
  onChange: () => {}
}

export default Provider(Checkbox)
