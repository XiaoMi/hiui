import React, { useEffect, forwardRef, useCallback, useImperativeHandle } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { __DEV__ } from '@hi-ui/env'
import { CSSTransition } from 'react-transition-group'
import { Portal } from '@hi-ui/portal'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useToggle } from '@hi-ui/use-toggle'
import { callAllFuncs } from '@hi-ui/func-utils'
import { IconButton } from '@hi-ui/icon-button'
import { CloseOutlined } from '@hi-ui/icons'
import Button from '@hi-ui/button'
import { useModal, UseModalProps } from './use-modal'

const _role = 'modal'
export const _prefix = getPrefixCls(_role)

const defaultCloseIcon = <CloseOutlined />

/**
 * TODO: What is Modal
 */
export const Modal = forwardRef<HTMLDivElement | null, ModalProps>(
  (
    {
      prefixCls = _prefix,
      className,
      children,
      portalClassName,
      overlayClassName,
      size = 'md',
      disabledPortal = false,
      closeable = true,
      onOverlayClick,
      timeout = 300,
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
      width,
      height,
      // TODO: 统一性能优化参数
      preload = false,
      unmountOnClose = true,
      visible = false,
      onClose: onCloseProp,
      innerRef,
      // transitionProps,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, transitionVisibleAction] = useToggle(false)
    const [transitionExited, transitionExitedAction] = useToggle(true)

    const onRequestCloseLatest = useLatestCallback(() => callAllFuncs(onCloseProp, onCancel)())

    const { rootProps, getModalProps, getOverlayProps } = useModal({
      ...rest,
      visible: !transitionExited,
      onClose: onRequestCloseLatest,
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

    useImperativeHandle(innerRef, () => ({ close: transitionVisibleAction.off }))

    const hasHeader = !!title || closeable
    const hasFooter = footer !== null

    const cls = cx(prefixCls, className, `${prefixCls}--size-${size}`)

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
            <div
              className={cx(`${prefixCls}__overlay`, overlayClassName)}
              {...getOverlayProps({ onClick: onOverlayClick })}
            />
            <div className={`${prefixCls}__wrapper`} style={{ width, height }}>
              {hasHeader ? (
                <header
                  className={cx(
                    `${prefixCls}__header`,
                    showHeaderDivider && `${prefixCls}__header--divided`
                  )}
                >
                  {title ? <div className={`${prefixCls}__title`}>{title}</div> : null}
                  {closeable ? (
                    <IconButton icon={closeIcon} onClick={onRequestCloseLatest} />
                  ) : null}
                </header>
              ) : null}
              <main className={`${prefixCls}__body`}>{children}</main>
              {hasFooter ? (
                <footer
                  className={cx(
                    `${prefixCls}__footer`,
                    showFooterDivider && `${prefixCls}__footer--divided`
                  )}
                >
                  {footer === undefined
                    ? [
                        cancelText !== null ? (
                          <Button key="1" type="default" onClick={onRequestCloseLatest}>
                            {cancelText || '取消'}
                          </Button>
                        ) : null,
                        confirmText !== null ? (
                          <Button
                            key="2"
                            type="primary"
                            loading={confirmLoading}
                            onClick={() => onConfirm?.()}
                          >
                            {confirmText || '确认'}
                          </Button>
                        ) : null,
                      ]
                    : footer}
                </footer>
              ) : null}
            </div>
          </div>
        </CSSTransition>
      </Portal>
    )
  }
)

export type ModalSizeType = 'sm' | 'md' | 'lg'

export interface ModalProps extends HiBaseHTMLProps<'div'>, UseModalProps {
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
  onOverlayClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  /**
   * 是否展示右上角关闭按钮
   */
  closeable?: boolean
  closeIcon?: string
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
  preload?: boolean
  unmountOnClose?: boolean
  width?: React.ReactText
  height?: React.ReactText
  innerRef?: React.RefObject<{ close: () => void }>
}

if (__DEV__) {
  Modal.displayName = 'Modal'
}
