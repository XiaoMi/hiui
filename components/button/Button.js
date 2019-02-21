import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'
import Icon from '../icon'
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
    type: 'default',
    disabled: false,
    appearance: 'button',
    size: 'normal'
  }

  clickCb (e) {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render () {
    const {
      type,
      disabled,
      className,
      size,
      appearance,
      style,
      title,
      href,
      target,
      theme,
      icon,
      children
    } = this.props
    const classes = classNames(
      'theme__' + theme,
      `hi-btn`,
      className && `${className}`,
      appearance && `hi-btn--appearance--${appearance}`,
      size && `hi-btn--size--${size}`,
      disabled && `hi-btn--disabled`,
      icon && `hi-btn--icon`,

      // For version < 1.1.0
      (type === 'primary' && appearance === 'line')
        ? `hi-btn--type--line`
        : `hi-btn--type--${type}`
    )

    const disabledBool = !!disabled

    deprecatedPropsCheck(this.deprecatedProps, this.props, 'Button')

    return (
      href
        ? <a
          className={classes}
          onClick={(e) => this.clickCb(e)}
          style={style}
          title={title}
          href={href}
          target={target}
        >
          {icon ? <Icon name={icon} /> : children}
        </a>
        : <button
          className={classes}
          disabled={disabledBool}
          onClick={(e) => this.clickCb(e)}
          style={style}
          title={title}
          type='button'
        >
          {icon ? <Icon name={icon} /> : children}
        </button>
    )
  }
}

export default Provider(Button)
