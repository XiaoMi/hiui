import React, { forwardRef, useState, useRef, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { useToggle } from '@hi-ui/use-toggle'
import { usePopper, Modifier } from 'react-popper'
import { usePortal } from '@hi-ui/use-portal'
import * as PopperJS from '@popperjs/core'
import { CSSTransition } from 'react-transition-group'
import { useLatestRef } from '@hi-ui/use-latest'

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
      visible = false,
      placement,
      modifiers = [],
      attachEl,
      width,
      topGap = 8,
      leftGap = 8,
      zIndex = 1008,
      onOutsideClick,
      ...rest
    },
    ref
  ) => {
    const [internalVisible, menuVisibleAction] = useToggle(visible)
    const [transitionVisible, transitionVisibleAction] = useToggle(visible)

    useEffect(() => {
      transitionVisibleAction.set(visible)
      if (visible) {
        menuVisibleAction.on()
      }
    }, [visible, transitionVisibleAction, menuVisibleAction])

    const popperElRef = useRef<HTMLDivElement | null>(null)
    const [arrowElRef, setArrowElmRef] = useState<HTMLElement | null>(null)
    const targetRef = useLatestRef(attachEl)

    console.log(attachEl, targetRef)

    useOutsideClick(targetRef, onOutsideClick)

    const { styles, attributes } = usePopper(attachEl, popperElRef.current, {
      placement: 'bottom-start',
      modifiers: [
        {
          enabled: true,
          name: 'arrow',
          options: {
            element: arrowElRef,
          },
        },
        {
          enabled: true,
          name: 'offset',
          options: {
            offset: [0, 4],
          },
        },
      ],
    })

    const [Portal, destroy] = usePortal(`${prefixCls}__portal`)

    const cls = cx(prefixCls, className)

    console.log('visible', visible)

    return (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
        in={visible}
        timeout={310}
        unmountOnExit
        onExited={() => {
          menuVisibleAction.off()
        }}
        // onEnter={close}
        // onEntering={open}
        // onEntered={onMotionEnd}
        // onExit={open}
        // onExiting={close}
        // onExited={onMotionEnd}
      >
        <Portal>
          <div
            className={`${prefixCls}__overlay`}
            ref={popperElRef}
            style={{ ...styles.popper, zIndex: 2 }}
            {...attributes.popper}
          >
            <div ref={setArrowElmRef} style={styles.arrow} />
            <div ref={ref} role={role} className={cls} {...rest}>
              {children}
            </div>
          </div>
        </Portal>
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
}

if (__DEV__) {
  Popper.displayName = 'Popper'
}
