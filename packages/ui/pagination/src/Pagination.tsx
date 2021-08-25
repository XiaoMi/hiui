import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { PagerButton } from './PagerButton'
import { Pager } from './Pager'
import { calculatePage } from './util'
const _role = 'pagination'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Pagination
 */
export const Pagination = forwardRef<HTMLUListElement | null, PaginationProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      onChange,
      className,
      current,
      defaultCurrent,
      pageSize = 10,
      max = 2,
      total,
      type = 'default',
    },
    ref
  ) => {
    const [currentPage, updateCurrentPage] = useState(current || defaultCurrent || 1)
    useEffect(() => {
      if (current && current !== currentPage) {
        updateCurrentPage(current)
      }
    }, [current, currentPage])

    const onClick = useCallback(
      (page) => {
        if (onChange) {
          onChange(page, currentPage, pageSize)
        }
      },
      [onChange, currentPage, pageSize]
    )

    const cls = cx(prefixCls, className)
    const maxPage = calculatePage(total, pageSize)

    const renderPagers = useCallback(() => {
      let leftBuffer, rightBuffer
      const pagers = []
      if (max * 2 + 1 + 2 >= maxPage) {
        leftBuffer = 1
        rightBuffer = maxPage
      } else if (maxPage - currentPage <= max) {
        rightBuffer = maxPage
        leftBuffer = maxPage - 2 * max - 1
        leftBuffer = leftBuffer <= 1 ? 1 : leftBuffer
      } else if (currentPage - max <= 1) {
        leftBuffer = 1
        rightBuffer = 2 * max + leftBuffer + 1
        rightBuffer = rightBuffer >= maxPage ? maxPage : rightBuffer
      } else {
        leftBuffer = currentPage - max
        rightBuffer = currentPage + max
      }
      if (leftBuffer !== 1) {
        pagers.push(
          <Pager
            page={1}
            active={currentPage === 1}
            key={1}
            onClick={onClick}
            prefixCls={prefixCls}
          />
        )
      }
      if (leftBuffer > 2) {
        pagers.push(<Pager page={'...'} key={'break-1'} />)
      }
      for (let index = leftBuffer; index <= rightBuffer; index++) {
        pagers.push(
          <Pager
            page={index}
            active={currentPage === index}
            key={index}
            onClick={onClick}
            prefixCls={prefixCls}
          />
        )
      }
      if (rightBuffer < maxPage - 1) {
        pagers.push(<Pager page={'...'} key={'break-2'} />)
      }
      if (rightBuffer !== maxPage) {
        pagers.push(
          <Pager
            page={maxPage}
            active={currentPage === maxPage}
            key={maxPage}
            onClick={onClick}
            prefixCls={prefixCls}
          />
        )
      }
      return pagers
    }, [currentPage, maxPage, max, onClick, prefixCls])

    return (
      <ul ref={ref} role={role} className={cls}>
        <PagerButton type="prev" prefixCls={prefixCls} onClick={onClick} current={currentPage} />
        {renderPagers()}
        <PagerButton type="next" prefixCls={prefixCls} onClick={onClick} current={currentPage} />
      </ul>
    )
  }
)

export interface PaginationProps {
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
   * 当前页码
   */
  current?: number

  /**
   * 默认当前页码
   */
  defaultCurrent?: number

  /**
   * 最大显示的页数
   */
  max?: number
  /**
   * 	每页条数
   */
  pageSize: number
  /**
   * 	数组总数
   */
  total: number

  /**
   * 	是否展示数组总数
   */
  showTotal?: boolean
  /**
   * 分页器类型
   */
  type?: 'default' | 'simple' | 'shrink'
  /**
   * 	只有一页时是否隐藏分页器
   */
  autoHide?: boolean
  /**
   * 	是否显示跳转
   */
  showJumper?: boolean
  /**
   * 	指定每页可以显示多少条
   */
  pageSizeOptions?: number[]
  /**
   * 	快速跳转时触发
   */
  onJump?: (current: number) => void
  /**
   * 	页码改变时的回调
   */
  onChange?: (current: number, prev: number, pageSize: number) => void
  /**
   * 	每页显示条数改变的回调函数
   */
  onPageSizeChange?: (pageSize: number, current: number) => void
}

if (__DEV__) {
  Pagination.displayName = 'Pagination'
}
