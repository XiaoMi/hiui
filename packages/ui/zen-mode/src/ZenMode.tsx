import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { LeftOutlined } from '@hi-ui/icons'
import { setTimeout } from 'timers'

const _role = 'zen-mode'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is ZenMode
 */
const getDefaultContainer = () => {
  const defaultContainer = document.createElement('div')
  document.body.appendChild(defaultContainer)
  return defaultContainer
}

export const ZenMode: React.FC<ZenModeProps> = ({
  prefixCls = _prefix,
  className,
  children,
  visible,
  style,
  onReturn = () => {},
  toolbar = [],
}) => {
  const defaultContainer = useRef(getDefaultContainer())
  const [hide, setToolbarHide] = useState(false)

  const cls = cx(prefixCls, className)

  useEffect(() => {
    const parent = defaultContainer.current.parentNode as HTMLElement
    if (parent) {
      // 屏蔽滚动条
      if (visible) {
        parent.style.setProperty('overflow', 'hidden')
      } else {
        parent.style.removeProperty('overflow')
      }
    }
    if (visible) {
      setTimeout(() => {
        setToolbarHide(true)
      }, 3000)
    }
  }, [visible])

  return visible ? (
    createPortal(
      <div
        className={cls}
        style={style}
        onScroll={(e) => {
          e.preventDefault()
          if (!hide) {
            setToolbarHide(true)
          }
        }}
      >
        <div
          className={cx(`${prefixCls}__toolbar`, { [`${prefixCls}__toolbar--hide`]: hide })}
          onMouseEnter={(e) => {
            e.preventDefault()
            if (hide) {
              setToolbarHide(false)
            }
          }}
          onMouseLeave={(e) => {
            e.preventDefault()
            if (!hide) {
              setToolbarHide(true)
            }
          }}
        >
          <span onClick={onReturn} className={`${prefixCls}__back-btn`}>
            <LeftOutlined />
            返回
          </span>
        </div>
        <div
          className={cx(`${prefixCls}__content`, { [`${prefixCls}__content--hide`]: hide })}
          style={{
            zoom: 1.8,
          }}
        >
          {children}
        </div>
      </div>,
      defaultContainer.current
    )
  ) : (
    <div className={`${prefixCls}__wrapper`}>{children}</div>
  )
}

export default ZenMode

export interface ZenModeProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   * 是否开启禅模式
   */
  visible?: boolean
  /**
   * 是否开启禅模式
   */
  onReturn?: () => void
  toolbar?: React.ReactNode[]
}

if (__DEV__) {
  ZenMode.displayName = 'ZenMode'
}
