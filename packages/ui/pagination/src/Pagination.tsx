import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { DefaultPagination, PaginationProps } from './DefaultPagination'
import { ShrinkPagination } from './ShrinkPagination'

const PAGINATION_PREFIX = getPrefixCls('pagination')

export const Pagination = forwardRef<HTMLDivElement | null, PaginationProps>(
  (
    {
      prefixCls = PAGINATION_PREFIX,
      role = 'pagination',
      type = 'default',
      className,
      children,
      size = 'sm',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, `${prefixCls}--size-${size}`)
    if (type === 'default') {
      return <DefaultPagination ref={ref} className={cls} size={size} {...rest} />
    }
    return <ShrinkPagination ref={ref} className={cls} size={size} {...rest} />
  }
)

if (__DEV__) {
  Pagination.displayName = 'Pagination'
}
