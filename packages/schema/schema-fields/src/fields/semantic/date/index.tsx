import React from 'react'
import { isNil } from 'lodash-es'
import dayjs, { Dayjs } from 'dayjs'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import { DatePicker, type DatePickerProps } from '@hi-ui/date-picker'
import { CalendarOutlined } from '@hi-ui/icons'
import { getPrefixStyleVar } from '@hi-ui/classname'
import { ProField } from '../../../base'
import { Span } from '../../../components/span'
import type {
  ProFieldRenderFormItemCtx,
  ProFieldRenderCtx,
  ProFieldRenderEditableCtx,
} from '../../../base'

export type ProDateProps = Omit<DatePickerProps, 'format'> & {
  format?: string | ((date: Dayjs) => string)
}

const defaultFormat = 'YYYY-MM-DD HH:mm:ss'

export class ProDate extends ProField {
  dftFieldProps: ProDateProps = {
    format: defaultFormat,
  }

  render(data: string, ctx: ProFieldRenderCtx<ProDateProps>) {
    if (!data) return this.dftDom

    const date = dayjs(data)
    const fieldProps = this.getFieldProps(this.dftFieldProps, ctx)

    const formatted = this.getFormattedText(date, fieldProps)

    // 无效日期展示 -
    if (formatted === 'Invalid Date') return this.dftDom

    return (
      <Span>
        <EllipsisTooltip>{formatted}</EllipsisTooltip>
      </Span>
    )
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProDateProps>) {
    const fieldProps = this.getFieldProps(
      {
        ...this.dftFieldProps,
        overlay: ctx.field.extra?.popperProps,
      },
      ctx
    )
    return <DatePicker {...(fieldProps as DatePickerProps)} />
  }

  protected getFormattedText(date: Dayjs, fieldProps: ProDateProps) {
    const formatted =
      typeof fieldProps.format === 'function'
        ? fieldProps.format(date)
        : date.format(fieldProps.format || defaultFormat)

    return formatted
  }

  protected getEditablePlaceholder(
    data: string | number | Date,
    ctx: ProFieldRenderEditableCtx<ProDateProps>
  ) {
    if (isNil(data)) return ''
    const fieldProps = this.getFieldProps(this.dftFieldProps, ctx)
    return this.getFormattedText(dayjs(data), fieldProps)
  }

  renderEditable(data: string, ctx: ProFieldRenderEditableCtx<ProDateProps>) {
    return super.renderEditable(data, ctx, {
      suffix: (
        <CalendarOutlined
          size={16}
          color={`var(${getPrefixStyleVar('color-gray-500')}, #929aa6)`}
        />
      ),
    })
  }
}
