import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import Breadcrumb, { BreadcrumbProps } from '@hi-ui/breadcrumb'
import IconButton from '@hi-ui/icon-button'
import { LeftShortOutlined } from '@hi-ui/icons'

const PAGE_HEADER_PREFIX = getPrefixCls('page-header')

export const PageHeader = forwardRef<HTMLDivElement | null, PageHeaderProps>(
  (
    {
      prefixCls = PAGE_HEADER_PREFIX,
      role = 'page-header',
      className,
      title,
      breadcrumb,
      subTitle,
      backIcon = true,
      extra,
      onBack,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {breadcrumb && (
          <div className={`${prefixCls}__breadcrumb`}>
            <Breadcrumb {...breadcrumb} />
          </div>
        )}
        <div className={`${prefixCls}__content`}>
          <div className={`${prefixCls}__title-container`}>
            {backIcon !== false && (
              <IconButton
                className={`${prefixCls}__back-button`}
                icon={typeof backIcon === 'boolean' ? <LeftShortOutlined /> : backIcon}
                effect
                onClick={onBack}
              />
            )}
            <div className={`${prefixCls}__title`}>{title}</div>
            {subTitle && <div className={`${prefixCls}__sub-title`}>{subTitle}</div>}
          </div>
          {extra && <div className={`${prefixCls}__extra`}>{extra}</div>}
        </div>
      </div>
    )
  }
)

export interface PageHeaderProps extends HiBaseHTMLProps<'div'> {
  /**
   * 标题
   */
  title?: React.ReactNode
  /**
   * 副标题
   */
  subTitle?: React.ReactNode
  /**
   * 返回图标
   */
  backIcon?: React.ReactNode | boolean
  /**
   * 面包屑
   */
  breadcrumb?: BreadcrumbProps
  /**
   * 额外内容
   */
  extra?: React.ReactNode
  /**
   * 返回按钮点击事件
   */
  onBack?: (evt: React.MouseEvent) => void
}

if (__DEV__) {
  PageHeader.displayName = 'PageHeader'
}
