import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { DefaultPagination, PaginationProps } from './DefaultPagination'
import { ShrinkPagination } from './ShrinkPagination'

const PAGINATION_PREFIX = getPrefixCls('pagination')

export const Pagination = forwardRef<HTMLDivElement | null, PaginationProps>(
  (
    { prefixCls = PAGINATION_PREFIX, role = 'pagination', type, className, children, ...rest },
    ref
  ) => {
    const cls = cx(prefixCls, className)
    if (type === 'default') {
      return <DefaultPagination ref={ref} className={cls} {...rest} />
    }
    return <ShrinkPagination ref={ref} className={cls} {...rest} />
  }
)

if (__DEV__) {
  Pagination.displayName = 'Pagination'
}
