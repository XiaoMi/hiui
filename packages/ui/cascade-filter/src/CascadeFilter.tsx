import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useCascadeFilter, UseCascadeFilterProps } from './use-cascade-filter'
import { CascadeFilterProvider } from './context'
import { Filter, FilterItem } from '@hi-ui/filter'

const CASCADE_FILTER_PREFIX = getPrefixCls('cascade-filter')

/**
 * TODO: What is CascadeFilter
 */
export const CascadeFilter = forwardRef<HTMLDivElement | null, CascadeFilterProps>(
  (
    { prefixCls = CASCADE_FILTER_PREFIX, role = 'cascade-filter', className, children, ...rest },
    ref
  ) => {
    // TODO: 使用 自定义hook 抽离逻辑，若不需要可以移除
    const { rootProps, data } = useCascadeFilter(rest)

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rootProps}>
        {/* {data.map((dataItem, idx) => {
          return (
            <Filter key={idx}>
              {dataItem.map((item) => {
                return (
                  <FilterItem value={item.id} key={item.id}>
                    {item.content}
                  </FilterItem>
                )
              })}
            </Filter>
          )
        })} */}
      </div>
    )
  }
)

export interface CascadeFilterProps extends HiBaseHTMLProps<'div'>, UseCascadeFilterProps {}

if (__DEV__) {
  CascadeFilter.displayName = 'CascadeFilter'
}
