/**
 * 指定挂载点
 */
/* eslint-disable-next-line */
import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import useWaitForDOMRef from './useWaitForDOMRef'

const Portal = ({ container, children, onRendered }) => {
  const resolvedContainer = useWaitForDOMRef(container, onRendered)

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
