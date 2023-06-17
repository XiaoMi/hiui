import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLFieldProps } from '@hi-ui/core'
import { useRadioGroup, UseRadioGroupProps } from './use-radio-group'
import { RadioGroupProvider } from './context'
import { RadioDataItem, RadioGroupTypeEnum, RadioGroupPlacementEnum } from './types'
import { isArrayNonEmpty } from '@hi-ui/type-assertion'
import { Radio } from './Radio'

const RADIO_GROUP_PREFIX = getPrefixCls('radio-group')

/**
 * 单选组合器
 */
export const RadioGroup = forwardRef<HTMLDivElement | null, RadioGroupProps>(
  (
    {
      prefixCls = RADIO_GROUP_PREFIX,
      className,
      children,
      data,
      type = RadioGroupTypeEnum.DEFAULT,
      placement = RadioGroupPlacementEnum.HORIZONTAL,
      ...rest
    },
    ref
  ) => {
    const { rootProps, name, value, onChange, isChecked, disabled } = useRadioGroup(rest)

    const providedValue = useMemo(
      () => ({
        name,
        onChange,
        value,
        isChecked,
        disabled,
        type,
        placement,
      }),
      [name, onChange, value, isChecked, disabled, type, placement]
    )

    const hasData = isArrayNonEmpty(data)

    // data 优先级大于内嵌式组合
    if (hasData) {
      children = data!.map(({ id, disabled, title }) => (
        <Radio
          key={id}
          value={id}
          name={name}
          disabled={disabled}
          checked={isChecked(id)}
          className={`${prefixCls}__item`}
        >
          {title}
        </Radio>
      ))
    }

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--placement-${placement}`,
      `${prefixCls}--type-${type}`,
      hasData && `${prefixCls}--data-wrap`
    )

    return (
      <RadioGroupProvider value={providedValue}>
        <div ref={ref} className={cls} {...rootProps}>
          {children}
        </div>
      </RadioGroupProvider>
    )
  }
)

export interface RadioGroupProps extends HiBaseHTMLFieldProps<'div'>, UseRadioGroupProps {
  /**
   *   指定可选项
   */
  data?: RadioDataItem[]
  /**
   * 单选按钮展示类型
   */
  type?: RadioGroupTypeEnum
  /**
   * 设置水平或垂直展示
   */
  placement?: RadioGroupPlacementEnum
}

if (__DEV__) {
  RadioGroup.displayName = 'RadioGroup'
}
