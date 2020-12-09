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

  // 兼容处理 button disabled tooltip 不消失的问题
  compatDisabledBtn = (el) => {
    if (el && el.type && el.type.IS_HI_COMPONENT && el.props.disabled) {
      return React.cloneElement(el, {
        style: {
          ...el.props.style,
          pointerEvents: 'none'
        }
      })
    } else {
      return el
    }
  }

  render() {
    const { placement, style, className, onClick, title, children, visible } = this.props
    const eleClass = classNames(`${prefixCls}-base`, placement && `${prefixCls}-${placement}`)
    const { tooltipShow } = this.state
    let timeId = null
    return (
      <div
        className={classNames(prefixCls, className)}
        style={style}
        onMouseEnter={() => {
          timeId = setTimeout(() => {
            this.setState({ tooltipShow: true })
          }, 20)
        }}
        onMouseLeave={() => {
          clearTimeout(timeId)
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
          show={[true, false].includes(visible) ? visible : tooltipShow}
          attachEle={this.tooltipContainer}
          placement={placement}
          zIndex={1070}
          width="auto"
        >
          <div className={eleClass}>{title}</div>
        </Popper>
        {this.compatDisabledBtn(children)}
      </div>
    )
  }
}

function deprecatedOpen({ target, placement = 'top', title }) {
  let mountNode = document.createElement('div')
  const eleClass = classNames(`${prefixCls}-base`, placement && `${prefixCls}-${placement}`)
  render(
    <Popper className={`${prefixCls}__popper`} show attachEle={target} placement={placement} zIndex={1070} width="auto">
      <div className={eleClass}>{title}</div>
    </Popper>,
    mountNode
  )
  function deprecatedClose() {
    mountNode && unmountComponentAtNode(mountNode)
    mountNode = undefined
  }
  return { close: deprecatedClose }
}

function open(target, { placement = 'top', title, key }) {
  const mountNode = document.createElement('div')
  const eleClass = classNames(`${prefixCls}-base`, placement && `${prefixCls}-${placement}`)
  render(
    <Popper className={`${prefixCls}__popper`} show attachEle={target} placement={placement} zIndex={1070} width="auto">
      <div className={eleClass}>{title}</div>
    </Popper>,
    mountNode
  )
  tooltipInstance[key] = mountNode
}
function close(key) {
  if (tooltipInstance[key]) {
    unmountComponentAtNode(tooltipInstance[key])
    tooltipInstance[key].parentNode && tooltipInstance[key].parentNode.removeChild(tooltipInstance[key])
  }
}

function openWrapper(target, options) {
  if (target.nodeName || (typeof target === 'object' && target.$$typeof)) {
    open(target, options)
  } else {
    return deprecatedOpen(target)
  }
}

Tooltip.open = openWrapper
Tooltip.close = close

export default Tooltip
