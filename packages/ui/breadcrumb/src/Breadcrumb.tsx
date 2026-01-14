import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { BreadcrumbDataItem, BreadcrumbSizeEnum } from './types'
import { HiBaseFieldNames, HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { RightOutlined } from '@hi-ui/icons'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
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
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      data,
      fieldNames,
      separator = <RightOutlined />,
      onClick,
      size: sizeProp,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize, breadcrumb: breadcrumbConfig } = useGlobalContext()
    const size = sizeProp ?? globalSize ?? 'md'

    const { classNames, styles } = useMergeSemantic<
      BreadcrumbSemanticClassNames,
      BreadcrumbSemanticStyles,
      BreadcrumbProps
    >({
      classNamesList: [breadcrumbConfig?.classNames, classNamesProp],
      stylesList: [breadcrumbConfig?.styles, stylesProp],
      info: { props: { ...rest } },
    })

    const cls = cx(prefixCls, `${prefixCls}--${size}`, className, classNames?.root)

    const transformedData = useMemo((): BreadcrumbDataItem[] | undefined => {
      if (data) return transformData(data, fieldNames)
      return data
    }, [data, fieldNames])

    return (
      <ul ref={ref} role={role} className={cls} style={styles?.root} {...rest}>
        {transformedData?.map((item, index) => (
          <li
            key={index}
            className={cx(`${prefixCls}__item`, classNames?.item)}
            style={styles?.item}
          >
            {item.href && index !== transformedData.length - 1 ? (
              <a
                href={item.href}
                target={item.target}
                onClick={(e) => {
                  if (onClick) {
                    onClick(e, item, index)
                  }
                }}
                className={cx(`${prefixCls}__content`, classNames?.content, {
                  [`${prefixCls}__content--active`]: index === transformedData.length - 1,
                })}
                style={styles?.content}
              >
                {item.icon ? (
                  <span className={cx(`${prefixCls}__icon`, classNames?.icon)} style={styles?.icon}>
                    {' '}
                    {item.icon}
                  </span>
                ) : null}
                {item.title}
              </a>
            ) : (
              <span
                className={cx(`${prefixCls}__content`, classNames?.content, {
                  [`${prefixCls}__content--active`]: index === transformedData.length - 1,
                })}
                style={styles?.content}
                onClick={(e) => {
                  if (onClick) {
                    onClick(e, item, index)
                  }
                }}
              >
                {item.icon ? (
                  <span className={cx(`${prefixCls}__icon`, classNames?.icon)} style={styles?.icon}>
                    {' '}
                    {item.icon}
                  </span>
                ) : null}
                {item.title}
              </span>
            )}

            <span
              className={cx(`${prefixCls}__separator`, classNames?.separator)}
              style={styles?.separator}
            >
              {separator}
            </span>
          </li>
        ))}
      </ul>
    )
  }
)

export type BreadcrumbSemanticName = 'root' | 'item' | 'content' | 'icon' | 'separator'
export type BreadcrumbSemanticClassNames = SemanticClassNamesType<
  BreadcrumbProps,
  BreadcrumbSemanticName
>
export type BreadcrumbSemanticStyles = SemanticStylesType<BreadcrumbProps, BreadcrumbSemanticName>
export type BreadcrumbSemantic = ComponentSemantic<
  BreadcrumbSemanticClassNames,
  BreadcrumbSemanticStyles
>

export interface BreadcrumbProps
  extends Omit<HiBaseHTMLProps<'ul'>, 'onClick'>,
    BreadcrumbSemantic {
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
