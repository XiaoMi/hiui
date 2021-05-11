import React, { useState, useEffect } from "react"
import { CSSTransition } from "react-transition-group"
import Portal from "./Portal"
import Overlay from "./Overlay"
import useClickOutside from "./utils/useClickOutside"

import "./style/index.scss"

const AnimationClassName = "hi-popper_transition"
/**
 * @param {Function} onClickOutside 点击该元素外的回调方法
 * @param {Function} setOverlayContainer 获取overLay的挂载父级元素 允许用户指定；如果不指定  popper自己处理
 */
const Popper = (props) => {
  const { show, attachEle, setOverlayContainer } = props
  const [staticShow, setStaticShow] = useState(show)
  const [transitionShow, setTransitionShow] = useState(show)
  const [container, setContainer] = useState(
    setOverlayContainer ? setOverlayContainer(attachEle) : props.container || document.body
  )

  useEffect(() => {
    // const _container = attachEle ? getScrollParent(attachEle) : document.body
    setContainer(setOverlayContainer ? setOverlayContainer(attachEle) : props.container || document.body)
    setTransitionShow(show)
    show && setStaticShow(true)
  }, [show, attachEle])
  return (
    <CSSTransition
      in={transitionShow}
      timeout={300}
      classNames={AnimationClassName}
      onExited={() => {
        setStaticShow(false)
      }}
    >
      <Portal container={container}>
        <Overlay {...Object.assign({}, props, { show: staticShow })} container={container} />
      </Portal>
    </CSSTransition>
  )
}
export { Portal, useClickOutside }
export default Popper
