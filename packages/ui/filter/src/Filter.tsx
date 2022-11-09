import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { FilterItem } from './FilterItem'
import { useFilter, UseFilterProps } from './use-filter'

const CASCADE_FILTER_PREFIX = getPrefixCls('filter')

/**
 * TODO: What is Filter
 */
export const Filter = forwardRef<HTMLDivElement | null, FilterProps>(
  (
    {
      prefixCls = CASCADE_FILTER_PREFIX,
      role = 'menu',
      className,
      children,
      appearance = 'link',
      showUnderline = false,
      labelWidth,
      ...rest
    },
    ref
  ) => {
    const { rootProps, menus, onItemSelect } = useFilter(rest)

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rootProps}>
        {menus.map((menu) => {
          return (
            <FilterItem
              prefixCls={`${prefixCls}-item`}
              key={menu.depth}
              label={menu.label}
              value={menu.value}
              data={menu.data}
              labelWidth={labelWidth}
              onChange={(_, targetItem) => onItemSelect(targetItem, menu.depth)}
              appearance={appearance}
              showUnderline={showUnderline}
            />
          )
        })}
      </div>
    )
  }
)

export interface FilterProps extends HiBaseHTMLProps<'div'>, UseFilterProps {
  /**
   * 筛选表头选择时形状
   */
  appearance?: 'link' | 'filled'
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
  Filter.displayName = 'Filter'
}
