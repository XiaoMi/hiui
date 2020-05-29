import React, { useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import Portal from './Portal'
import Overlay from './Overlay'
import PopperJS from './popper'

import './style/index'

const { getScrollParent } = new PopperJS()
const AnimationClassName = 'hi-popper_transition'
/**
 * container 以指定的container为主
 * preventOverflow 防止溢出
 */
const Popper = props => {
  const { show, attachEle } = props
  const [transitionShow, setTransitionShow] = useState(show)
  const [container, setContainer] = useState(props.container || document.body)

  const preventOverflow = true
  useEffect(() => {
    const _container = attachEle ? getScrollParent(attachEle) : document.body
    setContainer(props.container || _container)
    setTransitionShow(show)
  }, [show, attachEle])
  return (
    <CSSTransition
      in={transitionShow}
      timeout={200}
      classNames={AnimationClassName}
    >
      <Portal container={container}>
        <Overlay
          {...Object.assign({}, props, { show: transitionShow })}
          container={container}
          preventOverflow={preventOverflow}
        />
      </Portal>
    </CSSTransition>
  )
}
export { Portal }
export default Popper
