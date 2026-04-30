import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, HiBaseSizeEnum, useGlobalContext } from '@hi-ui/core'
import { CSSTransition } from 'react-transition-group'
import { IconButton } from '@hi-ui/icon-button'
import {
  InfoCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  CloseOutlined,
  ExclamationCircleFilled,
} from '@hi-ui/icons'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const _role = 'notification'
export const notificationPrefix = getPrefixCls(_role)

const notificationIconMap: any = {
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  info: <InfoCircleFilled />,
}

/**
 * 通知
 */
export const Notification = forwardRef<HTMLDivElement | null, NotificationProps>(
  (
    {
      prefixCls = notificationPrefix,
      role = _role,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      title,
      content,
      visible = true,
      duration = 5000,
      autoClose = true,
      closable = true,
      type = 'info',
      action,
      destroy,
      size: sizeProp,
      onClose,
      direction = 'right',
      ...rest
    },
    ref
  ) => {
    const { size: globalSize, notification: notificationConfig } = useGlobalContext()
    let size = sizeProp ?? globalSize ?? 'lg'
    if (size === 'xs') {
      size = 'sm'
    }

    const [transitionVisible, setTransitionVisible] = useState(false)

    const timerRef = useRef(0)

    const requestClose = useCallback(() => {
      timerRef.current = 0
      setTransitionVisible(false)
    }, [])

    useEffect(() => {
      setTransitionVisible(visible)

      if (!visible) return
      if (autoClose === false) return
      if (typeof duration !== 'number') return

      timerRef.current = window.setTimeout(() => {
        requestClose()
      }, duration)

      return () => {
        clearTimeout(timerRef.current)
      }
    }, [duration, visible, autoClose, requestClose])

    const [height, setHeight] = useState<number>()
    const motionElRef = useRef<HTMLDivElement>(null)

    // 0 => scrollHeight
    const open = useCallback(() => {
      const nextHeight = motionElRef.current?.scrollHeight || 0
      setHeight(nextHeight)
    }, [])
    // scrollHeight => 0
    const close = useCallback(() => {
      // 修改样式渲染 dom 时机无法保证，为此下一帧渲染以产生动画过渡态
      window.requestAnimationFrame(() => {
        setHeight(0)
      })
    }, [])

    const { classNames, styles } = useMergeSemantic<
      NotificationSemanticClassNames,
      NotificationSemanticStyles,
      NotificationProps
    >({
      classNamesList: [notificationConfig?.classNames, classNamesProp],
      stylesList: [notificationConfig?.styles, stylesProp],
      info: { props: { ...rest, title, content, type, size, direction, closable } },
    })

    const cls = cx(
      prefixCls,
      className,
      classNames?.root,
      `${prefixCls}--type-${type}`,
      `${prefixCls}--size-${size}`
    )
    const transitionCls = cx(`${prefixCls}--${direction}`)
    const containerCls = cx(
      `${prefixCls}-container`,
      `${prefixCls}--placement-${direction}`,
      classNames?.container
    )

    return (
      <CSSTransition
        classNames={transitionCls}
        in={transitionVisible}
        timeout={410}
        style={{ height }}
        onExit={open}
        onExiting={close}
        onExited={() => {
          destroy?.()
          onClose?.()
        }}
        // 参考：https://github.com/reactjs/react-transition-group/issues/918
        nodeRef={motionElRef}
      >
        <div ref={motionElRef} className={containerCls} style={{ ...styles?.container }}>
          <div
            ref={ref}
            role={role}
            className={cls}
            style={{ ...style, ...styles?.root }}
            {...rest}
          >
            <div className={cx(`${prefixCls}__header`, classNames?.header)} style={styles?.header}>
              <span className={cx(`${prefixCls}__icon`, classNames?.icon)} style={styles?.icon}>
                {' '}
                {notificationIconMap[type]}
              </span>
              <span className={cx(`${prefixCls}__title`, classNames?.title)} style={styles?.title}>
                {title}
              </span>
            </div>
            {content ? (
              <div
                className={cx(`${prefixCls}__content`, classNames?.content)}
                style={styles?.content}
              >
                {content}
              </div>
            ) : null}
            {action ? (
              <div
                className={cx(`${prefixCls}__footer`, classNames?.footer)}
                style={styles?.footer}
              >
                {action}
              </div>
            ) : null}
            {closable ? (
              <div className={cx(`${prefixCls}__close`, classNames?.close)} style={styles?.close}>
                <IconButton effect icon={<CloseOutlined />} onClick={requestClose} />
              </div>
            ) : null}
          </div>
        </div>
      </CSSTransition>
    )
  }
)

export type NotificationSemanticName =
  | 'root'
  | 'container'
  | 'header'
  | 'icon'
  | 'title'
  | 'content'
  | 'footer'
  | 'close'
export type NotificationSemanticClassNames = SemanticClassNamesType<
  NotificationProps,
  NotificationSemanticName
>
export type NotificationSemanticStyles = SemanticStylesType<
  NotificationProps,
  NotificationSemanticName
>
export type NotificationSemantic = ComponentSemantic<
  NotificationSemanticClassNames,
  NotificationSemanticStyles
>

export interface NotificationProps
  extends Omit<HiBaseHTMLProps<'div'>, 'title'>,
    NotificationSemantic {
  /**
   * 开启可见
   */
  visible?: boolean
  /**
   * 关闭时触发的回调函数
   */
  onClose?: () => void
  /**
   * 通知框标题
   */
  title: React.ReactNode
  /**
   * 通知框内容
   */
  content?: React.ReactNode
  /**
   * 通知框类型
   */
  type?: 'info' | 'success' | 'error' | 'warning'
  /**
   * 自动关闭时间，单位为 ms
   */
  duration?: number
  /**
   * 是否开启自动关闭
   */
  autoClose?: boolean
  /**
   * 开启点击关闭
   */
  closable?: boolean
  /**
   * 内部使用，勿覆盖。暂不对外暴露
   * @private
   */
  destroy?: () => void
  /**
   * 动画过渡时长。暂不对外暴露
   * @private
   */
  timeout?: number
  /**
   * 操作配置
   */
  action?: React.ReactNode
  /**
   * 通知框尺寸
   */
  size?: Omit<HiBaseSizeEnum, 'xs'>
  /**
   * 弹出方向
   */
  direction?: 'left' | 'right'
}

if (__DEV__) {
  Notification.displayName = 'Notification'
}
