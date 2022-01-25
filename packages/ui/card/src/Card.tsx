import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Loading from '@hi-ui/loading'

const _role = 'card'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Card
 */
export const Card = forwardRef<HTMLDivElement | null, CardProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      extra,
      title,
      cover,
      coverUrl,
      loading,
      hoverable,
      bordered = true,
      size = 'md',
      showHeaderDivider,
      style,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, {
      [`${prefixCls}--${size}`]: size,
      [`${prefixCls}--hoverable`]: hoverable,
      [`${prefixCls}--bordered`]: bordered,
      [`${prefixCls}--no-header`]: !(title || extra),
    })

    return (
      <div ref={ref} role={role} className={cls} style={style}>
        {cover ? <div className={`${prefixCls}__cover`}>{cover}</div> : null}
        {coverUrl ? <img src={coverUrl} /> : null}
        {title || extra ? (
          <div
            className={cx(`${prefixCls}__header`, {
              [`${prefixCls}__header--divider`]: showHeaderDivider,
            })}
          >
            {title && <div className={`${prefixCls}__title`}>{title}</div>}
            {extra && <div className={`${prefixCls}__extra`}>{extra}</div>}
          </div>
        ) : null}
        {loading !== undefined ? (
          <Loading visible={loading}>
            <div className={`${prefixCls}__body`}>{children}</div>
          </Loading>
        ) : (
          <div className={`${prefixCls}__body`}>{children}</div>
        )}
      </div>
    )
  }
)

export interface CardProps {
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
   * 卡片标题
   */
  title?: React.ReactNode

  /**
   * 是否展示边框
   */
  bordered?: boolean

  /**
   * 是否展示加载状态
   */
  loading?: boolean
  /**
   * 鼠标移入卡片时是否显示阴影
   */
  hoverable?: boolean
  /**
   * 标题右侧的拓展区域
   */
  extra?: React.ReactNode
  /**
   * 卡片的封面
   */
  cover?: React.ReactNode

  /**
   * 卡片的封面的图片链接
   */
  coverUrl?: string
  /**
   * 卡片的尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 是否展示卡片头部和内容区域分割线
   */
  showHeaderDivider?: boolean
  /**
   * 内容区域
   */
  children?: React.ReactNode
}

if (__DEV__) {
  Card.displayName = 'Card'
}
