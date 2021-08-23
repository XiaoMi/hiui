import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'

const _role = 'pagination'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Pagination
 */
export const Pagination = forwardRef<HTMLDivElement | null, PaginationProps>(
  ({ prefixCls = _prefix, role = _role, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {children}
      </div>
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
  current: number

  /**
   * 默认当前页码
   */
  defaultCurrent: number

  /**
   * 最大显示的页数
   */
  max: number
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
  showTotal: boolean
}

if (__DEV__) {
  Pagination.displayName = 'Pagination'
}
