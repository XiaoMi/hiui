import React from 'react'
import Counter, { type CounterProps } from '@hi-ui/counter'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'

export type ProCounterProps = CounterProps & {
  // ProCounterProps
}

export class ProCounter extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProCounterProps>) {
    const fieldProps = this.getFieldProps({}, ctx)
    return <Counter {...fieldProps} />
  }
}
