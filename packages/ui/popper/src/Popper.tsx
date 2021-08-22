import React, { forwardRef, useState, useRef, useCallback, useLayoutEffect, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useRefsOutsideClick } from '@hi-ui/use-outside-click'
import { useToggle } from '@hi-ui/use-toggle'
import { Portal } from '@hi-ui/portal'
import * as PopperJS from '@popperjs/core'
import { CSSTransition } from 'react-transition-group'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useLatestRef, useLatestCallback } from '@hi-ui/use-latest'
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
      preload = false,
      unmountOnClose = true,
      closeOnOutsideClick = true,
      closeOnEsc = true,
      arrow = false,
      disabledPortal = false,
      onOutsideClick,
      onKeyDown,
      attachEl,
      container,
      disabled,
      zIndex,
      gutterGap,
      crossGap,
      preventOverflow,
      flip,
      matchWidth,
      eventListeners,
      placement,
      modifiers,
      arrowPadding,
      strategy,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, transitionVisibleAction] = useToggle(visible)

    const popperElRef = useRef<HTMLDivElement | null>(null)
    const [arrowElRef, setArrowElmRef] = useState<HTMLElement | null>(null)
    const targetRef = useLatestRef(attachEl)

    const onCloseLatest = useLatestCallback(onClose)
    const onKeyDownLatest = useLatestCallback(onKeyDown)
    const onOutsideClickLatest = useLatestCallback(onOutsideClick)

    useRefsOutsideClick([popperElRef, targetRef], (evt) => {
      if (closeOnOutsideClick) {
        onCloseLatest()
      }
      onOutsideClickLatest(evt)
    })

    const handleKeyDown = useCallback(
      (evt: React.KeyboardEvent) => {
        if (closeOnEsc && evt.keyCode === 27) {
          onCloseLatest()
        }
        onKeyDownLatest(evt)
      },
      [closeOnEsc, onCloseLatest, onKeyDownLatest]
    )

    const { styles, attributes } = usePopper({
      targetElement: attachEl,
      popperElement: popperElRef.current,
      arrowElement: arrowElRef,
      disabled: disabled || !visible,
      placement,
      zIndex,
      gutterGap,
      crossGap,
      preventOverflow,
      flip,
      matchWidth,
      eventListeners,
      modifiers,
      arrowPadding,
      strategy,
    })

    useLayoutEffect(() => {
      if (visible) {
        transitionVisibleAction.on()
      }
    }, [visible, transitionVisibleAction])

    const hasOpenedRef = useRef(false)
    if (visible) {
      hasOpenedRef.current = true
    }
    const shouldRenderChildren = useMemo(() => {
      if (visible || transitionVisible) return true

      // 初次未渲染，且开启预渲染时渲染 children
      if (!hasOpenedRef.current) return preload

      // 未开启关闭时销毁，保留渲染 children
      if (!unmountOnClose) return true

      return false
    }, [preload, unmountOnClose, visible, transitionVisible])

    const popperMergedRef = useMergeRefs(popperElRef, ref)

    const cls = cx(prefixCls, className, visible && `${prefixCls}--open`)

    return (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
        in={visible}
        unmountOnExit={false}
        timeout={110}
        onEntered={() => {
          popperElRef.current?.focus()
        }}
        onExited={() => {
          transitionVisibleAction.off()
        }}
      >
        <Portal container={container} disabled={disabledPortal}>
          {shouldRenderChildren ? (
            <div
              role={role}
              className={cls}
              ref={popperMergedRef}
              style={Object.assign({ outline: 'none' }, style, styles.popper)}
              {...rest}
              {...attributes.popper}
              tabIndex={-1}
              onKeyDown={handleKeyDown}
            >
              <div
                ref={setArrowElmRef}
                className={cx(`${prefixCls}__arrow`, !arrow && `hidden`)}
                style={styles.arrow}
              />

              <div className={`${prefixCls}__overlay`}>{children}</div>
            </div>
          ) : null}
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
  attachEl: HTMLElement
  children?: React.ReactNode
  arrow?: boolean
  zIndex?: number
  onClose?: () => void
  closeOnEsc?: boolean
  closeOnOutsideClick?: boolean
  preload?: boolean
  unmountOnClose?: boolean
  onOutsideClick?: (evt: Event) => void
  container?: (() => HTMLElement | null) | HTMLElement | null
  /**
   * 是否禁用 popper
   */
  disabled?: boolean
  /**
   * 设置基于 reference 元素的间隙偏移量
   */
  gutterGap?: number
  /**
   * 设置基于 reference 元素的正交偏移量
   */
  crossGap?: number
  /**
   * 设置边缘区域可见
   */
  preventOverflow?: boolean
  /**
   * 自动反转，尽可能保证显示在可视区域
   */
  flip?: boolean
  /**
   * 自动计算匹配 reference 的宽度与其一致
   */
  matchWidth?: boolean
  /**
   * 开启重新定位，当 `scroll` 和 `resize` 触发时
   */
  eventListeners?: boolean | { scroll?: boolean; resize?: boolean }
  /**
   * 相对 reference 的位置
   */
  placement?: PopperJS.Placement
  /**
   * 自定义 popper.js 的装饰器
   */
  modifiers?: ReadonlyArray<PopperJS.Modifier<string, any>>
  /**
   * 设置 arrow 的 padding，避免 arrow 处在 popper 边界
   */
  arrowPadding?: number
  /**
   * 设置 popper 的 css 定位方式
   */
  strategy?: 'absolute' | 'fixed'
  /**
   * 禁用 portal
   */
  disabledPortal?: boolean
  onKeyDown?: (evt: React.KeyboardEvent) => void
}

if (__DEV__) {
  Popper.displayName = 'Popper'
}
