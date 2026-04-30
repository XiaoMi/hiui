import React, { forwardRef, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { PaginationProps, Pagination } from '@hi-ui/pagination'
import { EmptyState } from '@hi-ui/empty-state'
import { HiBaseFieldNames, HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { ListDataItem, ListPaginationPlacementEnum } from './types'
import { transformData } from './utils'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const LIST_PREFIX = getPrefixCls('list')

/**
 * 列表
 */
type Position = 'flex-start' | 'flex-end' | 'center'
const getPagePosition = (
  pagination: PaginationProps & { placement: ListPaginationPlacementEnum }
): Position => {
  let pagePosition: Position = 'flex-end'
  switch (pagination.placement) {
    case 'left':
      pagePosition = 'flex-start'
      break
    case 'middle':
      pagePosition = 'center'
      break

    case 'right':
      pagePosition = 'flex-end'
      break
    default:
      pagePosition = 'flex-end'
  }
  return pagePosition
}

export const List = forwardRef<HTMLDivElement | null, ListProps>(
  (
    {
      prefixCls = LIST_PREFIX,
      role = 'list',
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      pagination,
      split = true,
      render,
      bordered,
      data,
      fieldNames,
      emptyContent,
      header,
      ...rest
    },
    ref
  ) => {
    const { list: listConfig } = useGlobalContext()

    const transformedData = useMemo((): ListDataItem[] => transformData(data, fieldNames), [
      data,
      fieldNames,
    ])

    const { classNames, styles } = useMergeSemantic<
      ListSemanticClassNames,
      ListSemanticStyles,
      ListProps
    >({
      classNamesList: [listConfig?.classNames, classNamesProp],
      stylesList: [listConfig?.styles, stylesProp],
      info: { props: { ...rest, pagination, split, bordered, header } as any },
    })

    const cls = cx(prefixCls, className, classNames?.root, {
      [`${prefixCls}--bordered`]: bordered,
      [`${prefixCls}--with-pagination`]: pagination,
      [`${prefixCls}-item--split`]: split,
    })

    const renderListItem = useCallback(
      (item, index) => {
        return (
          <li
            className={cx(`${prefixCls}-item__wrapper`, classNames?.item, {
              [`${prefixCls}-item--split`]: split,
            })}
            style={styles?.item}
            key={index}
          >
            {render && render(item)}
          </li>
        )
      },
      [render, split, prefixCls, classNames?.item, styles?.item]
    )

    return (
      <div ref={ref} role={role} className={cls} style={{ ...style, ...styles?.root }} {...rest}>
        {header && (
          <div className={cx(`${prefixCls}__header`, classNames?.header)} style={styles?.header}>
            {header}
          </div>
        )}
        {transformedData && transformedData.length > 0 ? (
          <ul className={cx(`${prefixCls}__wrapper`, classNames?.wrapper)} style={styles?.wrapper}>
            {transformedData.map((item, index) => {
              return renderListItem(item, index)
            })}
          </ul>
        ) : typeof emptyContent === 'function' ? (
          emptyContent()
        ) : (
          <EmptyState title={emptyContent} style={{ margin: 16 }} />
        )}
        {pagination && (
          <div
            className={cx(`${prefixCls}__pagination`, classNames?.pagination)}
            style={{
              justifyContent: getPagePosition(
                pagination as PaginationProps & { placement: ListPaginationPlacementEnum }
              ),
              ...styles?.pagination,
            }}
          >
            <Pagination {...pagination} />
          </div>
        )}
      </div>
    )
  }
)

export type ListSemanticName = 'root' | 'header' | 'wrapper' | 'item' | 'pagination'
export type ListSemanticClassNames = SemanticClassNamesType<ListProps, ListSemanticName>
export type ListSemanticStyles = SemanticStylesType<ListProps, ListSemanticName>
export type ListSemantic = ComponentSemantic<ListSemanticClassNames, ListSemanticStyles>

export interface ListProps extends HiBaseHTMLProps<'div'>, ListSemantic {
  /**
   * 列表展示的数据
   */
  data: ListDataItem[]
  /**
   * 设置data中的每一项对应的key
   */
  fieldNames?: HiBaseFieldNames
  /**
   * 自定义渲染列表项
   */
  render?: (item: ListDataItem) => React.ReactNode
  /**
   * 是否展示分割线
   */
  split?: boolean
  /**
   * 对应的 pagination 配置, 设置 undefined 不显示
   */
  pagination?: PaginationProps & { placement: ListPaginationPlacementEnum }
  /**
   * 是否展示边框
   */
  bordered?: boolean
  /**
   * 数据为空时的展示内容
   */
  emptyContent?: React.ReactNode | (() => React.ReactNode)
  /**
   * 列表头部
   */
  header?: React.ReactNode
}

if (__DEV__) {
  List.displayName = 'List'
}
