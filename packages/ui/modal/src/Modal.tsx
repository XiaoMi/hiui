import React, { useEffect, forwardRef, useCallback, useImperativeHandle } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'
import { __DEV__ } from '@hi-ui/env'
import { CSSTransition } from 'react-transition-group'
import { Portal } from '@hi-ui/portal'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useToggle } from '@hi-ui/use-toggle'
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
      size = 'md',
      disabledPortal = false,
      closeable = true,
      timeout = 300,
      onExited: onExitedProp,
      title,
      cancelText,
      confirmText,
      confirmLoading,
      footer,
      onCancel: onCloseProp,
      onConfirm,
      container,
      closeIcon = defaultCloseIcon,
      showMask = true,
      showHeaderDivider = true,
      showFooterDivider = true,
      width,
      height,
      preload = false,
      unmountOnClose = false,
      visible = false,
      innerRef,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, transitionVisibleAction] = useToggle(false)
    const [transitionExited, transitionExitedAction] = useToggle(true)

    const onRequestCloseLatest = useLatestCallback(() => onCloseProp?.())

    const { rootProps, getModalProps, getModalWrapperProps } = useModal({
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
    const hasConfirm = confirmText !== null
    const hasCancel = cancelText !== null
    const hasFooter = hasConfirm || hasCancel || footer !== null

    const cls = cx(prefixCls, className, `${prefixCls}--size-${size}`)

    return (
      <Portal container={container} disabled={disabledPortal}>
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
            {showMask ? <div className={`${prefixCls}__overlay`} /> : null}
            <div
              className={`${prefixCls}__wrapper`}
              style={{ width, height }}
              {...getModalWrapperProps()}
            >
              {hasHeader ? (
                <header
                  className={cx(
                    `${prefixCls}__header`,
                    showHeaderDivider && `${prefixCls}__header--divided`
                  )}
                >
                  {title ? <div className={`${prefixCls}__title`}>{title}</div> : null}
                  {closeable ? (
                    <IconButton effect icon={closeIcon} onClick={onRequestCloseLatest} />
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
                        hasCancel ? (
                          <Button key="1" type="default" onClick={onRequestCloseLatest}>
                            {cancelText || '取消'}
                          </Button>
                        ) : null,
                        hasConfirm ? (
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

export type ModalSizeEnum = HiBaseSizeEnum

export interface ModalProps extends HiBaseHTMLProps<'div'>, UseModalProps {
  /**
   * 模态框尺寸
   */
  size?: ModalSizeEnum
  /**
   * 是否显示模态框
   */
  visible?: boolean
  /**
   * 是否展示右上角关闭按钮
   */
  closeable?: boolean
  /**
   * 指定 portal 的容器
   */
  container?: HTMLElement | null
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
  /**
   * 开启预加载渲染，用于性能优化，优先级小于 `unmountOnClose`
   */
  preload?: boolean
  /**
   * 开启关闭时销毁，用于性能优化，优先级大于 `preload`
   */
  unmountOnClose?: boolean
  /**
   * 弹出层宽度设置
   */
  width?: React.ReactText
  /**
   * 弹出层高度设置
   */
  height?: React.ReactText
  /**
   * 是否显示蒙层
   */
  showMask?: boolean
  /**
   * 展示 header 与内容的分割线
   */
  showHeaderDivider?: boolean
  /**
   * 展示 footer 与内容的分割阴影
   * @private
   */
  showFooterDivider?: boolean
  /**
   * 禁用 portal
   * @private
   */
  disabledPortal?: boolean
  /**
   * 自定义关闭时 icon
   * @private
   */
  closeIcon?: React.ReactNode
  /**
   * 自定义动画过渡时长
   * @private
   */
  timeout?: number
  /**
   * @private
   */
  innerRef?: React.Ref<{ close: () => void }>
  /**
   * 关闭动画退出时回调
   * @private
   */
  onExited?: () => void
}

if (__DEV__) {
  Modal.displayName = 'Modal'
}
