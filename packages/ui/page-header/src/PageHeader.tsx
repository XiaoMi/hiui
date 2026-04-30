import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import Breadcrumb, { BreadcrumbProps } from '@hi-ui/breadcrumb'
import { LeftShortOutlined } from '@hi-ui/icons'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const PAGE_HEADER_PREFIX = getPrefixCls('page-header')

export const PageHeader = forwardRef<HTMLDivElement | null, PageHeaderProps>(
  (
    {
      prefixCls = PAGE_HEADER_PREFIX,
      role = 'page-header',
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
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
    const { pageHeader: pageHeaderConfig } = useGlobalContext()

    const { classNames, styles } = useMergeSemantic<
      PageHeaderSemanticClassNames,
      PageHeaderSemanticStyles,
      PageHeaderProps
    >({
      classNamesList: [pageHeaderConfig?.classNames, classNamesProp],
      stylesList: [pageHeaderConfig?.styles, stylesProp],
      info: {
        props: { ...rest, title, subTitle, breadcrumb, backIcon, extra },
      },
    })

    return (
      <div
        ref={ref}
        role={role}
        className={cx(prefixCls, className, classNames?.root)}
        style={{ ...style, ...styles?.root }}
        {...rest}
      >
        {breadcrumb && (
          <div
            className={cx(`${prefixCls}__breadcrumb`, classNames?.breadcrumb)}
            style={styles?.breadcrumb}
          >
            <Breadcrumb {...breadcrumb} />
          </div>
        )}
        <div className={cx(`${prefixCls}__content`, classNames?.content)} style={styles?.content}>
          <div
            className={cx(`${prefixCls}__title-container`, classNames?.titleContainer)}
            style={styles?.titleContainer}
          >
            {backIcon !== false && (
              <span
                className={cx(`${prefixCls}__back-button`, classNames?.backButton)}
                style={styles?.backButton}
                onClick={onBack}
              >
                {typeof backIcon === 'boolean' ? <LeftShortOutlined /> : backIcon}
              </span>
            )}
            <div className={cx(`${prefixCls}__title`, classNames?.title)} style={styles?.title}>
              {title}
            </div>
            {subTitle && (
              <div
                className={cx(`${prefixCls}__sub-title`, classNames?.subTitle)}
                style={styles?.subTitle}
              >
                {subTitle}
              </div>
            )}
          </div>
          {extra && (
            <div className={cx(`${prefixCls}__extra`, classNames?.extra)} style={styles?.extra}>
              {extra}
            </div>
          )}
        </div>
      </div>
    )
  }
)

export type PageHeaderSemanticName =
  | 'root'
  | 'breadcrumb'
  | 'content'
  | 'titleContainer'
  | 'backButton'
  | 'title'
  | 'subTitle'
  | 'extra'
export type PageHeaderSemanticClassNames = SemanticClassNamesType<
  PageHeaderProps,
  PageHeaderSemanticName
>
export type PageHeaderSemanticStyles = SemanticStylesType<PageHeaderProps, PageHeaderSemanticName>
export type PageHeaderSemantic = ComponentSemantic<
  PageHeaderSemanticClassNames,
  PageHeaderSemanticStyles
>

export interface PageHeaderProps extends HiBaseHTMLProps<'div'>, PageHeaderSemantic {
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
