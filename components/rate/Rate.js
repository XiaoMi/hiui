import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import * as Icons from './Icons'
import ToolTip from '../tooltip'

class Rate extends Component {
  static propTypes = {
    useEmoji: PropTypes.bool,
    allowClear: PropTypes.bool,
    allowHalf: PropTypes.bool,
    className: PropTypes.string,
    defaultValue: PropTypes.number,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    tooltips: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.number,
    count: PropTypes.number,
    onChange: PropTypes.func
  }
  static defaultProps = {
    allowClear: true,
    value: undefined,
    defaultValue: 0,
    count: 5,
    prefixCls: 'hi-rate',
    tooltips: [],
    onChange: () => {}
  }
  static getDerivedStateFromProps ({ value }) {
    if (value || value === 0) {
      return {
        value
      }
    }
  }
  state = {
    value: 0,
    hoverValue: 0
  }
  componentDidMount () {
    this.initValue()
  }
  initValue = () => {
    const { value, defaultValue } = this.props
    this.setState({
      value: (value || value === 0) ? value : defaultValue
    })
  }
  renderIcon = (idx) => {
    const { useEmoji, allowHalf, disabled } = this.props
    const { value, hoverValue } = this.state
    let currentValue = hoverValue || value
    if (!allowHalf || useEmoji) {
      currentValue = Math.ceil(currentValue)
    }
    return (
      <Icon {...{ value: idx, currentValue, disabled, useEmoji, allowHalf }} />
    )
  }
  handleIconClick = (value) => {
    const { allowHalf, allowClear, onChange, disabled } = this.props
    if (disabled) {
      return
    }
    if (!allowHalf) {
      value = Math.ceil(value)
    }
    if (value === this.state.value && allowClear) {
      this.setState({
        value: 0
      })
      return
    }
    onChange && onChange(value)
    this.setState({ value })
  }
  handleIconEnter = (hoverValue) => {
    if (this.props.disabled) {
      return
    }
    this.setState({ hoverValue })
  }
  handleIconLeave = () => {
    if (this.props.disabled) {
      return
    }
    this.setState({ hoverValue: 0 })
  }
  render () {
    const {
      className,
      style,
      count,
      useEmoji,
      prefixCls,
      tooltips,
      disabled
    } = this.props
    const iconCount = Math.ceil(useEmoji ? 5 : count)
    const iconHalfCls = `${prefixCls}__star__half`
    const starCls = classnames(`${prefixCls}__star`, {
      [`${prefixCls}__star--disabled`]: disabled
    })
    return (
      <ul
        className={classnames(prefixCls, className)}
        style={style}
        onMouseLeave={this.handleIconLeave}
      >
        {Array(iconCount)
          .fill()
          .map((_, idx) => {
            const value = idx + 1
            const halfValue = idx + 0.5
            return (
              <ToolTipWrapper title={tooltips[idx]} key={idx}>
                <li className={starCls}>
                  <div
                    className={classnames(iconHalfCls, `${iconHalfCls}--left`)}
                    onMouseEnter={() => this.handleIconEnter(halfValue)}
                    onMouseMove={() => this.handleIconEnter(halfValue)}
                    onClick={() => this.handleIconClick(halfValue)}
                  />
                  <div
                    className={classnames(iconHalfCls, `${iconHalfCls}--right`)}
                    onMouseEnter={() => this.handleIconEnter(value)}
                    onMouseMove={() => this.handleIconEnter(value)}
                    onClick={() => this.handleIconClick(value)}
                  />
                  {this.renderIcon(value)}
                </li>
              </ToolTipWrapper>
            )
          })}
      </ul>
    )
  }
}

function ToolTipWrapper ({ children, title }) {
  return title ? <ToolTip title={title}>{children}</ToolTip> : children
}

function Icon ({ value, currentValue, disabled, useEmoji, allowHalf }) {
  if (useEmoji) {
    const Emojis = [
      Icons.EmojiOne,
      Icons.EmojiTwo,
      Icons.EmojiThree,
      Icons.EmojiFour,
      Icons.EmojiFive
    ]
    if (value <= currentValue) {
      return React.createElement(Emojis[currentValue - 1])
    } else {
      return <Icons.EmojiDefault />
    }
  }
  if (value <= currentValue) {
    return <Icons.StarActive />
  } else if (value === currentValue + 0.5 && allowHalf) {
    return disabled ? <Icons.StarHalfReadonly /> : <Icons.StarHalfActive />
  } else {
    return disabled ? <Icons.StarDisable /> : <Icons.StarDefault />
  }
}

export default Rate
