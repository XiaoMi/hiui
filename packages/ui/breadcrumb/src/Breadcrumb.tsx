import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { BreadcrumbDataItem, BreadcrumbSizeEnum } from './types'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'breadcrumb'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Breadcrumb
 */
export const Breadcrumb = forwardRef<HTMLUListElement | null, BreadcrumbProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      data,
      separator = '/',
      onClick,
      size = 'md',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, `${prefixCls}--${size}`, className)

    return (
      <ul ref={ref} role={role} className={cls} {...rest}>
        {data?.map((item, index) => (
          <li key={index} className={`${prefixCls}__item`}>
            {item.href && index !== data.length - 1 ? (
              <a
                href={item.href}
                target={item.target}
                onClick={(e) => {
                  if (onClick) {
                    onClick(e, item, index)
                  }
                }}
                className={cx(`${prefixCls}__content`, {
                  [`${prefixCls}__content--active`]: index === data.length - 1,
                })}
              >
                {item.icon}
                {item.title}
              </a>
            ) : (
              <span
                className={cx(`${prefixCls}__content`, {
                  [`${prefixCls}__content--active`]: index === data.length - 1,
                })}
                onClick={(e) => {
                  if (onClick) {
                    onClick(e, item, index)
                  }
                }}
              >
                {item.icon ? <span className={`${prefixCls}__icon`}> {item.icon}</span> : null}
                {item.title}
              </span>
            )}

            <span className={`${prefixCls}__separator`}>{separator}</span>
          </li>
        ))}
      </ul>
    )
  }
)

export interface BreadcrumbProps extends Omit<HiBaseHTMLProps<'ul'>, 'onClick'> {
  /**
   * 面包屑分隔符
   */
  separator?: React.ReactNode
  /**
   * 面包屑数据项
   */
  data?: BreadcrumbDataItem[]
  /**
   * 面包屑尺寸
   */
  size?: BreadcrumbSizeEnum
  /**
   * 点击事件
   */
  onClick?: (evt: React.MouseEvent, item: BreadcrumbDataItem, index: number) => void
}

if (__DEV__) {
  Breadcrumb.displayName = 'Breadcrumb'
}
