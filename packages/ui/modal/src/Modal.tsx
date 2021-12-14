import React, { useEffect, forwardRef, useRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { __DEV__ } from '@hi-ui/env'
import { CSSTransition } from 'react-transition-group'
import { useScrollLock } from '@hi-ui/use-scroll-lock'
import { Portal } from '@hi-ui/portal'
import { stackManager, useStackManager } from './hooks'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useToggle } from '@hi-ui/use-toggle'

const _role = 'modal'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Modal
 */
export const Modal = forwardRef<HTMLDivElement | null, ModalProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      portalClassName,
      overlayClassName,
      visible = false,
      size = 'md',
      container,
      disabledPortal = false,
      lockScroll = true,
      closable = true,
      closeOnEsc = true,
      onEscKeyDown,
      closeOnOverlayClick = true,
      onOverlayClick,
      closeIcon = 'close',
      timeout = 300,
      onClose,
      onAfterOpen,
      onAfterClose,
      onExited: onExitedProp,
      // transitionProps,
      // returnFoucsOnClose = false,
      // trapFocus = true,
      // contentOutside = false,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, transitionVisibleAction] = useToggle(false)
    const [transitionExited, transitionExitedAction] = useToggle(true)

    const modalRef = useRef<HTMLDivElement>(null)
    // const [_container, tryAppend, tryRemove] = useContainer(container)

    // 多任务以栈维护，可以控制显隐时序（后显先隐）
    useStackManager(modalRef, transitionVisible)

    // 控制锁滚
    const enabledScrollLock = lockScroll || transitionVisible
    useScrollLock(modalRef, { enabled: enabledScrollLock })

    const onRequestCloseLatest = useLatestCallback(onClose)

    const onOverlayClickLatest = useLatestCallback(onOverlayClick)

    const handleClickOverlay = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        onOverlayClickLatest(event)

        if (closeOnOverlayClick) {
          onRequestCloseLatest()
        }
      },
      [onOverlayClickLatest, onRequestCloseLatest, closeOnOverlayClick]
    )

    const onEscKeyDownLatest = useLatestCallback(onEscKeyDown)

    const handleKeydown = useCallback(
      (evt: KeyboardEvent) => {
        // only close the top modal when pressing `Esc`
        if (evt.keyCode !== 27) return

        if (!stackManager.isTop(modalRef)) return

        onEscKeyDownLatest(evt)

        if (closeOnEsc) {
          onRequestCloseLatest()
        }
      },
      [closeOnEsc, onRequestCloseLatest, onEscKeyDownLatest]
    )

    useEffect(() => {
      transitionVisibleAction.set(visible)

      if (visible) {
        transitionExitedAction.off()

        if (closeOnEsc) {
          document.addEventListener('keydown', handleKeydown)
        }
      }

      return () => {
        if (!visible) {
          transitionVisibleAction.off()
        }

        if (closeOnEsc) {
          document.removeEventListener('keydown', handleKeydown)
        }
      }
    }, [visible, closeOnEsc, transitionVisibleAction, transitionExitedAction, handleKeydown])

    const cls = cx(prefixCls, className, `${prefixCls}--size-${size}`)

    const onExitedLatest = useLatestCallback(onExitedProp)

    const onExited = useCallback(() => {
      transitionExitedAction.on()
      onExitedLatest()
    }, [onExitedLatest, transitionExitedAction])

    return (
      <Portal className={portalClassName} container={container} disabled={disabledPortal}>
        <CSSTransition
          classNames={`${prefixCls}--motion`}
          in={transitionVisible}
          timeout={timeout}
          onExited={onExited}
        >
          <div
            className={`${prefixCls}__root`}
            style={{ display: transitionExited ? 'none' : undefined }}
          >
            <div
              className={cx(`${prefixCls}__overlay`, overlayClassName)}
              onClick={closeOnOverlayClick || onOverlayClick ? handleClickOverlay : undefined}
            />
            <div role={role} ref={useMergeRefs(modalRef, ref)} className={cls} {...rest}>
              <div className={`${prefixCls}__body`}>{children}</div>
            </div>
          </div>
        </CSSTransition>
      </Portal>
    )
  }
)

export interface ModalProps extends HiBaseHTMLProps<'div'> {
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
  /**
   * 外层挂载节点的样式类
   */
  portalClassName?: string
  /**
   * 弹出层样式类
   */
  overlayClassName?: string
  /**
   * 弹窗大小
   */
  size?: 'sm' | 'md' | 'lg'
  visible?: boolean
  onClose?: () => void
  closeOnEsc?: boolean
  onEscKeyDown?: (event: KeyboardEvent) => void
  closeOnOverlayClick?: boolean
  onOverlayClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  closable?: boolean
  closeIcon?: string
  lockScroll?: boolean
  onAfterOpen?: () => void
  timeout?: number
  onAfterClose?: () => void
  /**
   * 禁用 portal
   */
  disabledPortal?: boolean
  /**
   * 指定 portal 的容器
   */
  container?: (() => HTMLElement | null) | HTMLElement | null
  onExited?: () => void
}

if (__DEV__) {
  Modal.displayName = 'Modal'
}
