import React, { forwardRef, useState, useRef, useCallback, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useRefsOutsideClick } from '@hi-ui/use-outside-click'
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
      onOutsideClick,
      onKeyDown,
      attachEl,
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
      onEnter,
      onExit,
      onEntered,
      onExited,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, setTransitionVisible] = useState(!visible)
    const [transitionExisted, setTransitionExisted] = useState(!visible)

    useEffect(() => {
      setTransitionVisible(visible)
      if (visible) {
        setTransitionExisted(false)
      }
    }, [visible])

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
      // 关闭时不启用，内部执行销毁
      disabled: transitionExisted,
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

    const popperMergedRef = useMergeRefs(popperElRef, ref)

    const cls = cx(prefixCls, className)

    return (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
        in={transitionVisible}
        timeout={101}
        mountOnEnter={!preload}
        unmountOnExit={unmountOnClose}
        onEnter={onEnter}
        onExit={onExit}
        onEntered={() => {
          popperElRef.current?.focus()
          onEntered?.()
        }}
        onExited={() => {
          setTransitionExisted(true)
          onExited?.()
        }}
      >
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
  attachEl: HTMLElement | null
  children?: React.ReactNode
  arrow?: boolean
  zIndex?: number
  onClose?: () => void
  closeOnEsc?: boolean
  closeOnOutsideClick?: boolean
  preload?: boolean
  unmountOnClose?: boolean
  onOutsideClick?: (evt: Event) => void
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
  onKeyDown?: (evt: React.KeyboardEvent) => void
  /**
   * 开始动画弹出时回调
   */
  onEnter?: () => void
  /**
   * 开始动画隐藏时回调
   */
  onExit?: () => void
  /**
   * 结束动画弹出时回调
   */
  onEntered?: () => void
  /**
   * 结束动画隐藏时回调
   */
  onExited?: () => void
}

if (__DEV__) {
  Popper.displayName = 'Popper'
}
