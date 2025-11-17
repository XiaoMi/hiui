import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { DefaultPagination, PaginationProps } from './DefaultPagination'
import { ShrinkPagination } from './ShrinkPagination'
import { useGlobalContext } from '@hi-ui/core'

const PAGINATION_PREFIX = getPrefixCls('pagination')

export const Pagination = forwardRef<HTMLDivElement | null, PaginationProps>(
  (
    {
      prefixCls = PAGINATION_PREFIX,
      role = 'pagination',
      type = 'default',
      className,
      children,
      size: sizeProp,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize } = useGlobalContext()
    let size = sizeProp ?? globalSize ?? 'sm'
    if (size === 'lg') {
      size = 'md'
    }

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
