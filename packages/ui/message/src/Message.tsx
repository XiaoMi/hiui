import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import CSSTransition from 'react-transition-group/CSSTransition'

const _role = 'message'
export const _prefix = getPrefixCls(_role)

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
      type = 'info',
      duration = 3000,
      onClose,
      ...rest
    },
    ref
  ) => {
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

    return (
      <CSSTransition
        in={transitionVisible}
        timeout={300}
        classNames={prefixCls}
        onExited={() => {
          // setExited(true)
          onClose?.()
        }}
      >
        <div ref={ref} role={role} className={cls} {...rest}>
          {children}
        </div>
      </CSSTransition>
    )
  }
)

export interface MessageProps extends HiBaseHTMLProps<'div'> {
  duration?: number
  onClose?: () => void
  type?: 'info' | 'success' | 'error' | 'warning'
}

if (__DEV__) {
  Message.displayName = 'Message'
}
