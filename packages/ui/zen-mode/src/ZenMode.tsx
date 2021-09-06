import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { LeftOutlined } from '@hi-ui/icons'

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
  showBack = true,
  style,
  onReturn = () => {},
  toolbar = [],
  zoom = 1.8,
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
          {showBack && (
            <span onClick={onReturn} className={`${prefixCls}__back-btn`}>
              <LeftOutlined />
              返回
            </span>
          )}
          <div className={`${prefixCls}__toolbar-opt`}>{toolbar}</div>
        </div>
        <div
          className={cx(`${prefixCls}__content`, { [`${prefixCls}__content--hide`]: hide })}
          style={{
            zoom,
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
   * 点击返回按钮的回调
   */
  onReturn?: () => void
  /**
   * 自定义工具栏
   */
  toolbar?: React.ReactNode[]
  /**
   * 是否展示返回按钮
   */
  showBack?: boolean
  /**
   *  放大比例
   */
  zoom?: number
}

if (__DEV__) {
  ZenMode.displayName = 'ZenMode'
}
