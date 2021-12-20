import React, {
  useEffect,
  forwardRef,
  useRef,
  useCallback,
  useState,
  useImperativeHandle,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { __DEV__ } from '@hi-ui/env'
import { CSSTransition } from 'react-transition-group'
import { useScrollLock } from '@hi-ui/use-scroll-lock'
import { Portal } from '@hi-ui/portal'
import { stackManager, useStackManager } from './hooks'
import { useLatestCallback, useLatestRef } from '@hi-ui/use-latest'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useToggle } from '@hi-ui/use-toggle'
import { callAllFuncs } from '@hi-ui/func-utils'
import { IconButton } from '@hi-ui/icon-button'
import { CloseOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'

const _role = 'modal'
export const _prefix = getPrefixCls(_role)

// TODO: 聚焦收敛器
const focusableElementsString =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'

const defaultCloseIcon = <CloseOutlined />

/**
 * TODO: What is Modal
 */
export const Modal = forwardRef<HTMLDivElement | null, ModalProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      style,
      children,
      portalClassName,
      overlayClassName,
      visible = false,
      size = 'md',
      disabledPortal = false,
      lockScroll = true,
      closeable = true,
      closeOnEsc = true,
      autoFocus = true,
      onEscKeyDown,
      // TODO: 统一命名
      // closeOnOverlayClick = true,
      maskClosable = true,
      onOverlayClick,
      timeout = 300,
      onClose: onCloseProp,
      onExited: onExitedProp,
      title,
      cancelText,
      confirmText,
      confirmLoading,
      footer,
      // TODO: 分离 onCancel 和 onClose
      onCancel,
      onConfirm,
      container,
      closeIcon = defaultCloseIcon,
      showHeaderDivider = true,
      // TODO: 废弃警告
      showFooterDivider = true,
      focusElementOnClose = null,
      trapFocus = true,
      returnFocusOnClose = true,
      // contentOutside = false,
      width,
      height,
      // TODO: 统一性能优化参数
      preload = false,
      unmountOnClose = true,
      innerRef,
      // transitionProps,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, transitionVisibleAction] = useToggle(false)
    const [transitionExited, transitionExitedAction] = useToggle(true)

    const [modalElement, setModalElement] = useState<HTMLDivElement | null>(null)

    const modalElementRef = useLatestRef(modalElement)
    const returnFocusedElementRef = useRef<HTMLElement | null>(null)
    // const [_container, tryAppend, tryRemove] = useContainer(container)

    // 多任务以栈维护，可以控制显隐时序（后显先隐）
    useStackManager(modalElementRef, transitionVisible)

    // TODO: 抽离 Hooks，和 drawer 复用

    // 控制锁滚
    const visibleMounted = !transitionExited && !!modalElement
    const enabledScrollLock = lockScroll && visibleMounted
    useScrollLock(modalElementRef, {
      enabled: enabledScrollLock,
      // @ts-ignore
      target: container?.parentNode,
    })

    const onRequestCloseLatest = useLatestCallback(() => callAllFuncs(onCloseProp, onCancel)())

    const onOverlayClickLatest = useLatestCallback(onOverlayClick)

    const handleClickOverlay = useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        onOverlayClickLatest(event)

        if (maskClosable) {
          onRequestCloseLatest()
        }
      },
      [onOverlayClickLatest, onRequestCloseLatest, maskClosable]
    )

    const onEscKeyDownLatest = useLatestCallback(onEscKeyDown)

    const onEscClose = useCallback(
      (evt: KeyboardEvent) => {
        // only close the top modal when pressing `Esc`
        if (evt.keyCode !== 27) return

        if (!stackManager.isTop(modalElementRef)) return

        onEscKeyDownLatest(evt)

        if (closeOnEsc) {
          onRequestCloseLatest()
        }
      },
      [closeOnEsc, onRequestCloseLatest, onEscKeyDownLatest, modalElementRef]
    )

    const trapTabKey = useCallback(
      (evt) => {
        if (!modalElementRef.current) return

        // ESCAPE
        onEscClose(evt)

        // TODO: 抽离 useTrapFocus hook
        if (!trapFocus) return

        // Find all focusable children
        let focusableElements: any = modalElementRef.current.querySelectorAll(
          focusableElementsString
        )

        // Convert NodeList to Array
        focusableElements = Array.prototype.slice.call(focusableElements)

        const firstTabStop = focusableElements[0]
        const lastTabStop = focusableElements[focusableElements.length - 1]

        // Check for TAB key press
        if (evt.keyCode === 9) {
          // SHIFT + TAB
          if (evt.shiftKey) {
            if (document.activeElement === firstTabStop) {
              evt.preventDefault()
              lastTabStop.focus()
            }
            // TAB
          } else {
            if (document.activeElement === lastTabStop) {
              evt.preventDefault()
              firstTabStop.focus()
            }
          }
        }
      },
      [onEscClose, modalElementRef, trapFocus]
    )

    useEffect(() => {
      transitionVisibleAction.set(visible)

      if (visible) {
        returnFocusedElementRef.current = document.activeElement as HTMLElement
        transitionExitedAction.off()
      }

      return () => {
        if (!visible) {
          transitionVisibleAction.off()
        }
      }
    }, [visible, transitionVisibleAction, transitionExitedAction])

    const onExitedLatest = useLatestCallback(onExitedProp)
    const onExited = useCallback(() => {
      transitionExitedAction.on()
      onExitedLatest()

      if (focusElementOnClose) {
        focusElementOnClose.focus()
      } else {
        if (returnFocusOnClose) {
          returnFocusedElementRef.current?.focus()
        }
      }
    }, [onExitedLatest, transitionExitedAction, focusElementOnClose, returnFocusOnClose])

    useImperativeHandle(innerRef, () => ({ close: transitionVisibleAction.off }))

    const hasHeader = title && closeable
    const hasFooter = footer !== null

    const cls = cx(prefixCls, className, `${prefixCls}--size-${size}`)

    return (
      <Portal className={portalClassName} container={container} disabled={disabledPortal}>
        <CSSTransition
          classNames={`${prefixCls}--motion`}
          in={transitionVisible}
          timeout={timeout}
          appear
          onEntered={() => {
            if (autoFocus) {
              modalElementRef.current?.focus()
            }
          }}
          onExited={onExited}
          mountOnEnter={!preload}
          unmountOnExit={unmountOnClose}
        >
          <div
            role={role}
            ref={useMergeRefs(setModalElement, ref)}
            className={cls}
            style={{ ...style, display: transitionExited ? 'none' : undefined }}
            tabIndex={-1}
            onKeyDown={trapTabKey}
            {...rest}
          >
            <div
              className={cx(`${prefixCls}__overlay`, overlayClassName)}
              onClick={maskClosable || onOverlayClick ? handleClickOverlay : undefined}
            />
            <div className={`${prefixCls}__wrapper`} style={{ width, height }}>
              {hasHeader ? (
                <div
                  className={cx(
                    `${prefixCls}__header`,
                    showHeaderDivider && `${prefixCls}__header--divided`
                  )}
                >
                  {title}
                  {closeable ? (
                    <IconButton icon={closeIcon} onClick={onRequestCloseLatest} />
                  ) : null}
                </div>
              ) : null}
              <div className={`${prefixCls}__body`}>{children}</div>
              {hasFooter ? (
                <div
                  className={cx(
                    `${prefixCls}__footer`,
                    showFooterDivider && `${prefixCls}__footer--divided`
                  )}
                >
                  {footer === undefined
                    ? [
                        cancelText !== null ? (
                          <Button type="default" onClick={onRequestCloseLatest}>
                            {cancelText || '取消'}
                          </Button>
                        ) : null,
                        confirmText !== null ? (
                          <Button
                            type="primary"
                            loading={confirmLoading}
                            onClick={() => onConfirm?.()}
                          >
                            {confirmText || '确认'}
                          </Button>
                        ) : null,
                      ]
                    : footer}
                </div>
              ) : null}
            </div>
          </div>
        </CSSTransition>
      </Portal>
    )
  }
)

export type ModalSizeType = 'sm' | 'md' | 'lg'

export interface ModalProps extends HiBaseHTMLProps<'div'> {
  /**
   * 外层挂载节点的样式类
   */
  portalClassName?: string
  /**
   * 弹出层样式类
   */
  overlayClassName?: string
  /**
   * 模态框尺寸
   */
  size?: ModalSizeType
  /**
   * 是否显示模态框
   */
  visible?: boolean
  closeOnEsc?: boolean
  onEscKeyDown?: (event: KeyboardEvent) => void
  maskClosable?: boolean
  onOverlayClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  /**
   * 是否展示右上角关闭按钮
   */
  closeable?: boolean
  closeIcon?: string
  lockScroll?: boolean
  timeout?: number
  /**
   * 禁用 portal
   */
  disabledPortal?: boolean
  /**
   * 指定 portal 的容器
   */
  container?: HTMLElement | null
  onExited?: () => void
  /**
   * 模态框标题
   */
  title?: React.ReactNode
  /**
   * 	取消按钮文案
   */
  cancelText?: React.ReactNode
  /**
   * 	确认按钮文案
   */
  confirmText?: React.ReactNode
  /**
   * 确认按钮 loading 状态
   */
  confirmLoading?: boolean
  /**
   * 自定义模态框底部
   */
  footer?: React.ReactNode
  /**
   * 确认事件触发时的回调
   */
  onConfirm?: () => void
  /**
   * 取消事件触发时的回调
   */
  onCancel?: () => void
  onClose?: () => void
  /**
   * 展示 header 与内容的分割线
   */
  showHeaderDivider?: boolean
  /**
   * 展示 footer 与内容的分割线
   * @deprecated
   */
  showFooterDivider?: boolean
  focusElementOnClose?: HTMLElement
  preload?: boolean
  unmountOnClose?: boolean
  trapFocus?: boolean
  returnFocusOnClose?: boolean
  contentOutside?: boolean
  autoFocus?: boolean
  width?: React.ReactText
  height?: React.ReactText
  innerRef?: React.RefObject<{ close: () => void }>
}

if (__DEV__) {
  Modal.displayName = 'Modal'
}
