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
      'warning', // deprecated
      'info' // deprecated
    ]),
    size: PropTypes.oneOf(['large', 'small', 'normal']),
    appearance: PropTypes.oneOf([
      'button',
      'link',
      'line' // deprecated
    ]),
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
      onContextMenu,
      onMouseOver,
      onMouseOut,
      onMouseEnter,
      onMouseLeave,
      href,
      style,
      children,
      target
    } = this.props
    const isDisabled = disabled || loading
    const classes = classNames(
      'theme__' + theme,
      `hi-btn`,
      className,
      appearance && `hi-btn--appearance--${appearance}`,
      size && `hi-btn--size--${size}`,
      isDisabled && `hi-btn--disabled`,
      loading && `hi-btn--loading`,
      {
        'hi-btn--icon': (function () {
          // Detect if children is empty
          if (!children || (typeof children === 'string' && !children.trim())) return true

          // Detect if children is an Icon
          if (React.isValidElement(children) && children.type.name === 'Icon') return true
        })()
      },

      // For version < 1.1.0
      type === 'primary' && appearance === 'line'
        ? `hi-btn--type--line`
        : `hi-btn--type--${type}`
    )

    const restProps = { href, style, onClick, disabled: isDisabled, onContextMenu, onMouseOver, onMouseEnter, onMouseLeave, onMouseOut, target }

    deprecatedPropsCheck(this.deprecatedProps, this.props, 'Button')

    return (
      <ButtonWrapper className={classes} {...restProps}>
        {loading && <IconLoading />}
        {icon && !loading && <Icon name={icon} />}
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
export {
  Button
}
