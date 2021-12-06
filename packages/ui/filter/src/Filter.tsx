import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useFilter, UseFilterProps } from './use-filter'
import { FilterProvider, useFilterContext } from './context'
import { callAllFuncs } from '@hi-ui/func-utils'

const FILTER_PREFIX = getPrefixCls('filter')

/**
 * TODO: What is Filter
 */
export const Filter = forwardRef<HTMLDivElement | null, FilterProps>(
  (
    {
      prefixCls = FILTER_PREFIX,
      className,
      children,
      label,
      labelWidth = 80,
      showUnderline = false,
      ...rest
    },
    ref
  ) => {
    const { rootProps, isSelectedId, onItemSelect } = useFilter(rest)

    const providedValue = useMemo(() => ({ showUnderline, isSelectedId, onItemSelect }), [
      isSelectedId,
      onItemSelect,
      showUnderline,
    ])

    const cls = cx(prefixCls, className)

    return (
      <FilterProvider value={providedValue}>
        <div ref={ref} className={cls} {...rootProps}>
          {label ? (
            <div
              className={`${prefixCls}__label`}
              style={{ width: labelWidth, overflow: 'hidden' }}
            >
              <span className={`${prefixCls}__label-title`}>{label}</span>
            </div>
          ) : null}
          <ul className={`${prefixCls}__items`}>{children}</ul>
        </div>
      </FilterProvider>
    )
  }
)

export interface FilterProps extends HiBaseHTMLProps<'div'>, UseFilterProps {
  /**
   * 筛选标题
   */
  label?: React.ReactText
  /**
   * 筛选标题宽度
   */
  labelWidth?: number
  showUnderline?: boolean
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
      role = 'radio',
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

    const option = useMemo(() => ({ id: value, disabled: disabledProp, title: children }), [
      value,
      disabledProp,
      children,
    ])

    const checked = isSelectedId(option.id)

    const cls = cx(
      prefixCls,
      className,
      checked && `${prefixCls}--active`,
      checked && showUnderline && `${prefixCls}--active-underline`,
      option.disabled && `${prefixCls}--disabled`
    )

    return (
      <li
        ref={ref}
        role={role}
        className={cls}
        {...rest}
        onClick={callAllFuncs(onClick, () => onItemSelect(option))}
      >
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
