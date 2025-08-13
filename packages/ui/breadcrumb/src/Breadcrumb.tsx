import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { BreadcrumbDataItem, BreadcrumbSizeEnum } from './types'
import { HiBaseFieldNames, HiBaseHTMLProps } from '@hi-ui/core'
import { RightOutlined } from '@hi-ui/icons'
import { transformData } from './util'

const _role = 'breadcrumb'
const _prefix = getPrefixCls(_role)

/**
 * 面包屑
 */
export const Breadcrumb = forwardRef<HTMLUListElement | null, BreadcrumbProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      data,
      fieldNames,
      separator = '/',
      onClick,
      size = 'md',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, `${prefixCls}--${size}`, className)

    const transformedData = useMemo((): BreadcrumbDataItem[] | undefined => {
      if (data) return transformData(data, fieldNames)
      return data
    }, [data, fieldNames])

    return (
      <ul ref={ref} role={role} className={cls} {...rest}>
        {transformedData?.map((item, index) => (
          <li key={index} className={`${prefixCls}__item`}>
            {item.href && index !== transformedData.length - 1 ? (
              <a
                href={item.href}
                target={item.target}
                onClick={(e) => {
                  if (onClick) {
                    onClick(e, item, index)
                  }
                }}
                className={cx(`${prefixCls}__content`, {
                  [`${prefixCls}__content--active`]: index === transformedData.length - 1,
                })}
              >
                {item.icon ? <span className={`${prefixCls}__icon`}> {item.icon}</span> : null}
                {item.title}
              </a>
            ) : (
              <span
                className={cx(`${prefixCls}__content`, {
                  [`${prefixCls}__content--active`]: index === transformedData.length - 1,
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

            <span className={`${prefixCls}__separator`}>
              <RightOutlined />
            </span>
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
   * 设置 data 中 title, href, target, icon  对应的 key
   */
  fieldNames?: HiBaseFieldNames
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
