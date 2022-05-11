import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { LeftOutlined } from '@hi-ui/icons'
import { useLocaleContext } from '@hi-ui/locale-context'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'zen-mode'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []
const NOOP_FUNC = () => {}
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
  visible = false,
  showBack = true,
  onBack = NOOP_FUNC,
  toolbar = NOOP_ARRAY,
  zoom = 1.8,
  ...rest
}) => {
  const i18n = useLocaleContext()

  const backContent = i18n.get('zenMode.back')

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
        onScroll={(evt) => {
          evt.preventDefault()
          if (!hide) {
            setToolbarHide(true)
          }

          rest.onScroll?.(evt)
        }}
        {...rest}
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
            <span onClick={onBack} className={`${prefixCls}__back-btn`}>
              <LeftOutlined />
              {backContent}
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

export interface ZenModeProps extends HiBaseHTMLProps<'div'> {
  /**
   * 是否开启禅模式
   */
  visible?: boolean
  /**
   * 点击返回按钮的回调
   */
  onBack?: () => void
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
