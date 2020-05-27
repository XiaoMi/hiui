import React, { useState, useEffect } from 'react'
import Portal from './Portal'
import Overlay from './Overlay'
import PopperJS from './popper'
const { getScrollParent } = new PopperJS()

const Popper = props => {
  const [container, setContainer] = useState(null)
  const { show, attachEle } = props
  useEffect(() => {
    let _container = attachEle ? getScrollParent(attachEle) : null
    setContainer(_container)
  }, [show, attachEle])

  return (
    <Portal container={container}>
      <Overlay {...props} container={container} />
    </Portal>
  )
}

export default Popper
