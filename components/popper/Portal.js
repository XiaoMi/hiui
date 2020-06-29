/**
 * 指定挂载点
 */
/* eslint-disable-next-line */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

const getNodeName = element => {
  return element ? (element.nodeName || '').toLowerCase() : null
}
const ownerDocument = node => {
  return (node && node.ownerDocument) || document
}

const resolveContainerRef = ref => {
  if (typeof document === 'undefined') return null
  if (ref == null) return ownerDocument().body
  if (typeof ref === 'function') ref = ref()

  if (ref && 'current' in ref) ref = ref.current
  if (ref && ref.nodeType) return ref || null

  return null
}
class Portal extends Component {
  constructor (props) {
    super(props)
    const { container } = props
    this.state = {
      resolvedContainer: resolveContainerRef(container)
    }
  }
  static getDerivedStateFromProps (nextProps) {
    const { container } = nextProps
    return { resolvedContainer: resolveContainerRef(container) }
  }
  render () {
    const { children, container } = this.props
    let { resolvedContainer } = this.state
    if (!resolvedContainer) {
      const earlyRef = resolveContainerRef(container)
      if (earlyRef) {
        resolvedContainer = earlyRef
      }
    }
    resolvedContainer = ['html', 'body', '#document'].includes(
      getNodeName(resolvedContainer)
    )
      ? document.body
      : resolvedContainer
    return children && resolvedContainer ? (
      <>{ReactDOM.createPortal(children, resolvedContainer)}</>
    ) : null
  }
}

Portal.displayName = 'Portal'
Portal.propTypes = {
  container: PropTypes.any,
  onRendered: PropTypes.func
}

export default Portal
