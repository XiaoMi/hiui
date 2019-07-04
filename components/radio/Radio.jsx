import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Provider from '../context'
import Button from '../button'

const prefixCls = 'hi-radio'

class Radio extends React.Component {
  constructor (props) {
    super(props)
    this.state = getChecked(props)
  }
  static getDerivedStateFromProps (nextProps) {
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
  render () {
    const {
      autoFocus,
      className,
      children,
      disabled,
      style,
      type,
      value
    } = this.props
    const shouldUseButton = type === 'button'
    const { checked } = this.state
    const radioCls = classNames(
      className,
      prefixCls,
      disabled && `${prefixCls}--disabled`,
      shouldUseButton && checked && `${prefixCls}__button--checked`
    )
    const inputCls = classNames(
      `${prefixCls}__input`,
      checked && `${prefixCls}__input--checked`
    )
    const buttonCls = classNames(
      `${prefixCls}__button`,
      checked && `${prefixCls}__button--checked`
    )
    return (
      <RadioWrapper type={type} className={buttonCls} disabled={disabled}>
        <label className={radioCls} style={style}>
          <input
            type='radio'
            checked={checked}
            autoFocus={autoFocus}
            disabled={disabled}
            value={value}
            onChange={this.handleChange}
          />
          <span className={inputCls} />
          <span className={`${prefixCls}__text`}>{children}</span>
        </label>
      </RadioWrapper>
    )
  }
}

function RadioWrapper ({ children, type, ...restProps }) {
  const shouldUseButton = type === 'button'
  return shouldUseButton ? (
    <Button {...restProps}>{children}</Button>
  ) : (
    <React.Fragment>{children}</React.Fragment>
  )
}

function hasChecked (props) {
  return Object.prototype.hasOwnProperty.call(props, 'checked')
}

function getChecked (props) {
  const { checked, defaultChecked } = props
  return { checked: hasChecked(props) ? checked : defaultChecked }
}

Radio.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.oneOf(['default', 'button']),
  autoFocus: PropTypes.bool,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func
}

Radio.defaultProps = {
  defaultChecked: false,
  type: 'default'
}

export default Provider(Radio)
