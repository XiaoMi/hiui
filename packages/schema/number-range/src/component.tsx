import React from 'react'
import { isNil } from 'lodash-es'
import { cx } from '@hi-ui/classname'
import { useControllableValue } from 'ahooks'
import Space, { type SpaceProps } from '@hi-ui/space'
import NumberInput, { type NumberInputProps } from '@hi-ui/number-input'
import { NumberUtil } from '@hi-ui/schema-utils'
import type { StandardProps } from 'ahooks/es/useControllableValue'

export type NumberRangeStateType = [min?: number, max?: number]

type ExtendedNumberInputProps = NumberInputProps & {
  /**
   * 数字变化的精度
   * @desc 内部使用 HiUI 的 formatter 方法实现四舍五入精度处理
   */
  precision?: number
}

export type NumberRangeProps = Partial<StandardProps<NumberRangeStateType>> & {
  /** 最小值 */
  min?: NumberInputProps['min']
  /** 最大值 */
  max?: NumberInputProps['max']
  /** 步长 */
  step?: NumberInputProps['step']
  /** 数字变化的精度 */
  precision?: ExtendedNumberInputProps['precision']
  /** 分隔符 */
  separator?: SpaceProps['separator']
  /** 输入框大小 */
  size?: NumberInputProps['size']
  /** 是否禁用 */
  disabled?: NumberInputProps['disabled']
  /** 最小值输入框的属性 */
  minProps?: ExtendedNumberInputProps
  /** 最大值输入框的属性 */
  maxProps?: ExtendedNumberInputProps
  /** 自定义类名 */
  className?: string
  /** 自定义样式 */
  style?: React.CSSProperties
}

export function NumberRange(props: NumberRangeProps) {
  const {
    disabled = false,
    min,
    max,
    step = 1,
    precision,
    separator = '~',
    size = 'md',
    minProps,
    maxProps,
    style,
    ...rest
  } = props

  const [values = [], setValues] = useControllableValue<NumberRangeStateType>(rest)
  const [minValue, maxValue] = values

  const handleMinChange = (value: number | null) => {
    const newValue = value === null ? undefined : value
    if (newValue === undefined || maxValue === undefined) {
      setValues([newValue, maxValue])
      return
    }
    // 确保 min <= max
    setValues([newValue, Math.max(newValue, maxValue)])
  }

  const handleMaxChange = (value: number | null) => {
    const newValue = value === null ? undefined : value
    if (newValue === undefined || minValue === undefined) {
      setValues([minValue, newValue])
      return
    }
    // 确保 max >= min
    setValues([Math.min(minValue, newValue), newValue])
  }

  const className = cx(
    {
      'number-range': true,
    },
    props.className
  )

  // 处理精度
  const getNumberInputProps = (customProps?: ExtendedNumberInputProps): NumberInputProps => {
    const { precision: customPrecision, ...restProps } = customProps || {}
    const baseProps = {
      min,
      max,
      step,
      size,
      disabled,
      placeholder: '请输入',
      ...restProps,
    }

    // 优先使用自定义精度，其次使用通用精度
    const finalPrecision = customPrecision ?? precision

    // 如果设置了精度且没有自定义 formatter，则使用精度处理
    if (!isNil(finalPrecision) && isNil(baseProps.formatter)) {
      baseProps.formatter = (value: string | number) => NumberUtil.round(value, finalPrecision)
    }

    return baseProps
  }

  return (
    <div className={className} style={style}>
      <Space separator={separator} style={{ flexWrap: 'nowrap' }}>
        <NumberInput
          {...getNumberInputProps(minProps)}
          value={minValue ?? null}
          onChange={handleMinChange}
        />
        <NumberInput
          {...getNumberInputProps(maxProps)}
          value={maxValue ?? null}
          onChange={handleMaxChange}
        />
      </Space>
    </div>
  )
}
