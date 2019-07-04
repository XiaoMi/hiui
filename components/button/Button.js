import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'
import Icon from '../icon'
import IconLoading from './IconLoading'
import deprecatedPropsCheck from '../_util/deprecatedPropsCheck'

class Button extends Component {
  static propTypes = {
    type: PropTypes.oneOf([
      'primary',
      'line',
      'success',
      'danger',
      'default',
      'warning',
      'info'
    ]),
    size: PropTypes.oneOf(['large', 'small', 'normal']),
    appearance: PropTypes.oneOf(['link', 'button', 'line']),
    className: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    href: PropTypes.string,
    loading: PropTypes.bool,
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

  render () {
    const {
      className,
      size,
      disabled,
      type,
      appearance,
      theme,
      icon,
      loading,
      onClick,
      href,
      style,
      children
    } = this.props
    const classes = classNames(
      'theme__' + theme,
      `hi-btn`,
      className,
      appearance && `hi-btn--appearance--${appearance}`,
      size && `hi-btn--size--${size}`,
      disabled && `hi-btn--disabled`,
      icon && `hi-btn--icon`,
      loading && `hi-btn--loading`,

      // For version < 1.1.0
      type === 'primary' && appearance === 'line'
        ? `hi-btn--type--line`
        : `hi-btn--type--${type}`
    )
    const restProps = { href, style, onClick, disabled }

    deprecatedPropsCheck(this.deprecatedProps, this.props, 'Button')

    return (
      <ButtonWrapper className={classes} {...restProps}>
        {loading && <IconLoading />}
        {icon && !loading && <Icon name={icon} />}
        {(icon || loading) && children && (
          <span className='hi-btn--icon__spacer' />
        )}
        {children}
      </ButtonWrapper>
    )
  }
}

function ButtonWrapper ({ children, ...restProps }) {
  return restProps.href ? (
    <a {...restProps}>{children}</a>
  ) : (
    <button {...restProps} type='button'>
      {children}
    </button>
  )
}

export default Provider(Button)
