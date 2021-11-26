import React, { forwardRef, useCallback, useEffect, useRef } from 'react'
import { cx, getPrefixCls, getPrefixStyleVar } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { UseDrawerProps } from './use-drawer'
// import { DrawerProvider } from './context'
import { CSSTransition } from 'react-transition-group'
import { useScrollLock } from '@hi-ui/use-scroll-lock'
import { Portal } from '@hi-ui/portal'
import { stackManager, useStackManager } from '@hi-ui/modal'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useToggle } from '@hi-ui/use-toggle'
import { isNumeric } from '@hi-ui/type-assertion'
import { CloseOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'

const DRAWER_PREFIX = getPrefixCls('drawer')

/**
 * TODO: What is Drawer
 */
export const Drawer = forwardRef<HTMLDivElement | null, DrawerProps>(
  (
    {
      prefixCls = DRAWER_PREFIX,
      role = 'dialog',
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
      placement = 'right',
      onClose,
      onAfterOpen,
      onAfterClose,
      onExited: onExitedProp,
      title,
      showMask = true,
      footer,
      width,
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
        console.log(evt)

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

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--size-${size}`,
      `${prefixCls}--placement-${placement}`
    )

    console.log(transitionVisible)

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
            className={cls}
            role={role}
            ref={useMergeRefs(modalRef, ref)}
            style={{
              display: transitionExited ? 'none' : undefined,
              [`${getPrefixStyleVar('drawer-body-width')}`]: isNumeric(width)
                ? width + 'px'
                : width,
            }}
            {...rest}
          >
            {showMask ? (
              <div
                className={cx(`${prefixCls}__overlay`, overlayClassName)}
                onClick={closeOnOverlayClick || onOverlayClick ? handleClickOverlay : undefined}
              />
            ) : null}
            <div className={`${prefixCls}__body`}>
              <header className={`${prefixCls}__header`}>
                {title}
                {closable ? <IconButton onClick={onClose} icon={<CloseOutlined />} /> : null}
              </header>
              <main className={`${prefixCls}__content`}>{children}</main>
              {footer ? <footer className={`${prefixCls}__footer`}>{footer}</footer> : null}
            </div>
          </div>
        </CSSTransition>
      </Portal>
    )
  }
)

export interface DrawerProps extends Omit<HiBaseHTMLProps<'div'>, 'title'>, UseDrawerProps {
  /**
   * 模态框标题
   */
  title: React.ReactNode
  /**
   * 自定义抽屉底部
   */
  footer?: React.ReactNode
  /**
   * 是否显示蒙层
   */
  showMask?: boolean
  /**
   * 自定义抽屉宽度
   */
  width?: number
}

if (__DEV__) {
  Drawer.displayName = 'Drawer'
}
