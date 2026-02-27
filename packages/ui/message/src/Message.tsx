import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { CSSTransition } from 'react-transition-group'
import {
  CloseCircleFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
} from '@hi-ui/icons'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const _role = 'message'
export const _prefix = getPrefixCls(_role)

const messageIconMap: any = {
  success: <CheckCircleFilled />,
  error: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  info: <InfoCircleFilled />,
}

/**
 * 消息
 */
export const Message = forwardRef<HTMLDivElement | null, MessageProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      icon,
      title,
      visible = true,
      duration = 5000,
      autoClose = true,
      type = 'info',
      destroy,
      onClose,
      ...rest
    },
    ref
  ) => {
    const { message: messageConfig } = useGlobalContext()

    const { classNames, styles } = useMergeSemantic<
      MessageSemanticClassNames,
      MessageSemanticStyles,
      MessageProps
    >({
      classNamesList: [messageConfig?.classNames, classNamesProp],
      stylesList: [messageConfig?.styles, stylesProp],
      info: { props: { ...rest, title, type } },
    })

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

    const cls = cx(prefixCls, className, classNames?.root, `${prefixCls}--type-${type}`)

    return (
      <CSSTransition
        classNames={`${prefixCls}--motion`}
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
        <div ref={motionElRef} className={`${prefixCls}-container`}>
          <div
            ref={ref}
            role={role}
            className={cls}
            style={{ ...style, ...styles?.root }}
            {...rest}
          >
            <div className={cx(`${prefixCls}__icon`, classNames?.icon)} style={styles?.icon}>
              {icon ?? messageIconMap[type]}
            </div>
            <span className={cx(classNames?.title)} style={styles?.title}>
              {title}
            </span>
          </div>
        </div>
      </CSSTransition>
    )
  }
)

export type MessageSemanticName = 'root' | 'icon' | 'title'
export type MessageSemanticClassNames = SemanticClassNamesType<MessageProps, MessageSemanticName>
export type MessageSemanticStyles = SemanticStylesType<MessageProps, MessageSemanticName>
export type MessageSemantic = ComponentSemantic<MessageSemanticClassNames, MessageSemanticStyles>

export interface MessageProps extends Omit<HiBaseHTMLProps<'div'>, 'title'>, MessageSemantic {
  /**
   * 开启可见
   */
  visible?: boolean
  /**
   * 关闭时触发的回调函数
   */
  onClose?: () => void
  /**
   * 通知框图标
   */
  icon?: React.ReactNode
  /**
   * 通知框标题
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
   * 是否开启自动关闭
   */
  autoClose?: boolean
  /**
   * 执行销毁，内部使用，勿覆盖。暂不对外暴露
   * @private
   */
  destroy?: () => void
  /**
   * 动画过渡时长。暂不对外暴露
   * @private
   */
  timeout?: number
}

if (__DEV__) {
  Message.displayName = 'Message'
}
