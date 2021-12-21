import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { Filter, FilterItem } from '@hi-ui/filter'
import { useCascadeFilter, UseCascadeFilterProps } from './use-cascade-filter'

const CASCADE_FILTER_PREFIX = getPrefixCls('cascade-filter')

/**
 * TODO: What is CascadeFilter
 */
export const CascadeFilter = forwardRef<HTMLDivElement | null, CascadeFilterProps>(
  (
    {
      prefixCls = CASCADE_FILTER_PREFIX,
      role = 'menu',
      className,
      children,
      showUnderline = false,
      labelWidth,
      ...rest
    },
    ref
  ) => {
    const { rootProps, menus, onItemSelect } = useCascadeFilter(rest)

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rootProps}>
        {menus.map((menu) => {
          return (
            <Filter
              key={menu.depth}
              label={menu.label}
              value={menu.value}
              labelWidth={labelWidth}
              onChange={(_, targetItem) => onItemSelect(targetItem, menu.depth)}
              showUnderline={showUnderline}
            >
              {menu.data.map((item) => {
                return (
                  <FilterItem key={item.id} value={item.id} disabled={item.disabled}>
                    {item.title}
                  </FilterItem>
                )
              })}
            </Filter>
          )
        })}
      </div>
    )
  }
)

export interface CascadeFilterProps extends HiBaseHTMLProps<'div'>, UseCascadeFilterProps {
  /**
   * 是否显示下划线
   */
  showUnderline?: boolean
  /**
   * 筛选标题宽度
   */
  labelWidth?: number
}

if (__DEV__) {
  CascadeFilter.displayName = 'CascadeFilter'
}
