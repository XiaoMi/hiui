import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'breadcrumb'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Breadcrumb
 */
export const Breadcrumb = forwardRef<HTMLUListElement | null, BreadcrumbProps>(
  ({ prefixCls = _prefix, role = _role, className, data, separator, onClick, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <ul ref={ref} role={role} className={cls} {...rest}>
        {data?.map((item, index) => (
          <li key={index} className={`${cls}__item`}>
            {item.href && index !== data.length - 1 ? (
              <a
                href={item.href}
                target={item.target}
                onClick={(e) => {
                  if (onClick) {
                    onClick(e, item, index)
                  }
                }}
                className={cx(`${cls}__content`, {
                  [`${cls}__content--active`]: index === data.length - 1,
                })}
              >
                {item.content}
              </a>
            ) : (
              <span
                className={cx(`${cls}__content`, {
                  [`${cls}__content--active`]: index === data.length - 1,
                })}
                onClick={(e) => {
                  if (onClick) {
                    onClick(e, item, index)
                  }
                }}
              >
                {item.content}
              </span>
            )}

            <span className={`${cls}__separator`}>{separator}</span>
          </li>
        ))}
      </ul>
    )
  }
)

export interface BreadcrumbItemProps {
  /**
   * 面包屑的内容
   */
  content?: React.ReactNode
  /**
   * 要跳转的路径
   */
  href?: string
  /**
   * 要跳转的打开方式
   */
  target?: '_self' | '_blank' | '_parent' | '_top'
}

export interface BreadcrumbProps {
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
   * 面包屑分隔符
   */
  separator?: React.ReactNode
  /**
   * 面包屑数据项
   */
  data?: BreadcrumbItemProps[]
  /**
   * 点击事件
   */
  onClick?: (e: React.MouseEvent, item: BreadcrumbItemProps, index: number) => void
}

if (__DEV__) {
  Breadcrumb.displayName = 'Breadcrumb'
}
