import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './style/index'

const prefixCls = 'hi-loading'

class Loading extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['large', 'default', 'small']),
    full: PropTypes.bool,
    show: PropTypes.bool,
    tip: PropTypes.string,
    target: PropTypes.any
  }
  static defaultProps = {
    size: 'default'
  }
  render () {
    const { size, full, tip, show, children, target  } = this.props
    const mountNode = target || (full ? document.body : '')
    const iconCls = classNames(
      `${prefixCls}__icon`,
      `${prefixCls}__icon--${size}`
    )
    const maskCls = classNames(`${prefixCls}__mask`, {
      [`${prefixCls}__mask--global`]: full,
      [`${prefixCls}__mask--part`]: !full,
      [`${prefixCls}__mask--hide`]: show === false
    })
    return (
      <PortalWrapper mountNode={mountNode}>
        {children}
        <div className={maskCls}>
          <div className={`${prefixCls}__outter`}>
            <div className={iconCls}>
              <div /><div />
            </div>
            <div className={`${prefixCls}__text`}>{tip}</div>
          </div>
        </div>
      </PortalWrapper>
    )
  }
}

function PortalWrapper ({ mountNode, children }) {
  return mountNode ? (
    ReactDOM.createPortal(children, mountNode)
  ) : (
    <div className={`${prefixCls}__wrapper`}>{children}</div>
  )
}

function open ({ target, tip } = {}) {
  let renderNode = document.createElement('div')
  const mountNode = target || document.body
  window.getComputedStyle(mountNode).position === 'absolute' ||
    mountNode.style.setProperty('position', 'relative')
  const full = !target
  ReactDOM.render(
    <Loading {...{ tip, full, show: true, target: mountNode }} />,
    renderNode
  )
  function close () {
    renderNode && ReactDOM.unmountComponentAtNode(renderNode)
    renderNode = undefined
  }
  return { close }
}

Loading.open = open

export default Loading
