import React, { forwardRef, useState, useEffect, ReactNode } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

import { AlertTypeEnum } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useTimeout } from '@hi-ui/use-timeout'
import { IconButton } from '@hi-ui/icon-button'
import { alertIconMap, defaultCloseIcon } from './icons'

const _prefix = getPrefixCls('alert')

/**
 * 警告提示
 *
 * 作用于页面的内容区域的提示，非触发类信息
 *
 * TODO:
 *  1. 添加关闭动效
 */
export const Alert = forwardRef<HTMLDivElement | null, AlertProps>(
  (
    {
      prefixCls = _prefix,
      role = 'alert',
      className,
      children,
      title,
      content,
      type = AlertTypeEnum.PRIMARY,
      closeable = true,
      showIcon = true,
      closeIcon = defaultCloseIcon,
      // duration小于 0，表示不开启自动关闭
      duration = -1,
      onClose,
      extra,
      ...rest
    },
    ref
  ) => {
    const [internalVisible, setInternalVisible] = useState(true)

    const handleClose = useLatestCallback(() => {
      setInternalVisible(false)
      onClose?.()
    })

    const { start: startCloseTimer, clear: clearCloseTimer } = useTimeout(() => {
      handleClose()
    }, duration)

    useEffect(() => {
      clearCloseTimer()
      startCloseTimer()
      return () => {
        clearCloseTimer()
      }
    }, [clearCloseTimer, startCloseTimer])

    const suffixIcon = alertIconMap[type] || null

    const cls = cx(
      prefixCls,
      className,
      suffixIcon && `${prefixCls}--type-${type}`,
      content && `${prefixCls}--with-content`
    )

    return internalVisible ? (
      <div ref={ref} role={role} className={cls} {...rest}>
        {showIcon && suffixIcon ? <span className={`${prefixCls}__icon`}>{suffixIcon}</span> : null}
        <div className={`${prefixCls}__message`}>
          <div className={`${prefixCls}__title`}>
            <div className={`${prefixCls}__title__text`}>{title}</div>
            {extra && <div className={`${prefixCls}__title__extra`}>{extra}</div>}
          </div>
          {content ? <div className={`${prefixCls}__content`}>{content}</div> : null}
        </div>
        {closeable && closeIcon ? (
          <IconButton className={`${prefixCls}__close`} onClick={handleClose} icon={closeIcon} />
        ) : null}
      </div>
    ) : null
  }
)

export interface AlertProps extends HiBaseHTMLProps<'div'> {
  /**
   * 	警告提示类型
   */
  type?: AlertTypeEnum
  /**
   * 	警告提示标题
   */
  title: React.ReactNode
  /**
   * 	警告提示内容
   */
  content?: React.ReactNode
  /**
   * 	是否可关闭
   */
  closeable?: boolean
  /**
   * 	自动关闭时间，单位为毫秒
   */
  duration?: number
  /**
   * 关闭事件触发时的回调
   */
  onClose?: () => void
  /**
   * 自定义关闭 Icon
   * @version 4.0.0
   */
  closeIcon?: React.ReactNode
  /**
   * 是否显示提示图标
   * @version 4.0.0
   */
  showIcon?: boolean
  /**
   * 标题右侧的扩展内容
   */
  extra?: ReactNode
}

if (__DEV__) {
  Alert.displayName = 'Alert'
}
