import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'

class Button extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['default', 'primary', 'success', 'info', 'warning', 'danger']),
    size: PropTypes.oneOf(['large', 'small', 'default']),
    className: PropTypes.string,
    style: PropTypes.object,
    appearance: PropTypes.oneOf(['default', 'link', 'line']),
    disabled: PropTypes.bool,
    onClick: PropTypes.func
  }

  static defaultProps = {
    prefixCls: 'hi-btn',
    type: 'default',
    disabled: false,
    appearance: 'default',
    size: 'default'
  }

  clickCb () {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render () {
    const {
      type,
      disabled,
      className,
      size,
      prefixCls,
      appearance,
      style,
      title,
      theme
    } = this.props
    const classes = classNames(
      theme,
      `${prefixCls}`,
      className && `${className}`,
      type && appearance && `${prefixCls}-${appearance || 'default'}-${type}`,
      disabled && `${prefixCls}-disabled`,
      size && `${prefixCls}-${size}`
    )

    const disabledBool = !!disabled
    return (
      <button
        className={classes}
        disabled={disabledBool}
        onClick={() => this.clickCb()}
        style={style}
        title={title}
        type='button'
      >
        {this.props.children}
      </button>
    )
  }
}

export default Provider(Button)
