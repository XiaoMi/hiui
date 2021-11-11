import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { TimePickerFormat, TimePickerPanel, TimePickerType } from './@types'

const _role = 'time-picker'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is TimePicker
 */
export const TimePicker = forwardRef<HTMLDivElement | null, TimePickerProps>(
  ({ prefixCls = _prefix, role = _role, className, children, ...rest }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls}>
        {children}
      </div>
    )
  }
)

export interface TimePickerProps extends Omit<HiBaseHTMLProps<'div'>, 'placeholder'> {
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
   * 小时选项间隔
   * @default 1
   */
  hourStep?: number
  /**
   * 分钟选项间隔
   * @default 1
   */
  minuteStep?: number
  /**
   * 秒选项间隔
   * @default 1
   */
  secondStep?: number
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
   * 禁止选择的小时
   * @default () => []
   */
  disabledHours?: (panel: TimePickerPanel) => number[]
  /**
   * 禁止选择的分钟
   * @default () => []
   */
  disabledMinutes?: (hour: number, panel: TimePickerPanel) => number[]
  /**
   * 禁止选择的秒数
   * @default () => []
   */
  disabledSeconds?: (hour: number, minute: number, panel: TimePickerPanel) => number[]
}

if (__DEV__) {
  TimePicker.displayName = 'TimePicker'
}
