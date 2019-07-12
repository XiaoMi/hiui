import React, { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'
import './style/index'

const prefixCls = 'hi-tooltip'

class Tooltip extends Component {
  static propTypes = {
    defaultVisible: PropTypes.bool,
    placement: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    placement: 'top',
    defaultVisible: false,
    onClick: () => {}
  }

  state = {
    tooltipShow: this.props.defaultVisible
  }

  render () {
    const { placement, style, className, onClick, title, children } = this.props
    const eleClass = classNames(
      `${prefixCls}-base`,
      placement && `${prefixCls}-${placement}`
    )
    const { tooltipShow } = this.state
    return (
      <div
        className={classNames(prefixCls, className)}
        style={style}
        onMouseEnter={() => {
          this.setState({ tooltipShow: true })
        }}
        onMouseLeave={() => {
          this.setState({ tooltipShow: false })
        }}
        onClick={() => {
          onClick && onClick()
        }}
        ref={(node) => {
          this.tooltipContainer = node
        }}
      >
        <Popper
          className={`${prefixCls}__popper`}
          show={tooltipShow}
          attachEle={this.tooltipContainer}
          placement={placement}
          zIndex={1070}
          width='auto'
        >
          <div className={eleClass}>{title}</div>
        </Popper>
        {children}
      </div>
    )
  }
}

function open ({ target, placement = 'top', title }) {
  let mountNode = document.createElement('div')
  const eleClass = classNames(
    `${prefixCls}-base`,
    placement && `${prefixCls}-${placement}`
  )
  render(
    <Popper
      className={`${prefixCls}__popper`}
      show
      attachEle={target}
      placement={placement}
      zIndex={1070}
      width='auto'
    >
      <div className={eleClass}>{title}</div>
    </Popper>,
    mountNode
  )
  function close () {
    mountNode && unmountComponentAtNode(mountNode)
    mountNode = undefined
  }
  return { close }
}

Tooltip.open = open

export default Tooltip
