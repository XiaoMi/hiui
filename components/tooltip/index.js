import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Tooltip extends Component {
  static propTypes = {
    color: PropTypes.string,
    delay: PropTypes.number,
    defaultVisible: PropTypes.bool,
    placement: PropTypes.string,
    title: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    color: '#4a4a4a',
    delay: 1000,
    placement: 'top',
    defaultVisible: false,
    prefixCls: 'hi-tooltip'
  };

  state = {
    tooltipShow: this.props.defaultVisible
  }

  render () {
    const {placement, prefixCls, style} = this.props
    const eleClass = classNames(`${prefixCls}-base`, placement && `${prefixCls}-${placement}`)
    const {tooltipShow} = this.state
    return (
      <div
        className={prefixCls}
        style={style}
        onMouseEnter={() => { this.setState({tooltipShow: true}) }}
        onMouseLeave={() => { this.setState({tooltipShow: false}) }}
      >
        <span className={eleClass + (tooltipShow ? ` ${prefixCls}-show` : '')}>{this.props.title}</span>
        {this.props.children}
      </div>
    )
  }
}

export default Tooltip
