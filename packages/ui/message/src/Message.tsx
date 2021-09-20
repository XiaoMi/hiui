import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import CSSTransition from 'react-transition-group/CSSTransition'
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
      type = 'info',
      onClose,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, setTransitionVisible] = useState(false)

    const timerRef = useRef(0)

    useEffect(() => {
      setTransitionVisible(visible)

      if (!visible) return
      if (typeof duration !== 'number') return

      timerRef.current = window.setTimeout(() => {
        setTransitionVisible(false)
      }, duration)

      return () => {
        clearTimeout(timerRef.current)
      }
    }, [duration, visible])

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
          onClose?.()
        }}
      >
        <div ref={motionElRef} className={`${prefixCls}-container`}>
          <div ref={ref} role={role} className={cls} {...rest}>
            {messageIconMap[type]}
            {children}
          </div>
        </div>
      </CSSTransition>
    )
  }
)

export interface MessageProps extends Omit<HiBaseHTMLProps<'div'>, 'id' | 'title'> {
  /**
   * 消息唯一标识
   */
  id?: React.ReactText
  /**
   * 自动关闭时间，单位为 ms
   */
  duration?: number
  /**
   * 关闭时触发的回调函数
   */
  onClose?: () => void
  /**
   * 通知框类型
   */
  type?: 'info' | 'success' | 'error' | 'warning'
  /**
   * 通知框标题
   */
  title?: React.ReactNode
  /**
   * 控制状态
   */
  status?: 'entering' | 'active' | 'exiting'
  /**
   * 开启可见
   */
  visible?: boolean
}

if (__DEV__) {
  Message.displayName = 'Message'
}
