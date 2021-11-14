import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useFilter, UseFilterProps } from './use-filter'
import { FilterProvider, useFilterContext } from './context'

const FILTER_PREFIX = getPrefixCls('filter')

/**
 * TODO: What is Filter
 */
export const Filter = forwardRef<HTMLDivElement | null, FilterProps>(
  (
    {
      prefixCls = FILTER_PREFIX,
      role = 'filter',
      className,
      children,
      label,
      labelWidth = 80,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const { rootProps, ...context } = useFilter(rest)

    return (
      <FilterProvider value={context}>
        <div ref={ref} role={role} className={cls} {...rootProps}>
          <div className={`${prefixCls}__label`} style={{ width: labelWidth }}>
            <span className={`${prefixCls}__label-title`}>{label}</span>
          </div>
          <ul className={`${prefixCls}__items`}>{children}</ul>
          <div></div>
        </div>
      </FilterProvider>
    )
  }
)

export interface FilterProps extends HiBaseHTMLProps<'div'>, UseFilterProps {
  /**
   * 筛选标题
   */
  label?: string
  /**
   * 筛选标题宽度
   */
  labelWidth?: number
}

if (__DEV__) {
  Filter.displayName = 'Filter'
}

const FILTER_ITEM_PREFIX = getPrefixCls('filter-item')

/**
 * TODO: What is FilterItem
 */
export const FilterItem = forwardRef<HTMLLIElement | null, FilterItemProps>(
  (
    {
      prefixCls = FILTER_ITEM_PREFIX,
      role = 'filter-item',
      className,
      children,
      value,
      disabled: disabledProp = false,
      onClick,
      ...rest
    },
    ref
  ) => {
    const { showUnderline, isSelectedId, onItemSelect } = useFilterContext()

    const option = React.useMemo(() => {
      return { id: value, disabled: disabledProp, content: children }
    }, [value, disabledProp, children])

    const onClickLatest = useLatestCallback(onClick)

    const handleClick = React.useCallback(
      (evt: React.MouseEvent<HTMLLIElement>) => {
        onClickLatest(evt)
        onItemSelect(option)
      },
      [onItemSelect, option, onClickLatest]
    )

    const checked = isSelectedId(option.id)

    const cls = cx(
      prefixCls,
      className,
      checked && `${prefixCls}--active`,
      checked && showUnderline && `${prefixCls}--active-underline`,
      option.disabled && `${prefixCls}--disabled`
    )

    return (
      <li ref={ref} role={role} className={cls} {...rest} onClick={handleClick}>
        {children}
      </li>
    )
  }
)

export interface FilterItemProps extends HiBaseHTMLProps<'li'> {
  /**
   * 选中的值 id
   */
  value: React.ReactText
  /**
   * 是否禁用
   */
  disabled?: boolean
}

if (__DEV__) {
  FilterItem.displayName = 'FilterItem'
}
