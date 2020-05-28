import React, { useState, useEffect } from 'react'
import Portal from './Portal'
import Overlay from './Overlay'
import PopperJS from './popper'
const { getScrollParent } = new PopperJS()
// 指定container后  以指定的container为主
const Popper = props => {
  const [container, setContainer] = useState(props.container || document.body)
  const { show, attachEle } = props
  useEffect(() => {
    const _container = attachEle ? getScrollParent(attachEle) : document.body
    setContainer(props.container || _container)
  }, [show, attachEle])
  return (
    <Portal container={container}>
      <Overlay {...props} container={container} />
    </Portal>
  )
}

export default Popper
