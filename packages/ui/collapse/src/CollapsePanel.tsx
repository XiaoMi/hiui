import React, { forwardRef, useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useCollapseContext } from './context'

const _role = 'collapse-panel'
const _prefix = getPrefixCls(_role)

const ActionDelayMs = 100

/**
 * 折叠面板
 */
export const CollapsePanel = forwardRef<HTMLDivElement | null, CollapsePanelProps>(
  (
    { prefixCls = _prefix, role = _role, className, children, style, disabled = false, id, title },
    ref
  ) => {
    const isInInitialize = useRef(true)

    const { judgeIsActive, showArrow, arrowPlacement, onClickPanel } = useCollapseContext()

    const active = useMemo(() => judgeIsActive(id), [id, judgeIsActive])

    const contentRef = useRef<HTMLDivElement | null>(null)

    const [wrapperStyle, setWrapperStyle] = useState<React.CSSProperties>(
      active ? { height: 'auto', opacity: 1 } : { height: '0px', opacity: '0' }
    )

    // 动画结束时，当活跃状态，去除具体值（此时用户添加更多内容一样可以跟随）
    const onTransitionEnd = useCallback(() => {
      setWrapperStyle(active ? { height: 'auto', opacity: 1 } : { height: '0px', opacity: '0' })
    }, [active])

    useEffect(() => {
      // 初始化时不做任何处理
      if (isInInitialize.current) {
        isInInitialize.current = false
        return
      }
      let handler

      // 清除之未完成的副作用
      clearTimeout(handler)

      if (active) {
        // 切换成激活态
        // 先将 height 设置为 0px
        // 延迟后设置真实的高度
        setWrapperStyle({ height: '0px', opacity: '0' })
        handler = setTimeout(() => {
          if (contentRef.current) {
            setWrapperStyle({
              height: `${contentRef.current.getBoundingClientRect().height}px`,
              opacity: 1,
            })
          }
        }, ActionDelayMs)
      } else {
        // 切换成隐藏态
        // 先将 height 设置为 真实高度尺寸
        // 延迟后设置 0px 隐藏
        if (contentRef.current) {
          setWrapperStyle({
            height: `${contentRef.current.getBoundingClientRect().height}px`,
            opacity: 1,
          })
        }
        handler = setTimeout(() => {
          setWrapperStyle({ height: '0px', opacity: '0' })
        }, ActionDelayMs)
      }
    }, [active])

    return (
      <div
        ref={ref}
        role={role}
        style={style}
        className={cx(prefixCls, className, {
          [`${prefixCls}--disabled`]: disabled,
          [`${prefixCls}--show`]: active,
        })}
      >
        <div className={`${prefixCls}__head`} onClick={() => !disabled && onClickPanel(id)}>
          {showArrow && arrowPlacement === 'left' && <div className={`${prefixCls}__icon`}>^</div>}
          <div className={`${prefixCls}__title`}>{title}</div>
          {showArrow && arrowPlacement === 'right' && <div className={`${prefixCls}__icon`}>^</div>}
        </div>
        <div
          className={`${prefixCls}__content-wrapper`}
          style={wrapperStyle}
          onTransitionEnd={onTransitionEnd}
        >
          <div className={`${prefixCls}__content`} ref={contentRef}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)

export interface CollapsePanelProps {
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

  /**
   * 	面板唯一标识
   */
  id: string
  /**
   * 面板的标题
   */
  title: React.ReactNode
  /**
   * 是否禁用面板
   * @default false
   */
  disabled?: boolean
  /**
   * 面板的内容
   */
  children?: React.ReactNode
}

if (__DEV__) {
  CollapsePanel.displayName = 'Collapse.Panel'
}
