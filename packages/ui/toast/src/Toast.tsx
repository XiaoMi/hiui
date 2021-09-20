import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import CSSTransition from 'react-transition-group/CSSTransition'
import { isFunction } from '@hi-ui/type-assertion'

const _role = 'toast'
export const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Toast
 */
export const Toast = forwardRef<HTMLDivElement | null, ToastProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      title,
      id,
      visible = true,
      timeout = 300,
      autoClose = true,
      duration = 5000,
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

    const cls = cx(prefixCls, className)

    return (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
        in={transitionVisible}
        timeout={timeout}
        style={{ height }}
        onExit={open}
        onExiting={close}
        onExited={onClose}
      >
        <div ref={motionElRef} className={`${prefixCls}-container`}>
          <div ref={ref} role={role} className={cls} {...rest}>
            {isFunction(title) ? title({ id, close: requestClose }) : title}
          </div>
        </div>
      </CSSTransition>
    )
  }
)

export interface ToastProps extends Omit<HiBaseHTMLProps<'div'>, 'id' | 'title'> {
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
  title: React.ReactNode | ((option: { id: React.ReactText; close: () => void }) => React.ReactNode)
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
}

if (__DEV__) {
  Toast.displayName = 'Toast'
}
