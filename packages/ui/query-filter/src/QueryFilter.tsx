import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { FilterForm, FilterFormProps, useCacheSelectedData } from './FilterForm'

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
      children,
      filterFields,
      formData,
      onChange,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const { cacheSelectedData } = useCacheSelectedData()

    const handleChange = (formData: Record<string, unknown>) => {
      onChange?.(formData)
    }

    return (
      <div ref={ref} role={role} className={cls}>
        <FilterForm
          placement="horizontal"
          showLabel={false}
          showPin={false}
          appearance="contained"
          filterFields={filterFields}
          formData={formData}
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

export interface QueryFilterProps extends HiBaseHTMLProps<'div'>, FilterFormProps {
  /**
   * 表单数据变化回调
   */
  onChange?: (formData: Record<string, unknown>) => void
}

if (__DEV__) {
  QueryFilter.displayName = 'QueryFilter'
}
