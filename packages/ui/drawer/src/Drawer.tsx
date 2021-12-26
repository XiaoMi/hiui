import React, { forwardRef, useCallback, useEffect } from 'react'
import { cx, getPrefixCls, getPrefixStyleVar } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { CSSTransition } from 'react-transition-group'
import { Portal } from '@hi-ui/portal'
import { useModal, UseModalProps } from '@hi-ui/modal'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useToggle } from '@hi-ui/use-toggle'
import { isNumeric } from '@hi-ui/type-assertion'
import { CloseOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'

const DRAWER_PREFIX = getPrefixCls('drawer')

const defaultCloseIcon = <CloseOutlined />

/**
 * TODO: What is Drawer
 */
export const Drawer = forwardRef<HTMLDivElement | null, DrawerProps>(
  (
    {
      prefixCls = DRAWER_PREFIX,
      className,
      children,
      portalClassName,
      overlayClassName,
      disabledPortal = false,
      closeable = true,
      onOverlayClick,
      timeout = 300,
      onExited: onExitedProp,
      title,
      footer,
      container,
      closeIcon = defaultCloseIcon,
      width,
      // contentSize,
      preload = false,
      unmountOnClose = true,
      visible = false,
      onClose,
      showMask = true,
      placement = 'right',
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, transitionVisibleAction] = useToggle(false)
    const [transitionExited, transitionExitedAction] = useToggle(true)

    const { rootProps, getModalProps, getOverlayProps } = useModal({
      ...rest,
      visible: !transitionExited,
      onClose,
      container,
    })

    useEffect(() => {
      transitionVisibleAction.set(visible)

      if (visible) {
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
    }, [onExitedLatest, transitionExitedAction])

    const hasHeader = !!title || closeable

    const cls = cx(prefixCls, className, `${prefixCls}--placement-${placement}`)

    return (
      <Portal className={portalClassName} container={container} disabled={disabledPortal}>
        <CSSTransition
          classNames={`${prefixCls}--motion`}
          in={transitionVisible}
          timeout={timeout}
          appear
          onExited={onExited}
          mountOnEnter={!preload}
          unmountOnExit={unmountOnClose}
        >
          <div className={cls} {...getModalProps(rootProps, ref)}>
            {showMask ? (
              <div
                className={cx(`${prefixCls}__overlay`, overlayClassName)}
                {...getOverlayProps({ onClick: onOverlayClick })}
              />
            ) : null}
            <div
              className={`${prefixCls}__wrapper`}
              style={{
                [`${getPrefixStyleVar('drawer-body-width')}`]: isNumeric(width)
                  ? width + 'px'
                  : width,
              }}
            >
              {hasHeader ? (
                <header className={`${prefixCls}__header`}>
                  {title ? <div className={`${prefixCls}__title`}>{title}</div> : null}
                  {closeable ? <IconButton onClick={onClose} icon={<CloseOutlined />} /> : null}
                </header>
              ) : null}
              <main className={`${prefixCls}__body`}>{children}</main>
              {footer ? <footer className={`${prefixCls}__footer`}>{footer}</footer> : null}
            </div>
          </div>
        </CSSTransition>
      </Portal>
    )
  }
)

export interface DrawerProps extends Omit<HiBaseHTMLProps<'div'>, 'title'>, UseModalProps {
  /**
   * 模态框标题
   */
  title?: React.ReactNode
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
  preload?: boolean
  unmountOnClose?: boolean

  /**
   * 外层挂载节点的样式类
   */
  portalClassName?: string
  /**
   * 弹出层样式类
   */
  overlayClassName?: string
  visible?: boolean
  onClose?: () => void
  closeOnEsc?: boolean
  onEscKeyDown?: (event: React.KeyboardEvent) => void
  /**
   * 是否允许点击蒙层关闭抽屉
   */
  closeOnOverlayClick?: boolean
  onOverlayClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
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
  container?: HTMLElement
  onExited?: () => void
  placement?: 'right' | 'left' | 'top' | 'bottom'
  /**
   * 是否展示右上角关闭按钮
   */
  closeable?: boolean
}

if (__DEV__) {
  Drawer.displayName = 'Drawer'
}
