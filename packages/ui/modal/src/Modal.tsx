import React, { useEffect, forwardRef, useCallback, useImperativeHandle } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { HiBaseHTMLProps, HiBaseSizeEnum, useLocaleContext } from '@hi-ui/core'
import { __DEV__ } from '@hi-ui/env'
import { CSSTransition } from 'react-transition-group'
import { Portal } from '@hi-ui/portal'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useToggle } from '@hi-ui/use-toggle'
import { IconButton } from '@hi-ui/icon-button'
import {
  CloseOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@hi-ui/icons'
import Button from '@hi-ui/button'
import { useModal, UseModalProps } from './use-modal'
import { ModalType, ModalTypeEnum } from './types'

import { isUndef } from '@hi-ui/type-assertion'

const _role = 'modal'
export const modalPrefix = getPrefixCls(_role)

const defaultCloseIcon = <CloseOutlined />
const modalIconMap = {
  // TODO: designToken 颜色抽离 css 为代码
  [ModalType.SUCCESS]: <CheckCircleFilled />,
  [ModalType.ERROR]: <CloseCircleFilled />,
  [ModalType.WARNING]: <ExclamationCircleFilled />,
  [ModalType.INFO]: <InfoCircleFilled />,
}
const defaultMaxHeight = 600

/**
 * TODO: What is Modal
 */
export const Modal = forwardRef<HTMLDivElement | null, ModalProps>(
  (
    {
      prefixCls = modalPrefix,
      className,
      children,
      size = 'md',
      disabledPortal = false,
      closeable = true,
      timeout = 300,
      type,
      onEntered,
      onExited: onExitedProp,
      title,
      cancelText: cancelTextProp,
      confirmText: confirmTextProp,
      confirmLoading,
      footer,
      onClose,
      onCancel,
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
    const i18n = useLocaleContext()

    const cancelText = isUndef(cancelTextProp) ? i18n.get('modal.cancelText') : cancelTextProp
    const confirmText = isUndef(confirmTextProp) ? i18n.get('modal.confirmText') : confirmTextProp

    const [transitionVisible, transitionVisibleAction] = useToggle(false)
    const [transitionExited, transitionExitedAction] = useToggle(true)

    const onRequestCloseLatest = useLatestCallback(() => onCancel?.())

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

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--size-${size}`,
      type && `${prefixCls}--type-${type}`
    )

    return (
      <Portal container={container} disabled={disabledPortal}>
        <CSSTransition
          classNames={`${prefixCls}--motion`}
          in={transitionVisible}
          timeout={timeout}
          appear
          onEntered={onEntered}
          onExited={onExited}
          mountOnEnter={!preload}
          unmountOnExit={unmountOnClose}
        >
          <div className={cls} {...getModalProps(rootProps, ref)}>
            {showMask ? <div className={`${prefixCls}__overlay`} /> : null}
            <div
              className={`${prefixCls}__wrapper`}
              style={{
                width,
                height,
                ...(!height ? { maxHeight: defaultMaxHeight } : null),
              }}
              {...getModalWrapperProps()}
            >
              {hasHeader ? (
                <header
                  className={cx(
                    `${prefixCls}__header`,
                    showHeaderDivider && `${prefixCls}__header--divided`
                  )}
                >
                  {title ? (
                    <div className={`${prefixCls}__title`}>
                      {type && modalIconMap[type] ? (
                        <span className={`${prefixCls}__icon`}>{modalIconMap[type]}</span>
                      ) : null}
                      {title}
                    </div>
                  ) : null}
                  {closeable ? (
                    <IconButton effect icon={closeIcon} onClick={onClose ?? onRequestCloseLatest} />
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
                            {cancelText}
                          </Button>
                        ) : null,
                        hasConfirm ? (
                          <Button
                            key="2"
                            type="primary"
                            loading={confirmLoading}
                            onClick={() => onConfirm?.()}
                          >
                            {confirmText}
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

export type ModalSizeEnum = HiBaseSizeEnum | undefined

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
   * 展示 footer 与内容的分割阴影。暂不对外暴露
   * @private
   */
  showFooterDivider?: boolean
  /**
   * 禁用 portal。暂不对外暴露
   * @private
   */
  disabledPortal?: boolean
  /**
   * 自定义关闭时 icon。暂不对外暴露
   * @private
   */
  closeIcon?: React.ReactNode
  /**
   * 自定义动画过渡时长。暂不对外暴露
   * @private
   */
  timeout?: number
  /** 。暂不对外暴露
   * @private
   */
  innerRef?: React.Ref<{ close: () => void }>
  /**
   * 关闭动画退出时回调。暂不对外暴露
   * @private
   */
  onExited?: () => void
  /**
   * 打开动画显示时回调。暂不对外暴露
   * @private
   */
  onEntered?: () => void
  /**
   * 确认框类型
   */
  type?: ModalTypeEnum
}

if (__DEV__) {
  Modal.displayName = 'Modal'
}
