import React from 'react'
import { NumberRange } from '@hi-ui/number-range'
import type { NumberRangeProps } from '@hi-ui/number-range'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'

export type ProNumberRangeProps = NumberRangeProps & {
  // 扩展预留
}

export class ProNumberRange extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProNumberRangeProps>) {
    const fieldProps = this.getFieldProps({}, ctx)
    return <NumberRange {...fieldProps} />
  }
}
