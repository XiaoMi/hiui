import React from 'react'
import Radio, { type RadioGroupProps } from '@hi-ui/radio'
import { InterruptInjector } from '@hi-ui/interrupt-injector'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'

export type ProRadioProps = RadioGroupProps & {
  // ProRadioProps
}

export class ProRadio extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProRadioProps>) {
    const fieldProps = this.getFieldProps({}, ctx)
    return (
      <InterruptInjector config={ctx.field.control?.interrupt}>
        <Radio.Group {...fieldProps} />
      </InterruptInjector>
    )
  }
}
