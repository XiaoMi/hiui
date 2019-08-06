import React, { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'
import './style/index'

const prefixCls = 'hi-tooltip'
const tooltipInstance = {}
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
    const eleClass = classNames(`${prefixCls}-base`, placement && `${prefixCls}-${placement}`)
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
        ref={node => {
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

function deprecatedOpen ({ target, placement = 'top', title }) {
  let mountNode = document.createElement('div')
  const eleClass = classNames(`${prefixCls}-base`, placement && `${prefixCls}-${placement}`)
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
  function deprecatedClose () {
    mountNode && unmountComponentAtNode(mountNode)
    mountNode = undefined
  }
  return { close: deprecatedClose }
}

function open (target, { placement = 'top', title, key }) {
  let mountNode = document.createElement('div')
  const eleClass = classNames(`${prefixCls}-base`, placement && `${prefixCls}-${placement}`)
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
  tooltipInstance[key] = mountNode
}
function close (key) {
  if (tooltipInstance[key]) {
    unmountComponentAtNode(tooltipInstance[key])
    tooltipInstance[key].parentNode &&
      tooltipInstance[key].parentNode.removeChild(tooltipInstance[key])
  }
}
function openWrapper (target, options) {
  if (React.isValidElement(React.cloneElement(target))) {
    open(target, options)
  } else {
    return deprecatedOpen(target)
  }
}

Tooltip.open = openWrapper
Tooltip.close = close

export default Tooltip
