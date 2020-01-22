import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'
import Provider from '../context'
class Tag extends Component {
  static propTypes = {
    type: PropTypes.oneOf([
      'primary',
      'success',
      'warning',
      'danger'
    ]),
    appearance: PropTypes.oneOf([
      'default',
      'line'
    ]),
    onClick: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  }

  static defaultProps = {
    type: 'primary',
    appearance: 'default'
  }

  render () {
    const prefixCls = 'hi-tag'
    const {children, type, appearance, onClick, style, className, theme} = this.props
    const eleClass = classNames(
      `theme__${theme}`,
      `${prefixCls}__container`,
      className,
      onClick && `${prefixCls}__container--click`,
      `${prefixCls}__container--${type}`,
      `${prefixCls}__container--${appearance}`
    )

    const restProps = { style, onClick }

    return (
      <div className={eleClass} {...restProps}>
        {children}
      </div>
    )
  }
}

export default Provider(Tag)
