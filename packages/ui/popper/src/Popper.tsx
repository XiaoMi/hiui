import React, { forwardRef, useState, useCallback, useEffect } from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import * as PopperJS from '@popperjs/core'
import { CSSTransition } from 'react-transition-group'
import { useLatestCallback } from '@hi-ui/use-latest'
import { usePopper, UsePopperProps } from './use-popper'

export { PopperJS }

const _prefix = getPrefixCls('popper')

/**
 * TODO: What is Popper
 */
export const Popper = forwardRef<HTMLDivElement | null, PopperProps>(
  (
    {
      prefixCls = _prefix,
      className,
      children,
      style,
      visible = false,
      onClose,
      preload = false,
      unmountOnClose = true,
      arrow = false,
      closeOnOutsideClick,
      closeOnEsc,
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
    const [transitionVisible, setTransitionVisible] = useState(false)
    const [transitionExisted, setTransitionExisted] = useState(true)

    useEffect(() => {
      setTransitionVisible(visible)
      if (visible) {
        setTransitionExisted(false)
      }
    }, [visible])

    const { popperElement, getPopperProps, getArrowProps } = usePopper({
      attachEl,
      // 关闭时不启用，内部执行销毁
      visible: !transitionExisted,
      // 消失动画期间，也不会触发 onClose
      onClose: () => {
        if (!visible) return
        onClose?.()
      },
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
      closeOnOutsideClick,
      closeOnEsc,
      onOutsideClick,
    })

    const onEnteredLatest = useLatestCallback(onEntered)
    const onExitedLatest = useLatestCallback(onExited)

    const handleEntered = useCallback(() => {
      popperElement?.focus()
      onEnteredLatest()
    }, [onEnteredLatest, popperElement])

    const handleExited = useCallback(() => {
      setTransitionExisted(true)
      onExitedLatest()
    }, [onExitedLatest])

    const cls = cx(prefixCls, className)

    return (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
        in={transitionVisible}
        timeout={201}
        mountOnEnter={!preload}
        unmountOnExit={unmountOnClose}
        onEnter={onEnter}
        onExit={onExit}
        onEntered={handleEntered}
        onExited={handleExited}
      >
        <div className={cls} {...getPopperProps(rest, ref)}>
          <div className={cx(`${prefixCls}__arrow`, !arrow && `hidden`)} {...getArrowProps()} />

          <div className={`${prefixCls}__overlay`}>{children}</div>
        </div>
      </CSSTransition>
    )
  }
)

export interface PopperProps extends HiBaseHTMLProps<'div'>, UsePopperProps {
  /**
   * 是否展示箭头
   */
  arrow?: boolean
  /**
   * 开启 popper 预加载渲染，用于性能优化，优先级小于 `unmountOnClose`
   */
  preload?: boolean
  /**
   * 开启 popper 关不时销毁，用于性能优化，优先级大于 `preload`
   */
  unmountOnClose?: boolean
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
