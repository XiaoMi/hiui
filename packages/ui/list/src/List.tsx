import React, { forwardRef, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { PaginationProps, Pagination } from '@hi-ui/pagination'
import { EmptyState } from '@hi-ui/empty-state'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { ListDataItem, ListPaginationPlacementEnum } from './types'
import { transformData } from './utils'

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
      children,
      pagination,
      split = true,
      render,
      bordered = true,
      data,
      fieldNames,
      emptyContent,
      ...rest
    },
    ref
  ) => {

    data = useMemo((): ListDataItem[] => transformData(data,fieldNames), [data,fieldNames])

    const cls = cx(prefixCls, className, {
      [`${prefixCls}--bordered`]: bordered,
      [`${prefixCls}--with-pagination`]: pagination,
    })

    const renderListItem = useCallback(
      (item, index) => {
        return (
          <li
            className={cx(`${prefixCls}-item__wrapper`, {
              [`${prefixCls}-item--split`]: split,
            })}
            key={index}
          >
            {render && render(item)}
          </li>
        )
      },
      [render, split, prefixCls]
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {data && data.length > 0 ? (
          <ul className={cx(`${prefixCls}__wrapper`)}>
            {data.map((item, index) => {
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
            className={`${prefixCls}__pagination`}
            style={{
              justifyContent: getPagePosition(
                pagination as PaginationProps & { placement: ListPaginationPlacementEnum }
              ),
            }}
          >
            <Pagination {...pagination} />
          </div>
        )}
      </div>
    )
  }
)

export interface ListProps extends HiBaseHTMLProps<'div'> {
  /**
   * 列表展示的数据
   */
  data: ListDataItem[]
  /**
   * 设置data中的每一项对应的key
   */
  fieldNames?: Record<string, string>
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
}

if (__DEV__) {
  List.displayName = 'List'
}
