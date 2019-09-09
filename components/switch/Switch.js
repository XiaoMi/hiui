import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Switch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      checked:
        props.checked !== undefined ? props.checked : props.defaultChecked
    }
  }

  static getDerivedStateFromProps (nextProps) {
    if (nextProps.checked !== undefined) {
      return {
        checked: nextProps.checked
      }
    }
    return null
  }

  handleSwitchClick = (event) => {
    const { disabled, onChange, onClick } = this.props
    const { checked } = this.state
    if (disabled) return
    onClick(!checked, event)
    onChange(!checked, event)
    this.props.checked === undefined && this.setState({ checked: !checked })
  }

  render () {
    const { className, style, theme, content, disabled } = this.props
    const { checked } = this.state
    const sCls = classNames(
      className,
      'theme__' + theme,
      'hi-switch',
      !checked && 'hi-switch--closed',
      disabled && 'hi-switch--disabled'
    )
    return (
      <span className={sCls} onClick={this.handleSwitchClick} style={style}>
        <span className='hi-switch__dot' />
        <span className='hi-switch__text'>
          {content.length > 0 && (checked ? content[0] : content[1])}
        </span>
      </span>
    )
  }
}

Switch.defaultProps = {
  content: [],
  defaultChecked: false,
  disabled: false,
  onClick: () => {},
  onChange: () => {}
}

Switch.propTypes = {
  content: PropTypes.array,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func
}

export default Switch
