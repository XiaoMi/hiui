import React from 'react'
import { omit } from 'lodash-es'
import { Input, type InputProps } from '@hi-ui/input'
import { mapToDumb } from '@hi-ui/dumb-wrapper'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx, ProFieldProps, ProFieldRenderCtx } from '../../../base'

export const DumbInput: (
  props: InputProps & React.RefAttributes<HTMLInputElement | null>
) => React.ReactElement = mapToDumb(Input, {
  getChangedValue: (evt, value) => value,
})

export type ProTextProps = ProFieldProps &
  InputProps & {
    /** 使用 HiUI 原始 Input 组件 */
    useRawInput?: boolean
  }

export class ProText extends ProField {
  render(data: string, ctx: ProFieldRenderCtx<ProTextProps>) {
    if (!data) return this.dftDom

    if (typeof data === 'string') {
      return this.renderString(data, ctx)
    }

    try {
      return this.renderString(String(data), ctx)
    } catch (error) {
      return this.dftDom
    }
  }

  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProTextProps>) {
    const fieldProps = this.getFieldProps(
      {
        placeholder: this.getDftPlaceholder(ctx),
      },
      ctx
    )
    const pureInputProps = omit(fieldProps, ['numberOfLines', 'tooltipClassName', 'useRawInput'])

    return fieldProps.useRawInput ? (
      <Input {...pureInputProps} />
    ) : (
      <DumbInput {...pureInputProps} />
    )
  }
}
