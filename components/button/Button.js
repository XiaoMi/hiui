import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'
import deprecatedPropsCheck from '../_util/deprecatedPropsCheck'

class Button extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['primary', 'line', 'success', 'danger', 'default', 'warning', 'info']),
    size: PropTypes.oneOf(['large', 'small', 'normal']),
    appearance: PropTypes.oneOf(['link', 'button', 'line']),
    className: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    href: PropTypes.string,
    target: PropTypes.oneOf(['_self', '_blank', '_parent', '_top'])
  }

  deprecatedProps = {
    type: ['info'],
    appearance: ['line']
  }

  static defaultProps = {
    prefixCls: 'hi-btn',
    type: 'default',
    disabled: false,
    appearance: 'button',
    size: 'normal'
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
      appearance && `${prefixCls}--appearance--${appearance}`,
      size && `${prefixCls}--size--${size}`,
      disabled && `${prefixCls}--disabled`,

      // For version < 1.1.0
      (type === 'primary' && appearance === 'line')
        ? `${prefixCls}--type--line`
        : `${prefixCls}--type--${type}`
    )

    const disabledBool = !!disabled

    deprecatedPropsCheck(this.deprecatedProps, this.props, 'Button')

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
