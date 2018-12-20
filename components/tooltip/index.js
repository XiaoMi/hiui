import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'
import './style/index'

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
        ref={node => { this.tooltipContainer = node }}
      >
        <Popper
          className='hi-tooltip__popper'
          show={tooltipShow}
          attachEle={this.tooltipContainer}
          placement={placement}
          zIndex={1070}
          width='auto'
        >
          <div ref='popper' className={classNames(eleClass)}>
            {this.props.title}
          </div>
        </Popper>

        {this.props.children}
      </div>
    )
  }
}

export default Tooltip
