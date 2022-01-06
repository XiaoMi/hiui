import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CheckboxGroupProvider } from './context'
import { useLatestCallback } from '@hi-ui/use-latest'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { CheckboxPlacementEnum, CheckboxDataItem } from './types'
import { checkDefault } from '@hi-ui/use-check'
import { Checkbox } from './Checkbox'
import { isArrayNonEmpty, isObject } from '@hi-ui/type-assertion'

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
      placement = CheckboxPlacementEnum.horizontal,
      defaultValue = [],
      name,
      value: valueProp,
      onChange,
      data: dataProp,
      children,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const handleChange = useLatestCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
      const { checked, value: selectedItem } = evt.target
      const nextValue = checkDefault(value, selectedItem, checked)
      tryChangeValue(nextValue)
    })

    const providedValue = useMemo(
      () => ({
        onChange: handleChange,
        name,
        value,
        disabled,
      }),
      [handleChange, disabled, value, name]
    )

    const data = useMemo(() => {
      if (!dataProp) return null
      return dataProp.map((item) => {
        return isObject(item) ? item : { id: item, content: item }
      })
    }, [dataProp])

    const hasData = isArrayNonEmpty(data)

    const cls = cx(
      prefixCls,
      className,
      placement === 'vertical' && `${prefixCls}--vertical`,
      hasData && `${prefixCls}--data-wrap`
    )

    // data 优先级大于内嵌式组合
    if (hasData) {
      children = data!.map(({ id, disabled, content }) => (
        <Checkbox
          key={id}
          value={id}
          disabled={disabled}
          checked={value.includes(id)}
          className={`${prefixCls}__item`}
        >
          {content}
        </Checkbox>
      ))
    }

    return (
      <CheckboxGroupProvider value={providedValue}>
        <div ref={ref} className={cls} {...rest}>
          {children}
        </div>
      </CheckboxGroupProvider>
    )
  }
)

export interface CheckboxGroupProps extends HiBaseHTMLProps<'div'> {
  /**
   * 排列方式
   */
  placement?: CheckboxPlacementEnum
  /**
   *   指定可选项
   */
  data?: React.ReactText[] | CheckboxDataItem[]
  /**
   * 默认选中的项
   */
  defaultValue?: React.ReactText[]
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * CheckboxGroup 下所有 input[type="checkbox"] 的 name 属性
   */
  name?: string
  /**
   * 变化时的回调
   */
  onChange?: (checkedIds: React.ReactText[]) => void
  /**
   * 指定选中的项
   */
  value?: React.ReactText[]
}

if (__DEV__) {
  CheckboxGroup.displayName = 'CheckboxGroup'
}
