import React from 'react'
import Textarea, { type TextAreaProps } from '@hi-ui/textarea'
import { ProField } from '../../../base'
import type { ProFieldRenderFormItemCtx } from '../../../base'

export type ProTextAreaProps = TextAreaProps & {
  // ProTextAreaProps
}

export class ProTextArea extends ProField {
  renderFormItem(_: null, ctx: ProFieldRenderFormItemCtx<ProTextAreaProps>) {
    const fieldProps = this.getFieldProps({}, ctx)
    return <Textarea {...fieldProps} />
  }
}
