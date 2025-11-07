import React, { forwardRef } from 'react'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Loading from '@hi-ui/loading'
import { isNullish, isUndef } from '@hi-ui/type-assertion'

const _role = 'card'
const _prefix = getPrefixCls(_role)

/**
 * 卡片
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
      size: sizeProp,
      showHeaderDivider,
      scrollHeight,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize } = useGlobalContext()
    const size = sizeProp ?? globalSize ?? 'md'

    const hasHeader = !!title || !!extra || !!subtitle

    const cls = cx(prefixCls, className, {
      [`${prefixCls}--size-${size}`]: size,
      [`${prefixCls}--hoverable`]: hoverable,
      [`${prefixCls}--bordered`]: bordered,
      [`${prefixCls}--no-header`]: !hasHeader,
    })

    const enabledBodyScroll = !isUndef(scrollHeight)

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
            {subtitle ? <div className={`${prefixCls}__subhead`}>{subtitle}</div> : null}
          </div>
        ) : null}
        {/* 没有 children 且非 loading 态 ，则不渲染 body 内容 */}
        {!isNullish(children) || loading === true ? (
          <div
            className={`${prefixCls}__body`}
            style={{
              maxHeight: enabledBodyScroll ? scrollHeight : undefined,
              overflowY: enabledBodyScroll ? 'auto' : undefined,
            }}
          >
            {children}
            {/* 需要用到这个功能才开启，即传入 boolean */}
            {loading ? <Loading className={`${prefixCls}__loading`} visible={loading} /> : null}
          </div>
        ) : null}
      </div>
    )
  }
)

export type CardSizeEnum = 'sm' | 'md'

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
  /**
   * 设置内容区滚动高度，超出该高度触发内容区整体滚动。暂时不对外暴露
   * @private
   */
  scrollHeight?: number
}

if (__DEV__) {
  Card.displayName = 'Card'
}
