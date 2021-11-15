import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { TimePickerFilter, TimePickerStep, TimePickerType, TimePickerFormat } from './@types'
import { Input } from './Input'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { Popper } from '@hi-ui/popper'
import { Panel } from './Panel'

const _role = 'time-picker'
const _prefix = getPrefixCls(_role)

const DefaultValue = ['', '']
const DefaultDisabledFunc = () => []
const DefaultPlaceholder = ['', '']
/**
 * TODO: What is TimePicker
 */
export const TimePicker = forwardRef<HTMLDivElement | null, TimePickerProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      value: controlledValue,
      itemHeight = 32,
      fullDisplayItemNumber = 32,
      hourStep = 1,
      minuteStep = 1,
      secondStep = 1,
      format = 'HH:mm:ss',
      type = 'single',
      defaultValue: uncontrolledValue = DefaultValue,
      disabled = false,
      disabledHours = DefaultDisabledFunc,
      disabledSeconds = DefaultDisabledFunc,
      disabledMinutes = DefaultDisabledFunc,
      bordered = true,
      onChange: notifyOutside,
      placeholder = DefaultPlaceholder,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)
    const [value, onChange] = useUncontrolledState<string[]>(
      uncontrolledValue,
      controlledValue,
      notifyOutside
    )
    return (
      <div ref={ref} role={role} className={cls}>
        <Input
          type={type}
          placeholders={placeholder}
          prefix={prefixCls}
          format={format}
          hourStep={hourStep}
          secondStep={secondStep}
          minuteStep={minuteStep}
          border={bordered}
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          value={value}
          onChange={onChange}
        />
      </div>
    )
  }
)

type ExtendType = Omit<HiBaseHTMLProps<'div'>, 'placeholder' | 'value' | 'onChange'> &
  TimePickerFilter &
  TimePickerStep
export interface TimePickerProps extends ExtendType {
  /**
   * 选择器类型
   * @default 'single'
   */
  type?: TimePickerType
  /**
   * 选择器格式
   * @default 'HH:mm:ss'
   */
  format?: TimePickerFormat
  /**
   * 当前值（type='single'取数组第一个值，type='range'取数组第一个作为开始，第二个作为结束）
   */
  value?: string[]
  /**
   * 默认值
   */
  defaultValue?: string[]
  /**
   * 输入框是否不可编辑
   * @default false
   */
  inputReadonly?: boolean
  /**
   * 是否有边框
   * @default true
   */
  bordered?: boolean
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean
  /**
   * 输入框占位符
   */
  placeholder?: string[]
  /**
   * 选择器高
   * @default 32
   */
  itemHeight: number
  /**
   * 完全展示item的数目，必须为奇数
   * @default 7
   */
  fullDisplayItemNumber: number

  onChange?: (value: string[]) => void
}

if (__DEV__) {
  TimePicker.displayName = 'TimePicker'
}
