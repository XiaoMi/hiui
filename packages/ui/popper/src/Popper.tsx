import React, { useEffect, useState } from 'react'
import CSSTransition from 'react-transition-group/CSSTransition'
import { getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'popper'
export const _prefix = getPrefixCls(_role)
const animationClassName = 'hix-popper_transition'

/**
 * TODO: What is Popper
 */
export const Popper = ({
  visible,
  target,
  setOverlayContainer,
  container: containerProp,
  ...rest
}) => {
  const [internalVisible, setInternalVisible] = useState(visible)
  const [transitionVisible, setTransitionVisible] = useState(visible)

  const [container, setContainer] = useState(
    setOverlayContainer ? setOverlayContainer(target) : containerProp || document.body
  )

  useEffect(() => {
    setContainer(setOverlayContainer ? setOverlayContainer(target) : containerProp || document.body)
    setTransitionVisible(visible)
    visible && setInternalVisible(true)
  }, [visible, target])

  return (
    <CSSTransition
      in={transitionVisible}
      timeout={300}
      classNames={animationClassName}
      onExited={() => {
        setInternalVisible(false)
      }}
    >
      <Portal container={container}>
        <Overlay {...rest} visible={internalVisible} container={container} />
      </Portal>
    </CSSTransition>
  )
}

export interface PopperProps {
  visible?: boolean
  target: Element
  /**
   * 获取overLay的挂载父级元素 允许用户指定；如果不指定  popper自己处理
   */
  setOverlayContainer: any
  container: any
}

if (__DEV__) {
  Popper.displayName = 'Popper'
}
