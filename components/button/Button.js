import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'

class Button extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['primary', 'line', 'success', 'danger', 'default', 'warning']),
    size: PropTypes.oneOf(['large', 'small', 'default']),
    appearance: PropTypes.oneOf(['link', 'default', 'line']),
    className: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    href: PropTypes.string,
    target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top'])
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
      href,
      target,
      theme
    } = this.props
    const classes = classNames(
      'theme__' + theme,
      `${prefixCls}`,
      className && `${className}`,
      // For version < 1.1.0
      (type === 'primary' && appearance === 'line')
        ? `${prefixCls}--type_line`
        : `${prefixCls}--type_${type || 'default'}`,
      appearance && `${prefixCls}--appearance_${appearance || 'default'}`,
      size && `${prefixCls}--size_${size}`,
      disabled && `${prefixCls}--disabled`
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
