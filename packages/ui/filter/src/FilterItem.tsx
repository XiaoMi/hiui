import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useSelect } from '@hi-ui/use-check'
import { FilterDataItem } from './types'

const FILTER_ITEM_PREFIX = getPrefixCls('filter-item')

const NOOP_ARRAY = [] as []
const allowSelect = (item: FilterDataItem) => !item.disabled

/**
 * TODO: What is FilterItem
 */
export const FilterItem = forwardRef<HTMLDivElement | null, FilterProps>(
  (
    {
      prefixCls = FILTER_ITEM_PREFIX,
      className,
      children,
      appearance = 'link',
      label,
      labelWidth = 80,
      showUnderline = false,
      defaultValue = '',
      value: valueProp,
      data = NOOP_ARRAY,
      onChange,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(
      defaultValue,
      valueProp,
      onChange,
      Object.is
    )

    const [onItemSelect, isSelectedId] = useSelect({
      selectedId: value,
      onSelect: tryChangeValue,
      allowSelect,
    })

    const rootProps = {
      role: 'radiogroup',
      ...rest,
    }
    const cls = cx(prefixCls, `${prefixCls}--appearance-${appearance}`, className)

    return (
      <div ref={ref} className={cls} {...rootProps}>
        {label ? (
          <div className={`${prefixCls}__label`} style={{ width: labelWidth, overflow: 'hidden' }}>
            <span className={`${prefixCls}__label-title`}>{label}</span>
          </div>
        ) : null}
        <ul className={`${prefixCls}__values`}>
          {data.map((item) => {
            const option = item

            const checked = isSelectedId(option.id)

            const cls = cx(
              `${prefixCls}__value`,
              checked && `${prefixCls}__value--active`,
              checked &&
                showUnderline &&
                appearance === 'link' &&
                `${prefixCls}__value--active-underline`,
              option.disabled && `${prefixCls}__value--disabled`
            )

            return (
              <li key={option.id} className={cls} onClick={() => onItemSelect(option)}>
                <div className={`${prefixCls}__value__text`}>{option.title}</div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
)

export interface FilterProps extends HiBaseHTMLProps<'div'> {
  /**
   * 筛选表头选择时形状
   */
  appearance?: 'link' | 'filled'
  /**
   * 筛选标题
   */
  label?: React.ReactText
  /**
   * 筛选标题宽度
   */
  labelWidth?: number
  /**
   * 是否显示下划线
   */
  showUnderline?: boolean
  /**
   * 默认选中项的值
   */
  defaultValue?: React.ReactText
  /**
   * 被选中项的值
   */
  value?: React.ReactText
  /**
   * 选择时的回调函数，	value 表示选中项的 ID 集合
   */
  onChange?: (value: React.ReactText, targetItem: FilterDataItem) => void
  /**
   * 筛选选项数据
   */
  data?: FilterDataItem[]
}

if (__DEV__) {
  FilterItem.displayName = 'FilterItem'
}
