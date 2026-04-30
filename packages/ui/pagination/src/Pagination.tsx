import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import {
  DefaultPagination,
  PaginationProps,
  PaginationSemanticClassNames,
  PaginationSemanticStyles,
} from './DefaultPagination'
import { ShrinkPagination } from './ShrinkPagination'
import { useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'

const PAGINATION_PREFIX = getPrefixCls('pagination')

export const Pagination = forwardRef<HTMLDivElement | null, PaginationProps>(
  (
    {
      prefixCls = PAGINATION_PREFIX,
      role = 'pagination',
      type = 'default',
      className,
      style,
      children,
      size: sizeProp,
      classNames: classNamesProp,
      styles: stylesProp,
      ...rest
    },
    ref
  ) => {
    const { size: globalSize, pagination: paginationConfig } = useGlobalContext() as ReturnType<
      typeof useGlobalContext
    > & {
      pagination?: {
        classNames?: PaginationSemanticClassNames
        styles?: PaginationSemanticStyles
      }
    }
    let size = sizeProp ?? globalSize ?? 'sm'
    if (size === 'lg') {
      size = 'md'
    }

    const { classNames, styles } = useMergeSemantic<
      PaginationSemanticClassNames,
      PaginationSemanticStyles,
      PaginationProps
    >({
      classNamesList: [paginationConfig?.classNames, classNamesProp],
      stylesList: [paginationConfig?.styles, stylesProp],
      info: { props: { ...rest, type, size } },
    })

    const cls = cx(prefixCls, className, classNames?.root, `${prefixCls}--size-${size}`)
    const mergedStyle = { ...style, ...styles?.root }
    if (type === 'default') {
      return (
        <DefaultPagination
          ref={ref}
          className={cls}
          style={mergedStyle}
          classNames={classNames}
          styles={styles}
          size={size}
          {...rest}
        />
      )
    }
    return (
      <ShrinkPagination
        ref={ref}
        className={cls}
        style={mergedStyle}
        classNames={classNames}
        styles={styles}
        size={size}
        {...rest}
      />
    )
  }
)

if (__DEV__) {
  Pagination.displayName = 'Pagination'
}
