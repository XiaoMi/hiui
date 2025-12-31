import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, GlobalConfig } from '@hi-ui/core'
import { FilterForm, FilterFormProps, useCacheSelectedData } from './FilterForm'

const _prefix = getPrefixCls('query-filter')

/**
 * 筛选表单
 */
export const QueryFilter = forwardRef<HTMLDivElement | null, QueryFilterProps>(
  (
    {
      prefixCls: prefixClsProp,
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
    const globalPrefixCls = GlobalConfig.prefixCls
    const prefixCls =
      prefixClsProp || (globalPrefixCls && getPrefixCls('query-filter', globalPrefixCls)) || _prefix
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
