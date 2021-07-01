import React, { forwardRef, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CheckboxGroupProvider } from './context'

const _role = 'checkbox-group'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CheckboxGroup
 */
export const CheckboxGroup = forwardRef<HTMLDivElement | null, CheckboxGroupProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      disabled = false,
      placement = 'horizontal',
      defaultValue = [],
      value: valueProp,
      onChange,
      ...rest
    },
    ref
  ) => {
    const [value, tryChange] = useUncontrolledState(defaultValue, valueProp, onChange)

    const handleChange = useCallback(
      (evt) => {
        const { value: selectedItem } = evt.target

        const nextValue = updateMultipleSelectedItems(value, selectedItem)
        tryChange(nextValue)
      },
      [tryChange, value]
    )

    const cls = cx(prefixCls, placement === 'vertical' && `${prefixCls}--vertical`, className)

    const providedValue = useMemo(
      () => ({
        onChange: handleChange,
        value,
        disabled,
      }),
      [handleChange, disabled, value]
    )

    return (
      <CheckboxGroupProvider value={providedValue}>
        {/* TODO: 抽离为排版 Flex 组件，同一排版使用 */}
        <div ref={ref} className={cls} {...rest} />
      </CheckboxGroupProvider>
    )
  }
)

export interface CheckboxGroupProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  children?: React.ReactNode
  placement?: 'vertical' | 'horizontal'
  disabled?: boolean
  value?: React.ReactText[]
  defaultValue?: React.ReactText[]
  onChange?: (checkedList: React.ReactText[]) => void
}

if (__DEV__) {
  CheckboxGroup.displayName = 'CheckboxGroup'
}

function updateMultipleSelectedItems<T>(list: T[], updatedItem: T) {
  let shouldRemoved = false

  const nextList = list.filter((item) => {
    const removed = item === updatedItem

    if (removed) {
      shouldRemoved = removed
    }

    return !removed
  })

  if (!shouldRemoved) {
    nextList.push(updatedItem)
  }

  return nextList
}
