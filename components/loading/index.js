import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './style/index'

const loadingInstance = {}

const prefixCls = 'hi-loading'
class Loading extends Component {
  static propTypes = {
    size: PropTypes.oneOf(['large', 'default', 'small']),
    full: PropTypes.bool,
    visible: PropTypes.bool,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    target: PropTypes.any,
    duration: PropTypes.number
  }
  static defaultProps = {
    size: 'default'
  }
  render () {
    const { size, full, content, visible, children, target } = this.props
    const mountNode = target || (full ? document.body : '')
    const iconCls = classNames(`${prefixCls}__icon`, `${prefixCls}__icon--${size}`)
    const maskCls = classNames(`${prefixCls}__mask`, {
      [`${prefixCls}__mask--global`]: full,
      [`${prefixCls}__mask--part`]: !full,
      [`${prefixCls}__mask--hide`]: visible === false
    })
    return (
      <PortalWrapper mountNode={mountNode}>
        {children}
        <div className={maskCls}>
          <div className={`${prefixCls}__outter`}>
            <div className={iconCls}>
              <div />
              <div />
            </div>
            <div className={`${prefixCls}__text`}>{content}</div>
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

function open (target, { content, key, duration, size } = {}) {
  let renderNode = document.createElement('div')
  const mountNode = target || document.body
  window.getComputedStyle(mountNode).position === 'absolute' ||
    mountNode.style.setProperty('position', 'relative')
  const full = !target
  ReactDOM.render(<Loading {...{ content, full, visible: true, target: mountNode }} />, renderNode)

  loadingInstance[key] = renderNode
}
function deprecatedOpen ({ target, tip } = {}) {
  let renderNode = document.createElement('div')
  const mountNode = target || document.body
  window.getComputedStyle(mountNode).position === 'absolute' ||
    mountNode.style.setProperty('position', 'relative')
  const full = !target
  ReactDOM.render(<Loading {...{ tip, full, show: true, target: mountNode }} />, renderNode)
  function close () {
    renderNode && ReactDOM.unmountComponentAtNode(renderNode)
    renderNode = undefined
  }
  return { close }
}

function openWrapper (target, options) {
  if (target === null || (target && React.isValidElement(React.cloneElement(target)))) {
    open(target, options)
  } else {
    return deprecatedOpen(target)
  }
}
function close (key) {
  if (loadingInstance[key]) {
    ReactDOM.unmountComponentAtNode(loadingInstance[key])
    loadingInstance[key].parentNode && loadingInstance[key].parentNode.removeChild(loadingInstance[key])
  }
}

Loading.open = openWrapper
Loading.close = close

export default Loading
