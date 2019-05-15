import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Provider from '../context'
import './style/index'

class Switch extends Component {
  componentDidMount () {

  }
  constructor (props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.checked !== this.state.checked) {
      this.setState({
        checked: nextProps.checked
      }, () => {
        this.props.onChange(nextProps.checked)
      })
    }
  }
  clickEvent () {
    const { disabled, onChange } = this.props
    if (!disabled) {
      this.setState({
        checked: !this.state.checked
      }, () => {
        onChange(this.state.checked)
      })
    }
  }
  render () {
    const { theme, content, disabled } = this.props
    const { checked } = this.state
    const sCls = classNames(
      'theme__' + theme,
      'hi-switch',
      !checked && 'hi-switch--closed',
      disabled && 'hi-switch--disabled'
    )
    return <span
      className={sCls}
      onClick={this.clickEvent.bind(this)}
    >
      <span className='hi-switch__text'>
        {
          content.length > 0 && (
            checked ? content[0] : content[1]
          )
        }
      </span>
    </span>
  }
}
Switch.defaultProps = {
  content: [],
  checked: false,
  disabled: false,
  onChange: () => {}
}
Switch.propTypes = {
  content: PropTypes.array,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func
}
export default Provider(Switch)
