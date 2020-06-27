import React, { useState, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import Portal from './Portal'
import Overlay from './Overlay'
import PopperJS from './utils/popper'
import useClickOutside from './utils/useClickOutside'

import './style/index'

const { getScrollParent } = new PopperJS()
const AnimationClassName = 'hi-popper_transition'
/**
 * @param {Function} onClickOutside 点击该元素外的回调方法
 */
const Popper = props => {
  const { show, attachEle } = props
  const [staticShow, setStaticShow] = useState(show)
  const [transitionShow, setTransitionShow] = useState(show)
  const [container, setContainer] = useState(props.container || document.body)

  useEffect(() => {
    const _container = attachEle ? getScrollParent(attachEle) : document.body
    setContainer(props.container || _container)
    setTransitionShow(show)
    show && setStaticShow(true)
  }, [show, attachEle])
  return (
    <div>
      <CSSTransition
        in={transitionShow}
        timeout={300}
        classNames={AnimationClassName}
        onExited={() => {
          setStaticShow(false)
        }}
      >
        <Portal container={container}>
          <Overlay {...Object.assign({}, props, {show: staticShow})} container={container} />
        </Portal>
      </CSSTransition>
    </div>
  )
}
export { Portal, useClickOutside }
export default Popper
