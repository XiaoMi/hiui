import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { CSSTransition } from 'react-transition-group'
import {
  InfoCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
} from '@hi-ui/icons'

const _role = 'message'
export const _prefix = getPrefixCls(_role)

const messageIconMap: any = {
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  info: <InfoCircleFilled />,
}

/**
 * TODO: What is Message
 */
export const Message = forwardRef<HTMLDivElement | null, MessageProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      id,
      title,
      visible = true,
      duration = 5000,
      autoClose = true,
      type = 'info',
      $destroy,
      onClose,
      ...rest
    },
    ref
  ) => {
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
      setHeight(0)
    }, [])

    const cls = cx(prefixCls, className, `${prefixCls}--type-${type}`)

    return (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
        in={transitionVisible}
        timeout={410}
        style={{ height }}
        onExit={open}
        onExiting={close}
        onExited={() => {
          $destroy?.()
          onClose?.()
        }}
      >
        <div ref={motionElRef} className={`${prefixCls}-container`}>
          <div ref={ref} role={role} className={cls} {...rest}>
            {messageIconMap[type]}
            {title}
          </div>
        </div>
      </CSSTransition>
    )
  }
)

export interface MessageProps extends Omit<HiBaseHTMLProps<'div'>, 'id' | 'title'> {
  /**
   * 开启可见
   */
  visible?: boolean
  /**
   * 关闭时触发的回调函数
   */
  onClose?: () => void
  /**
   * 通知唯一标识
   */
  id: React.ReactText
  /**
   * 通知框内容
   */
  title: React.ReactNode
  /**
   * 通知框类型
   */
  type?: 'info' | 'success' | 'error' | 'warning'
  /**
   * 自动关闭时间，单位为 ms
   */
  duration?: number

  /**
   * 动画过渡时长
   */
  timeout?: number
  /**
   * 是否开启自动关闭
   */
  autoClose?: boolean
  /**
   * 内部使用，勿覆盖
   */
  $destroy?: () => void
}

if (__DEV__) {
  Message.displayName = 'Message'
}
