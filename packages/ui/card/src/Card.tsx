import React, { forwardRef } from 'react'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'
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
      subtitle,
      cover,
      coverUrl,
      loading,
      hoverable = false,
      bordered = true,
      size = 'md',
      showHeaderDivider,
      ...rest
    },
    ref
  ) => {
    const hasHeader = !!title || !!extra || !!subtitle

    const cls = cx(prefixCls, className, {
      [`${prefixCls}--size-${size}`]: size,
      [`${prefixCls}--hoverable`]: hoverable,
      [`${prefixCls}--bordered`]: bordered,
      [`${prefixCls}--no-header`]: !hasHeader,
    })

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {cover ? <div className={`${prefixCls}__cover`}>{cover}</div> : null}
        {coverUrl ? <img src={coverUrl} /> : null}
        {hasHeader ? (
          <div
            className={cx(`${prefixCls}__header`, {
              [`${prefixCls}__header--divider`]: showHeaderDivider,
            })}
          >
            {title || extra ? (
              <div className={`${prefixCls}__head`}>
                {title ? <div className={`${prefixCls}__title`}>{title}</div> : null}
                {extra ? <div className={`${prefixCls}__extra`}>{extra}</div> : null}
              </div>
            ) : null}
            {subtitle ? <div className={`${prefixCls}__subtitle`}>{subtitle}</div> : null}
          </div>
        ) : null}
        <div className={`${prefixCls}__body`}>
          {children}
          {/* 需要用到这个功能才开启，即传入 boolean */}
          {typeof loading === 'boolean' ? (
            <Loading className={`${prefixCls}__loading`} visible={loading} />
          ) : null}
        </div>
      </div>
    )
  }
)

export type CardSizeEnum = Omit<HiBaseSizeEnum, 'lg'>

export interface CardProps extends HiBaseHTMLProps<'div'> {
  /**
   * 卡片标题
   */
  title?: React.ReactNode
  /**
   * 卡片副标题。暂不对外暴露
   * @private
   */
  subtitle?: React.ReactNode
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
  size?: CardSizeEnum
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
