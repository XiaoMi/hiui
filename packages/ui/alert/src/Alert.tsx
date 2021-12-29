import React, { forwardRef, useState, useCallback, useEffect, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import {
  InfoCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
  CloseOutlined,
} from '@hi-ui/icons'

const _role = 'alert'
const _prefix = getPrefixCls(_role)

const alertIconMap: any = {
  success: <CheckCircleFilled />,
  danger: <CloseCircleFilled />,
  warning: <ExclamationCircleFilled />,
  primary: <InfoCircleFilled />,
}

/**
 * What is Alert
 */
export const Alert = forwardRef<HTMLDivElement | null, AlertProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      title,
      content,
      type = 'primary',
      closeable = false,
      duration = -1,
      onClose,
      ...rest
    },
    ref
  ) => {
    const [internalVisible, setInternalVisible] = useState(true)

    const handleClose = useCallback(() => {
      setInternalVisible(false)
      onClose?.()
    }, [onClose])

    const prevUpdaterRef = useRef(0)

    useEffect(() => {
      // TODO: 1. 抽离为 useTimeout 逻辑（props变化需要取消定时器以及页面卸载时取消定时器这一套逻辑） 2. 处理 window 支持 SSR
      if (typeof duration === 'number' && duration > 0) {
        window.clearTimeout(prevUpdaterRef.current)

        prevUpdaterRef.current = window.setTimeout(() => {
          handleClose()
        }, duration)
      }
      return () => {
        window.clearTimeout(prevUpdaterRef.current)
      }
    }, [duration, handleClose])

    const cls = cx(prefixCls, className, `${prefixCls}--${type}`, {
      [`${prefixCls}--with-content`]: content,
    })

    return internalVisible ? (
      <div ref={ref} role={role} className={cls} {...rest}>
        <div className={`${prefixCls}__title`}>
          <span className={`${prefixCls}__icon`}>{alertIconMap[type]}</span>
          {title}
        </div>
        {content && <div className={`${prefixCls}__content`}>{content}</div>}
        {closeable && <CloseOutlined onClick={handleClose} className={`${prefixCls}__close`} />}
      </div>
    ) : null
  }
)

export interface AlertProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties

  type?: 'primary' | 'success' | 'danger' | 'warning'
  duration?: number
  closeable?: boolean
  title?: React.ReactNode
  content?: React.ReactNode
  onClose?: () => void
}

if (__DEV__) {
  Alert.displayName = 'Alert'
}
