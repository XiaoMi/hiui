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
 *
 * @param {Function} onClickOutside 点击该元素外的回调方法
 * @param {String} eventName trigger方式
 */
const Popper = props => {
  const { show, attachEle, onClickOutside, eventName = 'click' } = props
  const [container, setContainer] = useState(props.container || document.body)
  onClickOutside &&
    useClickOutside(
      e => {
        onClickOutside(e)
      },
      attachEle,
      eventName
    )
  useEffect(() => {
    const _container = attachEle ? getScrollParent(attachEle) : document.body
    setContainer(props.container || _container)
  }, [show, attachEle])
  return (
    <CSSTransition in={show} timeout={200} classNames={AnimationClassName}>
      <Portal container={container}>
        <Overlay {...props} container={container} />
      </Portal>
    </CSSTransition>
  )
}
export { Portal, useClickOutside }
export default Popper
