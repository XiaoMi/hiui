import React from 'react'
import { cx } from '@hi-ui/classname'
import TimePicker, { type TimePickerProps } from '@hi-ui/time-picker'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'
import './index.scss'

export type ProTimePickerProps = TimePickerProps & {
  // ProTimePickerProps
}

export class ProTimePicker extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProTimePickerProps>) {
    const fieldProps = this.getFieldProps({}, ctx)
    const className = cx('pro-time-picker', fieldProps.className)

    return <TimePicker {...fieldProps} className={className} />
  }
}
