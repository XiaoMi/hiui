import React, { forwardRef, useState, useRef, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useRefsOutsideClick } from '@hi-ui/use-outside-click'
import { useToggle } from '@hi-ui/use-toggle'
import { Modifier } from 'react-popper'
import { usePortal } from '@hi-ui/use-portal'
import * as PopperJS from '@popperjs/core'
import { CSSTransition } from 'react-transition-group'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useLatestRef } from '@hi-ui/use-latest'
import { usePopper } from './use-popper'

const _role = 'popper'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Popper
 */
export const Popper = forwardRef<HTMLDivElement | null, PopperProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      style,
      visible = false,
      onClose,
      unmountOnClose = true,
      closeOnOutsideClick = true,
      closeOnEsc = false,
      placement = 'bottom-start',
      modifiers = [],
      attachEl,
      container: containerProp,
      width,
      topGap = 8,
      leftGap = 0,
      zIndex = 1008,
      arrow = false,
      onOutsideClick,
      ...rest
    },
    ref
  ) => {
    const [internalVisible, internalVisibleAction] = useToggle(visible)
    const [transitionVisible, transitionVisibleAction] = useToggle(visible)

    const popperElRef = useRef<HTMLDivElement | null>(null)
    const [arrowElRef, setArrowElmRef] = useState<HTMLElement | null>(null)
    const targetRef = useLatestRef(attachEl)

    useRefsOutsideClick([popperElRef, targetRef], onOutsideClick)

    const [targetEl, setTargetEl] = useState<HTMLElement | null>(attachEl)

    const { styles, attributes } = usePopper({
      targetElement: attachEl,
      popperElement: popperElRef.current,
      arrowElement: arrowElRef,
      placement,
    })

    useEffect(() => {
      transitionVisibleAction.set(visible)

      if (visible) {
        internalVisibleAction.on()
      }
    }, [visible, internalVisibleAction, transitionVisibleAction])

    // useEffect(() => {
    //   setTargetEl(attachEl)
    // }, [forceUpdate, attachEl, internalVisibleAction, transitionVisibleAction])

    const [Portal] = usePortal(`${prefixCls}-portal`)

    const cls = cx(prefixCls, className)

    const unmount = unmountOnClose && !visible && !internalVisible
    const container = containerProp || targetEl ? document.body : document.body

    return (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
        in={transitionVisible}
        timeout={210}
        onExited={() => {
          internalVisibleAction.off()
        }}
      >
        {/* 当前文档流、传送至 body、传送到指定 container */}
        {/* <Portal container={container}> */}
        <div
          role={role}
          className={cls}
          ref={useMergeRefs(popperElRef, ref)}
          style={Object.assign({}, style, styles.popper)}
          {...rest}
          {...attributes.popper}
        >
          <div
            ref={setArrowElmRef}
            className={cx(`${prefixCls}__arrow`, !arrow && `hidden`)}
            style={styles.arrow}
          />
          <div ref={console.log} className={`${prefixCls}__overlay`}>
            {children}
          </div>
        </div>
        {/* </Portal> */}
      </CSSTransition>
    )
  }
)

export interface PopperProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  visible?: boolean
  placement?: PopperJS.Placement
  modifiers?: ReadonlyArray<Modifier<any>>
  attachEl: HTMLElement
  width?: number
  topGap?: number
  leftGap?: number
  zIndex?: number
  children?: React.ReactNode
  onOutsideClick?: (evt: Event) => void
  arrow?: boolean
  onClose?: () => void
  unmountOnClose?: boolean
  closeOnOutsideClick?: boolean
  closeOnEsc?: boolean
}

if (__DEV__) {
  Popper.displayName = 'Popper'
}
