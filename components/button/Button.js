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
    onClick: PropTypes.func,
    href: PropTypes.string,
    target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top'])
  }

  static defaultProps = {
    prefixCls: 'hi-btn',
    type: 'default',
    disabled: false,
    appearance: 'normal',
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
      href,
      target,
      theme
    } = this.props
    const classes = classNames(
      'theme__' + theme,
      `${prefixCls}`,
      className && `${className}`,
      type && appearance && `${prefixCls}-${appearance || 'default'}-${type}`,
      type && appearance && `${prefixCls}--${type}--${appearance || 'normal'}`,
      type && `${prefixCls}--${type || 'primary'}`,
      appearance && `${prefixCls}--${appearance || 'default'}`,
      disabled && `${prefixCls}--disabled`,
      size && `${prefixCls}--${size}`
    )

    const disabledBool = !!disabled
    return (
      href
        ? <a
          className={classes}
          onClick={() => this.clickCb()}
          style={style}
          title={title}
          href={href}
          target={target}
        >
          {this.props.children}
        </a>
        : <button
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
