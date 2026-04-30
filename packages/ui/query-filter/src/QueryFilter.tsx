import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { FilterForm, FilterFormProps, useCacheSelectedData } from './FilterForm'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const QUERY_FILTER_PREFIX = getPrefixCls('query-filter')

/**
 * 筛选表单
 */
export const QueryFilter = forwardRef<HTMLDivElement | null, QueryFilterProps>(
  (
    {
      prefixCls = QUERY_FILTER_PREFIX,
      role = 'query-filter',
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      children,
      filterFields,
      formData,
      onChange,
      ...rest
    },
    ref
  ) => {
    const globalContext = useGlobalContext()
    const queryFilterConfig = globalContext?.queryFilter
    const { classNames, styles } = useMergeSemantic<
      QueryFilterSemanticClassNames,
      QueryFilterSemanticStyles,
      QueryFilterProps
    >({
      classNamesList: [queryFilterConfig?.classNames, classNamesProp],
      stylesList: [queryFilterConfig?.styles, stylesProp],
      info: { props: { ...rest, filterFields, formData } },
    })
    const cls = cx(prefixCls, className, classNames?.root)

    const { cacheSelectedData } = useCacheSelectedData()

    const handleChange = (formData: Record<string, unknown>) => {
      onChange?.(formData)
    }

    return (
      <div ref={ref} role={role} className={cls} style={{ ...style, ...styles?.root }}>
        <FilterForm
          placement="horizontal"
          showLabel={false}
          showPin={false}
          appearance="contained"
          filterFields={filterFields}
          formData={formData}
          classNames={{ form: classNames?.form }}
          styles={{ form: styles?.form }}
          onChange={(value, allValues) => {
            handleChange(allValues)
          }}
          onDataChange={(field, value, item, items) => {
            cacheSelectedData(field, value, item, items)
          }}
          {...rest}
        />
      </div>
    )
  }
)

export type QueryFilterSemanticName = 'root' | 'form'
export type QueryFilterSemanticClassNames = SemanticClassNamesType<
  QueryFilterProps,
  QueryFilterSemanticName
>
export type QueryFilterSemanticStyles = SemanticStylesType<
  QueryFilterProps,
  QueryFilterSemanticName
>
export type QueryFilterSemantic = ComponentSemantic<
  QueryFilterSemanticClassNames,
  QueryFilterSemanticStyles
>
export interface QueryFilterProps
  extends HiBaseHTMLProps<'div'>,
    Omit<FilterFormProps, 'classNames' | 'styles'>,
    QueryFilterSemantic {
  /**
   * 表单数据变化回调
   */
  onChange?: (formData: Record<string, unknown>) => void
}

if (__DEV__) {
  QueryFilter.displayName = 'QueryFilter'
}
