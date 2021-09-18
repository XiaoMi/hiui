import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import CSSTransition from 'react-transition-group/CSSTransition'
import { ExclamationCircleFilled, InfoCircleFilled, CloseCircleFilled, CheckCircleOutlined } from '@hi-ui/icons';

const _role = 'message'
export const _prefix = getPrefixCls(_role)

const messageIconMap: any = {
  success: <CheckCircleOutlined/>,
  danger: <CloseCircleFilled/>,
  warning: <ExclamationCircleFilled/>,
  primary: <InfoCircleFilled/>,
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
      type: typeProp = 'info',
      duration = 3000,
      onClose,
      ...rest
    },
    ref
  ) => {
    let type = typeProp === 'info' ? 'primary' : typeProp
    type = type === 'error' ? 'danger' : type

    const [transitionVisible, setTransitionVisible] = useState(false)
    // const [exited, setExited] = useState(true)

    const timerRef = useRef(0)

    useEffect(() => {
      setTransitionVisible(true)

      if (typeof duration !== 'number') return

      timerRef.current = window.setTimeout(() => {
        setTransitionVisible(false)
      }, duration)

      return () => {
        clearTimeout(timerRef.current)
      }
    }, [duration])

    const cls = cx(prefixCls, className, `${prefixCls}--type-${type}`)

    console.log('transitionVisible',transitionVisible);

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

    return (
      <CSSTransition
        in={transitionVisible}
        timeout={500}
        style={{ height }}
        classNames={prefixCls}
        // unmountOnClose={true}
        onExit={open}
        onExiting={close}
        onExited={() => {
          onClose?.()
        }}
      >
        <div ref={motionElRef} className={`${prefixCls}__container`}>
          <div ref={ref} role={role} className={cls} {...rest}>
            {messageIconMap[type]}
            {children}
          </div>
        </div>

      </CSSTransition>
    )
  }
)

export interface MessageProps extends HiBaseHTMLProps<'div'> {
  duration?: number
  onClose?: () => void
  type?: 'primary' | 'success' | 'danger' | 'warning'
}

if (__DEV__) {
  Message.displayName = 'Message'
}
