/**
 * 指定挂载点
 */
/* eslint-disable-next-line */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import useWaitForDOMRef from './utils/useWaitForDOMRef'

const getNodeName = element => {
  return element ? (element.nodeName || '').toLowerCase() : null
}
const Portal = ({ container, children, onRendered }) => {
  let resolvedContainer = useWaitForDOMRef(container, onRendered)
  resolvedContainer = ['html', 'body', '#document'].includes(
    getNodeName(resolvedContainer)
  )
    ? document.body
    : resolvedContainer

  return children && resolvedContainer ? (
    <>{ReactDOM.createPortal(children, resolvedContainer)}</>
  ) : null
}

Portal.displayName = 'Portal'
Portal.propTypes = {
  container: PropTypes.any,
  onRendered: PropTypes.func
}

function useWaitForDOMRef1 (ref, onResolved) {
  const [resolvedRef, setRef] = useState(() => resolveContainerRef(ref))

  if (!resolvedRef) {
    const earlyRef = resolveContainerRef(ref)
    if (earlyRef) setRef(earlyRef)
  }

  useEffect(() => {
    if (onResolved && resolvedRef) {
      onResolved(resolvedRef)
    }
  }, [onResolved, resolvedRef])

  useEffect(() => {
    const nextRef = resolveContainerRef(ref)
    if (nextRef !== resolvedRef) {
      setRef(nextRef)
    }
  }, [ref, resolvedRef])

  return resolvedRef
}
const resolveContainerRef = ref => {
  if (typeof document === 'undefined') return null
  if (ref == null) return ownerDocument().body
  if (typeof ref === 'function') ref = ref()

  if (ref && 'current' in ref) ref = ref.current
  if (ref && ref.nodeType) return ref || null

  return null
}
class Portal1 extends Component {
  constructor (props) {
    super(props)
    const { container } = props
    this.state = {
      resolvedContainer: () => resolveContainerRef(container)
    }
  }
  static getDerivedStateFromProps (nextProps) {
    const { container } = nextProps
    return { resolvedContainer: () => resolveContainerRef(container) }
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

export default Portal
