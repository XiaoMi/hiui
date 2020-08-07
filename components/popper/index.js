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
 * @param {Function} getOverlayContainer 获取overLay的挂载父级元素
 * @param {Boolean} preventOverflow 防止溢出
 */
const Popper = props => {
  const { show, attachEle, getOverlayContainer } = props
  const [staticShow, setStaticShow] = useState(show)
  const [transitionShow, setTransitionShow] = useState(show)
  const [container, setContainer] = useState(
    getOverlayContainer
      ? getOverlayContainer(attachEle)
      : props.container || document.body
  )

  useEffect(() => {
    const _container = attachEle ? getScrollParent(attachEle) : document.body
    setContainer(
      getOverlayContainer
        ? getOverlayContainer(attachEle)
        : props.container || _container
    )
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
          <Overlay
            {...Object.assign({}, props, { show: staticShow })}
            container={container}
          />
        </Portal>
      </CSSTransition>
    </div>
  )
}
export { Portal, useClickOutside }
export default Popper
