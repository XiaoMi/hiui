import React, { forwardRef, useState, useEffect, useImperativeHandle } from 'react'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import * as PopperJS from '@popperjs/core'
import { CSSTransition } from 'react-transition-group'
import { useLatestCallback } from '@hi-ui/use-latest'
import { usePopper, UsePopperProps } from './use-popper'
import { Portal } from '@hi-ui/portal'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { ArrowIcon } from './ArrowIcon'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

export { PopperJS }

const _prefix = getPrefixCls('popper')

export const Popper = forwardRef<HTMLDivElement | null, PopperProps>(
  (
    {
      prefixCls = _prefix,
      className,
      children,
      style,
      visible: visibleProp = false,
      onClose,
      preload = false,
      unmountOnClose = true,
      autoFocus = true,
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
      matchWidthStrictly,
      eventListeners,
      placement,
      modifiers,
      arrowPadding,
      strategy,
      // animation
      onEnter,
      onExit,
      onEntered,
      onExited,
      // portal
      container,
      animationType = 'scale',
      disabledPortal = false,
      styles: stylesProp,
      classNames: classNamesProp,
      ...rest
    },
    ref
  ) => {
    const { popper: popperConfig } = useGlobalContext()
    const { classNames, styles } = useMergeSemantic<
      PopperSemanticClassNames,
      PopperSemanticStyles,
      PopperProps
    >({
      classNamesList: [popperConfig?.classNames, classNamesProp],
      stylesList: [popperConfig?.styles, stylesProp],
      info: {
        props: {
          ...rest,
          attachEl,
          visible: visibleProp,
          arrow,
          placement,
          animationType,
        },
      },
    })
    const [transitionVisible, transitionVisibleAction] = useUncontrolledToggle({
      defaultVisible: false,
      visible: visibleProp,
      onClose,
      isEqual: Object.is,
    })

    const [transitionExisted, setTransitionExisted] = useState(!transitionVisible)

    useEffect(() => {
      // transitionVisibleAction.set(transitionVisible)
      if (transitionVisible) {
        setTransitionExisted(false)
      }
    }, [transitionVisible, transitionVisibleAction])

    const { popperElement, getPopperProps, getArrowProps, update, forceUpdate } = usePopper({
      attachEl,
      // 关闭时不启用，内部执行销毁
      visible: !transitionExisted,
      onClose: () => {
        // 消失动画期间，也不会触发 onClose
        if (transitionVisible) {
          transitionVisibleAction.off()
        }
      },
      placement,
      zIndex,
      gutterGap,
      crossGap,
      preventOverflow,
      flip,
      matchWidth,
      matchWidthStrictly,
      eventListeners,
      modifiers,
      arrowPadding,
      strategy,
      closeOnOutsideClick,
      closeOnEsc,
      onOutsideClick,
    })

    const onEnteredLatest = useLatestCallback(() => {
      if (autoFocus) {
        popperElement?.focus()
      }
      onEntered?.()
    })

    // 由 CSSTransition 设置动效结束
    const onExitedLatest = useLatestCallback(() => {
      setTransitionExisted(true)
      onExited?.()
    })

    const cls = cx(prefixCls, className, classNames?.root)
    const popperRest = {
      ...rest,
      style: { ...style, ...styles?.root },
    }

    useImperativeHandle(ref, () => ({
      ...((ref as any)?.current || {}),
      update,
      forceUpdate,
    }))

    const transitionNodeRef = React.useRef<HTMLElement>(null)
    return (
      <Portal container={container} disabled={disabledPortal}>
        <CSSTransition
          classNames={`${prefixCls}--motion-${animationType}`}
          in={transitionVisible}
          appear
          // @DesignToken
          timeout={201}
          mountOnEnter={!preload}
          unmountOnExit={unmountOnClose}
          onEnter={onEnter}
          onExit={onExit}
          onEntered={onEnteredLatest}
          onExited={onExitedLatest}
          // 参考：https://github.com/reactjs/react-transition-group/issues/918
          nodeRef={transitionNodeRef}
        >
          <div className={cls} {...getPopperProps(popperRest, [ref, transitionNodeRef])}>
            <div
              className={cx(`${prefixCls}__container`, classNames?.container)}
              style={styles?.container}
            >
              {arrow ? (
                <div
                  className={cx(`${prefixCls}__arrow`, classNames?.arrow)}
                  {...getArrowProps({ style: styles?.arrow })}
                >
                  <ArrowIcon />
                </div>
              ) : null}
              <div
                className={cx(`${prefixCls}__content`, classNames?.content)}
                style={styles?.content}
              >
                {children}
              </div>
            </div>
          </div>
        </CSSTransition>
      </Portal>
    )
  }
)

export type PopperSemanticName = 'root' | 'container' | 'arrow' | 'content'
export type PopperSemanticClassNames = SemanticClassNamesType<PopperProps, PopperSemanticName>
export type PopperSemanticStyles = SemanticStylesType<PopperProps, PopperSemanticName>
export type PopperSemantic = ComponentSemantic<PopperSemanticClassNames, PopperSemanticStyles>

export interface PopperProps extends HiBaseHTMLProps<'div'>, UsePopperProps, PopperSemantic {
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
   * 开启自动聚焦弹出层
   */
  autoFocus?: boolean
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
  /**
   * 禁用 portal
   */
  disabledPortal?: boolean
  /**
   * 指定 portal 的容器
   */
  container?: (() => HTMLElement | null) | HTMLElement | null
  /**
   * 动画类型
   */
  animationType?: 'scale' | 'scaleX' | 'scaleY'
}

if (__DEV__) {
  Popper.displayName = 'Popper'
}
