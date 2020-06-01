/**
 * 指定挂载点
 */
/* eslint-disable-next-line */
import React from 'react'
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

export default Portal
